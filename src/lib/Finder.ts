/// <reference path="../_references.d.ts" />
'use strict';

// Interfaces:
import IEnums from './IEnums';
import IEnumDescription from './IEnumDescription';
import IFinder from './IFinder';
import IInterfaces from './IInterfaces';
import IPropertyDescription from './IPropertyDescription';

// Constants:
const ARRAY_REGEX: RegExp = /.*\[\]$/;
const ENUMS: IEnums = {};
const FUNCTION_REGEX: RegExp = /\(.*\)\s=>\s.*/;
const INTERFACES: IInterfaces = {};

// Dependencies:
import * as ts from 'typescript';

export default class Finder implements IFinder {
    public findTypes (path?: string): void {
        let files: Array<string> = [];
        if (path) {
            files.push(path);
        }

        let program: ts.Program = ts.createProgram(files, {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES6
        });
        let checker: ts.TypeChecker = program.getTypeChecker();

        let sourceFiles: Array<ts.SourceFile> = program.getSourceFiles();
        sourceFiles.forEach((sourceFile: ts.SourceFile) => {
            ts.forEachChild(sourceFile, (node: ts.Node) => {
                this.visit(checker, node);
            });
        });
    }

    public getEnum (name: string): IEnumDescription {
        return ENUMS[name];
    }

    public getInterface (name: string): Array<IPropertyDescription> {
        return INTERFACES[name];
    }

    private getEnumDescription (checker: ts.TypeChecker, node: ts.Node): void {
        let enumSymbol: ts.Symbol = checker.getSymbolAtLocation((<ts.EnumDeclaration>node).name);

        if (ENUMS[enumSymbol.name]) {
            return;
        }

        let enumDescription: IEnumDescription = {
            type: 'enum',
            values: []
        };
        (<ts.EnumDeclaration>node).members.forEach((member: ts.EnumMember, index: number) => {
            let value: number;
            if (member.initializer) {
                value = parseInt((<ts.Identifier>member.initializer).text, 10);
            } else {
                value = index;
            }

            enumDescription.values.push(value);
        });

        ENUMS[enumSymbol.name] = enumDescription;
    }

    private getInterfaceDescription (checker: ts.TypeChecker, node: ts.Node): void {
        let interfaceSymbol: ts.Symbol = checker.getSymbolAtLocation((<ts.InterfaceDeclaration>node).name);

        if (INTERFACES[interfaceSymbol.name]) {
            return;
        }

        let interfaceDescription: Array<IPropertyDescription> = [];

        let interfaceType: ts.Type = checker.getDeclaredTypeOfSymbol(interfaceSymbol);
        let propertySymbols: Array<ts.Symbol> = checker.getPropertiesOfType(interfaceType);

        propertySymbols.forEach((propertySymbol: ts.Symbol) => {
            let name: string = checker.symbolToString(propertySymbol);
            let type: string = checker.typeToString(checker.getTypeOfSymbolAtLocation(propertySymbol, propertySymbol.valueDeclaration));

            if (type.match(FUNCTION_REGEX)) {
                type = 'function';
            }
            if (type.match(ARRAY_REGEX)) {
                type = 'array';
            }

            interfaceDescription.push({ name, type });
        });

        INTERFACES[interfaceSymbol.name] = interfaceDescription;
    }

    private visit (checker: ts.TypeChecker, node: ts.Node): void {
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
            this.getInterfaceDescription(checker, node);
        } else if (node.kind === ts.SyntaxKind.EnumDeclaration) {
            this.getEnumDescription(checker, node);
        } else if (node.kind === ts.SyntaxKind.ModuleDeclaration) {
            ts.forEachChild(node, (child: ts.Node) => {
                this.visit(checker, child);
            });
        }
    }
}
