import * as path from 'path';
import { DockerImageDestination } from '@aws-cdk/cloud-assembly-schema';
import { DockerImageManifestEntry } from '../../asset-manifest';
import { EventType } from '../../progress';
import { IAssetHandler, IHandlerHost } from '../asset-handler';
import { Docker } from '../docker';
import { replaceAwsPlaceholders } from '../placeholders';
import { shell } from '../shell';

export class ContainerImageAssetHandler implements IAssetHandler {
  private readonly docker = new Docker(m => this.host.emitMessage(EventType.DEBUG, m));

  constructor(
    private readonly workDir: string,
    private readonly asset: DockerImageManifestEntry,
    private readonly host: IHandlerHost) {
  }

  public async publish(): Promise<void> {
    const destination = await replaceAwsPlaceholders(this.asset.destination, this.host.aws);
    const ecr = await this.host.aws.ecrClient(destination);
    const account = (await this.host.aws.discoverCurrentAccount()).accountId;
    const repoUri = await repositoryUri(ecr, destination.repositoryName);

    if (!repoUri) {
      throw new Error(`No ECR repository named '${destination.repositoryName}' in account ${account}. Is this account bootstrapped?`);
    }

    const imageUri = `${repoUri}:${destination.imageTag}`;

    if (!(await this.checkImageUriExists(imageUri, ecr, destination)) || this.host.aborted) {
      return undefined;
    }

    // Login before build so that the Dockerfile can reference images in the ECR repo
    await this.docker.login(ecr);

    const localTagName = this.asset.source.executable ?
      await this.buildExternalAsset(this.asset.source.executable) : await this.buildAsset();

    if (localTagName === undefined || this.host.aborted) {
      return;
    }

    this.host.emitMessage(EventType.UPLOAD, `Push ${imageUri}`);
    if (this.host.aborted) { return; }
    await this.docker.tag(localTagName, imageUri);
    await this.docker.push(imageUri);
  }

  private async buildAsset(): Promise<string | undefined> {
    const localTagName = `cdkasset-${this.asset.id.assetId.toLowerCase()}`;

    if (!(await this.isImageCached(localTagName))) {
      if (this.host.aborted) { return undefined; }

      await this.buildImage(localTagName);
    }

    return localTagName;
  }

  private async checkImageUriExists(imageUri: string, ecr: AWS.ECR, destination: DockerImageDestination): Promise<boolean> {
    this.host.emitMessage(EventType.CHECK, `Check ${imageUri}`);
    if (await imageExists(ecr, destination.repositoryName, destination.imageTag)) {
      this.host.emitMessage(EventType.FOUND, `Found ${imageUri}`);
      return false;
    }

    return true;
  }

  private async buildExternalAsset(executable: string[]): Promise<string | undefined> {
    this.host.emitMessage(EventType.BUILD, `Building Docker image using command '${executable}'`);
    if (this.host.aborted) { return undefined; }

    return (await shell(executable, { quiet: true })).trim();
  }

  private async buildImage(localTagName: string): Promise<void> {
    const source = this.asset.source;
    if (!source.directory) {
      throw new Error(`'directory' is expected in the DockerImage asset source, got: ${JSON.stringify(source)}`);
    }

    const fullPath = path.resolve(this.workDir, source.directory);
    this.host.emitMessage(EventType.BUILD, `Building Docker image at ${fullPath}`);

    await this.docker.build({
      directory: fullPath,
      tag: localTagName,
      buildArgs: source.dockerBuildArgs,
      target: source.dockerBuildTarget,
      file: source.dockerFile,
    });
  }

  private async isImageCached(localTagName: string): Promise<boolean> {
    if (await this.docker.exists(localTagName)) {
      this.host.emitMessage(EventType.CACHED, `Cached ${localTagName}`);
      return true;
    }

    return false;
  }
}

async function imageExists(ecr: AWS.ECR, repositoryName: string, imageTag: string) {
  try {
    await ecr.describeImages({ repositoryName, imageIds: [{ imageTag }] }).promise();
    return true;
  } catch (e) {
    if (e.code !== 'ImageNotFoundException') { throw e; }
    return false;
  }
}

/**
 * Return the URI for the repository with the given name
 *
 * Returns undefined if the repository does not exist.
 */
async function repositoryUri(ecr: AWS.ECR, repositoryName: string): Promise<string | undefined> {
  try {
    const response = await ecr.describeRepositories({ repositoryNames: [repositoryName] }).promise();
    return (response.repositories || [])[0]?.repositoryUri;
  } catch (e) {
    if (e.code !== 'RepositoryNotFoundException') { throw e; }
    return undefined;
  }
}
