import { withMonolithicCfnIncludeApp } from '../helpers/cdk-helpers';
import { integTest } from '../helpers/test-helpers';

jest.setTimeout(600_000);

describe('Mono CDK', () => {
  integTest('works with cloudformation-include', withMonolithicCfnIncludeApp(async (fixture) => {
    fixture.log('Starting cn-include monoCDK test');

    await fixture.cdkSynth();
  }));
});
