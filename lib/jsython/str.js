(function (factory) {
    module.exports = factory(require('./core'), require('./object'));
}).call(this, function (core, obj) {
    'use strict';

    var object, extend, objectproto;
    var str, str_cons, repr;

    object = obj.object;
    extend = core.extend;

    str = (function (__super__) {
        var proto, Cls, from_js_string;

        function str() {
            if (x instanceof object) {
                if (x.__str__) {
                    return x.__str__();
                }
            }
            object.__jsy_type_fail__();
        }

        Cls = str;

        from_js_string = function (string) {
            var obj = Object.create(Cls.prototype);
            obj.__string__ = string;
            return obj;
        };

        extend(Cls, __super__);
        Cls.__super__ = __super__;
        Cls.__from_js_string__ = from_js_string;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        proto.__str__ = function () {
            return this;
        };

        proto.__repr__ = function () {
            var i, string, elem, result;
            string = this.__string__;
            result = '';
            result += '\'';
            for (i = 0; i < string.length; ++i) {
                elem = string[i];
                if (elem === '\n') {
                    result += '\\n';
                } else if (elem === '\r') {
                    result += '\\r';
                } else if (elem === '\t') {
                    result += '\\t';
                } else if (elem === '\'') {
                    result += '\\\'';
                } else if (elem === '\\') {
                    result += '\\\\';
                } else {
                    result += elem;
                }
            }
            result += '\'';
            return from_js_string(result);
        };

        proto.__add__ = function (b) {
            return from_js_string(this.__string__ + b.__string__);
        };

        return Cls;
    })(object);

    repr = function (x) {
        if (x instanceof object) {
            return x.__repr__();
        }
        object.__jsy_type_fail__();
    };

    str_cons = function (string) {
        return str.__from_js_string__(string);
    };

    str.__name__ = str_cons('str');

    return {
        repr: repr,
        str: str,
        str_cons: str_cons
    };
});
