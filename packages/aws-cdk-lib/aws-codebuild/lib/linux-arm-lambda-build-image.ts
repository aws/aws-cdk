import { BuildSpec } from './build-spec';
import { runScriptLinuxBuildSpec } from './private/run-script-linux-build-spec';
import { BuildEnvironment, ComputeType, IBuildImage } from './project';

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
 * This class has a bunch of public constants that represent the CodeBuild aarch64 images.
 *
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
 */
export class LinuxArmLambdaBuildImage implements IBuildImage {
  /** Image "aws/codebuild/amazonlinux-aarch64-lambda-standard:nodejs18". */
  public static readonly AMAZON_LINUX_2_NODE_18 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:nodejs18');
  /** Image "aws/codebuild/amazonlinux-aarch64-lambda-standard:python3.11". */
  public static readonly AMAZON_LINUX_2_PYTHON_3_11 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:python3.11');
  /** Image "aws/codebuild/amazonlinux-aarch64-lambda-standard:ruby3.2". */
  public static readonly AMAZON_LINUX_2_RUBY_3_2 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:ruby3.2');
  /** Image "aws/codebuild/amazonlinux-aarch64-lambda-standard:corretto17". */
  public static readonly AMAZON_LINUX_2_CORRETTO_17 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:corretto17');
  /** Image "aws/codebuild/amazonlinux-aarch64-lambda-standard:corretto11". */
  public static readonly AMAZON_LINUX_2_CORRETTO_11 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:corretto11');
  /** Image "aws/codebuild/amazonlinux-aarch64-lambda-standard:go1.21". */
  public static readonly AMAZON_LINUX_2_GO_1_21 = LinuxArmLambdaBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux-aarch64-lambda-standard:go1.21');
  /** Image "aws/codebuild/amazonlinux-aarch64-lambda-standard:dotnet6". */
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

  /**
   * Validates by checking unsupported property and compute type
   * @param buildEnvironment BuildEnvironment
   */
  public validate(buildEnvironment: BuildEnvironment): string[] {
    const ret = [];

    if (buildEnvironment.privileged) {
      ret.push('Lambda compute type does not support Privileged mode');
    }

    const lambdaComputeTypes = Object.values(ComputeType).filter(value => value.startsWith('BUILD_LAMBDA'));
    if (buildEnvironment.computeType && !lambdaComputeTypes.includes(buildEnvironment.computeType)) {
      ret.push(`Lambda images only support ComputeTypes between '${ComputeType.LAMBDA_1GB}' and '${ComputeType.LAMBDA_10GB}' - ` +
               `'${buildEnvironment.computeType}' was given`);
    }

    return ret;
  }

  public runScriptBuildspec(entrypoint: string): BuildSpec {
    return runScriptLinuxBuildSpec(entrypoint);
  }
}
