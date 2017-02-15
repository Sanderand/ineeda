// Constants:
const JS_EXTENSION_REGEX = /\.js$/;
const TS_EXTENSION = '.ts';

// Utilities:
import * as path from 'path';

// Dependencies:
import { fakeResolve } from '../common/get-fake-resolve';
import { parseImports } from './imports/parse-imports';
import { parsePosition } from './stack/parse-position';
import { parseStack } from './stack/parse-stack';
import { Request } from './request';

export const getRequest = { fromImport, fromStack };

function fromImport (request: Request): Request {
    let { type , name } = request
    let currentFilePath = request.path;
    let importDescriptions = parseImports(currentFilePath);

    let importDescription = importDescriptions.find(i => i.name === type);
    if (!importDescription) {
        throw new Error(`
            Could not find an import matching \`${type}\` in "${currentFilePath}"
        `);
    }

    let importPath = importDescription.path;

    if (importPath.startsWith('.') && !importPath.endsWith(TS_EXTENSION)) {
        importPath = `${importPath}${TS_EXTENSION}`
    }
    if (!importPath.startsWith('.')) {
        let resolvePath = importPath;
        importPath = fakeResolve(resolvePath);
        if (!importPath) {
            throw new Error(`Could not resolve "${resolvePath}".`);
        }
    }
    importPath = importPath.replace(JS_EXTENSION_REGEX, TS_EXTENSION);

    return new Request({
        name,
        path: path.resolve(path.dirname(currentFilePath), importPath),
        type
    });
}

function fromStack (): Request {
    let position = parseStack();
    let type = parsePosition(position)
    return new Request({
        path: position.path,
        type
    });
}
