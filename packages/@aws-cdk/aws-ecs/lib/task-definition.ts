import cdk = require('@aws-cdk/cdk');
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
     * Namespace for task definition versions
     *
     * @default CloudFormation-generated name
     */
    family?: string;

    // taskRoleArn?: string; // goes with container defs?

    networkMode?: string;

    containerDefinitions: ContainerDefinition[];
    //
    // executionRoleArn:? string;
    // volumes?: VolumeDefinition[];
    // placementConstraints?: PlacementConstraint[];
    // requiresCompatibilities?: string[]; // FARGATE or EC2 -- set on ECS TD vs FG TD
}

export class TaskDefinitionArn extends cdk.Token {
}

export class TaskDefinition extends cdk.Construct {
    public readonly taskDefinitionArn: TaskDefinitionArn;
    // public readonly containerDefinitions: ContainerDefinition[];
    private readonly containerDefinitions: cloudformation.TaskDefinitionResource.ContainerDefinitionProperty[] = [];

    constructor(parent: cdk.Construct, name: string, props: TaskDefinitionProps) {
        super(parent, name);

        const taskDef = new cloudformation.TaskDefinitionResource(this, "TaskDef", {
            family: "ecs-demo",
            memory: props.memory,
            cpu: props.cpu,
            containerDefinitions: new cdk.Token(() => this.containerDefinitions), // ????
        });

        props.containerDefinitions.forEach(c => this.addContainer(c));

        this.taskDefinitionArn = taskDef.ref;
    }

    private addContainer(definition:ContainerDefinition) {
        const cd = this.renderContainerDefininition(definition);
        this.containerDefinitions.push(cd);
    }

    // Populates task definition with container definition
    private renderContainerDefininition(definition: ContainerDefinition): cloudformation.TaskDefinitionResource.ContainerDefinitionProperty {
        return {
            name: definition.name,
            image: definition.image,
            cpu: definition.cpu,
            memory: definition.memory,
            essential: definition.essential,
            command: definition.command
        };
    }
}

export interface ContainerDefinition{
    name: string;
    image: string;

    command?: string[];
    cpu?: number;
    disableNetworking?: boolean;
    dnsSearchDomains?: string[];
    dnsServers?: string[];
    dockerLabels?: string[];
    dockerSecurityOptions?: string[];
    entryPoint?: string[];
    essential?: boolean;
    hostname?: string;
    links?: string[];
    memory?: number;
    memoryReservation?: number;
    privileged?: boolean;
    readonlyRootFilesystem?: boolean;
    user?: string;
    workingDirectory?: string
}
    // environment?: list of key-value;
    // extraHosts?: hostEntry[];
    // healthCheck?: healthCheck;
    // linuxParameters: linuxParam[];
    // logConfiguration: logConfig[];
    // mountPoints?: mountPoint[];
    // portMappings?: portMapping[];
    // ulimits?: ulimit[];
    // volumesFrom?: volumeFrom[];
