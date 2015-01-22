(function (factory) {
    module.exports = factory(
        require('./jsython/core'),
        require('./jsython/object'),
        require('./jsython/type'),
        require('./jsython/list'),
        require('./jsython/int'),
        require('./jsython/operator'),
        require('./jsython/str'),
        require('./jsython/bool'),
        require('./jsython/exceptions'),
        require('./jsython/auxobjects'),
        require('./jsython/len'),
        require('./jsython/print'),
        require('./jsython/iter'),
        require('./jsython/enrichment')
    );
}).call(this, function (core, _object, _type, _list, _int, _operator, _str,
                        _bool, _exceptions, _auxobjects, _len, _print,
                        _iter, _enrichment) {
    'use strict';

    var extend, exports;

    extend = core.extend;
    exports = {};

    extend(exports, _object);
    extend(exports, _type);
    extend(exports, _list);
    extend(exports, _int);
    extend(exports, _operator);
    extend(exports, _str);
    extend(exports, _bool);
    extend(exports, _exceptions);
    extend(exports, _auxobjects);
    extend(exports, _print);
    extend(exports, _len);
    extend(exports, _iter);

    return exports;
});
