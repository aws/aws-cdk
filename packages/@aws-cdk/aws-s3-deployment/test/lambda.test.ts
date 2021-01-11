import { spawnSync } from 'child_process';
import * as path from 'path';

test('lambda python pytest', () => {
  const result = spawnSync(path.join(__dirname, 'lambda', 'test.sh'), { stdio: 'inherit' });
  expect(result.status).toBe(0);
});