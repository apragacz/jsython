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

        proto = Cls.prototype = Object.create(null, {});
        proto.__class__ = Cls;
        // __doc__, __repr__, __str__ implemented in str.js

        proto.__setattr__ = function (name, value) {
            this[name] = value;
        };

        proto.__delattr__ = function (name) {
            delete this[name];
        };

        proto.__getattribute__ = function (name) {
            return this[name];
        };

        // TODO: implement __format__, __ge__, __gt__, __le__, __lt__,
        // __reduce__, __reduce_ex__, __hash__, __init__, __new__, __sizeof__,
        // __subclasshook__, __dir__, __eq__, __ne__

        return Cls;
    })();

    return {
        object: object
    };
});
