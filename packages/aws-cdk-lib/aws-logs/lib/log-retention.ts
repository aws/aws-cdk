import * as path from 'path';
import { Construct } from 'constructs';
import { RetentionDays } from './log-group';
import * as iam from '../../aws-iam';
import * as s3_assets from '../../aws-s3-assets';
import * as cdk from '../../core';
import { ArnFormat } from '../../core';

/**
 * Construction properties for a LogRetention.
 */
export interface LogRetentionProps {
  /**
   * The log group name.
   */
  readonly logGroupName: string;

  /**
   * The region where the log group should be created
   * @default - same region as the stack
   */
  readonly logGroupRegion?: string;

  /**
   * The number of days log events are kept in CloudWatch Logs.
   */
  readonly retention: RetentionDays;

  /**
   * The IAM role for the Lambda function associated with the custom resource.
   *
   * @default - A new role is created
   */
  readonly role?: iam.IRole;

  /**
   * Retry options for all AWS API calls.
   *
   * @default - AWS SDK default retry options
   */
  readonly logRetentionRetryOptions?: LogRetentionRetryOptions;

  /**
   * The removalPolicy for the log group when the stack is deleted
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: cdk.RemovalPolicy;
}

/**
 * Retry options for all AWS API calls.
 */
export interface LogRetentionRetryOptions {
  /**
   * The maximum amount of retries.
   *
   * @default 5
   */
  readonly maxRetries?: number;
  /**
   * The base duration to use in the exponential backoff for operation retries.
   *
   * @deprecated Unused since the upgrade to AWS SDK v3, which uses a different retry strategy
   * @default - none, not used anymore
   */
  readonly base?: cdk.Duration;
}

/**
 * Creates a custom resource to control the retention policy of a CloudWatch Logs
 * log group. The log group is created if it doesn't already exist. The policy
 * is removed when `retentionDays` is `undefined` or equal to `Infinity`.
 * Log group can be created in the region that is different from stack region by
 * specifying `logGroupRegion`
 */
export class LogRetention extends Construct {

  /**
   * The ARN of the LogGroup.
   */
  public readonly logGroupArn: string;

  constructor(scope: Construct, id: string, props: LogRetentionProps) {
    super(scope, id);

    // Custom resource provider
    const provider = this.ensureSingletonLogRetentionFunction(props);

    // if removalPolicy is DESTROY, add action for DeleteLogGroup
    if (props.removalPolicy === cdk.RemovalPolicy.DESTROY) {
      provider.grantDeleteLogGroup(props.logGroupName);
    }

    // Need to use a CfnResource here to prevent lerna dependency cycles
    // aws-cdk-lib/aws-cloudformation -> aws-cdk-lib/aws-lambda -> aws-cdk-lib/aws-cloudformation
    const retryOptions = props.logRetentionRetryOptions;
    const resource = new cdk.CfnResource(this, 'Resource', {
      type: 'Custom::LogRetention',
      properties: {
        ServiceToken: provider.functionArn,
        LogGroupName: props.logGroupName,
        LogGroupRegion: props.logGroupRegion,
        SdkRetry: retryOptions ? {
          maxRetries: retryOptions.maxRetries,
        } : undefined,
        RetentionInDays: props.retention === RetentionDays.INFINITE ? undefined : props.retention,
        RemovalPolicy: props.removalPolicy,
      },
    });

    const logGroupName = resource.getAtt('LogGroupName').toString();
    // Append ':*' at the end of the ARN to match with how CloudFormation does this for LogGroup ARNs
    // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#aws-resource-logs-loggroup-return-values
    this.logGroupArn = cdk.Stack.of(this).formatArn({
      region: props.logGroupRegion,
      service: 'logs',
      resource: 'log-group',
      resourceName: `${logGroupName}:*`,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  /**
   * Helper method to ensure that only one instance of LogRetentionFunction resources are in the stack mimicking the
   * behaviour of aws-cdk-lib/aws-lambda's SingletonFunction to prevent circular dependencies
   */
  private ensureSingletonLogRetentionFunction(props: LogRetentionProps) {
    const functionLogicalId = 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a';
    const existing = cdk.Stack.of(this).node.tryFindChild(functionLogicalId);
    if (existing) {
      return existing as LogRetentionFunction;
    }
    return new LogRetentionFunction(cdk.Stack.of(this), functionLogicalId, props);
  }
}

/**
 * Private provider Lambda function to support the log retention custom resource.
 */
class LogRetentionFunction extends Construct implements cdk.ITaggable {
  public readonly functionArn: cdk.Reference;

  public readonly tags: cdk.TagManager = new cdk.TagManager(cdk.TagType.KEY_VALUE, 'AWS::Lambda::Function');

  private readonly role: iam.IRole;

  constructor(scope: Construct, id: string, props: LogRetentionProps) {
    super(scope, id);

    const asset = new s3_assets.Asset(this, 'Code', {
      path: path.join(__dirname, '..', '..', 'custom-resource-handlers', 'dist', 'aws-logs', 'log-retention-handler'),
    });

    const role = props.role || new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
    });
    // Duplicate statements will be deduplicated by `PolicyDocument`
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:PutRetentionPolicy', 'logs:DeleteRetentionPolicy'],
      // We need '*' here because we will also put a retention policy on
      // the log group of the provider function. Referencing its name
      // creates a CF circular dependency.
      resources: ['*'],
    }));
    this.role = role;

    // Lambda function
    const resource = new cdk.CfnResource(this, 'Resource', {
      type: 'AWS::Lambda::Function',
      properties: {
        Handler: 'index.handler',
        Runtime: 'nodejs18.x',
        Timeout: cdk.Duration.minutes(15).toSeconds(),
        Code: {
          S3Bucket: asset.s3BucketName,
          S3Key: asset.s3ObjectKey,
        },
        Role: role.roleArn,
        Tags: this.tags.renderedTags,
      },
    });
    this.functionArn = resource.getAtt('Arn');

    asset.addResourceMetadata(resource, 'Code');

    // Function dependencies
    role.node.children.forEach((child) => {
      if (cdk.CfnResource.isCfnResource(child)) {
        resource.addDependency(child);
      }
      if (Construct.isConstruct(child) && child.node.defaultChild && cdk.CfnResource.isCfnResource(child.node.defaultChild)) {
        resource.addDependency(child.node.defaultChild);
      }
    });
  }

  /**
   * @internal
   */
  public grantDeleteLogGroup(logGroupName: string) {
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:DeleteLogGroup'],
      //Only allow deleting the specific log group.
      resources: [cdk.Stack.of(this).formatArn({
        service: 'logs',
        resource: 'log-group',
        resourceName: `${logGroupName}:*`,
        arnFormat: ArnFormat.COLON_RESOURCE_NAME,
      })],
    }));
  }
}
