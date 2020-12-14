import { withMonolithicCfnIncludeCdkApp } from '../lib/cdk';
import { integTest } from '../lib/test-helpers';

describe('uberpackage', () => {
  integTest('works with cloudformation-include', withMonolithicCfnIncludeCdkApp(async (fixture) => {
    fixture.log('Starting test of cfn-include with monolithic CDK');

    await fixture.cdkSynth();
  }));
});
