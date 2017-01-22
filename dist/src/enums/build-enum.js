"use strict";
var get_enums_1 = require('./get-enums');
function buildEnum(request) {
    var enumDescription = get_enums_1.getEnums(request)[request.name];
    if (enumDescription) {
        return getEnumValue(enumDescription);
    }
}
exports.buildEnum = buildEnum;
function getEnumValue(enumDescription) {
    var values = enumDescription.map(function (d) { return d.value; }).sort();
    var value = values[0];
    return value;
}
//# sourceMappingURL=build-enum.js.map