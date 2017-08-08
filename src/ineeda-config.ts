// Dependencies:
import { IneedaConfigOptions, IneedaInterceptor, IneedaUnproxyOptions } from './ineeda-types';

// Constants:
const INTERCEPTORS: Array<IneedaInterceptor> = [];
const UNPROXY_VALUES: Map<any, Array<PropertyKey>> = new Map();

export function getInterceptors (): Array<IneedaInterceptor> {
    return INTERCEPTORS;
}

export function getUnproxied (key?: any): any {
    let unproxiesKeys = UNPROXY_VALUES.get(key || UNPROXY_VALUES) || [];
    let unproxied = {};
    unproxiesKeys.forEach(key => unproxied[key] = null);
    return unproxied;
}

export function resetConfig (): void {
    INTERCEPTORS.length = 0;
    UNPROXY_VALUES.clear();
}

export function setConfig (options: IneedaConfigOptions): void {
    resetConfig();

    if (options.intercept instanceof Function) {
        INTERCEPTORS.push(options.intercept);
    }

    let unproxy = options.unproxy || [];
    if (Array.isArray(unproxy)) {
        unproxy.forEach(unproxy => {
            _setUnproxyValues(unproxy);
        });
    } else {
        _setUnproxyValues(unproxy);
    }
}

function _setUnproxyValues (options: IneedaUnproxyOptions): void {
    let key = options.when || UNPROXY_VALUES;
    UNPROXY_VALUES.set(key, [].concat(UNPROXY_VALUES.get(key) || [], options.keys));
}
