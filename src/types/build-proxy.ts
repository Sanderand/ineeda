// Dependencies:
import { IneedaOptions } from '../ineeda-options';
import { TypeProperty } from './type-property';

export function buildProxy <T> (options: IneedaOptions): T {
    return getProxyValue();
}

function getProxyValue (property?: TypeProperty): any {
    let result: any = { hasOwnProperty };
    let handlers = { apply, get, getOwnPropertyDescriptor, set };
    return new Proxy(function () {}, handlers);

    function apply () {
        return notImplemented(property);
    }

    function get (target: any, key: any) {
        debugger;
        console.log(target);
        if (Object.hasOwnProperty.call(result, key)) {
            return result[key];
        }

        console.log(key);
        // if (key === Symbol.toStringTag) {
        //     return 'IneedaProxy';
        // }
        // if (key === Symbol.toPrimitive) {
        //     return function () {
        //         console.log('blah');
        //         return 'hello';
        //         // throw Error('this is a proxy');
        //     }
        // }

        let object = {};
        if (key in object) {
            return object[key];
        }

        if (shouldIgnore(property, key)) {
            return null;
        }

        // let requestName = property ? `${request.name}.${property.name}` : request.name;
        // let proxyRequest = new Request({ name: requestName, type: request.type, path: '' });
        let proxyProperty = new TypeProperty(key, '');
        result[key] = getProxyValue(proxyProperty);
        return result[key];
    }

    function hasOwnProperty () {
        return true;
    }

    function shouldIgnore (property: TypeProperty, key: any) {
        return typeof key === 'symbol' || key === 'inspect';
    }

    function getOwnPropertyDescriptor (target: any, key: any) {
        let value = get(target, key);
        return { configurable: true, enumerable: true, value };
    }

    function set (target: any, key: any, value: any) {
        result[key] = value;
        return true;
    }

    // function toString () {
    //     return '[object IneedaProxy]';
    // }
}

function notImplemented (property?: TypeProperty) {
    throw new Error(`
        "${property.name}" is not implemented.
    `);
}
