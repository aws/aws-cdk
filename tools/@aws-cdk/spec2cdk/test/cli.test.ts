import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { main } from '../lib/cli/cli';

describe('cli', () => {
  test('can generate specific services', async () => {
    await withTemporaryDirectory(async ({ testDir }) => {
      await main([testDir, '--service', 'AWS::S3', '--service', 'AWS::SNS']);

      const generated = await deepListDir(testDir);

      expect(generated).toContainEqual('aws-s3/s3.generated.ts');
      expect(generated).toContainEqual('aws-sns/sns.generated.ts');
      expect(generated).toContainEqual('aws-sns/sns-canned-metrics.generated.ts');
    });
  });
});

interface TemporaryDirectoryContext {
  readonly testDir: string;
}

async function withTemporaryDirectory(block: (context: TemporaryDirectoryContext) => Promise<void>) {
  const testDir = path.join(os.tmpdir(), 'spec2cdk-test');
  fs.mkdirSync(testDir, { recursive: true });

  try {
    await block({ testDir });
  } finally {
    fs.rmSync(testDir, {
      recursive: true,
      force: true,
    });
  }
}

async function deepListDir(root: string): Promise<string[]> {
  const result = new Array<string>();
  const queue = [root];
  while (queue.length > 0) {
    const dir = queue.shift()!;
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
      } else {
        result.push(path.relative(root, fullPath));
      }
    }
  }
  return result;
}
