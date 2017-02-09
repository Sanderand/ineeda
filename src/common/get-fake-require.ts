function resolve (id: string): string {
    let clientWindow = <any>window;

    if (!clientWindow.__ineeda__resolve__) {
        throw new Error(`
            Could not resolve "${id}". \`window.__ineeda__resolve__\` is not defined.
        `);
    }

    if (typeof clientWindow.__ineeda__resolve__ !== 'function') {
        throw new Error(`
            Could not read "${id}". \`window.__ineeda__resolve__\` is not a function.
        `);
    }

    return clientWindow.__ineeda__resolve__(id);
}

require.resolve = require.resolve || resolve;

export let fakeRequire = require;
