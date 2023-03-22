import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { IProfilingGroup, ProfilingGroup, ComputePlatform } from '@aws-cdk/aws-codeguruprofiler';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import { Annotations, ArnFormat, CfnResource, Duration, FeatureFlags, Fn, IAspect, Lazy, Names, Size, Stack, Token } from '@aws-cdk/core';
import { LAMBDA_RECOGNIZE_LAYER_VERSION } from '@aws-cdk/cx-api';
import { Construct, IConstruct } from 'constructs';
import { AdotInstrumentationConfig } from './adot-layers';
import { AliasOptions, Alias } from './alias';
import { Architecture } from './architecture';
import { Code, CodeConfig } from './code';
import { ICodeSigningConfig } from './code-signing-config';
import { EventInvokeConfigOptions } from './event-invoke-config';
import { IEventSource } from './event-source';
import { FileSystem } from './filesystem';
import { FunctionAttributes, FunctionBase, IFunction } from './function-base';
import { calculateFunctionHash, trimFromStart } from './function-hash';
import { Handler } from './handler';
import { LambdaInsightsVersion } from './lambda-insights';
import { Version, VersionOptions } from './lambda-version';
import { CfnFunction } from './lambda.generated';
import { LayerVersion, ILayerVersion } from './layers';
import { LogRetentionRetryOptions } from './log-retention';
import { Runtime } from './runtime';
import { RuntimeManagementMode } from './runtime-management';
import { addAlias } from './util';

/**
 * X-Ray Tracing Modes (https://docs.aws.amazon.com/lambda/latest/dg/API_TracingConfig.html)
 */
export enum Tracing {
  /**
   * Lambda will respect any tracing header it receives from an upstream service.
   * If no tracing header is received, Lambda will sample the request based on a fixed rate. Please see the [Using AWS Lambda with AWS X-Ray](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html) documentation for details on this sampling behavior.
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
   * The size of the function’s /tmp directory in MiB.
   *
   * @default 512 MiB
   */
  readonly ephemeralStorageSize?: Size;

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
   * The default Role automatically has permissions granted for Lambda execution. If you
   * provide a Role, you must add the relevant AWS managed policies yourself.
   *
   * The relevant managed policies are "service-role/AWSLambdaBasicExecutionRole" and
   * "service-role/AWSLambdaVPCAccessExecutionRole".
   *
   * @default - A unique role will be generated for this lambda function.
   * Both supplied and generated roles can always be changed by calling `addToRolePolicy`.
   */
  readonly role?: iam.IRole;

  /**
   * VPC network to place Lambda network interfaces
   *
   * Specify this if the Lambda function needs to access resources in a VPC.
   * This is required when `vpcSubnets` is specified.
   *
   * @default - Function is not placed within a VPC.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Where to place the network interfaces within the VPC.
   *
   * This requires `vpc` to be specified in order for interfaces to actually be
   * placed in the subnets. If `vpc` is not specify, this will raise an error.
   *
   * Note: Internet access for Lambda Functions requires a NAT Gateway, so picking
   * public subnets is not allowed (unless `allowPublicSubnet` is set to `true`).
   *
   * @default - the Vpc default strategy if not specified
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
   * If SNS topic is desired, specify `deadLetterTopic` property instead.
   *
   * @default - SQS queue with 14 day retention period if `deadLetterQueueEnabled` is `true`
   */
  readonly deadLetterQueue?: sqs.IQueue;

  /**
   * The SNS topic to use as a DLQ.
   * Note that if `deadLetterQueueEnabled` is set to `true`, an SQS queue will be created
   * rather than an SNS topic. Using an SNS topic as a DLQ requires this property to be set explicitly.
   *
   * @default - no SNS topic
   */
  readonly deadLetterTopic?: sns.ITopic;

  /**
   * Enable AWS X-Ray Tracing for Lambda Function.
   *
   * @default Tracing.Disabled
   */
  readonly tracing?: Tracing;

  /**
   * Enable profiling.
   * @see https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html
   *
   * @default - No profiling.
   */
  readonly profiling?: boolean;

  /**
   * Profiling Group.
   * @see https://docs.aws.amazon.com/codeguru/latest/profiler-ug/setting-up-lambda.html
   *
   * @default - A new profiling group will be created if `profiling` is set.
   */
  readonly profilingGroup?: IProfilingGroup;

