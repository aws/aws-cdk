import * as ecr from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as kms from '@aws-cdk/aws-kms';
import { App, Arn, ArnFormat, Aws, BootstraplessSynthesizer, DockerImageAssetSource, FileAssetSource, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
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
export interface IStagingStack extends IConstruct {
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

  readonly dependencyStack: Stack;

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

  readonly repositoryLifecycleRules?: StagingRepoLifecycleRule[];
}

export interface StagingRepoLifecycleRule {
  readonly lifecycleRules: ecr.LifecycleRule[];
  readonly assets: string[];
}

/**
 * A default Staging Stack
 */
export class DefaultStagingStack extends Stack implements IStagingStack {
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

  public readonly dependencyStack: Stack;
  public readonly appId: string;
  private readonly stagingBucketName?: string;
  private fileAssetPublishingRole?: BootstrapRole;
  private dockerAssetPublishingRole?: BootstrapRole;
  private readonly repositoryLifecycleRules: Record<string, ecr.LifecycleRule[]>;

  constructor(scope: App, id: string, props: DefaultStagingStackProps) {
    super(scope, id, {
      ...props,
      synthesizer: new BootstraplessSynthesizer(),
    });

    if (scope._appId === undefined) {
      throw new Error('DefaultStagingStack can only be used on Apps with a user-specified appId, but no appId found.');
    }

    this.appId = scope._appId;
    this.dependencyStack = this;

    this.stagingBucketName = props.stagingBucketName;
    this.fileAssetPublishingRole = props.fileAssetPublishingRole;
    this.dockerAssetPublishingRole = props.dockerAssetPublishingRole;
    this.repositoryLifecycleRules = this.processLifecycleRules(props.repositoryLifecycleRules ?? []);
    this.stagingRepos = {};
  }

  private processLifecycleRules(rules: StagingRepoLifecycleRule[]) {
    const ruleMap: Record<string, ecr.LifecycleRule[]> = {};
    for (const rule of rules) {
      for (const asset of rule.assets) {
        if (ruleMap[asset] === undefined) {
          ruleMap[asset] = [];
        }
        ruleMap[asset].push(...rule.lifecycleRules);
      }
    }
    return ruleMap;
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
      const bucket = this.getCreateBucket();
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
          bucket.bucketArn,
          `${bucket.bucketArn}/*`,
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

  private createBucketKey(): kms.IKey {
    const bucketKeyId = 'BucketKey';
    const key = this.node.tryFindChild(bucketKeyId) as kms.IKey ?? new kms.Key(this, bucketKeyId, {
      policy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: [
              'kms:Create*',
              'kms:Describe*',
              'kms:Enable*',
              'kms:List*',
              'kms:Put*',
              'kms:Update*',
              'kms:Revoke*',
              'kms:Disable*',
              'kms:Get*',
              'kms:Delete*',
              'kms:ScheduleKeyDeletion',
              'kms:CancelKeyDeletion',
              'kms:GenerateDataKey',
              'kms:TagResource',
              'kms:UntagResource',
            ],
            resources: ['*'],
            principals: [
              new iam.AccountPrincipal(this.account),
            ],
            effect: iam.Effect.ALLOW,
          }),
          new iam.PolicyStatement({
            actions: [
              'kms:Decrypt',
              'kms:DescribeKey',
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            resources: ['*'],
            principals: [
              new iam.AnyPrincipal(),
            ],
            conditions: {
              StringEquals: {
                'kms:CallerAccount': this.account,
                'kms:ViaService': `s3.${this.partition}.amazonaws.com`,
              },
            },
            effect: iam.Effect.ALLOW,
          }),
          // new iam.PolicyStatement({
          //   actions: [
          //     'kms:Decrypt',
          //     'kms:DescribeKey',
          //     'kms:Encrypt',
          //     'kms:ReEncrypt*',
          //     'kms:GenerateDataKey*',
          //   ],
          //   resources: ['*'],
          //   principals: [
          //     new iam.ArnPrincipal(this.getCreateFilePublishingRole()),
          //   ],
          //   effect: iam.Effect.ALLOW,
          // }),
        ],
      }),
    });
    return key;
  }

  private getCreateBucket() {
    const stagingBucketName = this.stagingBucketName ?? `cdk-${this.account}-${this.region}-${this.appId.toLocaleLowerCase()}`;
    const bucketId = 'CdkStagingBucket';
    const bucket = this.node.tryFindChild(bucketId) as s3.Bucket ?? new s3.Bucket(this, bucketId, {
      bucketName: stagingBucketName,
      removalPolicy: RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: this.createBucketKey(),
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

    const repoName = `${asset.uniqueId}`.replace('.', '-'); // TODO: actually sanitize
    if (this.stagingRepos[asset.uniqueId] === undefined) {
      this.stagingRepos[asset.uniqueId] = new ecr.Repository(this, repoName, {
        repositoryName: repoName,
        lifecycleRules: this.repositoryLifecycleRules[asset.uniqueId],
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
