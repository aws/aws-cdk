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
    const ecr = await toolkitInfo.prepareEcrRepository(asset);
    const latest = `${ecr.repositoryUri}:latest`;

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

    buildHold.start();

    const baseCommand = ['docker',
      'build',
      ...Object.entries(asset.buildArgs || {}).map(([k, v]) => `--build-arg ${k}=${v}`), // Pass build args if any
      '--quiet',
      asset.path];

    const command = ci
      ? [...baseCommand, '--cache-from', latest] // This does not fail if latest is not available
      : baseCommand;
    const imageId = (await shell(command, { quiet: true })).trim();

    buildHold.stop();

    const tag = await calculateImageFingerprint(imageId);

    debug(` ⌛  Image has tag ${tag}, checking ECR repository`);
    const imageExists = await toolkitInfo.checkEcrImage(ecr.repositoryName, tag);

    if (imageExists) {
      debug(' 👑  Image already uploaded.');
    } else {
      // Login and push
      debug(` ⌛  Image needs to be uploaded first.`);

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
    }

    if (!loggedIn) { // We could be already logged in if in CI or if image did not exist
      await dockerLogin(toolkitInfo);
    }

    // Always tag and push latest
    await shell(['docker', 'tag', imageId, latest]);
    await shell(['docker', 'push', latest]);

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

/**
 * Calculate image fingerprint.
 *
 * The fingerprint has a high likelihood to be the same across repositories.
 * (As opposed to Docker's built-in image digest, which changes as soon
 * as the image is uploaded since it includes the tags that an image has).
 *
 * The fingerprint will be used as a tag to identify a particular image.
 */
async function calculateImageFingerprint(imageId: string) {
  const manifestString = await shell(['docker', 'inspect', imageId], { quiet: true });
  const manifest = JSON.parse(manifestString)[0];

  // Id can change
  delete manifest.Id;

  // Repository-based identifiers are out
  delete manifest.RepoTags;
  delete manifest.RepoDigests;

  // Metadata that has no bearing on the image contents
  delete manifest.Created;

  // We're interested in the image itself, not any running instaces of it
  delete manifest.Container;
  delete manifest.ContainerConfig;

  // We're not interested in the Docker version used to create this image
  delete manifest.DockerVersion;

  // On some Docker versions Metadata contains a LastTagTime which updates
  // on every push, causing us to miss all cache hits.
  delete manifest.Metadata;

  // GraphDriver is about running the image, not about the image itself.
  delete manifest.GraphDriver;

  return crypto.createHash('sha256').update(JSON.stringify(manifest)).digest('hex');
}

