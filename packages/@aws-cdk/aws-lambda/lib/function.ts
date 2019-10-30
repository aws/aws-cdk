import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import logs = require('@aws-cdk/aws-logs');
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import { Construct, Duration, Fn, Lazy, Stack, Token } from '@aws-cdk/core';
import { Code, CodeConfig } from './code';
import { IEventSource } from './event-source';
import { FunctionAttributes, FunctionBase, IFunction } from './function-base';
import { Version } from './lambda-version';
import { CfnFunction } from './lambda.generated';
import { ILayerVersion } from './layers';
import { LogRetention } from './log-retention';
import { Runtime } from './runtime';

/**
 * X-Ray Tracing Modes (https://docs.aws.amazon.com/lambda/latest/dg/API_TracingConfig.html)
 */
export enum Tracing {
  /**
   * Lambda will respect any tracing header it receives from an upstream service.
   * If no tracing header is received, Lambda will call X-Ray for a tracing decision.
   */
  ACTIVE = "Active",
  /**
   * Lambda will only trace the request from an upstream service
   * if it contains a tracing header with "sampled=1"
   */
  PASS_THROUGH = "PassThrough",
  /**
   * Lambda will not trace any request.
   */
  DISABLED = "Disabled"
}

/**
 * Describes the type of resource to use as a Lambda dead-letter queue
 */
export enum DeadLetterQueueType {
  /**
   * SQS DLQ
   */
  SQS = 'SQS',
  /**
   * SNS DLQ
   */
  SNS = 'SNS',
}

/**
 * Resource to be used as a dead-letter queue
 */
export interface DeadLetterQueueOptions {
  /**
   * SQS queue
   *
   * @default - no queue
   */
  readonly queue?: sqs.IQueue;
  /**
   * SNS topic
   *
   * @default - no topic
   */
  readonly topic?: sns.ITopic;
}

/**
 * Dead-letter queue settings
 */
export class DeadLetterQueue {
  /**
   * Use a SQS queue as dead-letter queue
   *
   * @param queue The SQS queue to associate.
   *              If not provided, a new SQS queue will be created with a 14 day retention period
   */
  public static fromSqsQueue(queue?: sqs.IQueue): DeadLetterQueue {
    return new DeadLetterQueue(DeadLetterQueueType.SQS, { queue });
  }

  /**
   * Use a SNS topic as dead-letter queue
   *
   * @param topic The SNS topic to associate.
   *              If not provided, a new SNS topic will be created
   */
  public static fromSnsTopic(topic?: sns.ITopic): DeadLetterQueue {
    return new DeadLetterQueue(DeadLetterQueueType.SNS, { topic });
  }

  /**
   * Retrieve the ARN identifying the dead-letter queue resource
   *
   * @returns ARN of the DLQ
   */
  public get targetArn(): string {
    if (!this.queue && !this.topic) {
      throw new Error('never - bind(function) method should have been invoked first');
    }

    return this.queue ? this.queue.queueArn : this.topic!.topicArn;
  }

  private queue?: sqs.IQueue;
  private topic?: sns.ITopic;
  private constructor(public readonly type: DeadLetterQueueType, options: DeadLetterQueueOptions = {}) {
    this.queue = options.queue;
    this.topic = options.topic;
  }

  /**
   * Creates the appropriate IAM policy required for the Lambda function to send its dead events.
   *
   * This method also generates the default resource (queue or topic) if it was not provided on construction
   *
   * @param fn The Lambda function to bind
   */
  public bind(fn: Function) {
    switch (this.type) {
      case DeadLetterQueueType.SQS:
        this.queue = this.queue || new sqs.Queue(fn, 'DeadLetterQueue', { retentionPeriod: Duration.days(14) });
        break;
      case DeadLetterQueueType.SNS:
        this.topic = this.topic || new sns.Topic(fn, 'DeadLetterTopic', {});
        break;
    }

    fn.addToRolePolicy(new iam.PolicyStatement({
      actions: [this.queue ? 'sqs:SendMessage' : 'sns:Publish'],
      resources: [this.targetArn]
    }));
  }
}

export interface FunctionProps {
  /**
   * The source code of your Lambda function. You can point to a file in an
   * Amazon Simple Storage Service (Amazon S3) bucket or specify your source
   * code as inline text.
   */
  readonly code: Code;

  /**
   * A description of the function.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * The name of the function (within your source code) that Lambda calls to
   * start running your code. For more information, see the Handler property
   * in the AWS Lambda Developer Guide.
   *
   * NOTE: If you specify your source code as inline text by specifying the
   * ZipFile property within the Code property, specify index.function_name as
   * the handler.
   */
  readonly handler: string;

