// Dependencies:
import { resetInterceptors, setInterceptors, setInterceptorsForToken } from './ineeda-interceptors';
import { createProxy } from './ineeda-proxy';
import { Constructable, DeepPartial, Ineeda, IneedaFactory, IneedaInterceptor, IneedaInterceptorOrToken } from './ineeda-types';

export function factory <T> (values?: DeepPartial<T>): IneedaFactory<T> {
    let instances: Array<Ineeda<T>> = [];
    let factory: IneedaFactory<T> = function ineedaFactory (): Ineeda<T> {
        let mock = instance<T>(Object.assign({}, values));
        instances.push(mock);
        return mock;
    };
    factory.instances = instances;
    factory.getLatest = () => factory.instances[factory.instances.length - 1];
    return factory;
}

export function instance <T> (values?: DeepPartial<T>): Ineeda<T> {
    return createProxy<T, null>(values);
}

export function ninstanceof <T> (constructor: Constructable<T>, values?: DeepPartial<T>): Ineeda<T> {
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
