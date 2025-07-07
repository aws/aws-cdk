import { ViolationsReport } from './violation';
/**
 * Bundling properties.
 */
export interface BundleProps {
    /**
     * Directory where the package to bundle is located at.
     */
    readonly packageDir: string;
    /**
     * List of entry-points to bundle.
     *
     * @default - the 'main' file as specified in package.json.
     */
    readonly entryPoints?: string[];
    /**
     * Path to attributions file that will be created / validated.
     * This path is relative to the package directory.
     *
     * @default 'THIRD_PARTY_LICENSES'
     */
    readonly attributionsFile?: string;
    /**
     * External packages that cannot be bundled.
     *
     * @default - no external references.
     */
    readonly externals?: Externals;
    /**
     * External resources that need to be embedded in the bundle.
     *
     * These will be copied over to the appropriate paths before packaging.
     */
    readonly resources?: {
        [src: string]: string;
    };
    /**
     * A list of licenses that are allowed for bundling.
     * If any dependency contains a license not in this list, bundling will fail.
     *
     * @default - Default list
     */
    readonly allowedLicenses?: string[];
    /**
     * Packages matching this regular expression will be excluded from attribution.
     */
    readonly dontAttribute?: string;
    /**
     * Basic sanity check to run against the created bundle.
     *
     * @default - no check.
     */
    readonly test?: string;
    /**
     * Include a sourcemap in the bundle.
     *
     * @default "inline"
     */
    readonly sourcemap?: 'linked' | 'inline' | 'external' | 'both';
    /**
     * Minifies the bundled code.
     *
     * @default false
     */
    readonly minify?: boolean;
    /**
     * Removes whitespace from the code.
     * This is enabled by default when `minify` is used.
     *
     * @default false
     */
    readonly minifyWhitespace?: boolean;
    /**
     * Renames local variables to be shorter.
     * This is enabled by default when `minify` is used.
     *
     * @default false
     */
    readonly minifyIdentifiers?: boolean;
    /**
     * Rewrites syntax to a more compact format.
     * This is enabled by default when `minify` is used.
     *
     * @default false
     */
    readonly minifySyntax?: boolean;
}
/**
 * Options for `Bundle.pack`.
 */
export interface BundlePackOptions {
    /**
     * The target directory to create the package in.
     *
     * @default - the package directory.
     */
    readonly target?: string;
}
export interface BundleValidateOptions {
    /**
     * Automatically fix any (fixable) violations.
     *
     * @default false
     */
    readonly fix?: boolean;
}
/**
 * Package on the local file system.
 */
export interface Package {
    /**
     * Path of the dependency on the local file system.
     */
    readonly path: string;
    /**
     * Dependency name.
     */
    readonly name: string;
    /**
     * Dependency version.
     */
    readonly version: string;
}
/**
 * External packages that cannot be bundled.
 */
export interface Externals {
    /**
     * External packages that should be listed in the `dependencies` section
     * of the manifest.
     */
    readonly dependencies?: readonly string[];
    /**
     * External packages that should be listed in the `optionalDependencies` section
     * of the manifest.
     */
    readonly optionalDependencies?: readonly string[];
}
/**
 * Bundle class to validate and pack nodejs bundles.
 */
export declare class Bundle {
    private readonly manifest;
    private readonly noticePath;
    private readonly packageDir;
    private readonly entryPoints;
    private readonly externals;
    private readonly resources;
    private readonly allowedLicenses;
    private readonly dontAttribute?;
    private readonly test?;
    private readonly sourcemap?;
    private readonly minify?;
    private readonly minifyWhitespace?;
    private readonly minifyIdentifiers?;
    private readonly minifySyntax?;
    private _bundle?;
    private _dependencies?;
    private _dependenciesRoot?;
    private _attributions?;
    constructor(props: BundleProps);
    /**
     * Validate the bundle for violations.
     *
     * If `fix` is set to true, this method will return the remaining
     * violations after the fixes were applied.
     *
     * This method never throws. The Caller is responsible for inspecting the
     * returned report and act accordingly.
     */
    validate(options?: BundleValidateOptions): ViolationsReport;
    /**
     * Write the bundle version of the project to a temp directory.
     * This directory is what the tool will end up packing.
     *
     * Returns the temp directory location.
     */
    write(): string;
    /**
     * Write the bundle and create the tarball.
     *
     * Returns the location of the tarball.
     */
    pack(options?: BundlePackOptions): string;
    private get bundle();
    private get dependencies();
    private get dependenciesRoot();
    private get attributions();
    /**
     * Find a single version number for the given external dependency.
     *
     * Finds the smallest possible range that contains all version identifiers,
     * or fails if it couldn't be found.
     */
    private findExternalDependencyVersion;
    private closestPackagePath;
    private createPackage;
    private esbuild;
    private validateCircularImports;
    private validateResources;
    private validateAttributions;
    private addExternals;
    private removeDependencies;
    private writeOutputs;
    private writeResources;
    private writeManifest;
}
