// Dependencies:
import * as ts from 'typescript';
import { EnumValue } from './enum-value';
import { FileEnums } from './file-enums';
import { getTypeChecker } from '../common/get-type-checker';
import { getSourceFile } from '../common/get-source-file';
import { Request } from '../requests/request';

let checker: ts.TypeChecker
let enums: FileEnums;
export function parseEnums (request: Request): FileEnums {
    enums = {};
    checker = getTypeChecker();

    let sourceFile = getSourceFile(request.path);
    ts.forEachChild(sourceFile, node => visit(node));
    return enums;
}

function visit (node: ts.Node): void {
    if (node.kind === ts.SyntaxKind.EnumDeclaration) {
        getEnumDescription(<ts.EnumDeclaration>node);
    } else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
        ts.forEachChild(node, child => visit(child));
    }
}

function getEnumDescription (node: ts.EnumDeclaration): void {
    let symbol = checker.getSymbolAtLocation(node.name);
    let enumSymbol = <ts.Symbol>(<any>node).localSymbol || symbol;
    let { name } = enumSymbol;

    if (enums[name]) {
        return;
    }
    enums[name] = node.members.map(getEnumValue);
}

function getEnumValue (member: ts.EnumMember, index: number): EnumValue {
    let value: number;
    if (member.initializer) {
        value = parseInt((<ts.Identifier>member.initializer).text, 10);
    } else {
        value = index;
    }
    return new EnumValue(value);
}
