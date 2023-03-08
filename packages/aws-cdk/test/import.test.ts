jest.mock('promptly', () => {
  return {
    ...jest.requireActual('promptly'),
    confirm: jest.fn(),
    prompt: jest.fn(),
  };
});

import * as promptly from 'promptly';
import { testStack } from './util';
import { MockSdkProvider } from './util/mock-sdk';
import { CloudFormationDeployments } from '../lib/api/cloudformation-deployments';
import { ResourceImporter, ImportMap } from '../lib/import';

const promptlyConfirm = promptly.confirm as jest.Mock;
const promptlyPrompt = promptly.prompt as jest.Mock;

let createChangeSetInput: AWS.CloudFormation.CreateChangeSetInput | undefined;

function stackWithQueue(props: Record<string, unknown>) {
  return testStack({
    stackName: 'StackWithQueue',
    template: {
      Resources: {
        MyQueue: {
          Type: 'AWS::SQS::Queue',
          Properties: props,
        },
      },
    },
  });
}

const STACK_WITH_QUEUE = stackWithQueue({});

const STACK_WITH_NAMED_QUEUE = stackWithQueue({
  QueueName: 'TheQueueName',
});

function stackWithGlobalTable(props: Record<string, unknown>) {
  return testStack({
    stackName: 'StackWithTable',
    template: {
      Resources: {
        MyTable: {
          Type: 'AWS::DynamoDB::GlobalTable',
          Properties: props,
        },
      },
    },
  });
}

function stackWithKeySigningKey(props: Record<string, unknown>) {
  return testStack({
    stackName: 'StackWithKSK',
    template: {
      Resources: {
        MyKSK: {
          Type: 'AWS::Route53::KeySigningKey',
          Properties: props,
        },
      },
    },
  });
}

let sdkProvider: MockSdkProvider;
let deployments: CloudFormationDeployments;
beforeEach(() => {
  jest.resetAllMocks();
  sdkProvider = new MockSdkProvider({ realSdk: false });
  deployments = new CloudFormationDeployments({ sdkProvider });
  createChangeSetInput = undefined;
});

test('discovers importable resources', async () => {
  givenCurrentStack(STACK_WITH_QUEUE.stackName, {
    Resources: {},
  });

  const importer = new ResourceImporter(STACK_WITH_QUEUE, deployments);
  const { additions } = await importer.discoverImportableResources();
  expect(additions).toEqual([
    expect.objectContaining({
      logicalId: 'MyQueue',
    }),
  ]);
});

test('by default, its an error if there are non-addition changes in the template', async () => {
  givenCurrentStack(STACK_WITH_QUEUE.stackName, {
    Resources: {
      SomethingThatDisappeared: {
        Type: 'AWS::S3::Bucket',
      },
    },
  });

  const importer = new ResourceImporter(STACK_WITH_QUEUE, deployments);
  await expect(importer.discoverImportableResources()).rejects.toThrow(/No resource updates or deletes/);

  // But the error can be silenced
  await expect(importer.discoverImportableResources(true)).resolves.toBeTruthy();
});

test('asks human for resource identifiers', async () => {
  // GIVEN
  givenCurrentStack(STACK_WITH_QUEUE.stackName, { Resources: {} });
  const importer = new ResourceImporter(STACK_WITH_QUEUE, deployments);
  const { additions } = await importer.discoverImportableResources();

  // WHEN
  promptlyPrompt.mockResolvedValue('TheQueueName');
  const importable = await importer.askForResourceIdentifiers(additions);

  // THEN
  expect(importable.resourceMap).toEqual({
    MyQueue: {
      QueueName: 'TheQueueName',
    },
  });
  expect(importable.importResources).toEqual([
    expect.objectContaining({
      logicalId: 'MyQueue',
    }),
  ]);
});

test('asks human to confirm automic import if identifier is in template', async () => {
  // GIVEN
  givenCurrentStack(STACK_WITH_NAMED_QUEUE.stackName, { Resources: {} });
  const importer = new ResourceImporter(STACK_WITH_NAMED_QUEUE, deployments);
  const { additions } = await importer.discoverImportableResources();

  // WHEN
  promptlyConfirm.mockResolvedValue(true);
  const importable = await importer.askForResourceIdentifiers(additions);

  // THEN
  expect(importable.resourceMap).toEqual({
    MyQueue: {
      QueueName: 'TheQueueName',
    },
  });
  expect(importable.importResources).toEqual([
    expect.objectContaining({
      logicalId: 'MyQueue',
    }),
  ]);
});

test('asks human to confirm automic import if identifier is in template', async () => {
  // GIVEN
  givenCurrentStack(STACK_WITH_QUEUE.stackName, { Resources: {} });
  const importer = new ResourceImporter(STACK_WITH_QUEUE, deployments);
  const { additions } = await importer.discoverImportableResources();
  const importMap: ImportMap = {
    importResources: additions,
    resourceMap: {
      MyQueue: { QueueName: 'TheQueueName' },
    },
  };

  // WHEN
  await importer.importResources(importMap, {
    stack: STACK_WITH_QUEUE,
  });

  expect(createChangeSetInput?.ResourcesToImport).toEqual([
    {
      LogicalResourceId: 'MyQueue',
      ResourceIdentifier: { QueueName: 'TheQueueName' },
      ResourceType: 'AWS::SQS::Queue',
    },
  ]);
});

