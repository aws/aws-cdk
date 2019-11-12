import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import { Construct, IResource, Resource, Stack, Tag } from '@aws-cdk/core';
import { CfnComputeEnvironment } from './batch.generated';

/**
 * Property to determine if AWS Batch
 * should manage your compute resources
 */
export enum ComputeEnvironmentType {
    /**
     * AWS Batch manages your compute resources
     */
    MANAGED   = 'MANAGED',
    /**
     * Custom managed compute resources
     */
    UNMANAGED = 'UNMANAGED',
}

/**
 * Property to specify how compute resources will be provisioned based
 */
export enum ComputeEnvironmentStatus {
    /**
     * Jobs are allowed to be assigned to this environment
     */
    ENABLED = 'ENABLED',
    /**
     * Jobs are not allowed to be assigned to this environment
     */
    DISABLED = 'DISABLED',
}

/**
 * Property to specify if the compute environment
 * uses On-Demand of SpotFleet compute resources
 */
export enum ComputeResourceType {
    /**
     * Resources will be EC2 On-Demand resources
     */
    EC2  = 'EC2',
    /**
     * Resources will be EC2 SpotFleet resources
     */
    SPOT = 'SPOT',
}

/**
 * Properties for how to prepare compute resources
 * that are provisioned for a compute environment
 */
export enum AllocationStrategy {
    /**
     * Batch will use the best fitting instance type will be used
     * when assigning a batch job in this compute environment
     */
    BEST_FIT = 'BEST_FIT',
    /**
     * Batch will select additional instance types that are large enough to
     * meet the requirements of the jobs in the queue, with a preference for
     * instance types with a lower cost per unit vCPU
     */
    BEST_FIT_PROGRESSIVE = 'BEST_FIT_PROGRESSIVE',
    /**
     * This is only available for Spot Instance compute resources and will select
     * additional instance types that are large enough to meet the requirements of
     * the jobs in the queue, with a preference for instance types that are less
     * likely to be interrupted
     */
    SPOT_CAPACITY_OPTIMIZED = 'SPOT_CAPACITY_OPTIMIZED',
}

/**
 * Properties for defining the structure of the batch compute cluster
 */
export interface ComputeResourceProps {
    /**
     * The IAM role applied to EC2 resources in the compute environment.
     *
     * @default - a new role will be created
     */
    readonly instanceRole?: iam.IRole;

    /**
     * The types of EC2 instances that may be launched in the compute environment. You can specify instance
     * families to launch any instance type within those families (for example, c4 or p3), or you can specify
     * specific sizes within a family (such as c4.8xlarge). You can also choose optimal to pick instance types
     * (from the C, M, and R instance families) on the fly that match the demand of your job queues.
     *
     * @default optimal
     */
    readonly instanceTypes?: ec2.InstanceType[];

    /**
     * The maximum number of EC2 vCPUs that an environment can reach. Each vCPU is equivalent to
     * 1,024 CPU shares. You must specify at least one vCPU.
     *
     * @default 256
     */
    readonly maxvCpus?: number;

    /**
     * The minimum number of EC2 vCPUs that an environment should maintain (even if the compute environment state is DISABLED).
     * Each vCPU is equivalent to 1,024 CPU shares. You must specify at least one vCPU.
     *
     * @default 1
     */
    readonly minvCpus?: number;

    /**
     * The EC2 security group(s) associated with instances launched in the compute environment.
     *
     * @default AWS default security group
     */
    readonly securityGroupIds?: ec2.ISecurityGroup[];

    /**
     * The VPC network that all compute resources will be connected to.
     */
    readonly vpc: ec2.IVpc;

    /**
     * The VPC subnets into which the compute resources are launched.
     *
     * @default - private subnets of the supplied VPC
     */
    readonly vpcSubnets?: ec2.SubnetSelection;

    /**
     * The type of compute environment: EC2 or SPOT.
     *
     * @default EC2
     */
    readonly type?: ComputeResourceType;

    /**
     * The maximum percentage that a Spot Instance price can be when compared with the On-Demand price for
     * that instance type before instances are launched. For example, if your maximum percentage is 20%,
     * then the Spot price must be below 20% of the current On-Demand price for that EC2 instance. You always
     * pay the lowest (market) price and never more than your maximum percentage. If you leave this field empty,
     * the default value is 100% of the On-Demand price.
     *
     * @default 100
     */
    readonly bidPercentage?: number;

    /**
     * The desired number of EC2 vCPUS in the compute environment.
     *
     * @default - no desired vcpu value will be used
     */
    readonly desiredvCpus?: number;

    /**
     * The EC2 key pair that is used for instances launched in the compute environment.
     * If no key is defined, then SSH access is not allowed to provisioned compute resources.
     *
     * @default - No SSH access will be possible.
     */
    readonly ec2KeyPair?: string;

    /**
     * The Amazon Machine Image (AMI) ID used for instances launched in the compute environment.
     *
     * @default - no image will be used
     */
    readonly image?: ec2.IMachineImage;

