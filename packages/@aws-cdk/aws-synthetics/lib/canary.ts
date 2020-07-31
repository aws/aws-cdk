import { Metric, MetricOptions } from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Schedule } from './schedule';
import { CfnCanary } from './synthetics.generated';

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
  public static readonly SYN_1_0 = new Runtime('syn-1.0');

  private constructor(
    /**
     * The name of the runtime version
     */
    public readonly name: string){}
}

/**
 * Options for specifying the s3 location that stores the data of each canary run
 */
export interface ArtifactsBucketOptions {
  /**
   * The s3 location that stores the data of each run.
   */
  readonly bucket: s3.IBucket;

  /**
   * The key prefix of an S3 object. For example, if a key is specified, the resulting s3 location looks like this:
   * @example
   * s3://bucket/key
   *
   * If not specified, the s3 location looks like this:
   *
   * @example
   * s3://onlybucket
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
  readonly artifactsBucket?: ArtifactsBucketOptions;

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
   * Specify the runtime version to use for the canary. Currently, the only valid value is `Runtime.SYN_1.0`.
   *
   * @default Runtime.SYN_1_0
   */
  readonly runtime?: Runtime;

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
   * Specify the endpoint that you want the canary code to hit. Alternatively, you can specify
   * your own canary script to run.
   *
   * 🚧 TODO: implement
   */
  //readonly test: Test;

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

    this.artifactsBucket = props.artifactsBucket?.bucket ?? new s3.Bucket(this, 'ServiceBucket', {
      encryption: s3.BucketEncryption.KMS_MANAGED,
    });

    this.role = props.role ?? this.createDefaultRole();

    //this.artifactsBucket.grantWrite(this.role);

    const resource: CfnCanary = new CfnCanary(this, 'Resource', {
      artifactS3Location: this.artifactsBucket.s3UrlForObject(props.artifactsBucket?.prefix),
      executionRoleArn: this.role.roleArn,
      startCanaryAfterCreation: props.startAfterCreation !== false,
      runtimeVersion: props.runtime?.name ?? Runtime.SYN_1_0.name,
      name: this.physicalName,
      schedule: this.createSchedule(props),
      failureRetentionPeriod: props.failureRetentionPeriod?.toDays(),
      successRetentionPeriod: props.successRetentionPeriod?.toDays(),
      // 🚧 TODO: implement
      code: {
        handler: 'index.handler',
        script: 'exports.handler = async () => {\nconsole.log(\'hello world\');\n};',
      },
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
      const front = name.substring(0,15);
      const hash = this.hashCode(name.substring(15));
      return front + String(hash).substring(0,6);
    }
  }

  /**
   * @see https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
   * @param s the string to be hashed
   */
  private hashCode(s: string): number {
    var hash = 0;
    for(let i = 0; i<s.length; i++){
      hash = ((hash << 5) - hash) + s.charCodeAt(i); //eslint-disable-line no-bitwise
      // Convert to 32bit integer
      hash = hash & hash; //eslint-disable-line no-bitwise
    }
    return hash;
  }
}

const regex: RegExp = new RegExp('^[0-9a-z_\-]+$');

/**
 * Verifies that the name fits the regex expression: ^[0-9a-z_\-]+$.
 *
 * @param name - the given name of the canary
 */
function validateName(name: string) {
  if (name.length > 21) {
    throw new Error('Canary name is too large, must be <= 21 characters, but is ' + name.length);
  }
  if (!regex.test(name)) {
    throw new Error(`Canary name must be lowercase, numbers, hyphens, or underscores (no spaces) (${name})`);
  }
}
