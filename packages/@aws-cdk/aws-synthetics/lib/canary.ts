import * as crypto from 'crypto';
import { Metric, MetricOptions, MetricProps } from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Code } from './code';
import { Runtime } from './runtime';
import { Schedule } from './schedule';
import { CloudWatchSyntheticsMetrics } from './synthetics-canned-metrics.generated';
import { CfnCanary } from './synthetics.generated';

/**
 * Specify a test that the canary should run
 */
export class Test {
  /**
   * Specify a custom test with your own code
   *
   * @returns `Test` associated with the specified Code object
   * @param options The configuration options
   */
  public static custom(options: CustomTestOptions): Test {
    Test.validateHandler(options.handler);
    return new Test(options.code, options.handler);
  }

  /**
   * Verifies that the given handler ends in '.handler'. Returns the handler if successful and
   * throws an error if not.
   *
   * @param handler - the handler given by the user
   */
  private static validateHandler(handler: string) {
    if (!handler.endsWith('.handler')) {
      throw new Error(`Canary Handler must end in '.handler' (${handler})`);
    }
    if (handler.length > 21) {
      throw new Error(`Canary Handler must be less than 21 characters (${handler})`);
    }
  }

  /**
   * Construct a Test property
   *
   * @param code The code that the canary should run
   * @param handler The handler of the canary
   */
  private constructor(public readonly code: Code, public readonly handler: string) {
  }
}

/**
 * Properties for specifying a test
 */
export interface CustomTestOptions {
  /**
   * The code of the canary script
   */
  readonly code: Code,

  /**
   * The handler for the code. Must end with `.handler`.
   */
  readonly handler: string,
}

/**
 * Options for specifying the s3 location that stores the data of each canary run. The artifacts bucket location **cannot**
 * be updated once the canary is created.
 */
export interface ArtifactsBucketLocation {
  /**
   * The s3 location that stores the data of each run.
   */
  readonly bucket: s3.IBucket;

  /**
   * The S3 bucket prefix. Specify this if you want a more specific path within the artifacts bucket.
   *
   * @default - no prefix
   */
  readonly prefix?: string;
}

/**
 * Properties for a canary
 */
export interface CanaryProps {
  /**
   * The s3 location that stores the data of the canary runs.
   *
   * @default - A new s3 bucket will be created without a prefix.
   */
  readonly artifactsBucketLocation?: ArtifactsBucketLocation;

  /**
   * Canary execution role.
   *
   * This is the role that will be assumed by the canary upon execution.
   * It controls the permissions that the canary will have. The role must
   * be assumable by the AWS Lambda service principal.
   *
   * If not supplied, a role will be created with all the required permissions.
   * If you provide a Role, you must add the required permissions.
   *
   * @see required permissions: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-executionrolearn
   *
   * @default - A unique role will be generated for this canary.
   * You can add permissions to roles by calling 'addToRolePolicy'.
   */
  readonly role?: iam.IRole;

  /**
   * How long the canary will be in a 'RUNNING' state. For example, if you set `timeToLive` to be 1 hour and `schedule` to be `rate(10 minutes)`,
   * your canary will run at 10 minute intervals for an hour, for a total of 6 times.
   *
   * @default - no limit
   */
  readonly timeToLive?: cdk.Duration;

  /**
   * Specify the schedule for how often the canary runs. For example, if you set `schedule` to `rate(10 minutes)`, then the canary will run every 10 minutes.
   * You can set the schedule with `Schedule.rate(Duration)` (recommended) or you can specify an expression using `Schedule.expression()`.
   * @default 'rate(5 minutes)'
   */
  readonly schedule?: Schedule;

  /**
   * Whether or not the canary should start after creation.
   *
   * @default true
   */
  readonly startAfterCreation?: boolean;

  /**
   * How many days should successful runs be retained.
   *
   * @default Duration.days(31)
   */
  readonly successRetentionPeriod?: cdk.Duration;

  /**
   * How many days should failed runs be retained.
   *
   * @default Duration.days(31)
   */
  readonly failureRetentionPeriod?: cdk.Duration;

  /**
   * The name of the canary. Be sure to give it a descriptive name that distinguishes it from
   * other canaries in your account.
   *
   * Do not include secrets or proprietary information in your canary name. The canary name
   * makes up part of the canary ARN, which is included in outbound calls over the internet.
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/servicelens_canaries_security.html
   *
   * @default - A unique name will be generated from the construct ID
   */
  readonly canaryName?: string;

  /**
   * Specify the runtime version to use for the canary.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_Library.html
   */
  readonly runtime: Runtime;

  /**
   * The type of test that you want your canary to run. Use `Test.custom()` to specify the test to run.
   */
  readonly test: Test;

  /**
   * Key-value pairs that the Synthetics caches and makes available for your canary scripts. Use environment variables
   * to apply configuration changes, such as test and production environment configurations, without changing your
   * Canary script source code.
   *
   * @default - No environment variables.
   */
  readonly environmentVariables?: { [key: string]: string };

