// Dependencies:
import { IneedaProxy } from './ineeda-proxy';
import { getUnproxyValues } from './unproxy-values';
import { Partial } from '../partial';

export function createProxy <T> (values?: Partial<T>, property?: string): T & IneedaProxy<T> {
    let resultBase = { hasOwnProperty, toJSON, toString, unproxy };
    let result = Object.assign(resultBase, getUnproxyValues(), values);

    let proxyBase = property ? function () {} : {};
    return new Proxy(proxyBase, { apply, get, getOwnPropertyDescriptor, set });

    function apply (): void {
        throw new Error(`
            "${property}" is not implemented.
        `);
    }

    function get (target: any, key: any): any {
        if (Object.hasOwnProperty.call(result, key)) {
            return result[key];
        }

        let obj = {};
        if (key in obj) {
            return obj[key];
        }

        if (shouldIgnore(key)) {
            return null;
        }

        result[key] = createProxy(result[key], key);
        return result[key];
    }

    function getOwnPropertyDescriptor (target: any, key: any): any {
        return { configurable: true, enumerable: true, value: get(target, key) };
    }

    function set (target: any, key: any, value: any): boolean {
        result[key] = value;
        return true;
    }

    function unproxy (key: any): T {
        result = Object.assign({}, getUnproxyValues(key), result);
        return this;
    }

    function toJSON (): any {
        return result;
    }
}

function hasOwnProperty (): boolean {
    return true;
}

function shouldIgnore (key: any): boolean {
    return typeof key === 'symbol' || key === 'inspect';
}

function toString (): string {
    return '[object IneedaMock]';
}
