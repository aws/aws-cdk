import * as s3 from '@aws-cdk/aws-s3';
import { Construct } from '@aws-cdk/core';

export abstract class Code {

  /**
   * @returns `InlineCode` with inline code.
   * @param code The actual handler code (limited to 4KiB)
   */
  public static fromInline(code: string): InlineCode {
    return new InlineCode(code);
  }
  /**
   * TODO implement `fromAsset()`
   */
  // public static fromAsset(path: string, options?: s3_assets.AssetOptions): AssetCode {
  //   return new AssetCode(path, options);
  // }

  /**
   * @returns `S3Code` associated with the specified S3 object.
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   */
  public static fromBucket(bucket: s3.IBucket, key: string, objectVersion?: string): S3Code {
    return new S3Code(bucket, key, objectVersion);
  }

  /**
   * Called when the canary is initialized to allow this object to bind
   * to the stack, add resources and have fun.
   *
   * @param scope The binding scope. Don't be smart about trying to down-cast or
   * assume it's initialized. You may just use it as a construct scope.
   */
  public abstract bind(scope: Construct): CodeConfig;
}

export interface CodeConfig {
  /**
   * The location of the code in S3 (mutually exclusive with `inlineCode`).
   */
  readonly s3Location?: s3.Location;

  /**
   * Inline code (mutually exclusive with `s3Location`).
   */
  readonly inlineCode?: string;
}

/**
 * Canary code from an inline string (limited to 4KiB).
 */
export class InlineCode extends Code {
  public readonly isInline = true;

  constructor(private code: string) {
    super();

    if (code.length === 0) {
      throw new Error('Canary inline code cannot be empty');
    }

    if (code.length > 4096) {
      throw new Error('Canary source is too large, must be <= 4096 but is ' + code.length);
    }
  }

  public bind(_scope: Construct): CodeConfig {
    return {
      inlineCode: this.code,
    };
  }
}

/**
 * Canary code from an S3 archive.
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

  public bind(_scope: Construct): CodeConfig {
    return {
      s3Location: {
        bucketName: this.bucketName,
        objectKey: this.key,
        objectVersion: this.objectVersion,
      },
    };
  }
}