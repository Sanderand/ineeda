export type Partial<T> = {
    [P in keyof T]?: Partial<T[P]>
}

export type IneedaInterceptor = (value?: any, key?: PropertyKey, values?: any, target?: any) => any;

export interface IneedaUnproxyOptions {
    when?: any,
    keys: Array<PropertyKey>
}

export interface IneedaConfigOptions {
    intercept?: IneedaInterceptor;
    unproxy?: IneedaUnproxyOptions | Array<IneedaUnproxyOptions>
}

export interface IneedaProxy<T> {
    intercept (interceptor: IneedaInterceptor): T;
    unproxy (key: any): T
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
   config: (options?: IneedaConfigOptions) => void;
   reset: () => void;
}
