// Dependencies:
import { IneedaInterceptorFunction, IneedaInterceptor } from './ineeda-types';

// Constants:
let INTERCEPTORS: Array<IneedaInterceptorFunction<any, keyof any>> = [];
let INTERCEPTORS_WITH_KEYS: Map<any, Array<IneedaInterceptorFunction<any, keyof any>>> = new Map();

export function getGlobalInterceptors <T>(): Array<IneedaInterceptorFunction<T, keyof T>> {
    return <Array<IneedaInterceptorFunction<T, keyof T>>>INTERCEPTORS;
}

export function getInterceptors <T>(interceptor: IneedaInterceptor<T>): Array<IneedaInterceptorFunction<T, keyof T>> {
    let interceptors: Array<IneedaInterceptorFunction<T, keyof T>> = [];
    if (interceptor instanceof Function) {
        interceptors.push(interceptor);
    } else {
        Object.keys(interceptor).forEach((interceptorKey: keyof T) => {
            interceptors.push((value, key) => {
                if (key === interceptorKey) {
                    return interceptor[interceptorKey];
                }
                return value;
            });
        });
    }
    return interceptors;
}

export function getInterceptorsWithKey <T>(key: any): Array<IneedaInterceptorFunction<T, keyof T>> {
    return <Array<IneedaInterceptorFunction<T, keyof T>>>INTERCEPTORS_WITH_KEYS.get(key);
}

export function resetInterceptors (): void {
    INTERCEPTORS.length = 0;
    INTERCEPTORS_WITH_KEYS.clear();
}

export function setInterceptors <T>(interceptor: IneedaInterceptor<T>): void {
    INTERCEPTORS = INTERCEPTORS.concat(getInterceptors(interceptor));
}

export function setInterceptorsWithKey <T>(key: any, interceptor: IneedaInterceptor<T>): void {
    INTERCEPTORS_WITH_KEYS.set(key, getInterceptors(interceptor));
}
