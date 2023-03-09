import { FargatePlatformVersion, FargateTaskDefinition, RuntimePlatform } from '@aws-cdk/aws-ecs';


export interface FargateServiceBaseProps {
  /**
   * The task definition to use for tasks in the service. TaskDefinition or TaskImageOptions must be specified, but not both.
   *
   * [disable-awslint:ref-via-interface]
   *
   * @default - none
   */
  readonly taskDefinition?: FargateTaskDefinition;

  /**
   * The number of cpu units used by the task.
   *
   * Valid values, which determines your range of valid values for the memory parameter:
   *
   * 256 (.25 vCPU) - Available memory values: 0.5GB, 1GB, 2GB
   *
   * 512 (.5 vCPU) - Available memory values: 1GB, 2GB, 3GB, 4GB
   *
   * 1024 (1 vCPU) - Available memory values: 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB
   *
   * 2048 (2 vCPU) - Available memory values: Between 4GB and 16GB in 1GB increments
   *
   * 4096 (4 vCPU) - Available memory values: Between 8GB and 30GB in 1GB increments
   *
   * 8192 (8 vCPU) - Available memory values: Between 16GB and 60GB in 4GB increments
   *
   * 16384 (16 vCPU) - Available memory values: Between 32GB and 120GB in 8GB increments
   *
   * This default is set in the underlying FargateTaskDefinition construct.
   *
   * @default 256
   */
  readonly cpu?: number;

  /**
    * The amount (in MiB) of memory used by the task.
    *
    * This field is required and you must use one of the following values, which determines your range of valid values
    * for the cpu parameter:
    *
    * 512 (0.5 GB), 1024 (1 GB), 2048 (2 GB) - Available cpu values: 256 (.25 vCPU)
    *
    * 1024 (1 GB), 2048 (2 GB), 3072 (3 GB), 4096 (4 GB) - Available cpu values: 512 (.5 vCPU)
    *
    * 2048 (2 GB), 3072 (3 GB), 4096 (4 GB), 5120 (5 GB), 6144 (6 GB), 7168 (7 GB), 8192 (8 GB) - Available cpu values: 1024 (1 vCPU)
    *
    * Between 4096 (4 GB) and 16384 (16 GB) in increments of 1024 (1 GB) - Available cpu values: 2048 (2 vCPU)
    *
    * Between 8192 (8 GB) and 30720 (30 GB) in increments of 1024 (1 GB) - Available cpu values: 4096 (4 vCPU)
    *
    * Between 16384 (16 GB) and 61440 (60 GB) in increments of 4096 (4 GB) - Available cpu values: 8192 (8 vCPU)
    *
    * Between 32768 (32 GB) and 122880 (120 GB) in increments of 8192 (8 GB) - Available cpu values: 16384 (16 vCPU)
    *
    * This default is set in the underlying FargateTaskDefinition construct.
    *
    * @default 512
    */
  readonly memoryLimitMiB?: number;

  /**
   * The platform version on which to run your service.
   *
   * If one is not specified, the LATEST platform version is used by default. For more information, see
   * [AWS Fargate Platform Versions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html)
   * in the Amazon Elastic Container Service Developer Guide.
   *
   * @default Latest
   */
  readonly platformVersion?: FargatePlatformVersion;

  /**
   * The runtime platform of the task definition
   *
   * @default - If the property is undefined, `operatingSystemFamily` is LINUX and `cpuArchitecture` is X86_64
   */
  readonly runtimePlatform?: RuntimePlatform;
}
