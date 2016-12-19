from .utils import transpile_join


class Operator(object):

    def has_bool_result(self):
        return False


class UnaryOp(Operator):

    @property
    def unary_op_import(self):
        return '{}'.format(self.operator_method)

    @property
    def unary_op_symbol(self):
        return '$${}'.format(self.unary_op_import)

    def get_unary_op_builtin_imports_dict(self):
        return {self.unary_op_import: self.unary_op_symbol}

    def transpile_unary_op(self, operand, info):
        yield self.unary_op_symbol
        yield '('
        yield from operand.transpile(info)
        yield ')'


class Not(UnaryOp):
    operator_method = 'not'


class AbstractBinOp(Operator):

    @property
    def bin_op_import(self):
        return '{}'.format(self.operator_method)

    @property
    def bin_op_symbol(self):
        return '$${}'.format(self.bin_op_import)

    def get_bin_op_builtin_imports_dict(self):
        return {self.bin_op_import: self.bin_op_symbol}

    def transpile_bin_op(self, left, right, info):
        yield self.bin_op_symbol
        yield '('
        yield from transpile_join(', ', [left, right], info)
        yield ')'


class BinOp(AbstractBinOp):

    @property
    def aug_assign_import(self):
        return 'i{}'.format(self.operator_method)

    @property
    def aug_assign_symbol(self):
        return '$${}'.format(self.aug_assign_import)

    def get_aug_assign_builtin_imports_dict(self):
        return {self.aug_assign_import: self.aug_assign_symbol}

    def transpile_aug_assign(self, target, value, info):
        yield self.aug_assign_symbol
        yield '('
        yield from transpile_join(', ', [target, value], info)
        yield ')'


class BooleanOp(AbstractBinOp):

    def has_bool_result(self):
        return True


class Add(BinOp):
    operator_sign = '+'
    operator_method = 'add'


class Sub(BinOp):
    operator_sign = '-'
    operator_method = 'sub'


class Mul(BinOp):
    operator_sign = '*'
    operator_method = 'mul'


class Div(BinOp):
    operator_sign = '/'
    operator_method = 'truediv'


class FloorDiv(BinOp):
    operator_sign = '//'
    operator_method = 'floordiv'


class Eq(BooleanOp):
    operator_sign = '=='
    operator_method = 'eq'


class NotEq(BooleanOp):
    operator_sign = '!='
    operator_method = 'neq'


class Is(BooleanOp):
    operator_sign = 'is'
    operator_method = 'is'


class IsNot(BooleanOp):
    operator_sign = 'is not'
    operator_method = 'is_not'


class Lt(BooleanOp):
    operator_sign = '<'
    operator_method = 'lt'


class LtE(BooleanOp):
    operator_sign = '<='
    operator_method = 'lte'


class Gt(BooleanOp):
    operator_sign = '>'
    operator_method = 'gt'


class GtE(BooleanOp):
    operator_sign = '>='
    operator_method = 'gte'


class In(BooleanOp):
    operator_sign = 'in'
    operator_method = 'contains'


class NotIn(BooleanOp):
    operator_sign = 'not in'
    operator_method = 'not_contains'
