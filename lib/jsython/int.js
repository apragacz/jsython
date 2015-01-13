(function (factory) {
    module.exports = factory(require('./core'), require('./object'));
}).call(this, function (core, obj) {
    'use strict';

    var object, extend;
    var _int, int_cons;

    object = obj.object;
    extend = core.extend;

    _int = (function (__super__) {
        var proto, Cls;

        function JSY_int() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }
        }

        Cls = JSY_int;

        extend(Cls, __super__);
        Cls.__name__ = 'int';
        Cls.__super__ = __super__;

        Cls.from_js_number = function (number) {
            var obj = new Cls();
            obj.__number__ = number;
            return obj;
        };

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        proto.__add__ = function (b) {
            return Cls.from_js_number(this.__number__ + b.__number__);
        };

        proto.__sub__ = function (b) {
            return Cls.from_js_number(this.__number__ - b.__number__);
        };

        proto.__mul__ = function (b) {
            return Cls.from_js_number(this.__number__ * b.__number__);
        };

        proto.__div__ = function (b) {
            return Cls.from_js_number(this.__number__ / b.__number__);
        };

        proto.__radd__ = function (b) {
            return Cls.from_js_number(b.__number__ + this.__number__);
        };

        proto.__rsub__ = function (b) {
            return Cls.from_js_number(b.__number__ - this.__number__);
        };

        proto.__rmul__ = function (b) {
            return Cls.from_js_number(b.__number__ * this.__number__);
        };

        proto.__rdiv__ = function (b) {
            return Cls.from_js_number(b.__number__ / this.__number__);
        };

        return Cls;
    })(object);

    int_cons = function (number) {
        return _int.from_js_number(number);
    };

    return {
        'int': _int,
        int_cons: int_cons
    };
});
