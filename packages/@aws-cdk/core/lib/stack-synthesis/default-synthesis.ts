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
import { addStackArtifactToCloudAsm, contentHash } from './shared';
import { IStackSynthesis } from './types';

/**
 * Configuration properties for DefaultDeploymentConfiguration
 */
export interface DefaultStackSynthesisProps {
  /**
   * Name of the staging bucket
   *
   * You must supply this if you have given a non-standard name to the staging bucket.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default DefaultStackSynthesis.DEFAULT_FILE_ASSETS_BUCKET_NAME
   */
  readonly fileAssetsBucketName?: string;

  /**
   * Name of the ECR repository to push Docker Images
   *
   * You must supply this if you have given a non-standard name to the ECR repository.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default DefaultStackSynthesis.DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME
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
   * @default DefaultStackSynthesis.DEFAULT_ASSET_PUBLISHING_ROLE_ARN
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
   * @default DefaultStackSynthesis.DEFAULT_DEPLOY_ACTION_ROLE_ARN
   */
  readonly deployActionRoleArn?: string;

  /**
   * The role CloudFormation will assume when deploying the Stack
   *
   * You must supply this if you have given a non-standard name to the execution role.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default DefaultStackSynthesis.DEFAULT_CLOUDFORMATION_ROLE_ARN
   */
  readonly cloudFormationExecutionRole?: string;

  /**
   * Qualifier to disambiguate multiple environments in the same account
   *
   * You can use this and leave the other naming properties empty if you have deployed
   * the bootstrap environment with standard names but only differnet qualifiers.
   *
   * @default DefaultStackSynthesis.DEFAULT_QUALIFIER
   */
  readonly qualifier?: string;
}

/**
 * Uses conventionally named roles and reify asset storage locations
 *
 * This DeploymentConfiguration is the only DeploymentConfiguration that generates
 * an asset manifest, and is required to deploy CDK applications using the
 * `@aws-cdk/app-delivery` CI/CD library.
 *
 * Requires the environment to have been bootstrapped with Bootstrap Stack V2.
 */
export class DefaultStackSynthesis implements IStackSynthesis {
  /**
   * Default ARN qualifier
   */
  public static readonly DEFAULT_QUALIFIER = 'hnb659fds';

  /**
   * Default CloudFormation role ARN.
   */
  public static readonly DEFAULT_CLOUDFORMATION_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-bootstrap-cfn-exec-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default deploy action role ARN.
   */
  public static readonly DEFAULT_DEPLOY_ACTION_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-bootstrap-deploy-action-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default asset publishing role ARN.
   */
  public static readonly DEFAULT_ASSET_PUBLISHING_ROLE_ARN = 'arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-bootstrap-publishing-role-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default image assets repository name
   */
  public static readonly DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME = 'cdk-bootstrap-${Qualifier}-container-assets-${AWS::AccountId}-${AWS::Region}';

  /**
   * Default file assets bucket name
   */
  public static readonly DEFAULT_FILE_ASSETS_BUCKET_NAME = 'cdk-bootstrap-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}';

  private stack!: Stack;
  private bucketName!: string;
  private repositoryName!: string;
  private deployActionRoleArn!: string;
  private cloudFormationExecutionRoleArn!: string;
  private assetPublishingRoleArn!: string;

  private readonly assets: asset_schema.ManifestFile = {
    version: asset_schema.AssetManifestSchema.currentVersion(),
    files: {},
    dockerImages: {},
  };

  constructor(private readonly props: DefaultStackSynthesisProps = {}) {
  }

