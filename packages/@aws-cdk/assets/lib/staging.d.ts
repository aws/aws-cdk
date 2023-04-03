import { AssetStaging } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { FingerprintOptions } from './fs/options';
/**
 * Deprecated
 * @deprecated use `core.AssetStagingProps`
 */
export interface StagingProps extends FingerprintOptions {
    /**
     * Local file or directory to stage.
     */
    readonly sourcePath: string;
}
/**
 * Deprecated
 * @deprecated use `core.AssetStaging`
 */
export declare class Staging extends AssetStaging {
    constructor(scope: Construct, id: string, props: StagingProps);
}