  /**
   * The function execution time (in seconds) after which Lambda terminates
   * the function. Because the execution time affects cost, set this value
   * based on the function's expected execution time.
   *
   * @default Duration.seconds(3)
   */
  readonly timeout?: Duration;

  /**
   * Key-value pairs that Lambda caches and makes available for your Lambda
   * functions. Use environment variables to apply configuration changes, such
   * as test and production environment configurations, without changing your
   * Lambda function source code.
   *
   * @default - No environment variables.
   */
  readonly environment?: { [key: string]: string };

  /**
   * The runtime environment for the Lambda function that you are uploading.
   * For valid values, see the Runtime property in the AWS Lambda Developer
   * Guide.
   */
  readonly runtime: Runtime;

  /**
   * A name for the function.
   *
   * @default - AWS CloudFormation generates a unique physical ID and uses that
   * ID for the function's name. For more information, see Name Type.
   */
  readonly functionName?: string;

  /**
   * The amount of memory, in MB, that is allocated to your Lambda function.
   * Lambda uses this value to proportionally allocate the amount of CPU
   * power. For more information, see Resource Model in the AWS Lambda
   * Developer Guide.
   *
   * @default 128
   */
  readonly memorySize?: number;

  /**
   * Initial policy statements to add to the created Lambda Role.
   *
   * You can call `addToRolePolicy` to the created lambda to add statements post creation.
   *
   * @default - No policy statements are added to the created Lambda role.
   */
  readonly initialPolicy?: iam.PolicyStatement[];

  /**
   * Lambda execution role.
   *
   * This is the role that will be assumed by the function upon execution.
   * It controls the permissions that the function will have. The Role must
   * be assumable by the 'lambda.amazonaws.com' service principal.
   *
   * @default - A unique role will be generated for this lambda function.
   * Both supplied and generated roles can always be changed by calling `addToRolePolicy`.
   */
  readonly role?: iam.IRole;

  /**
   * VPC network to place Lambda network interfaces
   *
   * Specify this if the Lambda function needs to access resources in a VPC.
   *
   * @default - Function is not placed within a VPC.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Where to place the network interfaces within the VPC.
   *
   * Only used if 'vpc' is supplied. Note: internet access for Lambdas
   * requires a NAT gateway, so picking Public subnets is not allowed.
   *
   * @default - Private subnets.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * What security group to associate with the Lambda's network interfaces.
   *
   * Only used if 'vpc' is supplied.
   *
   * @default - If the function is placed within a VPC and a security group is
   * not specified, a dedicated security group will be created for this
   * function.
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * Whether to allow the Lambda to send all network traffic
   *
   * If set to false, you must individually add traffic rules to allow the
   * Lambda to connect to network targets.
   *
   * @default true
   */
  readonly allowAllOutbound?: boolean;

  /**
   * Dead-letter queue behavior
   *
   * @default - no dead-letter queue will be used or created
   */
  readonly dlq?: DeadLetterQueue;

  /**
   * Enabled DLQ. If `deadLetterQueue` is undefined,
   * an SQS queue with default options will be defined for your Function.
   *
   * @default - false unless `deadLetterQueue` is set, which implies DLQ is enabled.
   *
   * @deprecated see {@link FunctionProps.dlq} with {@link DeadLetterQueue.fromSqsQueue}
   */
  readonly deadLetterQueueEnabled?: boolean;

  /**
   * The SQS queue to use if DLQ is enabled.
   *
   * @default - SQS queue with 14 day retention period if `deadLetterQueueEnabled` is `true`
   *
   * @deprecated see {@link FunctionProps.dlq} with {@link DeadLetterQueue.fromSqsQueue}
   */
  readonly deadLetterQueue?: sqs.IQueue;

  /**
   * Enable AWS X-Ray Tracing for Lambda Function.
   *
   * @default Tracing.Disabled
   */
  readonly tracing?: Tracing;

  /**
   * A list of layers to add to the function's execution environment. You can configure your Lambda function to pull in
   * additional code during initialization in the form of layers. Layers are packages of libraries or other dependencies
   * that can be used by mulitple functions.
   *
   * @default - No layers.
   */
  readonly layers?: ILayerVersion[];

  /**
   * The maximum of concurrent executions you want to reserve for the function.
   *
   * @default - No specific limit - account limit.
   * @see https://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html
   */
  readonly reservedConcurrentExecutions?: number;

