import { FlagInfo } from './private/flag-modeling';
export declare const ENABLE_STACK_NAME_DUPLICATES_CONTEXT = "@aws-cdk/core:enableStackNameDuplicates";
export declare const ENABLE_DIFF_NO_FAIL_CONTEXT = "aws-cdk:enableDiffNoFail";
/** @deprecated use `ENABLE_DIFF_NO_FAIL_CONTEXT` */
export declare const ENABLE_DIFF_NO_FAIL = "aws-cdk:enableDiffNoFail";
export declare const NEW_STYLE_STACK_SYNTHESIS_CONTEXT = "@aws-cdk/core:newStyleStackSynthesis";
export declare const STACK_RELATIVE_EXPORTS_CONTEXT = "@aws-cdk/core:stackRelativeExports";
export declare const DOCKER_IGNORE_SUPPORT = "@aws-cdk/aws-ecr-assets:dockerIgnoreSupport";
export declare const SECRETS_MANAGER_PARSE_OWNED_SECRET_NAME = "@aws-cdk/aws-secretsmanager:parseOwnedSecretName";
export declare const KMS_DEFAULT_KEY_POLICIES = "@aws-cdk/aws-kms:defaultKeyPolicies";
export declare const S3_GRANT_WRITE_WITHOUT_ACL = "@aws-cdk/aws-s3:grantWriteWithoutAcl";
export declare const ECS_REMOVE_DEFAULT_DESIRED_COUNT = "@aws-cdk/aws-ecs-patterns:removeDefaultDesiredCount";
export declare const RDS_LOWERCASE_DB_IDENTIFIER = "@aws-cdk/aws-rds:lowercaseDbIdentifier";
export declare const APIGATEWAY_USAGEPLANKEY_ORDERINSENSITIVE_ID = "@aws-cdk/aws-apigateway:usagePlanKeyOrderInsensitiveId";
export declare const EFS_DEFAULT_ENCRYPTION_AT_REST = "@aws-cdk/aws-efs:defaultEncryptionAtRest";
export declare const LAMBDA_RECOGNIZE_VERSION_PROPS = "@aws-cdk/aws-lambda:recognizeVersionProps";
export declare const LAMBDA_RECOGNIZE_LAYER_VERSION = "@aws-cdk/aws-lambda:recognizeLayerVersion";
export declare const CLOUDFRONT_DEFAULT_SECURITY_POLICY_TLS_V1_2_2021 = "@aws-cdk/aws-cloudfront:defaultSecurityPolicyTLSv1.2_2021";
export declare const CHECK_SECRET_USAGE = "@aws-cdk/core:checkSecretUsage";
export declare const TARGET_PARTITIONS = "@aws-cdk/core:target-partitions";
export declare const ECS_SERVICE_EXTENSIONS_ENABLE_DEFAULT_LOG_DRIVER = "@aws-cdk-containers/ecs-service-extensions:enableDefaultLogDriver";
export declare const EC2_UNIQUE_IMDSV2_LAUNCH_TEMPLATE_NAME = "@aws-cdk/aws-ec2:uniqueImdsv2TemplateName";
export declare const ECS_ARN_FORMAT_INCLUDES_CLUSTER_NAME = "@aws-cdk/aws-ecs:arnFormatIncludesClusterName";
export declare const IAM_MINIMIZE_POLICIES = "@aws-cdk/aws-iam:minimizePolicies";
export declare const IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME = "@aws-cdk/aws-iam:importedRoleStackSafeDefaultPolicyName";
export declare const VALIDATE_SNAPSHOT_REMOVAL_POLICY = "@aws-cdk/core:validateSnapshotRemovalPolicy";
export declare const CODEPIPELINE_CROSS_ACCOUNT_KEY_ALIAS_STACK_SAFE_RESOURCE_NAME = "@aws-cdk/aws-codepipeline:crossAccountKeyAliasStackSafeResourceName";
export declare const S3_CREATE_DEFAULT_LOGGING_POLICY = "@aws-cdk/aws-s3:createDefaultLoggingPolicy";
export declare const SNS_SUBSCRIPTIONS_SQS_DECRYPTION_POLICY = "@aws-cdk/aws-sns-subscriptions:restrictSqsDescryption";
export declare const APIGATEWAY_DISABLE_CLOUDWATCH_ROLE = "@aws-cdk/aws-apigateway:disableCloudWatchRole";
export declare const ENABLE_PARTITION_LITERALS = "@aws-cdk/core:enablePartitionLiterals";
export declare const EVENTS_TARGET_QUEUE_SAME_ACCOUNT = "@aws-cdk/aws-events:eventsTargetQueueSameAccount";
export declare const IAM_STANDARDIZED_SERVICE_PRINCIPALS = "@aws-cdk/aws-iam:standardizedServicePrincipals";
export declare const ECS_DISABLE_EXPLICIT_DEPLOYMENT_CONTROLLER_FOR_CIRCUIT_BREAKER = "@aws-cdk/aws-ecs:disableExplicitDeploymentControllerForCircuitBreaker";
export declare const S3_SERVER_ACCESS_LOGS_USE_BUCKET_POLICY = "@aws-cdk/aws-s3:serverAccessLogsUseBucketPolicy";
export declare const ROUTE53_PATTERNS_USE_CERTIFICATE = "@aws-cdk/aws-route53-patters:useCertificate";
export declare const AWS_CUSTOM_RESOURCE_LATEST_SDK_DEFAULT = "@aws-cdk/customresources:installLatestAwsSdkDefault";
export declare const DATABASE_PROXY_UNIQUE_RESOURCE_NAME = "@aws-cdk/aws-rds:databaseProxyUniqueResourceName";
export declare const CODEDEPLOY_REMOVE_ALARMS_FROM_DEPLOYMENT_GROUP = "@aws-cdk/aws-codedeploy:removeAlarmsFromDeploymentGroup";
export declare const APIGATEWAY_AUTHORIZER_CHANGE_DEPLOYMENT_LOGICAL_ID = "@aws-cdk/aws-apigateway:authorizerChangeDeploymentLogicalId";
export declare const EC2_LAUNCH_TEMPLATE_DEFAULT_USER_DATA = "@aws-cdk/aws-ec2:launchTemplateDefaultUserData";
export declare const SECRETS_MANAGER_TARGET_ATTACHMENT_RESOURCE_POLICY = "@aws-cdk/aws-secretsmanager:useAttachedSecretResourcePolicyForSecretTargetAttachments";
export declare const REDSHIFT_COLUMN_ID = "@aws-cdk/aws-redshift:columnId";
export declare const ENABLE_EMR_SERVICE_POLICY_V2 = "@aws-cdk/aws-stepfunctions-tasks:enableEmrServicePolicyV2";
export declare const EC2_RESTRICT_DEFAULT_SECURITY_GROUP = "@aws-cdk/aws-ec2:restrictDefaultSecurityGroup";
export declare const APIGATEWAY_REQUEST_VALIDATOR_UNIQUE_ID = "@aws-cdk/aws-apigateway:requestValidatorUniqueId";
export declare const INCLUDE_PREFIX_IN_UNIQUE_NAME_GENERATION = "@aws-cdk/core:includePrefixInUniqueNameGeneration";
export declare const KMS_ALIAS_NAME_REF = "@aws-cdk/aws-kms:aliasNameRef";
export declare const FLAGS: Record<string, FlagInfo>;
/**
 * The list of future flags that are now expired. This is going to be used to identify
 * and block usages of old feature flags in the new major version of CDK.
 */
