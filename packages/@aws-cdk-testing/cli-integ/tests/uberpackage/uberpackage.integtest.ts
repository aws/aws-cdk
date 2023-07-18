import { integTest, withMonolithicCfnIncludeCdkApp } from '../../lib';

jest.setTimeout(600_000);

describe('uberpackage', () => {
  integTest('works with cloudformation-include', withMonolithicCfnIncludeCdkApp(async (fixture) => {
    fixture.log('Starting test of cfn-include with monolithic CDK');

    await fixture.cdkSynth();
  }));
});
