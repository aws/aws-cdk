// --------------------------------------------------------------------------------
// This file defines context keys that enable certain features that are
// implemented behind a flag in order to preserve backwards compatibility for
// existing apps. When a new app is initialized through `cdk init`, the CLI will
// automatically add enable these features by adding them to the generated
// `cdk.json` file.
//
// Some of these flags only affect the behavior of the construct library --
// these will be removed in the next major release and the behavior they are
// gating will become the only behavior.
//
// Other flags also affect the generated CloudFormation templates, in a way
// that prevents seamless upgrading. In the next major version, their
// behavior will become the default, but the flag still exists so users can
// switch it *off* in order to revert to the old behavior. These flags
// are marked with with the [PERMANENT] tag below.
//
// See https://github.com/aws/aws-cdk-rfcs/blob/master/text/0055-feature-flags.md
// --------------------------------------------------------------------------------

/**
 * If this is set, multiple stacks can use the same stack name (e.g. deployed to
 * different environments). This means that the name of the synthesized template
 * file will be based on the construct path and not on the defined `stackName`
 * of the stack.
 *
 * This is a "future flag": the feature is disabled by default for backwards
 * compatibility, but new projects created using `cdk init` will have this
 * enabled through the generated `cdk.json`.
 */
export const ENABLE_STACK_NAME_DUPLICATES_CONTEXT = '@aws-cdk/core:enableStackNameDuplicates';

/**
 * Determines what status code `cdk diff` should return when the specified stack
 * differs from the deployed stack or the local CloudFormation template:
 *
 *  * aws-cdk:enableDiffNoFail=true => status code == 0
 *  * aws-cdk:enableDiffNoFail=false => status code == 1
 *
 * You can override this behavior with the --fail flag:
 *
 *  * --fail => status code == 1
 *  * --no-fail => status code == 0
 */
export const ENABLE_DIFF_NO_FAIL_CONTEXT = 'aws-cdk:enableDiffNoFail';
/** @deprecated use `ENABLE_DIFF_NO_FAIL_CONTEXT` */
export const ENABLE_DIFF_NO_FAIL = ENABLE_DIFF_NO_FAIL_CONTEXT;

/**
 * Switch to new stack synthesis method which enable CI/CD
 *
 * [PERMANENT]
 */
export const NEW_STYLE_STACK_SYNTHESIS_CONTEXT = '@aws-cdk/core:newStyleStackSynthesis';

/**
 * Name exports based on the construct paths relative to the stack, rather than the global construct path
 *
 * Combined with the stack name this relative construct path is good enough to
 * ensure uniqueness, and makes the export names robust against refactoring
 * the location of the stack in the construct tree (specifically, moving the Stack
 * into a Stage).
 *
 * [PERMANENT]
 */
export const STACK_RELATIVE_EXPORTS_CONTEXT = '@aws-cdk/core:stackRelativeExports';

/**
 * DockerImageAsset properly supports `.dockerignore` files by default
 *
 * If this flag is not set, the default behavior for `DockerImageAsset` is to use
 * glob semantics for `.dockerignore` files. If this flag is set, the default behavior
 * is standard Docker ignore semantics.
 *
 * This is a feature flag as the old behavior was technically incorrect but
 * users may have come to depend on it.
 */
export const DOCKER_IGNORE_SUPPORT = '@aws-cdk/aws-ecr-assets:dockerIgnoreSupport';

/**
 * Secret.secretName for an "owned" secret will attempt to parse the secretName from the ARN,
 * rather than the default full resource name, which includes the SecretsManager suffix.
 *
 * If this flag is not set, Secret.secretName will include the SecretsManager suffix, which cannot be directly
 * used by SecretsManager.DescribeSecret, and must be parsed by the user first (e.g., Fn:Join, Fn:Select, Fn:Split).
 */
export const SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME = '@aws-cdk/aws-secretsmanager:parseOwnedSecretName';

