(function (factory) {
    module.exports = factory(
        require('./jsython/core'),
        require('./jsython/object'),
        require('./jsython/list')
    );
}).call(this, function (core, _object, _list) {
    'use strict';

    var extend, exports;

    extend = core.extend;
    exports = {};

    extend(exports, _object);
    extend(exports, _list);

    return exports;
});
