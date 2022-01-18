/* eslint-disable no-console */
/**
 * Report on spec fragment files that are being held back.
 */

import * as path from 'path';
import * as fs from 'fs-extra';

async function main(args: string[]) {
  if (args.length < 2) {
    throw new Error('Usage: report-issues <DIR> <FORMAT>');
  }

  const [dir, format] = args;

  const officialVersion = (await fs.readJson(path.join(dir, '001_Version.json'))).ResourceSpecificationVersion;
  let headerPrinted = false;

  for (const file of await fs.readdir(dir)) {
    if (!file.startsWith('000_')) {
      continue;
    }

    const json = await fs.readJson(path.join(dir, file));
    const fragmentVersion = json.$version;

    switch (format) {
      case 'outdated':
        if (fragmentVersion !== officialVersion) {
          if (!headerPrinted) {
            console.log('## Unapplied changes');
            console.log('');
            headerPrinted = true;
          }
          const serviceName = file.replace(/^000_/, '').replace(/\.json$/, '').replace('_', '::');
          console.log(`* ${serviceName} is at ${fragmentVersion}`);
        }
        break;

      default:
        throw new Error(`Unknown format type requested: ${format}`);
    }
  }
}

main(process.argv.slice(2)).catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});