import { handler, OnEventRequest, OnEventResponse } from '../lib/on-event';
import *  as lambdaTester from 'lambda-tester';
import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';

AWSMock.setSDKInstance(AWS);

function awsMock<OutputType, C extends AWSMock.ClientName, M extends AWSMock.MethodName<C>>(service: C, method: M, result: OutputType | Error) {
  const mock = jest.fn(
    (
      _params: {[key: string]: string}, 
      callback: (error?: AWS.AWSError, response?: OutputType) => undefined,
    ) => {
      if (result instanceof Error) {
        callback(result as AWS.AWSError);
      } else {
        callback(undefined, result);
      }
    }
  );
  AWSMock.mock(service, method, mock);
  return mock;
}

describe('onEvent', () => {
  afterEach(() => {
    AWSMock.restore();
  });

  test('Empty event payload fails', () => {
    return lambdaTester(handler)
      .event({} as OnEventRequest)
      .expectError((err: Error) => {
        expect(err.message).toBe('Unknown request type: undefined');
      });
  });

  test('Create deployment succeeds', () => {
    const codeDeployMock = awsMock('CodeDeploy', 'createDeployment', {
      deploymentId: '1111111',
    });

    return lambdaTester(handler)
      .event({
        RequestType: 'Create',
        ResourceProperties: {
          applicationName: 'testapp',
          deploymentConfigName: 'testdeployconfig',
          deploymentGroupName: 'testdeploygroup',
          autoRollbackConfigurationEnabled: 'true',
          autoRollbackConfigurationEvents: 'event1,event2',
          description: 'testing',
          revisionAppSpecContent: 'appspec-goes-here',
        },
      } as OnEventRequest)
      .expectResolve((resp: OnEventResponse) => {
        expect(codeDeployMock).toHaveBeenCalledTimes(1);
        expect(codeDeployMock).toHaveBeenCalledWith({
          applicationName: 'testapp',
          deploymentConfigName: 'testdeployconfig',
          deploymentGroupName: 'testdeploygroup',
          autoRollbackConfiguration: {
            enabled: true,
            events: ['event1','event2'],
          },
          description: 'testing',
          revision: {
            revisionType: 'AppSpecContent',
            appSpecContent: {
              content: 'appspec-goes-here',
            },
          },
        }, expect.any(Function));
        expect(resp.PhysicalResourceId).toBe('1111111');
        expect(resp.Data?.deploymentId).toBe('1111111');
      });
  });

  test('Create deployment fails', () => {
    const codeDeployMock = awsMock('CodeDeploy', 'createDeployment', {});

    return lambdaTester(handler)
      .event({
        RequestType: 'Create',
        ResourceProperties: {
          applicationName: 'testapp',
          deploymentConfigName: 'testdeployconfig',
          deploymentGroupName: 'testdeploygroup',
          autoRollbackConfigurationEnabled: 'true',
          autoRollbackConfigurationEvents: 'event1,event2',
          description: 'testing',
          revisionAppSpecContent: 'appspec-goes-here',
        },
      } as OnEventRequest)
      .expectReject((error: Error) => {
        expect(codeDeployMock).toHaveBeenCalledTimes(1);
        expect(error.message).toBe('No deploymentId received from call to CreateDeployment');
      });
  });

  test('Update deployment succeeds', () => {
    const codeDeployMock = awsMock('CodeDeploy', 'createDeployment', {
      deploymentId: '1111111',
    });

    return lambdaTester(handler)
      .event({
        RequestType: 'Update',
        ResourceProperties: {
          applicationName: 'testapp',
          deploymentConfigName: 'testdeployconfig',
          deploymentGroupName: 'testdeploygroup',
          description: 'testing',
          revisionAppSpecContent: 'appspec-goes-here',
        },
      } as OnEventRequest)
      .expectResolve((resp: OnEventResponse) => {
        expect(codeDeployMock).toHaveBeenCalledTimes(1);
        expect(codeDeployMock).toHaveBeenCalledWith({
          applicationName: 'testapp',
          deploymentConfigName: 'testdeployconfig',
          deploymentGroupName: 'testdeploygroup',
          autoRollbackConfiguration: {
            enabled: false,
            events: undefined,
          },
          description: 'testing',
          revision: {
            revisionType: 'AppSpecContent',
            appSpecContent: {
              content: 'appspec-goes-here',
            },
          },
        }, expect.any(Function));
        expect(resp.PhysicalResourceId).toBe('1111111');
        expect(resp.Data?.deploymentId).toBe('1111111');
      });
  });

  test('Delete deployment successfully stops', () => {
    const codeDeployMock = awsMock('CodeDeploy', 'stopDeployment', {
      status: 'ok',
      statusMessage: 'successfully stopped',
    });

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '22222222',
      } as OnEventRequest)
      .expectResolve((resp: OnEventResponse) => {
        expect(codeDeployMock).toHaveBeenCalledTimes(1);
        expect(codeDeployMock).toHaveBeenCalledWith({
          deploymentId: '22222222',
          autoRollbackEnabled: true,
        }, expect.any(Function));
        expect(resp).toEqual({
          PhysicalResourceId: '22222222',
          Data: {
            deploymentId: '22222222',
          }
        });
      });
  });

  test('Delete deployment fails to stop', () => {
    const codeDeployMock = awsMock('CodeDeploy', 'stopDeployment', new Error("Unable to stop"));

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '22222222',
      } as OnEventRequest)
      .expectResolve((resp: OnEventResponse) => {
        expect(codeDeployMock).toHaveBeenCalledTimes(1);
        expect(codeDeployMock).toHaveBeenCalledWith({
          deploymentId: '22222222',
          autoRollbackEnabled: true,
        }, expect.any(Function));
        expect(resp).toEqual({
          PhysicalResourceId: '22222222',
          Data: {
            deploymentId: '22222222',
          }
        });
      });
  });
});
