import * as cdk from '@aws-cdk/core';

export interface ICanary extends cdk.IResource {
  // Should have all the properties and method signatures associated with a canary
}

/**
 * Base of a canary
 */
export abstract class CanaryBase extends cdk.Resource implements ICanary {
}