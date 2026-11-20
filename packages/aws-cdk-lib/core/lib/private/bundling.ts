import { spawnSync } from 'child_process';

/**
 * Docker images that the current app has built or found in the local Docker daemon.
 *
 * Image tags are content-addressed, so once one `DockerImage` has built or found a tag,
 * every other image with the same tag can skip both the build and the existence check.
 *
 * The record starts empty for every `App`. Hosts that synthesize several apps in one
 * process, such as test runners or toolkit integrations, then still notice images that
 * were removed between two synths.
 *
 * The record is global, so that every loaded copy of this module shares it. Its key is
 * a contract between versions of this library: change the version in the key whenever
 * the shape of the record changes.
 */
interface KnownDockerImages {
  /** Tags of images that exist in the local Docker daemon, keyed by the daemon */
  tags: Set<string>;

  /** Images built on demand that were built in the current app */
  builtImages: WeakSet<object>;
}

const STATE: KnownDockerImages = ((globalThis as any)[Symbol.for('@aws-cdk/core:knownDockerImages/v1')] ??= {
  tags: new Set<string>(),
  builtImages: new WeakSet<object>(),
} satisfies KnownDockerImages);

/**
 * Whether the current app has already built or found the image with this tag.
 */
export function isKnownDockerImage(tag: string): boolean {
  return STATE.tags.has(knownDockerImageKey(tag));
}

/**
 * Record that the image with this tag exists in the local Docker daemon.
 */
export function rememberDockerImage(tag: string) {
  STATE.tags.add(knownDockerImageKey(tag));
}

/**
 * Whether this image was built in the current app.
 */
export function isBuiltInCurrentApp(image: object): boolean {
  return STATE.builtImages.has(image);
}

/**
 * Record that this image was built in the current app.
 */
export function markBuiltInCurrentApp(image: object) {
  STATE.builtImages.add(image);
}

/**
 * Forget all known and built images, for example because a new app starts.
 */
export function clearKnownDockerImages() {
  STATE.tags.clear();
  STATE.builtImages = new WeakSet<object>();
}

/**
 * Whether the image with this tag exists in the local Docker daemon.
 */
export function dockerImageExists(tag: string): boolean {
  const proc = spawnSync(dockerProgram(), ['image', 'inspect', tag], {
    stdio: 'ignore',
  });
  return proc.status === 0;
}

/**
 * Whether the Docker daemon reports that it has no image with this tag.
 *
 * Unlike `!dockerImageExists(tag)`, this is false if the check itself fails,
 * for example because the Docker daemon can't be reached.
 */
export function dockerImageIsMissing(tag: string): boolean {
  const proc = spawnSync(dockerProgram(), ['image', 'inspect', tag], {
    stdio: ['ignore', 'ignore', 'pipe'],
  });
  return proc.status !== 0 && /no such (image|object)|image not known/i.test(proc.stderr?.toString() ?? '');
}

/**
 * Key an image by the Docker daemon it lives in, as well as by its tag.
 */
function knownDockerImageKey(tag: string): string {
  return [dockerProgram(), process.env.DOCKER_HOST ?? '', process.env.DOCKER_CONTEXT ?? '', tag].join('\0');
}

function dockerProgram(): string {
  return process.env.CDK_DOCKER ?? 'docker';
}
