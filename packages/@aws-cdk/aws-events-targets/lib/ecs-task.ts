import cloudformation = require('@aws-cdk/aws-cloudformation');
import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import events = require ('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import { ContainerOverride } from './ecs-task-properties';
import { singletonEventRole } from './util';

/**
 * Properties to define an ECS Event Task
 */
export interface EcsTaskProps {
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
 * Start a task on an ECS cluster
 */
export class EcsTask implements events.IRuleTarget {
  public readonly securityGroup?: ec2.ISecurityGroup;
  private readonly cluster: ecs.ICluster;
  private readonly taskDefinition: ecs.TaskDefinition;
  private readonly taskCount: number;

  constructor(private readonly props: EcsTaskProps) {
    this.cluster = props.cluster;
    this.taskDefinition = props.taskDefinition;
    this.taskCount = props.taskCount !== undefined ? props.taskCount : 1;

    if (this.taskDefinition.networkMode === ecs.NetworkMode.AwsVpc) {
      this.securityGroup = props.securityGroup || new ec2.SecurityGroup(this.taskDefinition, 'SecurityGroup', { vpc: this.props.cluster.vpc });
    }
  }

  /**
   * Allows using tasks as target of CloudWatch events
   */
  public bind(rule: events.IRule): events.RuleTargetProps {
    const policyStatements = [new iam.PolicyStatement()
      .addAction('ecs:RunTask')
      .addResource(this.taskDefinition.taskDefinitionArn)
      .addCondition('ArnEquals', { "ecs:cluster": this.cluster.clusterArn })
    ];

    // If it so happens that a Task Execution Role was created for the TaskDefinition,
    // then the CloudWatch Events Role must have permissions to pass it (otherwise it doesn't).
    if (this.taskDefinition.executionRole !== undefined) {
      policyStatements.push(new iam.PolicyStatement()
        .addAction('iam:PassRole')
        .addResource(this.taskDefinition.executionRole.roleArn));
    }

    // For Fargate task we need permission to pass the task role.
    if (this.taskDefinition.isFargateCompatible) {
      policyStatements.push(new iam.PolicyStatement()
        .addAction('iam:PassRole')
        .addResource(this.taskDefinition.taskRole.roleArn));
    }

    const id = this.taskDefinition.node.id + '-on-' + this.cluster.node.id;
    const arn = this.cluster.clusterArn;
    const role = singletonEventRole(this.taskDefinition, policyStatements);
    const containerOverrides = this.props.containerOverrides && this.props.containerOverrides
      .map(({ containerName, ...overrides }) => ({ name: containerName, ...overrides }));
    const input = { containerOverrides };
    const taskCount = this.taskCount;
    const taskDefinitionArn = this.taskDefinition.taskDefinitionArn;

    // Use a custom resource to "enhance" the target with network configuration
    // when using awsvpc network mode.
    if (this.taskDefinition.networkMode === ecs.NetworkMode.AwsVpc) {
      const subnetSelection = this.props.subnetSelection || { subnetType: ec2.SubnetType.Private };
      const assignPublicIp = subnetSelection.subnetType === ec2.SubnetType.Private ? 'DISABLED' : 'ENABLED';

      new cloudformation.AwsCustomResource(this.taskDefinition, 'PutTargets', {
        // `onCreate´ defaults to `onUpdate` and we don't need an `onDelete` here
        // because the rule/target will be owned by CF anyway.
        onUpdate: {
          service: 'CloudWatchEvents',
          apiVersion: '2015-10-07',
          action: 'putTargets',
          parameters: {
            Rule: this.taskDefinition.node.stack.parseArn(rule.ruleArn).resourceName,
            Targets: [
              {
                Arn: arn,
                Id: id,
                EcsParameters: {
                  TaskDefinitionArn: taskDefinitionArn,
                  LaunchType: this.taskDefinition.isEc2Compatible ? 'EC2' : 'FARGATE',
                  NetworkConfiguration: {
                    awsvpcConfiguration: {
                      Subnets: this.props.cluster.vpc.selectSubnets(subnetSelection).subnetIds,
                      AssignPublicIp: assignPublicIp,
                      SecurityGroups: this.securityGroup && [this.securityGroup.securityGroupId],
                    }
                  },
                  TaskCount: taskCount,
                },
                Input: JSON.stringify(input),
                RoleArn: role.roleArn
              }
            ]
          },
          physicalResourceId: id,
        },
        policyStatements: [ // Cannot use automatic policy statements because we need iam:PassRole
          new iam.PolicyStatement()
            .addAction('events:PutTargets')
            .addResource(rule.ruleArn),
          new iam.PolicyStatement()
            .addAction('iam:PassRole')
            .addResource(role.roleArn)
        ]
      });
    }

    return {
      id,
      arn,
      role,
      ecsParameters: {
        taskCount,
        taskDefinitionArn
      },
      input: events.RuleTargetInput.fromObject(input)
    };
  }
}
