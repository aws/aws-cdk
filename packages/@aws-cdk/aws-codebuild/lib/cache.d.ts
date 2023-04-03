import { IBucket } from '@aws-cdk/aws-s3';
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
export declare enum LocalCacheMode {
    /**
     * Caches Git metadata for primary and secondary sources
     */
    SOURCE = "LOCAL_SOURCE_CACHE",
    /**
     * Caches existing Docker layers
     */
    DOCKER_LAYER = "LOCAL_DOCKER_LAYER_CACHE",
    /**
     * Caches directories you specify in the buildspec file
     */
    CUSTOM = "LOCAL_CUSTOM_CACHE"
}
/**
 * Cache options for CodeBuild Project.
 * A cache can store reusable pieces of your build environment and use them across multiple builds.
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-caching.html
 */
export declare abstract class Cache {
    static none(): Cache;
    /**
     * Create a local caching strategy.
     * @param modes the mode(s) to enable for local caching
     */
    static local(...modes: LocalCacheMode[]): Cache;
    /**
     * Create an S3 caching strategy.
     * @param bucket the S3 bucket to use for caching
     * @param options additional options to pass to the S3 caching
     */
    static bucket(bucket: IBucket, options?: BucketCacheOptions): Cache;
    /**
     * @internal
     */
    abstract _toCloudFormation(): CfnProject.ProjectCacheProperty | undefined;
    /**
     * @internal
     */
    abstract _bind(project: IProject): void;
}
