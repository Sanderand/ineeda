"use strict";
// Constants:
var CALLER_PATH_REGEX = /\((.*):(\d+):(\d+)\)$/;
var SOURCE_MAP_FILE_REGEX = /^(?:.*file:)?(.*)$/;
var STACK_DEPTH = 4;
var URL_FILE_REGEX = /.*:\/\/.*:\d+/;
// Dependencies:
var position_1 = require('./position');
require('source-map-support/register');
function parseStack() {
    var stack = (new Error()).stack;
    var stackLines = stack.split(/\n/)
        .map(function (l) { return l.trim(); });
    var callerLine = stackLines[STACK_DEPTH];
    var _a = callerLine.match(CALLER_PATH_REGEX), sourceMapPath = _a[1], lineStr = _a[2], columnStr = _a[3];
    var _b = sourceMapPath.match(SOURCE_MAP_FILE_REGEX), path = _b[1];
    path = path.replace(URL_FILE_REGEX, '');
    var column = +columnStr - 1;
    var line = +lineStr - 1;
    return new position_1.Position(column, line, path);
}
exports.parseStack = parseStack;
//# sourceMappingURL=parse-stack.js.map