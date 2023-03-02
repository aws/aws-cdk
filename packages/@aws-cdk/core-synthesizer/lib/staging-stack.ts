import * as ecr from '@aws-cdk/aws-ecr';
import * as s3 from '@aws-cdk/aws-s3';
import { App, DockerImageAssetSource, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';

export interface IStagingStack {
  readonly stagingBucket: s3.Bucket;
  readonly stagingRepos: Record<string, ecr.Repository>;

  locateRepo(asset: DockerImageAssetSource): ecr.Repository;
}

export interface StagingStackProps extends StackProps {
}

export class StagingStack extends Stack implements IStagingStack {
  public readonly stagingBucket: s3.Bucket;
  public readonly stagingRepos: Record<string, ecr.Repository>;

  constructor(scope: App, id: string, props: StagingStackProps) {
    super(scope, id, props);

    this.stagingBucket = new s3.Bucket(this, 'StagingBucket', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.stagingRepos = {};
  }

  public locateRepo(asset: DockerImageAssetSource): ecr.Repository {
    // TODO: not the source hash! construct path
    return this.stagingRepos[asset.sourceHash];
  }
}
