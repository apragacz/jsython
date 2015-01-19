(function (factory) {
    module.exports = factory();
}).call(this, function () {
    'use strict';

    var object;

    object = (function () {
        var proto, Cls;

        function object() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }

            this.__init__.apply(this, arguments);
        }

        Cls = object;

        Cls.__new__ = function () {
            var cls, args, obj;

            cls = arguments[0];
            args = Array.prototype.slice.call(arguments, 1);

            obj = Object.create(cls.prototype);
            cls.apply(obj, args);
            return obj;
        };

        proto = Cls.prototype = Object.create(null, {});
        proto.__class__ = Cls;
        // __doc__, __repr__, __str__ implemented in str.js

        proto.__init__ = function () {
        };

        // TODO: implement __format__, __ge__, __gt__, __le__, __lt__,
        // __reduce__, __reduce_ex__, __hash__, __new__, __sizeof__,
        // __subclasshook__, __dir__, __eq__, __ne__

        return Cls;
    })();

    return {
        object: object
    };
});
