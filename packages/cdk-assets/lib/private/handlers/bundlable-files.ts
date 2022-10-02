import * as path from 'path';
import { ContainerBunder } from '../docker';
import { FileAssetHandler } from './files';

export class BundlableFileAssetHandler extends FileAssetHandler {

  public async build(): Promise<void> {
    if (!this.asset.source.bundling) {
      throw new Error('Tried to do bundling without BundlingOptions');
    }

    if (!this.asset.source.path) {
      throw new Error('Source path is mandatory when bundling inside container');
    }

    const bundler = new ContainerBunder(
      this.asset.source.bundling,
      path.resolve(this.workDir, this.asset.source.path),
    );

    const bundledPath = await bundler.bundle();

    // Hack to get things tested
    (this.asset.source.path as any) = bundledPath;
  }
}