test('only use one identifier if multiple are in template', async () => {
  // GIVEN
  const stack = stackWithGlobalTable({
    TableName: 'TheTableName',
    TableArn: 'ThisFieldDoesntExistInReality',
    TableStreamArn: 'NorDoesThisOne',
  });

  // WHEN
  promptlyConfirm.mockResolvedValue(true); // Confirm yes/no
  await importTemplateFromClean(stack);

  // THEN
  expect(createChangeSetInput?.ResourcesToImport).toEqual([
    {
      LogicalResourceId: 'MyTable',
      ResourceIdentifier: { TableName: 'TheTableName' },
      ResourceType: 'AWS::DynamoDB::GlobalTable',
    },
  ]);
});

test('only ask user for one identifier if multiple possible ones are possible', async () => {
  // GIVEN -- no identifiers in template, so ask user
  const stack = stackWithGlobalTable({});

  // WHEN
  promptlyPrompt.mockResolvedValue('Banana');
  const importable = await importTemplateFromClean(stack);

  // THEN -- only asked once
  expect(promptlyPrompt).toHaveBeenCalledTimes(1);
  expect(importable.resourceMap).toEqual({
    MyTable: { TableName: 'Banana' },
  });
});

test('ask identifier if the value in the template is a CFN intrinsic', async () => {
  // GIVEN -- identifier in template is a CFN intrinsic so it doesn't count
  const stack = stackWithQueue({
    QueueName: { Ref: 'SomeParam' },
  });

  // WHEN
  promptlyPrompt.mockResolvedValue('Banana');
  const importable = await importTemplateFromClean(stack);

  // THEN
  expect(importable.resourceMap).toEqual({
    MyQueue: { QueueName: 'Banana' },
  });
});

test('take compound identifiers from the template if found', async () => {
  // GIVEN
  const stack = stackWithKeySigningKey({
    HostedZoneId: 'z-123',
    Name: 'KeyName',
  });

  // WHEN
  promptlyConfirm.mockResolvedValue(true);
  await importTemplateFromClean(stack);

  // THEN
  expect(createChangeSetInput?.ResourcesToImport).toEqual([
    {
      LogicalResourceId: 'MyKSK',
      ResourceIdentifier: { HostedZoneId: 'z-123', Name: 'KeyName' },
      ResourceType: 'AWS::Route53::KeySigningKey',
    },
  ]);
});

test('ask user for compound identifiers if not found', async () => {
  // GIVEN
  const stack = stackWithKeySigningKey({});

  // WHEN
  promptlyPrompt.mockReturnValue('Banana');
  await importTemplateFromClean(stack);

  // THEN
  expect(createChangeSetInput?.ResourcesToImport).toEqual([
    {
      LogicalResourceId: 'MyKSK',
      ResourceIdentifier: { HostedZoneId: 'Banana', Name: 'Banana' },
      ResourceType: 'AWS::Route53::KeySigningKey',
    },
  ]);
});

test('do not ask for second part of compound identifier if the user skips the first', async () => {
  // GIVEN
  const stack = stackWithKeySigningKey({});

  // WHEN
  promptlyPrompt.mockReturnValue('');
  const importMap = await importTemplateFromClean(stack);

  // THEN
  expect(importMap.resourceMap).toEqual({});
});

/**
 * Do a full import cycle with the given stack template
 */
async function importTemplateFromClean(stack: ReturnType<typeof testStack>) {
  givenCurrentStack(stack.stackName, { Resources: {} });
  const importer = new ResourceImporter(stack, deployments);
  const { additions } = await importer.discoverImportableResources();
  const importable = await importer.askForResourceIdentifiers(additions);
  await importer.importResources(importable, { stack });
  return importable;
}

function givenCurrentStack(stackName: string, template: any) {
  sdkProvider.stubCloudFormation({
    describeStacks() {
      return {
        Stacks: [
          {
            StackName: stackName,
            CreationTime: new Date(),
            StackStatus: 'UPDATE_COMPLETE',
            StackStatusReason: 'It is magic',
            Outputs: [],
          },
        ],
      };
    },
    getTemplate() {
      return {
        TemplateBody: JSON.stringify(template),
      };
    },
    getTemplateSummary() {
      return {
        ResourceIdentifierSummaries: [
          {
            ResourceType: 'AWS::SQS::Queue',
            ResourceIdentifiers: ['QueueName'],
          },
          {
            ResourceType: 'AWS::DynamoDB::GlobalTable',
            ResourceIdentifiers: ['TableName', 'TableArn', 'TableStreamArn'],
          },
          {
            ResourceType: 'AWS::Route53::KeySigningKey',
            ResourceIdentifiers: ['HostedZoneId,Name'],
          },
        ],
      };
    },
    deleteChangeSet() {
      return {};
    },
    createChangeSet(request) {
      createChangeSetInput = request;
      return {};
    },
    describeChangeSet() {
      return {
        Status: 'CREATE_COMPLETE',
        Changes: [],
      };
    },
    executeChangeSet() {
      return {};
    },
    describeStackEvents() {
      return {};
    },
  });
}