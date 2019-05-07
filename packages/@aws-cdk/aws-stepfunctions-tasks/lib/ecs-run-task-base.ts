import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { ContainerOverride } from './ecs-run-task-base-types';
import { renderNumber, renderString, renderStringList } from './json-path';

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
export class EcsRunTaskBase extends cdk.Construct implements ec2.IConnectable {
  /**
   * Manage allowed network traffic for this service
   */
  public readonly connections: ec2.Connections = new ec2.Connections();

  public readonly resourceArn: string;
  public readonly metricDimensions?: cloudwatch.DimensionHash | undefined;
  public readonly metricPrefixSingular?: string;
  public readonly metricPrefixPlural?: string;
  public readonly heartbeatSeconds?: number | undefined;

  protected networkConfiguration?: any;
  protected readonly taskDefinition: ecs.TaskDefinition;
  private readonly sync: boolean;

  constructor(scope: cdk.Construct, id: string, private readonly props: EcsRunTaskBaseProps) {
    super(scope, id);

    this.resourceArn = 'arn:aws:states:::ecs:runTask' + (props.synchronous !== false ? '.sync' : '');
    this.sync = props.synchronous !== false;
    this.taskDefinition = props.taskDefinition;
  }

  public get parameters(): { [name: string]: any; } | undefined {
    return {
      Cluster: this.props.cluster.clusterArn,
      TaskDefinition: this.props.taskDefinition.taskDefinitionArn,
      NetworkConfiguration: this.networkConfiguration,
      Overrides: renderOverrides(this.props.containerOverrides),
      ...this.props.parameters,
    };
  }

  protected configureAwsVpcNetworking(
      vpc: ec2.IVpcNetwork,
      assignPublicIp?: boolean,
      subnetSelection?: ec2.SubnetSelection,
      securityGroup?: ec2.ISecurityGroup) {
    if (subnetSelection === undefined) {
      subnetSelection = { subnetType: assignPublicIp ? ec2.SubnetType.Public : ec2.SubnetType.Private };
    }
    if (securityGroup === undefined) {
      securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', { vpc });
    }
    const subnets = vpc.selectSubnets(subnetSelection);
    this.connections.addSecurityGroup(securityGroup);

    this.networkConfiguration = {
      AwsvpcConfiguration: {
        AssignPublicIp: assignPublicIp ? 'ENABLED' : 'DISABLED',
        Subnets: subnets.subnetIds,
        SecurityGroups: new cdk.Token(() => [securityGroup!.securityGroupId]),
      }
    };
  }

  public get policyStatements(): iam.PolicyStatement[] | undefined {
    const stack = this.node.stack;

    // https://docs.aws.amazon.com/step-functions/latest/dg/ecs-iam.html
    const policyStatements = [
      new iam.PolicyStatement()
        .addAction('ecs:RunTask')
        .addResource(this.taskDefinition.taskDefinitionArn),
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

  /**
   * Validate this service
   *
   * Check that all mentioned container overrides exist in the task definition
   * (but only if the name is not a token, in which case we can't tell).
   */
  protected validate(): string[] {
    const ret = super.validate();

    for (const override of this.props.containerOverrides || []) {
      const name = override.containerName;
      if (!cdk.Token.unresolved(name)) {
        const cont = this.props.taskDefinition.node.tryFindChild(name);
        if (!cont) {
          ret.push(`Overrides mention container with name '${name}', but no such container in task definition`);
        }
      }
    }

    return ret;
  }

  private taskExecutionRoles(): iam.IRole[] {
    // Need to be able to pass both Task and Execution role, apparently
    const ret = new Array<iam.IRole>();
    ret.push(this.taskDefinition.taskRole);
    if ((this.taskDefinition as any).executionRole) {
      ret.push((this.taskDefinition as any).executionRole);
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