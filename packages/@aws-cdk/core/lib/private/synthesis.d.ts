import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct } from 'constructs';
import { ISynthesisSession } from '../stack-synthesizers/types';
import { StageSynthesisOptions } from '../stage';
/**
 * Options for `synthesize()`
 */
export interface SynthesisOptions extends StageSynthesisOptions {
    /**
     * The output directory into which to synthesize the cloud assembly.
     * @default - creates a temporary directory
     */
    readonly outdir?: string;
}
export declare function synthesize(root: IConstruct, options?: SynthesisOptions): cxapi.CloudAssembly;
/**
 * Interface for constructs that want to do something custom during synthesis
 *
 * This feature is intended for use by official AWS CDK libraries only; 3rd party
 * library authors and CDK users should not use this function.
 */
export interface ICustomSynthesis {
    /**
     * Called when the construct is synthesized
     */
    onSynthesize(session: ISynthesisSession): void;
}
export declare function addCustomSynthesis(construct: IConstruct, synthesis: ICustomSynthesis): void;
