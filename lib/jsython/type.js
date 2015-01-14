(function (factory) {
    module.exports = factory(require('./core'), require('./object'));
}).call(this, function (core, obj) {
    'use strict';

    var object, extend;
    var type;

    object = obj.object;
    extend = core.extend;

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
        extend(Cls, __super__);

        Cls.__name__ = 'type';
        Cls.__class__ = Cls;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(object);

    return {
        type: type
    };
});
