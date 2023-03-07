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
  readonly stagingBucketName: string;

  /**
   * // TODO
   */
  readonly stagingRepos: Record<string, ecr.Repository>;

  /**
   * // TODO
   */
  readonly fileAssetPublishingRoleArn: string;

  /**
   * // TODO
   */
  readonly dockerAssetPublishingRoleArn: string;

  /**
   * // TODO
   */
  getRepoName(asset: DockerImageAssetSource): string;
}

/**
 * Staging Stack Properties
 */
export interface StagingStackProps extends StackProps {
  /**
   * Explicit name for the staging bucket
   *
   * @default - DEFAULT
   */
  readonly stagingBucketName?: string;
}

/**
 * A default Staging Stack
 */
export class StagingStack extends Stack implements IStagingStack {
  /**
   * Default asset publishing role ARN for file (S3) assets.
   */
  public static readonly DEFAULT_FILE_ASSET_PUBLISHING_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-file-publishing-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * // TODO
   */
  public readonly stagingBucket: s3.Bucket;

  /**
   * // TODO
   */
  public readonly stagingRepos: Record<string, ecr.Repository>;

  public readonly fileAssetPublishingRoleArn: string;
  public readonly dockerAssetPublishingRoleArn: string;

  /**
   * // TODO
   */
  public readonly stagingBucketName: string;

  constructor(scope: Construct, id: string, props: StagingStackProps = {}) {
    super(scope, id, props);

    this.fileAssetPublishingRoleArn = 'file-asset-placeholder-arn';
    this.dockerAssetPublishingRoleArn = 'docker-asset-placeholder-arn';

    this.stagingBucketName = props.stagingBucketName ?? 'default-bucket';
    this.stagingBucket = new s3.Bucket(this, 'StagingBucket', {
      bucketName: this.stagingBucketName,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.stagingRepos = {};
  }

  public getRepoName(asset: DockerImageAssetSource): string {
    // This may work for now. At least one of directoryName or executable is required
    const uniqueId = asset.directoryName ?? asset.executable!.toString();
    const repoName = `a${uniqueId}repo`.replace('.', '-'); // TODO: actually sanitize
    console.log(repoName);
    if (this.stagingRepos[uniqueId] === undefined) {
      this.stagingRepos[uniqueId] = new ecr.Repository(this, repoName, {
        repositoryName: repoName,
        // TODO: lifecycle rules
      });
    }
    return repoName;
  }
}
