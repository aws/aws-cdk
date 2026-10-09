import * as fs from 'fs';
import { basename, join } from 'path';
import type * as iam from 'aws-cdk-lib/aws-iam';
import type * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cdk from 'aws-cdk-lib/core';
import { md5hash, lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type * as constructs from 'constructs';

/**
 * Represents a Glue Job's Code assets (an asset can be a scripts, a jar, a python file or any other file).
 */
export abstract class Code {
  /**
   * Job code as an S3 object.
   * @param bucket The S3 bucket
   * @param key The object key
   */
  public static fromBucket(bucket: s3.IBucket, key: string): S3Code {
    return new S3Code(bucket, key);
  }

  /**
   * Job code from a local disk path.
   *
   * @param path code file (not a directory).
   * @param options options for the underlying s3 asset (e.g. `deployTime`, `assetHash`).
   * @param bucket optional user-supplied bucket to deploy the code to instead of the shared CDK asset bucket.
   * When provided, the code file is deployed into this bucket (via an `s3deploy.BucketDeployment`) and the Glue
   * job's script location points at the object in this bucket. This is useful for separation of concerns and
   * least-privilege access - developers can be granted access to the scripts bucket without any access to the
   * CDK asset bucket. When omitted, the default behavior of uploading to the shared CDK asset bucket is retained.
   */
  public static fromAsset(path: string, options?: s3assets.AssetOptions, bucket?: s3.IBucket): AssetCode {
    return new AssetCode(path, options, bucket);
  }

  /**
   * Called when the Job is initialized to allow this object to bind.
   */
  public abstract bind(scope: constructs.Construct, grantable: iam.IGrantable): CodeConfig;
}

/**
 * Glue job Code from an S3 bucket.
 */
export class S3Code extends Code {
  constructor(private readonly bucket: s3.IBucket, private readonly key: string) {
    super();
  }

  public bind(_scope: constructs.Construct, grantable: iam.IGrantable): CodeConfig {
    this.bucket.grantRead(grantable, this.key);
    return {
      s3Location: {
        bucketName: this.bucket.bucketName,
        objectKey: this.key,
      },
    };
  }
}

/**
 * Job Code from a local file.
 */
export class AssetCode extends Code {
  private asset?: s3assets.Asset;
  private deployment?: s3deploy.BucketDeployment;

  /**
   * @param path The path to the Code file.
   * @param options options for the underlying s3 asset.
   * @param bucket An optional user-supplied bucket to deploy the code to. When provided, the code file is
   * deployed into this bucket instead of the shared CDK asset bucket, and the Glue job's script location
   * points at the object in this bucket.
   */
  constructor(private readonly path: string, private readonly options: s3assets.AssetOptions = { }, private readonly bucket?: s3.IBucket) {
    super();

    if (fs.lstatSync(this.path).isDirectory()) {
      throw new cdk.UnscopedValidationError(lit`CodePathIsDirectory`, `Code path ${this.path} is a directory. Only files are supported`);
    }
  }

  public bind(scope: constructs.Construct, grantable: iam.IGrantable): CodeConfig {
    // If a user-supplied bucket is provided, deploy the code file into it and point the job at that location.
    if (this.bucket) {
      return this.bindToCustomBucket(scope, this.bucket, grantable);
    }

    // Default behavior: upload the code file to the shared CDK asset bucket.
    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      this.asset = new s3assets.Asset(scope, `Code${this.hashcode(this.path)}`, {
        path: this.path,
        ...this.options,
      });
    } else if (cdk.Stack.of(this.asset) !== cdk.Stack.of(scope)) {
      throw new cdk.UnscopedValidationError(lit`AssetAlreadyAssociatedWithStack`, `Asset is already associated with another stack '${cdk.Stack.of(this.asset).stackName}'. ` +
        'Create a new Code instance for every stack.');
    }
    this.asset.grantRead(grantable);
    return {
      s3Location: {
        bucketName: this.asset.s3BucketName,
        objectKey: this.asset.s3ObjectKey,
      },
    };
  }

  /**
   * Deploys the code file into a user-supplied bucket and returns its location there.
   *
   * The code file is copied into an isolated staging directory so that only this single file is deployed
   * (a `BucketDeployment` deploys the whole contents of its source). `prune` is disabled so the deployment
   * never removes unrelated objects already present in the user's bucket.
   */
  private bindToCustomBucket(scope: constructs.Construct, bucket: s3.IBucket, grantable: iam.IGrantable): CodeConfig {
    const fileName = basename(this.path);

    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.deployment) {
      // Copy the single code file into an isolated temporary directory so that the BucketDeployment only
      // deploys this file (its source deploys the whole directory contents).
      const stagingDir = cdk.FileSystem.mkdtemp('glue-asset-code');
      try {
        fs.copyFileSync(this.path, join(stagingDir, fileName));
        this.deployment = new s3deploy.BucketDeployment(scope, `Code${this.hashcode(this.path)}Deployment`, {
          sources: [s3deploy.Source.asset(stagingDir)],
          destinationBucket: bucket,
          // Never remove other objects that already exist in the user-supplied bucket.
          prune: false,
        });
      } finally {
        // The BucketDeployment has staged the file into the cloud assembly synchronously, so the temporary
        // directory is no longer needed.
        cdk.FileSystem.rmrf(stagingDir);
      }
    } else if (cdk.Stack.of(this.deployment) !== cdk.Stack.of(scope)) {
      throw new cdk.UnscopedValidationError(lit`AssetAlreadyAssociatedWithStack`, `Asset is already associated with another stack '${cdk.Stack.of(this.deployment).stackName}'. ` +
        'Create a new Code instance for every stack.');
    }

    // Grant the job read access to just this object in the user-supplied bucket.
    bucket.grantRead(grantable, fileName);
    return {
      s3Location: {
        bucketName: bucket.bucketName,
        objectKey: fileName,
      },
    };
  }

  /**
   * Hash a string
   */
  private hashcode(s: string): string {
    return md5hash(s);
  }
}

/**
 * Result of binding `Code` into a `Job`.
 */
export interface CodeConfig {
  /**
   * The location of the code in S3.
   */
  readonly s3Location: s3.Location;
}
