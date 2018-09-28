import cdk = require('@aws-cdk/cdk');
import { ContainerDefinition } from './container-definition';
import { cloudformation } from './ecs.generated';

export interface TaskDefinitionProps {

  containerDefinitions: ContainerDefinition[];

  /**
   * The number of cpu units used by the task. If using the EC2 launch type,
   * this field is optional. Supported values are between 128 CPU units
   * (0.125 vCPUs) and 10240 CPU units (10 vCPUs). If you are using the
   * Fargate launch type, this field is required and you must use one of the
   * following values, which determines your range of valid values for the
   * memory parameter:
   * 256 (.25 vCPU) - Available memory values: 0.5GB, 1GB, 2GB
   * 512 (.5 vCPU) - Available memory values: 1GB, 2GB, 3GB, 4GB
   * 1024 (1 vCPU) - Available memory values: 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB
   * 2048 (2 vCPU) - Available memory values: Between 4GB and 16GB in 1GB increments
   * 4096 (4 vCPU) - Available memory values: Between 8GB and 30GB in 1GB increments
   *
   * @default 256
   */
  cpu?: string;

  /**
   * The Amazon Resource Name (ARN) of the task execution role that
   * containers in this task can assume. All containers in this task are
   * granted the permissions that are specified in this role.
   *
   * Needed in Fargate to communicate with Cloudwatch Logs and ECR.
   */
  executionRoleArn?: string;

  /**
   * Namespace for task definition versions
   *
   * @default CloudFormation-generated name
   */
  family?: string;

  /**
   * The amount (in MiB) of memory used by the task. If using the EC2 launch
   * type, this field is optional and any value can be used. If you are using
   * the Fargate launch type, this field is required and you must use one of
   * the following values, which determines your range of valid values for
   * the cpu parameter:
   *
   * 0.5GB, 1GB, 2GB - Available cpu values: 256 (.25 vCPU)
   *
   * 1GB, 2GB, 3GB, 4GB - Available cpu values: 512 (.5 vCPU)
   *
   * 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB - Available cpu values: 1024 (1 vCPU)
   *
   * Between 4GB and 16GB in 1GB increments - Available cpu values: 2048 (2 vCPU)
   *
   * Between 8GB and 30GB in 1GB increments - Available cpu values: 4096 (4 vCPU)
   *
   * @default 512
   */
  memory?: string;

  /**
   * The Docker networking mode to use for the containers in the task, such as none, bridge, or host.
   * For Fargate or to use task networking, "awsvpc" mode is required.
   *
   * @default bridge
   */
  networkMode?: string;

  /**
   * An array of placement constraint objects to use for the task. You can
   * specify a maximum of 10 constraints per task (this limit includes
   * constraints in the task definition and those specified at run time).
   *
   * Not supported in Fargate.
   */
  placementConstraints?: PlacementConstraint[];

  /**
   * Valid values include EC2 and FARGATE.
   *
   * @default EC2
   */
  // requiresCompatibilities?: string[]; // FARGATE or EC2 -- set on ECS TD vs FG TD

  /**
   * The Amazon Resource Name (ARN) of an AWS Identity and Access Management
   * (IAM) role that grants containers in the task permission to call AWS
   * APIs on your behalf
   */
  taskRoleArn?: string;

  /**
   * See: https://docs.aws.amazon.com/AmazonECS/latest/developerguide//task_definition_parameters.html#volumes
   */
  volumes?: Volume[];
}

export class TaskDefinition extends cdk.Construct {
  public readonly taskDefinitionArn: string;
  private readonly containerDefinitions: cloudformation.TaskDefinitionResource.ContainerDefinitionProperty[] = [];
  private readonly placementConstraints: cloudformation.TaskDefinitionResource.TaskDefinitionPlacementConstraintProperty[] = [];
  private readonly volumes: cloudformation.TaskDefinitionResource.VolumeProperty[] = [];

  constructor(parent: cdk.Construct, name: string, props: TaskDefinitionProps) {
    super(parent, name);

    props.containerDefinitions.forEach(cd => this.addContainer(cd));

    if (props.placementConstraints) {
      props.placementConstraints.forEach(pc => this.addPlacementConstraint(pc));
    }

    if (props.volumes) {
      props.volumes.forEach(v => this.addVolume(v));
    }

    const taskDef = new cloudformation.TaskDefinitionResource(this, "TaskDef", {
      containerDefinitions: new cdk.Token(() => this.containerDefinitions),
      cpu: props.cpu,
      executionRoleArn: props.executionRoleArn,
      family: props.family,
      memory: props.memory,
      networkMode: props.networkMode,
      placementConstraints: new cdk.Token(() => this.placementConstraints),
      taskRoleArn: props.taskRoleArn
    });

    this.taskDefinitionArn = taskDef.ref;
  }

  private addContainer(definition: ContainerDefinition) {
    const cd = this.renderContainerDefininition(definition);
    this.containerDefinitions.push(cd);
  }

  private addPlacementConstraint(constraint: PlacementConstraint) {
    const pc = this.renderPlacementConstraint(constraint);
    this.placementConstraints.push(pc);
  }

  private addVolume(volume: Volume) {
    // const v = this.renderVolume(volume);
    this.volumes.push(volume);
  }

  // Populates task definition with container definition
  private renderContainerDefininition(definition: ContainerDefinition): cloudformation.TaskDefinitionResource.ContainerDefinitionProperty {
    // const logConfigs = this.renderLogConfiguration(definition.logConfiguration); // what to do if undefined?

    return {
      name: definition.name,
      image: definition.image,
      command: definition.command,
      cpu: definition.cpu,
      disableNetworking: definition.disableNetworking,
      dnsSearchDomains: definition.dnsSearchDomains,
      dnsServers: definition.dnsServers,
      // dockerLabels: definition.dockerLabels,
      dockerSecurityOptions: definition.dockerSecurityOptions,
      entryPoint: definition.entryPoint,
      essential: definition.essential,
      hostname: definition.hostname,
      links: definition.links,
      // logConfiguration: logConfigs, // only set if passed in?
      memory: definition.memory,
      memoryReservation: definition.memoryReservation,
      privileged: definition.privileged,
      readonlyRootFilesystem: definition.readonlyRootFilesystem,
      user: definition.user,
      workingDirectory: definition.workingDirectory
    };
  }

  private renderPlacementConstraint(pc: PlacementConstraint): cloudformation.TaskDefinitionResource.TaskDefinitionPlacementConstraintProperty {
    return {
      type: pc.type,
      expression: pc.expression
    };
  }

  // private renderLogConfiguration(lc: LogConfiguration[]): cloudformation.TaskDefinitionResource.ContainerDefinitionProperty.LogConfiguration[] {
  //   return {
  //     logDriver: lc.logDriver,
  //     options: lc.options
  //   };
  // }

  // private renderVolume(volume: Volume): cloudformation.TaskDefinitionResource.VolumeProperty {
  //   return {
  //     host: this.renderHost(volume.host),
  //     name: volume.name
  //   };
  // }

  // private renderHost(host: Host): cloudformation.TaskDefinitionResource.VolumeProperty.Host {
  //   return {
  //     sourcePath: host.sourcePath
  //   }
  // }
}

export interface PlacementConstraint {
  expression?: string;
  type: string; // PlacementConstraintType;
}

// enum PlacementConstraintType{
//   DistinctInstance = "distinctInstance",
//   MemberOf = "memberOf"
// }

export interface Volume {
  host?: Host;
  name?: string;
}

export interface Host {
  sourcePath?: string;
}
