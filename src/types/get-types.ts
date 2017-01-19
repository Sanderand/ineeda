// Dependencies:
import { AllTypes } from './all-types';
import { FileTypes } from './file-types';
import { parseTypes } from './parse-types';
import { Request } from '../requests/request';

let allTypes: AllTypes = {};
export function getTypes (request: Request): FileTypes {
    let { path } = request;

    if (allTypes[path]) {
        return allTypes[path];
    }

    allTypes[path] = parseTypes(request);
    return allTypes[path];
}
