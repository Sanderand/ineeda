// Dependencies:
import { IneedaInterceptorFunction, IneedaInterceptorKeys, IneedaInterceptor } from './ineeda-types';

// Constants:
let INTERCEPTORS: Array<IneedaInterceptorFunction> = [];
let INTERCEPTORS_WITH_KEYS: Map<any, Array<IneedaInterceptorFunction>> = new Map();

export function getGlobalInterceptors (): Array<IneedaInterceptorFunction> {
    return INTERCEPTORS;
}

export function getInterceptors (interceptor: IneedaInterceptor): Array<IneedaInterceptorFunction> {
    let interceptors: Array<IneedaInterceptorFunction> = [];
    if (interceptor instanceof Function) {
        interceptors.push(interceptor);
    } else {
        Object.keys(interceptor).forEach(interceptorKey => {
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

export function getInterceptorsWithKey (key: any): Array<IneedaInterceptorFunction> {
    return INTERCEPTORS_WITH_KEYS.get(key);
}

export function resetInterceptors (): void {
    INTERCEPTORS.length = 0;
    INTERCEPTORS_WITH_KEYS.clear();
}

export function setInterceptors (interceptor: IneedaInterceptor): void {
    INTERCEPTORS = INTERCEPTORS.concat(getInterceptors(interceptor));
}

export function setInterceptorsWithKey (key: any, interceptor: IneedaInterceptor): void {
    INTERCEPTORS_WITH_KEYS.set(key, getInterceptors(interceptor));
}
