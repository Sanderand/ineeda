// Constants:
const TYPE_INFORMATION_REGEX = /(.*?)\.(.*)/;

// Dependencies:
import { build } from '../ineeda';
import { getTypes } from './get-types';
import { getRequest } from '../requests/get-request';
import { IneedaOptions } from '../ineeda-options';
import { Request } from '../requests/request';
import { TypeProperty } from './type-property';

export function buildType <T> (request: Request, options: IneedaOptions): T {
    let typeDescription = getTypes(request)[request.type];

    if (typeDescription) {
        let result = <T>{};
        typeDescription.forEach(property => {
            getPropertyValue<T>(request, property, result, options);
        });
        return result;
    } else {
        if (options.proxy) {
            return getProxyValue(request);
        }
        noTypeInformation(request);
    }
}

function getPropertyValue <T> (request: Request, property: TypeProperty, result: T, options: IneedaOptions): void {
    let value: any;

    if (property.type === 'function') {
        value = getFunctionValue(request, property);
    } else {
        value = getPrimitiveValue(property);
    }

    if (value != null) {
        result[property.name] = value;
    } else {
        getTypedValue<T>(request, property, result, options);
    }
}

function getFunctionValue (request: Request, property: TypeProperty): () => void {
    return () => {
        notImplemented(request, property);
    };
}

function getPrimitiveValue (property: TypeProperty): any {
    let { type } = property;
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

function getTypedValue <T> (request: Request, property: TypeProperty, result: T, options: IneedaOptions): void {
    let cache = {};
    Object.defineProperty(result, property.name, {
        get: (): any => {
            let propName = property.name;

            let cacheValue = cache[propName];
            if (cacheValue) {
                return cacheValue;
            }

            let childRequest = new Request({
                name: `${request.name}.${property.name}`,
                path: request.path,
                type: property.type
            });
            cache[propName] = build<any>(getRequest.fromImport(childRequest), options);
            return cache[propName];
        },
        set: (value: any) => {
            cache[property.name] = value;
        }
    });
}

function getProxyValue (request: Request, property?: TypeProperty): any {
    let result: any = { hasOwnProperty, toString };
    let handlers = { apply, get, getOwnPropertyDescriptor, set };
    return new Proxy(function () {}, handlers);

    function apply () {
        return notImplemented(request, property);
    }

    function get (target: any, key: any) {
        if (Object.hasOwnProperty.call(result, key)) {
            return result[key];
        }

        let object = {};
        if (key in object) {
            return object[key];
        }

        if (shouldIgnore(property, key)) {
            return null;
        }

        let requestName = property ? `${request.name}.${property.name}` : request.name;
        let proxyRequest = new Request({ name: requestName, type: request.type, path: '' });
        let proxyProperty = new TypeProperty(key, '');
        result[key] = getProxyValue(proxyRequest, proxyProperty);
        return result[key];
    }

    function hasOwnProperty () {
        return true;
    }

    function shouldIgnore (property: TypeProperty, key: any) {
        return property || typeof key === 'symbol' || key === 'inspect';
    }

    function getOwnPropertyDescriptor (target: any, key: any) {
        let value = get(target, key);
        return { configurable: true, enumerable: true, value };
    }

    function set (target: any, key: any, value: any) {
        result[key] = value;
        return true;
    }

    function toString () {
        return 'IneedaProxy';
    }
};

function notImplemented (request: Request, property?: TypeProperty) {
    let functionName = property ? `${request.name}.${property.name}` : request.name;
    throw new Error(`
        "${functionName}" is not implemented.
    `);
}

function noTypeInformation (request: Request) {
    let typeInformation = request.name.match(TYPE_INFORMATION_REGEX);
    let property, rootType, toMock, toMockType;
    if (typeInformation) {
        [, rootType, property] = typeInformation;
    }
    property = property ? `"${property}" on ` : '';
    rootType = rootType || request.type;
    throw new Error(`
        Could not mock ${property}<${rootType}>.
            This probably means there was no type information available for <${request.type}>.
            Either add type information, or call \`ineeda<${rootType}>({ proxy: true });\`
    `);
}
