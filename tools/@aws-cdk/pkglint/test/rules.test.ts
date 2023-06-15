import * as path from 'path';
import * as fs from 'fs-extra';
import { FakeModule } from './fake-module';
import { PackageJson } from '../lib/packagejson';
import * as rules from '../lib/rules';

describe('FeatureStabilityRule', () => {
  let fakeModule: FakeModule | undefined;

  beforeEach(() => {
    fakeModule = undefined;
  });

  afterEach(async () => {
    if (fakeModule) {
      await fakeModule.cleanup();
    }
  });

  test('feature table is rendered', async () => {
    fakeModule = new FakeModule({
      files: {
        'package.json': {
          features: [
            { name: 'Experimental Feature', stability: 'Experimental' },
            { name: 'Stable Feature', stability: 'Stable' },
            { name: 'Dev Preview Feature', stability: 'Developer Preview' },
            { name: 'Not Implemented Feature', stability: 'Not Implemented' },
          ],
        },
        'README.md': '',
      },
    });
    const dirPath = await fakeModule.tmpdir();
    const rule = new rules.FeatureStabilityRule();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(true);
    pkgJson.applyFixes();
    const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
    expect(fixedContents).toMatch(/Experimental Feature\s* \| \!\[Experimental\]/);
    expect(fixedContents).toMatch(/Dev Preview Feature\s* \| \!\[Developer Preview\]/);
    expect(fixedContents).toMatch(/Stable Feature\s* \| \!\[Stable\]/);
    expect(fixedContents).toMatch(/Not Implemented Feature\s* \| \!\[Not Implemented\]/);
    expect(fixedContents).not.toMatch(/CFN Resources/);
  });

  test('CFN Resources is rendered', async () => {
    fakeModule = new FakeModule({
      files: {
        'package.json': {
          'cdk-build': { cloudformation: 'Foo::Bar' },
          'features': [],
        },
        'README.md': '',
      },
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.FeatureStabilityRule();
    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);
    expect(pkgJson.hasReports).toBe(true);
    pkgJson.applyFixes();
    const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });

    expect(fixedContents).toMatch(/CFN Resources | \!\[Stable\]/);
  });

  describe('banner notices', () => {
    test('CFN Resources', async () => {
      fakeModule = new FakeModule({
        files: {
          'package.json': {
            'cdk-build': { cloudformation: 'Foo::Bar' },
            'features': [],
          },
          'README.md': '',
        },
      });
      const dirPath = await fakeModule.tmpdir();
      const rule = new rules.FeatureStabilityRule();

      const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
      rule.validate(pkgJson);
      pkgJson.applyFixes();

      const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
      expect(fixedContents).toMatch(/> \*\*CFN Resources:\*\*/);
    });

    test('experimental', async () => {
      fakeModule = new FakeModule({
        files: {
          'package.json': {
            features: [
              { name: 'Feature', stability: 'Experimental' },
            ],
          },
          'README.md': '',
        },
      });
      const dirPath = await fakeModule.tmpdir();
      const rule = new rules.FeatureStabilityRule();

      const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
      rule.validate(pkgJson);
      pkgJson.applyFixes();

      const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
      expect(fixedContents).toMatch(/> \*\*Experimental:\*\*/);
      expect(fixedContents).not.toMatch(/> \*\*Developer Preview:\*\*/);
      expect(fixedContents).not.toMatch(/> \*\*Stable:\*\*/);
    });

    test('developer preview', async () => {
      fakeModule = new FakeModule({
        files: {
          'package.json': {
            features: [
              { name: 'Feature', stability: 'Developer Preview' },
            ],
          },
          'README.md': '',
        },
      });
      const dirPath = await fakeModule.tmpdir();
      const rule = new rules.FeatureStabilityRule();

      const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
      rule.validate(pkgJson);
      pkgJson.applyFixes();

      const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
      expect(fixedContents).toMatch(/> \*\*Developer Preview:\*\*/);
      expect(fixedContents).not.toMatch(/> \*\*Experimental:\*\*/);
      expect(fixedContents).not.toMatch(/> \*\*Stable:\*\*/);
    });

    test('stable', async () => {
      fakeModule = new FakeModule({
        files: {
          'package.json': {
            features: [
              { name: 'Feature', stability: 'Stable' },
            ],
          },
          'README.md': '',
        },
      });
      const dirPath = await fakeModule.tmpdir();
      const rule = new rules.FeatureStabilityRule();

      const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
      rule.validate(pkgJson);
      pkgJson.applyFixes();

      const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
      expect(fixedContents).toMatch(/> \*\*Stable:\*\*/);
      expect(fixedContents).not.toMatch(/> \*\*Experimental:\*\*/);
      expect(fixedContents).not.toMatch(/> \*\*Developer Preview:\*\*/);
    });
  });

  test('skip if package private', async () => {
    fakeModule = new FakeModule({
      files: {
        'package.json': {
          private: true,
          features: [
            { name: 'Experimental Feature', stability: 'Experimental' },
          ],
        },
        'README.md': '',
      },
    });
    const dirPath = await fakeModule.tmpdir();
    const rule = new rules.FeatureStabilityRule();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });

  test('skip if features is not specified', async () => {
    fakeModule = new FakeModule({
      files: {
        'package.json': {},
        'README.md': '',
      },
    });
    const dirPath = await fakeModule.tmpdir();
    const rule = new rules.FeatureStabilityRule();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });

  test('skip if README.md is missing', async () => {
    fakeModule = new FakeModule({
      files: {
        'package.json': {
          features: [
            { name: 'Experimental Feature', stability: 'Experimental' },
          ],
        },
      },
    });
    const dirPath = await fakeModule.tmpdir();
    const rule = new rules.FeatureStabilityRule();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });
});

