import { TaskDefinitionBuild, ServiceAddon, MutateContainerDefinition } from './addon-interfaces';
import ecs = require('@aws-cdk/aws-ecs');
import { Service } from '../service';

export interface ApplicationAddonProps {
  cpu: number,
  memoryMiB: number,
  image: ecs.ContainerImage,
  trafficPort: number,
  environment?: {
    [key: string]: string,
  }
}

export class Application extends ServiceAddon {
  public container!: ecs.ContainerDefinition;
  private props: ApplicationAddonProps;
  readonly trafficPort: number;

  // List of registered hooks from other addons that want to
  // mutate the application's container definition prior to
  // container creation
  public mutateContainerProps: MutateContainerDefinition[] = [];

  constructor(props: ApplicationAddonProps) {
    super('app');
    this.props = props;
    this.trafficPort = props.trafficPort;
  }

  prehook(service: Service) {
    this.parentService = service;
  }

  // This hook sets the overall task resource requirements to the
  // resource requirements of the application itself.
  mutateTaskDefinitionProps(props: TaskDefinitionBuild) {
    return {
      ...props,
      cpu: this.props.cpu.toString(),
      memoryMiB: this.props.memoryMiB.toString()
    };
  }

  // This hook adds the application container to the task definition.
  useTaskDefinition(taskDefinition: ecs.Ec2TaskDefinition) {
    var containerProps = {
      image: this.props.image,
      cpu: Number(this.props.cpu),
      memoryLimitMiB: Number(this.props.memoryMiB),
      environment: this.props.environment,
    };

    // Let other addons mutate the container definition. This is
    // used by addons which want to add environment variables, modify
    // logging parameters, etc.
    this.mutateContainerProps.forEach((hook) => {
      containerProps = hook(containerProps);
    });

    this.container = taskDefinition.addContainer('app', containerProps);

    // Create a port mapping for the container
    this.container.addPortMappings({
      containerPort: this.trafficPort,
      hostPort: this.trafficPort,
    })

    // Raise the ulimits for this main application container
    // so that it can handle more concurrent requests
    this.container.addUlimits({
      softLimit: 1024000,
      hardLimit: 1024000,
      name: ecs.UlimitName.NOFILE,
    });
  }

  bakeContainerDependencies() {
    const firelens = this.parentService.addons.get('firelens')
    if (firelens && firelens.container) {
      this.container.addContainerDependencies({
        container: firelens.container,
        condition: ecs.ContainerDependencyCondition.START,
      })
    }

    const appmeshAddon = this.parentService.addons.get('appmesh')
    if (appmeshAddon && appmeshAddon.container) {
      this.container.addContainerDependencies({
        container: appmeshAddon.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      })
    }

    const cloudwatchAddon = this.parentService.addons.get('cloudwatchAgent')
    if (cloudwatchAddon && cloudwatchAddon.container) {
      this.container.addContainerDependencies({
        container: cloudwatchAddon.container,
        condition: ecs.ContainerDependencyCondition.START,
      })
    }

    const xrayAddon = this.parentService.addons.get('xrayAddon')
    if (xrayAddon && xrayAddon.container) {
      this.container.addContainerDependencies({
        container: xrayAddon.container,
        condition: ecs.ContainerDependencyCondition.HEALTHY,
      })
    }
  }
};