// Dependencies:
import { getTypes } from './get-types';
import { getRequest } from '../requests/get-request';
import { build } from '../ineeda';
import { Request } from '../requests/request';
import { TypeProperty } from './type-property';

export function buildType <T> (request: Request): T {
    let typeDescription = getTypes(request)[request.name];
    if (typeDescription) {
        let result = <T>{};
        typeDescription.forEach(property => {
            getPropertyValue<T>(request, property, result);
        });
        return result;
    }
}

function getPropertyValue <T> (request: Request, property: TypeProperty, result: T): void {
    let value: any;

    if (property.type === 'function') {
        value = getFunctionValue(request.name, property.name);
    } else {
        value = getPrimitiveValue(property.type);
    }

    if (value != null) {
        result[property.name] = value;
    } else {
        getTypedValue<T>(request, property, result);
    }
}

function getFunctionValue (className: string, methodName: string): () => void {
    return () => {
        throw new Error(`"${className}.${methodName}" is not implemented.`);
    };
}

function getPrimitiveValue (type: string): any {
    if (type === 'any') {
        return {};
    } else if (type === 'array') {
        return [];
    } else if (type === 'boolean') {
        return false;
    } else if (type === 'number') {
        return 0;
    } else if (type === 'string') {
        return '';
    }
}

function getTypedValue <T> (request: Request, property: TypeProperty, result: T): void {
    Object.defineProperty(result, property.name, {
        get: (): any => {
            return build<any>(getRequest.fromImport(request.path, property.type));
        }
    });
}