  /**
   * Event sources for this function.
   *
   * You can also add event sources using `addEventSource`.
   *
   * @default - No event sources.
   */
  readonly events?: IEventSource[];

  /**
   * The number of days log events are kept in CloudWatch Logs. When updating
   * this property, unsetting it doesn't remove the log retention policy. To
   * remove the retention policy, set the value to `Infinity`.
   *
   * @default - Logs never expire.
   */
  readonly logRetention?: logs.RetentionDays;

  /**
   * The IAM role for the Lambda function associated with the custom resource
   * that sets the retention policy.
   *
   * @default - A new role is created.
   */
  readonly logRetentionRole?: iam.IRole;
}

/**
 * Deploys a file from from inside the construct library as a function.
 *
 * The supplied file is subject to the 4096 bytes limit of being embedded in a
 * CloudFormation template.
 *
 * The construct includes an associated role with the lambda.
 *
 * This construct does not yet reproduce all features from the underlying resource
 * library.
 */
export class Function extends FunctionBase {
  public static fromFunctionArn(scope: Construct, id: string, functionArn: string): IFunction {
    return Function.fromFunctionAttributes(scope, id, { functionArn });
  }

  /**
   * Creates a Lambda function object which represents a function not defined
   * within this stack.
   *
   * @param scope The parent construct
   * @param id The name of the lambda construct
   * @param attrs the attributes of the function to import
   */
  public static fromFunctionAttributes(scope: Construct, id: string, attrs: FunctionAttributes): IFunction {
    const functionArn = attrs.functionArn;
    const functionName = extractNameFromArn(attrs.functionArn);
    const role = attrs.role;

    class Import extends FunctionBase {
      public readonly functionName = functionName;
      public readonly functionArn = functionArn;
      public readonly grantPrincipal: iam.IPrincipal;
      public readonly role = role;
      public readonly permissionsNode = this.node;

      protected readonly canCreatePermissions = false;

      constructor(s: Construct, i: string) {
        super(s, i);

        this.grantPrincipal = role || new iam.UnknownPrincipal({ resource: this } );

        if (attrs.securityGroup) {
          this._connections = new ec2.Connections({
            securityGroups: [attrs.securityGroup]
          });
        } else if (attrs.securityGroupId) {
          this._connections = new ec2.Connections({
            securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(scope, 'SecurityGroup', attrs.securityGroupId)]
          });
        }
      }
    }

