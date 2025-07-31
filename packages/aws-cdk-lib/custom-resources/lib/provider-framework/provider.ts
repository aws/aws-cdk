import * as path from 'path';
import { Construct } from 'constructs';
import * as consts from './runtime/consts';
import { calculateRetryPolicy } from './util';
import { LogOptions, WaiterStateMachine } from './waiter-state-machine';
import { CustomResourceProviderConfig, ICustomResourceProvider } from '../../../aws-cloudformation';
import * as ec2 from '../../../aws-ec2';
import * as iam from '../../../aws-iam';
import * as kms from '../../../aws-kms';
import * as lambda from '../../../aws-lambda';
import * as logs from '../../../aws-logs';
import { Duration, ValidationError } from '../../../core';
import { propertyInjectable } from '../../../core/lib/prop-injectable';

const RUNTIME_HANDLER_PATH = path.join(__dirname, 'runtime');
const FRAMEWORK_HANDLER_TIMEOUT = Duration.minutes(15); // keep it simple for now

/**
 * Initialization properties for the `Provider` construct.
 */
export interface ProviderProps {

  /**
   * The AWS Lambda function to invoke for all resource lifecycle operations
   * (CREATE/UPDATE/DELETE).
   *
   * This function is responsible to begin the requested resource operation
   * (CREATE/UPDATE/DELETE) and return any additional properties to add to the
   * event, which will later be passed to `isComplete`. The `PhysicalResourceId`
   * property must be included in the response.
   */
  readonly onEventHandler: lambda.IFunction;

  /**
   * The AWS Lambda function to invoke in order to determine if the operation is
   * complete.
   *
   * This function will be called immediately after `onEvent` and then
   * periodically based on the configured query interval as long as it returns
   * `false`. If the function still returns `false` and the alloted timeout has
   * passed, the operation will fail.
   *
   * @default - provider is synchronous. This means that the `onEvent` handler
   * is expected to finish all lifecycle operations within the initial invocation.
   */
  readonly isCompleteHandler?: lambda.IFunction;

  /**
   * Time between calls to the `isComplete` handler which determines if the
   * resource has been stabilized.
   *
   * The first `isComplete` will be called immediately after `handler` and then
   * every `queryInterval` seconds, and until `timeout` has been reached or until
   * `isComplete` returns `true`.
   *
   * @default Duration.seconds(5)
   */
  readonly queryInterval?: Duration;

  /**
   * Total timeout for the entire operation.
   *
   * The maximum timeout is 1 hour (yes, it can exceed the AWS Lambda 15 minutes)
   *
   * @default Duration.minutes(30)
   */
  readonly totalTimeout?: Duration;

  /**
   * The number of days framework log events are kept in CloudWatch Logs. When
   * updating this property, unsetting it doesn't remove the log retention policy.
   * To remove the retention policy, set the value to `INFINITE`.
   *
   * This is a legacy API and we strongly recommend you migrate to `logGroup` if you can.
   * `logGroup` allows you to create a fully customizable log group and instruct the Lambda function to send logs to it.
   *
   * @default logs.RetentionDays.INFINITE
   */
  readonly logRetention?: logs.RetentionDays;

  /**
   * The Log Group used for logging of events emitted by the custom resource's lambda function.
   *
   * Providing a user-controlled log group was rolled out to commercial regions on 2023-11-16.
   * If you are deploying to another type of region, please check regional availability first.
   *
   * @default - a default log group created by AWS Lambda
   */
  readonly logGroup?: logs.ILogGroup;

  /**
   * The vpc to provision the lambda functions in.
   *
   * @default - functions are not provisioned inside a vpc.
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Which subnets from the VPC to place the lambda functions in.
   *
   * Only used if 'vpc' is supplied. Note: internet access for Lambdas
   * requires a NAT gateway, so picking Public subnets is not allowed.
   *
   * @default - the Vpc default strategy if not specified
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Security groups to attach to the provider functions.
   *
   * Only used if 'vpc' is supplied
   *
   * @default - If `vpc` is not supplied, no security groups are attached. Otherwise, a dedicated security
   * group is created for each function.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * AWS Lambda execution role.
   *
   * The role is shared by provider framework's onEvent, isComplete lambda, and onTimeout Lambda functions.
   * This role will be assumed by the AWS Lambda, so it must be assumable by the 'lambda.amazonaws.com'
   * service principal.
   *
   * @default - A default role will be created.
   * @deprecated - Use frameworkOnEventRole, frameworkCompleteAndTimeoutRole
   */
  readonly role?: iam.IRole;

