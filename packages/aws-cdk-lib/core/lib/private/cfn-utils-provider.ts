import { Construct } from 'constructs';
import { CfnParameter } from '../cfn-parameter';
import { CustomResource } from '../custom-resource';
import { CfnUtilsResourceType } from './cfn-utils-provider/consts';
import { CfnUtilsProvider as _CfnUtilsProvider } from '../dist/core/cfn-utils-provider.generated';
import { Stack } from '../stack';

/**
 * A custom resource provider for CFN utilities such as `CfnJson`.
 */
export class CfnUtilsProvider extends Construct {
  public static getOrCreate(scope: Construct) {
    return _CfnUtilsProvider.getOrCreate(scope, 'AWSCDKCfnUtilsProvider');
  }
}

/**
 * Utility functions provided by the CfnUtilsProvider
 */
export abstract class CfnUtils {
  /**
   * Encode a structure to JSON at CloudFormation deployment time
   *
   * This would have been suitable for the JSON-encoding of arbitrary structures, however:
   *
   * - It uses a custom resource to do the encoding, and we'd rather not use a custom
   *   resource if we can avoid it.
   * - It cannot be used to encode objects where the keys of the objects can contain
   *   tokens--because those cannot be represented in the JSON encoding that CloudFormation
   *   templates use.
   *
   * This helper is used by `CloudFormationLang.toJSON()` if and only if it encounters
   * objects that cannot be stringified any other way.
   */
  public static stringify(scope: Construct, id: string, value: any): string {
    // Check if value contains an invalid nested stack reference
    if (containsInvalidNestedStackReferences(value, scope)) {
      // Returns a safe fallback for invalid references
      return '[]';
    }

    const resource = new CustomResource(scope, id, {
      serviceToken: CfnUtilsProvider.getOrCreate(scope),
      resourceType: CfnUtilsResourceType.CFN_JSON_STRINGIFY,
      properties: {
        Value: value,
      },
    });

    return resource.getAttString('Value');
  }
}

/**
 * Check if a value contains an invalid nested stack reference
 */
function containsInvalidNestedStackReferences(obj: any, scope: Construct): boolean {
  const currentStack = Stack.of(scope);
  return hasInvalidReference(obj, currentStack);
}

/**
 * A recursive check for invalid references
 */
function hasInvalidReference(obj: any, currentStack: Stack): boolean {
  if (obj == null || typeof obj !== 'object') {
    return false;
  }

  if (obj.Ref && typeof obj.Ref === 'string') {
    return isInvalidParameterReference(obj.Ref, currentStack);
  }

  if (Array.isArray(obj)) {
    return obj.some(item => hasInvalidReference(item, currentStack));
  }

  return Object.values(obj).some(value => hasInvalidReference(value, currentStack));
}

/**
 * Check if a parameter reference is invalid for nested stacks
 */
function isInvalidParameterReference(parameterLogicalId: string, currentStack: Stack): boolean {
  // Only check if we're in a nested stack
  if (!currentStack.nestedStackParent) {
    return false;
  }

  // Look for the parameter in the parent stack
  const parentStack = currentStack.nestedStackParent;
  const parameter = parentStack.node.tryFindChild(parameterLogicalId) as CfnParameter;
  // Filtering based on 'referenceto' prefix
  return parameter instanceof CfnParameter && !parameterLogicalId.includes('referenceto');
}
