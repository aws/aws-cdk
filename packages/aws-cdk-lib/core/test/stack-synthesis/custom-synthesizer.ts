import { Stack, FileAssetSource, FileAssetLocation, DockerImageAssetSource, DockerImageAssetLocation } from '../../lib';
import { StringSpecializer } from '../../lib/helpers-internal';
import { AssetManifestBuilder, DefaultStackSynthesizerProps, IBoundStackSynthesizer, IReusableStackSynthesizer, ISynthesisSession, StackSynthesizer } from '../../lib/stack-synthesizers';
import { assertBound } from '../../lib/stack-synthesizers/_shared';

export const BOOTSTRAP_QUALIFIER_CONTEXT = '@aws-cdk/core:bootstrapQualifier';

/**
 * The minimum bootstrap stack version required by this app.
 */
const MIN_BOOTSTRAP_STACK_VERSION = 6;

/**
 * The minimum bootstrap stack version required
 * to use the lookup role.
 */
const MIN_LOOKUP_ROLE_BOOTSTRAP_STACK_VERSION = 8;

/**
 * Uses conventionally named roles and asset storage locations
 *
 * This synthesizer:
 *
 * - Is a Custom Stack Synthesizer with pretty much the same implementation as the
 * `DefaultStackSynthesizer` - it also takes in the `DefaultStackSynthesizer` props
 * in the constructor, but the only difference is that we pass in undefined for the
 * CloudFormationExecutionRoleArn inside emitArtifact() of the synthesize() function;
 * the purpose of this to use the DeployRole for CloudFormation Execution instead.
 *
 * Requires the environment to have been bootstrapped with Bootstrap Stack V2
 * (also known as "modern bootstrap stack"). The synthesizer adds a version
 * check to the template, to make sure the bootstrap stack is recent enough
 * to support all features expected by this synthesizer.
 */
export class CustomSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer, IBoundStackSynthesizer {
  /**
   * Default ARN qualifier
   */
  public static readonly DEFAULT_QUALIFIER = 'hnb659fds';

  /**
   * Default CloudFormation role ARN.
   */
  public static readonly DEFAULT_CLOUDFORMATION_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-cfn-exec-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default deploy role ARN.
   */
  public static readonly DEFAULT_DEPLOY_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-deploy-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default asset publishing role ARN for file (S3) assets.
   */
  public static readonly DEFAULT_FILE_ASSET_PUBLISHING_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-file-publishing-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default asset publishing role ARN for image (ECR) assets.
   */
  public static readonly DEFAULT_IMAGE_ASSET_PUBLISHING_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-image-publishing-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default lookup role ARN for missing values.
   */
  public static readonly DEFAULT_LOOKUP_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-lookup-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default image assets repository name
   */
  public static readonly DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME = 'cdk-${Qualifier}-container-assets-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default file assets bucket name
   */
  public static readonly DEFAULT_FILE_ASSETS_BUCKET_NAME = 'cdk-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}';

  /**
   * Name of the CloudFormation Export with the asset key name
   */
  public static readonly DEFAULT_FILE_ASSET_KEY_ARN_EXPORT_NAME = 'CdkBootstrap-${Qualifier}-FileAssetKeyArn';

  /**
   * Default file asset prefix
   */
  public static readonly DEFAULT_FILE_ASSET_PREFIX = '';
  /**
   * Default Docker asset prefix
   */
  public static readonly DEFAULT_DOCKER_ASSET_PREFIX = '';

  /**
   * Default bootstrap stack version SSM parameter.
   */
  public static readonly DEFAULT_BOOTSTRAP_STACK_VERSION_SSM_PARAMETER = '/cdk-bootstrap/${Qualifier}/version';

  private bucketName?: string;
  private repositoryName?: string;
  private _deployRoleArn?: string;
  private _cloudFormationExecutionRoleArn?: string;
  private fileAssetPublishingRoleArn?: string;
  private imageAssetPublishingRoleArn?: string;
  private lookupRoleArn?: string;
  private useLookupRoleForStackOperations: boolean;
  private qualifier?: string;
  private bucketPrefix?: string;
  private dockerTagPrefix?: string;
  private bootstrapStackVersionSsmParameter?: string;
  private assetManifest = new AssetManifestBuilder();

  constructor(private readonly props: DefaultStackSynthesizerProps = {}) {
    super();
    this.useLookupRoleForStackOperations = props.useLookupRoleForStackOperations ?? true;
  }

  /**
   * Produce a bound Stack Synthesizer for the given stack.
   *
   * This method may be called more than once on the same object.
   */
  public reusableBind(stack: Stack): IBoundStackSynthesizer {
    // Create a copy of the current object and bind that
    const copy = Object.create(this);
    copy.bind(stack);
    return copy;
  }

  /**
   * The qualifier used to bootstrap this stack
   */
  public get bootstrapQualifier(): string | undefined {
    return this.qualifier;
  }

  /**
   * The role used to lookup for this stack
   */
  public get lookupRole(): string | undefined {
    return this.lookupRoleArn;
  }

