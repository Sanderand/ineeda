/// <reference path="../_references.d.ts" />
'use strict';

// Interfaces:
import IEnumDescription from './IEnumDescription';
import IPropertyDescription from './IPropertyDescription';

interface IFinder {
    findTypes (path?: string): void;
    getEnum (name: string): IEnumDescription;
    getInterface (name: string): Array<IPropertyDescription>;
}

export default IFinder;
