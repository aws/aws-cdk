import assets = require('@aws-cdk/assets');
import s3 = require('@aws-cdk/aws-s3');
import { Function as Func } from './lambda';
import { cloudformation } from './lambda.generated';

export abstract class Code {
  /**
   * @returns `LambdaS3Code` associated with the specified S3 object.
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   */
  public static bucket(bucket: s3.BucketRef, key: string, objectVersion?: string) {
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
   * @returns Zip archives the contents of a directory on disk and uses this
   * as the lambda handler's code.
   * @param directoryToZip The directory to zip
   */
  public static directory(directoryToZip: string) {
    return new AssetCode(directoryToZip, assets.AssetPackaging.ZipDirectory);
  }

  /**
   * @returns Uses a file on disk as a lambda handler's code.
   * @param filePath The file path
   */
  public static file(filePath: string) {
    return new AssetCode(filePath, assets.AssetPackaging.File);
  }

  /**
   * Called during stack synthesis to render the CodePropery for the
   * Lambda function.
   */
  public abstract toJSON(): cloudformation.FunctionResource.CodeProperty;

  /**
   * Called when the lambda is initialized to allow this object to
   * bind to the stack, add resources and have fun.
   */
  public bind(_lambda: Func) {
    return;
  }
}

/**
 * Lambda code from an S3 archive.
 */
export class S3Code extends Code {
  private bucketName: string;

  constructor(bucket: s3.BucketRef, private key: string, private objectVersion?: string) {
    super();

    if (!bucket.bucketName) {
      throw new Error('bucketName is undefined for the provided bucket');
    }

    this.bucketName = bucket.bucketName;
  }

  public toJSON(): cloudformation.FunctionResource.CodeProperty {
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
  constructor(private code: string) {
    super();

    if (code.length > 4096) {
      throw new Error("Lambda source is too large, must be <= 4096 but is " + code.length);
    }
  }

  public bind(lambda: Func) {
    if (!lambda.runtime.supportsInlineCode) {
      throw new Error(`Inline source not allowed for ${lambda.runtime.name}`);
    }
  }

  public toJSON(): cloudformation.FunctionResource.CodeProperty {
    return {
      zipFile: this.code
    };
  }
}

/**
 * Lambda code from a local directory.
 */
export class AssetCode extends Code {
  private asset?: assets.Asset;

  /**
   * @param path The path to the asset file or directory.
   * @param packaging The asset packaging format
   */
  constructor(
    private readonly path: string,
    private readonly packaging: assets.AssetPackaging) {
    super();
  }

  public bind(lambda: Func) {
    this.asset = new assets.Asset(lambda, 'Code', {
      path: this.path,
      packaging: this.packaging
    });

    this.asset.grantRead(lambda.role);
  }

  public toJSON(): cloudformation.FunctionResource.CodeProperty {
    return  {
      s3Bucket: this.asset!.s3BucketName,
      s3Key: this.asset!.s3ObjectKey
    };
  }
}