describe('ThirdPartyAttributions', () => {
  let fakeModule: FakeModule | undefined;

  beforeEach(() => {
    fakeModule = undefined;
  });

  afterEach(async () => {
    if (fakeModule) {
      await fakeModule.cleanup();
    }
  });

  test('errors when attribution missing for bundled dependencies', async() => {
    fakeModule = new FakeModule({
      files: {
        'package.json': {
          bundledDependencies: ['dep1', 'dep2'],
        },
        'node_modules/dep1/package.json': {},
        'node_modules/dep2/package.json': {},
        'NOTICE': '',
      },
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.ThirdPartyAttributions();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(true);
    expect(pkgJson.reports.length).toEqual(2);
    for (const report of pkgJson.reports) {
      expect(report.ruleName).toEqual('license/3p-attributions');
      expect(report.message).toContain('Missing attribution');
    }
    expect(pkgJson.reports[0].message).toContain('dep1');
    expect(pkgJson.reports[1].message).toContain('dep2');
  });

  test('errors when there are excessive attributions', async() => {
    fakeModule = new FakeModule({
      files: {
        'package.json': {
          bundledDependencies: ['dep1'],
        },
        'node_modules/dep1/package.json': {},
        'NOTICE': [
          '** dep1 - https://link-somewhere',
          '** dep2 - https://link-elsewhere',
          '** dep3-rev - https://link-elsewhere',
        ].join('\n'),
      },
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.ThirdPartyAttributions();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(true);
    expect(pkgJson.reports.length).toEqual(2);
    for (const report of pkgJson.reports) {
      expect(report.ruleName).toEqual('license/3p-attributions');
      expect(report.message).toContain('Unnecessary attribution');
    }
    expect(pkgJson.reports[0].message).toContain('dep2');
    expect(pkgJson.reports[1].message).toContain('dep3-rev');
  });

  test('passes when attribution is present', async() => {
    fakeModule = new FakeModule({
      files: {
        'package.json': {
          bundledDependencies: ['dep1', 'dep2'],
        },
        'node_modules/dep1/package.json': {},
        'node_modules/dep2/package.json': {},
        'NOTICE': [
          '** dep1 - https://link-somewhere',
          '** dep2 - https://link-elsewhere',
        ].join('\n'),
      },
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.ThirdPartyAttributions();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });

  test('passes when attribution for transitive bundled deps are present', async() => {
    fakeModule = new FakeModule({
      files: {
        'package.json': {
          bundledDependencies: ['dep1'],
        },
        'node_modules/dep1/package.json': {
          dependencies: { dep2: '1.2.3' },
        },
        'node_modules/dep2/package.json': {},
        'NOTICE': [
          '** dep1 - https://link-somewhere',
          '** dep2 - https://link-elsewhere',
        ].join('\n'),
      },
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.ThirdPartyAttributions();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });

  test('fails when attribution for transitive bundled deps are missing', async() => {
    fakeModule = new FakeModule({
      files: {
        'package.json': {
          bundledDependencies: ['dep1'],
        },
        'node_modules/dep1/package.json': {
          dependencies: { dep2: '1.2.3' },
        },
        'node_modules/dep2/package.json': {},
        'NOTICE': [
          '** dep1 - https://link-somewhere',
        ].join('\n'),
      },
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.ThirdPartyAttributions();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(true);
    expect(pkgJson.reports.length).toEqual(1);
    expect(pkgJson.reports[0].ruleName).toEqual('license/3p-attributions');
    expect(pkgJson.reports[0].message).toContain('Missing attribution');
    expect(pkgJson.reports[0].message).toContain('dep2');
  });

  test('skipped when no bundled dependencies', async() => {
    fakeModule = new FakeModule({
      files: {
        'package.json': {
        },
        'NOTICE': '',
      },
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.ThirdPartyAttributions();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });

  test('skipped for private packages', async () => {
    fakeModule = new FakeModule({
      files: {
        'package.json': {
          private: true,
          bundledDependencies: ['dep1', 'dep2'],
        },
        'node_modules/dep1/package.json': {},
        'node_modules/dep2/package.json': {},
        'NOTICE': '',
      },
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.ThirdPartyAttributions();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });
});
