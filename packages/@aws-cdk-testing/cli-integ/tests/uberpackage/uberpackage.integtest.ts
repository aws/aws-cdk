import { integTest, withSpecificFixture } from '../../lib';

jest.setTimeout(600_000);

describe('uberpackage', () => {
  integTest('works with cloudformation-include', withSpecificFixture('cfn-include-app', async (fixture) => {
    fixture.log('Starting test of cfn-include with monolithic CDK');

    await fixture.cdkSynth();
  }));
});
