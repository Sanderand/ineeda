// Dependencies:
import { getGlobalInterceptors, getInterceptors, getInterceptorsForToken } from './ineeda-interceptors';
import { DeepPartial, IneedaInterceptor, IneedaInterceptorFunction, IneedaInterceptorOrToken, IneedaInterceptorToken, IneedaKey, IneedaProxy, NOOP } from './ineeda-types';

// Constants:
const DEFAULT_PROPERTY_DESCRIPTION: PropertyDescriptor = { configurable: true, enumerable: true, writable: true };

export function createProxy <T, K extends IneedaKey<T>> (valuesExternal: DeepPartial<T>, key?: IneedaKey<T>): T & IneedaProxy<T> {
    valuesExternal = valuesExternal || <DeepPartial<T>>{};
    let valuesInternal: IneedaProxy<T> = { hasOwnProperty, intercept, reset, toJSON, toString };

    let interceptors: Array<IneedaInterceptorFunction<T, keyof T>>;
    let intercepted: Array<IneedaKey<T>> = [];

    reset();
    let proxyBase = key ? NOOP : {};
    return new Proxy(<any>proxyBase, { apply, get, getOwnPropertyDescriptor, ownKeys, set });

    function apply (): void {
        throw new Error(`
            "${key}" is not implemented.
        `);
    }

    function get <K extends keyof T> (target: T, key: IneedaKey<T>): any {
        if (_isInternalKey(key)) {
            return valuesInternal[key];
        }
        if (_isExternalKey(key)) {
            return _runInterceptors(target, key, valuesExternal[key]);
        }
        if (_isObjectKey(key) || _isSymbol(key)) {
            return {}[key];
        }
        if (_isFunctionKey(key)) {
            return NOOP[key];
        }

        return _runInterceptors(target, <K>key, createProxy<K, IneedaKey<K>>(null, key));
    }

    function getOwnPropertyDescriptor (target: T, key: keyof T): PropertyDescriptor {
        let descriptor = Object.getOwnPropertyDescriptor(target, key) || DEFAULT_PROPERTY_DESCRIPTION;
        descriptor.value = get(target, key);
        return descriptor;
    }

    function hasOwnProperty (): boolean {
        return true;
    }

    function intercept (interceptorOrToken: IneedaInterceptorOrToken<T>): T {
        if (_hasInterceptorForToken(interceptorOrToken)) {
            interceptors = interceptors.concat(getInterceptorsForToken<T>(interceptorOrToken));
        } else {
            interceptors = interceptors.concat(getInterceptors<T>(<IneedaInterceptor<T>>interceptorOrToken));
        }
        return this;
    }

    function ownKeys (): Array<string> {
        return ['prototype', ...Object.keys(valuesExternal)];
    }

    function reset (): T {
        interceptors = getGlobalInterceptors();
        return this;
    }

    function set (target: T, key: keyof T, value: any): boolean {
        valuesExternal[key] = value;
        return true;
    }

    function toJSON (): DeepPartial<T> {
        return valuesExternal;
    }

    function toString (): string {
        return '[object IneedaMock]';
    }

    function _hasInterceptorForToken (token: IneedaInterceptorOrToken<T>): token is IneedaInterceptorToken {
        return !!getInterceptorsForToken<T>(token);
    }

    function _isFunctionKey (key: IneedaKey<T>): key is keyof Function {
        return key in NOOP;
    }

    function _isExternalKey (key: IneedaKey<T>): key is keyof T {
        return !!valuesExternal[<any>key];
    }

    function _isInternalKey (key: IneedaKey<T>): key is keyof IneedaProxy<T> {
        return Object.hasOwnProperty.call(valuesInternal, key);
    }

    function _isObjectKey (key: IneedaKey<T>): key is keyof Object {
        return key in {};
    }

    function _isObject (value: any): boolean {
        return typeof value === 'object';
    }

    function _isSymbol (key: PropertyKey): boolean {
        return typeof key === 'symbol' || key === 'inspect';
    }

    function _runInterceptors <K extends keyof T> (target: T, key: K, value: any): any {
        if (!intercepted.includes(key)) {
            let result = interceptors.reduce((p, n) => {
                return n(p, key, valuesExternal, target);
            }, value);
            intercepted.push(key);
            // valuesExternal[key] = _isObject(result) ? createProxy(result) : result;
            valuesExternal[key] = result;
        }
        // tslint:disable
        console.log(valuesExternal);
        return valuesExternal[key];
    }
}
