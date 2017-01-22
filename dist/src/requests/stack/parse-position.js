"use strict";
// Constants:
var TYPE_GENERIC_REGEX = /^(a|aninstanceof)<(.*)>/;
// Utilities:
var os = require('os');
// Dependencies:
var get_source_file_1 = require('../../common/get-source-file');
function parsePosition(position) {
    var sourceFile = get_source_file_1.getSourceFile(position.path);
    var lines = sourceFile.text.split(os.EOL);
    var line = lines[position.line];
    var call = line.substring(position.column);
    var _a = call.match(TYPE_GENERIC_REGEX), name = _a[2];
    return name;
}
exports.parsePosition = parsePosition;
//# sourceMappingURL=parse-position.js.map