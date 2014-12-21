from .utils import transpile_join, yield_join
from .info import ArgumentInfo, VariableInfo


class AST(object):

    def has_after_semicolon(self):
        return True

    def get_builtin_methods(self):
        return ()

    def get_jsython_builtin_methods(self):
        return ()

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


class Module(ScopeAST):

    def __init__(self, body):
        super(Module, self).__init__()
        self.body = body

    def transpile(self, info):
        yield self.get_indent_str(info)
        yield '(function () '
        yield from self.body.transpile(info)
        yield ').call(this);\n'


class Block(AST):

    def __init__(self, statements, parent_node):
        self.statements = statements
        self.parent_node = parent_node

    def transpile(self, info, omit_first_brace=False):
        if not omit_first_brace:
            yield '{'
        info.inc_indent()

        variables = self.parent_node.variables if self.parent_node else []

        if variables:
            yield '\n'
            yield self.get_indent_str(info)
            yield 'var '
            yield ', '.join(v.name for v in variables)
            yield ';\n'

        for stmt in self.statements:
            stmt_str = ''.join(stmt.transpile(info))
            if not stmt_str:
                continue
            yield '\n'
            yield self.get_indent_str(info)
            yield stmt_str
            if stmt.has_after_semicolon():
                yield ';'
        yield '\n'
        info.dec_indent()
        yield self.get_indent_str(info)
        yield '}'


class FunctionDefinition(ScopeAST):

    def __init__(self, name, body):
        super(FunctionDefinition, self).__init__()
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


class List(AST):
    symbol = '__jsython__list__'

    def __init__(self, elements):
        self.elements = elements

    def transpile(self, info):
        # TODO: add list import
        yield self.symbol
        yield '('
        yield from transpile_join(', ', self.elements, info)
        yield ')'


class Num(AST):

    def __init__(self, n):
        self.n = n

    def transpile(self, info):
        yield '{}'.format(self.n)


class Name(AST):

    def __init__(self, id):
        self.id = id

    def transpile(self, info):
        yield self.id


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


class AugAssign(AST):

    def __init__(self, target, op, value):
        self.target = target
        self.op = op
        self.value = value

    def transpile(self, info):
        yield from self.op.transpile_aug_assign(self.target, self.value, info)


class For(AST):
    next_symbol = '__jsython__next__'
    iter_symbol = 'iter'

    def __init__(self, target, iter, body, orelse):
        self.target = target
        self.iter = iter
        self.body = body
        self.orelse = orelse

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
        yield self.iter.id
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


class If(AST):

    def __init__(self, test, body, orelse):
        self.test = test
        self.body = body
        self.orelse = orelse

    def has_after_semicolon(self):
        return False

    def transpile(self, info):
        yield 'if ('
        yield from self.test.transpile(info)
        yield ') '
        yield from self.body.transpile(info)
        if self.orelse:
            yield ' else '
            yield from self.orelse.transpile(info)


class Compare(AST):

    def __init__(self, left, comparisons):
        self.left = left
        self.comparisons = comparisons

    def transpile(self, info):
        def yielder(elem):
            op, right = elem
            yield from op.transpile_bin_op(self.left, right, info)
        yield from yield_join(' && ', self.comparisons, yielder)


class Return(AST):

    def __init__(self, value):
        self.value = value

    def transpile(self, info):
        yield 'return '
        yield from self.value.transpile(info)


class BinOp(AST):

    def __init__(self, left, op, right):
        self.left = left
        self.op = op
        self.right = right

    def transpile(self, info):
        yield from self.op.transpile_bin_op(self.left, self.right, info)


class Expr(AST):

    def __init__(self, value):
        self.value = value

    def transpile(self, info):
        yield '('
        yield from self.value.transpile(info)
        yield ')'


class Pass(AST):
    pass

    def has_after_semicolon(self):
        return False

    def transpile(self, info):
        yield ''
