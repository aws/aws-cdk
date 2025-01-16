import * as cxapi from '@aws-cdk/cx-api';

import * as fs from 'fs-extra';
import type { ICloudAssemblySource } from '../';
import { ContextAwareCloudAssembly, ContextAwareCloudAssemblyProps } from './context-aware-source';
import { execInChildProcess } from './exec';
import { assemblyFromDirectory, changeDir, guessExecutable, prepareDefaultEnvironment, withContext, withEnv } from './prepare-source';
import { ToolkitServices } from '../../../toolkit/private';
import { Context, ILock, RWLock } from '../../aws-cdk';
import { ToolkitError } from '../../errors';
import { debug } from '../../io/private';

/**
 * Configuration for creating a CLI from an AWS CDK App directory
 */
export interface CdkAppSourceProps {
  /**
   * @default - current working directory
   */
  readonly workingDirectory?: string;

  /**
   * Emits the synthesized cloud assembly into a directory
   *
   * @default cdk.out
   */
  readonly output?: string;

  /**
   * Perform context lookups.
   *
   * Synthesis fails if this is disabled and context lookups need to be performed.
   *
   * @default true
   */
  readonly lookups?: boolean;

  /**
   * Options that are passed through the context to a CDK app on synth
   */
  readonly synthOptions?: AppSynthOptions;
}

export type AssemblyBuilder = (context: Record<string, any>) => Promise<cxapi.CloudAssembly>;

export abstract class CloudAssemblySourceBuilder {

  /**
   * Helper to provide the CloudAssemblySourceBuilder with required toolkit services
   * @deprecated this should move to the toolkit really.
   */
  protected abstract toolkitServices(): Promise<ToolkitServices>;

  /**
   * Create a Cloud Assembly from a Cloud Assembly builder function.
   */
  public async fromAssemblyBuilder(
    builder: AssemblyBuilder,
    props: CdkAppSourceProps = {},
  ): Promise<ICloudAssemblySource> {
    const services = await this.toolkitServices();
    const context = new Context(); // @todo check if this needs to read anything
    const contextAssemblyProps: ContextAwareCloudAssemblyProps = {
      services,
      context,
      lookups: props.lookups,
    };

    return new ContextAwareCloudAssembly(
      {
        produce: async () => {
          const env = await prepareDefaultEnvironment(services, { outdir: props.output });
          return changeDir(async () =>
            withContext(context.all, env, props.synthOptions ?? {}, async (envWithContext, ctx) =>
              withEnv(envWithContext, () => builder(ctx)),
            ), props.workingDirectory);
        },
      },
      contextAssemblyProps,
    );
  }

  /**
   * Creates a Cloud Assembly from an existing assembly directory.
   * @param directory the directory of the AWS CDK app. Defaults to the current working directory.
   * @param props additional configuration properties
   * @returns an instance of `AwsCdkCli`
   */
  public async fromAssemblyDirectory(directory: string): Promise<ICloudAssemblySource> {
    const services: ToolkitServices = await this.toolkitServices();
    const contextAssemblyProps: ContextAwareCloudAssemblyProps = {
      services,
      context: new Context(), // @todo there is probably a difference between contextaware and contextlookup sources
      lookups: false,
    };

    return new ContextAwareCloudAssembly(
      {
        produce: async () => {
          // @todo build
          await services.ioHost.notify(debug('--app points to a cloud assembly, so we bypass synth'));
          return assemblyFromDirectory(directory, services.ioHost);

        },
      },
      contextAssemblyProps,
    );
  }
  /**
   * Use a directory containing an AWS CDK app as source.
   * @param directory the directory of the AWS CDK app. Defaults to the current working directory.
   * @param props additional configuration properties
   * @returns an instance of `AwsCdkCli`
   */
  public async fromCdkApp(app: string, props: CdkAppSourceProps = {}): Promise<ICloudAssemblySource> {
    const services: ToolkitServices = await this.toolkitServices();
    const context = new Context(); // @todo this definitely needs to read files
    const contextAssemblyProps: ContextAwareCloudAssemblyProps = {
      services,
      context,
      lookups: props.lookups,
    };

    return new ContextAwareCloudAssembly(
      {
        produce: async () => {
          let lock: ILock | undefined = undefined;
          try {
            // @todo build
            // const build = this.props.configuration.settings.get(['build']);
            // if (build) {
            //   await execInChildProcess(build, { cwd: props.workingDirectory });
            // }

            const commandLine = await guessExecutable(app);
            const outdir = props.output ?? 'cdk.out';

            try {
              fs.mkdirpSync(outdir);
            } catch (e: any) {
              throw new ToolkitError(`Could not create output directory at '${outdir}' (${e.message}).`);
            }

            lock = await new RWLock(outdir).acquireWrite();

            const env = await prepareDefaultEnvironment(services, { outdir });
            return await withContext(context.all, env, props.synthOptions, async (envWithContext, _ctx) => {
              await execInChildProcess(commandLine.join(' '), { extraEnv: envWithContext, cwd: props.workingDirectory });
              return assemblyFromDirectory(outdir, services.ioHost);
            });
          } finally {
            await lock?.release();
          }
        },
      },
      contextAssemblyProps,
    );
  }
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
