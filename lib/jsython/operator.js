(function (factory) {
    module.exports = factory();
}).call(this, function () {
    'use strict';

    var i, operators, operator_names;

    operator_names = ['add', 'sub', 'mul', 'div'];

    operators = {};

    for (i = 0; i < operator_names.length; ++i) {
        (function () {
            var op_name = operator_names[i];
            var _op_name = '__' + op_name + '__';
            var _op_rname = '__r' + op_name + '__';
            operators[op_name] = function (a, b) {
                if (a[_op_name]) {
                    return a[_op_name](b);
                } else if (b[_op_rname]) {
                    return b[_op_rname](a);
                }
            };
        })();
    }

    return operators;
});
