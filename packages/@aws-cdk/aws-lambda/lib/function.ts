import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as sqs from '@aws-cdk/aws-sqs';
import { CfnResource, Construct, Duration, Fn, Lazy, Stack } from '@aws-cdk/core';
import { Code, CodeConfig } from './code';
import { EventInvokeConfigOptions } from './event-invoke-config';
import { IEventSource } from './event-source';
import { FunctionAttributes, FunctionBase, IFunction } from './function-base';
import { calculateFunctionHash, trimFromStart } from './function-hash';
import { Version, VersionOptions } from './lambda-version';
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
  ACTIVE = 'Active',
  /**
   * Lambda will only trace the request from an upstream service
   * if it contains a tracing header with "sampled=1"
   */
  PASS_THROUGH = 'PassThrough',
  /**
   * Lambda will not trace any request.
   */
  DISABLED = 'Disabled'
}

/**
 * Non runtime options
 */
export interface FunctionOptions extends EventInvokeConfigOptions {
  /**
   * A description of the function.
   *
   * @default - No description.
   */
  readonly description?: string;

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
   * This property is being deprecated, consider using securityGroups instead.
   *
   * Only used if 'vpc' is supplied.
   *
   * Use securityGroups property instead.
   * Function constructor will throw an error if both are specified.
   *
   * @default - If the function is placed within a VPC and a security group is
   * not specified, either by this or securityGroups prop, a dedicated security
   * group will be created for this function.
   *
   * @deprecated - This property is deprecated, use securityGroups instead
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * The list of security groups to associate with the Lambda's network interfaces.
   *
   * Only used if 'vpc' is supplied.
   *
   * @default - If the function is placed within a VPC and a security group is
   * not specified, either by this or securityGroup prop, a dedicated security
   * group will be created for this function.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

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
   * Enabled DLQ. If `deadLetterQueue` is undefined,
   * an SQS queue with default options will be defined for your Function.
   *
   * @default - false unless `deadLetterQueue` is set, which implies DLQ is enabled.
   */
  readonly deadLetterQueueEnabled?: boolean;

  /**
   * The SQS queue to use if DLQ is enabled.
   *
   * @default - SQS queue with 14 day retention period if `deadLetterQueueEnabled` is `true`
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
   * remove the retention policy, set the value to `INFINITE`.
   *
   * @default logs.RetentionDays.INFINITE
   */
  readonly logRetention?: logs.RetentionDays;

  /**
   * The IAM role for the Lambda function associated with the custom resource
   * that sets the retention policy.
   *
   * @default - A new role is created.
   */
  readonly logRetentionRole?: iam.IRole;

  /**
   * Options for the `lambda.Version` resource automatically created by the
   * `fn.currentVersion` method.
   * @default - default options as described in `VersionOptions`
   */
  readonly currentVersionOptions?: VersionOptions;
}

export interface FunctionProps extends FunctionOptions {
  /**
   * The runtime environment for the Lambda function that you are uploading.
   * For valid values, see the Runtime property in the AWS Lambda Developer
   * Guide.
   */
  readonly runtime: Runtime;

  /**
   * The source code of your Lambda function. You can point to a file in an
   * Amazon Simple Storage Service (Amazon S3) bucket or specify your source
   * code as inline text.
   */
  readonly code: Code;

  /**
   * The name of the method within your code that Lambda calls to execute
   * your function. The format includes the file name. It can also include
   * namespaces and other qualifiers, depending on the runtime.
   * For more information, see https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-features.html#gettingstarted-features-programmingmodel.
   *
   * NOTE: If you specify your source code as inline text by specifying the
   * ZipFile property within the Code property, specify index.function_name as
   * the handler.
   */
  readonly handler: string;
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

  /**
   * Returns a `lambda.Version` which represents the current version of this
   * Lambda function. A new version will be created every time the function's
   * configuration changes.
   *
   * You can specify options for this version using the `currentVersionOptions`
   * prop when initializing the `lambda.Function`.
   */
  public get currentVersion(): Version {
    if (this._currentVersion) {
      return this._currentVersion;
    }

    this._currentVersion = new Version(this, 'CurrentVersion', {
      lambda: this,
      ...this.currentVersionOptions
    });

    return this._currentVersion;
  }

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

