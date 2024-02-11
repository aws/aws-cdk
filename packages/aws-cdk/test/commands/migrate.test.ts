import { exec as _exec } from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';
import { CloudFormation } from 'aws-sdk';
import * as fs from 'fs-extra';
import { generateCdkApp, generateStack, readFromPath, readFromStack, setEnvironment, parseSourceOptions, generateTemplate, TemplateSourceOptions, GenerateTemplateOptions, FromScan } from '../../lib/commands/migrate';
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
  const emptyTemplatePath = path.join(...templatePath, 'empty-template.yml');
  const validTemplate = readFromPath(validTemplatePath)!;

  beforeEach(async () => {
    sdkProvider = new MockSdkProvider();
    getTemplateMock = jest.fn();
    describeStacksMock = jest.fn();
    cfnMocks = { getTemplate: getTemplateMock, describeStacks: describeStacksMock };
    sdkProvider.stubCloudFormation(cfnMocks as any);
  });

  test('parseSourceOptions throws if both --from-path and --from-stack is provided', () => {
    expect(() => parseSourceOptions('any-value', true, 'my-awesome-stack')).toThrowError('Only one of `--from-path` or `--from-stack` may be provided.');
  });

  test('parseSourceOptions returns from-scan when neither --from-path or --from-stack are provided', () => {
    expect(parseSourceOptions(undefined, undefined, 'my-stack-name')).toStrictEqual({ source: TemplateSourceOptions.SCAN });
  });

  test('parseSourceOptions does not throw when only --from-path is supplied', () => {
    expect(parseSourceOptions('my-file-path', undefined, 'my-stack-name')).toStrictEqual({ source: TemplateSourceOptions.PATH, templatePath: 'my-file-path' });
  });

  test('parseSourceOptions does now throw when only --from-stack is provided', () => {
    expect(parseSourceOptions(undefined, true, 'my-stack-name')).toStrictEqual({ source: TemplateSourceOptions.STACK, stackName: 'my-stack-name' });
  });

  test('readFromPath produces a string representation of the template at a given path', () => {
    expect(readFromPath(validTemplatePath)).toEqual(fs.readFileSync(validTemplatePath, 'utf8'));
  });

  test('readFromPath throws error when template file is empty', () => {
    expect(() => readFromPath(emptyTemplatePath)).toThrow(`\'${emptyTemplatePath}\' is an empty file.`);
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

  cliTest('generateCdkApp adds cdk-migrate key in context', async (workDir) => {
    const stack = generateStack(validTemplate, 'GoodTypeScript', 'typescript');
    await generateCdkApp('GoodTypeScript', stack, 'typescript', workDir);

    // cdk.json exist in the correct spot
    expect(fs.pathExistsSync(path.join(workDir, 'GoodTypeScript', 'cdk.json'))).toBeTruthy();

    // cdk.json has "cdk-migrate" : true in context
    const cdkJson = fs.readJsonSync(path.join(workDir, 'GoodTypeScript', 'cdk.json'), 'utf8');
    expect(cdkJson.context['cdk-migrate']).toBeTruthy();
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

describe('generateTemplate', () => {
  let sdkProvider: MockSdkProvider;
  let cloudFormationMocks: MockedObject<SyncHandlerSubsetOf<AWS.CloudFormation>>;
  const sampleResource = {
    ResourceType: 'AWS::S3::Bucket',
    ManagedByStack: true,
    ResourceIdentifier: { 'my-key': 'my-bucket' },
    LogicalResourceId: 'my-bucket',
  };
  const sampleResource2 = {
    ResourceType: 'AWS::EC2::Instance',
    ResourceIdentifier: {
      instanceId: 'i-1234567890abcdef0',
    },
    LogicalResourceId: 'my-ec2-instance',
    ManagedByStack: true,
  };
  const stackName = 'my-stack';
  const environment = setEnvironment('123456789012', 'us-east-1');
  const scanId = 'fake-scan-id';
  const defaultExpectedResult = {
    migrateJson: {
      resources: [
        {
          LogicalResourceId: 'my-bucket',
          ResourceIdentifier: { 'my-key': 'my-bucket' },
          ResourceType: 'AWS::S3::Bucket',
        },
        {
          LogicalResourceId: 'my-ec2-instance',
          ResourceIdentifier: { instanceId: 'i-1234567890abcdef0' },
          ResourceType: 'AWS::EC2::Instance',
        },
      ],
      source: 'template-arn',
      templateBody: 'template-body',
    },
    resources: [
      {
        LogicalResourceId: 'my-bucket',
        ManagedByStack: true,
        ResourceIdentifier: {
          'my-key': 'my-bucket',
        },
        ResourceType: 'AWS::S3::Bucket',
      },
      {
        LogicalResourceId: 'my-ec2-instance',
        ManagedByStack: true,
        ResourceIdentifier: {
          instanceId: 'i-1234567890abcdef0',
        },
        ResourceType: 'AWS::EC2::Instance',
      },
    ],
  };

  beforeEach(() => {
    sdkProvider = new MockSdkProvider();
    cloudFormationMocks = {
      startResourceScan: jest.fn(),
      listResourceScans: jest.fn(),
      describeResourceScan: jest.fn(),
      listResourceScanResources: jest.fn(),
      createGeneratedTemplate: jest.fn(),
      describeGeneratedTemplate: jest.fn(),
      getGeneratedTemplate: jest.fn(),
      listResourceScanRelatedResources: jest.fn(),
      config: {
        getCredentials: jest.fn(),
        getToken: jest.fn(),
        loadFromPath: jest.fn(),
        update: jest.fn(),
        getPromisesDependency: jest.fn(),
        setPromisesDependency: jest.fn(),
        customUserAgent: 'cdk-migrate',
      },
    };

    sdkProvider.stubCloudFormation(cloudFormationMocks as any);
  });

  test('generateTemplate successfully generates template with a new scan', async () => {
    const resourceScanSummaries = [{ ResourceScanId: scanId, Status: 'COMPLETE', PercentageCompleted: 100 }];

    cloudFormationMocks.startResourceScan!.mockReturnValue({ ResourceScanId: scanId });
    cloudFormationMocks.listResourceScans!.mockReturnValue({ ResourceScanSummaries: resourceScanSummaries });
    cloudFormationMocks.describeResourceScan!.mockReturnValue({ Status: 'COMPLETED' });
    cloudFormationMocks.listResourceScanResources!.mockReturnValue({ Resources: [sampleResource2] });
    cloudFormationMocks.createGeneratedTemplate!.mockReturnValue({ GeneratedTemplateId: 'template-arn' });
    cloudFormationMocks.describeGeneratedTemplate!.mockReturnValue({ Status: 'COMPLETE', Resources: [sampleResource, sampleResource2] });
    cloudFormationMocks.getGeneratedTemplate!.mockReturnValue({ TemplateBody: 'template-body' });
    cloudFormationMocks.listResourceScanRelatedResources!.mockReturnValue({ RelatedResources: [sampleResource] });

    const opts: GenerateTemplateOptions = {
      stackName: stackName,
      filters: [],
      fromScan: FromScan.NEW,
      sdkProvider: sdkProvider,
      environment: environment,
    };

    const template = await generateTemplate(opts);
    expect(template).toEqual(defaultExpectedResult);
  });

  test('generateTemplate successfully defaults to latest scan instead of starting a new one', async () => {
    const resourceScanSummaryComplete = [{ ResourceScanId: scanId, Status: 'COMPLETE', PercentageCompleted: 100 }];
    const resourceScanSummaryInProgress = [{ ResourceScanId: scanId, Status: 'IN_PROGRESS', PercentageCompleted: 50 }];

    cloudFormationMocks.startResourceScan!.mockImplementation(() => { throw new Error('No >:('); });
    cloudFormationMocks.listResourceScans!.mockReturnValueOnce({ ResourceScanSummaries: resourceScanSummaryInProgress });
    cloudFormationMocks.listResourceScans!.mockReturnValueOnce({ ResourceScanSummaries: resourceScanSummaryComplete });
    cloudFormationMocks.describeResourceScan!.mockReturnValue({ Status: 'COMPLETED' });
    cloudFormationMocks.listResourceScanResources!.mockReturnValue({ Resources: [sampleResource2] });
    cloudFormationMocks.createGeneratedTemplate!.mockReturnValue({ GeneratedTemplateId: 'template-arn' });
    cloudFormationMocks.describeGeneratedTemplate!.mockReturnValue({ Status: 'COMPLETE', Resources: [sampleResource, sampleResource2] });
    cloudFormationMocks.getGeneratedTemplate!.mockReturnValue({ TemplateBody: 'template-body' });
    cloudFormationMocks.listResourceScanRelatedResources!.mockReturnValue({ RelatedResources: [sampleResource2] });

    const opts = {
      stackName: stackName,
      filters: [],
      newScan: true,
      sdkProvider: sdkProvider,
      environment: environment,
    };
    const template = await generateTemplate(opts);
    expect(template).toEqual(defaultExpectedResult);
  });

  test('generateTemplate throws an error when from-scan most-recent is passed but no scans are found.', async () => {
    const resourceScanSummaries: CloudFormation.ResourceScanSummary[] = [];

    cloudFormationMocks.listResourceScans!.mockReturnValue({ ResourceScanSummaries: resourceScanSummaries });

    const opts: GenerateTemplateOptions = {
      stackName: stackName,
      filters: [],
      fromScan: FromScan.MOST_RECENT,
      sdkProvider: sdkProvider,
      environment: environment,
    };
    await expect(generateTemplate(opts)).rejects.toThrow('No scans found. Please either start a new scan with the `--from-scan` new or do not specify a `--from-scan` option.');
  });

  test('generateTemplate throws an error when an invalid key is passed in the filters', async () => {
    const resourceScanSummaries = [{ ResourceScanId: scanId, Status: 'COMPLETE', PercentageCompleted: 100 }];

    cloudFormationMocks.startResourceScan!.mockReturnValue({ ResourceScanId: scanId });
    cloudFormationMocks.listResourceScans!.mockReturnValue({ ResourceScanSummaries: resourceScanSummaries });
    cloudFormationMocks.describeResourceScan!.mockReturnValue({ Status: 'COMPLETED' });
    cloudFormationMocks.listResourceScanResources!.mockReturnValue({ Resources: [sampleResource2] });
    cloudFormationMocks.createGeneratedTemplate!.mockReturnValue({ GeneratedTemplateId: 'template-arn' });
    cloudFormationMocks.describeGeneratedTemplate!.mockReturnValue({ Status: 'COMPLETE' });
    cloudFormationMocks.getGeneratedTemplate!.mockReturnValue({ TemplateBody: 'template-body' });
    cloudFormationMocks.listResourceScanRelatedResources!.mockReturnValue({ RelatedResources: [sampleResource] });

    const opts: GenerateTemplateOptions = {
      stackName: stackName,
      filters: ['invalid-key=invalid-value'],
      fromScan: FromScan.MOST_RECENT,
      sdkProvider: sdkProvider,
      environment: environment,
    };
    await expect(generateTemplate(opts)).rejects.toThrow('Invalid filter: invalid-key');
  });

  test('generateTemplate defaults to starting a new scan when no options are provided', async () => {
    const resourceScanSummaryComplete = [{ ResourceScanId: scanId, Status: 'COMPLETE', PercentageCompleted: 100 }];
    const resourceScanSummaryInProgress = [{ ResourceScanId: scanId, Status: 'IN_PROGRESS', PercentageCompleted: 50 }];

    cloudFormationMocks.startResourceScan!.mockReturnValue({ ResourceScanId: scanId });
    cloudFormationMocks.listResourceScans!.mockReturnValueOnce({ ResourceScanSummaries: undefined });
    cloudFormationMocks.listResourceScans!.mockReturnValueOnce({ ResourceScanSummaries: resourceScanSummaryInProgress });
    cloudFormationMocks.listResourceScans!.mockReturnValueOnce({ ResourceScanSummaries: resourceScanSummaryComplete });
    cloudFormationMocks.describeResourceScan!.mockReturnValue({ Status: 'COMPLETED' });
    cloudFormationMocks.listResourceScanResources!.mockReturnValue({ Resources: [sampleResource2] });
    cloudFormationMocks.createGeneratedTemplate!.mockReturnValue({ GeneratedTemplateId: 'template-arn' });
    cloudFormationMocks.describeGeneratedTemplate!.mockReturnValue({ Status: 'COMPLETE', Resources: [sampleResource, sampleResource2] });
    cloudFormationMocks.getGeneratedTemplate!.mockReturnValue({ TemplateBody: 'template-body' });
    cloudFormationMocks.listResourceScanRelatedResources!.mockReturnValue({ RelatedResources: [sampleResource] });

    const opts: GenerateTemplateOptions = {
      stackName: stackName,
      sdkProvider: sdkProvider,
      environment: environment,
    };
    const template = await generateTemplate(opts);
    expect(template).toEqual(defaultExpectedResult);
    expect(cloudFormationMocks.startResourceScan).toHaveBeenCalled();
  });

  test('generateTemplate successfully generates templates with valid filter options', async () => {
    const resourceScanSummaries = [{ ResourceScanId: scanId, Status: 'COMPLETE', PercentageCompleted: 100 }];

    cloudFormationMocks.startResourceScan!.mockReturnValue({ ResourceScanId: scanId });
    cloudFormationMocks.listResourceScans!.mockReturnValue({ ResourceScanSummaries: resourceScanSummaries });
    cloudFormationMocks.describeResourceScan!.mockReturnValue({ Status: 'COMPLETED' });
    cloudFormationMocks.listResourceScanResources!.mockReturnValue({ Resources: [sampleResource2] });
    cloudFormationMocks.createGeneratedTemplate!.mockReturnValue({ GeneratedTemplateId: 'template-arn' });
    cloudFormationMocks.describeGeneratedTemplate!.mockReturnValue({ Status: 'COMPLETE', Resources: [sampleResource, sampleResource2] });
    cloudFormationMocks.getGeneratedTemplate!.mockReturnValue({ TemplateBody: 'template-body' });
    cloudFormationMocks.listResourceScanRelatedResources!.mockReturnValue({ RelatedResources: [sampleResource] });

    const opts: GenerateTemplateOptions = {
      stackName: stackName,
      filters: ['type=AWS::S3::Bucket,identifier={"my-key":"my-bucket"}', 'type=AWS::EC2::Instance'],
      sdkProvider: sdkProvider,
      environment: environment,
    };
    const template = await generateTemplate(opts);
    expect(template).toEqual(defaultExpectedResult);
  });

});