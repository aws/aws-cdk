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

    console.log('esbuild | bundling dry-run');

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

    if (bundle.warnings.length > 0 && (options.failOnWarnings ?? true)) {
      // the warnings themselves are printed during esbuild execution.
      throw new Error(`${bundle.warnings.length} bundling warnings detected!`);
    }

    const inputs = Object.keys(bundle.metafile!.outputs[path.basename(entrypoint)].inputs);
    const dependencies = new Set(inputs.map(i => this.findPackage(i)));

    console.log('madge | detecting circular imports');

    // we don't use the programatic API since we want to eventually print circles
    // which the madge cli already does.
    await shell([`${require.resolve('madge/bin/cli.js')} --no-color --no-spinner --circular --extensions js`, ...dependencies].join(' '));

    const attributions = new Attributions(dependencies);
    console.log('attributions | validate');
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


