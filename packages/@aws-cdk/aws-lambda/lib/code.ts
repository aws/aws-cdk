import assets = require('@aws-cdk/assets');
import { BuildAsset } from '@aws-cdk/assets';
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import fs = require('fs');
import { join } from 'path';
import { Function as LambdaFunction } from './function';
import { CfnFunction } from './lambda.generated';
import { RuntimeFamily } from './runtime';

export abstract class Code {
  /**
   * @returns `LambdaS3Code` associated with the specified S3 object.
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   */
  public static bucket(bucket: s3.IBucket, key: string, objectVersion?: string) {
    return new S3Code(bucket, key, objectVersion);
  }

  /**
   * @returns `LambdaInlineCode` with inline code.
   * @param code The actual handler code (limited to 4KiB)
   */
  public static inline(code: string) {
    return new InlineCode(code);
  }

  /**
   * Loads the function code from a local disk asset.
   * @param path Either a directory with the Lambda code bundle or a .zip file
   */
  public static asset(path: string) {
    return new AssetCode(path);
  }

  public static build(path: string) {
    return new BuildCode(path);
  }

  /**
   * @returns Zip archives the contents of a directory on disk and uses this
   * as the lambda handler's code.
   * @param directoryToZip The directory to zip
   * @deprecated use `lambda.Code.asset(path)` (no need to specify if it's a file or a directory)
   */
  public static directory(directoryToZip: string) {
    return new AssetCode(directoryToZip, assets.AssetPackaging.ZipDirectory);
  }

  /**
   * @returns Uses a file on disk as a lambda handler's code.
   * @param filePath The file path
   * @deprecated use `lambda.Code.asset(path)` (no need to specify if it's a file or a directory)
   */
  public static file(filePath: string) {
    return new AssetCode(filePath, assets.AssetPackaging.File);
  }

  /**
   * Determines whether this Code is inline code or not.
   */
  public abstract readonly isInline: boolean;

  /**
   * Called during stack synthesis to render the CodePropery for the
   * Lambda function.
   *
   * @param resource the resource to which the code will be attached (a CfnFunction, or a CfnLayerVersion).
   */
  public abstract _toJSON(resource?: cdk.Resource): CfnFunction.CodeProperty;

  /**
   * Called when the lambda or layer is initialized to allow this object to
   * bind to the stack, add resources and have fun.
   */
  public bind(_construct: cdk.Construct) {
    return;
  }
}

/**
 * Lambda code from an S3 archive.
 */
export class S3Code extends Code {
  public readonly isInline = false;
  private bucketName: string;

  constructor(bucket: s3.IBucket, private key: string, private objectVersion?: string) {
    super();

    if (!bucket.bucketName) {
      throw new Error('bucketName is undefined for the provided bucket');
    }

    this.bucketName = bucket.bucketName;
  }

  public _toJSON(_?: cdk.Resource): CfnFunction.CodeProperty {
    return {
      s3Bucket: this.bucketName,
      s3Key: this.key,
      s3ObjectVersion: this.objectVersion
    };
  }
}

/**
 * Lambda code from an inline string (limited to 4KiB).
 */
export class InlineCode extends Code {
  public readonly isInline = true;

  constructor(private code: string) {
    super();

    if (code.length > 4096) {
      throw new Error("Lambda source is too large, must be <= 4096 but is " + code.length);
    }
  }

  public bind(construct: cdk.Construct) {
    const runtime = (construct as any).runtime;
    if (!runtime.supportsInlineCode) {
      throw new Error(`Inline source not allowed for ${runtime && runtime.name}`);
    }
  }

  public _toJSON(_?: cdk.Resource): CfnFunction.CodeProperty {
    return {
      zipFile: this.code
    };
  }
}

/**
 * Lambda code from a local directory.
 */
export class AssetCode extends Code {
  public readonly isInline = false;

  /**
   * The asset packaging.
   */
  public readonly packaging: assets.AssetPackaging;

  private asset?: assets.Asset;

