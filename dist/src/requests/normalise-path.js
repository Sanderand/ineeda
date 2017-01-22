"use strict";
// Dependencies:
var ts = require('typescript');
function normalisePath(path) {
    if (ts.sys && ts.sys.useCaseSensitiveFileNames) {
        return path;
    }
    else {
        return path.toLowerCase();
    }
}
exports.normalisePath = normalisePath;
//# sourceMappingURL=normalise-path.js.map