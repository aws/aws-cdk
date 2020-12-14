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
  const files = await fs.readdir(inputDir);
  const spec: schema.Specification = { PropertyTypes: {}, ResourceTypes: {}, Fingerprint: '' };
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

  const outDir = path.join(process.cwd(), 'spec');
  await fs.mkdirp(outDir);
  await fs.writeJson(path.join(outDir, 'specification.json'), spec, { spaces: 2 });
}

main()
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error(e.stack);
    process.exit(-1);
  });
