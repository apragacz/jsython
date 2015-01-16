(function (factory) {
    module.exports = factory(require('./core'), require('./object'));
}).call(this, function (core, _object) {
    'use strict';

    var object, extend;
    var NoneType, None, NotImplementedType, NotImplemented;

    object = _object.object;
    extend = core.extend;


    NoneType = (function (__super__) {
        var proto, Cls;

        function NoneType() {
        }

        Cls = NoneType;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(object);


    NotImplementedType = (function (__super__) {
        var proto, Cls;

        function NotImplementedType() {
        }

        Cls = NotImplementedType;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        return Cls;
    })(object);


    None = Object.create(NoneType.prototype);


    NotImplemented = Object.create(NotImplementedType.prototype);


    return {
        None: None,
        NotImplemented: NotImplemented
    };
});
