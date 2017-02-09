// Dependencies:
import * as fs from 'fs';

class FakeReadStream { }
class FakeWriteStream { }

function readFile (path: string): string {
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

    return clientWindow.__ineeda__readFile__(path);
}

if (!fs.readFile) {
    Object.assign(fs, {
        readFileSync: readFile,
        ReadStream: FakeReadStream,
        WriteStream: FakeWriteStream
    });
}
