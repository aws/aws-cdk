import { promises as fs, createReadStream, createWriteStream } from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';
import * as npmPacklist from 'npm-packlist';
import * as tar from 'tar-stream';

/**
 * This script has literally ONE job:
 *
 * To massage the tarball that `npm pack` produces if we have bundled monorepo dependencies.
 *
 * The reason is that `npm pack` will SKIP the `.npmignore` files from
 * `bundledDependencies`[0]. Not a problem for dependencies that were themselves
 * downloaded from NPM, but definitely a problem for dependencies that are symlinked
 * to source locations (such as those by `npm link` or by a monorepo setup).
 *
 * This leads to all the `.ts` files from the bundledDependency being included,
 * which in turn leads `ts-node` to read those files (in preference over `.js`
 * files with the same name), and then subsequently getting confused because
 * there is no `tsconfig.json` file that tells it how to compile them them (and
 * the defaults don't work out).
 *
 * (Shitty) solution: postprocess the tarball that `npm pack` produces, to
 * remove the files that should have been excluded by NPM in the first place.
 *
 * [0]: https://github.com/npm/cli/issues/718
 */
async function main() {
  const tarball = await findTarballFile();
  const rewritten = `${tarball}.tmp`;

  await transformTarball(tarball, rewritten);

  await fs.rename(rewritten, tarball);
}

async function transformTarball(oldPath: string, newPath: string) {
  const cache = new NpmListCache();

  const { input, output } = createTarballFilterStream(async (headers) => {
    // Paths in a NPM tarball always start with 'package/', strip it off to get to a real relative path
    const relativePath = headers.name.replace(/^package\//, '');

    // We only have to care about files that are in bundled dependencies (which means their
    // path starts with 'node_modules/')
    if (!relativePath.startsWith('node_modules/')) { return true; }

    // Resolve symlinks. Only do special things if the symlink does NOT have /node_modules/ in the path, which
    // is when we're dealing with a symlinked package that NPM will have misprocessed.
    // Otherwise just include the file.
    const absPath = await fs.realpath(relativePath);
    if (absPath.includes('/node_modules/')) { return true; }

    return cache.shouldPublish(absPath);
  });

  await new Promise<void>((ok, ko) => {
    // Thanks Node. This is a really thoughtful API and really much better! [1]
    createReadStream(oldPath)
      .on('error', () => ko())
      .pipe(zlib.createGunzip())
      .on('error', () => ko())
      .pipe(input)
      .on('error', () => ko());

    const outputStream = createWriteStream(newPath);

    output
      .on('error', () => ko())
      .pipe(zlib.createGzip())
      .on('error', () => ko())
      .pipe(outputStream)
      .on('error', () => ko());

    outputStream.on('close', () => ok());
  });
}

/**
 * Create a stream that will retain/remove entries from a tarball based on a predicate
 *
 * Returns the input and output ends of the stream.
 */
function createTarballFilterStream(include: (headers: tar.Headers) => Promise<boolean>) {
  const input = tar.extract();
  const output = tar.pack();

  input.on('entry', (headers, stream, next) => {
    include(headers).then(doInclude => {
      if (doInclude) {
        // Pipe body to output
        stream.pipe(output.entry(headers, next));
      } else {
        // eslint-disable-next-line no-console
        console.error(`[cdk-postpack] Belatedly npmignored: ${headers.name}`);
        // Consume the stream without writing it anywhere
        stream.on('end', next);
        stream.resume();
      }
    }).catch(e => {
      input.destroy(e);
      output.destroy(e);
    });
  });

  input.on('finish', () => {
    output.finalize();
  });

  return { input, output };
}

/**
 * Expect one .tgz file in the current directory and return its name
 */
async function findTarballFile() {
  const entries = await fs.readdir('.');
  const tgzs = entries.filter(e => e.endsWith('.tgz'));
  if (tgzs.length !== 1) {
    throw new Error(`Expecting extactly one .tgz file, got: ${tgzs}`);
  }
  return tgzs[0];
}

class NpmListCache {
  private listCache: Record<string, string[]> = {};

  public async shouldPublish(absPath: string) {
    const pjDir = path.dirname(await findUp('package.json', path.dirname(absPath)));
    const files = await this.obtainNpmPackList(pjDir);

    const relativePath = path.relative(pjDir, absPath);
    return files.includes(relativePath);
  }

  /**
   * Use 'npm-packlist' (official NPM package) to get the list of files that NPM would publish from the given directory
   *
   * This will take into account the .npmignore files.
   */
  private async obtainNpmPackList(dir: string) {
    if (this.listCache[dir]) { return this.listCache[dir]; }

    const files = await npmPacklist({ path: dir });
    this.listCache[dir] = files;
    return files;
  }
}

async function findUp(fileName: string, start: string) {
  let dir = start;
  while (!await fileExists(path.join(dir, fileName))) {
    const parent = path.dirname(dir);
    if (parent === dir) {
      throw new Error(`No ${fileName} found upwards from ${start}`);
    }
    dir = parent;
  }
  return path.join(dir, fileName);
}

async function fileExists(fullPath: string): Promise<boolean> {
  try {
    await fs.stat(fullPath);
    return true;
  } catch (e) {
    if (e.code === 'ENOENT' || e.code === 'ENOTDIR') { return false; }
    throw e;
  }
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.log('Error', e);
  process.exitCode = 1;
});


// [1] /s