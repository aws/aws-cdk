/**
 * A reimplementation of JS AWS SDK's SharedIniFile class
 *
 * We need that class to parse the ~/.aws/config file to determine the correct
 * region at runtime, but unfortunately it is private upstream.
 */

import AWS = require('aws-sdk');
import os = require('os');
import path = require('path');

export interface SharedIniFileOptions {
  isConfig?: boolean;
  filename?: string;
}

export class SharedIniFile {
  private readonly isConfig: boolean;
  private readonly filename: string;
  private parsedContents?: {[key: string]: {[key: string]: string}};

  constructor(options?: SharedIniFileOptions) {
    options = options || {};
    this.isConfig = options.isConfig === true;
    this.filename = options.filename || this.getDefaultFilepath();
  }

  public getProfile(profile: string) {
    this.ensureFileLoaded();

    const profileIndex = profile !== (AWS as any).util.defaultProfile && this.isConfig ?
      'profile ' + profile : profile;

    return this.parsedContents![profileIndex];
  }

  private getDefaultFilepath(): string {
    return path.join(
      os.homedir(),
      '.aws',
      this.isConfig ? 'config' : 'credentials'
    );
  }

  private ensureFileLoaded() {
    if (!this.parsedContents) {
      this.parsedContents = (AWS as any).util.ini.parse(
        (AWS as any).util.readFileSync(this.filename)
      );
    }
  }
}