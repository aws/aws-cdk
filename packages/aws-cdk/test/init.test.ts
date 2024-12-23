import * as os from 'os';
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import { availableInitLanguages, availableInitTemplates, cliInit, currentlyRecommendedAwsCdkLibFlags, printAvailableTemplates } from '../lib/init';

describe('constructs version', () => {
  cliTest('create a TypeScript library project', async (workDir) => {
    await cliInit({
      type: 'lib',
      language: 'typescript',
      workDir,
    });

    // Check that package.json and lib/ got created in the current directory
    expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, 'lib'))).toBeTruthy();
  });

  cliTest('asking for a nonexistent template fails', async (workDir) => {
    await expect(cliInit({
      type: 'banana',
      language: 'typescript',
      workDir,
    })).rejects.toThrow(/Unknown init template/);
  });

  cliTest('asking for a template but no language prints and throws', async (workDir) => {
    await expect(cliInit({
      type: 'app',
      workDir,
    })).rejects.toThrow(/No language/);
  });

  cliTest('create a TypeScript app project', async (workDir) => {
    await cliInit({
      type: 'app',
      language: 'typescript',
      workDir,
    });

    // Check that package.json and bin/ got created in the current directory
    expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, 'bin'))).toBeTruthy();
  });

  cliTest('create a JavaScript app project', async (workDir) => {
    await cliInit({
      type: 'app',
      language: 'javascript',
      workDir,
    });

    // Check that package.json and bin/ got created in the current directory
    expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, 'bin'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, '.git'))).toBeTruthy();
  });

  cliTest('create a Java app project', async (workDir) => {
    await cliInit({
      type: 'app',
      language: 'java',
      canUseNetwork: false,
      generateOnly: true,
      workDir,
    });

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

  cliTest('create a .NET app project in csharp', async (workDir) => {
    await cliInit({
      type: 'app',
      language: 'csharp',
      canUseNetwork: false,
      generateOnly: true,
      workDir,
    });

    const csprojFile = (await recursiveListFiles(workDir)).filter(f => f.endsWith('.csproj'))[0];
    const slnFile = (await recursiveListFiles(workDir)).filter(f => f.endsWith('.sln'))[0];
    expect(csprojFile).toBeDefined();
    expect(slnFile).toBeDefined();

    const csproj = (await fs.readFile(csprojFile, 'utf8')).split(/\r?\n/);
    const sln = (await fs.readFile(slnFile, 'utf8')).split(/\r?\n/);

    expect(csproj).toContainEqual(expect.stringMatching(/\<PackageReference Include="Constructs" Version="\[10\..*,11\..*\)"/));
    expect(csproj).toContainEqual(expect.stringMatching(/\<TargetFramework>net6.0<\/TargetFramework>/));
    expect(sln).toContainEqual(expect.stringMatching(/\"AwsCdkTest[a-zA-Z0-9]{6}\\AwsCdkTest[a-zA-Z0-9]{6}.csproj\"/));
  });

  cliTest('create a .NET app project in fsharp', async (workDir) => {
    await cliInit({
      type: 'app',
      language: 'fsharp',
      canUseNetwork: false,
      generateOnly: true,
      workDir,
    });

    const fsprojFile = (await recursiveListFiles(workDir)).filter(f => f.endsWith('.fsproj'))[0];
    const slnFile = (await recursiveListFiles(workDir)).filter(f => f.endsWith('.sln'))[0];
    expect(fsprojFile).toBeDefined();
    expect(slnFile).toBeDefined();

    const fsproj = (await fs.readFile(fsprojFile, 'utf8')).split(/\r?\n/);
    const sln = (await fs.readFile(slnFile, 'utf8')).split(/\r?\n/);

    expect(fsproj).toContainEqual(expect.stringMatching(/\<PackageReference Include="Constructs" Version="\[10\..*,11\..*\)"/));
    expect(fsproj).toContainEqual(expect.stringMatching(/\<TargetFramework>net6.0<\/TargetFramework>/));
    expect(sln).toContainEqual(expect.stringMatching(/\"AwsCdkTest[a-zA-Z0-9]{6}\\AwsCdkTest[a-zA-Z0-9]{6}.fsproj\"/));
  });

  cliTestWithDirSpaces('csharp app with spaces', async (workDir) => {
    await cliInit({
      type: 'app',
      language: 'csharp',
      canUseNetwork: false,
      generateOnly: true,
      workDir,
    });

    const csprojFile = (await recursiveListFiles(workDir)).filter(f => f.endsWith('.csproj'))[0];
    expect(csprojFile).toBeDefined();

    const csproj = (await fs.readFile(csprojFile, 'utf8')).split(/\r?\n/);

    expect(csproj).toContainEqual(expect.stringMatching(/\<PackageReference Include="Constructs" Version="\[10\..*,11\..*\)"/));
    expect(csproj).toContainEqual(expect.stringMatching(/\<TargetFramework>net6.0<\/TargetFramework>/));
  });

  cliTestWithDirSpaces('fsharp app with spaces', async (workDir) => {
    await cliInit({
      type: 'app',
      language: 'fsharp',
      canUseNetwork: false,
      generateOnly: true,
      workDir,
    });

    const fsprojFile = (await recursiveListFiles(workDir)).filter(f => f.endsWith('.fsproj'))[0];
    expect(fsprojFile).toBeDefined();

    const fsproj = (await fs.readFile(fsprojFile, 'utf8')).split(/\r?\n/);

    expect(fsproj).toContainEqual(expect.stringMatching(/\<PackageReference Include="Constructs" Version="\[10\..*,11\..*\)"/));
    expect(fsproj).toContainEqual(expect.stringMatching(/\<TargetFramework>net6.0<\/TargetFramework>/));
  });

  cliTest('create a Python app project', async (workDir) => {
    await cliInit({
      type: 'app',
      language: 'python',
      canUseNetwork: false,
      generateOnly: true,
      workDir,
    });

    expect(await fs.pathExists(path.join(workDir, 'requirements.txt'))).toBeTruthy();
    const setupPy = (await fs.readFile(path.join(workDir, 'requirements.txt'), 'utf8')).split(/\r?\n/);
    // return RegExpMatchArray (result of line.match()) for every lines that match re.
    const matches = setupPy.map(line => line.match(/^constructs(.*)/))
      .filter(l => l);

    expect(matches.length).toEqual(1);
    matches.forEach(m => {
      const version = m && m[1];
      expect(version).toMatch(/>=10\.\d+\.\d,<11\.0\.0/);
    });
  });

  cliTest('--generate-only should skip git init', async (workDir) => {
    await cliInit({
      type: 'app',
      language: 'javascript',
      canUseNetwork: false,
      generateOnly: true,
      workDir,
    });

    // Check that package.json and bin/ got created in the current directory
    expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, 'bin'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, '.git'))).toBeFalsy();
  });

  cliTest('git directory does not throw off the initer!', async (workDir) => {
    fs.mkdirSync(path.join(workDir, '.git'));

    await cliInit({
      type: 'app',
      language: 'typescript',
      canUseNetwork: false,
      workDir,
    });

    // Check that package.json and bin/ got created in the current directory
    expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
    expect(await fs.pathExists(path.join(workDir, 'bin'))).toBeTruthy();
  });

  cliTest('CLI uses recommended feature flags from data file to initialize context', async (workDir) => {
    const recommendedFlagsFile = path.join(__dirname, '..', 'lib', 'init-templates', '.recommended-feature-flags.json');
    await withReplacedFile(recommendedFlagsFile, JSON.stringify({ banana: 'yellow' }), () => cliInit({
      type: 'app',
      language: 'typescript',
      canUseNetwork: false,
      generateOnly: true,
      workDir,
    }));

    const cdkFile = await fs.readJson(path.join(workDir, 'cdk.json'));
    expect(cdkFile.context).toEqual({ banana: 'yellow' });
  });

  cliTest('CLI uses init versions file to initialize template', async (workDir) => {
    const recommendedFlagsFile = path.join(__dirname, '..', 'lib', 'init-templates', '.init-version.json');
    await withReplacedFile(recommendedFlagsFile, JSON.stringify({ 'aws-cdk-lib': '100.1.1', 'constructs': '^200.2.2' }), () => cliInit({
      type: 'app',
      language: 'typescript',
      canUseNetwork: false,
      generateOnly: true,
      workDir,
    }));

    const packageJson = await fs.readJson(path.join(workDir, 'package.json'));
    expect(packageJson.dependencies['aws-cdk-lib']).toEqual('100.1.1');
    expect(packageJson.dependencies.constructs).toEqual('^200.2.2');
  });

  test('verify "future flags" are added to cdk.json', async () => {
    for (const templ of await availableInitTemplates()) {
      for (const lang of templ.languages) {
        await withTempDir(async tmpDir => {
          await cliInit({
            type: templ.name,
            language: lang,
            canUseNetwork: false,
            generateOnly: true,
            workDir: tmpDir,
          });

          // ok if template doesn't have a cdk.json file (e.g. the "lib" template)
          if (!await fs.pathExists(path.join(tmpDir, 'cdk.json'))) {
            return;
          }

          const config = await fs.readJson(path.join(tmpDir, 'cdk.json'));
          const context = config.context || {};
          const recommendedFlags = await currentlyRecommendedAwsCdkLibFlags();
          for (const [key, actual] of Object.entries(context)) {
            expect(key in recommendedFlags).toBeTruthy();
            expect(recommendedFlags[key]).toEqual(actual);
          }

          // assert that expired future flags are not part of the cdk.json
          Object.keys(context).forEach(k => {
            expect(cxapi.CURRENT_VERSION_EXPIRED_FLAGS.includes(k)).toEqual(false);
          });
        });
      }
    }
  },
  // This is a lot to test, and it can be slow-ish, especially when ran with other tests.
  30_000);
});

test('when no version number is present (e.g., local development), the v2 templates are chosen by default', async () => {
  expect((await availableInitTemplates()).length).toBeGreaterThan(0);
});

test('check available init languages', async () => {
  const langs = await availableInitLanguages();
  expect(langs.length).toBeGreaterThan(0);
  expect(langs).toContain('typescript');
});

test('exercise printing available templates', async () => {
  await printAvailableTemplates();
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

function cliTestWithDirSpaces(name: string, handler: (dir: string) => void | Promise<any>): void {
  test(name, () => withTempDirWithSpaces(handler));
}

async function withTempDirWithSpaces(cb: (dir: string) => void | Promise<any>) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aws-cdk-test with-space'));
  try {
    await cb(tmpDir);
  } finally {
    await fs.remove(tmpDir);
  }
}

/**
 * List all files underneath dir
 */
async function recursiveListFiles(rdir: string): Promise<string[]> {
  const ret = new Array<string>();
  await recurse(rdir);
  return ret;

  async function recurse(dir: string) {
    for (const name of await fs.readdir(dir)) {
      const fullPath = path.join(dir, name);
      if ((await fs.stat(fullPath)).isDirectory()) {
        await recurse(fullPath);
      } else {
        ret.push(fullPath);
      }
    }
  }
}

async function withReplacedFile(fileName: string, contents: any, cb: () => Promise<void>): Promise<void> {
  const oldContents = await fs.readFile(fileName, 'utf8');
  await fs.writeFile(fileName, contents);
  try {
    await cb();
  } finally {
    await fs.writeFile(fileName, oldContents);
  }
}
