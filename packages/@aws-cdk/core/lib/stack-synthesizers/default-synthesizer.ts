import * as asset_schema from '@aws-cdk/cdk-assets-schema';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs';
import * as path from 'path';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetPackaging, FileAssetSource } from '../assets';
import { Fn } from '../cfn-fn';
import { ISynthesisSession } from '../construct-compat';
import { Stack } from '../stack';
import { Token } from '../token';
import { addStackArtifactToAssembly, assertBound, contentHash } from './_shared';
import { IStackSynthesizer } from './types';

export const BOOTSTRAP_QUALIFIER_CONTEXT = '@aws-cdk/core:bootstrapQualifier';

/**
 * Configuration properties for DefaultStackSynthesizer
 */
export interface DefaultStackSynthesizerProps {
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
   * The role to use to publish assets to this environment
   *
   * You must supply this if you have given a non-standard name to the publishing role.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default DefaultStackSynthesizer.DEFAULT_ASSET_PUBLISHING_ROLE_ARN
   */
  readonly assetPublishingRoleArn?: string;

  /**
   * External ID to use when assuming role for asset publishing
   *
   * @default - No external ID
   */
  readonly assetPublishingExternalId?: string;

  /**
   * The role to assume to initiate a deployment in this environment
   *
   * You must supply this if you have given a non-standard name to the publishing role.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default DefaultStackSynthesizer.DEFAULT_DEPLOY_ROLE_ARN
   */
  readonly deployRoleArn?: string;

  /**
   * The role CloudFormation will assume when deploying the Stack
   *
   * You must supply this if you have given a non-standard name to the execution role.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default DefaultStackSynthesizer.DEFAULT_CLOUDFORMATION_ROLE_ARN
   */
  readonly cloudFormationExecutionRole?: string;

  /**
   * Qualifier to disambiguate multiple environments in the same account
   *
   * You can use this and leave the other naming properties empty if you have deployed
   * the bootstrap environment with standard names but only differnet qualifiers.
   *
   * @default - Value of context key '@aws-cdk/core:bootstrapQualifier' if set, otherwise `DefaultStackSynthesizer.DEFAULT_QUALIFIER`
   */
  readonly qualifier?: string;
}

/**
 * Uses conventionally named roles and reify asset storage locations
 *
 * This synthesizer is the only StackSynthesizer that generates
 * an asset manifest, and is required to deploy CDK applications using the
 * `@aws-cdk/app-delivery` CI/CD library.
 *
 * Requires the environment to have been bootstrapped with Bootstrap Stack V2.
 */
export class DefaultStackSynthesizer implements IStackSynthesizer {
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
   * Default asset publishing role ARN.
   */
  public static readonly DEFAULT_ASSET_PUBLISHING_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-publishing-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default image assets repository name
   */
  public static readonly DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME = 'cdk-${Qualifier}-container-assets-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default file assets bucket name
   */
  public static readonly DEFAULT_FILE_ASSETS_BUCKET_NAME = 'cdk-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}';

  private stack?: Stack;
  private bucketName?: string;
  private repositoryName?: string;
  private deployRoleArn?: string;
  private cloudFormationExecutionRoleArn?: string;
  private assetPublishingRoleArn?: string;

  private readonly files: NonNullable<asset_schema.ManifestFile['files']> = {};
  private readonly dockerImages: NonNullable<asset_schema.ManifestFile['dockerImages']> = {};

  constructor(private readonly props: DefaultStackSynthesizerProps = {}) {
  }

  public bind(stack: Stack): void {
    this.stack = stack;

    const qualifier = this.props.qualifier ?? stack.node.tryGetContext(BOOTSTRAP_QUALIFIER_CONTEXT) ?? DefaultStackSynthesizer.DEFAULT_QUALIFIER;

    // Function to replace placeholders in the input string as much as possible
    //
    // We replace:
    // - ${Qualifier}: always
    // - ${AWS::AccountId}, ${AWS::Region}: only if we have the actual values available
    // - ${AWS::Partition}: never, since we never have the actual partition value.
    const specialize = (s: string) => {
      s = replaceAll(s, '${Qualifier}', qualifier);
      return cxapi.EnvironmentPlaceholders.replace(s, {
        region: resolvedOr(stack.region, cxapi.EnvironmentPlaceholders.CURRENT_REGION),
        accountId: resolvedOr(stack.account, cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT),
        partition: cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
      });
    };

    // tslint:disable:max-line-length
    this.bucketName = specialize(this.props.fileAssetsBucketName ?? DefaultStackSynthesizer.DEFAULT_FILE_ASSETS_BUCKET_NAME);
    this.repositoryName = specialize(this.props.imageAssetsRepositoryName ?? DefaultStackSynthesizer.DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME);
    this.deployRoleArn = specialize(this.props.deployRoleArn ?? DefaultStackSynthesizer.DEFAULT_DEPLOY_ROLE_ARN);
    this.cloudFormationExecutionRoleArn = specialize(this.props.cloudFormationExecutionRole ?? DefaultStackSynthesizer.DEFAULT_CLOUDFORMATION_ROLE_ARN);
    this.assetPublishingRoleArn = specialize(this.props.assetPublishingRoleArn ?? DefaultStackSynthesizer.DEFAULT_ASSET_PUBLISHING_ROLE_ARN);
    // tslint:enable:max-line-length
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    assertBound(this.stack);
    assertBound(this.bucketName);

    const objectKey = asset.sourceHash + (asset.packaging === FileAssetPackaging.ZIP_DIRECTORY ? '.zip' : '');

    // Add to manifest
    this.files[asset.sourceHash] = {
      source: {
        path: asset.fileName,
        packaging: asset.packaging,
      },
      destinations: {
        [this.manifestEnvName]: {
          bucketName: this.bucketName,
          objectKey,
          region: resolvedOr(this.stack.region, undefined),
          assumeRoleArn: this.assetPublishingRoleArn,
          assumeRoleExternalId: this.props.assetPublishingExternalId,
        },
      },
    };

    const httpUrl = cfnify(`https://s3.${this.stack.region}.${this.stack.urlSuffix}/${this.bucketName}/${objectKey}`);
    const s3ObjectUrl = cfnify(`s3://${this.bucketName}/${objectKey}`);

    // Return CFN expression
    return {
      bucketName: cfnify(this.bucketName),
      objectKey,
      httpUrl,
      s3ObjectUrl,
      s3Url: httpUrl,
    };
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    assertBound(this.stack);
    assertBound(this.repositoryName);

    const imageTag = asset.sourceHash;

    // Add to manifest
    this.dockerImages[asset.sourceHash] = {
      source: {
        directory: asset.directoryName,
        dockerBuildArgs: asset.dockerBuildArgs,
        dockerBuildTarget: asset.dockerBuildTarget,
        dockerFile: asset.dockerFile,
      },
      destinations: {
        [this.manifestEnvName]: {
          repositoryName: this.repositoryName,
          imageTag,
          region: resolvedOr(this.stack.region, undefined),
          assumeRoleArn: this.assetPublishingRoleArn,
          assumeRoleExternalId: this.props.assetPublishingExternalId,
        },
      },
    };

    // Return CFN expression
    return {
      repositoryName: cfnify(this.repositoryName),
      imageUri: cfnify(`${this.stack.account}.dkr.ecr.${this.stack.region}.${this.stack.urlSuffix}/${this.repositoryName}:${imageTag}`),
    };
  }

