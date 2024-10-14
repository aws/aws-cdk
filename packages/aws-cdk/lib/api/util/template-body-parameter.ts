import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import * as chalk from 'chalk';
import * as fs from 'fs-extra';
import { debug, error } from '../../logging';
import { toYAML } from '../../serialize';
import { AssetManifestBuilder } from '../../util/asset-manifest-builder';
import { AssetsPublishedProof } from '../../util/asset-publishing';
import { contentHash } from '../../util/content-hash';
import { ISDK } from '../aws-auth';
import { EnvironmentResources } from '../environment-resources';

export type TemplateBodyParameter = {
  TemplateBody?: string;
  TemplateURL?: string;
};

const LARGE_TEMPLATE_SIZE_KB = 50;

type MakeBodyParameterResult =
  | { type: 'direct'; param: TemplateBodyParameter }
  | { type: 'upload'; addToManifest: (builder: AssetManifestBuilder) => TemplateBodyParameter };

/**
 * Prepares the body parameter for +CreateChangeSet+.
 *
 * If the template has already been uploaded to an asset bucket or the template
 * is small enough to be inlined into the API call, returns a 'direct' type response
 * with can go into the CloudFormation API call. The `_assetsPublishedProof` parameter
 * exists to statically prove that `publishAssets` has been called already.
 *
 * Otherwise, returns an object with an `addToManifest` function; call that with an `AssetManifestBuilder`
 * (and publish the added artifacts!) to obtain the CloudFormation API call parameters.
 * there is no staging bucket, an error is thrown.
 */
export async function makeBodyParameter(
  stack: cxapi.CloudFormationStackArtifact,
  resolvedEnvironment: cxapi.Environment,
  resources: EnvironmentResources,
  sdk: ISDK,
  _assetsPublishedProof: AssetsPublishedProof,
  overrideTemplate?: unknown,
): Promise<MakeBodyParameterResult> {

  // If the template has already been uploaded to S3, just use it from there.
  if (stack.stackTemplateAssetObjectUrl && !overrideTemplate) {
    return {
      type: 'direct',
      param: { TemplateURL: restUrlFromManifest(stack.stackTemplateAssetObjectUrl, resolvedEnvironment, sdk) },
    };
  }

  // Otherwise, pass via API call (if small) or upload here (if large)
  const templateJson = toYAML(overrideTemplate ?? stack.template);

  if (templateJson.length <= LARGE_TEMPLATE_SIZE_KB * 1024) {
    return { type: 'direct', param: { TemplateBody: templateJson } };
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
    const templateFilePath = path.join(stack.assembly.directory, templateFile);
    await fs.writeFile(templateFilePath, templateJson, { encoding: 'utf-8' });
  }

  return {
    type: 'upload',
    addToManifest(builder) {
      builder.addFileAsset(templateHash, {
        path: templateFile,
      }, {
        bucketName: toolkitInfo.bucketName,
        objectKey: key,
      });

      const templateURL = `${toolkitInfo.bucketUrl}/${key}`;
      debug('Storing template in S3 at:', templateURL);
      return { TemplateURL: templateURL };
    },
  };

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
