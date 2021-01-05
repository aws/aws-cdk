import { DockerImageManifestEntry } from '../../asset-manifest';
import { EventType } from '../../progress';
import { IAssetHandler, IHandlerHost } from '../asset-handler';
import { shell } from '../shell';
import { ContainerImageAssetHandler } from './container-images';

export class ExternalContainerImageAssetHandler extends ContainerImageAssetHandler implements IAssetHandler {
  constructor(
    protected readonly asset: DockerImageManifestEntry,
    protected readonly host: IHandlerHost) {
    super('', asset, host);
  }

  protected async buildImage(): Promise<void> {
    return;
  }

  protected async getImageUri(): Promise<string | null> {
    if ((await this.isImageCached())) {
      return null;
    }

    const source = this.asset.externalSource!;
    const executable = source.executable;
    this.host.emitMessage(EventType.BUILD, `Building Docker image using command '${executable}'`);

    const imageUri = await shell(executable.split(' '));

    return imageUri;
  }
}
