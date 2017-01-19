// Dependencies:
import * as ts from 'typescript';
import { getSourceFile } from '../../common/get-source-file';
import { Import } from './import';

let imports: Array<Import>;
export function parseImports (path: string): Array<Import> {
    imports = [];
    
    let sourceFile = getSourceFile(path);
    ts.forEachChild(sourceFile, node => {
        visit(node);
    });
    return imports;
}

function visit (node: ts.Node): void {
    if (node.kind === ts.SyntaxKind.ImportDeclaration) {
        getImportDescription(<ts.ImportDeclaration>node);
    }
}

function getImportDescription (node: ts.ImportDeclaration): void {
    // TODO:
    // Need to work out a better way to get:
    //     * node.moduleSpecifier.text
    //     * node.importClause.namedBindings.elements
    //     * node.importClause.namedBindings.name
    let importDeclaration = <any>node;
    let { importClause } = importDeclaration;
    let relativePath = importDeclaration.moduleSpecifier.text;

    if (importClause.name) {
        imports.push(new Import(importDeclaration.importClause.name.text, relativePath));
    }

    if (importClause.namedBindings) {
        let { namedBindings } = importClause;

        if (namedBindings.elements) {
            let elements: Array<ts.ImportSpecifier> = namedBindings.elements;
            elements.forEach((element: ts.ImportSpecifier) => {
                imports.push(new Import(element.name.text, relativePath))
            });
        } else {
            imports.push(new Import(namedBindings.name.text, relativePath))
        }
    }
}
