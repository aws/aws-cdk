import { Construct } from 'constructs';
import { Grant, IGrantable, PolicyStatement, Role, ServicePrincipal } from '../../../aws-iam';
import { IFunction } from '../../../aws-lambda';
import { ILogGroup, LogGroup } from '../../../aws-logs';
import { CfnStateMachine, LogLevel } from '../../../aws-stepfunctions';
import { Duration, FeatureFlags, Stack } from '../../../core';
import * as cxapi from '../../../cx-api';

/**
 * Log Options for the state machine.
 */
export interface LogOptions {
  /**
   * The log group where the execution history events will be logged.
   *
   * @default - a new log group will be created
   */
  readonly destination?: ILogGroup;

  /**
   * Determines whether execution data is included in your log.
   *
   * @default - false
   */
  readonly includeExecutionData?: boolean;

  /**
   * Defines which category of execution history events are logged.
   *
   * @default - ERROR
   */
  readonly level?: LogLevel;
}

/**
 * Initialization properties for the `WaiterStateMachine` construct.
 */
export interface WaiterStateMachineProps {
  /**
   * The main handler that notifies if the waiter to decide 'complete' or 'incomplete'.
   */
  readonly isCompleteHandler: IFunction;

  /**
   * The handler to call if the waiter times out and is incomplete.
   */
  readonly timeoutHandler: IFunction;

  /**
   * The interval to wait between attempts.
   */
  readonly interval: Duration;

  /**
   * Number of attempts.
   */
  readonly maxAttempts: number;

  /**
   * Backoff between attempts.
   */
  readonly backoffRate: number;

  /**
   * Defines what execution history events are logged and where they are logged.
   *
   * @default - A default log group will be created if logging is enabled.
   */
  readonly logOptions?: LogOptions;

  /**
   * Whether logging for the state machine is disabled.
   *
   * @default - false
   */
  readonly disableLogging?: boolean;
}

/**
 * A very simple StateMachine construct highly customized to the provider framework.
 * We previously used `CfnResource` instead of `CfnStateMachine` to avoid depending
 * on `aws-stepfunctions` module, but now it is okay.
 *
 * The state machine continuously calls the isCompleteHandler, until it succeeds or times out.
 * The handler is called `maxAttempts` times with an `interval` duration and a `backoffRate` rate.
 */
export class WaiterStateMachine extends Construct {
  /**
   * The ARN of the state machine.
   */
  public readonly stateMachineArn: string;

  constructor(scope: Construct, id: string, props: WaiterStateMachineProps) {
    super(scope, id);

    const role = new Role(this, 'Role', {
      assumedBy: new ServicePrincipal('states.amazonaws.com'),
    });
    props.isCompleteHandler.grantInvoke(role);
    props.timeoutHandler.grantInvoke(role);

    const definition = Stack.of(this).toJsonString({
      StartAt: 'framework-isComplete-task',
      States: {
        'framework-isComplete-task': {
          End: true,
          Retry: [{
            ErrorEquals: ['States.ALL'],
            IntervalSeconds: props.interval.toSeconds(),
            MaxAttempts: props.maxAttempts,
            BackoffRate: props.backoffRate,
          }],
          Catch: [{
            ErrorEquals: ['States.ALL'],
            Next: 'framework-onTimeout-task',
          }],
          Type: 'Task',
          Resource: props.isCompleteHandler.functionArn,
        },
        'framework-onTimeout-task': {
          End: true,
          Type: 'Task',
          Resource: props.timeoutHandler.functionArn,
        },
      },
    });

    const resource = new CfnStateMachine(this, 'Resource', {
      definitionString: definition,
      roleArn: role.roleArn,
      loggingConfiguration: this.renderLoggingConfiguration(role, props.logOptions, props.disableLogging),
    });
    resource.node.addDependency(role);

    this.stateMachineArn = resource.ref;
  }

  /**
   * Grant the given identity permissions on StartExecution of the state machine.
   */
  public grantStartExecution(identity: IGrantable) {
    return Grant.addToPrincipal({
      grantee: identity,
      actions: ['states:StartExecution'],
      resourceArns: [this.stateMachineArn],
    });
  }

  private renderLoggingConfiguration(
    role: Role,
    logOptions?: LogOptions,
    disableLogging?: boolean,
  ): CfnStateMachine.LoggingConfigurationProperty | undefined {
    if (disableLogging) return undefined;

    // You need to specify `*` in the Resource field because CloudWatch API actions, such as
    // CreateLogDelivery and DescribeLogGroups, don't support Resource types defined by Amazon
    // CloudWatch Logs.
    // https://docs.aws.amazon.com/step-functions/latest/dg/cw-logs.html#cloudwatch-iam-policy
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: [
        'logs:CreateLogDelivery',
        'logs:CreateLogStream',
        'logs:GetLogDelivery',
        'logs:UpdateLogDelivery',
        'logs:DeleteLogDelivery',
        'logs:ListLogDeliveries',
        'logs:PutLogEvents',
        'logs:PutResourcePolicy',
        'logs:DescribeResourcePolicies',
        'logs:DescribeLogGroups',
      ],
      resources: ['*'],
    }));

    // Using `node.addr` because it needs to be a unique log group name in the AWS account,
    // not using `node.path` because of the possibility of exceeding the maximum number of characters for the log group name.
    // The `addr` value does not change when moving the construct tree using the ID `Default`.
    const logGroupName =
      FeatureFlags.of(this).isEnabled(cxapi.WAITER_STATE_MACHINE_LOG_GROUP_NAME)
        ? `/aws/vendedlogs/states/waiter-state-machine-${this.node.addr}-Logs`
        : undefined;
    const logGroup = logOptions?.destination ?? new LogGroup(this, 'LogGroup', {
      logGroupName,
    });

    return {
      destinations: [{
        cloudWatchLogsLogGroup: {
          logGroupArn: logGroup.logGroupArn,
        },
      }],
      includeExecutionData: logOptions?.includeExecutionData ?? false,
      level: logOptions?.level ?? LogLevel.ERROR,
    };
  }
}
