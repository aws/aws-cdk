import { FrameworkGenerator } from '../lib/handler-framework';

describe('framework generator', () => {
  test('generate and render cdk handler', () => {
    const cdkHandler = FrameworkGenerator.generateCdkHandler();
    /* eslint-disable no-console */
    console.log(cdkHandler.render());
  });
});
