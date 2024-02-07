import * as cxschema from '@aws-cdk/cloud-assembly-schema';;
import { instanceMockFrom, MockCloudExecutable, TestStackArtifact } from './util';
import { MockSdkProvider } from './util/mock-sdk';
import { Bootstrapper } from '../lib/api/bootstrap';
import { Deployments } from '../lib/api/deployments';
import { CdkToolkit, Tag } from '../lib/cdk-toolkit';
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
  test('list stacks with no dependencies', async () => {
    // GIVEN
    const toolkit = new CdkToolkit({
      cloudExecutable,
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: new FakeCloudFormation({
        'Test-Stack-A': { Foo: 'Bar' },
        'Test-Stack-B': { Baz: 'Zinga!' },
      }),
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

  test('list stacks with dependent stacks', async () => {
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
                  data: [
                    { key: 'Baz', value: 'Zinga!' },
                  ],
                },
              ],
            },
            depends: ['Test-Stack-A'],
          },
        ],
      }),
      configuration: cloudExecutable.configuration,
      sdkProvider: cloudExecutable.sdkProvider,
      deployments: new FakeCloudFormation({
        'Test-Stack-A': { Foo: 'Bar' },
        'Test-Stack-B': { Baz: 'Zinga!' },
      }),
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
          data: [
            { key: 'Foo', value: 'Bar' },
          ],
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
          data: [
            { key: 'Baz', value: 'Zinga!' },
          ],
        },
      ],
    },
  };
}

class FakeCloudFormation extends Deployments {
  private readonly expectedTags: { [stackName: string]: Tag[] } = {};

  constructor(
    expectedTags: { [stackName: string]: { [key: string]: string } } = {},
  ) {
    super({ sdkProvider: new MockSdkProvider() });

    for (const [stackName, tags] of Object.entries(expectedTags)) {
      this.expectedTags[stackName] =
        Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
          .sort((l, r) => l.Key.localeCompare(r.Key));
    }
  }
}