    return new Import(scope, id);
  }

  /**
   * Return the given named metric for this Lambda
   */
  public static metricAll(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/Lambda',
      metricName,
      ...props
    });
  }
  /**
   * Metric for the number of Errors executing all Lambdas
   *
   * @default sum over 5 minutes
   */
  public static metricAllErrors(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('Errors', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the Duration executing all Lambdas
   *
   * @default average over 5 minutes
   */
  public static metricAllDuration(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('Duration', props);
  }

  /**
   * Metric for the number of invocations of all Lambdas
   *
   * @default sum over 5 minutes
   */
  public static metricAllInvocations(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('Invocations', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the number of throttled invocations of all Lambdas
   *
   * @default sum over 5 minutes
   */
  public static metricAllThrottles(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('Throttles', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the number of concurrent executions across all Lambdas
   *
   * @default max over 5 minutes
   */
  public static metricAllConcurrentExecutions(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    // Mini-FAQ: why max? This metric is a gauge that is emitted every
    // minute, so either max or avg or a percentile make sense (but sum
    // doesn't). Max is more sensitive to spiky load changes which is
    // probably what you're interested in if you're looking at this metric
    // (Load spikes may lead to concurrent execution errors that would
    // otherwise not be visible in the avg)
    return this.metricAll('ConcurrentExecutions', { statistic: 'max', ...props });
  }

  /**
   * Metric for the number of unreserved concurrent executions across all Lambdas
   *
   * @default max over 5 minutes
   */
  public static metricAllUnreservedConcurrentExecutions(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metricAll('UnreservedConcurrentExecutions', { statistic: 'max', ...props });
  }

  /**
   * Name of this function
   */
  public readonly functionName: string;

  /**
   * ARN of this function
   */
  public readonly functionArn: string;

  /**
   * Execution role associated with this function
   */
  public readonly role?: iam.IRole;

  /**
   * The runtime configured for this lambda.
   */
  public readonly runtime: Runtime;

  /**
   * The principal this Lambda Function is running as
   */
  public readonly grantPrincipal: iam.IPrincipal;

  public readonly permissionsNode = this.node;

  protected readonly canCreatePermissions = true;

  private readonly layers: ILayerVersion[] = [];

  /**
   * Environment variables for this function
   */
  private readonly environment: { [key: string]: string };

  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id, {
      physicalName: props.functionName,
    });

    this.environment = props.environment || { };

    const managedPolicies = new Array<iam.IManagedPolicy>();

    // the arn is in the form of - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    managedPolicies.push(iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"));

    if (props.vpc) {
      // Policy that will have ENI creation permissions
      managedPolicies.push(iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaVPCAccessExecutionRole"));
    }

    this.role = props.role || new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies
    });
    this.grantPrincipal = this.role;

    for (const statement of (props.initialPolicy || [])) {
      this.role.addToPolicy(statement);
    }

    const region = Stack.of(this).region;
    const isChina = !Token.isUnresolved(region) && region.startsWith('cn-');
    if (isChina && props.environment && Object.keys(props.environment).length > 0) {
      // tslint:disable-next-line:max-line-length
      throw new Error(`Environment variables are not supported in this region (${region}); consider using tags or SSM parameters instead`);
    }

    const code = props.code.bind(this);
    verifyCodeConfig(code, props.runtime);

    const resource: CfnFunction = new CfnFunction(this, 'Resource', {
      functionName: this.physicalName,
      description: props.description,
      code: {
        s3Bucket: code.s3Location && code.s3Location.bucketName,
        s3Key: code.s3Location && code.s3Location.objectKey,
        s3ObjectVersion: code.s3Location && code.s3Location.objectVersion,
        zipFile: code.inlineCode
      },
      layers: Lazy.listValue({ produce: () => this.layers.map(layer => layer.layerVersionArn) }, { omitEmpty: true }),
      handler: props.handler,
      timeout: props.timeout && props.timeout.toSeconds(),
      runtime: props.runtime.name,
      role: this.role.roleArn,
      environment: Lazy.anyValue({ produce: () => this.renderEnvironment() }),
      memorySize: props.memorySize,
      vpcConfig: this.configureVpc(props),
      deadLetterConfig: this.buildDeadLetterConfig(props),
      tracingConfig: this.buildTracingConfig(props),
      reservedConcurrentExecutions: props.reservedConcurrentExecutions
    });

    resource.node.addDependency(this.role);

    this.functionName = this.getResourceNameAttribute(resource.ref);
    this.functionArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'lambda',
      resource: 'function',
      resourceName: this.physicalName,
      sep: ':',
    });

    this.runtime = props.runtime;

    if (props.layers) {
      this.addLayers(...props.layers);
    }

    for (const event of props.events || []) {
      this.addEventSource(event);
    }

    // Log retention
    if (props.logRetention) {
      new LogRetention(this, 'LogRetention', {
        logGroupName: `/aws/lambda/${this.functionName}`,
        retention: props.logRetention,
        role: props.logRetentionRole
      });
    }

    props.code.bindToResource(resource);
  }

  /**
   * Adds an environment variable to this Lambda function.
   * If this is a ref to a Lambda function, this operation results in a no-op.
   * @param key The environment variable key.
   * @param value The environment variable's value.
   */
  public addEnvironment(key: string, value: string): this {
    this.environment[key] = value;
    return this;
  }

  /**
   * Adds one or more Lambda Layers to this Lambda function.
   *
   * @param layers the layers to be added.
   *
   * @throws if there are already 5 layers on this function, or the layer is incompatible with this function's runtime.
   */
  public addLayers(...layers: ILayerVersion[]): void {
    for (const layer of layers) {
      if (this.layers.length === 5) {
        throw new Error('Unable to add layer: this lambda function already uses 5 layers.');
      }
      if (layer.compatibleRuntimes && !layer.compatibleRuntimes.find(runtime => runtime.runtimeEquals(this.runtime))) {
        const runtimes = layer.compatibleRuntimes.map(runtime => runtime.name).join(', ');
        throw new Error(`This lambda function uses a runtime that is incompatible with this layer (${this.runtime.name} is not in [${runtimes}])`);
      }
      this.layers.push(layer);
    }
  }

  /**
   * Add a new version for this Lambda
   *
   * If you want to deploy through CloudFormation and use aliases, you need to
   * add a new version (with a new name) to your Lambda every time you want
   * to deploy an update. An alias can then refer to the newly created Version.
   *
   * All versions should have distinct names, and you should not delete versions
   * as long as your Alias needs to refer to them.
   *
   * @param name A unique name for this version
   * @param codeSha256 The SHA-256 hash of the most recently deployed Lambda source code, or
   *  omit to skip validation.
   * @param description A description for this version.
   * @returns A new Version object.
   */
  public addVersion(name: string, codeSha256?: string, description?: string): Version {
    return new Version(this, 'Version' + name, {
      lambda: this,
      codeSha256,
      description,
    });
  }

  private renderEnvironment() {
    if (!this.environment || Object.keys(this.environment).length === 0) {
      return undefined;
    }

    return {
      variables: this.environment
    };
  }

  /**
   * If configured, set up the VPC-related properties
   *
   * Returns the VpcConfig that should be added to the
   * Lambda creation properties.
   */
  private configureVpc(props: FunctionProps): CfnFunction.VpcConfigProperty | undefined {
    if ((props.securityGroup || props.allowAllOutbound !== undefined) && !props.vpc) {
      throw new Error(`Cannot configure 'securityGroup' or 'allowAllOutbound' without configuring a VPC`);
    }

    if (!props.vpc) { return undefined; }

    if (props.securityGroup && props.allowAllOutbound !== undefined) {
      throw new Error(`Configure 'allowAllOutbound' directly on the supplied SecurityGroup.`);
    }

    const securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
      description: 'Automatic security group for Lambda Function ' + this.node.uniqueId,
      allowAllOutbound: props.allowAllOutbound
    });

    this._connections = new ec2.Connections({ securityGroups: [securityGroup] });

    // Pick subnets, make sure they're not Public. Routing through an IGW
    // won't work because the ENIs don't get a Public IP.
    // Why are we not simply forcing vpcSubnets? Because you might still be choosing
    // Isolated networks or selecting among 2 sets of Private subnets by name.
    const { subnetIds } = props.vpc.selectSubnets(props.vpcSubnets);
    const publicSubnetIds = new Set(props.vpc.publicSubnets.map(s => s.subnetId));
    for (const subnetId of subnetIds) {
      if (publicSubnetIds.has(subnetId)) {
        throw new Error('Not possible to place Lambda Functions in a Public subnet');
      }
    }

    // List can't be empty here, if we got this far you intended to put your Lambda
    // in subnets. We're going to guarantee that we get the nice error message by
    // making VpcNetwork do the selection again.

    return {
      subnetIds,
      securityGroupIds: [securityGroup.securityGroupId]
    };
  }

  private buildDeadLetterConfig(props: FunctionProps) {
    if (props.dlq && (props.deadLetterQueue || props.deadLetterQueueEnabled)) {
      throw Error('dlq cannot be used with deadLetterQueue or deadLetterQueueEnabled. Please only use dlq');
    }

    let dlq = props.dlq;
    if (props.deadLetterQueue || props.deadLetterQueueEnabled) {
      if (props.deadLetterQueueEnabled === false) {
        throw Error('deadLetterQueue defined but deadLetterQueueEnabled explicitly set to false');
      }

      dlq = DeadLetterQueue.fromSqsQueue(props.deadLetterQueue);
    }

    if (!dlq) {
      return undefined;
    }

    dlq.bind(this);
    return {
      targetArn: dlq.targetArn,
    };
  }

  private buildTracingConfig(props: FunctionProps) {
    if (props.tracing === undefined || props.tracing === Tracing.DISABLED) {
      return undefined;
    }

    this.addToRolePolicy(new iam.PolicyStatement({
      actions: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
      resources: ['*']
    }));

    return {
      mode: props.tracing
    };
  }
}

/**
 * Given an opaque (token) ARN, returns a CloudFormation expression that extracts the function
 * name from the ARN.
 *
 * Function ARNs look like this:
 *
 *   arn:aws:lambda:region:account-id:function:function-name
 *
 * ..which means that in order to extract the `function-name` component from the ARN, we can
 * split the ARN using ":" and select the component in index 6.
 *
 * @returns `FnSelect(6, FnSplit(':', arn))`
 */
function extractNameFromArn(arn: string) {
  return Fn.select(6, Fn.split(':', arn));
}

export function verifyCodeConfig(code: CodeConfig, runtime: Runtime) {
  // mutually exclusive
  if ((!code.inlineCode && !code.s3Location) || (code.inlineCode && code.s3Location)) {
    throw new Error(`lambda.Code must specify one of "inlineCode" or "s3Location" but not both`);
  }

  // if this is inline code, check that the runtime supports
  if (code.inlineCode && !runtime.supportsInlineCode) {
    throw new Error(`Inline source not allowed for ${runtime.name}`);
  }
}
