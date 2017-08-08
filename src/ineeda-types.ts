/* istanbul ignore next */
export const NOOP = function () {};

export type Partial<T> = {
    [P in keyof T]?: Partial<T[P]>
}

export type IneedaInterceptorFunction = (value?: any, key?: PropertyKey, values?: any, target?: any) => any;
export type IneedaInterceptorKeys = { [key: string]: any };
export type IneedaInterceptor = IneedaInterceptorFunction | IneedaInterceptorKeys;

export interface IneedaProxy<T> {
    intercept (interceptorOrKey: IneedaInterceptor): T;
    reset: () => T;
}

export interface IneedaFactory <T> {
    (): T & IneedaProxy<T>;
    getLatest? (): T & IneedaProxy<T>;
    instances?: Array<T & IneedaProxy<T>>;
}

export interface IneedaApi {
   <T>(values?: Partial<T>): T & IneedaProxy<T>;
   factory: <T>(values?: Partial<T>) => IneedaFactory<T & IneedaProxy<T>>;
   instanceof: <T>(constructor: Function, values?: Partial<T>) => T & IneedaProxy<T>;
   intercept (interceptorOrKey: IneedaInterceptor, inteceptor?: IneedaInterceptor): void;
   reset: () => void;
}
