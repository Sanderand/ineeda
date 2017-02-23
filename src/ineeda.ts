// Dependencies:
import { buildProxy } from './types/build-proxy';
import { IneedaFactory } from './ineeda-factory';
import { IneedaOptions } from './ineeda-options';

export function factory <T>(options?: IneedaOptions): IneedaFactory<T> {
    let instances: Array<T> = [];
    let factory: IneedaFactory<T> = function ineedaFactory (): T {
        let mock = getMock<T>(options);
        instances.push(mock);
        return mock;
    };
    factory.instances = instances;
    factory.getLatest = () => factory.instances[factory.instances.length - 1];
    return factory;
}

export function instance <T> (options?: IneedaOptions): T {
    return getMock<T>(options);
}

function getMock <T> (options?: IneedaOptions): T {
    options = options || {};
    let mock = buildProxy<T>(options);
    let constructor = options.instanceof;
    if (!!constructor) {
        Object.setPrototypeOf(mock, constructor.prototype);
    }
    return mock;
}
