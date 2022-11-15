import { writeFileSync } from 'fs';
import * as mockfs from 'mock-fs';
import { IntegrationTests, IntegrationTestsDiscoveryOptions } from '../../lib/runner/integration-tests';

describe('IntegrationTests', () => {
  const tests = new IntegrationTests('test');
  let stderrMock: jest.SpyInstance;
  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });

  beforeEach(() => {
    mockfs({
      'test/test-data': {
        'integ.integ-test1.js': 'content',
        'integ.integ-test1.ts': 'content',
        'integ.integ-test1.d.ts': 'should not match',
        'integ.integ-test2.js': 'content',
        'integ.integ-test2.ts': 'content',
        'integ.integ-test2.d.ts': 'should not match',
        'integ.integ-test3.js': 'content',
        'integ.integ-test3.ts': 'content',
        'integ.integ-test3.d.ts': 'should not match',
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

  describe('from file', () => {
    const configFile = 'integ.config.json';
    const writeConfig = (settings: IntegrationTestsDiscoveryOptions, fileName = configFile) => {
      writeFileSync(fileName, JSON.stringify(settings, null, 2), { encoding: 'utf-8' });
    };

    test('find all', async () => {
      writeConfig({});
      const integTests = await tests.fromFile(configFile);

      expect(integTests.length).toEqual(3);
      expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.js$/));
      expect(integTests[1].fileName).toEqual(expect.stringMatching(/integ.integ-test2.js$/));
      expect(integTests[2].fileName).toEqual(expect.stringMatching(/integ.integ-test3.js$/));
    });


    test('find named tests', async () => {
      writeConfig({ tests: ['test-data/integ.integ-test1.js'] });
      const integTests = await tests.fromFile(configFile);

      expect(integTests.length).toEqual(1);
      expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.js$/));
    });


    test('test not found', async () => {
      writeConfig({ tests: ['test-data/integ.integ-test16.js'] });
      const integTests = await tests.fromFile(configFile);

      expect(integTests.length).toEqual(0);
      expect(stderrMock.mock.calls[0][0]).toContain(
        'No such integ test: test-data/integ.integ-test16.js',
      );
      expect(stderrMock.mock.calls[1][0]).toContain(
        'Available tests: test-data/integ.integ-test1.js test-data/integ.integ-test2.js test-data/integ.integ-test3.js',
      );
    });

    test('exclude tests', async () => {
      writeConfig({ tests: ['test-data/integ.integ-test1.js'], exclude: true });
      const integTests = await tests.fromFile(configFile);

      const fileNames = integTests.map(test => test.fileName);
      expect(integTests.length).toEqual(2);
      expect(fileNames).not.toContain(
        'test/test-data/integ.integ-test1.js',
      );
    });

    test('match regex', async () => {
      writeConfig({ testRegex: ['1\.js$', '2\.js'] });
      const integTests = await tests.fromFile(configFile);

      expect(integTests.length).toEqual(2);
      expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.js$/));
      expect(integTests[1].fileName).toEqual(expect.stringMatching(/integ.integ-test2.js$/));
    });

    test('match regex with path', async () => {
      writeConfig({ testRegex: ['other-data/integ\..*\.js$'] });
      const otherTestDir = new IntegrationTests('.');
      const integTests = await otherTestDir.fromFile(configFile);

      expect(integTests.length).toEqual(1);
      expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.other-test1.js$/));
    });

    test('can set app command', async () => {
      writeConfig({ app: 'node --no-warnings {filePath}' });
      const integTests = await tests.fromFile(configFile);

      expect(integTests.length).toEqual(3);
      expect(integTests[0].appCommand).toEqual('node --no-warnings {filePath}');
    });

    test('TypeScript compiled to JavaScript, does not pick up the compiled tests for both .ts and .js versions', async () => {
      const tsCompiledTests = new IntegrationTests('test');
      const integTests = await tsCompiledTests.fromCliArgs();

      expect(integTests.length).toEqual(3);
    });

    test('TypeScript compiled to JavaScript, gives precedence to JavaScript files', async () => {
      const tsCompiledTests = new IntegrationTests('test');
      const integTests = await tsCompiledTests.fromCliArgs();

      for (const test of integTests) {
        expect(test.fileName).toEqual(expect.stringMatching(/integ.integ-test[1-3].js/));
      }
    });

    test('TypeScript .d.ts files should be ignored', async () => {
      writeConfig({ language: ['typescript'] });

      const tsCompiledTests = new IntegrationTests('test');
      const integTests = await tsCompiledTests.fromFile(configFile);

      expect(integTests.length).toEqual(3);
      expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.ts/));
    });
  });
});
