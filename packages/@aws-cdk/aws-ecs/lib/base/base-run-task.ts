import iam = require('@aws-cdk/aws-iam');
import stepfunctions = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import { ICluster } from '../cluster';
import { TaskDefinition } from './task-definition';

/**
 * Properties for SendMessageTask
 */
export interface BaseRunTaskProps extends stepfunctions.BasicTaskProps {
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
  containerOverrides?: ContainerOverride[];
}

export interface ContainerOverride {
  /**
   * Name of the container inside the task definition
   *
   * Exactly one of `containerName` and `containerNamePath` is required.
   */
  containerName?: string;

  /**
   * JSONPath expression for the name of the container inside the task definition
   *
   * Exactly one of `containerName` and `containerNamePath` is required.
   */
  containerNamePath?: string;

  /**
   * Command to run inside the container
   *
   * @default Default command
   */
  command?: string[];

  /**
   * JSON expression for command to run inside the container
   *
   * @default Default command
   */
  commandPath?: string;

  /**
   * Variables to set in the container's environment
   */
  environment?: TaskEnvironmentVariable[];

  /**
   * The number of cpu units reserved for the container
   *
   * @Default The default value from the task definition.
   */
  cpu?: number;

  /**
   * JSON expression for the number of CPU units
   *
   * @Default The default value from the task definition.
   */
  cpuPath?: string;

  /**
   * Hard memory limit on the container
   *
   * @Default The default value from the task definition.
   */
  memoryLimit?: number;

  /**
   * JSON expression path for the hard memory limit
   *
   * @Default The default value from the task definition.
   */
  memoryLimitPath?: string;

  /**
   * Soft memory limit on the container
   *
   * @Default The default value from the task definition.
   */
  memoryReservation?: number;

  /**
   * JSONExpr path for memory limit on the container
   *
   * @Default The default value from the task definition.
   */
  memoryReservationPath?: number;
}

/**
 * An environment variable to be set in the container run as a task
 */
export interface TaskEnvironmentVariable {
  /**
   * Name for the environment variable
   *
   * Exactly one of `name` and `namePath` must be specified.
   */
  name?: string;

  /**
   * JSONExpr for the name of the variable
   *
   * Exactly one of `name` and `namePath` must be specified.
   */
  namePath?: string;

  /**
   * Value of the environment variable
   *
   * Exactly one of `value` and `valuePath` must be specified.
   */
  value?: string;

  /**
   * JSONPath expr for the environment variable
   *
   * Exactly one of `value` and `valuePath` must be specified.
   */
  valuePath?: string;
}

/**
 * A StepFunctions Task to run a Task on ECS or Fargate
 */
export class BaseRunTask extends stepfunctions.Task {
  protected readonly parameters: {[key: string]: any} = {};

  constructor(scope: cdk.Construct, id: string, props: BaseRunTaskProps) {
    super(scope, id, {
      ...props,
      resource: new RunTaskResource(props),
      parameters: new cdk.Token(() => ({
        Cluster: props.cluster.clusterArn,
        TaskDefinition: props.taskDefinition.taskDefinitionArn,
        ...this.parameters
      }))
    });

    this.parameters.Overrides = this.renderOverrides(props.containerOverrides);
  }

  private renderOverrides(containerOverrides?: ContainerOverride[]) {
    if (!containerOverrides) { return undefined; }

    const ret = new Array<any>();
    for (const override of containerOverrides) {
      ret.push({
        ...extractRequired(override, 'containerName', 'Name'),
        ...extractOptional(override, 'command', 'Command'),
        ...extractOptional(override, 'cpu', 'Cpu'),
        ...extractOptional(override, 'memoryLimit', 'Memory'),
        ...extractOptional(override, 'memoryReservation', 'MemoryReservation'),
        Environment: override.environment && override.environment.map(e => ({
          ...extractRequired(e, 'name', 'Name'),
          ...extractRequired(e, 'value', 'Value'),
        }))
      });
    }

    return { ContainerOverrides: ret };
  }
}

class RunTaskResource implements stepfunctions.IStepFunctionsTaskResource {
  constructor(private readonly props: BaseRunTaskProps) {
  }

  public asStepFunctionsTaskResource(_callingTask: stepfunctions.Task): stepfunctions.StepFunctionsTaskResourceProps {
    return {
      resourceArn: 'arn:aws:states:::ecs:runTask.sync',
      policyStatements: [
        new iam.PolicyStatement()
          .addAction('ecs:RunTask')
          .addResource(this.props.cluster.clusterArn),
        new iam.PolicyStatement()
          .addAction('iam:PassRole')
          .addResource(new cdk.Token(() => this.taskExecutionRole() ? this.taskExecutionRole()!.roleArn : 'x').toString())
      ],
    };
  }

  private taskExecutionRole(): iam.IRole | undefined {
    return (this.props.taskDefinition as any).executionRole;
  }
}

function extractRequired(obj: any, srcKey: string, dstKey: string) {
    if ((obj[srcKey] !== undefined) === (obj[srcKey + 'Path'] !== undefined)) {
      throw new Error(`Supply exactly one of '${srcKey}' or '${srcKey}Path'`);
    }
    return mapValue(obj, srcKey, dstKey);
}

function extractOptional(obj: any, srcKey: string, dstKey: string) {
    if ((obj[srcKey] !== undefined) && (obj[srcKey + 'Path'] !== undefined)) {
      throw new Error(`Supply only one of '${srcKey}' or '${srcKey}Path'`);
    }
    return mapValue(obj, srcKey, dstKey);
}

function mapValue(obj: any, srcKey: string, dstKey: string) {
  if (obj[srcKey + 'Path'] !== undefined && !obj[srcKey + 'Path'].startswith('$.')) {
    throw new Error(`Value for '${srcKey}Path' must start with '$.', got: '${obj[srcKey + 'Path']}'`);
  }

  return {
    [dstKey]: obj[srcKey],
    [dstKey + '.$']: obj[srcKey + 'Path']
  };
}