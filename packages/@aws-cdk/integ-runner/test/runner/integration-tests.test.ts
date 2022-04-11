import { IntegrationTests } from '../../lib/runner/integ-tests';

describe('IntegrationTests', () => {
  test('from cli args', async () => {
    const tests = new IntegrationTests('test');

    const integTests = await tests.fromCliArgs(['test/test-data/integ.integ-test1.js']);

    expect(integTests.length).toEqual(1);
    expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.js$/));
  });
});
