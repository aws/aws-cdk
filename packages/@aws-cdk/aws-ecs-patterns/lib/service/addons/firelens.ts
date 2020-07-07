import { ServiceAddon, ContainerDefinitionBuild, MutateContainerDefinition } from './addon-interfaces';
import ecs = require('@aws-cdk/aws-ecs');
import { Service } from '../service';
import cdk = require('@aws-cdk/core');
import awslogs = require('@aws-cdk/aws-logs');

export class FireLensAddon extends ServiceAddon {
  public container!: ecs.ContainerDefinition;
  private logGroup!: awslogs.LogGroup;

  // List of registered hooks from other addons that want to
  // mutate the application's container definition prior to
  // container creation
  public mutateContainerProps: MutateContainerDefinition[] = [];

  constructor() {
    super('firelens');
  }

  prehook(service: Service, scope: cdk.Stack) {
    this.parentService = service;

    // Create a log group for the service, into which FireLens
    // will route the service's logs
    this.logGroup = new awslogs.LogGroup(scope, `${service.id}-logs`, {
      logGroupName: `${service.id}-logs`,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: awslogs.RetentionDays.ONE_WEEK,
    });
  }

  // Add hooks to the main application addon so that it is modified to
  // have logging properties that enable sending logs via the
  // Firelens log router container
  addHooks() {
    let appAddon = this.parentService.addons.get('app');

    if (!appAddon) {
      throw new Error('Firelens addon requires an application addon');
    }

    let self = this;

    if (!appAddon.mutateContainerProps) {
      throw new Error('Expected application addon to support an array of container mutations');
    }

    appAddon.mutateContainerProps.push(function (containerProps: ContainerDefinitionBuild) {
      return {
        ...containerProps,

        logging: ecs.LogDrivers.firelens({
          options: {
            Name: 'cloudwatch',
            region: cdk.Stack.of(self.parentService).region,
            log_group_name: self.logGroup.logGroupName,
            log_stream_prefix: `${self.parentService.id}/`,
          },
        })
      }
    });
  }

  useTaskDefinition(taskDefinition: ecs.Ec2TaskDefinition) {
    // Manually add a firelens log router, so that we can manually manage the dependencies
    // to ensure that the Firelens log router depends on the Envoy proxy
    this.container = taskDefinition.addFirelensLogRouter('firelens', {
      image: ecs.obtainDefaultFluentBitECRImage(taskDefinition, {
        logDriver: 'awsfirelens',
        options: {
          Name: 'cloudwatch',
        },
      }),
      firelensConfig: {
        type: ecs.FirelensLogRouterType.FLUENTBIT,
      },
      logging: new ecs.AwsLogDriver({ streamPrefix: 'firelens' }),
      memoryReservationMiB: 50,
      user: '0:1338', // Give Firelens a group ID that allows its outbound logs to bypass Envoy
    });
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