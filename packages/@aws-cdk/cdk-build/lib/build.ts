// tslint:disable:no-console
import cxapi = require('@aws-cdk/cx-api');
import fs = require('fs-extra');
import path = require('path');
import { Manifest } from './manifest';

export interface BuildOptions {
  root: string;
}

export class Build {
  constructor(private readonly options: BuildOptions) {

  }

  public async build() {
    const manifestJson = await this.readBuildManifest();
    if (!manifestJson) {
      return; // no-op
    }

    const manifest = new Manifest(manifestJson);
    const session = manifest.createSession();

    const restore = process.cwd();
    process.chdir(this.options.root);
    try {
      await session.build();
    } finally {
      process.chdir(restore);
    }
  }

  private async readBuildManifest() {
    const manifestFile = path.join(this.options.root, cxapi.BUILD_FILE);

    // no-op if build.json is not there
    if (!await fs.pathExists(manifestFile)) {
      return undefined;
    }

    return JSON.parse((await fs.readFile(manifestFile)).toString()) as cxapi.BuildManifest;
  }
}
