export type Type = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'array';
export declare function getType(obj: any): Type;
