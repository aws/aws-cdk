import { ContainerImageAssetMetadataEntry } from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import crypto = require('crypto');
import { ToolkitInfo } from './api/toolkit-info';
import { debug, print } from './logging';
import { shell } from './os';
import { PleaseHold } from './util/please-hold';

/**
 * Build and upload a Docker image
 *
 * When running in CI, we pull the latest image first and use it as cache for
 * the build. Generally pulling will be faster than building, especially for
 * Dockerfiles with lots of OS/code packages installation or changes only in
 * the bottom layers. When running locally chances are that we already have
 * layers cache available.
 *
 * CI is detected by the presence of the `CI` environment variable or
 * the `--ci` command line option.
 */
export async function prepareContainerAsset(asset: ContainerImageAssetMetadataEntry,
                                            toolkitInfo: ToolkitInfo,
                                            reuse: boolean,
                                            ci?: boolean): Promise<CloudFormation.Parameter[]> {
  if (reuse) {
    return [
      { ParameterKey: asset.imageNameParameter, UsePreviousValue: true },
    ];
  }
  debug(' 👑  Preparing Docker image asset:', asset.path);
  const buildHold = new PleaseHold(` ⌛ Building Asset Docker image ${asset.id} from ${asset.path}; this may take a while.`);
  try {
    const [ecr, ] = await Promise.all([
      toolkitInfo.prepareEcrRepository(asset),
      dockerLogin(toolkitInfo),
    ]);
    let command = ['docker', 'build', '--quiet'];
    const stableTag = crypto.createHash('sha256').update(asset.id).digest('hex');
    const stableImageName = `${ecr.repositoryUri}:${stableTag}`;
    if ( asset.allowLayerCaching === false ) {
      // if explictely disabled, then disable all caching, this can be useful
      // in case of suspicous local caches (e.g. in shared CI environments).
      command.push('--no-cache');
    } else if ( asset.allowLayerCaching && ci ) {
      try {
        await shell(['docker', 'pull', stableImageName]);
        command = [...command, '--cache-from', stableImageName];
      } catch (e) {
        debug(`Failed to pull latest image "${stableImageName}" from ECR repository, will not use --cache-from.`);
      }
    }
    buildHold.start();
    const imageId = (await shell([...command, asset.path], { quiet: true })).trim();
    buildHold.stop();
    const tag = asset.imageTag || imageId.replace(/^[^:]*:/, '');
    const qualifiedImageName = `${ecr.repositoryUri}:${tag}`;
    await Promise.all([
      shell(['docker', 'tag', imageId, qualifiedImageName]),
      shell(['docker', 'tag', imageId, stableImageName]),
    ]);
    // There's no way to make this quiet, so we can't use a PleaseHold. Print a header message.
    print(` ⌛ Pushing Docker image for ${asset.path} to ${qualifiedImageName} and to ${stableImageName}; this may take a while.`);
    await Promise.all([
      shell(['docker', 'push', qualifiedImageName]),
      shell(['docker', 'push', stableImageName]),
    ]);
    const stableRef = await getStableRef(ecr.repositoryUri, imageId);
    debug(` 👑  Docker image for ${asset.path} pushed, will use ${stableRef} to refer to it.`);
    return [
      { ParameterKey: asset.imageNameParameter, ParameterValue: `${ecr.repositoryName}:${tag},${stableRef}` },
    ];
  } catch (e) {
    if (e.code === 'ENOENT') {
      // tslint:disable-next-line:max-line-length
      throw new Error('Error building Docker image asset; you need to have Docker installed in order to be able to build image assets. Please install Docker and try again.');
    }
    throw e;
  } finally {
    buildHold.stop();
  }
}

async function getStableRef(repository: string, imageId: string): Promise<string> {
  try {
    const repoDigests: string[] = JSON.parse((await shell(['docker', 'image', 'inspect', imageId, '-f', '{{.RepoDigests}}'])).trim());
    for (const digest of repoDigests) {
      if ( digest.startsWith(`${repository}@`) ) {
        return digest;
      }
    }
  } catch (e) {
    debug(e);
  }
  return `${repository}:${imageId}`;
}

/**
 * Get credentials from ECR and run docker login
 */
async function dockerLogin(toolkitInfo: ToolkitInfo) {
  const credentials = await toolkitInfo.getEcrCredentials();
  await shell(['docker', 'login',
  '--username', credentials.username,
  '--password', credentials.password,
  credentials.endpoint]);
}
