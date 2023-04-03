import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { ISynthesisSession } from './types';
import { FileAssetSource, DockerImageAssetSource } from '../assets';
import { Stack } from '../stack';
/**
 * Build an asset manifest from assets added to a stack
 *
 * This class does not need to be used by app builders; it is only necessary for building Stack Synthesizers.
 */
export declare class AssetManifestBuilder {
    private readonly files;
    private readonly dockerImages;
    /**
     * Add a file asset to the manifest with default settings
     *
     * Derive the region from the stack, use the asset hash as the key, copy the
     * file extension over, and set the prefix.
     */
    defaultAddFileAsset(stack: Stack, asset: FileAssetSource, target: AssetManifestFileDestination): cxschema.FileDestination;
    /**
     * Add a docker image asset to the manifest with default settings
     *
     * Derive the region from the stack, use the asset hash as the key, and set the prefix.
     */
    defaultAddDockerImageAsset(stack: Stack, asset: DockerImageAssetSource, target: AssetManifestDockerImageDestination): cxschema.DockerImageDestination;
    /**
     * Add a file asset source and destination to the manifest
     *
     * sourceHash should be unique for every source.
     */
    addFileAsset(stack: Stack, sourceHash: string, source: cxschema.FileSource, dest: cxschema.FileDestination): cxschema.FileDestination;
    /**
     * Add a docker asset source and destination to the manifest
     *
     * sourceHash should be unique for every source.
     */
    addDockerImageAsset(stack: Stack, sourceHash: string, source: cxschema.DockerImageSource, dest: cxschema.DockerImageDestination): cxschema.DockerImageDestination;
    /**
     * Whether there are any assets registered in the manifest
     */
    get hasAssets(): boolean;
    /**
     * Write the manifest to disk, and add it to the synthesis session
     *
     * Return the artifact id, which should be added to the `additionalDependencies`
     * field of the stack artifact.
     */
    emitManifest(stack: Stack, session: ISynthesisSession, options?: cxschema.AssetManifestOptions): string;
    private manifestEnvName;
}
/**
 * The destination for a file asset, when it is given to the AssetManifestBuilder
 */
export interface AssetManifestFileDestination {
    /**
     * Bucket name where the file asset should be written
     */
    readonly bucketName: string;
    /**
     * Prefix to prepend to the asset hash
     *
     * @default ''
     */
    readonly bucketPrefix?: string;
    /**
     * Role to use for uploading
     *
     * @default - current role
     */
    readonly role?: RoleOptions;
}
/**
 * The destination for a docker image asset, when it is given to the AssetManifestBuilder
 */
export interface AssetManifestDockerImageDestination {
    /**
     * Repository name where the docker image asset should be written
     */
    readonly repositoryName: string;
    /**
     * Prefix to add to the asset hash to make the Docker image tag
     *
     * @default ''
     */
    readonly dockerTagPrefix?: string;
    /**
     * Role to use to perform the upload
     *
     * @default - No role
     */
    readonly role?: RoleOptions;
}
/**
 * Options for specifying a role
 */
export interface RoleOptions {
    /**
     * ARN of the role to assume
     */
    readonly assumeRoleArn: string;
    /**
     * External ID to use when assuming the role
     *
     * @default - No external ID
     */
    readonly assumeRoleExternalId?: string;
}
