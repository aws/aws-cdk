
import { DeployOptions } from './actions/deploy';
import { DestroyOptions } from './actions/destroy';
import { SynthOptions } from './actions/synth';
import { WatchOptions } from './actions/watch';
import { ICloudAssemblySource } from './cloud-assembly-source';
import { IIoHost } from './io-host';

export interface ToolkitOptions {
  ioHost: IIoHost;
}

export class Toolkit {
  public constructor(_options: ToolkitOptions) {}

  public async synth(_cx: ICloudAssemblySource, _options: SynthOptions): Promise<ICloudAssemblySource> {
    throw new Error('Not implemented yet');
  }

  public async deploy(_cx: ICloudAssemblySource, _options: DeployOptions): Promise<undefined> {
    throw new Error('Not implemented yet');
  }

  public async watch(_cx: ICloudAssemblySource, _options: WatchOptions): Promise<undefined> {
    throw new Error('Not implemented yet');
  }

  public async destroy(_cx: ICloudAssemblySource, _options: DestroyOptions): Promise<undefined> {
    throw new Error('Not implemented yet');
  }
}
