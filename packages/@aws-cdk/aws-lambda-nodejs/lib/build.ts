import { spawnSync } from 'child_process';

export interface BuildOptions {
  entry: string;
  global: string;
  minify?: boolean;
  sourceMaps?: boolean;
  buildDir: string;
  cacheDir?: string;
}

export function build(options: BuildOptions): void {
  try {
    const args = [
      'build',
      options.entry,
      '-d',
      options.buildDir,
      '--out-file',
      'index.js',
      '--global',
      options.global,
      '--target',
      'node',
      '--bundle-node-modules',
      '--log-level',
      '2',
      !options.minify && '--no-minify',
      !options.sourceMaps && '--no-source-maps',
      ...options.cacheDir
        ? ['--cache-dir', options.cacheDir]
        : [],
    ].filter(Boolean) as string[];

    const parcel = spawnSync('parcel', args);

    if (parcel.error) {
      throw parcel.error;
    }

    if (parcel.status !== 0) {
      throw new Error(parcel.stderr.toString().trim());
    }
  } catch (err) {
    throw new Error(`Failed to build file at ${options.entry}: ${err}`);
  }
}
