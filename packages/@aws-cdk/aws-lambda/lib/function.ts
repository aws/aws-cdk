import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import logs = require('@aws-cdk/aws-logs');
import sqs = require('@aws-cdk/aws-sqs');
import { CfnOutput, Construct, Fn, Token } from '@aws-cdk/cdk';
import { Code } from './code';
import { IEventSource } from './event-source';
import { FunctionBase, FunctionImportProps, IFunction } from './function-base';
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
  Active,
  /**
   * Lambda will only trace the request from an upstream service
   * if it contains a tracing header with "sampled=1"
   */
  PassThrough,
  /**
   * Lambda will not trace any request.
   */
  Disabled
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
   * @default 3 seconds.
   */
  readonly timeout?: number;

  /**
   * Key-value pairs that Lambda caches and makes available for your Lambda
   * functions. Use environment variables to apply configuration changes, such
   * as test and production environment configurations, without changing your
   * Lambda function source code.
   */
  readonly environment?: { [key: string]: any };

  /**
   * The runtime environment for the Lambda function that you are uploading.
   * For valid values, see the Runtime property in the AWS Lambda Developer
   * Guide.
   */
  readonly runtime: Runtime;

  /**
   * A name for the function. If you don't specify a name, AWS CloudFormation
   * generates a unique physical ID and uses that ID for the function's name.
   * For more information, see Name Type.
   */
  readonly functionName?: string;

  /**
   * The amount of memory, in MB, that is allocated to your Lambda function.
   * Lambda uses this value to proportionally allocate the amount of CPU
   * power. For more information, see Resource Model in the AWS Lambda
   * Developer Guide.
   *
   * @default The default value is 128 MB
   */
  readonly memorySize?: number;

  /**
   * Initial policy statements to add to the created Lambda Role.
   *
   * You can call `addToRolePolicy` to the created lambda to add statements post creation.
   */
  readonly initialPolicy?: iam.PolicyStatement[];

  /**
   * Lambda execution role.
   *
   * This is the role that will be assumed by the function upon execution.
   * It controls the permissions that the function will have. The Role must
   * be assumable by the 'lambda.amazonaws.com' service principal.
   *
   * @default a unique role will be generated for this lambda function.
   * Both supplied and generated roles can always be changed by calling `addToRolePolicy`.
   */
  readonly role?: iam.IRole;

  /**
   * VPC network to place Lambda network interfaces
   *
   * Specify this if the Lambda function needs to access resources in a VPC.
   */
  readonly vpc?: ec2.IVpcNetwork;

  /**
   * Where to place the network interfaces within the VPC.
   *
   * Only used if 'vpc' is supplied. Note: internet access for Lambdas
   * requires a NAT gateway, so picking Public subnets is not allowed.
   *
   * @default All private subnets
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * What security group to associate with the Lambda's network interfaces.
   *
   * Only used if 'vpc' is supplied.
   *
   * @default If the function is placed within a VPC and a security group is
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
   * Enabled DLQ. If `deadLetterQueue` is undefined,
   * an SQS queue with default options will be defined for your Function.
   *
   * @default false unless `deadLetterQueue` is set, which implies DLQ is enabled
   */
  readonly deadLetterQueueEnabled?: boolean;

  /**
   * The SQS queue to use if DLQ is enabled.
   *
   * @default SQS queue with 14 day retention period if `deadLetterQueueEnabled` is `true`
   */
  readonly deadLetterQueue?: sqs.IQueue;

  /**
   * Enable AWS X-Ray Tracing for Lambda Function.
   *
   * @default undefined X-Ray tracing disabled
   */
  readonly tracing?: Tracing;

  /**
   * A list of layers to add to the function's execution environment. You can configure your Lambda function to pull in
   * additional code during initialization in the form of layers. Layers are packages of libraries or other dependencies
   * that can be used by mulitple functions.
   *
   * @default no layers
   */
  readonly layers?: ILayerVersion[];

  /**
   * The maximum of concurrent executions you want to reserve for the function.
   *
   * @default no specific limit - account limit
   * @see https://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html
   */
  readonly reservedConcurrentExecutions?: number;

  /**
   * Event sources for this function.
   *
   * You can also add event sources using `addEventSource`.
   */
  readonly events?: IEventSource[];

  /**
   * The number of days log events are kept in CloudWatch Logs. When updating
   * this property, unsetting it doesn't remove the log retention policy. To
   * remove the retention policy, set the value to `Infinity`.
   *
   * @default logs never expire
   */
  readonly logRetentionDays?: logs.RetentionDays;
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
   * Creates a Lambda function object which represents a function not defined
   * within this stack.
   *
   *    Lambda.import(this, 'MyImportedFunction', { lambdaArn: new LambdaArn('arn:aws:...') });
   *
   * @param scope The parent construct
   * @param id The name of the lambda construct
   * @param props A reference to a Lambda function. Can be created manually (see
   * example above) or obtained through a call to `lambda.export()`.
   */
  public static import(scope: Construct, id: string, props: FunctionImportProps): IFunction {
    return new ImportedFunction(scope, id, props);
  }

  /**
   * Return the given named metric for this Lambda
   */
  public static metricAll(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
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
  public static metricAllErrors(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metricAll('Errors', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the Duration executing all Lambdas
   *
   * @default average over 5 minutes
   */
  public static metricAllDuration(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metricAll('Duration', props);
  }

  /**
   * Metric for the number of invocations of all Lambdas
   *
   * @default sum over 5 minutes
   */
  public static metricAllInvocations(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metricAll('Invocations', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the number of throttled invocations of all Lambdas
   *
   * @default sum over 5 minutes
   */
  public static metricAllThrottles(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metricAll('Throttles', { statistic: 'sum', ...props });
  }

  /**
   * Metric for the number of concurrent executions across all Lambdas
   *
   * @default max over 5 minutes
   */
  public static metricAllConcurrentExecutions(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
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
  public static metricAllUnreservedConcurrentExecutions(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
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
   * The name of the handler configured for this lambda.
   */
  public readonly handler: string;

  /**
   * The principal this Lambda Function is running as
   */
  public readonly grantPrincipal: iam.IPrincipal;

  protected readonly canCreatePermissions = true;

  private readonly layers: ILayerVersion[] = [];

  /**
   * Environment variables for this function
   */
  private readonly environment?: { [key: string]: any };

  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id);

    this.environment = props.environment || { };

    const managedPolicyArns = new Array<string>();

    // the arn is in the form of - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    managedPolicyArns.push(new iam.AwsManagedPolicy("service-role/AWSLambdaBasicExecutionRole", this).policyArn);

    if (props.vpc) {
      // Policy that will have ENI creation permissions
      managedPolicyArns.push(new iam.AwsManagedPolicy("service-role/AWSLambdaVPCAccessExecutionRole", this).policyArn);
    }

    this.role = props.role || new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicyArns,
    });
    this.grantPrincipal = this.role;

    for (const statement of (props.initialPolicy || [])) {
      this.role.addToPolicy(statement);
    }

    const isChina = this.node.stack.env.region && this.node.stack.env.region.startsWith('cn-');
    if (isChina && props.environment && Object.keys(props.environment).length > 0) {
      // tslint:disable-next-line:max-line-length
      throw new Error(`Environment variables are not supported in this region (${this.node.stack.env.region}); consider using tags or SSM parameters instead`);
    }

    const resource = new CfnFunction(this, 'Resource', {
      functionName: props.functionName,
      description: props.description,
      code: new Token(() => props.code._toJSON(resource)),
      layers: new Token(() => this.layers.length > 0 ? this.layers.map(layer => layer.layerVersionArn) : undefined).toList(),
      handler: props.handler,
      timeout: props.timeout,
      runtime: props.runtime.name,
      role: this.role.roleArn,
      environment: new Token(() => this.renderEnvironment()),
      memorySize: props.memorySize,
      vpcConfig: this.configureVpc(props),
      deadLetterConfig: this.buildDeadLetterConfig(props),
      tracingConfig: this.buildTracingConfig(props),
      reservedConcurrentExecutions: props.reservedConcurrentExecutions
    });

    resource.node.addDependency(this.role);

    this.functionName = resource.ref;
    this.functionArn = resource.functionArn;
    this.handler = props.handler;
    this.runtime = props.runtime;

    // allow code to bind to stack.
    props.code.bind(this);

    for (const layer of props.layers || []) {
      this.addLayer(layer);
    }

    for (const event of props.events || []) {
      this.addEventSource(event);
    }

    // Log retention
    if (props.logRetentionDays) {
      new LogRetention(this, 'LogRetention', {
        logGroupName: `/aws/lambda/${this.functionName}`,
        retentionDays: props.logRetentionDays
      });
    }
  }

  /**
   * Export this Function (without the role)
   */
  public export(): FunctionImportProps {
    return {
      functionArn: new CfnOutput(this, 'FunctionArn', { value: this.functionArn }).makeImportValue().toString(),
      securityGroupId: this._connections && this._connections.securityGroups[0]
          ? new CfnOutput(this, 'SecurityGroupId', { value: this._connections.securityGroups[0].securityGroupId }).makeImportValue().toString()
          : undefined
    };
  }

  /**
   * Adds an environment variable to this Lambda function.
   * If this is a ref to a Lambda function, this operation results in a no-op.
   * @param key The environment variable key.
   * @param value The environment variable's value.
   */
  public addEnvironment(key: string, value: any): this {
    if (!this.environment) {
      // TODO: add metadata
      return this;
    }
    this.environment[key] = value;
    return this;
  }

  /**
   * Adds a Lambda Layer to this Lambda function.
   *
   * @param layer the layer to be added.
   *
   * @throws if there are already 5 layers on this function, or the layer is incompatible with this function's runtime.
   */
  public addLayer(layer: ILayerVersion): this {
    if (this.layers.length === 5) {
      throw new Error('Unable to add layer: this lambda function already uses 5 layers.');
    }
    if (layer.compatibleRuntimes && layer.compatibleRuntimes.indexOf(this.runtime) === -1) {
      const runtimes = layer.compatibleRuntimes.map(runtime => runtime.name).join(', ');
      throw new Error(`This lambda function uses a runtime that is incompatible with this layer (${this.runtime.name} is not in [${runtimes}])`);
    }
    this.layers.push(layer);
    return this;
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

  /**
   * Add a new version for this Lambda, always with a different name.
   *
   * This is similar to the {@link addVersion} method,
   * but useful when deploying this Lambda through CodePipeline with blue/green deployments.
   * When using {@link addVersion},
   * your Alias will not be updated until you change the name passed to {@link addVersion} in your CDK code.
   * When deploying through a Pipeline,
   * that might lead to a situation where a change to your Lambda application code will never be activated,
   * even though it traveled through the entire Pipeline,
   * because the Alias is still pointing to an old Version.
   * This method creates a new, unique Version every time the CDK code is executed,
   * and so prevents that from happening.
   */
  public newVersion(): Version {
    const now = new Date();
    return this.addVersion(now.toISOString());
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
    if (props.deadLetterQueue && props.deadLetterQueueEnabled === false) {
      throw Error('deadLetterQueue defined but deadLetterQueueEnabled explicitly set to false');
    }

    if (!props.deadLetterQueue && !props.deadLetterQueueEnabled) {
      return undefined;
    }

    const deadLetterQueue = props.deadLetterQueue || new sqs.Queue(this, 'DeadLetterQueue', {
      retentionPeriodSec: 1209600
    });

    this.addToRolePolicy(new iam.PolicyStatement()
      .addAction('sqs:SendMessage')
      .addResource(deadLetterQueue.queueArn));

    return {
      targetArn: deadLetterQueue.queueArn
    };
  }

  private buildTracingConfig(props: FunctionProps) {
    if (props.tracing === undefined || props.tracing === Tracing.Disabled) {
      return undefined;
    }

    this.addToRolePolicy(new iam.PolicyStatement()
      .addActions('xray:PutTraceSegments', 'xray:PutTelemetryRecords')
      .addAllResources());

    return {
      mode: Tracing[props.tracing]
    };
  }
}

export class ImportedFunction extends FunctionBase {
  public readonly grantPrincipal: iam.IPrincipal;
  public readonly functionName: string;
  public readonly functionArn: string;
  public readonly role?: iam.IRole;

  protected readonly canCreatePermissions = false;

  constructor(scope: Construct, id: string, private readonly props: FunctionImportProps) {
    super(scope, id);

    this.functionArn = props.functionArn;
    this.functionName = extractNameFromArn(props.functionArn);
    this.role = props.role;
    this.grantPrincipal = this.role || new iam.ImportedResourcePrincipal({ resource: this } );

    if (props.securityGroupId) {
      this._connections = new ec2.Connections({
        securityGroups: [
          ec2.SecurityGroup.import(this, 'SecurityGroup', { securityGroupId: props.securityGroupId })
        ]
      });
    }
  }

  public export() {
    return this.props;
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