  /**
   * Lambda execution role for provider framework's onEvent Lambda function. Note that this role must be assumed
   * by the 'lambda.amazonaws.com' service principal.
   *
   * This property cannot be used with 'role' property
   *
   * @default - A default role will be created.
   */
  readonly frameworkOnEventRole?: iam.IRole;

  /**
   * Lambda execution role for provider framework's isComplete/onTimeout Lambda function. Note that this role
   * must be assumed by the 'lambda.amazonaws.com' service principal. To prevent circular dependency problem
   * in the provider framework, please ensure you specify a different IAM Role for 'frameworkCompleteAndTimeoutRole'
   * from 'frameworkOnEventRole'.
   *
   * This property cannot be used with 'role' property
   *
   * @default - A default role will be created.
   */
  readonly frameworkCompleteAndTimeoutRole?: iam.IRole;

  /**
   * Provider Lambda name.
   *
   * The provider lambda function name.
   *
   * @default -  CloudFormation default name from unique physical ID
   */
  readonly providerFunctionName?: string;

  /**
   * AWS KMS key used to encrypt provider lambda's environment variables.
   *
   * @default -  AWS Lambda creates and uses an AWS managed customer master key (CMK)
   */
  readonly providerFunctionEnvEncryption?: kms.IKey;

  /**
   * Defines what execution history events of the waiter state machine are logged and where they are logged.
   *
   * @default - A default log group will be created if logging for the waiter state machine is enabled.
   */
  readonly waiterStateMachineLogOptions?: LogOptions;

  /**
   * Whether logging for the waiter state machine is disabled.
   *
   * @default - true
   */
  readonly disableWaiterStateMachineLogging?: boolean;

  /**
   * Log level of the provider framework lambda
   *
   * @default true - Logging is disabled by default
   */
  readonly frameworkLambdaLoggingLevel?: lambda.ApplicationLogLevel;
}

/**
 * Defines an AWS CloudFormation custom resource provider.
 */
@propertyInjectable
export class Provider extends Construct implements ICustomResourceProvider {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-custom-resources.Provider';

  /**
   * The user-defined AWS Lambda function which is invoked for all resource
   * lifecycle operations (CREATE/UPDATE/DELETE).
   */
  public readonly onEventHandler: lambda.IFunction;

  /**
   * The user-defined AWS Lambda function which is invoked asynchronously in
   * order to determine if the operation is complete.
   */
  public readonly isCompleteHandler?: lambda.IFunction;

  /**
   * The service token to use in order to define custom resources that are
   * backed by this provider.
   */
  public readonly serviceToken: string;

  private readonly entrypoint: lambda.Function;
  private readonly logRetention?: logs.RetentionDays;
  private readonly logGroup?: logs.ILogGroup;
  private readonly vpc?: ec2.IVpc;
  private readonly vpcSubnets?: ec2.SubnetSelection;
  private readonly securityGroups?: ec2.ISecurityGroup[];
  private readonly role?: iam.IRole;
  private readonly providerFunctionEnvEncryption?: kms.IKey;
  private readonly frameworkLambdaLoggingLevel?: lambda.ApplicationLogLevel;

