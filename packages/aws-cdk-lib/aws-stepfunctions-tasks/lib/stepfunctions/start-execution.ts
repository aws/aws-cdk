import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { ArnFormat, Stack } from '../../../core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

interface StepFunctionsStartExecutionOptions {
  /**
   * The Step Functions state machine to start the execution on.
   */
  readonly stateMachine: sfn.IStateMachine;

  /**
   * The JSON input for the execution, same as that of StartExecution.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/apireference/API_StartExecution.html
   *
   * @default - The state input (JSON path '$')
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

  /**
   * Pass the execution ID from the context object to the execution input.
   * This allows the Step Functions UI to link child executions from parent executions, making it easier to trace execution flow across state machines.
   *
   * If you set this property to `true`, the `input` property must be an object (provided by `sfn.TaskInput.fromObject`) or omitted entirely.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-nested-workflows.html#nested-execution-startid
   *
   * @default - false
   */
  readonly associateWithParent?: boolean;
}

/**
 * Properties for StartExecution using JSONPath
 */
export interface StepFunctionsStartExecutionJsonPathProps extends sfn.TaskStateJsonPathBaseProps, StepFunctionsStartExecutionOptions {}

/**
 * Properties for StartExecution using JSONata
 */
export interface StepFunctionsStartExecutionJsonataProps extends sfn.TaskStateJsonataBaseProps, StepFunctionsStartExecutionOptions {}

/**
 * Properties for StartExecution
 */
export interface StepFunctionsStartExecutionProps extends sfn.TaskStateBaseProps, StepFunctionsStartExecutionOptions {}

/**
 * A Step Functions Task to call StartExecution on another state machine.
 *
 * It supports three service integration patterns: REQUEST_RESPONSE, RUN_JOB, and WAIT_FOR_TASK_TOKEN.
 */
export class StepFunctionsStartExecution extends sfn.TaskStateBase {
  /**
   * A Step Functions Task using JSONPath to call StartExecution on another state machine.
   *
   * It supports three service integration patterns: REQUEST_RESPONSE, RUN_JOB, and WAIT_FOR_TASK_TOKEN.
   */
  public static jsonPath(scope: Construct, id: string, props: StepFunctionsStartExecutionJsonPathProps) {
    return new StepFunctionsStartExecution(scope, id, props);
  }

  /**
   * A Step Functions Task using JSONata to call StartExecution on another state machine.
   *
   * It supports three service integration patterns: REQUEST_RESPONSE, RUN_JOB, and WAIT_FOR_TASK_TOKEN.
   */
  public static jsonata(scope: Construct, id: string, props: StepFunctionsStartExecutionJsonataProps) {
    return new StepFunctionsStartExecution(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

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
      throw new Error('Task Token is required in `input` for callback. Use JsonPath.taskToken to set the token.');
    }

    if (this.props.associateWithParent && props.input && props.input.type !== sfn.InputType.OBJECT) {
      throw new Error('Could not enable `associateWithParent` because `input` is taken directly from a JSON path. Use `sfn.TaskInput.fromObject` instead.');
    }

    this.taskPolicies = this.createScopedAccessPolicy();
  }

  /**
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    // suffix of ':2' indicates that the output of the nested state machine should be JSON
    // suffix is only applicable when waiting for a nested state machine to complete (RUN_JOB)
    // https://docs.aws.amazon.com/step-functions/latest/dg/connect-stepfunctions.html
    const suffix = this.integrationPattern === sfn.IntegrationPattern.RUN_JOB ? ':2' : '';
    let input: any;
    if (this.props.associateWithParent) {
      const associateWithParentEntry = {
        AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID: queryLanguage === sfn.QueryLanguage.JSONATA
          ? '{% $states.context.Execution.Id %}'
          : sfn.JsonPath.stringAt('$$.Execution.Id'),
      };
      input = this.props.input ? { ...this.props.input.value, ...associateWithParentEntry } : associateWithParentEntry;
    } else {
      input = this.props.input ? this.props.input.value: sfn.TaskInput.fromJsonPathAt('$').value;
    }

    return {
      Resource: `${integrationResourceArn('states', 'startExecution', this.integrationPattern)}${suffix}`,
      ...this._renderParametersOrArguments({
        Input: input,
        StateMachineArn: this.props.stateMachine.stateMachineArn,
        Name: this.props.name,
      }, queryLanguage),
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
              arnFormat: ArnFormat.COLON_RESOURCE_NAME,
              resourceName: `${stack.splitArn(this.props.stateMachine.stateMachineArn, ArnFormat.COLON_RESOURCE_NAME).resourceName}*`,
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
