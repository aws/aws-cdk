import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { ContainerDefinition } from '../container-definition';
import { cloudformation } from '../ecs.generated';

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

export class BaseTaskDefinition extends cdk.Construct {
  public readonly family: string;
  public readonly taskDefinitionArn: string;
  public readonly taskRole: iam.Role;

  /**
   * Default container for this task
   *
   * Load balancers will send traffic to this container. The first
   * essential container that is added to this task will become the default
   * container.
   */
  public defaultContainer?: ContainerDefinition;
  private readonly containers = new Array<ContainerDefinition>();
  private readonly volumes: cloudformation.TaskDefinitionResource.VolumeProperty[] = [];
  private executionRole?: iam.Role;

  constructor(parent: cdk.Construct, name: string, props: BaseTaskDefinitionProps, additionalProps: any) {
    super(parent, name);

    this.family = props.family || this.uniqueId;

    if (props.volumes) {
      props.volumes.forEach(v => this.addVolume(v));
    }

    this.executionRole = props.executionRole;

    this.taskRole = props.taskRole || new iam.Role(this, 'TaskRole', {
        assumedBy: new cdk.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    const taskDef = new cloudformation.TaskDefinitionResource(this, 'Resource', {
      containerDefinitions: new cdk.Token(() => this.containers.map(x => x.renderContainerDefinition())),
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
  public addToRolePolicy(statement: cdk.PolicyStatement) {
    this.taskRole.addToPolicy(statement);
  }

  /**
   * Add a container to this task
   */
  public addContainer(container: ContainerDefinition) {
    this.containers.push(container);
    if (container.usesEcrImages) {
      this.generateExecutionRole();
    }
    if (this.defaultContainer === undefined && container.essential) {
      this.defaultContainer = container;
    }
  }

  private addVolume(volume: Volume) {
    // const v = this.renderVolume(volume);
    this.volumes.push(volume);
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

export enum Compatibilities {
  Ec2 = "EC2",
  Fargate = "FARGATE"
}

export interface Volume {
  host?: Host;
  name?: string;
}

export interface Host {
  sourcePath?: string;
}
