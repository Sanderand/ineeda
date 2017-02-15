// Dependencies:
import { buildEnum } from './enums/build-enum';
import { buildType } from './types/build-type';
import { getRequest } from './requests/get-request';
import { IneedaFactory } from './ineeda-factory';
import { IneedaOptions } from './ineeda-options';
import { Request } from './requests/request';

export function build <T>(request: Request, options: IneedaOptions): T {
    let result = buildEnum<T>(request);
    if (result != null) {
        return result;
    }

    result = buildType<T>(request, options);
    if (result != null) {
        return result;
    }

    return null;
}


export function factory <T>(options?: IneedaOptions): IneedaFactory<T> {
    let request = getRequest.fromImport(getRequest.fromStack());
    let instances: Array<T> = [];
    let factory: IneedaFactory<T> = function ineedaFactory (): T {
        let mock = getMock<T>(request, options);
        instances.push(mock);
        return mock;
    };
    factory.instances = instances;
    factory.getLatest = () => factory.instances[factory.instances.length - 1];
    return factory;
}

export function instance <T> (options?: IneedaOptions): T {
    let request = getRequest.fromImport(getRequest.fromStack());
    return getMock<T>(request, options);
}

function getMock <T> (request: Request, options?: IneedaOptions): T {
    options = options || {};
    request.path = options.from || request.path;
    let mock = build<T>(request, options);
    let constructor = options.instanceof;
    if (!!constructor) {
        Object.setPrototypeOf(mock, constructor.prototype);
    }
    return mock;
}
