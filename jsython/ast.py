from .utils import transpile_join, yield_join
from .info import ArgumentInfo, VariableInfo


class AST(object):

    jsython_builtin_imports = ()

    def is_empty(self):
        return False

    def has_bool_result(self):
        return False

    def get_jsython_builtin_import_dict(self):
        return {import_str: self.convert_import_to_symbol(import_str)
                for import_str in self.jsython_builtin_imports}

    def convert_import_to_symbol(self, import_str):
        return '$${}'.format(import_str)

    def has_after_semicolon(self):
        return True

    def get_indent_str(self, transpile_info):
        return ' ' * transpile_info.indent

    def transpile(self, info):
        raise NotImplementedError(
            'transpile method for {} is not defined'.format(
                type(self).__name__
            )
        )


class ScopeAST(AST):
    def __init__(self):
        self.variables = []

    def add_variable_info(self, name, annotation=None):
        variable_names = set(v.name for v in self.variables)
        if name not in variable_names:
            self.variables.append(VariableInfo(name, annotation))


class AssignableAST(AST):
    pass


class Module(ScopeAST):

    def __init__(self, body):
        super().__init__()
        self.body = body

    def transpile(self, info):
        yield self.get_indent_str(info)
        yield '(function (factory) {\n'
        info.inc_indent()
        yield self.get_indent_str(info)
        yield 'module.exports = factory(require(\'jsython\'));\n'
        info.dec_indent()
        yield self.get_indent_str(info)
        yield '}).call(this, '
        yield from self.transpile_factory(info)
        yield ');\n'

    def transpile_factory(self, info):
        yield 'function ('
        if self.get_jsython_builtin_import_dict():
            yield '$$jsython'
        yield ') '
        yield from self.body.transpile(info)

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        imports_dict.update(self.body.get_jsython_builtin_import_dict())
        return imports_dict


class Block(AST):

    def __init__(self, statements, parent_node):
        self.statements = statements
        self.parent_node = parent_node

    def is_empty(self):
        return not bool(self.statements)

    def transpile(self, info, omit_first_brace=False):
        module_block = isinstance(self.parent_node, Module)
        if not omit_first_brace:
            yield '{'
        info.inc_indent()

        exports = self.parent_node.variables if self.parent_node else []
        variables = exports[:]

        if module_block:
            yield '\n'
            yield self.get_indent_str(info)
            yield '\'use strict\';\n'

            imports_dict = self.get_jsython_builtin_import_dict()
            variables += [VariableInfo(k, None) for k in imports_dict.values()]

        variables = sorted(variables, key=lambda v: v.name)

        if variables:
            yield '\n'
            yield self.get_indent_str(info)
            yield 'var '
            yield ', '.join(v.name for v in variables)
            yield ';\n'

        if module_block:
            for k, v in sorted(imports_dict.items(), key=lambda item: item[1]):
                yield '\n'
                yield self.get_indent_str(info)
                yield v
                yield ' = '
                yield '$$jsython.'
                yield k
                yield ';'
            yield '\n'

        for stmt in self.statements:
            stmt_str = ''.join(stmt.transpile(info))
            if not stmt_str:
                continue
            if isinstance(stmt, FunctionDefinition):
                yield '\n'
            yield '\n'
            yield self.get_indent_str(info)
            yield stmt_str
            if stmt.has_after_semicolon():
                yield ';'
        yield '\n'

        if module_block:
            yield '\n'
            yield self.get_indent_str(info)
            yield 'return {'
            info.inc_indent()
            for export_var in exports:
                yield '\n'
                yield self.get_indent_str(info)
                yield export_var.name
                yield ': '
                yield export_var.name
                yield ','
            yield '\n'
            info.dec_indent()
            yield self.get_indent_str(info)
            yield '};\n'

        info.dec_indent()
        yield self.get_indent_str(info)
        yield '}'

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        for stmt in self.statements:
            imports_dict.update(stmt.get_jsython_builtin_import_dict())
        return imports_dict


