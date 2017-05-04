// Dependencies:
import { IneedaProxy } from './proxy/ineeda-proxy';

export interface IneedaFactory <T> {
    (): T & IneedaProxy<T>;
    getLatest? (): T & IneedaProxy<T>;
    instances?: Array<T & IneedaProxy<T>>;
}
