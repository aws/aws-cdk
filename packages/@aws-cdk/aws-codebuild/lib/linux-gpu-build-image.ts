import * as ecr from '@aws-cdk/aws-ecr';
import * as core from '@aws-cdk/core';
import { FactName } from '@aws-cdk/region-info';
import { Construct } from 'constructs';
import { BuildSpec } from './build-spec';
import { runScriptLinuxBuildSpec } from './private/run-script-linux-build-spec';
import {
  BuildEnvironment, BuildImageBindOptions, BuildImageConfig, ComputeType, IBindableBuildImage, IBuildImage,
  ImagePullPrincipalType, IProject,
} from './project';

/**
 * A CodeBuild GPU image running Linux.
 *
 * This class has public constants that represent the most popular GPU images from AWS Deep Learning Containers.
 *
 * @see https://aws.amazon.com/releasenotes/available-deep-learning-containers-images
 */
export class LinuxGpuBuildImage implements IBindableBuildImage {
  /** Tensorflow 1.14.0 GPU image from AWS Deep Learning Containers. */
  public static readonly DLC_TENSORFLOW_1_14_0 = LinuxGpuBuildImage.awsDeepLearningContainersImage('tensorflow-training',
    '1.14.0-gpu-py36-cu100-ubuntu16.04');
  /** Tensorflow 1.15.0 GPU image from AWS Deep Learning Containers. */
  public static readonly DLC_TENSORFLOW_1_15_0 = LinuxGpuBuildImage.awsDeepLearningContainersImage('tensorflow-training',
    '1.15.0-gpu-py36-cu100-ubuntu18.04');
  /** Tensorflow 1.15.2 GPU training image from AWS Deep Learning Containers. */
  public static readonly DLC_TENSORFLOW_1_15_2_TRAINING = LinuxGpuBuildImage.awsDeepLearningContainersImage('tensorflow-training',
    '1.15.2-gpu-py37-cu100-ubuntu18.04');
  /** Tensorflow 1.15.2 GPU inference image from AWS Deep Learning Containers. */
  public static readonly DLC_TENSORFLOW_1_15_2_INFERENCE = LinuxGpuBuildImage.awsDeepLearningContainersImage('tensorflow-inference',
    '1.15.2-gpu-py36-cu100-ubuntu18.04');
  /** Tensorflow 2.0.0 GPU image from AWS Deep Learning Containers. */
  public static readonly DLC_TENSORFLOW_2_0_0 = LinuxGpuBuildImage.awsDeepLearningContainersImage('tensorflow-training',
    '2.0.0-gpu-py36-cu100-ubuntu18.04');
  /** Tensorflow 2.0.1 GPU image from AWS Deep Learning Containers. */
  public static readonly DLC_TENSORFLOW_2_0_1 = LinuxGpuBuildImage.awsDeepLearningContainersImage('tensorflow-training',
    '2.0.1-gpu-py36-cu100-ubuntu18.04');
  /** Tensorflow 2.1.0 GPU training image from AWS Deep Learning Containers. */
  public static readonly DLC_TENSORFLOW_2_1_0_TRAINING = LinuxGpuBuildImage.awsDeepLearningContainersImage('tensorflow-training',
    '2.1.0-gpu-py36-cu101-ubuntu18.04');
  /** Tensorflow 2.1.0 GPU inference image from AWS Deep Learning Containers. */
  public static readonly DLC_TENSORFLOW_2_1_0_INFERENCE = LinuxGpuBuildImage.awsDeepLearningContainersImage('tensorflow-inference',
    '2.1.0-gpu-py36-cu101-ubuntu18.04');
  /** Tensorflow 2.2.0 GPU training image from AWS Deep Learning Containers. */
  public static readonly DLC_TENSORFLOW_2_2_0_TRAINING = LinuxGpuBuildImage.awsDeepLearningContainersImage('tensorflow-training',
    '2.2.0-gpu-py37-cu101-ubuntu18.04');

