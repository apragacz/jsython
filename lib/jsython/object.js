(function (factory) {
    module.exports = factory();
}).call(this, function () {
    'use strict';

    var object;

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

    return {
        object: object
    };
});
