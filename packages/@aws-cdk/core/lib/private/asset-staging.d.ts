/// <reference types="node" />
import { SpawnSyncOptions } from 'child_process';
import { BundlingOptions } from '../bundling';
/**
 * Options for Docker based bundling of assets
 */
interface AssetBundlingOptions extends BundlingOptions {
    /**
     * Path where the source files are located
     */
    readonly sourcePath: string;
    /**
     * Path where the output files should be stored
     */
    readonly bundleDir: string;
}
declare abstract class AssetBundlingBase {
    protected options: AssetBundlingOptions;
    constructor(options: AssetBundlingOptions);
    /**
     * Determines a useful default user if not given otherwise
     */
    protected determineUser(): string;
}
/**
 * Bundles files with bind mount as copy method
 */
export declare class AssetBundlingBindMount extends AssetBundlingBase {
    /**
     * Bundle files with bind mount as copy method
     */
    run(): void;
}
/**
 * Provides a helper container for copying bundling related files to specific input and output volumes
 */
export declare class AssetBundlingVolumeCopy extends AssetBundlingBase {
    /**
     * Name of the Docker volume that is used for the asset input
     */
    private inputVolumeName;
    /**
     * Name of the Docker volume that is used for the asset output
     */
    private outputVolumeName;
    /**
     * Name of the Docker helper container to copy files into the volume
     */
    copyContainerName: string;
    constructor(options: AssetBundlingOptions);
    /**
     * Creates volumes for asset input and output
     */
    private prepareVolumes;
    /**
     * Removes volumes for asset input and output
     */
    private cleanVolumes;
    /**
     * runs a helper container that holds volumes and does some preparation tasks
     * @param user The user that will later access these files and needs permissions to do so
     */
    private startHelperContainer;
    /**
     * removes the Docker helper container
     */
    private cleanHelperContainer;
    /**
     * copy files from the host where this is executed into the input volume
     * @param sourcePath - path to folder where files should be copied from - without trailing slash
     */
    private copyInputFrom;
    /**
     * copy files from the the output volume to the host where this is executed
     * @param outputPath - path to folder where files should be copied to - without trailing slash
     */
    private copyOutputTo;
    /**
     * Bundle files with VOLUME_COPY method
     */
    run(): void;
}
export declare function dockerExec(args: string[], options?: SpawnSyncOptions): import("child_process").SpawnSyncReturns<string | Buffer>;
export {};
