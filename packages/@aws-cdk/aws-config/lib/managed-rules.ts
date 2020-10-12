import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import { Duration, Lazy, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ManagedRule, RuleProps } from './rule';

/**
 * Construction properties for a AccessKeysRotated
 */
export interface AccessKeysRotatedProps extends RuleProps {
  /**
   * The maximum number of days within which the access keys must be rotated.
   *
   * @default Duration.days(90)
   */
  readonly maxAge?: Duration;
}

/**
 * Checks whether the active access keys are rotated within the number of days
 * specified in `maxAge`.
 *
 * @see https://docs.aws.amazon.com/config/latest/developerguide/access-keys-rotated.html
 *
 * @resource AWS::Config::ConfigRule
 */
export class AccessKeysRotated extends ManagedRule {
  constructor(scope: Construct, id: string, props: AccessKeysRotatedProps = {}) {
    super(scope, id, {
      ...props,
      identifier: 'ACCESS_KEYS_ROTATED',
      inputParameters: {
        ...props.maxAge
          ? {
            maxAccessKeyAge: props.maxAge.toDays(),
          }
          : {},
      },
    });
  }
}

/**
 * Construction properties for a CloudFormationStackDriftDetectionCheck
 */
export interface CloudFormationStackDriftDetectionCheckProps extends RuleProps {
  /**
   * Whether to check only the stack where this rule is deployed.
   *
   * @default false
   */
  readonly ownStackOnly?: boolean;

  /**
   * The IAM role to use for this rule. It must have permissions to detect drift
   * for AWS CloudFormation stacks. Ensure to attach `config.amazonaws.com` trusted
   * permissions and `ReadOnlyAccess` policy permissions. For specific policy permissions,
   * refer to https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html.
   *
   * @default - A role will be created
   */
  readonly role?: iam.IRole;
}

/**
 * Checks whether your CloudFormation stacks' actual configuration differs, or
 * has drifted, from its expected configuration.
 *
 * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudformation-stack-drift-detection-check.html
 *
 * @resource AWS::Config::ConfigRule
 */
export class CloudFormationStackDriftDetectionCheck extends ManagedRule {
  private readonly role: iam.IRole;

  constructor(scope: Construct, id: string, props: CloudFormationStackDriftDetectionCheckProps = {}) {
    super(scope, id, {
      ...props,
      identifier: 'CLOUDFORMATION_STACK_DRIFT_DETECTION_CHECK',
      inputParameters: {
        cloudformationRoleArn: Lazy.stringValue({ produce: () => this.role.roleArn }),
      },
    });

    this.scopeToResource('AWS::CloudFormation::Stack', props.ownStackOnly ? Stack.of(this).stackId : undefined);

    this.role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('config.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'),
      ],
    });
  }
}

/**
 * Construction properties for a CloudFormationStackNotificationCheck.
 */
export interface CloudFormationStackNotificationCheckProps extends RuleProps {
  /**
   * A list of allowed topics. At most 5 topics.
   *
   * @default - No topics.
   */
  readonly topics?: sns.ITopic[];
}

/**
 * Checks whether your CloudFormation stacks are sending event notifications to
 * a SNS topic. Optionally checks whether specified SNS topics are used.
 *
 * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudformation-stack-notification-check.html
 *
 * @resource AWS::Config::ConfigRule
 */
export class CloudFormationStackNotificationCheck extends ManagedRule {
  constructor(scope: Construct, id: string, props: CloudFormationStackNotificationCheckProps = {}) {
    if (props.topics && props.topics.length > 5) {
      throw new Error('At most 5 topics can be specified.');
    }

    super(scope, id, {
      ...props,
      identifier: 'CLOUDFORMATION_STACK_NOTIFICATION_CHECK',
      inputParameters: props.topics && props.topics.reduce(
        (params, topic, idx) => ({ ...params, [`snsTopic${idx + 1}`]: topic.topicArn }),
        {},
      ),
    });

    this.scopeToResource('AWS::CloudFormation::Stack');
  }
}

