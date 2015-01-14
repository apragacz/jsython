(function (factory) {
    module.exports = factory(require('./core'), require('./object'));
}).call(this, function (core, obj) {
    'use strict';

    var object, extend, objectproto;
    var str, str_cons;

    object = obj.object;
    extend = core.extend;

    str = (function (__super__) {
        var proto, Cls;

        function JSY_str() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }
        }

        Cls = JSY_str;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        Cls.from_js_string = function (string) {
            var obj = new Cls();
            obj.__string__ = string;
            return obj;
        };

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        proto.__str__ = function () {
            return this;
        };

        proto.__add__ = function (b) {
            return str_cons(this.__string__ + b.__string__);
        };

        return Cls;
    })(object);

    str_cons = function (string) {
        return str.from_js_string(string);
    };

    str.__name__ = str_cons('str');

    return {
        str: str,
        str_cons: str_cons
    };
});