/**
 * KMS Keys start with a default key policy that grants the account access to administer the key,
 * mirroring the behavior of the KMS SDK/CLI/Console experience. Users may override the default key
 * policy by specifying their own.
 *
 * If this flag is not set, the default key policy depends on the setting of the `trustAccountIdentities`
 * flag. If false (the default, for backwards-compatibility reasons), the default key policy somewhat
 * resemebles the default admin key policy, but with the addition of 'GenerateDataKey' permissions. If
 * true, the policy matches what happens when this feature flag is set.
 *
 * Additionally, if this flag is not set and the user supplies a custom key policy, this will be appended
 * to the key's default policy (rather than replacing it).
 */
export const KMS_DEFAULT_KEY_POLICIES = '@aws-cdk/aws-kms:defaultKeyPolicies';

/**
 * Change the old 's3:PutObject*' permission to 's3:PutObject' on Bucket,
 * as the former includes 's3:PutObjectAcl',
 * which could be used to grant read/write object access to IAM principals in other accounts.
 * Use a feature flag to make sure existing customers who might be relying
 * on the overly-broad permissions are not broken.
 */
export const S3_GRANT_WRITE_WITHOUT_ACL = '@aws-cdk/aws-s3:grantWriteWithoutAcl';

/**
 * ApplicationLoadBalancedServiceBase, ApplicationMultipleTargetGroupServiceBase,
 * NetworkLoadBalancedServiceBase, NetworkMultipleTargetGroupServiceBase, and
 * QueueProcessingServiceBase currently determine a default value for the desired count of
 * a CfnService if a desiredCount is not provided.
 *
 * If this flag is not set, the default behaviour for CfnService.desiredCount is to set a
 * desiredCount of 1, if one is not provided. If true, a default will not be defined for
 * CfnService.desiredCount and as such desiredCount will be undefined, if one is not provided.
 *
 * This is a feature flag as the old behavior was technically incorrect, but
 * users may have come to depend on it.
 */
export const ECS_REMOVE_DEFAULT_DESIRED_COUNT = '@aws-cdk/aws-ecs-patterns:removeDefaultDesiredCount';

/**
 * ServerlessCluster.clusterIdentifier currently can has uppercase letters,
 * and ServerlessCluster pass it through to CfnDBCluster.dbClusterIdentifier.
 * The identifier is saved as lowercase string in AWS and is resolved as original string in CloudFormation.
 *
 * If this flag is not set, original value that one set to ServerlessCluster.clusterIdentifier
 * is passed to CfnDBCluster.dbClusterIdentifier.
 * If this flag is true, ServerlessCluster.clusterIdentifier is converted into a string containing
 * only lowercase characters by the `toLowerCase` function and passed to CfnDBCluster.dbClusterIdentifier.
 *
 * This feature flag make correct the ServerlessCluster.clusterArn when
 * clusterIdentifier contains a Upper case letters.
 *
 * [PERMANENT]
 */
export const RDS_LOWERCASE_DB_IDENTIFIER = '@aws-cdk/aws-rds:lowercaseDbIdentifier';

/**
 * The UsagePlanKey resource connects an ApiKey with a UsagePlan. API Gateway does not allow more than one UsagePlanKey
 * for any given UsagePlan and ApiKey combination. For this reason, CloudFormation cannot replace this resource without
 * either the UsagePlan or ApiKey changing.
 *
 * The feature addition to support multiple UsagePlanKey resources - 142bd0e2 - recognized this and attempted to keep
 * existing UsagePlanKey logical ids unchanged.
 * However, this intentionally caused the logical id of the UsagePlanKey to be sensitive to order. That is, when
 * the 'first' UsagePlanKey resource is removed, the logical id of the 'second' assumes what was originally the 'first',
 * which again is disallowed.
 *
 * In effect, there is no way to get out of this mess in a backwards compatible way, while supporting existing stacks.
 * This flag changes the logical id layout of UsagePlanKey to not be sensitive to order.
 *
 * [PERMANENT]
 */
export const APIGATEWAY_USAGEPLANKEY_ORDERINSENSITIVE_ID = '@aws-cdk/aws-apigateway:usagePlanKeyOrderInsensitiveId';

