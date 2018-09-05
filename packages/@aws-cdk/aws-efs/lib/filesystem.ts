import {Construct, Output} from '@aws-cdk/cdk';
import {cloudformation, FileSystemId} from './efs.generated';

/**
 * Properties of a reference to an Elastic File System.
 *
 * @see FileSystemRef#import
 * @see FileSystemRef#export
 */
export interface FileSystemRefProps {
    /**
     * The physical, human-readable Id of the EFS we're referencing.
     * The EFS must be in the same account and region as the root Stack.
     */
    fileSystemId: FileSystemId;
}

/* tslint:disable:max-line-length */
export interface FileSystemProps {
    /**
     * The throughput, measured in MiB/s, that you want to provision for a file system that
     * you're creating. The limit on throughput is 1024 MiB/s. You can get these limits
     * increased by contacting AWS Support. Must be greater than or equal to 1.0MiB/s
     *
     * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-elasticfilesystem-filesystem-provisionedthroughputinmibps
     * @default 100
     */
    throughputMiB?: number;

    /**
     * The throughput mode for the file system to be created. There are two throughput modes to
     * choose from for your file system: bursting and provisioned. You can decrease your file
     * system's throughput in Provisioned Throughput mode or change between the throughput modes
     * as long as it’s been more than 24 hours since the last decrease or throughput mode change.
     *
     * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-elasticfilesystem-filesystem-throughputmode
     * @default ThroughputMode.Bursting
     */
    throughputMode?: ThroughputMode

    /**
     * The PerformanceMode of the file system. We recommend generalPurpose performance mode for
     * most file systems. File systems using the maxIO performance mode can scale to higher levels
     * of aggregate throughput and operations per second with a tradeoff of slightly higher
     * latencies for most file operations. This can't be changed after the file system has
     * been created.
     *
     * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-performancemode
     * @default PerformanceMode.GeneralPurpose
     */
    performanceMode?: PerformanceMode
}
/* tslint:enable:max-line-length */

/**
 * Provides a Elastic File System (EFS).
 */
export class FileSystem extends Construct {

    public readonly fileSystemId: FileSystemId;

    private readonly fileSystem: cloudformation.FileSystemResource;

    constructor(parent: Construct, id: string, props: FileSystemProps = {}) {
        super(parent, id);

        const throughput = props.throughputMiB === undefined ? 100 : props.throughputMiB;
        if (throughput < 1.0) {
            throw new Error(`Provisioned throughput can\'t be set to a value less than 1.0 MiB/s, provided value: ${props.throughputMiB} `);
        }
        const throughputMode = props.throughputMode || ThroughputMode.Bursting;
        const performanceMode = props.performanceMode || PerformanceMode.GeneralPurpose;

        this.fileSystem = new cloudformation.FileSystemResource(this, 'Resource', {
            encrypted: true,
            performanceMode,
            provisionedThroughputInMibps: throughput,
            throughputMode
        });

        this.fileSystemId = this.fileSystem.ref;
    }
}

/**
 * The throughput mode for the file system to be created. There are two throughput modes to choose
 * from for your file system: bursting and provisioned. You can decrease your file system's
 * throughput in Provisioned Throughput mode or change between the throughput modes as long as it’s
 * been more than 24 hours since the last decrease or throughput mode change.
 */
export enum ThroughputMode {
    Bursting = 'bursting',
    Provisioned = 'provisioned',
}

/**
 * The PerformanceMode of the file system. We recommend generalPurpose performance mode for most
 * file systems. File systems using the maxIO performance mode can scale to higher levels of
 * aggregate throughput and operations per second with a tradeoff of slightly higher latencies for
 * most file operations. This can't be changed after the file system has been created.
 */
export enum PerformanceMode {
    GeneralPurpose = 'generalPurpose',
    MaxIO = 'maxIO',
}

export abstract class FileSystemRef extends Construct {
    public static import(parent: Construct, id: string, props: FileSystemRefProps) {
      return new ImportedFileSystem(parent, id, props);
    }

    public abstract readonly fileSystemId: FileSystemId;
    constructor(parent: Construct, id: string) {
      super(parent, id);
    }

    public export(): FileSystemRefProps {
      return {
        fileSystemId: new FileSystemId(new Output(this, 'FileSystemId', { value: this.fileSystemId }).makeImportValue())
      };
    }
}

export class ImportedFileSystem extends FileSystemRef {
    public readonly fileSystemId: FileSystemId;
    constructor(parent: Construct, id: string, props: FileSystemRefProps) {
      super(parent, id);
      this.fileSystemId = props.fileSystemId;
    }
  }