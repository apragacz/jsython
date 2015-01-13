(function (factory) {
    module.exports = factory(
        require('./jsython/core'),
        require('./jsython/object'),
        require('./jsython/list'),
        require('./jsython/int')
    );
}).call(this, function (core, _object, _list, _int) {
    'use strict';

    var extend, exports;

    extend = core.extend;
    exports = {};

    extend(exports, _object);
    extend(exports, _list);
    extend(exports, _int);

    return exports;
});
