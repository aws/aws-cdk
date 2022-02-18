import * as cxapi from '@aws-cdk/cx-api';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { Stack } from '../stack';
import { Token } from '../token';
import { AssetManifestBuilder } from './_asset-manifest-builder';
import { assertBound, StringSpecializer, stackTemplateFileAsset } from './_shared';
import { BOOTSTRAP_QUALIFIER_CONTEXT, DefaultStackSynthesizer } from './default-synthesizer';
import { StackSynthesizer } from './stack-synthesizer';
import { ISynthesisSession } from './types';

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
export class CliCredentialsStackSynthesizer extends StackSynthesizer {
  private stack?: Stack;
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
        throw new Error(`DefaultSynthesizer property '${key}' cannot contain tokens; only the following placeholder strings are allowed: ` + [
          '${Qualifier}',
          cxapi.EnvironmentPlaceholders.CURRENT_REGION,
          cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT,
          cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
        ].join(', '));
      }
    }
  }

  public bind(stack: Stack): void {
    if (this.stack !== undefined) {
      throw new Error('A StackSynthesizer can only be used for one Stack: create a new instance to use with a different Stack');
    }

    this.stack = stack;

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

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    assertBound(this.stack);
    assertBound(this.bucketName);
    assertBound(this.bucketPrefix);

    return this.assetManifest.addFileAssetDefault(asset, this.stack, this.bucketName, this.bucketPrefix);
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    assertBound(this.stack);
    assertBound(this.repositoryName);
    assertBound(this.dockerTagPrefix);

    return this.assetManifest.addDockerImageAssetDefault(asset, this.stack, this.repositoryName, this.dockerTagPrefix);
  }

  /**
   * Synthesize the associated stack to the session
   */
  public synthesize(session: ISynthesisSession): void {
    assertBound(this.stack);
    assertBound(this.qualifier);

    this.synthesizeStackTemplate(this.stack, session);

    const templateAsset = this.addFileAsset(stackTemplateFileAsset(this.stack, session));
    const assetManifestId = this.assetManifest.writeManifest(this.stack, session);

    this.emitStackArtifact(this.stack, session, {
      stackTemplateAssetObjectUrl: templateAsset.s3ObjectUrlWithPlaceholders,
      additionalDependencies: [assetManifestId],
    });
  }
}