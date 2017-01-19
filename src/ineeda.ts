// Dependencies:
import { buildEnum } from './enums/build-enum';
import { buildType } from './types/build-type';
import { getRequest } from './requests/get-request';
import { Request } from './requests/request';

export class Ineeda {
    public a <T>(referencePath?: string): T {
        let { name, path } = getRequest.fromStack();
        let request = getRequest.fromImport(path, name)
        request.path = referencePath || request.path;
        return build<T>(request);
    }

    public aninstanceof <T>(constructor: Function): T {
        let { name, path } = getRequest.fromStack();
        let request = getRequest.fromImport(path, name)
        let mock = build<T>(request);
        Object.setPrototypeOf(mock, constructor.prototype);
        return mock;
    }
}

export function build <T>(request: Request): T {
    let result = buildEnum<T>(request);
    if (result != null) {
        return result;
    }

    result = buildType<T>(request);
    if (result != null) {
        return result;
    }

    return null;
}
