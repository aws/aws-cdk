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
import { StringSpecializer } from 'aws-cdk-lib/core/lib/helpers-internal';
import { BootstrapRole } from './bootstrap-roles';
import { FileStagingLocation, IStagingStack, IStagingStackFactory, ImageStagingLocation } from './staging-stack';

const EPHEMERAL_PREFIX = 'handoff/';

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
   * The lifetime for handoff file assets
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
  readonly handoffFileAssetLifetime?: Duration;
}

/**
 * Default Staging Stack Properties
 */
export interface DefaultStagingStackProps extends DefaultStagingStackOptions, StackProps {
  /**
   * The ARN of the deploy action role, if given
   *
   * This role will need permissions to read from to the staging resources.
   *
   * @default - The CLI credentials are assumed, no additional permissions are granted.
   */
  readonly deployRoleArn?: string;

  /**
   * The qualifier used to specialize strings
   *
   * Shouldn't be necessary but who knows what people might do.
   */
  readonly qualifier: string;
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
          qualifier: context.qualifier,
          deployRoleArn: context.deployRoleArn,
        });
      },
    };
  }

  /**
   * Default asset publishing role name for file (S3) assets.
   */
  private get fileRoleName() {
    return `cdk-${this.appId}-file-publishing-role-${this.region}`.slice(0, 63);
  }

  /**
   * Default asset publishing role name for docker (ECR) assets.
   */
  private get imageRoleName() {
    return `cdk-${this.appId}-asset-publishing-role-${this.region}`.slice(0, 63);
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

  /**
   * File publish role ARN in asset manifest format
   */
  private readonly providedFileRole?: BootstrapRole;
  private fileRole?: iam.IRole;
  private fileRoleManifestArn?: string;

  /**
   * Image publishing role ARN in asset manifest format
   */
  private readonly providedImageRole?: BootstrapRole;
  private imageRole?: iam.IRole;
  private didImageRole = false;
  private imageRoleManifestArn?: string;

  private readonly deployRoleArn?: string;
  // private readonly repositoryLifecycleRules: Record<string, ecr.LifecycleRule[]>;

  constructor(scope: App, id: string, private readonly props: DefaultStagingStackProps) {
    super(scope, id, {
      ...props,
      synthesizer: new BootstraplessSynthesizer(),
    });

    this.appId = props.appId.toLocaleLowerCase();
    this.dependencyStack = this;

    this.deployRoleArn = props.deployRoleArn;
    this.stagingBucketName = props.stagingBucketName;
    const specializer = new StringSpecializer(this, props.qualifier);

    this.providedFileRole = props.fileAssetPublishingRole?._specialize(specializer);
    this.providedImageRole = props.imageAssetPublishingRole?._specialize(specializer);

    // this.repositoryLifecycleRules = this.processLifecycleRules(props.repositoryLifecycleRules ?? []);
    this.stagingRepos = {};
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

  private ensureFilePublishingRole() {
    if (this.providedFileRole) {
      // Override
      this.fileRoleManifestArn = this.providedFileRole._arnForCloudAssembly();
      const cfnArn = this.providedFileRole._arnForCloudFormation();
      this.fileRole = cfnArn ? iam.Role.fromRoleArn(this, 'CdkFilePublishingRole', cfnArn) : undefined;
      return;
    }

    const roleName = this.fileRoleName;
    this.fileRole = new iam.Role(this, 'CdkFilePublishingRole', {
      roleName,
      assumedBy: new iam.AccountPrincipal(this.account),
    });

    this.fileRoleManifestArn = Stack.of(this).formatArn({
      partition: '${AWS::Partition}',
      region: '', // iam is global
      service: 'iam',
      resource: 'role',
      resourceName: roleName,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  private ensureImagePublishingRole() {
    // It may end up setting imageRole to undefined, but at least we tried
    if (this.didImageRole) {
      return;
    }
    this.didImageRole = true;

    if (this.providedImageRole) {
      // Override
      this.imageRoleManifestArn = this.providedImageRole._arnForCloudAssembly();
      const cfnArn = this.providedImageRole._arnForCloudFormation();
      this.imageRole = cfnArn ? iam.Role.fromRoleArn(this, 'CdkImagePublishingRole', cfnArn) : undefined;
      return;
    }

    const roleName = this.imageRoleName;
    this.imageRole = new iam.Role(this, 'CdkImagePublishingRole', {
      roleName,
      assumedBy: new iam.AccountPrincipal(this.account),
    });
    this.imageRoleManifestArn = Stack.of(this).formatArn({
      partition: '${AWS::Partition}',
      region: '', // iam is global
      service: 'iam',
      resource: 'role',
      resourceName: roleName,
      arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
    });
  }

  private createBucketKey(): kms.IKey {
    return new kms.Key(this, 'BucketKey', {
      alias: `alias/cdk-${this.appId}-staging`,
      admins: [new iam.AccountPrincipal(this.account)],
    });
  }

  private getCreateBucket() {
    const stagingBucketName = this.stagingBucketName ?? `cdk-${this.appId}-staging-${this.account}-${this.region}`;
    const bucketId = 'CdkStagingBucket';
    const createdBucket = this.node.tryFindChild(bucketId) as s3.Bucket;
    if (createdBucket) {
      return stagingBucketName;
    }

    this.ensureFilePublishingRole();
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

    if (this.fileRole) {
      bucket.grantReadWrite(this.fileRole);
    }

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
      expiration: this.props.handoffFileAssetLifetime ?? Duration.days(30),
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
    this.ensureImagePublishingRole();

    const repoName = `${asset.assetName}`.replace('.', '-'); // TODO: actually sanitize
    if (this.stagingRepos[asset.assetName] === undefined) {
      this.stagingRepos[asset.assetName] = new ecr.Repository(this, repoName, {
        repositoryName: repoName,
        // lifecycleRules: this.repositoryLifecycleRules[asset.assetName],
      });
      if (this.imageRole) {
        this.stagingRepos[asset.assetName].grantPullPush(this.imageRole);
      }
    }
    return repoName;
  }

  public addFile(asset: FileAssetSource): FileStagingLocation {
    // Has side effects so must go first
    const bucketName = this.getCreateBucket();

    return {
      bucketName,
      assumeRoleArn: this.fileRoleManifestArn,
      prefix: asset.ephemeral ? EPHEMERAL_PREFIX : undefined,
      dependencyStack: this,
    };
  }

  public addDockerImage(asset: DockerImageAssetSource): ImageStagingLocation {
    // Has side effects so must go first
    const repoName = this.getCreateRepo(asset);

    return {
      repoName,
      assumeRoleArn: this.imageRoleManifestArn,
      dependencyStack: this,
    };
  }
}
