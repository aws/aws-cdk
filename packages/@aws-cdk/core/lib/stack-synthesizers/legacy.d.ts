import { StackSynthesizer } from './stack-synthesizer';
import { ISynthesisSession, IReusableStackSynthesizer, IBoundStackSynthesizer } from './types';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { Stack } from '../stack';
/**
 * Use the CDK classic way of referencing assets
 *
 * This synthesizer will generate CloudFormation parameters for every referenced
 * asset, and use the CLI's current credentials to deploy the stack.
 *
 * - It does not support cross-account deployment (the CLI must have credentials
 *   to the account you are trying to deploy to).
 * - It cannot be used with **CDK Pipelines**. To deploy using CDK Pipelines,
 *   you must use the `DefaultStackSynthesizer`.
 * - Each asset will take up a CloudFormation Parameter in your template. Keep in
 *   mind that there is a maximum of 200 parameters in a CloudFormation template.
 *   To use deterministic asset locations instead, use `CliCredentialsStackSynthesizer`.
 *
 * Be aware that your CLI credentials must be valid for the duration of the
 * entire deployment. If you are using session credentials, make sure the
 * session lifetime is long enough.
 *
 * This is the only StackSynthesizer that supports customizing asset behavior
 * by overriding `Stack.addFileAsset()` and `Stack.addDockerImageAsset()`.
 */
export declare class LegacyStackSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer, IBoundStackSynthesizer {
    private cycle;
    /**
     * Includes all parameters synthesized for assets (lazy).
     */
    private _assetParameters?;
    /**
     * The image ID of all the docker image assets that were already added to this
     * stack (to avoid duplication).
     */
    private readonly addedImageAssets;
    addFileAsset(asset: FileAssetSource): FileAssetLocation;
    addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation;
    /**
     * Synthesize the associated stack to the session
     */
    synthesize(session: ISynthesisSession): void;
    /**
     * Produce a bound Stack Synthesizer for the given stack.
     *
     * This method may be called more than once on the same object.
     */
    reusableBind(stack: Stack): IBoundStackSynthesizer;
    private doAddDockerImageAsset;
    private doAddFileAsset;
    private get assetParameters();
}
