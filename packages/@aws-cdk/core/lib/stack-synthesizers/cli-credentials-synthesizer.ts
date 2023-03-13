import * as cxapi from '@aws-cdk/cx-api';
import { assertBound, StringSpecializer } from './_shared';
import { AssetManifestBuilder } from './asset-manifest-builder';
import { BOOTSTRAP_QUALIFIER_CONTEXT, DefaultStackSynthesizer } from './default-synthesizer';
import { StackSynthesizer } from './stack-synthesizer';
import { ISynthesisSession, IReusableStackSynthesizer, IBoundStackSynthesizer } from './types';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { Stack } from '../stack';
import { Token } from '../token';

/**
 * Properties for the CliCredentialsStackSynthesizer
 */
export interface CliCredentialsStackSynthesizerProps {
  /**
   * Name of the S3 bucket to hold file assets
   *
   * You must supply this if you have given a non-standard name to the staging bucket.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default DefaultStackSynthesizer.DEFAULT_FILE_ASSETS_BUCKET_NAME
   */
  readonly fileAssetsBucketName?: string;

  /**
   * Name of the ECR repository to hold Docker Image assets
   *
   * You must supply this if you have given a non-standard name to the ECR repository.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default DefaultStackSynthesizer.DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME
   */
  readonly imageAssetsRepositoryName?: string;

  /**
   * Qualifier to disambiguate multiple environments in the same account
   *
   * You can use this and leave the other naming properties empty if you have deployed
   * the bootstrap environment with standard names but only differnet qualifiers.
   *
   * @default - Value of context key '@aws-cdk/core:bootstrapQualifier' if set, otherwise `DefaultStackSynthesizer.DEFAULT_QUALIFIER`
   */
  readonly qualifier?: string;

  /**
   * bucketPrefix to use while storing S3 Assets
   *
   * @default - DefaultStackSynthesizer.DEFAULT_FILE_ASSET_PREFIX
   */
  readonly bucketPrefix?: string;

  /**
   * A prefix to use while tagging and uploading Docker images to ECR.
   *
   * This does not add any separators - the source hash will be appended to
   * this string directly.
   *
   * @default - DefaultStackSynthesizer.DEFAULT_DOCKER_ASSET_PREFIX
   */
  readonly dockerTagPrefix?: string;
}

/**
 * A synthesizer that uses conventional asset locations, but not conventional deployment roles
 *
 * Instead of assuming the bootstrapped deployment roles, all stack operations will be performed
 * using the CLI's current credentials.
 *
 * - This synthesizer does not support deploying to accounts to which the CLI does not have
 *   credentials. It also does not support deploying using **CDK Pipelines**. For either of those
 *   features, use `DefaultStackSynthesizer`.
 * - This synthesizer requires an S3 bucket and ECR repository with well-known names. To
 *   not depend on those, use `LegacyStackSynthesizer`.
 *
 * Be aware that your CLI credentials must be valid for the duration of the
 * entire deployment. If you are using session credentials, make sure the
 * session lifetime is long enough.
 *
 * By default, expects the environment to have been bootstrapped with just the staging resources
 * of the Bootstrap Stack V2 (also known as "modern bootstrap stack"). You can override
 * the default names using the synthesizer's construction properties.
 */
export class CliCredentialsStackSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer, IBoundStackSynthesizer {
  private qualifier?: string;
  private bucketName?: string;
  private repositoryName?: string;
  private bucketPrefix?: string;
  private dockerTagPrefix?: string;

  private readonly assetManifest = new AssetManifestBuilder();

  constructor(private readonly props: CliCredentialsStackSynthesizerProps = {}) {
    super();

    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        validateNoToken(key as keyof CliCredentialsStackSynthesizerProps);
      }
    }

    function validateNoToken<A extends keyof CliCredentialsStackSynthesizerProps>(key: A) {
      const prop = props[key];
      if (typeof prop === 'string' && Token.isUnresolved(prop)) {
        throw new Error(`CliCredentialsStackSynthesizer property '${key}' cannot contain tokens; only the following placeholder strings are allowed: ` + [
          '${Qualifier}',
          cxapi.EnvironmentPlaceholders.CURRENT_REGION,
          cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT,
          cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
        ].join(', '));
      }
    }
  }

  /**
   * The qualifier used to bootstrap this stack
   */
  public get bootstrapQualifier(): string | undefined {
    return this.qualifier;
  }

  public bind(stack: Stack): void {
    super.bind(stack);

    const qualifier = this.props.qualifier ?? stack.node.tryGetContext(BOOTSTRAP_QUALIFIER_CONTEXT) ?? DefaultStackSynthesizer.DEFAULT_QUALIFIER;
    this.qualifier = qualifier;

    const spec = new StringSpecializer(stack, qualifier);

    /* eslint-disable max-len */
    this.bucketName = spec.specialize(this.props.fileAssetsBucketName ?? DefaultStackSynthesizer.DEFAULT_FILE_ASSETS_BUCKET_NAME);
    this.repositoryName = spec.specialize(this.props.imageAssetsRepositoryName ?? DefaultStackSynthesizer.DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME);
    this.bucketPrefix = spec.specialize(this.props.bucketPrefix ?? DefaultStackSynthesizer.DEFAULT_FILE_ASSET_PREFIX);
    this.dockerTagPrefix = spec.specialize(this.props.dockerTagPrefix ?? DefaultStackSynthesizer.DEFAULT_DOCKER_ASSET_PREFIX);
    /* eslint-enable max-len */
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

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    assertBound(this.bucketName);

    const location = this.assetManifest.defaultAddFileAsset(this.boundStack, asset, {
      bucketName: this.bucketName,
      bucketPrefix: this.bucketPrefix,
    });
    return this.cloudFormationLocationFromFileAsset(location);
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    assertBound(this.repositoryName);

    const location = this.assetManifest.defaultAddDockerImageAsset(this.boundStack, asset, {
      repositoryName: this.repositoryName,
      dockerTagPrefix: this.dockerTagPrefix,
    });
    return this.cloudFormationLocationFromDockerImageAsset(location);
  }

  /**
   * Synthesize the associated stack to the session
   */
  public synthesize(session: ISynthesisSession): void {
    assertBound(this.qualifier);

    const templateAssetSource = this.synthesizeTemplate(session);
    const templateAsset = this.addFileAsset(templateAssetSource);

    const assetManifestId = this.assetManifest.emitManifest(this.boundStack, session);

    this.emitArtifact(session, {
      stackTemplateAssetObjectUrl: templateAsset.s3ObjectUrlWithPlaceholders,
      additionalDependencies: [assetManifestId],
    });
  }
}
