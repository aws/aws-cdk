import { ToolkitError } from '../../errors';
import { ContextAwareCloudAssembly } from '../context-aware-source';
import { ICloudAssemblySource } from '../types';

/**
 * Configuration for creating a CLI from an AWS CDK App directory
 */
export interface FromCdkAppProps {
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
}

/**
   * Use a directory containing an AWS CDK app as source.
   * @param directory the directory of the AWS CDK app. Defaults to the current working directory.
   * @param props additional configuration properties
   * @returns an instance of `AwsCdkCli`
   */
export function fromCdkApp(app: string, props: FromCdkAppProps = {}): ICloudAssemblySource {
  return new ContextAwareCloudAssembly(
    {
      produce: async () => {
        await this.lock?.release();

        try {
          const build = this.props.configuration.settings.get(['build']);
          if (build) {
            await exec(build, { cwd: props.workingDirectory });
          }

          const commandLine = await guessExecutable(app);
          const outdir = props.output ?? 'cdk.out';

          try {
            fs.mkdirpSync(outdir);
          } catch (e: any) {
            throw new ToolkitError(`Could not create output directory at '${outdir}' (${e.message}).`);
          }

          this.lock = await new RWLock(outdir).acquireWrite();

          const env = await prepareDefaultEnvironment(this.props.sdkProvider, { outdir });
          return await withContext(env, this.props.configuration, async (envWithContext, _context) => {
            await exec(commandLine.join(' '), { extraEnv: envWithContext, cwd: props.workingDirectory });
            return createAssembly(outdir);
          });
        } finally {
          await this.lock?.release();
        }
      },
    },
    this.propsForContextAssembly,
  );
}
