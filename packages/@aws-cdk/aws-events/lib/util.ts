import { Token, TokenComparison } from '@aws-cdk/core';
import { EventPattern } from './event-pattern';

/**
 * Merge the `src` event pattern into the `dest` event pattern by adding all
 * values from `src` into the fields in `dest`.
 *
 * See `rule.addEventPattern` for details.
 */
export function mergeEventPattern(dest: any, src: any) {
  dest = dest || { };

  mergeObject(dest, src);

  return dest;

  function mergeObject(destObj: any, srcObj: any) {
    if (typeof(srcObj) !== 'object') {
      throw new Error(`Invalid event pattern '${JSON.stringify(srcObj)}', expecting an object or an array`);
    }

    for (const field of Object.keys(srcObj)) {

      const srcValue = srcObj[field];
      const destValue = destObj[field];

      if (srcValue === undefined) { continue; }

      if (typeof(srcValue) !== 'object') {
        throw new Error(`Invalid event pattern field { ${field}: ${JSON.stringify(srcValue)} }. All fields must be arrays`);
      }

      // dest doesn't have this field
      if (destObj[field] === undefined) {
        destObj[field] = srcValue;
        continue;
      }

      if (Array.isArray(srcValue) !== Array.isArray(destValue)) {
        throw new Error(`Invalid event pattern field ${field}. ` +
          `Type mismatch between existing pattern ${JSON.stringify(destValue)} and added pattern ${JSON.stringify(srcValue)}`);
      }

      // if this is an array, concat and deduplicate the values
      if (Array.isArray(srcValue)) {
        const result = [...destValue, ...srcValue];
        const resultJson = result.map(i => JSON.stringify(i));
        destObj[field] = result.filter((value, index) => resultJson.indexOf(JSON.stringify(value)) === index);
        continue;
      }

      // otherwise, it's an object, so recurse
      mergeObject(destObj[field], srcValue);
    }
  }
}

/**
 * Whether two string probably contain the same environment dimension (region or account)
 *
 * Used to compare either accounts or regions, and also returns true if both
 * are unresolved (in which case both are expted to be "current region" or "current account").
 * @internal
 */
export function sameEnvDimension(dim1: string, dim2: string) {
  return [TokenComparison.SAME, TokenComparison.BOTH_UNRESOLVED].includes(Token.compareStrings(dim1, dim2));
}

/**
 * Transform an eventPattern object into a valid Event Rule Pattern
 * by changing detailType into detail-type when present.
 */
export function renderEventPattern(eventPattern: EventPattern): any {
  return Object.keys(eventPattern).length > 0
    ? resolvePatterns(normalizeNames(eventPattern))
    : undefined;
}

function normalizeNames(pattern: EventPattern): {[key: string]: any} {
  return mapKeys(pattern, key => key === 'detailType' ? 'detail-type' : key);
}

/**
 * Transforms the input object into another object with the same structure and values,
 * except with the matchers converted to the final format, expected by EventBridge.
 */
function resolvePatterns(obj: any): any {
  if (obj?.toEventBridgeMatcher) {
    return obj.toEventBridgeMatcher();
  }

  if (Array.isArray(obj) || typeof(obj) !== 'object' || obj == null) {
    return obj;
  }

  return mapValues(obj, resolvePatterns);
}

function mapKeys(obj: {[key: string]: any}, fn: ((_: any) => any)): {[key: string]: any} {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [fn(k), v]));
}

function mapValues(obj: {[key: string]: any}, fn: ((_: any) => any)): {[key: string]: any} {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, fn(v)]));
}
