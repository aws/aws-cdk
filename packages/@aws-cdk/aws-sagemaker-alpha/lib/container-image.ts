import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as assets from 'aws-cdk-lib/aws-ecr-assets';
import { Construct } from 'constructs';
import { Model } from './model';
import { hashcode } from './private/util';
import { FactName } from 'aws-cdk-lib/region-info';
import { Stack } from 'aws-cdk-lib/core';

/**
 * The configuration for creating a container image.
 */
export interface ContainerImageConfig {
  /**
   * The image name. Images in Amazon ECR repositories can be specified by either using the full registry/repository:tag or
   * registry/repository@digest.
   *
   * For example, `012345678910.dkr.ecr.<region-name>.amazonaws.com/<repository-name>:latest` or
   * `012345678910.dkr.ecr.<region-name>.amazonaws.com/<repository-name>@sha256:94afd1f2e64d908bc90dbca0035a5b567EXAMPLE`.
   */
  readonly imageName: string;
}

/**
 * Constructs for types of container images
 */
export abstract class ContainerImage {
  /**
   * Reference an image in an ECR repository
   */
  public static fromEcrRepository(repository: ecr.IRepository, tag: string = 'latest'): ContainerImage {
    return new EcrImage(repository, tag);
  }

  /**
   * Reference an image that's constructed directly from sources on disk
   * @param directory The directory where the Dockerfile is stored
   * @param options The options to further configure the selected image
   */
  public static fromAsset(directory: string, options: assets.DockerImageAssetOptions = {}): ContainerImage {
    return new AssetImage(directory, options);
  }

  /**
   * Reference an AWS Deep Learning Container image
   */
  public static fromDlc(repositoryName: string, tag: string, accountId?: string): ContainerImage {
    return new DlcEcrImage(repositoryName, tag, accountId);
  }

  /**
   * Called when the image is used by a Model
   */
  public abstract bind(scope: Construct, model: Model): ContainerImageConfig;
}

class EcrImage extends ContainerImage {
  constructor(private readonly repository: ecr.IRepository, private readonly tag: string) {
    super();
  }

  public bind(_scope: Construct, model: Model): ContainerImageConfig {
    this.repository.grantPull(model);

    return {
      imageName: this.repository.repositoryUriForTag(this.tag),
    };
  }
}

class AssetImage extends ContainerImage {
  private asset?: assets.DockerImageAsset;

  constructor(private readonly directory: string, private readonly options: assets.DockerImageAssetOptions = {}) {
    super();
  }

  public bind(scope: Construct, model: Model): ContainerImageConfig {
    // Retain the first instantiation of this asset
    if (!this.asset) {
      this.asset = new assets.DockerImageAsset(scope, `ModelImage${hashcode(this.directory)}`, {
        directory: this.directory,
        ...this.options,
      });
    }

    this.asset.repository.grantPull(model);

    return {
      imageName: this.asset.imageUri,
    };
  }
}

class DlcEcrImage extends ContainerImage {
  constructor(private readonly repositoryName: string, private readonly tag: string, private readonly accountId?: string) {
    super();
  }

  public bind(scope: Construct, model: Model): ContainerImageConfig {
    const accountId = this.accountId ?? Stack.of(scope).regionalFact(FactName.DLC_REPOSITORY_ACCOUNT);

    const repository = ecr.Repository.fromRepositoryAttributes(scope, 'DlcRepository', {
      repositoryName: this.repositoryName,
      repositoryArn: ecr.Repository.arnForLocalRepository(
        this.repositoryName,
        scope,
        accountId,
      ),
    });

    repository.grantPull(model);

    return { imageName: `${repository.repositoryUri}:${this.tag}` };
  }
}
