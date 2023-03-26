import { Function as LambdaFunction } from './function';
export declare function calculateFunctionHash(fn: LambdaFunction, additional?: string): string;
export declare function trimFromStart(s: string, maxLength: number): string;
export declare const VERSION_LOCKED: {
    [key: string]: boolean;
};
