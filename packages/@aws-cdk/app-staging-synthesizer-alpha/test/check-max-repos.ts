/*
 * Run this file as a script ("node check-max-repos.js") to test
 * how many ECR repositories are allowed in the template before the
 * template size exceeds 51200 bytes.
 */

import * as fs from 'fs';
import * as path from 'path';
import { APP_ID_MAX, testWithXRepos } from './util';

checkMaxRepos();

function checkMaxRepos(): number {
  let copies = 1;
  let templateSize = 0;
  const cloudAssembly = path.join(__dirname, '..', 'cdk.out');

  while (testWithXRepos(copies)) {
    // find template size in cdk.out
    templateSize = fs.statSync(path.join(cloudAssembly, `StagingStack-${APP_ID_MAX}-ACCOUNT-REGION.template.json`)).size;

    // the integ test includes 1 other ECR repository
    // eslint-disable-next-line no-console
    console.log(`repos: ${copies + 1}, size: ${templateSize} bytes`);

    copies += 1;
  }

  // clean up
  process.env.IMAGE_COPIES = undefined;
  fs.rmSync(cloudAssembly, { recursive: true, force: true });
  return copies;
}
