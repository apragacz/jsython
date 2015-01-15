(function (factory) {
    module.exports = factory(require('./core'), require('./object'));
}).call(this, function (core, _object) {
    'use strict';

    var object, extend;
    var bool, True, False, bool_cons, not, eq;

    object = _object.object;
    extend = core.extend;

    bool = (function (__super__) {
        var proto, Cls;

        function JSY_bool(x) {
            if (x instanceof object) {
                if (x.__bool__) {
                    return x.__bool__();
                }
                if (x.__len__) {
                    // TODO: support for long
                    if (x.__len__().__number__ === 0) {
                        return False;
                    } else {
                        return True;
                    }
                }
            }
        }

        Cls = JSY_bool;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        Cls.from_js_boolean = function (b) {
            return b ? True : False;
        };

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        proto.__bool__ = function () {
            return this;
        };

        // __str__ implemented in str.js

        return Cls;
    })(object);

    True = Object.create(bool.prototype);
    True.__boolean__ = true;

    False = Object.create(bool.prototype);
    False.__boolean__ = false;

    not = function (b) {
        return bool(b).__boolean__ ? False : True;
    };

    eq = function (a, b) {
        if (a === b) {
            return True;
        }

        //TODO: NotImplemented
        //TODO: type hierarchy

        if (a.__eq__) {
            return a.__eq__(b);
        }

        if (a.__ne__) {
            return not(a.__ne__(b));
        }

        if (b.__eq__) {
            return b.__eq__(a);
        }

        if (b.__ne__) {
            return not(b.__ne__(a));
        }

        return False;
    };

    bool_cons = function (b) {
        return bool.from_js_boolean(b);
    };

    return {
        bool: bool,
        bool_cons: bool_cons,
        True: True,
        False: False,
        not: not,
        eq: eq
    };
});
