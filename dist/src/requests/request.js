"use strict";
// Dependencies:
var normalise_path_1 = require('./normalise-path');
var Request = (function () {
    function Request(name, path) {
        this.name = name;
        this.path = path;
        this.path = normalise_path_1.normalisePath(this.path);
    }
    return Request;
}());
exports.Request = Request;
//# sourceMappingURL=request.js.map