  /**
   * The VPC where this canary is run.
   *
   * Specify this if the canary needs to access resources in a VPC.
   *
   * @default - Not in VPC
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Where to place the network interfaces within the VPC. You must provide `vpc` when using this prop.
   *
   * @default - the Vpc default strategy if not specified
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The list of security groups to associate with the canary's network interfaces. You must provide `vpc` when using this prop.
   *
   * @default - If the canary is placed within a VPC and a security group is
   * not specified a dedicated security group will be created for this canary.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * Whether or not to delete the lambda resources when the canary is deleted
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-deletelambdaresourcesoncanarydeletion
   *
   * @default false
   */
  readonly enableAutoDeleteLambdas?: boolean;
}

/**
 * Define a new Canary
 */
export class Canary extends cdk.Resource implements ec2.IConnectable {
  /**
   * Execution role associated with this Canary.
   */
  public readonly role: iam.IRole;

  /**
   * The canary ID
   * @attribute
   */
  public readonly canaryId: string;

  /**
   * The state of the canary. For example, 'RUNNING', 'STOPPED', 'NOT STARTED', or 'ERROR'.
   * @attribute
   */
  public readonly canaryState: string;

  /**
   * The canary Name
   * @attribute
   */
  public readonly canaryName: string;

  /**
   * Bucket where data from each canary run is stored.
   */
  public readonly artifactsBucket: s3.IBucket;

  /**
   * Actual connections object for the underlying Lambda
   *
   * May be unset, in which case the canary Lambda is not configured for use in a VPC.
   * @internal
   */
  private readonly _connections?: ec2.Connections;

  public constructor(scope: Construct, id: string, props: CanaryProps) {
    if (props.canaryName && !cdk.Token.isUnresolved(props.canaryName)) {
      validateName(props.canaryName);
    }

    super(scope, id, {
      physicalName: props.canaryName || cdk.Lazy.string({
        produce: () => this.generateUniqueName(),
      }),
    });

    this.artifactsBucket = props.artifactsBucketLocation?.bucket ?? new s3.Bucket(this, 'ArtifactsBucket', {
      encryption: s3.BucketEncryption.KMS_MANAGED,
      enforceSSL: true,
    });

    this.role = props.role ?? this.createDefaultRole(props);

    if (props.vpc) {
      // Security Groups are created and/or appended in `createVpcConfig`.
      this._connections = new ec2.Connections({});
    }

    const resource: CfnCanary = new CfnCanary(this, 'Resource', {
      artifactS3Location: this.artifactsBucket.s3UrlForObject(props.artifactsBucketLocation?.prefix),
      executionRoleArn: this.role.roleArn,
      startCanaryAfterCreation: props.startAfterCreation ?? true,
      runtimeVersion: props.runtime.name,
      name: this.physicalName,
      schedule: this.createSchedule(props),
      failureRetentionPeriod: props.failureRetentionPeriod?.toDays(),
      successRetentionPeriod: props.successRetentionPeriod?.toDays(),
      code: this.createCode(props),
      runConfig: this.createRunConfig(props),
      vpcConfig: this.createVpcConfig(props),
      deleteLambdaResourcesOnCanaryDeletion: props.enableAutoDeleteLambdas,
    });

    this.canaryId = resource.attrId;
    this.canaryState = resource.attrState;
    this.canaryName = this.getResourceNameAttribute(resource.ref);
  }

  /**
   * Access the Connections object
   *
   * Will fail if not a VPC-enabled Canary
   */
  public get connections(): ec2.Connections {
    if (!this._connections) {
      // eslint-disable-next-line max-len
      throw new Error('Only VPC-associated Canaries have security groups to manage. Supply the "vpc" parameter when creating the Canary.');
    }
    return this._connections;
  }

  /**
   * Measure the Duration of a single canary run, in seconds.
   *
   * @param options - configuration options for the metric
   *
   * @default avg over 5 minutes
   */
  public metricDuration(options?: MetricOptions): Metric {
    return new Metric({
      ...CloudWatchSyntheticsMetrics.durationMaximum({ CanaryName: this.canaryName }),
      ...{ statistic: 'Average' },
      ...options,
    }).attachTo(this);
  }

  /**
   * Measure the percentage of successful canary runs.
   *
   * @param options - configuration options for the metric
   *
   * @default avg over 5 minutes
   */
  public metricSuccessPercent(options?: MetricOptions): Metric {
    return this.cannedMetric(CloudWatchSyntheticsMetrics.successPercentAverage, options);
  }

  /**
   * Measure the number of failed canary runs over a given time period.
   *
   * Default: sum over 5 minutes
   *
   * @param options - configuration options for the metric
   */
  public metricFailed(options?: MetricOptions): Metric {
    return this.cannedMetric(CloudWatchSyntheticsMetrics.failedSum, options);
  }

