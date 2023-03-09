/* eslint-disable no-console */
/**
 * Report on spec fragment files that are being held back.
 *
 * Report formats:
 *
 * - 'outdated'/'changelog': print for changelog format
 * - 'rejected': print validation errors, exit with error code 1 if there are any
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import { CfnSpecValidator, formatErrorInContext } from './validate-cfn';

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
    const serviceName = file.replace(/^000_/, '').replace(/\.json$/, '').replace('_', '::');

    switch (format) {
      case 'outdated':
      case 'changelog':
        if (fragmentVersion !== officialVersion) {
          if (!headerPrinted) {
            console.log('## Unapplied changes');
            console.log('');
            headerPrinted = true;
          }
          console.log(`* ${serviceName} is at ${fragmentVersion}`);
        }
        break;

      case 'rejected':
        if (fragmentVersion !== officialVersion) {
          // Read the 'rejected' file, parse it (which we expect to fail)
          // and print the failures.
          const rejectedFileName = `.${file.replace(/.json$/, '.rejected.json')}`;
          const rejectedPath = path.join(dir, rejectedFileName);
          if (!await fs.pathExists(rejectedPath)) {
            // If for whatever reason the file doesn't exist, ignore
            continue;
          }
          const rejectedSpec = await fs.readJson(rejectedPath);

          const errors = CfnSpecValidator.validate(rejectedSpec);

          console.warn('='.repeat(70));
          console.warn(' '.repeat(Math.floor(35 - serviceName.length / 2)) + serviceName);
          console.warn('='.repeat(70));
          for (const error of errors) {
            console.warn(formatErrorInContext(error));
            process.exitCode = 1;
          }
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