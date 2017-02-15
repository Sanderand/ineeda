let resolve = function (id: string): string {
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

    return clientWindow.__ineeda__resolve__(id);
}

export let fakeResolve = resolve;
