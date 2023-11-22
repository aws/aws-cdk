import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { main } from '../lib/cli/cli';

describe('cli', () => {
  test('can generate specific services', async () => {
    await withTemporaryDirectory(async ({ testDir }) => {
      await main([testDir, '--service', 'AWS::S3', '--service', 'AWS::SNS']);

      expect(fs.existsSync(path.join(testDir, 'aws-s3', 's3.generated.ts'))).toBe(true);
      expect(fs.existsSync(path.join(testDir, 'aws-sns', 'sns.generated.ts'))).toBe(true);
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
