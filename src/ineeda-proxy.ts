// Dependencies:
import { getGlobalInterceptors, getInterceptors, getInterceptorsWithKey } from './ineeda-interceptors';
import { IneedaInterceptorFunction, IneedaInterceptor, IneedaProxy, NOOP, Partial } from './ineeda-types';

export function createProxy <T> (values: Partial<T>, key?: PropertyKey): T & IneedaProxy<T> {
    let valuesInternal = { intercept, toJSON, toString };
    let valuesExternal = Object.assign({}, values);

    let interceptors: Array<IneedaInterceptorFunction>;
    let intercepted: Array<PropertyKey> = [];

    reset();
    let proxyBase = key ? NOOP : {};
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
        if (Object.hasOwnProperty.call(valuesExternal, key)) {
            return _runInterceptors(target, key, valuesExternal[key]);
        }

        let obj = {};
        if (key in obj) {
            return obj[key];
        }
        let func = NOOP;
        if (key in func) {
            return func[key];
        }

        if (_isSymbol(key)) {
            return null;
        }

        return _runInterceptors(target, key, createProxy(valuesExternal[key], key));
    }

    function getOwnPropertyDescriptor (target: any, key: PropertyKey): PropertyDescriptor {
        return { configurable: true, enumerable: true, value: get(target, key) };
    }

    // function hasOwnProperty (): boolean {
    //     return true;
    // }

    function intercept (interceptorOrKey: IneedaInterceptor | any): T {
        interceptors = interceptors.concat(getInterceptorsWithKey(interceptorOrKey) || getInterceptors(interceptorOrKey));
        return this;
    }

    function reset (): T {
        interceptors = getGlobalInterceptors();
        return this;
    }

    function set (target: any, key: PropertyKey, value: any): boolean {
        valuesExternal[key] = value;
        return true;
    }

    function toJSON (): any {
        return valuesExternal;
    }

    function toString (): string {
        return '[object IneedaMock]';
    }

    function _isSymbol (key: PropertyKey): boolean {
        return typeof key === 'symbol' || key === 'inspect';
    }

    function _runInterceptors (target: any, key: PropertyKey, value: any): void {
        if (!intercepted.includes(key)) {
            valuesExternal[key] = interceptors.reduce((p, n) => {
                return n(p, key, valuesExternal, target);
            }, value);
            intercepted.push(key);
        }
        return valuesExternal[key];
    }
}
