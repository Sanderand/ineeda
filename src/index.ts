// Dependencies:
import { IneedaApi } from './ineeda-types';
import { factory, instance, ninstanceof, config, reset } from './ineeda';

let api = <IneedaApi>instance;
api.factory = factory;
api.instanceof = ninstanceof;
api.config = config;
api.reset = reset;

export const ineeda = api;

export * from './ineeda-config';
export * from './ineeda-proxy';
export * from './ineeda-types';
