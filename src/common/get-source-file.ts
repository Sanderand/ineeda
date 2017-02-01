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

    let content = ts.sys.readFile(path);
    let setParentNodes = true;
    let sourceFile = ts.createSourceFile(path, content, null, setParentNodes);
    (<any>ts).bindSourceFile(sourceFile, {});

    SOURCE_FILES[path] = sourceFile;
    return sourceFile;
}
