/**
 * The init templates rely on parsing the current major version to find the correct template directory.
 * During tests, the current package version is '0.0.0', rather than a specific version.
 * The below mocks the versionNumber to return the major version (and so init template version) specified.
 */
let mockMajorVersion = '1.0.0';
jest.mock('../lib/version', () => ({
  versionNumber: () => mockMajorVersion,
}));

import * as cp from 'child_process';
import * as os from 'os';
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import { availableInitTemplates, cliInit } from '../lib/init';

describe.each(['1', '2'])('v%s tests', (majorVersion) => {
  beforeEach(() => {
    mockMajorVersion = `${majorVersion}.0.0`;
    jest.resetAllMocks();
  });

  cliTest('create a TypeScript library project', async (workDir) => {
    await cliInit('lib', 'typescript', false, undefined /* canUseNetwork */, workDir);

    // Check that package.json and lib/ got created in the current directory
    expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, 'lib'))).toBeTruthy();
  });

  cliTest('create a TypeScript app project', async (workDir) => {
    await cliInit('app', 'typescript', false, undefined /* canUseNetwork */, workDir);

    // Check that package.json and bin/ got created in the current directory
    expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, 'bin'))).toBeTruthy();
  });

  cliTest('create a JavaScript app project', async (workDir) => {
    await cliInit('app', 'javascript', false, undefined /* canUseNetwork */, workDir);

    // Check that package.json and bin/ got created in the current directory
    expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, 'bin'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, '.git'))).toBeTruthy();
  });

  cliTest('--generate-only should skip git init', async (workDir) => {
    await cliInit('app', 'javascript', false, true, workDir);

    // Check that package.json and bin/ got created in the current directory
    expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, 'bin'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, '.git'))).toBeFalsy();
  });

  cliTest('git directory does not throw off the initer!', async (workDir) => {
    fs.mkdirSync(path.join(workDir, '.git'));

    await cliInit('app', 'typescript', false, undefined /* canUseNetwork */, workDir);

    // Check that package.json and bin/ got created in the current directory
    expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, 'bin'))).toBeTruthy();
  });

  test('verify "future flags" are added to cdk.json', async () => {
    // This is a lot to test, and it can be slow-ish, especially when ran with other tests.
    jest.setTimeout(30_000);

    for (const templ of await availableInitTemplates()) {
      for (const lang of templ.languages) {
        await withTempDir(async tmpDir => {
          await cliInit(templ.name, lang,
            /* canUseNetwork */ false,
            /* generateOnly */ true,
            tmpDir);

          // ok if template doesn't have a cdk.json file (e.g. the "lib" template)
          if (!await fs.pathExists(path.join(tmpDir, 'cdk.json'))) {
            return;
          }

          const config = await fs.readJson(path.join(tmpDir, 'cdk.json'));
          const context = config.context || {};
          for (const [key, expected] of Object.entries(context)) {
            const actual = cxapi.FUTURE_FLAGS[key];
            expect(actual).toEqual(expected);
          }

          // assert that expired future flags are not part of the cdk.json
          Object.keys(context).forEach(k => {
            expect(cxapi.FUTURE_FLAGS_EXPIRED.includes(k)).toEqual(false);
          });
        });
      }
    }
  });
});

describe('constructs version', () => {
  beforeEach(() => {
    mockMajorVersion = '2.0.0';
    jest.resetAllMocks();
  });

  cliTest('java', async (workDir) => {
    await cliInit('app', 'java', false, true, workDir);

    expect(await fs.pathExists(path.join(workDir, 'pom.xml'))).toBeTruthy();

    const pom = (await fs.readFile(path.join(workDir, 'pom.xml'), 'utf8')).split(/\r?\n/);
    const matches = pom.map(line => line.match(/\<constructs\.version\>(.*)\<\/constructs\.version\>/))
      .filter(l => l);

    expect(matches.length).toEqual(1);
    matches.forEach(m => {
      const version = m && m[1];
      expect(version).toMatch(/\[10\.[\d]+\.[\d]+,11\.0\.0\)/);
    });
  });

  cliTest('.NET', async (workDir) => {
    await cliInit('app', 'csharp', false, true, workDir);

    cp.execSync('find .', { cwd: workDir, stdio: 'inherit' });

    // convert dir name from aws-cdk-test-xyz to AwsCdkTestXyz
    const slnName = path.basename(workDir).split('-').map(s => `${s[0].toUpperCase()}${s.slice(1)}`).join('');
    const csprojFile = path.join(workDir, 'src', slnName, `${slnName}.csproj`);

    expect(await fs.pathExists(csprojFile)).toBeTruthy();
    // eslint-disable-next-line no-console
    console.log('Was expecting to see', slnName, 'in', workDir, 'as', csprojFile);
    const csproj = (await fs.readFile(csprojFile, 'utf8')).split(/\r?\n/);

    expect(csproj).toContainEqual(expect.stringMatching(/\<PackageReference Include="Constructs" Version="\[10\..*,11\..*\)"/));
  });

  cliTest('Python', async (workDir) => {
    await cliInit('app', 'python', false, true, workDir);

    // convert dir name from aws-cdk-test-xyz to AwsCdkTestXyz
    expect(await fs.pathExists(path.join(workDir, 'setup.py'))).toBeTruthy();
    const setupPy = (await fs.readFile(path.join(workDir, 'setup.py'), 'utf8')).split(/\r?\n/);
    // return RegExpMatchArray (result of line.match()) for every lines that match re.
    const matches = setupPy.map(line => line.match(/^\s*"constructs(.*)",/))
      .filter(l => l);

    expect(matches.length).toEqual(1);
    matches.forEach(m => {
      const version = m && m[1];
      expect(version).toMatch(/>=10\.\d+\.\d,<11\.0\.0/);
    });
  });
});

test('when no version number is present (e.g., local development), the v1 templates are chosen by default', async () => {
  mockMajorVersion = '0.0.0';
  jest.resetAllMocks();

  expect((await availableInitTemplates()).length).toBeGreaterThan(0);
});

function cliTest(name: string, handler: (dir: string) => void | Promise<any>): void {
  test(name, () => withTempDir(handler));
}

async function withTempDir(cb: (dir: string) => void | Promise<any>) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aws-cdk-test'));
  try {
    await cb(tmpDir);
  } finally {
    await fs.remove(tmpDir);
  }
}
