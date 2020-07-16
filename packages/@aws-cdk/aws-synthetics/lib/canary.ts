import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { CanaryBase } from './canary-base';
import { CfnCanary } from './synthetics.generated';

/**
 * Optional properties for a canary
 */
export interface CanaryOptions extends cdk.ResourceProps {
  /**
   * The s3 location that stores the data of the canary runs.
   *
   * @default - A new s3 bucket will be created.
   */
  readonly artifactBucket?: s3.IBucket;

  /**
   * Canary execution role.
   *
   * This is the role that will be assumed by the canary upon execution.
   * It controls the permissions that the canary will have. The Role must
   * be assumable by the 'lambda.amazonaws.com' service principal.
   *
   * The default Role automatically has permissions granted for Canary execution.
   * If you provide a Role, you must add the relevant policies yourself.
   *
   * The relevant policies are "s3:PutObject", "s3:GetBucketLocation", "s3:ListAllMyBuckets",
   * "cloudwatch:PutMetricData", "logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents".
   *
   * @default - A unique role will be generated for this canary.
   * Both supplied and generated roles can always be changed by calling 'addToRolePolicy'.
   */
  readonly role?: iam.IRole;

  /**
   * How many seconds the canary should run before timing out.
   *
   * @default - the smaller value between frequency and 900 seconds
   */
  readonly timeout?: cdk.Duration;

  /**
   * The amount of memory, in MB, that is allocated to your Canary. Must be a multiple of 64 and inside the range 960 to 3008.
   *
   * @default - 960
   */
  readonly memorySize?: number;

  /**
   * How long the canary will be in a 'RUNNING' state. For example, if you set `timeToLive` to be 1 hour and `frequency` to be 10 minutes,
   * your canary will run at 10 minute intervals for an hour, for a total of 6 times.
   *
   * The default of 0 seconds means that the canary will continue to make runs at the specified frequency until you stop it.
   *
   * @default Duration.seconds(0)
   */
  readonly timeToLive?: cdk.Duration;

  /**
   * How often the canary will run during its lifetime. The syntax for expression is 'rate(number unit)'
   * where unit can be 'minute', 'minutes', or 'hour'. You can specify a frequency between 'rate(1 minute)'
   * and 'rate(1 hour)'.
   *
   * The special expression 'rate(0 minute)' specifies that the canary will run only once when it is started.
   *
   * @default 'rate(5 minutes)'
   */
  readonly frequency?: cdk.Duration;

  /**
   * Whether or not the canary should start after creation.
   *
   * @default true
   */
  readonly enableCanary?: boolean;

  /**
   * How many days should successful runs be retained
   *
   * @default Duration.days(31)
   */
  readonly successRetentionPeriod?: cdk.Duration;

  /**
   * How many days should failed runs be retained
   *
   * @default Duration.days(31)
   */
  readonly failureRetentionPeriod?: cdk.Duration;

  /**
   * The name of the canary. This constitutes the physical ID of the canary.
   *
   * @default - A unique physical ID will be generated for you and used as the canary name.
   */
  readonly name?: string;

}

/**
 * Properties of a canary
 */
export interface CanaryProps extends CanaryOptions {

  /**
   * Specify the endpoint that you want the canary code to hit. Alternatively, you can specify
   * your own canary script to run.
   *
   * This is not yet implemented.
   */
  //readonly test: Test;
}

export class Canary extends CanaryBase {
  /**
   * Execution role associated with this Canary.
   */
  public readonly role: iam.IRole;

  /**
   * Canary ID
   * @attribute
   */
  public readonly canaryId: string;

  /**
   * Canary State
   * @attribute
   */
  public readonly canaryState: string;

  /**
   * Canary Name
   * @attribute
   */
  public readonly canaryName: string;