/**
 * Enable this feature flag to have elastic file systems encrypted at rest by default.
 *
 * Encryption can also be configured explicitly using the `encrypted` property.
 */
export const EFS_DEFAULT_ENCRYPTION_AT_REST = '@aws-cdk/aws-efs:defaultEncryptionAtRest';

/**
 * Enable this feature flag to opt in to the updated logical id calculation for Lambda Version created using the
 * `fn.currentVersion`.
 *
 * The previous calculation incorrectly considered properties of the `AWS::Lambda::Function` resource that did
 * not constitute creating a new Version.
 *
 * See 'currentVersion' section in the aws-lambda module's README for more details.
 *
 * [PERMANENT]
 */
export const LAMBDA_RECOGNIZE_VERSION_PROPS = '@aws-cdk/aws-lambda:recognizeVersionProps';

/**
 * Enable this feature flag to opt in to the updated logical id calculation for Lambda Version created using the
 * `fn.currentVersion`.
 *
 * This flag correct incorporates Lambda Layer properties into the Lambda Function Version.
 *
 * See 'currentVersion' section in the aws-lambda module's README for more details.
 *
 * [PERMANENT]
 */
export const LAMBDA_RECOGNIZE_LAYER_VERSION = '@aws-cdk/aws-lambda:recognizeLayerVersion';

/**
 * Enable this feature flag to have cloudfront distributions use the security policy TLSv1.2_2021 by default.
 *
 * The security policy can also be configured explicitly using the `minimumProtocolVersion` property.
 *
 * [PERMANENT]
 */
export const CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021 = '@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021';

/**
 * Enable this flag to make it impossible to accidentally use SecretValues in unsafe locations
 *
 * With this flag enabled, `SecretValue` instances can only be passed to
 * constructs that accept `SecretValue`s; otherwise, `unsafeUnwrap()` must be
 * called to use it as a regular string.
 */
export const CHECK_SECRET_USAGE = '@aws-cdk/core:checkSecretUsage';

/**
 * What regions to include in lookup tables of environment agnostic stacks
 *
 * Has no effect on stacks that have a defined region, but will limit the amount
 * of unnecessary regions included in stacks without a known region.
 *
 * The type of this value should be a list of strings.
 *
 * [PERMANENT]
 */
export const TARGET_PARTITIONS = '@aws-cdk/core:target-partitions';

/**
 * Enable this feature flag to configure default logging behavior for the ECS Service Extensions. This will enable the
 * `awslogs` log driver for the application container of the service to send the container logs to CloudWatch Logs.
 *
 * This is a feature flag as the new behavior provides a better default experience for the users.
 *
 * [PERMANENT]
 */
export const ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER = '@aws-cdk-containers/ecs-service-extensions:enableDefaultLogDriver';

/**
 * Enable this feature flag to have Launch Templates generated by the `InstanceRequireImdsv2Aspect` use unique names.
 *
 * Previously, the generated Launch Template names were only unique within a stack because they were based only on the
 * `Instance` construct ID. If another stack that has an `Instance` with the same construct ID is deployed in the same
 * account and region, the deployments would always fail as the generated Launch Template names were the same.
 *
 * The new implementation addresses this issue by generating the Launch Template name with the `Names.uniqueId` method.
 */
export const EC2_UNIQUE_IMDSV2_LAUNCH_TEMPLATE_NAME = '@aws-cdk/aws-ec2:uniqueImdsv2TemplateName';

/**
 * ARN format used by ECS. In the new ARN format, the cluster name is part
 * of the resource ID.
 *
 * If this flag is not set, the old ARN format (without cluster name) for ECS is used.
 * If this flag is set, the new ARN format (with cluster name) for ECS is used.
 *
 * This is a feature flag as the old format is still valid for existing ECS clusters.
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-account-settings.html#ecs-resource-ids
 */
export const ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME = '@aws-cdk/aws-ecs:arnFormatIncludesClusterName';

/**
 * Minimize IAM policies by combining Principals, Actions and Resources of two
 * Statements in the policies, as long as it doesn't change the meaning of the
 * policy.
 *
 * [PERMANENT]
 */
