import ast

from .ast import (Module, FunctionDefinition, FunctionCall, Block, Name, Num,
                  Assign, AugAssign, For, If, Compare, Return, Pass, Expr,
                  List, BinOp, UnaryOp, Attribute, NameConstant, Subscript,
                  Index, ClassDefinition)
from .operators import (Add, Sub, Mul, Div, FloorDiv,
                        Not, Eq, NotEq, Is, IsNot, Lt, LtE, Gt, GtE, In, NotIn)


class TransformInfo(object):

    def __init__(self):
        self.stack = []

    def push_class_context(self, cls_node):
        self.stack.append(cls_node)

    def push_function_context(self, func_node):
        self.stack.append(func_node)

    def push_module_context(self, module_node):
        self.stack.append(module_node)

    def pop_context(self):
        return self.stack.pop()

    def get_scope_node(self):
        return self.stack[-1]


def transform_block(block, info, parent_node=None):
    return Block(
        [transform(node, info) for node in block],
        parent_node,
    )


def transform_module(node, info):
    new_node = Module(body=None)
    info.push_module_context(new_node)
    new_node.body = transform_block(node.body, info, new_node)
    info.pop_context()
    return new_node


def transform_funcdef(node, info):
    new_node = FunctionDefinition(
        name=node.name,
        body=None,
    )
    scope_node = info.get_scope_node()
    scope_node.add_variable_info(node.name)

    info.push_function_context(new_node)

    new_node.body = transform_block(node.body, info, new_node)
    args = node.args.args
    defaults = node.args.defaults
    defaults = [None] * (len(args) - len(defaults)) + defaults
    for a, d in zip(args, defaults):
        new_node.add_argument_info(a.arg, transform(a.annotation, info),
                                   transform(d, info))
    if node.args.vararg:
        new_node.set_var_argument_info(node.args.vararg)
    if node.args.kwarg:
        new_node.set_kw_argument_info(node.args.kwarg)

    info.pop_context()

    return new_node


def transform_call(node, info):
    return FunctionCall(
        function=transform(node.func, info),
        argument_values=[transform(a, info) for a in node.args],
        argument_items=[(kw.arg, transform(kw.value, info))
                        for kw in node.keywords],
        kw_argument_value=None,
        var_argument_value=None,
    )


def transform_list(node, info):
    return List(
        elements=[transform(e, info) for e in node.elts]
    )


def transform_name(node, info):
    return Name(id=node.id)


def transform_num(node, info):
    return Num(n=node.n)


def transform_assign(node, info):
    targets = [transform(t, info) for t in node.targets]
    scope_node = info.get_scope_node()
    for t in targets:
        if isinstance(t, Name):
            scope_node.add_variable_info(t.id)
    return Assign(
        targets=targets,
        value=transform(node.value, info),
    )


def transform_aug_assign(node, info):
    return AugAssign(
        target=transform(node.target, info),
        op=transform(node.op, info),
        value=transform(node.value, info),
    )


def transform_for(node, info):
    scope_node = info.get_scope_node()

    target = transform(node.target, info)
    iter_node = transform(node.iter, info)

    scope_node.add_variable_info(target.id)
    scope_node.add_variable_info('${}_iter'.format(target.id))

    return For(
        target=target,
        iter=iter_node,
        body=transform_block(node.body, info),
        orelse=transform_block(node.orelse, info),
    )


def transform_if(node, info):
    return If(
        test=transform(node.test, info),
        body=transform_block(node.body, info),
        orelse=transform_block(node.orelse, info),
    )


def transform_compare(node, info):
    return Compare(
        left=transform(node.left, info),
        comparisons=list(zip(
            [transform(op, info) for op in node.ops],
            [transform(cmp, info) for cmp in node.comparators],
        ))
    )


def transform_return(node, info):
    return Return(value=transform(node.value, info))


def transform_bin_op(node, info):
    return BinOp(
        left=transform(node.left, info),
        op=transform(node.op, info),
        right=transform(node.right, info),
    )


