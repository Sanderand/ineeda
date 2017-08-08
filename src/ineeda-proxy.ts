// Dependencies:
import { getGlobalInterceptors, getInterceptors, getInterceptorsWithKey } from './ineeda-interceptors';
import { IneedaInterceptorFunction, IneedaInterceptor, IneedaProxy, NOOP, RecursivePartial } from './ineeda-types';

export function createProxy <T> (valuesExternal: RecursivePartial<T>, key?: keyof T | keyof IneedaProxy<T>): T & IneedaProxy<T> {
    valuesExternal = valuesExternal || <RecursivePartial<T>>{};
    let valuesInternal: IneedaProxy<T> = { intercept, reset, toJSON, toString };

    let interceptors: Array<IneedaInterceptorFunction<T, keyof T>>;
    let intercepted: Array<keyof T> = [];

    reset();
    let proxyBase = key ? NOOP : {};
    return new Proxy(proxyBase, { apply, get, getOwnPropertyDescriptor, set });

    function apply (): void {
        throw new Error(`
            "${key}" is not implemented.
        `);
    }

    function get (target: any, key: keyof T | keyof IneedaProxy<T>): any {
        if (_isInternalKey(key)) {
            return valuesInternal[key];
        }
        if (_isExternalKey(key)) {
            return _runInterceptors(target, key, valuesExternal[key]);
        }

        let obj = {};
        if (key in obj) {
            return obj[<keyof Object>key];
        }
        let func = NOOP;
        if (key in func) {
            return func[<keyof Function>key];
        }

        if (_isSymbol(key)) {
            return null;
        }

        return _runInterceptors(target, key, createProxy(valuesExternal[key], key));
    }

    function getOwnPropertyDescriptor (target: any, key: keyof T): PropertyDescriptor {
        return { configurable: true, enumerable: true, value: get(target, key) };
    }

    // function hasOwnProperty (): boolean {
    //     return true;
    // }

    function intercept (interceptorOrKey: IneedaInterceptor<T> | any): T {
        interceptors = interceptors.concat(getInterceptorsWithKey<T>(<any>interceptorOrKey) || getInterceptors(<IneedaInterceptor<T>>interceptorOrKey));
        return this;
    }

    function reset (): T {
        interceptors = getGlobalInterceptors();
        return this;
    }

    function set (target: any, key: keyof T, value: any): boolean {
        valuesExternal[key] = value;
        return true;
    }

    function toJSON (): any {
        return valuesExternal;
    }

    function toString (): string {
        return '[object IneedaMock]';
    }

    function _isExternalKey (key: keyof T | keyof IneedaProxy<T>): key is keyof T {
        return Object.hasOwnProperty.call(valuesExternal, key);
    }

    function _isInternalKey (key: keyof T | keyof IneedaProxy<T>): key is keyof IneedaProxy<T> {
        return Object.hasOwnProperty.call(valuesInternal, key);
    }

    function _isSymbol (key: PropertyKey): boolean {
        return typeof key === 'symbol' || key === 'inspect';
    }

    function _runInterceptors (target: any, key: keyof T, value: any): any {
        if (!intercepted.includes(key)) {
            valuesExternal[key] = interceptors.reduce((p, n) => {
                return n(p, key, valuesExternal, target);
            }, value);
            intercepted.push(key);
        }
        return valuesExternal[key];
    }
}
