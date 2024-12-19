import { exec as _exec } from 'child_process';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';
import {
  CreateGeneratedTemplateCommand,
  DescribeGeneratedTemplateCommand,
  DescribeResourceScanCommand,
  DescribeStacksCommand,
  GetGeneratedTemplateCommand,
  GetTemplateCommand,
  ListResourceScanRelatedResourcesCommand,
  ListResourceScanResourcesCommand,
  ListResourceScansCommand,
  ResourceScanStatus,
  StackStatus,
  StartResourceScanCommand,
} from '@aws-sdk/client-cloudformation';
import * as fs from 'fs-extra';
import {
  generateCdkApp,
  generateStack,
  readFromPath,
  readFromStack,
  setEnvironment,
  parseSourceOptions,
  generateTemplate,
  TemplateSourceOptions,
  GenerateTemplateOptions,
  FromScan,
} from '../../lib/commands/migrate';
import { MockSdkProvider, mockCloudFormationClient, restoreSdkMocksToDefault } from '../util/mock-sdk';

const exec = promisify(_exec);

describe('Migrate Function Tests', () => {
  let sdkProvider: MockSdkProvider;

  const testResourcePath = [__dirname, 'test-resources'];
  const templatePath = [...testResourcePath, 'templates'];
  const stackPath = [...testResourcePath, 'stacks'];

  const validTemplatePath = path.join(...templatePath, 's3-template.json');
  const emptyTemplatePath = path.join(...templatePath, 'empty-template.yml');
  const invalidTemplatePath = path.join(...templatePath, 'rds-template.json');
  const validTemplate = readFromPath(validTemplatePath)!;
  const invalidTemplate = readFromPath(invalidTemplatePath)!;

  beforeEach(async () => {
    sdkProvider = new MockSdkProvider();
  });

  test('parseSourceOptions throws if both --from-path and --from-stack is provided', () => {
    expect(() => parseSourceOptions('any-value', true, 'my-awesome-stack')).toThrow(
      'Only one of `--from-path` or `--from-stack` may be provided.',
    );
  });

  test('parseSourceOptions returns from-scan when neither --from-path or --from-stack are provided', () => {
    expect(parseSourceOptions(undefined, undefined, 'my-stack-name')).toStrictEqual({
      source: TemplateSourceOptions.SCAN,
    });
  });

  test('parseSourceOptions does not throw when only --from-path is supplied', () => {
    expect(parseSourceOptions('my-file-path', undefined, 'my-stack-name')).toStrictEqual({
      source: TemplateSourceOptions.PATH,
      templatePath: 'my-file-path',
    });
  });

  test('parseSourceOptions does now throw when only --from-stack is provided', () => {
    expect(parseSourceOptions(undefined, true, 'my-stack-name')).toStrictEqual({
      source: TemplateSourceOptions.STACK,
      stackName: 'my-stack-name',
    });
  });

  test('readFromPath produces a string representation of the template at a given path', () => {
    expect(readFromPath(validTemplatePath)).toEqual(fs.readFileSync(validTemplatePath, 'utf8'));
  });

  test('readFromPath throws error when template file is empty', () => {
    expect(() => readFromPath(emptyTemplatePath)).toThrow(`\'${emptyTemplatePath}\' is an empty file.`);
  });

  test('readFromPath throws error when template file does not exist at a given path', () => {
    const badTemplatePath = './not-here.json';
    expect(() => readFromPath(badTemplatePath)).toThrow(`\'${badTemplatePath}\' is not a valid path.`);
  });

  test('readFromStack produces a string representation of the template retrieved from CloudFormation', async () => {
    const template = fs.readFileSync(validTemplatePath, { encoding: 'utf-8' });
    mockCloudFormationClient
      .on(GetTemplateCommand)
      .resolves({
        TemplateBody: template,
      })
      .on(DescribeStacksCommand)
      .resolves({
        Stacks: [
          {
            StackName: 'this-one',
            StackStatus: StackStatus.CREATE_COMPLETE,
            CreationTime: new Date(),
          },
        ],
      });

    expect(
      await readFromStack('this-one', sdkProvider, {
        account: '123456789012',
        region: 'here',
        name: 'hello-my-name-is-what...',
      }),
    ).toEqual(JSON.stringify(JSON.parse(template)));
  });

  test('readFromStack throws error when no stack exists with the stack name in the account and region', async () => {
    const error = new Error('No stack. This did not go well.');
    mockCloudFormationClient.on(DescribeStacksCommand).rejects(error);
    await expect(() =>
      readFromStack('that-one', sdkProvider, {
        account: '123456789012',
        region: 'here',
        name: 'hello-my-name-is-who...',
      }),
    ).rejects.toThrow('No stack. This did not go well.');
  });

  test('readFromStack throws error when stack exists but the status is not healthy', async () => {
    mockCloudFormationClient.on(DescribeStacksCommand).resolves({
      Stacks: [
        {
          StackName: 'this-one',
          StackStatus: StackStatus.CREATE_FAILED,
          StackStatusReason: 'Something went wrong',
          CreationTime: new Date(),
        },
      ],
    });

    await expect(() =>
      readFromStack('that-one', sdkProvider, {
        account: '123456789012',
        region: 'here',
        name: 'hello-my-name-is-chicka-chicka...',
      }),
    ).rejects.toThrow(
      "Stack 'that-one' in account 123456789012 and region here has a status of 'CREATE_FAILED' due to 'Something went wrong'. The stack cannot be migrated until it is in a healthy state.",
    );
  });

  test('setEnvironment sets account and region when provided', () => {
    expect(setEnvironment('my-account', 'somewhere')).toEqual({
      account: 'my-account',
      region: 'somewhere',
      name: 'cdk-migrate-env',
    });
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
    expect(() => generateStack(validTemplate, 'BadBadBad', 'php')).toThrow(
      'BadBadBadStack could not be generated because php is not a supported language',
    );
  });

  test('generateStack throws error for invalid resource property', () => {
    expect(() => generateStack(invalidTemplate, 'VeryBad', 'typescript')).toThrow(
      'VeryBadStack could not be generated because ReadEndpoint is not a valid property for resource RDSCluster of type AWS::RDS::DBCluster',
    );
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
    expect(
      app
        .map((line) => line.match("import { GoodTypeScriptStack } from '../lib/good_type_script-stack';"))
        .filter((line) => line).length,
    ).toEqual(1);
    expect(
      app.map((line) => line.match(/new GoodTypeScriptStack\(app, \'GoodTypeScript\', \{/)).filter((line) => line)
        .length,
    ).toEqual(1);

    // Replaced stack file is correctly generated
    const replacedStack = fs.readFileSync(
      path.join(workDir, 'GoodTypeScript', 'lib', 'good_type_script-stack.ts'),
      'utf8',
    );
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
    expect(
      app.map((line) => line.match('from good_python.good_python_stack import GoodPythonStack')).filter((line) => line)
        .length,
    ).toEqual(1);
    expect(app.map((line) => line.match(/GoodPythonStack\(app, "GoodPython",/)).filter((line) => line).length).toEqual(
      1,
    );

    // Replaced stack file is correctly generated
    const replacedStack = fs.readFileSync(
      path.join(workDir, 'GoodPython', 'good_python', 'good_python_stack.py'),
      'utf8',
    );
    expect(replacedStack).toEqual(fs.readFileSync(path.join(...stackPath, 's3_stack.py'), 'utf8'));
  });

  cliTest('generateCdkApp generates the expected cdk app when called for java', async (workDir) => {
    const stack = generateStack(validTemplate, 'GoodJava', 'java');
    await generateCdkApp('GoodJava', stack, 'java', workDir);

    // Packages exist in the correct spot
    expect(fs.pathExistsSync(path.join(workDir, 'GoodJava', 'pom.xml'))).toBeTruthy();
    expect(
      fs.pathExistsSync(path.join(workDir, 'GoodJava', 'src', 'main', 'java', 'com', 'myorg', 'GoodJavaApp.java')),
    ).toBeTruthy();
    expect(
      fs.pathExistsSync(path.join(workDir, 'GoodJava', 'src', 'main', 'java', 'com', 'myorg', 'GoodJavaStack.java')),
    ).toBeTruthy();

    // Replaced stack file is referenced correctly in app file
    const app = fs
      .readFileSync(path.join(workDir, 'GoodJava', 'src', 'main', 'java', 'com', 'myorg', 'GoodJavaApp.java'), 'utf8')
      .split('\n');
    expect(app.map((line) => line.match('public class GoodJavaApp {')).filter((line) => line).length).toEqual(1);
    expect(
      app
        .map((line) => line.match(/        new GoodJavaStack\(app, "GoodJava", StackProps.builder()/))
        .filter((line) => line).length,
    ).toEqual(1);

    // Replaced stack file is correctly generated
    const replacedStack = fs.readFileSync(
      path.join(workDir, 'GoodJava', 'src', 'main', 'java', 'com', 'myorg', 'GoodJavaStack.java'),
      'utf8',
    );
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
    const app = fs
      .readFileSync(path.join(workDir, 'GoodCSharp', 'src', 'GoodCSharp', 'Program.cs'), 'utf8')
      .split('\n');
    expect(app.map((line) => line.match('namespace GoodCSharp')).filter((line) => line).length).toEqual(1);
    expect(
      app
        .map((line) => line.match(/        new GoodCSharpStack\(app, "GoodCSharp", new GoodCSharpStackProps/))
        .filter((line) => line).length,
    ).toEqual(1);

    // Replaced stack file is correctly generated
    const replacedStack = fs.readFileSync(
      path.join(workDir, 'GoodCSharp', 'src', 'GoodCSharp', 'GoodCSharpStack.cs'),
      'utf8',
    );
    expect(replacedStack).toEqual(fs.readFileSync(path.join(...stackPath, 'S3Stack.cs'), 'utf8'));
  });

  cliTest('generatedCdkApp generates the expected cdk app when called for go', async (workDir) => {
    const stack = generateStack(validTemplate, 'GoodGo', 'go');
    await generateCdkApp('GoodGo', stack, 'go', workDir);

    expect(fs.pathExists(path.join(workDir, 's3.go'))).toBeTruthy();
    const app = fs.readFileSync(path.join(workDir, 'GoodGo', 'good_go.go'), 'utf8').split('\n');
    expect(
      app
        .map((line) =>
          line.match(
            /func NewGoodGoStack\(scope constructs.Construct, id string, props \*GoodGoStackProps\) \*GoodGoStack \{/,
          ),
        )
        .filter((line) => line).length,
    ).toEqual(1);
    expect(app.map((line) => line.match(/    NewGoodGoStack\(app, "GoodGo", &GoodGoStackProps\{/)));
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
    restoreSdkMocksToDefault();
    sdkProvider = new MockSdkProvider();
    mockCloudFormationClient
      .on(StartResourceScanCommand)
      .resolves({
        ResourceScanId: scanId,
      })
      .on(ListResourceScansCommand)
      .resolves({
        ResourceScanSummaries: [
          { ResourceScanId: scanId, Status: ResourceScanStatus.COMPLETE, PercentageCompleted: 100 },
        ],
      })
      .on(DescribeResourceScanCommand)
      .resolves({
        Status: 'COMPLETE',
      })
      .on(ListResourceScanResourcesCommand)
      .resolves({
        Resources: [sampleResource2],
      })
      .on(CreateGeneratedTemplateCommand)
      .resolves({
        GeneratedTemplateId: 'template-arn',
      })
      .on(DescribeGeneratedTemplateCommand)
      .resolves({
        Status: 'COMPLETE',
        Resources: [sampleResource, sampleResource2],
      })
      .on(GetGeneratedTemplateCommand)
      .resolves({
        TemplateBody: 'template-body',
      })
      .on(ListResourceScanRelatedResourcesCommand)
      .resolves({
        RelatedResources: [sampleResource],
      });
  });

  afterEach(() => {
    restoreSdkMocksToDefault();
  });

  test('generateTemplate successfully generates template with a new scan', async () => {
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
    mockCloudFormationClient
      .on(StartResourceScanCommand)
      .rejects('No >:(')
      .on(ListResourceScansCommand)
      .resolvesOnce({
        ResourceScanSummaries: [{ ResourceScanId: scanId, Status: 'IN_PROGRESS', PercentageCompleted: 50 }],
      })
      .resolves({
        ResourceScanSummaries: [{ ResourceScanId: scanId, Status: 'COMPLETE', PercentageCompleted: 100 }],
      });

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
    mockCloudFormationClient.on(ListResourceScansCommand)
      .resolves({
        ResourceScanSummaries: [],
      });

    const opts: GenerateTemplateOptions = {
      stackName: stackName,
      filters: [],
      fromScan: FromScan.MOST_RECENT,
      sdkProvider: sdkProvider,
      environment: environment,
    };
    await expect(generateTemplate(opts)).rejects.toThrow(
      'No scans found. Please either start a new scan with the `--from-scan` new or do not specify a `--from-scan` option.',
    );
  });

  test('generateTemplate throws an error when an invalid key is passed in the filters', async () => {
    const opts: GenerateTemplateOptions = {
      stackName: stackName,
      filters: ['invalid-key=invalid-value'],
      fromScan: FromScan.MOST_RECENT,
      sdkProvider: sdkProvider,
      environment: environment,
    };
    await expect(generateTemplate(opts)).rejects.toThrow('Invalid filter: invalid-key');
  });

  test('generateTemplate defaults to starting a new scan when no options are provided and no scans are found', async () => {
    mockCloudFormationClient.on(ListResourceScansCommand)
      // First call: list current scans, there aren't any.
      .resolvesOnce({ ResourceScanSummaries: [] })
      // The generator will then call StartScan and ListResourceScans again which it now will expect to return something
      .resolves({
        ResourceScanSummaries: [{ ResourceScanId: scanId, Status: 'COMPLETE', PercentageCompleted: 100 }],
      });

    const opts: GenerateTemplateOptions = {
      stackName: stackName,
      sdkProvider: sdkProvider,
      environment: environment,
    };
    const template = await generateTemplate(opts);
    expect(template).toEqual(defaultExpectedResult);
    expect(mockCloudFormationClient).toHaveReceivedCommand(StartResourceScanCommand);
  });

  test('generateTemplate successfully generates templates with valid filter options', async () => {
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
