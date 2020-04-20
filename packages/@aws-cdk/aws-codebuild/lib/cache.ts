import { IBucket } from '@aws-cdk/aws-s3';
import { Aws, Fn } from '@aws-cdk/core';
import { CfnProject } from './codebuild.generated';
import { IProject } from './project';

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
    return { _toCloudFormation: () => undefined, _bind: () => { return; } };
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
  public static bucket(bucket: IBucket, options?: BucketCacheOptions): Cache {
    return {
      _toCloudFormation: () => ({
        type: 'S3',
        location: Fn.join('/', [bucket.bucketName, options && options.prefix || Aws.NO_VALUE]),
      }),
      _bind: (project) => {
        bucket.grantReadWrite(project);
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