/**
 * Example of a Docker manifest
 *
 * [
 *     {
 *         "Id": "sha256:3a90542991d03007fd1d8f3b3a6ab04ebb02386785430fe48a867768a048d828",
 *         "RepoTags": [
 *             "993655754359.dkr.ecr.us-east-1.amazonaws.com/cdk/awsecsintegimage7c15b8c6:latest"
 *         ],
 *         "RepoDigests": [
 *             "993655754359.dkr.ecr.us-east-1.amazo....5e50c0cfc3f2355191934b05df68cd3339a044959111ffec2e14765"
 *         ],
 *         "Parent": "sha256:465720f8f43c9c0aff5dcc731d4e368a3927cae4e885442d4ba0bf8a867b7561",
 *         "Comment": "",
 *         "Created": "2018-10-17T10:16:40.775888476Z",
 *         "Container": "20f145d2e7fbf126ca9f4422497b932bc96b5faa038dc032de1e246f64e03a66",
 *         "ContainerConfig": {
 *             "Hostname": "9b48b580a312",
 *             "Domainname": "",
 *             "User": "",
 *             "AttachStdin": false,
 *             "AttachStdout": false,
 *             "AttachStderr": false,
 *             "ExposedPorts": {
 *                 "8000/tcp": {}
 *             },
 *             "Tty": false,
 *             "OpenStdin": false,
 *             "StdinOnce": false,
 *             "Env": [
 *                 "PATH=/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
 *                 "LANG=C.UTF-8",
 *                 "GPG_KEY=0D96DF4D4110E5C43FBFB17F2D347EA6AA65421D",
 *                 "PYTHON_VERSION=3.6.6",
 *                 "PYTHON_PIP_VERSION=18.1"
 *             ],
 *             "Cmd": [
 *                 "/bin/sh",
 *                 "-c",
 *                 "#(nop) ",
 *                 "CMD [\"/bin/sh\" \"-c\" \"python3 index.py\"]"
 *             ],
 *             "ArgsEscaped": true,
 *             "Image": "sha256:465720f8f43c9c0aff5dcc731d4e368a3927cae4e885442d4ba0bf8a867b7561",
 *             "Volumes": null,
 *             "WorkingDir": "/code",
 *             "Entrypoint": null,
 *             "OnBuild": [],
 *             "Labels": {}
 *         },
 *         "DockerVersion": "17.03.2-ce",
 *         "Author": "",
 *         "Config": {
 *             "Hostname": "9b48b580a312",
 *             "Domainname": "",
 *             "User": "",
 *             "AttachStdin": false,
 *             "AttachStdout": false,
 *             "AttachStderr": false,
 *             "ExposedPorts": {
 *                 "8000/tcp": {}
 *             },
 *             "Tty": false,
 *             "OpenStdin": false,
 *             "StdinOnce": false,
 *             "Env": [
 *                 "PATH=/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
 *                 "LANG=C.UTF-8",
 *                 "GPG_KEY=0D96DF4D4110E5C43FBFB17F2D347EA6AA65421D",
 *                 "PYTHON_VERSION=3.6.6",
 *                 "PYTHON_PIP_VERSION=18.1"
 *             ],
 *             "Cmd": [
 *                 "/bin/sh",
 *                 "-c",
 *                 "python3 index.py"
 *             ],
 *             "ArgsEscaped": true,
 *             "Image": "sha256:465720f8f43c9c0aff5dcc731d4e368a3927cae4e885442d4ba0bf8a867b7561",
 *             "Volumes": null,
 *             "WorkingDir": "/code",
 *             "Entrypoint": null,
 *             "OnBuild": [],
 *             "Labels": {}
 *         },
 *         "Architecture": "amd64",
 *         "Os": "linux",
 *         "Size": 917730468,
 *         "VirtualSize": 917730468,
 *         "GraphDriver": {
 *             "Name": "aufs",
 *             "Data": null
 *         },
 *         "RootFS": {
 *             "Type": "layers",
 *             "Layers": [
 *                 "sha256:f715ed19c28b66943ac8bc12dbfb828e8394de2530bbaf1ecce906e748e4fdff",
 *                 "sha256:8bb25f9cdc41e7d085033af15a522973b44086d6eedd24c11cc61c9232324f77",
 *                 "sha256:08a01612ffca33483a1847c909836610610ce523fb7e1aca880140ee84df23e9",
 *                 "sha256:1191b3f5862aa9231858809b7ac8b91c0b727ce85c9b3279932f0baacc92967d",
 *                 "sha256:9978d084fd771e0b3d1acd7f3525d1b25288ababe9ad8ed259b36101e4e3addd",
 *                 "sha256:2f4f74d3821ecbdd60b5d932452ea9e30cecf902334165c4a19837f6ee636377",
 *                 "sha256:003bb6178bc3218242d73e51d5e9ab2f991dc607780194719c6bd4c8c412fe8c",
 *                 "sha256:15b32d849da2239b1af583f9381c7a75d7aceba12f5ddfffa7a059116cf05ab9",
 *                 "sha256:6e5c5f6bf043bc634378b1e4b61af09be74741f2ac80204d7a373713b1fd5a40",
 *                 "sha256:3260e00e353bfb765b25597d13868c2ef64cb3d509875abcfb58c4e9bf7f4ee2",
 *                 "sha256:f3274b75856311e92e14a1270c78737c86456d6353fe4a83bd2e81bcd2a996ea"
 *             ]
 *         }
 *     }
 * ]
 */
