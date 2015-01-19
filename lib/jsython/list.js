(function (factory) {
    module.exports = factory(require('./core'), require('./object'));
}).call(this, function (core, obj) {
    'use strict';

    var object, extend;
    var list, list_cons;

    object = obj.object;
    extend = core.extend;

    list = (function (__super__) {
        var proto, Cls, from_js_array;

        function list(iterable) {
            var obj, it, arr;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }

            if (typeof iterable !== 'undefined') {
                if (typeof iterable.__iter__ === 'function') {
                    it = iterable.__iter__();
                    if (typeof it.__next__ === 'function') {
                        this.__array__ = [];
                        Cls.__jsy_load_iterator__(this, it);
                        return this;
                    }
                }
            } else {
                this.__array__ = [];
                return this;
            }
            object.__jsy_type_fail__();
        }

        Cls = list;

        from_js_array = function (arr) {
            var obj = Object.create(Cls.prototype);
            obj.__array__ = arr;
            return obj;
        };

        extend(Cls, __super__);
        Cls.__super__ = __super__;
        Cls.__from_js_array__ = from_js_array;
        // Cls.__jsy_load_iterator__ implemented in enrichment.js

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(object);

    list_cons = function (arr) {
        return list.__from_js_array__(arr);
    };

    return {
        list: list,
        list_cons: list_cons
    };
});
