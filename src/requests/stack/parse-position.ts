// Constants:
const TYPE_GENERIC_REGEX = /(?:a|aninstanceof)<(.*)>/

// Utilities:
import * as os from 'os';
import * as path from 'path';

// Dependencies:
import { getSourceFile } from '../../common/get-source-file';
import { Position } from './position';

export function parsePosition (position: Position): string {
    let sourceFile = getSourceFile(position.path);
    let lines = sourceFile.text.split(os.EOL);

    try {
        return parseLine(lines[position.line]);
    } catch (e) {
        return parseLine(lines[position.line + 1]);
    }
}

function parseLine (line: string): string {
    let [, name] = line.match(TYPE_GENERIC_REGEX);
    return name;
}
