import * as ecr from '@aws-cdk/aws-ecr';
import * as core from '@aws-cdk/core';
import { FactName, RegionInfo } from '@aws-cdk/region-info';
import { Construct } from 'constructs';
import { BuildSpec } from './build-spec';
import { runScriptLinuxBuildSpec } from './private/run-script-linux-build-spec';
import {
  BuildEnvironment, BuildImageBindOptions, BuildImageConfig, ComputeType, IBindableBuildImage, IBuildImage,
  ImagePullPrincipalType, IProject,
} from './project';

const mappingName = 'AwsDeepLearningContainersRepositoriesAccounts';

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

  public readonly type = 'LINUX_GPU_CONTAINER';
  public readonly defaultComputeType = ComputeType.LARGE;
  public readonly imageId: string;
  public readonly imagePullPrincipalType?: ImagePullPrincipalType = ImagePullPrincipalType.SERVICE_ROLE;

  private readonly accountExpression: string;

  private constructor(private readonly repositoryName: string, tag: string, private readonly account: string | undefined) {
    this.accountExpression = account ?? core.Fn.findInMap(mappingName, core.Aws.REGION, 'repositoryAccount');
    this.imageId = `${this.accountExpression}.dkr.ecr.${core.Aws.REGION}.${core.Aws.URL_SUFFIX}/${repositoryName}:${tag}`;
  }

  public bind(scope: Construct, project: IProject, _options: BuildImageBindOptions): BuildImageConfig {
    if (!this.account) {
      const scopeStack = core.Stack.of(scope);
      // Unfortunately, the account IDs of the DLC repositories are not the same in all regions.
      // Because of that, use a (singleton) Mapping to find the correct account
      if (!scopeStack.node.tryFindChild(mappingName)) {
        const mapping: { [k1: string]: { [k2: string]: any } } = {};
        // get the accounts from the region-info module
        const region2Accounts = RegionInfo.regionMap(FactName.DLC_REPOSITORY_ACCOUNT);
        for (const [region, account] of Object.entries(region2Accounts)) {
          mapping[region] = { repositoryAccount: account };
        }
        new core.CfnMapping(scopeStack, mappingName, { mapping });
      }
    }

    const repository = ecr.Repository.fromRepositoryAttributes(scope, 'AwsDlcRepositoryCodeBuild', {
      repositoryName: this.repositoryName,
      repositoryArn: ecr.Repository.arnForLocalRepository(this.repositoryName, scope, this.accountExpression),
    });
    repository.grantPull(project);

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
