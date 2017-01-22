"use strict";
// Constants:
var TS_EXTENSION = '.ts';
// Utilities:
var path = require('path');
// Dependencies:
var parse_imports_1 = require('./imports/parse-imports');
var parse_position_1 = require('./stack/parse-position');
var parse_stack_1 = require('./stack/parse-stack');
var request_1 = require('./request');
exports.getRequest = { fromImport: fromImport, fromStack: fromStack };
function fromImport(currentFilePath, name) {
    var importDescriptions = parse_imports_1.parseImports(currentFilePath);
    var importDescription = importDescriptions.find(function (i) { return i.name === name; });
    if (!importDescription) {
        throw new Error("Could not find an import matching `" + name + "` in \"" + currentFilePath + "\"");
    }
    var importPath = importDescription.path;
    if (importPath.startsWith('.') && !importPath.endsWith(TS_EXTENSION)) {
        importPath = "" + importPath + TS_EXTENSION;
    }
    return new request_1.Request(name, path.resolve(path.dirname(currentFilePath), importPath));
}
function fromStack() {
    var position = parse_stack_1.parseStack();
    return new request_1.Request(parse_position_1.parsePosition(position), position.path);
}
//# sourceMappingURL=get-request.js.map