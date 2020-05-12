import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import generate from '../lib';

test('filterResourcePrefix picks the prefix as expected', async () => {
  const out = await tmpdir();
  await generate('AWS::Cognito', out, {
    filterResourcePrefix: 'UserPool',
  });
  expect(await fs.pathExists(path.join(out, 'cognito.generated.ts'))).toBeTruthy();
  const data = await fs.readFile(path.join(out, 'cognito.generated.ts'), { encoding: 'utf8' });
  const userPoolMatches = data.match(/CfnUserPool/);
  const identityPoolMatches = data.match(/CfnIdentityPool/);
  expect(userPoolMatches).not.toBeNull();
  expect(identityPoolMatches).toBeNull();
});

async function tmpdir() {
  return await fs.mkdtemp(path.join(os.tmpdir(), 'cfn2ts-test'));
}