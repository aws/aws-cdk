import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { ISynthesisSession } from '../construct-compat';
import { Stack } from '../stack';
import { addStackArtifactToAssembly } from './_shared';
import { IStackSynthesizer } from './types';

/**
 * Base class for implementing an IStackSynthesizer
 *
 * This class needs to exist to provide public surface area for external
 * implementations of stack synthesizers. The protected methods give
 * access to functions that are otherwise @_internal to the framework
 * and could not be accessed by external implementors.
 */
export abstract class StackSynthesizer implements IStackSynthesizer {
  /**
   * Bind to the stack this environment is going to be used on
   *
   * Must be called before any of the other methods are called.
   */
  public abstract bind(stack: Stack): void;

  /**
   * Register a File Asset
   *
   * Returns the parameters that can be used to refer to the asset inside the template.
   */
  public abstract addFileAsset(asset: FileAssetSource): FileAssetLocation;

  /**
   * Register a Docker Image Asset
   *
   * Returns the parameters that can be used to refer to the asset inside the template.
   */
  public abstract addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation;

  /**
   * Synthesize the associated stack to the session
   */
  public abstract synthesize(session: ISynthesisSession): void;

  /**
   * Have the stack write out its template
   */
  protected synthesizeStackTemplate(stack: Stack, session: ISynthesisSession): void {
    stack._synthesizeTemplate(session);
  }


  /**
   * Write the stack artifact to the session
   *
   * Use default settings to add a CloudFormationStackArtifact artifact to
   * the given synthesis session.
   */
  protected emitStackArtifact(stack: Stack, session: ISynthesisSession, options: SynthesizeStackArtifactOptions = {}) {
    addStackArtifactToAssembly(session, stack, options ?? {}, options.additionalDependencies ?? []);
  }
}

/**
 * Stack artifact options
 *
 * A subset of `cxschema.AwsCloudFormationStackProperties` of optional settings that need to be
 * configurable by synthesizers, plus `additionalDependencies`.
 */
export interface SynthesizeStackArtifactOptions {
  /**
   * Identifiers of additional dependencies
   *
   * @default - No additional dependencies
   */
  readonly additionalDependencies?: string[];

  /**
   * Values for CloudFormation stack parameters that should be passed when the stack is deployed.
   *
   * @default - No parameters
   */
  readonly parameters?: { [id: string]: string };

  /**
   * The role that needs to be assumed to deploy the stack
   *
   * @default - No role is assumed (current credentials are used)
   */
  readonly assumeRoleArn?: string;

  /**
   * The role that is passed to CloudFormation to execute the change set
   *
   * @default - No role is passed (currently assumed role/credentials are used)
   */
  readonly cloudFormationExecutionRoleArn?: string;

  /**
   * If the stack template has already been included in the asset manifest, its asset URL
   *
   * @default - Not uploaded yet, upload just before deploying
   */
  readonly stackTemplateAssetObjectUrl?: string;

  /**
   * Version of bootstrap stack required to deploy this stack
   *
   * @default - No bootstrap stack required
   */
  readonly requiresBootstrapStackVersion?: number;

  /**
   * SSM parameter where the bootstrap stack version number can be found
   *
   * Only used if `requiresBootstrapStackVersion` is set.
   *
   * - If this value is not set, the bootstrap stack name must be known at
   *   deployment time so the stack version can be looked up from the stack
   *   outputs.
   * - If this value is set, the bootstrap stack can have any name because
   *   we won't need to look it up.
   *
   * @default - Bootstrap stack version number looked up
   */
  readonly bootstrapStackVersionSsmParameter?: string;
}