'use strict';
var ARRAY_REGEX = /.*\[\]$/;
var ENUMS = {};
var FUNCTION_REGEX = /\(.*\)\s=>\s.*/;
var INTERFACES = {};
var ts = require('typescript');
var Finder = (function () {
    function Finder() {
    }
    Finder.prototype.findTypes = function (path) {
        var _this = this;
        var files = [];
        if (path) {
            files.push(path);
        }
        var program = ts.createProgram(files, {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES6
        });
        var checker = program.getTypeChecker();
        var sourceFiles = program.getSourceFiles();
        sourceFiles.forEach(function (sourceFile) {
            ts.forEachChild(sourceFile, function (node) {
                _this.visit(checker, node);
            });
        });
    };
    Finder.prototype.getEnum = function (name) {
        return ENUMS[name];
    };
    Finder.prototype.getInterface = function (name) {
        return INTERFACES[name];
    };
    Finder.prototype.getEnumDescription = function (checker, node) {
        var enumSymbol = checker.getSymbolAtLocation(node.name);
        if (ENUMS[enumSymbol.name]) {
            return;
        }
        var enumDescription = {
            type: 'enum',
            values: []
        };
        node.members.forEach(function (member, index) {
            var value;
            if (member.initializer) {
                value = parseInt(member.initializer.text, 10);
            }
            else {
                value = index;
            }
            enumDescription.values.push(value);
        });
        ENUMS[enumSymbol.name] = enumDescription;
    };
    Finder.prototype.getInterfaceDescription = function (checker, node) {
        var interfaceSymbol = checker.getSymbolAtLocation(node.name);
        if (INTERFACES[interfaceSymbol.name]) {
            return;
        }
        var interfaceDescription = [];
        var interfaceType = checker.getDeclaredTypeOfSymbol(interfaceSymbol);
        var propertySymbols = checker.getPropertiesOfType(interfaceType);
        propertySymbols.forEach(function (propertySymbol) {
            var name = checker.symbolToString(propertySymbol);
            var type = checker.typeToString(checker.getTypeOfSymbolAtLocation(propertySymbol, propertySymbol.valueDeclaration));
            if (type.match(FUNCTION_REGEX)) {
                type = 'function';
            }
            if (type.match(ARRAY_REGEX)) {
                type = 'array';
            }
            interfaceDescription.push({ name: name, type: type });
        });
        INTERFACES[interfaceSymbol.name] = interfaceDescription;
    };
    Finder.prototype.visit = function (checker, node) {
        var _this = this;
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
            this.getInterfaceDescription(checker, node);
        }
        else if (node.kind === ts.SyntaxKind.EnumDeclaration) {
            this.getEnumDescription(checker, node);
        }
        else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
            ts.forEachChild(node, function (child) {
                _this.visit(checker, child);
            });
        }
    };
    return Finder;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Finder;
