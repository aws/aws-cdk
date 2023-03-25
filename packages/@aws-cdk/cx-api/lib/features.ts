import { FlagInfo, FlagType } from './private/flag-modeling';

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


export const ENABLE_STACK_NAME_DUPLICATES_CONTEXT = '@aws-cdk/core:enableStackNameDuplicates';
export const ENABLE_DIFF_NO_FAIL_CONTEXT = 'aws-cdk:enableDiffNoFail';
/** @deprecated use `ENABLE_DIFF_NO_FAIL_CONTEXT` */
export const ENABLE_DIFF_NO_FAIL = ENABLE_DIFF_NO_FAIL_CONTEXT;
export const NEW_STYLE_STACK_SYNTHESIS_CONTEXT = '@aws-cdk/core:newStyleStackSynthesis';
export const STACK_RELATIVE_EXPORTS_CONTEXT = '@aws-cdk/core:stackRelativeExports';
export const DOCKER_IGNORE_SUPPORT = '@aws-cdk/aws-ecr-assets:dockerIgnoreSupport';
export const SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME = '@aws-cdk/aws-secretsmanager:parseOwnedSecretName';
export const KMS_DEFAULT_KEY_POLICIES = '@aws-cdk/aws-kms:defaultKeyPolicies';
export const S3_GRANT_WRITE_WITHOUT_ACL = '@aws-cdk/aws-s3:grantWriteWithoutAcl';
export const ECS_REMOVE_DEFAULT_DESIRED_COUNT = '@aws-cdk/aws-ecs-patterns:removeDefaultDesiredCount';
export const RDS_LOWERCASE_DB_IDENTIFIER = '@aws-cdk/aws-rds:lowercaseDbIdentifier';
export const APIGATEWAY_USAGEPLANKEY_ORDERINSENSITIVE_ID = '@aws-cdk/aws-apigateway:usagePlanKeyOrderInsensitiveId';
export const EFS_DEFAULT_ENCRYPTION_AT_REST = '@aws-cdk/aws-efs:defaultEncryptionAtRest';
export const LAMBDA_RECOGNIZE_VERSION_PROPS = '@aws-cdk/aws-lambda:recognizeVersionProps';
export const LAMBDA_RECOGNIZE_LAYER_VERSION = '@aws-cdk/aws-lambda:recognizeLayerVersion';
export const CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021 = '@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021';
export const CHECK_SECRET_USAGE = '@aws-cdk/core:checkSecretUsage';
export const TARGET_PARTITIONS = '@aws-cdk/core:target-partitions';
export const ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER = '@aws-cdk-containers/ecs-service-extensions:enableDefaultLogDriver';
export const EC2_UNIQUE_IMDSV2_LAUNCH_TEMPLATE_NAME = '@aws-cdk/aws-ec2:uniqueImdsv2TemplateName';
export const ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME = '@aws-cdk/aws-ecs:arnFormatIncludesClusterName';
export const IAM_MINIMIZE_POLICIES = '@aws-cdk/aws-iam:minimizePolicies';
export const IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME = '@aws-cdk/aws-iam:importedRoleStackSafeDefaultPolicyName';
export const VALIDATE_SNAPSHOT_REMOVAL_POLICY = '@aws-cdk/core:validateSnapshotRemovalPolicy';
export const CODEPIPELINE_CROSS_ACCOUNT_KEY_ALIAS_STACK_SAFE_RESOURCE_NAME = '@aws-cdk/aws-codepipeline:crossAccountKeyAliasStackSafeResourceName';
export const S3_CREATE_DEFAULT_LOGGING_POLICY = '@aws-cdk/aws-s3:createDefaultLoggingPolicy';
export const SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY = '@aws-cdk/aws-sns-subscriptions:restrictSqsDescryption';
export const APIGATEWAY_DISABLE_CLOUDWATCH_ROLE = '@aws-cdk/aws-apigateway:disableCloudWatchRole';
export const ENABLE_PARTITION_LITERALS = '@aws-cdk/core:enablePartitionLiterals';
export const EVENTS_TARGET_QUEUE_SAME_ACCOUNT = '@aws-cdk/aws-events:eventsTargetQueueSameAccount';
export const IAM_STANDARDIZED_SERVICE_PRINCIPALS = '@aws-cdk/aws-iam:standardizedServicePrincipals';
export const ECS_DISABLE_EXPLICIT_DEPLOYMENT_CONTROLLER_FOR_CIRCUIT_BREAKER = '@aws-cdk/aws-ecs:disableExplicitDeploymentControllerForCircuitBreaker';
export const S3_SERVER_ACCESS_LOGS_USE_BUCKET_POLICY = '@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy';
export const ROUTE53_PATTERNS_USE_CERTIFICATE = '@aws-cdk/aws-route53-patters:useCertificate';
export const AWS_CUSTOM_RESOURCE_LATEST_SDK_DEFAULT = '@aws-cdk/customresources:installLatestAwsSdkDefault';
export const DATABASE_PROXY_UNIQUE_RESOURCE_NAME = '@aws-cdk/aws-rds:databaseProxyUniqueResourceName';
export const CODEDEPLOY_REMOVE_ALARMS_FROM_DEPLOYMENT_GROUP = '@aws-cdk/aws-codedeploy:removeAlarmsFromDeploymentGroup';
export const APIGATEWAY_AUTHORIZER_CHANGE_DEPLOYMENT_LOGICAL_ID = '@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId';
export const EC2_LAUNCH_TEMPLATE_DEFAULT_USER_DATA = '@aws-cdk/aws-ec2:launchTemplateDefaultUserData';
export const SECRETS_MANAGER_TARGET_ATTACHMENT_RESOURCE_POLICY = '@aws-cdk/aws-secretsmanager:useAttachedSecretResourcePolicyForSecretTargetAttachments';
export const REDSHIFT_COLUMN_ID = '@aws-cdk/aws-redshift:columnId';
export const ENABLE_EMR_SERVICE_POLICY_V2 = '@aws-cdk/aws-stepfunctions-tasks:enableEmrServicePolicyV2';

