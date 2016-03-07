// TypeScript typings for phenomnomnominal/ineeda

interface IIneeda {
    <T>(path: string): T;
}

declare var ineeda: IIneeda;

declare module 'ineeda' {
    export default ineeda;
}
