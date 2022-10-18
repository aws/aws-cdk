import * as mockfs from 'mock-fs';
import { IntegrationTests } from '../../lib/runner/integration-tests';

describe('IntegrationTests', () => {
  const tests = new IntegrationTests('test', undefined, ['javascript']);
  let stderrMock: jest.SpyInstance;
  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });
  beforeEach(() => {
    mockfs({
      'test/test-data': {
        'integ.integ-test1.ts': 'content',
        'integ.integ-test1.js': 'content',
        'integ.integ-test2.ts': 'content',
        'integ.integ-test2.js': 'content',
        'integ.integ-test3.ts': 'content',
        'integ.integ-test3.js': 'content',
        'integ_test_python.py': 'content',
        'integ-integ-test-custom-prefix.js': 'content',
      },
    });
  });

  afterEach(() => {
    mockfs.restore();
  });

  test('from cli args', async () => {
    const integTests = await tests.fromCliArgs(['test-data/integ.integ-test1.js']);

    expect(integTests.length).toEqual(1);
    expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.js$/));
  });

  test('from cli args, test not found', async () => {
    const integTests = await tests.fromCliArgs(['test-data/integ.integ-test16.js']);

    expect(integTests.length).toEqual(0);
    expect(stderrMock.mock.calls[0][0]).toContain(
      'No such integ test: test-data/integ.integ-test16.js',
    );
    expect(stderrMock.mock.calls[1][0]).toEqual(expect.stringMatching(/Available tests/));
    expect(stderrMock.mock.calls[1][0]).toEqual(expect.stringMatching(/test-data\/integ.integ-test1.js/));
    expect(stderrMock.mock.calls[1][0]).toEqual(expect.stringMatching(/test-data\/integ.integ-test2.js/));
    expect(stderrMock.mock.calls[1][0]).toEqual(expect.stringMatching(/test-data\/integ.integ-test3.js/));
  });

  test('from cli args, exclude', async () => {
    const integTests = await tests.fromCliArgs(['test-data/integ.integ-test1.js'], true);

    const fileNames = integTests.map(test => test.fileName);
    expect(integTests.length).toEqual(2);
    expect(fileNames).not.toContain(
      'test/test-data/integ.integ-test1.js',
    );
  });

  test('from cli args, only Python files', async () => {
    const onlyPythonTests = new IntegrationTests('test', undefined, ['python']);
    const integTests = await onlyPythonTests.fromCliArgs();

    expect(integTests.length).toEqual(1);
  });

  test('from cli args, Python and JavaScript files', async () => {
    const onlyPythonAndJavascriptTests = new IntegrationTests('test', undefined, ['python', 'javascript']);
    const integTests = await onlyPythonAndJavascriptTests.fromCliArgs();

    expect(integTests.length).toEqual(4);
  });

  test('from cli args, JavaScript custom prefix', async () => {
    const jsCustomPrefixTests = new IntegrationTests('test', new RegExp('^integ-'), ['javascript']);
    const integTests = await jsCustomPrefixTests.fromCliArgs();

    expect(integTests.length).toEqual(1);
  });

  test('from cli args, TypeScript compiled to JavaScript, does not pick up the compiled tests for both .ts and .js versions', async () => {
    const tsCompiledTests = new IntegrationTests('test', undefined, ['javascript', 'typescript']);
    const integTests = await tsCompiledTests.fromCliArgs();

    expect(integTests.length).toEqual(3);
  });

  test('from cli args, TypeScript compiled to JavaScript, gives precedence to TypeScript files', async () => {
    const tsCompiledTests = new IntegrationTests('test', undefined, ['javascript', 'typescript']);
    const integTests = await tsCompiledTests.fromCliArgs();

    for (const test of integTests) {
      expect(test.fileName).toEqual(expect.stringMatching(/integ.integ-test[1-3].ts/));
    }
  });

  test('from cli args, TypeScript .d.ts files should be ignored', async () => {
    mockfs({
      'test/test-data': {
        'integ.integ-test1.ts': 'content',
        'integ.integ-test1.d.ts': 'content',
      },
    });
    const tsCompiledTests = new IntegrationTests('test');
    const integTests = await tsCompiledTests.fromCliArgs();

    expect(integTests.length).toEqual(1);
    expect(integTests[0].fileName).toEqual(expect.stringMatching(/integ.integ-test1.ts/));
  });
});
