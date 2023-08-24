/*
 * Invoked as part of the "build" script of this package,
 * this script takes all specification fragments in the
 * `spec-source` folder and generates a unified specification
 * document at `spec/specification.json`.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import * as md5 from 'md5';
import { massageSpec, normalize } from './massage-spec';;
import { writeSorted, applyPatchSet, applyAndWrite } from './patch-set';
import { validateSpecificationEvolution } from './validate-evolution';
import { schema } from '../lib';

async function main() {
  const inputDir = path.join(process.cwd(), 'spec-source');
  const outDir = path.join(process.cwd(), 'spec');

  // If this is a PR build check the spec for evolution (this is set in buildspec-pr.yaml)
  const outputFile = path.join(outDir, 'specification.json');
  if (process.env.CODEBUILD_WEBHOOK_TRIGGER?.startsWith('pr/')) {
    await validateSpecificationEvolution(async () => {
      await generateResourceSpecification(inputDir, outputFile, true);
      return fs.readJson(outputFile);
    });
  } else {
    await generateResourceSpecification(inputDir, outputFile, false);
  }

  await applyAndWrite(path.join(outDir, 'cfn-lint.json'), path.join(inputDir, 'cfn-lint'));
  await applyAndWrite(path.join(outDir, 'cfn-docs.json'), path.join(inputDir, 'cfn-docs'));
}

/**
 * Generate CloudFormation resource specification from sources and patches
 */
async function generateResourceSpecification(inputDir: string, outFile: string, failOnError = true) {
  const spec: schema.Specification = { PropertyTypes: {}, ResourceTypes: {}, Fingerprint: '' };

  Object.assign(spec, await applyPatchSet(path.join(inputDir, 'specification'), {
    strict: failOnError,
  }));
  massageSpec(spec);
  spec.Fingerprint = md5(JSON.stringify(normalize(spec)));

  await writeSorted(outFile, spec);
}

main()
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error(e.stack);
    process.exit(-1);
  });
