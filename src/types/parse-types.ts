// Constants:
const ANY_TYPE = 'any';
const ARRAY_REGEX = /.*\[\]$/;
const ARRAY_TYPE = 'array';
const CONSTRUCTOR_MEMBER_NAME = '__constructor';
const FUNCTION_REGEX = /\(.*\)\s=>\s.*/;
const FUNCTION_TYPE = 'function';

// Utilities:
import * as path from 'path';

// Dependencies:
import * as ts from 'typescript';
import { FileTypes } from './file-types';
import { getSourceFile } from '../common/get-source-file';
import { getTypeChecker } from '../common/get-type-checker';
import { Request } from '../requests/request';
import { TypeProperty } from './type-property';

let checker: ts.TypeChecker;
let types: FileTypes;
export function parseTypes (request: Request): FileTypes {
    types = {};
    checker = getTypeChecker();

    let sourceFile = getSourceFile(request.path);
    ts.forEachChild(sourceFile, node => visit(node));
    return types;
}

function visit (node: ts.Node): void {
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
        getClassDescription(<ts.ClassDeclaration>node);
    } else if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
        getInterfaceDescription(<ts.InterfaceDeclaration>node);
    } else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
        ts.forEachChild(node, (child: ts.Node) => {
            visit(child);
        });
    }
}

function getClassDescription (node: ts.ClassDeclaration): void {
    // TODO:
    // Need to work out a better way to get the name from the ClassDeclaration.
    let symbol = checker.getSymbolAtLocation(node);
    let classDeclaration = <any>node;
    let classSymbol = <ts.Symbol>(classDeclaration.localSymbol || symbol || classDeclaration.symbol);
    let { name } = classSymbol;

    if (types[name]) {
        return;
    }

    types[name] = node.members
    .filter((member: any): boolean => {
        return (<ts.Symbol>member.symbol).name !== CONSTRUCTOR_MEMBER_NAME;
    })
    .map((member: any): TypeProperty => {
        let symbol = <ts.Symbol>member.symbol;
        return getTypeProperty(symbol);
    });
}

function getInterfaceDescription (node: ts.InterfaceDeclaration): void {
    // TODO:
    // Need to work out a better way to get the name from the InterfaceDeclaration.
    let symbol = checker.getSymbolAtLocation(node);
    let interfaceDeclaration = <any>node;
    let interfaceSymbol = <ts.Symbol>(interfaceDeclaration.localSymbol || symbol || interfaceDeclaration.symbol);
    let { name } = interfaceSymbol;

    if (types[name]) {
        return;
    }
    let interfaceType = checker.getDeclaredTypeOfSymbol(interfaceSymbol);
    let propertySymbols = checker.getPropertiesOfType(interfaceType);
    types[name] = propertySymbols.map(getTypeProperty);
}

function getTypeProperty (symbol: ts.Symbol): TypeProperty {
    let name: string = checker.symbolToString(symbol);
    let type: string = checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration));

    if (type.match(FUNCTION_REGEX)) {
        type = FUNCTION_TYPE;
    }
    if (type.match(ARRAY_REGEX)) {
        type = ARRAY_TYPE;
    }

    // TODO:
    // Need to work out a better way to get the name of an unresolved type.
    if (type === ANY_TYPE) {
        try {
            let [declaration] = symbol.declarations;

            let typeDeclaration = <any>declaration;
            type = typeDeclaration.type.typeName.text;
        } catch (e) { }
    }

    if (!type) {
        type = ANY_TYPE;
    }

    return new TypeProperty(name, type);
}
