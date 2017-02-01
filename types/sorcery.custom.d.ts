interface Trace {
    source: string;
    line: number;
    column: number;
    name: string;
}

interface Chain {
    trace (line: number, column: number): Trace;
}

interface Sorcery {
    loadSync (path: string): Chain;
}

declare var sorcery: Sorcery;

declare module "sorcery" {
    export = sorcery;
}
