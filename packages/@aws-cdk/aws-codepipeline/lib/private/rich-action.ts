import { Aws, ResourceEnvironment } from '@aws-cdk/core';
import { IAction } from '../action';

/**
 * Helper routines to work with Actions
 *
 * Can't put these on Action themselves since we only have an interface
 * and every library would need to reimplement everything (there is no
 * `ActionBase`).
 *
 * So here go the members that should have gone onto the Action class
 * but can't.
 *
 * It was probably my own idea but I don't want it anymore:
 * https://github.com/aws/aws-cdk/issues/10393
 */
export class RichAction {
  constructor(private readonly action: IAction) {
  }

  /**
   * The environment this action runs in
   */
  public get env(): ResourceEnvironment {
    return {
      account: (this.action.actionProperties.role?.env.account
        ?? this.action.actionProperties?.resource?.env.account
        ?? this.action.actionProperties.account
        ?? Aws.ACCOUNT_ID),
      region: (this.action.actionProperties.resource?.env.region
        ?? this.action.actionProperties.region
        ?? Aws.REGION),
    };
  }

};