        this.grantPrincipal = role || new iam.UnknownPrincipal({ resource: this });

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

  /**
   * The DLQ associated with this Lambda Function (this is an optional attribute).
   */
  public readonly deadLetterQueue?: sqs.IQueue;

  public readonly permissionsNode = this.node;

  protected readonly canCreatePermissions = true;

  private readonly layers: ILayerVersion[] = [];

  private _logGroup?: logs.ILogGroup;

  /**
   * Environment variables for this function
   */
  private readonly environment: { [key: string]: string };

  private readonly currentVersionOptions?: VersionOptions;
  private _currentVersion?: Version;

  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id, {
      physicalName: props.functionName,
    });

    this.environment = props.environment || {};

    const managedPolicies = new Array<iam.IManagedPolicy>();

    // the arn is in the form of - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    managedPolicies.push(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));

    if (props.vpc) {
      // Policy that will have ENI creation permissions
      managedPolicies.push(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'));
    }

    this.role = props.role || new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies
    });
    this.grantPrincipal = this.role;

    for (const statement of (props.initialPolicy || [])) {
      this.role.addToPolicy(statement);
    }

    const code = props.code.bind(this);
    verifyCodeConfig(code, props.runtime);

    this.deadLetterQueue = this.buildDeadLetterQueue(props);

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
      deadLetterConfig: this.buildDeadLetterConfig(this.deadLetterQueue),
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
      const logretention = new LogRetention(this, 'LogRetention', {
        logGroupName: `/aws/lambda/${this.functionName}`,
        retention: props.logRetention,
        role: props.logRetentionRole
      });
      this._logGroup = logs.LogGroup.fromLogGroupArn(this, 'LogGroup', logretention.logGroupArn);
    }

    props.code.bindToResource(resource);

    // Event Invoke Config
    if (props.onFailure || props.onSuccess || props.maxEventAge || props.retryAttempts !== undefined) {
      this.configureAsyncInvoke({
        onFailure: props.onFailure,
        onSuccess: props.onSuccess,
        maxEventAge: props.maxEventAge,
        retryAttempts: props.retryAttempts,
      });
    }

    this.currentVersionOptions = props.currentVersionOptions;
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
   * add a new version (with a new name) to your Lambda every time you want to
   * deploy an update. An alias can then refer to the newly created Version.
   *
   * All versions should have distinct names, and you should not delete versions
   * as long as your Alias needs to refer to them.
   *
   * @param name A unique name for this version.
   * @param codeSha256 The SHA-256 hash of the most recently deployed Lambda
   *  source code, or omit to skip validation.
   * @param description A description for this version.
   * @param provisionedExecutions A provisioned concurrency configuration for a
   * function's version.
   * @param asyncInvokeConfig configuration for this version when it is invoked
   * asynchronously.
   * @returns A new Version object.
   *
   * @deprecated This method will create an AWS::Lambda::Version resource which
   * snapshots the AWS Lambda function *at the time of its creation* and it
   * won't get updated when the function changes. Instead, use
   * `this.currentVersion` to obtain a reference to a version resource that gets
   * automatically recreated when the function configuration (or code) changes.
   */
  public addVersion(
    name: string,
    codeSha256?: string,
    description?: string,
    provisionedExecutions?: number,
    asyncInvokeConfig: EventInvokeConfigOptions = {}): Version {

    return new Version(this, 'Version' + name, {
      lambda: this,
      codeSha256,
      description,
      provisionedConcurrentExecutions: provisionedExecutions,
      ...asyncInvokeConfig,
    });
  }

  /**
   * The LogGroup where the Lambda function's logs are made available.
   *
   * If either `logRetention` is set or this property is called, a CloudFormation custom resource is added to the stack that
   * pre-creates the log group as part of the stack deployment, if it already doesn't exist, and sets the correct log retention
   * period (never expire, by default).
   *
   * Further, if the log group already exists and the `logRetention` is not set, the custom resource will reset the log retention
   * to never expire even if it was configured with a different value.
   */
  public get logGroup(): logs.ILogGroup {
    if (!this._logGroup) {
      const logretention = new LogRetention(this, 'LogRetention', {
        logGroupName: `/aws/lambda/${this.functionName}`,
        retention: logs.RetentionDays.INFINITE,
      });
      this._logGroup = logs.LogGroup.fromLogGroupArn(this, `${this.node.id}-LogGroup`, logretention.logGroupArn);
    }
    return this._logGroup;
  }

  protected prepare() {
    super.prepare();

    // if we have a current version resource, override it's logical id
    // so that it includes the hash of the function code and it's configuration.
    if (this._currentVersion) {
      const stack = Stack.of(this);
      const cfn = this._currentVersion.node.defaultChild as CfnResource;
      const originalLogicalId: string = stack.resolve(cfn.logicalId);

      const hash = calculateFunctionHash(this);

      const logicalId = trimFromStart(originalLogicalId, 255 - 32);
      cfn.overrideLogicalId(`${logicalId}${hash}`);
    }
  }

  private renderEnvironment() {
    if (!this.environment || Object.keys(this.environment).length === 0) {
      return undefined;
    }

    // for backwards compatibility we do not sort environment variables in case
    // _currentVersion is not defined. otherwise, this would have invalidated
    // the template, and for example, may cause unneeded updates for nested
    // stacks.
    if (!this._currentVersion) {
      return {
        variables: this.environment
      };
    }

    // sort environment so the hash of the function used to create
    // `currentVersion` is not affected by key order (this is how lambda does
    // it).
    const variables: { [key: string]: string } = { };
    for (const key of Object.keys(this.environment).sort()) {
      variables[key] = this.environment[key];
    }

    return { variables };
  }

  /**
   * If configured, set up the VPC-related properties
   *
   * Returns the VpcConfig that should be added to the
   * Lambda creation properties.
   */
  private configureVpc(props: FunctionProps): CfnFunction.VpcConfigProperty | undefined {
    if ((props.securityGroup || props.allowAllOutbound !== undefined) && !props.vpc) {
      throw new Error('Cannot configure \'securityGroup\' or \'allowAllOutbound\' without configuring a VPC');
    }

    if (!props.vpc) { return undefined; }

    if (props.securityGroup && props.allowAllOutbound !== undefined) {
      throw new Error('Configure \'allowAllOutbound\' directly on the supplied SecurityGroup.');
    }

    let securityGroups: ec2.ISecurityGroup[];

    if (props.securityGroup && props.securityGroups) {
      throw new Error('Only one of the function props, securityGroup or securityGroups, is allowed');
    }

    if (props.securityGroups) {
      securityGroups = props.securityGroups;
    } else {
      const securityGroup = props.securityGroup || new ec2.SecurityGroup(this, 'SecurityGroup', {
        vpc: props.vpc,
        description: 'Automatic security group for Lambda Function ' + this.node.uniqueId,
        allowAllOutbound: props.allowAllOutbound
      });
      securityGroups = [securityGroup];
    }

    this._connections = new ec2.Connections({ securityGroups });

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
      securityGroupIds: securityGroups.map(sg => sg.securityGroupId)
    };
  }

  private buildDeadLetterQueue(props: FunctionProps) {
    if (props.deadLetterQueue && props.deadLetterQueueEnabled === false) {
      throw Error('deadLetterQueue defined but deadLetterQueueEnabled explicitly set to false');
    }

    if (!props.deadLetterQueue && !props.deadLetterQueueEnabled) {
      return undefined;
    }

    const deadLetterQueue = props.deadLetterQueue || new sqs.Queue(this, 'DeadLetterQueue', {
      retentionPeriod: Duration.days(14)
    });

    this.addToRolePolicy(new iam.PolicyStatement({
      actions: ['sqs:SendMessage'],
      resources: [deadLetterQueue.queueArn]
    }));

    return deadLetterQueue;
  }

  private buildDeadLetterConfig(deadLetterQueue?: sqs.IQueue) {
    if (deadLetterQueue) {
      return {
        targetArn: deadLetterQueue.queueArn
      };
    } else {
      return undefined;
    }
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
    throw new Error('lambda.Code must specify one of "inlineCode" or "s3Location" but not both');
  }

  // if this is inline code, check that the runtime supports
  if (code.inlineCode && !runtime.supportsInlineCode) {
    throw new Error(`Inline source not allowed for ${runtime.name}`);
  }
}