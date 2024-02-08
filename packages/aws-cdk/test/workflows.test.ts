import * as cxschema from '@aws-cdk/cloud-assembly-schema';;
import { instanceMockFrom, MockCloudExecutable, TestStackArtifact } from './util';
import { MockSdkProvider } from './util/mock-sdk';
import { Bootstrapper } from '../lib/api/bootstrap';
import { Deployments } from '../lib/api/deployments';
import { CdkToolkit } from '../lib/cdk-toolkit';
import { listWorkflow } from '../lib/workflows';

let cloudExecutable: MockCloudExecutable;
let bootstrapper: jest.Mocked<Bootstrapper>;

beforeEach(() => {
  jest.resetAllMocks();

  bootstrapper = instanceMockFrom(Bootstrapper);
  bootstrapper.bootstrapEnvironment.mockResolvedValue({ noOp: false, outputs: {} } as any);

  cloudExecutable = new MockCloudExecutable({
    stacks: [
      MockStack.MOCK_STACK_A,
      MockStack.MOCK_STACK_B,
    ],
  });
});

describe('list', () => {
  test('stacks with no dependencies', async () => {
    // GIVEN
    const toolkit = new CdkToolkit({
      cloudExecutable,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: new Deployments({ sdkProvider: new MockSdkProvider() }),
    });

    // WHEN
    const workflow = await listWorkflow( toolkit, { selectors: ['Test-Stack-A', 'Test-Stack-B'] });

    // THEN
    expect(JSON.parse(workflow)).toEqual([{
      id: 'Test-Stack-A',
      name: 'Test-Stack-A',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [],
    },
    {
      id: 'Test-Stack-B',
      name: 'Test-Stack-B',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [],
    }]);
  });

  test('stacks with dependent stacks', async () => {
    // GIVEN
    const toolkit = new CdkToolkit({
      cloudExecutable: new MockCloudExecutable({
        stacks: [
          MockStack.MOCK_STACK_A,
          {
            stackName: 'Test-Stack-B',
            template: { Resources: { TemplateName: 'Test-Stack-B' } },
            env: 'aws://123456789012/bermuda-triangle-1',
            metadata: {
              '/Test-Stack-B': [
                {
                  type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
                },
              ],
            },
            depends: ['Test-Stack-A'],
          },
        ],
      }),
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: new Deployments({ sdkProvider: new MockSdkProvider() }),
    });

    // WHEN
    const workflow = await listWorkflow( toolkit, { selectors: ['Test-Stack-A', 'Test-Stack-B'] });

    // THEN
    expect(JSON.parse(workflow)).toEqual([{
      id: 'Test-Stack-A',
      name: 'Test-Stack-A',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [],
    },
    {
      id: 'Test-Stack-B',
      name: 'Test-Stack-B',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [{
        id: 'Test-Stack-A',
        dependencies: [],
      }],
    }]);
  });

  test('stacks with nested dependencies', async () => {
    // GIVEN
    const toolkit = new CdkToolkit({
      cloudExecutable: new MockCloudExecutable({
        stacks: [
          MockStack.MOCK_STACK_A,
          {
            stackName: 'Test-Stack-B',
            template: { Resources: { TemplateName: 'Test-Stack-B' } },
            env: 'aws://123456789012/bermuda-triangle-1',
            metadata: {
              '/Test-Stack-B': [
                {
                  type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
                },
              ],
            },
            depends: ['Test-Stack-A'],
          },
          {
            stackName: 'Test-Stack-C',
            template: { Resources: { TemplateName: 'Test-Stack-B' } },
            env: 'aws://123456789012/bermuda-triangle-1',
            metadata: {
              '/Test-Stack-B': [
                {
                  type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
                },
              ],
            },
            depends: ['Test-Stack-B'],
          },
        ],
      }),
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: new Deployments({ sdkProvider: new MockSdkProvider() }),
    });

    // WHEN
    const workflow = await listWorkflow( toolkit, { selectors: ['Test-Stack-A', 'Test-Stack-B', 'Test-Stack-C'] });

    // THEN
    expect(JSON.parse(workflow)).toEqual([{
      id: 'Test-Stack-A',
      name: 'Test-Stack-A',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [],
    },
    {
      id: 'Test-Stack-B',
      name: 'Test-Stack-B',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [{
        id: 'Test-Stack-A',
        dependencies: [],
      }],
    },
    {
      id: 'Test-Stack-C',
      name: 'Test-Stack-C',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [{
        id: 'Test-Stack-B',
        dependencies: [{
          id: 'Test-Stack-A',
          dependencies: [],
        }],
      }],
    }]);
  });

  // In the context of stacks with cross-stack or cross-region references,
  // the dependency mechanism is responsible for appropriately applying dependencies at the correct hierarchy level,
  // typically at the top-level stacks.
  // This involves handling the establishment of cross-references between stacks or nested stacks
  // and generating assets for nested stack templates as necessary.
  test('stacks with cross stack referencing', async () => {
    // GIVEN
    const toolkit = new CdkToolkit({
      cloudExecutable: new MockCloudExecutable({
        stacks: [
          {
            stackName: 'Test-Stack-A',
            template: {
              Resources: {
                MyBucket1Reference: {
                  Type: 'AWS::CloudFormation::Stack',
                  Properties: {
                    TemplateURL: 'XXXXXXXXXXXXXXXXXXXXXXXXX',
                    Parameters: {
                      BucketName: { 'Fn::GetAtt': ['MyBucket1', 'Arn'] },
                    },
                  },
                },
              },
            },
            env: 'aws://123456789012/bermuda-triangle-1',
            metadata: {
              '/Test-Stack-A': [
                {
                  type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
                },
              ],
            },
            depends: ['Test-Stack-C'],
          },
          MockStack.MOCK_STACK_C,
        ],
      }),
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: new Deployments({ sdkProvider: new MockSdkProvider() }),
    });

    // WHEN
    const workflow = await listWorkflow( toolkit, { selectors: ['Test-Stack-A', 'Test-Stack-C'] });

    // THEN
    expect(JSON.parse(workflow)).toEqual([{
      id: 'Test-Stack-C',
      name: 'Test-Stack-C',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [],
    },
    {
      id: 'Test-Stack-A',
      name: 'Test-Stack-A',
      environment: {
        account: '123456789012',
        region: 'bermuda-triangle-1',
        name: 'aws://123456789012/bermuda-triangle-1',
      },
      dependencies: [{
        id: 'Test-Stack-C',
        dependencies: [],
      }],
    }]);
  });
});

