// Dependencies:
import { build } from '../ineeda';
import { getTypes } from './get-types';
import { getRequest } from '../requests/get-request';
import { IneedaOptions } from '../ineeda-options';
import { Request } from '../requests/request';
import { TypeProperty } from './type-property';

export function buildType <T> (request: Request, options?: IneedaOptions): T {
    let typeDescription = getTypes(request)[request.name];

    if (typeDescription) {
        let result = <T>{};
        typeDescription.forEach(property => {
            getPropertyValue<T>(request, property, result, options);
        });
        return result;
    }
}

function getPropertyValue <T> (request: Request, property: TypeProperty, result: T, options?: IneedaOptions): void {
    let value: any;

    if (property.type === 'function') {
        value = getFunctionValue(request.name, property.name);
    } else {
        value = getPrimitiveValue(property.type);
    }

    if (value != null) {
        result[property.name] = value;
    } else {
        getTypedValue<T>(request, property, result, options);
    }
}

function getFunctionValue (objectName: string, propertyName: string): () => void {
    return () => {
        notImplemented(objectName, propertyName);
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

function getTypedValue <T> (request: Request, property: TypeProperty, result: T, options?: IneedaOptions): void {
    Object.defineProperty(result, property.name, {
        get: (): any => {
            let value = build<any>(getRequest.fromImport(request.path, property.type), options);
            if (value !== null) {
                return value;
            }
            if (options.proxy) {
                return getProxyValue(request.name, property.name);
            }
            throw new Error(`
                Could not mock "${property.name}" on <${request.name}>.
                    This probably means there was no type information available for <${property.type}>.
                    Either add type information, or call \`ineeda<${request.name}>({ proxy: true });\`
            `);
        }
    });
}

function getProxyValue (objectName: string, propertyName: string): any {
    let proxy = new Proxy(function () {}, {
        get: function(target: any, key: any) {
            if (key in target) {
                return target[key];
            }
            if (typeof key === 'symbol' || key === 'inspect') {
                return null;
            }

            return getProxyValue(`${objectName}.${propertyName}`, key);
        },
        apply: function (target: any, context: any, args: any) {
            return notImplemented(objectName, propertyName);
        }
    });

    return proxy;
};

function notImplemented (objectName: string, propertyName: string) {
    throw new Error(`
        "${objectName}.${propertyName}" is not implemented.
    `);
}