  constructor(scope: Construct, id: string, props: ProviderProps) {
    super(scope, id);

    if (!props.isCompleteHandler) {
      if (
        props.queryInterval
        || props.totalTimeout
        || props.waiterStateMachineLogOptions
        || props.disableWaiterStateMachineLogging !== undefined
      ) {
        throw new ValidationError('"queryInterval", "totalTimeout", "waiterStateMachineLogOptions", and "disableWaiterStateMachineLogging" '
          + 'can only be configured if "isCompleteHandler" is specified. '
          + 'Otherwise, they have no meaning', this);
      }
    }

    if (props.role && (props.frameworkOnEventRole || props.frameworkCompleteAndTimeoutRole)) {
      throw new ValidationError('Cannot specify both "role" and any of "frameworkOnEventRole" or "frameworkCompleteAndTimeoutRole".', this);
    }
    if (!props.isCompleteHandler && props.frameworkCompleteAndTimeoutRole) {
      throw new ValidationError('Cannot specify "frameworkCompleteAndTimeoutRole" when "isCompleteHandler" is not specified.', this);
    }

    this.onEventHandler = props.onEventHandler;
    this.isCompleteHandler = props.isCompleteHandler;

    this.frameworkLambdaLoggingLevel = props.frameworkLambdaLoggingLevel ?? lambda.ApplicationLogLevel.FATAL;

    this.logRetention = props.logRetention;
    this.logGroup = props.logGroup;
    this.vpc = props.vpc;
    this.vpcSubnets = props.vpcSubnets;
    this.securityGroups = props.securityGroups;

    this.role = props.role;
    this.providerFunctionEnvEncryption = props.providerFunctionEnvEncryption;

    const onEventFunction = this.createFunction(consts.FRAMEWORK_ON_EVENT_HANDLER_NAME, props.providerFunctionName, props.frameworkOnEventRole);

    if (this.isCompleteHandler) {
      const isCompleteFunction = this.createFunction(consts.FRAMEWORK_IS_COMPLETE_HANDLER_NAME, undefined, props.frameworkCompleteAndTimeoutRole);
      const timeoutFunction = this.createFunction(consts.FRAMEWORK_ON_TIMEOUT_HANDLER_NAME, undefined, props.frameworkCompleteAndTimeoutRole);

      const retry = calculateRetryPolicy(this, props);
      const waiterStateMachine = new WaiterStateMachine(this, 'waiter-state-machine', {
        isCompleteHandler: isCompleteFunction,
        timeoutHandler: timeoutFunction,
        backoffRate: retry.backoffRate,
        interval: retry.interval,
        maxAttempts: retry.maxAttempts,
        logOptions: props.waiterStateMachineLogOptions,
        disableLogging: props.disableWaiterStateMachineLogging ?? true,
      });
      // the on-event entrypoint is going to start the execution of the waiter
      onEventFunction.addEnvironment(consts.WAITER_STATE_MACHINE_ARN_ENV, waiterStateMachine.stateMachineArn);
      waiterStateMachine.grantStartExecution(onEventFunction);
    }

    this.entrypoint = onEventFunction;
    this.serviceToken = this.entrypoint.functionArn;
  }

  /**
   * Called by `CustomResource` which uses this provider.
   * @deprecated use `provider.serviceToken` instead
   */
  public bind(_scope: Construct): CustomResourceProviderConfig {
    return {
      serviceToken: this.entrypoint.functionArn,
    };
  }

  private addPermissions(frameworkLambda: lambda.Function, userDefinedHandlerLambda: lambda.IFunction) {
    userDefinedHandlerLambda.grantInvoke(frameworkLambda);

    /*
    lambda:GetFunction is needed as the framework Lambda use it to poll the state of User Defined
    Handler until it is ACTIVE state
     */
    frameworkLambda.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['lambda:GetFunction'],
      resources: [userDefinedHandlerLambda.functionArn],
    }));
  }

  private createFunction(entrypoint: string, name?: string, role?: iam.IRole) {
    // Determine logging configuration - disabled by default for security
    const loggingLevel = this.frameworkLambdaLoggingLevel;

    const fn = new lambda.Function(this, `framework-${entrypoint}`, {
      code: lambda.Code.fromAsset(RUNTIME_HANDLER_PATH, {
        exclude: ['*.ts'],
      }),
      description: `AWS CDK resource provider framework - ${entrypoint} (${this.node.path})`.slice(0, 256),
      runtime: lambda.determineLatestNodeRuntime(this),
      handler: `framework.${entrypoint}`,
      timeout: FRAMEWORK_HANDLER_TIMEOUT,

      // Using loggingFormat instead of deprecated logFormat which will be removed in the next major release
      loggingFormat: lambda.LoggingFormat.JSON,
      applicationLogLevelV2: loggingLevel,
      // props.logRetention is deprecated, make sure we only set it if it is actually provided
      // otherwise jsii will print warnings even for users that don't use this directly
      ...(this.logRetention ? { logRetention: this.logRetention } : {}),
      logGroup: this.logGroup,
      vpc: this.vpc,
      vpcSubnets: this.vpcSubnets,
      securityGroups: this.securityGroups,
      role: this.role ?? role,
      functionName: name,
      environmentEncryption: this.providerFunctionEnvEncryption,
    });

    fn.addEnvironment(consts.USER_ON_EVENT_FUNCTION_ARN_ENV, this.onEventHandler.functionArn);
    this.addPermissions(fn, this.onEventHandler);

    if (this.isCompleteHandler) {
      fn.addEnvironment(consts.USER_IS_COMPLETE_FUNCTION_ARN_ENV, this.isCompleteHandler.functionArn);
      this.addPermissions(fn, this.isCompleteHandler);
    }

    return fn;
  }
}
