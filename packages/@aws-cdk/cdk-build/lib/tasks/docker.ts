import { Task } from '../task';
import { shell } from '../util';

export interface DockerTaskOptions {
  /**
   * Docker build context directory (where `Dockerfile` is).
   */
  dir: string;

  /**
   * The tag to use for the resulting image.
   */
  tag: string;

  /**
   * Docker implementation, can be used to mock the docker shell execution.
   */
  docker?: IDocker
}

/**
 * Builds Docker images.
 */
export default class DockerTask extends Task {
  private readonly docker: IDocker;

  constructor(id: string, private readonly options: DockerTaskOptions) {
    super(id);

    this.docker = options.docker || new Docker();
  }

  public async execute() {
    const tag = this.options.tag;

    this.debug(`checking if a docker image with tag ${tag} already exists`);
    const output = (await this.docker.exec('images', '-q', tag)).trim();

    if (output.length > 0) {
      this.debug(`docker image ${tag} already exists`);
      return false;
    }

    this.debug(`building docker image ${this.options.tag} from ${this.options.dir}`);
    await this.docker.exec('build', '--tag', this.options.tag, this.options.dir);
    return true;
  }
}

export interface IDocker {
  exec(...args: string[]): Promise<string>;
}

class Docker implements IDocker {
  public async exec(...args: string[]) {
    try {
      return await shell(['docker', ...args]);
    } catch (e) {
      if (e.code === 'ENOENT') {
        // tslint:disable-next-line:max-line-length
        throw new Error('Error building Docker image asset; you need to have Docker installed in order to be able to build image assets. Please install Docker and try again.');
      }
      throw e;
    }
  }
}