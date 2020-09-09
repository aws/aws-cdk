import * as fs from 'fs';
import * as path from 'path';
import { MemoryStream } from './corking';

const SKIP_TESTS = fs.readFileSync(path.join(__dirname, 'skip-tests.txt'), { encoding: 'utf-8' }).split('\n');

export type TestEnvironment = {
  output: NodeJS.WritableStream;
};

/**
 * A wrapper for jest's 'test' which takes regression-disabled tests into account and prints a banner
 */
export function integTest<F extends { dispose: (success: boolean) => Promise<void> }>(name: string,
  before: (env: TestEnvironment) => Promise<F>,
  callback: (fixture: F) => Promise<void>) {

  // Integ tests can run concurrently, and are responsible for blocking themselves if they cannot.
  const runner = shouldSkip(name) ? test.skip : test.concurrent;

  runner(name, async () => {
    const output = new MemoryStream();

    output.write('================================================================\n');
    output.write(`${name}\n`);
    output.write('================================================================\n');

    const fixture = await before({ output });
    let success = true;
    try {
      return await callback(fixture);
    } catch (e) {
      await output.flushTo(process.stderr);
      process.stderr.write(`❌ ${e.toString()}\n`);
      success = false;
      throw e;
    } finally {
      await fixture.dispose(success);
      if (success) {
        // Show people there's progress
        process.stderr.write('✅');
      }
    }
  });
}

function shouldSkip(testName: string) {
  return SKIP_TESTS.includes(testName);
}