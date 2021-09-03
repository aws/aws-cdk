import * as cfn_diff from '@aws-cdk/cloudformation-diff';
import { CloudFormation } from 'aws-sdk';
import { ISDK } from '../aws-auth';
import { evaluateCfn } from '../util/cloudformation/evaluate-cfn';

export interface ListStackResources {
  listStackResources(): Promise<CloudFormation.StackResourceSummary[]>;
}

/**
 * An interface that represents a change that can be deployed in a short-circuit manner.
 */
export interface HotswapOperation {
  apply(sdk: ISDK, stackResources: ListStackResources): Promise<any>;
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
 * For old-style synthesis which uses CFN Parameters,
 * the Code properties can have the values of complex CFN expressions.
 * For new-style synthesis of env-agnostic stacks,
 * the Fn::Sub expression is used for the Asset bucket.
 * Evaluate the CFN expressions to concrete string values which we need for the
 * updateFunctionCode() service call.
 */
export function stringifyPotentialCfnExpression(value: any, assetParamsWithEnv: { [key: string]: string }): string {
  // if we already have a string, nothing to do
  if (value == null || typeof value === 'string') {
    return value;
  }

  // otherwise, we assume this is a CloudFormation expression that we need to evaluate
  return evaluateCfn(value, assetParamsWithEnv);
}

export function assetMetadataChanged(change: cfn_diff.ResourceDifference): boolean {
  return !!change.newValue?.Metadata['aws:asset:path'];
}
