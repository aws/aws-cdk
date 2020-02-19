import * as ec2 from '@aws-cdk/aws-ec2';
import {IResource} from "@aws-cdk/core";

/**
 * Interface to implement AWS File Systems.
 */
export interface IFileSystem extends IResource, ec2.IConnectable {
    /**
     * The ID of the file system, assigned by Amazon EFS.
     *
     * @attribute
     */
    readonly fileSystemID: string;
}

/**
 * Properties of FileSystem
 */
export interface FileSystemProps {
    /**
     * VPC to launch the file system in.
     */
    readonly vpc: ec2.IVpc;

    /**
     * Security Group to assign to this file system.
     *
     * @default - creates new security group which allow all out bound trafficcloudformation
     */
    readonly securityGroup?: ec2.ISecurityGroup;

    /**
     * Where to place the mount target within the VPC.
     *
     * @default - Private subnets
     */
    readonly vpcSubnets?: ec2.SubnetSelection;
}