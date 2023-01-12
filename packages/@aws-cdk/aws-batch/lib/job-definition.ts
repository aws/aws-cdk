import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import { ArnFormat, Duration, IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnJobDefinition } from './batch.generated';
import { ExposedSecret } from './exposed-secret';
import { JobDefinitionImageConfig } from './job-definition-image-config';

/**
 * The log driver to use for the container.
 */
export enum LogDriver {
  /**
   * Specifies the Amazon CloudWatch Logs logging driver.
   */
  AWSLOGS = 'awslogs',

  /**
   * Specifies the Fluentd logging driver.
   */
  FLUENTD = 'fluentd',

  /**
   * Specifies the Graylog Extended Format (GELF) logging driver.
   */
  GELF = 'gelf',

  /**
   * Specifies the journald logging driver.
   */
  JOURNALD = 'journald',

  /**
   * Specifies the logentries logging driver.
   */
  LOGENTRIES = 'logentries',

  /**
   * Specifies the JSON file logging driver.
   */
  JSON_FILE = 'json-file',

  /**
   * Specifies the Splunk logging driver.
   */
  SPLUNK = 'splunk',

  /**
   * Specifies the syslog logging driver.
   */
  SYSLOG = 'syslog'
}

/**
 * Platform capabilities
 */
export enum PlatformCapabilities {
  /**
   * Specifies EC2 environment.
   */
  EC2 = 'EC2',

  /**
   * Specifies Fargate environment.
   */
  FARGATE = 'FARGATE'
}

/**
 * Log configuration options to send to a custom log driver for the container.
 */
export interface LogConfiguration {
  /**
   * The log driver to use for the container.
   */
  readonly logDriver: LogDriver;

  /**
   * The configuration options to send to the log driver.
   *
   * @default - No configuration options are sent
   */
  readonly options?: any;

  /**
   * The secrets to pass to the log configuration as options.
   * For more information, see https://docs.aws.amazon.com/batch/latest/userguide/specifying-sensitive-data-secrets.html#secrets-logconfig
   *
   * @default - No secrets are passed
   */
  readonly secretOptions?: ExposedSecret[];
}

/**
 * Properties of a job definition container.
 */
export interface JobDefinitionContainer {
  /**
   * The command that is passed to the container.
   *
   * If you provide a shell command as a single string, you have to quote command-line arguments.
   *
   * @default - CMD value built into container image.
   */
  readonly command?: string[];

  /**
   * The environment variables to pass to the container.
   *
   * @default none
   */
  readonly environment?: { [key: string]: string };

  /**
   * The environment variables from secrets manager or ssm parameter store
   *
   * @default none
   */
  readonly secrets?: { [key: string]: ecs.Secret };

  /**
   * The image used to start a container.
   */
  readonly image: ecs.ContainerImage;

  /**
   * The instance type to use for a multi-node parallel job. Currently all node groups in a
   * multi-node parallel job must use the same instance type. This parameter is not valid
   * for single-node container jobs.
   *
   * @default - None
   */
  readonly instanceType?: ec2.InstanceType;

  /**
   * The IAM role that the container can assume for AWS permissions.
   *
   * @default - An IAM role will created.
   */
  readonly jobRole?: iam.IRole;

  /**
   * Linux-specific modifications that are applied to the container, such as details for device mappings.
   * For now, only the `devices` property is supported.
   *
   * @default - None will be used.
   */
  readonly linuxParams?: ecs.LinuxParameters;

  /**
   * The log configuration specification for the container.
   *
   * @default - containers use the same logging driver that the Docker daemon uses
   */
  readonly logConfiguration?: LogConfiguration;

  /**
   * The hard limit (in MiB) of memory to present to the container. If your container attempts to exceed
   * the memory specified here, the container is killed. You must specify at least 4 MiB of memory for EC2 and 512 MiB for Fargate.
   *
   * @default - 4 for EC2, 512 for Fargate
   */
  readonly memoryLimitMiB?: number;

  /**
   * The mount points for data volumes in your container.
   *
   * @default - No mount points will be used.
   */
  readonly mountPoints?: ecs.MountPoint[];

  /**
   * When this parameter is true, the container is given elevated privileges on the host container instance (similar to the root user).
   * @default false
   */
  readonly privileged?: boolean;

  /**
   * When this parameter is true, the container is given read-only access to its root file system.
   *
   * @default false
   */
  readonly readOnly?: boolean;

