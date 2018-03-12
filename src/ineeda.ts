// Dependencies:
import { resetInterceptors, setInterceptors, setInterceptorsForToken } from './ineeda-interceptors';
import { createProxy } from './ineeda-proxy';
import { Constructable, DeepPartial, IneedaFactory, IneedaInterceptor, IneedaInterceptorOrToken, IneedaKey, IneedaProxy } from './ineeda-types';

export function factory <T> (values?: DeepPartial<T>): IneedaFactory<T> {
    let instances: Array<T & IneedaProxy<T>> = [];
    let factory: IneedaFactory<T> = function ineedaFactory (): T & IneedaProxy<T> {
        let seed = Object.assign({}, values);
        let mock = instance<T>(seed);
        instances.push(mock);
        return mock;
    };
    factory.instances = instances;
    factory.getLatest = () => factory.instances[factory.instances.length - 1];
    return factory;
}

export function instance <T> (values?: DeepPartial<T>): T & IneedaProxy<T> {
    return createProxy<T, IneedaKey<T>>(values);
}

export function ninstanceof <T> (constructor: Constructable<T>, values?: DeepPartial<T>): T & IneedaProxy<T> {
    let mock = instance<T>(values);
    Object.setPrototypeOf(mock, constructor.prototype);
    return mock;
}

export function intercept <T> (interceptorOrToken: IneedaInterceptorOrToken<T>, interceptor?: IneedaInterceptor<T>): void {
    if (interceptor) {
        setInterceptorsForToken<T>(interceptorOrToken, interceptor);
    } else {
        setInterceptors(<IneedaInterceptor<T>>interceptorOrToken);
    }
}

export function reset (): void {
    resetInterceptors();
}
resetInterceptors();
