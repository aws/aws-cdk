import * as os from 'os';
import * as path from 'path';
import * as esbuild from 'esbuild';
import * as fs from 'fs-extra';
import { Attributions, Dependency } from './attributions';
import { shell } from './shell';

/**
 * Bundling properties.
 */
export interface BundleProps {
  /**
   * External packages that cannot be bundled.
   *
   * These will remain a runtime dependency of the package.
   *
   * @default - no external references.
   */
  readonly externals?: string[];

  /**
   * External resources that need to be embedded in the bundle.
   *
   * These will be copied over to the appropriate paths before packaging.
   */
  readonly resources?: {[src: string]: string};
}

/**
 * Validation options.
 */
export interface ValidateOptions {
  /**
   * Fail validation on any bundling warnings that may arrise.
   *
   * @default true
   */
  readonly failOnWarnings?: boolean;
}

/**
 * Fix options.
 */
export interface FixOptions extends ValidateOptions {

}

/**
 * Packaging options.
 */
export interface PackOptions extends ValidateOptions {
  /**
   * Directory to produce the tarball in.
   *
   * @default - current working directory
   */
  readonly outDir?: string;
}

/**
 * Bundle class to validate and pack nodejs bundles.
 */
export class Bundle {

  private readonly manifest: any;
  // private readonly script: string;
  private readonly entrypoint: string;

  constructor(private readonly packageDir: string, private readonly props: BundleProps = {}) {
    const packageJson = path.join(packageDir, 'package.json');
    if (!fs.existsSync(packageJson)) {
      console.error(`✖ Unable to find ${packageJson}`);
      process.exit(1);
    }
    this.manifest = fs.readJsonSync(packageJson);

    // support only a single entrypoint for now
    const bin: [string, string][] = Object.entries(this.manifest.bin ?? {});
    if (bin.length === 0) {
      console.error('✖ No entry-points detected. You must configure exactly one entrypoint in the \'bin\' section of your manifest');
      process.exit(1);
    }
    if (bin.length > 1) {
      console.error('✖ Multiple entry-points detected. You must configure exactly one entrypoint in the \'bin\' section of your manifest');
      process.exit(1);
    }
    // this.script = bin[0][0];
    this.entrypoint = bin[0][1];
  }

  public async validate(options: ValidateOptions = {}): Promise<{bundle: esbuild.BuildResult; attributions: Attributions}> {

    console.log('Discovering dependencies');

    const bundle = await esbuild.build({
      entryPoints: [this.entrypoint],
      bundle: true,
      target: 'node12',
      platform: 'node',
      metafile: true,
      absWorkingDir: this.packageDir,
      external: this.props.externals,
      write: false,
    });

    if (bundle.warnings.length > 0 && options.failOnWarnings) {
      // the warnings themselves are printed on screen via esbuild
      console.error(`✖ Found ${bundle.warnings.length} bundling warnings (See above)`);
      process.exit(1);
    }

    const inputs = Object.keys(bundle.metafile!.outputs[path.basename(this.entrypoint)].inputs);
    const dependencies = Array.from(new Set(Array.from(inputs).map(i => this.findPackage(i)))).map(p => this.createDependency(p));

    for (const dep of dependencies) {
      console.log(`Detecting circular imports (${dep.path})`);
      // we don't use the programatic API since we want to eventually
      // print circles, which the madge cli already does.
      // also, for easier error reporting we run a separate command for each dependency.
      // may need to reconsider this if it slows down the build too much.
      await shell(`${require.resolve('madge/bin/cli.js')} --warning --no-color --no-spinner --circular --extensions js ${dep.path}`);
    }

    const attributions = new Attributions(dependencies);
    await attributions.validate();

    return { bundle, attributions };
  }

  public async fix(options: FixOptions = {}) {
    const { attributions } = await this.validate(options);
    await attributions.create();
  }

  public async pack(options: PackOptions = {}) {
    const { bundle } = await this.validate(options);
    const outputFiles = (bundle.outputFiles ?? []);

    if (outputFiles.length === 0) {
      console.error('✖ Bundling failed to produce any bundle files');
      process.exit(1);
    }

    if (outputFiles.length > 1) {
      console.error('✖ Bundling produced multiple bundle files:');
      console.error(outputFiles.map(b => `  - ${b}`).join('\n'));
      process.exit(1);
    }

    // const outputFile = outputFiles[0].path;
    const workdir = await fs.mkdtemp(path.join(os.tmpdir(), path.sep));
    const cwd = process.cwd();

    try {
      fs.copySync(cwd, workdir, { filter: n => !n.startsWith('node_modules') && !n.startsWith('.git') });

      // const manifest = { ...this.manifest };
      // for (const [d, v] of Object.entries(manifest.dependencies)) {
      //   manifest.devDependencies[d] = v;
      // }
      // delete manifest.dependencies;

      // const entrypointContent = ['#!/usr/bin/env node', `require('./${path.basename(outputFile)}');`];
      // const entrypointPath = path.join(path.dirname(outputFile), 'entrypoint.bundle');
      // manifest.bin = { [this.script]: path.relative() };

      // fs.writeFileSync(path.join(path.dirname(outputFile), 'entrypoint.bundle'), entrypoint.join('\n'));
      // fs.writeFileSync('package.json', JSON.stringify(manifest));

    } finally {
      fs.removeSync(workdir);
    }
  }

  private findPackage(inputFile: string): string {

    function findPackageUp(dirname: string): string {
      const manifestPath = path.join(dirname, 'package.json');
      if (fs.existsSync(manifestPath)) {
        return dirname;
      }
      if (path.dirname(dirname) === dirname) {
        throw new Error('Unable to find package manifest');
      }
      return findPackageUp(path.dirname(dirname));
    }

    return findPackageUp(path.resolve(this.packageDir, path.dirname(inputFile)));
  }

  private createDependency(packageDir: string): Dependency {
    const manifestPath = path.join(packageDir, 'package.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, { encoding: 'utf-8' }));
    return { path: packageDir, name: manifest.name, version: manifest.version };
  }

}
