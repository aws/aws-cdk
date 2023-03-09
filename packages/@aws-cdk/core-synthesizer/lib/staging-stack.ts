import * as ecr from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Arn, ArnFormat, Aws, DockerImageAssetSource, FileAssetSource, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';

export interface FileAssetInfo {
  readonly bucketName: string;
  readonly assumeRoleArn: string;
}

export interface DockerAssetInfo {
  readonly repoName: string;
  readonly assumeRoleArn: string;
}
/**
 * Information on how a Staging Stack should look.
 */
export interface IStagingStack extends IConstruct {
  /**
   * The app-scoped, environment-keyed bucket created in this staging stack.
   */
  readonly stagingBucket?: s3.Bucket;

  /**
   * The app-scoped, environment-keyed repositories created in this staging stack.
   * A repository is created per image asset family.
   */
  readonly stagingRepos: Record<string, ecr.Repository>;

  /**
   * // TODO
   */
  addFile(asset: FileAssetSource): FileAssetInfo;

  /**
   * // TODO
   */
  addDockerImage(asset: DockerImageAssetSource): DockerAssetInfo;
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
  readonly fileAssetPublishingRoleName?: string;

  /**
   * Pass in an existing role to be used as the image publishing role.
   *
   * @default - a well-known name unique to this app/env.
   */
  readonly dockerAssetPublishingRoleName?: string;
}

/**
 * A default Staging Stack
 */
export class DefaultStagingStack extends Stack implements IStagingStack {
  /**
   * Default asset publishing role name for file (S3) assets.
   */
  private static readonly DEFAULT_FILE_ASSET_PUBLISHING_ROLE_NAME = 'cdk-${Qualifier}-file-publishing-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default asset publishing role name for docker (ECR) assets.
   */
  private static readonly DEFAULT_DOCKER_ASSET_PUBISHING_ROLE_NAME = 'cdk-${Qualifier}-asset-publishing-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * The app-scoped, evironment-keyed staging bucket.
   */
  public readonly stagingBucket?: s3.Bucket;

  /**
   * The app-scoped, environment-keyed ecr repositories associated with this app.
   */
  public readonly stagingRepos: Record<string, ecr.Repository>;

  private readonly stagingBucketName?: string;
  private fileAssetPublishingRoleName: string;
  private dockerAssetPublishingRoleName: string;

  constructor(scope: Construct, id: string, props: StagingStackProps = {}) {
    super(scope, id, props);

    this.stagingBucketName = props.stagingBucketName;
    this.fileAssetPublishingRoleName = props.fileAssetPublishingRoleName ?? DefaultStagingStack.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_NAME;
    this.dockerAssetPublishingRoleName = props.dockerAssetPublishingRoleName ?? DefaultStagingStack.DEFAULT_DOCKER_ASSET_PUBISHING_ROLE_NAME;
    this.stagingRepos = {};
  }

  /**
   * Returns the well-known name of the file publishing role
   */
  private getCreateFilePublishingRole() {
    this.node.tryFindChild(this.fileAssetPublishingRoleName) as iam.Role ?? new iam.Role(this, this.fileAssetPublishingRoleName, {
      roleName: DefaultStagingStack.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('sts.amazonaws.com'), // TODO actually create correct role
    });
    return Arn.format({
      partition: this.partition ?? Aws.PARTITION,
      account: this.account ?? Aws.ACCOUNT_ID,
      region: this.region ?? Aws.REGION,
      service: 'iam',
      resource: 'role',
      resourceName: DefaultStagingStack.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_NAME,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  /**
   * Returns the well-known name of the image publishing role
   */
  private getCreateImagePublishingRole() {
    this.node.tryFindChild(this.dockerAssetPublishingRoleName) as iam.Role ?? new iam.Role(this, this.dockerAssetPublishingRoleName, {
      roleName: DefaultStagingStack.DEFAULT_DOCKER_ASSET_PUBISHING_ROLE_NAME,
      assumedBy: new iam.ServicePrincipal('sts.amazonaws.com'), // TODO actually create correct role
    });
    return Arn.format({
      partition: this.partition ?? Aws.PARTITION,
      account: this.account ?? Aws.ACCOUNT_ID,
      region: this.region ?? Aws.REGION,
      service: 'iam',
      resource: 'role',
      resourceName: DefaultStagingStack.DEFAULT_DOCKER_ASSET_PUBISHING_ROLE_NAME,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  private getCreateBucket(): string {
    const stagingBucketName = this.stagingBucketName ?? 'default-bucket'; //`cdk-${this.account}-${this.region}`;
    this.node.tryFindChild(stagingBucketName) as s3.Bucket ?? new s3.Bucket(this, stagingBucketName, {
      bucketName: stagingBucketName,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    return stagingBucketName;
  }

  /**
   * Returns the well-known name of the repo
   */
  private getCreateRepo(asset: DockerImageAssetSource): string {
    if (!asset.uniqueId) {
      throw new Error('Assets synthesized with AppScopedStagingSynthesizer must include a \'uniqueId\' in the asset source definition.');
    }

    const repoName = `${asset.uniqueId}repo`.replace('.', '-'); // TODO: actually sanitize
    if (this.stagingRepos[asset.uniqueId] === undefined) {
      this.stagingRepos[asset.uniqueId] = new ecr.Repository(this, repoName, {
        repositoryName: repoName,
        // TODO: lifecycle rules
      });
    }
    return repoName;
  }

  public addFile(_asset: FileAssetSource): FileAssetInfo {
    return {
      bucketName: this.getCreateBucket(),
      assumeRoleArn: this.getCreateFilePublishingRole(),
    };
  }

  public addDockerImage(asset: DockerImageAssetSource): DockerAssetInfo {
    return {
      repoName: this.getCreateRepo(asset),
      assumeRoleArn: this.getCreateImagePublishingRole(),
    };
  }
}
