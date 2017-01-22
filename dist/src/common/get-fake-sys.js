"use strict";
// Dependencies:
var ts = require('typescript');
var FakeSys = (function () {
    function FakeSys() {
    }
    FakeSys.prototype.getCurrentDirectory = function () {
        return '';
    };
    FakeSys.prototype.getExecutingFilePath = function () {
        return '';
    };
    FakeSys.prototype.readFile = function (path) {
        var clientWindow = window;
        if (!clientWindow.__ineeda__readFile__(path)) {
            throw new Error("Could not read \"" + path + "\". `window.__ineeda__readFile__` is not defined.");
        }
        try {
            return clientWindow.__ineeda__readFile__(path);
        }
        catch (e) {
            throw new Error("Could not read \"" + path + "\".");
        }
    };
    return FakeSys;
}());
// Add FakeSys for browser:
var typescript = ts;
typescript.sys = typescript.sys || new FakeSys();
//# sourceMappingURL=get-fake-sys.js.map