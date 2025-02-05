import { Construct, IConstruct } from 'constructs';
import { AWS_CDK_CONSTRUCTOR_PROPS } from './analytics-data-source/classes';
import { AWS_CDK_ENUMS } from './analytics-data-source/enums';
import { Annotations } from './annotations';
import { RESOURCE_SYMBOL, JSII_RUNTIME_SYMBOL } from './constants';
import { FeatureFlags } from './feature-flags';
import { Resource } from './resource';
import { Token } from './token';
import { ENABLE_ADDITIONAL_METADATA_COLLECTION } from '../../cx-api';

/**
 * Enumeration of metadata types used for tracking analytics in AWS CDK.
 */
export enum MetadataType {
  /**
   * Metadata type for construct properties.
   * This is used to represent properties of CDK constructs.
   */
  CONSTRUCT = 'aws:cdk:analytics:construct',

  /**
   * Metadata type for method properties.
   * This is used to track parameters and details of CDK method calls.
   */
  METHOD = 'aws:cdk:analytics:method',

  /**
   * Metadata type for feature flags.
   * This is used to track analytics related to feature flags in the CDK.
   */
  FEATURE_FLAG = 'aws:cdk:analytics:featureflag',
}

export function addConstructMetadata(scope: Construct, props: any): void {
  try {
    addMetadata(scope, MetadataType.CONSTRUCT, props);
  } catch (e) {
    /**
     * Errors are ignored here.
     * We do not want the metadata parsing to block users to synth or
     * deploy their CDK application.
     *
     * Without this, it will just fall back to the previous metadata
     * collection strategy.
     */
    Annotations.of(scope).addWarningV2('@aws-cdk/core:addConstructMetadataFailed', `Failed to add construct metadata for node [${scope.node.id}]. Reason: ${e}`);
  }
}

export function addMethodMetadata(scope: Construct, methodName: string, props: any): void {
  try {
    addMetadata(scope, MetadataType.METHOD, {
      [methodName]: props,
    });
  } catch (e) {
    /**
     * Errors are ignored here.
     * We do not want the metadata parsing to block users to synth or
     * deploy their CDK application.
     *
     * Without this, it will just fall back to the previous metadata
     * collection strategy.
     */
    Annotations.of(scope).addWarningV2('@aws-cdk/core:addMethodMetadataFailed', `Failed to add method metadata for node [${scope.node.id}], method name ${methodName}. Reason: ${e}`);
  }
}

/**
 * Method decorator for tracking analytics metadata.
 * This decorator is used to track method calls in the CDK.
 */
export function MethodMetadata(): MethodDecorator {
  return function (_: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    // Ensure the Decorator is Only Applied to Methods
    if (!descriptor || typeof descriptor.value !== 'function') {
      return descriptor;
    }
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const scope = this as Construct;
      if (scope instanceof Construct) {
        addMethodMetadata(scope, propertyKey.toString(), args);
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

export function addMetadata(scope: Construct, type: MetadataType, props: any): void {
  const telemetryEnabled = FeatureFlags.of(scope).isEnabled(ENABLE_ADDITIONAL_METADATA_COLLECTION) ?? false;
  if (!telemetryEnabled) {
    return;
  }
  const fqn: string = Object.getPrototypeOf(scope).constructor[JSII_RUNTIME_SYMBOL].fqn;
  scope.node.addMetadata(type, redactMetadata(fqn, props));
}

/**
 * Check whether the given construct is a Resource. Note that this is
 * duplicated function from 'core/lib/resource.ts' to avoid circular
 * dependencies in imports.
 */
export function isResource(construct: IConstruct): construct is Resource {
  return construct !== null && typeof(construct) === 'object' && RESOURCE_SYMBOL in construct;
}

/**
 * Redact values from dictionary values other than Boolean and ENUM-type values.
 * @TODO we will build a JSON blueprint of ENUM-type values in the codebase and
 * do not redact the ENUM-type values if it match any key in the blueprint.
 */
export function redactMetadata(fqn: string, data: any): any {
  // A valid fqn is consists of 3 parts, i.e. `aws-cdk-lib.aws-lambda.Function`.
  const fqnParts = fqn.replace(/[-_]/g, '-').split('.');
  if (fqnParts.length !== 3) {
    return '*';
  }
  const module = fqnParts.slice(0, 2).join('.');
  const name = fqnParts[2];
  if (!Object.keys(AWS_CDK_CONSTRUCTOR_PROPS).includes(module)) {
    // redact if the module is not in the blueprint
    return '*';
  }

  if (!Object.keys(AWS_CDK_CONSTRUCTOR_PROPS[module]).includes(name)) {
    // redact if class is not found in module in blueprint
    return '*';
  }

  const allowedKeys = AWS_CDK_CONSTRUCTOR_PROPS[module][name];
  return redactTelemetryDataHelper(allowedKeys, data);
}

export function redactTelemetryDataHelper(allowedKeys: any, data: any): any {
  // If no key is allowed
  if (allowedKeys === undefined) {
    return '*';
  }

  // Return boolean as is
  if (typeof data === 'boolean') {
    return data;
  }

  // Do not redact boolean value
  if (isEnumValue(allowedKeys, data)) {
    return data;
  }

  // Redact string value or number value
  if (typeof data === 'string' || typeof data === 'number') {
    return '*';
  }

  // Redact unresolved token
  if (data && Token.isUnresolved(data)) {
    return '*';
  }

  if (Array.isArray(data)) {
    // Handle arrays by recursively redacting each element
    return data.map((item, index) => {
      // If the 'allowedKeys' is an array of items, use the index
      // to get the allowed key
      if (Array.isArray(allowedKeys)) {
        return redactTelemetryDataHelper(allowedKeys[index], item);
      }
      return redactTelemetryDataHelper(allowedKeys, item);
    });
  }

  // Handle objects by iterating over their key-value pairs
  if (data && Object.keys(data).length > 0 && typeof data === 'object') {
    // If object is any construct, redact it to avoid duplication
    if (Construct.isConstruct(data)) {
      return '*';
    }

    const redactedResult: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      // if key is unresolved token, we skip the key entirely
      if (key && Token.isUnresolved(key)) {
        continue;
      }

      // Redact any keys that do not exist in the blueprint
      if (allowedKeys && typeof allowedKeys === 'object') {
        if (!Object.keys(allowedKeys).includes(key)) {
          continue;
        }

        // Redact any value is the value is customer input
        const allowedValue = allowedKeys[key];
        if (allowedValue === '*') {
          redactedResult[key] = '*';
          continue;
        }

        redactedResult[key] = redactTelemetryDataHelper(allowedKeys[key], value);
      }
    }
    return redactedResult;
  }

  // Redact any other type of data
  return '*';
}

/**
 * Check if a value is an ENUM and matches the ENUM blueprint.
 */
export function isEnumValue(allowedKeys: any, value: any): boolean {
  if (typeof allowedKeys !== 'string' || allowedKeys === '*') {
    return false;
  }

  if (!Object.keys(AWS_CDK_ENUMS).includes(allowedKeys)) {
    return false;
  }

  return AWS_CDK_ENUMS[allowedKeys].includes(value);
}
