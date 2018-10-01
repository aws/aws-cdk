import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { ContainerDefinition } from './container-definition';
import { cloudformation } from './ecs.generated';

export interface TaskDefinitionProps {
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
   * Namespace for task definition versions
   *
   * @default Automatically generated name
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
  memoryMiB?: string;

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
   * The IAM role assumed by the ECS agent.
   *
   * The role will be used to retrieve container images from ECR and
   * create CloudWatch log groups.
   *
   * @default An execution role will be automatically created if you use ECR images in your task definition
   */
  executionRole?: iam.Role;

  /**
   * The IAM role assumable by your application code running inside the container
   *
   * @default A task role is automatically created for you
   */
  taskRole?: iam.Role;

  /**
   * See: https://docs.aws.amazon.com/AmazonECS/latest/developerguide//task_definition_parameters.html#volumes
   */
  volumes?: Volume[];
}

export class TaskDefinition extends cdk.Construct {
  public readonly family: string;
  public readonly taskDefinitionArn: string;
  private readonly containerDefinitions = new Array<ContainerDefinition>();
  private readonly placementConstraints: cloudformation.TaskDefinitionResource.TaskDefinitionPlacementConstraintProperty[] = [];
  private readonly volumes: cloudformation.TaskDefinitionResource.VolumeProperty[] = [];
  private executionRole?: iam.Role;
  private readonly taskRole: iam.Role;

  constructor(parent: cdk.Construct, name: string, props: TaskDefinitionProps) {
    super(parent, name);

    this.family = props.family || this.uniqueId;

    if (props.placementConstraints) {
      props.placementConstraints.forEach(pc => this.addPlacementConstraint(pc));
    }

    if (props.volumes) {
      props.volumes.forEach(v => this.addVolume(v));
    }

    this.executionRole = props.executionRole;

    this.taskRole = props.taskRole || new iam.Role(this, 'TaskRole', {
        assumedBy: new cdk.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    const taskDef = new cloudformation.TaskDefinitionResource(this, 'Resource', {
      containerDefinitions: new cdk.Token(() => this.containerDefinitions.map(x => x.renderContainerDefinition())),
      cpu: props.cpu,
      executionRoleArn: new cdk.Token(() => this.executionRole && this.executionRole.roleArn),
      family: this.family,
      memory: props.memoryMiB,
      networkMode: props.networkMode,
      placementConstraints: new cdk.Token(() => this.placementConstraints),
      taskRoleArn: this.taskRole.roleArn
    });

    this.taskDefinitionArn = taskDef.taskDefinitionArn;
  }

  /**
   * Add a policy statement to the Task Role
   */
  public addToRolePolicy(statement: cdk.PolicyStatement) {
    this.taskRole.addToPolicy(statement);
  }

  /**
   * Add a container to this task
   */
  public addContainer(container: ContainerDefinition) {
    this.containerDefinitions.push(container);
    if (container.usesEcrImages) {
      this.generateExecutionRole();
    }
  }

  /**
   * Constrain where this task can be placed
   */
  private addPlacementConstraint(constraint: PlacementConstraint) {
    const pc = this.renderPlacementConstraint(constraint);
    this.placementConstraints.push(pc);
  }

  private addVolume(volume: Volume) {
    // const v = this.renderVolume(volume);
    this.volumes.push(volume);
  }

  private renderPlacementConstraint(pc: PlacementConstraint): cloudformation.TaskDefinitionResource.TaskDefinitionPlacementConstraintProperty {
    return {
      type: pc.type,
      expression: pc.expression
    };
  }

  /**
   * Generate a default execution role that allows pulling from ECR
   */
  private generateExecutionRole() {
    if (!this.executionRole) {
      this.executionRole = new iam.Role(this, 'ExecutionRole', {
        assumedBy: new cdk.ServicePrincipal('ecs-tasks.amazonaws.com'),
      });
      this.executionRole.attachManagedPolicy(new iam.AwsManagedPolicy("service-role/AmazonECSTaskExecutionRolePolicy").policyArn);
    }
  }
}

export interface PlacementConstraint {
  expression?: string;
  type: PlacementConstraintType;
}

export enum PlacementConstraintType {
  DistinctInstance = "distinctInstance",
  MemberOf = "memberOf"
}

export interface Volume {
  host?: Host;
  name?: string;
}

export interface Host {
  sourcePath?: string;
}
