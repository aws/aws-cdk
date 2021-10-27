import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import { Construct } from 'constructs';
import { Service } from '../service';
import { ServiceExtension } from './extension-interfaces';

const CLOUDWATCH_AGENT_IMAGE = 'amazon/cloudwatch-agent:latest';

/**
 * This extension adds a CloudWatch agent to the task definition and
 * configures the task to be able to publish metrics to CloudWatch.
 */
export class CloudwatchAgentExtension extends ServiceExtension {
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

  public prehook(service: Service, scope: Construct) {
    this.parentService = service;
    this.scope = scope;
  }

  public useTaskDefinition(taskDefinition: ecs.TaskDefinition) {
    // Add the CloudWatch Agent to this task
    this.container = taskDefinition.addContainer('cloudwatch-agent', {
      image: ecs.ContainerImage.fromRegistry(CLOUDWATCH_AGENT_IMAGE),
      environment: {
        CW_CONFIG_CONTENT: JSON.stringify(this.CW_CONFIG_CONTENT),
      },
      logging: new ecs.AwsLogDriver({ streamPrefix: 'cloudwatch-agent' }),
      user: '0:1338', // Ensure that CloudWatch agent outbound traffic doesn't go through proxy
      memoryReservationMiB: 50,
    });

    // Add permissions that allow the cloudwatch agent to publish metrics
    new iam.Policy(this.scope, `${this.parentService.id}-publish-metrics`, {
      roles: [taskDefinition.taskRole],
      statements: [
        new iam.PolicyStatement({
          resources: ['*'],
          actions: ['cloudwatch:PutMetricData'],
        }),
      ],
    });
  }

  public resolveContainerDependencies() {
    if (!this.container) {
      throw new Error('The container dependency hook was called before the container was created');
    }

    const appmeshextension = this.parentService.serviceDescription.get('appmesh');
    if (appmeshextension && appmeshextension.container) {
      this.container.addContainerDependencies({
        container: appmeshextension.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      });
    }
  }
}
