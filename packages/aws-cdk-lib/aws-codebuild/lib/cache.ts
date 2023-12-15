import { CfnProject } from './codebuild.generated';
import { IProject } from './project';
import { Bucket, ICfnBucket } from '../../aws-s3';
import { Aws, Fn } from '../../core';

export interface BucketCacheOptions {
  /**
   * The prefix to use to store the cache in the bucket
   */
  readonly prefix?: string;
}

/**
 * Local cache modes to enable for the CodeBuild Project
 */
export enum LocalCacheMode {
  /**
   * Caches Git metadata for primary and secondary sources
   */
  SOURCE = 'LOCAL_SOURCE_CACHE',

  /**
   * Caches existing Docker layers
   */
  DOCKER_LAYER = 'LOCAL_DOCKER_LAYER_CACHE',

  /**
   * Caches directories you specify in the buildspec file
   */
  CUSTOM = 'LOCAL_CUSTOM_CACHE',
}

/**
 * Cache options for CodeBuild Project.
 * A cache can store reusable pieces of your build environment and use them across multiple builds.
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-caching.html
 */
export abstract class Cache {
  public static none(): Cache {
    return {
      _toCloudFormation(): CfnProject.ProjectCacheProperty | undefined {
        return { type: 'NO_CACHE' };
      },
      _bind(): void {
      },
    };
  }

  /**
   * Create a local caching strategy.
   * @param modes the mode(s) to enable for local caching
   */
  public static local(...modes: LocalCacheMode[]): Cache {
    return {
      _toCloudFormation: () => ({
        type: 'LOCAL',
        modes,
      }),
      _bind: () => { return; },
    };
  }

  /**
   * Create an S3 caching strategy.
   * @param bucket the S3 bucket to use for caching
   * @param options additional options to pass to the S3 caching
   */
  public static bucket(bucket: ICfnBucket, options?: BucketCacheOptions): Cache {
    const s3Bucket = Bucket.fromCfnBucket(bucket);
    return {
      _toCloudFormation: () => ({
        type: 'S3',
        location: Fn.join('/', [s3Bucket.attrBucketName, options && options.prefix || Aws.NO_VALUE]),
      }),
      _bind: (project) => {
        s3Bucket.grantReadWrite(project);
      },
    };
  }

  /**
   * @internal
   */
  public abstract _toCloudFormation(): CfnProject.ProjectCacheProperty | undefined;

  /**
   * @internal
   */
  public abstract _bind(project: IProject): void;
}
