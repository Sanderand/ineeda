// Dependencies:
import * as ts from 'typescript';

class FakeSys {
    getCurrentDirectory (): string {
        return '';
    }

    getExecutingFilePath (): string {
        return '';
    }

    readFile (path: string): string {
        let clientWindow = <any>window;

        if (!clientWindow.__ineeda__readFile__(path)) {
            throw new Error(`Could not read "${path}". \`window.__ineeda__readFile__\` is not defined.`);
        }

        try {
            return clientWindow.__ineeda__readFile__(path);
        } catch (e) {
            throw new Error(`Could not read "${path}".`);
        }
    }
}

// Add FakeSys for browser:
let typescript = <any>ts;
typescript.sys = typescript.sys || new FakeSys();
