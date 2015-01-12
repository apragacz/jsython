(function (factory) {
    module.exports = factory(
        require('./jsython/core'),
        require('./jsython/object')
    );
}).call(this, function (core, obj) {
    'use strict';

    var extend, exports;

    extend = core.extend;
    exports = {};

    extend(exports, obj);

    return exports;
});
