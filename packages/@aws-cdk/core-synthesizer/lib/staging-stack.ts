import * as ecr from '@aws-cdk/aws-ecr';
import * as s3 from '@aws-cdk/aws-s3';
import { DockerImageAssetSource, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';

/**
 * Information on how a Staging Stack should look.
 */
export interface IStagingStack extends IConstruct {
  /**
   * // TODO
   */
  readonly stagingBucket: s3.Bucket;

  /**
   * // TODO
   */
  readonly stagingRepos: Record<string, ecr.Repository>;

  /**
   * // TODO
   */
  getCreateRepository(asset: DockerImageAssetSource): ecr.Repository;
}

/**
 * Staging Stack Properties
 */
export interface StagingStackProps extends StackProps {
}

/**
 * A default Staging Stack
 */
export class StagingStack extends Stack implements IStagingStack {
  /**
   * // TODO
   */
  public readonly stagingBucket: s3.Bucket;

  /**
   * // TODO
   */
  public readonly stagingRepos: Record<string, ecr.Repository>;

  constructor(scope: Construct, id: string, props: StagingStackProps = {}) {
    super(scope, id, props);

    this.stagingBucket = new s3.Bucket(this, 'StagingBucket', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.stagingRepos = {};
  }

  public getCreateRepository(asset: DockerImageAssetSource): ecr.Repository {
    // TODO: not the source hash! construct path
    if (this.stagingRepos[asset.sourceHash] === undefined) {
      this.stagingRepos[asset.sourceHash] = new ecr.Repository(this, `${asset.sourceHash}-repo`, {
        // TODO: lifecycle rules
      });
    }

    return this.stagingRepos[asset.sourceHash];
  }
}
