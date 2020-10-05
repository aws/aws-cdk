import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { collectRuntimeInformation } from '../lib/private/runtime-info';

nodeunitShim({
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
    test.deepEqual(runtimeInfo.libraries['@aws-solutions-konstruk/foo'], mockVersion);
    test.done();
  },

  'version reporting finds aws-rfdk package'(test: Test) {
    const pkgdir = fs.mkdtempSync(path.join(os.tmpdir(), 'runtime-info-rfdk'));
    const mockVersion = '1.2.3';

    fs.writeFileSync(path.join(pkgdir, 'index.js'), 'module.exports = \'this is foo\';');
    fs.writeFileSync(path.join(pkgdir, 'package.json'), JSON.stringify({
      name: 'aws-rfdk',
      version: mockVersion,
    }));

    // eslint-disable-next-line @typescript-eslint/no-require-imports, import/no-extraneous-dependencies
    require(pkgdir);

    const runtimeInfo = collectRuntimeInformation();

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    test.deepEqual(runtimeInfo.libraries['aws-rfdk'], mockVersion);
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
});
