import { Bundle } from '../src';

describe('validate', () => {

  test('throws when multiple bin scripts are defined', async () => {

    const bundle = new Bundle({
      packageDir: '/Users/epolon/dev/src/github.com/aws/aws-cdk/packages/aws-cdk',
      copyright: 'Copyright 2018-2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.',
      externals: ['fsevents'],
      dontAttribute: '(^@aws-cdk)',
      resources: {
        '../../node_modules/vm2/lib/contextify.js': 'bin',
      },
    });
    bundle.pack(process.cwd());
  }, 5 * 60 * 1000);

});