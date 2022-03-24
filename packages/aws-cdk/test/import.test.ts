jest.mock('promptly', () => {
  return {
    ...jest.requireActual('promptly'),
    confirm: jest.fn(),
    prompt: jest.fn(),
  };
});

import * as promptly from 'promptly';
import { CloudFormationDeployments } from '../lib/api/cloudformation-deployments';
import { ResourceImporter } from '../lib/import';
import { testStack } from './util';
import { MockSdkProvider } from './util/mock-sdk';

const promptlyConfirm = promptly.confirm as jest.Mock;
const promptlyPrompt = promptly.prompt as jest.Mock;

const STACK_WITH_QUEUE = testStack({
  stackName: 'StackWithQueue',
  template: {
    Resources: {
      MyQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {},
      },
    },
  },
});

const STACK_WITH_NAMED_QUEUE = testStack({
  stackName: 'StackWithQueue',
  template: {
    Resources: {
      MyQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'TheQueueName',
        },
      },
    },
  },
});

let sdkProvider: MockSdkProvider;
let deployments: CloudFormationDeployments;
beforeEach(() => {
  jest.resetAllMocks();
  sdkProvider = new MockSdkProvider({ realSdk: false });
  deployments = new CloudFormationDeployments({ sdkProvider });
});

test('discovers importable resources', async () => {
  givenCurrentStack(STACK_WITH_QUEUE.stackName, {
    Resources: {},
  });

  const importer = new ResourceImporter(STACK_WITH_QUEUE, deployments);
  const resources = await importer.discoverImportableResources();
  expect(resources).toEqual([
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
  const resources = await importer.discoverImportableResources();

  // WHEN
  promptlyPrompt.mockResolvedValue('TheQueueName');
  const importable = await importer.askForResourceIdentifiers(resources);

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

test('asks human to confirm if identifier is in template', async () => {
  // GIVEN
  givenCurrentStack(STACK_WITH_NAMED_QUEUE.stackName, { Resources: {} });
  const importer = new ResourceImporter(STACK_WITH_NAMED_QUEUE, deployments);
  const resources = await importer.discoverImportableResources();

  // WHEN
  promptlyConfirm.mockResolvedValue(true);
  const importable = await importer.askForResourceIdentifiers(resources);

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
        ],
      };
    },
  });
}