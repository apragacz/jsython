(function (factory) {
    module.exports = factory();
}).call(this, function () {
    'use strict';

    var extend, isObject, hasOwnProperty;

    hasOwnProperty = Object.prototype.hasOwnProperty;

    isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    extend = function(obj) {
        if (!isObject(obj)) return obj;
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                if (hasOwnProperty.call(source, prop)) {
                    obj[prop] = source[prop];
                }
            }
        }
        return obj;
    };

    return {
        extend: extend
    };
});
