from .utils import transpile_join


class Operator(object):
    pass


class DirectOperator(Operator):

    @property
    def bin_op_import(self):
        return '{}'.format(self.operator_method)

    @property
    def aug_assign_import(self):
        return 'i{}'.format(self.operator_method)

    @property
    def bin_op_symbol(self):
        return '$${}'.format(self.bin_op_import)

    @property
    def aug_assign_symbol(self):
        return '$${}'.format(self.aug_assign_import)

    def get_bin_op_builtin_imports_dict(self):
        return {self.bin_op_import: self.bin_op_symbol}

    def get_aug_assign_builtin_imports_dict(self):
        return {self.aug_assign_import: self.aug_assign_symbol}

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
