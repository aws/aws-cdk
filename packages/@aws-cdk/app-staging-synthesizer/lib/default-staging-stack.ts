import {
  App,
  ArnFormat,
  BootstraplessSynthesizer,
  DockerImageAssetSource,
  Duration,
  FileAssetSource,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { BootstrapRole } from './bootstrap-roles';
import { FileStagingLocation, IStagingStack, IStagingStackFactory, ImageStagingLocation } from './staging-stack';

const EPHEMERAL_PREFIX = 'handover/';

/**
 * User configurable options to the DefaultStagingStack
 */
export interface DefaultStagingStackOptions {
  /**
   * A unique identifier for the application that the staging stack belongs to
   *
   * This identifier will be used in the name of staging resources
   * created for this application, and should be unique across CDK apps.
   */
  readonly appId: string;

  /**
   * Explicit name for the staging bucket
   *
   * @default - a well-known name unique to this app/env.
   */
  readonly stagingBucketName?: string;

  /**
   * Pass in an existing role to be used as the file publishing role.
   *
   * @default - a new role will be created
   */
  readonly fileAssetPublishingRole?: BootstrapRole;

  /**
   * Pass in an existing role to be used as the image publishing role.
   *
   * @default - a new role will be created
   */
  readonly imageAssetPublishingRole?: BootstrapRole;

  /**
   * The lifetime for handover file assets
   *
   * Assets that are only necessary at deployment time (for instance,
   * CloudFormation templates and Lambda source code bundles) will be
   * automatically deleted after this many days. Assets that may be
   * read from the staging bucket during your application's run time
   * will not be deleted.
   *
   * Set this to the length of time you wish to be able to roll back to
   * previous versions of your application without having to do a new
   * `cdk synth` and re-upload of assets.
   *
   * @default - Duration.days(30)
   */
  readonly handoverFileAssetLifetime?: Duration;
}

/**
 * Default Staging Stack Properties
 */
export interface DefaultStagingStackProps extends DefaultStagingStackOptions, StackProps {
  /**
   * The ARN of the deploy action role, if given
   *
   * This role will need permissions to read from to the staging resources.
   */
  readonly deployRoleArn?: string;
}

/**
 * A default Staging Stack
 */
export class DefaultStagingStack extends Stack implements IStagingStack {
  /**
   * Return a factory that will create DefaultStagingStacks
   */
  public static factory(options: DefaultStagingStackOptions): IStagingStackFactory {
    return {
      obtainStagingResources(stack, context) {
        const app = App.of(stack);
        if (!App.isApp(app)) {
          throw new Error(`Stack ${stack.stackName} must be part of an App`);
        }

        const stackId = `StagingStack-${options.appId}-${context.environmentString}`;
        return new DefaultStagingStack(app, stackId, {
          ...options,

          // Does not need to contain environment because stack names are unique inside an env anyway
          stackName: `StagingStack-${options.appId}`,
          env: {
            account: stack.account,
            region: stack.region,
          },
          appId: options.appId,
        });
      },
    };
  }

  /**
   * Default asset publishing role name for file (S3) assets.
   */
  private get DEFAULT_FILE_ASSET_PUBLISHING_ROLE_NAME() {
    return `cdk-file-publishing-role-${this.region}-${this.appId}`.slice(0, 63);
  }

  /**
   * Default asset publishing role name for docker (ECR) assets.
   */
  private get DEFAULT_IMAGE_ASSET_PUBISHING_ROLE_NAME() {
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

  /**
   * The stack to add dependencies to.
   */
  public readonly dependencyStack: Stack;

  private readonly appId: string;
  private readonly stagingBucketName?: string;
  private readonly fileAssetPublishingRoleArn?: string;
  private readonly fileAssetPublishingRoleId = 'CdkFilePublishingRole';
  private readonly imageAssetPublishingRoleArn?: string;
  private readonly imageAssetPublishingRoleId = 'CdkImagePublishingRole';
  private readonly deployRoleArn?: string;
  // private readonly repositoryLifecycleRules: Record<string, ecr.LifecycleRule[]>;

  constructor(scope: App, id: string, private readonly props: DefaultStagingStackProps) {
    super(scope, id, {
      ...props,
      synthesizer: new BootstraplessSynthesizer(),
    });

    this.appId = props.appId;
    this.dependencyStack = this;

    this.deployRoleArn = props.deployRoleArn;
    this.stagingBucketName = props.stagingBucketName;
    this.fileAssetPublishingRoleArn = props.fileAssetPublishingRole ?
      this.validateStagingRole(props.fileAssetPublishingRole).renderRoleArn() : undefined;
    this.imageAssetPublishingRoleArn = props.imageAssetPublishingRole ?
      this.validateStagingRole(props.imageAssetPublishingRole).renderRoleArn() : undefined;
    // this.repositoryLifecycleRules = this.processLifecycleRules(props.repositoryLifecycleRules ?? []);
    this.stagingRepos = {};
  }

  private validateStagingRole(stagingRole: BootstrapRole) {
    if (stagingRole.isCliCredentials()) {
      throw new Error('fileAssetPublishingRole and dockerAssetPublishingRole cannot be specified as cliCredentials(). Please supply an arn to reference an existing IAM role.');
    }
    return stagingRole;
  }

  // private processLifecycleRules(rules: StagingRepoLifecycleRule[]) {
  //   const ruleMap: Record<string, ecr.LifecycleRule[]> = {};
  //   for (const rule of rules) {
  //     for (const asset of rule.assets) {
  //       if (ruleMap[asset] === undefined) {
  //         ruleMap[asset] = [];
  //       }
  //       ruleMap[asset].push(...rule.lifecycleRules);
  //     }
  //   }
  //   return ruleMap;
  // }

  private getFilePublishingRoleArn(): string {
    if (this.fileAssetPublishingRoleArn) {
      return this.fileAssetPublishingRoleArn;
    }
    const role = this.node.tryFindChild(this.fileAssetPublishingRoleId) as iam.Role;
    if (role === undefined) {
      throw new Error('Cannot call getFilePublishingRoleArn before createFilePublishingRole');
    }
    return Stack.of(this).formatArn({
      partition: '${AWS::Partition}',
      region: '', // iam is global
      service: 'iam',
      resource: 'role',
      resourceName: this.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_NAME,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  private createFilePublishingRole() {
    const roleName = this.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_NAME;
    const role = new iam.Role(this, this.fileAssetPublishingRoleId, {
      roleName,
      assumedBy: new iam.AccountPrincipal(this.account),
    });
    return role;
  }

  private getImagePublishingRoleArn(): string {
    if (this.imageAssetPublishingRoleArn) {
      return this.imageAssetPublishingRoleArn;
    }
    const role = this.node.tryFindChild(this.imageAssetPublishingRoleId) as iam.Role;
    if (role === undefined) {
      throw new Error('Cannot call getImagePublishingRoleArn before createImagePublishingRole');
    }
    return Stack.of(this).formatArn({
      partition: '${AWS::Partition}',
      region: '', // iam is global
      service: 'iam',
      resource: 'role',
      resourceName: this.DEFAULT_IMAGE_ASSET_PUBISHING_ROLE_NAME,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  private createImagePublishingRole() {
    const roleName = this.DEFAULT_IMAGE_ASSET_PUBISHING_ROLE_NAME;
    const role = new iam.Role(this, this.imageAssetPublishingRoleId, {
      roleName,
      assumedBy: new iam.AccountPrincipal(this.account),
    });
    return role;
  }

  private createBucketKey(): kms.IKey {
    const bucketKeyId = 'BucketKey';
    const key = this.node.tryFindChild(bucketKeyId) as kms.IKey ?? new kms.Key(this, bucketKeyId, {
      alias: `alias/cdkstagingkey/${this.account}-${this.region}-${this.appId}`,
      admins: [new iam.AccountPrincipal(this.account)],
    });
    return key;
  }

  private getCreateBucket() {
    const stagingBucketName = this.stagingBucketName ?? `cdk-${this.account}-${this.region}-${this.appId.toLocaleLowerCase()}`;
    const bucketId = 'CdkStagingBucket';
    const createdBucket = this.node.tryFindChild(bucketId) as s3.Bucket;
    if (createdBucket) {
      return stagingBucketName;
    }

    // Create the role that the KMS key depends on
    const role = this.createFilePublishingRole();
    // Create the KMS key that the bucket depends on
    const key = this.createBucketKey();

    // Create the bucket once the dependencies have been created
    const bucket = new s3.Bucket(this, bucketId, {
      bucketName: stagingBucketName,
      removalPolicy: RemovalPolicy.RETAIN,
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: key,

      // Many AWS account safety checkers will complain when buckets aren't versioned
      versioned: true,
      // Many AWS account safety checkers will complain when SSL isn't enforced
      enforceSSL: true,
    });
    bucket.grantReadWrite(role);

    if (this.deployRoleArn) {
      bucket.addToResourcePolicy(new iam.PolicyStatement({
        actions: [
          's3:GetObject*',
          's3:GetBucket*',
          's3:List*',
        ],
        resources: [bucket.bucketArn, bucket.arnForObjects('*')],
        principals: [new iam.ArnPrincipal(this.deployRoleArn)],
      }));
    }

    // Objects should never be overwritten, but let's make sure we have a lifecycle policy
    // for it anyway.
    bucket.addLifecycleRule({
      noncurrentVersionExpiration: Duration.days(365),
    });

    bucket.addLifecycleRule({
      prefix: EPHEMERAL_PREFIX,
      expiration: this.props.handoverFileAssetLifetime ?? Duration.days(30),
    });

    return stagingBucketName;
  }

  /**
   * Returns the well-known name of the repo
   */
  private getCreateRepo(asset: DockerImageAssetSource): string {
    if (!asset.assetName) {
      throw new Error('Assets synthesized with AppScopedStagingSynthesizer must include a \'uniqueId\' in the asset source definition.');
    }

    // Create image publishing role if it doesn't exist
    this.node.tryFindChild(this.imageAssetPublishingRoleId) as iam.Role ?? this.createImagePublishingRole();

    // TODO: grant permissions to the role

    const repoName = `${asset.assetName}`.replace('.', '-'); // TODO: actually sanitize
    if (this.stagingRepos[asset.assetName] === undefined) {
      this.stagingRepos[asset.assetName] = new ecr.Repository(this, repoName, {
        repositoryName: repoName,
        // lifecycleRules: this.repositoryLifecycleRules[asset.assetName],
      });
    }
    return repoName;
  }

  public addFile(asset: FileAssetSource): FileStagingLocation {
    return {
      bucketName: this.getCreateBucket(),
      assumeRoleArn: this.getFilePublishingRoleArn(),
      prefix: asset.ephemeral ? EPHEMERAL_PREFIX : undefined,
    };
  }

  public addDockerImage(asset: DockerImageAssetSource): ImageStagingLocation {
    return {
      repoName: this.getCreateRepo(asset),
      assumeRoleArn: this.getImagePublishingRoleArn(),
    };
  }
}