export declare const CURRENT_VERSION_EXPIRED_FLAGS: string[];
/**
 * Flag values that should apply for new projects
 *
 * Add a flag in here (typically with the value `true`), to enable
 * backwards-breaking behavior changes only for new projects.  New projects
 * generated through `cdk init` will include these flags in their generated
 *
 * Tests must cover the default (disabled) case and the future (enabled) case.
 */
export declare const NEW_PROJECT_CONTEXT: {
    [k: string]: any;
};
/**
 * The default values of each of these flags in the current major version.
 *
 * This is the effective value of the flag, unless it's overriden via
 * context.
 *
 * Adding new flags here is only allowed during the pre-release period of a new
 * major version!
 */
export declare const CURRENT_VERSION_FLAG_DEFAULTS: {
    [k: string]: any;
};
export declare function futureFlagDefault(flag: string): boolean;
/** @deprecated use CURRENT_VERSION_EXPIRED_FLAGS instead */
export declare const FUTURE_FLAGS_EXPIRED: string[];
/** @deprecated use NEW_PROJECT_CONTEXT instead */
export declare const FUTURE_FLAGS: {
    [k: string]: any;
};
/** @deprecated use NEW_PROJECT_CONTEXT instead */
export declare const NEW_PROJECT_DEFAULT_CONTEXT: {
    [k: string]: any;
};
