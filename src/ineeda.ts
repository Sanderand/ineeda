// Dependencies:
import { resetInterceptors, setInterceptors, setInterceptorsWithKey } from './ineeda-interceptors';
import { createProxy } from './ineeda-proxy';
import { IneedaInterceptor, IneedaFactory, IneedaProxy, RecursivePartial } from './ineeda-types';

export function factory <T> (values?: RecursivePartial<T>): IneedaFactory<T> {
    let instances: Array<T & IneedaProxy<T>> = [];
    let factory: IneedaFactory<T> = function ineedaFactory (): T & IneedaProxy<T> {
        let mock = instance<T>(values);
        instances.push(mock);
        return mock;
    };
    factory.instances = instances;
    factory.getLatest = () => factory.instances[factory.instances.length - 1];
    return factory;
}

export function instance <T> (values?: RecursivePartial<T>): T & IneedaProxy<T> {
    return createProxy<T>(values);
}

export function ninstanceof <T> (constructor: Function, values?: RecursivePartial<T>): T & IneedaProxy<T> {
    let mock = instance<T>(values);
    Object.setPrototypeOf(mock, constructor.prototype);
    return mock;
}

export function intercept <T> (interceptorOrKey: IneedaInterceptor<T> | any, interceptor?: IneedaInterceptor<T>): void {
    if (interceptor) {
        setInterceptorsWithKey<T>(<any>interceptorOrKey, interceptor);
    } else {
        setInterceptors(<IneedaInterceptor<T>>interceptorOrKey);
    }
}

export function reset (): void {
    resetInterceptors();
}
resetInterceptors();
