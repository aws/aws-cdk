import { AssumptionError } from 'aws-cdk-lib/core';

/**
 * Deep merge utility for nested objects
 * @param target The target object to merge into
 * @param source The source object to merge from
 * @param mergeOnly The explicit list of property keys to copy from source
 */
export function deepMerge(target: any, source: any, mergeOnly: string[]): any {
  for (const key of mergeOnly) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }

    if (!(key in source)) {
      continue;
    }

    const sourceValue = source[key];
    const targetValue = target[key];

    if (typeof sourceValue === 'object' && sourceValue != null && !Array.isArray(sourceValue) &&
        typeof targetValue === 'object' && targetValue != null && !Array.isArray(targetValue)) {
      target[key] = deepMergeCopy(Object.create(null), targetValue, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }

  return target;
}

/**
 * Object keys that deepMerge should not consider. Currently these include
 * CloudFormation intrinsics
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html
 */

const MERGE_EXCLUDE_KEYS: string[] = [
  'Ref',
  'Fn::Base64',
  'Fn::Cidr',
  'Fn::FindInMap',
  'Fn::GetAtt',
  'Fn::GetAZs',
  'Fn::ImportValue',
  'Fn::Join',
  'Fn::Select',
  'Fn::Split',
  'Fn::Sub',
  'Fn::Transform',
  'Fn::And',
  'Fn::Equals',
  'Fn::If',
  'Fn::Not',
  'Fn::Or',
];

/**
 * This is an unchanged copy from packages/aws-cdk-lib/core/lib/cfn-resource.ts
 * The intention will be to use this function from core once the package is merged.
 *
 * Merges `source` into `target`, overriding any existing values.
 * `null`s will cause a value to be deleted.
 */
function deepMergeCopy(target: any, ...sources: any[]) {
  for (const source of sources) {
    if (typeof(source) !== 'object' || typeof(target) !== 'object') {
      throw new AssumptionError(`Invalid usage. Both source (${JSON.stringify(source)}) and target (${JSON.stringify(target)}) must be objects`);
    }

    for (const key of Object.keys(source)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }

      const value = source[key];
      if (typeof(value) === 'object' && value != null && !Array.isArray(value)) {
        // if the value at the target is not an object, override it with an
        // object so we can continue the recursion
        if (typeof(target[key]) !== 'object') {
          target[key] = {};

          /**
           * If we have something that looks like:
           *
           *   target: { Type: 'MyResourceType', Properties: { prop1: { Ref: 'Param' } } }
           *   sources: [ { Properties: { prop1: [ 'Fn::Join': ['-', 'hello', 'world'] ] } } ]
           *
           * Eventually we will get to the point where we have
           *
           *   target: { prop1: { Ref: 'Param' } }
           *   sources: [ { prop1: { 'Fn::Join': ['-', 'hello', 'world'] } } ]
           *
           * We need to recurse 1 more time, but if we do we will end up with
           *   { prop1: { Ref: 'Param', 'Fn::Join': ['-', 'hello', 'world'] } }
           * which is not what we want.
           *
           * Instead we check to see whether the `target` value (i.e. target.prop1)
           * is an object that contains a key that we don't want to recurse on. If it does
           * then we essentially drop it and end up with:
           *
           *   { prop1: { 'Fn::Join': ['-', 'hello', 'world'] } }
           */
        } else if (Object.keys(target[key]).length === 1) {
          if (MERGE_EXCLUDE_KEYS.includes(Object.keys(target[key])[0])) {
            target[key] = {};
          }
        }

        /**
         * There might also be the case where the source is an intrinsic
         *
         *    target: {
         *      Type: 'MyResourceType',
         *      Properties: {
         *        prop1: { subprop: { name: { 'Fn::GetAtt': 'abc' } } }
         *      }
         *    }
         *    sources: [ {
         *      Properties: {
         *        prop1: { subprop: { 'Fn::If': ['SomeCondition', {...}, {...}] }}
         *      }
         *    } ]
         *
         * We end up in a place that is the reverse of the above check, the source
         * becomes an intrinsic before the target
         *
         *   target: { subprop: { name: { 'Fn::GetAtt': 'abc' } } }
         *   sources: [{
         *     'Fn::If': [ 'MyCondition', {...}, {...} ]
         *   }]
         */
        if (Object.keys(value).length === 1) {
          if (MERGE_EXCLUDE_KEYS.includes(Object.keys(value)[0])) {
            target[key] = {};
          }
        }

        deepMergeCopy(target[key], value);

        // if the result of the merge is an empty object, it's because the
        // eventual value we assigned is `undefined`, and there are no
        // sibling concrete values alongside, so we can delete this tree.
        const output = target[key];
        if (typeof(output) === 'object' && Object.keys(output).length === 0) {
          delete target[key];
        }
      } else if (value === undefined) {
        delete target[key];
      } else {
        target[key] = value;
      }
    }
  }

  return target;
}

/**
 * Shallow assign utility that explicitly assigns each property
 * @param target The target object to assign properties to
 * @param source The source object to read properties from
 * @param assignOnly The explicit list of property keys that are allowed to be assigned
 */
export function shallowAssign(target: any, source: any, assignOnly: string[]): any {
  for (const key of assignOnly) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }

    if (key in source) {
      target[key] = source[key];
    }
  }
  return target;
}
