import cfnSpec = require('@aws-cdk/cfnspec');
import fs = require('fs-extra');
import { AugmentationGenerator } from './augmentation-generator';
import CodeGenerator from './codegen';
import { packageName } from './genspec';

export default async function(scope: string, outPath: string) {
  if (outPath !== '.') { await fs.mkdirp(outPath); }

  const spec = cfnSpec.filteredSpecification(s => s.startsWith(`${scope}::`));
  if (Object.keys(spec.ResourceTypes).length === 0) {
    throw new Error(`No resource was found for scope ${scope}`);
  }
  const name = packageName(scope);

  const generator = new CodeGenerator(name, spec);
  generator.emitCode();
  await generator.save(outPath);

  const augs = new AugmentationGenerator(name, spec);
  augs.emitCode();
  await augs.save(outPath);
}
