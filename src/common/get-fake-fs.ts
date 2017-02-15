// Dependencies:
import * as fs from 'fs';

class FakeReadStream { }
class FakeWriteStream { }

let cache = {};
function readFile (path: string): string {
    let file = cache[path];
    if (file) {
        return file;
    }

    let clientWindow = <any>window;
    if (!clientWindow.__ineeda__readFile__) {
        throw new Error(`
            Could not read "${path}". \`window.__ineeda__readFile__\` is not defined.
        `);
    }

    if (typeof clientWindow.__ineeda__readFile__ !== 'function') {
        throw new Error(`
            Could not read "${path}". \`window.__ineeda__readFile__\` is not a function.
        `);
    }

    cache[path] = clientWindow.__ineeda__readFile__(path);
    return cache[path];
}

if (!fs.readFile) {
    Object.assign(fs, {
        readFileSync: readFile,
        ReadStream: FakeReadStream,
        WriteStream: FakeWriteStream
    });
}
