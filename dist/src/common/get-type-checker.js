"use strict";
// Dependencies:
var ts = require('typescript');
var checker;
function getTypeChecker() {
    if (checker) {
        return checker;
    }
    var options = {};
    var host = ts.createCompilerHost(options);
    var program = ts.createProgram([], options, host);
    checker = program.getTypeChecker();
    return checker;
}
exports.getTypeChecker = getTypeChecker;
//# sourceMappingURL=get-type-checker.js.map