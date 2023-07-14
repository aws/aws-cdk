"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CURRENT_VERSION_FLAG_DEFAULTS = exports.NEW_PROJECT_CONTEXT = exports.CURRENT_VERSION_EXPIRED_FLAGS = exports.FLAGS = exports.KMS_ALIAS_NAME_REF = exports.INCLUDE_PREFIX_IN_UNIQUE_NAME_GENERATION = exports.APIGATEWAY_REQUEST_VALIDATOR_UNIQUE_ID = exports.EC2_RESTRICT_DEFAULT_SECURITY_GROUP = exports.ENABLE_EMR_SERVICE_POLICY_V2 = exports.REDSHIFT_COLUMN_ID = exports.SECRETS_MANAGER_TARGET_ATTACHMENT_RESOURCE_POLICY = exports.EC2_LAUNCH_TEMPLATE_DEFAULT_USER_DATA = exports.APIGATEWAY_AUTHORIZER_CHANGE_DEPLOYMENT_LOGICAL_ID = exports.CODEDEPLOY_REMOVE_ALARMS_FROM_DEPLOYMENT_GROUP = exports.DATABASE_PROXY_UNIQUE_RESOURCE_NAME = exports.AWS_CUSTOM_RESOURCE_LATEST_SDK_DEFAULT = exports.ROUTE53_PATTERNS_USE_CERTIFICATE = exports.S3_SERVER_ACCESS_LOGS_USE_BUCKET_POLICY = exports.ECS_DISABLE_EXPLICIT_DEPLOYMENT_CONTROLLER_FOR_CIRCUIT_BREAKER = exports.IAM_STANDARDIZED_SERVICE_PRINCIPALS = exports.EVENTS_TARGET_QUEUE_SAME_ACCOUNT = exports.ENABLE_PARTITION_LITERALS = exports.APIGATEWAY_DISABLE_CLOUDWATCH_ROLE = exports.SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY = exports.S3_CREATE_DEFAULT_LOGGING_POLICY = exports.CODEPIPELINE_CROSS_ACCOUNT_KEY_ALIAS_STACK_SAFE_RESOURCE_NAME = exports.VALIDATE_SNAPSHOT_REMOVAL_POLICY = exports.IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME = exports.IAM_MINIMIZE_POLICIES = exports.ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME = exports.EC2_UNIQUE_IMDSV2_LAUNCH_TEMPLATE_NAME = exports.ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER = exports.TARGET_PARTITIONS = exports.CHECK_SECRET_USAGE = exports.CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021 = exports.LAMBDA_RECOGNIZE_LAYER_VERSION = exports.LAMBDA_RECOGNIZE_VERSION_PROPS = exports.EFS_DEFAULT_ENCRYPTION_AT_REST = exports.APIGATEWAY_USAGEPLANKEY_ORDERINSENSITIVE_ID = exports.RDS_LOWERCASE_DB_IDENTIFIER = exports.ECS_REMOVE_DEFAULT_DESIRED_COUNT = exports.S3_GRANT_WRITE_WITHOUT_ACL = exports.KMS_DEFAULT_KEY_POLICIES = exports.SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME = exports.DOCKER_IGNORE_SUPPORT = exports.STACK_RELATIVE_EXPORTS_CONTEXT = exports.NEW_STYLE_STACK_SYNTHESIS_CONTEXT = exports.ENABLE_DIFF_NO_FAIL = exports.ENABLE_DIFF_NO_FAIL_CONTEXT = exports.ENABLE_STACK_NAME_DUPLICATES_CONTEXT = void 0;
exports.NEW_PROJECT_DEFAULT_CONTEXT = exports.FUTURE_FLAGS = exports.FUTURE_FLAGS_EXPIRED = exports.futureFlagDefault = void 0;
const flag_modeling_1 = require("./private/flag-modeling");
////////////////////////////////////////////////////////////////////////
//
// This file defines context keys that enable certain features that are
// implemented behind a flag in order to preserve backwards compatibility for
// existing apps. When a new app is initialized through `cdk init`, the CLI will
// automatically add enable these features by adding them to the generated
// `cdk.json` file.
//
////////////////////////////////////////////////////////////////////////
//
//  !!! IMPORTANT !!!
//
//  When you introduce a new flag, set its 'introducedIn.v2' value to the literal string
// 'V2·NEXT', without the dot.
//
//  DO NOT USE A VARIABLE. DO NOT DEFINE A CONSTANT. The actual value will be string-replaced at
//  version bump time.
//
////////////////////////////////////////////////////////////////////////
//
// There are three types of flags: ApiDefault, BugFix, and VisibleContext flags.
//
// - ApiDefault flags: change the behavior or defaults of the construct library. When
//   set, the infrastructure that is generated may be different but there is
//   a way to get the old infrastructure setup by using the API in a different way.
//
// - BugFix flags: the old infra we used to generate is no longer recommended,
//   and there is no way to achieve that result anymore except by making sure the
//   flag is unset, or set to `false`. Mostly used for infra-impacting bugfixes or
//   enhanced security defaults.
//
// - VisibleContext flags: not really a feature flag, but configurable context which is
//   advertised by putting the context in the `cdk.json` file of new projects.
//
// In future major versions, the "newProjectValues" will become the version
// default for both DefaultBehavior and BugFix flags, and DefaultBehavior flags
// will be removed (i.e., their new behavior will become the *only* behavior).
//
// See https://github.com/aws/aws-cdk-rfcs/blob/master/text/0055-feature-flags.md
// --------------------------------------------------------------------------------
exports.ENABLE_STACK_NAME_DUPLICATES_CONTEXT = '@aws-cdk/core:enableStackNameDuplicates';
exports.ENABLE_DIFF_NO_FAIL_CONTEXT = 'aws-cdk:enableDiffNoFail';
/** @deprecated use `ENABLE_DIFF_NO_FAIL_CONTEXT` */
exports.ENABLE_DIFF_NO_FAIL = exports.ENABLE_DIFF_NO_FAIL_CONTEXT;
exports.NEW_STYLE_STACK_SYNTHESIS_CONTEXT = '@aws-cdk/core:newStyleStackSynthesis';
exports.STACK_RELATIVE_EXPORTS_CONTEXT = '@aws-cdk/core:stackRelativeExports';
exports.DOCKER_IGNORE_SUPPORT = '@aws-cdk/aws-ecr-assets:dockerIgnoreSupport';
exports.SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME = '@aws-cdk/aws-secretsmanager:parseOwnedSecretName';
exports.KMS_DEFAULT_KEY_POLICIES = '@aws-cdk/aws-kms:defaultKeyPolicies';
exports.S3_GRANT_WRITE_WITHOUT_ACL = '@aws-cdk/aws-s3:grantWriteWithoutAcl';
exports.ECS_REMOVE_DEFAULT_DESIRED_COUNT = '@aws-cdk/aws-ecs-patterns:removeDefaultDesiredCount';
exports.RDS_LOWERCASE_DB_IDENTIFIER = '@aws-cdk/aws-rds:lowercaseDbIdentifier';
exports.APIGATEWAY_USAGEPLANKEY_ORDERINSENSITIVE_ID = '@aws-cdk/aws-apigateway:usagePlanKeyOrderInsensitiveId';
exports.EFS_DEFAULT_ENCRYPTION_AT_REST = '@aws-cdk/aws-efs:defaultEncryptionAtRest';
exports.LAMBDA_RECOGNIZE_VERSION_PROPS = '@aws-cdk/aws-lambda:recognizeVersionProps';
exports.LAMBDA_RECOGNIZE_LAYER_VERSION = '@aws-cdk/aws-lambda:recognizeLayerVersion';
exports.CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021 = '@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021';
exports.CHECK_SECRET_USAGE = '@aws-cdk/core:checkSecretUsage';
exports.TARGET_PARTITIONS = '@aws-cdk/core:target-partitions';
exports.ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER = '@aws-cdk-containers/ecs-service-extensions:enableDefaultLogDriver';
exports.EC2_UNIQUE_IMDSV2_LAUNCH_TEMPLATE_NAME = '@aws-cdk/aws-ec2:uniqueImdsv2TemplateName';
exports.ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME = '@aws-cdk/aws-ecs:arnFormatIncludesClusterName';
exports.IAM_MINIMIZE_POLICIES = '@aws-cdk/aws-iam:minimizePolicies';
exports.IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME = '@aws-cdk/aws-iam:importedRoleStackSafeDefaultPolicyName';
exports.VALIDATE_SNAPSHOT_REMOVAL_POLICY = '@aws-cdk/core:validateSnapshotRemovalPolicy';
exports.CODEPIPELINE_CROSS_ACCOUNT_KEY_ALIAS_STACK_SAFE_RESOURCE_NAME = '@aws-cdk/aws-codepipeline:crossAccountKeyAliasStackSafeResourceName';
exports.S3_CREATE_DEFAULT_LOGGING_POLICY = '@aws-cdk/aws-s3:createDefaultLoggingPolicy';
exports.SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY = '@aws-cdk/aws-sns-subscriptions:restrictSqsDescryption';
exports.APIGATEWAY_DISABLE_CLOUDWATCH_ROLE = '@aws-cdk/aws-apigateway:disableCloudWatchRole';
exports.ENABLE_PARTITION_LITERALS = '@aws-cdk/core:enablePartitionLiterals';
exports.EVENTS_TARGET_QUEUE_SAME_ACCOUNT = '@aws-cdk/aws-events:eventsTargetQueueSameAccount';
exports.IAM_STANDARDIZED_SERVICE_PRINCIPALS = '@aws-cdk/aws-iam:standardizedServicePrincipals';
exports.ECS_DISABLE_EXPLICIT_DEPLOYMENT_CONTROLLER_FOR_CIRCUIT_BREAKER = '@aws-cdk/aws-ecs:disableExplicitDeploymentControllerForCircuitBreaker';
exports.S3_SERVER_ACCESS_LOGS_USE_BUCKET_POLICY = '@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy';
exports.ROUTE53_PATTERNS_USE_CERTIFICATE = '@aws-cdk/aws-route53-patters:useCertificate';
exports.AWS_CUSTOM_RESOURCE_LATEST_SDK_DEFAULT = '@aws-cdk/customresources:installLatestAwsSdkDefault';
exports.DATABASE_PROXY_UNIQUE_RESOURCE_NAME = '@aws-cdk/aws-rds:databaseProxyUniqueResourceName';
exports.CODEDEPLOY_REMOVE_ALARMS_FROM_DEPLOYMENT_GROUP = '@aws-cdk/aws-codedeploy:removeAlarmsFromDeploymentGroup';
exports.APIGATEWAY_AUTHORIZER_CHANGE_DEPLOYMENT_LOGICAL_ID = '@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId';
exports.EC2_LAUNCH_TEMPLATE_DEFAULT_USER_DATA = '@aws-cdk/aws-ec2:launchTemplateDefaultUserData';
exports.SECRETS_MANAGER_TARGET_ATTACHMENT_RESOURCE_POLICY = '@aws-cdk/aws-secretsmanager:useAttachedSecretResourcePolicyForSecretTargetAttachments';
exports.REDSHIFT_COLUMN_ID = '@aws-cdk/aws-redshift:columnId';
exports.ENABLE_EMR_SERVICE_POLICY_V2 = '@aws-cdk/aws-stepfunctions-tasks:enableEmrServicePolicyV2';
exports.EC2_RESTRICT_DEFAULT_SECURITY_GROUP = '@aws-cdk/aws-ec2:restrictDefaultSecurityGroup';
exports.APIGATEWAY_REQUEST_VALIDATOR_UNIQUE_ID = '@aws-cdk/aws-apigateway:requestValidatorUniqueId';
exports.INCLUDE_PREFIX_IN_UNIQUE_NAME_GENERATION = '@aws-cdk/core:includePrefixInUniqueNameGeneration';
exports.KMS_ALIAS_NAME_REF = '@aws-cdk/aws-kms:aliasNameRef';
exports.FLAGS = {
    //////////////////////////////////////////////////////////////////////
    [exports.ENABLE_STACK_NAME_DUPLICATES_CONTEXT]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'Allow multiple stacks with the same name',
        detailsMd: `
      If this is set, multiple stacks can use the same stack name (e.g. deployed to
      different environments). This means that the name of the synthesized template
      file will be based on the construct path and not on the defined \`stackName\`
      of the stack.`,
        recommendedValue: true,
        introducedIn: { v1: '1.16.0' },
        defaults: { v2: true },
        compatibilityWithOldBehaviorMd: 'Pass stack identifiers to the CLI instead of stack names.',
    },
    //////////////////////////////////////////////////////////////////////
    [exports.ENABLE_DIFF_NO_FAIL_CONTEXT]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'Make `cdk diff` not fail when there are differences',
        detailsMd: `
      Determines what status code \`cdk diff\` should return when the specified stack
      differs from the deployed stack or the local CloudFormation template:

      * \`aws-cdk:enableDiffNoFail=true\` => status code == 0
      * \`aws-cdk:enableDiffNoFail=false\` => status code == 1

      You can override this behavior with the --fail flag:

      * \`--fail\` => status code == 1
      * \`--no-fail\` => status code == 0`,
        introducedIn: { v1: '1.19.0' },
        defaults: { v2: true },
        recommendedValue: true,
        compatibilityWithOldBehaviorMd: 'Specify `--fail` to the CLI.',
    },
    //////////////////////////////////////////////////////////////////////
    [exports.NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Switch to new stack synthesis method which enables CI/CD',
        detailsMd: `
      If this flag is specified, all \`Stack\`s will use the \`DefaultStackSynthesizer\` by
      default. If it is not set, they will use the \`LegacyStackSynthesizer\`.`,
        introducedIn: { v1: '1.39.0', v2: '2.0.0' },
        defaults: { v2: true },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.STACK_RELATIVE_EXPORTS_CONTEXT]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Name exports based on the construct paths relative to the stack, rather than the global construct path',
        detailsMd: `
      Combined with the stack name this relative construct path is good enough to
      ensure uniqueness, and makes the export names robust against refactoring
      the location of the stack in the construct tree (specifically, moving the Stack
      into a Stage).`,
        introducedIn: { v1: '1.58.0', v2: '2.0.0' },
        defaults: { v2: true },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.DOCKER_IGNORE_SUPPORT]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'DockerImageAsset properly supports `.dockerignore` files by default',
        detailsMd: `
      If this flag is not set, the default behavior for \`DockerImageAsset\` is to use
      glob semantics for \`.dockerignore\` files. If this flag is set, the default behavior
      is standard Docker ignore semantics.

      This is a feature flag as the old behavior was technically incorrect but
      users may have come to depend on it.`,
        introducedIn: { v1: '1.73.0' },
        defaults: { v2: true },
        recommendedValue: true,
        compatibilityWithOldBehaviorMd: 'Update your `.dockerignore` file to match standard Docker ignore rules, if necessary.',
    },
    //////////////////////////////////////////////////////////////////////
    [exports.SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'Fix the referencing of SecretsManager names from ARNs',
        detailsMd: `
      Secret.secretName for an "owned" secret will attempt to parse the secretName from the ARN,
      rather than the default full resource name, which includes the SecretsManager suffix.

      If this flag is not set, Secret.secretName will include the SecretsManager suffix, which cannot be directly
      used by SecretsManager.DescribeSecret, and must be parsed by the user first (e.g., Fn:Join, Fn:Select, Fn:Split).`,
        introducedIn: { v1: '1.77.0' },
        defaults: { v2: true },
        recommendedValue: true,
        compatibilityWithOldBehaviorMd: 'Use `parseArn(secret.secretName).resourceName` to emulate the incorrect old parsing.',
    },
    //////////////////////////////////////////////////////////////////////
    [exports.KMS_DEFAULT_KEY_POLICIES]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'Tighten default KMS key policies',
        detailsMd: `
      KMS Keys start with a default key policy that grants the account access to administer the key,
      mirroring the behavior of the KMS SDK/CLI/Console experience. Users may override the default key
      policy by specifying their own.

      If this flag is not set, the default key policy depends on the setting of the \`trustAccountIdentities\`
      flag. If false (the default, for backwards-compatibility reasons), the default key policy somewhat
      resembles the default admin key policy, but with the addition of 'GenerateDataKey' permissions. If
      true, the policy matches what happens when this feature flag is set.

      Additionally, if this flag is not set and the user supplies a custom key policy, this will be appended
      to the key's default policy (rather than replacing it).`,
        introducedIn: { v1: '1.78.0' },
        defaults: { v2: true },
        recommendedValue: true,
        compatibilityWithOldBehaviorMd: 'Pass `trustAccountIdentities: false` to `Key` construct to restore the old behavior.',
    },
    //////////////////////////////////////////////////////////////////////
    [exports.S3_GRANT_WRITE_WITHOUT_ACL]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'Remove `PutObjectAcl` from Bucket.grantWrite',
        detailsMd: `
      Change the old 's3:PutObject*' permission to 's3:PutObject' on Bucket,
      as the former includes 's3:PutObjectAcl',
      which could be used to grant read/write object access to IAM principals in other accounts.
      Use a feature flag to make sure existing customers who might be relying
      on the overly-broad permissions are not broken.`,
        introducedIn: { v1: '1.85.0' },
        defaults: { v2: true },
        recommendedValue: true,
        compatibilityWithOldBehaviorMd: 'Call `bucket.grantPutAcl()` in addition to `bucket.grantWrite()` to grant ACL permissions.',
    },
    //////////////////////////////////////////////////////////////////////
    [exports.ECS_REMOVE_DEFAULT_DESIRED_COUNT]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'Do not specify a default DesiredCount for ECS services',
        detailsMd: `
      ApplicationLoadBalancedServiceBase, ApplicationMultipleTargetGroupServiceBase,
      NetworkLoadBalancedServiceBase, NetworkMultipleTargetGroupServiceBase, and
      QueueProcessingServiceBase currently determine a default value for the desired count of
      a CfnService if a desiredCount is not provided. The result of this is that on every
      deployment, the service count is reset to the fixed value, even if it was autoscaled.

      If this flag is not set, the default behaviour for CfnService.desiredCount is to set a
      desiredCount of 1, if one is not provided. If true, a default will not be defined for
      CfnService.desiredCount and as such desiredCount will be undefined, if one is not provided.`,
        introducedIn: { v1: '1.92.0' },
        defaults: { v2: true },
        recommendedValue: true,
        compatibilityWithOldBehaviorMd: 'You can pass `desiredCount: 1` explicitly, but you should never need this.',
    },
    //////////////////////////////////////////////////////////////////////
    [exports.RDS_LOWERCASE_DB_IDENTIFIER]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Force lowercasing of RDS Cluster names in CDK',
        detailsMd: `
      Cluster names must be lowercase, and the service will lowercase the name when the cluster
      is created. However, CDK did not use to know about this, and would use the user-provided name
      referencing the cluster, which would fail if it happened to be mixed-case.

      With this flag, lowercase the name in CDK so we can reference it properly.

      Must be behind a permanent flag because changing a name from mixed case to lowercase between deployments
      would lead CloudFormation to think the name was changed and would trigger a cluster replacement
      (losing data!).`,
        introducedIn: { v1: '1.97.0', v2: '2.0.0' },
        defaults: { v2: true },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.APIGATEWAY_USAGEPLANKEY_ORDERINSENSITIVE_ID]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Allow adding/removing multiple UsagePlanKeys independently',
        detailsMd: `
      The UsagePlanKey resource connects an ApiKey with a UsagePlan. API Gateway does not allow more than one UsagePlanKey
      for any given UsagePlan and ApiKey combination. For this reason, CloudFormation cannot replace this resource without
      either the UsagePlan or ApiKey changing.

      The feature addition to support multiple UsagePlanKey resources - 142bd0e2 - recognized this and attempted to keep
      existing UsagePlanKey logical ids unchanged.
      However, this intentionally caused the logical id of the UsagePlanKey to be sensitive to order. That is, when
      the 'first' UsagePlanKey resource is removed, the logical id of the 'second' assumes what was originally the 'first',
      which again is disallowed.

      In effect, there is no way to get out of this mess in a backwards compatible way, while supporting existing stacks.
      This flag changes the logical id layout of UsagePlanKey to not be sensitive to order.`,
        introducedIn: { v1: '1.98.0', v2: '2.0.0' },
        defaults: { v2: true },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.EFS_DEFAULT_ENCRYPTION_AT_REST]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'Enable this feature flag to have elastic file systems encrypted at rest by default.',
        detailsMd: `
      Encryption can also be configured explicitly using the \`encrypted\` property.
      `,
        introducedIn: { v1: '1.98.0' },
        defaults: { v2: true },
        recommendedValue: true,
        compatibilityWithOldBehaviorMd: 'Pass the `encrypted: false` property to the `FileSystem` construct to disable encryption.',
    },
    //////////////////////////////////////////////////////////////////////
    [exports.LAMBDA_RECOGNIZE_VERSION_PROPS]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Enable this feature flag to opt in to the updated logical id calculation for Lambda Version created using the  `fn.currentVersion`.',
        detailsMd: `
      The previous calculation incorrectly considered properties of the \`AWS::Lambda::Function\` resource that did
      not constitute creating a new Version.

      See 'currentVersion' section in the aws-lambda module's README for more details.`,
        introducedIn: { v1: '1.106.0', v2: '2.0.0' },
        defaults: { v2: true },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.LAMBDA_RECOGNIZE_LAYER_VERSION]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Enable this feature flag to opt in to the updated logical id calculation for Lambda Version created using the `fn.currentVersion`.',
        detailsMd: `
      This flag correct incorporates Lambda Layer properties into the Lambda Function Version.

      See 'currentVersion' section in the aws-lambda module's README for more details.`,
        introducedIn: { v1: '1.159.0', v2: '2.27.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Enable this feature flag to have cloudfront distributions use the security policy TLSv1.2_2021 by default.',
        detailsMd: `
      The security policy can also be configured explicitly using the \`minimumProtocolVersion\` property.`,
        introducedIn: { v1: '1.117.0', v2: '2.0.0' },
        defaults: { v2: true },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.CHECK_SECRET_USAGE]: {
        type: flag_modeling_1.FlagType.VisibleContext,
        summary: 'Enable this flag to make it impossible to accidentally use SecretValues in unsafe locations',
        detailsMd: `
      With this flag enabled, \`SecretValue\` instances can only be passed to
      constructs that accept \`SecretValue\`s; otherwise, \`unsafeUnwrap()\` must be
      called to use it as a regular string.`,
        introducedIn: { v1: '1.153.0', v2: '2.21.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.TARGET_PARTITIONS]: {
        type: flag_modeling_1.FlagType.VisibleContext,
        summary: 'What regions to include in lookup tables of environment agnostic stacks',
        detailsMd: `
      Has no effect on stacks that have a defined region, but will limit the amount
      of unnecessary regions included in stacks without a known region.

      The type of this value should be a list of strings.`,
        introducedIn: { v1: '1.137.0', v2: '2.4.0' },
        recommendedValue: ['aws', 'aws-cn'],
    },
    //////////////////////////////////////////////////////////////////////
    [exports.ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'ECS extensions will automatically add an `awslogs` driver if no logging is specified',
        detailsMd: `
      Enable this feature flag to configure default logging behavior for the ECS Service Extensions. This will enable the
      \`awslogs\` log driver for the application container of the service to send the container logs to CloudWatch Logs.

      This is a feature flag as the new behavior provides a better default experience for the users.`,
        introducedIn: { v1: '1.140.0', v2: '2.8.0' },
        recommendedValue: true,
        compatibilityWithOldBehaviorMd: 'Specify a log driver explicitly.',
    },
    //////////////////////////////////////////////////////////////////////
    [exports.EC2_UNIQUE_IMDSV2_LAUNCH_TEMPLATE_NAME]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Enable this feature flag to have Launch Templates generated by the `InstanceRequireImdsv2Aspect` use unique names.',
        detailsMd: `
      Previously, the generated Launch Template names were only unique within a stack because they were based only on the
      \`Instance\` construct ID. If another stack that has an \`Instance\` with the same construct ID is deployed in the same
      account and region, the deployments would always fail as the generated Launch Template names were the same.

      The new implementation addresses this issue by generating the Launch Template name with the \`Names.uniqueId\` method.`,
        introducedIn: { v1: '1.140.0', v2: '2.8.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'ARN format used by ECS. In the new ARN format, the cluster name is part of the resource ID.',
        detailsMd: `
      If this flag is not set, the old ARN format (without cluster name) for ECS is used.
      If this flag is set, the new ARN format (with cluster name) for ECS is used.

      This is a feature flag as the old format is still valid for existing ECS clusters.

      See https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-account-settings.html#ecs-resource-ids
      `,
        introducedIn: { v2: '2.35.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.IAM_MINIMIZE_POLICIES]: {
        type: flag_modeling_1.FlagType.VisibleContext,
        summary: 'Minimize IAM policies by combining Statements',
        detailsMd: `
      Minimize IAM policies by combining Principals, Actions and Resources of two
      Statements in the policies, as long as it doesn't change the meaning of the
      policy.`,
        introducedIn: { v1: '1.150.0', v2: '2.18.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.VALIDATE_SNAPSHOT_REMOVAL_POLICY]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'Error on snapshot removal policies on resources that do not support it.',
        detailsMd: `
      Makes sure we do not allow snapshot removal policy on resources that do not support it.
      If supplied on an unsupported resource, CloudFormation ignores the policy altogether.
      This flag will reduce confusion and unexpected loss of data when erroneously supplying
      the snapshot removal policy.`,
        introducedIn: { v2: '2.28.0' },
        recommendedValue: true,
        compatibilityWithOldBehaviorMd: 'The old behavior was incorrect. Update your source to not specify SNAPSHOT policies on resources that do not support it.',
    },
    //////////////////////////////////////////////////////////////////////
    [exports.CODEPIPELINE_CROSS_ACCOUNT_KEY_ALIAS_STACK_SAFE_RESOURCE_NAME]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Generate key aliases that include the stack name',
        detailsMd: `
      Enable this feature flag to have CodePipeline generate a unique cross account key alias name using the stack name.

      Previously, when creating multiple pipelines with similar naming conventions and when crossAccountKeys is true,
      the KMS key alias name created for these pipelines may be the same due to how the uniqueId is generated.

      This new implementation creates a stack safe resource name for the alias using the stack name instead of the stack ID.
      `,
        introducedIn: { v2: '2.29.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.S3_CREATE_DEFAULT_LOGGING_POLICY]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Enable this feature flag to create an S3 bucket policy by default in cases where an AWS service would automatically create the Policy if one does not exist.',
        detailsMd: `
      For example, in order to send VPC flow logs to an S3 bucket, there is a specific Bucket Policy
      that needs to be attached to the bucket. If you create the bucket without a policy and then add the
      bucket as the flow log destination, the service will automatically create the bucket policy with the
      necessary permissions. If you were to then try and add your own bucket policy CloudFormation will throw
      and error indicating that a bucket policy already exists.

      In cases where we know what the required policy is we can go ahead and create the policy so we can
      remain in control of it.

      @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html#AWS-logs-infrastructure-S3
      `,
        introducedIn: { v2: '2.31.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Restrict KMS key policy for encrypted Queues a bit more',
        detailsMd: `
      Enable this feature flag to restrict the decryption of a SQS queue, which is subscribed to a SNS topic, to
      only the topic which it is subscribed to and not the whole SNS service of an account.

      Previously the decryption was only restricted to the SNS service principal. To make the SQS subscription more
      secure, it is a good practice to restrict the decryption further and only allow the connected SNS topic to decryption
      the subscribed queue.`,
        introducedIn: { v2: '2.32.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.APIGATEWAY_DISABLE_CLOUDWATCH_ROLE]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Make default CloudWatch Role behavior safe for multiple API Gateways in one environment',
        detailsMd: `
      Enable this feature flag to change the default behavior for aws-apigateway.RestApi and aws-apigateway.SpecRestApi
      to _not_ create a CloudWatch role and Account. There is only a single ApiGateway account per AWS
      environment which means that each time you create a RestApi in your account the ApiGateway account
      is overwritten. If at some point the newest RestApi is deleted, the ApiGateway Account and CloudWatch
      role will also be deleted, breaking any existing ApiGateways that were depending on them.

      When this flag is enabled you should either create the ApiGateway account and CloudWatch role
      separately _or_ only enable the cloudWatchRole on a single RestApi.
      `,
        introducedIn: { v2: '2.38.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.ENABLE_PARTITION_LITERALS]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Make ARNs concrete if AWS partition is known',
        // eslint-disable-next-line @aws-cdk/no-literal-partition
        detailsMd: `
      Enable this feature flag to get partition names as string literals in Stacks with known regions defined in
      their environment, such as "aws" or "aws-cn".  Previously the CloudFormation intrinsic function
      "Ref: AWS::Partition" was used.  For example:

      \`\`\`yaml
      Principal:
        AWS:
          Fn::Join:
            - ""
            - - "arn:"
              - Ref: AWS::Partition
              - :iam::123456789876:root
      \`\`\`

      becomes:

      \`\`\`yaml
      Principal:
        AWS: "arn:aws:iam::123456789876:root"
      \`\`\`

      The intrinsic function will still be used in Stacks where no region is defined or the region's partition
      is unknown.
      `,
        introducedIn: { v2: '2.38.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.EVENTS_TARGET_QUEUE_SAME_ACCOUNT]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Event Rules may only push to encrypted SQS queues in the same account',
        detailsMd: `
      This flag applies to SQS Queues that are used as the target of event Rules. When enabled, only principals
      from the same account as the Rule can send messages. If a queue is unencrypted, this restriction will
      always apply, regardless of the value of this flag.
      `,
        introducedIn: { v2: '2.51.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.IAM_STANDARDIZED_SERVICE_PRINCIPALS]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Use standardized (global) service principals everywhere',
        detailsMd: `
      We used to maintain a database of exceptions to Service Principal names in various regions. This database
      is no longer necessary: all service principals names have been standardized to their global form (\`SERVICE.amazonaws.com\`).

      This flag disables use of that exceptions database and always uses the global service principal.
      `,
        introducedIn: { v2: '2.51.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.ECS_DISABLE_EXPLICIT_DEPLOYMENT_CONTROLLER_FOR_CIRCUIT_BREAKER]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Avoid setting the "ECS" deployment controller when adding a circuit breaker',
        detailsMd: `
      Enable this feature flag to avoid setting the "ECS" deployment controller when adding a circuit breaker to an
      ECS Service, as this will trigger a full replacement which fails to deploy when using set service names.
      This does not change any behaviour as the default deployment controller when it is not defined is ECS.

      This is a feature flag as the new behavior provides a better default experience for the users.
      `,
        introducedIn: { v2: '2.51.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Enable this feature to by default create default policy names for imported roles that depend on the stack the role is in.',
        detailsMd: `
      Without this, importing the same role in multiple places could lead to the permissions given for one version of the imported role
      to overwrite permissions given to the role at a different place where it was imported. This was due to all imported instances
      of a role using the same default policy name.

      This new implementation creates default policy names based on the constructs node path in their stack.
      `,
        introducedIn: { v2: '2.60.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.S3_SERVER_ACCESS_LOGS_USE_BUCKET_POLICY]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Use S3 Bucket Policy instead of ACLs for Server Access Logging',
        detailsMd: `
      Enable this feature flag to use S3 Bucket Policy for granting permission fo Server Access Logging
      rather than using the canned \`LogDeliveryWrite\` ACL. ACLs do not work when Object Ownership is
      enabled on the bucket.

      This flag uses a Bucket Policy statement to allow Server Access Log delivery, following best
      practices for S3.

      @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html
    `,
        introducedIn: { v2: '2.60.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.ROUTE53_PATTERNS_USE_CERTIFICATE]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'Use the official `Certificate` resource instead of `DnsValidatedCertificate`',
        detailsMd: `
      Enable this feature flag to use the official CloudFormation supported \`Certificate\` resource instead
      of the deprecated \`DnsValidatedCertificate\` construct. If this flag is enabled and you are creating
      the stack in a region other than us-east-1 then you must also set \`crossRegionReferences=true\` on the
      stack.
      `,
        introducedIn: { v2: '2.61.0' },
        recommendedValue: true,
        compatibilityWithOldBehaviorMd: 'Define a `DnsValidatedCertificate` explicitly and pass in the `certificate` property',
    },
    //////////////////////////////////////////////////////////////////////
    [exports.AWS_CUSTOM_RESOURCE_LATEST_SDK_DEFAULT]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'Whether to install the latest SDK by default in AwsCustomResource',
        detailsMd: `
      This was originally introduced and enabled by default to not be limited by the SDK version
      that's installed on AWS Lambda. However, it creates issues for Lambdas bound to VPCs that
      do not have internet access, or in environments where 'npmjs.com' is not available.

      The recommended setting is to disable the default installation behavior, and pass the
      flag on a resource-by-resource basis to enable it if necessary.
    `,
        compatibilityWithOldBehaviorMd: 'Set installLatestAwsSdk: true on all resources that need it.',
        introducedIn: { v2: '2.60.0' },
        recommendedValue: false,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.DATABASE_PROXY_UNIQUE_RESOURCE_NAME]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Use unique resource name for Database Proxy',
        detailsMd: `
      If this flag is not set, the default behavior for \`DatabaseProxy\` is
      to use \`id\` of the constructor for \`dbProxyName\` when it's not specified in the argument.
      In this case, users can't deploy \`DatabaseProxy\`s that have the same \`id\` in the same region.

      If this flag is set, the default behavior is to use unique resource names for each \`DatabaseProxy\`.

      This is a feature flag as the old behavior was technically incorrect, but users may have come to depend on it.
    `,
        introducedIn: { v2: '2.65.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.CODEDEPLOY_REMOVE_ALARMS_FROM_DEPLOYMENT_GROUP]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Remove CloudWatch alarms from deployment group',
        detailsMd: `
      Enable this flag to be able to remove all CloudWatch alarms from a deployment group by removing
      the alarms from the construct. If this flag is not set, removing all alarms from the construct
      will still leave the alarms configured for the deployment group.
    `,
        introducedIn: { v2: '2.65.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.APIGATEWAY_AUTHORIZER_CHANGE_DEPLOYMENT_LOGICAL_ID]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Include authorizer configuration in the calculation of the API deployment logical ID.',
        detailsMd: `
      The logical ID of the AWS::ApiGateway::Deployment resource is calculated by hashing
      the API configuration, including methods, and resources, etc. Enable this feature flag
      to also include the configuration of any authorizer attached to the API in the
      calculation, so any changes made to an authorizer will create a new deployment.
      `,
        introducedIn: { v2: '2.66.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.EC2_LAUNCH_TEMPLATE_DEFAULT_USER_DATA]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Define user data for a launch template by default when a machine image is provided.',
        detailsMd: `
      The ec2.LaunchTemplate construct did not define user data when a machine image is
      provided despite the document. If this is set, a user data is automatically defined
      according to the OS of the machine image.
      `,
        recommendedValue: true,
        introducedIn: { v2: '2.67.0' },
    },
    //////////////////////////////////////////////////////////////////////
    [exports.SECRETS_MANAGER_TARGET_ATTACHMENT_RESOURCE_POLICY]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'SecretTargetAttachments uses the ResourcePolicy of the attached Secret.',
        detailsMd: `
      Enable this feature flag to make SecretTargetAttachments use the ResourcePolicy of the attached Secret.
      SecretTargetAttachments are created to connect a Secret to a target resource.
      In CDK code, they behave like regular Secret and can be used as a stand-in in most situations.
      Previously, adding to the ResourcePolicy of a SecretTargetAttachment did attempt to create a separate ResourcePolicy for the same Secret.
      However Secrets can only have a single ResourcePolicy, causing the CloudFormation deployment to fail.

      When enabling this feature flag for an existing Stack, ResourcePolicies created via a SecretTargetAttachment will need replacement.
      This won't be possible without intervention due to limitation outlined above.
      First remove all permissions granted to the Secret and deploy without the ResourcePolicies.
      Then you can re-add the permissions and deploy again.
      `,
        recommendedValue: true,
        introducedIn: { v2: '2.67.0' },
    },
    //////////////////////////////////////////////////////////////////////
    [exports.REDSHIFT_COLUMN_ID]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Whether to use an ID to track Redshift column changes',
        detailsMd: `
      Redshift columns are identified by their \`name\`. If a column is renamed, the old column
      will be dropped and a new column will be created. This can cause data loss.

      This flag enables the use of an \`id\` attribute for Redshift columns. If this flag is enabled, the
      internal CDK architecture will track changes of Redshift columns through their \`id\`, rather
      than their \`name\`. This will prevent data loss when columns are renamed.

      **NOTE** - Enabling this flag comes at a **risk**. When enabled, update the \`id\`s of all columns,
      **however** do not change the \`names\`s of the columns. If the \`name\`s of the columns are changed during
      initial deployment, the columns will be dropped and recreated, causing data loss. After the initial deployment
      of the \`id\`s, the \`name\`s of the columns can be changed without data loss.
      `,
        introducedIn: { v2: '2.68.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.ENABLE_EMR_SERVICE_POLICY_V2]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Enable AmazonEMRServicePolicy_v2 managed policies',
        detailsMd: `
      If this flag is not set, the default behavior for \`EmrCreateCluster\` is
      to use \`AmazonElasticMapReduceRole\` managed policies.

      If this flag is set, the default behavior is to use the new \`AmazonEMRServicePolicy_v2\`
      managed policies.

      This is a feature flag as the old behavior will be deprecated, but some resources may require manual
      intervention since they might not have the appropriate tags propagated automatically.
      `,
        introducedIn: { v2: '2.72.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.EC2_RESTRICT_DEFAULT_SECURITY_GROUP]: {
        type: flag_modeling_1.FlagType.ApiDefault,
        summary: 'Restrict access to the VPC default security group',
        detailsMd: `
      Enable this feature flag to remove the default ingress/egress rules from the
      VPC default security group.

      When a VPC is created, a default security group is created as well and this cannot
      be deleted. The default security group is created with ingress/egress rules that allow
      _all_ traffic. [AWS Security best practices recommend](https://docs.aws.amazon.com/securityhub/latest/userguide/ec2-controls.html#ec2-2)
      removing these ingress/egress rules in order to restrict access to the default security group.
    `,
        introducedIn: { v2: '2.78.0' },
        recommendedValue: true,
        compatibilityWithOldBehaviorMd: `
      To allow all ingress/egress traffic to the VPC default security group you
      can set the \`restrictDefaultSecurityGroup: false\`.
    `,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.APIGATEWAY_REQUEST_VALIDATOR_UNIQUE_ID]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Generate a unique id for each RequestValidator added to a method',
        detailsMd: `
      This flag allows multiple RequestValidators to be added to a RestApi when
      providing the \`RequestValidatorOptions\` in the \`addMethod()\` method.

      If the flag is not set then only a single RequestValidator can be added in this way.
      Any additional RequestValidators have to be created directly with \`new RequestValidator\`.
    `,
        introducedIn: { v2: '2.78.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.KMS_ALIAS_NAME_REF]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'KMS Alias name and keyArn will have implicit reference to KMS Key',
        detailsMd: `
      This flag allows an implicit dependency to be created between KMS Alias and KMS Key
      when referencing key.aliasName or key.keyArn.

      If the flag is not set then a raw string is passed as the Alias name and no
      implicit dependencies will be set.
    `,
        introducedIn: { v2: '2.83.0' },
        recommendedValue: true,
    },
    //////////////////////////////////////////////////////////////////////
    [exports.INCLUDE_PREFIX_IN_UNIQUE_NAME_GENERATION]: {
        type: flag_modeling_1.FlagType.BugFix,
        summary: 'Include the stack prefix in the stack name generation process',
        detailsMd: `
      This flag prevents the prefix of a stack from making the stack's name longer than the 128 character limit.

      If the flag is set, the prefix is included in the stack name generation process.
      If the flag is not set, then the prefix of the stack is prepended to the generated stack name.

      **NOTE** - Enabling this flag comes at a **risk**. If you have already deployed stacks, changing the status of this
      feature flag can lead to a change in stacks' name. Changing a stack name mean recreating the whole stack, which
      is not viable in some productive setups.
    `,
        introducedIn: { v2: '2.84.0' },
        recommendedValue: true,
    },
};
const CURRENT_MV = 'v2';
/**
 * The list of future flags that are now expired. This is going to be used to identify
 * and block usages of old feature flags in the new major version of CDK.
 */
exports.CURRENT_VERSION_EXPIRED_FLAGS = Object.entries(exports.FLAGS)
    .filter(([_, flag]) => flag.introducedIn[CURRENT_MV] === undefined)
    .map(([name, _]) => name).sort();
/**
 * Flag values that should apply for new projects
 *
 * Add a flag in here (typically with the value `true`), to enable
 * backwards-breaking behavior changes only for new projects.  New projects
 * generated through `cdk init` will include these flags in their generated
 *
 * Tests must cover the default (disabled) case and the future (enabled) case.
 */
exports.NEW_PROJECT_CONTEXT = Object.fromEntries(Object.entries(exports.FLAGS)
    .filter(([_, flag]) => flag.recommendedValue !== flag.defaults?.[CURRENT_MV] && flag.introducedIn[CURRENT_MV])
    .map(([name, flag]) => [name, flag.recommendedValue]));
/**
 * The default values of each of these flags in the current major version.
 *
 * This is the effective value of the flag, unless it's overriden via
 * context.
 *
 * Adding new flags here is only allowed during the pre-release period of a new
 * major version!
 */
exports.CURRENT_VERSION_FLAG_DEFAULTS = Object.fromEntries(Object.entries(exports.FLAGS)
    .filter(([_, flag]) => flag.defaults?.[CURRENT_MV] !== undefined)
    .map(([name, flag]) => [name, flag.defaults?.[CURRENT_MV]]));
function futureFlagDefault(flag) {
    const value = exports.CURRENT_VERSION_FLAG_DEFAULTS[flag] ?? false;
    if (typeof value !== 'boolean') {
        throw new Error(`futureFlagDefault: default type of flag '${flag}' should be boolean, got '${typeof value}'`);
    }
    return value;
}
exports.futureFlagDefault = futureFlagDefault;
// Nobody should have been using any of this, but you never know
/** @deprecated use CURRENT_VERSION_EXPIRED_FLAGS instead */
exports.FUTURE_FLAGS_EXPIRED = exports.CURRENT_VERSION_EXPIRED_FLAGS;
/** @deprecated use NEW_PROJECT_CONTEXT instead */
exports.FUTURE_FLAGS = Object.fromEntries(Object.entries(exports.NEW_PROJECT_CONTEXT)
    .filter(([_, v]) => typeof v === 'boolean'));
/** @deprecated use NEW_PROJECT_CONTEXT instead */
exports.NEW_PROJECT_DEFAULT_CONTEXT = Object.fromEntries(Object.entries(exports.NEW_PROJECT_CONTEXT)
    .filter(([_, v]) => typeof v !== 'boolean'));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmVhdHVyZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmZWF0dXJlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsMkRBQTZEO0FBRTdELHdFQUF3RTtBQUN4RSxFQUFFO0FBQ0YsdUVBQXVFO0FBQ3ZFLDZFQUE2RTtBQUM3RSxnRkFBZ0Y7QUFDaEYsMEVBQTBFO0FBQzFFLG1CQUFtQjtBQUNuQixFQUFFO0FBQ0Ysd0VBQXdFO0FBQ3hFLEVBQUU7QUFDRixxQkFBcUI7QUFDckIsRUFBRTtBQUNGLHdGQUF3RjtBQUN4Riw4QkFBOEI7QUFDOUIsRUFBRTtBQUNGLGdHQUFnRztBQUNoRyxzQkFBc0I7QUFDdEIsRUFBRTtBQUNGLHdFQUF3RTtBQUN4RSxFQUFFO0FBQ0YsZ0ZBQWdGO0FBQ2hGLEVBQUU7QUFDRixxRkFBcUY7QUFDckYsNEVBQTRFO0FBQzVFLG1GQUFtRjtBQUNuRixFQUFFO0FBQ0YsOEVBQThFO0FBQzlFLGlGQUFpRjtBQUNqRixrRkFBa0Y7QUFDbEYsZ0NBQWdDO0FBQ2hDLEVBQUU7QUFDRix1RkFBdUY7QUFDdkYsOEVBQThFO0FBQzlFLEVBQUU7QUFDRiwyRUFBMkU7QUFDM0UsK0VBQStFO0FBQy9FLDhFQUE4RTtBQUM5RSxFQUFFO0FBQ0YsaUZBQWlGO0FBQ2pGLG1GQUFtRjtBQUV0RSxRQUFBLG9DQUFvQyxHQUFHLHlDQUF5QyxDQUFDO0FBQ2pGLFFBQUEsMkJBQTJCLEdBQUcsMEJBQTBCLENBQUM7QUFDdEUsb0RBQW9EO0FBQ3ZDLFFBQUEsbUJBQW1CLEdBQUcsbUNBQTJCLENBQUM7QUFDbEQsUUFBQSxpQ0FBaUMsR0FBRyxzQ0FBc0MsQ0FBQztBQUMzRSxRQUFBLDhCQUE4QixHQUFHLG9DQUFvQyxDQUFDO0FBQ3RFLFFBQUEscUJBQXFCLEdBQUcsNkNBQTZDLENBQUM7QUFDdEUsUUFBQSx1Q0FBdUMsR0FBRyxrREFBa0QsQ0FBQztBQUM3RixRQUFBLHdCQUF3QixHQUFHLHFDQUFxQyxDQUFDO0FBQ2pFLFFB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Q0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFFL0Msa0RBQWtEO0FBQ3JDLFFBQUEsMkJBQTJCLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDJCQUFtQixDQUFDO0tBQzlGLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRmxhZ0luZm8sIEZsYWdUeXBlIH0gZnJvbSAnLi9wcml2YXRlL2ZsYWctbW9kZWxpbmcnO1xuXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vXG4vLyBUaGlzIGZpbGUgZGVmaW5lcyBjb250ZXh0IGtleXMgdGhhdCBlbmFibGUgY2VydGFpbiBmZWF0dXJlcyB0aGF0IGFyZVxuLy8gaW1wbGVtZW50ZWQgYmVoaW5kIGEgZmxhZyBpbiBvcmRlciB0byBwcmVzZXJ2ZSBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSBmb3Jcbi8vIGV4aXN0aW5nIGFwcHMuIFdoZW4gYSBuZXcgYXBwIGlzIGluaXRpYWxpemVkIHRocm91Z2ggYGNkayBpbml0YCwgdGhlIENMSSB3aWxsXG4vLyBhdXRvbWF0aWNhbGx5IGFkZCBlbmFibGUgdGhlc2UgZmVhdHVyZXMgYnkgYWRkaW5nIHRoZW0gdG8gdGhlIGdlbmVyYXRlZFxuLy8gYGNkay5qc29uYCBmaWxlLlxuLy9cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy9cbi8vICAhISEgSU1QT1JUQU5UICEhIVxuLy9cbi8vICBXaGVuIHlvdSBpbnRyb2R1Y2UgYSBuZXcgZmxhZywgc2V0IGl0cyAnaW50cm9kdWNlZEluLnYyJyB2YWx1ZSB0byB0aGUgbGl0ZXJhbCBzdHJpbmdcbi8vICdWMsK3TkVYVCcsIHdpdGhvdXQgdGhlIGRvdC5cbi8vXG4vLyAgRE8gTk9UIFVTRSBBIFZBUklBQkxFLiBETyBOT1QgREVGSU5FIEEgQ09OU1RBTlQuIFRoZSBhY3R1YWwgdmFsdWUgd2lsbCBiZSBzdHJpbmctcmVwbGFjZWQgYXRcbi8vICB2ZXJzaW9uIGJ1bXAgdGltZS5cbi8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vXG4vLyBUaGVyZSBhcmUgdGhyZWUgdHlwZXMgb2YgZmxhZ3M6IEFwaURlZmF1bHQsIEJ1Z0ZpeCwgYW5kIFZpc2libGVDb250ZXh0IGZsYWdzLlxuLy9cbi8vIC0gQXBpRGVmYXVsdCBmbGFnczogY2hhbmdlIHRoZSBiZWhhdmlvciBvciBkZWZhdWx0cyBvZiB0aGUgY29uc3RydWN0IGxpYnJhcnkuIFdoZW5cbi8vICAgc2V0LCB0aGUgaW5mcmFzdHJ1Y3R1cmUgdGhhdCBpcyBnZW5lcmF0ZWQgbWF5IGJlIGRpZmZlcmVudCBidXQgdGhlcmUgaXNcbi8vICAgYSB3YXkgdG8gZ2V0IHRoZSBvbGQgaW5mcmFzdHJ1Y3R1cmUgc2V0dXAgYnkgdXNpbmcgdGhlIEFQSSBpbiBhIGRpZmZlcmVudCB3YXkuXG4vL1xuLy8gLSBCdWdGaXggZmxhZ3M6IHRoZSBvbGQgaW5mcmEgd2UgdXNlZCB0byBnZW5lcmF0ZSBpcyBubyBsb25nZXIgcmVjb21tZW5kZWQsXG4vLyAgIGFuZCB0aGVyZSBpcyBubyB3YXkgdG8gYWNoaWV2ZSB0aGF0IHJlc3VsdCBhbnltb3JlIGV4Y2VwdCBieSBtYWtpbmcgc3VyZSB0aGVcbi8vICAgZmxhZyBpcyB1bnNldCwgb3Igc2V0IHRvIGBmYWxzZWAuIE1vc3RseSB1c2VkIGZvciBpbmZyYS1pbXBhY3RpbmcgYnVnZml4ZXMgb3Jcbi8vICAgZW5oYW5jZWQgc2VjdXJpdHkgZGVmYXVsdHMuXG4vL1xuLy8gLSBWaXNpYmxlQ29udGV4dCBmbGFnczogbm90IHJlYWxseSBhIGZlYXR1cmUgZmxhZywgYnV0IGNvbmZpZ3VyYWJsZSBjb250ZXh0IHdoaWNoIGlzXG4vLyAgIGFkdmVydGlzZWQgYnkgcHV0dGluZyB0aGUgY29udGV4dCBpbiB0aGUgYGNkay5qc29uYCBmaWxlIG9mIG5ldyBwcm9qZWN0cy5cbi8vXG4vLyBJbiBmdXR1cmUgbWFqb3IgdmVyc2lvbnMsIHRoZSBcIm5ld1Byb2plY3RWYWx1ZXNcIiB3aWxsIGJlY29tZSB0aGUgdmVyc2lvblxuLy8gZGVmYXVsdCBmb3IgYm90aCBEZWZhdWx0QmVoYXZpb3IgYW5kIEJ1Z0ZpeCBmbGFncywgYW5kIERlZmF1bHRCZWhhdmlvciBmbGFnc1xuLy8gd2lsbCBiZSByZW1vdmVkIChpLmUuLCB0aGVpciBuZXcgYmVoYXZpb3Igd2lsbCBiZWNvbWUgdGhlICpvbmx5KiBiZWhhdmlvcikuXG4vL1xuLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay1yZmNzL2Jsb2IvbWFzdGVyL3RleHQvMDA1NS1mZWF0dXJlLWZsYWdzLm1kXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5leHBvcnQgY29uc3QgRU5BQkxFX1NUQUNLX05BTUVfRFVQTElDQVRFU19DT05URVhUID0gJ0Bhd3MtY2RrL2NvcmU6ZW5hYmxlU3RhY2tOYW1lRHVwbGljYXRlcyc7XG5leHBvcnQgY29uc3QgRU5BQkxFX0RJRkZfTk9fRkFJTF9DT05URVhUID0gJ2F3cy1jZGs6ZW5hYmxlRGlmZk5vRmFpbCc7XG4vKiogQGRlcHJlY2F0ZWQgdXNlIGBFTkFCTEVfRElGRl9OT19GQUlMX0NPTlRFWFRgICovXG5leHBvcnQgY29uc3QgRU5BQkxFX0RJRkZfTk9fRkFJTCA9IEVOQUJMRV9ESUZGX05PX0ZBSUxfQ09OVEVYVDtcbmV4cG9ydCBjb25zdCBORVdfU1RZTEVfU1RBQ0tfU1lOVEhFU0lTX0NPTlRFWFQgPSAnQGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzJztcbmV4cG9ydCBjb25zdCBTVEFDS19SRUxBVElWRV9FWFBPUlRTX0NPTlRFWFQgPSAnQGF3cy1jZGsvY29yZTpzdGFja1JlbGF0aXZlRXhwb3J0cyc7XG5leHBvcnQgY29uc3QgRE9DS0VSX0lHTk9SRV9TVVBQT1JUID0gJ0Bhd3MtY2RrL2F3cy1lY3ItYXNzZXRzOmRvY2tlcklnbm9yZVN1cHBvcnQnO1xuZXhwb3J0IGNvbnN0IFNFQ1JFVFNfTUFOQUdFUl9QQVJTRV9PV05FRF9TRUNSRVRfTkFNRSA9ICdAYXdzLWNkay9hd3Mtc2VjcmV0c21hbmFnZXI6cGFyc2VPd25lZFNlY3JldE5hbWUnO1xuZXhwb3J0IGNvbnN0IEtNU19ERUZBVUxUX0tFWV9QT0xJQ0lFUyA9ICdAYXdzLWNkay9hd3Mta21zOmRlZmF1bHRLZXlQb2xpY2llcyc7XG5leHBvcnQgY29uc3QgUzNfR1JBTlRfV1JJVEVfV0lUSE9VVF9BQ0wgPSAnQGF3cy1jZGsvYXdzLXMzOmdyYW50V3JpdGVXaXRob3V0QWNsJztcbmV4cG9ydCBjb25zdCBFQ1NfUkVNT1ZFX0RFRkFVTFRfREVTSVJFRF9DT1VOVCA9ICdAYXdzLWNkay9hd3MtZWNzLXBhdHRlcm5zOnJlbW92ZURlZmF1bHREZXNpcmVkQ291bnQnO1xuZXhwb3J0IGNvbnN0IFJEU19MT1dFUkNBU0VfREJfSURFTlRJRklFUiA9ICdAYXdzLWNkay9hd3MtcmRzOmxvd2VyY2FzZURiSWRlbnRpZmllcic7XG5leHBvcnQgY29uc3QgQVBJR0FURVdBWV9VU0FHRVBMQU5LRVlfT1JERVJJTlNFTlNJVElWRV9JRCA9ICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheTp1c2FnZVBsYW5LZXlPcmRlckluc2Vuc2l0aXZlSWQnO1xuZXhwb3J0IGNvbnN0IEVGU19ERUZBVUxUX0VOQ1JZUFRJT05fQVRfUkVTVCA9ICdAYXdzLWNkay9hd3MtZWZzOmRlZmF1bHRFbmNyeXB0aW9uQXRSZXN0JztcbmV4cG9ydCBjb25zdCBMQU1CREFfUkVDT0dOSVpFX1ZFUlNJT05fUFJPUFMgPSAnQGF3cy1jZGsvYXdzLWxhbWJkYTpyZWNvZ25pemVWZXJzaW9uUHJvcHMnO1xuZXhwb3J0IGNvbnN0IExBTUJEQV9SRUNPR05JWkVfTEFZRVJfVkVSU0lPTiA9ICdAYXdzLWNkay9hd3MtbGFtYmRhOnJlY29nbml6ZUxheWVyVmVyc2lvbic7XG5leHBvcnQgY29uc3QgQ0xPVURGUk9OVF9ERUZBVUxUX1NFQ1VSSVRZX1BPTElDWV9UTFNfVjFfMl8yMDIxID0gJ0Bhd3MtY2RrL2F3cy1jbG91ZGZyb250OmRlZmF1bHRTZWN1cml0eVBvbGljeVRMU3YxLjJfMjAyMSc7XG5leHBvcnQgY29uc3QgQ0hFQ0tfU0VDUkVUX1VTQUdFID0gJ0Bhd3MtY2RrL2NvcmU6Y2hlY2tTZWNyZXRVc2FnZSc7XG5leHBvcnQgY29uc3QgVEFSR0VUX1BBUlRJVElPTlMgPSAnQGF3cy1jZGsvY29yZTp0YXJnZXQtcGFydGl0aW9ucyc7XG5leHBvcnQgY29uc3QgRUNTX1NFUlZJQ0VfRVhURU5TSU9OU19FTkFCTEVfREVGQVVMVF9MT0dfRFJJVkVSID0gJ0Bhd3MtY2RrLWNvbnRhaW5lcnMvZWNzLXNlcnZpY2UtZXh0ZW5zaW9uczplbmFibGVEZWZhdWx0TG9nRHJpdmVyJztcbmV4cG9ydCBjb25zdCBFQzJfVU5JUVVFX0lNRFNWMl9MQVVOQ0hfVEVNUExBVEVfTkFNRSA9ICdAYXdzLWNkay9hd3MtZWMyOnVuaXF1ZUltZHN2MlRlbXBsYXRlTmFtZSc7XG5leHBvcnQgY29uc3QgRUNTX0FSTl9GT1JNQVRfSU5DTFVERVNfQ0xVU1RFUl9OQU1FID0gJ0Bhd3MtY2RrL2F3cy1lY3M6YXJuRm9ybWF0SW5jbHVkZXNDbHVzdGVyTmFtZSc7XG5leHBvcnQgY29uc3QgSUFNX01JTklNSVpFX1BPTElDSUVTID0gJ0Bhd3MtY2RrL2F3cy1pYW06bWluaW1pemVQb2xpY2llcyc7XG5leHBvcnQgY29uc3QgSUFNX0lNUE9SVEVEX1JPTEVfU1RBQ0tfU0FGRV9ERUZBVUxUX1BPTElDWV9OQU1FID0gJ0Bhd3MtY2RrL2F3cy1pYW06aW1wb3J0ZWRSb2xlU3RhY2tTYWZlRGVmYXVsdFBvbGljeU5hbWUnO1xuZXhwb3J0IGNvbnN0IFZBTElEQVRFX1NOQVBTSE9UX1JFTU9WQUxfUE9MSUNZID0gJ0Bhd3MtY2RrL2NvcmU6dmFsaWRhdGVTbmFwc2hvdFJlbW92YWxQb2xpY3knO1xuZXhwb3J0IGNvbnN0IENPREVQSVBFTElORV9DUk9TU19BQ0NPVU5UX0tFWV9BTElBU19TVEFDS19TQUZFX1JFU09VUkNFX05BTUUgPSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZTpjcm9zc0FjY291bnRLZXlBbGlhc1N0YWNrU2FmZVJlc291cmNlTmFtZSc7XG5leHBvcnQgY29uc3QgUzNfQ1JFQVRFX0RFRkFVTFRfTE9HR0lOR19QT0xJQ1kgPSAnQGF3cy1jZGsvYXdzLXMzOmNyZWF0ZURlZmF1bHRMb2dnaW5nUG9saWN5JztcbmV4cG9ydCBjb25zdCBTTlNfU1VCU0NSSVBUSU9OU19TUVNfREVDUllQVElPTl9QT0xJQ1kgPSAnQGF3cy1jZGsvYXdzLXNucy1zdWJzY3JpcHRpb25zOnJlc3RyaWN0U3FzRGVzY3J5cHRpb24nO1xuZXhwb3J0IGNvbnN0IEFQSUdBVEVXQVlfRElTQUJMRV9DTE9VRFdBVENIX1JPTEUgPSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXk6ZGlzYWJsZUNsb3VkV2F0Y2hSb2xlJztcbmV4cG9ydCBjb25zdCBFTkFCTEVfUEFSVElUSU9OX0xJVEVSQUxTID0gJ0Bhd3MtY2RrL2NvcmU6ZW5hYmxlUGFydGl0aW9uTGl0ZXJhbHMnO1xuZXhwb3J0IGNvbnN0IEVWRU5UU19UQVJHRVRfUVVFVUVfU0FNRV9BQ0NPVU5UID0gJ0Bhd3MtY2RrL2F3cy1ldmVudHM6ZXZlbnRzVGFyZ2V0UXVldWVTYW1lQWNjb3VudCc7XG5leHBvcnQgY29uc3QgSUFNX1NUQU5EQVJESVpFRF9TRVJWSUNFX1BSSU5DSVBBTFMgPSAnQGF3cy1jZGsvYXdzLWlhbTpzdGFuZGFyZGl6ZWRTZXJ2aWNlUHJpbmNpcGFscyc7XG5leHBvcnQgY29uc3QgRUNTX0RJU0FCTEVfRVhQTElDSVRfREVQTE9ZTUVOVF9DT05UUk9MTEVSX0ZPUl9DSVJDVUlUX0JSRUFLRVIgPSAnQGF3cy1jZGsvYXdzLWVjczpkaXNhYmxlRXhwbGljaXREZXBsb3ltZW50Q29udHJvbGxlckZvckNpcmN1aXRCcmVha2VyJztcbmV4cG9ydCBjb25zdCBTM19TRVJWRVJfQUNDRVNTX0xPR1NfVVNFX0JVQ0tFVF9QT0xJQ1kgPSAnQGF3cy1jZGsvYXdzLXMzOnNlcnZlckFjY2Vzc0xvZ3NVc2VCdWNrZXRQb2xpY3knO1xuZXhwb3J0IGNvbnN0IFJPVVRFNTNfUEFUVEVSTlNfVVNFX0NFUlRJRklDQVRFID0gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzLXBhdHRlcnM6dXNlQ2VydGlmaWNhdGUnO1xuZXhwb3J0IGNvbnN0IEFXU19DVVNUT01fUkVTT1VSQ0VfTEFURVNUX1NES19ERUZBVUxUID0gJ0Bhd3MtY2RrL2N1c3RvbXJlc291cmNlczppbnN0YWxsTGF0ZXN0QXdzU2RrRGVmYXVsdCc7XG5leHBvcnQgY29uc3QgREFUQUJBU0VfUFJPWFlfVU5JUVVFX1JFU09VUkNFX05BTUUgPSAnQGF3cy1jZGsvYXdzLXJkczpkYXRhYmFzZVByb3h5VW5pcXVlUmVzb3VyY2VOYW1lJztcbmV4cG9ydCBjb25zdCBDT0RFREVQTE9ZX1JFTU9WRV9BTEFSTVNfRlJPTV9ERVBMT1lNRU5UX0dST1VQID0gJ0Bhd3MtY2RrL2F3cy1jb2RlZGVwbG95OnJlbW92ZUFsYXJtc0Zyb21EZXBsb3ltZW50R3JvdXAnO1xuZXhwb3J0IGNvbnN0IEFQSUdBVEVXQVlfQVVUSE9SSVpFUl9DSEFOR0VfREVQTE9ZTUVOVF9MT0dJQ0FMX0lEID0gJ0Bhd3MtY2RrL2F3cy1hcGlnYXRld2F5OmF1dGhvcml6ZXJDaGFuZ2VEZXBsb3ltZW50TG9naWNhbElkJztcbmV4cG9ydCBjb25zdCBFQzJfTEFVTkNIX1RFTVBMQVRFX0RFRkFVTFRfVVNFUl9EQVRBID0gJ0Bhd3MtY2RrL2F3cy1lYzI6bGF1bmNoVGVtcGxhdGVEZWZhdWx0VXNlckRhdGEnO1xuZXhwb3J0IGNvbnN0IFNFQ1JFVFNfTUFOQUdFUl9UQVJHRVRfQVRUQUNITUVOVF9SRVNPVVJDRV9QT0xJQ1kgPSAnQGF3cy1jZGsvYXdzLXNlY3JldHNtYW5hZ2VyOnVzZUF0dGFjaGVkU2VjcmV0UmVzb3VyY2VQb2xpY3lGb3JTZWNyZXRUYXJnZXRBdHRhY2htZW50cyc7XG5leHBvcnQgY29uc3QgUkVEU0hJRlRfQ09MVU1OX0lEID0gJ0Bhd3MtY2RrL2F3cy1yZWRzaGlmdDpjb2x1bW5JZCc7XG5leHBvcnQgY29uc3QgRU5BQkxFX0VNUl9TRVJWSUNFX1BPTElDWV9WMiA9ICdAYXdzLWNkay9hd3Mtc3RlcGZ1bmN0aW9ucy10YXNrczplbmFibGVFbXJTZXJ2aWNlUG9saWN5VjInO1xuZXhwb3J0IGNvbnN0IEVDMl9SRVNUUklDVF9ERUZBVUxUX1NFQ1VSSVRZX0dST1VQID0gJ0Bhd3MtY2RrL2F3cy1lYzI6cmVzdHJpY3REZWZhdWx0U2VjdXJpdHlHcm91cCc7XG5leHBvcnQgY29uc3QgQVBJR0FURVdBWV9SRVFVRVNUX1ZBTElEQVRPUl9VTklRVUVfSUQgPSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXk6cmVxdWVzdFZhbGlkYXRvclVuaXF1ZUlkJztcbmV4cG9ydCBjb25zdCBJTkNMVURFX1BSRUZJWF9JTl9VTklRVUVfTkFNRV9HRU5FUkFUSU9OID0gJ0Bhd3MtY2RrL2NvcmU6aW5jbHVkZVByZWZpeEluVW5pcXVlTmFtZUdlbmVyYXRpb24nO1xuZXhwb3J0IGNvbnN0IEtNU19BTElBU19OQU1FX1JFRiA9ICdAYXdzLWNkay9hd3Mta21zOmFsaWFzTmFtZVJlZic7XG5cbmV4cG9ydCBjb25zdCBGTEFHUzogUmVjb3JkPHN0cmluZywgRmxhZ0luZm8+ID0ge1xuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtFTkFCTEVfU1RBQ0tfTkFNRV9EVVBMSUNBVEVTX0NPTlRFWFRdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQXBpRGVmYXVsdCxcbiAgICBzdW1tYXJ5OiAnQWxsb3cgbXVsdGlwbGUgc3RhY2tzIHdpdGggdGhlIHNhbWUgbmFtZScsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBJZiB0aGlzIGlzIHNldCwgbXVsdGlwbGUgc3RhY2tzIGNhbiB1c2UgdGhlIHNhbWUgc3RhY2sgbmFtZSAoZS5nLiBkZXBsb3llZCB0b1xuICAgICAgZGlmZmVyZW50IGVudmlyb25tZW50cykuIFRoaXMgbWVhbnMgdGhhdCB0aGUgbmFtZSBvZiB0aGUgc3ludGhlc2l6ZWQgdGVtcGxhdGVcbiAgICAgIGZpbGUgd2lsbCBiZSBiYXNlZCBvbiB0aGUgY29uc3RydWN0IHBhdGggYW5kIG5vdCBvbiB0aGUgZGVmaW5lZCBcXGBzdGFja05hbWVcXGBcbiAgICAgIG9mIHRoZSBzdGFjay5gLFxuICAgIHJlY29tbWVuZGVkVmFsdWU6IHRydWUsXG4gICAgaW50cm9kdWNlZEluOiB7IHYxOiAnMS4xNi4wJyB9LFxuICAgIGRlZmF1bHRzOiB7IHYyOiB0cnVlIH0sXG4gICAgY29tcGF0aWJpbGl0eVdpdGhPbGRCZWhhdmlvck1kOiAnUGFzcyBzdGFjayBpZGVudGlmaWVycyB0byB0aGUgQ0xJIGluc3RlYWQgb2Ygc3RhY2sgbmFtZXMuJyxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtFTkFCTEVfRElGRl9OT19GQUlMX0NPTlRFWFRdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQXBpRGVmYXVsdCxcbiAgICBzdW1tYXJ5OiAnTWFrZSBgY2RrIGRpZmZgIG5vdCBmYWlsIHdoZW4gdGhlcmUgYXJlIGRpZmZlcmVuY2VzJyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIERldGVybWluZXMgd2hhdCBzdGF0dXMgY29kZSBcXGBjZGsgZGlmZlxcYCBzaG91bGQgcmV0dXJuIHdoZW4gdGhlIHNwZWNpZmllZCBzdGFja1xuICAgICAgZGlmZmVycyBmcm9tIHRoZSBkZXBsb3llZCBzdGFjayBvciB0aGUgbG9jYWwgQ2xvdWRGb3JtYXRpb24gdGVtcGxhdGU6XG5cbiAgICAgICogXFxgYXdzLWNkazplbmFibGVEaWZmTm9GYWlsPXRydWVcXGAgPT4gc3RhdHVzIGNvZGUgPT0gMFxuICAgICAgKiBcXGBhd3MtY2RrOmVuYWJsZURpZmZOb0ZhaWw9ZmFsc2VcXGAgPT4gc3RhdHVzIGNvZGUgPT0gMVxuXG4gICAgICBZb3UgY2FuIG92ZXJyaWRlIHRoaXMgYmVoYXZpb3Igd2l0aCB0aGUgLS1mYWlsIGZsYWc6XG5cbiAgICAgICogXFxgLS1mYWlsXFxgID0+IHN0YXR1cyBjb2RlID09IDFcbiAgICAgICogXFxgLS1uby1mYWlsXFxgID0+IHN0YXR1cyBjb2RlID09IDBgLFxuICAgIGludHJvZHVjZWRJbjogeyB2MTogJzEuMTkuMCcgfSxcbiAgICBkZWZhdWx0czogeyB2MjogdHJ1ZSB9LFxuICAgIHJlY29tbWVuZGVkVmFsdWU6IHRydWUsXG4gICAgY29tcGF0aWJpbGl0eVdpdGhPbGRCZWhhdmlvck1kOiAnU3BlY2lmeSBgLS1mYWlsYCB0byB0aGUgQ0xJLicsXG4gIH0sXG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBbTkVXX1NUWUxFX1NUQUNLX1NZTlRIRVNJU19DT05URVhUXToge1xuICAgIHR5cGU6IEZsYWdUeXBlLkJ1Z0ZpeCxcbiAgICBzdW1tYXJ5OiAnU3dpdGNoIHRvIG5ldyBzdGFjayBzeW50aGVzaXMgbWV0aG9kIHdoaWNoIGVuYWJsZXMgQ0kvQ0QnLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgSWYgdGhpcyBmbGFnIGlzIHNwZWNpZmllZCwgYWxsIFxcYFN0YWNrXFxgcyB3aWxsIHVzZSB0aGUgXFxgRGVmYXVsdFN0YWNrU3ludGhlc2l6ZXJcXGAgYnlcbiAgICAgIGRlZmF1bHQuIElmIGl0IGlzIG5vdCBzZXQsIHRoZXkgd2lsbCB1c2UgdGhlIFxcYExlZ2FjeVN0YWNrU3ludGhlc2l6ZXJcXGAuYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjE6ICcxLjM5LjAnLCB2MjogJzIuMC4wJyB9LFxuICAgIGRlZmF1bHRzOiB7IHYyOiB0cnVlIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtTVEFDS19SRUxBVElWRV9FWFBPUlRTX0NPTlRFWFRdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdOYW1lIGV4cG9ydHMgYmFzZWQgb24gdGhlIGNvbnN0cnVjdCBwYXRocyByZWxhdGl2ZSB0byB0aGUgc3RhY2ssIHJhdGhlciB0aGFuIHRoZSBnbG9iYWwgY29uc3RydWN0IHBhdGgnLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgQ29tYmluZWQgd2l0aCB0aGUgc3RhY2sgbmFtZSB0aGlzIHJlbGF0aXZlIGNvbnN0cnVjdCBwYXRoIGlzIGdvb2QgZW5vdWdoIHRvXG4gICAgICBlbnN1cmUgdW5pcXVlbmVzcywgYW5kIG1ha2VzIHRoZSBleHBvcnQgbmFtZXMgcm9idXN0IGFnYWluc3QgcmVmYWN0b3JpbmdcbiAgICAgIHRoZSBsb2NhdGlvbiBvZiB0aGUgc3RhY2sgaW4gdGhlIGNvbnN0cnVjdCB0cmVlIChzcGVjaWZpY2FsbHksIG1vdmluZyB0aGUgU3RhY2tcbiAgICAgIGludG8gYSBTdGFnZSkuYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjE6ICcxLjU4LjAnLCB2MjogJzIuMC4wJyB9LFxuICAgIGRlZmF1bHRzOiB7IHYyOiB0cnVlIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtET0NLRVJfSUdOT1JFX1NVUFBPUlRdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQXBpRGVmYXVsdCxcbiAgICBzdW1tYXJ5OiAnRG9ja2VySW1hZ2VBc3NldCBwcm9wZXJseSBzdXBwb3J0cyBgLmRvY2tlcmlnbm9yZWAgZmlsZXMgYnkgZGVmYXVsdCcsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBJZiB0aGlzIGZsYWcgaXMgbm90IHNldCwgdGhlIGRlZmF1bHQgYmVoYXZpb3IgZm9yIFxcYERvY2tlckltYWdlQXNzZXRcXGAgaXMgdG8gdXNlXG4gICAgICBnbG9iIHNlbWFudGljcyBmb3IgXFxgLmRvY2tlcmlnbm9yZVxcYCBmaWxlcy4gSWYgdGhpcyBmbGFnIGlzIHNldCwgdGhlIGRlZmF1bHQgYmVoYXZpb3JcbiAgICAgIGlzIHN0YW5kYXJkIERvY2tlciBpZ25vcmUgc2VtYW50aWNzLlxuXG4gICAgICBUaGlzIGlzIGEgZmVhdHVyZSBmbGFnIGFzIHRoZSBvbGQgYmVoYXZpb3Igd2FzIHRlY2huaWNhbGx5IGluY29ycmVjdCBidXRcbiAgICAgIHVzZXJzIG1heSBoYXZlIGNvbWUgdG8gZGVwZW5kIG9uIGl0LmAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYxOiAnMS43My4wJyB9LFxuICAgIGRlZmF1bHRzOiB7IHYyOiB0cnVlIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgICBjb21wYXRpYmlsaXR5V2l0aE9sZEJlaGF2aW9yTWQ6ICdVcGRhdGUgeW91ciBgLmRvY2tlcmlnbm9yZWAgZmlsZSB0byBtYXRjaCBzdGFuZGFyZCBEb2NrZXIgaWdub3JlIHJ1bGVzLCBpZiBuZWNlc3NhcnkuJyxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtTRUNSRVRTX01BTkFHRVJfUEFSU0VfT1dORURfU0VDUkVUX05BTUVdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQXBpRGVmYXVsdCxcbiAgICBzdW1tYXJ5OiAnRml4IHRoZSByZWZlcmVuY2luZyBvZiBTZWNyZXRzTWFuYWdlciBuYW1lcyBmcm9tIEFSTnMnLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgU2VjcmV0LnNlY3JldE5hbWUgZm9yIGFuIFwib3duZWRcIiBzZWNyZXQgd2lsbCBhdHRlbXB0IHRvIHBhcnNlIHRoZSBzZWNyZXROYW1lIGZyb20gdGhlIEFSTixcbiAgICAgIHJhdGhlciB0aGFuIHRoZSBkZWZhdWx0IGZ1bGwgcmVzb3VyY2UgbmFtZSwgd2hpY2ggaW5jbHVkZXMgdGhlIFNlY3JldHNNYW5hZ2VyIHN1ZmZpeC5cblxuICAgICAgSWYgdGhpcyBmbGFnIGlzIG5vdCBzZXQsIFNlY3JldC5zZWNyZXROYW1lIHdpbGwgaW5jbHVkZSB0aGUgU2VjcmV0c01hbmFnZXIgc3VmZml4LCB3aGljaCBjYW5ub3QgYmUgZGlyZWN0bHlcbiAgICAgIHVzZWQgYnkgU2VjcmV0c01hbmFnZXIuRGVzY3JpYmVTZWNyZXQsIGFuZCBtdXN0IGJlIHBhcnNlZCBieSB0aGUgdXNlciBmaXJzdCAoZS5nLiwgRm46Sm9pbiwgRm46U2VsZWN0LCBGbjpTcGxpdCkuYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjE6ICcxLjc3LjAnIH0sXG4gICAgZGVmYXVsdHM6IHsgdjI6IHRydWUgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICAgIGNvbXBhdGliaWxpdHlXaXRoT2xkQmVoYXZpb3JNZDogJ1VzZSBgcGFyc2VBcm4oc2VjcmV0LnNlY3JldE5hbWUpLnJlc291cmNlTmFtZWAgdG8gZW11bGF0ZSB0aGUgaW5jb3JyZWN0IG9sZCBwYXJzaW5nLicsXG4gIH0sXG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBbS01TX0RFRkFVTFRfS0VZX1BPTElDSUVTXToge1xuICAgIHR5cGU6IEZsYWdUeXBlLkFwaURlZmF1bHQsXG4gICAgc3VtbWFyeTogJ1RpZ2h0ZW4gZGVmYXVsdCBLTVMga2V5IHBvbGljaWVzJyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIEtNUyBLZXlzIHN0YXJ0IHdpdGggYSBkZWZhdWx0IGtleSBwb2xpY3kgdGhhdCBncmFudHMgdGhlIGFjY291bnQgYWNjZXNzIHRvIGFkbWluaXN0ZXIgdGhlIGtleSxcbiAgICAgIG1pcnJvcmluZyB0aGUgYmVoYXZpb3Igb2YgdGhlIEtNUyBTREsvQ0xJL0NvbnNvbGUgZXhwZXJpZW5jZS4gVXNlcnMgbWF5IG92ZXJyaWRlIHRoZSBkZWZhdWx0IGtleVxuICAgICAgcG9saWN5IGJ5IHNwZWNpZnlpbmcgdGhlaXIgb3duLlxuXG4gICAgICBJZiB0aGlzIGZsYWcgaXMgbm90IHNldCwgdGhlIGRlZmF1bHQga2V5IHBvbGljeSBkZXBlbmRzIG9uIHRoZSBzZXR0aW5nIG9mIHRoZSBcXGB0cnVzdEFjY291bnRJZGVudGl0aWVzXFxgXG4gICAgICBmbGFnLiBJZiBmYWxzZSAodGhlIGRlZmF1bHQsIGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSByZWFzb25zKSwgdGhlIGRlZmF1bHQga2V5IHBvbGljeSBzb21ld2hhdFxuICAgICAgcmVzZW1ibGVzIHRoZSBkZWZhdWx0IGFkbWluIGtleSBwb2xpY3ksIGJ1dCB3aXRoIHRoZSBhZGRpdGlvbiBvZiAnR2VuZXJhdGVEYXRhS2V5JyBwZXJtaXNzaW9ucy4gSWZcbiAgICAgIHRydWUsIHRoZSBwb2xpY3kgbWF0Y2hlcyB3aGF0IGhhcHBlbnMgd2hlbiB0aGlzIGZlYXR1cmUgZmxhZyBpcyBzZXQuXG5cbiAgICAgIEFkZGl0aW9uYWxseSwgaWYgdGhpcyBmbGFnIGlzIG5vdCBzZXQgYW5kIHRoZSB1c2VyIHN1cHBsaWVzIGEgY3VzdG9tIGtleSBwb2xpY3ksIHRoaXMgd2lsbCBiZSBhcHBlbmRlZFxuICAgICAgdG8gdGhlIGtleSdzIGRlZmF1bHQgcG9saWN5IChyYXRoZXIgdGhhbiByZXBsYWNpbmcgaXQpLmAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYxOiAnMS43OC4wJyB9LFxuICAgIGRlZmF1bHRzOiB7IHYyOiB0cnVlIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgICBjb21wYXRpYmlsaXR5V2l0aE9sZEJlaGF2aW9yTWQ6ICdQYXNzIGB0cnVzdEFjY291bnRJZGVudGl0aWVzOiBmYWxzZWAgdG8gYEtleWAgY29uc3RydWN0IHRvIHJlc3RvcmUgdGhlIG9sZCBiZWhhdmlvci4nLFxuICB9LFxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgW1MzX0dSQU5UX1dSSVRFX1dJVEhPVVRfQUNMXToge1xuICAgIHR5cGU6IEZsYWdUeXBlLkFwaURlZmF1bHQsXG4gICAgc3VtbWFyeTogJ1JlbW92ZSBgUHV0T2JqZWN0QWNsYCBmcm9tIEJ1Y2tldC5ncmFudFdyaXRlJyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIENoYW5nZSB0aGUgb2xkICdzMzpQdXRPYmplY3QqJyBwZXJtaXNzaW9uIHRvICdzMzpQdXRPYmplY3QnIG9uIEJ1Y2tldCxcbiAgICAgIGFzIHRoZSBmb3JtZXIgaW5jbHVkZXMgJ3MzOlB1dE9iamVjdEFjbCcsXG4gICAgICB3aGljaCBjb3VsZCBiZSB1c2VkIHRvIGdyYW50IHJlYWQvd3JpdGUgb2JqZWN0IGFjY2VzcyB0byBJQU0gcHJpbmNpcGFscyBpbiBvdGhlciBhY2NvdW50cy5cbiAgICAgIFVzZSBhIGZlYXR1cmUgZmxhZyB0byBtYWtlIHN1cmUgZXhpc3RpbmcgY3VzdG9tZXJzIHdobyBtaWdodCBiZSByZWx5aW5nXG4gICAgICBvbiB0aGUgb3Zlcmx5LWJyb2FkIHBlcm1pc3Npb25zIGFyZSBub3QgYnJva2VuLmAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYxOiAnMS44NS4wJyB9LFxuICAgIGRlZmF1bHRzOiB7IHYyOiB0cnVlIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgICBjb21wYXRpYmlsaXR5V2l0aE9sZEJlaGF2aW9yTWQ6ICdDYWxsIGBidWNrZXQuZ3JhbnRQdXRBY2woKWAgaW4gYWRkaXRpb24gdG8gYGJ1Y2tldC5ncmFudFdyaXRlKClgIHRvIGdyYW50IEFDTCBwZXJtaXNzaW9ucy4nLFxuICB9LFxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgW0VDU19SRU1PVkVfREVGQVVMVF9ERVNJUkVEX0NPVU5UXToge1xuICAgIHR5cGU6IEZsYWdUeXBlLkFwaURlZmF1bHQsXG4gICAgc3VtbWFyeTogJ0RvIG5vdCBzcGVjaWZ5IGEgZGVmYXVsdCBEZXNpcmVkQ291bnQgZm9yIEVDUyBzZXJ2aWNlcycsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlZFNlcnZpY2VCYXNlLCBBcHBsaWNhdGlvbk11bHRpcGxlVGFyZ2V0R3JvdXBTZXJ2aWNlQmFzZSxcbiAgICAgIE5ldHdvcmtMb2FkQmFsYW5jZWRTZXJ2aWNlQmFzZSwgTmV0d29ya011bHRpcGxlVGFyZ2V0R3JvdXBTZXJ2aWNlQmFzZSwgYW5kXG4gICAgICBRdWV1ZVByb2Nlc3NpbmdTZXJ2aWNlQmFzZSBjdXJyZW50bHkgZGV0ZXJtaW5lIGEgZGVmYXVsdCB2YWx1ZSBmb3IgdGhlIGRlc2lyZWQgY291bnQgb2ZcbiAgICAgIGEgQ2ZuU2VydmljZSBpZiBhIGRlc2lyZWRDb3VudCBpcyBub3QgcHJvdmlkZWQuIFRoZSByZXN1bHQgb2YgdGhpcyBpcyB0aGF0IG9uIGV2ZXJ5XG4gICAgICBkZXBsb3ltZW50LCB0aGUgc2VydmljZSBjb3VudCBpcyByZXNldCB0byB0aGUgZml4ZWQgdmFsdWUsIGV2ZW4gaWYgaXQgd2FzIGF1dG9zY2FsZWQuXG5cbiAgICAgIElmIHRoaXMgZmxhZyBpcyBub3Qgc2V0LCB0aGUgZGVmYXVsdCBiZWhhdmlvdXIgZm9yIENmblNlcnZpY2UuZGVzaXJlZENvdW50IGlzIHRvIHNldCBhXG4gICAgICBkZXNpcmVkQ291bnQgb2YgMSwgaWYgb25lIGlzIG5vdCBwcm92aWRlZC4gSWYgdHJ1ZSwgYSBkZWZhdWx0IHdpbGwgbm90IGJlIGRlZmluZWQgZm9yXG4gICAgICBDZm5TZXJ2aWNlLmRlc2lyZWRDb3VudCBhbmQgYXMgc3VjaCBkZXNpcmVkQ291bnQgd2lsbCBiZSB1bmRlZmluZWQsIGlmIG9uZSBpcyBub3QgcHJvdmlkZWQuYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjE6ICcxLjkyLjAnIH0sXG4gICAgZGVmYXVsdHM6IHsgdjI6IHRydWUgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICAgIGNvbXBhdGliaWxpdHlXaXRoT2xkQmVoYXZpb3JNZDogJ1lvdSBjYW4gcGFzcyBgZGVzaXJlZENvdW50OiAxYCBleHBsaWNpdGx5LCBidXQgeW91IHNob3VsZCBuZXZlciBuZWVkIHRoaXMuJyxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtSRFNfTE9XRVJDQVNFX0RCX0lERU5USUZJRVJdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdGb3JjZSBsb3dlcmNhc2luZyBvZiBSRFMgQ2x1c3RlciBuYW1lcyBpbiBDREsnLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgQ2x1c3RlciBuYW1lcyBtdXN0IGJlIGxvd2VyY2FzZSwgYW5kIHRoZSBzZXJ2aWNlIHdpbGwgbG93ZXJjYXNlIHRoZSBuYW1lIHdoZW4gdGhlIGNsdXN0ZXJcbiAgICAgIGlzIGNyZWF0ZWQuIEhvd2V2ZXIsIENESyBkaWQgbm90IHVzZSB0byBrbm93IGFib3V0IHRoaXMsIGFuZCB3b3VsZCB1c2UgdGhlIHVzZXItcHJvdmlkZWQgbmFtZVxuICAgICAgcmVmZXJlbmNpbmcgdGhlIGNsdXN0ZXIsIHdoaWNoIHdvdWxkIGZhaWwgaWYgaXQgaGFwcGVuZWQgdG8gYmUgbWl4ZWQtY2FzZS5cblxuICAgICAgV2l0aCB0aGlzIGZsYWcsIGxvd2VyY2FzZSB0aGUgbmFtZSBpbiBDREsgc28gd2UgY2FuIHJlZmVyZW5jZSBpdCBwcm9wZXJseS5cblxuICAgICAgTXVzdCBiZSBiZWhpbmQgYSBwZXJtYW5lbnQgZmxhZyBiZWNhdXNlIGNoYW5naW5nIGEgbmFtZSBmcm9tIG1peGVkIGNhc2UgdG8gbG93ZXJjYXNlIGJldHdlZW4gZGVwbG95bWVudHNcbiAgICAgIHdvdWxkIGxlYWQgQ2xvdWRGb3JtYXRpb24gdG8gdGhpbmsgdGhlIG5hbWUgd2FzIGNoYW5nZWQgYW5kIHdvdWxkIHRyaWdnZXIgYSBjbHVzdGVyIHJlcGxhY2VtZW50XG4gICAgICAobG9zaW5nIGRhdGEhKS5gLFxuICAgIGludHJvZHVjZWRJbjogeyB2MTogJzEuOTcuMCcsIHYyOiAnMi4wLjAnIH0sXG4gICAgZGVmYXVsdHM6IHsgdjI6IHRydWUgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICB9LFxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgW0FQSUdBVEVXQVlfVVNBR0VQTEFOS0VZX09SREVSSU5TRU5TSVRJVkVfSURdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdBbGxvdyBhZGRpbmcvcmVtb3ZpbmcgbXVsdGlwbGUgVXNhZ2VQbGFuS2V5cyBpbmRlcGVuZGVudGx5JyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIFRoZSBVc2FnZVBsYW5LZXkgcmVzb3VyY2UgY29ubmVjdHMgYW4gQXBpS2V5IHdpdGggYSBVc2FnZVBsYW4uIEFQSSBHYXRld2F5IGRvZXMgbm90IGFsbG93IG1vcmUgdGhhbiBvbmUgVXNhZ2VQbGFuS2V5XG4gICAgICBmb3IgYW55IGdpdmVuIFVzYWdlUGxhbiBhbmQgQXBpS2V5IGNvbWJpbmF0aW9uLiBGb3IgdGhpcyByZWFzb24sIENsb3VkRm9ybWF0aW9uIGNhbm5vdCByZXBsYWNlIHRoaXMgcmVzb3VyY2Ugd2l0aG91dFxuICAgICAgZWl0aGVyIHRoZSBVc2FnZVBsYW4gb3IgQXBpS2V5IGNoYW5naW5nLlxuXG4gICAgICBUaGUgZmVhdHVyZSBhZGRpdGlvbiB0byBzdXBwb3J0IG11bHRpcGxlIFVzYWdlUGxhbktleSByZXNvdXJjZXMgLSAxNDJiZDBlMiAtIHJlY29nbml6ZWQgdGhpcyBhbmQgYXR0ZW1wdGVkIHRvIGtlZXBcbiAgICAgIGV4aXN0aW5nIFVzYWdlUGxhbktleSBsb2dpY2FsIGlkcyB1bmNoYW5nZWQuXG4gICAgICBIb3dldmVyLCB0aGlzIGludGVudGlvbmFsbHkgY2F1c2VkIHRoZSBsb2dpY2FsIGlkIG9mIHRoZSBVc2FnZVBsYW5LZXkgdG8gYmUgc2Vuc2l0aXZlIHRvIG9yZGVyLiBUaGF0IGlzLCB3aGVuXG4gICAgICB0aGUgJ2ZpcnN0JyBVc2FnZVBsYW5LZXkgcmVzb3VyY2UgaXMgcmVtb3ZlZCwgdGhlIGxvZ2ljYWwgaWQgb2YgdGhlICdzZWNvbmQnIGFzc3VtZXMgd2hhdCB3YXMgb3JpZ2luYWxseSB0aGUgJ2ZpcnN0JyxcbiAgICAgIHdoaWNoIGFnYWluIGlzIGRpc2FsbG93ZWQuXG5cbiAgICAgIEluIGVmZmVjdCwgdGhlcmUgaXMgbm8gd2F5IHRvIGdldCBvdXQgb2YgdGhpcyBtZXNzIGluIGEgYmFja3dhcmRzIGNvbXBhdGlibGUgd2F5LCB3aGlsZSBzdXBwb3J0aW5nIGV4aXN0aW5nIHN0YWNrcy5cbiAgICAgIFRoaXMgZmxhZyBjaGFuZ2VzIHRoZSBsb2dpY2FsIGlkIGxheW91dCBvZiBVc2FnZVBsYW5LZXkgdG8gbm90IGJlIHNlbnNpdGl2ZSB0byBvcmRlci5gLFxuICAgIGludHJvZHVjZWRJbjogeyB2MTogJzEuOTguMCcsIHYyOiAnMi4wLjAnIH0sXG4gICAgZGVmYXVsdHM6IHsgdjI6IHRydWUgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICB9LFxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgW0VGU19ERUZBVUxUX0VOQ1JZUFRJT05fQVRfUkVTVF06IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5BcGlEZWZhdWx0LFxuICAgIHN1bW1hcnk6ICdFbmFibGUgdGhpcyBmZWF0dXJlIGZsYWcgdG8gaGF2ZSBlbGFzdGljIGZpbGUgc3lzdGVtcyBlbmNyeXB0ZWQgYXQgcmVzdCBieSBkZWZhdWx0LicsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBFbmNyeXB0aW9uIGNhbiBhbHNvIGJlIGNvbmZpZ3VyZWQgZXhwbGljaXRseSB1c2luZyB0aGUgXFxgZW5jcnlwdGVkXFxgIHByb3BlcnR5LlxuICAgICAgYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjE6ICcxLjk4LjAnIH0sXG4gICAgZGVmYXVsdHM6IHsgdjI6IHRydWUgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICAgIGNvbXBhdGliaWxpdHlXaXRoT2xkQmVoYXZpb3JNZDogJ1Bhc3MgdGhlIGBlbmNyeXB0ZWQ6IGZhbHNlYCBwcm9wZXJ0eSB0byB0aGUgYEZpbGVTeXN0ZW1gIGNvbnN0cnVjdCB0byBkaXNhYmxlIGVuY3J5cHRpb24uJyxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtMQU1CREFfUkVDT0dOSVpFX1ZFUlNJT05fUFJPUFNdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdFbmFibGUgdGhpcyBmZWF0dXJlIGZsYWcgdG8gb3B0IGluIHRvIHRoZSB1cGRhdGVkIGxvZ2ljYWwgaWQgY2FsY3VsYXRpb24gZm9yIExhbWJkYSBWZXJzaW9uIGNyZWF0ZWQgdXNpbmcgdGhlICBgZm4uY3VycmVudFZlcnNpb25gLicsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBUaGUgcHJldmlvdXMgY2FsY3VsYXRpb24gaW5jb3JyZWN0bHkgY29uc2lkZXJlZCBwcm9wZXJ0aWVzIG9mIHRoZSBcXGBBV1M6OkxhbWJkYTo6RnVuY3Rpb25cXGAgcmVzb3VyY2UgdGhhdCBkaWRcbiAgICAgIG5vdCBjb25zdGl0dXRlIGNyZWF0aW5nIGEgbmV3IFZlcnNpb24uXG5cbiAgICAgIFNlZSAnY3VycmVudFZlcnNpb24nIHNlY3Rpb24gaW4gdGhlIGF3cy1sYW1iZGEgbW9kdWxlJ3MgUkVBRE1FIGZvciBtb3JlIGRldGFpbHMuYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjE6ICcxLjEwNi4wJywgdjI6ICcyLjAuMCcgfSxcbiAgICBkZWZhdWx0czogeyB2MjogdHJ1ZSB9LFxuICAgIHJlY29tbWVuZGVkVmFsdWU6IHRydWUsXG4gIH0sXG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBbTEFNQkRBX1JFQ09HTklaRV9MQVlFUl9WRVJTSU9OXToge1xuICAgIHR5cGU6IEZsYWdUeXBlLkJ1Z0ZpeCxcbiAgICBzdW1tYXJ5OiAnRW5hYmxlIHRoaXMgZmVhdHVyZSBmbGFnIHRvIG9wdCBpbiB0byB0aGUgdXBkYXRlZCBsb2dpY2FsIGlkIGNhbGN1bGF0aW9uIGZvciBMYW1iZGEgVmVyc2lvbiBjcmVhdGVkIHVzaW5nIHRoZSBgZm4uY3VycmVudFZlcnNpb25gLicsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBUaGlzIGZsYWcgY29ycmVjdCBpbmNvcnBvcmF0ZXMgTGFtYmRhIExheWVyIHByb3BlcnRpZXMgaW50byB0aGUgTGFtYmRhIEZ1bmN0aW9uIFZlcnNpb24uXG5cbiAgICAgIFNlZSAnY3VycmVudFZlcnNpb24nIHNlY3Rpb24gaW4gdGhlIGF3cy1sYW1iZGEgbW9kdWxlJ3MgUkVBRE1FIGZvciBtb3JlIGRldGFpbHMuYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjE6ICcxLjE1OS4wJywgdjI6ICcyLjI3LjAnIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtDTE9VREZST05UX0RFRkFVTFRfU0VDVVJJVFlfUE9MSUNZX1RMU19WMV8yXzIwMjFdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdFbmFibGUgdGhpcyBmZWF0dXJlIGZsYWcgdG8gaGF2ZSBjbG91ZGZyb250IGRpc3RyaWJ1dGlvbnMgdXNlIHRoZSBzZWN1cml0eSBwb2xpY3kgVExTdjEuMl8yMDIxIGJ5IGRlZmF1bHQuJyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIFRoZSBzZWN1cml0eSBwb2xpY3kgY2FuIGFsc28gYmUgY29uZmlndXJlZCBleHBsaWNpdGx5IHVzaW5nIHRoZSBcXGBtaW5pbXVtUHJvdG9jb2xWZXJzaW9uXFxgIHByb3BlcnR5LmAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYxOiAnMS4xMTcuMCcsIHYyOiAnMi4wLjAnIH0sXG4gICAgZGVmYXVsdHM6IHsgdjI6IHRydWUgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICB9LFxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgW0NIRUNLX1NFQ1JFVF9VU0FHRV06IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5WaXNpYmxlQ29udGV4dCxcbiAgICBzdW1tYXJ5OiAnRW5hYmxlIHRoaXMgZmxhZyB0byBtYWtlIGl0IGltcG9zc2libGUgdG8gYWNjaWRlbnRhbGx5IHVzZSBTZWNyZXRWYWx1ZXMgaW4gdW5zYWZlIGxvY2F0aW9ucycsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBXaXRoIHRoaXMgZmxhZyBlbmFibGVkLCBcXGBTZWNyZXRWYWx1ZVxcYCBpbnN0YW5jZXMgY2FuIG9ubHkgYmUgcGFzc2VkIHRvXG4gICAgICBjb25zdHJ1Y3RzIHRoYXQgYWNjZXB0IFxcYFNlY3JldFZhbHVlXFxgczsgb3RoZXJ3aXNlLCBcXGB1bnNhZmVVbndyYXAoKVxcYCBtdXN0IGJlXG4gICAgICBjYWxsZWQgdG8gdXNlIGl0IGFzIGEgcmVndWxhciBzdHJpbmcuYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjE6ICcxLjE1My4wJywgdjI6ICcyLjIxLjAnIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtUQVJHRVRfUEFSVElUSU9OU106IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5WaXNpYmxlQ29udGV4dCxcbiAgICBzdW1tYXJ5OiAnV2hhdCByZWdpb25zIHRvIGluY2x1ZGUgaW4gbG9va3VwIHRhYmxlcyBvZiBlbnZpcm9ubWVudCBhZ25vc3RpYyBzdGFja3MnLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgSGFzIG5vIGVmZmVjdCBvbiBzdGFja3MgdGhhdCBoYXZlIGEgZGVmaW5lZCByZWdpb24sIGJ1dCB3aWxsIGxpbWl0IHRoZSBhbW91bnRcbiAgICAgIG9mIHVubmVjZXNzYXJ5IHJlZ2lvbnMgaW5jbHVkZWQgaW4gc3RhY2tzIHdpdGhvdXQgYSBrbm93biByZWdpb24uXG5cbiAgICAgIFRoZSB0eXBlIG9mIHRoaXMgdmFsdWUgc2hvdWxkIGJlIGEgbGlzdCBvZiBzdHJpbmdzLmAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYxOiAnMS4xMzcuMCcsIHYyOiAnMi40LjAnIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogWydhd3MnLCAnYXdzLWNuJ10sXG4gIH0sXG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBbRUNTX1NFUlZJQ0VfRVhURU5TSU9OU19FTkFCTEVfREVGQVVMVF9MT0dfRFJJVkVSXToge1xuICAgIHR5cGU6IEZsYWdUeXBlLkFwaURlZmF1bHQsXG4gICAgc3VtbWFyeTogJ0VDUyBleHRlbnNpb25zIHdpbGwgYXV0b21hdGljYWxseSBhZGQgYW4gYGF3c2xvZ3NgIGRyaXZlciBpZiBubyBsb2dnaW5nIGlzIHNwZWNpZmllZCcsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBFbmFibGUgdGhpcyBmZWF0dXJlIGZsYWcgdG8gY29uZmlndXJlIGRlZmF1bHQgbG9nZ2luZyBiZWhhdmlvciBmb3IgdGhlIEVDUyBTZXJ2aWNlIEV4dGVuc2lvbnMuIFRoaXMgd2lsbCBlbmFibGUgdGhlXG4gICAgICBcXGBhd3Nsb2dzXFxgIGxvZyBkcml2ZXIgZm9yIHRoZSBhcHBsaWNhdGlvbiBjb250YWluZXIgb2YgdGhlIHNlcnZpY2UgdG8gc2VuZCB0aGUgY29udGFpbmVyIGxvZ3MgdG8gQ2xvdWRXYXRjaCBMb2dzLlxuXG4gICAgICBUaGlzIGlzIGEgZmVhdHVyZSBmbGFnIGFzIHRoZSBuZXcgYmVoYXZpb3IgcHJvdmlkZXMgYSBiZXR0ZXIgZGVmYXVsdCBleHBlcmllbmNlIGZvciB0aGUgdXNlcnMuYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjE6ICcxLjE0MC4wJywgdjI6ICcyLjguMCcgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICAgIGNvbXBhdGliaWxpdHlXaXRoT2xkQmVoYXZpb3JNZDogJ1NwZWNpZnkgYSBsb2cgZHJpdmVyIGV4cGxpY2l0bHkuJyxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtFQzJfVU5JUVVFX0lNRFNWMl9MQVVOQ0hfVEVNUExBVEVfTkFNRV06IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5CdWdGaXgsXG4gICAgc3VtbWFyeTogJ0VuYWJsZSB0aGlzIGZlYXR1cmUgZmxhZyB0byBoYXZlIExhdW5jaCBUZW1wbGF0ZXMgZ2VuZXJhdGVkIGJ5IHRoZSBgSW5zdGFuY2VSZXF1aXJlSW1kc3YyQXNwZWN0YCB1c2UgdW5pcXVlIG5hbWVzLicsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBQcmV2aW91c2x5LCB0aGUgZ2VuZXJhdGVkIExhdW5jaCBUZW1wbGF0ZSBuYW1lcyB3ZXJlIG9ubHkgdW5pcXVlIHdpdGhpbiBhIHN0YWNrIGJlY2F1c2UgdGhleSB3ZXJlIGJhc2VkIG9ubHkgb24gdGhlXG4gICAgICBcXGBJbnN0YW5jZVxcYCBjb25zdHJ1Y3QgSUQuIElmIGFub3RoZXIgc3RhY2sgdGhhdCBoYXMgYW4gXFxgSW5zdGFuY2VcXGAgd2l0aCB0aGUgc2FtZSBjb25zdHJ1Y3QgSUQgaXMgZGVwbG95ZWQgaW4gdGhlIHNhbWVcbiAgICAgIGFjY291bnQgYW5kIHJlZ2lvbiwgdGhlIGRlcGxveW1lbnRzIHdvdWxkIGFsd2F5cyBmYWlsIGFzIHRoZSBnZW5lcmF0ZWQgTGF1bmNoIFRlbXBsYXRlIG5hbWVzIHdlcmUgdGhlIHNhbWUuXG5cbiAgICAgIFRoZSBuZXcgaW1wbGVtZW50YXRpb24gYWRkcmVzc2VzIHRoaXMgaXNzdWUgYnkgZ2VuZXJhdGluZyB0aGUgTGF1bmNoIFRlbXBsYXRlIG5hbWUgd2l0aCB0aGUgXFxgTmFtZXMudW5pcXVlSWRcXGAgbWV0aG9kLmAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYxOiAnMS4xNDAuMCcsIHYyOiAnMi44LjAnIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtFQ1NfQVJOX0ZPUk1BVF9JTkNMVURFU19DTFVTVEVSX05BTUVdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdBUk4gZm9ybWF0IHVzZWQgYnkgRUNTLiBJbiB0aGUgbmV3IEFSTiBmb3JtYXQsIHRoZSBjbHVzdGVyIG5hbWUgaXMgcGFydCBvZiB0aGUgcmVzb3VyY2UgSUQuJyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIElmIHRoaXMgZmxhZyBpcyBub3Qgc2V0LCB0aGUgb2xkIEFSTiBmb3JtYXQgKHdpdGhvdXQgY2x1c3RlciBuYW1lKSBmb3IgRUNTIGlzIHVzZWQuXG4gICAgICBJZiB0aGlzIGZsYWcgaXMgc2V0LCB0aGUgbmV3IEFSTiBmb3JtYXQgKHdpdGggY2x1c3RlciBuYW1lKSBmb3IgRUNTIGlzIHVzZWQuXG5cbiAgICAgIFRoaXMgaXMgYSBmZWF0dXJlIGZsYWcgYXMgdGhlIG9sZCBmb3JtYXQgaXMgc3RpbGwgdmFsaWQgZm9yIGV4aXN0aW5nIEVDUyBjbHVzdGVycy5cblxuICAgICAgU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2Vjcy1hY2NvdW50LXNldHRpbmdzLmh0bWwjZWNzLXJlc291cmNlLWlkc1xuICAgICAgYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjI6ICcyLjM1LjAnIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtJQU1fTUlOSU1JWkVfUE9MSUNJRVNdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuVmlzaWJsZUNvbnRleHQsXG4gICAgc3VtbWFyeTogJ01pbmltaXplIElBTSBwb2xpY2llcyBieSBjb21iaW5pbmcgU3RhdGVtZW50cycsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBNaW5pbWl6ZSBJQU0gcG9saWNpZXMgYnkgY29tYmluaW5nIFByaW5jaXBhbHMsIEFjdGlvbnMgYW5kIFJlc291cmNlcyBvZiB0d29cbiAgICAgIFN0YXRlbWVudHMgaW4gdGhlIHBvbGljaWVzLCBhcyBsb25nIGFzIGl0IGRvZXNuJ3QgY2hhbmdlIHRoZSBtZWFuaW5nIG9mIHRoZVxuICAgICAgcG9saWN5LmAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYxOiAnMS4xNTAuMCcsIHYyOiAnMi4xOC4wJyB9LFxuICAgIHJlY29tbWVuZGVkVmFsdWU6IHRydWUsXG4gIH0sXG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBbVkFMSURBVEVfU05BUFNIT1RfUkVNT1ZBTF9QT0xJQ1ldOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQXBpRGVmYXVsdCxcbiAgICBzdW1tYXJ5OiAnRXJyb3Igb24gc25hcHNob3QgcmVtb3ZhbCBwb2xpY2llcyBvbiByZXNvdXJjZXMgdGhhdCBkbyBub3Qgc3VwcG9ydCBpdC4nLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgTWFrZXMgc3VyZSB3ZSBkbyBub3QgYWxsb3cgc25hcHNob3QgcmVtb3ZhbCBwb2xpY3kgb24gcmVzb3VyY2VzIHRoYXQgZG8gbm90IHN1cHBvcnQgaXQuXG4gICAgICBJZiBzdXBwbGllZCBvbiBhbiB1bnN1cHBvcnRlZCByZXNvdXJjZSwgQ2xvdWRGb3JtYXRpb24gaWdub3JlcyB0aGUgcG9saWN5IGFsdG9nZXRoZXIuXG4gICAgICBUaGlzIGZsYWcgd2lsbCByZWR1Y2UgY29uZnVzaW9uIGFuZCB1bmV4cGVjdGVkIGxvc3Mgb2YgZGF0YSB3aGVuIGVycm9uZW91c2x5IHN1cHBseWluZ1xuICAgICAgdGhlIHNuYXBzaG90IHJlbW92YWwgcG9saWN5LmAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYyOiAnMi4yOC4wJyB9LFxuICAgIHJlY29tbWVuZGVkVmFsdWU6IHRydWUsXG4gICAgY29tcGF0aWJpbGl0eVdpdGhPbGRCZWhhdmlvck1kOiAnVGhlIG9sZCBiZWhhdmlvciB3YXMgaW5jb3JyZWN0LiBVcGRhdGUgeW91ciBzb3VyY2UgdG8gbm90IHNwZWNpZnkgU05BUFNIT1QgcG9saWNpZXMgb24gcmVzb3VyY2VzIHRoYXQgZG8gbm90IHN1cHBvcnQgaXQuJyxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtDT0RFUElQRUxJTkVfQ1JPU1NfQUNDT1VOVF9LRVlfQUxJQVNfU1RBQ0tfU0FGRV9SRVNPVVJDRV9OQU1FXToge1xuICAgIHR5cGU6IEZsYWdUeXBlLkJ1Z0ZpeCxcbiAgICBzdW1tYXJ5OiAnR2VuZXJhdGUga2V5IGFsaWFzZXMgdGhhdCBpbmNsdWRlIHRoZSBzdGFjayBuYW1lJyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIEVuYWJsZSB0aGlzIGZlYXR1cmUgZmxhZyB0byBoYXZlIENvZGVQaXBlbGluZSBnZW5lcmF0ZSBhIHVuaXF1ZSBjcm9zcyBhY2NvdW50IGtleSBhbGlhcyBuYW1lIHVzaW5nIHRoZSBzdGFjayBuYW1lLlxuXG4gICAgICBQcmV2aW91c2x5LCB3aGVuIGNyZWF0aW5nIG11bHRpcGxlIHBpcGVsaW5lcyB3aXRoIHNpbWlsYXIgbmFtaW5nIGNvbnZlbnRpb25zIGFuZCB3aGVuIGNyb3NzQWNjb3VudEtleXMgaXMgdHJ1ZSxcbiAgICAgIHRoZSBLTVMga2V5IGFsaWFzIG5hbWUgY3JlYXRlZCBmb3IgdGhlc2UgcGlwZWxpbmVzIG1heSBiZSB0aGUgc2FtZSBkdWUgdG8gaG93IHRoZSB1bmlxdWVJZCBpcyBnZW5lcmF0ZWQuXG5cbiAgICAgIFRoaXMgbmV3IGltcGxlbWVudGF0aW9uIGNyZWF0ZXMgYSBzdGFjayBzYWZlIHJlc291cmNlIG5hbWUgZm9yIHRoZSBhbGlhcyB1c2luZyB0aGUgc3RhY2sgbmFtZSBpbnN0ZWFkIG9mIHRoZSBzdGFjayBJRC5cbiAgICAgIGAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYyOiAnMi4yOS4wJyB9LFxuICAgIHJlY29tbWVuZGVkVmFsdWU6IHRydWUsXG4gIH0sXG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBbUzNfQ1JFQVRFX0RFRkFVTFRfTE9HR0lOR19QT0xJQ1ldOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdFbmFibGUgdGhpcyBmZWF0dXJlIGZsYWcgdG8gY3JlYXRlIGFuIFMzIGJ1Y2tldCBwb2xpY3kgYnkgZGVmYXVsdCBpbiBjYXNlcyB3aGVyZSBhbiBBV1Mgc2VydmljZSB3b3VsZCBhdXRvbWF0aWNhbGx5IGNyZWF0ZSB0aGUgUG9saWN5IGlmIG9uZSBkb2VzIG5vdCBleGlzdC4nLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgRm9yIGV4YW1wbGUsIGluIG9yZGVyIHRvIHNlbmQgVlBDIGZsb3cgbG9ncyB0byBhbiBTMyBidWNrZXQsIHRoZXJlIGlzIGEgc3BlY2lmaWMgQnVja2V0IFBvbGljeVxuICAgICAgdGhhdCBuZWVkcyB0byBiZSBhdHRhY2hlZCB0byB0aGUgYnVja2V0LiBJZiB5b3UgY3JlYXRlIHRoZSBidWNrZXQgd2l0aG91dCBhIHBvbGljeSBhbmQgdGhlbiBhZGQgdGhlXG4gICAgICBidWNrZXQgYXMgdGhlIGZsb3cgbG9nIGRlc3RpbmF0aW9uLCB0aGUgc2VydmljZSB3aWxsIGF1dG9tYXRpY2FsbHkgY3JlYXRlIHRoZSBidWNrZXQgcG9saWN5IHdpdGggdGhlXG4gICAgICBuZWNlc3NhcnkgcGVybWlzc2lvbnMuIElmIHlvdSB3ZXJlIHRvIHRoZW4gdHJ5IGFuZCBhZGQgeW91ciBvd24gYnVja2V0IHBvbGljeSBDbG91ZEZvcm1hdGlvbiB3aWxsIHRocm93XG4gICAgICBhbmQgZXJyb3IgaW5kaWNhdGluZyB0aGF0IGEgYnVja2V0IHBvbGljeSBhbHJlYWR5IGV4aXN0cy5cblxuICAgICAgSW4gY2FzZXMgd2hlcmUgd2Uga25vdyB3aGF0IHRoZSByZXF1aXJlZCBwb2xpY3kgaXMgd2UgY2FuIGdvIGFoZWFkIGFuZCBjcmVhdGUgdGhlIHBvbGljeSBzbyB3ZSBjYW5cbiAgICAgIHJlbWFpbiBpbiBjb250cm9sIG9mIGl0LlxuXG4gICAgICBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9sb2dzL0FXUy1sb2dzLWFuZC1yZXNvdXJjZS1wb2xpY3kuaHRtbCNBV1MtbG9ncy1pbmZyYXN0cnVjdHVyZS1TM1xuICAgICAgYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjI6ICcyLjMxLjAnIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtTTlNfU1VCU0NSSVBUSU9OU19TUVNfREVDUllQVElPTl9QT0xJQ1ldOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdSZXN0cmljdCBLTVMga2V5IHBvbGljeSBmb3IgZW5jcnlwdGVkIFF1ZXVlcyBhIGJpdCBtb3JlJyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIEVuYWJsZSB0aGlzIGZlYXR1cmUgZmxhZyB0byByZXN0cmljdCB0aGUgZGVjcnlwdGlvbiBvZiBhIFNRUyBxdWV1ZSwgd2hpY2ggaXMgc3Vic2NyaWJlZCB0byBhIFNOUyB0b3BpYywgdG9cbiAgICAgIG9ubHkgdGhlIHRvcGljIHdoaWNoIGl0IGlzIHN1YnNjcmliZWQgdG8gYW5kIG5vdCB0aGUgd2hvbGUgU05TIHNlcnZpY2Ugb2YgYW4gYWNjb3VudC5cblxuICAgICAgUHJldmlvdXNseSB0aGUgZGVjcnlwdGlvbiB3YXMgb25seSByZXN0cmljdGVkIHRvIHRoZSBTTlMgc2VydmljZSBwcmluY2lwYWwuIFRvIG1ha2UgdGhlIFNRUyBzdWJzY3JpcHRpb24gbW9yZVxuICAgICAgc2VjdXJlLCBpdCBpcyBhIGdvb2QgcHJhY3RpY2UgdG8gcmVzdHJpY3QgdGhlIGRlY3J5cHRpb24gZnVydGhlciBhbmQgb25seSBhbGxvdyB0aGUgY29ubmVjdGVkIFNOUyB0b3BpYyB0byBkZWNyeXB0aW9uXG4gICAgICB0aGUgc3Vic2NyaWJlZCBxdWV1ZS5gLFxuICAgIGludHJvZHVjZWRJbjogeyB2MjogJzIuMzIuMCcgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICB9LFxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgW0FQSUdBVEVXQVlfRElTQUJMRV9DTE9VRFdBVENIX1JPTEVdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdNYWtlIGRlZmF1bHQgQ2xvdWRXYXRjaCBSb2xlIGJlaGF2aW9yIHNhZmUgZm9yIG11bHRpcGxlIEFQSSBHYXRld2F5cyBpbiBvbmUgZW52aXJvbm1lbnQnLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgRW5hYmxlIHRoaXMgZmVhdHVyZSBmbGFnIHRvIGNoYW5nZSB0aGUgZGVmYXVsdCBiZWhhdmlvciBmb3IgYXdzLWFwaWdhdGV3YXkuUmVzdEFwaSBhbmQgYXdzLWFwaWdhdGV3YXkuU3BlY1Jlc3RBcGlcbiAgICAgIHRvIF9ub3RfIGNyZWF0ZSBhIENsb3VkV2F0Y2ggcm9sZSBhbmQgQWNjb3VudC4gVGhlcmUgaXMgb25seSBhIHNpbmdsZSBBcGlHYXRld2F5IGFjY291bnQgcGVyIEFXU1xuICAgICAgZW52aXJvbm1lbnQgd2hpY2ggbWVhbnMgdGhhdCBlYWNoIHRpbWUgeW91IGNyZWF0ZSBhIFJlc3RBcGkgaW4geW91ciBhY2NvdW50IHRoZSBBcGlHYXRld2F5IGFjY291bnRcbiAgICAgIGlzIG92ZXJ3cml0dGVuLiBJZiBhdCBzb21lIHBvaW50IHRoZSBuZXdlc3QgUmVzdEFwaSBpcyBkZWxldGVkLCB0aGUgQXBpR2F0ZXdheSBBY2NvdW50IGFuZCBDbG91ZFdhdGNoXG4gICAgICByb2xlIHdpbGwgYWxzbyBiZSBkZWxldGVkLCBicmVha2luZyBhbnkgZXhpc3RpbmcgQXBpR2F0ZXdheXMgdGhhdCB3ZXJlIGRlcGVuZGluZyBvbiB0aGVtLlxuXG4gICAgICBXaGVuIHRoaXMgZmxhZyBpcyBlbmFibGVkIHlvdSBzaG91bGQgZWl0aGVyIGNyZWF0ZSB0aGUgQXBpR2F0ZXdheSBhY2NvdW50IGFuZCBDbG91ZFdhdGNoIHJvbGVcbiAgICAgIHNlcGFyYXRlbHkgX29yXyBvbmx5IGVuYWJsZSB0aGUgY2xvdWRXYXRjaFJvbGUgb24gYSBzaW5nbGUgUmVzdEFwaS5cbiAgICAgIGAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYyOiAnMi4zOC4wJyB9LFxuICAgIHJlY29tbWVuZGVkVmFsdWU6IHRydWUsXG4gIH0sXG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBbRU5BQkxFX1BBUlRJVElPTl9MSVRFUkFMU106IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5CdWdGaXgsXG4gICAgc3VtbWFyeTogJ01ha2UgQVJOcyBjb25jcmV0ZSBpZiBBV1MgcGFydGl0aW9uIGlzIGtub3duJyxcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGF3cy1jZGsvbm8tbGl0ZXJhbC1wYXJ0aXRpb25cbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIEVuYWJsZSB0aGlzIGZlYXR1cmUgZmxhZyB0byBnZXQgcGFydGl0aW9uIG5hbWVzIGFzIHN0cmluZyBsaXRlcmFscyBpbiBTdGFja3Mgd2l0aCBrbm93biByZWdpb25zIGRlZmluZWQgaW5cbiAgICAgIHRoZWlyIGVudmlyb25tZW50LCBzdWNoIGFzIFwiYXdzXCIgb3IgXCJhd3MtY25cIi4gIFByZXZpb3VzbHkgdGhlIENsb3VkRm9ybWF0aW9uIGludHJpbnNpYyBmdW5jdGlvblxuICAgICAgXCJSZWY6IEFXUzo6UGFydGl0aW9uXCIgd2FzIHVzZWQuICBGb3IgZXhhbXBsZTpcblxuICAgICAgXFxgXFxgXFxgeWFtbFxuICAgICAgUHJpbmNpcGFsOlxuICAgICAgICBBV1M6XG4gICAgICAgICAgRm46OkpvaW46XG4gICAgICAgICAgICAtIFwiXCJcbiAgICAgICAgICAgIC0gLSBcImFybjpcIlxuICAgICAgICAgICAgICAtIFJlZjogQVdTOjpQYXJ0aXRpb25cbiAgICAgICAgICAgICAgLSA6aWFtOjoxMjM0NTY3ODk4NzY6cm9vdFxuICAgICAgXFxgXFxgXFxgXG5cbiAgICAgIGJlY29tZXM6XG5cbiAgICAgIFxcYFxcYFxcYHlhbWxcbiAgICAgIFByaW5jaXBhbDpcbiAgICAgICAgQVdTOiBcImFybjphd3M6aWFtOjoxMjM0NTY3ODk4NzY6cm9vdFwiXG4gICAgICBcXGBcXGBcXGBcblxuICAgICAgVGhlIGludHJpbnNpYyBmdW5jdGlvbiB3aWxsIHN0aWxsIGJlIHVzZWQgaW4gU3RhY2tzIHdoZXJlIG5vIHJlZ2lvbiBpcyBkZWZpbmVkIG9yIHRoZSByZWdpb24ncyBwYXJ0aXRpb25cbiAgICAgIGlzIHVua25vd24uXG4gICAgICBgLFxuICAgIGludHJvZHVjZWRJbjogeyB2MjogJzIuMzguMCcgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICB9LFxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgW0VWRU5UU19UQVJHRVRfUVVFVUVfU0FNRV9BQ0NPVU5UXToge1xuICAgIHR5cGU6IEZsYWdUeXBlLkJ1Z0ZpeCxcbiAgICBzdW1tYXJ5OiAnRXZlbnQgUnVsZXMgbWF5IG9ubHkgcHVzaCB0byBlbmNyeXB0ZWQgU1FTIHF1ZXVlcyBpbiB0aGUgc2FtZSBhY2NvdW50JyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIFRoaXMgZmxhZyBhcHBsaWVzIHRvIFNRUyBRdWV1ZXMgdGhhdCBhcmUgdXNlZCBhcyB0aGUgdGFyZ2V0IG9mIGV2ZW50IFJ1bGVzLiBXaGVuIGVuYWJsZWQsIG9ubHkgcHJpbmNpcGFsc1xuICAgICAgZnJvbSB0aGUgc2FtZSBhY2NvdW50IGFzIHRoZSBSdWxlIGNhbiBzZW5kIG1lc3NhZ2VzLiBJZiBhIHF1ZXVlIGlzIHVuZW5jcnlwdGVkLCB0aGlzIHJlc3RyaWN0aW9uIHdpbGxcbiAgICAgIGFsd2F5cyBhcHBseSwgcmVnYXJkbGVzcyBvZiB0aGUgdmFsdWUgb2YgdGhpcyBmbGFnLlxuICAgICAgYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjI6ICcyLjUxLjAnIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtJQU1fU1RBTkRBUkRJWkVEX1NFUlZJQ0VfUFJJTkNJUEFMU106IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5CdWdGaXgsXG4gICAgc3VtbWFyeTogJ1VzZSBzdGFuZGFyZGl6ZWQgKGdsb2JhbCkgc2VydmljZSBwcmluY2lwYWxzIGV2ZXJ5d2hlcmUnLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgV2UgdXNlZCB0byBtYWludGFpbiBhIGRhdGFiYXNlIG9mIGV4Y2VwdGlvbnMgdG8gU2VydmljZSBQcmluY2lwYWwgbmFtZXMgaW4gdmFyaW91cyByZWdpb25zLiBUaGlzIGRhdGFiYXNlXG4gICAgICBpcyBubyBsb25nZXIgbmVjZXNzYXJ5OiBhbGwgc2VydmljZSBwcmluY2lwYWxzIG5hbWVzIGhhdmUgYmVlbiBzdGFuZGFyZGl6ZWQgdG8gdGhlaXIgZ2xvYmFsIGZvcm0gKFxcYFNFUlZJQ0UuYW1hem9uYXdzLmNvbVxcYCkuXG5cbiAgICAgIFRoaXMgZmxhZyBkaXNhYmxlcyB1c2Ugb2YgdGhhdCBleGNlcHRpb25zIGRhdGFiYXNlIGFuZCBhbHdheXMgdXNlcyB0aGUgZ2xvYmFsIHNlcnZpY2UgcHJpbmNpcGFsLlxuICAgICAgYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjI6ICcyLjUxLjAnIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtFQ1NfRElTQUJMRV9FWFBMSUNJVF9ERVBMT1lNRU5UX0NPTlRST0xMRVJfRk9SX0NJUkNVSVRfQlJFQUtFUl06IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5CdWdGaXgsXG4gICAgc3VtbWFyeTogJ0F2b2lkIHNldHRpbmcgdGhlIFwiRUNTXCIgZGVwbG95bWVudCBjb250cm9sbGVyIHdoZW4gYWRkaW5nIGEgY2lyY3VpdCBicmVha2VyJyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIEVuYWJsZSB0aGlzIGZlYXR1cmUgZmxhZyB0byBhdm9pZCBzZXR0aW5nIHRoZSBcIkVDU1wiIGRlcGxveW1lbnQgY29udHJvbGxlciB3aGVuIGFkZGluZyBhIGNpcmN1aXQgYnJlYWtlciB0byBhblxuICAgICAgRUNTIFNlcnZpY2UsIGFzIHRoaXMgd2lsbCB0cmlnZ2VyIGEgZnVsbCByZXBsYWNlbWVudCB3aGljaCBmYWlscyB0byBkZXBsb3kgd2hlbiB1c2luZyBzZXQgc2VydmljZSBuYW1lcy5cbiAgICAgIFRoaXMgZG9lcyBub3QgY2hhbmdlIGFueSBiZWhhdmlvdXIgYXMgdGhlIGRlZmF1bHQgZGVwbG95bWVudCBjb250cm9sbGVyIHdoZW4gaXQgaXMgbm90IGRlZmluZWQgaXMgRUNTLlxuXG4gICAgICBUaGlzIGlzIGEgZmVhdHVyZSBmbGFnIGFzIHRoZSBuZXcgYmVoYXZpb3IgcHJvdmlkZXMgYSBiZXR0ZXIgZGVmYXVsdCBleHBlcmllbmNlIGZvciB0aGUgdXNlcnMuXG4gICAgICBgLFxuICAgIGludHJvZHVjZWRJbjogeyB2MjogJzIuNTEuMCcgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICB9LFxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgW0lBTV9JTVBPUlRFRF9ST0xFX1NUQUNLX1NBRkVfREVGQVVMVF9QT0xJQ1lfTkFNRV06IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5CdWdGaXgsXG4gICAgc3VtbWFyeTogJ0VuYWJsZSB0aGlzIGZlYXR1cmUgdG8gYnkgZGVmYXVsdCBjcmVhdGUgZGVmYXVsdCBwb2xpY3kgbmFtZXMgZm9yIGltcG9ydGVkIHJvbGVzIHRoYXQgZGVwZW5kIG9uIHRoZSBzdGFjayB0aGUgcm9sZSBpcyBpbi4nLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgV2l0aG91dCB0aGlzLCBpbXBvcnRpbmcgdGhlIHNhbWUgcm9sZSBpbiBtdWx0aXBsZSBwbGFjZXMgY291bGQgbGVhZCB0byB0aGUgcGVybWlzc2lvbnMgZ2l2ZW4gZm9yIG9uZSB2ZXJzaW9uIG9mIHRoZSBpbXBvcnRlZCByb2xlXG4gICAgICB0byBvdmVyd3JpdGUgcGVybWlzc2lvbnMgZ2l2ZW4gdG8gdGhlIHJvbGUgYXQgYSBkaWZmZXJlbnQgcGxhY2Ugd2hlcmUgaXQgd2FzIGltcG9ydGVkLiBUaGlzIHdhcyBkdWUgdG8gYWxsIGltcG9ydGVkIGluc3RhbmNlc1xuICAgICAgb2YgYSByb2xlIHVzaW5nIHRoZSBzYW1lIGRlZmF1bHQgcG9saWN5IG5hbWUuXG5cbiAgICAgIFRoaXMgbmV3IGltcGxlbWVudGF0aW9uIGNyZWF0ZXMgZGVmYXVsdCBwb2xpY3kgbmFtZXMgYmFzZWQgb24gdGhlIGNvbnN0cnVjdHMgbm9kZSBwYXRoIGluIHRoZWlyIHN0YWNrLlxuICAgICAgYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjI6ICcyLjYwLjAnIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtTM19TRVJWRVJfQUNDRVNTX0xPR1NfVVNFX0JVQ0tFVF9QT0xJQ1ldOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdVc2UgUzMgQnVja2V0IFBvbGljeSBpbnN0ZWFkIG9mIEFDTHMgZm9yIFNlcnZlciBBY2Nlc3MgTG9nZ2luZycsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBFbmFibGUgdGhpcyBmZWF0dXJlIGZsYWcgdG8gdXNlIFMzIEJ1Y2tldCBQb2xpY3kgZm9yIGdyYW50aW5nIHBlcm1pc3Npb24gZm8gU2VydmVyIEFjY2VzcyBMb2dnaW5nXG4gICAgICByYXRoZXIgdGhhbiB1c2luZyB0aGUgY2FubmVkIFxcYExvZ0RlbGl2ZXJ5V3JpdGVcXGAgQUNMLiBBQ0xzIGRvIG5vdCB3b3JrIHdoZW4gT2JqZWN0IE93bmVyc2hpcCBpc1xuICAgICAgZW5hYmxlZCBvbiB0aGUgYnVja2V0LlxuXG4gICAgICBUaGlzIGZsYWcgdXNlcyBhIEJ1Y2tldCBQb2xpY3kgc3RhdGVtZW50IHRvIGFsbG93IFNlcnZlciBBY2Nlc3MgTG9nIGRlbGl2ZXJ5LCBmb2xsb3dpbmcgYmVzdFxuICAgICAgcHJhY3RpY2VzIGZvciBTMy5cblxuICAgICAgQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uUzMvbGF0ZXN0L3VzZXJndWlkZS9lbmFibGUtc2VydmVyLWFjY2Vzcy1sb2dnaW5nLmh0bWxcbiAgICBgLFxuICAgIGludHJvZHVjZWRJbjogeyB2MjogJzIuNjAuMCcgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICB9LFxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgW1JPVVRFNTNfUEFUVEVSTlNfVVNFX0NFUlRJRklDQVRFXToge1xuICAgIHR5cGU6IEZsYWdUeXBlLkFwaURlZmF1bHQsXG4gICAgc3VtbWFyeTogJ1VzZSB0aGUgb2ZmaWNpYWwgYENlcnRpZmljYXRlYCByZXNvdXJjZSBpbnN0ZWFkIG9mIGBEbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZWAnLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgRW5hYmxlIHRoaXMgZmVhdHVyZSBmbGFnIHRvIHVzZSB0aGUgb2ZmaWNpYWwgQ2xvdWRGb3JtYXRpb24gc3VwcG9ydGVkIFxcYENlcnRpZmljYXRlXFxgIHJlc291cmNlIGluc3RlYWRcbiAgICAgIG9mIHRoZSBkZXByZWNhdGVkIFxcYERuc1ZhbGlkYXRlZENlcnRpZmljYXRlXFxgIGNvbnN0cnVjdC4gSWYgdGhpcyBmbGFnIGlzIGVuYWJsZWQgYW5kIHlvdSBhcmUgY3JlYXRpbmdcbiAgICAgIHRoZSBzdGFjayBpbiBhIHJlZ2lvbiBvdGhlciB0aGFuIHVzLWVhc3QtMSB0aGVuIHlvdSBtdXN0IGFsc28gc2V0IFxcYGNyb3NzUmVnaW9uUmVmZXJlbmNlcz10cnVlXFxgIG9uIHRoZVxuICAgICAgc3RhY2suXG4gICAgICBgLFxuICAgIGludHJvZHVjZWRJbjogeyB2MjogJzIuNjEuMCcgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICAgIGNvbXBhdGliaWxpdHlXaXRoT2xkQmVoYXZpb3JNZDogJ0RlZmluZSBhIGBEbnNWYWxpZGF0ZWRDZXJ0aWZpY2F0ZWAgZXhwbGljaXRseSBhbmQgcGFzcyBpbiB0aGUgYGNlcnRpZmljYXRlYCBwcm9wZXJ0eScsXG4gIH0sXG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBbQVdTX0NVU1RPTV9SRVNPVVJDRV9MQVRFU1RfU0RLX0RFRkFVTFRdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQXBpRGVmYXVsdCxcbiAgICBzdW1tYXJ5OiAnV2hldGhlciB0byBpbnN0YWxsIHRoZSBsYXRlc3QgU0RLIGJ5IGRlZmF1bHQgaW4gQXdzQ3VzdG9tUmVzb3VyY2UnLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgVGhpcyB3YXMgb3JpZ2luYWxseSBpbnRyb2R1Y2VkIGFuZCBlbmFibGVkIGJ5IGRlZmF1bHQgdG8gbm90IGJlIGxpbWl0ZWQgYnkgdGhlIFNESyB2ZXJzaW9uXG4gICAgICB0aGF0J3MgaW5zdGFsbGVkIG9uIEFXUyBMYW1iZGEuIEhvd2V2ZXIsIGl0IGNyZWF0ZXMgaXNzdWVzIGZvciBMYW1iZGFzIGJvdW5kIHRvIFZQQ3MgdGhhdFxuICAgICAgZG8gbm90IGhhdmUgaW50ZXJuZXQgYWNjZXNzLCBvciBpbiBlbnZpcm9ubWVudHMgd2hlcmUgJ25wbWpzLmNvbScgaXMgbm90IGF2YWlsYWJsZS5cblxuICAgICAgVGhlIHJlY29tbWVuZGVkIHNldHRpbmcgaXMgdG8gZGlzYWJsZSB0aGUgZGVmYXVsdCBpbnN0YWxsYXRpb24gYmVoYXZpb3IsIGFuZCBwYXNzIHRoZVxuICAgICAgZmxhZyBvbiBhIHJlc291cmNlLWJ5LXJlc291cmNlIGJhc2lzIHRvIGVuYWJsZSBpdCBpZiBuZWNlc3NhcnkuXG4gICAgYCxcbiAgICBjb21wYXRpYmlsaXR5V2l0aE9sZEJlaGF2aW9yTWQ6ICdTZXQgaW5zdGFsbExhdGVzdEF3c1NkazogdHJ1ZSBvbiBhbGwgcmVzb3VyY2VzIHRoYXQgbmVlZCBpdC4nLFxuICAgIGludHJvZHVjZWRJbjogeyB2MjogJzIuNjAuMCcgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiBmYWxzZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtEQVRBQkFTRV9QUk9YWV9VTklRVUVfUkVTT1VSQ0VfTkFNRV06IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5CdWdGaXgsXG4gICAgc3VtbWFyeTogJ1VzZSB1bmlxdWUgcmVzb3VyY2UgbmFtZSBmb3IgRGF0YWJhc2UgUHJveHknLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgSWYgdGhpcyBmbGFnIGlzIG5vdCBzZXQsIHRoZSBkZWZhdWx0IGJlaGF2aW9yIGZvciBcXGBEYXRhYmFzZVByb3h5XFxgIGlzXG4gICAgICB0byB1c2UgXFxgaWRcXGAgb2YgdGhlIGNvbnN0cnVjdG9yIGZvciBcXGBkYlByb3h5TmFtZVxcYCB3aGVuIGl0J3Mgbm90IHNwZWNpZmllZCBpbiB0aGUgYXJndW1lbnQuXG4gICAgICBJbiB0aGlzIGNhc2UsIHVzZXJzIGNhbid0IGRlcGxveSBcXGBEYXRhYmFzZVByb3h5XFxgcyB0aGF0IGhhdmUgdGhlIHNhbWUgXFxgaWRcXGAgaW4gdGhlIHNhbWUgcmVnaW9uLlxuXG4gICAgICBJZiB0aGlzIGZsYWcgaXMgc2V0LCB0aGUgZGVmYXVsdCBiZWhhdmlvciBpcyB0byB1c2UgdW5pcXVlIHJlc291cmNlIG5hbWVzIGZvciBlYWNoIFxcYERhdGFiYXNlUHJveHlcXGAuXG5cbiAgICAgIFRoaXMgaXMgYSBmZWF0dXJlIGZsYWcgYXMgdGhlIG9sZCBiZWhhdmlvciB3YXMgdGVjaG5pY2FsbHkgaW5jb3JyZWN0LCBidXQgdXNlcnMgbWF5IGhhdmUgY29tZSB0byBkZXBlbmQgb24gaXQuXG4gICAgYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjI6ICcyLjY1LjAnIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtDT0RFREVQTE9ZX1JFTU9WRV9BTEFSTVNfRlJPTV9ERVBMT1lNRU5UX0dST1VQXToge1xuICAgIHR5cGU6IEZsYWdUeXBlLkJ1Z0ZpeCxcbiAgICBzdW1tYXJ5OiAnUmVtb3ZlIENsb3VkV2F0Y2ggYWxhcm1zIGZyb20gZGVwbG95bWVudCBncm91cCcsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBFbmFibGUgdGhpcyBmbGFnIHRvIGJlIGFibGUgdG8gcmVtb3ZlIGFsbCBDbG91ZFdhdGNoIGFsYXJtcyBmcm9tIGEgZGVwbG95bWVudCBncm91cCBieSByZW1vdmluZ1xuICAgICAgdGhlIGFsYXJtcyBmcm9tIHRoZSBjb25zdHJ1Y3QuIElmIHRoaXMgZmxhZyBpcyBub3Qgc2V0LCByZW1vdmluZyBhbGwgYWxhcm1zIGZyb20gdGhlIGNvbnN0cnVjdFxuICAgICAgd2lsbCBzdGlsbCBsZWF2ZSB0aGUgYWxhcm1zIGNvbmZpZ3VyZWQgZm9yIHRoZSBkZXBsb3ltZW50IGdyb3VwLlxuICAgIGAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYyOiAnMi42NS4wJyB9LFxuICAgIHJlY29tbWVuZGVkVmFsdWU6IHRydWUsXG4gIH0sXG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBbQVBJR0FURVdBWV9BVVRIT1JJWkVSX0NIQU5HRV9ERVBMT1lNRU5UX0xPR0lDQUxfSURdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdJbmNsdWRlIGF1dGhvcml6ZXIgY29uZmlndXJhdGlvbiBpbiB0aGUgY2FsY3VsYXRpb24gb2YgdGhlIEFQSSBkZXBsb3ltZW50IGxvZ2ljYWwgSUQuJyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIFRoZSBsb2dpY2FsIElEIG9mIHRoZSBBV1M6OkFwaUdhdGV3YXk6OkRlcGxveW1lbnQgcmVzb3VyY2UgaXMgY2FsY3VsYXRlZCBieSBoYXNoaW5nXG4gICAgICB0aGUgQVBJIGNvbmZpZ3VyYXRpb24sIGluY2x1ZGluZyBtZXRob2RzLCBhbmQgcmVzb3VyY2VzLCBldGMuIEVuYWJsZSB0aGlzIGZlYXR1cmUgZmxhZ1xuICAgICAgdG8gYWxzbyBpbmNsdWRlIHRoZSBjb25maWd1cmF0aW9uIG9mIGFueSBhdXRob3JpemVyIGF0dGFjaGVkIHRvIHRoZSBBUEkgaW4gdGhlXG4gICAgICBjYWxjdWxhdGlvbiwgc28gYW55IGNoYW5nZXMgbWFkZSB0byBhbiBhdXRob3JpemVyIHdpbGwgY3JlYXRlIGEgbmV3IGRlcGxveW1lbnQuXG4gICAgICBgLFxuICAgIGludHJvZHVjZWRJbjogeyB2MjogJzIuNjYuMCcgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICB9LFxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgW0VDMl9MQVVOQ0hfVEVNUExBVEVfREVGQVVMVF9VU0VSX0RBVEFdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdEZWZpbmUgdXNlciBkYXRhIGZvciBhIGxhdW5jaCB0ZW1wbGF0ZSBieSBkZWZhdWx0IHdoZW4gYSBtYWNoaW5lIGltYWdlIGlzIHByb3ZpZGVkLicsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBUaGUgZWMyLkxhdW5jaFRlbXBsYXRlIGNvbnN0cnVjdCBkaWQgbm90IGRlZmluZSB1c2VyIGRhdGEgd2hlbiBhIG1hY2hpbmUgaW1hZ2UgaXNcbiAgICAgIHByb3ZpZGVkIGRlc3BpdGUgdGhlIGRvY3VtZW50LiBJZiB0aGlzIGlzIHNldCwgYSB1c2VyIGRhdGEgaXMgYXV0b21hdGljYWxseSBkZWZpbmVkXG4gICAgICBhY2NvcmRpbmcgdG8gdGhlIE9TIG9mIHRoZSBtYWNoaW5lIGltYWdlLlxuICAgICAgYCxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICAgIGludHJvZHVjZWRJbjogeyB2MjogJzIuNjcuMCcgfSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtTRUNSRVRTX01BTkFHRVJfVEFSR0VUX0FUVEFDSE1FTlRfUkVTT1VSQ0VfUE9MSUNZXToge1xuICAgIHR5cGU6IEZsYWdUeXBlLkJ1Z0ZpeCxcbiAgICBzdW1tYXJ5OiAnU2VjcmV0VGFyZ2V0QXR0YWNobWVudHMgdXNlcyB0aGUgUmVzb3VyY2VQb2xpY3kgb2YgdGhlIGF0dGFjaGVkIFNlY3JldC4nLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgRW5hYmxlIHRoaXMgZmVhdHVyZSBmbGFnIHRvIG1ha2UgU2VjcmV0VGFyZ2V0QXR0YWNobWVudHMgdXNlIHRoZSBSZXNvdXJjZVBvbGljeSBvZiB0aGUgYXR0YWNoZWQgU2VjcmV0LlxuICAgICAgU2VjcmV0VGFyZ2V0QXR0YWNobWVudHMgYXJlIGNyZWF0ZWQgdG8gY29ubmVjdCBhIFNlY3JldCB0byBhIHRhcmdldCByZXNvdXJjZS5cbiAgICAgIEluIENESyBjb2RlLCB0aGV5IGJlaGF2ZSBsaWtlIHJlZ3VsYXIgU2VjcmV0IGFuZCBjYW4gYmUgdXNlZCBhcyBhIHN0YW5kLWluIGluIG1vc3Qgc2l0dWF0aW9ucy5cbiAgICAgIFByZXZpb3VzbHksIGFkZGluZyB0byB0aGUgUmVzb3VyY2VQb2xpY3kgb2YgYSBTZWNyZXRUYXJnZXRBdHRhY2htZW50IGRpZCBhdHRlbXB0IHRvIGNyZWF0ZSBhIHNlcGFyYXRlIFJlc291cmNlUG9saWN5IGZvciB0aGUgc2FtZSBTZWNyZXQuXG4gICAgICBIb3dldmVyIFNlY3JldHMgY2FuIG9ubHkgaGF2ZSBhIHNpbmdsZSBSZXNvdXJjZVBvbGljeSwgY2F1c2luZyB0aGUgQ2xvdWRGb3JtYXRpb24gZGVwbG95bWVudCB0byBmYWlsLlxuXG4gICAgICBXaGVuIGVuYWJsaW5nIHRoaXMgZmVhdHVyZSBmbGFnIGZvciBhbiBleGlzdGluZyBTdGFjaywgUmVzb3VyY2VQb2xpY2llcyBjcmVhdGVkIHZpYSBhIFNlY3JldFRhcmdldEF0dGFjaG1lbnQgd2lsbCBuZWVkIHJlcGxhY2VtZW50LlxuICAgICAgVGhpcyB3b24ndCBiZSBwb3NzaWJsZSB3aXRob3V0IGludGVydmVudGlvbiBkdWUgdG8gbGltaXRhdGlvbiBvdXRsaW5lZCBhYm92ZS5cbiAgICAgIEZpcnN0IHJlbW92ZSBhbGwgcGVybWlzc2lvbnMgZ3JhbnRlZCB0byB0aGUgU2VjcmV0IGFuZCBkZXBsb3kgd2l0aG91dCB0aGUgUmVzb3VyY2VQb2xpY2llcy5cbiAgICAgIFRoZW4geW91IGNhbiByZS1hZGQgdGhlIHBlcm1pc3Npb25zIGFuZCBkZXBsb3kgYWdhaW4uXG4gICAgICBgLFxuICAgIHJlY29tbWVuZGVkVmFsdWU6IHRydWUsXG4gICAgaW50cm9kdWNlZEluOiB7IHYyOiAnMi42Ny4wJyB9LFxuICB9LFxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgW1JFRFNISUZUX0NPTFVNTl9JRF06IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5CdWdGaXgsXG4gICAgc3VtbWFyeTogJ1doZXRoZXIgdG8gdXNlIGFuIElEIHRvIHRyYWNrIFJlZHNoaWZ0IGNvbHVtbiBjaGFuZ2VzJyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIFJlZHNoaWZ0IGNvbHVtbnMgYXJlIGlkZW50aWZpZWQgYnkgdGhlaXIgXFxgbmFtZVxcYC4gSWYgYSBjb2x1bW4gaXMgcmVuYW1lZCwgdGhlIG9sZCBjb2x1bW5cbiAgICAgIHdpbGwgYmUgZHJvcHBlZCBhbmQgYSBuZXcgY29sdW1uIHdpbGwgYmUgY3JlYXRlZC4gVGhpcyBjYW4gY2F1c2UgZGF0YSBsb3NzLlxuXG4gICAgICBUaGlzIGZsYWcgZW5hYmxlcyB0aGUgdXNlIG9mIGFuIFxcYGlkXFxgIGF0dHJpYnV0ZSBmb3IgUmVkc2hpZnQgY29sdW1ucy4gSWYgdGhpcyBmbGFnIGlzIGVuYWJsZWQsIHRoZVxuICAgICAgaW50ZXJuYWwgQ0RLIGFyY2hpdGVjdHVyZSB3aWxsIHRyYWNrIGNoYW5nZXMgb2YgUmVkc2hpZnQgY29sdW1ucyB0aHJvdWdoIHRoZWlyIFxcYGlkXFxgLCByYXRoZXJcbiAgICAgIHRoYW4gdGhlaXIgXFxgbmFtZVxcYC4gVGhpcyB3aWxsIHByZXZlbnQgZGF0YSBsb3NzIHdoZW4gY29sdW1ucyBhcmUgcmVuYW1lZC5cblxuICAgICAgKipOT1RFKiogLSBFbmFibGluZyB0aGlzIGZsYWcgY29tZXMgYXQgYSAqKnJpc2sqKi4gV2hlbiBlbmFibGVkLCB1cGRhdGUgdGhlIFxcYGlkXFxgcyBvZiBhbGwgY29sdW1ucyxcbiAgICAgICoqaG93ZXZlcioqIGRvIG5vdCBjaGFuZ2UgdGhlIFxcYG5hbWVzXFxgcyBvZiB0aGUgY29sdW1ucy4gSWYgdGhlIFxcYG5hbWVcXGBzIG9mIHRoZSBjb2x1bW5zIGFyZSBjaGFuZ2VkIGR1cmluZ1xuICAgICAgaW5pdGlhbCBkZXBsb3ltZW50LCB0aGUgY29sdW1ucyB3aWxsIGJlIGRyb3BwZWQgYW5kIHJlY3JlYXRlZCwgY2F1c2luZyBkYXRhIGxvc3MuIEFmdGVyIHRoZSBpbml0aWFsIGRlcGxveW1lbnRcbiAgICAgIG9mIHRoZSBcXGBpZFxcYHMsIHRoZSBcXGBuYW1lXFxgcyBvZiB0aGUgY29sdW1ucyBjYW4gYmUgY2hhbmdlZCB3aXRob3V0IGRhdGEgbG9zcy5cbiAgICAgIGAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYyOiAnMi42OC4wJyB9LFxuICAgIHJlY29tbWVuZGVkVmFsdWU6IHRydWUsXG4gIH0sXG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBbRU5BQkxFX0VNUl9TRVJWSUNFX1BPTElDWV9WMl06IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5CdWdGaXgsXG4gICAgc3VtbWFyeTogJ0VuYWJsZSBBbWF6b25FTVJTZXJ2aWNlUG9saWN5X3YyIG1hbmFnZWQgcG9saWNpZXMnLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgSWYgdGhpcyBmbGFnIGlzIG5vdCBzZXQsIHRoZSBkZWZhdWx0IGJlaGF2aW9yIGZvciBcXGBFbXJDcmVhdGVDbHVzdGVyXFxgIGlzXG4gICAgICB0byB1c2UgXFxgQW1hem9uRWxhc3RpY01hcFJlZHVjZVJvbGVcXGAgbWFuYWdlZCBwb2xpY2llcy5cblxuICAgICAgSWYgdGhpcyBmbGFnIGlzIHNldCwgdGhlIGRlZmF1bHQgYmVoYXZpb3IgaXMgdG8gdXNlIHRoZSBuZXcgXFxgQW1hem9uRU1SU2VydmljZVBvbGljeV92MlxcYFxuICAgICAgbWFuYWdlZCBwb2xpY2llcy5cblxuICAgICAgVGhpcyBpcyBhIGZlYXR1cmUgZmxhZyBhcyB0aGUgb2xkIGJlaGF2aW9yIHdpbGwgYmUgZGVwcmVjYXRlZCwgYnV0IHNvbWUgcmVzb3VyY2VzIG1heSByZXF1aXJlIG1hbnVhbFxuICAgICAgaW50ZXJ2ZW50aW9uIHNpbmNlIHRoZXkgbWlnaHQgbm90IGhhdmUgdGhlIGFwcHJvcHJpYXRlIHRhZ3MgcHJvcGFnYXRlZCBhdXRvbWF0aWNhbGx5LlxuICAgICAgYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjI6ICcyLjcyLjAnIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtFQzJfUkVTVFJJQ1RfREVGQVVMVF9TRUNVUklUWV9HUk9VUF06IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5BcGlEZWZhdWx0LFxuICAgIHN1bW1hcnk6ICdSZXN0cmljdCBhY2Nlc3MgdG8gdGhlIFZQQyBkZWZhdWx0IHNlY3VyaXR5IGdyb3VwJyxcbiAgICBkZXRhaWxzTWQ6IGBcbiAgICAgIEVuYWJsZSB0aGlzIGZlYXR1cmUgZmxhZyB0byByZW1vdmUgdGhlIGRlZmF1bHQgaW5ncmVzcy9lZ3Jlc3MgcnVsZXMgZnJvbSB0aGVcbiAgICAgIFZQQyBkZWZhdWx0IHNlY3VyaXR5IGdyb3VwLlxuXG4gICAgICBXaGVuIGEgVlBDIGlzIGNyZWF0ZWQsIGEgZGVmYXVsdCBzZWN1cml0eSBncm91cCBpcyBjcmVhdGVkIGFzIHdlbGwgYW5kIHRoaXMgY2Fubm90XG4gICAgICBiZSBkZWxldGVkLiBUaGUgZGVmYXVsdCBzZWN1cml0eSBncm91cCBpcyBjcmVhdGVkIHdpdGggaW5ncmVzcy9lZ3Jlc3MgcnVsZXMgdGhhdCBhbGxvd1xuICAgICAgX2FsbF8gdHJhZmZpYy4gW0FXUyBTZWN1cml0eSBiZXN0IHByYWN0aWNlcyByZWNvbW1lbmRdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9zZWN1cml0eWh1Yi9sYXRlc3QvdXNlcmd1aWRlL2VjMi1jb250cm9scy5odG1sI2VjMi0yKVxuICAgICAgcmVtb3ZpbmcgdGhlc2UgaW5ncmVzcy9lZ3Jlc3MgcnVsZXMgaW4gb3JkZXIgdG8gcmVzdHJpY3QgYWNjZXNzIHRvIHRoZSBkZWZhdWx0IHNlY3VyaXR5IGdyb3VwLlxuICAgIGAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYyOiAnMi43OC4wJyB9LFxuICAgIHJlY29tbWVuZGVkVmFsdWU6IHRydWUsXG4gICAgY29tcGF0aWJpbGl0eVdpdGhPbGRCZWhhdmlvck1kOiBgXG4gICAgICBUbyBhbGxvdyBhbGwgaW5ncmVzcy9lZ3Jlc3MgdHJhZmZpYyB0byB0aGUgVlBDIGRlZmF1bHQgc2VjdXJpdHkgZ3JvdXAgeW91XG4gICAgICBjYW4gc2V0IHRoZSBcXGByZXN0cmljdERlZmF1bHRTZWN1cml0eUdyb3VwOiBmYWxzZVxcYC5cbiAgICBgLFxuICB9LFxuXG4gIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbiAgW0FQSUdBVEVXQVlfUkVRVUVTVF9WQUxJREFUT1JfVU5JUVVFX0lEXToge1xuICAgIHR5cGU6IEZsYWdUeXBlLkJ1Z0ZpeCxcbiAgICBzdW1tYXJ5OiAnR2VuZXJhdGUgYSB1bmlxdWUgaWQgZm9yIGVhY2ggUmVxdWVzdFZhbGlkYXRvciBhZGRlZCB0byBhIG1ldGhvZCcsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBUaGlzIGZsYWcgYWxsb3dzIG11bHRpcGxlIFJlcXVlc3RWYWxpZGF0b3JzIHRvIGJlIGFkZGVkIHRvIGEgUmVzdEFwaSB3aGVuXG4gICAgICBwcm92aWRpbmcgdGhlIFxcYFJlcXVlc3RWYWxpZGF0b3JPcHRpb25zXFxgIGluIHRoZSBcXGBhZGRNZXRob2QoKVxcYCBtZXRob2QuXG5cbiAgICAgIElmIHRoZSBmbGFnIGlzIG5vdCBzZXQgdGhlbiBvbmx5IGEgc2luZ2xlIFJlcXVlc3RWYWxpZGF0b3IgY2FuIGJlIGFkZGVkIGluIHRoaXMgd2F5LlxuICAgICAgQW55IGFkZGl0aW9uYWwgUmVxdWVzdFZhbGlkYXRvcnMgaGF2ZSB0byBiZSBjcmVhdGVkIGRpcmVjdGx5IHdpdGggXFxgbmV3IFJlcXVlc3RWYWxpZGF0b3JcXGAuXG4gICAgYCxcbiAgICBpbnRyb2R1Y2VkSW46IHsgdjI6ICcyLjc4LjAnIH0sXG4gICAgcmVjb21tZW5kZWRWYWx1ZTogdHJ1ZSxcbiAgfSxcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4gIFtLTVNfQUxJQVNfTkFNRV9SRUZdOiB7XG4gICAgdHlwZTogRmxhZ1R5cGUuQnVnRml4LFxuICAgIHN1bW1hcnk6ICdLTVMgQWxpYXMgbmFtZSBhbmQga2V5QXJuIHdpbGwgaGF2ZSBpbXBsaWNpdCByZWZlcmVuY2UgdG8gS01TIEtleScsXG4gICAgZGV0YWlsc01kOiBgXG4gICAgICBUaGlzIGZsYWcgYWxsb3dzIGFuIGltcGxpY2l0IGRlcGVuZGVuY3kgdG8gYmUgY3JlYXRlZCBiZXR3ZWVuIEtNUyBBbGlhcyBhbmQgS01TIEtleVxuICAgICAgd2hlbiByZWZlcmVuY2luZyBrZXkuYWxpYXNOYW1lIG9yIGtleS5rZXlBcm4uXG5cbiAgICAgIElmIHRoZSBmbGFnIGlzIG5vdCBzZXQgdGhlbiBhIHJhdyBzdHJpbmcgaXMgcGFzc2VkIGFzIHRoZSBBbGlhcyBuYW1lIGFuZCBub1xuICAgICAgaW1wbGljaXQgZGVwZW5kZW5jaWVzIHdpbGwgYmUgc2V0LlxuICAgIGAsXG4gICAgaW50cm9kdWNlZEluOiB7IHYyOiAnMi44My4wJyB9LFxuICAgIHJlY29tbWVuZGVkVmFsdWU6IHRydWUsXG4gIH0sXG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuICBbSU5DTFVERV9QUkVGSVhfSU5fVU5JUVVFX05BTUVfR0VORVJBVElPTl06IHtcbiAgICB0eXBlOiBGbGFnVHlwZS5CdWdGaXgsXG4gICAgc3VtbWFyeTogJ0luY2x1ZGUgdGhlIHN0YWNrIHByZWZpeCBpbiB0aGUgc3RhY2sgbmFtZSBnZW5lcmF0aW9uIHByb2Nlc3MnLFxuICAgIGRldGFpbHNNZDogYFxuICAgICAgVGhpcyBmbGFnIHByZXZlbnRzIHRoZSBwcmVmaXggb2YgYSBzdGFjayBmcm9tIG1ha2luZyB0aGUgc3RhY2sncyBuYW1lIGxvbmdlciB0aGFuIHRoZSAxMjggY2hhcmFjdGVyIGxpbWl0LlxuXG4gICAgICBJZiB0aGUgZmxhZyBpcyBzZXQsIHRoZSBwcmVmaXggaXMgaW5jbHVkZWQgaW4gdGhlIHN0YWNrIG5hbWUgZ2VuZXJhdGlvbiBwcm9jZXNzLlxuICAgICAgSWYgdGhlIGZsYWcgaXMgbm90IHNldCwgdGhlbiB0aGUgcHJlZml4IG9mIHRoZSBzdGFjayBpcyBwcmVwZW5kZWQgdG8gdGhlIGdlbmVyYXRlZCBzdGFjayBuYW1lLlxuXG4gICAgICAqKk5PVEUqKiAtIEVuYWJsaW5nIHRoaXMgZmxhZyBjb21lcyBhdCBhICoqcmlzayoqLiBJZiB5b3UgaGF2ZSBhbHJlYWR5IGRlcGxveWVkIHN0YWNrcywgY2hhbmdpbmcgdGhlIHN0YXR1cyBvZiB0aGlzXG4gICAgICBmZWF0dXJlIGZsYWcgY2FuIGxlYWQgdG8gYSBjaGFuZ2UgaW4gc3RhY2tzJyBuYW1lLiBDaGFuZ2luZyBhIHN0YWNrIG5hbWUgbWVhbiByZWNyZWF0aW5nIHRoZSB3aG9sZSBzdGFjaywgd2hpY2hcbiAgICAgIGlzIG5vdCB2aWFibGUgaW4gc29tZSBwcm9kdWN0aXZlIHNldHVwcy5cbiAgICBgLFxuICAgIGludHJvZHVjZWRJbjogeyB2MjogJzIuODQuMCcgfSxcbiAgICByZWNvbW1lbmRlZFZhbHVlOiB0cnVlLFxuICB9LFxuXG59O1xuXG5jb25zdCBDVVJSRU5UX01WID0gJ3YyJztcblxuLyoqXG4gKiBUaGUgbGlzdCBvZiBmdXR1cmUgZmxhZ3MgdGhhdCBhcmUgbm93IGV4cGlyZWQuIFRoaXMgaXMgZ29pbmcgdG8gYmUgdXNlZCB0byBpZGVudGlmeVxuICogYW5kIGJsb2NrIHVzYWdlcyBvZiBvbGQgZmVhdHVyZSBmbGFncyBpbiB0aGUgbmV3IG1ham9yIHZlcnNpb24gb2YgQ0RLLlxuICovXG5leHBvcnQgY29uc3QgQ1VSUkVOVF9WRVJTSU9OX0VYUElSRURfRkxBR1M6IHN0cmluZ1tdID0gT2JqZWN0LmVudHJpZXMoRkxBR1MpXG4gIC5maWx0ZXIoKFtfLCBmbGFnXSkgPT4gZmxhZy5pbnRyb2R1Y2VkSW5bQ1VSUkVOVF9NVl0gPT09IHVuZGVmaW5lZClcbiAgLm1hcCgoW25hbWUsIF9dKSA9PiBuYW1lKS5zb3J0KCk7XG5cbi8qKlxuICogRmxhZyB2YWx1ZXMgdGhhdCBzaG91bGQgYXBwbHkgZm9yIG5ldyBwcm9qZWN0c1xuICpcbiAqIEFkZCBhIGZsYWcgaW4gaGVyZSAodHlwaWNhbGx5IHdpdGggdGhlIHZhbHVlIGB0cnVlYCksIHRvIGVuYWJsZVxuICogYmFja3dhcmRzLWJyZWFraW5nIGJlaGF2aW9yIGNoYW5nZXMgb25seSBmb3IgbmV3IHByb2plY3RzLiAgTmV3IHByb2plY3RzXG4gKiBnZW5lcmF0ZWQgdGhyb3VnaCBgY2RrIGluaXRgIHdpbGwgaW5jbHVkZSB0aGVzZSBmbGFncyBpbiB0aGVpciBnZW5lcmF0ZWRcbiAqXG4gKiBUZXN0cyBtdXN0IGNvdmVyIHRoZSBkZWZhdWx0IChkaXNhYmxlZCkgY2FzZSBhbmQgdGhlIGZ1dHVyZSAoZW5hYmxlZCkgY2FzZS5cbiAqL1xuZXhwb3J0IGNvbnN0IE5FV19QUk9KRUNUX0NPTlRFWFQgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gIE9iamVjdC5lbnRyaWVzKEZMQUdTKVxuICAgIC5maWx0ZXIoKFtfLCBmbGFnXSkgPT4gZmxhZy5yZWNvbW1lbmRlZFZhbHVlICE9PSBmbGFnLmRlZmF1bHRzPy5bQ1VSUkVOVF9NVl0gJiYgZmxhZy5pbnRyb2R1Y2VkSW5bQ1VSUkVOVF9NVl0pXG4gICAgLm1hcCgoW25hbWUsIGZsYWddKSA9PiBbbmFtZSwgZmxhZy5yZWNvbW1lbmRlZFZhbHVlXSksXG4pO1xuXG4vKipcbiAqIFRoZSBkZWZhdWx0IHZhbHVlcyBvZiBlYWNoIG9mIHRoZXNlIGZsYWdzIGluIHRoZSBjdXJyZW50IG1ham9yIHZlcnNpb24uXG4gKlxuICogVGhpcyBpcyB0aGUgZWZmZWN0aXZlIHZhbHVlIG9mIHRoZSBmbGFnLCB1bmxlc3MgaXQncyBvdmVycmlkZW4gdmlhXG4gKiBjb250ZXh0LlxuICpcbiAqIEFkZGluZyBuZXcgZmxhZ3MgaGVyZSBpcyBvbmx5IGFsbG93ZWQgZHVyaW5nIHRoZSBwcmUtcmVsZWFzZSBwZXJpb2Qgb2YgYSBuZXdcbiAqIG1ham9yIHZlcnNpb24hXG4gKi9cbmV4cG9ydCBjb25zdCBDVVJSRU5UX1ZFUlNJT05fRkxBR19ERUZBVUxUUyA9IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhGTEFHUylcbiAgLmZpbHRlcigoW18sIGZsYWddKSA9PiBmbGFnLmRlZmF1bHRzPy5bQ1VSUkVOVF9NVl0gIT09IHVuZGVmaW5lZClcbiAgLm1hcCgoW25hbWUsIGZsYWddKSA9PiBbbmFtZSwgZmxhZy5kZWZhdWx0cz8uW0NVUlJFTlRfTVZdXSkpO1xuXG5leHBvcnQgZnVuY3Rpb24gZnV0dXJlRmxhZ0RlZmF1bHQoZmxhZzogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IHZhbHVlID0gQ1VSUkVOVF9WRVJTSU9OX0ZMQUdfREVGQVVMVFNbZmxhZ10gPz8gZmFsc2U7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJykge1xuICAgIHRocm93IG5ldyBFcnJvcihgZnV0dXJlRmxhZ0RlZmF1bHQ6IGRlZmF1bHQgdHlwZSBvZiBmbGFnICcke2ZsYWd9JyBzaG91bGQgYmUgYm9vbGVhbiwgZ290ICcke3R5cGVvZiB2YWx1ZX0nYCk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vLyBOb2JvZHkgc2hvdWxkIGhhdmUgYmVlbiB1c2luZyBhbnkgb2YgdGhpcywgYnV0IHlvdSBuZXZlciBrbm93XG5cbi8qKiBAZGVwcmVjYXRlZCB1c2UgQ1VSUkVOVF9WRVJTSU9OX0VYUElSRURfRkxBR1MgaW5zdGVhZCAqL1xuZXhwb3J0IGNvbnN0IEZVVFVSRV9GTEFHU19FWFBJUkVEID0gQ1VSUkVOVF9WRVJTSU9OX0VYUElSRURfRkxBR1M7XG5cbi8qKiBAZGVwcmVjYXRlZCB1c2UgTkVXX1BST0pFQ1RfQ09OVEVYVCBpbnN0ZWFkICovXG5leHBvcnQgY29uc3QgRlVUVVJFX0ZMQUdTID0gT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKE5FV19QUk9KRUNUX0NPTlRFWFQpXG4gIC5maWx0ZXIoKFtfLCB2XSkgPT4gdHlwZW9mIHYgPT09ICdib29sZWFuJykpO1xuXG4vKiogQGRlcHJlY2F0ZWQgdXNlIE5FV19QUk9KRUNUX0NPTlRFWFQgaW5zdGVhZCAqL1xuZXhwb3J0IGNvbnN0IE5FV19QUk9KRUNUX0RFRkFVTFRfQ09OVEVYVCA9IE9iamVjdC5mcm9tRW50cmllcyhPYmplY3QuZW50cmllcyhORVdfUFJPSkVDVF9DT05URVhUKVxuICAuZmlsdGVyKChbXywgdl0pID0+IHR5cGVvZiB2ICE9PSAnYm9vbGVhbicpKTtcbiJdfQ==