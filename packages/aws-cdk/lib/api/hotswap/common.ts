import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import { CloudFormation } from 'aws-sdk';
import { ISDK } from '../aws-auth';
import { CloudFormationExecutableTemplate } from './cloudformation-executable-template';

export interface ListStackResources {
  listStackResources(): Promise<CloudFormation.StackResourceSummary[]>;
  findHotswappableResource(resource: HotswappableResource): Promise<string | undefined>;
}

export interface HotswappableResource {
  logicalId: string,
}

/**
 * An interface that represents a change that can be deployed in a short-circuit manner.
 */
export interface HotswapOperation {
  apply(sdk: ISDK, cfnExecutableTemplate: CloudFormationExecutableTemplate): Promise<any>;
}

/**
 * An enum that represents the result of detection whether a given change can be hotswapped.
 */
export enum ChangeHotswapImpact {
  /**
   * This result means that the given change cannot be hotswapped,
   * and requires a full deployment.
   */
  REQUIRES_FULL_DEPLOYMENT = 'requires-full-deployment',

  /**
   * This result means that the given change can be safely be ignored when determining
   * whether the given Stack can be hotswapped or not
   * (for example, it's a change to the CDKMetadata resource).
   */
  IRRELEVANT = 'irrelevant',
}

export type ChangeHotswapResult = HotswapOperation | ChangeHotswapImpact;

/**
 * Represents a change that can be hotswapped.
 */
export class HotswappableResourceChange {
  /**
   * The value the resource is being updated to.
   */
  newValue: cfn_diff.Resource;

  /**
   * The changes made to the resource properties.
   */
  propertyUpdates: { [key: string]: cfn_diff.PropertyDifference<any> };

  public constructor(newValue: cfn_diff.Resource, propertyUpdates: { [key: string]: cfn_diff.PropertyDifference<any> }) {
    this.newValue = newValue;
    this.propertyUpdates = propertyUpdates;
  }
}

export async function establishHotswappableResourceName(cfnExectuableTemplate: CloudFormationExecutableTemplate,
  resourceName: string | undefined, logicalId: string): Promise<string | undefined> {
  if (resourceName) {
    try {
      return await cfnExectuableTemplate.evaluateCfnExpression(resourceName);
    } catch (e) {
      // If we can't evaluate the resource's name CloudFormation expression,
      // just look it up in the currently deployed Stack
    }
  }
  return cfnExectuableTemplate.findPhysicalNameFor(logicalId);
}

export function assetMetadataChanged(change: HotswappableResourceChange): boolean {
  return !!change.newValue?.Metadata['aws:asset:path'];
}
