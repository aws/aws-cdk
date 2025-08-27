import * as fs from 'fs';
import * as path from 'path';
import { Construct } from 'constructs';
import { RuntimeFamily } from './runtime';
import * as s3 from '../../aws-s3';
import * as s3_assets from '../../aws-s3-assets';
import { Stage, Token } from '../../core';
import { UnscopedValidationError, ValidationError } from '../../core/lib/errors';

/**
 * The code the canary should execute
 */
export abstract class Code {
  /**
   * Specify code inline.
   *
   * @param code The actual handler code (limited to 5MB)
   *
   * @returns `InlineCode` with inline code.
   */
  public static fromInline(code: string): InlineCode {
    return new InlineCode(code);
  }

  /**
   * Specify code from a local path. Path must include the folder structure `nodejs/node_modules/myCanaryFilename.js`.
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary.html#CloudWatch_Synthetics_Canaries_write_from_scratch
   *
   * @param assetPath Either a directory or a .zip file
   *
   * @returns `AssetCode` associated with the specified path.
   */
  public static fromAsset(assetPath: string, options?: s3_assets.AssetOptions): AssetCode {
    return new AssetCode(assetPath, options);
  }

  /**
   * Specify code from an s3 bucket. The object in the s3 bucket must be a .zip file that contains
   * the structure `nodejs/node_modules/myCanaryFilename.js`.
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary.html#CloudWatch_Synthetics_Canaries_write_from_scratch
   *
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   *
   * @returns `S3Code` associated with the specified S3 object.
   */
  public static fromBucket(bucket: s3.IBucketRef, key: string, objectVersion?: string): S3Code {
    return new S3Code(bucket, key, objectVersion);
  }

  /**
   * Called when the canary is initialized to allow this object to bind
   * to the stack, add resources and have fun.
   *
   * @param scope The binding scope. Don't be smart about trying to down-cast or
   *              assume it's initialized. You may just use it as a construct scope.
   *
   * @returns a bound `CodeConfig`.
   */
  public abstract bind(scope: Construct, handler: string, family: RuntimeFamily, runtimeName?: string): CodeConfig;
}

/**
 * Configuration of the code class
 */
export interface CodeConfig {
  /**
   * The location of the code in S3 (mutually exclusive with `inlineCode`).
   *
   * @default - none
   */
  readonly s3Location?: s3.Location;

  /**
   * Inline code (mutually exclusive with `s3Location`).
   *
   * @default - none
   */
  readonly inlineCode?: string;
}

/**
 * Canary code from an Asset
 */
export class AssetCode extends Code {
  private asset?: s3_assets.Asset;

  /**
   * @param assetPath The path to the asset file or directory.
   */
  public constructor(private assetPath: string, private options?: s3_assets.AssetOptions) {
    super();

    if (!fs.existsSync(this.assetPath)) {
      throw new UnscopedValidationError(`${this.assetPath} is not a valid path`);
    }
  }

  public bind(scope: Construct, handler: string, family: RuntimeFamily, runtimeName?: string): CodeConfig {
    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      this.asset = new s3_assets.Asset(scope, 'Code', {
        path: this.assetPath,
        ...this.options,
      });
    }

    this.validateCanaryAsset(scope, handler, family, runtimeName);

    return {
      s3Location: {
        bucketName: this.asset.s3BucketName,
        objectKey: this.asset.s3ObjectKey,
      },
    };
  }

  /**
   * Validates requirements specified by the canary resource. For example, the canary code with handler `index.handler`
   * must be found in the file structure `nodejs/node_modules/index.js`.
   *
   * Requires path to be either zip file or directory.
   * Requires asset directory to have the structure 'nodejs/node_modules' for puppeteer runtime.
   * Requires canary file to be directly inside node_modules folder.
   * Requires asset directory to have the extension '.js', '.mjs', or '.cjs' for playwright runtime.
   * Requires asset directory to have the structure 'python' for python runtime.
   * Requires canary file name matches the handler name.
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary.html
   */
  private validateCanaryAsset(scope: Construct, handler: string, family: RuntimeFamily, runtimeName?: string) {
    if (!this.asset) {
      throw new ValidationError("'validateCanaryAsset' must be called after 'this.asset' is instantiated", scope);
    }

    // Get the staged (or copied) asset path.
    // `this.asset.assetPath` is relative to the `outdir`, not the `assetOutDir`.
    const asmManifestDir = Stage.of(scope)?.outdir;
    const assetPath = asmManifestDir ? path.join(asmManifestDir, this.asset.assetPath): this.assetPath;

    if (path.extname(assetPath) !== '.zip') {
      if (!fs.lstatSync(assetPath).isDirectory()) {
        throw new ValidationError(`Asset must be a .zip file or a directory (${this.assetPath})`, scope);
      }

      const filename = handler.split('.')[0];
      const nodeFilename = `${filename}.js`;
      const pythonFilename = `${filename}.py`;

      if (runtimeName && !Token.isUnresolved(runtimeName)) {
        const playwrightValidExtensions = ['.cjs', '.mjs', '.js'];
        const hasValidExtension = playwrightValidExtensions.some(ext => fs.existsSync(path.join(assetPath, `${filename}${ext}`)));
        // Requires asset directory to have the structure 'nodejs/node_modules' for puppeteer runtime.
        if (family === RuntimeFamily.NODEJS && runtimeName.includes('puppeteer') && !fs.existsSync(path.join(assetPath, 'nodejs', 'node_modules', nodeFilename))) {
          throw new ValidationError(`The canary resource requires that the handler is present at "nodejs/node_modules/${nodeFilename}" but not found at ${this.assetPath} (https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary_Nodejs.html)`, scope);
        }
        // Requires the canary handler file to have the extension '.js', '.mjs', or '.cjs' for the playwright runtime.
        if (family === RuntimeFamily.NODEJS && runtimeName.includes('playwright') && !hasValidExtension) {
          throw new ValidationError(`The canary resource requires that the handler is present at one of the following extensions: ${playwrightValidExtensions.join(', ')} but not found at ${this.assetPath}`, scope);
        }
      }
      // Requires the asset directory to have the structure 'python/{canary-handler-name}.py' for the Python runtime.
      if (family === RuntimeFamily.PYTHON && !fs.existsSync(path.join(assetPath, 'python', pythonFilename))) {
        throw new ValidationError(`The canary resource requires that the handler is present at "python/${pythonFilename}" but not found at ${this.assetPath} (https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_WritingCanary_Python.html)`, scope);
      }
    }
  }
}

/**
 * Canary code from an inline string.
 */
export class InlineCode extends Code {
  public constructor(private code: string) {
    super();

    if (code.length === 0) {
      throw new UnscopedValidationError('Canary inline code cannot be empty');
    }
  }

  public bind(scope: Construct, handler: string, _family: RuntimeFamily, _runtimeName?: string): CodeConfig {
    if (handler !== 'index.handler') {
      throw new ValidationError(`The handler for inline code must be "index.handler" (got "${handler}")`, scope);
    }

    return {
      inlineCode: this.code,
    };
  }
}

/**
 * S3 bucket path to the code zip file
 */
export class S3Code extends Code {
  public constructor(private bucket: s3.IBucketRef, private key: string, private objectVersion?: string) {
    super();
  }

  public bind(_scope: Construct, _handler: string, _family: RuntimeFamily, _runtimeName?: string): CodeConfig {
    return {
      s3Location: {
        bucketName: this.bucket.bucketRef.bucketName,
        objectKey: this.key,
        objectVersion: this.objectVersion,
      },
    };
  }
}
