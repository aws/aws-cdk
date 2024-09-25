import * as assets from './assets';
import * as assembly from './cloud-assembly';
import * as integ from './integ-tests';
export declare const VERSION_MISMATCH: string;
/**
 * Options for the loadManifest operation
 */
export interface LoadManifestOptions {
    /**
     * Skip the version check
     *
     * This means you may read a newer cloud assembly than the CX API is designed
     * to support, and your application may not be aware of all features that in use
     * in the Cloud Assembly.
     *
     * @default false
     */
    readonly skipVersionCheck?: boolean;
    /**
     * Skip enum checks
     *
     * This means you may read enum values you don't know about yet. Make sure to always
     * check the values of enums you encounter in the manifest.
     *
     * @default false
     */
    readonly skipEnumCheck?: boolean;
    /**
     * Topologically sort all artifacts
     *
     * This parameter is only respected by the constructor of `CloudAssembly`. The
     * property lives here for backwards compatibility reasons.
     *
     * @default true
     */
    readonly topoSort?: boolean;
}
/**
 * Protocol utility class.
 */
export declare class Manifest {
    /**
     * Validates and saves the cloud assembly manifest to file.
     *
     * @param manifest - manifest.
     * @param filePath - output file path.
     */
    static saveAssemblyManifest(manifest: assembly.AssemblyManifest, filePath: string): void;
    /**
     * Load and validates the cloud assembly manifest from file.
     *
     * @param filePath - path to the manifest file.
     */
    static loadAssemblyManifest(filePath: string, options?: LoadManifestOptions): assembly.AssemblyManifest;
    /**
     * Validates and saves the asset manifest to file.
     *
     * @param manifest - manifest.
     * @param filePath - output file path.
     */
    static saveAssetManifest(manifest: assets.AssetManifest, filePath: string): void;
    /**
     * Load and validates the asset manifest from file.
     *
     * @param filePath - path to the manifest file.
     */
    static loadAssetManifest(filePath: string): assets.AssetManifest;
    /**
     * Validates and saves the integ manifest to file.
     *
     * @param manifest - manifest.
     * @param filePath - output file path.
     */
    static saveIntegManifest(manifest: integ.IntegManifest, filePath: string): void;
    /**
     * Load and validates the integ manifest from file.
     *
     * @param filePath - path to the manifest file.
     */
    static loadIntegManifest(filePath: string): integ.IntegManifest;
    /**
     * Fetch the current schema version number.
     */
    static version(): string;
    /**
     * Deprecated
     * @deprecated use `saveAssemblyManifest()`
     */
    static save(manifest: assembly.AssemblyManifest, filePath: string): void;
    /**
     * Deprecated
     * @deprecated use `loadAssemblyManifest()`
     */
    static load(filePath: string): assembly.AssemblyManifest;
    private static validate;
    private static saveManifest;
    private static loadManifest;
    /**
     * This requires some explaining...
     *
     * We previously used `{ Key, Value }` for the object that represents a stack tag. (Notice the casing)
     * @link https://github.com/aws/aws-cdk/blob/v1.27.0/packages/aws-cdk/lib/api/cxapp/stacks.ts#L427.
     *
     * When that object moved to this package, it had to be JSII compliant, which meant the property
     * names must be `camelCased`, and not `PascalCased`. This meant it no longer matches the structure in the `manifest.json` file.
     * In order to support current manifest files, we have to translate the `PascalCased` representation to the new `camelCased` one.
     *
     * Note that the serialization itself still writes `PascalCased` because it relates to how CloudFormation expects it.
     *
     * Ideally, we would start writing the `camelCased` and translate to how CloudFormation expects it when needed. But this requires nasty
     * backwards-compatibility code and it just doesn't seem to be worth the effort.
     */
    private static patchStackTagsOnRead;
    /**
     * See explanation on `patchStackTagsOnRead`
     *
     * Translate stack tags metadata if it has the "right" casing.
     */
    private static patchStackTagsOnWrite;
    /**
     * Recursively replace stack tags in the stack metadata
     */
    private static replaceStackTags;
    private constructor();
}
