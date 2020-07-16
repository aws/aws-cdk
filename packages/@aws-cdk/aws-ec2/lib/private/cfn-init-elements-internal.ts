import * as iam from '@aws-cdk/aws-iam';
import { Construct } from '@aws-cdk/core';
import { InitPlatform } from '../cfn-init-elements';

/**
 * Context information passed when an InitElement is being consumed
 * @internal
 */
export interface InitBindOptions {
  /**
   * Scope in which to define any resources, if necessary.
   */
  readonly scope: Construct;

  /**
   * Which OS platform (Linux, Windows) the init block will be for.
   * Impacts which config types are available and how they are created.
   */
  readonly platform: InitPlatform;

  /**
   * Ordered index of current element type. Primarily used to auto-generate
   * command keys and retain ordering.
   */
  readonly index: number;

  /**
   * Instance role of the consuming instance or fleet
   */
  readonly instanceRole: iam.IRole;
}

/**
 * A return type for a configured InitElement. Both its CloudFormation representation, and any
 * additional metadata needed to create the CloudFormation:Init.
 * @internal
 */
export interface InitElementConfig {
  /**
   * The CloudFormation representation of the configuration of an InitElement.
   */
  readonly config: Record<string, any>;

  /**
   * Optional authentication blocks to be associated with the Init Config
   *
   * @default - No authentication associated with the config
   */
  readonly authentication?: Record<string, any>;
}