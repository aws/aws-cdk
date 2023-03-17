import * as ecr from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Arn, ArnFormat, Aws, BootstraplessSynthesizer, DockerImageAssetSource, FileAssetSource, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';
import { BootstrapRole } from './synthesizer';

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
export interface IDefaultStagingStack extends IConstruct {
  /**
   * App level unique identifier
   */
  readonly appId: string;

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
 * Default Staging Stack Properties
 */
export interface DefaultStagingStackProps extends StackProps {
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
  readonly fileAssetPublishingRole?: BootstrapRole;

  /**
   * Pass in an existing role to be used as the image publishing role.
   *
   * @default - a well-known name unique to this app/env.
   */
  readonly dockerAssetPublishingRole?: BootstrapRole;

  /**
   * Application identifier unique to the app.
   */
  readonly appId: string;
}

/**
 * A default Staging Stack
 */
export class DefaultStagingStack extends Stack implements IDefaultStagingStack {
  /**
   * Default asset publishing role name for file (S3) assets.
   */
  private get DEFAULT_FILE_ASSET_PUBLISHING_ROLE_NAME() {
    return `cdk-file-publishing-role-${this.region}-${this.appId}`.slice(0, 63);
  }

  /**
   * Default asset publishing role name for docker (ECR) assets.
   */
  private get DEFAULT_DOCKER_ASSET_PUBISHING_ROLE_NAME() {
    return `cdk-asset-publishing-role-${this.region}-${this.appId}`.slice(0, 63);
  }

  /**
   * The app-scoped, evironment-keyed staging bucket.
   */
  public readonly stagingBucket?: s3.Bucket;

  /**
   * The app-scoped, environment-keyed ecr repositories associated with this app.
   */
  public readonly stagingRepos: Record<string, ecr.Repository>;

  public readonly appId: string;
  private readonly stagingBucketName?: string;
  private fileAssetPublishingRole?: BootstrapRole;
  private dockerAssetPublishingRole?: BootstrapRole;

  constructor(scope: Construct, id: string, props: DefaultStagingStackProps) {
    super(scope, id, {
      ...props,
      synthesizer: new BootstraplessSynthesizer(),
    });

    this.appId = props.appId;

    this.stagingBucketName = props.stagingBucketName;
    this.fileAssetPublishingRole = props.fileAssetPublishingRole;
    this.dockerAssetPublishingRole = props.dockerAssetPublishingRole;
    this.stagingRepos = {};
  }

  /**
   * Returns the well-known arn of the file publishing role
   */
  private getCreateFilePublishingRole() {
    if (this.fileAssetPublishingRole) {
      return this.fileAssetPublishingRole.roleArn;
    }

    const roleId = 'CdkFilePublishingRole';
    const roleName = this.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_NAME;

    const createIamRole = () => {
      const role = new iam.Role(this, roleId, {
        roleName: roleName,
        assumedBy: new iam.ServicePrincipal('sts.amazonaws.com'),
      });
      role.addToPolicy(new iam.PolicyStatement({
        actions: [
          's3:GetObject*',
          's3:GetBucket*',
          's3:GetEncryptionConfiguration',
          's3:List*',
          's3:DeleteObject*',
          's3:PutObject*',
          's3:Abort*',
        ],
        resources: [
          this.getCreateBucket().bucketArn,
          `${this.getCreateBucket().bucketArn}/*`,
        ],
        effect: iam.Effect.ALLOW,
      }));
      return role;
    };

    // Create the default role if it does not exist yet
    this.node.tryFindChild(roleId) as iam.Role ?? createIamRole();
    return Arn.format({
      partition: this.partition ?? Aws.PARTITION,
      account: this.account ?? Aws.ACCOUNT_ID,
      region: this.region ?? Aws.REGION,
      service: 'iam',
      resource: 'role',
      resourceName: roleName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  /**
   * Returns the well-known name of the image publishing role
   */
  private getCreateImagePublishingRole() {
    if (this.dockerAssetPublishingRole) {
      return this.dockerAssetPublishingRole.roleArn;
    }

    const roleId = 'CdkDockerAssetPublishingRole';
    const roleName = this.DEFAULT_DOCKER_ASSET_PUBISHING_ROLE_NAME;

    const createIamRole = () => {
      const role = new iam.Role(this, roleId, {
        roleName: roleName,
        assumedBy: new iam.ServicePrincipal('sts.amazonaws.com'),
      });
      role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
      return role;
    };

    this.node.tryFindChild(roleId) as iam.Role ?? createIamRole();

    return Arn.format({
      partition: this.partition ?? Aws.PARTITION,
      account: this.account ?? Aws.ACCOUNT_ID,
      region: this.region ?? Aws.REGION,
      service: 'iam',
      resource: 'role',
      resourceName: roleName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }

  private getCreateBucket() {
    // Error: Resolution error: ID components may not include unresolved tokens:
    const stagingBucketName = this.stagingBucketName ?? `cdk-${this.account}-${this.region}-${this.appId.toLocaleLowerCase()}`;
    const bucketId = 'CdkStagingBucket';
    const bucket = this.node.tryFindChild(bucketId) as s3.Bucket ?? new s3.Bucket(this, bucketId, {
      bucketName: stagingBucketName,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    return {
      bucketName: stagingBucketName,
      bucketArn: bucket.bucketArn,
    };
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
      bucketName: this.getCreateBucket().bucketName,
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
