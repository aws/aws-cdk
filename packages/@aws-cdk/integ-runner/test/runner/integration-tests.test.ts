import * as path from 'path';
import { IntegrationTests } from '../../lib/runner/integ-tests';

const directory = path.join(__dirname, '../test-data');

describe('IntegrationTests', () => {
  test('from cli args', async () => {
    const tests = new IntegrationTests(directory);

    const integTests = await tests.fromCliArgs(['integ.integ-test1.js']);

    expect(integTests.length).toEqual(1);
    expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.js$/));
  });
});