  /** PyTorch 1.2.0 GPU image from AWS Deep Learning Containers. */
  public static readonly DLC_PYTORCH_1_2_0 = LinuxGpuBuildImage.awsDeepLearningContainersImage('pytorch-training',
    '1.2.0-gpu-py36-cu100-ubuntu16.04');
  /** PyTorch 1.3.1 GPU image from AWS Deep Learning Containers. */
  public static readonly DLC_PYTORCH_1_3_1 = LinuxGpuBuildImage.awsDeepLearningContainersImage('pytorch-training',
    '1.3.1-gpu-py36-cu101-ubuntu16.04');
  /** PyTorch 1.4.0 GPU training image from AWS Deep Learning Containers. */
  public static readonly DLC_PYTORCH_1_4_0_TRAINING = LinuxGpuBuildImage.awsDeepLearningContainersImage('pytorch-training',
    '1.4.0-gpu-py36-cu101-ubuntu16.04');
  /** PyTorch 1.4.0 GPU inference image from AWS Deep Learning Containers. */
  public static readonly DLC_PYTORCH_1_4_0_INFERENCE = LinuxGpuBuildImage.awsDeepLearningContainersImage('pytorch-inference',
    '1.4.0-gpu-py36-cu101-ubuntu16.04');
  /** PyTorch 1.5.0 GPU training image from AWS Deep Learning Containers. */
  public static readonly DLC_PYTORCH_1_5_0_TRAINING = LinuxGpuBuildImage.awsDeepLearningContainersImage('pytorch-training',
    '1.5.0-gpu-py36-cu101-ubuntu16.04');
  /** PyTorch 1.5.0 GPU inference image from AWS Deep Learning Containers. */
  public static readonly DLC_PYTORCH_1_5_0_INFERENCE = LinuxGpuBuildImage.awsDeepLearningContainersImage('pytorch-inference',
    '1.5.0-gpu-py36-cu101-ubuntu16.04');

  /** MXNet 1.4.1 GPU image from AWS Deep Learning Containers. */
  public static readonly DLC_MXNET_1_4_1 = LinuxGpuBuildImage.awsDeepLearningContainersImage('mxnet-training',
    '1.4.1-gpu-py36-cu100-ubuntu16.04');
  /** MXNet 1.6.0 GPU image from AWS Deep Learning Containers. */
  public static readonly DLC_MXNET_1_6_0 = LinuxGpuBuildImage.awsDeepLearningContainersImage('mxnet-training',
    '1.6.0-gpu-py36-cu101-ubuntu16.04');

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
  public static awsDeepLearningContainersImage(repositoryName: string, tag: string, account?: string): IBuildImage {
    return new LinuxGpuBuildImage(repositoryName, tag, account);
  }


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
  public static fromEcrRepository(repository: ecr.IRepository, tag: string = 'latest'): IBuildImage {
    return new LinuxGpuBuildImage(repository.repositoryName, tag, repository.env.account);
  }

  public readonly type = 'LINUX_GPU_CONTAINER';
  public readonly defaultComputeType = ComputeType.LARGE;
  public readonly imagePullPrincipalType?: ImagePullPrincipalType = ImagePullPrincipalType.SERVICE_ROLE;
  public readonly imageId: string;

  private _imageAccount?: string;

  private constructor(private readonly repositoryName: string, tag: string, private readonly account: string | undefined) {
    const imageAccount = account ?? core.Lazy.string({
      produce: () => {
        if (this._imageAccount === undefined) {
          throw new Error('Make sure this \'LinuxGpuBuildImage\' is used in a CodeBuild Project construct');
        }
        return this._imageAccount;
      },
    });

    // The value of imageId below *should* have been `Lazy.stringValue(() => repository.repositoryUriForTag(this.tag))`,
    // but we can't change that anymore because someone somewhere might at this point have written code
    // to do `image.imageId.includes('pytorch')` and changing this to a full-on token would break them.
    this.imageId = `${imageAccount}.dkr.ecr.${core.Aws.REGION}.${core.Aws.URL_SUFFIX}/${repositoryName}:${tag}`;
  }

  public bind(scope: Construct, project: IProject, _options: BuildImageBindOptions): BuildImageConfig {
    const account = this.account ?? core.Stack.of(scope).regionalFact(FactName.DLC_REPOSITORY_ACCOUNT);
    const repository = ecr.Repository.fromRepositoryAttributes(scope, 'AwsDlcRepositoryCodeBuild', {
      repositoryName: this.repositoryName,
      repositoryArn: ecr.Repository.arnForLocalRepository(this.repositoryName, scope, account),
    });

    repository.grantPull(project);

    this._imageAccount = account;

    return {
    };
  }

  public validate(buildEnvironment: BuildEnvironment): string[] {
    const ret = [];
    if (buildEnvironment.computeType &&
        buildEnvironment.computeType !== ComputeType.LARGE) {
      ret.push(`GPU images only support ComputeType '${ComputeType.LARGE}' - ` +
        `'${buildEnvironment.computeType}' was given`);
    }
    return ret;
  }

  public runScriptBuildspec(entrypoint: string): BuildSpec {
    return runScriptLinuxBuildSpec(entrypoint);
  }
}
