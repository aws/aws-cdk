import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import { Stack } from '@aws-cdk/cdk';
import { ContainerOverride } from './run-ecs-task-base-types';

/**
 * Basic properties for ECS Tasks
 */
export interface CommonEcsRunTaskProps {
  /**
   * The topic to run the task on
   */
  readonly cluster: ecs.ICluster;

  /**
   * Task Definition used for running tasks in the service
   */
  readonly taskDefinition: ecs.TaskDefinition;

  /**
   * Container setting overrides
   *
   * Key is the name of the container to override, value is the
   * values you want to override.
   */
  readonly containerOverrides?: ContainerOverride[];

  /**
   * Whether to wait for the task to complete and return the response
   *
   * @default true
   */
  readonly synchronous?: boolean;
}

/**
 * Construction properties for the BaseRunTaskProps
 */
export interface EcsRunTaskBaseProps extends CommonEcsRunTaskProps {
  /**
   * Additional parameters to pass to the base task
   */
  readonly parameters?: {[key: string]: any};
}

/**
 * A StepFunctions Task to run a Task on ECS or Fargate
 */
export class EcsRunTaskBase implements ec2.IConnectable, sfn.IStepFunctionsTask {
  /**
   * Manage allowed network traffic for this service
   */
  public readonly connections: ec2.Connections = new ec2.Connections();

  private securityGroup?: ec2.ISecurityGroup;
  private networkConfiguration?: any;
  private readonly sync: boolean;

  constructor(private readonly props: EcsRunTaskBaseProps) {
    this.sync = props.synchronous !== false;

    for (const override of this.props.containerOverrides || []) {
      const name = override.containerName;
      if (!cdk.Token.isUnresolved(name)) {
        const cont = this.props.taskDefinition.node.tryFindChild(name);
        if (!cont) {
          throw new Error(`Overrides mention container with name '${name}', but no such container in task definition`);
        }
      }
    }
  }

  public bind(task: sfn.Task): sfn.StepFunctionsTaskConfig {
    if (this.networkConfiguration !== undefined) {
      // Make sure we have a security group if we're using AWSVPC networking
      if (this.securityGroup === undefined) {
        this.securityGroup = new ec2.SecurityGroup(task, 'SecurityGroup', { vpc: this.props.cluster.vpc });
      }
      this.connections.addSecurityGroup(this.securityGroup);
    }

    return {
      resourceArn: 'arn:aws:states:::ecs:runTask' + (this.sync ? '.sync' : ''),
      parameters: {
        Cluster: this.props.cluster.clusterArn,
        TaskDefinition: this.props.taskDefinition.taskDefinitionArn,
        NetworkConfiguration: this.networkConfiguration,
        Overrides: renderOverrides(this.props.containerOverrides),
        ...this.props.parameters,
      },
      policyStatements: this.makePolicyStatements(task),
    };
  }

  protected configureAwsVpcNetworking(
      vpc: ec2.IVpc,
      assignPublicIp?: boolean,
      subnetSelection?: ec2.SubnetSelection,
      securityGroup?: ec2.ISecurityGroup) {

    if (subnetSelection === undefined) {
      subnetSelection = { subnetType: assignPublicIp ? ec2.SubnetType.Public : ec2.SubnetType.Private };
    }

    // If none is given here, one will be created later on during bind()
    this.securityGroup = securityGroup;

    this.networkConfiguration = {
      AwsvpcConfiguration: {
        AssignPublicIp: assignPublicIp !== undefined ? (assignPublicIp ? 'ENABLED' : 'DISABLED') : undefined,
        Subnets: vpc.selectSubnets(subnetSelection).subnetIds,
        SecurityGroups: cdk.Lazy.listValue({ produce: () => [this.securityGroup!.securityGroupId] }),
      }
    };
  }

  private makePolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
    const stack = Stack.of(task);

    // https://docs.aws.amazon.com/step-functions/latest/dg/ecs-iam.html
    const policyStatements = [
      new iam.PolicyStatement({
        actions: ['ecs:RunTask'],
        resources: [this.props.taskDefinition.taskDefinitionArn],
      }),
      new iam.PolicyStatement({
        actions: ['ecs:StopTask', 'ecs:DescribeTasks'],
        resources: ['*'],
      }),
      new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        resources: cdk.Lazy.listValue({ produce: () => this.taskExecutionRoles().map(r => r.roleArn) })
      }),
    ];

    if (this.sync) {
      policyStatements.push(new iam.PolicyStatement({
        actions: ["events:PutTargets", "events:PutRule", "events:DescribeRule"],
        resources: [stack.formatArn({
          service: 'events',
          resource: 'rule',
          resourceName: 'StepFunctionsGetEventsForECSTaskRule'
        })]
      }));
    }

    return policyStatements;
  }

  private taskExecutionRoles(): iam.IRole[] {
    // Need to be able to pass both Task and Execution role, apparently
    const ret = new Array<iam.IRole>();
    ret.push(this.props.taskDefinition.taskRole);
    if ((this.props.taskDefinition as any).executionRole) {
      ret.push((this.props.taskDefinition as any).executionRole);
    }
    return ret;
  }
}

function renderOverrides(containerOverrides?: ContainerOverride[]) {
  if (!containerOverrides) { return undefined; }

  const ret = new Array<any>();
  for (const override of containerOverrides) {
    ret.push(sfn.FieldUtils.renderObject({
      Name: override.containerName,
      Command: override.command,
      Cpu: override.cpu,
      Memory: override.memoryLimit,
      MemoryReservation: override.memoryReservation,
      Environment: override.environment && override.environment.map(e => ({
        Name: e.name,
        Value: e.value,
      }))
    }));
  }

  return { ContainerOverrides: ret };
}