  public bind(stack: Stack): void {
    this.stack = stack;

    const qualifier = this.props.qualifier ?? DefaultStackSynthesis.DEFAULT_QUALIFIER;

    // Function to replace placeholders in the input string as much as possible
    //
    // We replace:
    // - ${Qualifier}: always
    // - ${AWS::AccountId}, ${AWS::Region}: only if we have the actual values available
    // - ${AWS::Partition}: never, since we never have the actual partition value.
    const specialize = (s: string) => {
      s = replaceAll(s, '${Qualifier}', qualifier);
      return cxapi.EnvironmentPlaceholders.replace(s, {
        region: resolvedOr(this.stack.region, cxapi.EnvironmentPlaceholders.CURRENT_REGION),
        accountId: resolvedOr(this.stack.account, cxapi.EnvironmentPlaceholders.CURRENT_ACCOUNT),
        partition: cxapi.EnvironmentPlaceholders.CURRENT_PARTITION,
      });
    };

    // tslint:disable:max-line-length
    this.bucketName = specialize(this.props.fileAssetsBucketName ?? DefaultStackSynthesis.DEFAULT_FILE_ASSETS_BUCKET_NAME);
    this.repositoryName = specialize(this.props.imageAssetsRepositoryName ?? DefaultStackSynthesis.DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME);
    this.deployActionRoleArn = specialize(this.props.deployActionRoleArn ?? DefaultStackSynthesis.DEFAULT_DEPLOY_ACTION_ROLE_ARN);
    this.cloudFormationExecutionRoleArn = specialize(this.props.cloudFormationExecutionRole ?? DefaultStackSynthesis.DEFAULT_CLOUDFORMATION_ROLE_ARN);
    this.assetPublishingRoleArn = specialize(this.props.assetPublishingRoleArn ?? DefaultStackSynthesis.DEFAULT_ASSET_PUBLISHING_ROLE_ARN);
    // tslint:enable:max-line-length
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    const objectKey = asset.sourceHash + (asset.packaging === FileAssetPackaging.ZIP_DIRECTORY ? '.zip' : '');

    // Add to manifest
    this.assets.files![asset.sourceHash] = {
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

    // Return CFN expression
    return {
      bucketName: cfnify(this.bucketName),
      objectKey,
      s3Url: cfnify(`https://s3.${this.stack.region}.${this.stack.urlSuffix}/${this.bucketName}/${objectKey}`),
    };
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    const imageTag = asset.sourceHash;

    // Add to manifest
    this.assets.dockerImages![asset.sourceHash] = {
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
    // Add the stack's template to the artifact manifest
    const templateAsset = this.addStackTemplateToAssetManifest(session);

    const artifactId = this.writeAssetManifest(session);

    addStackArtifactToCloudAsm(session, this.stack, {
      assumeRoleArn: this.deployActionRoleArn,
      cloudFormationExecutionRoleArn: this.cloudFormationExecutionRoleArn,
      stackTemplateAssetObjectUrl: templateAsset.s3Url,
      requiresBootstrapStackVersion: 1,
    }, [artifactId]);
  }

  /**
   * Add the stack's template as one of the manifest assets
   *
   * This will make it get uploaded to S3 automatically by S3-assets. Return
   * the URL.
   */
  private addStackTemplateToAssetManifest(session: ISynthesisSession) {
    const templatePath = path.join(session.assembly.outdir, this.stack.templateFile);
    const template = fs.readFileSync(templatePath, { encoding: 'utf-8' });

    return this.addFileAsset({
      fileName: this.stack.templateFile,
      packaging: FileAssetPackaging.FILE,
      sourceHash: contentHash(template),
    });
  }

  /**
   * Write an asset manifest to the Cloud Assembly, return the artifact IDs written
   */
  private writeAssetManifest(session: ISynthesisSession): string {
    const artifactId = `${this.stack.artifactId}.assets`;
    const manifestFile = `${artifactId}.json`;
    const outPath = path.join(session.assembly.outdir, manifestFile);
    const text = JSON.stringify(this.assets, undefined, 2);
    fs.writeFileSync(outPath, text);

    session.assembly.addArtifact(artifactId, {
      type: cxschema.ArtifactType.ASSET_MANIFEST,
      properties: {
        file: manifestFile,
      },
    });

    return artifactId;
  }

  private get manifestEnvName(): string {
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
