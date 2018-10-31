import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { ContainerDefinition, ContainerDefinitionProps } from '../container-definition';
import { cloudformation } from '../ecs.generated';

/**
 * Basic task definition properties
 */
export interface BaseTaskDefinitionProps {
  /**
   * Namespace for task definition versions
   *
   * @default Automatically generated name
   */
  family?: string;

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

/**
 * Base class for Ecs and Fargate task definitions
 */
export abstract class BaseTaskDefinition extends cdk.Construct {
  /**
   * The family name of this task definition
   */
  public readonly family: string;

  /**
   * ARN of this task definition
   */
  public readonly taskDefinitionArn: string;

  /**
   * Task role used by this task definition
   */
  public readonly taskRole: iam.Role;

  /**
   * Network mode used by this task definition
   */
  public abstract readonly networkMode: NetworkMode;

  /**
   * Default container for this task
   *
   * Load balancers will send traffic to this container. The first
   * essential container that is added to this task will become the default
   * container.
   */
  public defaultContainer?: ContainerDefinition;

  /**
   * All containers
   */
  protected readonly containers = new Array<ContainerDefinition>();

  /**
   * All volumes
   */
  private readonly volumes: cloudformation.TaskDefinitionResource.VolumeProperty[] = [];

  /**
   * Execution role for this task definition
   *
   * Will be created as needed.
   */
  private executionRole?: iam.Role;

  constructor(parent: cdk.Construct, name: string, props: BaseTaskDefinitionProps, additionalProps: any) {
    super(parent, name);

    this.family = props.family || this.uniqueId;

    if (props.volumes) {
      props.volumes.forEach(v => this.addVolume(v));
    }

    this.executionRole = props.executionRole;

    this.taskRole = props.taskRole || new iam.Role(this, 'TaskRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    const taskDef = new cloudformation.TaskDefinitionResource(this, 'Resource', {
      containerDefinitions: new cdk.Token(() => this.containers.map(x => x.renderContainerDefinition())),
      volumes: new cdk.Token(() => this.volumes),
      executionRoleArn: new cdk.Token(() => this.executionRole && this.executionRole.roleArn),
      family: this.family,
      taskRoleArn: this.taskRole.roleArn,
      ...additionalProps
    });

    this.taskDefinitionArn = taskDef.taskDefinitionArn;
  }

  /**
   * Add a policy statement to the Task Role
   */
  public addToTaskRolePolicy(statement: iam.PolicyStatement) {
    this.taskRole.addToPolicy(statement);
  }

  public addToExecutionRolePolicy(statement: iam.PolicyStatement) {
    if (!this.executionRole) {
      this.executionRole = new iam.Role(this, 'ExecutionRole', {
        assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      });
    }
    this.executionRole.addToPolicy(statement);
  }

  /**
   * Create a new container to this task definition
   */
  public addContainer(id: string, props: ContainerDefinitionProps) {
    const container = new ContainerDefinition(this, id, this, props);
    this.containers.push(container);
    if (this.defaultContainer === undefined && container.essential) {
      this.defaultContainer = container;
    }

    return container;
  }

  /**
   * Add a volume to this task definition
   */
  private addVolume(volume: Volume) {
    this.volumes.push(volume);
  }
}

/**
 * The Docker networking mode to use for the containers in the task.
 */
export enum NetworkMode {
  /**
   * The task's containers do not have external connectivity and port mappings can't be specified in the container definition.
   */
  None = 'none',

  /**
   * The task utilizes Docker's built-in virtual network which runs inside each container instance.
   */
  Bridge = 'bridge',

  /**
   * The task is allocated an elastic network interface.
   */
  AwsVpc = 'awsvpc',

  /**
   * The task bypasses Docker's built-in virtual network and maps container ports directly to the EC2 instance's network interface directly.
   *
   * In this mode, you can't run multiple instantiations of the same task on a
   * single container instance when port mappings are used.
   */
  Host = 'host',
}

/**
 * Compatibilties
 */
export enum Compatibilities {
  /**
   * EC2 capabilities
   */
  Ec2 = "EC2",

  /**
   * Fargate capabilities
   */
  Fargate = "FARGATE"
}

/**
 * Volume definition
 */
export interface Volume {
  /**
   * Path on the host
   */
  host?: Host;

  /**
   * A name for the volume
   */
  name?: string;
  // FIXME add dockerVolumeConfiguration
}

/**
 * A volume host
 */
export interface Host {
  /**
   * Source path on the host
   */
  sourcePath?: string;
}
