(function (factory) {
    module.exports = factory(
        require('./object'),
        require('./type'),
        require('./str'),
        require('./exceptions')
    );
}).call(this, function (_object, _type, _str, _exceptions) {
    'use strict';

    var object, type, str_cons, TypeError;
    var len;

    object = _object.object;
    type = _type.type;
    str_cons = _str.str_cons;
    TypeError = _exceptions.TypeError;

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
