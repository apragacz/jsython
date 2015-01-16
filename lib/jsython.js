(function (factory) {
    module.exports = factory(
        require('./jsython/core'),
        require('./jsython/object'),
        require('./jsython/list'),
        require('./jsython/int'),
        require('./jsython/operator'),
        require('./jsython/str'),
        require('./jsython/bool'),
        require('./jsython/exceptions'),
        require('./jsython/print'),
        require('./jsython/enrichment')
    );
}).call(this, function (core, _object, _list, _int, _operator, _str,
                        _bool, _exceptions, _print, _enrichment) {
    'use strict';

    var extend, exports;

    extend = core.extend;
    exports = {};

    extend(exports, _object);
    extend(exports, _list);
    extend(exports, _int);
    extend(exports, _operator);
    extend(exports, _str);
    extend(exports, _bool);
    extend(exports, _exceptions);
    extend(exports, _print);

    return exports;
});
