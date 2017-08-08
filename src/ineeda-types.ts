/* istanbul ignore next */
export const NOOP = function () {};

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
}

export type IneedaInterceptorFunction<T, K extends keyof T> = (value?: T[K], key?: K, values?: RecursivePartial<T>, target?: T) => any;
export type IneedaInterceptor<T> = IneedaInterceptorFunction<T, keyof T> | RecursivePartial<T>;

export interface IneedaProxy<T> {
    intercept (interceptorOrKey: IneedaInterceptor<T>): T;
    reset (): T;
    toJSON (): RecursivePartial<T>;
    toString (): string;
}

export interface IneedaFactory <T> {
    (): T & IneedaProxy<T>;
    getLatest? (): T & IneedaProxy<T>;
    instances?: Array<T & IneedaProxy<T>>;
}

export interface IneedaApi {
   <T> (values?: RecursivePartial<T>): T & IneedaProxy<T>;
   factory <T> (values?: RecursivePartial<T>): IneedaFactory<T & IneedaProxy<T>>;
   instanceof <T> (constructor: Function, values?: RecursivePartial<T>): T & IneedaProxy<T>;
   intercept <T> (interceptorOrKey: IneedaInterceptor<T>, inteceptor?: IneedaInterceptor<T>): void;
   reset (): void;
}
