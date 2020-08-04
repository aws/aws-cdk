import * as crypto from 'crypto';
import { Metric, MetricOptions } from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Schedule } from './schedule';
import { CfnCanary } from './synthetics.generated';
import { Test, TestOptions } from './test-script';


/**
 * Runtime options for a canary
 */
export class Runtime {
  /**
   * `syn-1.0` includes the following:
   *
   * Synthetics library 1.0
   *
   * Synthetics handler code 1.0
   *
   * Lambda runtime Node.js 10.x
   *
   * Puppeteer-core version 1.14.0
   *
   * The Chromium version that matches Puppeteer-core 1.14.0
   */
  public static readonly SYNTHETICS_1_0 = new Runtime('syn-1.0');

  public constructor(
    /**
     * The name of the runtime version
     */
    public readonly name: string){}
}

/**
 * Options for specifying the s3 location that stores the data of each canary run
 */
export interface ArtifactsBucketLocation {
  /**
   * The s3 location that stores the data of each run.
   */
  readonly bucket: s3.IBucket;

  /**
   * The key prefix of an S3 object. Specify this is you want a more specific key within the artifacts bucket.
   *
   * For example, if a key is specified, the resulting s3 location looks like this:
   * @example
   * s3://bucket/key
   *
   * If not specified, the s3 location looks like this:
   *
   * @example
   * s3://onlybucket
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
   * @default - A new s3 bucket will be created.
   */
  readonly artifactsBucketLocation?: ArtifactsBucketLocation;

  /**
   * Canary execution role.
   *
   * This is the role that will be assumed by the canary upon execution.
   * It controls the permissions that the canary will have. The Role must
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
   * Specify the runtime version to use for the canary. Currently, the only valid value is `Runtime.SYN_1.0`.
   *
   * @default Runtime.SYN_1_0
   */
  readonly runtime?: Runtime;

  /**
   * The type of test that you want your canary to run. Use `Test.custom()` to specify the test to run.
   */
  readonly test: Test;

}

/**
 * Define a new Canary
 */
export class Canary extends cdk.Resource {
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
   * The state of the canary. For example, RUNNING.
   * @attribute
   */
  public readonly canaryState: string;

  /**
   * The canary Name
   * @attribute
   */
  public readonly canaryName: string;

  /**
   * Bucket where data from each canary run is stored
   */
  private readonly artifactsBucket: s3.IBucket;

  public constructor(scope: cdk.Construct, id: string, props: CanaryProps) {
    if (props.canaryName && !cdk.Token.isUnresolved(props.canaryName)) {
      validateName(props.canaryName);
    }

    super(scope, id, {
      physicalName: props.canaryName || cdk.Lazy.stringValue({
        produce: () => this.generateUniqueName(),
      }),
    });

    this.artifactsBucket = props.artifactsBucketLocation?.bucket ?? new s3.Bucket(this, 'ServiceBucket', {
      encryption: s3.BucketEncryption.KMS_MANAGED,
    });

    this.role = props.role ?? this.createDefaultRole();

    const resource: CfnCanary = new CfnCanary(this, 'Resource', {
      artifactS3Location: this.artifactsBucket.s3UrlForObject(props.artifactsBucketLocation?.prefix),
      executionRoleArn: this.role.roleArn,
      startCanaryAfterCreation: props.startAfterCreation !== false,
      runtimeVersion: props.runtime?.name ?? Runtime.SYNTHETICS_1_0.name,
      name: this.physicalName,
      schedule: this.createSchedule(props),
      failureRetentionPeriod: props.failureRetentionPeriod?.toDays(),
      successRetentionPeriod: props.successRetentionPeriod?.toDays(),
      code: this.createCode(props),
    });

    this.canaryId = resource.attrId;
    this.canaryState = resource.attrState;
    this.canaryName = this.getResourceNameAttribute(resource.ref);
  }

