(function (factory) {
    module.exports = factory(
        require('./object'),
        require('./type'),
        require('./str'),
        require('./exceptions')
    );
}).call(this, function (_object, _type, _str, _exceptions) {
    'use strict';

    var object, type, str_cons, TypeError, StopIteration;
    var iter, next, next_or_undef, stop_obj;

    object = _object.object;
    type = _type.type;
    str_cons = _str.str_cons;
    TypeError = _exceptions.TypeError;
    StopIteration = _exceptions.StopIteration;
    stop_obj = {};

    iter = function (x) {
        if (x instanceof object) {
            if(typeof x.__iter__ === 'function') {
                return x.__iter__();
            }
            throw new TypeError(str_cons(
                '\'' + type(x).__name__.__string__ +
                '\' object is not iterable'));
        }
        throw new TypeError(str_cons('object not supported'));
    };

    next = function (iterator, _default) {
        if (iterator instanceof object) {
            if(typeof iterator.__next__ === 'function') {
                if (_default !== void 0) {
                    try {
                        return iterator.__next__();
                    } catch (e) {
                        if (e instanceof StopIteration) {
                            return _default;
                        } else {
                            throw e;
                        }
                    }
                } else {
                    return iterator.__next__();
                }
            }
            throw new TypeError(str_cons(
                '\'' + type(iterator).__name__.__string__ +
                '\' object is not an iterator'));
        }
        throw new TypeError(str_cons('object not supported'));
    };

    next_or_undef = function (iterator) {
        var result;

        result = next(iterator, stop_obj);

        if (result === stop_obj) {
            return void 0;
        } else {
            return result;
        }
    };

    return {
        iter: iter,
        next: next,
        next_or_undef: next_or_undef
    };
});