class FunctionDefinition(ScopeAST):

    def __init__(self, name, body):
        super().__init__()
        self.name = name
        self.body = body
        self.arguments = []
        self.var_argument = None
        self.kw_argument = None

    def add_argument_info(self, name, annotation=None, default=None):
        self.arguments.append(ArgumentInfo(name, annotation, default))

    def set_var_argument_info(self, name, annotation=None):
        self.var_argument = ArgumentInfo(name, annotation)

    def set_kw_argument_info(self, name, annotation=None):
        self.kw_argument = ArgumentInfo(name, annotation)

    def transpile(self, info):
        args_str = ', '.join(arg.name for arg in self.arguments)
        yield '{} = function ({}) '.format(self.name, args_str)
        yield from self.body.transpile(info)
        # TODO: arginfo

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        imports_dict.update(self.body.get_jsython_builtin_import_dict())
        return imports_dict


class FunctionCall(AST):

    def __init__(self, function, argument_values, argument_items,
                 var_argument_value, kw_argument_value):
        self.function = function
        self.argument_values = argument_values
        self.argument_items = argument_items
        self.var_argument_value = var_argument_value
        self.kw_argument_value = kw_argument_value

    def transpile(self, info):
        if self.var_argument_value:
            raise NotImplementedError('var_argument_value not supported')
        if self.kw_argument_value:
            raise NotImplementedError('kw_argument_value not supported')
        if self.argument_items:
            raise NotImplementedError('argument_items not supported')

        yield from self.function.transpile(info)
        yield '('
        yield from transpile_join(', ', self.argument_values, info)
        yield ')'

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        imports_dict.update(self.function.get_jsython_builtin_import_dict())
        for arg_val in self.argument_values:
            imports_dict.update(arg_val.get_jsython_builtin_import_dict())
        return imports_dict


class List(AST):
    list_cons_import = 'list_cons'
    jsython_builtin_imports = (list_cons_import,)

    def __init__(self, elements):
        self.elements = elements

    def transpile(self, info):
        yield self.convert_import_to_symbol(self.list_cons_import)
        yield '(['
        yield from transpile_join(', ', self.elements, info)
        yield '])'

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        for elem in self.elements:
            imports_dict.update(elem.get_jsython_builtin_import_dict())
        return imports_dict


class Num(AST):
    int_cons_import = 'int_cons'
    jsython_builtin_imports = (int_cons_import,)

    def __init__(self, n):
        if not isinstance(n, int):
            ValueError('type {} is unsupported in Num'.format(type(n)))
        self.n = n

    def transpile(self, info):
        if isinstance(self.n, int):
            yield self.convert_import_to_symbol(self.int_cons_import)
            yield '('
            yield '{}'.format(self.n)
            yield ')'


class Name(AST):

    builtin_functions = (
        'object', 'type', 'str', 'int', 'bool',  'list',
        'NotImplemented',
        'BaseException', 'Exception',
        'ValueError', 'TypeError', 'AttributeError', 'StopIteration',
        'print',
        'len',
        'dir',
        'iter', 'next',
        'getattr', 'setattr', 'hasattr', 'delattr',
    )

    def __init__(self, id):
        self.id = id

    def transpile(self, info):
        yield self.id

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        if self.id in self.builtin_functions:
            imports_dict[self.id] = self.id
        return imports_dict


class Assign(AST):

    def __init__(self, targets, value):
        self.targets = targets
        self.value = value

    def transpile(self, info):
        if len(self.targets) != 1:
            raise NotImplementedError(
                'Multiple assignment targets not supported')
        yield from self.targets[0].transpile(info)
        yield ' = '
        yield from self.value.transpile(info)

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        for target in self.targets:
            imports_dict.update(target.get_jsython_builtin_import_dict())
        imports_dict.update(self.value.get_jsython_builtin_import_dict())
        return imports_dict


