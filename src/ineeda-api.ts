// Dependencies:
import { IneedaFactory } from './ineeda-factory';
import { IneedaOptions } from './ineeda-options';

export interface IneedaApi {
   <T>(options?: IneedaOptions): T;
   factory: <T>(options?: IneedaOptions) => IneedaFactory<T>;
}
