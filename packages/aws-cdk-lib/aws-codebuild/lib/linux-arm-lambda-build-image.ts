import { BuildSpec } from './build-spec';
import { ComputeType } from './compute-type';
import { runScriptLinuxBuildSpec } from './private/run-script-linux-build-spec';
import { BuildEnvironment, IBuildImage, isLambdaComputeType } from './project';

/**
 * Construction properties of `LinuxArmLambdaBuildImage`.
 * Module-private, as the constructor of `LinuxArmLambdaBuildImage` is private.
 */
interface LinuxArmLambdaBuildImageProps {
  readonly imageId: string;
}

/**
 * A CodeBuild image running aarch64 Lambda.
 *
 * This class has a bunch of public constants that represent the CodeBuild aarch64 Lambda images.
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
 */
export class LinuxArmLambdaBuildImage implements IBuildImage {
  /** The `aws/codebuild/amazonlinux-aarch64-lambda-standard:nodejs18` build image. */
  public static readonly AMAZON_LINUX_2_NODE_18 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:nodejs18');
  /** The `aws/codebuild/amazonlinux-aarch64-lambda-standard:nodejs20` build image. */
  public static readonly AMAZON_LINUX_2023_NODE_20 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:nodejs20');
  /** The `aws/codebuild/amazonlinux-aarch64-lambda-standard:python3.11` build image. */
  public static readonly AMAZON_LINUX_2_PYTHON_3_11 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:python3.11');
  /** The `aws/codebuild/amazonlinux-aarch64-lambda-standard:python3.12` build image. */
  public static readonly AMAZON_LINUX_2023_PYTHON_3_12 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:python3.12');
  /** The `aws/codebuild/amazonlinux-aarch64-lambda-standard:ruby3.2` build image. */
  public static readonly AMAZON_LINUX_2_RUBY_3_2 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:ruby3.2');
  /** The `aws/codebuild/amazonlinux-aarch64-lambda-standard:corretto21` build image. */
  public static readonly AMAZON_LINUX_2023_CORRETTO_21 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:corretto21');
  /** The `aws/codebuild/amazonlinux-aarch64-lambda-standard:corretto17` build image. */
  public static readonly AMAZON_LINUX_2_CORRETTO_17 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:corretto17');
  /** The `aws/codebuild/amazonlinux-aarch64-lambda-standard:corretto11` build image. */
  public static readonly AMAZON_LINUX_2_CORRETTO_11 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:corretto11');
  /** The `aws/codebuild/amazonlinux-aarch64-lambda-standard:go1.21` build image. */
  public static readonly AMAZON_LINUX_2_GO_1_21 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:go1.21');
  /** The `aws/codebuild/amazonlinux-aarch64-lambda-standard:dotnet6` build image. */
  public static readonly AMAZON_LINUX_2_DOTNET_6 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:dotnet6');

  /**
   * Uses a Docker image provided by CodeBuild.
   *
   * NOTE: In Lambda compute, since only specified images can be used, this method is set to private.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
   *
   * @param id The image identifier
   * @example 'aws/codebuild/amazonlinux-aarch64-lambda-standard:nodejs18'
   * @returns A Docker image provided by CodeBuild.
   */
  private static fromCodeBuildImageId(id: string): IBuildImage {
    return new LinuxArmLambdaBuildImage({
      imageId: id,
    });
  }

  public readonly type = 'ARM_LAMBDA_CONTAINER';
  public readonly defaultComputeType = ComputeType.LAMBDA_1GB;
  public readonly imageId: string;

  private constructor(props: LinuxArmLambdaBuildImageProps) {
    this.imageId = props.imageId;
  }

  public validate(buildEnvironment: BuildEnvironment): string[] {
    const errors = [];

    if (buildEnvironment.privileged) {
      errors.push('Lambda compute type does not support privileged mode');
    }

    if (buildEnvironment.computeType && !isLambdaComputeType(buildEnvironment.computeType)) {
      errors.push([
        'Lambda images only support Lambda ComputeTypes between',
        `'${ComputeType.LAMBDA_1GB}'`,
        'and',
        `'${ComputeType.LAMBDA_10GB}',`,
        `got '${buildEnvironment.computeType}'`,
      ].join(' '));
    }

    return errors;
  }

  public runScriptBuildspec(entrypoint: string): BuildSpec {
    return runScriptLinuxBuildSpec(entrypoint);
  }
}
