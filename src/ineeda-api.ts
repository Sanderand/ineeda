// Dependencies:
import { IneedaFactory } from './ineeda-factory';
import { IneedaProxy } from './proxy/ineeda-proxy';
import { IneedaUnproxyOptions } from './proxy/ineeda-unproxy-options';

export interface IneedaApi {
   <T>(values?: any): T & IneedaProxy<T>;
   factory: <T>(values?: any) => IneedaFactory<T & IneedaProxy<T>>;
   instanceof: <T>(constructor: Function, values?: any) => T & IneedaProxy<T>;
   unproxy: (options: IneedaUnproxyOptions) => void;
}
