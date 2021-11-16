import { spawnSync } from 'child_process';
import * as path from 'path';

test('queue handler', () => {
  const testScript = path.join(__dirname, 'queue-handler', 'test.sh');
  const result = spawnSync(testScript, { stdio: 'inherit' });
  expect(result.status).toBe(0);
});
