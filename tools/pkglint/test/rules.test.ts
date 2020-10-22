import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { PackageJson } from '../lib/packagejson';
import * as rules from '../lib/rules';

describe('FeatureStabilityRule', () => {
  test('feature table is rendered', async () => {
    const dirPath = await fakeModuleDir({
      features: [
        { name: 'Experimental Feature', stability: 'Experimental' },
        { name: 'Stable Feature', stability: 'Stable' },
        { name: 'Dev Preview Feature', stability: 'Developer Preview' },
        { name: 'Not Implemented Feature', stability: 'Not Implemented' },
      ],
    });
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
    const dirPath = await fakeModuleDir({
      'cdk-build': { cloudformation: 'Foo::Bar' },
      'features': [],
    });

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
      const dirPath = await fakeModuleDir({
        'cdk-build': { cloudformation: 'Foo::Bar' },
        'features': [],
      });
      const rule = new rules.FeatureStabilityRule();

      const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
      rule.validate(pkgJson);
      pkgJson.applyFixes();

      const fixedContents = await fs.readFile(path.join(dirPath, 'README.md'), { encoding: 'utf8' });
      expect(fixedContents).toMatch(/> \*\*CFN Resources:\*\*/);
    });

    test('experimental', async () => {
      const dirPath = await fakeModuleDir({
        features: [
          { name: 'Feature', stability: 'Experimental' },
        ],
      });
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
      const dirPath = await fakeModuleDir({
        features: [
          { name: 'Feature', stability: 'Developer Preview' },
        ],
      });
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
      const dirPath = await fakeModuleDir({
        features: [
          { name: 'Feature', stability: 'Stable' },
        ],
      });
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
    const dirPath = await fakeModuleDir({
      private: true,
      features: [
        { name: 'Experimental Feature', stability: 'Experimental' },
      ],
    });
    const rule = new rules.FeatureStabilityRule();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });

  test('skip if features is not specified', async () => {
    const dirPath = await fakeModuleDir({});
    const rule = new rules.FeatureStabilityRule();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });

  test('skip if README.md is missing', async () => {
    const dirPath = await fakeModuleDir({
      features: [
        { name: 'Experimental Feature', stability: 'Experimental' },
      ],
    }, false);
    const rule = new rules.FeatureStabilityRule();

    const pkgJson = new PackageJson(path.join(dirPath, 'package.json'));
    rule.validate(pkgJson);

    expect(pkgJson.hasReports).toBe(false);
  });
});

async function fakeModuleDir(json: { [key: string]: any }, createReadme: boolean = true): Promise<string> {
  const tmpdir = await fs.mkdtemp(path.join(os.tmpdir(), 'pkglint-rules-test-'));
  await fs.writeFile(path.join(tmpdir, 'package.json'), JSON.stringify(json));
  if (createReadme) {
    await fs.createFile(path.join(tmpdir, 'README.md'));
  }
  return tmpdir;
}