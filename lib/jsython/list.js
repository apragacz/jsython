(function (factory) {
    module.exports = factory(
        require('./core'),
        require('./object'),
        require('./exceptions')
    );
}).call(this, function (core, _object, _exceptions) {
    'use strict';

    var object, extend, StopIteration;
    var list, list_cons, list_iterator;

    object = _object.object;
    extend = core.extend;
    StopIteration = _exceptions.StopIteration;


    list = (function (__super__) {
        var proto, Cls, from_js_array;

        function list(iterable) {
            var obj, it, arr;
            if (!this) {
                obj = Object.create(Cls.prototype);
                Cls.apply(obj, arguments);
                return obj;
            }

            if (typeof iterable !== 'undefined') {
                if (typeof iterable.__iter__ === 'function') {
                    it = iterable.__iter__();
                    if (typeof it.__next__ === 'function') {
                        this.__array__ = [];
                        Cls.__jsy_load_iterator__(this, it);
                        return this;
                    }
                }
            } else {
                this.__array__ = [];
                return this;
            }
            object.__jsy_type_fail__();
        }

        Cls = list;

        from_js_array = function (arr) {
            var obj = Object.create(Cls.prototype);
            obj.__array__ = arr;
            return obj;
        };

        extend(Cls, __super__);
        Cls.__super__ = __super__;
        Cls.__from_js_array__ = from_js_array;
        // Cls.__jsy_load_iterator__ implemented in enrichment.js

        proto = Cls.prototype = Object.create(__super__.prototype);
        proto.__class__ = Cls;

        proto.__iter__ = function () {
            return new list_iterator(this);
        };

        return Cls;
    })(object);


    list_iterator = (function (__super__) {
        var proto, Cls;

        function list_iterator(l) {
            this.list = l;
            this.next_pos = 0;
        }

        Cls = list_iterator;

        extend(Cls, __super__);
        Cls.__super__ = __super__;

        proto = Cls.prototype = Object.create(__super__.prototype);

        proto.__next__ = function () {
            if (this.list.length <= this.next_pos) {
                throw new StopIteration();
            }
            return this.list.__array__[this.next_pos++];
        };

        return Cls;
    })(object);


    list_cons = function (arr) {
        return list.__from_js_array__(arr);
    };

    return {
        list: list,
        list_cons: list_cons
    };
});
