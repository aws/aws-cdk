import { Construct } from '@aws-cdk/cdk';
import {cloudformation, FileSystemId} from './efs.generated';

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
    throughput?: number;

    /**
     * The throughput mode for the file system to be created. There are two throughput modes to
     * choose from for your file system: bursting and provisioned. You can decrease your file
     * system's throughput in Provisioned Throughput mode or change between the throughput modes
     * as long as it’s been more than 24 hours since the last decrease or throughput mode change.
     *
     * https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-elasticfilesystem-filesystem-throughputmode
     * @default ThroughputMode.Provisioned
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

    constructor(parent: Construct, name: string, props: FileSystemProps = {}) {
        super(parent, name);

        const throughput = props.throughput || 100;
        if (throughput < 1.0) {
            throw new Error(`Provisioned throughput can\'t be set to a value less than 1.0 MiB/s, provided value: ${props.throughput} `);
        }
        const throughputMode = props.throughputMode || ThroughputMode.Provisioned;
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

export enum ThroughputMode {
    Bursting = 'bursting',
    Provisioned = 'provisioned',
}

export enum PerformanceMode {
    GeneralPurpose = 'generalPurpose',
    MaxIO = 'maxIO',
}