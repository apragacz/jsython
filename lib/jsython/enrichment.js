(function (factory) {
    module.exports = factory(
        require('./core'),
        require('./object'),
        require('./type'),
        require('./int'),
        require('./list'),
        require('./str')
    );
}).call(this, function (core, _object, _type, _int, _list, _str) {
    'use strict';

    var object, objectproto;
    var type;
    var int, intproto, int_cons;
    var list, listproto, list_cons;
    var str, strproto, str_cons;

    object = _object.object;
    type = _type.type;
    int = _int.int;
    int_cons = _int.int_cons;
    list = _list.list;
    list_cons = _list.list_cons;
    str = _str.str;
    str_cons = _str.str_cons;


    // object class enrichment
    object.__name__ = str_cons('object');
    object.__class__ = type;
    objectproto = object.prototype;
    objectproto.__doc__ = str_cons('The most base type');

    objectproto.__repr__ = function () {
        return str_cons('<' + this.__class__.__name__.__string__ + ' object>');
    };

    objectproto.__str__ = function () {
        return this.__repr__();
    };


    // int class enrichment
    int.__name__ = str_cons('int');
    intproto = int.prototype;

    intproto.__repr__ = function () {
        return str_cons('' + this.__number__);
    };


    // list class enrichment
    list.__name__ = str_cons('list');
    listproto = list.prototype;

    listproto.__len__ = function () {
        return int_cons(this.__array__.length);
    };

    listproto.__repr__ = function () {
        var i, arr, arr_len, list_string = '';
        arr = this.__array__;
        arr_len = arr.length;
        list_string += '[';

        for (i = 0; i < arr_len; ++i) {
            if (i > 0) {
                list_string += ', ';
            }
            list_string += arr[i].__str__().__string__;
        }

        list_string += ']';
        return str_cons(list_string);
    };

    listproto.__add__ = function (b) {
        return list_cons(this.__array__.concat(b.__array__));
    };


    // str class enrichment
    strproto = str.prototype;

    strproto.__len__ = function () {
        return int_cons(this.__string__.length);
    };


    return {};
});
