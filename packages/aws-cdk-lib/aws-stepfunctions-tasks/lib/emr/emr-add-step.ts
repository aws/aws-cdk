import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sfn from '../../../aws-stepfunctions';
import { Stack } from '../../../core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * The action to take when the cluster step fails.
 * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_StepConfig.html
 *
 * Here, they are named as TERMINATE_JOB_FLOW, TERMINATE_CLUSTER, CANCEL_AND_WAIT, and CONTINUE respectively.
 *
 * @default CONTINUE
 *
 */
export enum ActionOnFailure {
  /**
   * Terminate the Cluster on Step Failure
   */
  TERMINATE_CLUSTER = 'TERMINATE_CLUSTER',

  /**
   * Cancel Step execution and enter WAITING state
   */
  CANCEL_AND_WAIT = 'CANCEL_AND_WAIT',

  /**
   * Continue to the next Step
   */
  CONTINUE = 'CONTINUE'
}

/**
 * Properties for EmrAddStep
 *
 */
export interface EmrAddStepProps extends sfn.TaskStateBaseProps {
  /**
   * The ClusterId to add the Step to.
   */
  readonly clusterId: string;

  /**
   * The name of the Step
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_StepConfig.html
   */
  readonly name: string;

  /**
   * The action to take when the cluster step fails.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_StepConfig.html
   *
   * @default ActionOnFailure.CONTINUE
   */
  readonly actionOnFailure?: ActionOnFailure;

  /**
   * A path to a JAR file run during the step.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_HadoopJarStepConfig.html
   */
  readonly jar: string;

  /**
   * The name of the main class in the specified Java file. If not specified, the JAR file should specify a Main-Class in its manifest file.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_HadoopJarStepConfig.html
   *
   * @default - No mainClass
   */
  readonly mainClass?: string;

  /**
   * A list of command line arguments passed to the JAR file's main function when executed.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_HadoopJarStepConfig.html
   *
   * @default - No args
   */
  readonly args?: string[];

  /**
   * A list of Java properties that are set when the step runs. You can use these properties to pass key value pairs to your main function.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_HadoopJarStepConfig.html
   *
   * @default - No properties
   */
  readonly properties?: { [key: string]: string };

  /**
   * The Amazon Resource Name (ARN) of the runtime role for a step on the cluster.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_AddJobFlowSteps.html#API_AddJobFlowSteps_RequestSyntax
   *
   * @default - Uses EC2 instance profile role
   */
  readonly executionRoleArn?: string;
}

/**
 * A Step Functions Task to add a Step to an EMR Cluster
 *
 * The StepConfiguration is defined as Parameters in the state machine definition.
 *
 * OUTPUT: the StepId
 *
 */
export class EmrAddStep extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskPolicies?: iam.PolicyStatement[];
  protected readonly taskMetrics?: sfn.TaskMetricsConfig;

  private readonly actionOnFailure: ActionOnFailure;
  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EmrAddStepProps) {
    super(scope, id, props);
    this.actionOnFailure = props.actionOnFailure ?? ActionOnFailure.CONTINUE;
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.RUN_JOB;

    validatePatternSupported(this.integrationPattern, EmrAddStep.SUPPORTED_INTEGRATION_PATTERNS);
    this.taskPolicies = this.createPolicyStatements();
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('elasticmapreduce', 'addStep', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        ClusterId: this.props.clusterId,
        ExecutionRoleArn: this.props.executionRoleArn,
        Step: {
          Name: this.props.name,
          ActionOnFailure: this.actionOnFailure.valueOf(),
          HadoopJarStep: {
            Jar: this.props.jar,
            MainClass: this.props.mainClass,
            Args: this.props.args,
            Properties: (this.props.properties === undefined) ?
              undefined :
              Object.entries(this.props.properties).map(
                kv => ({
                  Key: kv[0],
                  Value: kv[1],
                }),
              ),
          },
        },
      }),
    };
  }

  /**
   * This generates the PolicyStatements required by the Task to call AddStep.
   */
  private createPolicyStatements(): iam.PolicyStatement[] {
    const stack = Stack.of(this);

    const policyStatements = [
      new iam.PolicyStatement({
        actions: [
          'elasticmapreduce:AddJobFlowSteps',
          'elasticmapreduce:DescribeStep',
          'elasticmapreduce:CancelSteps',
        ],
        resources: [
          stack.formatArn({
            service: 'elasticmapreduce',
            resource: 'cluster',
            resourceName: '*',
          }),
        ],
      }),
    ];

    if (this.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      policyStatements.push(new iam.PolicyStatement({
        actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
        resources: [stack.formatArn({
          service: 'events',
          resource: 'rule',
          resourceName: 'StepFunctionsGetEventForEMRAddJobFlowStepsRule',
        })],
      }));
    }

    return policyStatements;
  }
}