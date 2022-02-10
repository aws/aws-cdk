import { Bundle } from '../src';

describe('validate', () => {

  test('throws when multiple bin scripts are defined', async () => {

    const bundle = new Bundle({
      packageDir: '/Users/epolon/dev/src/github.com/aws/aws-cdk/packages/aws-cdk',
      copyright: 'AWS Cloud Development Kit (AWS CDK)\nCopyright 2018-2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.\n',
      entrypoints: ['bin/cdk.js', 'lib/plugin.js'],
      externals: ['fsevents:optional'],
      dontAttribute: '(^@aws-cdk)',
      resources: {
        '../../node_modules/vm2/lib/contextify.js': 'bin/contextify.js',
      },
      test: 'bin/cdk --version',
    });
    bundle.pack({ target: process.cwd() });
  }, 5 * 60 * 1000);

});