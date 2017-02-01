// Dependencies:
import * as fs from 'fs';

class FakeReadStream { }
class FakeWriteStream { }

function readFile (path: string): string {
    let clientWindow = <any>window;

    if (!clientWindow.__ineeda__readFile__) {
        throw new Error(`Could not read "${path}". \`window.__ineeda__readFile__\` is not defined.`);
    }

    try {
        return clientWindow.__ineeda__readFile__(path);
    } catch (e) {
        throw new Error(`Could not read "${path}".`);
    }
}

if (!fs.readFile) {
    Object.assign(fs, {
        readFileSync: readFile,
        ReadStream: FakeReadStream,
        WriteStream: FakeWriteStream
    });
}
