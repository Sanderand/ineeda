// Constants:
const TYPE_GENERIC_REGEX = /^(a|aninstanceof)<(.*)>/

// Utilities:
import * as os from 'os';
import * as path from 'path';

// Dependencies:
import { getSourceFile } from '../../common/get-source-file';
import { Position } from './position';

export function parsePosition (position: Position): string {
    let sourceFile = getSourceFile(position.path);
    let lines = sourceFile.text.split(os.EOL);
    let line = lines[position.line];
    let call = line.substring(position.column);
    let [, , name] = call.match(TYPE_GENERIC_REGEX);

    return name;
}
