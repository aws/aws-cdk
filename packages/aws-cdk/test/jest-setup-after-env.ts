import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { isPromise } from 'util/types';

/**
 * Global test setup for Jest tests
 *
 * It's easy to accidentally write tests that interfere with each other by
 * writing files to disk in the "current directory". To prevent this, the global
 * test setup creates a directory in the temporary directory and chmods it to
 * being non-writable. That way, whenever a test tries to write to the current
 * directory, it will produce an error and we'll be able to find and fix the
 * test.
 *
 * If you see `EACCES: permission denied`, you have a test that creates files
 * in the current directory, and you should be sure to do it in a temporary
 * directory that you clean up afterwards.
 *
 * ## Alternate approach
 *
 * I tried an approach where I would automatically try to create and clean up
 * temp directories for every test, but it was introducing too many conflicts
 * with existing test behavior (around specific ordering of temp directory
 * creation and cleanup tasks that are already present) in many places that I
 * didn't want to go and chase down.
 *
 */

let tmpDir: string;
let oldDir: string;

beforeAll(() => {
  tmpDir = path.join(os.tmpdir(), 'cdk-nonwritable-on-purpose');
  fs.mkdirSync(tmpDir, { recursive: true });
  fs.chmodSync(tmpDir, 0o500);
  oldDir = process.cwd();
  process.chdir(tmpDir);
  tmpDir = process.cwd(); // This will have resolved symlinks
});

const reverseAfterAll: Array<jest.ProvidesHookCallback> = [];

/**
 * We need a cleanup here
 *
 * 99% of the time, Jest runs the tests in a subprocess and this isn't
 * necessary because we would have `chdir`ed in the subprocess.
 *
 * But sometimes we ask Jest with `-i` to run the tests in the main process,
 * or if you only ask for a single test suite Jest runs the tests in the main
 * process, and then we `chdir`ed the main process away.
 *
 * Jest will then try to write the `coverage` directory to the readonly directory,
 * and fail. Chdir back to the original dir.
 *
 * If the test file has an `afterAll()` hook it installed as well, we need to run
 * it before our cleanup, otherwise the wrong thing will happen (by default,
 * all `afterAll()`s run in call order, but they should be run in reverse).
 */
afterAll(async () => {
  for (const aft of reverseAfterAll.reverse()) {
    await new Promise<void>((resolve, reject) => {
      const response = aft(resolve as any);
      if (isPromise(response)) {
        response.then(() => { return resolve(); }, reject);
      } else {
        resolve();
      }
    });
  }

  if (process.cwd() === tmpDir) {
    process.chdir(oldDir);
  }
});

// Patch afterAll to make later-provided afterAll's run before us (in reverse order even).
afterAll = (after: jest.ProvidesHookCallback) => {
  reverseAfterAll.push(after);
};
