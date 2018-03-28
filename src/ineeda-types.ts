/* istanbul ignore next */
/* tslint:disable-next-line:no-empty */
export const NOOP = () => {};

export type Constructable<T> = {
    new (...args: Array<any>): T
};

export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

export type IneedaKey<T> = keyof IneedaProxy<T> | keyof T | keyof Object | keyof Function;

export type Ineeda<T> = T & IneedaProxy<T>;

export type IneedaInterceptorToken = {};
export type IneedaInterceptorFunction<T, K extends keyof T> = (value?: DeepPartial<T>[K], key?: K, values?: DeepPartial<T>, target?: Ineeda<T>) => DeepPartial<T>[K];
export type IneedaInterceptor<T> = IneedaInterceptorFunction<T, keyof T> | DeepPartial<T>;
export type IneedaInterceptorOrToken<T> = IneedaInterceptor<T> | IneedaInterceptorToken;

export interface IneedaProxy<T> {
    hasOwnProperty (): boolean;
    intercept (interceptor: IneedaInterceptorOrToken<T>): Ineeda<T>;
    reset (): Ineeda<T>;
    toJSON (): DeepPartial<T>;
    toString (): string;
}

export interface IneedaFactory<T> {
    instances?: Array<Ineeda<T>>;
    (): Ineeda<T>;
    getLatest? (): Ineeda<T>;
}

export interface IneedaApi {
   <T> (values?: DeepPartial<T>): Ineeda<T>;
   factory <T> (values?: DeepPartial<T>): IneedaFactory<T>;
   instanceof <T> (constructor: Constructable<T>, values?: DeepPartial<T>): Ineeda<T>;
   intercept <T> (interceptorOrToken: IneedaInterceptorOrToken<T>, interceptor?: IneedaInterceptor<T>): void;
   reset (): void;
}
