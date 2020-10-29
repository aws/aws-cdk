import * as path from 'path';
import * as fs from 'fs-extra';
import { PackageJson } from '../lib/packagejson';
import * as rules from '../lib/rules';
import { FakeModule } from './fake-module';

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
      packagejson: {
        features: [
          { name: 'Experimental Feature', stability: 'Experimental' },
          { name: 'Stable Feature', stability: 'Stable' },
          { name: 'Dev Preview Feature', stability: 'Developer Preview' },
          { name: 'Not Implemented Feature', stability: 'Not Implemented' },
        ],
      },
      readme: [],
    });
    const dirPath = await fakeModule.tmpdir();
    const rule = new rules.FeatureStabilityRule();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(true);
    pkgJson.applyFixes();
    const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
    expect(fixedContents).toMatch(/Experimental Feature \| \!\[Experimental\]/);
    expect(fixedContents).toMatch(/Dev Preview Feature \| \!\[Developer Preview\]/);
    expect(fixedContents).toMatch(/Stable Feature \| \!\[Stable\]/);
    expect(fixedContents).toMatch(/Not Implemented Feature \| \!\[Not Implemented\]/);
    expect(fixedContents).not.toMatch(/CFN Resources/);
  });

  test('CFN Resources is rendered', async () => {
    fakeModule = new FakeModule({
      packagejson: {
        'cdk-build': { cloudformation: 'Foo::Bar' },
        'features': [],
      },
      readme: [],
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
        packagejson: {
          'cdk-build': { cloudformation: 'Foo::Bar' },
          'features': [],
        },
        readme: [],
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
        packagejson: {
          features: [
            { name: 'Feature', stability: 'Experimental' },
          ],
        },
        readme: [],
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
        packagejson: {
          features: [
            { name: 'Feature', stability: 'Developer Preview' },
          ],
        },
        readme: [],
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
        packagejson: {
          features: [
            { name: 'Feature', stability: 'Stable' },
          ],
        },
        readme: [],
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
      packagejson: {
        private: true,
        features: [
          { name: 'Experimental Feature', stability: 'Experimental' },
        ],
      },
      readme: [],
    });
    const dirPath = await fakeModule.tmpdir();
    const rule = new rules.FeatureStabilityRule();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });

  test('skip if features is not specified', async () => {
    fakeModule = new FakeModule({
      packagejson: {},
      readme: [],
    });
    const dirPath = await fakeModule.tmpdir();
    const rule = new rules.FeatureStabilityRule();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });

  test('skip if README.md is missing', async () => {
    fakeModule = new FakeModule({
      packagejson: {
        features: [
          { name: 'Experimental Feature', stability: 'Experimental' },
        ],
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
      packagejson: {
        bundledDependencies: ['dep1', 'dep2'],
      },
      notice: [],
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.ThirdPartyAttributions();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(true);
    expect(pkgJson.reports.length).toEqual(2);
    for (const report of pkgJson.reports) {
      expect(report.ruleName).toEqual('license/3p-attributions');
    }
    expect(pkgJson.reports[0].message.includes('dep1')).toBe(true);
    expect(pkgJson.reports[0].message.includes('Missing attribution')).toBe(true);
    expect(pkgJson.reports[1].message.includes('dep2')).toBe(true);
    expect(pkgJson.reports[1].message.includes('Missing attribution')).toBe(true);
  });

  test('errors when there are excessive attributions', async() => {
    fakeModule = new FakeModule({
      packagejson: {
        bundledDependencies: ['dep1'],
      },
      notice: [
        '** dep1 - https://link-somewhere',
        '** dep2 - https://link-elsewhere',
      ],
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.ThirdPartyAttributions();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(true);
    expect(pkgJson.reports.length).toEqual(1);
    for (const report of pkgJson.reports) {
      expect(report.ruleName).toEqual('license/3p-attributions');
    }
    expect(pkgJson.reports[0].message.includes('Excessive number of attributions')).toBe(true);
  });

  test('passes when attribution is present', async() => {
    fakeModule = new FakeModule({
      packagejson: {
        bundledDependencies: ['dep1', 'dep2'],
      },
      notice: [
        '** dep1 - https://link-somewhere',
        '** dep2 - https://link-elsewhere',
      ],
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.ThirdPartyAttributions();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });

  test('skipped when no bundled dependencies', async() => {
    fakeModule = new FakeModule({
      packagejson: {
      },
      notice: [],
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.ThirdPartyAttributions();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });

  test('skipped for private packages', async () => {
    fakeModule = new FakeModule({
      packagejson: {
        private: true,
        bundledDependencies: ['dep1', 'dep2'],
      },
      notice: [],
    });
    const dirPath = await fakeModule.tmpdir();

    const rule = new rules.ThirdPartyAttributions();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });
});