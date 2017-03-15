// Constants:
const UNPROXY_VALUES = new Map<any, any>();

// Dependencies:
import { IneedaUnproxyOptions } from './ineeda-unproxy-options';

export function setUnproxyValues (options: IneedaUnproxyOptions): void {
    let key = options.when || UNPROXY_VALUES;
    let unproxyValues = getUnproxyValues(key);
    UNPROXY_VALUES.set(key, Object.assign({}, unproxyValues, options.values));
}

export function getUnproxyValues (key?: any): any {
    return UNPROXY_VALUES.get(key || UNPROXY_VALUES);
}
