import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct, Stack } from '@aws-cdk/core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for StartExecution
 */
export interface StepFunctionsStartExecutionProps extends sfn.TaskStateBaseProps {
  /**
   * The Step Functions state machine to start the execution on.
   */
  readonly stateMachine: sfn.IStateMachine;

  /**
   * The JSON input for the execution, same as that of StartExecution.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
   *
   * @default - No input
   */
  readonly input?: sfn.TaskInput;

  /**
   * The name of the execution, same as that of StartExecution.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
   *
   * @default - None
   */
  readonly name?: string;
}

/**
 * A Step Functions Task to call StartExecution on another state machine.
 *
 * It supports three service integration patterns: FIRE_AND_FORGET, SYNC and WAIT_FOR_TASK_TOKEN.
 */
export class StepFunctionsStartExecution extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: StepFunctionsStartExecutionProps) {
    super(scope, id, props);

    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;
    validatePatternSupported(this.integrationPattern, StepFunctionsStartExecution.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN && !sfn.FieldUtils.containsTaskToken(props.input)) {
      throw new Error('Task Token is required in `input` for callback. Use Context.taskToken to set the token.');
    }

    this.taskPolicies = this.createScopedAccessPolicy();
  }

  protected renderTask(): any {
    return {
      Resource:
        integrationResourceArn('states', 'startExecution', this.integrationPattern) +
        (this.integrationPattern === sfn.IntegrationPattern.RUN_JOB ? ':2' : ''),
      Parameters: sfn.FieldUtils.renderObject({
        Input: this.props.input?.value,
        StateMachineArn: this.props.stateMachine.stateMachineArn,
        Name: this.props.name,
      }),
    };
  }

  /**
   * As StateMachineArn is extracted automatically from the state machine object included in the constructor,
   *
   * the scoped access policy should be generated accordingly.
   *
   * This means the action of StartExecution should be restricted on the given state machine, instead of being granted to all the resources (*).
   */
  private createScopedAccessPolicy(): iam.PolicyStatement[] {
    const stack = Stack.of(this);

    const policyStatements = [
      new iam.PolicyStatement({
        actions: ['states:StartExecution'],
        resources: [this.props.stateMachine.stateMachineArn],
      }),
    ];

    // Step Functions use Cloud Watch managed rules to deal with synchronous tasks.
    if (this.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      policyStatements.push(
        new iam.PolicyStatement({
          actions: ['states:DescribeExecution', 'states:StopExecution'],
          // https://docs.aws.amazon.com/step-functions/latest/dg/concept-create-iam-advanced.html#concept-create-iam-advanced-execution
          resources: [
            stack.formatArn({
              service: 'states',
              resource: 'execution',
              sep: ':',
              resourceName: `${stack.parseArn(this.props.stateMachine.stateMachineArn, ':').resourceName}*`,
            }),
          ],
        }),
      );

      policyStatements.push(
        new iam.PolicyStatement({
          actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
          resources: [
            stack.formatArn({
              service: 'events',
              resource: 'rule',
              resourceName: 'StepFunctionsGetEventsForStepFunctionsExecutionRule',
            }),
          ],
        }),
      );
    }

    return policyStatements;
  }
}
