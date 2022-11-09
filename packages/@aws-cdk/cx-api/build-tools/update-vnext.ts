/**
 * Load the `features.ts` source file, and replace the "V2NEXT" version markers with the actual current version
 */
import { promises as fs } from 'fs';
import * as path from 'path';
import { MAGIC_V2NEXT } from '../lib/private/flag-modeling';

async function main() {
  const featuresSourceFile = path.join(__dirname, '..', 'lib', 'features.ts');

  let currentv2: string | undefined = JSON.parse(await fs.readFile(path.join(__dirname, '../../../../version.v2.json'), { encoding: 'utf-8' })).version;
  currentv2 = currentv2?.match(/^[0-9\.]+/)?.[0]; // Make sure to only retain the actual version number, not any '-rc.X' suffix

  if (!currentv2) {
    throw new Error('Could not determine current v2 version number');
  }

  let source = await fs.readFile(featuresSourceFile, { encoding: 'utf-8' });
  source = source.replace(new RegExp(MAGIC_V2NEXT, 'g'), currentv2);

  await fs.writeFile(featuresSourceFile, source, { encoding: 'utf-8' });
}

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});