  /**
   * The number of physical GPUs to reserve for the container. The number of GPUs reserved for all
   * containers in a job should not exceed the number of available GPUs on the compute resource that the job is launched on.
   *
   * @default - No GPU reservation.
   */
  readonly gpuCount?: number;

  /**
   * A list of ulimits to set in the container.
   *
   * @default - No limits.
   */
  readonly ulimits?: ecs.Ulimit[];

  /**
   * The user name to use inside the container.
   *
   * @default - None will be used.
   */
  readonly user?: string;

  /**
   * The number of vCPUs reserved for the container. Each vCPU is equivalent to
   * 1,024 CPU shares. You must specify at least one vCPU for EC2 and 0.25 for Fargate.
   *
   * @default - 1 for EC2, 0.25 for Fargate
   */
  readonly vcpus?: number;

  /**
   * A list of data volumes used in a job.
   *
   * @default - No data volumes will be used.
   */
  readonly volumes?: ecs.Volume[];

  /**
   * Fargate platform version
   *
   * @default - LATEST platform version will be used
   */
  readonly platformVersion?: ecs.FargatePlatformVersion

  /**
   * The IAM role that AWS Batch can assume.
   * Required when using Fargate.
   *
   * @default - None
   */
  readonly executionRole?: iam.IRole;

  /**
   * Whether or not to assign a public IP to the job
   *
   * @default - false
   */
  readonly assignPublicIp?: boolean
}

/**
 * Construction properties of the `JobDefinition` construct.
 */
export interface JobDefinitionProps {
  /**
   * The name of the job definition.
   *
   * Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
   *
   * @default Cloudformation-generated name
   */
  readonly jobDefinitionName?: string;

  /**
   * An object with various properties specific to container-based jobs.
   */
  readonly container: JobDefinitionContainer;

  /**
   * An object with various properties specific to multi-node parallel jobs.
   *
   * @default - undefined
   */
  readonly nodeProps?: IMultiNodeProps;

  /**
   * When you submit a job, you can specify parameters that should replace the
   * placeholders or override the default job definition parameters. Parameters
   * in job submission requests take precedence over the defaults in a job definition.
   * This allows you to use the same job definition for multiple jobs that use the same
   * format, and programmatically change values in the command at submission time.
   *
   * @link https://docs.aws.amazon.com/batch/latest/userguide/job_definition_parameters.html
   * @default - undefined
   */
  readonly parameters?: { [key: string]: string };

  /**
   * The number of times to move a job to the RUNNABLE status. You may specify between 1 and
   * 10 attempts. If the value of attempts is greater than one, the job is retried on failure
   * the same number of attempts as the value.
   *
   * @default 1
   */
  readonly retryAttempts?: number;

  /**
   * The timeout configuration for jobs that are submitted with this job definition. You can specify
   * a timeout duration after which AWS Batch terminates your jobs if they have not finished.
   *
   * @default - undefined
   */
  readonly timeout?: Duration;

  /**
   * The platform capabilities required by the job definition.
   *
   * @default - EC2
   */
  readonly platformCapabilities?: PlatformCapabilities[];

  /**
   * Specifies whether to propagate the tags from the job or job definition to the corresponding Amazon ECS task.
   * If no value is specified, the tags aren't propagated.
   * Tags can only be propagated to the tasks during task creation. For tags with the same name,
   * job tags are given priority over job definitions tags.
   * If the total number of combined tags from the job and job definition is over 50, the job is moved to the `FAILED` state.
   *
   * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-batch-jobdefinition.html#cfn-batch-jobdefinition-propagatetags
   * @default - undefined
   */
  readonly propagateTags?: boolean;
}

/**
 * Properties for specifying multi-node properties for compute resources.
 */
export interface IMultiNodeProps {
  /**
   * Specifies the node index for the main node of a multi-node parallel job. This node index value must be fewer than the number of nodes.
   */
  mainNode: number;

  /**
   * A list of node ranges and their properties associated with a multi-node parallel job.
   */
  rangeProps: INodeRangeProps[];

  /**
   * The number of nodes associated with a multi-node parallel job.
   */
  count: number;
}

/**
 * Properties for a multi-node batch job.
 */
export interface INodeRangeProps {
  /**
   * The container details for the node range.
   */
  container: JobDefinitionContainer;

  /**
   * The minimum node index value to apply this container definition against.
   *
   * You may nest node ranges, for example 0:10 and 4:5, in which case the 4:5 range properties override the 0:10 properties.
   *
   * @default 0
   */
  fromNodeIndex?: number;

