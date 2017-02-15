// Dependencies:
import { EnumValue } from './enum-value';
import { getEnums } from './get-enums';
import { Request } from '../requests/request';

export function buildEnum <T>(request: Request): T {
    let enumDescription = getEnums(request)[request.type];
    if (enumDescription) {
        return getEnumValue<T>(enumDescription);
    }
}

function getEnumValue <T>(enumDescription: Array<EnumValue>): any {
    let values = enumDescription.map(d => d.value).sort();
    let [value] = values;
    return value;
}
