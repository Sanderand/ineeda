/* istanbul ignore next */
/* tslint:disable:no-empty */
export const NOOP = () => {};
/* tslint:enable:no-empty */

export type Constructable<T> = {
    new (...args: Array<any>): T
};

export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export type IneedaKey<T> = keyof T | keyof IneedaProxy<T> | keyof Object | keyof Function | keyof Array<any> | keyof Date;

export type IneedaInterceptorToken = {};
export type IneedaInterceptorFunction<T, K extends keyof T> = (value?: T[K], key?: K, values?: DeepPartial<T>, target?: T) => any;
export type IneedaInterceptor<T> = IneedaInterceptorFunction<T, keyof T> | DeepPartial<T>;
export type IneedaInterceptorOrToken<T> = IneedaInterceptor<T> | IneedaInterceptorToken;

export interface IneedaProxy<T> {
    hasOwnProperty (): boolean;
    intercept (interceptor: IneedaInterceptorOrToken<T>): T;
    reset (): T;
    toJSON (): DeepPartial<T>;
    toString (): string;
}

export interface IneedaFactory <T> {
    instances?: Array<T & IneedaProxy<T>>;
    (): T & IneedaProxy<T>;
    getLatest? (): T & IneedaProxy<T>;
}

export interface IneedaApi {
   <T> (values?: DeepPartial<T>): T & IneedaProxy<T>;
   factory <T> (values?: DeepPartial<T>): IneedaFactory<T & IneedaProxy<T>>;
   instanceof <T> (constructor: Constructable<T>, values?: DeepPartial<T>): T & IneedaProxy<T>;
   intercept <T> (interceptorOrToken: IneedaInterceptorOrToken<T>, interceptor?: IneedaInterceptor<T>): void;
   reset (): void;
}