  /**
   * @param metricName - the name of the metric
   * @param options - configuration options for the metric
   *
   * @returns a CloudWatch metric associated with the canary.
   * @default avg over 5 minutes
   */
  private metric(metricName: string, options?: MetricOptions): Metric {
    return new Metric({
      metricName,
      namespace: 'CloudWatchSynthetics',
      dimensions: { CanaryName: this.canaryName },
      statistic: 'avg',
      ...options,
    }).attachTo(this);
  }

  /**
   * Measure the Duration of a single canary run, in seconds.
   *
   * @param options - configuration options for the metric
   *
   * @default avg over 5 minutes
   */
  public metricDuration(options?: MetricOptions): Metric {
    return this.metric('Duration', options);
  }

  /**
   * Measure the percentage of successful canary runs.
   *
   * @param options - configuration options for the metric
   *
   * @default avg over 5 minutes
   */
  public metricSuccessPercent(options?: MetricOptions): Metric {
    return this.metric('SuccessPercent', options);
  }

  /**
   * Measure the number of failed canary runs over a given time period.
   *
   * @param options - configuration options for the metric
   *
   * @default avg over 5 minutes
   */
  public metricFailed(options?: MetricOptions): Metric {
    return this.metric('Failed', options);
  }

  /**
   * Returns a default role for the canary
   */
  private createDefaultRole(): iam.IRole {
    // Created role will need these policies to run the Canary.
    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-synthetics-canary.html#cfn-synthetics-canary-executionrolearn
    const policy = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          resources: ['*'],
          actions: ['s3:ListAllMyBuckets'],
        }),
        new iam.PolicyStatement({
          resources: [this.artifactsBucket.arnForObjects('*')],
          actions: ['s3:PutObject', 's3:GetBucketLocation'],
        }),
        new iam.PolicyStatement({
          resources: ['*'],
          actions: ['cloudwatch:PutMetricData'],
          conditions: {StringEquals: {'cloudwatch:namespace': 'CloudWatchSynthetics'}},
        }),
        new iam.PolicyStatement({
          resources: ['arn:aws:logs:::*'],
          actions: ['logs:CreateLogStream', 'logs:CreateLogGroup', 'logs:PutLogEvents'],
        }),
      ],
    });

    return new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        canaryPolicy: policy,
      },
    });
  }

  /**
   * Returns the code object taken in by the canary resource.
   */
  private createCode(props: CanaryProps): CfnCanary.CodeProperty {
    let codeConfig: TestOptions;
    if(props.test.customCode){
      codeConfig = {
        handler: props.test.customCode.handler,
        ...props.test.customCode.code.bind(this, props.test.customCode.handler),
      };
    } else {
      codeConfig = props.test.testCode!;
    }
    return {
      handler: codeConfig.handler,
      script: codeConfig.inlineCode,
      s3Bucket: codeConfig.s3Location?.bucketName,
      s3Key: codeConfig.s3Location?.objectKey,
      s3ObjectVersion: codeConfig.s3Location?.objectVersion,
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

  /**
   * Creates a unique name for the canary. The generated name is the physical ID of the canary.
   */
  private generateUniqueName(): string {
    const name = this.node.uniqueId.toLowerCase().replace(' ', '-');
    if (name.length <= 21){
      return name;
    } else {
      return name.substring(0,15) + nameHash(name.substring(15));
    }
  }
}

/**
 * Take a hash of the given name.
 *
 * @param name the name to be hashed
 */
function nameHash(name: string): string {
  const md5 = crypto.createHash('md5').update(name).digest('hex');
  return md5.slice(0,6);
}

const nameRegex: RegExp = new RegExp('^[0-9a-z_\-]+$');

/**
 * Verifies that the name fits the regex expression: ^[0-9a-z_\-]+$.
 *
 * @param name - the given name of the canary
 */
function validateName(name: string) {
  if (name.length > 21) {
    throw new Error('Canary name is too large, must be <= 21 characters, but is ' + name.length);
  }
  if (!nameRegex.test(name)) {
    throw new Error(`Canary name must be lowercase, numbers, hyphens, or underscores (no spaces) (${name})`);
  }
}
