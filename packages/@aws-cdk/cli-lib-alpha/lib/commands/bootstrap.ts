import { SharedOptions } from './common';

/**
 * Options to use with cdk bootstrap
 */
export interface BootstrapOptions extends SharedOptions {
  /**
   * The target AWS environments to deploy the bootstrap stack to.
   * Uses the following format: `aws://<account-id>/<region>`
   *
   * @example "aws://123456789012/us-east-1"
   * @default - Bootstrap all environments referenced in the CDK app or determine an environment from local configuration.
   */
  readonly environments?: string[];

  /**
   * The name of the CDK toolkit stack to create
   */
  readonly toolkitStackName?: string;

  /**
   * The name of the CDK toolkit bucket; bucket will be created and
   * must not exist
   * @default - auto-generated CloudFormation name
   */
  readonly bootstrapBucketName?: string;

  /**
   * Always bootstrap even if it would downgrade template version
   * @default false
   */
  readonly force?: boolean;

  /**
   * The Managed Policy ARNs that should be attached to the
   * role performing deployments into this environment (may be repeated, modern bootstrapping only)
   * @default - none
   */
  readonly cfnExecutionPolicy?: string;

  /**
   * Instead of actual bootstrapping, print the current
   * CLI\'s bootstrapping template to stdout for customization
   * @default false
   */
  readonly showTemplate?: boolean;

  /**
   * Use the template from the given file instead of the
   * built-in one (use --show-template to obtain an example)
   */
  readonly template?: string;

  /**
   * Toggle CloudFormation termination protection on the
   * bootstrap stacks
   * @default false
   */
  readonly terminationProtection?: boolean;

  /**
   * Use the example permissions boundary.
   * @default undefined
   */
  readonly examplePermissionsBoundary?: boolean;

  /**
   * Use the permissions boundary specified by name.
   * @default undefined
   */
  readonly customPermissionsBoundary?: string;

  /**
   * Use previous values for existing parameters (you must specify
   * all parameters on every deployment if this is disabled)
   * @default true
   */
  readonly usePreviousParameters?: boolean;

  /**
   * Whether to execute ChangeSet (--no-execute will NOT execute
   * the ChangeSet)
   * @default true
   */
  readonly execute?: boolean;

  /**
   * String which must be unique for each bootstrap stack. You
   * must configure it on your CDK app if you change this
   * from the default.
   * @default undefined
   */
  readonly qualifier?: string;

  /**
   * The AWS account IDs that should be trusted to perform
   * deployments into this environment (may be repeated,
   * modern bootstrapping only)
   * @default undefined
   */
  readonly trust?: string;

  /**
   * The AWS account IDs that should be trusted to look
   * up values in this environment (may be repeated,
   * modern bootstrapping only)
   * @default undefined
   */
  readonly trustForLookup?: string;

  /**
   * AWS KMS master key ID used for the SSE-KMS encryption
   * @default undefined
   */
  readonly bootstrapKmsKeyId?: string;

  /**
   * Create a Customer Master Key (CMK) for the bootstrap
   * bucket (you will be charged but can customize
   * permissions, modern bootstrapping only)
   * @default undefined
   */
  readonly bootstrapCustomerKey?: string;

  /**
   * Block public access configuration on CDK toolkit
   * bucket (enabled by default)
   * @default undefined
   */
  readonly publicAccessBlockConfiguration?: string;
}
