import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');

import { TrainingJobParameters, TransformJobParameters } from './sagemaker-task-params';

/**
 * Class representing the SageMaker Create Training Job task.
 */
export class SagemakerTrainingJobTask implements ec2.IConnectable, sfn.IStepFunctionsTask {

    public readonly connections: ec2.Connections = new ec2.Connections();

    constructor(private readonly parameters: TrainingJobParameters, private readonly sync: boolean = false) {}

    public bind(task: sfn.Task): sfn.StepFunctionsTaskProperties {
        return {
          resourceArn: 'arn:aws:states:::sagemaker:createTrainingJob' + (this.sync ? '.sync' : ''),
          parameters: sfn.FieldUtils.renderObject(this.parameters.toJson()),
          policyStatements: this.makePolicyStatements(task),
        };
    }

    private makePolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
        const stack = task.node.stack;

        // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
        const policyStatements = [
          new iam.PolicyStatement()
            .addActions('sagemaker:CreateTrainingJob', 'sagemaker:DescribeTrainingJob', 'sagemaker:StopTrainingJob')
            .addResource(stack.formatArn({
                service: 'sagemaker',
                resource: 'training-job',
                resourceName: '*'
            })),
          new iam.PolicyStatement()
            .addAction('sagemaker:ListTags')
            .addAllResources(),
          new iam.PolicyStatement()
            .addAction('iam:PassRole')
            .addResources(this.parameters.role.roleArn)
            .addCondition('StringEquals', { "iam:PassedToService": "sagemaker.amazonaws.com" })
        ];

        if (this.sync) {
          policyStatements.push(new iam.PolicyStatement()
            .addActions("events:PutTargets", "events:PutRule", "events:DescribeRule")
            .addResource(stack.formatArn({
              service: 'events',
              resource: 'rule',
              resourceName: 'StepFunctionsGetEventsForSageMakerTrainingJobsRule'
          })));
        }

        return policyStatements;
      }
}

/**
 * Class representing the SageMaker Create Transform Job task.
 */
export class SagemakerTransformJobTask implements sfn.IStepFunctionsTask {

  constructor(private readonly parameters: TransformJobParameters, private readonly sync: boolean = false) {}

  public bind(task: sfn.Task): sfn.StepFunctionsTaskProperties {
      return {
        resourceArn: 'arn:aws:states:::sagemaker:createTransformJob' + (this.sync ? '.sync' : ''),
        parameters: sfn.FieldUtils.renderObject(this.parameters.toJson()),
        policyStatements: this.makePolicyStatements(task),
      };
  }

  private makePolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
      const stack = task.node.stack;

      // https://docs.aws.amazon.com/step-functions/latest/dg/sagemaker-iam.html
      const policyStatements = [
        new iam.PolicyStatement()
          .addActions('sagemaker:CreateTransformJob', 'sagemaker:DescribeTransformJob', 'sagemaker:StopTransformJob')
          .addResource(stack.formatArn({
              service: 'sagemaker',
              resource: 'transform-job',
              resourceName: '*'
          })),
        new iam.PolicyStatement()
          .addAction('sagemaker:ListTags')
          .addAllResources(),
        new iam.PolicyStatement()
          .addAction('iam:PassRole')
          .addResources(this.parameters.role.roleArn)
          .addCondition('StringEquals', { "iam:PassedToService": "sagemaker.amazonaws.com" })
      ];

      if (this.sync) {
        policyStatements.push(new iam.PolicyStatement()
          .addActions("events:PutTargets", "events:PutRule", "events:DescribeRule")
          .addResource(stack.formatArn({
            service: 'events',
            resource: 'rule',
            resourceName: 'StepFunctionsGetEventsForSageMakerTransformJobsRule'
        })));
      }

      return policyStatements;
    }
}