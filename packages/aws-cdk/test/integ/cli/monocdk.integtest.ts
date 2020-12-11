import { withMonolithicCfnIncludeApp } from './cdk-helpers';
import { integTest } from './test-helpers';

jest.setTimeout(600_000);

describe('Mono CDK', () => {
  integTest('works with cloudformation-include', withMonolithicCfnIncludeApp(async (fixture) => {
    fixture.log('Starting cn-include monoCDK test');

    await fixture.cdkSynth();
  }));
});
