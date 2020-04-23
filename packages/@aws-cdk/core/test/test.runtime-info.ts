import { Test } from 'nodeunit';
import { collectRuntimeInformation } from '../lib/private/runtime-info';

export = {
  'version reporting includes @aws-solutions-konstruk libraries'(test: Test) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
    const resolved = require('path').resolve('test/runtime-info-konstruk-fixture');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require(resolved);

    const runtimeInfo = collectRuntimeInformation();

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const version = require('../package.json').version;
    test.deepEqual(runtimeInfo.libraries , {
      '@aws-cdk/core': version,
      '@aws-cdk/cx-api': version,
      '@aws-cdk/cloud-assembly-schema': version,
      '@aws-solutions-konstruk/foo': version,
      'jsii-runtime': `node.js/${process.version}`,
    });
    test.done();
  },
};