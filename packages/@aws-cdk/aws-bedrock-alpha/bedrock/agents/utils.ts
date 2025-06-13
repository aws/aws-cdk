import { createHash } from 'crypto';
import * as cdk from 'aws-cdk-lib';
import { IConstruct } from 'constructs';
import { ValidationError } from 'aws-cdk-lib';

/**
 * The CFN NAG suppress rule interface
 * @interface CfnNagSuppressRule
 */
export interface CfnNagSuppressRule {
  readonly id: string;
  readonly reason: string;
}

/**
 * The version of this package
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports
export const version = require('../../../package.json').version;
/**
 * @internal This is an internal core function and should not be called directly by Solutions Constructs clients.
 *
 * @summary Creates a physical resource name in the style of the CDK (string+hash) - this value incorporates Stack ID,
 * so it will remain static in multiple updates of a single stack, but will be different in a separate stack instance
 * @param {IConstruct} scope - the CDK scope of the resource
 * @param {string} prefix - the prefix for the name
 * @param {string[]} parts - the various string components of the name (eg - stackName, solutions construct ID, L2 construct ID)
 * @param {number} maxLength - the longest string that can be returned
 * @returns {string} - a string with concatenated parts (truncated if necessary) + a hash of the full concatenated parts
 *
 * @deprecated This function is deprecated and will be removed in a future major version.
 * Please use the new function generatePhysicalNameV2 instead.
 */
export function generatePhysicalName(
  scope: IConstruct,
  prefix: string,
  parts: string[],
  maxLength: number,
): string {
  // The result will consist of:
  //    -The prefix - unaltered
  //    -The parts concatenated, but reduced in size to meet the maxLength limit for the overall name
  //    -A hyphen delimiter
  //    -The GUID portion of the stack arn

  const stackIdGuidLength = 36;
  const prefixLength = prefix.length;
  const maxPartsLength = maxLength - prefixLength - 1 - stackIdGuidLength; // 1 is the hyphen

  // Extract the Stack ID Guid
  const uniqueStackIdPart = cdk.Fn.select(2, cdk.Fn.split('/', `${cdk.Aws.STACK_ID}`));

  let allParts: string = '';

  parts.forEach((part) => {
    allParts += part;
  });

  if (allParts.length > maxPartsLength) {
    const subStringLength = maxPartsLength / 2;
    allParts = allParts.substring(0, subStringLength) + allParts.substring(allParts.length - subStringLength);
  }

  if (prefix.length + allParts.length + stackIdGuidLength + 1 /* hyphen */ > maxLength) {
    throw new ValidationError(`The generated name is longer than the maximum length of ${maxLength}`, scope);
  }

  return prefix.toLowerCase() + allParts + '-' + uniqueStackIdPart;
}

export interface GeneratePhysicalNameV2Options extends cdk.UniqueResourceNameOptions {
  /**
   * Whether to convert the name to lower case.
   *
   * @default false
   */
  lower?: boolean;

  /**
   * This object is hashed for uniqueness and can force a destroy instead of a replace.
   * @default: undefined
   */
  destroyCreate?: any;
}
/**
 * @internal This is an internal core function and should not be called directly by Solutions Constructs clients.
 *
 * @summary Creates a physical resource name in the style of the CDK (string+hash) - this value incorporates
 * the Stack Name and node ID, so it will remain static in multiple updates of a single stack, but will be
 * different in a separate stack instance.
 *
 * This new version allows for names shorter than 36 characters with control over casing.
 *
 * The minimum length is the length of the prefix and separator plus 10.
 */
export function generatePhysicalNameV2(
  /**
   * The CDK scope of the resource.
   */
  scope: IConstruct,
  /**
   * The prefix for the name.
   */
  prefix: string,
  /**
   * Options for generating the name.
   */
  options?: GeneratePhysicalNameV2Options,
): string {
  function objectToHash(obj: any): string {
    // Nothing to hash if undefined
    if (obj === undefined) { return ''; }

    // Convert the object to a JSON string
    const jsonString = JSON.stringify(obj);

    // Create a SHA-256 hash
    const hash = createHash('sha256');

    // Update the hash with the JSON string and get the digest in hexadecimal format
    // Shorten it (modeled after seven characters like git commit hash shortening)
    return hash.update(jsonString).digest('hex').slice(0, 7);
  }
  const {
    maxLength = 256,
    lower = false,
    separator = '',
    allowedSpecialCharacters = undefined,
    destroyCreate = undefined,
  } = options ?? {};
  const hash = objectToHash(destroyCreate);
  if (maxLength < (prefix + hash + separator).length) {
    throw new ValidationError(`The prefix length (${prefix.length}) plus hash length (${hash.length}) and separator length (${separator.length}) exceeds the maximum allowed length of ${maxLength}`, scope);
  }
  const uniqueName = cdk.Names.uniqueResourceName(
    scope,
    { maxLength: maxLength - (prefix + hash + separator).length, separator, allowedSpecialCharacters },
  );
  const name = `${prefix}${hash}${separator}${uniqueName}`;
  if (name.length > maxLength) {
    throw new ValidationError(`The generated name is longer than the maximum length of ${maxLength}`, scope);
  }
  return lower ? name.toLowerCase() : name;
}

export const maximumLambdaMemorySizeContextItem = 'maximumLambdaMemorySize';
export const recommendedMaximumLambdaMemorySize = 7076;
export function lambdaMemorySizeLimiter(construct: IConstruct, requestedMemorySizeInMegabytes: number) {
  const maximumLambdaMemorySize = construct.node.tryGetContext(maximumLambdaMemorySizeContextItem) === undefined ?
    recommendedMaximumLambdaMemorySize :
    parseInt(construct.node.tryGetContext(maximumLambdaMemorySizeContextItem));
  if (maximumLambdaMemorySize < recommendedMaximumLambdaMemorySize) {
    cdk.Annotations.of(construct).addWarning(
      `Maximum Lambda memorySize, ${maximumLambdaMemorySize}, is less than the recommended ${recommendedMaximumLambdaMemorySize}.`,
    );
  }
  if (requestedMemorySizeInMegabytes > maximumLambdaMemorySize) {
    cdk.Annotations.of(construct).addWarning(
      `Reducing Lambda memorySize, ${requestedMemorySizeInMegabytes} to ${maximumLambdaMemorySize} for ${construct.constructor.name}`,
    );
    return maximumLambdaMemorySize;
  } else {
    return requestedMemorySizeInMegabytes;
  }
}

/**
 * Adds CFN NAG suppress rules to the CDK resource.
 * @param resource The CDK resource
 * @param rules The CFN NAG suppress rules
 */
export function addCfnSuppressRules(resource: cdk.Resource | cdk.CfnResource, rules: CfnNagSuppressRule[]) {
  if (resource instanceof cdk.Resource) {
    resource = resource.node.defaultChild as cdk.CfnResource;
  }

  if (resource.cfnOptions.metadata?.cfn_nag?.rules_to_suppress) {
    resource.cfnOptions.metadata?.cfn_nag.rules_to_suppress.push(...rules);
  } else {
    resource.addMetadata('cfn_nag', {
      rules_to_suppress: rules,
    });
  }
}

function isObject(val: object) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

export function isPlainObject(o: object) {
  if (!isObject(o)) return false;

  if (Object.getPrototypeOf(o) === null) return true;

  let proto = o;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(o) === proto;
}
