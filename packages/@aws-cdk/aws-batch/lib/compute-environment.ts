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
export interface ComputeResourceProps {
    /**
     * The IAM role applied to EC2 resources in the compute environment.
     */
    readonly instanceRole: iam.IRole;

    /**
     * The types of EC2 instances that may be launched in the compute environment. You can specify instance
     * families to launch any instance type within those families (for example, c4 or p3), or you can specify
     * specific sizes within a family (such as c4.8xlarge). You can also choose optimal to pick instance types
     * (from the C, M, and R instance families) on the fly that match the demand of your job queues.
     */
    readonly instanceTypes: ec2.InstanceType[];

    /**
     * The maximum number of EC2 vCPUs that an environment can reach.
     */
    readonly maxvCpus: number;

    /**
     * The minimum number of EC2 vCPUs that an environment should maintain (even if the compute environment state is DISABLED).
     */
    readonly minvCpus: number;

    /**
     * The EC2 security group(s) associated with instances launched in the compute environment.
     */
    readonly securityGroupIds: ec2.ISecurityGroup[];

    /**
     * The VPC subnets into which the compute resources are launched.
     */
    readonly subnets: ec2.ISubnet[];

    /**
     * The type of compute environment: EC2 or SPOT.
     */
    readonly type: ComputeResourceType;

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
     * @default - No key will be used
     */
    readonly ec2KeyPair?: string;

    /**
     * The Amazon Machine Image (AMI) ID used for instances launched in the compute environment.
     *
     * @default - no image will be used
     */
    readonly imagedId?: ec2.IMachineImage;

    /**
     * The launch template to use for your compute resources. Any other compute resource parameters
     * that you specify in a CreateComputeEnvironment API operation override the same parameters in
     * the launch template. You must specify either the launch template ID or launch template name in
     * the request, but not both. For more information, see Launch Template Support in the AWS Batch User Guide.
     *
     * @default - no launch template will be used
     */
    readonly launchTemplate?: ec2.CfnLaunchTemplate;

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
    readonly tags?: Tag;
}

/**
 * Properties for creating a new Compute Environment
 */
export interface ComputeEnvironmentProps {
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
     * If specified, and this is an unmanaged compute environment, the property will be ignored.
     *
     * @default "No resources are provisioned"
     */
    readonly computeResources?: ComputeResourceProps;

    /**
     * The state of the compute environment to determine if jobs should be accepted from a queue.
     *
     * @default true
     */
    readonly state?: boolean;

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

        // Should we...?
        this.validateProps(props);

        let computeResources: CfnComputeEnvironment.ComputeResourcesProperty | undefined;

        if (props.computeResources) {
            computeResources = {
                bidPercentage: props.computeResources.bidPercentage,
                desiredvCpus: props.computeResources.desiredvCpus,
                ec2KeyPair: props.computeResources.ec2KeyPair,
                imageId: props.computeResources.imagedId ? props.computeResources.imagedId.getImage(this).imageId : undefined,
                instanceRole: props.computeResources.instanceRole.roleArn,
                instanceTypes: props.computeResources.instanceTypes.reduce((types: string[], type: ec2.InstanceType): string[] => {
                    return [...types, type.toString()];
                }, []),
                launchTemplate: props.computeResources.launchTemplate,
                maxvCpus: props.computeResources.maxvCpus,
                minvCpus: props.computeResources.minvCpus,
                placementGroup: props.computeResources.placementGroup ? props.computeResources.placementGroup.ref : undefined,
                securityGroupIds: props.computeResources.securityGroupIds.reduce((ids: string[], group: ec2.ISecurityGroup): string[] => {
                    return [...ids, group.securityGroupId];
                }, []),
                spotIamFleetRole: props.computeResources.spotIamFleetRole ? props.computeResources.spotIamFleetRole.roleArn : undefined,
                subnets: props.computeResources.subnets.reduce((ids: string[], subnet: ec2.ISubnet): string[] => {
                    return [...ids, subnet.subnetId];
                }, []),
                tags: props.computeResources.tags ? props.computeResources.tags.value : undefined,
                type: props.computeResources.type as string,
            };
        }

        const computeEnvironment = new CfnComputeEnvironment(this, 'Resource', {
            computeEnvironmentName: this.physicalName,
            computeResources,
            serviceRole: new iam.CfnServiceLinkedRole(this, 'Resource', {
                awsServiceName: 'batch.amazonaws.com',
                customSuffix: `-${id}`,
            }).ref,
            state: props.state ? 'true' : 'false',
            type: props.type as string,
        });

        this.computeEnvironmentArn = computeEnvironment.ref;
        this.computeEnvironmentName = this.getResourceNameAttribute(props.computeEnvironmentName || this.physicalName);
    }

    /**
     * Validates the properties provided for a new batch compute environment
     */
    public validateProps(props: ComputeEnvironmentProps) {
        if (props.type === ComputeEnvironmentType.MANAGED && props.computeResources === undefined) {
            throw new Error('compute resources are required to be defined when environment type is set to MANAGED');
        }

        const allowedChars = /[A-Z0-9\-\_]/gi;

        if (props.computeEnvironmentName &&
            (props.computeEnvironmentName.length > 128 || props.computeEnvironmentName.match(allowedChars) !== null)
            ) {
            throw new Error('up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed');
        }
    }
}