  /**
   * Specify the version of CloudWatch Lambda insights to use for monitoring
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights.html
   *
   * When used with `DockerImageFunction` or `DockerImageCode`, the Docker image should have
   * the Lambda insights agent installed.
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-Getting-Started-docker.html
   *
   * @default - No Lambda Insights
   */
  readonly insightsVersion?: LambdaInsightsVersion;

  /**
   * Specify the configuration of AWS Distro for OpenTelemetry (ADOT) instrumentation
   * @see https://aws-otel.github.io/docs/getting-started/lambda
   *
   * @default - No ADOT instrumentation
   */
  readonly adotInstrumentation?: AdotInstrumentationConfig;

  /**
   * A list of layers to add to the function's execution environment. You can configure your Lambda function to pull in
   * additional code during initialization in the form of layers. Layers are packages of libraries or other dependencies
   * that can be used by multiple functions.
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
   * When log retention is specified, a custom resource attempts to create the CloudWatch log group.
   * These options control the retry policy when interacting with CloudWatch APIs.
   *
   * @default - Default AWS SDK retry options.
   */
  readonly logRetentionRetryOptions?: LogRetentionRetryOptions;

  /**
   * Options for the `lambda.Version` resource automatically created by the
   * `fn.currentVersion` method.
   * @default - default options as described in `VersionOptions`
   */
  readonly currentVersionOptions?: VersionOptions;

  /**
   * The filesystem configuration for the lambda function
   *
   * @default - will not mount any filesystem
   */
  readonly filesystem?: FileSystem;

  /**
   * Lambda Functions in a public subnet can NOT access the internet.
   * Use this property to acknowledge this limitation and still place the function in a public subnet.
   * @see https://stackoverflow.com/questions/52992085/why-cant-an-aws-lambda-function-inside-a-public-subnet-in-a-vpc-connect-to-the/52994841#52994841
   *
   * @default false
   */
  readonly allowPublicSubnet?: boolean;

  /**
   * The AWS KMS key that's used to encrypt your function's environment variables.
   *
   * @default - AWS Lambda creates and uses an AWS managed customer master key (CMK).
   */
  readonly environmentEncryption?: kms.IKey;

  /**
   * Code signing config associated with this function
   *
   * @default - Not Sign the Code
   */
  readonly codeSigningConfig?: ICodeSigningConfig;

  /**
   * DEPRECATED
   * @default [Architecture.X86_64]
   * @deprecated use `architecture`
   */
  readonly architectures?: Architecture[];

  /**
   * The system architectures compatible with this lambda function.
   * @default Architecture.X86_64
   */
  readonly architecture?: Architecture;

  /**
   * Sets the runtime management configuration for a function's version.
   * @default Auto
   */
  readonly runtimeManagementMode?: RuntimeManagementMode;
}

export interface FunctionProps extends FunctionOptions {
  /**
   * The runtime environment for the Lambda function that you are uploading.
   * For valid values, see the Runtime property in the AWS Lambda Developer
   * Guide.
   *
   * Use `Runtime.FROM_IMAGE` when defining a function from a Docker image.
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
   * For more information, see https://docs.aws.amazon.com/lambda/latest/dg/foundation-progmodel.html.
   *
   * Use `Handler.FROM_IMAGE` when defining a function from a Docker image.
   *
   * NOTE: If you specify your source code as inline text by specifying the
   * ZipFile property within the Code property, specify index.function_name as
   * the handler.
   */
  readonly handler: string;
}