  /**
   * Returns a default role for the canary
   */
  private createDefaultRole(props: CanaryProps): iam.IRole {
    const prefix = props.artifactsBucketLocation?.prefix;

    // Created role will need these policies to run the Canary.
    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-executionrolearn
    const policy = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          resources: ['*'],
          actions: ['s3:ListAllMyBuckets'],
        }),
        new iam.PolicyStatement({
          resources: [this.artifactsBucket.bucketArn],
          actions: ['s3:GetBucketLocation'],
        }),
        new iam.PolicyStatement({
          resources: [this.artifactsBucket.arnForObjects(`${prefix ? prefix+'/*' : '*'}`)],
          actions: ['s3:PutObject'],
        }),
        new iam.PolicyStatement({
          resources: ['*'],
          actions: ['cloudwatch:PutMetricData'],
          conditions: { StringEquals: { 'cloudwatch:namespace': 'CloudWatchSynthetics' } },
        }),
        new iam.PolicyStatement({
          resources: [this.logGroupArn()],
          actions: ['logs:CreateLogStream', 'logs:CreateLogGroup', 'logs:PutLogEvents'],
        }),
      ],
    });

    const managedPolicies: iam.IManagedPolicy[] = [];

    if (props.vpc) {
      // Policy that will have ENI creation permissions
      managedPolicies.push(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'));
    }

    return new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        canaryPolicy: policy,
      },
      managedPolicies,
    });
  }

  private logGroupArn() {
    return cdk.Stack.of(this).formatArn({
      service: 'logs',
      resource: 'log-group',
      arnFormat: cdk.ArnFormat.COLON_RESOURCE_NAME,
      resourceName: '/aws/lambda/cwsyn-*',
    });
  }

  /**
   * Returns the code object taken in by the canary resource.
   */
  private createCode(props: CanaryProps): CfnCanary.CodeProperty {
    const codeConfig = {
      handler: props.test.handler,
      ...props.test.code.bind(this, props.test.handler, props.runtime.family),
    };
    return {
      handler: codeConfig.handler,
      script: codeConfig.inlineCode,
      s3Bucket: codeConfig.s3Location?.bucketName,
      s3Key: codeConfig.s3Location?.objectKey,
      s3ObjectVersion: codeConfig.s3Location?.objectVersion,
    };
  }

  private createRunConfig(props: CanaryProps): CfnCanary.RunConfigProperty | undefined {
    if (!props.environmentVariables) {
      return undefined;
    }
    return {
      environmentVariables: props.environmentVariables,
    };
  }

  /**
   * Returns a canary schedule object
   */
  private createSchedule(props: CanaryProps): CfnCanary.ScheduleProperty {
    return {
      durationInSeconds: String(`${props.timeToLive?.toSeconds() ?? 0}`),
      expression: props.schedule?.expressionString ?? 'rate(5 minutes)',
    };
  }

  private createVpcConfig(props: CanaryProps): CfnCanary.VPCConfigProperty | undefined {
    if (!props.vpc) {
      if (props.vpcSubnets != null || props.securityGroups != null) {
        throw new Error("You must provide the 'vpc' prop when using VPC-related properties.");
      }

      return undefined;
    }

    const { subnetIds } = props.vpc.selectSubnets(props.vpcSubnets);
    if (subnetIds.length < 1) {
      throw new Error('No matching subnets found in the VPC.');
    }

    let securityGroups: ec2.ISecurityGroup[];
    if (props.securityGroups && props.securityGroups.length > 0) {
      securityGroups = props.securityGroups;
    } else {
      const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc: props.vpc,
        description: 'Automatic security group for Canary ' + cdk.Names.uniqueId(this),
      });
      securityGroups = [securityGroup];
    }
    this._connections!.addSecurityGroup(...securityGroups);

    return {
      vpcId: props.vpc.vpcId,
      subnetIds,
      securityGroupIds: cdk.Lazy.list({ produce: () => this.connections.securityGroups.map(sg => sg.securityGroupId) }),
    };
  }

  /**
   * Creates a unique name for the canary. The generated name is the physical ID of the canary.
   */
  private generateUniqueName(): string {
    const name = cdk.Names.uniqueId(this).toLowerCase().replace(' ', '-');
    if (name.length <= 21) {
      return name;
    } else {
      return name.substring(0, 15) + nameHash(name);
    }
  }

  private cannedMetric(
    fn: (dims: { CanaryName: string }) => MetricProps,
    props?: MetricOptions): Metric {
    return new Metric({
      ...fn({ CanaryName: this.canaryName }),
      ...props,
    }).attachTo(this);
  }
}

/**
 * Take a hash of the given name.
 *
 * @param name the name to be hashed
 */
function nameHash(name: string): string {
  const md5 = crypto.createHash('sha256').update(name).digest('hex');
  return md5.slice(0, 6);
}

const nameRegex: RegExp = /^[0-9a-z_\-]+$/;

/**
 * Verifies that the name fits the regex expression: ^[0-9a-z_\-]+$.
 *
 * @param name - the given name of the canary
 */
function validateName(name: string) {
  if (name.length > 21) {
    throw new Error(`Canary name is too large, must be between 1 and 21 characters, but is ${name.length} (got "${name}")`);
  }
  if (!nameRegex.test(name)) {
    throw new Error(`Canary name must be lowercase, numbers, hyphens, or underscores (got "${name}")`);
  }
}
