import { CloudAssemblyBuilder } from '@aws-cdk/cx-api';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { Stack } from '../stack';

/**
 * Encodes information how a certain Stack should be deployed
 */
export interface IStackSynthesizer {
  /**
   * Bind to the stack this environment is going to be used on
   *
   * Must be called before any of the other methods are called.
   */
  bind(stack: Stack): void;

  /**
   * Register a File Asset
   *
   * Returns the parameters that can be used to refer to the asset inside the template.
   */
  addFileAsset(asset: FileAssetSource): FileAssetLocation;

  /**
   * Register a Docker Image Asset
   *
   * Returns the parameters that can be used to refer to the asset inside the template.
   */
  addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation;

  /**
   * Synthesize the associated stack to the session
   */
  synthesize(session: ISynthesisSession): void;
}

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
  assembly: CloudAssemblyBuilder;

  /**
  * Whether the stack should be validated after synthesis to check for error metadata
  *
  * @default - false
  */
  validateOnSynth?: boolean;
}