    /**
     * The launch template to use for your compute resources. Any other compute resource parameters
     * that you specify in a CreateComputeEnvironment API operation override the same parameters in
     * the launch template. You must specify either the launch template ID or launch template name in
     * the request, but not both. For more information, see Launch Template Support in the AWS Batch User Guide.
     *
     * @default - no launch template will be used
     */
    readonly launchTemplate?: ec2.CfnInstance.LaunchTemplateSpecificationProperty;

    /**
     * The Amazon EC2 placement group to associate with your compute resources. If you intend to submit multi-node
     * parallel jobs to your compute environment, you should consider creating a cluster placement group and
     * associate it with your compute resources. This keeps your multi-node parallel job on a logical grouping of
     * instances within a single Availability Zone with high network flow potential. For more information, see
     * Placement Groups in the Amazon EC2 User Guide for Linux Instances.
     *
     * @default - no placement group will be used
     */
    readonly placementGroup?: ec2.CfnPlacementGroup;

    /**
     * The Amazon Resource Name (ARN) of the Amazon EC2 Spot Fleet IAM role applied to a SPOT compute environment.
     * For more information, see Amazon EC2 Spot Fleet Role in the AWS Batch User Guide.
     *
     * @default - no fleet role will be used
     */
    readonly spotIamFleetRole?: iam.IRole;

    /**
     * Key-value pair tags to be applied to resources that are launched in the compute environment.
     * For AWS Batch, these take the form of "String1": "String2", where String1 is the tag key and
     * String2 is the tag value—for example, { "Name": "AWS Batch Instance - C4OnDemand" }.
     *
     * @default - no tags will be assigned on compute resources
     */
    readonly computeResourcesTags?: Tag;
}

/**
 * Properties for creating a new Compute Environment
 */
export interface ComputeEnvironmentProps {
    /**
     * The allocation strategy to use for the compute resource in case not enough instances ofthe best
     * fitting instance type can be allocated. This could be due to availability of the instance type in
     * the region or Amazon EC2 service limits. If this is not specified, the default is BEST_FIT, which
     * will use only the best fitting instance type, waiting for additional capacity if it's not available.
     * This allocation strategy keeps costs lower but can limit scaling. If you are using Spot Fleets with
     * BEST_FIT then the Spot Fleet IAM Role must be specified. BEST_FIT_PROGRESSIVE will select an additional
     * instance type that is large enough to meet the requirements of the jobs in the queue, with a preference
     * for an instance type with a lower cost. SPOT_CAPACITY_OPTIMIZED is only available for Spot Instance
     * compute resources and will select an additional instance type that is large enough to meet the requirements
     * of the jobs in the queue, with a preference for an instance type that is less likely to be interrupted.
     *
     * @default AllocationStrategy.BEST_FIT
     */
    readonly allocationStrategy?: AllocationStrategy;

    /**
     * A name for the compute environment.
     *
     * Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
     *
     * @default Cloudformation-generated name
     */
    readonly computeEnvironmentName?: string;

    /**
     * The details of the compute resources managed by this environment.
     *
     * If specified, and this is an managed compute environment, the property will be ignored.
     *
     * By default, AWS Batch managed compute environments use a recent, approved version of the
     * Amazon ECS-optimized AMI for compute resources.
     *
     * @default - AWS-managed compute resources
     */
    readonly computeResources?: ComputeResourceProps;

    /**
     * The state of the compute environment. If the state is set to true, then the compute
     * environment accepts jobs from a queue and can scale out automatically based on queues.
     *
     * @default ComputeEnvironmentStatus.ENABLED
     */
    readonly state?: ComputeEnvironmentStatus;

    /**
     * Whether the compute resources should scale automatically based on job queues.
     *
     * @default MANAGED
     */
    readonly type?: ComputeEnvironmentType;
}

/**
 * Properties of a compute environment
 */
export interface IComputeEnvironment extends IResource {
    /**
     * The ARN of this compute environment
     *
     * @attribute
     */
    readonly computeEnvironmentArn: string;

    /**
     * The name of this compute environment
     *
     * @attribute
     */
    readonly computeEnvironmentName: string;
}

/**
 * Batch Compute Environment
 *
 * Defines a batch compute environment to run batch jobs on.
 */
export class ComputeEnvironment extends Resource implements IComputeEnvironment {
    /**
     * Fetches an existing batch compute environment by its amazon resource name.
     *
     * @param scope
     * @param id
     * @param computeEnvironmentArn
     */
    public static fromComputeEnvironmentArn(scope: Construct, id: string, computeEnvironmentArn: string): IComputeEnvironment {
        const stack = Stack.of(scope);
        const computeEnvironmentName = stack.parseArn(computeEnvironmentArn).resource;

        class Import extends Resource implements IComputeEnvironment {
            public readonly computeEnvironmentArn = computeEnvironmentArn;
            public readonly computeEnvironmentName = computeEnvironmentName;
        }

        return new Import(scope, id);
    }

    /**
     * The ARN of this compute environment
     *
     * @attribute
     */
    public readonly computeEnvironmentArn: string;

    /**
     * The name of this compute environment
     *
     * @attribute
     */
    public readonly computeEnvironmentName: string;

