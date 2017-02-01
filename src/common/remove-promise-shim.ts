// `sorcery` pulls in the es6promise shim, which overwrites
// ZoneAwarePromise in an Angular application.

// We check for an exisitng Promise implementation:
let existingPromise = global.Promise;

// Import sorcery:
try {
    require('sorcery');
} catch (e) {}

// And restore the original Promise implementation:
if (existingPromise) {
    global.Promise = existingPromise;
}
