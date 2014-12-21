class TranspileInfo(object):

    def __init__(self, indent_level=0):
        self.indent_units = 4
        self.indent_level = indent_level

    def inc_indent(self):
        self.indent_level += 1

    def dec_indent(self):
        if self.indent_level <= 0:
            raise ValueError('indent already is 0')
        self.indent_level -= 1

    @property
    def indent(self):
        return self.indent_level * self.indent_units


class BaseVariableInfo(object):

    def __init__(self, name, annotation):
        self.name = name
        self.annotation = annotation


class VariableInfo(BaseVariableInfo):

    def __init__(self, name, annotation):
        super(VariableInfo, self).__init__(name, annotation)
        self.value_nodes = []

    def add_value_node(self, value_node):
        self.value_nodes.append(value_node)


class ArgumentInfo(BaseVariableInfo):

    def __init__(self, name, annotation, default=None):
        super(ArgumentInfo, self).__init__(name, annotation)
        self.default = default