export class ManagedRuleIdentifier {
  /**
   * Checks that the inline policies attached to your AWS Identity and Access Management users,
   * roles, and groups do not allow blocked actions on all AWS Key Management Service keys.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-inline-policy-blocked-kms-actions.html
   */
  public static readonly IAM_INLINE_POLICY_BLOCKED_KMS_ACTIONS = 'IAM_INLINE_POLICY_BLOCKED_KMS_ACTIONS';

  /**
   * Checks that the managed AWS Identity and Access Management policies that you create do not
   * allow blocked actions on all AWS AWS KMS keys.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/iam-customer-policy-blocked-kms-actions.html
   */
  public static readonly IAM_CUSTOMER_POLICY_BLOCKED_KMS_ACTIONS = 'IAM_CUSTOMER_POLICY_BLOCKED_KMS_ACTIONS';

  /**
   * Checks whether the active access keys are rotated within the number of days specified in maxAccessKeyAge.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/access-keys-rotated.html
   */
  public static readonly ACCESS_KEY_ROTATED = 'ACCESS_KEY_ROTATED';

  /**
   * Checks whether AWS account is part of AWS Organizations.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/account-part-of-organizations.html
   */
  public static readonly ACCOUNT_PART_OF_ORGANIZATIONS = 'ACCOUNT_PART_OF_ORGANIZATIONS';

  /**
   * Checks whether ACM Certificates in your account are marked for expiration within the specified number of days.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/acm-certificate-expiration-check.html
   */
  public static readonly ACM_CERTIFICATE_EXPIRATION_CHECK = 'ACM_CERTIFICATE_EXPIRATION_CHECK';

  /**
   * Checks if rule evaluates Application Load Balancers (ALBs) to ensure they are configured to drop http headers.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/alb-http-drop-invalid-header-enabled.html
   */
  public static readonly ALB_HTTP_DROP_INVALID_HEADER_ENABLED = 'ALB_HTTP_DROP_INVALID_HEADER_ENABLED';

  /**
   * Checks whether HTTP to HTTPS redirection is configured on all HTTP listeners of Application Load Balancer.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/alb-http-to-https-redirection-check.html
   */
  public static readonly ALB_HTTP_TO_HTTPS_REDIRECTION_CHECK = 'ALB_HTTP_TO_HTTPS_REDIRECTION_CHECK';

  /**
   * Checks if Web Application Firewall (WAF) is enabled on Application Load Balancers (ALBs).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/alb-waf-enabled.html
   */
  public static readonly ALB_WAF_ENABLED = 'ALB_WAF_ENABLED';

  /**
   * Checks that all methods in Amazon API Gateway stages have caching enabled and encrypted.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/api-gw-cache-enabled-and-encrypted.html
   */
  public static readonly API_GW_CACHE_ENABLED_AND_ENCRYPTED = 'API_GW_CACHE_ENABLED_AND_ENCRYPTED';

  /**
   * Checks that Amazon API Gateway APIs are of the type specified in the rule parameter endpointConfigurationType.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/api-gw-endpoint-type-check.html
   */
  public static readonly API_GW_ENDPOINT_TYPE_CHECK = 'API_GW_ENDPOINT_TYPE_CHECK';

  /**
   * Checks that all methods in Amazon API Gateway stage has logging enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/api-gw-execution-logging-enabled.html
   */
  public static readonly API_GW_EXECUTION_LOGGING_ENABLED = 'API_GW_EXECUTION_LOGGING_ENABLED';

  /**
   * Checks whether running instances are using specified AMIs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/approved-amis-by-id.html
   */
  public static readonly APPROVED_AMIS_BY_ID = 'APPROVED_AMIS_BY_ID';

  /**
   * Checks whether running instances are using specified AMIs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/approved-amis-by-tag.html
   */
  public static readonly APPROVED_AMIS_BY_TAG = 'APPROVED_AMIS_BY_TAG';

  /**
   * Checks whether your Auto Scaling groups that are associated with a load balancer are using
   * Elastic Load Balancing health checks.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/autoscaling-group-elb-healthcheck-required.html
   */
  public static readonly AUTOSCALING_GROUP_ELB_HEALTHCHECK_REQUIRED = 'AUTOSCALING_GROUP_ELB_HEALTHCHECK_REQUIRED';

