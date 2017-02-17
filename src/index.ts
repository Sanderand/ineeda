// Dependencies:
import { IneedaApi } from './ineeda-api';
import { IneedaOptions } from './ineeda-options';
import { factory, instance } from './ineeda';

let api = <IneedaApi>instance;
api.factory = factory;

export const ineeda = api;

export * from './ineeda-factory';
export * from './ineeda-options';
