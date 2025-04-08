import { App, CfnResource, Stack } from '../../../core';
import { CfnParser, ICfnFinder } from '../../../core/lib/helpers-internal/cfn-parse';

describe('cfn-parse', () => {
  let app: App;
  let stack: Stack;
  let parser: CfnParser;

  beforeEach(() => {
    app = new App();
    stack = new Stack(app, 'TestStack');

    // Create a mock finder for the CfnParser
    const mockFinder: ICfnFinder = {
      findCondition: jest.fn(),
      findMapping: jest.fn(),
      findRefTarget: jest.fn(),
      findResource: jest.fn(),
    };

    // Create a CfnParser instance
    parser = new CfnParser({
      finder: mockFinder,
      parameters: {},
    });
  });

  test('handleAttributes correctly parses all properties in AutoScalingRollingUpdate', () => {
    // Create a CfnResource to test with
    const cfnResource = new CfnResource(stack, 'TestResource', {
      type: 'AWS::AutoScaling::AutoScalingGroup',
      properties: {
        MinSize: '1',
        MaxSize: '10',
        DesiredCapacity: '2',
      },
    });

    // Create resource attributes with UpdatePolicy containing AutoScalingRollingUpdate
    const resourceAttributes = {
      UpdatePolicy: {
        AutoScalingRollingUpdate: {
          MaxBatchSize: 2,
          MinInstancesInService: 1,
          MinSuccessfulInstancesPercent: 75,
          MinActiveInstancesPercent: 50,
          PauseTime: 'PT5M',
          SuspendProcesses: ['HealthCheck', 'ReplaceUnhealthy'],
          WaitOnResourceSignals: true,
        },
      },
    };

    // Call handleAttributes to process the resource attributes
    parser.handleAttributes(cfnResource, resourceAttributes, 'TestResource');

    // Verify the update policy was correctly parsed
    expect(cfnResource.cfnOptions.updatePolicy).toBeDefined();
    expect(cfnResource.cfnOptions.updatePolicy?.autoScalingRollingUpdate).toBeDefined();

    const rollingUpdate = cfnResource.cfnOptions.updatePolicy?.autoScalingRollingUpdate;
    expect(rollingUpdate?.maxBatchSize).toBe(2);
    expect(rollingUpdate?.minInstancesInService).toBe(1);
    expect(rollingUpdate?.minSuccessfulInstancesPercent).toBe(75);
    expect(rollingUpdate?.minActiveInstancesPercent).toBe(50);
    expect(rollingUpdate?.pauseTime).toBe('PT5M');
    expect(rollingUpdate?.suspendProcesses).toEqual(['HealthCheck', 'ReplaceUnhealthy']);
    expect(rollingUpdate?.waitOnResourceSignals).toBe(true);
  });

  test('handleAttributes correctly parses AutoScalingRollingUpdate without MinActiveInstancesPercent', () => {
    // Create a CfnResource to test with
    const cfnResource = new CfnResource(stack, 'TestResource', {
      type: 'AWS::AutoScaling::AutoScalingGroup',
      properties: {
        MinSize: '1',
        MaxSize: '10',
        DesiredCapacity: '2',
      },
    });

    // Create resource attributes with UpdatePolicy containing AutoScalingRollingUpdate
    // but without MinActiveInstancesPercent
    const resourceAttributes = {
      UpdatePolicy: {
        AutoScalingRollingUpdate: {
          MaxBatchSize: 2,
          MinInstancesInService: 1,
          MinSuccessfulInstancesPercent: 75,
          PauseTime: 'PT5M',
          SuspendProcesses: ['HealthCheck', 'ReplaceUnhealthy'],
          WaitOnResourceSignals: true,
        },
      },
    };

    // Call handleAttributes to process the resource attributes
    parser.handleAttributes(cfnResource, resourceAttributes, 'TestResource');

    // Verify the update policy was correctly parsed
    expect(cfnResource.cfnOptions.updatePolicy).toBeDefined();
    expect(cfnResource.cfnOptions.updatePolicy?.autoScalingRollingUpdate).toBeDefined();

    const rollingUpdate = cfnResource.cfnOptions.updatePolicy?.autoScalingRollingUpdate;
    expect(rollingUpdate?.maxBatchSize).toBe(2);
    expect(rollingUpdate?.minInstancesInService).toBe(1);
    expect(rollingUpdate?.minSuccessfulInstancesPercent).toBe(75);
    expect(rollingUpdate?.minActiveInstancesPercent).toBeUndefined();
    expect(rollingUpdate?.pauseTime).toBe('PT5M');
    expect(rollingUpdate?.suspendProcesses).toEqual(['HealthCheck', 'ReplaceUnhealthy']);
    expect(rollingUpdate?.waitOnResourceSignals).toBe(true);
  });
});
