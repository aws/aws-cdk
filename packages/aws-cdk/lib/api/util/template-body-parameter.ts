import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import { debug, error } from '../../logging';
import { toYAML } from '../../serialize';
import { AssetManifestBuilder } from '../../util/asset-manifest-builder';
import { publishAssets } from '../../util/asset-publishing';
import { contentHash } from '../../util/content-hash';
import { ISDK, SdkProvider } from '../aws-auth';
import { EnvironmentResources } from '../environment-resources';

export type TemplateBodyParameter = {
  TemplateBody?: string
  TemplateURL?: string
};

const LARGE_TEMPLATE_SIZE_KB = 50;

/**
 * Prepares the body parameter for +CreateChangeSet+.
 *
 * If the template is small enough to be inlined into the API call, just return
 * it immediately.
 *
 * Otherwise, add it to the asset manifest to get uploaded to the staging
 * bucket and return its coordinates. If there is no staging bucket, an error
 * is thrown.
 *
 * @param stack     the synthesized stack that provides the CloudFormation template
 * @param toolkitInfo information about the toolkit stack
 */
export async function makeBodyParameter(
  stack: cxapi.CloudFormationStackArtifact,
  resolvedEnvironment: cxapi.Environment,
  assetManifest: AssetManifestBuilder,
  resources: EnvironmentResources,
  sdk: ISDK,
  overrideTemplate?: any,
  alwaysUploadTemplate: boolean = false,
): Promise<TemplateBodyParameter> {

  // If the template has already been uploaded to S3, just use it from there.
  if (stack.stackTemplateAssetObjectUrl && !overrideTemplate) {
    return { TemplateURL: restUrlFromManifest(stack.stackTemplateAssetObjectUrl, resolvedEnvironment, sdk) };
  }

  // Otherwise, pass via API call (if small) or upload here (if large)
  const templateJson = toYAML(overrideTemplate ?? stack.template);

  if (templateJson.length <= LARGE_TEMPLATE_SIZE_KB * 1024 && !alwaysUploadTemplate) {
    debug('woah');
    return { TemplateBody: templateJson };
  }

  const toolkitInfo = await resources.lookupToolkit();
  if (!toolkitInfo.found) {
    error(
      `The template for stack "${stack.displayName}" is ${Math.round(templateJson.length / 1024)}KiB. ` +
      `Templates larger than ${LARGE_TEMPLATE_SIZE_KB}KiB must be uploaded to S3.\n` +
      'Run the following command in order to setup an S3 bucket in this environment, and then re-deploy:\n\n',
      chalk.blue(`\t$ cdk bootstrap ${resolvedEnvironment.name}\n`));

    throw new Error('Template too large to deploy ("cdk bootstrap" is required)');
  }

  const templateHash = contentHash(templateJson);
  const key = `cdk/${stack.id}/${templateHash}.yml`;

  let templateFile = stack.templateFile;
  if (overrideTemplate) {
    // Add a variant of this template
    templateFile = `${stack.templateFile}-${templateHash}.yaml`;
    await fs.writeFile(templateFile, templateJson, { encoding: 'utf-8' });
  }

  assetManifest.addFileAsset(templateHash, {
    path: templateFile,
  }, {
    bucketName: toolkitInfo.bucketName,
    objectKey: key,
  });

  const templateURL = `${toolkitInfo.bucketUrl}/${key}`;
  debug('Storing template in S3 at:', templateURL);
  return { TemplateURL: templateURL };
}

/**
 * Prepare a body parameter for CFN, performing the upload
 *
 * Return it as-is if it is small enough to pass in the API call,
 * upload to S3 and return the coordinates if it is not.
 */
export async function makeBodyParameterAndUpload(
  stack: cxapi.CloudFormationStackArtifact,
  resolvedEnvironment: cxapi.Environment,
  resources: EnvironmentResources,
  sdkProvider: SdkProvider,
  sdk: ISDK,
  overrideTemplate?: any,
  alwaysUploadTemplate?: boolean): Promise<TemplateBodyParameter> {

  // We don't have access to the actual asset manifest here, so pretend that the
  // stack doesn't have a pre-published URL.
  const forceUploadStack = Object.create(stack, {
    stackTemplateAssetObjectUrl: { value: undefined },
  });

  const builder = new AssetManifestBuilder();
  debug('making body param with' + alwaysUploadTemplate);
  const bodyparam = await makeBodyParameter(forceUploadStack, resolvedEnvironment, builder, resources, sdk, overrideTemplate, alwaysUploadTemplate);
  const manifest = builder.toManifest(stack.assembly.directory);
  await publishAssets(manifest, sdkProvider, resolvedEnvironment, { quiet: true });

  return bodyparam;
}

/**
 * Format an S3 URL in the manifest for use with CloudFormation
 *
 * Replaces environment placeholders (which this field may contain),
 * and reformats s3://.../... urls into S3 REST URLs (which CloudFormation
 * expects)
 */
function restUrlFromManifest(url: string, environment: cxapi.Environment, sdk: ISDK): string {
  const doNotUseMarker = '**DONOTUSE**';
  // This URL may contain placeholders, so still substitute those.
  url = cxapi.EnvironmentPlaceholders.replace(url, {
    accountId: environment.account,
    region: environment.region,
    partition: doNotUseMarker,
  });

  // Yes, this is extremely crude, but we don't actually need this so I'm not inclined to spend
  // a lot of effort trying to thread the right value to this location.
  if (url.indexOf(doNotUseMarker) > -1) {
    throw new Error('Cannot use \'${AWS::Partition}\' in the \'stackTemplateAssetObjectUrl\' field');
  }

  const s3Url = url.match(/s3:\/\/([^/]+)\/(.*)$/);
  if (!s3Url) { return url; }

  // We need to pass an 'https://s3.REGION.amazonaws.com[.cn]/bucket/object' URL to CloudFormation, but we
  // got an 's3://bucket/object' URL instead. Construct the rest API URL here.
  const bucketName = s3Url[1];
  const objectKey = s3Url[2];

  const urlSuffix: string = sdk.getEndpointSuffix(environment.region);
  return `https://s3.${environment.region}.${urlSuffix}/${bucketName}/${objectKey}`;
}
