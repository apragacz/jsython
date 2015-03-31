(function (factory) {
    module.exports = factory(require('./core'), require('./object'));
}).call(this, function (core, _object) {
    'use strict';

    var object, extend;
    var BaseException, Exception, TypeError, AttributeError, LookupError,
        KeyError, IndexError, ValueError, StopIteration;

    object = _object.object;
    extend = core.extend;

    BaseException = (function (__super__) {
        var proto, Cls;

        function BaseException() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }

            return Cls.__super__.apply(this, arguments);
        }

        Cls = BaseException;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        proto.__init__ = function () {
            this.args = Array.prototype.slice.call(arguments, 0);
        };

        return Cls;
    })(object);


    Exception = (function (__super__) {
        var proto, Cls;

        function Exception() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }

            return Cls.__super__.apply(this, arguments);
        }

        Cls = Exception;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(BaseException);


    TypeError = (function (__super__) {
        var proto, Cls;

        function TypeError() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }

            return Cls.__super__.apply(this, arguments);
        }

        Cls = TypeError;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(Exception);


    AttributeError = (function (__super__) {
        var proto, Cls;

        function AttributeError() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }

            return Cls.__super__.apply(this, arguments);
        }

        Cls = AttributeError;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(Exception);


    LookupError = (function (__super__) {
        var proto, Cls;

        function LookupError() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }

            return Cls.__super__.apply(this, arguments);
        }

        Cls = LookupError;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(Exception);


    KeyError = (function (__super__) {
        var proto, Cls;

        function KeyError() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }

            return Cls.__super__.apply(this, arguments);
        }

        Cls = KeyError;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(LookupError);


    IndexError = (function (__super__) {
        var proto, Cls;

        function IndexError() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }

            return Cls.__super__.apply(this, arguments);
        }

        Cls = IndexError;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(LookupError);


    ValueError = (function (__super__) {
        var proto, Cls;

        function ValueError() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }

            return Cls.__super__.apply(this, arguments);
        }

        Cls = ValueError;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(Exception);


    StopIteration = (function (__super__) {
        var proto, Cls;

        function StopIteration() {
            var obj;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }

            return Cls.__super__.apply(this, arguments);
        }

        Cls = StopIteration;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(Exception);


    return {
        BaseException: BaseException,
        Exception: Exception,
        TypeError: TypeError,
        AttributeError: AttributeError,
        LookupError: LookupError,
        IndexError: IndexError,
        KeyError: KeyError,
        ValueError: ValueError,
        StopIteration: StopIteration
    };
});
