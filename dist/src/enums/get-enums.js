"use strict";
var parse_enums_1 = require('./parse-enums');
var allEnums = {};
function getEnums(request) {
    var path = request.path;
    if (allEnums[path]) {
        return allEnums[path];
    }
    allEnums[path] = parse_enums_1.parseEnums(request);
    return allEnums[path];
}
exports.getEnums = getEnums;
//# sourceMappingURL=get-enums.js.map