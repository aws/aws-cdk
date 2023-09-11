import { IConstruct } from 'constructs';
import { Stack } from '../../core';

/**
 * Given an object, converts all keys to PascalCase given they are currently in camel case.
 * @param obj The object.
 */
export function capitalizePropertyNames(construct: IConstruct, obj: any): any {
  const stack = Stack.of(construct);
  obj = stack.resolve(obj);

  if (typeof(obj) !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(x => capitalizePropertyNames(construct, x));
  }

  const newObj: any = { };
  for (const key of Object.keys(obj)) {
    const value = obj[key];

    const first = key.charAt(0).toUpperCase();
    const newKey = first + key.slice(1);
    newObj[newKey] = capitalizePropertyNames(construct, value);
  }

  return newObj;
}