  /**
   * Checks whether an AWS CloudFormation stack's actual configuration differs, or has drifted,
   * from it's expected configuration.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudformation-stack-drift-detection-check.html
   */
  public static readonly CLOUDFORMATION_STACK_DRIFT_DETECTION_CHECK = 'CLOUDFORMATION_STACK_DRIFT_DETECTION_CHECK';

  /**
   * Checks whether your CloudFormation stacks are sending event notifications to an SNS topic.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudformation-stack-notification-check.html
   */
  public static readonly CLOUDFORMATION_STACK_NOTIFICATION_CHECK = 'CLOUDFORMATION_STACK_NOTIFICATION_CHECK';

  /**
   * Checks if an Amazon CloudFront distribution is configured to return a specific object that is the default root object.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-default-root-object-configured.html
   */
  public static readonly CLOUDFRONT_DEFAULT_ROOT_OBJECT_CONFIGURED = 'CLOUDFRONT_DEFAULT_ROOT_OBJECT_CONFIGURED';

  /**
   * Checks that Amazon CloudFront distribution with Amazon S3 Origin type has Origin Access Identity (OAI) configured.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-origin-access-identity-enabled.html
   */
  public static readonly CLOUDFRONT_ORIGIN_ACCESS_IDENTITY_ENABLED = 'CLOUDFRONT_ORIGIN_ACCESS_IDENTITY_ENABLED';

  /** Checks whether an origin group is configured for the distribution of at least 2 origins in the
   * origin group for Amazon CloudFront.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-origin-failover-enabled.html
   */
  public static readonly CLOUDFRONT_ORIGIN_FAILOVER_ENABLED = 'CLOUDFRONT_ORIGIN_FAILOVER_ENABLED';

  /**
   * Checks if Amazon CloudFront distributions are using a custom SSL certificate and are configured
   * to use SNI to serve HTTPS requests.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-sni-enabled.html
   */
  public static readonly CLOUDFRONT_SNI_ENABLED = 'CLOUDFRONT_SNI_ENABLED';

  /** Checks whether your Amazon CloudFront distributions use HTTPS (directly or via a redirection).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudfront-viewer-policy-https.html
   */
  public static readonly CLOUDFRONT_VIEWER_POLICY_HTTPS = 'CLOUDFRONT_VIEWER_POLICY_HTTPS';

  /**
   * Checks whether AWS CloudTrail trails are configured to send logs to Amazon CloudWatch Logs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloud-trail-cloud-watch-logs-enabled.html
   */
  public static readonly CLOUD_TRAIL_CLOUD_WATCH_LOGS_ENABLED = 'CLOUD_TRAIL_CLOUD_WATCH_LOGS_ENABLED';

  /**
   * Checks whether AWS CloudTrail is enabled in your AWS account.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudtrail-enabled.html
   */
  public static readonly CLOUD_TRAIL_ENABLED = 'CLOUD_TRAIL_ENABLED';

  /**
   * Checks whether AWS CloudTrail is configured to use the server side encryption (SSE)
   * AWS Key Management Service (AWS KMS) customer master key (CMK) encryption.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloud-trail-encryption-enabled.html
   */
  public static readonly CLOUD_TRAIL_ENCRYPTION_ENABLED = 'CLOUD_TRAIL_ENCRYPTION_ENABLED';

  /**
   * Checks whether AWS CloudTrail creates a signed digest file with logs.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloud-trail-log-file-validation-enabled.html
   */
  public static readonly CLOUD_TRAIL_LOG_FILE_VALIDATION_ENABLED = 'CLOUD_TRAIL_LOG_FILE_VALIDATION_ENABLED';

  /**
   * Checks whether at least one AWS CloudTrail trail is logging Amazon S3 data events for all S3 buckets.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudtrail-s3-dataevents-enabled.html
   */
  public static readonly CLOUDTRAIL_S3_DATAEVENTS_ENABLED = 'CLOUDTRAIL_S3_DATAEVENTS_ENABLED';

