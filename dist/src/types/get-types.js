"use strict";
var parse_types_1 = require('./parse-types');
var allTypes = {};
function getTypes(request) {
    var path = request.path;
    if (allTypes[path]) {
        return allTypes[path];
    }
    allTypes[path] = parse_types_1.parseTypes(request);
    return allTypes[path];
}
exports.getTypes = getTypes;
//# sourceMappingURL=get-types.js.map