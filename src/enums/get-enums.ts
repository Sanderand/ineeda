// Dependencies:
import { AllEnums } from './all-enums';
import { FileEnums } from './file-enums';
import { parseEnums } from './parse-enums';
import { Request } from '../requests/request';

let allEnums: AllEnums = {};
export function getEnums (request: Request): FileEnums {
    let { path } = request;

    if (allEnums[path]) {
        return allEnums[path];
    }

    allEnums[path] = parseEnums(request);
    return allEnums[path];
}
