// Dependencies:
import { IneedaFactory } from './ineeda-factory';
import { createProxy } from './proxy/create-proxy';
import { IneedaProxy } from './proxy/ineeda-proxy';
import { IneedaUnproxyOptions } from './proxy/ineeda-unproxy-options';
import { setUnproxyValues } from './proxy/unproxy-values';

export function factory <T>(values?: any): IneedaFactory<T> {
    let instances: Array<T & IneedaProxy<T>> = [];
    let factory: IneedaFactory<T> = function ineedaFactory (): T & IneedaProxy<T> {
        let mock = instance<T & IneedaProxy<T>>(values);
        instances.push(mock);
        return mock;
    };
    factory.instances = instances;
    factory.getLatest = () => factory.instances[factory.instances.length - 1];
    return factory;
}

export function instance <T> (values?: any): T & IneedaProxy<T> {
    return createProxy<T>(values);
}

export function ninstanceof <T> (constructor: Function, values?: any): T & IneedaProxy<T> {
    let mock = instance<T>(values);
    Object.setPrototypeOf(mock, constructor.prototype);
    return mock;
}

export function unproxy (options: IneedaUnproxyOptions): void {
    setUnproxyValues(options);
}
