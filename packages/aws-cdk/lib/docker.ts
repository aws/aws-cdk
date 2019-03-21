import { ContainerImageAssetMetadataEntry } from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
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
                                            _ci?: boolean): Promise<CloudFormation.Parameter[]> {
  if (reuse) {
    return [
      { ParameterKey: asset.imageNameParameter, UsePreviousValue: true },
    ];
  }
  debug(' 👑  Preparing Docker image asset:', asset.path);
  const buildHold = new PleaseHold(` ⌛ Building Asset Docker image ${asset.id} from ${asset.path}; this may take a while.`);
  try {
    const ecr = await toolkitInfo.prepareEcrRepository(asset);
    let loggedIn = false;
    let command = ['docker', 'build', '--quiet'];
    if ( asset.allowLayerCaching === false ) {
      // if explictely disabled, then disable all caching, this can be useful
      // in case of suspicous local caches (e.g. in shared CI environments).
      command.push('--no-cache');
    } else if ( asset.imageTag && asset.allowLayerCaching ) {
      await dockerLogin(toolkitInfo);
      loggedIn = true;
      try {
        await shell(['docker', 'pull', asset.imageTag]);
        command = [...command, '--cache-from', asset.imageTag];
      } catch (e) {
        debug('Failed to pull latest image from ECR repository');
      }
    }
    buildHold.start();
    const imageId = (await shell([...command, asset.path], { quiet: true })).trim();
    buildHold.stop();
    const tag = asset.imageTag || imageId.replace(/^[^:]*:/, '');
    debug(` ⌛  Image has tag ${tag}, checking ECR repository`);
    // Login and push
    if (!loggedIn) { // We could be already logged in if in CI
      await dockerLogin(toolkitInfo);
      loggedIn = true;
    }
    const qualifiedImageName = `${ecr.repositoryUri}:${tag}`;
    await shell(['docker', 'tag', imageId, qualifiedImageName]);
    // There's no way to make this quiet, so we can't use a PleaseHold. Print a header message.
    print(` ⌛ Pushing Docker image for ${asset.path}; this may take a while.`);
    await shell(['docker', 'push', qualifiedImageName]);
    debug(` 👑  Docker image for ${asset.path} pushed.`);
    return [
      { ParameterKey: asset.imageNameParameter, ParameterValue: `${ecr.repositoryName}:${tag}` },
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
