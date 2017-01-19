// Dependencies:
import * as ts from 'typescript';

export function normalisePath (path: string) {
    if (ts.sys && ts.sys.useCaseSensitiveFileNames) {
        return path;
    } else {
        return path.toLowerCase();
    }
}
