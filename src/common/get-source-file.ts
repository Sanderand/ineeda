// Constants:
const JS_EXTENSION = '.js';
const TS_EXTENSION_REGEX = /\.ts$/;

// Utilities:
import './get-fake-sys';

// Dependencies:
import * as ts from 'typescript';
import { SourceFiles } from './source-files';

let SOURCE_FILES: SourceFiles = {};
export function getSourceFile (path: string): ts.SourceFile {
    if (SOURCE_FILES[path]) {
        return SOURCE_FILES[path];
    }

    let tsPath = path;
    let jsPath = path.replace(TS_EXTENSION_REGEX, JS_EXTENSION);

    let content = ts.sys.readFile(tsPath);
    content = content || ts.sys.readFile(jsPath);
    if (!content) {
        throw new Error(`
            Could not read source file! Tried:
                ${tsPath},
                ${jsPath}
        `);
    }

    let setParentNodes = true;
    let sourceFile = ts.createSourceFile(path, content, null, setParentNodes);
    (<any>ts).bindSourceFile(sourceFile, {});

    SOURCE_FILES[path] = sourceFile;
    return sourceFile;
}
