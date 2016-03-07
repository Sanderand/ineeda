/// <reference path="../_references.d.ts" />
'use strict';

// Interfaces:
import IEnumDescription from './IEnumDescription';
import IGetter from './IGetter';
import IPropertyDescription from './IPropertyDescription';

// Dependencies:
import ineeda from './Ineeda';

export default class Getter implements IGetter {
    public getMeAnEnumValue (description: IEnumDescription): number {
        let values: Array<number> = description.values.sort();
        let [value] = values;
        return value;
    }

    public getMeAPropertyValue <T> (name: string, property: IPropertyDescription, result: T): void {
        /* tslint:disable: no-any */
        let value: any;
        /* tslint:enable: no-any */

        if (property.type === 'function') {
            value = this.getFunctionValue(name, property.name);
        } else {
            value = this.getPrimitiveValue(property.type);
        }

        if (value != null) {
            /* tslint:disable: no-any */
            result[property.name] = value;
            /* tslint:enable: no-any */
        } else {
            this.getTypedValue<T>(property, result);
        }
    }


    private getFunctionValue (className: string, methodName: string): () => void {
        return () => {
            throw new Error(`"${className}.${methodName}" is not implemented.`);
        };
    }

    /* tslint:disable: no-any */
    private getPrimitiveValue (type: string): any {
    /* tslint:enable: no-any */
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

    private getTypedValue <T> (property: IPropertyDescription, result: T): void {
        Object.defineProperty(result, property.name, {
            /* tslint:disable: no-any */
            get: (): any => {
            /* tslint:enable: no-any */
                return ineeda(null, property.type);
            }
        });
    }
}
