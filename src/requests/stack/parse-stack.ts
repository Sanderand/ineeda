// Constants:
const CALLER_PATH_REGEX = /(?:at.*(?:\s|\())*(.*):(\d+):(\d+)/;
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

    let callerLine;
    try {
        let stackDepth = stackLines.findIndex(findRelevantStackLine);
        callerLine = stackLines[stackDepth + 1];
    } catch (e) {
        let formattedStack = stackLines.join('\n                ');
        throw new Error(`
            Could not find call to "ineeda" in stacktrace:

                ${formattedStack}
        `);
    }

    let columnStr, lineStr, source;
    try {
        let sourceMapPath;
        [, sourceMapPath, lineStr, columnStr] = callerLine.match(CALLER_PATH_REGEX);
        [, source] = sourceMapPath.match(SOURCE_MAP_FILE_REGEX);
        source = source.replace(URL_FILE_REGEX, '');
    } catch (e) {
        throw new Error(`
            Could not parse "ineeda" call location:

                ${callerLine}
        `)
    }

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
    return [findIneedaCall, findIneedaFile]
    .reduce((p, n) => p || n(stackLine), false);
}

function findIneedaCall (stackLine: string): boolean {
    return stackLine.startsWith('at Object.ineeda');
}

function findIneedaFile (stackLine: string): boolean {
    return stackLine.includes('src/ineeda.');
}
