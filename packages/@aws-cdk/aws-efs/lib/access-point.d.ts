import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IFileSystem } from './efs-file-system';
/**
 * Represents an EFS AccessPoint
 */
export interface IAccessPoint extends IResource {
    /**
     * The ID of the AccessPoint
     *
     * @attribute
     */
    readonly accessPointId: string;
    /**
     * The ARN of the AccessPoint
     *
     * @attribute
     */
    readonly accessPointArn: string;
    /**
     * The EFS file system
     */
    readonly fileSystem: IFileSystem;
}
/**
 * Permissions as POSIX ACL
*/
export interface Acl {
    /**
     * Specifies the POSIX user ID to apply to the RootDirectory. Accepts values from 0 to 2^32 (4294967295).
     */
    readonly ownerUid: string;
    /**
     * Specifies the POSIX group ID to apply to the RootDirectory. Accepts values from 0 to 2^32 (4294967295).
     */
    readonly ownerGid: string;
    /**
     * Specifies the POSIX permissions to apply to the RootDirectory, in the format of an octal number representing
     * the file's mode bits.
     */
    readonly permissions: string;
}
/**
 * Represents the PosixUser
 */
export interface PosixUser {
    /**
     * The POSIX user ID used for all file system operations using this access point.
     */
    readonly uid: string;
    /**
     * The POSIX group ID used for all file system operations using this access point.
     */
    readonly gid: string;
    /**
     * Secondary POSIX group IDs used for all file system operations using this access point.
     *
     * @default - None
     */
    readonly secondaryGids?: string[];
}
/**
 * Options to create an AccessPoint
 */
export interface AccessPointOptions {
    /**
     * Specifies the POSIX IDs and permissions to apply when creating the access point's root directory. If the
     * root directory specified by `path` does not exist, EFS creates the root directory and applies the
     * permissions specified here. If the specified `path` does not exist, you must specify `createAcl`.
     *
     * @default - None. The directory specified by `path` must exist.
     */
    readonly createAcl?: Acl;
    /**
     * Specifies the path on the EFS file system to expose as the root directory to NFS clients using the access point
     * to access the EFS file system
     *
     * @default '/'
     */
    readonly path?: string;
    /**
     * The full POSIX identity, including the user ID, group ID, and any secondary group IDs, on the access point
     * that is used for all file system operations performed by NFS clients using the access point.
     *
     * Specify this to enforce a user identity using an access point.
     *
     * @see - [Enforcing a User Identity Using an Access Point](https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html)
     *
     * @default - user identity not enforced
     */
    readonly posixUser?: PosixUser;
}
/**
 * Properties for the AccessPoint
 */
export interface AccessPointProps extends AccessPointOptions {
    /**
     * The efs filesystem
     */
    readonly fileSystem: IFileSystem;
}
/**
 * Attributes that can be specified when importing an AccessPoint
 */
export interface AccessPointAttributes {
    /**
     * The ID of the AccessPoint
     * One of this, or `accessPointArn` is required
     *
     * @default - determined based on accessPointArn
     */
    readonly accessPointId?: string;
    /**
     * The ARN of the AccessPoint
     * One of this, or `accessPointId` is required
     *
     * @default - determined based on accessPointId
     */
    readonly accessPointArn?: string;
    /**
     * The EFS file system
     *
     * @default - no EFS file system
     */
    readonly fileSystem?: IFileSystem;
}
declare abstract class AccessPointBase extends Resource implements IAccessPoint {
    /**
     * The ARN of the Access Point
     * @attribute
     */
    abstract readonly accessPointArn: string;
    /**
     * The ID of the Access Point
     * @attribute
     */
    abstract readonly accessPointId: string;
    /**
     * The file system of the access point
     */
    abstract readonly fileSystem: IFileSystem;
}
/**
 * Represents the AccessPoint
 */
export declare class AccessPoint extends AccessPointBase {
    /**
     * Import an existing Access Point by attributes
     */
    static fromAccessPointAttributes(scope: Construct, id: string, attrs: AccessPointAttributes): IAccessPoint;
    /**
     * Import an existing Access Point by id
     */
    static fromAccessPointId(scope: Construct, id: string, accessPointId: string): IAccessPoint;
    /**
     * The ARN of the Access Point
     * @attribute
     */
    readonly accessPointArn: string;
    /**
     * The ID of the Access Point
     * @attribute
     */
    readonly accessPointId: string;
    /**
     * The file system of the access point
     */
    readonly fileSystem: IFileSystem;
    constructor(scope: Construct, id: string, props: AccessPointProps);
}
export {};