export const IAM_MINIMIZE_POLICIES = '@aws-cdk/aws-iam:minimizePolicies';

/**
 * Makes sure we do not allow snapshot removal policy on resources that do not support it.
 * If supplied on an unsupported resource, CloudFormation ignores the policy altogether.
 * This flag will reduce confusion and unexpected loss of data when erroneously supplying
 * the snapshot removal policy.
 *
 * [PERMANENT]
 */
export const VALIDATE_SNAPSHOT_REMOVAL_POLICY = '@aws-cdk/core:validateSnapshotRemovalPolicy';

/**
 * Enable this feature flag to have CodePipeline generate a unique cross account key alias name using the stack name.
 *
 * Previously, when creating multiple pipelines with similar naming conventions and when crossAccountKeys is true,
 * the KMS key alias name created for these pipelines may be the same due to how the uniqueId is generated.
 *
 * This new implementation creates a stack safe resource name for the alias using the stack name instead of the stack ID.
 */
export const CODEPIPELINE_CROSS_ACCOUNT_KEY_ALIAS_STACK_SAFE_RESOURCE_NAME = '@aws-cdk/aws-codepipeline:crossAccountKeyAliasStackSafeResourceName';

/**
 * Enable this feature flag to create an S3 bucket policy by default in cases where
 * an AWS service would automatically create the Policy if one does not exist.
 *
 * For example, in order to send VPC flow logs to an S3 bucket, there is a specific Bucket Policy
 * that needs to be attached to the bucket. If you create the bucket without a policy and then add the
 * bucket as the flow log destination, the service will automatically create the bucket policy with the
 * necessary permissions. If you were to then try and add your own bucket policy CloudFormation will throw
 * and error indicating that a bucket policy already exists.
 *
 * In cases where we know what the required policy is we can go ahead and create the policy so we can
 * remain in control of it.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html#AWS-logs-infrastructure-S3
 */
export const S3_CREATE_DEFAULT_LOGGING_POLICY = '@aws-cdk/aws-s3:createDefaultLoggingPolicy';

/**
* Enable this feature flag to restrict the decryption of a SQS queue, which is subscribed to a SNS topic, to
* only the topic which it is subscribed to and not the whole SNS service of an account.
*
* Previously the decryption was only restricted to the SNS service principal. To make the SQS subscription more
* secure, it is a good practice to restrict the decryption further and only allow the connected SNS topic to decryption
* the subscribed queue.
*
*/
export const SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY = '@aws-cdk/aws-sns-subscriptions:restrictSqsDescryption';

/**
 * Enable this feature flag to get partition names as string literals in Stacks with known regions defined in
 * their environment, such as "aws" or "aws-cn".  Previously the CloudFormation intrinsic function
 * "Ref: AWS::Partition" was used.  For example:
 *
 * ```yaml
 * Principal:
 *   AWS:
 *     Fn::Join:
 *       - ""
 *       - - "arn:"
 *         - Ref: AWS::Partition
 *         - :iam::123456789876:root
 * ```
 *
 * becomes:
 *
 * ```
 * Principal:
 *   AWS: "arn:aws:iam::123456789876:root"
 * ```
 *
 * The intrinsic function will still be used in Stacks where no region is defined or the region's partition
 * is unknown.
 */
export const ENABLE_PARTITION_LITERALS = '@aws-cdk/core:enablePartitionLiterals';

/**
 * Flag values that should apply for new projects
 *
 * Add a flag in here (typically with the value `true`), to enable
 * backwards-breaking behavior changes only for new projects.  New projects
 * generated through `cdk init` will include these flags in their generated
 *
 * Tests must cover the default (disabled) case and the future (enabled) case.
 */
