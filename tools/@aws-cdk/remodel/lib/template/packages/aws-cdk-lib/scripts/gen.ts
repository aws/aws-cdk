import { generateAll } from '@aws-cdk/cfn2ts';
import * as path from 'path';

const srcDir = path.join(__dirname, '..', 'lib');
generateAll(srcDir, {
  coreImport: 'aws-cdk-lib',
});
