import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

let copies = 1;
let templateSize = 0;
const cloudAssembly = path.join(__dirname, '..', 'cdk.out');

while (templateSize < 51200) {
  copies += 1;

  // set env variable
  process.env.IMAGE_COPIES = String(copies);

  // execute cdk synth requesting 'copies' number of ecr repos
  try {
    execSync("npx cdk synth --app='node test/integ.synth-default-resources.js' --all", {
      stdio: 'pipe',
    });
  } catch (error: any) {
    if (error.message.includes('51200')) {
      break;
    }
  }

  // find template size in cdk.out
  templateSize = fs.statSync(path.join(cloudAssembly, 'StagingStack-default-resources-ACCOUNT-REGION.template.json')).size;

  // the integ test includes 1 other ECR repository
  // eslint-disable-next-line no-console
  console.log(`repos: ${copies + 1}, size: ${templateSize} bytes`);
}

// clean up
process.env.IMAGE_COPIES = undefined;
fs.rmSync(cloudAssembly, { recursive: true, force: true });