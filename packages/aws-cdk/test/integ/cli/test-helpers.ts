import * as fs from 'fs';
import * as path from 'path';
import { corkShellOutput, uncorkShellOutput, flushCorkedOutput } from './corking';

const SKIP_TESTS = fs.readFileSync(path.join(__dirname, 'skip-tests.txt'), { encoding: 'utf-8' }).split('\n');

/**
 * A wrapper for jest's 'test' which takes regression-disabled tests into account and prints a banner
 */
export function integTest<A>(name: string, callback: () => A | Promise<A>) {
  const runner = shouldSkip(name) ? test.skip : test;

  runner(name, async () => {
    process.stdout.write('================================================================\n');
    process.stdout.write(`${name}\n`);
    process.stdout.write('================================================================\n');

    try {
      corkShellOutput();
      return await callback();
    } catch (e) {
      await flushCorkedOutput();
      throw e;
    } finally {
      uncorkShellOutput();
    }
  });
}

function shouldSkip(testName: string) {
  return SKIP_TESTS.includes(testName);
}