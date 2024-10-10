import { BuildSpec } from './build-spec';
import { ComputeType } from './compute-type';
import { EnvironmentType } from './environment-type';
import { runScriptLinuxBuildSpec } from './private/run-script-linux-build-spec';
import { BuildEnvironment, IBuildImage, ImagePullPrincipalType, DockerImageOptions, isLambdaComputeType } from './project';
import * as ecr from '../../aws-ecr';
import * as secretsmanager from '../../aws-secretsmanager';

/**
 * Construction properties of `LinuxArmBuildImage`.
 * Module-private, as the constructor of `LinuxArmBuildImage` is private.
 */
interface LinuxArmBuildImageProps {
  readonly imageId: string;
  readonly imagePullPrincipalType?: ImagePullPrincipalType;
  readonly secretsManagerCredentials?: secretsmanager.ISecret;
  readonly repository?: ecr.IRepository;
}

/**
 * A CodeBuild image running aarch64 Linux.
 *
 * This class has a bunch of public constants that represent the CodeBuild ARM images.
 *
 * You can also specify a custom image using the static method:
 *
 * - LinuxBuildImage.fromEcrRepository(repo[, tag])
 * - LinuxBuildImage.fromDockerRegistry(image[, { secretsManagerCredentials }])
 *
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
 */
export class LinuxArmBuildImage implements IBuildImage {
  /**
   * Image "aws/codebuild/amazonlinux2-aarch64-standard:1.0".
   * @deprecated Use {@link LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0} instead.
   * */
  public static readonly AMAZON_LINUX_2_STANDARD_1_0 = LinuxArmBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux2-aarch64-standard:1.0');
  /** Image "aws/codebuild/amazonlinux2-aarch64-standard:2.0" based on Amazon Linux 2. */
  public static readonly AMAZON_LINUX_2_STANDARD_2_0 = LinuxArmBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux2-aarch64-standard:2.0');
  /** Image "aws/codebuild/amazonlinux2-aarch64-standard:3.0" based on Amazon Linux 2023. */
  public static readonly AMAZON_LINUX_2_STANDARD_3_0 = LinuxArmBuildImage.fromCodeBuildImageId('aws/codebuild/amazonlinux2-aarch64-standard:3.0');

  /**
   * @returns a aarch-64 Linux build image from a Docker Hub image.
   */
  public static fromDockerRegistry(name: string, options: DockerImageOptions = {}): IBuildImage {
    return new LinuxArmBuildImage({
      ...options,
      imageId: name,
      imagePullPrincipalType: ImagePullPrincipalType.SERVICE_ROLE,
    });
  }

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
  public static fromEcrRepository(repository: ecr.IRepository, tagOrDigest: string = 'latest'): IBuildImage {
    return new LinuxArmBuildImage({
      imageId: repository.repositoryUriForTagOrDigest(tagOrDigest),
      imagePullPrincipalType: ImagePullPrincipalType.SERVICE_ROLE,
      repository,
    });
  }

  /**
   * Uses a Docker image provided by CodeBuild.
   *
   * @see https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-available.html
   *
   * @param id The image identifier
   * @example 'aws/codebuild/amazonlinux2-aarch64-standard:1.0'
   * @returns A Docker image provided by CodeBuild.
   */
  public static fromCodeBuildImageId(id: string): IBuildImage {
    return new LinuxArmBuildImage({
      imageId: id,
      imagePullPrincipalType: ImagePullPrincipalType.CODEBUILD,
    });
  }

  public readonly type = EnvironmentType.ARM_CONTAINER as string;
  public readonly defaultComputeType = ComputeType.LARGE;
  public readonly imageId: string;
  public readonly imagePullPrincipalType?: ImagePullPrincipalType;
  public readonly secretsManagerCredentials?: secretsmanager.ISecret;
  public readonly repository?: ecr.IRepository;

  private constructor(props: LinuxArmBuildImageProps) {
    this.imageId = props.imageId;
    this.imagePullPrincipalType = props.imagePullPrincipalType;
    this.secretsManagerCredentials = props.secretsManagerCredentials;
    this.repository = props.repository;
  }

  /**
   * Validates by checking the BuildEnvironments' images are not Lambda ComputeTypes
   * @param buildEnvironment BuildEnvironment
   */
  public validate(buildEnvironment: BuildEnvironment): string[] {
    const ret = [];
    if (buildEnvironment.computeType && isLambdaComputeType(buildEnvironment.computeType)) {
      ret.push(`ARM images do not support Lambda ComputeTypes, got ${buildEnvironment.computeType}`);
    }
    return ret;
  }

  public runScriptBuildspec(entrypoint: string): BuildSpec {
    return runScriptLinuxBuildSpec(entrypoint);
  }
}
