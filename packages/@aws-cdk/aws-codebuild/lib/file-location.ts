import { CfnProject } from './codebuild.generated';
import { IProject } from './project';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * The type returned from {@link IFileSystemLocation#bind}.
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
 * Implemented by {@link EfsFileSystemLocation}.
 */
export interface IFileSystemLocation {
  /**
   * Called by the project when a file system is added so it can perform
   * binding operations on this file system location.
   */
  bind(scope: CoreConstruct, project: IProject): FileSystemConfig;
}

/**
 * FileSystemLocation provider definition for a CodeBuild Project.
 */
export class FileSystemLocation {
  /**
   * EFS file system provider.
   * @param props the EFS File System location property.
   */
  public static efs(props: EfsFileSystemLocationProps): IFileSystemLocation {
    return new EfsFileSystemLocation(props);
  }
}

/**
 * EfsFileSystemLocation definition for a CodeBuild project.
 */
class EfsFileSystemLocation implements IFileSystemLocation {
  constructor(private readonly props: EfsFileSystemLocationProps) {}

  public bind(_scope: CoreConstruct, _project: IProject): FileSystemConfig {
    return {
      location: {
        identifier: this.props.identifier,
        location: this.props.location,
        mountOptions: this.props.mountOptions,
        mountPoint: this.props.mountPoint,
        type: 'EFS',
      },
    };
  }
}

/**
 * Construction properties for {@link EfsFileSystemLocation}.
 */
export interface EfsFileSystemLocationProps {
  /**
   * The name used to access a file system created by Amazon EFS.
   */
  readonly identifier: string;

  /**
   * A string that specifies the location of the file system, like Amazon EFS.
   * @example 'fs-abcd1234.efs.us-west-2.amazonaws.com:/my-efs-mount-directory'.
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