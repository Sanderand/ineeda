"use strict";
// Dependencies:
var normalise_path_1 = require('../normalise-path');
var Position = (function () {
    function Position(column, line, path) {
        this.column = column;
        this.line = line;
        this.path = path;
        this.path = normalise_path_1.normalisePath(this.path);
    }
    return Position;
}());
exports.Position = Position;
//# sourceMappingURL=position.js.map