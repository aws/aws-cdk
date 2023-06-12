import * as fs from 'fs';
import * as path from 'path';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {
  App,
  ArnFormat,
  BootstraplessSynthesizer,
  DockerImageAssetSource,
  Duration,
  FileAssetSource,
  ISynthesisSession,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib/core';
import { StringSpecializer } from 'aws-cdk-lib/core/lib/helpers-internal';
import { BootstrapRole } from './bootstrap-roles';
import { FileStagingLocation, IStagingResources, IStagingResourcesFactory, ImageStagingLocation } from './staging-stack';

export const DEPLOY_TIME_PREFIX = 'deploy-time/';

/**
 * User configurable options to the DefaultStagingStack.
 */
export interface DefaultStagingStackOptions {
  /**
   * A unique identifier for the application that the staging stack belongs to.
   *
   * This identifier will be used in the name of staging resources
   * created for this application, and should be unique across CDK apps.
   *
   * The identifier should include lowercase characters and dashes ('-') only
   * and have a maximum of 20 characters.
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
   * The lifetime for deploy time file assets.
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
  readonly deployTimeFileAssetLifetime?: Duration;

  /**
   * The maximum number of image versions to store in a repository.
   *
   * Previous versions of an image can be stored for rollback purposes.
   * Once a repository has more than 3 image versions stored, the oldest
   * version will be discarded. This allows for sensible garbage collection
   * while maintaining a few previous versions for rollback scenarios.
   *
   * @default - up to 3 versions stored
   */
  readonly imageAssetVersionCount?: number;
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
 * A default Staging Stack that implements IStagingResources.
 *
 * @example
 * const defaultStagingStack = DefaultStagingStack.factory({ appId: 'my-app-id' });
 */
export class DefaultStagingStack extends Stack implements IStagingResources {
  /**
   * Return a factory that will create DefaultStagingStacks
   */
  public static factory(options: DefaultStagingStackOptions): IStagingResourcesFactory {
    const appId = options.appId.toLocaleLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 20);
    return {
      obtainStagingResources(stack, context) {
        const app = App.of(stack);
        if (!App.isApp(app)) {
          throw new Error(`Stack ${stack.stackName} must be part of an App`);
        }

        const stackId = `StagingStack-${appId}-${context.environmentString}`;
        return new DefaultStagingStack(app, stackId, {
          ...options,

          // Does not need to contain environment because stack names are unique inside an env anyway
          stackName: `StagingStack-${appId}`,
          env: {
            account: stack.account,
            region: stack.region,
          },
          appId,
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
    return `cdk-${this.appId}-file-role-${this.region}`;
  }

  /**
   * Default asset publishing role name for docker (ECR) assets.
   */
  private get imageRoleName() {
    return `cdk-${this.appId}-image-role-${this.region}`;
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

  constructor(scope: App, id: string, private readonly props: DefaultStagingStackProps) {
    super(scope, id, {
      ...props,
      synthesizer: new BootstraplessSynthesizer(),
    });

    this.appId = this.validateAppId(props.appId);
    this.dependencyStack = this;

    this.deployRoleArn = props.deployRoleArn;
    this.stagingBucketName = props.stagingBucketName;
    const specializer = new StringSpecializer(this, props.qualifier);

    this.providedFileRole = props.fileAssetPublishingRole?._specialize(specializer);
    this.providedImageRole = props.imageAssetPublishingRole?._specialize(specializer);
    this.stagingRepos = {};
  }

  private validateAppId(id: string) {
    const errors = [];
    if (id.length > 20) {
      errors.push(`appId expected no more than 20 characters but got ${id.length} characters.`);
    }
    if (id !== id.toLocaleLowerCase()) {
      errors.push('appId only accepts lowercase characters.');
    }
    if (!/^[a-z0-9-]*$/.test(id)) {
      errors.push('appId expects only letters, numbers, and dashes (\'-\')');
    }

    if (errors.length > 0) {
      throw new Error([
        `appId ${id} has errors:`,
        ...errors,
      ].join('\n'));
    }
    return id;
  }

  private ensureFileRole() {
    if (this.providedFileRole) {
      // Override
      this.fileRoleManifestArn = this.providedFileRole._arnForCloudAssembly();
      const cfnArn = this.providedFileRole._arnForCloudFormation();
      this.fileRole = cfnArn ? iam.Role.fromRoleArn(this, 'CdkFileRole', cfnArn) : undefined;
      return;
    }

    const roleName = this.fileRoleName;
    this.fileRole = new iam.Role(this, 'CdkFileRole', {
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

  private ensureImageRole() {
    // It may end up setting imageRole to undefined, but at least we tried
    if (this.didImageRole) {
      return;
    }
    this.didImageRole = true;

    if (this.providedImageRole) {
      // Override
      this.imageRoleManifestArn = this.providedImageRole._arnForCloudAssembly();
      const cfnArn = this.providedImageRole._arnForCloudFormation();
      this.imageRole = cfnArn ? iam.Role.fromRoleArn(this, 'CdkImageRole', cfnArn) : undefined;
      return;
    }

    const roleName = this.imageRoleName;
    this.imageRole = new iam.Role(this, 'CdkImageRole', {
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

    this.ensureFileRole();
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
      prefix: DEPLOY_TIME_PREFIX,
      expiration: this.props.deployTimeFileAssetLifetime ?? Duration.days(30),
    });

    return stagingBucketName;
  }

  /**
   * Returns the well-known name of the repo
   */
  private getCreateRepo(asset: DockerImageAssetSource): string {
    if (!asset.assetName) {
      throw new Error('Assets synthesized with AppScopedStagingSynthesizer must include an \'assetName\' in the asset source definition.');
    }

    // Create image publishing role if it doesn't exist
    this.ensureImageRole();

    const repoName = generateRepoName(`${this.appId}/${asset.assetName}`);
    if (this.stagingRepos[asset.assetName] === undefined) {
      this.stagingRepos[asset.assetName] = new ecr.Repository(this, repoName, {
        repositoryName: repoName,
        lifecycleRules: [{
          description: 'Garbage collect old image versions and keep the specified number of latest versions',
          maxImageCount: this.props.imageAssetVersionCount ?? 3,
        }],
      });
      if (this.imageRole) {
        this.stagingRepos[asset.assetName].grantPullPush(this.imageRole);
        this.stagingRepos[asset.assetName].grantRead(this.imageRole);
      }
    }
    return repoName;

    function generateRepoName(name: string): string {
      return name.toLocaleLowerCase().replace('.', '-');
    }
  }

  public addFile(asset: FileAssetSource): FileStagingLocation {
    // Has side effects so must go first
    const bucketName = this.getCreateBucket();

    return {
      bucketName,
      assumeRoleArn: this.fileRoleManifestArn,
      prefix: asset.deployTime ? DEPLOY_TIME_PREFIX : undefined,
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

  /**
   * Synthesizes the cloudformation template into a cloud assembly.
   * @internal
   */
  public _synthesizeTemplate(session: ISynthesisSession, lookupRoleArn?: string | undefined): void {
    super._synthesizeTemplate(session, lookupRoleArn);

    const builder = session.assembly;
    const outPath = path.join(builder.outdir, this.templateFile);
    const size = fs.statSync(outPath).size;
    if (size > 51200) {
      throw new Error(`Staging resource template cannot be greater than 51200 bytes, but got ${size} bytes`);
    }
  }
}
