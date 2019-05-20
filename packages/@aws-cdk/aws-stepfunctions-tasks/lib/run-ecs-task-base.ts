import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import { renderNumber, renderString, renderStringList } from './json-path';
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
      if (!cdk.Token.isToken(name)) {
        const cont = this.props.taskDefinition.node.tryFindChild(name);
        if (!cont) {
          throw new Error(`Overrides mention container with name '${name}', but no such container in task definition`);
        }
      }
    }
  }

  public bind(task: sfn.Task): sfn.StepFunctionsTaskProperties {
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
        AssignPublicIp: assignPublicIp ? 'ENABLED' : 'DISABLED',
        Subnets: vpc.selectSubnets(subnetSelection).subnetIds,
        SecurityGroups: new cdk.Token(() => [this.securityGroup!.securityGroupId]),
      }
    };
  }

  private makePolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
    const stack = task.node.stack;

    // https://docs.aws.amazon.com/step-functions/latest/dg/ecs-iam.html
    const policyStatements = [
      new iam.PolicyStatement()
        .addAction('ecs:RunTask')
        .addResource(this.props.taskDefinition.taskDefinitionArn),
      new iam.PolicyStatement()
        .addActions('ecs:StopTask', 'ecs:DescribeTasks')
        .addAllResources(),
      new iam.PolicyStatement()
        .addAction('iam:PassRole')
        .addResources(...new cdk.Token(() => this.taskExecutionRoles().map(r => r.roleArn)).toList())
    ];

    if (this.sync) {
      policyStatements.push(new iam.PolicyStatement()
        .addActions("events:PutTargets", "events:PutRule", "events:DescribeRule")
        .addResource(stack.formatArn({
          service: 'events',
          resource: 'rule',
          resourceName: 'StepFunctionsGetEventsForECSTaskRule'
      })));
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
    ret.push({
      ...renderString('Name', override.containerName),
      ...renderStringList('Command', override.command),
      ...renderNumber('Cpu', override.cpu),
      ...renderNumber('Memory', override.memoryLimit),
      ...renderNumber('MemoryReservation', override.memoryReservation),
      Environment: override.environment && override.environment.map(e => ({
        ...renderString('Name', e.name),
        ...renderString('Value', e.value),
      }))
    });
  }

  return { ContainerOverrides: ret };
}