  public synthesizeStackArtifacts(session: ISynthesisSession): void {
    assertBound(this.stack);

    // Add the stack's template to the artifact manifest
    const templateManifestUrl = this.addStackTemplateToAssetManifest(session);

    const artifactId = this.writeAssetManifest(session);

    addStackArtifactToAssembly(session, this.stack, {
      assumeRoleArn: this.deployRoleArn,
      cloudFormationExecutionRoleArn: this.cloudFormationExecutionRoleArn,
      stackTemplateAssetObjectUrl: templateManifestUrl,
      requiresBootstrapStackVersion: 1,
    }, [artifactId]);
  }

  /**
   * Add the stack's template as one of the manifest assets
   *
   * This will make it get uploaded to S3 automatically by S3-assets. Return
   * the manifest URL.
   *
   * (We can't return the location returned from `addFileAsset`, as that
   * contains CloudFormation intrinsics which can't go into the manifest).
   */
  private addStackTemplateToAssetManifest(session: ISynthesisSession) {
    assertBound(this.stack);

    const templatePath = path.join(session.assembly.outdir, this.stack.templateFile);
    const template = fs.readFileSync(templatePath, { encoding: 'utf-8' });

    const sourceHash = contentHash(template);

    this.addFileAsset({
      fileName: this.stack.templateFile,
      packaging: FileAssetPackaging.FILE,
      sourceHash,
    });

    // We should technically return an 'https://s3.REGION.amazonaws.com[.cn]/name/hash' URL here,
    // because that is what CloudFormation expects to see.
    //
    // However, there's no way for us to actually know the UrlSuffix a priori, so we can't construct it here.
    //
    // Instead, we'll have a protocol with the CLI that we put an 's3://.../...' URL here, and the CLI
    // is going to resolve it to the correct 'https://.../' URL before it gives it to CloudFormation.
    return `s3://${this.bucketName}/${sourceHash}`;
  }

  /**
   * Write an asset manifest to the Cloud Assembly, return the artifact IDs written
   */
  private writeAssetManifest(session: ISynthesisSession): string {
    assertBound(this.stack);

    const artifactId = `${this.stack.artifactId}.assets`;
    const manifestFile = `${artifactId}.json`;
    const outPath = path.join(session.assembly.outdir, manifestFile);

    const manifest: asset_schema.ManifestFile = {
      version: asset_schema.AssetManifestSchema.currentVersion(),
      files: this.files,
      dockerImages: this.dockerImages,
    };

    fs.writeFileSync(outPath, JSON.stringify(manifest, undefined, 2));
    session.assembly.addArtifact(artifactId, {
      type: cxschema.ArtifactType.ASSET_MANIFEST,
      properties: {
        file: manifestFile,
        requiresBootstrapStackVersion: 1,
      },
    });

    return artifactId;
  }

  private get manifestEnvName(): string {
    assertBound(this.stack);

    return [
      resolvedOr(this.stack.account, 'current_account'),
      resolvedOr(this.stack.region, 'current_region'),
    ].join('-');
  }
}

/**
 * Return the given value if resolved or fall back to a default
 */
function resolvedOr<A>(x: string, def: A): string | A {
  return Token.isUnresolved(x) ? def : x;
}

/**
 * A "replace-all" function that doesn't require us escaping a literal string to a regex
 */
function replaceAll(s: string, search: string, replace: string) {
  return s.split(search).join(replace);
}

/**
 * If the string still contains placeholders, wrap it in a Fn::Sub so they will be substituted at CFN deploymen time
 *
 * (This happens to work because the placeholders we picked map directly onto CFN
 * placeholders. If they didn't we'd have to do a transformation here).
 */
function cfnify(s: string): string {
  return s.indexOf('${') > -1 ? Fn.sub(s) : s;
}
