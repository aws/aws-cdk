import * as cxapi from '@aws-cdk/cx-api';

/**
 * Represents a single session of synthesis. Passed into `Construct.synthesize()` methods.
 */
export interface ISynthesisSession {
  /**
   * The output directory for this synthesis session.
   */
  outdir: string;

  /**
   * Cloud assembly builder.
   */
  assembly: cxapi.CloudAssemblyBuilder;
}
