import { DockerImageManifestEntry } from '../../asset-manifest';
import { IAssetHandler, IHandlerHost, IHandlerOptions } from '../asset-handler';
export declare class ContainerImageAssetHandler implements IAssetHandler {
    private readonly workDir;
    private readonly asset;
    private readonly host;
    private readonly options;
    private init?;
    constructor(workDir: string, asset: DockerImageManifestEntry, host: IHandlerHost, options: IHandlerOptions);
    build(): Promise<void>;
    isPublished(): Promise<boolean>;
    publish(): Promise<void>;
    private initOnce;
    /**
     * Check whether the image already exists in the ECR repo
     *
     * Use the fields from the destination to do the actual check. The imageUri
     * should correspond to that, but is only used to print Docker image location
     * for user benefit (the format is slightly different).
     */
    private destinationAlreadyExists;
}
