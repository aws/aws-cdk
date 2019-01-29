import iam = require('@aws-cdk/aws-iam');
import stepfunctions = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import { ICluster } from '../cluster';
import { TaskDefinition } from './task-definition';

/**
 * Properties for SendMessageTask
 */
export interface RunTaskProps extends stepfunctions.BasicTaskProps {
  /**
   * The topic to run the task on
   */
  cluster: ICluster;

  /**
   * Task Definition used for running tasks in the service
   */
  taskDefinition: TaskDefinition;

  /**
   * Container setting overrides
   *
   * Key is the name of the container to override, value is the
   * values you want to override.
   */
  containerOverrides: {[name: string]: ContainerOverrides};
}

export interface ContainerOverrides {
  /**
   * Command to run inside the container
   *
   * @default Default command
   */
  command?: string[];

  /**
   * Variables to set in the container's environment
   */
  environment: {[key: string]: string};

  /**
   * The number of cpu units reserved for the container
   *
   * @Default The default value from the task definition.
   */
  cpu?: number;

  /**
   * Hard memory limit on the container
   *
   * @Default The default value from the task definition.
   */
  memoryLimit?: number;

  /**
   * Soft memory limit on the container
   *
   * @Default The default value from the task definition.
   */
  memoryReservation?: number;
}

/**
 * A StepFunctions Task to run a Task on ECS or Fargate
 */
export class BaseRunTask extends stepfunctions.Task {
  protected readonly parameters: {[key: string]: any} = {};

  constructor(scope: cdk.Construct, id: string, props: RunTaskProps) {
    super(scope, id, {
      ...props,
      resource: new RunTaskResource(props),
      parameters: new cdk.Token(() => ({
        Cluster: props.cluster.clusterArn,
        TaskDefinition: props.taskDefinition.taskDefinitionArn,
        ...this.parameters
      }))
    });
  }
}

class RunTaskResource implements stepfunctions.IStepFunctionsTaskResource {
  constructor(private readonly props: RunTaskProps) {
  }

  public asStepFunctionsTaskResource(_callingTask: stepfunctions.Task): stepfunctions.StepFunctionsTaskResourceProps {
    return {
      resourceArn: 'arn:aws:states:::ecs:runTask.sync',
      policyStatements: [new iam.PolicyStatement()
          .addAction('ecs:RunTask')
          // FIXME: Need to be ClusterARN
          .addResource(this.props.cluster.clusterArn)],
    };
  }
}