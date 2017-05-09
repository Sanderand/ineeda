// Dependencies:
import { IneedaFactory } from './ineeda-factory';
import { IneedaProxy } from './proxy/ineeda-proxy';
import { IneedaUnproxyOptions } from './proxy/ineeda-unproxy-options';
import { Partial } from './partial';

export interface IneedaApi {
   <T>(values?: Partial<T>): T & IneedaProxy<T>;
   factory: <T>(values?: Partial<T>) => IneedaFactory<T & IneedaProxy<T>>;
   instanceof: <T>(constructor: Function, values?: Partial<T>) => T & IneedaProxy<T>;
   unproxy: (options: IneedaUnproxyOptions) => void;
}
