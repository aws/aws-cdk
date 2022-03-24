import { CloudFormationDeployments } from '../lib/api/cloudformation-deployments';
import { ResourceImporter } from '../lib/import';
import { testStack } from './util';
import { MockSdkProvider } from './util/mock-sdk';

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
  });
}