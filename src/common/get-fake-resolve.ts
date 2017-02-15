let cache = {};
let resolve = function (id: string): string {
    let path = cache[id];
    if (path) {
        return path;
    }

    try {
        let resolved = require.resolve(id);
        if (typeof resolved === 'string') {
            return resolved;
        }
    } catch (e) { }

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

    cache[id] = clientWindow.__ineeda__resolve__(id);
    return cache[id];
}

export let fakeResolve = resolve;
