import { IAsset } from '@aws-cdk/assets';
import * as ecr from '@aws-cdk/aws-ecr';
import { Construct } from 'constructs';
/**
 * Options for TarballImageAsset
 */
export interface TarballImageAssetProps {
    /**
     * Absolute path to the tarball.
     *
     * It is recommended to to use the script running directory (e.g. `__dirname`
     * in Node.js projects or dirname of `__file__` in Python) if your tarball
     * is located as a resource inside your project.
     */
    readonly tarballFile: string;
}
/**
 * An asset that represents a Docker image.
 *
 * The image will loaded from an existing tarball and uploaded to an ECR repository.
 */
export declare class TarballImageAsset extends Construct implements IAsset {
    /**
     * The full URI of the image (including a tag). Use this reference to pull
     * the asset.
     */
    imageUri: string;
    /**
     * Repository where the image is stored
     */
    repository: ecr.IRepository;
    /**
     * A hash of the source of this asset, which is available at construction time. As this is a plain
     * string, it can be used in construct IDs in order to enforce creation of a new resource when
     * the content hash has changed.
     * @deprecated use assetHash
     */
    readonly sourceHash: string;
    /**
     * A hash of this asset, which is available at construction time. As this is a plain string, it
     * can be used in construct IDs in order to enforce creation of a new resource when the content
     * hash has changed.
     */
    readonly assetHash: string;
    /**
     * The tag of this asset when it is uploaded to ECR. The tag may differ from the assetHash if a stack synthesizer adds a dockerTagPrefix.
     */
    readonly imageTag: string;
    constructor(scope: Construct, id: string, props: TarballImageAssetProps);
}
