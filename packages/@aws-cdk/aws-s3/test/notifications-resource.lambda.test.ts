import { spawnSync } from 'child_process';
import * as path from 'path';

test('lambda python pytest', () => {
  const testScript = path.join(__dirname, '..', 'lib', 'notifications-resource', 'lambda-source', 'test.sh')
  const result = spawnSync(testScript, { stdio: 'inherit' });
  expect(result.status).toBe(0);
});