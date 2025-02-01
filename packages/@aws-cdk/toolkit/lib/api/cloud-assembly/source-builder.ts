import type * as cxschema from '@aws-cdk/cloud-assembly-schema';

export interface AppProps {
  /**
   * The output directory into which to the builder app will emit synthesized artifacts.
   */
  readonly outdir?: string;

  /**
   * The context provided tp the builder app to synthesize the Cloud Assembly.
   */
  readonly context?: { [key: string]: any };
}

export type AssemblyBuilder = (props: AppProps) => Promise<cxschema.ICloudAssembly>;

/**
 * Configuration for creating a CLI from an AWS CDK App directory
 */
export interface CdkAppSourceProps {
  /**
   * Execute the application in this working directory.
   *
   * @default - current working directory
   */
  readonly workingDirectory?: string;

  /**
   * Emits the synthesized cloud assembly into a directory
   *
   * @default cdk.out
   */
  readonly outdir?: string;

  /**
   * Perform context lookups.
   *
   * Synthesis fails if this is disabled and context lookups need to be performed.
   *
   * @default true
   */
  readonly lookups?: boolean;

  /**
   * Context values for the application.
   *
   * Context can be read in the app from any construct using `node.getContext(key)`.
   *
   * @default - no context
   */
  readonly context?: {
    [key: string]: any;
  };

  /**
   * Options that are passed through the context to a CDK app on synth
   */
  readonly synthOptions?: AppSynthOptions;
}

/**
 * Settings that are passed to a CDK app via the context
 */
export interface AppSynthOptions {
  /**
   * Debug the CDK app.
   * Logs additional information during synthesis, such as creation stack traces of tokens.
   * This also sets the `CDK_DEBUG` env variable and will slow down synthesis.
   *
   * @default false
   */
  readonly debug?: boolean;

  /**
   * Enables the embedding of the "aws:cdk:path" in CloudFormation template metadata.
   *
   * @default true
   */
  readonly pathMetadata?: boolean;

  /**
   * Enable the collection and reporting of version information.
   *
   * @default true
   */
  readonly versionReporting?: boolean;

  /**
   * Whe enabled, `aws:asset:xxx` metadata entries are added to the template.
   *
   * Disabling this can be useful in certain cases like integration tests.
   *
   * @default true
   */
  readonly assetMetadata?: boolean;

  /**
   * Enable asset staging.
   *
   * Disabling asset staging means that copyable assets will not be copied to the
   * output directory and will be referenced with absolute paths.
   *
   * Not copied to the output directory: this is so users can iterate on the
   * Lambda source and run SAM CLI without having to re-run CDK (note: we
   * cannot achieve this for bundled assets, if assets are bundled they
   * will have to re-run CDK CLI to re-bundle updated versions).
   *
   * Absolute path: SAM CLI expects `cwd`-relative paths in a resource's
   * `aws:asset:path` metadata. In order to be predictable, we will always output
   * absolute paths.
   *
   * @default true
   */
  readonly assetStaging?: boolean;

  /**
   * Select which stacks should have asset bundling enabled
   *
   * @default ["**"] - all stacks
   */
  readonly bundlingForStacks?: string;
}
