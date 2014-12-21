from .utils import transpile_join


class Operator(object):
    pass


class DirectOperator(Operator):

    @property
    def bin_op_symbol(self):
        return '__jsython__{}__'.format(self.operator_method)

    @property
    def aug_assign_symbol(self):
        return '__jsython__i{}__'.format(self.operator_method)

    def transpile_bin_op(self, left, right, info):
        yield self.bin_op_symbol
        yield '('
        yield from transpile_join(', ', [left, right], info)
        yield ')'

    def transpile_aug_assign(self, target, value, info):
        yield self.aug_assign_symbol
        yield '('
        yield from transpile_join(', ', [target, value], info)
        yield ')'


class Add(DirectOperator):
    operator_sign = '+'
    operator_method = 'add'


class Mul(DirectOperator):
    operator_sign = '*'
    operator_method = 'mul'


class LtE(DirectOperator):
    operator_sign = '<='
    operator_method = 'lte'
