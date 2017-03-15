// Dependencies:
import { IneedaApi } from './ineeda-api';
import { factory, instance, ninstanceof, unproxy } from './ineeda';

let api = <IneedaApi>instance;
api.factory = factory;
api.instanceof = ninstanceof;
api.unproxy = unproxy;

export const ineeda = api;

export * from './ineeda-factory';
export * from './proxy/ineeda-proxy';
export * from './proxy/ineeda-unproxy-options';
