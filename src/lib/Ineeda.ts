/// <reference path="../_references.d.ts" />
'use strict';

// Interfaces:
import IEnumDescription from './IEnumDescription';
import IFinder from './IFinder';
import IGetter from './IGetter';
import IPropertyDescription from './IPropertyDescription';

// Utilities:
import * as path from 'path';

// Dependencies:
import Finder from './Finder';
import Getter from './Getter';

export default function Ineeda <T> (interfacePath?: string, name?: string): T {
    let finder: IFinder = new Finder();
    if (interfacePath) {
        finder.findTypes(interfacePath);
    }

    if (!name) {
        [name] = interfacePath.split(path.sep).slice(-1);
    }

    let interfaceDescription: Array<IPropertyDescription> = finder.getInterface(name);
    let enumDescription: IEnumDescription = finder.getEnum(name);

    let getter: IGetter = new Getter();

    if (interfaceDescription) {
        let result: T = <T>{};
        interfaceDescription.forEach((property: IPropertyDescription) => {
            getter.getMeAPropertyValue<T>(name, property, result);
        });
        return result;
    }

    if (enumDescription) {
        /* tslint:disable: no-any */
        return <any>getter.getMeAnEnumValue(enumDescription);
        /* tslint:enable: no-any */
    }
}
