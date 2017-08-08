// Dependencies:
import { IneedaApi } from './ineeda-types';
import { factory, instance, ninstanceof, intercept, reset } from './ineeda';

let api = <IneedaApi>instance;
api.factory = factory;
api.instanceof = ninstanceof;
api.intercept = intercept;
api.reset = reset;

export const ineeda = api;

export * from './ineeda-interceptors';
export * from './ineeda-proxy';
export * from './ineeda-types';
