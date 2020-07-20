import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Test } from 'nodeunit';
import { collectRuntimeInformation } from '../lib/private/runtime-info';

export = {
  'version reporting includes @aws-solutions-konstruk libraries'(test: Test) {
    const pkgdir = fs.mkdtempSync(path.join(os.tmpdir(), 'runtime-info-konstruk-fixture'));
    const mockVersion = '1.2.3';

    fs.writeFileSync(path.join(pkgdir, 'index.js'), 'module.exports = \'this is foo\';');
    fs.writeFileSync(path.join(pkgdir, 'package.json'), JSON.stringify({
      name: '@aws-solutions-konstruk/foo',
      version: mockVersion,
    }));

    // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
    require(pkgdir);

    const runtimeInfo = collectRuntimeInformation();

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const version = require('../package.json').version;
    test.deepEqual(runtimeInfo.libraries , {
      '@aws-cdk/core': version,
      '@aws-cdk/cx-api': version,
      '@aws-cdk/cloud-assembly-schema': version,
      '@aws-solutions-konstruk/foo': mockVersion,
      'jsii-runtime': `node.js/${process.version}`,
    });
    test.done();
  },

  'version reporting finds no version with no associated package.json'(test: Test) {
    const pkgdir = fs.mkdtempSync(path.join(os.tmpdir(), 'runtime-info-find-npm-package-fixture'));
    const mockVersion = '1.2.3';

    fs.writeFileSync(path.join(pkgdir, 'index.js'), 'module.exports = \'this is bar\';');
    fs.mkdirSync(path.join(pkgdir, 'bar'));
    fs.writeFileSync(path.join(pkgdir, 'bar', 'package.json'), JSON.stringify({
      name: '@aws-solutions-konstruk/bar',
      version: mockVersion,
    }));

    // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
    require(pkgdir);

    const cwd = process.cwd();

    // Switch to `bar` where the package.json is, then resolve version.  Fails when module.resolve
    // is passed an empty string in the paths array.
    process.chdir(path.join(pkgdir, 'bar'));
    const runtimeInfo = collectRuntimeInformation();
    process.chdir(cwd);

    test.equal(runtimeInfo.libraries['@aws-solutions-konstruk/bar'], undefined);
    test.done();
  },
};
