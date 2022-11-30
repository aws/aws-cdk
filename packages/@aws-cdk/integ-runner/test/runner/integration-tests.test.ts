import * as mockfs from 'mock-fs';
import { IntegrationTests } from '../../lib/runner/integration-tests';

describe('IntegrationTests', () => {
  const tests = new IntegrationTests('test');
  let stderrMock: jest.SpyInstance;
  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });

  beforeEach(() => {
    mockfs({
      'test/test-data': {
        'integ.integ-test1.js': 'content',
        'integ.integ-test2.js': 'content',
        'integ.integ-test3.js': 'content',
        'integration.test.js': 'should not match',
      },
      'other/other-data': {
        'integ.other-test1.js': 'content',
      },
    });
  });

  afterEach(() => {
    mockfs.restore();
  });

  describe('from cli args', () => {
    test('find all', async () => {
      const integTests = await tests.fromCliArgs();

      expect(integTests.length).toEqual(3);
      expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.js$/));
      expect(integTests[1].fileName).toEqual(expect.stringMatching(/integ.integ-test2.js$/));
      expect(integTests[2].fileName).toEqual(expect.stringMatching(/integ.integ-test3.js$/));
    });


    test('find named tests', async () => {
      const integTests = await tests.fromCliArgs({ tests: ['test-data/integ.integ-test1.js'] });

      expect(integTests.length).toEqual(1);
      expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.js$/));
    });


    test('test not found', async () => {
      const integTests = await tests.fromCliArgs({ tests: ['test-data/integ.integ-test16.js'] });

      expect(integTests.length).toEqual(0);
      expect(stderrMock.mock.calls[0][0]).toContain(
        'No such integ test: test-data/integ.integ-test16.js',
      );
      expect(stderrMock.mock.calls[1][0]).toContain(
        'Available tests: test-data/integ.integ-test1.js test-data/integ.integ-test2.js test-data/integ.integ-test3.js',
      );
    });

    test('exclude tests', async () => {
      const integTests = await tests.fromCliArgs({ tests: ['test-data/integ.integ-test1.js'], exclude: true });

      const fileNames = integTests.map(test => test.fileName);
      expect(integTests.length).toEqual(2);
      expect(fileNames).not.toContain(
        'test/test-data/integ.integ-test1.js',
      );
    });

    test('match regex', async () => {
      const integTests = await tests.fromCliArgs({ testRegex: ['1\.js$', '2\.js'] });

      expect(integTests.length).toEqual(2);
      expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.js$/));
      expect(integTests[1].fileName).toEqual(expect.stringMatching(/integ.integ-test2.js$/));
    });

    test('match regex with path', async () => {
      const otherTestDir = new IntegrationTests('.');
      const integTests = await otherTestDir.fromCliArgs({ testRegex: ['other-data/integ\..*\.js$'] });

      expect(integTests.length).toEqual(1);
      expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.other-test1.js$/));
    });

    test('can set app command', async () => {
      const otherTestDir = new IntegrationTests('test');
      const integTests = await otherTestDir.fromCliArgs({ app: 'node --no-warnings {filePath}' });

      expect(integTests.length).toEqual(3);
      expect(integTests[0].appCommand).toEqual('node --no-warnings {filePath}');
    });
  });
});
