import * as lambdaTester from 'lambda-tester';
import * as AWSMock from 'aws-sdk-mock';
import * as AWS from 'aws-sdk';
import { handler, IsCompleteRequest, IsCompleteResponse, DeploymentStatus } from '../lib/is-complete';
import { GetDeploymentInput, GetDeploymentOutput } from 'aws-sdk/clients/codedeploy';

AWSMock.setSDKInstance(AWS);

class GetDeploymentMockBuilder {
  defaultResult: GetDeploymentOutput | Error;
  results: { [id: string]: (GetDeploymentOutput | Error)};
  constructor(defaultResult?: GetDeploymentOutput | Error) {
    this.defaultResult = defaultResult || new Error('Undeclared mock condition');
    this.results = {};
  }
  withResult(deploymentId: string, result: GetDeploymentOutput | Error) {
    this.results[deploymentId] = result;
    return this;
  }
  getResult(deploymentId: string): GetDeploymentOutput | Error {
    if (deploymentId in this.results) {
      return this.results[deploymentId];
    }
    return this.defaultResult;
  }
  build() {
    const mock = jest.fn(
      (
        params: GetDeploymentInput, 
        callback: (error?: AWS.AWSError, response?: GetDeploymentOutput) => undefined,
      ) => {
        const result = this.getResult(params.deploymentId);
        if (result instanceof Error) {
          callback(result as AWS.AWSError);
        } else {
          callback(undefined, result);
        }
      }
    );
    AWSMock.mock('CodeDeploy', 'getDeployment', mock);
    return mock;
  }

  static alwaysError(error: Error) {
    return new GetDeploymentMockBuilder(error).build();
  }
  static alwaysOutput(output: GetDeploymentOutput) {
    return new GetDeploymentMockBuilder(output).build();
  }
}

