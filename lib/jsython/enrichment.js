(function (factory) {
    module.exports = factory(
        require('./core'),
        require('./object'),
        require('./type'),
        require('./int'),
        require('./list'),
        require('./str'),
        require('./bool'),
        require('./exceptions')
    );
}).call(this, function (core, _object, _type, _int, _list, _str, _bool,
                        _exceptions) {
    'use strict';

    var object, objectproto;
    var type;
    var int, intproto, int_cons;
    var list, listproto, list_cons;
    var str, strproto, str_cons;
    var bool, boolproto, bool_cons, not, eq, True, False;
    var BaseException, Exception, TypeError, AttributeError, ValueError;
    var baseexcproto;
    var reserved_attributes, js_type_name;

    object = _object.object;
    type = _type.type;
    int = _int.int;
    int_cons = _int.int_cons;
    list = _list.list;
    list_cons = _list.list_cons;
    str = _str.str;
    str_cons = _str.str_cons;
    bool = _bool.bool;
    bool_cons = _bool.bool_cons;
    not = _bool.not;
    eq = _bool.eq;
    True = _bool.True;
    False = _bool.False;
    BaseException = _exceptions.BaseException;
    Exception = _exceptions.Exception;
    TypeError = _exceptions.TypeError;
    AttributeError = _exceptions.AttributeError;
    ValueError = _exceptions.ValueError;


    // object class enrichment
    object.__name__ = str_cons('object');
    object.__class__ = type;
    objectproto = object.prototype;
    objectproto.__doc__ = str_cons('The most base type');

    reserved_attributes = [
        '__string__',
        '__array__',
        '__boolean__',
        '__number__'
    ];

    js_type_name = function (x) {
        if (x instanceof object) {
            return type(x).__name__.__string__;
        } else {
            return '' + x;
        }
    };

    objectproto.__repr__ = function () {
        return str_cons('<' + this.__class__.__name__.__string__ + ' object>');
    };

    objectproto.__str__ = function () {
        return this.__repr__();
    };

    objectproto.__dir__ = function () {
        var k, arr = [];

        for (k in this) {
            if (reserved_attributes.indexOf(k) === -1) {
                arr.push(str_cons(k));
            }
        }

        return list_cons(arr);
    };

    objectproto.__setattr__ = function (name, value) {
        if (name instanceof str) {
            this[name.__string__] = value;
        } else {
            throw new TypeError(str_cons(
                'attribute name must be string, not \'' +
                js_type_name(name) + '\''));
        }
    };

    objectproto.__delattr__ = function (name) {
        var name_string;
        if (name instanceof str) {
            name_string = name.__string__;
            if (this[name_string] === undefined) {
                throw new AttributeError(str_cons(
                    '\'' + js_type_name(this) + '\'' +
                    ' object has no attribute \'' + name_string + '\''
                ));
            }
            delete this[name_string];
        } else {
            throw new TypeError(str_cons(
                'attribute name must be string, not \'' +
                js_type_name(name) + '\''));
        }
    };

    objectproto.__getattribute__ = function (name) {
        var attr_value;
        if (name instanceof str) {
            attr_value = this[name.__string__];
            if (attr_value === undefined) {
                throw new AttributeError(str_cons(
                    '\'' + js_type_name(this) + '\'' +
                    ' object has no attribute \'' + name.__string__ + '\''
                ));
            }
            return attr_value;
        } else {
            throw new TypeError(str_cons(
                'attribute name must be string, not \'' +
                js_type_name(name) + '\''));
        }
    };

    objectproto.__jsy_type_fail__ = function (js_string) {
        throw new TypeError(str_cons(js_string || ''));
    };


    // int class enrichment
    int.__name__ = str_cons('int');
    intproto = int.prototype;

    intproto.__repr__ = function () {
        return str_cons('' + this.__number__);
    };

    intproto.__bool__ = function () {
        return this.__number__ !== 0 ? True : False;
    };

    intproto.__eq__ = function (b) {
        //TODO: typeerror
        if (b instanceof int) {
            return this.__number__ === b.__number__ ? True : False;
        } else {
            return False;
        }
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
            list_string += arr[i].__repr__().__string__;
        }

        list_string += ']';
        return str_cons(list_string);
    };

    listproto.__add__ = function (b) {
        return list_cons(this.__array__.concat(b.__array__));
    };

    listproto.__eq__ = function (b) {
        var arr, barr, i;
        if (b instanceof list) {
            arr = this.__array__;
            barr = b.__array__;

            if (arr.length !== barr.length) {
                return False;
            }

            for (i = 0; i < arr.length; i++) {
                if (!eq(arr[i], barr[i]).__boolean__) {
                    return False;
                }
            }

            return True;

        } else {
            return False;
        }
    };



    // str class enrichment
    strproto = str.prototype;

    strproto.__len__ = function () {
        return int_cons(this.__string__.length);
    };

    strproto.__eq__ = function (b) {
        if (b instanceof str) {
            return this.__string__ === b.__string__ ? True : False;
        } else {
            return False;
        }
    };


    // bool class enrichment
    bool.__name__ = str_cons('bool');
    boolproto = bool.prototype;

    boolproto.__repr__ = function () {
        return this.__boolean__ ? str_cons('True') : str_cons('False');
    };


    // exceptions class enrichment
    BaseException.__name__ = str_cons('BaseException');

    baseexcproto = BaseException.prototype;

    baseexcproto.__repr__ = function () {
        var i, arr, arr_len, list_string = '';
        arr = this.args;
        arr_len = arr.length;
        list_string += this.__class__.__name__.__str__().__string__;
        list_string += '(';

        for (i = 0; i < arr_len; ++i) {
            if (i > 0) {
                list_string += ', ';
            }
            list_string += arr[i].__repr__().__string__;
        }

        list_string += ')';
        return str_cons(list_string);
    };

    Exception.__name__ = str_cons('Exception');

    TypeError.__name__ = str_cons('TypeError');

    AttributeError.__name__ = str_cons('AttributeError');

    ValueError.__name__ = str_cons('ValueError');


    return {};
});
