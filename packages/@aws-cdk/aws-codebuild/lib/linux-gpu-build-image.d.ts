import * as ecr from '@aws-cdk/aws-ecr';
import { Construct } from 'constructs';
import { BuildSpec } from './build-spec';
import { BuildEnvironment, BuildImageBindOptions, BuildImageConfig, ComputeType, IBindableBuildImage, IBuildImage, ImagePullPrincipalType, IProject } from './project';
/**
 * A CodeBuild GPU image running Linux.
 *
 * This class has public constants that represent the most popular GPU images from AWS Deep Learning Containers.
 *
 * @see https://aws.amazon.com/releasenotes/available-deep-learning-containers-images
 */
export declare class LinuxGpuBuildImage implements IBindableBuildImage {
    private readonly repositoryName;
    private readonly account;
    /** Tensorflow 1.14.0 GPU image from AWS Deep Learning Containers. */
    static readonly DLC_TENSORFLOW_1_14_0: IBuildImage;
    /** Tensorflow 1.15.0 GPU image from AWS Deep Learning Containers. */
    static readonly DLC_TENSORFLOW_1_15_0: IBuildImage;
    /** Tensorflow 1.15.2 GPU training image from AWS Deep Learning Containers. */
    static readonly DLC_TENSORFLOW_1_15_2_TRAINING: IBuildImage;
    /** Tensorflow 1.15.2 GPU inference image from AWS Deep Learning Containers. */
    static readonly DLC_TENSORFLOW_1_15_2_INFERENCE: IBuildImage;
    /** Tensorflow 2.0.0 GPU image from AWS Deep Learning Containers. */
    static readonly DLC_TENSORFLOW_2_0_0: IBuildImage;
    /** Tensorflow 2.0.1 GPU image from AWS Deep Learning Containers. */
    static readonly DLC_TENSORFLOW_2_0_1: IBuildImage;
    /** Tensorflow 2.1.0 GPU training image from AWS Deep Learning Containers. */
    static readonly DLC_TENSORFLOW_2_1_0_TRAINING: IBuildImage;
    /** Tensorflow 2.1.0 GPU inference image from AWS Deep Learning Containers. */
    static readonly DLC_TENSORFLOW_2_1_0_INFERENCE: IBuildImage;
    /** Tensorflow 2.2.0 GPU training image from AWS Deep Learning Containers. */
    static readonly DLC_TENSORFLOW_2_2_0_TRAINING: IBuildImage;
    /** PyTorch 1.2.0 GPU image from AWS Deep Learning Containers. */
    static readonly DLC_PYTORCH_1_2_0: IBuildImage;
    /** PyTorch 1.3.1 GPU image from AWS Deep Learning Containers. */
    static readonly DLC_PYTORCH_1_3_1: IBuildImage;
    /** PyTorch 1.4.0 GPU training image from AWS Deep Learning Containers. */
    static readonly DLC_PYTORCH_1_4_0_TRAINING: IBuildImage;
    /** PyTorch 1.4.0 GPU inference image from AWS Deep Learning Containers. */
    static readonly DLC_PYTORCH_1_4_0_INFERENCE: IBuildImage;
    /** PyTorch 1.5.0 GPU training image from AWS Deep Learning Containers. */
    static readonly DLC_PYTORCH_1_5_0_TRAINING: IBuildImage;
    /** PyTorch 1.5.0 GPU inference image from AWS Deep Learning Containers. */
    static readonly DLC_PYTORCH_1_5_0_INFERENCE: IBuildImage;
    /** MXNet 1.4.1 GPU image from AWS Deep Learning Containers. */
    static readonly DLC_MXNET_1_4_1: IBuildImage;
    /** MXNet 1.6.0 GPU image from AWS Deep Learning Containers. */
    static readonly DLC_MXNET_1_6_0: IBuildImage;
    /**
     * Returns a Linux GPU build image from AWS Deep Learning Containers.
     *
     * @param repositoryName the name of the repository,
     *   for example "pytorch-inference"
     * @param tag the tag of the image, for example "1.5.0-gpu-py36-cu101-ubuntu16.04"
     * @param account the AWS account ID where the DLC repository for this region is hosted in.
     *   In many cases, the CDK can infer that for you, but for some newer region our information
     *   might be out of date; in that case, you can specify the region explicitly using this optional parameter
     * @see https://aws.amazon.com/releasenotes/available-deep-learning-containers-images
     */
    static awsDeepLearningContainersImage(repositoryName: string, tag: string, account?: string): IBuildImage;
    /**
     * Returns a GPU image running Linux from an ECR repository.
     *
     * NOTE: if the repository is external (i.e. imported), then we won't be able to add
     * a resource policy statement for it so CodeBuild can pull the image.
     *
     * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-ecr.html
     *
     * @param repository The ECR repository
     * @param tag Image tag (default "latest")
     */
    static fromEcrRepository(repository: ecr.IRepository, tag?: string): IBuildImage;
    readonly type = "LINUX_GPU_CONTAINER";
    readonly defaultComputeType = ComputeType.LARGE;
    readonly imagePullPrincipalType?: ImagePullPrincipalType;
    readonly imageId: string;
    private _imageAccount?;
    private constructor();
    bind(scope: Construct, project: IProject, _options: BuildImageBindOptions): BuildImageConfig;
    validate(buildEnvironment: BuildEnvironment): string[];
    runScriptBuildspec(entrypoint: string): BuildSpec;
}
