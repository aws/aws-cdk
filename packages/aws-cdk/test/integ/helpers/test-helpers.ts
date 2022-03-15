import * as fs from 'fs';
import * as path from 'path';
import { MemoryStream } from './corking';

const SKIP_TESTS = fs.readFileSync(path.join(__dirname, 'skip-tests.txt'), { encoding: 'utf-8' }).split('\n');

export type TestContext = { readonly output: NodeJS.WritableStream; };

/**
 * A wrapper for jest's 'test' which takes regression-disabled tests into account and prints a banner
 */
export function integTest(
  name: string,
  callback: (context: TestContext) => Promise<void>,
  timeoutMillis?: number,
) {

  // Integ tests can run concurrently, and are responsible for blocking themselves if they cannot.
  // Because `test.concurrent` executes the test code immediately (to obtain a promise), we allow
  // setting the `JEST_TEST_CONCURRENT` environment variable to 'false' in order to use `test`
  // instead of `test.concurrent` (this is necessary when specifying a test pattern to verify).
  const testKind = process.env.JEST_TEST_CONCURRENT === 'false' ? test.concurrent : test;
  const runner = shouldSkip(name) ? testKind.skip : testKind;

  runner(name, async () => {
    const output = new MemoryStream();

    output.write('================================================================\n');
    output.write(`${name}\n`);
    output.write('================================================================\n');

    let success = true;
    try {
      return await callback({ output });
    } catch (e) {
      await output.flushTo(process.stderr);
      process.stderr.write(`❌ ${e.toString()}\n`);
      success = false;
      throw e;
    } finally {
      if (success) {
        // Show people there's progress
        process.stderr.write('✅');
      }
    }
  }, timeoutMillis);
}

function shouldSkip(testName: string) {
  return SKIP_TESTS.includes(testName);
}
