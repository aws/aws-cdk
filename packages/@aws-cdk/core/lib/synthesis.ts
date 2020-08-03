import * as cxapi from '@aws-cdk/cx-api';
import { IConstruct } from 'constructs';
import { synthesize } from './private/synthesis';

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

/**
 * Allows synthesizing arbitrary CDK trees.
 */
export class Synthesis {

  /**
   * Synthesizes the tree from `root` and returns the cloud assembly.
   * @param root The root of the tree
   * @param options Synthesis options.
   */
  public static synthesize(root: IConstruct, options: SynthesisOptions) {
    return synthesize(root, options);
  }

  private constructor() { }
}