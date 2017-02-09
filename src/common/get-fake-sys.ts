// Utilities:
import './get-fake-fs';

// Dependencies:
import * as fs from 'fs';
import * as ts from 'typescript';

class FakeSys {
    directoryExists (): boolean {
        return false;
    }

    getCurrentDirectory (): string {
        return '';
    }

    getExecutingFilePath (): string {
        return '';
    }

    readFile (path: string): string {
        let file = fs.readFileSync(path);
        return file ? file.toString() : null;
    }
}

// Add FakeSys for browser:
let typescript = <any>ts;
typescript.sys = typescript.sys || new FakeSys();
