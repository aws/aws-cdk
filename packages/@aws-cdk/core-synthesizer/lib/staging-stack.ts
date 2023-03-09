import * as ecr from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { DockerImageAssetSource, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';

/**
 * Information on how a Staging Stack should look.
 */
export interface IStagingStack extends IConstruct {
  /**
   * The app-scoped, environment-keyed bucket created in this staging stack.
   */
  readonly stagingBucket: s3.Bucket;

  /**
   * The well-known name of the app-scpoed, environment-keyed bucket created in this staging stack.
   */
  readonly stagingBucketName: string;

  /**
   * The app-scoped, environment-keyed repositories created in this staging stack.
   * A repository is created per image asset family.
   */
  readonly stagingRepos: Record<string, ecr.Repository>;

  /**
   * The well-known name of the IAM role assumed for publishing to s3.
   */
  readonly fileAssetPublishingRoleArn: string;

  /**
   * The well-known name of the IAM role assumed for publishing to ecr.
   */
  readonly dockerAssetPublishingRoleArn: string;

  /**
   * Returns the well-known name of the app-scoped, environment-keyed repository associated
   * with the given asset.
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
   * @default - a well-known name unique to this app/env.
   */
  readonly stagingBucketName?: string;

  /**
   * Pass in an existing role to be used as the file publishing role.
   *
   * @default - a well-known name unique to this app/env.
   */
  readonly fileAssetPublishingRoleArn?: string;

  /**
   * Pass in an existing role to be used as the image publishing role.
   *
   * @default - a well-known name unique to this app/env.
   */
  readonly dockerAssetPublishingRoleArn?: string;
}

/**
 * A default Staging Stack
 */
export class DefaultStagingStack extends Stack implements IStagingStack {
  /**
   * Default asset publishing role ARN for file (S3) assets.
   */
  public static readonly DEFAULT_FILE_ASSET_PUBLISHING_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-file-publishing-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default asset publishing role ARN for docker (ECR) assets.
   */
  public static readonly DEFAULT_DOCKER_ASSET_PUBISHING_ROLE_ARN = 'cdk-${Qualifier}-asset-publishing-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * The app-scoped, evironment-keyed staging bucket.
   */
  public readonly stagingBucket: s3.Bucket;

  /**
   * The app-scoped, environment-keyed ecr repositories associated with this app.
   */
  public readonly stagingRepos: Record<string, ecr.Repository>;

  /**
   * The well-known arn of the file asset publishing role.
   */
  public readonly fileAssetPublishingRoleArn: string;

  /**
   * The well-known arn of the docker asset publishing role.
   */
  public readonly dockerAssetPublishingRoleArn: string;

  /**
   * The well known name of the staging bucket
   */
  public readonly stagingBucketName: string;

  constructor(scope: Construct, id: string, props: StagingStackProps = {}) {
    super(scope, id, props);

    this.fileAssetPublishingRoleArn = props.fileAssetPublishingRoleArn ?? DefaultStagingStack.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_ARN;
    if (!props.fileAssetPublishingRoleArn) {
      new iam.Role(this, 'File-Asset-Publishing-Role', {
        roleName: DefaultStagingStack.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_ARN.split('/')[1],
        assumedBy: new iam.ServicePrincipal('sts.amazonaws.com'),
      });
    }
    this.dockerAssetPublishingRoleArn = props.dockerAssetPublishingRoleArn ?? DefaultStagingStack.DEFAULT_DOCKER_ASSET_PUBISHING_ROLE_ARN;
    if (!props.dockerAssetPublishingRoleArn) {
      new iam.Role(this, 'Docker-Asset-Publishing-Role', {
        roleName: DefaultStagingStack.DEFAULT_DOCKER_ASSET_PUBISHING_ROLE_ARN.split('/')[1],
        assumedBy: new iam.ServicePrincipal('sts.amazonaws.com'),
      });
    }

    this.stagingBucketName = props.stagingBucketName ?? 'default-bucket'; //`cdk-${this.account}-${this.region}`;
    this.stagingBucket = new s3.Bucket(this, 'StagingBucket', {
      bucketName: this.stagingBucketName,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.stagingRepos = {};
  }

  public getRepoName(asset: DockerImageAssetSource): string {
    if (!asset.uniqueId) {
      throw new Error('Assets synthesized with AppScopedStagingSynthesizer must include a \'uniqueId\' in the asset source definition.');
    }

    const repoName = `${asset.uniqueId}repo`.replace('.', '-'); // TODO: actually sanitize
    console.log(repoName);
    if (this.stagingRepos[asset.uniqueId] === undefined) {
      this.stagingRepos[asset.uniqueId] = new ecr.Repository(this, repoName, {
        repositoryName: repoName,
        // TODO: lifecycle rules
      });
    }
    return repoName;
  }
}
