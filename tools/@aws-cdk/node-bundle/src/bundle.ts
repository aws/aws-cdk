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
 * Bundle class to validate and pack nodejs bundles.
 */
export class Bundle {

  private readonly manifest: any;
  private readonly script: string;
  private readonly entrypoint: string;
  private readonly outfile: string;

  private readonly externals: string[] = [];
  private readonly resources: {[src: string]: string} = {};

  constructor(private readonly packageDir: string, props: BundleProps = {}) {
    const packageJson = path.join(packageDir, 'package.json');
    if (!fs.existsSync(packageJson)) {
      console.error(`✖ Unable to find ${packageJson}`);
      process.exit(1);
    }
    this.manifest = fs.readJsonSync(packageJson);
    this.externals = props.externals ?? [];
    this.resources = props.resources ?? {};

    const bin: [string, string][] = Object.entries(this.manifest.bin ?? {});
    if (bin.length === 0) {
      console.error('✖ No entry-points detected. You must configure exactly one entrypoint in the \'bin\' section of your manifest');
      process.exit(1);
    }
    if (bin.length > 1) {
      console.error('✖ Multiple entry-points detected. You must configure exactly one entrypoint in the \'bin\' section of your manifest');
      process.exit(1);
    }
    this.script = bin[0][0];
    this.entrypoint = bin[0][1];
    this.outfile = path.join(path.dirname(this.entrypoint), 'node-cli-bundle.js');
  }

  public async validate() {

    console.log('Creating bundle');
    const dependencies = await this.esbuild();

    console.log('Validating circular imports');
    await this.validateCircularImports(dependencies);

    console.log('Validating attributions');
    await this.validateAttributions(dependencies);
  }

  public async fix() {

    console.log('Creating bundle');
    const dependencies = await this.esbuild();

    console.log('Generating attributions');
    const attributions = new Attributions(dependencies);
    await attributions.create();
  }

  public async pack(target?: string) {

    console.log('Creating bundle');
    await this.esbuild();

    console.log('Copying resources');
    for (const [src, dst] of Object.entries(this.resources)) {
      fs.copySync(src, dst);
    }

    // console.log('Validating circular imports');
    // await this.validateCircularImports(dependencies);

    console.log('Creating package');
    await this.createPackage(target ?? process.cwd());
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

  private async esbuild(): Promise<Dependency[]> {

    const bundle = await esbuild.build({
      entryPoints: [this.entrypoint],
      bundle: true,
      target: 'node12',
      platform: 'node',
      metafile: true,
      absWorkingDir: this.packageDir,
      external: this.externals,
      write: true,
      outfile: this.outfile,
      allowOverwrite: true,
    });

    if (bundle.warnings.length) {
      // esbuild warnings are usually important, lets try to be strict here.
      // the warnings themselves are printed on screen.
      console.error(`✖ Found ${bundle.warnings.length} bundling warnings (See above)`);
      process.exit(1);
    }

    const inputs = Object.keys(bundle.metafile!.outputs[this.outfile].inputs);
    return Array.from(new Set(Array.from(inputs).map(i => this.findPackage(i)))).map(p => this.createDependency(p));
  }

  private async validateCircularImports(dependencies: Dependency[]) {

    for (const dep of dependencies) {
      console.log(`Detecting circular imports (${dep.path})`);
      // we don't use the programatic API since we want to eventually
      // print circles, which the madge cli already does.
      // also, for easier error reporting we run a separate command for each dependency.
      // may need to reconsider this if it slows down the build too much.
      await shell(`${require.resolve('madge/bin/cli.js')} --warning --no-color --no-spinner --circular --extensions js ${dep.path}`);
    }

  }

  private async validateAttributions(dependencies: Dependency[]) {
    const attributions = new Attributions(dependencies);
    await attributions.validate();
  }

  private async createPackage(target: string) {

    if (!fs.existsSync(target)) {
      console.log(`✖ Target doesnt exist: ${target}`);
      process.exit(1);
    }

    if (!fs.lstatSync(target).isDirectory()) {
      console.log(`✖ Target must be a directory: ${target}`);
      process.exit(1);
    }

    const workdir = await fs.mkdtemp(path.join(os.tmpdir(), path.sep));
    try {
      fs.copySync(this.packageDir, workdir, { filter: n => !n.includes('node_modules') && !n.includes('.git') });

      const bundleManifest = { ...this.manifest };

      // move all 'dependencies' to 'devDependencies' so that npm doesn't install anything when consuming
      for (const [d, v] of Object.entries(this.manifest.dependencies)) {
        bundleManifest.devDependencies[d] = v;
      }
      bundleManifest.dependencies = {};

      // inject a new entrypoint referencing the bundle file
      const entrypointContent = ['#!/usr/bin/env node', `require('./${path.basename(this.outfile)}');`];
      const entrypointPath = path.join(path.dirname(this.entrypoint), 'entrypoint.bundle');
      bundleManifest.bin = { [this.script]: entrypointPath };

      fs.writeFileSync(path.join(workdir, entrypointPath), entrypointContent.join('\n'));
      fs.writeFileSync(path.join(workdir, 'package.json'), JSON.stringify(bundleManifest, null, 2));

      // create the tarball
      const tarball = (await shell('npm pack')).trim();
      await fs.copy(tarball, target);

    } finally {
      fs.removeSync(workdir);
    }

  }

}