  /**
   * Checks that there is at least one AWS CloudTrail trail defined with security best practices.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudtrail-security-trail-enabled.html
   */
  public static readonly CLOUDTRAIL_SECURITY_TRAIL_ENABLED = 'CLOUDTRAIL_SECURITY_TRAIL_ENABLED';

  /**
   * Checks whether CloudWatch alarms have at least one alarm action, one INSUFFICIENT_DATA action,
   * or one OK action enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudwatch-alarm-action-check.html
   */
  public static readonly CLOUDWATCH_ALARM_ACTION_CHECK = 'CLOUDWATCH_ALARM_ACTION_CHECK';

  /**
   * Checks whether the specified resource type has a CloudWatch alarm for the specified metric.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudwatch-alarm-resource-check.html
   */
  public static readonly CLOUDWATCH_ALARM_RESOURCE_CHECK = 'CLOUDWATCH_ALARM_RESOURCE_CHECK';

  /**
   * Checks whether CloudWatch alarms with the given metric name have the specified settings.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudwatch-alarm-settings-check.html
   */
  public static readonly CLOUDWATCH_ALARM_SETTINGS_CHECK = 'CLOUDWATCH_ALARM_SETTINGS_CHECK';

  /**
   * Checks whether a log group in Amazon CloudWatch Logs is encrypted with
   * a AWS Key Management Service (KMS) managed Customer Master Keys (CMK).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cloudwatch-log-group-encrypted.html
   */
  public static readonly CLOUDWATCH_LOG_GROUP_ENCRYPTED = 'CLOUDWATCH_LOG_GROUP_ENCRYPTED';

  /**
   * Checks that key rotation is enabled for each key and matches to the key ID of the
   * customer created customer master key (CMK).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cmk-backing-key-rotation-enabled.html
   */
  public static readonly CMK_BACKING_KEY_ROTATION_ENABLED = 'CMK_BACKING_KEY_ROTATION_ENABLED';

  /**
   * Checks whether the project contains environment variables AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codebuild-project-envvar-awscred-check.html
   */
  public static readonly CODEBUILD_PROJECT_ENVVAR_AWSCRED_CHECK = 'CODEBUILD_PROJECT_ENVVAR_AWSCRED_CHECK';

  /**
   * Checks whether the GitHub or Bitbucket source repository URL contains either personal access tokens
   * or user name and password.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codebuild-project-source-repo-url-check.html
   */
  public static readonly CODEBUILD_PROJECT_SOURCE_REPO_URL_CHECK = 'CODEBUILD_PROJECT_SOURCE_REPO_URL_CHECK';

  /**
   * Checks whether the first deployment stage of the AWS CodePipeline performs more than one deployment.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codepipeline-deployment-count-check.html
   */
  public static readonly CODEPIPELINE_DEPLOYMENT_COUNT_CHECK = 'CODEPIPELINE_DEPLOYMENT_COUNT_CHECK';

  /**
   * Checks whether each stage in the AWS CodePipeline deploys to more than N times the number of
   * the regions the AWS CodePipeline has deployed in all the previous combined stages,
   * where N is the region fanout number.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/codepipeline-region-fanout-check.html
   */
  public static readonly CODEPIPELINE_REGION_FANOUT_CHECK = 'CODEPIPELINE_REGION_FANOUT_CHECK';

  /**
   * Checks whether Amazon CloudWatch LogGroup retention period is set to specific number of days.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/cw-loggroup-retention-period-check.html
   */
  public static readonly CW_LOGGROUP_RETENTION_PERIOD_CHECK = 'CW_LOGGROUP_RETENTION_PERIOD_CHECK';

  /**
   * Checks that DynamoDB Accelerator (DAX) clusters are encrypted.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dax-encryption-enabled.html
   */
  public static readonly DAX_ENCRYPTION_ENABLED = 'DAX_ENCRYPTION_ENABLED';

  /**
   * Checks whether RDS DB instances have backups enabled.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/db-instance-backup-enabled.html
   */
  public static readonly RDS_DB_INSTANCE_BACKUP_ENABLED = 'DB_INSTANCE_BACKUP_ENABLED'

