import * as cdk from '../../core';

/**
 * Represents a CloudWatch Synthetics Canary
 */
export interface ICanary extends cdk.IResource {
  /**
   * The ID of the canary
   * @attribute
   */
  readonly canaryId: string;

  /**
   * The name of the canary
   * @attribute
   */
  readonly canaryName: string;

  /**
   * The ARN of the canary
   * @attribute
   */
  readonly canaryArn: string;
}

/**
 * Represents a CloudWatch Synthetics Group
 */
export interface IGroup extends cdk.IResource {
  /**
   * The ID of the group
   * @attribute
   */
  readonly groupId: string;

  /**
   * The name of the group
   * @attribute
   */
  readonly groupName: string;

  /**
   * The ARN of the group
   * @attribute
   */
  readonly groupArn: string;

  /**
   * Add a canary to this group
   *
   * @param canary The canary to add to the group
   */
  addCanary(canary: ICanary): void;
}
