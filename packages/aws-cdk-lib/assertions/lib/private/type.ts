export type Type = 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function' | 'array';

export function getType(obj: any): Type {
  return Array.isArray(obj) ? 'array' : typeof obj;
}