/**
 * Deploys a file from inside the construct library as a function.
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

    if (this._warnIfCurrentVersionCalled) {
      this.warnInvokeFunctionPermissions(this);
    };

    this._currentVersion = new Version(this, 'CurrentVersion', {
      lambda: this,
      ...this.currentVersionOptions,
    });

    // override the version's logical ID with a lazy string which includes the
    // hash of the function itself, so a new version resource is created when
    // the function configuration changes.
    const cfn = this._currentVersion.node.defaultChild as CfnResource;
    const originalLogicalId = this.stack.resolve(cfn.logicalId) as string;

    cfn.overrideLogicalId(Lazy.uncachedString({
      produce: () => {
        const hash = calculateFunctionHash(this, this.hashMixins.join(''));
        const logicalId = trimFromStart(originalLogicalId, 255 - 32);
        return `${logicalId}${hash}`;
      },
    }));

    return this._currentVersion;
  }

  public get resourceArnsForGrantInvoke() {
    return [this.functionArn, `${this.functionArn}:*`];
  }

  /** @internal */
  public static _VER_PROPS: { [key: string]: boolean } = {};

  /**
   * Record whether specific properties in the `AWS::Lambda::Function` resource should
   * also be associated to the Version resource.
   * See 'currentVersion' section in the module README for more details.
   * @param propertyName The property to classify
   * @param locked whether the property should be associated to the version or not.
   */
  public static classifyVersionProperty(propertyName: string, locked: boolean) {
    this._VER_PROPS[propertyName] = locked;
  }

  /**
   * Import a lambda function into the CDK using its name
   */
  public static fromFunctionName(scope: Construct, id: string, functionName: string): IFunction {
    return Function.fromFunctionAttributes(scope, id, {
      functionArn: Stack.of(scope).formatArn({
        service: 'lambda',
        resource: 'function',
        resourceName: functionName,
        arnFormat: ArnFormat.COLON_RESOURCE_NAME,
      }),
    });
  }

  /**
   * Import a lambda function into the CDK using its ARN
   */
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
      public readonly architecture = attrs.architecture ?? Architecture.X86_64;
      public readonly resourceArnsForGrantInvoke = [this.functionArn, `${this.functionArn}:*`];

      protected readonly canCreatePermissions = attrs.sameEnvironment ?? this._isStackAccount();
      protected readonly _skipPermissions = attrs.skipPermissions ?? false;

      constructor(s: Construct, i: string) {
        super(s, i, {
          environmentFromArn: functionArn,
        });

        this.grantPrincipal = role || new iam.UnknownPrincipal({ resource: this });

        if (attrs.securityGroup) {
          this._connections = new ec2.Connections({
            securityGroups: [attrs.securityGroup],
          });
        } else if (attrs.securityGroupId) {
          this._connections = new ec2.Connections({
            securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(scope, 'SecurityGroup', attrs.securityGroupId)],
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
      ...props,
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
   * The DLQ (as queue) associated with this Lambda Function (this is an optional attribute).
   */
  public readonly deadLetterQueue?: sqs.IQueue;

  /**
   * The DLQ (as topic) associated with this Lambda Function (this is an optional attribute).
   */
  public readonly deadLetterTopic?: sns.ITopic;

  /**
   * The architecture of this Lambda Function (this is an optional attribute and defaults to X86_64).
   */
  public readonly architecture: Architecture;

  /**
   * The timeout configured for this lambda.
   */
  public readonly timeout?: Duration;

  public readonly permissionsNode = this.node;

  protected readonly canCreatePermissions = true;

  /** @internal */
  public readonly _layers: ILayerVersion[] = [];

  private _logGroup?: logs.ILogGroup;

  /**
   * Environment variables for this function
   */
  private environment: { [key: string]: EnvironmentConfig } = {};

  private readonly currentVersionOptions?: VersionOptions;
  private _currentVersion?: Version;

  private _architecture?: Architecture;
  private hashMixins = new Array<string>();

  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id, {
      physicalName: props.functionName,
    });

    if (props.functionName && !Token.isUnresolved(props.functionName)) {
      if (props.functionName.length > 64) {
        throw new Error(`Function name can not be longer than 64 characters but has ${props.functionName.length} characters.`);
      }
      if (!/^[a-zA-Z0-9-_]+$/.test(props.functionName)) {
        throw new Error(`Function name ${props.functionName} can contain only letters, numbers, hyphens, or underscores with no spaces.`);
      }
    }

    if (props.description && !Token.isUnresolved(props.description)) {
      if (props.description.length > 256) {
        throw new Error(`Function description can not be longer than 256 characters but has ${props.description.length} characters.`);
      }
    }

    const managedPolicies = new Array<iam.IManagedPolicy>();

    // the arn is in the form of - arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
    managedPolicies.push(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));

    if (props.vpc) {
      // Policy that will have ENI creation permissions
      managedPolicies.push(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'));
    }

    this.role = props.role || new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies,
    });
    this.grantPrincipal = this.role;

    // add additional managed policies when necessary
    if (props.filesystem) {
      const config = props.filesystem.config;
      if (config.policies) {
        config.policies.forEach(p => {
          this.role?.addToPrincipalPolicy(p);
        });
      }
    }

    for (const statement of (props.initialPolicy || [])) {
      this.role.addToPrincipalPolicy(statement);
    }

    const code = props.code.bind(this);
    verifyCodeConfig(code, props);

    let profilingGroupEnvironmentVariables: { [key: string]: string } = {};
    if (props.profilingGroup && props.profiling !== false) {
      this.validateProfiling(props);
      props.profilingGroup.grantPublish(this.role);
      profilingGroupEnvironmentVariables = {
        AWS_CODEGURU_PROFILER_GROUP_ARN: Stack.of(scope).formatArn({
          service: 'codeguru-profiler',
          resource: 'profilingGroup',
          resourceName: props.profilingGroup.profilingGroupName,
        }),
        AWS_CODEGURU_PROFILER_ENABLED: 'TRUE',
      };
    } else if (props.profiling) {
      this.validateProfiling(props);
      const profilingGroup = new ProfilingGroup(this, 'ProfilingGroup', {
        computePlatform: ComputePlatform.AWS_LAMBDA,
      });
      profilingGroup.grantPublish(this.role);
      profilingGroupEnvironmentVariables = {
        AWS_CODEGURU_PROFILER_GROUP_ARN: profilingGroup.profilingGroupArn,
        AWS_CODEGURU_PROFILER_ENABLED: 'TRUE',
      };
    }

    const env = { ...profilingGroupEnvironmentVariables, ...props.environment };
    for (const [key, value] of Object.entries(env)) {
      this.addEnvironment(key, value);
    }

    // DLQ can be either sns.ITopic or sqs.IQueue
    const dlqTopicOrQueue = this.buildDeadLetterQueue(props);
    if (dlqTopicOrQueue !== undefined) {
      if (this.isQueue(dlqTopicOrQueue)) {
        this.deadLetterQueue = dlqTopicOrQueue;
      } else {
        this.deadLetterTopic = dlqTopicOrQueue;
      }
    }

    let fileSystemConfigs: CfnFunction.FileSystemConfigProperty[] | undefined = undefined;
    if (props.filesystem) {
      fileSystemConfigs = [{
        arn: props.filesystem.config.arn,
        localMountPath: props.filesystem.config.localMountPath,
      }];
    }

    if (props.architecture && props.architectures !== undefined) {
      throw new Error('Either architecture or architectures must be specified but not both.');
    }
    if (props.architectures && props.architectures.length > 1) {
      throw new Error('Only one architecture must be specified.');
    }
    this._architecture = props.architecture ?? (props.architectures && props.architectures[0]);

    if (props.ephemeralStorageSize && !props.ephemeralStorageSize.isUnresolved()
      && (props.ephemeralStorageSize.toMebibytes() < 512 || props.ephemeralStorageSize.toMebibytes() > 10240)) {
      throw new Error(`Ephemeral storage size must be between 512 and 10240 MB, received ${props.ephemeralStorageSize}.`);
    }

    const resource: CfnFunction = new CfnFunction(this, 'Resource', {
      functionName: this.physicalName,
      description: props.description,
      code: {
        s3Bucket: code.s3Location && code.s3Location.bucketName,
        s3Key: code.s3Location && code.s3Location.objectKey,
        s3ObjectVersion: code.s3Location && code.s3Location.objectVersion,
        zipFile: code.inlineCode,
        imageUri: code.image?.imageUri,
      },
      layers: Lazy.list({ produce: () => this.renderLayers() }), // Evaluated on synthesis
      handler: props.handler === Handler.FROM_IMAGE ? undefined : props.handler,
      timeout: props.timeout && props.timeout.toSeconds(),
      packageType: props.runtime === Runtime.FROM_IMAGE ? 'Image' : undefined,
      runtime: props.runtime === Runtime.FROM_IMAGE ? undefined : props.runtime.name,
      role: this.role.roleArn,
      // Uncached because calling '_checkEdgeCompatibility', which gets called in the resolve of another
      // Token, actually *modifies* the 'environment' map.
      environment: Lazy.uncachedAny({ produce: () => this.renderEnvironment() }),
      memorySize: props.memorySize,
      ephemeralStorage: props.ephemeralStorageSize ? {
        size: props.ephemeralStorageSize.toMebibytes(),
      } : undefined,
      vpcConfig: this.configureVpc(props),
      deadLetterConfig: this.buildDeadLetterConfig(dlqTopicOrQueue),
      reservedConcurrentExecutions: props.reservedConcurrentExecutions,
      imageConfig: undefinedIfNoKeys({
        command: code.image?.cmd,
        entryPoint: code.image?.entrypoint,
        workingDirectory: code.image?.workingDirectory,
      }),
      kmsKeyArn: props.environmentEncryption?.keyArn,
      fileSystemConfigs,
      codeSigningConfigArn: props.codeSigningConfig?.codeSigningConfigArn,
      architectures: this._architecture ? [this._architecture.name] : undefined,
      runtimeManagementConfig: props.runtimeManagementMode?.runtimeManagementConfig,
    });

    if ((props.tracing !== undefined) || (props.adotInstrumentation !== undefined)) {
      resource.tracingConfig = this.buildTracingConfig(props.tracing ?? Tracing.ACTIVE);
    }

    resource.node.addDependency(this.role);

    this.functionName = this.getResourceNameAttribute(resource.ref);
    this.functionArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'lambda',
      resource: 'function',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    this.runtime = props.runtime;
    this.timeout = props.timeout;

    this.architecture = props.architecture ?? Architecture.X86_64;

    if (props.layers) {
      if (props.runtime === Runtime.FROM_IMAGE) {
        throw new Error('Layers are not supported for container image functions');
      }

      this.addLayers(...props.layers);
    }

    for (const event of props.events || []) {
      this.addEventSource(event);
    }

    // Log retention
    if (props.logRetention) {
      const logRetention = new logs.LogRetention(this, 'LogRetention', {
        logGroupName: `/aws/lambda/${this.functionName}`,
        retention: props.logRetention,
        role: props.logRetentionRole,
        logRetentionRetryOptions: props.logRetentionRetryOptions as logs.LogRetentionRetryOptions,
      });
      this._logGroup = logs.LogGroup.fromLogGroupArn(this, 'LogGroup', logRetention.logGroupArn);
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

    if (props.filesystem) {
      if (!props.vpc) {
        throw new Error('Cannot configure \'filesystem\' without configuring a VPC.');
      }
      const config = props.filesystem.config;
      if (config.dependency) {
        this.node.addDependency(...config.dependency);
      }
      // There could be a race if the Lambda is used in a CustomResource. It is possible for the Lambda to
      // fail to attach to a given FileSystem if we do not have a dependency on the SecurityGroup ingress/egress
      // rules that were created between this Lambda's SG & the Filesystem SG.
      this.connections.securityGroups.forEach(sg => {
        sg.node.findAll().forEach(child => {
          if (child instanceof CfnResource && child.cfnResourceType === 'AWS::EC2::SecurityGroupEgress') {
            resource.node.addDependency(child);
          }
        });
      });
      config.connections?.securityGroups.forEach(sg => {
        sg.node.findAll().forEach(child => {
          if (child instanceof CfnResource && child.cfnResourceType === 'AWS::EC2::SecurityGroupIngress') {
            resource.node.addDependency(child);
          }
        });
      });
    }

    // Configure Lambda insights
    this.configureLambdaInsights(props);

    this.configureAdotInstrumentation(props);
  }

  /**
   * Adds an environment variable to this Lambda function.
   * If this is a ref to a Lambda function, this operation results in a no-op.
   * @param key The environment variable key.
   * @param value The environment variable's value.
   * @param options Environment variable options.
   */
  public addEnvironment(key: string, value: string, options?: EnvironmentOptions): this {
    // Reserved environment variables will fail during cloudformation deploy if they're set.
    // This check is just to allow CDK to fail faster when these are specified.
    const reservedEnvironmentVariables = [
      '_HANDLER',
      '_X_AMZN_TRACE_ID',
      'AWS_REGION',
      'AWS_EXECUTION_ENV',
      'AWS_LAMBDA_FUNCTION_NAME',
      'AWS_LAMBDA_FUNCTION_MEMORY_SIZE',
      'AWS_LAMBDA_FUNCTION_VERSION',
      'AWS_LAMBDA_INITIALIZATION_TYPE',
      'AWS_LAMBDA_LOG_GROUP_NAME',
      'AWS_LAMBDA_LOG_STREAM_NAME',
      'AWS_ACCESS_KEY',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_SESSION_TOKEN',
      'AWS_LAMBDA_RUNTIME_API',
      'LAMBDA_TASK_ROOT',
      'LAMBDA_RUNTIME_DIR',
    ];
    if (reservedEnvironmentVariables.includes(key)) {
      throw new Error(`${key} environment variable is reserved by the lambda runtime and can not be set manually. See https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html`);
    }
    this.environment[key] = { value, ...options };
    return this;
  }

  /**
   * Mix additional information into the hash of the Version object
   *
   * The Lambda Function construct does its best to automatically create a new
   * Version when anything about the Function changes (its code, its layers,
   * any of the other properties).
   *
   * However, you can sometimes source information from places that the CDK cannot
   * look into, like the deploy-time values of SSM parameters. In those cases,
   * the CDK would not force the creation of a new Version object when it actually
   * should.
   *
   * This method can be used to invalidate the current Version object. Pass in
   * any string into this method, and make sure the string changes when you know
   * a new Version needs to be created.
   *
   * This method may be called more than once.
   */
  public invalidateVersionBasedOn(x: string) {
    if (Token.isUnresolved(x)) {
      throw new Error('invalidateVersionOn: input may not contain unresolved tokens');
    }
    this.hashMixins.push(x);
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
      if (this._layers.length === 5) {
        throw new Error('Unable to add layer: this lambda function already uses 5 layers.');
      }
      if (layer.compatibleRuntimes && !layer.compatibleRuntimes.find(runtime => runtime.runtimeEquals(this.runtime))) {
        const runtimes = layer.compatibleRuntimes.map(runtime => runtime.name).join(', ');
        throw new Error(`This lambda function uses a runtime that is incompatible with this layer (${this.runtime.name} is not in [${runtimes}])`);
      }

      // Currently no validations for compatible architectures since Lambda service
      // allows layers configured with one architecture to be used with a Lambda function
      // from another architecture.
      this._layers.push(layer);
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
   * Defines an alias for this function.
   *
   * The alias will automatically be updated to point to the latest version of
   * the function as it is being updated during a deployment.
   *
   * ```ts
   * declare const fn: lambda.Function;
   *
   * fn.addAlias('Live');
   *
   * // Is equivalent to
   *
   * new lambda.Alias(this, 'AliasLive', {
   *   aliasName: 'Live',
   *   version: fn.currentVersion,
   * });
   * ```
   *
   * @param aliasName The name of the alias
   * @param options Alias options
   */
  public addAlias(aliasName: string, options?: AliasOptions): Alias {
    return addAlias(this, this.currentVersion, aliasName, options);
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
      const logRetention = new logs.LogRetention(this, 'LogRetention', {
        logGroupName: `/aws/lambda/${this.functionName}`,
        retention: logs.RetentionDays.INFINITE,
      });
      this._logGroup = logs.LogGroup.fromLogGroupArn(this, `${this.node.id}-LogGroup`, logRetention.logGroupArn);
    }
    return this._logGroup;
  }

  /** @internal */
  public _checkEdgeCompatibility(): void {
    // Check env vars
    const envEntries = Object.entries(this.environment);
    for (const [key, config] of envEntries) {
      if (config.removeInEdge) {
        delete this.environment[key];
        Annotations.of(this).addInfo(`Removed ${key} environment variable for Lambda@Edge compatibility`);
      }
    }
    const envKeys = Object.keys(this.environment);
    if (envKeys.length !== 0) {
      throw new Error(`The function ${this.node.path} contains environment variables [${envKeys}] and is not compatible with Lambda@Edge. \
Environment variables can be marked for removal when used in Lambda@Edge by setting the \'removeInEdge\' property in the \'addEnvironment()\' API.`);
    }

    return;
  }

  /**
   * Configured lambda insights on the function if specified. This is acheived by adding an imported layer which is added to the
   * list of lambda layers on synthesis.
   *
   * https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-extension-versions.html
   */
  private configureLambdaInsights(props: FunctionProps): void {
    if (props.insightsVersion === undefined) {
      return;
    }
    if (props.runtime !== Runtime.FROM_IMAGE) {
      // Layers cannot be added to Lambda container images. The image should have the insights agent installed.
      // See https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/Lambda-Insights-Getting-Started-docker.html
      this.addLayers(LayerVersion.fromLayerVersionArn(this, 'LambdaInsightsLayer', props.insightsVersion._bind(this, this).arn));
    }
    this.role?.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy'));
  }

  /**
   * Add an AWS Distro for OpenTelemetry Lambda layer.
   *
   * @param props properties for the ADOT instrumentation
   */
  private configureAdotInstrumentation(props: FunctionProps): void {

    if (props.adotInstrumentation === undefined) {
      return;
    }

    if (props.runtime === Runtime.FROM_IMAGE) {
      throw new Error("ADOT Lambda layer can't be configured with container image package type");
    }

    // This is not the complete list of incompatible runtimes and layer types. We are only
    // checking for common mistakes on a best-effort basis.
    if (this.runtime === Runtime.GO_1_X) {
      throw new Error('Runtime go1.x is not supported by the ADOT Lambda Go SDK');
    }

    this.addLayers(LayerVersion.fromLayerVersionArn(this, 'AdotLayer', props.adotInstrumentation.layerVersion._bind(this).arn));
    this.addEnvironment('AWS_LAMBDA_EXEC_WRAPPER', props.adotInstrumentation.execWrapper);
  }

  private renderLayers() {
    if (!this._layers || this._layers.length === 0) {
      return undefined;
    }

    if (FeatureFlags.of(this).isEnabled(LAMBDA_RECOGNIZE_LAYER_VERSION)) {
      this._layers.sort();
    }

    return this._layers.map(layer => layer.layerVersionArn);
  }

  private renderEnvironment() {
    if (!this.environment || Object.keys(this.environment).length === 0) {
      return undefined;
    }

    const variables: { [key: string]: string } = {};
    // Sort environment so the hash of the function used to create
    // `currentVersion` is not affected by key order (this is how lambda does
    // it). For backwards compatibility we do not sort environment variables in case
    // _currentVersion is not defined. Otherwise, this would have invalidated
    // the template, and for example, may cause unneeded updates for nested
    // stacks.
    const keys = this._currentVersion
      ? Object.keys(this.environment).sort()
      : Object.keys(this.environment);

    for (const key of keys) {
      variables[key] = this.environment[key].value;
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

    if (!props.vpc) {
      if (props.vpcSubnets) {
        throw new Error('Cannot configure \'vpcSubnets\' without configuring a VPC');
      }
      return undefined;
    }


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
        description: 'Automatic security group for Lambda Function ' + Names.uniqueId(this),
        allowAllOutbound: props.allowAllOutbound,
      });
      securityGroups = [securityGroup];
    }

    this._connections = new ec2.Connections({ securityGroups });

    if (props.filesystem) {
      if (props.filesystem.config.connections) {
        props.filesystem.config.connections.allowDefaultPortFrom(this);
      }
    }

    const allowPublicSubnet = props.allowPublicSubnet ?? false;
    const selectedSubnets = props.vpc.selectSubnets(props.vpcSubnets);
    const publicSubnetIds = new Set(props.vpc.publicSubnets.map(s => s.subnetId));
    for (const subnetId of selectedSubnets.subnetIds) {
      if (publicSubnetIds.has(subnetId) && !allowPublicSubnet) {
        throw new Error('Lambda Functions in a public subnet can NOT access the internet. ' +
          'If you are aware of this limitation and would still like to place the function in a public subnet, set `allowPublicSubnet` to true');
      }
    }
    this.node.addDependency(selectedSubnets.internetConnectivityEstablished);

    // List can't be empty here, if we got this far you intended to put your Lambda
    // in subnets. We're going to guarantee that we get the nice error message by
    // making VpcNetwork do the selection again.

    return {
      subnetIds: selectedSubnets.subnetIds,
      securityGroupIds: securityGroups.map(sg => sg.securityGroupId),
    };
  }

  private isQueue(deadLetterQueue: sqs.IQueue | sns.ITopic): deadLetterQueue is sqs.IQueue {
    return (<sqs.IQueue>deadLetterQueue).queueArn !== undefined;
  }

  private buildDeadLetterQueue(props: FunctionProps): sqs.IQueue | sns.ITopic | undefined {
    if (!props.deadLetterQueue && !props.deadLetterQueueEnabled && !props.deadLetterTopic) {
      return undefined;
    }
    if (props.deadLetterQueue && props.deadLetterQueueEnabled === false) {
      throw Error('deadLetterQueue defined but deadLetterQueueEnabled explicitly set to false');
    }
    if (props.deadLetterTopic && (props.deadLetterQueue || props.deadLetterQueueEnabled !== undefined)) {
      throw new Error('deadLetterQueue and deadLetterTopic cannot be specified together at the same time');
    }

    let deadLetterQueue: sqs.IQueue | sns.ITopic;
    if (props.deadLetterTopic) {
      deadLetterQueue = props.deadLetterTopic;
      this.addToRolePolicy(new iam.PolicyStatement({
        actions: ['sns:Publish'],
        resources: [deadLetterQueue.topicArn],
      }));
    } else {
      deadLetterQueue = props.deadLetterQueue || new sqs.Queue(this, 'DeadLetterQueue', {
        retentionPeriod: Duration.days(14),
      });
      this.addToRolePolicy(new iam.PolicyStatement({
        actions: ['sqs:SendMessage'],
        resources: [deadLetterQueue.queueArn],
      }));
    }

    return deadLetterQueue;
  }

  private buildDeadLetterConfig(deadLetterQueue?: sqs.IQueue | sns.ITopic) {
    if (deadLetterQueue) {
      return {
        targetArn: this.isQueue(deadLetterQueue) ? deadLetterQueue.queueArn : deadLetterQueue.topicArn,
      };
    } else {
      return undefined;
    }
  }

  private buildTracingConfig(tracing: Tracing) {
    if (tracing === undefined || tracing === Tracing.DISABLED) {
      return undefined;
    }

    this.addToRolePolicy(new iam.PolicyStatement({
      actions: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
      resources: ['*'],
    }));

    return {
      mode: tracing,
    };
  }

  private validateProfiling(props: FunctionProps) {
    if (!props.runtime.supportsCodeGuruProfiling) {
      throw new Error(`CodeGuru profiling is not supported by runtime ${props.runtime.name}`);
    }
    if (props.environment && (props.environment.AWS_CODEGURU_PROFILER_GROUP_ARN || props.environment.AWS_CODEGURU_PROFILER_ENABLED)) {
      throw new Error('AWS_CODEGURU_PROFILER_GROUP_ARN and AWS_CODEGURU_PROFILER_ENABLED must not be set when profiling options enabled');
    }
  }
}

