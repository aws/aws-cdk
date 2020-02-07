import * as path from 'path';
import { DockerImageManifestEntry } from '../asset-manifest';
import { IAws } from "../aws-operations";
import { IAssetHandler, MessageSink } from "../private/asset-handler";
import { Docker } from "../private/docker";
import { replaceAwsPlaceholders } from "../private/placeholders";

export class ContainerImageAssetHandler implements IAssetHandler {
  private readonly localTagName: string;
  private readonly docker = new Docker(this.message);

  constructor(
    private readonly root: string,
    private readonly asset: DockerImageManifestEntry,
    private readonly aws: IAws,
    private readonly message: MessageSink) {

    this.localTagName = `cdkasset-${this.asset.id.assetId.toLowerCase()}`;
  }

  public async publish(): Promise<void> {
    const destination = await replaceAwsPlaceholders(this.asset.destination, this.aws);

    const ecr = this.aws.ecrClient(destination);

    this.message(`Check ${destination.imageUri}`);
    if (await imageExists(ecr, destination.repositoryName, destination.imageTag)) {
      this.message(`Found ${destination.imageUri}`);
      return;
    }

    await this.package();

    this.message(`Push ${destination.imageUri}`);
    await this.docker.tag(this.localTagName, destination.imageUri);
    await this.docker.login(ecr);
    await this.docker.push(destination.imageUri);
  }

  public async package(): Promise<void> {
    if (await this.docker.exists(this.localTagName)) {
      this.message(`Cached ${this.localTagName}`);
      return;
    }

    const source = this.asset.source;

    const fullPath = path.join(this.root, source.directory);
    this.message(`Building Docker image at ${fullPath}`);

    await this.docker.build({
      directory: fullPath,
      tag: this.localTagName,
      buildArgs: source.dockerBuildArgs,
      target: source.dockerBuildTarget,
      file: source.dockerFile,
    });
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