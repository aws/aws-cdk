import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Stack } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * Properties for EmrAddStep
 */
export interface EmrAddStepProps {
  /**
   * The ClusterId to add the Step to.
   */
  readonly clusterId: string;

  /**
   * The JSON that you want to provide to your AddStep call as input.
   *
   * This uses the same syntax as the AddStep API.
   *
   * @see https://docs.aws.amazon.com/emr/latest/APIReference/API_AddJobFlowSteps.html
   */
  readonly stepConfiguration: sfn.TaskInput;

  /**
   * The service integration pattern indicates different ways to call AddStep.
   *
   * The valid value is either FIRE_AND_FORGET or SYNC.
   *
   * @default FIRE_AND_FORGET
   */
  readonly integrationPattern?: sfn.ServiceIntegrationPattern;
}

/**
 * A Step Functions Task to add a Step to an EMR Cluster
 *
 * The StepConfiguration is defined as Parameters in the state machine definition.
 *
 * OUTPUT: the StepId
 */
export class EmrAddStep implements sfn.IStepFunctionsTask {

  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  constructor(private readonly props: EmrAddStepProps) {
    this.integrationPattern = props.integrationPattern || sfn.ServiceIntegrationPattern.FIRE_AND_FORGET;

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
      resourceArn: getResourceArn("elasticmapreduce", "addStep", this.integrationPattern),
      policyStatements: this.createPolicyStatements(_task),
      parameters: {
        ClusterId: this.props.clusterId,
        Step: this.props.stepConfiguration.value
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
        resources: ['arn:aws:elasticmapreduce:*:*:cluster/*']
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