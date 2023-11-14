import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { TestContext } from './integ-test';
import { rimraf } from './shell';

export interface TemporaryDirectoryContext {
  readonly integTestDir: string;
}

export function withTemporaryDirectory<A extends TestContext>(block: (context: A & TemporaryDirectoryContext) => Promise<void>) {
  return async (context: A) => {
    const integTestDir = path.join(os.tmpdir(), `cdk-integ-${context.randomString}`);

    fs.mkdirSync(integTestDir, { recursive: true });

    try {
      await block({
        ...context,
        integTestDir,
      });

      // Clean up in case of success
      if (process.env.SKIP_CLEANUP) {
        context.log(`Left test directory in '${integTestDir}' ($SKIP_CLEANUP)\n`);
      } else {
        rimraf(integTestDir);
      }
    } catch (e) {
      context.log(`Left test directory in '${integTestDir}'\n`);
      throw e;
    }
  };
}