export const FUTURE_FLAGS: { [key: string]: boolean } = {
  [APIGATEWAY_USAGEPLANKEY_ORDERINSENSITIVE_ID]: true,
  [ENABLE_STACK_NAME_DUPLICATES_CONTEXT]: true,
  [ENABLE_DIFF_NO_FAIL_CONTEXT]: true,
  [STACK_RELATIVE_EXPORTS_CONTEXT]: true,
  [DOCKER_IGNORE_SUPPORT]: true,
  [SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME]: true,
  [KMS_DEFAULT_KEY_POLICIES]: true,
  [S3_GRANT_WRITE_WITHOUT_ACL]: true,
  [ECS_REMOVE_DEFAULT_DESIRED_COUNT]: true,
  [RDS_LOWERCASE_DB_IDENTIFIER]: true,
  [EFS_DEFAULT_ENCRYPTION_AT_REST]: true,
  [LAMBDA_RECOGNIZE_VERSION_PROPS]: true,
  [LAMBDA_RECOGNIZE_LAYER_VERSION]: true,
  [CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021]: true,
  [ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER]: true,
  [EC2_UNIQUE_IMDSV2_LAUNCH_TEMPLATE_NAME]: true,
  [CHECK_SECRET_USAGE]: true,
  [IAM_MINIMIZE_POLICIES]: true,
  [ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME]: true,
  [VALIDATE_SNAPSHOT_REMOVAL_POLICY]: true,
  [CODEPIPELINE_CROSS_ACCOUNT_KEY_ALIAS_STACK_SAFE_RESOURCE_NAME]: true,
  [S3_CREATE_DEFAULT_LOGGING_POLICY]: true,
  [SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY]: true,
  [ENABLE_PARTITION_LITERALS]: true,
};

/**
 * Values that will be set by default in a new project, which are not necessarily booleans (and don't expire)
 */
export const NEW_PROJECT_DEFAULT_CONTEXT: { [key: string]: any} = {
  [TARGET_PARTITIONS]: ['aws', 'aws-cn'],
};

/**
 * The list of future flags that are now expired. This is going to be used to identify
 * and block usages of old feature flags in the new major version of CDK.
 */
export const FUTURE_FLAGS_EXPIRED: string[] = [
  DOCKER_IGNORE_SUPPORT,
  ECS_REMOVE_DEFAULT_DESIRED_COUNT,
  EFS_DEFAULT_ENCRYPTION_AT_REST,
  ENABLE_DIFF_NO_FAIL_CONTEXT,
  ENABLE_STACK_NAME_DUPLICATES_CONTEXT,
  KMS_DEFAULT_KEY_POLICIES,
  S3_GRANT_WRITE_WITHOUT_ACL,
  SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME,
];

/**
 * The default values of each of these flags.
 *
 * This is the effective value of the flag, unless it's overriden via
 * context.
 *
 * Adding new flags here is only allowed during the pre-release period of a new
 * major version!
 */
const FUTURE_FLAGS_DEFAULTS: { [key: string]: boolean } = {
  [APIGATEWAY_USAGEPLANKEY_ORDERINSENSITIVE_ID]: true,
  [ENABLE_STACK_NAME_DUPLICATES_CONTEXT]: true,
  [ENABLE_DIFF_NO_FAIL_CONTEXT]: true,
  [STACK_RELATIVE_EXPORTS_CONTEXT]: true,
  [NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: true,
  [DOCKER_IGNORE_SUPPORT]: true,
  [SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME]: true,
  [KMS_DEFAULT_KEY_POLICIES]: true,
  [S3_GRANT_WRITE_WITHOUT_ACL]: true,
  [ECS_REMOVE_DEFAULT_DESIRED_COUNT]: true,
  [RDS_LOWERCASE_DB_IDENTIFIER]: true,
  [EFS_DEFAULT_ENCRYPTION_AT_REST]: true,
  [LAMBDA_RECOGNIZE_VERSION_PROPS]: true,
  [CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021]: true,
  // Every feature flag below this should have its default behavior set to "not
  // activated", as it was introduced AFTER v2 was released.
  [ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER]: false,
  [EC2_UNIQUE_IMDSV2_LAUNCH_TEMPLATE_NAME]: false,
};

export function futureFlagDefault(flag: string): boolean {
  return FUTURE_FLAGS_DEFAULTS[flag] ?? false;
}