/**
 * Environment variables options
 */
export interface EnvironmentOptions {
  /**
   * When used in Lambda@Edge via edgeArn() API, these environment
   * variables will be removed. If not set, an error will be thrown.
   * @see https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-requirements-limits.html#lambda-requirements-lambda-function-configuration
   *
   * @default false - using the function in Lambda@Edge will throw
   */
  readonly removeInEdge?: boolean
}

/**
 * Configuration for an environment variable
 */
interface EnvironmentConfig extends EnvironmentOptions {
  readonly value: string;
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

export function verifyCodeConfig(code: CodeConfig, props: FunctionProps) {
  // mutually exclusive
  const codeType = [code.inlineCode, code.s3Location, code.image];

  if (codeType.filter(x => !!x).length !== 1) {
    throw new Error('lambda.Code must specify exactly one of: "inlineCode", "s3Location", or "image"');
  }

  if (!!code.image === (props.handler !== Handler.FROM_IMAGE)) {
    throw new Error('handler must be `Handler.FROM_IMAGE` when using image asset for Lambda function');
  }

  if (!!code.image === (props.runtime !== Runtime.FROM_IMAGE)) {
    throw new Error('runtime must be `Runtime.FROM_IMAGE` when using image asset for Lambda function');
  }

  // if this is inline code, check that the runtime supports
  if (code.inlineCode && !props.runtime.supportsInlineCode) {
    throw new Error(`Inline source not allowed for ${props.runtime!.name}`);
  }
}

function undefinedIfNoKeys<A extends { [key:string]: unknown }>(struct: A): A | undefined {
  const allUndefined = Object.values(struct).every(val => val === undefined);
  return allUndefined ? undefined : struct;
}

/**
 * Aspect for upgrading function versions when the feature flag
 * provided feature flag present. This can be necessary when the feature flag
 * changes the function hash, as such changes must be associated with a new
 * version. This aspect will change the function description in these cases,
 * which "validates" the new function hash.
 */
export class FunctionVersionUpgrade implements IAspect {
  constructor(private readonly featureFlag: string, private readonly enabled=true) {}

  public visit(node: IConstruct): void {
    if (node instanceof Function &&
      this.enabled === FeatureFlags.of(node).isEnabled(this.featureFlag)) {
      const cfnFunction = node.node.defaultChild as CfnFunction;
      const desc = cfnFunction.description ? `${cfnFunction.description} ` : '';
      cfnFunction.addPropertyOverride('Description', `${desc}version-hash:${calculateFunctionHash(node)}`);
    }
  };
}
