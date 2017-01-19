// Constants:
const CALLER_PATH_REGEX = /\((.*):(\d+):(\d+)\)$/;
const STACK_DEPTH = 4;

// Dependencies:
import { Position } from './position';
import 'source-map-support/register';

export function parseStack (): Position {
    let { stack } = new Error();

    let stackLines = stack.split(/\n/)
    .map(l => l.trim())

    let callerLine = stackLines[STACK_DEPTH];

    let [, path, lineStr, columnStr] = callerLine.match(CALLER_PATH_REGEX);
    let column = +columnStr - 1;
    let line = +lineStr - 1;

    return new Position(column, line, path);
}