class AugAssign(AST):

    def __init__(self, target, op, value):
        self.target = target
        self.op = op
        self.value = value

    def transpile(self, info):
        yield from self.op.transpile_aug_assign(self.target, self.value, info)

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        imports_dict.update(self.op.get_aug_assign_builtin_imports_dict())
        for node in [self.target, self.value]:
            imports_dict.update(node.get_jsython_builtin_import_dict())
        return imports_dict


class For(AST):
    next_import = 'next_or_undef'
    iter_import = 'iter'
    jsython_builtin_imports = (next_import, iter_import)

    def __init__(self, target, iter, body, orelse):
        self.target = target
        self.iter = iter
        self.body = body
        self.orelse = orelse

    @property
    def next_symbol(self):
        return self.convert_import_to_symbol(self.next_import)

    @property
    def iter_symbol(self):
        return self.convert_import_to_symbol(self.iter_import)

    @property
    def iterator_symbol(self):
        return '${}_iter'.format(self.target.id)

    def has_after_semicolon(self):
        return False

    def transpile_start_statement(self, info):
        iterator_symbol = self.iterator_symbol
        target_symbol = self.target.id
        next_symbol = self.next_symbol
        yield iterator_symbol
        yield ' = '
        yield self.iter_symbol
        yield '('
        yield from self.iter.transpile(info)
        yield '), '
        yield target_symbol
        yield ' = '
        yield next_symbol
        yield '('
        yield iterator_symbol
        yield ')'

    def transpile_test_condition(self, info):
        target_symbol = self.target.id
        yield target_symbol
        yield ' !== undefined'

    def transpile_update_statement(self, info):
        iterator_symbol = self.iterator_symbol
        target_symbol = self.target.id
        next_symbol = self.next_symbol
        yield target_symbol
        yield ' = '
        yield next_symbol
        yield '('
        yield iterator_symbol
        yield ')'

    def transpile(self, info):
        yield 'for ('
        yield from self.transpile_start_statement(info)
        yield '; '
        yield from self.transpile_test_condition(info)
        yield '; '
        yield from self.transpile_update_statement(info)
        yield ') '
        yield from self.body.transpile(info)

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        imports_dict.update(self.body.get_jsython_builtin_import_dict())
        return imports_dict


class If(AST):

    bool_import = 'bool'

    jsython_builtin_imports = (bool_import,)

    @property
    def bool_symbol(self):
        return self.convert_import_to_symbol(self.bool_import)

    def __init__(self, test, body, orelse):
        self.test = test
        self.body = body
        self.orelse = orelse

    def has_after_semicolon(self):
        return False

    def transpile(self, info):
        yield 'if ('
        cast_to_bool = not self.test.has_bool_result()
        if cast_to_bool:
            yield self.bool_symbol
            yield '('
        yield from self.test.transpile(info)
        if cast_to_bool:
            yield ')'
        yield '.__boolean__) '
        yield from self.body.transpile(info)
        if self.orelse and not self.orelse.is_empty():
            yield ' else '
            yield from self.orelse.transpile(info)

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        for node in [self.test, self.body, self.orelse]:
            imports_dict.update(node.get_jsython_builtin_import_dict())
        return imports_dict


class Compare(AST):

    def __init__(self, left, comparisons):
        self.left = left
        self.comparisons = comparisons

    def transpile(self, info):
        def yielder(elem):
            op, right = elem
            yield from op.transpile_bin_op(self.left, right, info)
        yield from yield_join(' && ', self.comparisons, yielder)

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        imports_dict.update(self.left.get_jsython_builtin_import_dict())
        for op, right in self.comparisons:
            imports_dict.update(op.get_bin_op_builtin_imports_dict())
            imports_dict.update(right.get_jsython_builtin_import_dict())
        return imports_dict

    def has_bool_result(self):
        return all((op.has_bool_result() for op, _ in self.comparisons))


