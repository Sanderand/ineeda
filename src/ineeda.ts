// Dependencies:
import { resetConfig, setConfig } from './ineeda-config';
import { createProxy } from './ineeda-proxy';
import { IneedaConfigOptions, IneedaFactory, IneedaProxy, Partial } from './ineeda-types';

export function factory <T>(values?: Partial<T>): IneedaFactory<T> {
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

export function instance <T> (values?: Partial<T>): T & IneedaProxy<T> {
    return createProxy<T>(values);
}

export function ninstanceof <T> (constructor: Function, values?: Partial<T>): T & IneedaProxy<T> {
    let mock = instance<T>(values);
    Object.setPrototypeOf(mock, constructor.prototype);
    return mock;
}

export function config (options?: IneedaConfigOptions): void {
    setConfig(options || {});
}

export function reset (): void {
    resetConfig();
}
resetConfig();
