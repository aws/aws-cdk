import * as fs from 'fs';
import * as path from 'path';
import * as esbuild from 'esbuild';
import { Attributions } from './attributions';
import { shell } from './shell';

export interface BundleProps {

  /**
   * @default - no external references
   */
  readonly externals?: string[];

}

export interface ValidateOptions {
  /**
   * @default true
   */
  readonly failOnWarnings?: boolean;
}

export interface PackOptions extends ValidateOptions {
  /**
   * @default - current working directory
   */
  readonly outDir?: string;
}


export class Bundle {

  private readonly manifest: any;

  constructor(private readonly packageDir: string, private readonly props: BundleProps = {}) {
    const packageJson = path.join(packageDir, 'package.json');
    if (!fs.existsSync(packageJson)) {
      throw new Error(`Unable to find ${packageJson}`);
    }
    this.manifest = JSON.parse(fs.readFileSync(packageJson, 'utf-8').toString());
  }

  public async validate(options: ValidateOptions = {}) {

    // support only a single entrypoint for now
    const bin: [string, string][] = Object.entries(this.manifest.bin ?? {});
    if (bin.length === 0) {
      throw new Error('No entry-points detected. You must configure exactly one entrypoint in the \'bin\' section of your manifest');
    }
    if (bin.length > 1) {
      throw new Error('Multiple entry-points detected. You must configure exactly one entrypoint in the \'bin\' section of your manifest');
    }

    const entrypoint = bin[0][1];

    console.log('validate | discovering dependencies');

    const bundle = await esbuild.build({
      entryPoints: [bin[0][1]],
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
      console.log(`✖ Found ${bundle.warnings.length} bundling warnings (See above)`);
      process.exit(1);
    }

    const inputs = Object.keys(bundle.metafile!.outputs[path.basename(entrypoint)].inputs);
    const dependencies = new Set(inputs.map(i => this.findPackage(i)));

    for (const dep of dependencies) {
      console.log(`validate | detecting circular imports (${dep})`);
      // we don't use the programatic API since we want to eventually
      // print circles, which the madge cli already does.
      // also, for easier error reporting we run a separate command for each dependency.
      // may need to reconsider this if it slows down the build too much.
      await shell([`${require.resolve('madge/bin/cli.js')}`, '--warning', '--no-color', '--no-spinner', '--circular', '--extensions', 'js', dep]);
    }

    const attributions = new Attributions(dependencies);
    console.log('validate | attributions');
    attributions.validate();
  }

  public pack() {

  }

  private findPackage(inputFile: string) {

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
}