class Return(AST):

    def __init__(self, value):
        self.value = value

    def transpile(self, info):
        yield 'return '
        yield from self.value.transpile(info)

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        imports_dict.update(self.value.get_jsython_builtin_import_dict())
        return imports_dict


class BinOp(AST):

    def __init__(self, left, op, right):
        self.left = left
        self.op = op
        self.right = right

    def transpile(self, info):
        yield from self.op.transpile_bin_op(self.left, self.right, info)

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        for node in [self.left, self.right]:
            imports_dict.update(node.get_jsython_builtin_import_dict())
        imports_dict.update(self.op.get_bin_op_builtin_imports_dict())
        return imports_dict

    def has_bool_result(self):
        return self.op.has_bool_result()


class UnaryOp(AST):

    def __init__(self, op, operand):
        self.op = op
        self.operand = operand

    def transpile(self, info):
        yield from self.op.transpile_unary_op(self.operand, info)

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        imports_dict.update(self.operand.get_jsython_builtin_import_dict())
        imports_dict.update(self.op.get_unary_op_builtin_imports_dict())
        return imports_dict

    def has_bool_result(self):
        return self.op.has_bool_result()


class Expr(AST):

    def __init__(self, value):
        self.value = value

    def transpile(self, info):
        yield '('
        yield from self.value.transpile(info)
        yield ')'

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        imports_dict.update(self.value.get_jsython_builtin_import_dict())
        return imports_dict

    def has_bool_result(self):
        return self.value.has_bool_result()


class Attribute(AssignableAST):
    getattr_import = 'getattr'
    setattr_import = 'setattr'
    str_cons_import = 'str_cons'
    jsython_builtin_imports = (getattr_import, setattr_import, str_cons_import)

    @property
    def getattr_symbol(self):
        return self.convert_import_to_symbol(self.getattr_import)

    @property
    def setattr_symbol(self):
        return self.convert_import_to_symbol(self.setattr_import)

    @property
    def str_cons_symbol(self):
        return self.convert_import_to_symbol(self.str_cons_import)

    def __init__(self, value, attr):
        self.value = value
        self.attr = attr

    def transpile(self, info):
        yield self.getattr_symbol
        yield '('
        yield from self.value.transpile(info)
        yield ', '
        yield self.str_cons_symbol
        yield '(\''
        yield from self.attr
        yield '\'))'

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        imports_dict.update(self.value.get_jsython_builtin_import_dict())
        return imports_dict


class Pass(AST):

    def has_after_semicolon(self):
        return False

    def transpile(self, info):
        yield ''


class NameConstant(AST):
    def __init__(self, value):
        self.value = value

    def transform(self, value):
        if value is None:
            return 'None'
        elif value is True:
            return 'True'
        elif value is False:
            return 'False'
        else:
            return repr(value)

    def transpile(self, info):
        yield self.transform(self.value)

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        value_repr = self.transform(self.value)
        imports_dict.update({value_repr: value_repr})
        return imports_dict


class Subscript(AssignableAST):

    getitem_import = 'getitem'
    setitem_import = 'setitem'
    jsython_builtin_imports = (getitem_import, setitem_import)

    @property
    def getitem_symbol(self):
        return self.convert_import_to_symbol(self.getitem_import)

    def __init__(self, value, key):
        self.value = value
        self.key = key

    def transpile(self, info):
        yield self.getitem_symbol
        yield '('
        yield from self.value.transpile(info)
        yield ', '
        yield from self.key.transpile(info)
        yield ')'

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        imports_dict.update(self.value.get_jsython_builtin_import_dict())
        imports_dict.update(self.key.get_jsython_builtin_import_dict())
        return imports_dict


class Index(AST):

    def __init__(self, value):
        self.value = value

    def transpile(self, info):
        yield from self.value.transpile(info)

    def get_jsython_builtin_import_dict(self):
        imports_dict = super().get_jsython_builtin_import_dict()
        imports_dict.update(self.value.get_jsython_builtin_import_dict())
        return imports_dict