  public bind(stack: Stack): void {
    super.bind(stack);

    const qualifier = this.props.qualifier ?? stack.node.tryGetContext(BOOTSTRAP_QUALIFIER_CONTEXT) ?? CustomSynthesizer.DEFAULT_QUALIFIER;
    this.qualifier = qualifier;

    const spec = new StringSpecializer(stack, qualifier);

    /* eslint-disable max-len */
    this.bucketName = spec.specialize(this.props.fileAssetsBucketName ?? CustomSynthesizer.DEFAULT_FILE_ASSETS_BUCKET_NAME);
    this.repositoryName = spec.specialize(this.props.imageAssetsRepositoryName ?? CustomSynthesizer.DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME);
    this._deployRoleArn = spec.specialize(this.props.deployRoleArn ?? CustomSynthesizer.DEFAULT_DEPLOY_ROLE_ARN);
    this._cloudFormationExecutionRoleArn = spec.specialize(this.props.cloudFormationExecutionRole ?? CustomSynthesizer.DEFAULT_CLOUDFORMATION_ROLE_ARN);
    this.fileAssetPublishingRoleArn = spec.specialize(this.props.fileAssetPublishingRoleArn ?? CustomSynthesizer.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_ARN);
    this.imageAssetPublishingRoleArn = spec.specialize(this.props.imageAssetPublishingRoleArn ?? CustomSynthesizer.DEFAULT_IMAGE_ASSET_PUBLISHING_ROLE_ARN);
    this.lookupRoleArn = spec.specialize(this.props.lookupRoleArn ?? CustomSynthesizer.DEFAULT_LOOKUP_ROLE_ARN);
    this.bucketPrefix = spec.specialize(this.props.bucketPrefix ?? CustomSynthesizer.DEFAULT_FILE_ASSET_PREFIX);
    this.dockerTagPrefix = spec.specialize(this.props.dockerTagPrefix ?? CustomSynthesizer.DEFAULT_DOCKER_ASSET_PREFIX);
    this.bootstrapStackVersionSsmParameter = spec.qualifierOnly(this.props.bootstrapStackVersionSsmParameter ?? CustomSynthesizer.DEFAULT_BOOTSTRAP_STACK_VERSION_SSM_PARAMETER);
    /* eslint-enable max-len */
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    assertBound(this.bucketName);

    const location = this.assetManifest.defaultAddFileAsset(this.boundStack, asset, {
      bucketName: this.bucketName,
      bucketPrefix: this.bucketPrefix,
      role: this.fileAssetPublishingRoleArn ? {
        assumeRoleArn: this.fileAssetPublishingRoleArn,
        assumeRoleExternalId: this.props.fileAssetPublishingExternalId,
        assumeRoleSessionTags: this.props.fileAssetPublishingRoleSessionTags,
      } : undefined,
    });
    return this.cloudFormationLocationFromFileAsset(location);
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    assertBound(this.repositoryName);

    const location = this.assetManifest.defaultAddDockerImageAsset(this.boundStack, asset, {
      repositoryName: this.repositoryName,
      dockerTagPrefix: this.dockerTagPrefix,
      role: this.imageAssetPublishingRoleArn ? {
        assumeRoleArn: this.imageAssetPublishingRoleArn,
        assumeRoleExternalId: this.props.imageAssetPublishingExternalId,
        assumeRoleSessionTags: this.props.imageAssetPublishingRoleSessionTags,
      } : undefined,
    });
    return this.cloudFormationLocationFromDockerImageAsset(location);
  }

  /**
   * Synthesize the stack template to the given session, passing the configured lookup role ARN
   */
  protected synthesizeStackTemplate(stack: Stack, session: ISynthesisSession) {
    stack._synthesizeTemplate(session, this.lookupRoleArn);
  }

  /**
   * Return the currently bound stack
   *
   * @deprecated Use `boundStack` instead.
   */
  protected get stack(): Stack | undefined {
    return this.boundStack;
  }

  /**
   * Synthesize the associated stack to the session
   */
  public synthesize(session: ISynthesisSession): void {
    assertBound(this.qualifier);

    // Must be done here -- if it's done in bind() (called in the Stack's constructor)
    // then it will become impossible to set context after that.
    //
    // If it's done AFTER _synthesizeTemplate(), then the template won't contain the
    // right constructs.
    if (this.props.generateBootstrapVersionRule ?? true) {
      this.addBootstrapVersionRule(MIN_BOOTSTRAP_STACK_VERSION, this.bootstrapStackVersionSsmParameter!);
    }

    const templateAssetSource = this.synthesizeTemplate(session, this.lookupRoleArn);
    const templateAsset = this.addFileAsset(templateAssetSource);

    const assetManifestId = this.assetManifest.emitManifest(this.boundStack, session, {
      requiresBootstrapStackVersion: MIN_BOOTSTRAP_STACK_VERSION,
      bootstrapStackVersionSsmParameter: this.bootstrapStackVersionSsmParameter,
    });

    this.emitArtifact(session, {
      assumeRoleExternalId: this.props.deployRoleExternalId,
      assumeRoleArn: this._deployRoleArn,
      assumeRoleSessionTags: this.props.deployRoleSessionTags,
      // Sets CFN Execution Role Arn to undefined:
      cloudFormationExecutionRoleArn: undefined,
      stackTemplateAssetObjectUrl: templateAsset.s3ObjectUrlWithPlaceholders,
      requiresBootstrapStackVersion: MIN_BOOTSTRAP_STACK_VERSION,
      bootstrapStackVersionSsmParameter: this.bootstrapStackVersionSsmParameter,
      additionalDependencies: [assetManifestId],
      lookupRole: this.useLookupRoleForStackOperations && this.lookupRoleArn ? {
        arn: this.lookupRoleArn,
        assumeRoleExternalId: this.props.lookupRoleExternalId,
        assumeRoleSessionTags: this.props.lookupRoleSessionTags,
        requiresBootstrapStackVersion: MIN_LOOKUP_ROLE_BOOTSTRAP_STACK_VERSION,
        bootstrapStackVersionSsmParameter: this.bootstrapStackVersionSsmParameter,
      } : undefined,
    });
  }

  /**
   * Returns the ARN of the deploy Role.
   */
  public get deployRoleArn(): string {
    if (!this._deployRoleArn) {
      throw new Error('deployRoleArn getter can only be called after the synthesizer has been bound to a Stack');
    }
    return this._deployRoleArn;
  }
}
