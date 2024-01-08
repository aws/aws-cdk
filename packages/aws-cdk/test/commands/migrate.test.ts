import { exec as _exec } from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import { generateCdkApp, generateStack, readFromPath, readFromStack, setEnvironment, validateSourceOptions } from '../../lib/commands/migrate';
import { MockSdkProvider, MockedObject, SyncHandlerSubsetOf } from '../util/mock-sdk';

const exec = promisify(_exec);

describe('Migrate Function Tests', () => {
  let sdkProvider: MockSdkProvider;
  let getTemplateMock: jest.Mock;
  let describeStacksMock: jest.Mock;
  let cfnMocks: MockedObject<SyncHandlerSubsetOf<AWS.CloudFormation>>;

  const testResourcePath = [__dirname, 'test-resources'];
  const templatePath = [...testResourcePath, 'templates'];
  const stackPath = [...testResourcePath, 'stacks'];

  const validTemplatePath = path.join(...templatePath, 's3-template.json');
  const validTemplate = readFromPath(validTemplatePath)!;

  beforeEach(async () => {
    sdkProvider = new MockSdkProvider();
    getTemplateMock = jest.fn();
    describeStacksMock = jest.fn();
    cfnMocks = { getTemplate: getTemplateMock, describeStacks: describeStacksMock };
    sdkProvider.stubCloudFormation(cfnMocks as any);
  });

  test('validateSourceOptions throws if both --from-path and --from-stack is provided', () => {
    expect(() => validateSourceOptions('any-value', true)).toThrowError('Only one of `--from-path` or `--from-stack` may be provided.');
  });

  test('validateSourceOptions throws if neither --from-path or --from-stack is provided', () => {
    expect(() => validateSourceOptions(undefined, undefined)).toThrowError('Either `--from-path` or `--from-stack` must be used to provide the source of the CloudFormation template.');
  });

  test('validateSourceOptions does not throw when only --from-path is supplied', () => {
    expect(() => validateSourceOptions('any-value', false)).not.toThrow();
  });

  test('validateSourceOptions does now throw when only --from-stack is provided', () => {
    expect(() => validateSourceOptions(undefined, true)).not.toThrow();
  });

  test('readFromPath produces a string representation of the template at a given path', () => {
    expect(readFromPath(validTemplatePath)).toEqual(fs.readFileSync(validTemplatePath, 'utf8'));
  });

  test('readFromPath returns undefined when template file is not provided', () => {
    expect(readFromPath()).toEqual(undefined);
  });

  test('readFromPath throws error when template file does not exist at a given path', () => {
    const badTemplatePath = './not-here.json';
    expect(() => readFromPath(badTemplatePath)).toThrowError(`\'${badTemplatePath}\' is not a valid path.`);
  });

  test('readFromStack produces a string representation of the template retrieved from CloudFormation', async () => {
    const template = fs.readFileSync(validTemplatePath, { encoding: 'utf-8' });
    getTemplateMock.mockImplementation(() => ({
      TemplateBody: template,
    }));

    describeStacksMock.mockImplementation(() => ({
      Stacks: [
        {
          StackName: 'this-one',
          StackStatus: 'CREATE_COMPLETE',
        },
      ],
    }));

    expect(await readFromStack('this-one', sdkProvider, { account: 'num', region: 'here', name: 'hello-my-name-is-what...' })).toEqual(JSON.stringify(JSON.parse(template)));
  });

  test('readFromStack throws error when no stack exists with the stack name in the account and region', async () => {
    describeStacksMock.mockImplementation(() => { throw new Error('No stack. This did not go well.'); });
    await expect(() => readFromStack('that-one', sdkProvider, { account: 'num', region: 'here', name: 'hello-my-name-is-who...' })).rejects.toThrow('No stack. This did not go well.');
  });

  test('readFromStack throws error when stack exists but the status is not healthy', async () => {
    describeStacksMock.mockImplementation(() => ({
      Stacks: [
        {
          StackName: 'this-one',
          StackStatus: 'CREATE_FAILED',
          StackStatusReason: 'Something went wrong',
        },
      ],
    }));

    await expect(() => readFromStack('that-one', sdkProvider, { account: 'num', region: 'here', name: 'hello-my-name-is-chicka-chicka...' })).rejects.toThrow('Stack \'that-one\' in account num and region here has a status of \'CREATE_FAILED\' due to \'Something went wrong\'. The stack cannot be migrated until it is in a healthy state.');
  });

  test('setEnvironment sets account and region when provided', () => {
    expect(setEnvironment('my-account', 'somewhere')).toEqual({ account: 'my-account', region: 'somewhere', name: 'cdk-migrate-env' });
  });

  test('serEnvironment uses default account and region when not provided', () => {
    expect(setEnvironment()).toEqual({ account: 'unknown-account', region: 'unknown-region', name: 'cdk-migrate-env' });
  });

  test('generateStack generates the expected stack string when called for typescript', () => {
    const stack = generateStack(validTemplate, 'GoodTypeScript', 'typescript');
    expect(stack).toEqual(fs.readFileSync(path.join(...stackPath, 's3-stack.ts'), 'utf8'));
  });

  test('generateStack generates the expected stack string when called for python', () => {
    const stack = generateStack(validTemplate, 'GoodPython', 'python');
    expect(stack).toEqual(fs.readFileSync(path.join(...stackPath, 's3_stack.py'), 'utf8'));
  });

  test('generateStack generates the expected stack string when called for java', () => {
    const stack = generateStack(validTemplate, 'GoodJava', 'java');
    expect(stack).toEqual(fs.readFileSync(path.join(...stackPath, 'S3Stack.java'), 'utf8'));
  });

  test('generateStack generates the expected stack string when called for csharp', () => {
    const stack = generateStack(validTemplate, 'GoodCSharp', 'csharp');
    expect(stack).toEqual(fs.readFileSync(path.join(...stackPath, 'S3Stack.cs'), 'utf8'));
  });

  // TODO: fix with actual go template
  test('generateStack generates the expected stack string when called for go', () => {
    const stack = generateStack(validTemplate, 'GoodGo', 'go');
    expect(stack).toEqual(fs.readFileSync(path.join(...stackPath, 's3.go'), 'utf8'));
  });

  test('generateStack throws error when called for other language', () => {
    expect(() => generateStack(validTemplate, 'BadBadBad', 'php')).toThrowError('stack generation failed due to error \'unreachable\'');
  });

  cliTest('generateCdkApp generates the expected cdk app when called for typescript', async (workDir) => {
    const stack = generateStack(validTemplate, 'GoodTypeScript', 'typescript');
    await generateCdkApp('GoodTypeScript', stack, 'typescript', workDir);

    // Packages exist in the correct spot
    expect(fs.pathExistsSync(path.join(workDir, 'GoodTypeScript', 'package.json'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(workDir, 'GoodTypeScript', 'bin', 'good_type_script.ts'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(workDir, 'GoodTypeScript', 'lib', 'good_type_script-stack.ts'))).toBeTruthy();

    // Replaced stack file is referenced correctly in app file
    const app = fs.readFileSync(path.join(workDir, 'GoodTypeScript', 'bin', 'good_type_script.ts'), 'utf8').split('\n');
    expect(app.map(line => line.match('import { GoodTypeScriptStack } from \'../lib/good_type_script-stack\';')).filter(line => line).length).toEqual(1);
    expect(app.map(line => line.match(/new GoodTypeScriptStack\(app, \'GoodTypeScript\', \{/)).filter(line => line).length).toEqual(1);

    // Replaced stack file is correctly generated
    const replacedStack = fs.readFileSync(path.join(workDir, 'GoodTypeScript', 'lib', 'good_type_script-stack.ts'), 'utf8');
    expect(replacedStack).toEqual(fs.readFileSync(path.join(...stackPath, 's3-stack.ts'), 'utf8'));
  });

  cliTest('generateCdkApp generates the expected cdk app when called for python', async (workDir) => {
    const stack = generateStack(validTemplate, 'GoodPython', 'python');
    await generateCdkApp('GoodPython', stack, 'python', workDir);

    // Packages exist in the correct spot
    expect(fs.pathExistsSync(path.join(workDir, 'GoodPython', 'requirements.txt'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(workDir, 'GoodPython', 'app.py'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(workDir, 'GoodPython', 'good_python', 'good_python_stack.py'))).toBeTruthy();

    // Replaced stack file is referenced correctly in app file
    const app = fs.readFileSync(path.join(workDir, 'GoodPython', 'app.py'), 'utf8').split('\n');
    expect(app.map(line => line.match('from good_python.good_python_stack import GoodPythonStack')).filter(line => line).length).toEqual(1);
    expect(app.map(line => line.match(/GoodPythonStack\(app, "GoodPython",/)).filter(line => line).length).toEqual(1);

    // Replaced stack file is correctly generated
    const replacedStack = fs.readFileSync(path.join(workDir, 'GoodPython', 'good_python', 'good_python_stack.py'), 'utf8');
    expect(replacedStack).toEqual(fs.readFileSync(path.join(...stackPath, 's3_stack.py'), 'utf8'));
  });

  cliTest('generateCdkApp generates the expected cdk app when called for java', async (workDir) => {
    const stack = generateStack(validTemplate, 'GoodJava', 'java');
    await generateCdkApp('GoodJava', stack, 'java', workDir);

    // Packages exist in the correct spot
    expect(fs.pathExistsSync(path.join(workDir, 'GoodJava', 'pom.xml'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(workDir, 'GoodJava', 'src', 'main', 'java', 'com', 'myorg', 'GoodJavaApp.java'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(workDir, 'GoodJava', 'src', 'main', 'java', 'com', 'myorg', 'GoodJavaStack.java'))).toBeTruthy();

    // Replaced stack file is referenced correctly in app file
    const app = fs.readFileSync(path.join(workDir, 'GoodJava', 'src', 'main', 'java', 'com', 'myorg', 'GoodJavaApp.java'), 'utf8').split('\n');
    expect(app.map(line => line.match('public class GoodJavaApp {')).filter(line => line).length).toEqual(1);
    expect(app.map(line => line.match(/        new GoodJavaStack\(app, "GoodJava", StackProps.builder()/)).filter(line => line).length).toEqual(1);

    // Replaced stack file is correctly generated
    const replacedStack = fs.readFileSync(path.join(workDir, 'GoodJava', 'src', 'main', 'java', 'com', 'myorg', 'GoodJavaStack.java'), 'utf8');
    expect(replacedStack).toEqual(fs.readFileSync(path.join(...stackPath, 'S3Stack.java'), 'utf8'));
  });

  cliTest('generateCdkApp generates the expected cdk app when called for csharp', async (workDir) => {
    const stack = generateStack(validTemplate, 'GoodCSharp', 'csharp');
    await generateCdkApp('GoodCSharp', stack, 'csharp', workDir);

    // Packages exist in the correct spot
    expect(fs.pathExistsSync(path.join(workDir, 'GoodCSharp', 'src', 'GoodCSharp.sln'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(workDir, 'GoodCSharp', 'src', 'GoodCSharp', 'Program.cs'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(workDir, 'GoodCSharp', 'src', 'GoodCSharp', 'GoodCSharpStack.cs'))).toBeTruthy();

    // Replaced stack file is referenced correctly in app file
    const app = fs.readFileSync(path.join(workDir, 'GoodCSharp', 'src', 'GoodCSharp', 'Program.cs'), 'utf8').split('\n');
    expect(app.map(line => line.match('namespace GoodCSharp')).filter(line => line).length).toEqual(1);
    expect(app.map(line => line.match(/        new GoodCSharpStack\(app, "GoodCSharp", new GoodCSharpStackProps/)).filter(line => line).length).toEqual(1);

    // Replaced stack file is correctly generated
    const replacedStack = fs.readFileSync(path.join(workDir, 'GoodCSharp', 'src', 'GoodCSharp', 'GoodCSharpStack.cs'), 'utf8');
    expect(replacedStack).toEqual(fs.readFileSync(path.join(...stackPath, 'S3Stack.cs'), 'utf8'));
  });

  cliTest('generatedCdkApp generates the expected cdk app when called for go', async (workDir) => {
    const stack = generateStack(validTemplate, 'GoodGo', 'go');
    await generateCdkApp('GoodGo', stack, 'go', workDir);

    expect(fs.pathExists(path.join(workDir, 's3.go'))).toBeTruthy();
    const app = fs.readFileSync(path.join(workDir, 'GoodGo', 'good_go.go'), 'utf8').split('\n');
    expect(app.map(line => line.match(/func NewGoodGoStack\(scope constructs.Construct, id string, props \*GoodGoStackProps\) \*GoodGoStack \{/)).filter(line => line).length).toEqual(1);
    expect(app.map(line => line.match(/    NewGoodGoStack\(app, "GoodGo", &GoodGoStackProps\{/)));
  });

  cliTest('generatedCdkApp generates a zip file when --compress is used', async (workDir) => {
    const stack = generateStack(validTemplate, 'GoodTypeScript', 'typescript');
    await generateCdkApp('GoodTypeScript', stack, 'typescript', workDir, true);

    // Packages not in outDir
    expect(fs.pathExistsSync(path.join(workDir, 'GoodTypeScript', 'package.json'))).toBeFalsy();
    expect(fs.pathExistsSync(path.join(workDir, 'GoodTypeScript', 'bin', 'good_type_script.ts'))).toBeFalsy();
    expect(fs.pathExistsSync(path.join(workDir, 'GoodTypeScript', 'lib', 'good_type_script-stack.ts'))).toBeFalsy();

    // Zip file exists
    expect(fs.pathExistsSync(path.join(workDir, 'GoodTypeScript.zip'))).toBeTruthy();

    // Unzip it
    await exec(`unzip ${path.join(workDir, 'GoodTypeScript.zip')}`, { cwd: workDir });

    // Now the files should be there
    expect(fs.pathExistsSync(path.join(workDir, 'package.json'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(workDir, 'bin', 'good_type_script.ts'))).toBeTruthy();
    expect(fs.pathExistsSync(path.join(workDir, 'lib', 'good_type_script-stack.ts'))).toBeTruthy();
  });
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