  /**
   * @param path The path to the asset file or directory.
   * @param packaging The asset packaging format (optional, determined automatically)
   */
  constructor(public readonly path: string, packaging?: assets.AssetPackaging) {
    super();

    if (packaging !== undefined) {
      this.packaging = packaging;
    } else {
      this.packaging = fs.lstatSync(path).isDirectory()
      ? assets.AssetPackaging.ZipDirectory
      : assets.AssetPackaging.File;
    }
  }

  public bind(construct: cdk.Construct) {
    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      this.asset = new assets.Asset(construct, 'Code', {
        path: this.path,
        packaging: this.packaging
      });
    }

    if (!this.asset.isZipArchive) {
      throw new Error(`Asset must be a .zip file or a directory (${this.path})`);
    }
  }

  public _toJSON(resource?: cdk.Resource): CfnFunction.CodeProperty {
    if (resource) {
      // https://github.com/awslabs/aws-cdk/issues/1432
      this.asset!.addResourceMetadata(resource, 'Code');
    }

    return  {
      s3Bucket: this.asset!.s3BucketName,
      s3Key: this.asset!.s3ObjectKey
    };
  }
}

interface LambdaBuilderRequest {
  jsonrpc: string;
  method: string;
  id: number;
  params: {
    __protocol_version: string;
    capability: {
      language: string;
      dependency_manager: string;
      application_framework: string | null;
    },
    source_dir: string;
    artifacts_dir: string;
    scratch_dir: string;
    manifest_path: string;
    runtime: string;
    optimizations: object;
    options: object;
  }
}

export interface BuildCodeProps {
  path: string;
}

export class BuildCode extends Code {
  public readonly isInline: boolean = false;

  private asset?: BuildAsset;

  constructor(private readonly path: string) {
    super();
  }

  public bind(construct: cdk.Construct) {
    // we know it's a function ...
    const fn = construct as unknown as LambdaFunction;

    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      let manifestName: string;
      let language: string;
      let dependencyManager: string;
      switch (fn.runtime.family) {
        case RuntimeFamily.NodeJS:
          manifestName = 'package.json';
          language = 'nodejs';
          dependencyManager = 'npm';
          break;
        case RuntimeFamily.Java:
          language = 'java';
          if (fs.existsSync(join(this.path, 'pom.xml'))) {
            manifestName = 'pom.xml';
            dependencyManager = 'maven';
          } else if (fs.existsSync(join(this.path, 'build.gradle')))  {
            manifestName = 'build.gradle';
            dependencyManager = 'gradle';
          } else {
            throw new Error(`unknown java project type, couldn't find pom.xml or build.gradle in ${this.path}`);
          }
          break;
        default:
          throw new Error(`unsupported build runtime: ${fn.runtime}`);
      }

      const mount = '/tmp/cdk.out/';
      const cdkStaging = join(mount, '.cdk.staging');
      const request: LambdaBuilderRequest = {
        jsonrpc: '2.0',
        id: 1,
        method: 'LambdaBuilder.build',
        params: {
          __protocol_version: '0.1',
          capability: {
            language,
            dependency_manager: dependencyManager,
            application_framework: null
          },
          artifacts_dir: cdkStaging,
          manifest_path: join(mount, manifestName),
          runtime: fn.runtime.name,
          scratch_dir: '/tmp/scratch',
          source_dir: mount,
          optimizations: {},
          options: {}
        }
      };

      this.asset = new assets.BuildAsset(construct, 'Code', {
        path: this.path,
        image: `lambci/lambda:build-${fn.runtime.name}`,
        command: 'lambda-builders',
        stdin: JSON.stringify(request)
      });
    }
  }

  public _toJSON(resource?: cdk.Resource | undefined): CfnFunction.CodeProperty {
    if (resource) {
      // https://github.com/awslabs/aws-cdk/issues/1432
      this.asset!.addResourceMetadata(resource, 'Code');
    }

    return  {
      s3Bucket: this.asset!.s3BucketName,
      s3Key: this.asset!.s3ObjectKey
    };
  }
}
