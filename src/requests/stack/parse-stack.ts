// Constants:
const CALLER_PATH_REGEX = /\((.*):(\d+):(\d+)\)/;
const SOURCE_MAP_FILE_REGEX = /^(?:.*file:)?(.*)$/;
const URL_FILE_REGEX = /.*:\/\/.*:\d+/;

// Utiltieis:
import '../../common/remove-promise-shim';

// Dependencies:
import { Position } from './position';
import * as sorcery from 'sorcery';

export function parseStack (): Position {
    let { stack } = new Error();

    let stackLines = stack.split(/\n/)
    .map(l => l.trim())

    let stackDepth = stackLines.findIndex(findRelevantStackLine);
    let callerLine = stackLines[stackDepth + 1];

    let [, sourceMapPath, lineStr, columnStr] = callerLine.match(CALLER_PATH_REGEX);
    let [, source] = sourceMapPath.match(SOURCE_MAP_FILE_REGEX);
    source = source.replace(URL_FILE_REGEX, '');

    let mapping = sorcery.loadSync(source);

    let column = +columnStr - 1;
    let line = +lineStr - 1;

    if (mapping) {
        let trace = mapping.trace(line, column);
        column = trace.column;
        line = trace.line;
        source = trace.source;
    }
    return new Position(column, line, source);
}

function findRelevantStackLine (stackLine: string): boolean {
    return stackLine.includes('src/ineeda.');
}
