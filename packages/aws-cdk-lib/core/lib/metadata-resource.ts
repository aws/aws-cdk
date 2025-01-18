import { Construct, IConstruct } from 'constructs';
import { RESOURCE_SYMBOL } from './constants';
import { Resource } from './resource';
import { Token } from './token';

/**
 * List of fields that must be redacted regardless.
 * i.e. grantPrincipal for ServicePrincipal class will always reference to
 * this construct, so we need to redact it regardless of the value, otherwise
 * causing recursion to never end.
 */
const FIELDS_TO_REDACT = ['grantPrincipal', 'node'];

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
  }
}

function addMetadata(scope: Construct, type: MetadataType, props: any): void {
  scope.node.addMetadata(type, redactTelemetryDataHelper(props));
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
export function redactTelemetryDataHelper(data: any, visited = new WeakSet()): any {
  if (typeof data === 'boolean') {
    return data; // Return booleans as-is
  }

  if (Array.isArray(data)) {
    // Handle arrays by recursively redacting each element
    return data.map((item) => redactTelemetryDataHelper(item, visited));
  }

  if (data && Token.isUnresolved(data)) {
    return '*';
  }

  if (data && Object.keys(data).length > 0 && typeof data === 'object') {
    // Handle objects by iterating over their key-value pairs
    if (Construct.isConstruct(data)) {
      return '*';
    }

    if (visited.has(data)) {
      // Redact duplicates or circular references
      return '*';
    }
    visited.add(data);

    /**
     * @TODO we need to build a JSON blueprint of class and props. If 'data' matches
     * any leaf node in the blueprint, then redact the value to avoid logging customer
     * data.
     */
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(data)) {
      if (FIELDS_TO_REDACT.includes(key)) {
        result[key] = '*';
        continue;
      }
      if (key && Token.isUnresolved(key)) {
        continue;
      }
      result[key] = redactTelemetryDataHelper(value, visited);
    }
    return result;
  }

  return '*';
}
