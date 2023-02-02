import { generateAll } from '@aws-cdk/cfn2ts';
import * as path from 'path';

const srcDir = path.join(__dirname, '..');
generateAll(srcDir, {
  coreImport: 'aws-cdk-lib',
});
