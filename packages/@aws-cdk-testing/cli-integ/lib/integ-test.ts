import * as fs from 'fs';
import * as path from 'path';
import { MemoryStream } from './corking';

const SKIP_TESTS = fs.readFileSync(path.join(__dirname, '..', 'skip-tests.txt'), { encoding: 'utf-8' }).split('\n');

export interface TestContext {
  readonly randomString: string;
  readonly output: NodeJS.WritableStream;
  log(s: string): void;
};

/**
 * A wrapper for jest's 'test' which takes regression-disabled tests into account and prints a banner
 */
export function integTest(
  name: string,
  callback: (context: TestContext) => Promise<void>,
  timeoutMillis?: number,
) {

  // Integ tests can run concurrently, and are responsible for blocking
  // themselves if they cannot.  Because `test.concurrent` executes the test
  // code immediately, regardles of any `--testNamePattern`, this cannot be the
  // default: test filtering simply does not work with `test.concurrent`.
  // Instead, we make it opt-in only for the pipeline where we don't do any
  // selection, but execute all tests unconditionally.
  const testKind = process.env.JEST_TEST_CONCURRENT === 'true' ? test.concurrent : test;
  const runner = shouldSkip(name) ? testKind.skip : testKind;

  runner(name, async () => {
    const output = new MemoryStream();

    output.write('================================================================\n');
    output.write(`${name}\n`);
    output.write('================================================================\n');

    try {
      return await callback({
        output,
        randomString: randomString(),
        log(s: string) {
          output.write(`${s}\n`);
        },
      });
    } catch (e) {
      output.write(e.message);
      output.write(e.stack);
      // Print output only if the test fails. Use 'console.log' so the output is buffered by
      // jest and prints without a stack trace (if verbose: false).
      // eslint-disable-next-line no-console
      console.log(output.buffer().toString());
      throw e;
    }
  }, timeoutMillis);
}

function shouldSkip(testName: string) {
  return SKIP_TESTS.includes(testName);
}

export function randomString() {
  // Crazy
  return Math.random().toString(36).replace(/[^a-z0-9]+/g, '');
}