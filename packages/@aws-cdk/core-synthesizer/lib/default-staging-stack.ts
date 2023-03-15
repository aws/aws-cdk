import * as ecr from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { Arn, ArnFormat, Aws, DockerImageAssetSource, FileAssetSource, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';
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
   * The app-scoped, environment-keyed bucket created in this staging stack.
   */
  readonly stagingBucket?: s3.Bucket;

  /**
   * The app-scoped, environment-keyed repositories created in this staging stack.
   * A repository is created per image asset family.
   */
  readonly stagingRepos: Record<string, ecr.Repository>;

  /**
   * Stack others can depend on.
   *
   * @default this
   */
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
  readonly dockerAssetPublishingRoleName?: string;
}

/**
 * A default Staging Stack
 */
export class DefaultStagingStack extends Stack implements IDefaultStagingStack {
  /**
   * Default asset publishing role name for file (S3) assets.
   */
  private static readonly DEFAULT_FILE_ASSET_PUBLISHING_ROLE_NAME = 'cdk-file-publishing-role';

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

  public readonly dependencyStack: Stack;

  private readonly stagingBucketName?: string;
  private fileAssetPublishingRole?: BootstrapRole;
  private dockerAssetPublishingRoleName: string;

  constructor(scope: Construct, id: string, props: DefaultStagingStackProps = {}) {
    super(scope, id, {
      ...props,
      // synthesizer: // TODO: need a synthesizer that will not create an asset for the template
    });

    this.dependencyStack = this;

    this.stagingBucketName = props.stagingBucketName;
    // eslint-disable-next-line max-len
    this.fileAssetPublishingRole = props.fileAssetPublishingRole;
    this.dockerAssetPublishingRoleName = props.dockerAssetPublishingRoleName ?? DefaultStagingStack.DEFAULT_DOCKER_ASSET_PUBISHING_ROLE_NAME;
    this.stagingRepos = {};
  }

  /**
   * Returns the well-known name of the file publishing role
   */
  private getCreateFilePublishingRole() {
    // FilePublishingRoleDefaultPolicy:
    // Type: AWS::IAM::Policy
    // Properties:
    //   PolicyDocument:
    //     Statement:
    //       - Action:
    //           - s3:GetObject*
    //           - s3:GetBucket*
    //           - s3:GetEncryptionConfiguration
    //           - s3:List*
    //           - s3:DeleteObject*
    //           - s3:PutObject*
    //           - s3:Abort*
    //         Resource:
    //           - Fn::Sub: "${StagingBucket.Arn}"
    //           - Fn::Sub: "${StagingBucket.Arn}/*"
    //         Effect: Allow
    //       - Action:
    //           - kms:Decrypt
    //           - kms:DescribeKey
    //           - kms:Encrypt
    //           - kms:ReEncrypt*
    //           - kms:GenerateDataKey*
    //         Effect: Allow
    //         Resource:
    //           Fn::If:
    //             - CreateNewKey
    //             - Fn::Sub: "${FileAssetsBucketEncryptionKey.Arn}"
    //             - Fn::Sub: arn:${AWS::Partition}:kms:${AWS::Region}:${AWS::AccountId}:key/${FileAssetsBucketKmsKeyId}
    //     Version: '2012-10-17'
    //   Roles:
    //     - Ref: FilePublishingRole
    //   PolicyName:
    //     Fn::Sub: cdk-${Qualifier}-file-publishing-role-default-policy-${AWS::AccountId}-${AWS::Region}
    const createIamRole = () => {
      const role = new iam.Role(this, roleName, {
        roleName: roleName,
        assumedBy: new iam.ServicePrincipal('sts.amazonaws.com'), // TODO actually create correct role
      });
      role.addToPolicy(new iam.PolicyStatement({
        actions: ['s3:GetObject*', 's3:GetBucket*', 's3:GetEncryptionConfiguration', 's3:List*', 's3:DeleteObject*', 's3:PutObject*', 's3:Abort*'],
        resources: [this.getCreateBucket().bucketArn, `${this.getCreateBucket().bucketArn}/*`],
        effect: iam.Effect.ALLOW,
      }));
      return role;
    };

    if (this.fileAssetPublishingRole) {
      return this.fileAssetPublishingRole.roleArn;
    }
    const roleName = DefaultStagingStack.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_NAME;
    this.node.tryFindChild(roleName) as iam.Role ?? createIamRole();
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

  private getCreateBucket() {
    // Error: Resolution error: ID components may not include unresolved tokens:
    const stagingBucketName = this.stagingBucketName ?? 'cdk-489318732371-us-east-1'; //`cdk-${this.account}-${this.region}`;
    const bucket = this.node.tryFindChild(stagingBucketName) as s3.Bucket ?? new s3.Bucket(this, stagingBucketName, {
      bucketName: stagingBucketName,
      // autoDeleteObjects: true, // this creates a custom resource with an asset
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
