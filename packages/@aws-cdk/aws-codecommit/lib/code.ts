import * as fs from 'fs';
import * as path from 'path';
import * as assets from '@aws-cdk/aws-s3-assets';
import { Construct } from 'constructs';
import { CfnRepository } from './codecommit.generated';


/**
 * Represents the structure to pass into the underlying CfnRepository class.
 */
export interface CodeConfig {
  /**
   * represents the underlying code structure
   */
  readonly code: CfnRepository.CodeProperty;
}

/**
 * Represents the Code to initialize the repo with
 */
export abstract class Code {
  /**
   * Code from directory
   * @param directoryPath path relative to the calling file
   * @param branch optional branch like 'main
   * @returns Directory
   */
  public static fromDirectory(directoryPath: string, branch?: string): Code {
    const resolvedPath = path.resolve(directoryPath);

    const statResult = fs.statSync(resolvedPath);

    if (!statResult || !statResult.isDirectory()) {
      throw new Error(`No directory at ${resolvedPath}`);
    }

    return new PathResolvedCode(resolvedPath, branch);
  }

  /**
   * Code from preexisting zip file
   * @param filePath path relative to the calling file
   * @param branch optional branch like 'main'
   * @returns ZipFile
   */
  public static fromZipFile(filePath: string, branch?: string): Code {
    const resolvedPath = path.resolve(filePath);

    const statResult = fs.statSync(resolvedPath);

    if (!statResult || !statResult.isFile()) {
      throw new Error(`No file at ${resolvedPath}`);
    }

    return new PathResolvedCode(resolvedPath, branch);
  }

  /**
   * Code from user-supplied asset.
   * @param asset pre-existing asset
   * @param branch optional branch like 'main'
   * @returns ExistingAsset
   * @throws Error when path is not resolvable (see @aws-cdk/core - AssetStaging)
   */
  public static fromAsset(asset: assets.Asset, branch?: string): Code {
    return new AssetCode(asset, branch);
  }

  /**
     * Called when the repository is initialized
     *
     * @param scope the binding scope
     */
  public abstract bind(scope: Construct): CodeConfig;
}

class PathResolvedCode extends Code {
  /**
     * @param resolvedPath the path to the zip/directory
     * @param branch optional branch like 'main'
     */
  constructor(private readonly resolvedPath: string, private readonly branch?: string) {
    super();
  }

  public bind(_scope: Construct): CodeConfig {
    const asset = new assets.Asset(_scope, 'PathResolvedCodeAsset', {
      path: this.resolvedPath,
    });

    return (new AssetCode(asset, this.branch)).bind(_scope);
  }
}

/**
 * Code from existing asset
 */
class AssetCode extends Code {

  /**
     * @param asset The asset
     * @param branch optional branch like 'main'
     */
  constructor(private readonly asset: assets.Asset, private readonly branch?: string) {
    super();
  }

  public bind(_scope: Construct): CodeConfig {
    if (!this.asset.isZipArchive) {
      throw new Error('Asset must be a .zip file or a directory');
    }

    return {
      code: {
        branchName: this.branch,
        s3: {
          bucket: this.asset.s3BucketName,
          key: this.asset.s3ObjectKey,
        },
      },
    };
  }
}