export const FLAGS: Record<string, FlagInfo> = {
  //////////////////////////////////////////////////////////////////////
  [ENABLE_STACK_NAME_DUPLICATES_CONTEXT]: {
    type: FlagType.ApiDefault,
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
  [ENABLE_DIFF_NO_FAIL_CONTEXT]: {
    type: FlagType.ApiDefault,
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
  [NEW_STYLE_STACK_SYNTHESIS_CONTEXT]: {
    type: FlagType.BugFix,
    summary: 'Switch to new stack synthesis method which enables CI/CD',
    detailsMd: `
      If this flag is specified, all \`Stack\`s will use the \`DefaultStackSynthesizer\` by
      default. If it is not set, they will use the \`LegacyStackSynthesizer\`.`,
    introducedIn: { v1: '1.39.0', v2: '2.0.0' },
    defaults: { v2: true },
    recommendedValue: true,
  },

  //////////////////////////////////////////////////////////////////////
  [STACK_RELATIVE_EXPORTS_CONTEXT]: {
    type: FlagType.BugFix,
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
  [DOCKER_IGNORE_SUPPORT]: {
    type: FlagType.ApiDefault,
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
  [SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME]: {
    type: FlagType.ApiDefault,
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
  [KMS_DEFAULT_KEY_POLICIES]: {
    type: FlagType.ApiDefault,
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
  [S3_GRANT_WRITE_WITHOUT_ACL]: {
    type: FlagType.ApiDefault,
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
  [ECS_REMOVE_DEFAULT_DESIRED_COUNT]: {
    type: FlagType.ApiDefault,
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
  [RDS_LOWERCASE_DB_IDENTIFIER]: {
    type: FlagType.BugFix,
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
  [APIGATEWAY_USAGEPLANKEY_ORDERINSENSITIVE_ID]: {
    type: FlagType.BugFix,
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
  [EFS_DEFAULT_ENCRYPTION_AT_REST]: {
    type: FlagType.ApiDefault,
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
  [LAMBDA_RECOGNIZE_VERSION_PROPS]: {
    type: FlagType.BugFix,
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
  [LAMBDA_RECOGNIZE_LAYER_VERSION]: {
    type: FlagType.BugFix,
    summary: 'Enable this feature flag to opt in to the updated logical id calculation for Lambda Version created using the `fn.currentVersion`.',
    detailsMd: `
      This flag correct incorporates Lambda Layer properties into the Lambda Function Version.

      See 'currentVersion' section in the aws-lambda module's README for more details.`,
    introducedIn: { v1: '1.159.0', v2: '2.27.0' },
    recommendedValue: true,
  },

  //////////////////////////////////////////////////////////////////////
  [CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021]: {
    type: FlagType.BugFix,
    summary: 'Enable this feature flag to have cloudfront distributions use the security policy TLSv1.2_2021 by default.',
    detailsMd: `
      The security policy can also be configured explicitly using the \`minimumProtocolVersion\` property.`,
    introducedIn: { v1: '1.117.0', v2: '2.0.0' },
    defaults: { v2: true },
    recommendedValue: true,
  },

  //////////////////////////////////////////////////////////////////////
  [CHECK_SECRET_USAGE]: {
    type: FlagType.VisibleContext,
    summary: 'Enable this flag to make it impossible to accidentally use SecretValues in unsafe locations',
    detailsMd: `
      With this flag enabled, \`SecretValue\` instances can only be passed to
      constructs that accept \`SecretValue\`s; otherwise, \`unsafeUnwrap()\` must be
      called to use it as a regular string.`,
    introducedIn: { v1: '1.153.0', v2: '2.21.0' },
    recommendedValue: true,
  },

  //////////////////////////////////////////////////////////////////////
  [TARGET_PARTITIONS]: {
    type: FlagType.VisibleContext,
    summary: 'What regions to include in lookup tables of environment agnostic stacks',
    detailsMd: `
      Has no effect on stacks that have a defined region, but will limit the amount
      of unnecessary regions included in stacks without a known region.

      The type of this value should be a list of strings.`,
    introducedIn: { v1: '1.137.0', v2: '2.4.0' },
    recommendedValue: ['aws', 'aws-cn'],
  },

  //////////////////////////////////////////////////////////////////////
  [ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER]: {
    type: FlagType.ApiDefault,
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
  [EC2_UNIQUE_IMDSV2_LAUNCH_TEMPLATE_NAME]: {
    type: FlagType.BugFix,
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
  [ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME]: {
    type: FlagType.BugFix,
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
  [IAM_MINIMIZE_POLICIES]: {
    type: FlagType.VisibleContext,
    summary: 'Minimize IAM policies by combining Statements',
    detailsMd: `
      Minimize IAM policies by combining Principals, Actions and Resources of two
      Statements in the policies, as long as it doesn't change the meaning of the
      policy.`,
    introducedIn: { v1: '1.150.0', v2: '2.18.0' },
    recommendedValue: true,
  },

  //////////////////////////////////////////////////////////////////////
  [VALIDATE_SNAPSHOT_REMOVAL_POLICY]: {
    type: FlagType.ApiDefault,
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
  [CODEPIPELINE_CROSS_ACCOUNT_KEY_ALIAS_STACK_SAFE_RESOURCE_NAME]: {
    type: FlagType.BugFix,
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
  [S3_CREATE_DEFAULT_LOGGING_POLICY]: {
    type: FlagType.BugFix,
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
  [SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY]: {
    type: FlagType.BugFix,
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
  [APIGATEWAY_DISABLE_CLOUDWATCH_ROLE]: {
    type: FlagType.BugFix,
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
  [ENABLE_PARTITION_LITERALS]: {
    type: FlagType.BugFix,
    summary: 'Make ARNs concrete if AWS partition is known',
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
  [EVENTS_TARGET_QUEUE_SAME_ACCOUNT]: {
    type: FlagType.BugFix,
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
  [IAM_STANDARDIZED_SERVICE_PRINCIPALS]: {
    type: FlagType.BugFix,
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
  [ECS_DISABLE_EXPLICIT_DEPLOYMENT_CONTROLLER_FOR_CIRCUIT_BREAKER]: {
    type: FlagType.BugFix,
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
  [IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME]: {
    type: FlagType.BugFix,
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
  [S3_SERVER_ACCESS_LOGS_USE_BUCKET_POLICY]: {
    type: FlagType.BugFix,
    summary: 'Use S3 Bucket Policy instead of ACLs for Server Access Logging',
    detailsMd: `
      Enable this feature flag to use S3 Bucket Policy for granting permission fo Server Access Logging
      rather than using the canned \`LogDeliveryWrite\` ACL. ACLs do not work when Object Ownership is
      enabled on the bucket.

      This flag uses a Bucket Policy statement to allow Server Access Log delivery, following best
      practices for S3.

      @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html
    `,
    introducedIn: { v2: '2.59.0' },
    recommendedValue: true,
  },

  //////////////////////////////////////////////////////////////////////
  [ROUTE53_PATTERNS_USE_CERTIFICATE]: {
    type: FlagType.ApiDefault,
    summary: 'Use the official `Certificate` resource instead of `DnsValidatedCertificate`',
    detailsMd: `
      Enable this feature flag to use the official CloudFormation supported \`Certificate\` resource instead
      of the deprecated \`DnsValidatedCertificate\` construct. If this flag is enabled and you are creating
      the stack in a region other than us-east-1 then you must also set \`crossRegionReferences=true\` on the
      stack.
      `,
    introducedIn: { v2: 'V2·NEXT' },
    recommendedValue: true,
    compatibilityWithOldBehaviorMd: 'Define a `DnsValidatedCertificate` explicitly and pass in the `certificate` property',
  },

  //////////////////////////////////////////////////////////////////////
  [AWS_CUSTOM_RESOURCE_LATEST_SDK_DEFAULT]: {
    type: FlagType.ApiDefault,
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
  [DATABASE_PROXY_UNIQUE_RESOURCE_NAME]: {
    type: FlagType.BugFix,
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
  [CODEDEPLOY_REMOVE_ALARMS_FROM_DEPLOYMENT_GROUP]: {
    type: FlagType.BugFix,
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
  [APIGATEWAY_AUTHORIZER_CHANGE_DEPLOYMENT_LOGICAL_ID]: {
    type: FlagType.BugFix,
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
  [EC2_LAUNCH_TEMPLATE_DEFAULT_USER_DATA]: {
    type: FlagType.BugFix,
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
  [SECRETS_MANAGER_TARGET_ATTACHMENT_RESOURCE_POLICY]: {
    type: FlagType.BugFix,
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
  [REDSHIFT_COLUMN_ID]: {
    type: FlagType.BugFix,
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
  [ENABLE_EMR_SERVICE_POLICY_V2]: {
    type: FlagType.BugFix,
    summary: 'Enable AmazonEMRServicePolicy_v2 managed policies',
    detailsMd: `
      If this flag is not set, the default behavior for \`EmrCreateCluster\` is
      to use \`AmazonElasticMapReduceRole\` managed policies.

      If this flag is set, the default behavior is to use the new \`AmazonEMRServicePolicy_v2\`
      managed policies.

      This is a feature flag as the old behavior will be deprecated, but some resources may require manual
      intervention since they might not have the appropriate tags propagated automatically.
      `,
    introducedIn: { v2: 'V2NEXT' },
    recommendedValue: true,
  },
};

const CURRENT_MV = 'v2';

/**
 * The list of future flags that are now expired. This is going to be used to identify
 * and block usages of old feature flags in the new major version of CDK.
 */
export const CURRENT_VERSION_EXPIRED_FLAGS: string[] = Object.entries(FLAGS)
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
export const NEW_PROJECT_CONTEXT = Object.fromEntries(
  Object.entries(FLAGS)
    .filter(([_, flag]) => flag.recommendedValue !== flag.defaults?.[CURRENT_MV] && flag.introducedIn[CURRENT_MV])
    .map(([name, flag]) => [name, flag.recommendedValue]),
);

/**
 * The default values of each of these flags in the current major version.
 *
 * This is the effective value of the flag, unless it's overriden via
 * context.
 *
 * Adding new flags here is only allowed during the pre-release period of a new
 * major version!
 */
export const CURRENT_VERSION_FLAG_DEFAULTS = Object.fromEntries(Object.entries(FLAGS)
  .filter(([_, flag]) => flag.defaults?.[CURRENT_MV] !== undefined)
  .map(([name, flag]) => [name, flag.defaults?.[CURRENT_MV]]));

export function futureFlagDefault(flag: string): boolean {
  const value = CURRENT_VERSION_FLAG_DEFAULTS[flag] ?? false;
  if (typeof value !== 'boolean') {
    throw new Error(`futureFlagDefault: default type of flag '${flag}' should be boolean, got '${typeof value}'`);
  }
  return value;
}

// Nobody should have been using any of this, but you never know

/** @deprecated use CURRENT_VERSION_EXPIRED_FLAGS instead */
export const FUTURE_FLAGS_EXPIRED = CURRENT_VERSION_EXPIRED_FLAGS;

/** @deprecated use NEW_PROJECT_CONTEXT instead */
export const FUTURE_FLAGS = Object.fromEntries(Object.entries(NEW_PROJECT_CONTEXT)
  .filter(([_, v]) => typeof v === 'boolean'));

/** @deprecated use NEW_PROJECT_CONTEXT instead */
export const NEW_PROJECT_DEFAULT_CONTEXT = Object.fromEntries(Object.entries(NEW_PROJECT_CONTEXT)
  .filter(([_, v]) => typeof v !== 'boolean'));