  /**
   * Checks instances for specified tenancy.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/desired-instance-tenancy.html
   */
  public static readonly EC2_DESIRED_INSTANCE_TENANCY = 'DESIRED_INSTANCE_TENANCY';

  /**
   * Checks whether your EC2 instances are of the specified instance types.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/desired-instance-type.html
   */
  public static readonly EC2_DESIRED_INSTANCE_TYPE = 'DESIRED_INSTANCE_TYPE';

  /**
   * Checks whether AWS Database Migration Service replication instances are public.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dms-replication-not-public.html
   */
  public static readonly DMS_REPLICATION_NOT_PUBLIC = 'DMS_REPLICATION_NOT_PUBLIC';

  /**
   * Checks whether Auto Scaling or On-Demand is enabled on your DynamoDB tables and/or global secondary indexes.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-autoscaling-enabled.html
   */
  public static readonly DYNAMODB_AUTOSCALING_ENABLED = 'DYNAMODB_AUTOSCALING_ENABLED';

  /**
   * Checks whether Amazon DynamoDB table is present in AWS Backup plans. 
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-in-backup-plan.html
   */
  public static readonly DYNAMODB_IN_BACKUP_PLAN = 'DYNAMODB_IN_BACKUP_PLAN';

  /**
   * Checks that point in time recovery (PITR) is enabled for Amazon DynamoDB tables.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-pitr-enabled.html
   */
  public static readonly DYNAMODB_PITR_ENABLED = 'DYNAMODB_PITR_ENABLED';

  /**
   * Checks whether Amazon DynamoDB table is encrypted with AWS Key Management Service (KMS).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-table-encrypted-kms.html
   */
  public static readonly DYNAMODB_TABLE_ENCRYPTED_KMS = 'DYNAMODB_TABLE_ENCRYPTED_KMS';

  /**
   * Checks whether the Amazon DynamoDB tables are encrypted and checks their status.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-table-encryption-enabled.html
   */
  public static readonly DYNAMODB_TABLE_ENCRYPTION_ENABLED = 'DYNAMODB_TABLE_ENCRYPTION_ENABLED';

  /**
   * Checks whether provisioned DynamoDB throughput is approaching the maximum limit for your account.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/dynamodb-throughput-limit-check.html
   */
  public static readonly DYNAMODB_THROUGHPUT_LIMIT_CHECK = 'DYNAMODB_THROUGHPUT_LIMIT_CHECK';

  /**
   * Checks if Amazon Elastic Block Store (Amazon EBS) volumes are added in backup plans of AWS Backup.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ebs-in-backup-plan.html
   */
  public static readonly EBS_IN_BACKUP_PLAN = 'EBS_IN_BACKUP_PLAN';

  /**
   * Checks whether Amazon Elastic File System (Amazon EFS) file systems are added
   * in the backup plans of AWS Backup.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/efs-in-backup-plan.html
   */
  public static readonly EFS_IN_BACKUP_PLAN = 'EFS_IN_BACKUP_PLAN';

  /**
   * Check that Amazon Elastic Block Store (EBS) encryption is enabled by default.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-ebs-encryption-by-default.html
   */
  public static readonly EC2_EBS_ENCRYPTION_BY_DEFAULT = 'EC2_EBS_ENCRYPTION_BY_DEFAULT';

  /**
   * Checks whether EBS optimization is enabled for your EC2 instances that can be EBS-optimized.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ebs-optimized-instance.html
   */
  public static readonly EBS_OPTIMIZED_INSTANCE = 'EBS_OPTIMIZED_INSTANCE';

  /**
   * Checks whether Amazon Elastic Block Store snapshots are not publicly restorable.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ebs-snapshot-public-restorable-check.html
   */
  public static readonly EBS_SNAPSHOT_PUBLIC_RESTORABLE_CHECK = 'EBS_SNAPSHOT_PUBLIC_RESTORABLE_CHECK';

