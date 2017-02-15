export interface IneedaFactory <T> {
    (): T;
    instances?: Array<T>;
}
