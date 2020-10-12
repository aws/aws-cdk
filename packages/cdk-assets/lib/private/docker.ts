// import * as os from 'os';
import { Logger, shell, ShellOptions } from './shell';

interface BuildOptions {
  readonly directory: string;

  /**
   * Tag the image with a given repoName:tag combination
   */
  readonly tag: string;
  readonly target?: string;
  readonly file?: string;
  readonly buildArgs?: Record<string, string>;
}

export class Docker {
  constructor(private readonly logger?: Logger) {
  }

  /**
   * Whether an image with the given tag exists
   */
  public async exists(tag: string) {
    try {
      await this.execute(['inspect', tag], { quiet: true });
      return true;
    } catch (e) {
      if (e.code !== 'PROCESS_FAILED' || e.exitCode !== 1) { throw e; }
      return false;
    }
  }

  public async build(options: BuildOptions) {
    const buildCommand = [
      'build',
      ...flatten(Object.entries(options.buildArgs || {}).map(([k, v]) => ['--build-arg', `${k}=${v}`])),
      '--tag', options.tag,
      ...options.target ? ['--target', options.target] : [],
      ...options.file ? ['--file', options.file] : [],
      '.',
    ];
    await this.execute(buildCommand, { cwd: options.directory });
  }

  /**
   * Get credentials from ECR and run docker login
   */
  public async login(ecr: AWS.ECR) {
    const credentials = await obtainEcrCredentials(ecr);

    // Use --password-stdin otherwise docker will complain. Loudly.
    await this.execute(['login',
      '--username', credentials.username,
      '--password-stdin',
      credentials.endpoint], {
      input: credentials.password,

      // Need to quiet otherwise Docker will complain
      // 'WARNING! Your password will be stored unencrypted'
      // doesn't really matter since it's a token.
      quiet: true,
    });
  }

  public async tag(sourceTag: string, targetTag: string) {
    await this.execute(['tag', sourceTag, targetTag]);
  }

  public async push(tag: string) {
    await this.execute(['push', tag]);
  }

  private async execute(args: string[], options: ShellOptions = {}) {
    try {
      await shell(['docker', ...args], { logger: this.logger, ...options });
    } catch (e) {
      if (e.code === 'ENOENT') {
        throw new Error('Unable to execute \'docker\' in order to build a container asset. Please install \'docker\' and try again.');
      }
      throw e;
    }
  }
}

async function obtainEcrCredentials(ecr: AWS.ECR, logger?: Logger) {
  if (logger) { logger('Fetching ECR authorization token'); }
  const authData = (await ecr.getAuthorizationToken({ }).promise()).authorizationData || [];
  if (authData.length === 0) {
    throw new Error('No authorization data received from ECR');
  }
  const token = Buffer.from(authData[0].authorizationToken!, 'base64').toString('ascii');
  const [username, password] = token.split(':');

  return {
    username,
    password,
    endpoint: authData[0].proxyEndpoint!,
  };
}

function flatten(x: string[][]) {
  return Array.prototype.concat([], ...x);
}
