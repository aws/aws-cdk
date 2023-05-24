import { App } from 'aws-cdk-lib';
import { DefaultStagingStack } from '../lib';

describe('default staging stack', () => {
  describe('appId fails', () => {
    test('when appId > 20 characters', () => {
      const app = new App();
      expect(() => new DefaultStagingStack(app, 'stack', {
        appId: 'a'.repeat(21),
        qualifier: 'qualifier',
      })).toThrowError(/appId expected no more than 20 characters but got 21 characters./);
    });

    test('when uppercase characters are used', () => {
      const app = new App();
      expect(() => new DefaultStagingStack(app, 'stack', {
        appId: 'ABCDEF',
        qualifier: 'qualifier',
      })).toThrowError(/appId only accepts lowercase characters./);
    });

    test('when symbols are used', () => {
      const app = new App();
      expect(() => new DefaultStagingStack(app, 'stack', {
        appId: 'ca$h',
        qualifier: 'qualifier',
      })).toThrowError(/appId expects only letters, numbers, and dashes \('-'\)/);
    });

    test('when multiple rules broken at once', () => {
      const app = new App();
      const appId = 'AB&C'.repeat(10);
      expect(() => new DefaultStagingStack(app, 'stack', {
        appId,
        qualifier: 'qualifier',
      })).toThrowError([
        `appId ${appId} has errors:`,
        'appId expected no more than 20 characters but got 40 characters.',
        'appId only accepts lowercase characters.',
        'appId expects only letters, numbers, and dashes (\'-\')',
      ].join('\n'));
    });
  });
});