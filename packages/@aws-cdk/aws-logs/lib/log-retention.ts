import * as path from 'path';
import * as iam from '@aws-cdk/aws-iam';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { RetentionDays } from './log-group';

/**
 * Construction properties for a LogRetention.
 */
export interface LogRetentionProps {
  /**
   * The log group name.
   */
  readonly logGroupName: string;

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
}

/**
 * Retry options for all AWS API calls.
 */
export interface LogRetentionRetryOptions {
  /**
   * The maximum amount of retries.
   *
   * @default 3 (AWS SDK default)
   */
  readonly maxRetries?: number;
  /**
   * The base duration to use in the exponential backoff for operation retries.
   *
   * @default Duration.millis(100) (AWS SDK default)
   */
  readonly base?: cdk.Duration;
}

/**
 * Creates a custom resource to control the retention policy of a CloudWatch Logs
 * log group. The log group is created if it doesn't already exist. The policy
 * is removed when `retentionDays` is `undefined` or equal to `Infinity`.
 */
export class LogRetention extends cdk.Construct {

  /**
   * The ARN of the LogGroup.
   */
  public readonly logGroupArn: string;

  constructor(scope: cdk.Construct, id: string, props: LogRetentionProps) {
    super(scope, id);

    // Custom resource provider
    const provider = this.ensureSingletonLogRetentionFunction(props);

    // Need to use a CfnResource here to prevent lerna dependency cycles
    // @aws-cdk/aws-cloudformation -> @aws-cdk/aws-lambda -> @aws-cdk/aws-cloudformation
    const retryOptions = props.logRetentionRetryOptions;
    const resource = new cdk.CfnResource(this, 'Resource', {
      type: 'Custom::LogRetention',
      properties: {
        ServiceToken: provider.getAtt('Arn'),
        LogGroupName: props.logGroupName,
        SdkRetry: retryOptions ? {
          maxRetries: retryOptions.maxRetries,
          base: retryOptions.base?.toMilliseconds(),
        } : undefined,
        RetentionInDays: props.retention === RetentionDays.INFINITE ? undefined : props.retention,
      },
    });

    const logGroupName = resource.getAtt('LogGroupName').toString();
    // Append ':*' at the end of the ARN to match with how CloudFormation does this for LogGroup ARNs
    // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#aws-resource-logs-loggroup-return-values
    this.logGroupArn = cdk.Stack.of(this).formatArn({
      service: 'logs',
      resource: 'log-group',
      resourceName: `${logGroupName}:*`,
      sep: ':',
    });
  }

  /**
   * This a helper method to ensure that only one instance of LogRetentionFunction resources are in the stack
   */
  private ensureSingletonLogRetentionFunction(props: LogRetentionProps) {
    const functionLogicalId = 'LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a';
    const existing = cdk.Stack.of(this).node.tryFindChild(functionLogicalId);
    if (existing) {
      // Just assume this is true
      return existing as LogRetentionFunction;
    }
    return new LogRetentionFunction(cdk.Stack.of(this), functionLogicalId, props);
  }
}

/**
 * This is a private Lambda function to support the log retention custom resource.
 */
class LogRetentionFunction extends cdk.CfnResource {
  constructor(scope: cdk.Construct, id: string, props: LogRetentionProps) {
    super(scope, id, {
      type: 'AWS::Lambda::Function',
      properties: {
        Handler: 'index.handler',
        Runtime: 'nodejs10.x',
      },
    });

    // Code
    const asset = new s3_assets.Asset(this, 'Code', {
      path: path.join(__dirname, 'log-retention-provider'),
    });
    this.addPropertyOverride('Code', {
      S3Bucket: asset.s3BucketName,
      S3Key: asset.s3ObjectKey,
    });

    // Role
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
    this.addPropertyOverride('Role', role.roleArn);

    // Function dependencies
    role.node.children.forEach((child) => {
      if (cdk.CfnResource.isCfnResource(child)) {
        this.addDependsOn(child);
      }
      if (cdk.Construct.isConstruct(child) && child.node.defaultChild && cdk.CfnResource.isCfnResource(child.node.defaultChild)) {
        this.addDependsOn(child.node.defaultChild);
      }
    });
  }
}