  constructor(scope: cdk.Construct, id: string, props: CanaryProps) {
    super(scope, id);

    const s3Location = props.artifactBucket?.s3UrlForObject() ?? new s3.Bucket(this, 'ServiceBucket').s3UrlForObject();

    // Created role will need these policies to run the Canary.
    const policy = new iam.PolicyDocument({
      statements: [new iam.PolicyStatement({
        resources: ['*'],
        actions: [
          's3:PutObject',
          's3:GetBucketLocation',
          's3:ListAllMyBuckets',
          'cloudwatch:PutMetricData',
          'logs:CreateLogGroup',
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
      })],
    });
    const inlinePolicies = { canaryPolicy: policy };

    this.role = props.role ?? new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies,
    });

    const name = props.name ?? this.generateName();
    const duration = props.timeToLive ?? cdk.Duration.seconds(0);
    const expression = props.frequency ?? cdk.Duration.minutes(5);
    var timeout = props.timeout ?? cdk.Duration.seconds(Math.min(expression.toSeconds(), 900));
    timeout = cdk.Duration.seconds(Math.min(timeout.toSeconds(), expression.toSeconds()));

    const resource: CfnCanary = new CfnCanary(this, 'Resource', {
      artifactS3Location: s3Location,
      executionRoleArn: this.role.roleArn,
      startCanaryAfterCreation: props.enableCanary ?? true,
      runtimeVersion: 'syn-1.0',
      name: this.verifyName(name),
      runConfig: {
        // Will include MemorySize when generated code gets updated.
        timeoutInSeconds: timeout.toSeconds(),
      },
      schedule: {
        durationInSeconds: String(duration.toSeconds()),
        expression: this.createExpression(expression),
      },
      failureRetentionPeriod: props.failureRetentionPeriod?.toDays(),
      successRetentionPeriod: props.successRetentionPeriod?.toDays(),
      code: {
        handler: this.verifyHandler('index.handler'),
        script: 'foo',
      },
    });
    resource.node.addDependency(this.role);

    this.canaryId = resource.attrId;
    this.canaryState = resource.attrState;
    this.canaryName = this.getResourceNameAttribute(resource.ref);
  }

  /**
   * Creates the expression that is readable by CloudFormation
   *
   * @param frequency - the provided frequency
   */
  private createExpression(frequency: cdk.Duration): string {
    this.verifyExpression(frequency);
    if (frequency.toMinutes() === 1) {
      return 'rate(1 minute)';
    }
    return `rate(${frequency.toMinutes()} minutes)`;
  }

  /**
   * Verifies that the given expression evaluates to 0 or is inside the range of 1-60 minutes.
   *
   * @param frequency - the provided frequency
   */
  private verifyExpression(frequency: cdk.Duration) {
    if (frequency.toMinutes() !== 0 && (frequency.toMinutes() < 1 || frequency.toMinutes() > 60)) {
      throw new Error('Frequency must be between 1 minute and 1 hour');
    }
  }

  /**
   * Verifies that the given handler ends in '.handler'. Returns the handler if successful and
   * throws an error if not.
   *
   * @param handler - the handler given by the user
   */
  private verifyHandler(handler: string): string {
    if (handler.split('.').length !== 2 || handler.split('.')[1] !== 'handler') {
      throw new Error('Canary Handler must end in \'.handler\'');
    }
    if (handler.length > 21) {
      throw new Error('Canary Handler must be less than 21 characters.');
    }
    return handler;
  }

  /**
   * Verifies that the name fits the regex expression: ^[0-9a-z_\-]+$
   * Returns the name if successful and throws an error if not.
   *
   * @param name - the given name of the canary
   */
  private verifyName(name: string): string {
    const regex = new RegExp('^[0-9a-z_\-]+$');
    if (!regex.test(name)) {
      throw new Error('Canary Name must be lowercase, numbers, hyphens, or underscores (no spaces).');
    }
    if (name.length > 21) {
      throw new Error('Canary Name must be less than 21 characters');
    }
    return name;
  }

  // private generateName(): string {
  //   name = cdk.Lazy.stringValue({ produce: () => this.node.uniqueId });
  // }
}
