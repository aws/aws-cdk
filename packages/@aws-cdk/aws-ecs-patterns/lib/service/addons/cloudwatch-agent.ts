import { ServiceAddon, MutateContainerDefinition } from './addon-interfaces';
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/core');
import { Service } from '../service';
const iam = require('@aws-cdk/aws-iam');

export class CloudwatchAgentAddon extends ServiceAddon {
  public container!: ecs.ContainerDefinition;

  private CW_CONFIG_CONTENT = {
    'logs': {
      'metrics_collected': {
        'emf': {},
      },
    },
    'metrics': {
      'metrics_collected': {
        'statsd': {},
      },
    },
  }

  // List of registered hooks from other addons that want to
  // mutate the application's container definition prior to
  // container creation
  public mutateContainerProps: MutateContainerDefinition[] = [];

  constructor() {
    super('cloudwatchAgent');
  }

  prehook(service: Service, scope: cdk.Stack) {
    this.parentService = service;
    this.scope = scope;
  }

  useTaskDefinition(taskDefinition: ecs.Ec2TaskDefinition) {
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
    statement.addActions([
      'cloudwatch:PutMetricData',
    ]);

    policy.addStatements(statement);
    policy.attachToRole(taskDefinition.taskRole);
  }

  bakeContainerDependencies() {
    const appmeshAddon = this.parentService.addons.get('appmesh')
    if (appmeshAddon && appmeshAddon.container) {
      this.container.addContainerDependencies({
        container: appmeshAddon.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      })
    }
  }
};