import * as assets from '@aws-cdk/aws-s3-assets';

import { CfnRepository } from './codecommit.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Represents the Code to initialize the repo with
 */
export abstract class Code {
  /**
   * Code from directory
   * @param relativeDirectoryPath path relative to the calling file
   * @param branch optional branch like 'main
   * @returns Directory
   */
  static fromDirectory(relativeDirectoryPath: string, branch?: string): Directory {
    return new Directory(relativeDirectoryPath, branch);
  }

  /**
   * Code from preexisting zip file
   * @param relativeFilePath path relative to the calling file
   * @param branch optional branch like 'main'
   * @returns ZipFile
   */
  static fromZipFile(relativeFilePath: string, branch?: string): ZipFile {
    return new ZipFile(relativeFilePath, branch);
  }

  /**
   * Code from user-supplied asset.
   * @param asset pre-existing asset
   * @param branch optional branch like 'main'
   * @returns ExistingAsset
   */
  static fromAsset(asset: assets.Asset, branch?: string): ExistingAsset {
    return new ExistingAsset(asset, branch);
  }

  /**
     * Called when the lambda or layer is initialized to allow this object to bind
     *
     * @param scope The binding scope.
     */
  public abstract bind(scope: Construct): CfnRepository.CodeProperty;
}

/**
 * Code from directory
 */
export class Directory extends Code {
  private _relativeDirectoryPath: string;
  private _branch?: string;

  /**
   *
   * @param relativeDirectoryPath the path of the directory relative to the calling file
   * @param branch optional branch like 'main'
   */
  constructor(relativeDirectoryPath: string, branch?: string) {
    super();
    this._relativeDirectoryPath = relativeDirectoryPath;
    this._branch = branch;
  }

  public bind(scope: Construct): CfnRepository.CodeProperty {
    const asset = new assets.Asset(scope, 'CodeInitAsset', {
      path: this._relativeDirectoryPath,
    });

    return {
      branchName: this._branch,
      s3: {
        bucket: asset.s3BucketName,
        key: asset.s3ObjectKey,
      },
    };
  }
}

/**
 * The code from the zip file
 */
export class ZipFile extends Code {
  private _relativeFilePath: string;
  private _branch?: string;

  /**
   *
   * @param relativeFilePath the path of the file relative to the calling file
   * @param branch optional branch like 'main'
   */
  constructor(relativeFilePath: string, branch?: string) {
    super();
    this._relativeFilePath = relativeFilePath;
    this._branch = branch;
  }

  public bind(scope: Construct): CfnRepository.CodeProperty {
    const asset = new assets.Asset(scope, 'CodeInitAsset', {
      path: this._relativeFilePath,
    });

    return {
      branchName: this._branch,
      s3: {
        bucket: asset.s3BucketName,
        key: asset.s3ObjectKey,
      },
    };
  }
}

/**
 * Code from existing asset
 */
export class ExistingAsset extends Code {
  private _asset: assets.Asset;
  private _branch?: string;

  /**
     * @param asset The asset
     * @param branch optional branch like 'main'
     */
  constructor(public readonly asset: assets.Asset, branch?: string) {
    super();
    this._asset = asset;
    this._branch = branch;
  }

  public bind(_scope: Construct): CfnRepository.CodeProperty {
    if (!this._asset.isZipArchive) {
      throw new Error('Asset must be a .zip file or a directory');
    }

    return {
      branchName: this._branch,
      s3: {
        bucket: this._asset.s3BucketName,
        key: this._asset.s3ObjectKey,
      },
    };
  }

}

