import { IPrincipal, IRole } from '@aws-cdk/aws-iam';
import { Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { InstanceType } from '.';
import { CloudFormationInit } from './cfn-init';
import { Connections } from './connections';
import { ApplyCloudFormationInitOptions, IInstance, Instance } from './instance';
import { IMachineImage } from './machine-image';
import { IPeer } from './peer';
import { ISecurityGroup } from './security-group';
import { BlockDevice } from './volume';
import { IVpc, SubnetSelection } from './vpc';
/**
 * Properties of the bastion host
 *
 *
 */
export interface BastionHostLinuxProps {
    /**
     * In which AZ to place the instance within the VPC
     *
     * @default - Random zone.
     */
    readonly availabilityZone?: string;
    /**
     * VPC to launch the instance in.
     */
    readonly vpc: IVpc;
    /**
     * The name of the instance
     *
     * @default 'BastionHost'
     */
    readonly instanceName?: string;
    /**
     * Select the subnets to run the bastion host in.
     * Set this to PUBLIC if you need to connect to this instance via the internet and cannot use SSM.
     * You have to allow port 22 manually by using the connections field
     *
     * @default - private subnets of the supplied VPC
     */
    readonly subnetSelection?: SubnetSelection;
    /**
     * Security Group to assign to this instance
     *
     * @default - create new security group with no inbound and all outbound traffic allowed
     */
    readonly securityGroup?: ISecurityGroup;
    /**
     * Type of instance to launch
     * @default 't3.nano'
     */
    readonly instanceType?: InstanceType;
    /**
     * The machine image to use, assumed to have SSM Agent preinstalled.
     *
     * @default - An Amazon Linux 2 image which is kept up-to-date automatically (the instance
     * may be replaced on every deployment) and already has SSM Agent installed.
     */
    readonly machineImage?: IMachineImage;
    /**
     * Specifies how block devices are exposed to the instance. You can specify virtual devices and EBS volumes.
     *
     * Each instance that is launched has an associated root device volume,
     * either an Amazon EBS volume or an instance store volume.
     * You can use block device mappings to specify additional EBS volumes or
     * instance store volumes to attach to an instance when it is launched.
     *
     * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html
     *
     * @default - Uses the block device mapping of the AMI
     */
    readonly blockDevices?: BlockDevice[];
    /**
     * Apply the given CloudFormation Init configuration to the instance at startup
     *
     * @default - no CloudFormation init
     */
    readonly init?: CloudFormationInit;
    /**
     * Use the given options for applying CloudFormation Init
     *
     * Describes the configsets to use and the timeout to wait
     *
     * @default - default options
     */
    readonly initOptions?: ApplyCloudFormationInitOptions;
    /**
     * Whether IMDSv2 should be required on this instance
     *
     * @default - false
     */
    readonly requireImdsv2?: boolean;
}
/**
 * This creates a linux bastion host you can use to connect to other instances or services in your VPC.
 * The recommended way to connect to the bastion host is by using AWS Systems Manager Session Manager.
 *
 * The operating system is Amazon Linux 2 with the latest SSM agent installed
 *
 * You can also configure this bastion host to allow connections via SSH
 *
 *
 * @resource AWS::EC2::Instance
 */
export declare class BastionHostLinux extends Resource implements IInstance {
    readonly stack: Stack;
    /**
     * Allows specify security group connections for the instance.
     */
    readonly connections: Connections;
    /**
     * The IAM role assumed by the instance.
     */
    readonly role: IRole;
    /**
     * The principal to grant permissions to
     */
    readonly grantPrincipal: IPrincipal;
    /**
     * The underlying instance resource
     */
    readonly instance: Instance;
    /**
     * @attribute
     */
    readonly instanceId: string;
    /**
     * @attribute
     */
    readonly instanceAvailabilityZone: string;
    /**
     * @attribute
     */
    readonly instancePrivateDnsName: string;
    /**
     * @attribute
     */
    readonly instancePrivateIp: string;
    /**
     * @attribute
     */
    readonly instancePublicDnsName: string;
    /**
     * @attribute
     */
    readonly instancePublicIp: string;
    constructor(scope: Construct, id: string, props: BastionHostLinuxProps);
    /**
     * Returns the AmazonLinuxCpuType corresponding to the given instance architecture
     * @param architecture the instance architecture value to convert
     */
    private toAmazonLinuxCpuType;
    /**
     * Allow SSH access from the given peer or peers
     *
     * Necessary if you want to connect to the instance using ssh. If not
     * called, you should use SSM Session Manager to connect to the instance.
     */
    allowSshAccessFrom(...peer: IPeer[]): void;
}
