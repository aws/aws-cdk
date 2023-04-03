import { Construct } from 'constructs';
import { CfnProject } from './codebuild.generated';
import { IProject } from './project';
/**
 * The type returned from `IFileSystemLocation#bind`.
 */
export interface FileSystemConfig {
    /**
     * File system location wrapper property.
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codebuild-project-projectfilesystemlocation.html
     */
    readonly location: CfnProject.ProjectFileSystemLocationProperty;
}
/**
 * The interface of a CodeBuild FileSystemLocation.
 * Implemented by `EfsFileSystemLocation`.
 */
export interface IFileSystemLocation {
    /**
     * Called by the project when a file system is added so it can perform
     * binding operations on this file system location.
     */
    bind(scope: Construct, project: IProject): FileSystemConfig;
}
/**
 * FileSystemLocation provider definition for a CodeBuild Project.
 */
export declare class FileSystemLocation {
    /**
     * EFS file system provider.
     * @param props the EFS File System location property.
     */
    static efs(props: EfsFileSystemLocationProps): IFileSystemLocation;
}
/**
 * Construction properties for `EfsFileSystemLocation`.
 */
export interface EfsFileSystemLocationProps {
    /**
     * The name used to access a file system created by Amazon EFS.
     */
    readonly identifier: string;
    /**
     * A string that specifies the location of the file system, like Amazon EFS.
     *
     * This value looks like `fs-abcd1234.efs.us-west-2.amazonaws.com:/my-efs-mount-directory`.
     */
    readonly location: string;
    /**
     * The mount options for a file system such as Amazon EFS.
     * @default 'nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2'.
     */
    readonly mountOptions?: string;
    /**
     * The location in the container where you mount the file system.
     */
    readonly mountPoint: string;
}
