import { ContainerImageAssetMetadataEntry } from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import * as path from 'path';
import { ToolkitInfo } from './api/toolkit-info';
import { debug, print } from './logging';
import { shell } from './os';

/**
 * Build and upload a Docker image
 *
 * Permanently identifying images is a bit of a bust. Newer Docker version use
 * a digest (sha256:xxxx) as an image identifier, which is pretty good to avoid
 * spurious rebuilds. However, this digest is calculated over a manifest that
 * includes metadata that is liable to change. For example, as soon as we
 * push the Docker image to a repository, the digest changes. This makes the
 * digest worthless to determe whether we already pushed an image, for example.
 *
 * As a workaround, we calculate our own digest over parts of the manifest that
 * are unlikely to change, and tag based on that.
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
export async function prepareContainerAsset(assemblyDir: string,
                                            asset: ContainerImageAssetMetadataEntry,
                                            toolkitInfo: ToolkitInfo,
                                            reuse: boolean,
                                            ci?: boolean): Promise<CloudFormation.Parameter[]> {

  // following 1.21.0, image asset location (repositoryName and imageTag) is fully determined by the
  // app, and therefore there is no need to wire the image name through a cloudformation parameter.
  if (!asset.imageNameParameter) {
    await prepareContainerAssetNew(assemblyDir, asset, toolkitInfo);
    return [ ];
  }

  if (reuse) {
    return [
      { ParameterKey: asset.imageNameParameter, UsePreviousValue: true },
    ];
  }

  const contextPath = path.isAbsolute(asset.path) ? asset.path : path.join(assemblyDir, asset.path);

  debug(' 👑  Preparing Docker image asset:', contextPath);

  try {
    const repositoryName = asset.repositoryName ?? 'cdk/' + asset.id.replace(/[:/]/g, '-').toLowerCase();
    const ecr = await toolkitInfo.prepareEcrRepository(repositoryName);
    const imageTag = asset.imageTag ?? 'latest';
    const latest = `${ecr.repositoryUri}:${imageTag}`;

    let loggedIn = false;

    // In CI we try to pull latest first
    if (ci) {
      await dockerLogin(toolkitInfo);
      loggedIn = true;

      try {
        await shell(['docker', 'pull', latest]);
      } catch (e) {
        debug('Failed to pull latest image from ECR repository');
      }
    }

    const buildArgs = ([] as string[]).concat(...Object.entries(asset.buildArgs || {}).map(([k, v]) => ['--build-arg', `${k}=${v}`]));

    const baseCommand = [
      'docker', 'build',
      ...buildArgs,
      '--tag', latest,
      contextPath
    ];

    if (asset.target) {
      baseCommand.push('--target', asset.target);
    }

    if (asset.file) {
      // remember we assume the file is relative (we validate this in the asset constructor)
      baseCommand.push('--file', path.join(contextPath, asset.file));
    }

    const command = ci
      ? [...baseCommand, '--cache-from', latest] // This does not fail if latest is not available
      : baseCommand;
    await shell(command);

    // Login and push
    if (!loggedIn) { // We could be already logged in if in CI
      await dockerLogin(toolkitInfo);
      loggedIn = true;
    }

    // There's no way to make this quiet, so we can't use a PleaseHold. Print a header message.
    print(` ⌛ Pushing Docker image for ${contextPath}; this may take a while.`);
    await shell(['docker', 'push', latest]);
    debug(` 👑  Docker image for ${contextPath} pushed.`);

    // Get the (single) repo-digest for latest, which'll be <ecr.repositoryUrl>@sha256:<repoImageSha256>
    const repoDigests = (await shell(['docker', 'image', 'inspect', latest, '--format', '{{range .RepoDigests}}{{.}}|{{end}}'])).trim();
    const requiredPrefix = `${ecr.repositoryUri}@sha256:`;
    const repoDigest = repoDigests.split('|').find(digest => digest.startsWith(requiredPrefix));
    if (!repoDigest) {
      throw new Error(`Unable to identify repository digest (none starts with ${requiredPrefix}) in:\n${repoDigests}`);
    }

    return [
      { ParameterKey: asset.imageNameParameter, ParameterValue: repoDigest.replace(ecr.repositoryUri, repositoryName) },
    ];
  } catch (e) {
    if (e.code === 'ENOENT') {
      // tslint:disable-next-line:max-line-length
      throw new Error('Error building Docker image asset; you need to have Docker installed in order to be able to build image assets. Please install Docker and try again.');
    }
    throw e;
  }
}

/**
 * Build and upload a Docker image
 */
export async function prepareContainerAssetNew(assemblyDir: string,
                                               asset: ContainerImageAssetMetadataEntry,
                                               toolkitInfo: ToolkitInfo) {

  if (asset.imageNameParameter || !asset.repositoryName || !asset.imageTag) {
    throw new Error(`invalid docker image asset configuration. "repositoryName" and "imageTag" are required and "imageNameParameter" is not allowed`);
  }

  const contextPath = path.isAbsolute(asset.path) ? asset.path : path.join(assemblyDir, asset.path);

  debug(' 👑  Preparing Docker image asset:', contextPath);
  const ecr = await toolkitInfo.prepareEcrRepository(asset.repositoryName);

  // if both repo name and image tag are explicitly defined, we assume the
  // image is immutable and can skip build & push.
  debug(`${asset.repositoryName}:${asset.imageTag}: checking if image already exists`);
  if (await toolkitInfo.checkEcrImage(asset.repositoryName, asset.imageTag)) {
    print(`${asset.repositoryName}:${asset.imageTag}: image already exists, skipping build and push`);
    return;
  }

  // we use "latest" for image tag for backwards compatibility with pre-1.21.0 apps.
  const fullImageName = `${ecr.repositoryUri}:${asset.imageTag}`;

  // render "docker build" command

  const buildCommand = [ 'docker', 'build' ];

  buildCommand.push('--tag', fullImageName);

  if (asset.target) {
    buildCommand.push('--target', asset.target);
  }

  if (asset.file) {
      // remember we assume the file is relative (we validate this in the asset constructor)
      buildCommand.push('--file', path.join(contextPath, asset.file));
  }

  for (const [ key, value ] of Object.entries(asset.buildArgs || {})) {
    buildCommand.push(`--build-arg`, `${key}=${value}`);
  }

  buildCommand.push(contextPath);

  try {
    await shell(buildCommand);
  } catch (e) {
    if (e.code === 'ENOENT') {
      throw new Error('Unable to execute "docker" in order to build a container asset. Please install "docker" and try again.');
    }
    throw e;
  }

  // login to ECR
  await dockerLogin(toolkitInfo);

  // There's no way to make this quiet, so we can't use a PleaseHold. Print a header message.
  print(` ⌛ Pushing Docker image for ${contextPath}; this may take a while.`);
  await shell(['docker', 'push', fullImageName]);
  debug(` 👑  Docker image for ${contextPath} pushed.`);
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