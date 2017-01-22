"use strict";
// Dependencies:
var ts = require('typescript');
var SOURCE_FILES = {};
function getSourceFile(path) {
    if (SOURCE_FILES[path]) {
        return SOURCE_FILES[path];
    }
    var content = ts.sys.readFile(path);
    var setParentNodes = true;
    var sourceFile = ts.createSourceFile(path, content, null, setParentNodes);
    ts.bindSourceFile(sourceFile, {});
    SOURCE_FILES[path] = sourceFile;
    return sourceFile;
}
exports.getSourceFile = getSourceFile;
//# sourceMappingURL=get-source-file.js.map