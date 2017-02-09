// Dependencies:
import { buildEnum } from './enums/build-enum';
import { buildType } from './types/build-type';
import { getRequest } from './requests/get-request';
import { IneedaOptions } from './ineeda-options';
import { Request } from './requests/request';

export function ineeda <T> (options?: IneedaOptions): T {
    options = options || {};
    let { name, path } = getRequest.fromStack();
    let request = getRequest.fromImport(path, name)
    request.path = options.from || request.path;
    let mock = build<T>(request, options);
    let constructor = options.instanceof;
    if (!!constructor) {
        Object.setPrototypeOf(mock, constructor.prototype);
    }
    return mock;
}

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
