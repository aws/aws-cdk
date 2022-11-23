import { IValue } from './value';
export declare function renderDuration(v: IValue, style: 'toMinutes' | 'toSeconds'): IValue;
export declare function ifDefined(c: IValue, v: IValue): IValue;
export declare function enumMapping(mapping: Array<[IValue, string]>): (value: IValue) => IValue;
