import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import generate from '../lib';

const mkdtemp = util.promisify(fs.mkdtemp);
const exists = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);

test('filterResourcePrefix picks the prefix as expected', async () => {
  const out = await tmpdir();
  await generate('AWS::Cognito', out, {
    filterResourcePrefix: 'UserPool',
  });
  expect(await exists(path.join(out, 'cognito.generated.ts'))).toBeTruthy();
  const data = await readFile(path.join(out, 'cognito.generated.ts'), { encoding: 'utf8' });
  const userPoolMatches = data.match(/CfnUserPool/);
  const identityPoolMatches = data.match(/CfnIdentityPool/);
  expect(userPoolMatches).not.toBeNull();
  expect(identityPoolMatches).toBeNull();
});

async function tmpdir() {
  return await mkdtemp(path.join(os.tmpdir(), 'cfn2ts-test'));
}