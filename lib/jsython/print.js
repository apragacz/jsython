(function (factory) {
    module.exports = factory(require('./object'));
}).call(this, function (_object) {
    'use strict';

    var object;
    var print;

    object = _object.object;

    print = function () {
        var i, arg, arg_string, arg_strings;

        arg_strings = [];
        for (i = 0; i < arguments.length; i++) {
            arg = arguments[i];
            if (arg instanceof object) {
                arg_string = arg.__str__().__string__;
            } else {
                arg_string = arg;
            }
            arg_strings.push(arg_string);
        }
        console.log(arg_strings.join(' '));
    };

    return {
        print: print
    };
});
