import * as mockfs from 'mock-fs';
import { IntegrationTests } from '../../lib/runner/integration-tests';

describe('IntegrationTests Discovery', () => {
  const tests = new IntegrationTests('test');
  let stderrMock: jest.SpyInstance;
  stderrMock = jest.spyOn(process.stderr, 'write').mockImplementation(() => { return true; });

  beforeEach(() => {
    mockfs({
      'test/test-data': {
        'integ.test1.js': 'javascript',
        'integ.test2.js': 'javascript',
        'integ.test3.js': 'javascript',
        'integration.test.js': 'javascript-no-match',

        'integ.test1.ts': 'typescript',
        'integ.test2.ts': 'typescript',
        'integ.test3.ts': 'typescript',
        'integ.test3.d.ts': 'typescript-no-match',
        'integration.test.ts': 'typescript-no-match',

        'integ_test1.py': 'python',
        'integ_test2.py': 'python',
        'integ_test3.py': 'python',
        'integ.integ-test.py': 'python-no-match',
      },
      'other/other-data': {
        'integ.other-test1.js': 'javascript',
        'integ.other-test1.ts': 'typescript',
        'integ_other-test1.py': 'python',
      },
    });
  });

  afterEach(() => {
    mockfs.restore();
    stderrMock.mockReset();
  });

  describe.each([
    ['javascript', 'js', 'integ.test1.js'],
    ['typescript', 'ts', 'integ.test1.ts'],
    ['python', 'py', 'integ_test1.py'],
  ])('%s', (language, fileExtension, namedTest) => {
    const cliOptions = {
      language: [language],
    };

    test('assert test inputs', () => {
      expect(namedTest).toContain('.' + fileExtension);
    });

    describe('from cli args', () => {
      test('find all', async () => {
        const integTests = await tests.fromCliOptions(cliOptions);

        expect(integTests.length).toEqual(3);
        expect(integTests[0].fileName).toEqual(expect.stringMatching(new RegExp(`^.*test1\\.${fileExtension}$`)));
        expect(integTests[1].fileName).toEqual(expect.stringMatching(new RegExp(`^.*test2\\.${fileExtension}$`)));
        expect(integTests[2].fileName).toEqual(expect.stringMatching(new RegExp(`^.*test3\\.${fileExtension}$`)));
      });

      test('find named tests', async () => {
        const integTests = await tests.fromCliOptions({ ...cliOptions, tests: [`test-data/${namedTest}`] });

        expect(integTests.length).toEqual(1);
        expect(integTests[0].fileName).toEqual(expect.stringMatching(namedTest));
      });


      test('test not found', async () => {
        const integTests = await tests.fromCliOptions({ ...cliOptions, tests: [`test-data/${namedTest}`.replace('test1', 'test42')] });

        expect(integTests.length).toEqual(0);
        expect(stderrMock.mock.calls[0][0].trim()).toMatch(
          new RegExp(`No such integ test: test-data\\/.*test42\\.${fileExtension}`),
        );
        expect(stderrMock.mock.calls[1][0]).toMatch(
          new RegExp(`Available tests: test-data\\/.*test1\\.${fileExtension} test-data\\/.*test2\\.${fileExtension} test-data\\/.*test3\\.${fileExtension}`),
        );
      });

      test('exclude tests', async () => {
        const integTests = await tests.fromCliOptions({ ...cliOptions, tests: [`test-data/${namedTest}`], exclude: true });

        const fileNames = integTests.map(test => test.fileName);
        expect(integTests.length).toEqual(2);
        expect(fileNames).not.toContain(
          `test/test-data/${namedTest}`,
        );
      });

      test('match regex', async () => {
        const integTests = await tests.fromCliOptions({
          language: [language],
          testRegex: [`[12]\\.${fileExtension}$`],
        });

        expect(integTests.length).toEqual(2);
        expect(integTests[0].fileName).toEqual(expect.stringMatching(new RegExp(`1\\.${fileExtension}$`)));
        expect(integTests[1].fileName).toEqual(expect.stringMatching(new RegExp(`2\\.${fileExtension}$`)));
      });

      test('match regex with path', async () => {
        const otherTestDir = new IntegrationTests('.');
        const integTests = await otherTestDir.fromCliOptions({
          language: [language],
          testRegex: [`other-data/integ.*\\.${fileExtension}$`],
        });

        expect(integTests.length).toEqual(1);
        expect(integTests[0].fileName).toEqual(expect.stringMatching(new RegExp(`.*other-test1\\.${fileExtension}$`)));
      });
    });
  });

  describe('Same test file in JS and TS is only running JS', () => {
    const cliOptions = {
      language: ['javascript', 'typescript'],
    };

    test('find only JS files', async () => {
      const integTests = await tests.fromCliOptions(cliOptions);

      expect(integTests.length).toEqual(3);
      expect(integTests[0].fileName).toEqual(expect.stringMatching(new RegExp('^.*test1\\.js$')));
      expect(integTests[1].fileName).toEqual(expect.stringMatching(new RegExp('^.*test2\\.js$')));
      expect(integTests[2].fileName).toEqual(expect.stringMatching(new RegExp('^.*test3\\.js$')));
    });
  });
});
