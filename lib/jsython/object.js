(function (factory) {
    module.exports = factory();
}).call(this, function () {
    'use strict';

    var object, type;

    object = (function () {
        var proto, Cls;

        function JSY_object() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }
        }

        Cls = JSY_object;

        Cls.__name__ = 'object';

        proto = Cls.prototype = Object.create(null, {});
        proto.__class__ = Cls;

        return Cls;
    })();

    type = (function (__super__) {
        var proto, Cls;

        function JSY_type(object_or_name, bases, dict) {
            if (arguments.length === 1) {
                return object_or_name.__class__;
            } else if (arguments.length !== 3) {
                //TODO: unsupported
            } else {
                //TODO: fail
            }
        }

        Cls = JSY_type;

        Cls.__name__ = 'type';
        Cls.__class__ = Cls;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(object);


    object.__class__ = type;

    return {
        object: object,
        type: type
    };
});
