import * as ecr from '@aws-cdk/aws-ecr';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import { BuildSpec } from './build-spec';
import { BuildEnvironment, ComputeType, IBuildImage, ImagePullPrincipalType } from './project';
/**
 * A CodeBuild image running aarch64 Linux.
 *
 * This class has a bunch of public constants that represent the CodeBuild ARM images.
 *
 * You can also specify a custom image using the static method:
 *
 * - LinuxBuildImage.fromEcrRepository(repo[, tag])
 *
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
 */
export declare class LinuxArmBuildImage implements IBuildImage {
    /** Image "aws/codebuild/amazonlinux2-aarch64-standard:1.0". */
    static readonly AMAZON_LINUX_2_STANDARD_1_0: IBuildImage;
    /** Image "aws/codebuild/amazonlinux2-aarch64-standard:2.0". */
    static readonly AMAZON_LINUX_2_STANDARD_2_0: IBuildImage;
    /**
     * Returns an ARM image running Linux from an ECR repository.
     *
     * NOTE: if the repository is external (i.e. imported), then we won't be able to add
     * a resource policy statement for it so CodeBuild can pull the image.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-ecr.html
     *
     * @param repository The ECR repository
     * @param tagOrDigest Image tag or digest (default "latest", digests must start with `sha256:`)
     * @returns An aarch64 Linux build image from an ECR repository.
     */
    static fromEcrRepository(repository: ecr.IRepository, tagOrDigest?: string): IBuildImage;
    /**
     * Uses a Docker image provided by CodeBuild.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
     *
     * @param id The image identifier
     * @example 'aws/codebuild/amazonlinux2-aarch64-standard:1.0'
     * @returns A Docker image provided by CodeBuild.
     */
    static fromCodeBuildImageId(id: string): IBuildImage;
    readonly type = "ARM_CONTAINER";
    readonly defaultComputeType = ComputeType.LARGE;
    readonly imageId: string;
    readonly imagePullPrincipalType?: ImagePullPrincipalType;
    readonly secretsManagerCredentials?: secretsmanager.ISecret;
    readonly repository?: ecr.IRepository;
    private constructor();
    /**
     * Validates by checking the BuildEnvironment computeType as aarch64 images only support ComputeType.SMALL and
     * ComputeType.LARGE
     * @param buildEnvironment BuildEnvironment
     */
    validate(buildEnvironment: BuildEnvironment): string[];
    runScriptBuildspec(entrypoint: string): BuildSpec;
}
