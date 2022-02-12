import { getExecutor, StateMachineExecutor } from '../../lib/api/executor';
import { testStack } from '../util';
import { MockSdkProvider } from '../util/mock-sdk';

describe('getExecutor', () => {
  test('state machine executor', async () => {
    const setup = new Setup();
    setup.addResource('FooBar', 'AWS::StepFunctions::StateMachine', {
      Metadata: {
        'aws:cdk:path': 'test-stack-name/boom/Resource',
      },
    });

    // WHEN
    const executor = await getExecutor({
      sdkProvider: setup.sdkProvider,
      constructPath: 'test-stack-name/boom',
      stackArtifacts: [setup.createStackArtifact()],
    });

    // THEN
    expect(executor).toBeInstanceOf(StateMachineExecutor);
    expect(executor.physicalResourceId).toEqual('physical-FooBar');
  });

  test('errors on unsupported type', async () => {
    const setup = new Setup();
    setup.addResource('FooBar', 'AWS::SQS::Queue', {
      Metadata: {
        'aws:cdk:path': 'test-stack-name/boom/Resource',
      },
    });

    // WHEN
    await expect(async () => {
      await getExecutor({
        sdkProvider: setup.sdkProvider,
        constructPath: 'test-stack-name/boom',
        stackArtifacts: [setup.createStackArtifact()],
      });
    }).rejects.toThrow(/unsupported/i);
  });

  test('errors when path not found', async () => {
    const setup = new Setup();

    // WHEN
    await expect(async () => {
      await getExecutor({
        sdkProvider: setup.sdkProvider,
        constructPath: 'test-stack-name/does-not-exist',
        stackArtifacts: [setup.createStackArtifact()],
      });
    }).rejects.toThrow(/could not find.*construct path/i);
  });
});

describe('StateMachineExecutor', () => {
  test('success after running', async () => {
    const sdkProvider = new MockSdkProvider({ realSdk: true });
    let describeCount = 0;
    sdkProvider.stubStepFunctions({
      startExecution: () => ({
        executionArn: 'execution-arn',
        startDate: new Date(),
      }),
      describeExecution: () => {
        describeCount += 1;
        return ({
          status: describeCount >= 2 ? 'SUCCEEDED' : 'RUNNING',
          stateMachineArn: 'state-machine-arn',
          executionArn: 'execution-arn',
          startDate: new Date(),
        });
      },
    });

    const stepFunctions = sdkProvider.sdk.stepFunctions();

    // WHEN
    const executor = new StateMachineExecutor({
      physicalResourceId: 'state-machine-arn',
      stepFunctions,
    });

    // THEN
    const result = await executor.execute();
    expect(result.success).toEqual(true);
  });

  test('fail status', async () => {
    const sdkProvider = new MockSdkProvider({ realSdk: true });
    sdkProvider.stubStepFunctions({
      startExecution: () => ({
        executionArn: 'execution-arn',
        startDate: new Date(),
      }),
      describeExecution: () => {
        return ({
          status: 'FAILED',
          stateMachineArn: 'state-machine-arn',
          executionArn: 'execution-arn',
          startDate: new Date(),
        });
      },
    });

    const stepFunctions = sdkProvider.sdk.stepFunctions();

    // WHEN
    const executor = new StateMachineExecutor({
      physicalResourceId: 'state-machine-arn',
      stepFunctions,
    });

    // THEN
    const result = await executor.execute();
    expect(result.success).toEqual(false);
  });

  test('errors when input is invalid', async () => {
    const sdkProvider = new MockSdkProvider({ realSdk: true });
    const stepFunctions = sdkProvider.sdk.stepFunctions();

    const executor = new StateMachineExecutor({
      physicalResourceId: 'state-machine-arn',
      stepFunctions,
    });

    // WHEN
    await expect(async () => {
      await executor.execute('INVALID');
    }).rejects.toThrow(/i/i);
  });
});

class Setup {
  readonly sdkProvider: MockSdkProvider;

  readonly summaries: any[] = [];
  readonly resources: Record<string, object> = {};

  constructor() {
    this.sdkProvider = new MockSdkProvider({ realSdk: false });
    this.sdkProvider.stubCloudFormation({
      listStackResources: _ => ({
        StackResourceSummaries: this.summaries,
      }),
    });
  }

  addResource(name: string, resourceType: string, props: object) {
    this.resources[name] = {
      Type: resourceType,
      ...props,
    };
    this.summaries.push({
      ResourceType: resourceType,
      ResourceStatus: 'CREATE_COMPLETE',
      LastUpdatedTimestamp: new Date(),
      LogicalResourceId: name,
      PhysicalResourceId: 'physical-' + name,
    });
  }

  createStackArtifact() {
    return testStack({
      stackName: 'test-stack-name',
      template: {
        Resources: this.resources,
      },
    });
  }
}