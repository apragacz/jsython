(function (factory) {
    module.exports = factory(require('./object'), require('./type'));
}).call(this, function (_object, _type) {
    'use strict';

    var object;
    var type;
    var len;

    object = _object.object;
    type = _type.type;

    len = function (x) {
        if (x instanceof object) {
            if(typeof x.__len__ === 'function') {
                return x.__len__();
            }
            throw new TypeError(str_cons(
                'object of type \'' + type(x).__name__.__string__ + '\''));
        }
        throw new TypeError(str_cons('object not supported'));
    };

    return {
        len: len
    };
});
