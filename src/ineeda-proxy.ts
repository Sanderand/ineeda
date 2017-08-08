// Dependencies:
import { getInterceptors, getUnproxied } from './ineeda-config';
import { IneedaInterceptor, IneedaProxy, Partial } from './ineeda-types';

export function createProxy <T> (valuesExternal: Partial<T>, key?: PropertyKey): T & IneedaProxy<T> {
    let valuesInternal = { hasOwnProperty, intercept, toJSON, toString, unproxy };
    let values = Object.assign(getUnproxied(), valuesExternal);

    let interceptors = getInterceptors();
    let intercepted: Array<PropertyKey> = [];

    let proxyBase = key ? function () {} : {};
    return new Proxy(proxyBase, { apply, get, getOwnPropertyDescriptor, set });

    function apply (): void {
        throw new Error(`
            "${key}" is not implemented.
        `);
    }

    function get (target: any, key: PropertyKey): any {
        if (Object.hasOwnProperty.call(valuesInternal, key)) {
            return valuesInternal[key];
        }
        if (Object.hasOwnProperty.call(values, key)) {
            return runInterceptors(target, key, values[key]);
        }

        let obj = {};
        if (key in obj) {
            return obj[key];
        }
        let func = () => {};
        if (key in func) {
            return func[key];
        }

        // if (_shouldIgnore(key)) {
        //     return null;
        // }

        return runInterceptors(target, key, createProxy(values[key], key));
    }

    function getOwnPropertyDescriptor (target: any, key: PropertyKey): PropertyDescriptor {
        return { configurable: true, enumerable: true, value: get(target, key) };
    }

    function hasOwnProperty (): boolean {
        return true;
    }

    function intercept (interceptor: IneedaInterceptor): T {
        interceptors.push(interceptor);
        return this;
    }

    function runInterceptors (target: any, key: PropertyKey, value: any): void {
        if (!intercepted.includes(key)) {
            values[key] = interceptors.reduce((p, n) => {
                return n(p, key, values, target);
            }, value);
            intercepted.push(key);
        }
        return values[key];
    }

    function set (target: any, key: PropertyKey, value: any): boolean {
        values[key] = value;
        return true;
    }

    function unproxy (key: any): T {
        values = Object.assign(getUnproxied(key), values);
        return this;
    }

    function toJSON (): any {
        return values;
    }

    function toString (): string {
        return '[object IneedaMock]';
    }
}

function _shouldIgnore (key: PropertyKey): boolean {
    return key === 'inspect';
}
