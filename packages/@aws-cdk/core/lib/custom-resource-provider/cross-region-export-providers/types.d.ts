import { IResolvable } from '../../resolvable';
/**
 * The SSM parameter prefix that will be used for
 * all cross region exports
 */
export declare const SSM_EXPORT_PATH_PREFIX = "cdk/exports/";
/**
 * Map of exportName to export value
 */
export type CrossRegionExports = {
    [exportName: string]: string;
};
/**
 * Properties for the CrossRegionExportReader Custom Resource
 */
export interface ExportReaderCRProps {
    /**
     * The region that this resource exists in
     */
    readonly region: string;
    /**
     * An additional prefix to use. This will be appended
     * to SSM_EXPORT_PATH_PREFIX.
     */
    readonly prefix: string;
    /**
     * A list of imports used by this stack.
     * Will be a list of parameter names
     */
    readonly imports: CrossRegionExports | IResolvable;
}
/**
 * Properties for the CrossRegionExportWriter custom resource
 */
export interface ExportWriterCRProps {
    /**
     * The region to export the value to
     */
    readonly region: string;
    /**
     * A list of values to export to the target region
     */
    readonly exports: CrossRegionExports | IResolvable;
}
