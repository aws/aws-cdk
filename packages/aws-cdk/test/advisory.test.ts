import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { NetmaskAdvisory } from '../lib/advisory';

describe('advisories', () => {
  describe('netmask advisory', () => {
    const dir: string = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-advisories-test-'));

    beforeEach(() => {
      fs.removeSync(dir);
      fs.mkdirSync(dir);
    });

    test('report', () => {
      // GIVEN
      fs.writeJSONSync(path.join(dir, 'package.json'), {
        dependencies: {
          'aws-cdk': '1.10.1',
        },
      });
      fs.writeFileSync(path.join(dir, 'yarn.lock'), ' ');

      // WHEN
      const advisory = new NetmaskAdvisory(dir);
      const msg = advisory.message();

      // THEN
      expect(msg).toBeDefined();
      expect(msg!.length > 0);
    });

    test('report if netmask version is <2', () => {
      // GIVEN
      fs.writeJSONSync(path.join(dir, 'package.json'), {
        dependencies: {
          'aws-cdk': '1.10.1',
        },
        resolutions: {
          netmask: '1.6.1',
        },
      });
      fs.writeFileSync(path.join(dir, 'yarn.lock'), ' ');

      // WHEN
      const advisory = new NetmaskAdvisory(dir);
      const msg = advisory.message();

      // THEN
      expect(msg).toBeDefined();
      expect(msg!.length > 0);
    });

    test('skip when not in a node package', () => {
      // GIVEN
      // empty dir

      // WHEN
      const advisory = new NetmaskAdvisory(dir);
      const msg = advisory.message();

      // THEN
      expect(msg).toBeUndefined();
    });

    test('skip when not a yarn package', () => {
      // GIVEN
      fs.writeJSONSync(path.join(dir, 'package.json'), {
        dependencies: {
          'aws-cdk': '1.10.1',
        },
      });
      fs.writeFileSync(path.join(dir, 'package-lock.json'), ' ');

      // WHEN
      const advisory = new NetmaskAdvisory(dir);
      const msg = advisory.message();

      // THEN
      expect(msg).toBeUndefined();
    });

    test('skip if cdk is not in package.json', () => {
      // GIVEN
      fs.writeJSONSync(path.join(dir, 'package.json'), {});
      fs.writeFileSync(path.join(dir, 'yarn.lock'), ' ');

      // WHEN
      const advisory = new NetmaskAdvisory(dir);
      const msg = advisory.message();

      // THEN
      expect(msg).toBeUndefined();
    });

    test.each(['2.x.y', '~2.x.y', '^2.x.y'])('skip if netmask version is %s', () => {
      // GIVEN
      fs.writeJSONSync(path.join(dir, 'package.json'), {
        dependencies: {
          'aws-cdk': '1.10.1',
        },
        resolutions: {
          netmask: '2.x.y',
        },
      });
      fs.writeFileSync(path.join(dir, 'package-lock.json'), ' ');
      fs.writeFileSync(path.join(dir, 'yarn.lock'), ' ');

      // WHEN
      const advisory = new NetmaskAdvisory(dir);
      const msg = advisory.message();

      // THEN
      expect(msg).toBeUndefined();
    });
  });
});