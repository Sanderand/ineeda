/// <reference path="./_references.d.ts" />

// Constants:
const ARRAY_REGEX = /.*\[\]$/;
const FUNCTION_REGEX = /\(.*\)\s=>\s.*/;
const INTERFACES = {};

// Dependencies:
import * as path from 'path';
import * as ts from 'typescript';

function findTypes (path?: string): void {
	let files = [];
	if (path) {
	   files.push(path);
	}

    let program = ts.createProgram(files, {
		target: ts.ScriptTarget.ES6,
		module: ts.ModuleKind.CommonJS
	});
    let checker = program.getTypeChecker();

	let sourceFiles = program.getSourceFiles();
	sourceFiles.forEach((sourceFile) => {
		ts.forEachChild(sourceFile, (node: ts.Node) => {
			visit(checker, node);
		});
    });
}

function visit (checker, node: ts.Node) {
	if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
		let interfaceSymbol = checker.getSymbolAtLocation((<ts.InterfaceDeclaration>node).name);
		
		if (INTERFACES[interfaceSymbol.name]) {
			return;
		}
		
		let properties = [];
		
		let interfaceType = checker.getDeclaredTypeOfSymbol(interfaceSymbol);
		let propertySybmbols = checker.getPropertiesOfType(interfaceType);
		
		propertySybmbols.forEach((propertySymbol) => {
			let name = checker.symbolToString(propertySymbol);
			let type = checker.typeToString(checker.getTypeOfSymbolAtLocation(propertySymbol, propertySymbol.valueDeclaration));
			
			if (type.match(FUNCTION_REGEX)) {
				type = 'function';
			}
			if (type.match(ARRAY_REGEX)) {
				type = 'array';
			}
			
			properties.push({ name, type });
		});
		
		INTERFACES[interfaceSymbol.name] = properties;
	} else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
		ts.forEachChild(node, (node: ts.Node) => {
			visit(checker, node);
		});
	}
}

function getErrorMethod (className, methodName) {
	return () => {
		throw new Error(`"${className}.${methodName}" is n.`);
	}
}

function getValue (type): any {
	if (type === 'any') {
	    return {};
	} else if (type === 'array') {
		return [];
	} else if (type === 'boolean') {
	    return false;
	} else if (type === 'number') {
	    return 0;
	} else if (type === 'string') {
	    return '';
	}
}

findTypes();

export default function hereYouGo<T> (interfacePath?, name?): T {
	if (interfacePath) {
		findTypes(interfacePath);
	}
	
	if (!name) {
		name = interfacePath.split(path.sep).slice(-1);
	}
	
	let properties = INTERFACES[name];
	
	let result = {};
	properties.forEach((property) => {
		let value;
		if (property.type === 'function') {
			value = getErrorMethod(name, property.name);
		} else {
			value = getValue(property.type);
		}
		if (value != null) {
			result[property.name] = value;
		} else {
			Object.defineProperty(result, property.name, {
				get: () => {
					return hereYouGo(null, property.type);
				}
			});
		}
	});
	return <T>result;
}
