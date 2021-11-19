import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { ArnFormat, Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * Properties for StartExecution
 *
 * @deprecated - use 'StepFunctionsStartExecution'
 */
export interface StartExecutionProps {
  /**
   * The JSON input for the execution, same as that of StartExecution.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
   *
   * @default - No input
   */
  readonly input?: { [key: string]: any };

  /**
   * The name of the execution, same as that of StartExecution.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
   *
   * @default - None
   */
  readonly name?: string;

  /**
   * The service integration pattern indicates different ways to call StartExecution to Step Functions.
   *
   * @default FIRE_AND_FORGET
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html
   */
  readonly integrationPattern?: sfn.ServiceIntegrationPattern;
}

/**
 * A Step Functions Task to call StartExecution on another state machine.
 *
 * It supports three service integration patterns: FIRE_AND_FORGET, SYNC and WAIT_FOR_TASK_TOKEN.
 *
 * @deprecated - use 'StepFunctionsStartExecution'
 */
export class StartExecution implements sfn.IStepFunctionsTask {
  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  constructor(private readonly stateMachine: sfn.IStateMachine, private readonly props: StartExecutionProps = {}) {
    this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.FIRE_AND_FORGET;

    const supportedPatterns = [
      sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
      sfn.ServiceIntegrationPattern.SYNC,
      sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN,
    ];

    if (!supportedPatterns.includes(this.integrationPattern)) {
      throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call Step Functions.`);
    }

    if (this.integrationPattern === sfn.ServiceIntegrationPattern.WAIT_FOR_TASK_TOKEN
      && !sfn.FieldUtils.containsTaskToken(props.input)) {
      throw new Error('Task Token is missing in input (pass JsonPath.taskToken somewhere in input)');
    }
  }

  public bind(task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn('states', 'startExecution', this.integrationPattern),
      policyStatements: this.createScopedAccessPolicy(task),
      parameters: {
        Input: this.props.input,
        StateMachineArn: this.stateMachine.stateMachineArn,
        Name: this.props.name,
      },
    };
  }

  /**
   * As StateMachineArn is extracted automatically from the state machine object included in the constructor,
   *
   * the scoped access policy should be generated accordingly.
   *
   * This means the action of StartExecution should be restricted on the given state machine, instead of being granted to all the resources (*).
   */
  private createScopedAccessPolicy(task: sfn.Task): iam.PolicyStatement[] {
    const stack = Stack.of(task);

    const policyStatements = [
      new iam.PolicyStatement({
        actions: ['states:StartExecution'],
        resources: [this.stateMachine.stateMachineArn],
      }),
    ];

    // Step Functions use Cloud Watch managed rules to deal with synchronous tasks.
    if (this.integrationPattern === sfn.ServiceIntegrationPattern.SYNC) {
      policyStatements.push(new iam.PolicyStatement({
        actions: ['states:DescribeExecution', 'states:StopExecution'],
        // https://docs.aws.amazon.com/step-functions/latest/dg/concept-create-iam-advanced.html#concept-create-iam-advanced-execution
        resources: [stack.formatArn({
          service: 'states',
          resource: 'execution',
          arnFormat: ArnFormat.COLON_RESOURCE_NAME,
          resourceName: `${stack.splitArn(this.stateMachine.stateMachineArn, ArnFormat.COLON_RESOURCE_NAME).resourceName}*`,
        })],
      }));

      policyStatements.push(new iam.PolicyStatement({
        actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
        resources: [stack.formatArn({
          service: 'events',
          resource: 'rule',
          resourceName: 'StepFunctionsGetEventsForStepFunctionsExecutionRule',
        })],
      }));
    }

    return policyStatements;
  }
}
