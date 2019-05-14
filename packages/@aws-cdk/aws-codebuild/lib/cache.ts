import { IBucket } from "@aws-cdk/aws-s3";
import { Aws, Fn } from "@aws-cdk/cdk";
import { CfnProject } from "./codebuild.generated";
import { IProject } from "./project";

/**
 * Local cache modes to enable for the CodeBuild Project
 */
export enum LocalCacheMode {
    SourceCache = 'LOCAL_SOURCE_CACHE',
    DockerLayerCache = 'LOCAL_DOCKER_LAYER_CACHE',
    CustomCache = 'LOCAL_CUSTOM_CACHE',
}

/**
 * If and what strategy to use for build caching
 */
export enum CacheType {
    None = 'NO_CACHE',
    S3 = 'S3',
    Local = 'LOCAL',
}

/**
 * Cache options for CodeBuild Project
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-caching.html
 */
export abstract class Cache {
    public static none(): Cache {
        return { _toCloudFormation: () => undefined, _bind: () => { return; } };
    }

    /**
     * Create a local caching strategy
     * @param modes the mode(s) to enable for local caching
     */
    public static local(...modes: LocalCacheMode[]): Cache {
        return {
            _toCloudFormation: () => ({
                type: CacheType.Local,
                modes
            }),
            _bind: () => {
                return;
            }
        };
    }

    /**
     * Create an S3 caching strategy
     * @param bucket the S3 bucket to use for caching
     * @param prefix the optional prefix to use to store the cache in the bucket
     */
    public static bucket(bucket: IBucket, prefix?: string): Cache {
        return {
            _toCloudFormation: () => ({
                type: CacheType.S3,
                location: Fn.join('/', [bucket.bucketName, prefix || Aws.noValue])
            }),
            _bind: (project) => {
                if (project.role) {
                    bucket.grantReadWrite(project.role);
                }
            }
        };
    }

    /** @internal */
    public abstract _toCloudFormation(): CfnProject.ProjectCacheProperty | undefined;

    /** @internal */
    public abstract _bind(project: IProject): void;
}
