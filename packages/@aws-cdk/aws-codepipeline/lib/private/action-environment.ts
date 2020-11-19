import { ResourceEnvironment, Stack, Token, TokenComparison } from '@aws-cdk/core';
import { IAction, IPipeline } from '../action';

/**
 * Helper routines reason about an Action's environment
 *
 * These are inappropriate to put on Action directly because they're only
 * interesting to the pipeline itself, and we can't put them on `FullActionDescriptor`
 * either since we need them before we have a `FullActionDescriptor`.
 */
export class ActionEnvironment {
  constructor(public readonly action: IAction, private readonly pipeline: IPipeline) {
  }

  public get isCrossRegion(): boolean {
    return !actionDimensionSameAsPipelineDimension(this.effectiveRegion, this.pipeline.env.region);
  }

  public get isCrossAccount(): boolean {
    return !actionDimensionSameAsPipelineDimension(this.effectiveAccount, this.pipeline.env.account);
  }

  /**
   * Returns the Stack of the resource backing this action
   * if they belong to the same environment.
   * Returns `undefined` if either this action is not backed by a resource,
   * or if the resource does not belong to the same env as its Stack
   * (which can happen for imported resources).
   */
  public get resourceStack(): Stack | undefined {
    const actionResource = this.action.actionProperties.resource;
    if (!actionResource) {
      return undefined;
    }

    const actionResourceStack = Stack.of(actionResource);
    const actionResourceStackEnv: ResourceEnvironment = {
      region: actionResourceStack.region,
      account: actionResourceStack.account,
    };

    return sameEnv(actionResource.env, actionResourceStackEnv) ? actionResourceStack : undefined;
  }

  /**
   * The region this action wants to execute in.
   * `undefined` means it wants to execute in the same region as the pipeline.
   */
  public get effectiveRegion(): string | undefined {
    return this.action.actionProperties.resource?.env.region
      ?? this.action.actionProperties.region;
  }

  /**
   * The account this action wants to execute in.
   * `undefined` means it wants to execute in the same account as the pipeline.
   */
  public get effectiveAccount(): string | undefined {
    return this.action.actionProperties.role?.env.account
      ?? this.action.actionProperties?.resource?.env.account
      ?? this.action.actionProperties.account;
  }
}

function actionDimensionSameAsPipelineDimension(actionDim: string | undefined, pipelineDim: string) {
  // if the action's dimension is `undefined`,
  // it means it is in the same region/account as the pipeline
  if (!actionDim) {
    return true;
  }
  // if the action's region/account is AWS::Region/AWS::AccountId,
  // we assume it's also in the same region/account as the pipeline
  if (Token.isUnresolved(actionDim)) {
    return true;
  }
  // here, we know the action's dimension is explicitly set;
  // in this case, it must be equal to the pipeline's dimension
  // for the action to be considered in the same region/account
  return Token.compareStrings(actionDim, pipelineDim) === TokenComparison.SAME;
}

/**
 * Whether the two envs represent the same environment
 */
function sameEnv(env1: ResourceEnvironment, env2: ResourceEnvironment) {
  return sameEnvDimension(env1.region, env2.region)
    && sameEnvDimension(env1.account, env2.account);
}

/**
 * Whether two string probably contain the same environment dimension (region or account)
 *
 * Used to compare either accounts or regions, and also returns true if both
 * are unresolved (in which case both are expted to be "current region" or "current account").
 */
function sameEnvDimension(dim1: string, dim2: string) {
  return [TokenComparison.SAME, TokenComparison.BOTH_UNRESOLVED].includes(Token.compareStrings(dim1, dim2));
}
