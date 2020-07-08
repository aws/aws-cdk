import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { ServiceAddon } from './addon-interfaces';

export class CloudwatchAgentAddon extends ServiceAddon {
  private CW_CONFIG_CONTENT = {
    logs: {
      metrics_collected: {
        emf: {},
      },
    },
    metrics: {
      metrics_collected: {
        statsd: {},
      },
    },
  };

  constructor() {
    super('cloudwatchAgent');
  }

  public prehook(service: Service, scope: cdk.Stack) {
    this.parentService = service;
    this.scope = scope;
  }

  public useTaskDefinition(taskDefinition: ecs.Ec2TaskDefinition) {
    // Add the CloudWatch Agent to this task
    this.container = taskDefinition.addContainer('cloudwatch-agent', {
      image: ecs.ContainerImage.fromRegistry('amazon/cloudwatch-agent:latest'),
      environment: {
        CW_CONFIG_CONTENT: JSON.stringify(this.CW_CONFIG_CONTENT),
      },
      logging: new ecs.AwsLogDriver({ streamPrefix: 'cloudwatch-agent' }),
      user: '0:1338', // Ensure that CloudWatch agent outbound traffic doesn't go through proxy
      memoryReservationMiB: 50,
    });

    // Add permissions that allow the cloudwatch agent to publish metrics
    const policy = new iam.Policy(this.scope, `${this.parentService.id}-publish-metrics`);

    const statement = new iam.PolicyStatement();
    statement.addResources('*');
    statement.addActions('cloudwatch:PutMetricData');

    policy.addStatements(statement);
    policy.attachToRole(taskDefinition.taskRole);
  }

  public bakeContainerDependencies() {
    if (!this.container) {
      throw new Error('The container dependency hook was called before the container was created');
    }

    const appmeshAddon = this.parentService.getAddon('appmesh');
    if (appmeshAddon && appmeshAddon.container) {
      this.container.addContainerDependencies({
        container: appmeshAddon.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }
  }
}