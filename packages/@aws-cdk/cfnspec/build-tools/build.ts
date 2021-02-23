/*
 * Invoked as part of the "build" script of this package,
 * this script takes all specification fragments in the
 * `spec-source` folder and generates a unified specification
 * document at `spec/specification.json`.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import * as md5 from 'md5';
import { schema } from '../lib';
import { decorateResourceTypes, forEachSection, massageSpec, merge, normalize, patch } from './massage-spec';

async function main() {
  const inputDir = path.join(process.cwd(), 'spec-source');
  const outDir = path.join(process.cwd(), 'spec');

  await generateResourceSpecification(inputDir, path.join(outDir, 'specification.json'));
  await mergeSpecificationFromDirs(path.join(inputDir, 'cfn-lint'), path.join(outDir, 'cfn-lint.json'));
}

/**
 * Generate CloudFormation resource specification from sources and patches
 */
async function generateResourceSpecification(inputDir: string, outFile: string) {
  const spec: schema.Specification = { PropertyTypes: {}, ResourceTypes: {}, Fingerprint: '' };

  const files = await fs.readdir(inputDir);
  for (const file of files.filter(n => n.endsWith('.json')).sort()) {
    const data = await fs.readJson(path.join(inputDir, file));
    if (file.indexOf('patch') === -1) {
      decorateResourceTypes(data);
      forEachSection(spec, data, merge);
    } else {
      forEachSection(spec, data, patch);
    }
  }

  massageSpec(spec);

  spec.Fingerprint = md5(JSON.stringify(normalize(spec)));

  await fs.mkdirp(path.dirname(outFile));
  await fs.writeJson(outFile, spec, { spaces: 2 });
}

/**
 * Generate Cfnlint spec annotations from sources and patches
 */
async function mergeSpecificationFromDirs(inputDir: string, outFile: string) {
  const spec: any = {};

  for (const child of await fs.readdir(inputDir)) {
    const fullPath = path.join(inputDir, child);
    if (!(await fs.stat(fullPath)).isDirectory()) { continue; }

    const subspec = await loadMergedSpec(fullPath);
    spec[child] = subspec;
  }

  await fs.mkdirp(path.dirname(outFile));
  await fs.writeJson(outFile, spec, { spaces: 2 });
}

/**
 * Load all files in the given directory, merge them and apply patches in the order found
 *
 * The base structure is always an empty object
 */
async function loadMergedSpec(inputDir: string) {
  const structure: any = {};

  const files = await fs.readdir(inputDir);
  for (const file of files.filter(n => n.endsWith('.json')).sort()) {
    const data = await fs.readJson(path.join(inputDir, file));
    if (file.indexOf('patch') === -1) {
      // Copy properties from current object into structure, adding/overwriting whatever is found
      Object.assign(structure, data);
    } else {
      // Apply the loaded file as a patch onto the current structure
      patch(structure, data);
    }
  }

  return structure;
}

main()
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error(e.stack);
    process.exit(-1);
  });
