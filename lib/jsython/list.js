(function (factory) {
    module.exports = factory(require('./core'), require('./object'));
}).call(this, function (core, obj) {
    'use strict';

    var object, extend;
    var list, list_cons;

    object = obj.object;
    extend = core.extend;

    list = (function (__super__) {
        var proto, Cls;

        function JSY_list() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }
        }

        Cls = JSY_list;

        extend(Cls, __super__);
        Cls.__name__ = 'list';
        Cls.__super__ = __super__;

        Cls.from_js_array = function (arr) {
            var obj = new Cls();
            obj.__array__ = arr;
            return obj;
        };

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(object);

    list_cons = function (arr) {
        return list.from_js_array(arr);
    };

    return {
        list: list,
        list_cons: list_cons
    };
});
