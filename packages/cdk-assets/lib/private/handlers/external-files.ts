import { FileManifestEntry } from '../../asset-manifest';
import { IAssetHandler, IHandlerHost } from '../asset-handler';
import { shell } from '../shell';
import { FileAssetHandler } from './files';

export class ExternalFileAssetHandler extends FileAssetHandler implements IAssetHandler {
  constructor(
    protected readonly asset: FileManifestEntry,
    protected readonly host: IHandlerHost) {
    super('', asset, host);
  }

  protected async packageFile(): Promise<string> {
    const source = this.asset.externalSource!;
    const file = await shell(source.executable.split(' '));
    return file;
  }
}