  /**
   * Checks whether detailed monitoring is enabled for EC2 instances.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-instance-detailed-monitoring-enabled.html
   */
  public static readonly EC2_INSTANCE_DETAILED_MONITORING_ENABLED = 'EC2_INSTANCE_DETAILED_MONITORING_ENABLED';

  /**
   * Checks whether the Amazon EC2 instances in your account are managed by AWS Systems Manager.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-instance-managed-by-systems-manager.html
   */
  public static readonly EC2_INSTANCE_MANAGED_BY_SSM = 'EC2_INSTANCE_MANAGED_BY_SSM';

  /**
   * Checks whether Amazon Elastic Compute Cloud (Amazon EC2) instances have a public IP association.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-instance-no-public-ip.html
   */
  public static readonly EC2_INSTANCE_NO_PUBLIC_IP = 'EC2_INSTANCE_NO_PUBLIC_IP';

  /**
   * Checks whether your EC2 instances belong to a virtual private cloud (VPC).
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-instances-in-vpc.html
   */
  public static readonly INSTANCES_IN_VPC = 'INSTANCES_IN_VPC';

  /**
   * Checks that none of the specified applications are installed on the instance.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-managedinstance-applications-blacklisted.html
   */
  public static readonly EC2_MANAGEDINSTANCE_APPLICATIONS_BLACKLISTED = 'EC2_MANAGEDINSTANCE_APPLICATIONS_BLACKLISTED';

  /**
   * Checks whether all of the specified applications are installed on the instance.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-managedinstance-applications-required.html
   */
  public static readonly EC2_MANAGEDINSTANCE_APPLICATIONS_REQUIRED = 'EC2_MANAGEDINSTANCE_APPLICATIONS_REQUIRED';

  /**
   * Checks whether the compliance status of AWS Systems Manager association compliance is COMPLIANT
   * or NON_COMPLIANT after the association execution on the instance.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-managedinstance-association-compliance-status-check.html
   */
  public static readonly EC2_MANAGEDINSTANCE_ASSOCIATION_COMPLIANCE_STATUS_CHECK = 'EC2_MANAGEDINSTANCE_ASSOCIATION_COMPLIANCE_STATUS_CHECK';

  /**
   * Checks whether instances managed by AWS Systems Manager are configured to collect blacklisted inventory types.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-managedinstance-inventory-blacklisted.html
   */
  public static readonly EC2_MANAGEDINSTANCE_INVENTORY_BLACKLISTED = ' EC2_MANAGEDINSTANCE_INVENTORY_BLACKLISTED'

  /**
   * Checks whether the compliance status of the Amazon EC2 Systems Manager patch compliance is
   * COMPLIANT or NON_COMPLIANT after the patch installation on the instance.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-managedinstance-patch-compliance-status-check.html
   */
  public static readonly EC2_MANAGEDINSTANCE_PATCH_COMPLIANCE_STATUS_CHECK = 'EC2_MANAGEDINSTANCE_PATCH_COMPLIANCE_STATUS_CHECK';

  /**
   * Checks whether EC2 managed instances have the desired configurations.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-managedinstance-platform-check.html
   */
  public static readonly EC2_MANAGEDINSTANCE_PLATFORM_CHECK = ' EC2_MANAGEDINSTANCE_PLATFORM_CHECK';

  /**
   * Checks that security groups are attached to Amazon Elastic Compute Cloud (Amazon EC2) instances
   * or to an elastic network interface.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-security-group-attached-to-eni.html
   */
  public static readonly EC2_SECURITY_GROUP_ATTACHED_TO_ENI = 'EC2_SECURITY_GROUP_ATTACHED_TO_ENI';

  /**
   * Checks whether there are instances stopped for more than the allowed number of days.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-stopped-instance.html
   */
  public static readonly EC2_STOPPED_INSTANCE = 'EC2_STOPPED_INSTANCE';

  /**
   * Checks whether EBS volumes are attached to EC2 instances.
   * @see https://docs.aws.amazon.com/config/latest/developerguide/ec2-volume-inuse-check.html
   */
  public static readonly EC2_VOLUME_INUSE_CHECK = 'EC2_VOLUME_INUSE_CHECK';
}