describe('isComplete', () => {
  afterEach(() => {
    AWSMock.restore();
  });
  test('Empty event payload fails', ()=> {
    GetDeploymentMockBuilder.alwaysError(new Error());
    return lambdaTester(handler)
      .event({} as IsCompleteRequest)
      .expectError((err: Error) => {
        expect(err.message).toBeDefined();
      });
  });
  test('Unknown event type fails', () => {
    GetDeploymentMockBuilder.alwaysOutput({
      deploymentInfo: {
        status: DeploymentStatus.SUCCEEDED,
      }
    });
    return lambdaTester(handler)
      .event({
        RequestType: 'FOO',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectError((err: Error) => {
        expect(err.message).toBe("Unknown request type: FOO");
      });
  });

  test('Throws error finding deploymentId for Create', () => {
    const getDeploymentMock = GetDeploymentMockBuilder.alwaysError(new Error('Unable to find deployment'));

    return lambdaTester(handler)
      .event({
        RequestType: 'Create',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectReject((error: Error) => {
        expect(getDeploymentMock).toHaveBeenCalledTimes(1);
        expect(getDeploymentMock).toHaveBeenCalledWith({
          deploymentId: '11111111',
        }, expect.any(Function));
        expect(error.message).toEqual("Unable to find deployment");
      });
  });

  test('Ignores error finding deploymentId for Delete', () => {
    const getDeploymentMock = GetDeploymentMockBuilder.alwaysError(new Error('Unable to find deployment'));

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(getDeploymentMock).toHaveBeenCalledTimes(1);
        expect(getDeploymentMock).toHaveBeenCalledWith({
          deploymentId: '11111111',
        }, expect.any(Function));
        expect(resp).toEqual({ IsComplete: true});
      });
  });
  test('Is complete when create deployment succeeds', () => {
    const getDeploymentMock = GetDeploymentMockBuilder.alwaysOutput({
      deploymentInfo: {
        status: DeploymentStatus.SUCCEEDED,
      }
    });

    return lambdaTester(handler)
      .event({
        RequestType: 'Create',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(getDeploymentMock).toHaveBeenCalledTimes(1);
        expect(getDeploymentMock).toHaveBeenCalledWith({
          deploymentId: '11111111',
        }, expect.any(Function));
        expect(resp).toEqual({ IsComplete: true});
      });
  });
  test('Is not complete when create deployment in progress', () => {
    const getDeploymentMock = GetDeploymentMockBuilder.alwaysOutput({
      deploymentInfo: {
        status: DeploymentStatus.IN_PROGRESS,
      }
    });

    return lambdaTester(handler)
      .event({
        RequestType: 'Create',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(getDeploymentMock).toHaveBeenCalledTimes(1);
        expect(getDeploymentMock).toHaveBeenCalledWith({
          deploymentId: '11111111',
        }, expect.any(Function));
        expect(resp).toEqual({ IsComplete: false});
      });
  });
  test('Is not complete when create deployment failed and rollback in progress', () => {
    const getDeploymentMock = new GetDeploymentMockBuilder()
      .withResult('11111111', {
        deploymentInfo: {
          status: DeploymentStatus.FAILED,
          rollbackInfo: {
            rollbackDeploymentId: '22222222',
          },
          errorInformation: {
            code: 'xxx',
            message: 'failure occurred',
          }
        }
      }).withResult('22222222', {
        deploymentInfo: {
          status: DeploymentStatus.IN_PROGRESS,
        }
      }).build();

    return lambdaTester(handler)
      .event({
        RequestType: 'Create',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(getDeploymentMock).toHaveBeenCalledTimes(2);
        expect(resp.IsComplete).toBe(false);
      });
  });
  test('Throws error when create deployment failed and rollback failed', () => {
    const getDeploymentMock = new GetDeploymentMockBuilder()
      .withResult('11111111', {
        deploymentInfo: {
          status: DeploymentStatus.FAILED,
          rollbackInfo: {
            rollbackDeploymentId: '22222222',
          },
          errorInformation: {
            code: 'xxx',
            message: 'failure occurred',
          }
        }
      }).withResult('22222222', {
        deploymentInfo: {
          status: DeploymentStatus.FAILED,
        }
      }).build();

    return lambdaTester(handler)
      .event({
        RequestType: 'Create',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectReject((error: Error) => {
        expect(getDeploymentMock).toHaveBeenCalledTimes(2);
        expect(error.message).toEqual('Deployment Failed: [xxx] failure occurred');
      });
  });
  test('Throws error when create deployment failed and no rollback found', () => {
    const getDeploymentMock = new GetDeploymentMockBuilder()
      .withResult('11111111', {
        deploymentInfo: {
          status: DeploymentStatus.FAILED,
          errorInformation: {
            code: 'xxx',
            message: 'failure occurred',
          }
        }
      }).build();

    return lambdaTester(handler)
      .event({
        RequestType: 'Create',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectReject((error: Error) => {
        expect(getDeploymentMock).toHaveBeenCalledTimes(1);
        expect(error.message).toEqual('Deployment Failed: [xxx] failure occurred');
      });
  });
  test('Is complete when delete deployment succeeds', () => {
    const getDeploymentMock = new GetDeploymentMockBuilder()
      .withResult('11111111', {
        deploymentInfo: {
          status: DeploymentStatus.SUCCEEDED,
        }
      }).build();

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(getDeploymentMock).toHaveBeenCalledTimes(1);
        expect(resp).toEqual({ IsComplete: true});
      });
  });
  test('Is not complete when delete deployment in progress', () => {
    const getDeploymentMock = new GetDeploymentMockBuilder()
      .withResult('11111111', {
        deploymentInfo: {
          status: DeploymentStatus.IN_PROGRESS,
        }
      }).build();

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(getDeploymentMock).toHaveBeenCalledTimes(1);
        expect(resp).toEqual({ IsComplete: false});
      });
  });
  test('Is complete when delete deployment failed with final rollback status', () => {
    const getDeploymentMock = new GetDeploymentMockBuilder()
    .withResult('11111111', {
      deploymentInfo: {
        status: DeploymentStatus.FAILED,
        rollbackInfo: {
          rollbackDeploymentId: '22222222',
        },
        errorInformation: {
          code: 'xxx',
          message: 'failure occurred',
        }
      }
    }).withResult('22222222', {
      deploymentInfo: {
        status: DeploymentStatus.FAILED,
      }
    }).build();

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(getDeploymentMock).toHaveBeenCalledTimes(2);
        expect(resp).toEqual({ IsComplete: true});
      });
  });
  test('Is complete when delete deployment failed with no rollback', () => {
    const getDeploymentMock = new GetDeploymentMockBuilder()
      .withResult('11111111', {
        deploymentInfo: {
          status: DeploymentStatus.FAILED,
          errorInformation: {
            code: 'xxx',
            message: 'failure occurred',
          }
        }
      }).build();

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(getDeploymentMock).toHaveBeenCalledTimes(1);
        expect(resp).toEqual({ IsComplete: true});
      });
  });
  test('Is not complete when delete deployment failed with rollback in progress', () => {
    const getDeploymentMock = new GetDeploymentMockBuilder()
    .withResult('11111111', {
      deploymentInfo: {
        status: DeploymentStatus.FAILED,
        rollbackInfo: {
          rollbackDeploymentId: '22222222',
        },
        errorInformation: {
          code: 'xxx',
          message: 'failure occurred',
        }
      }
    }).withResult('22222222', {
      deploymentInfo: {
        status: DeploymentStatus.IN_PROGRESS,
      }
    }).build();

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(getDeploymentMock).toHaveBeenCalledTimes(2);
        expect(resp).toEqual({ IsComplete: false});
      });
  });

});
