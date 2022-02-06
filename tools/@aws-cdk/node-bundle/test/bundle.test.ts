import { Bundle } from '../src';

describe('validate', () => {

  test('throws when multiple bin scripts are defined', async () => {

    const bundle = new Bundle('/Users/epolon/dev/src/github.com/aws/aws-cdk/packages/aws-cdk', { externals: ['fsevents'] });
    await bundle.validate();

  });

});