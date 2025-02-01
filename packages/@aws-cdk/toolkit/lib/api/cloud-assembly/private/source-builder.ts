import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import type { ICloudAssemblySource } from '../';
import { ContextAwareCloudAssembly, ContextAwareCloudAssemblyProps } from './context-aware-source';
import { execInChildProcess } from './exec';
import { assemblyFromDirectory, changeDir, determineOutputDirectory, guessExecutable, prepareDefaultEnvironment, withContext, withEnv } from './prepare-source';
import { ToolkitServices } from '../../../toolkit/private';
import { Context, ILock, RWLock, Settings } from '../../aws-cdk';
import { ToolkitError } from '../../errors';
import { debug, error, info } from '../../io/private';
import { AssemblyBuilder, CdkAppSourceProps } from '../source-builder';

export abstract class CloudAssemblySourceBuilder {
  /**
   * Helper to provide the CloudAssemblySourceBuilder with required toolkit services
   * @deprecated this should move to the toolkit really.
   */
  protected abstract sourceBuilderServices(): Promise<ToolkitServices>;

  /**
   * Create a Cloud Assembly from a Cloud Assembly builder function.
   * @param builder the builder function
   * @param props additional configuration properties
   * @returns the CloudAssembly source
   */
  public async fromAssemblyBuilder(
    builder: AssemblyBuilder,
    props: CdkAppSourceProps = {},
  ): Promise<ICloudAssemblySource> {
    const services = await this.sourceBuilderServices();
    const context = new Context({ bag: new Settings(props.context ?? {}) });
    const contextAssemblyProps: ContextAwareCloudAssemblyProps = {
      services,
      context,
      lookups: props.lookups,
    };

    return new ContextAwareCloudAssembly(
      {
        produce: async () => {
          const outdir = determineOutputDirectory(props.outdir);
          const env = await prepareDefaultEnvironment(services, { outdir });
          const assembly = await changeDir(async () =>
            withContext(context.all, env, props.synthOptions ?? {}, async (envWithContext, ctx) =>
              withEnv(envWithContext, () => builder({
                outdir,
                context: ctx,
              })),
            ), props.workingDirectory);

          if (cxapi.CloudAssembly.isCloudAssembly(assembly)) {
            return assembly;
          }

          return new cxapi.CloudAssembly(assembly.directory);
        },
      },
      contextAssemblyProps,
    );
  }

  /**
   * Creates a Cloud Assembly from an existing assembly directory.
   * @param directory the directory of a already produced Cloud Assembly.
   * @returns the CloudAssembly source
   */
  public async fromAssemblyDirectory(directory: string): Promise<ICloudAssemblySource> {
    const services: ToolkitServices = await this.sourceBuilderServices();
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
   * @param props additional configuration properties
   * @returns the CloudAssembly source
   */
  public async fromCdkApp(app: string, props: CdkAppSourceProps = {}): Promise<ICloudAssemblySource> {
    const services: ToolkitServices = await this.sourceBuilderServices();
    // @todo this definitely needs to read files from the CWD
    const context = new Context({ bag: new Settings(props.context ?? {}) });
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
            const outdir = props.outdir ?? 'cdk.out';

            try {
              fs.mkdirpSync(outdir);
            } catch (e: any) {
              throw new ToolkitError(`Could not create output directory at '${outdir}' (${e.message}).`);
            }

            lock = await new RWLock(outdir).acquireWrite();

            const env = await prepareDefaultEnvironment(services, { outdir });
            return await withContext(context.all, env, props.synthOptions, async (envWithContext, _ctx) => {
              await execInChildProcess(commandLine.join(' '), {
                eventPublisher: async (type, line) => {
                  switch (type) {
                    case 'data_stdout':
                      await services.ioHost.notify(info(line, 'CDK_ASSEMBLY_I1001'));
                      break;
                    case 'data_stderr':
                      await services.ioHost.notify(error(line, 'CDK_ASSEMBLY_E1002'));
                      break;
                  }
                },
                extraEnv: envWithContext,
                cwd: props.workingDirectory,
              });
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

