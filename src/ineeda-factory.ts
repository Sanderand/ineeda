export interface IneedaFactory <T> {
    (): T;
    getLatest? (): T;
    instances?: Array<T>;
}
