import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import { Construct } from '@aws-cdk/core';

export abstract class ApplicationCode {
  public static fromBucket(bucket: s3.IBucket, fileKey: string, objectVersion?: string): BucketApplicationCode {
    return new BucketApplicationCode({
      bucket,
      fileKey,
      objectVersion,
    });
  }

  public static fromAsset(path: string, options?: s3_assets.AssetOptions): AssetApplicationCode {
    return new AssetApplicationCode(path, options);
  }

  abstract readonly bucket?: s3.IBucket;
  public abstract bind(scope: Construct): CodeConfiguration;
}

interface BucketApplicationCodeProps {
  bucket: s3.IBucket;
  fileKey: string;
  objectVersion?: string;
}

class BucketApplicationCode extends ApplicationCode {
  public readonly bucket: s3.IBucket;
  public readonly fileKey: string;
  public readonly objectVersion?: string;

  constructor(props: BucketApplicationCodeProps) {
    super();
    this.bucket = props.bucket;
    this.fileKey = props.fileKey;
    this.objectVersion = props.objectVersion;
  }

  public bind(_scope: Construct): CodeConfiguration {
    return {
      codeContent: {
        s3ContentLocation: {
          bucketArn: this.bucket.bucketArn,
          fileKey: this.fileKey,
          objectVersion: this.objectVersion,
        },
      },
      codeContentType: 'ZIPFILE',
    };
  }
}

class AssetApplicationCode extends ApplicationCode {
  private readonly path: string;
  private readonly options?: s3_assets.AssetOptions;
  private _asset?: s3_assets.Asset;

  constructor(path: string, options?: s3_assets.AssetOptions) {
    super();
    this.path = path;
    this.options = options;
  }

  public bind(scope: Construct): CodeConfiguration {
    this._asset = new s3_assets.Asset(scope, 'Code', {
      path: this.path,
      ...this.options,
    });

    if (!this._asset.isZipArchive) {
      throw new Error(`Asset must be a .zip file or a directory (${this.path})`);
    }

    return {
      codeContent: {
        s3ContentLocation: {
          bucketArn: this._asset.bucket.bucketArn,
          fileKey: this._asset.s3ObjectKey,
        },
      },
      codeContentType: 'ZIPFILE',
    };
  }

  get asset(): s3_assets.Asset | undefined {
    return this._asset;
  }

  get bucket(): s3.IBucket | undefined {
    return this._asset?.bucket;
  }
}

interface CodeConfiguration {
  codeContent: {
    s3ContentLocation: {
      bucketArn: string;
      fileKey: string;
      objectVersion?: string;
    },
  },
  codeContentType: 'ZIPFILE',
}
