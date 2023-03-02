import { App, AssetManifestBuilder, DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource, IBoundStackSynthesizer, IReusableStackSynthesizer, ISynthesisSession, Stack, StackSynthesizer } from '@aws-cdk/core';
import { assertBound } from '@aws-cdk/core/lib/stack-synthesizers/_shared';
import { IStagingStack, StagingStack } from './staging-stack';

export interface NewStackSynthesizerProps {
  stagingStack?: IStagingStack;
}

export class NewStackSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer, IBoundStackSynthesizer {
  private qualifier?: string;
  private stagingStack: IStagingStack;
  private assetManifest = new AssetManifestBuilder();

  constructor(props: NewStackSynthesizerProps = {}) {
    super();

    // TODO: ensure no tokens

    // TODO: revisit scope
    this.stagingStack = props.stagingStack ?? new StagingStack(new App(), 'StagingStack', {});
  }

  public reusableBind(stack: Stack): IBoundStackSynthesizer {
    // Create a copy of the current object and bind that
    const copy = Object.create(this);
    copy.bind(stack);
    return copy;
  }

  public synthesize(_session: ISynthesisSession): void {
    assertBound(this.qualifier);

    // TODO: finish implementing
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    assertBound(this.stagingStack.stagingBucket.bucketName);

    const location = this.assetManifest.defaultAddFileAsset(this.boundStack, asset, {
      bucketName: this.stagingStack.stagingBucket.bucketName,
      // TODO: more props
    });
    return this.cloudFormationLocationFromFileAsset(location);
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    const repo = this.stagingStack.locateRepo(asset);
    assertBound(repo.repositoryName);

    const location = this.assetManifest.defaultAddDockerImageAsset(this.boundStack, asset, {
      repositoryName: repo.repositoryName,
      // TODO: more props
    });
    return this.cloudFormationLocationFromDockerImageAsset(location);
  }
}
