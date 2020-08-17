import * as iam from '@aws-cdk/aws-iam';
import { Construct } from '@aws-cdk/core';
import { OperatingSystemType } from '../machine-image';
import { UserData } from '../user-data';

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
}

/**
 * Options for attach a CloudFormationInit to a resource
 */
export interface AttachInitOptions {
  /**
   * Instance role of the consuming instance or fleet
   */
  readonly instanceRole: iam.IRole;

  /**
   * OS Platform the init config will be used for
   */
  readonly platform: OperatingSystemType;

  /**
   * UserData to add commands to
   */
  readonly userData: UserData;

  /**
   * ConfigSet to activate
   *
   * @default ['default']
   */
  readonly configSets?: string[];

  /**
   * Whether to embed a hash into the userData
   *
   * If `true` (the default), a hash of the config will be embedded into the
   * UserData, so that if the config changes, the UserData changes and
   * the instance will be replaced.
   *
   * If `false`, no such hash will be embedded, and if the CloudFormation Init
   * config changes nothing will happen to the running instance.
   *
   * @default true
   */
  readonly embedFingerprint?: boolean;

  /**
   * Print the results of running cfn-init to the Instance System Log
   *
   * By default, the output of running cfn-init is written to a log file
   * on the instance. Set this to `true` to print it to the System Log
   * (visible from the EC2 Console), `false` to not print it.
   *
   * (Be aware that the system log is refreshed at certain points in
   * time of the instance life cycle, and successful execution may
   * not always show up).
   *
   * @default true
   */
  readonly printLog?: boolean;

  /**
   * Don't fail the instance creation when cfn-init fails
   *
   * You can use this to prevent CloudFormation from rolling back when
   * instances fail to start up, to help in debugging.
   *
   * @default false
   */
  readonly ignoreFailures?: boolean;
}
