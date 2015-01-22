(function (factory) {
    module.exports = factory(
        require('./object'),
        require('./type'),
        require('./str'),
        require('./bool'),
        require('./exceptions')
    );
}).call(this, function (_object, _type, _str, _bool, _exceptions) {
    'use strict';

    var object, type, str_cons, TypeError, AttributeError, True, False;
    var getattr, setattr, hasattr, delattr, getattr_call, default_obj;

    object = _object.object;
    type = _type.type;
    str_cons = _str.str_cons;
    TypeError = _exceptions.TypeError;
    AttributeError = _exceptions.AttributeError;
    True = _bool.True;
    False = _bool.False;
    default_obj = {};


    getattr = function (_object, name, _default) {
        if (_object instanceof object) {

            try {
                return _object.__getattribute__(name);
            } catch (e) {
                if (!(e instanceof AttributeError)) {
                    throw e;
                }
            }

            if(typeof _object.__getattr__ === 'function') {
                try {
                    return _object.__getattr__(name);
                } catch (e) {
                    if (!(e instanceof AttributeError)) {
                        throw e;
                    }
                }
            }
            if (_default !== void 0) {
                return _default;
            } else {
                throw new AttributeError(str_cons(
                    '\'' + type(_object).__name__.__string__ + '\'' +
                    ' object has no attribute \'' + name.__string__ + '\''
                ));
            }
        }
        throw new TypeError(str_cons('object not supported'));
    };


    setattr = function (_object, name, value) {
        if (_object instanceof object) {
            return _object.__setattr__(name, value);
        }
        throw new TypeError(str_cons('object not supported'));
    };


    delattr = function (_object, name) {
        if (_object instanceof object) {
            return _object.__delattr__(name);
        }
        throw new TypeError(str_cons('object not supported'));
    };


    hasattr = function (_object, name) {
        return getattr(_object, name, default_obj) !== default_obj? True : False;
    };


    return {
        getattr: getattr,
        setattr: setattr,
        delattr: delattr,
        hasattr: hasattr
    };
});
