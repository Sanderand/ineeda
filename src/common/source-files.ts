// Dependencies:
import * as ts from 'typescript';

export interface SourceFiles {
    [path: string]: ts.SourceFile
};