    constructor(scope: Construct, id: string, props: ComputeEnvironmentProps = {}) {
        super(scope, id, {
            physicalName: props.computeEnvironmentName,
        });

        this.validateProps(props);

        let computeResources: CfnComputeEnvironment.ComputeResourcesProperty | undefined;

        // Only allow compute resources to be set when using MANAGED type
        if (props.computeResources && props.type === ComputeEnvironmentType.UNMANAGED) {
            computeResources = {
                allocationStrategy: props.allocationStrategy || AllocationStrategy.BEST_FIT,
                bidPercentage: props.computeResources.bidPercentage,
                desiredvCpus: props.computeResources.desiredvCpus,
                ec2KeyPair: props.computeResources.ec2KeyPair,
                imageId: props.computeResources.image ? props.computeResources.image.getImage(this).imageId : undefined,
                instanceRole: props.computeResources.instanceRole ?
                    props.computeResources.instanceRole.roleArn :
                    new iam.Role(this, 'Resource-Role', {
                        assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
                    }).roleArn,
                instanceTypes: this.buildInstanceTypes(props.computeResources.instanceTypes),
                launchTemplate: props.computeResources.launchTemplate,
                maxvCpus: props.computeResources.maxvCpus || 256,
                minvCpus: props.computeResources.minvCpus || 0,
                placementGroup: props.computeResources.placementGroup ? props.computeResources.placementGroup.ref : undefined,
                securityGroupIds: this.buildSecurityGroupIds(props.computeResources.securityGroupIds),
                spotIamFleetRole: props.computeResources.spotIamFleetRole ? props.computeResources.spotIamFleetRole.roleArn : undefined,
                subnets: props.computeResources.vpc.selectSubnets(props.computeResources.vpcSubnets).subnetIds,
                tags: props.computeResources.computeResourcesTags ? props.computeResources.computeResourcesTags : undefined,
                type: props.computeResources.type || ComputeResourceType.EC2,
            };
        }

        const computeEnvironment = new CfnComputeEnvironment(this, 'Resource', {
            computeEnvironmentName: this.physicalName,
            computeResources,
            serviceRole: new iam.CfnServiceLinkedRole(this, 'Resource-Service-Linked-Role', {
                awsServiceName: 'batch.amazonaws.com',
                customSuffix: `-${id}`,
            }).ref,
            state: props ? props.state : 'ENABLED',
            type: props ? (props.type ? props.type : ComputeEnvironmentType.MANAGED) : ComputeEnvironmentType.MANAGED,
        });

        this.computeEnvironmentArn = computeEnvironment.ref;
        this.computeEnvironmentName = this.getResourceNameAttribute(props ? props.computeEnvironmentName || this.physicalName : this.physicalName);
    }

    /**
     * Validates the properties provided for a new batch compute environment
     */
    public validateProps(props?: ComputeEnvironmentProps) {
        if (props === undefined) {
            return;
        }

        // Setting a bid percentage is only allowed on SPOT resources
        if (props.computeResources && props.computeResources.type &&
            props.computeResources.type === ComputeResourceType.EC2 && props.computeResources.bidPercentage !== undefined) {
            throw new Error('Setting the bid percentage is only allowed for SPOT type resources on a batch compute environment');
        }

        if (props.computeResources && props.computeResources.type && props.allocationStrategy &&
            props.computeResources.type === ComputeResourceType.EC2 && props.allocationStrategy === AllocationStrategy.SPOT_CAPACITY_OPTIMIZED) {
                throw new Error('The SPOT_CAPACITY_OPTIMIZED allocation strategy is only allowed if the environment is a SPOT type compute environment');
        }

        // Bid percentage must be from 0 - 100
        if (props.computeResources && props.computeResources.bidPercentage !== undefined &&
            (props.computeResources.bidPercentage < 0 || props.computeResources.bidPercentage > 100)) {
            throw new Error('Bid percentage can only be a value between 0 and 100');
        }

        if (props.computeResources && props.computeResources.minvCpus &&
            props.computeResources.minvCpus < 0) {
            throw new Error('Minimum vCpus for a batch compute environment cannot be less than 0');
        }

        if (props.computeResources && props.computeResources.minvCpus && props.computeResources.maxvCpus &&
            props.computeResources.minvCpus > props.computeResources.maxvCpus) {
            throw new Error('Minimum vCpus cannot be greater than the maximum vCpus');
        }
    }

    private buildInstanceTypes(instanceTypes?: ec2.InstanceType[]): string[] {
        if (instanceTypes === undefined) {
            return [
                'optimal',
            ];
        }

        return instanceTypes.reduce((types: string[], type: ec2.InstanceType): string[] => {
            return [...types, type.toString()];
        }, []);
    }

    private buildSecurityGroupIds(securityGroupIds?: ec2.ISecurityGroup[]): string[] | undefined {
        if (securityGroupIds === undefined) {
            return undefined;
        }

        return securityGroupIds.reduce((ids: string[], group: ec2.ISecurityGroup): string[] => {
            return [...ids, group.securityGroupId];
        }, []);
    }
}
