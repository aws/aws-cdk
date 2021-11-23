import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';

/**
 * The type of the init element.
 */
export enum InitElementType {
  PACKAGE = 'PACKAGE',
  GROUP = 'GROUP',
  USER = 'USER',
  SOURCE = 'SOURCE',
  FILE = 'FILE',
  COMMAND = 'COMMAND',
  SERVICE = 'SERVICE',
}

/**
 * The platform to which the init template applies.
 */
export enum InitPlatform {
  WINDOWS = 'WINDOWS',
  LINUX = 'LINUX',
}

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
 * additional metadata needed to create the CloudFormation::Init.
 *
 * Marked internal so as not to leak the underlying L1 representation.
 *
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

  /**
   * Optional string representing a hash of the asset associated with this element (if any).
   *
   * @default - No hash is provided
   */
  readonly assetHash?: string;
}
