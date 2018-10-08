import cfnSpec = require('@aws-cdk/cfnspec');
import colors = require('colors/safe');
import fs = require('fs-extra');
import path = require('path');
import CodeGenerator from './codegen';
import { packageName } from './genspec';

export default async function(scope: string, outPath: string, force: boolean) {
  if (outPath !== '.') { await fs.mkdirp(outPath); }

  const spec = cfnSpec.filteredSpecification(s => s.startsWith(`${scope}::`));
  if (Object.keys(spec.ResourceTypes).length === 0) {
    throw new Error(`No resource was found for scope ${scope}`);
  }
  const name = packageName(scope);

  // Read package.json in the current directory to determine renames
  const renames: {[key: string]: string} = {};
  let packageJson;
  try {
    packageJson = require(path.resolve(process.cwd(), 'package.json'));
  } catch (e) {
    // Nothing
  }
  if (packageJson && packageJson.cfn2ts && packageJson.cfn2ts.rename) {
    // tslint:disable-next-line:no-console
    console.error('Reading renames from package.json');
    for (const [key, value] of Object.entries(packageJson.cfn2ts.rename)) {
      renames[key] = value as any;
    }
  }

  const generator = new CodeGenerator(name, spec, renames);

  if (!force && await generator.upToDate(outPath)) {
    // tslint:disable-next-line:no-console
    console.log('Generated code already up-to-date: %s', colors.green(path.join(outPath, generator.outputFile)));
    return;
  }
  generator.emitCode();

  // tslint:disable-next-line:no-console
  console.log('Generated code: %s', colors.green(path.join(outPath, generator.outputFile)));
  await generator.save(outPath);
}
