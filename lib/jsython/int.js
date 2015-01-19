(function (factory) {
    module.exports = factory(require('./core'), require('./object'));
}).call(this, function (core, obj) {
    'use strict';

    var object, extend;
    var _int, int_cons;

    object = obj.object;
    extend = core.extend;

    _int = (function (__super__) {
        var proto, Cls, from_js_number;

        function int() {
            if (x instanceof object) {
                if (typeof x.__int__ === 'function') {
                    return x.__int__();
                }
            }
            object.__jsy_type_fail__();
        }

        Cls = int;

        from_js_number = function (number) {
            var obj = Object.create(Cls.prototype);
            obj.__number__ = number;
            return obj;
        };

        extend(Cls, __super__);
        Cls.__super__ = __super__;
        Cls.__from_js_number__ = from_js_number;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        proto.__add__ = function (b) {
            return from_js_number(this.__number__ + b.__number__);
        };

        proto.__sub__ = function (b) {
            return from_js_number(this.__number__ - b.__number__);
        };

        proto.__mul__ = function (b) {
            return from_js_number(this.__number__ * b.__number__);
        };

        proto.__div__ = function (b) {
            return from_js_number(this.__number__ / b.__number__);
        };

        proto.__radd__ = function (b) {
            return from_js_number(b.__number__ + this.__number__);
        };

        proto.__rsub__ = function (b) {
            return from_js_number(b.__number__ - this.__number__);
        };

        proto.__rmul__ = function (b) {
            return from_js_number(b.__number__ * this.__number__);
        };

        proto.__rdiv__ = function (b) {
            return from_js_number(b.__number__ / this.__number__);
        };

        // __str__ implemented in str.js

        return Cls;
    })(object);

    int_cons = function (number) {
        return _int.__from_js_number__(number);
    };

    return {
        'int': _int,
        int_cons: int_cons
    };
});
