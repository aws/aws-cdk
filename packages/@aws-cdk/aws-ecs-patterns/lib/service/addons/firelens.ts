import * as ecs from '@aws-cdk/aws-ecs';
import * as awslogs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { Service } from '../service';
import { ContainerMutatingHook, ServiceAddon } from './addon-interfaces';

export interface FirelensProps {
  readonly parentService: Service;
  readonly logGroup: awslogs.LogGroup;
}

export class FirelensMutatingHook extends ContainerMutatingHook {
  private parentService: Service;
  private logGroup: awslogs.LogGroup;

  constructor(props: FirelensProps) {
    super();
    this.parentService = props.parentService;
    this.logGroup = props.logGroup;
  }

  public mutateContainerDefinition(props: ecs.ContainerDefinitionOptions) {
    return {
      ...props,

      logging: ecs.LogDrivers.firelens({
        options: {
          Name: 'cloudwatch',
          region: cdk.Stack.of(this.parentService).region,
          log_group_name: this.logGroup.logGroupName,
          log_stream_prefix: `${this.parentService.id}/`,
        },
      }),
    } as ecs.ContainerDefinitionOptions;
  }
}

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

    appAddon.addContainerMutatingHook(new FirelensMutatingHook({
      parentService: this.parentService,
      logGroup: this.logGroup,
    }));
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