"use strict";
// Dependencies:
var build_enum_1 = require('./enums/build-enum');
var build_type_1 = require('./types/build-type');
var get_request_1 = require('./requests/get-request');
var Ineeda = (function () {
    function Ineeda() {
    }
    Ineeda.prototype.a = function (referencePath) {
        var _a = get_request_1.getRequest.fromStack(), name = _a.name, path = _a.path;
        var request = get_request_1.getRequest.fromImport(path, name);
        request.path = referencePath || request.path;
        return build(request);
    };
    Ineeda.prototype.aninstanceof = function (constructor) {
        var _a = get_request_1.getRequest.fromStack(), name = _a.name, path = _a.path;
        var request = get_request_1.getRequest.fromImport(path, name);
        var mock = build(request);
        Object.setPrototypeOf(mock, constructor.prototype);
        return mock;
    };
    return Ineeda;
}());
exports.Ineeda = Ineeda;
function build(request) {
    var result = build_enum_1.buildEnum(request);
    if (result != null) {
        return result;
    }
    result = build_type_1.buildType(request);
    if (result != null) {
        return result;
    }
    return null;
}
exports.build = build;
//# sourceMappingURL=ineeda.js.map