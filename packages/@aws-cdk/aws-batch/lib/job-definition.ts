
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import { Construct, Duration, IResource, Resource, Stack } from '@aws-cdk/core';
import { CfnJobDefinition } from './batch.generated';

/**
 * Properties of a job definition container
 */
export interface IJobDefinitionContainer {
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
     * The image used to start a container.
     */
    readonly image: ecs.EcrImage;

    /**
     * The instance type to use for a multi-node parallel job. Currently all node groups in a
     * multi-node parallel job must use the same instance type. This parameter is not valid
     * for single-node container jobs.
     */
    readonly instanceType: ec2.InstanceType;

    /**
     * The IAM role that the container can assume for AWS permissions.
     */
    readonly jobRole?: iam.IRole;

    /**
     * Linux-specific modifications that are applied to the container, such as details for device mappings.
     * For now, only the `devices` property is supported.
     */
    readonly linuxParams?: ecs.LinuxParameters;

    /**
     * The hard limit (in MiB) of memory to present to the container. If your container attempts to exceed
     * the memory specified here, the container is killed. You must specify at least 4 MiB of memory for a job.
     *
     * @default 4
     */
    readonly memoryLimitMiB?: number;

    /**
     * The mount points for data volumes in your container.
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
     */
    readonly gpuCount?: number;

    /**
     * A list of ulimits to set in the container.
     */
    readonly ulimits: ecs.Ulimit[];

    /**
     * The user name to use inside the container.
     */
    readonly user?: string;

    /**
     * The number of vCPUs reserved for the container. Each vCPU is equivalent to
     * 1,024 CPU shares. You must specify at least one vCPU.
     *
     * @default 1
     */
    readonly vcpus?: number;

    /**
     * A list of data volumes used in a job.
     */
    readonly volumes?: ecs.Volume[];
}

/**
 * Properties for a job definition
 */
export interface JobDefinitionProps {
    /**
     * The name of the job definition.
     *
     * Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
     *
     * @attribute
     * @default Cloudformation-generated name
     */
    readonly jobDefinitionName?: string;

    /**
     * An object with various properties specific to container-based jobs.
     *
     * @default - undefined
     */
    readonly containerProps?: IJobDefinitionContainer;

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
     * format, and programmatically change values in the command at submission time
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
}

/**
 * Properties for specifying multi-node properties for compute resources
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
 * Properties for a multi-node batch job
 */
export interface INodeRangeProps {
    /**
     * The container details for the node range.
     */
    container: IJobDefinitionContainer;
    /**
     * The minimum node index value to apply this container definition against. If omitted, the value zero is used.
     * You may nest node ranges, for example 0:10 and 4:5, in which case the 4:5 range properties override the 0:10 properties.
     */
    fromNodeIndex?: number;
    /**
     * The maximum node index value to apply this container definition against. If omitted, the highest value is used relative
     * to the number of nodes associated with the job. You may nest node ranges, for example 0:10 and 4:5,
     * in which case the 4:5 range properties override the 0:10 properties.
     */
    toNodeIndex?: number;
}

/**
 * Properties of a job definition
 */
export interface IJobDefinition extends IResource {
    /**
     * The ARN of this batch job definition
     *
     * @attribute
     * @default Cloudformation-generated ARN
     */
    readonly jobDefinitionArn: string;

    /**
     * The name of the batch job definition
     *
     * @attribute
     * @default Cloudformation-generated name
     */
    readonly jobDefinitionName: string;
}

/**
 * Batch Job Definition
 *
 * Defines a batch job definition to execute a specific batch job.
 */
export class JobDefinition extends Resource implements IJobDefinition {
    /**
     * Fetches an existing batch job definition by its amazon resource name.
     *
     * @param scope
     * @param id
     * @param jobDefinitionArn
     */
    public static fromJobDefinitionArn(scope: Construct, id: string, jobDefinitionArn: string): IJobDefinition {
        const stack = Stack.of(scope);
        const jobDefName = stack.parseArn(jobDefinitionArn).resource;

        class Import extends Resource implements IJobDefinition {
            public readonly jobDefinitionArn = jobDefinitionArn;
            public readonly jobDefinitionName = jobDefName;
        }

        return new Import(scope, id);
    }

    public readonly jobDefinitionArn: string;
    public readonly jobDefinitionName: string;

    constructor(scope: Construct, id: string, props?: JobDefinitionProps) {
        super(scope, id, {
            physicalName: props ? props.jobDefinitionName : undefined,
        });

        const jobDef = new CfnJobDefinition(this, 'Resource', {
            jobDefinitionName: props ? props.jobDefinitionName : undefined,
            containerProperties: props ? this.buildJobContainer(props.containerProps) : undefined,
            type: 'container',
            nodeProperties: props ? props.nodeProps ? {
                mainNode: props.nodeProps.mainNode,
                nodeRangeProperties: this.buildNodeRangeProps(props.nodeProps),
                numNodes: props.nodeProps.count,
            } : undefined : undefined,
            parameters: props ? props.parameters : undefined,
            retryStrategy: {
                attempts: props ? props.retryAttempts || 1 : undefined,
            },
            timeout: {
                attemptDurationSeconds: props ? props.timeout ? props.timeout.toSeconds() : undefined : undefined,
            },
        });

        this.jobDefinitionArn = jobDef.ref;
        this.jobDefinitionName = this.getResourceNameAttribute((props ? props.jobDefinitionName : undefined) || this.physicalName);
    }

    private deserializeEnvVariables(env?: { [name: string]: string}): CfnJobDefinition.EnvironmentProperty[] | undefined {
        const vars = new Array<CfnJobDefinition.EnvironmentProperty>();

        if (env === undefined) {
            return vars;
        }

        Object.keys(env).map((name: string) => {
            vars.push({ name, value: env[name] });
        });

        return vars;
    }

    private buildJobContainer(containerProps?: IJobDefinitionContainer): CfnJobDefinition.ContainerPropertiesProperty | undefined {
        if (containerProps === undefined) {
            return undefined;
        }

        return {
            command: containerProps.command,
            environment: this.deserializeEnvVariables(containerProps.environment),
            image: containerProps.image.imageName,
            instanceType: containerProps.instanceType ? containerProps.instanceType.toString() : undefined,
            jobRoleArn: containerProps.jobRole ? containerProps.jobRole.roleArn : undefined,
            linuxParameters: containerProps.linuxParams ? {
                devices: containerProps.linuxParams.renderLinuxParameters().devices,
            } : undefined,
            memory: containerProps.memoryLimitMiB || 4,
            mountPoints: containerProps.mountPoints,
            privileged: containerProps.privileged || false,
            readonlyRootFilesystem: containerProps.readOnly || false,
            ulimits: containerProps.ulimits,
            user: containerProps.user,
            vcpus: containerProps.vcpus || 1,
            volumes: containerProps.volumes,
        };
    }

    private buildNodeRangeProps(multiNodeProps: IMultiNodeProps): CfnJobDefinition.NodeRangePropertyProperty[] {
        const rangeProps = new Array<CfnJobDefinition.NodeRangePropertyProperty>();

        for (const prop of multiNodeProps.rangeProps) {
            rangeProps.push({
                container: this.buildJobContainer(prop.container),
                targetNodes: `${prop.fromNodeIndex || 0}:${prop.toNodeIndex || multiNodeProps.count}`,
            });
        }

        return rangeProps;
    }
}