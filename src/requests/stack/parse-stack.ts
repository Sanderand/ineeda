// Constants:
const CALLER_PATH_REGEX = /(?:at.*(?:\s|\())*(.*):(\d+):(\d+)/;
const SOURCE_MAP_FILE_REGEX = /^(?:.*file:)?(.*)$/;
const URL_FILE_REGEX = /.*:\/\/.*:\d+/;

// Utilities:
import '../../common/remove-promise-shim';
import { isUndefined } from 'util';

// Dependencies:
import { Position } from './position';
import * as sorcery from 'sorcery';

let mappingCache = {};
let traceCache = {};
export function parseStack (): Position {
    let { stack } = new Error();

    let stackLines: Array<string> = stack.split(/\n/)
    .map(l => l.trim());

    let callerLine: string;
    let stackDepth = stackLines.findIndex(findRelevantStackLine);
    if (stackDepth === -1) {
        let formattedStack = stackLines.join('\n                ');
        throw new Error(`
            Could not find call to "ineeda" in stacktrace:

                ${formattedStack}
        `);
    }
    callerLine = stackLines[stackDepth + 1];

    let columnStr: string;
    let lineStr: string;
    let source: string;
    try {
        let sourceMapPath: string;
        [, sourceMapPath, lineStr, columnStr] = callerLine.match(CALLER_PATH_REGEX);
        [, source] = sourceMapPath.match(SOURCE_MAP_FILE_REGEX);
        source = source.replace(URL_FILE_REGEX, '');
    } catch (e) {
        throw new Error(`
            Could not parse "ineeda" call location:

                ${callerLine}
        `);
    }

    let mapping = mappingCache[source];
    if (isUndefined(mapping)) {
        mapping = sorcery.loadSync(source);
        mappingCache[source] = mapping;
    }

    let column = +columnStr - 1;
    let line = +lineStr - 1;

    if (mapping) {
        let traceKey = `${mapping.node.file}.${line}.${column}`;
        let trace = traceCache[traceKey]
        if (isUndefined(trace)) {
            trace = mapping.trace(line, column);
            traceCache[traceKey] = trace;
        }
        column = trace.column;
        line = trace.line;
        source = trace.source;
    }
    return new Position(column, line, source);
}

function findRelevantStackLine (stackLine: string): boolean {
    return [findIneedaInstanceCall, findIneedaFactoryCall, findIneedaFile]
    .reduce((p, n) => p || n(stackLine), false);
}

function findIneedaInstanceCall (stackLine: string): boolean {
    return stackLine.startsWith('at Object.instance');
}

function findIneedaFactoryCall (stackLine: string): boolean {
    return stackLine.startsWith('at Function.factory');
}

function findIneedaFile (stackLine: string): boolean {
    return stackLine.includes('src/ineeda.');
}
