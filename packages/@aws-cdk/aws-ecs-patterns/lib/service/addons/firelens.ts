import * as ecs from '@aws-cdk/aws-ecs';
import * as awslogs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { ContainerDefinitionBuild, ServiceAddon } from './addon-interfaces';

export class FireLensAddon extends ServiceAddon {
  private logGroup!: awslogs.LogGroup;

  constructor() {
    super('firelens');
  }

  public prehook(service: Service, scope: cdk.Stack) {
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
  public addHooks() {
    const appAddon = this.parentService.getAddon('app');

    if (!appAddon) {
      throw new Error('Firelens addon requires an application addon');
    }

    const self = this;

    if (!appAddon.mutateContainerProps) {
      throw new Error('Expected application addon to support an array of container mutations');
    }

    appAddon.mutateContainerProps.push((containerProps: ContainerDefinitionBuild) => {
      return {
        ...containerProps,

        logging: ecs.LogDrivers.firelens({
          options: {
            Name: 'cloudwatch',
            region: cdk.Stack.of(self.parentService).region,
            log_group_name: self.logGroup.logGroupName,
            log_stream_prefix: `${self.parentService.id}/`,
          },
        }),
      } as ContainerDefinitionBuild;
    });
  }

  public useTaskDefinition(taskDefinition: ecs.Ec2TaskDefinition) {
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