// Dependencies:
import * as ts from 'typescript';

let checker: ts.TypeChecker;
export function getTypeChecker (): ts.TypeChecker {
    if (checker) {
        return checker;
    }

    let options: ts.CompilerOptions = { };
    let host: ts.CompilerHost = ts.createCompilerHost(options);
    let program: ts.Program = ts.createProgram([], options, host);
    checker = program.getTypeChecker();

    return checker;
}
