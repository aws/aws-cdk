import * as ecr from '@aws-cdk/aws-ecr';
import * as core from '@aws-cdk/core';
import { BuildSpec } from './build-spec';
import { runScriptLinuxBuildSpec } from './private/run-script-linux-build-spec';
import { BuildEnvironment, BuildImageConfig, ComputeType, IBuildImage, IBuildImageBind, ImagePullPrincipalType, IProject } from './project';

/**
 * A CodeBuild GPU image running Linux.
 *
 * This class has public constants that represent the most popular GPU images from AWS Deep Learning Containers.
 * Please note that these constants are not available in the following regions: ap-east-1, me-south-1, cn-north-1, cn-northwest-1.
 *
 * @see https://aws.amazon.com/releasenotes/available-deep-learning-containers-images
 */
export class LinuxGpuBuildImage implements IBuildImage {
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
   * @see https://aws.amazon.com/releasenotes/available-deep-learning-containers-images
   */
  private static awsDeepLearningContainersImage(repositoryName: string, tag: string): IBuildImage {
    return new LinuxGpuBuildImage(repositoryName, tag);
  }

  public readonly type = 'LINUX_GPU_CONTAINER';
  public readonly defaultComputeType = ComputeType.LARGE;
  public readonly imageId: string;
  public readonly imagePullPrincipalType?: ImagePullPrincipalType = ImagePullPrincipalType.SERVICE_ROLE;
  public readonly bind?: IBuildImageBind;

  private constructor(repositoryName: string, tag: string) {
    const mappingName = 'AwsDeepLearningContainersRepositoriesAccounts';
    const accountExpression = core.Fn.findInMap(mappingName, core.Aws.REGION, 'account');
    this.imageId = `${accountExpression}.dkr.ecr.${core.Aws.REGION}.${core.Aws.URL_SUFFIX}/${repositoryName}:${tag}`;
    this.bind = {
      bind(scope: core.Construct, project: IProject): BuildImageConfig {
        const scopeStack = core.Stack.of(scope);
        // Unfortunately, the account IDs of the DLC repositories are not the same in all regions.
        // Because of that, use a (singleton) Mapping to find the correct account
        if (!scopeStack.node.tryFindChild(mappingName)) {
          new core.CfnMapping(scopeStack, mappingName, {
            mapping: {
              'us-east-1':      { account: '763104351884' },
              'us-east-2':      { account: '763104351884' },
              'us-west-1':      { account: '763104351884' },
              'us-west-2':      { account: '763104351884' },
              'ca-central-1':   { account: '763104351884' },
              'eu-west-1':      { account: '763104351884' },
              'eu-west-2':      { account: '763104351884' },
              'eu-west-3':      { account: '763104351884' },
              'eu-central-1':   { account: '763104351884' },
              'eu-north-1':     { account: '763104351884' },
              'sa-east-1':      { account: '763104351884' },
              'ap-south-1':     { account: '763104351884' },
              'ap-northeast-1': { account: '763104351884' },
              'ap-northeast-2': { account: '763104351884' },
              'ap-southeast-1': { account: '763104351884' },
              'ap-southeast-2': { account: '763104351884' },

              'ap-east-1':      { account: '871362719292' },
              'me-south-1':     { account: '217643126080' },

              'cn-north-1':     { account: '727897471807' },
              'cn-northwest-1': { account: '727897471807' },
            },
          });
        }

        const repository = ecr.Repository.fromRepositoryAttributes(scope, 'AwsDlcRepositoryCodeBuild', {
          repositoryName,
          repositoryArn: scopeStack.formatArn({
            account: accountExpression,
            service: 'ecr',
            resource: 'repository',
            resourceName: repositoryName,
          }),
        });
        repository.grantPull(project);
        return {
        };
      },
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
