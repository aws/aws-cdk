import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Aws, Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * The action to take when the cluster step fails.
 * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_StepConfig.html
 *
 * Here, they are named as TERMINATE_JOB_FLOW, TERMINATE_CLUSTER, CANCEL_AND_WAIT, and CONTINUE respectively.
 *
 * @default CONTINUE
 *
 * @experimental
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
 * @experimental
 */
export interface EmrAddStepProps {
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
   * @default CONTINUE
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
   */
  readonly mainClass?: string;

  /**
   * A list of command line arguments passed to the JAR file's main function when executed.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_HadoopJarStepConfig.html
   */
  readonly args?: string[];

  /**
   * A list of Java properties that are set when the step runs. You can use these properties to pass key value pairs to your main function.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_HadoopJarStepConfig.html
   */
  readonly properties?: { [key: string]: string };

  /**
   * The service integration pattern indicates different ways to call AddStep.
   *
   * The valid value is either FIRE_AND_FORGET or SYNC.
   *
   * @default SYNC
   */
  readonly integrationPattern?: sfn.ServiceIntegrationPattern;
}

/**
 * A Step Functions Task to add a Step to an EMR Cluster
 *
 * The StepConfiguration is defined as Parameters in the state machine definition.
 *
 * OUTPUT: the StepId
 *
 * @experimental
 */
export class EmrAddStep implements sfn.IStepFunctionsTask {

  private readonly actionOnFailure: ActionOnFailure;
  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  constructor(private readonly props: EmrAddStepProps) {
    this.actionOnFailure = props.actionOnFailure || ActionOnFailure.CONTINUE;
    this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.SYNC;

    const supportedPatterns = [
      sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
      sfn.ServiceIntegrationPattern.SYNC
    ];

    if (!supportedPatterns.includes(this.integrationPattern)) {
      throw new Error(`Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call AddStep.`);
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn('elasticmapreduce', 'addStep', this.integrationPattern),
      policyStatements: this.createPolicyStatements(_task),
      parameters: {
        ClusterId: this.props.clusterId,
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
                    Value: kv[1]
                  })
                )
          }
        }
      }
    };
  }

  /**
   * This generates the PolicyStatements required by the Task to call AddStep.
   */
  private createPolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
    const stack = Stack.of(task);

    const policyStatements = [
      new iam.PolicyStatement({
        actions: [
          'elasticmapreduce:AddJobFlowSteps',
          'elasticmapreduce:DescribeStep',
          'elasticmapreduce:CancelSteps'
        ],
        resources: [`arn:aws:elasticmapreduce:${Aws.REGION}:${Aws.ACCOUNT_ID}:cluster/*`]
      })
    ];

    if (this.integrationPattern === sfn.ServiceIntegrationPattern.SYNC) {
      policyStatements.push(new iam.PolicyStatement({
        actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
        resources: [stack.formatArn({
          service: 'events',
          resource: 'rule',
          resourceName: 'StepFunctionsGetEventForEMRAddJobFlowStepsRule'
        })]
      }));
    }

    return policyStatements;
  }
}