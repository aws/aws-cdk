import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import events = require ('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import { Construct, Token } from '@aws-cdk/cdk';
import { ContainerOverride } from './ecs-task-properties';

/**
 * Properties to define an EC2 Event Task
 */
export interface EcsEc2TaskProps {
  /**
   * Cluster where service will be deployed
   */
  readonly cluster: ecs.ICluster;

  /**
   * Task Definition of the task that should be started
   */
  readonly taskDefinition: ecs.TaskDefinition;

  /**
   * How many tasks should be started when this event is triggered
   *
   * @default 1
   */
  readonly taskCount?: number;

  /**
   * Container setting overrides
   *
   * Key is the name of the container to override, value is the
   * values you want to override.
   */
  readonly containerOverrides?: ContainerOverride[];

  /**
   * In what subnets to place the task's ENIs
   *
   * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
   *
   * @default Private subnets
   */
  readonly subnetSelection?: ec2.SubnetSelection;

  /**
   * Existing security group to use for the task's ENIs
   *
   * (Only applicable in case the TaskDefinition is configured for AwsVpc networking)
   *
   * @default A new security group is created
   */
  readonly securityGroup?: ec2.ISecurityGroup;
}

/**
 * Start a service on an EC2 cluster
 */
export class EcsEc2Task implements events.IEventRuleTarget {
  private readonly cluster: ecs.ICluster;
  private readonly taskDefinition: ecs.TaskDefinition;
  private readonly taskCount: number;

  constructor(private readonly props: EcsEc2TaskProps) {
    if (!props.taskDefinition.isEc2Compatible) {
      throw new Error('Supplied TaskDefinition is not configured for compatibility with EC2');
    }

    this.cluster = props.cluster;
    this.taskDefinition = props.taskDefinition;
    this.taskCount = props.taskCount !== undefined ? props.taskCount : 1;
  }

  /**
   * Allows using containers as target of CloudWatch events
   */
  public bind(rule: events.IEventRule): events.EventRuleTargetProperties {
    const policyStatements = [new iam.PolicyStatement()
      .addAction('ecs:RunTask')
      .addResource(this.taskDefinition.taskDefinitionArn)
      .addCondition('ArnEquals', { "ecs:cluster": this.cluster.clusterArn })
    ];

    // If it so happens that a Task Execution Role was created for the TaskDefinition,
    // then the CloudWatch Events Role must have permissions to pass it (otherwise it doesn't).
    //
    // It never needs permissions to the Task Role.
    if (this.taskDefinition.executionRole !== undefined) {
      policyStatements.push(new iam.PolicyStatement()
        .addAction('iam:PassRole')
        .addResource(this.taskDefinition.executionRole.roleArn));
    }

    return {
      id: this.taskDefinition.node.id + ' on ' + this.cluster.node.id,
      arn: this.cluster.clusterArn,
      policyStatements,
      ecsParameters: {
        taskCount: this.taskCount,
        taskDefinitionArn: this.taskDefinition.taskDefinitionArn
      },
      input: events.EventTargetInput.fromObject({
        containerOverrides: this.props.containerOverrides,
        networkConfiguration: this.renderNetworkConfiguration(rule as events.EventRule),
      })
    };
  }

  private renderNetworkConfiguration(scope: Construct) {
    if (this.props.taskDefinition.networkMode !== ecs.NetworkMode.AwsVpc) {
      return undefined;
    }

    const subnetSelection = this.props.subnetSelection || { subnetType: ec2.SubnetType.Private };
    const securityGroup = this.props.securityGroup || new ec2.SecurityGroup(scope, 'SecurityGroup', { vpc: this.props.cluster.vpc });

    return {
      awsvpcConfiguration: {
        subnets: this.props.cluster.vpc.selectSubnets(subnetSelection).subnetIds,
        securityGroups: new Token(() => [securityGroup.securityGroupId]),
      }
    };
  }
}
