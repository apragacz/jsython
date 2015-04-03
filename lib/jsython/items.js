(function (factory) {
    module.exports = factory(
        require('./object'),
        require('./type'),
        require('./bool'),
        require('./str'),
        require('./exceptions'),
        require('./iter')
    );
}).call(this, function (_object, _type, _bool, _str, _exceptions, _iter) {
    'use strict';

    var object, type, str_cons, iter, next_or_undef, eq, True, False, TypeError;
    var getitem, setitem, hasitem, delitem, contains;

    object = _object.object;
    type = _type.type;
    str_cons = _str.str_cons;
    iter = _iter.iter;
    next_or_undef = _iter.next_or_undef;
    eq = _bool.eq;
    True = _bool.True;
    False = _bool.False;
    TypeError = _exceptions.TypeError;


    getitem = function (_object, key) {
        if (_object instanceof object) {

            if(typeof _object.__getitem__ === 'function') {
                return _object.__getitem__(key);
            }
            throw new TypeError(str_cons(
                '\'' + type(_object).__name__.__string__ + '\' object is not subscriptable'));
        }
        throw new TypeError(str_cons('object not supported'));
    };


    setitem = function (_object, key, value) {
        if (_object instanceof object) {

            if(typeof _object.__setitem__ === 'function') {
                return _object.__setitem__(key, value);
            }
            throw new TypeError(str_cons(
                '\'' + type(_object).__name__.__string__ + '\' object is not subscriptable'));
        }
        throw new TypeError(str_cons('object not supported'));
    };


    delitem = function (_object, key) {
        if (_object instanceof object) {

            if(typeof _object.__delitem__ === 'function') {
                return _object.__delitem__(key);
            }
            throw new TypeError(str_cons(
                '\'' + type(_object).__name__.__string__ + '\' object is not subscriptable'));
        }
        throw new TypeError(str_cons('object not supported'));
    };


    contains = function (_object, key) {
        var obj_iter, elem;
        if (_object instanceof object) {

            if (typeof _object.__contains__ === 'function') {
                return _object.__contains__(key);
            } else if (typeof _object.__iter__ === 'function') {
                for (obj_iter = iter(_object), elem = next_or_undef(obj_iter); elem !== undefined; elem = next_or_undef(obj_iter)) {
                    if (eq(elem, key).__boolean__) {
                        return True;
                    }
                }
                return False;
            }
            throw new TypeError(str_cons(
                'argument of type \'' + type(_object).__name__.__string__ + '\' is not iterable'));
        }
        throw new TypeError(str_cons('object not supported'));
    };



    return {
        getitem: getitem,
        setitem: setitem,
        delitem: delitem,
        contains: contains
    };
});
