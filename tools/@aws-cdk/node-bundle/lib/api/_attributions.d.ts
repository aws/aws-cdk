import type { Package } from './bundle';
import { ViolationsReport } from './violation';
/**
 * Properties for `Attributions`.
 */
export interface AttributionsProps {
    /**
     * The package root directory.
     */
    readonly packageDir: string;
    /**
     * The name of the package.
     */
    readonly packageName: string;
    /**
     * Package dependencies.
     */
    readonly dependencies: Package[];
    /**
     * The parent directory underwhich all dependencies live.
     */
    readonly dependenciesRoot: string;
    /**
     * Path to the notice file to created / validated.
     */
    readonly filePath: string;
    /**
     * List of allowed licenses.
     *
     */
    readonly allowedLicenses: string[];
    /**
     * Dependencies matching this pattern will be excluded from attribution.
     *
     * @default - no exclusions.
     */
    readonly exclude?: string;
}
/**
 * `Attributions` represents an attributions file containing third-party license information.
 */
export declare class Attributions {
    private readonly packageDir;
    private readonly packageName;
    private readonly dependencies;
    private readonly allowedLicenses;
    private readonly dependenciesRoot;
    private readonly filePath;
    private readonly attributions;
    private readonly content;
    constructor(props: AttributionsProps);
    /**
     * Validate the current notice file.
     *
     * This method never throws. The Caller is responsible for inspecting the report returned and act accordinagly.
     */
    validate(): ViolationsReport;
    /**
     * Flush the generated notice file to disk.
     */
    flush(): void;
    private render;
    private generateAttributions;
}