  /**
   * The maximum node index value to apply this container definition against. If omitted, the highest value is used relative.
   *
   * to the number of nodes associated with the job. You may nest node ranges, for example 0:10 and 4:5,
   * in which case the 4:5 range properties override the 0:10 properties.
   *
   * @default `IMultiNodeprops.count`
   */
  toNodeIndex?: number;
}

/**
 * An interface representing a job definition - either a new one, created with the CDK, *using the
 * `JobDefinition` class, or existing ones, referenced using the `JobDefinition.fromJobDefinitionArn` method.
 */
export interface IJobDefinition extends IResource {
  /**
   * The ARN of this batch job definition.
   *
   * @attribute
   */
  readonly jobDefinitionArn: string;

  /**
   * The name of the batch job definition.
   *
   * @attribute
   */
  readonly jobDefinitionName: string;
}

/**
 * Batch Job Definition.
 *
 * Defines a batch job definition to execute a specific batch job.
 */
export class JobDefinition extends Resource implements IJobDefinition {
  /**
   * Imports an existing batch job definition by its amazon resource name.
   *
   * @param scope
   * @param id
   * @param jobDefinitionArn
   */
  public static fromJobDefinitionArn(scope: Construct, id: string, jobDefinitionArn: string): IJobDefinition {
    const stack = Stack.of(scope);
    const jobDefName = stack.splitArn(jobDefinitionArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;

    class Import extends Resource implements IJobDefinition {
      public readonly jobDefinitionArn = jobDefinitionArn;
      public readonly jobDefinitionName = jobDefName;
    }

    return new Import(scope, id);
  }

  /**
   * Imports an existing batch job definition by its name.
   * If name is specified without a revision then the latest active revision is used.
   *
   * @param scope
   * @param id
   * @param jobDefinitionName
   */
  public static fromJobDefinitionName(scope: Construct, id: string, jobDefinitionName: string): IJobDefinition {
    const stack = Stack.of(scope);
    const jobDefArn = stack.formatArn({
      service: 'batch',
      resource: 'job-definition',
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      resourceName: jobDefinitionName,
    });

    class Import extends Resource implements IJobDefinition {
      public readonly jobDefinitionArn = jobDefArn;
      public readonly jobDefinitionName = jobDefinitionName;
    }

    return new Import(scope, id);
  }

  public readonly jobDefinitionArn: string;
  public readonly jobDefinitionName: string;
  private readonly imageConfig: JobDefinitionImageConfig;

  constructor(scope: Construct, id: string, props: JobDefinitionProps) {
    super(scope, id, {
      physicalName: props.jobDefinitionName,
    });

    this.validateProps(props);

    this.imageConfig = new JobDefinitionImageConfig(this, props.container);

    const isFargate = !!props.platformCapabilities?.includes(PlatformCapabilities.FARGATE);

    const jobDef = new CfnJobDefinition(this, 'Resource', {
      jobDefinitionName: props.jobDefinitionName,
      containerProperties: this.buildJobContainer(props.container, isFargate),
      type: 'container',
      nodeProperties: props.nodeProps
        ? {
          mainNode: props.nodeProps.mainNode,
          nodeRangeProperties: this.buildNodeRangeProps(props.nodeProps, isFargate),
          numNodes: props.nodeProps.count,
        }
        : undefined,
      parameters: props.parameters,
      retryStrategy: {
        attempts: props.retryAttempts || 1,
      },
      timeout: {
        attemptDurationSeconds: props.timeout ? props.timeout.toSeconds() : undefined,
      },
      platformCapabilities: props.platformCapabilities ?? [PlatformCapabilities.EC2],
      propagateTags: props.propagateTags,
    });

    // add read secrets permission to execution role
    if ( props.container.secrets && props.container.executionRole ) {
      const executionRole = props.container.executionRole;
      Object.values(props.container.secrets).forEach((secret) => {
        secret.grantRead(executionRole);
      });
    }

    this.jobDefinitionArn = this.getResourceArnAttribute(jobDef.ref, {
      service: 'batch',
      resource: 'job-definition',
      resourceName: this.physicalName,
    });
    this.jobDefinitionName = this.getResourceNameAttribute(jobDef.ref);
  }

  private deserializeEnvVariables(env?: { [name: string]: string }): CfnJobDefinition.EnvironmentProperty[] {
    const vars = new Array<CfnJobDefinition.EnvironmentProperty>();

    if (env === undefined) {
      return vars;
    }

    Object.keys(env).map((name: string) => {
      vars.push({ name, value: env[name] });
    });

    return vars;
  }

  /**
   * Validates the properties provided for a new job definition.
   */
  private validateProps(props: JobDefinitionProps) {
    if (props === undefined) {
      return;
    }

    if (props.platformCapabilities !== undefined && props.platformCapabilities.includes(PlatformCapabilities.FARGATE)
      && props.container.executionRole === undefined) {
      throw new Error('Fargate job must have executionRole set');
    }

    if (props.platformCapabilities !== undefined && props.platformCapabilities.includes(PlatformCapabilities.FARGATE)
      && props.container.gpuCount !== undefined) {
      throw new Error('Fargate job must not have gpuCount set');
    }

    if ((props.platformCapabilities === undefined || props.platformCapabilities.includes(PlatformCapabilities.EC2))
      && props.container.assignPublicIp !== undefined) {
      throw new Error('EC2 job must not have assignPublicIp set');
    }
  }

  private buildJobContainer(container: JobDefinitionContainer, isFargate: boolean): CfnJobDefinition.ContainerPropertiesProperty | undefined {
    if (container === undefined) {
      return undefined;
    }

    // If the AWS_*** environment variables are not explicitly set to the container, infer them from the current environment.
    // This makes the usage of tools like AWS SDK inside the container frictionless

    const environment = this.deserializeEnvVariables(container.environment);

    if (!environment.find((x) => x.name === 'AWS_REGION')) {
      environment.push({
        name: 'AWS_REGION',
        value: Stack.of(this).region,
      });
    }
    if (!environment.find((x) => x.name === 'AWS_ACCOUNT')) {
      environment.push({
        name: 'AWS_ACCOUNT',
        value: Stack.of(this).account,
      });
    }

    return {
      command: container.command,
      environment,
      secrets: container.secrets
        ? Object.entries(container.secrets).map(([key, value]) => {
          return {
            name: key,
            valueFrom: value.arn,
          };
        })
        : undefined,
      image: this.imageConfig.imageName,
      instanceType: container.instanceType && container.instanceType.toString(),
      jobRoleArn: container.jobRole && container.jobRole.roleArn,
      executionRoleArn: container.executionRole && container.executionRole.roleArn,
      linuxParameters: container.linuxParams
        ? { devices: container.linuxParams.renderLinuxParameters().devices }
        : undefined,
      logConfiguration: container.logConfiguration ? {
        logDriver: container.logConfiguration.logDriver,
        options: container.logConfiguration.options,
        secretOptions: container.logConfiguration.secretOptions
          ? this.buildLogConfigurationSecretOptions(container.logConfiguration.secretOptions)
          : undefined,
      } : undefined,
      mountPoints: container.mountPoints,
      privileged: container.privileged || false,
      networkConfiguration: container.assignPublicIp ? {
        assignPublicIp: container.assignPublicIp ? 'ENABLED' : 'DISABLED',
      } : undefined,
      readonlyRootFilesystem: container.readOnly || false,
      ulimits: container.ulimits,
      user: container.user,
      volumes: container.volumes,
      fargatePlatformConfiguration: container.platformVersion ? {
        platformVersion: container.platformVersion,
      } : undefined,
      resourceRequirements: [
        { type: 'VCPU', value: String(container.vcpus || (isFargate ? 0.25 : 1)) },
        { type: 'MEMORY', value: String(container.memoryLimitMiB || (isFargate ? 512 : 4)) },
      ].concat(container.gpuCount ? [{ type: 'GPU', value: String(container.gpuCount) }] : []),
    };
  }

  private buildNodeRangeProps(multiNodeProps: IMultiNodeProps, isFargate: boolean): CfnJobDefinition.NodeRangePropertyProperty[] {
    const rangeProps = new Array<CfnJobDefinition.NodeRangePropertyProperty>();

    for (const prop of multiNodeProps.rangeProps) {
      rangeProps.push({
        container: this.buildJobContainer(prop.container, isFargate),
        targetNodes: `${prop.fromNodeIndex || 0}:${prop.toNodeIndex || multiNodeProps.count}`,
      });
    }

    return rangeProps;
  }

  private buildLogConfigurationSecretOptions(secretOptions: ExposedSecret[]): CfnJobDefinition.SecretProperty[] {
    return secretOptions.map(secretOption => {
      return {
        name: secretOption.optionName,
        valueFrom: secretOption.secretArn,
      };
    });
  }
}
