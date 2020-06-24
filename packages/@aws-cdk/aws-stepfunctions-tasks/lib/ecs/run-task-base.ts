import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { ContainerOverride } from '..';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Basic properties for ECS Tasks
 */
export interface EcsRunTaskCommonProps extends sfn.TaskStateBaseProps {
  /**
   * The topic to run the task on
   */
  readonly cluster: ecs.ICluster;

  /**
   * [disable-awslint:ref-via-interface]
   * Task Definition used for running tasks in the service.
   *
   * Note: this must be TaskDefinition, and not ITaskDefinition,
   * as it requires properties that are not known for imported task definitions
   */
  readonly taskDefinition: ecs.TaskDefinition;

  /**
   * Container setting overrides
   *
   * Key is the name of the container to override, value is the
   * values you want to override.
   *
   * @default - No overrides
   */
  readonly containerOverrides?: ContainerOverride[];
}

/**
 * Construction properties for the BaseRunTaskProps
 */
export interface EcsRunTaskStateBaseProps extends EcsRunTaskCommonProps {
  /**
   * Additional parameters to pass to the base task
   *
   * @default - No additional parameters passed
   */
  readonly parameters?: { [key: string]: any };
}

/**
 * Run a Task on ECS or Fargate
 */
export abstract class EcsRunTaskStateBase extends sfn.TaskStateBase implements ec2.IConnectable {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  /**
   * Manage allowed network traffic for this service
   */
  public readonly connections: ec2.Connections = new ec2.Connections();

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private securityGroup?: ec2.ISecurityGroup;
  private networkConfiguration?: any;
  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: cdk.Construct, id: string, private readonly props: EcsRunTaskStateBaseProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern || sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, EcsRunTaskStateBase.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN && !sfn.FieldUtils.containsTaskToken(props.containerOverrides)) {
      throw new Error('Task Token is required in `containerOverrides` for callback. Use Context.taskToken to set the token.');
    }

    for (const override of this.props.containerOverrides || []) {
      const name = override.containerDefinition.containerName;
      if (!cdk.Token.isUnresolved(name)) {
        const cont = this.props.taskDefinition.node.tryFindChild(name);
        if (!cont) {
          throw new Error(`Overrides mention container with name '${name}', but no such container in task definition`);
        }
      }
    }

    this.taskPolicies = this.makePolicyStatements();
  }

  protected renderTask(): any {
    if (this.networkConfiguration !== undefined) {
      // Make sure we have a security group if we're using AWSVPC networking
      this.securityGroup = this.securityGroup ?? new ec2.SecurityGroup(this, 'SecurityGroup', { vpc: this.props.cluster.vpc });
      this.connections.addSecurityGroup(this.securityGroup);
    }

    return {
      Resource: integrationResourceArn('ecs', 'runTask', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        Cluster: this.props.cluster.clusterArn,
        TaskDefinition: this.props.taskDefinition.taskDefinitionArn,
        NetworkConfiguration: this.networkConfiguration,
        Overrides: renderOverrides(this.props.containerOverrides),
        ...this.props.parameters,
      }),
    };
  }

  protected configureAwsVpcNetworking(
    vpc: ec2.IVpc,
    assignPublicIp?: boolean,
    subnetSelection?: ec2.SubnetSelection,
    securityGroup?: ec2.ISecurityGroup,
  ) {
    if (subnetSelection === undefined) {
      subnetSelection = { subnetType: assignPublicIp ? ec2.SubnetType.PUBLIC : ec2.SubnetType.PRIVATE };
    }

    // If none is given here, one will be created later on during bind()
    this.securityGroup = securityGroup;

    this.networkConfiguration = {
      AwsvpcConfiguration: {
        AssignPublicIp: assignPublicIp !== undefined ? (assignPublicIp ? 'ENABLED' : 'DISABLED') : undefined,
        Subnets: vpc.selectSubnets(subnetSelection).subnetIds,
        SecurityGroups: cdk.Lazy.listValue({ produce: () => [this.securityGroup!.securityGroupId] }),
      },
    };
  }

  private makePolicyStatements(): iam.PolicyStatement[] {
    const stack = cdk.Stack.of(this);

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
        resources: cdk.Lazy.listValue({ produce: () => this.taskExecutionRoles().map((r) => r.roleArn) }),
      }),
    ];

    if (this.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      policyStatements.push(
        new iam.PolicyStatement({
          actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
          resources: [
            stack.formatArn({
              service: 'events',
              resource: 'rule',
              resourceName: 'StepFunctionsGetEventsForECSTaskRule',
            }),
          ],
        }),
      );
    }

    return policyStatements;
  }

  private taskExecutionRoles(): iam.IRole[] {
    // Need to be able to pass both Task and Execution role, apparently
    const ret = new Array<iam.IRole>();
    ret.push(this.props.taskDefinition.taskRole);
    if (this.props.taskDefinition.executionRole) {
      ret.push(this.props.taskDefinition.executionRole);
    }
    return ret;
  }
}

function renderOverrides(containerOverrides?: ContainerOverride[]) {
  if (!containerOverrides) {
    return undefined;
  }

  const ret = new Array<any>();
  for (const override of containerOverrides) {
    ret.push({
      Name: override.containerDefinition.containerName,
      Command: override.command,
      Cpu: override.cpu,
      Memory: override.memoryLimit,
      MemoryReservation: override.memoryReservation,
      Environment:
        override.environment &&
        override.environment.map((e) => ({
          Name: e.name,
          Value: e.value,
        })),
    });
  }

  return { ContainerOverrides: ret };
}
