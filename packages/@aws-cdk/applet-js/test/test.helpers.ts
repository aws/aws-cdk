import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { extractModuleName, isStackConstructor, parseApplet } from '../lib/applet-helpers';

export = {
  'test that refactoring Stack didn\'t break Stack detection'(test: Test) {
    test.equals(true, isStackConstructor(cdk.Stack));
    test.done();
  },

  'test package name extraction'(test: Test) {
    test.equals('my-package', extractModuleName('my-package'));
    test.equals('my-package', extractModuleName('my-package@1.0'));
    test.equals('@scope/my-package', extractModuleName('@scope/my-package'));
    test.equals('@scope/my-package', extractModuleName('@scope/my-package@1.0'));
    test.done();
  },

  'test applet name extraction'(test: Test) {
    test.deepEqual(parseApplet('applet'), {
      moduleName: 'applet',
      className: 'Applet'
    });

    test.deepEqual(parseApplet('applet:Class'), {
      moduleName: 'applet',
      className: 'Class'
    });

    test.deepEqual(parseApplet('npm://applet:Class'), {
      npmPackage: 'applet',
      moduleName: 'applet',
      className: 'Class'
    });

    test.deepEqual(parseApplet('npm://applet@1.0:Class'), {
      npmPackage: 'applet@1.0',
      moduleName: 'applet',
      className: 'Class'
    });

    test.deepEqual(parseApplet('npm://applet@1.0'), {
      npmPackage: 'applet@1.0',
      moduleName: 'applet',
      className: 'Applet'
    });

    test.deepEqual(parseApplet('npm://@scope/applet@1.0'), {
      npmPackage: '@scope/applet@1.0',
      moduleName: '@scope/applet',
      className: 'Applet'
    });

    test.done();
  }
};