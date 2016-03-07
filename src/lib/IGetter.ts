/// <reference path="../_references.d.ts" />
'use strict';

// Interfaces:
import IEnumDescription from './IEnumDescription';
import IPropertyDescription from './IPropertyDescription';

interface IGetter {
    getMeAnEnumValue (property: IEnumDescription): number;
    getMeAPropertyValue <T> (name: string, property: IPropertyDescription, result: T): void;
}

export default IGetter;