def transform_unary_op(node, info):
    return UnaryOp(
        op=transform(node.op, info),
        operand=transform(node.operand, info),
    )


def transform_attribute(node, info):
    return Attribute(
        value=transform(node.value, info),
        attr=node.attr
    )


def transform_expr(node, info):
    return Expr(
        value=transform(node.value, info)
    )


def transform_nameconstant(node, info):
    return NameConstant(value=node.value)


def transform_subscript(node, info):
    return Subscript(
        value=transform(node.value, info),
        key=transform(node.slice, info),
    )


def transform_index(node, info):
    return Index(
        value=transform(node.value, info),
    )


def transform_classdef(node, info):
    assert not node.decorator_list
    assert not node.keywords
    assert getattr(node, 'starargs', None) is None
    assert getattr(node, 'kwargs', None) is None

    new_node = ClassDefinition(
        name=node.name,
        bases=[transform(bn, info) for bn in node.bases],
        body=None,
    )
    scope_node = info.get_scope_node()
    scope_node.add_variable_info(node.name)

    info.push_function_context(new_node)

    new_node.body = transform_block(node.body, info, new_node)

    info.pop_context()

    return new_node


def get_operator_transform(operator_cls):
    def fun(node, info):
        return operator_cls()
    return fun


transform_add = get_operator_transform(Add)
transform_sub = get_operator_transform(Sub)
transform_mul = get_operator_transform(Mul)
transform_div = get_operator_transform(Div)
transform_floordiv = get_operator_transform(FloorDiv)
transform_pass = get_operator_transform(Pass)

transform_not = get_operator_transform(Not)
transform_eq = get_operator_transform(Eq)
transform_neq = get_operator_transform(NotEq)
transform_is = get_operator_transform(Is)
transform_is_not = get_operator_transform(IsNot)
transform_lt = get_operator_transform(Lt)
transform_lte = get_operator_transform(LtE)
transform_gt = get_operator_transform(Gt)
transform_gte = get_operator_transform(GtE)
transform_in = get_operator_transform(In)
transform_not_in = get_operator_transform(NotIn)


transform_map = {
    ast.Module: transform_module,
    ast.FunctionDef: transform_funcdef,
    ast.Name: transform_name,
    ast.Num: transform_num,
    ast.Assign: transform_assign,
    ast.AugAssign: transform_aug_assign,
    ast.For: transform_for,
    ast.If: transform_if,
    ast.Return: transform_return,
    ast.BinOp: transform_bin_op,
    ast.UnaryOp: transform_unary_op,
    ast.Add: transform_add,
    ast.Sub: transform_sub,
    ast.Mult: transform_mul,
    ast.Div: transform_div,
    ast.FloorDiv: transform_floordiv,
    ast.Not: transform_not,
    ast.Eq: transform_eq,
    ast.NotEq: transform_neq,
    ast.Is: transform_is,
    ast.IsNot: transform_is_not,
    ast.Lt: transform_lt,
    ast.LtE: transform_lte,
    ast.Gt: transform_gt,
    ast.GtE: transform_gte,
    ast.In: transform_in,
    ast.NotIn: transform_not_in,
    ast.Compare: transform_compare,
    ast.Pass: transform_pass,
    ast.Expr: transform_expr,
    ast.List: transform_list,
    ast.Call: transform_call,
    ast.Attribute: transform_attribute,
    ast.NameConstant: transform_nameconstant,
    ast.Subscript: transform_subscript,
    ast.Index: transform_index,
    ast.ClassDef: transform_classdef,
}


def transform(node, info):
    node_type = type(node)
    if node_type in transform_map:
        new_node = transform_map[node_type](node, info)
    elif node is None:
        new_node = None
    else:
        raise ValueError('unsupported node type {} with fields {}'.format(
            type(node).__name__,
            ', '.join(node._fields),
        ))

    return new_node


def parse(source):
    tree = ast.parse(source)
    info = TransformInfo()
    graph = transform(tree, info)
    return graph
