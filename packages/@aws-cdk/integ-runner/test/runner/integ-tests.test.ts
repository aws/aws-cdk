import * as path from 'path';
import { IntegrationTests } from '../../lib/runner/integ-tests';

const directory = path.join(__dirname, '../test-data');

describe('IntegrationTests', () => {
  test('discover integration tests', async () => {
    const tests = new IntegrationTests(directory);

    const integTests = await tests.discover();

    expect(integTests.length).toEqual(5);
    expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.js$/));
    expect(integTests[1].fileName).toEqual(expect.stringMatching(/integ.integ-test2.js$/));
  });

  test('from cli args', async () => {
    const tests = new IntegrationTests(directory);

    const integTests = await tests.fromCliArgs(['integ.integ-test1.js']);

    expect(integTests.length).toEqual(1);
    expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.js$/));
  });
});
