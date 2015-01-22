(function (factory) {
    module.exports = factory(
        require('./type'),
        require('./str'),
        require('./exceptions'),
        require('./auxobjects')
    );
}).call(this, function (_type, _str, _exceptions, _auxobjects) {
    'use strict';

    var NotImplemented, TypeError, str_cons, type;
    var i, operators, operator_names, operator_symbols,
        js_type_name, add_bin_op, add_aug_assign_op;

    operator_names = ['add', 'sub', 'mul', 'truediv'];
    operator_symbols = ['+', '-', '*', '/'];
    NotImplemented = _auxobjects.NotImplemented;
    TypeError = _exceptions.TypeError;
    str_cons = _str.str_cons;
    type = _type.type;

    operators = {};

    js_type_name = function (x) {
        if (x instanceof object) {
            return type(x).__name__.__string__;
        } else {
            return '' + x;
        }
    };

    add_bin_op = function (operators, op_name, op_symbol) {
        var _op_name, _op_rname;

        _op_name = '__' + op_name + '__';
        _op_rname = '__r' + op_name + '__';

        operators[op_name] = function (a, b) {
            var exp;

            if (typeof a[_op_name] === 'function') {
                exp = a[_op_name](b);
                if (exp !== NotImplemented) {
                    return exp;
                }
            }
            if (typeof b[_op_rname] === 'function') {
                exp = b[_op_rname](a);
                if (exp !== NotImplemented) {
                    return exp;
                }
            }
            throw new TypeError(str_cons(
                'unsupported operand type(s) for ' + op_symbol +
                ' \'' + js_type_name(a) + '\' and \'' +
                js_type_name(b) + '\''));
        };

    };


    add_aug_assign_op = function (operators, op_name, op_symbol) {
        var op_iname, _op_iname, _op_name, _op_rname;

        op_iname = 'i' + op_name;
        _op_iname = '__' + op_iname + '__';
        _op_name = '__' + op_name + '__';
        _op_rname = '__r' + op_name + '__';

        operators[op_iname] = function (a, b) {
            var exp;

            if (typeof a[_op_iname] === 'function') {
                exp = a[_op_iname](b);
                if (exp !== NotImplemented) {
                    return exp;
                }
            }
            if (typeof a[_op_name] === 'function') {
                exp = a[_op_name](b);
                if (exp !== NotImplemented) {
                    return exp;
                }
            }
            if (typeof b[_op_rname] === 'function') {
                exp = b[_op_rname](a);
                if (exp !== NotImplemented) {
                    return exp;
                }
            }
            throw new TypeError(str_cons(
                'unsupported operand type(s) for ' + op_symbol +
                '= \'' + js_type_name(a) + '\' and \'' +
                js_type_name(b) + '\''));
        };

    };


    for (i = 0; i < operator_names.length; ++i) {
        add_bin_op(operators, operator_names[i], operator_symbols[i]);
        add_aug_assign_op(operators, operator_names[i], operator_symbols[i]);
    }

    return operators;
});
