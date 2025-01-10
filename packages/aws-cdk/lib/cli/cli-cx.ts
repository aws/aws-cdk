import * as fs from 'fs-extra';
import type * as cxapi from '@aws-cdk/cx-api';
import type { ICloudAssemblySource } from '../toolkit/cloud-assembly-source';
import { ToolkitError } from '../toolkit/error';
import { Configuration, PROJECT_CONFIG, USER_DEFAULTS } from '../settings';
import { CdkToolkit } from '../cdk-toolkit';

/**
 * A dynamic cloud assembly source based on user input
 */
export class CliAssembly implements ICloudAssemblySource, AsyncDisposable {
  private assembly?: ICloudAssemblySource;

  public constructor(private readonly cdk: CdkToolkit, private readonly config: Configuration) {}

  [Symbol.asyncDispose](): PromiseLike<void> {
    throw new Error('Method not implemented.');
  }

  /**
   * Dynamically creates a cloud assembly source when needed for the first time.
   * Then uses the source to produce a cloud assembly.
   */
  public async produce(): Promise<cxapi.CloudAssembly> {
    if (!this.assembly) {
      this.assembly = this.makeAssembly();
    }

    return this.assembly.produce();
  }

  /**
   * Creates a cloud assembly source based on user input.
   */
  private makeAssembly(): ICloudAssemblySource {
    const app = this.config.settings.get(['app']);
    if (!app) {
      throw new ToolkitError(`--app is required either in command-line, in ${PROJECT_CONFIG} or in ${USER_DEFAULTS}`);
    }

    // We have a cdk.out directory, bypass synth
    if (fs.pathExistsSync(app) && fs.statSync(app).isDirectory()) {
      return this.cdk.fromAssemblyDirectory(app);
    }

    // Output is required here, however Settings has a default so this should never happen
    const output = this.config.settings.get(['output']);
    if (!output) {
      throw new ToolkitError('unexpected: --output is required');
    }
    if (typeof output !== 'string') {
      throw new ToolkitError(`--output takes a string, got ${JSON.stringify(output)}`);
    }

    // A cloud assembly source from a CDK app
    return this.cdk.fromCdkApp(app, { output });
  }
}
