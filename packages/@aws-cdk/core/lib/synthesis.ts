import * as cxapi from '@aws-cdk/cx-api';

/**
 * Options for synthesis.
 *
 * @deprecated use `app.synth()` or `stage.synth()` instead
 */
export interface SynthesisOptions extends cxapi.AssemblyBuildOptions {
  /**
   * The output directory into which to synthesize the cloud assembly.
   * @default - creates a temporary directory
   */
  readonly outdir?: string;

  /**
   * Whether synthesis should skip the validation phase.
   * @default false
   */
  readonly skipValidation?: boolean;
}
