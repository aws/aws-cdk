import * as ecs from 'aws-cdk-lib/aws-ecs';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

/**
 * Provides version information and image selection for CloudWatch Agent.
 */
export class CloudWatchAgentVersion {
  /**
   * Default CloudWatch Agent image for Linux.
   */
  public static readonly CLOUDWATCH_AGENT_IMAGE = 'public.ecr.aws/cloudwatch-agent/cloudwatch-agent:latest';

  /**
   * CloudWatch Agent image for Windows Server 2019.
   */
  public static readonly CLOUDWATCH_AGENT_IMAGE_WIN2019 = 'public.ecr.aws/cloudwatch-agent/cloudwatch-agent:latest-windowsservercore2019';

  /**
   * CloudWatch Agent image for Windows Server 2022.
   */
  public static readonly CLOUDWATCH_AGENT_IMAGE_WIN2022 = 'public.ecr.aws/cloudwatch-agent/cloudwatch-agent:latest-windowsservercore2022';

  /**
   * Gets the appropriate CloudWatch Agent image based on the operating system.
   * @param operatingSystemFamily - The ECS operating system family
   * @returns The CloudWatch Agent image URI
   */
  public static getCloudWatchAgentImage(operatingSystemFamily?: ecs.OperatingSystemFamily): string {
    let cloudWatchAgentImage = CloudWatchAgentVersion.CLOUDWATCH_AGENT_IMAGE;
    if (operatingSystemFamily) {
      switch (operatingSystemFamily) {
        case ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE:
        case ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_FULL:
          cloudWatchAgentImage = CloudWatchAgentVersion.CLOUDWATCH_AGENT_IMAGE_WIN2019;
          break;
        case ecs.OperatingSystemFamily.WINDOWS_SERVER_2022_CORE:
        case ecs.OperatingSystemFamily.WINDOWS_SERVER_2022_FULL:
          cloudWatchAgentImage = CloudWatchAgentVersion.CLOUDWATCH_AGENT_IMAGE_WIN2022;
          break;
      }
    }
    return cloudWatchAgentImage;
  }
}

/**
 * Configuration options for the CloudWatch Agent container.
 */
export interface CloudWatchAgentOptions {
  /**
   * Name of the CloudWatch Agent container.
   */
  readonly containerName: string;

  /**
   * Start as an essential container.
   * @default - true
   */
  readonly essential?: boolean;

  /**
   * Custom agent configuration in JSON format.
   * @default - Uses default configuration for Application Signals
   */
  readonly agentConfig?: string;

  /**
   * Whether to enable logging for the CloudWatch Agent.
   * @default - false
   */
  readonly enableLogging?: boolean;

  /**
   * The minimum number of CPU units to reserve for the container.
   * @default - No minimum CPU units reserved.
   */
  readonly cpu?: number;

  /**
   * The amount (in MiB) of memory to present to the container.
   * @default - No memory limit.
   */
  readonly memoryLimitMiB?: number;

  /**
   * The soft limit (in MiB) of memory to reserve for the container.
   * @default - No memory reserved.
   */
  readonly memoryReservationMiB?: number;

  /**
   * Operating system family for the CloudWatch Agent.
   * @default - Linux
   */
  readonly operatingSystemFamily?: ecs.OperatingSystemFamily;

  /**
   * The port mappings to add to the container definition.
   * @default - No ports are mapped.
   */
  readonly portMappings?: ecs.PortMapping[];
}

/**
 * Properties for integrating CloudWatch Agent into an ECS task definition.
 */
export interface CloudWatchAgentIntegrationProps extends CloudWatchAgentOptions {
  /**
   * The task definition to integrate CloudWatch agent into.
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly taskDefinition: ecs.TaskDefinition;
}

/**
 * A construct that adds CloudWatch Agent as a container to an ECS task definition.
 */
export class CloudWatchAgentIntegration extends Construct {
  private static readonly DEFAULT_CONFIG = {
    logs: {
      metrics_collected: {
        application_signals: {
          enabled: true,
        },
      },
    },
    traces: {
      traces_collected: {
        application_signals: {
          enabled: true,
        },
      },
    },
  };

  /**
   * The CloudWatch Agent container definition.
   */
  readonly agentContainer: ecs.ContainerDefinition;

  /**
   * Creates a new CloudWatch Agent integration.
   * @param scope - The construct scope
   * @param id - The construct ID
   * @param props - Configuration properties
   */
  constructor(scope: Construct,
    id: string,
    props: CloudWatchAgentIntegrationProps,
  ) {
    super(scope, id);

    props.taskDefinition.taskRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('CloudWatchAgentServerPolicy'));

    this.agentContainer = props.taskDefinition.addContainer(props.containerName, {
      image: ecs.ContainerImage.fromRegistry(CloudWatchAgentVersion.getCloudWatchAgentImage(props.operatingSystemFamily)),
      cpu: props.cpu,
      essential: props.essential? props.essential:true,
      memoryLimitMiB: props.memoryLimitMiB,
      memoryReservationMiB: props.memoryReservationMiB,
      logging: props.enableLogging? new ecs.AwsLogDriver({
        streamPrefix: props.containerName,
      }): undefined,
      user: '0:1338',
      portMappings: props.portMappings,
      environment: {
        CW_CONFIG_CONTENT: props.agentConfig ? props.agentConfig: JSON.stringify(CloudWatchAgentIntegration.DEFAULT_CONFIG),
      },
    });
  }
}
