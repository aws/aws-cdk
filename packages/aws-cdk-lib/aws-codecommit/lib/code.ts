import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { CfnRepository } from './codecommit.generated';
import * as assets from '../../aws-s3-assets';

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
 * Represents the contents to initialize the repository with.
 */
export abstract class Code {
  /**
   * Code from directory.
   * @param directoryPath the path to the local directory containing the contents to initialize the repository with
   * @param branch the name of the branch to create in the repository. Default is "main"
   */
  public static fromDirectory(directoryPath: string, branch?: string): Code {
    const resolvedPath = path.resolve(directoryPath);

    const statResult = fs.statSync(resolvedPath);
    if (!statResult || !statResult.isDirectory()) {
      throw new Error(`'${directoryPath}' needs to be a path to a directory (resolved to: '${resolvedPath }')`);
    }

    return new PathResolvedCode(resolvedPath, branch);
  }

  /**
   * Code from preexisting ZIP file.
   * @param filePath the path to the local ZIP file containing the contents to initialize the repository with
   * @param branch the name of the branch to create in the repository. Default is "main"
   */
  public static fromZipFile(filePath: string, branch?: string): Code {
    const resolvedPath = path.resolve(filePath);

    const statResult = fs.statSync(resolvedPath);
    if (!statResult || !statResult.isFile()) {
      throw new Error(`'${filePath}' needs to be a path to a ZIP file (resolved to: '${resolvedPath }')`);
    }

    return new PathResolvedCode(resolvedPath, branch);
  }

  /**
   * Code from user-supplied asset.
   * @param asset pre-existing asset
   * @param branch the name of the branch to create in the repository. Default is "main"
   */
  public static fromAsset(asset: assets.Asset, branch?: string): Code {
    return new AssetCode(asset, branch);
  }

  /**
   * This method is called after a repository is passed this instance of Code in its 'code' property.
   *
   * @param scope the binding scope
   */
  public abstract bind(scope: Construct): CodeConfig;
}

class PathResolvedCode extends Code {
  constructor(private readonly resolvedPath: string, private readonly branch?: string) {
    super();
  }

  public bind(scope: Construct): CodeConfig {
    const asset = new assets.Asset(scope, 'PathResolvedCodeAsset', {
      path: this.resolvedPath,
    });

    return (new AssetCode(asset, this.branch)).bind(scope);
  }
}

class AssetCode extends Code {
  constructor(private readonly asset: assets.Asset, private readonly branch?: string) {
    super();
  }

  public bind(_scope: Construct): CodeConfig {
    if (!this.asset.isZipArchive) {
      throw new Error('Asset must be a .zip file or a directory (resolved to: ' + this.asset.assetPath + ' )');
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