class MockStack {
  public static readonly MOCK_STACK_A: TestStackArtifact = {
    stackName: 'Test-Stack-A',
    template: { Resources: { TemplateName: 'Test-Stack-A' } },
    env: 'aws://123456789012/bermuda-triangle-1',
    metadata: {
      '/Test-Stack-A': [
        {
          type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
        },
      ],
    },
    displayName: 'Test-Stack-A-Display-Name',
  };
  public static readonly MOCK_STACK_B: TestStackArtifact = {
    stackName: 'Test-Stack-B',
    template: { Resources: { TemplateName: 'Test-Stack-B' } },
    env: 'aws://123456789012/bermuda-triangle-1',
    metadata: {
      '/Test-Stack-B': [
        {
          type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
        },
      ],
    },
  };
  public static readonly MOCK_STACK_C: TestStackArtifact = {
    stackName: 'Test-Stack-C',
    template: {
      Resources: {
        MyBucket1: {
          Type: 'AWS::S3::Bucket',
          Properties: {
            AccessControl: 'PublicRead',
          },
          DeletionPolicy: 'Retain',
        },
      },
    },
    env: 'aws://123456789012/bermuda-triangle-1',
    metadata: {
      '/Test-Stack-C': [
        {
          type: cxschema.ArtifactMetadataEntryType.STACK_TAGS,
        },
      ],
    },
  }
}
