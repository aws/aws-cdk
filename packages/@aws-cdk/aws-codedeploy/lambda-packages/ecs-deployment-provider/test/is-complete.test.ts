import 'aws-sdk-client-mock-jest';
import { handler, IsCompleteRequest, IsCompleteResponse } from '../lib/is-complete';
import *  as lambdaTester from 'lambda-tester';
import { mockClient } from "aws-sdk-client-mock";
import { CodeDeploy, DeploymentStatus, GetDeploymentCommand } from '@aws-sdk/client-codedeploy';


const codeDeployMock = mockClient(CodeDeploy);

describe('isComplete', () => {
  beforeEach(() => {
    codeDeployMock.reset();
  });

  test('Empty event payload fails', () => {
    return lambdaTester(handler)
      .event({} as IsCompleteRequest)
      .expectError((err: Error) => {
        expect(err.message).toBe("Cannot read properties of undefined (reading 'deploymentInfo')");
      });
  });
  test('Unknown event type fails', () => {
    codeDeployMock.on(GetDeploymentCommand).resolves({
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
    codeDeployMock.on(GetDeploymentCommand).rejects('Unable to find deployment');

    return lambdaTester(handler)
      .event({
        RequestType: 'Create',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectReject((error: Error) => {
        expect(codeDeployMock).toHaveReceivedCommandTimes(GetDeploymentCommand, 1);
        expect(codeDeployMock).toHaveReceivedCommandWith(GetDeploymentCommand, {
          deploymentId: '11111111',
        });
        expect(error.message).toEqual("Unable to find deployment");
      });
  });
  test('Ignores error finding deploymentId for Delete', () => {
    codeDeployMock.on(GetDeploymentCommand).rejects('Unable to find deployment');

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(codeDeployMock).toHaveReceivedCommandTimes(GetDeploymentCommand, 1);
        expect(codeDeployMock).toHaveReceivedCommandWith(GetDeploymentCommand, {
          deploymentId: '11111111',
        });
        expect(resp).toEqual({ IsComplete: true});
      });
  });
  test('Is complete when create deployment succeeds', () => {
    codeDeployMock.on(GetDeploymentCommand).resolves({
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
        expect(codeDeployMock).toHaveReceivedCommandTimes(GetDeploymentCommand, 1);
        expect(codeDeployMock).toHaveReceivedCommandWith(GetDeploymentCommand, {
          deploymentId: '11111111',
        });
        expect(resp).toEqual({ IsComplete: true});
      });
  });
  test('Is not complete when create deployment in progress', () => {
    codeDeployMock.on(GetDeploymentCommand).resolves({
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
        expect(codeDeployMock).toHaveReceivedCommandTimes(GetDeploymentCommand, 1);
        expect(codeDeployMock).toHaveReceivedCommandWith(GetDeploymentCommand, {
          deploymentId: '11111111',
        });
        expect(resp).toEqual({ IsComplete: false});
      });
  });
  test('Is not complete when create deployment failed and rollback in progress', () => {
    codeDeployMock.on(GetDeploymentCommand, { deploymentId: '11111111' }).resolves({
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
    });
    codeDeployMock.on(GetDeploymentCommand, { deploymentId: '22222222' }).resolves({
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
        expect(codeDeployMock).toHaveReceivedCommandTimes(GetDeploymentCommand, 2);
        expect(resp.IsComplete).toBe(false);
      });
  });
  test('Throws error when create deployment failed and rollback failed', () => {
    codeDeployMock.on(GetDeploymentCommand, { deploymentId: '11111111' }).resolves({
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
    });
    codeDeployMock.on(GetDeploymentCommand, { deploymentId: '22222222' }).resolves({
      deploymentInfo: {
        status: DeploymentStatus.FAILED,
      }
    });

    return lambdaTester(handler)
      .event({
        RequestType: 'Create',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectReject((error: Error) => {
        expect(codeDeployMock).toHaveReceivedCommandTimes(GetDeploymentCommand, 2);
        expect(error.message).toEqual('Deployment Failed: [xxx] failure occurred');
      });
  });
  test('Throws error when create deployment failed and no rollback found', () => {
    codeDeployMock.on(GetDeploymentCommand, { deploymentId: '11111111' }).resolves({
      deploymentInfo: {
        status: DeploymentStatus.FAILED,
        errorInformation: {
          code: 'xxx',
          message: 'failure occurred',
        }
      }
    });

    return lambdaTester(handler)
      .event({
        RequestType: 'Create',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectReject((error: Error) => {
        expect(codeDeployMock).toHaveReceivedCommandTimes(GetDeploymentCommand, 1);
        expect(error.message).toEqual('Deployment Failed: [xxx] failure occurred');
      });
  });
  test('Is complete when delete deployment succeeds', () => {
    codeDeployMock.on(GetDeploymentCommand, {deploymentId: '11111111'}).resolves({
      deploymentInfo: {
        status: DeploymentStatus.SUCCEEDED,
      }
    });

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(codeDeployMock).toHaveReceivedCommandTimes(GetDeploymentCommand, 1);
        expect(resp).toEqual({ IsComplete: true});
      });
  });
  test('Is not complete when delete deployment in progress', () => {
    codeDeployMock.on(GetDeploymentCommand, {deploymentId: '11111111'}).resolves({
      deploymentInfo: {
        status: DeploymentStatus.IN_PROGRESS,
      }
    });

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(codeDeployMock).toHaveReceivedCommandTimes(GetDeploymentCommand, 1);
        expect(resp).toEqual({ IsComplete: false});
      });
  });
  test('Is complete when delete deployment failed with final rollback status', () => {
    codeDeployMock.on(GetDeploymentCommand, { deploymentId: '11111111' }).resolves({
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
    });
    codeDeployMock.on(GetDeploymentCommand, { deploymentId: '22222222' }).resolves({
      deploymentInfo: {
        status: DeploymentStatus.FAILED,
      }
    });

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(codeDeployMock).toHaveReceivedCommandTimes(GetDeploymentCommand, 2);
        expect(resp).toEqual({ IsComplete: true});
      });
  });
  test('Is complete when delete deployment failed with no rollback', () => {
    codeDeployMock.on(GetDeploymentCommand, { deploymentId: '11111111' }).resolves({
      deploymentInfo: {
        status: DeploymentStatus.FAILED,
        errorInformation: {
          code: 'xxx',
          message: 'failure occurred',
        }
      }
    });

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(codeDeployMock).toHaveReceivedCommandTimes(GetDeploymentCommand, 1);
        expect(resp).toEqual({ IsComplete: true});
      });
  });
  test('Is not complete when delete deployment failed with rollback in progress', () => {
    codeDeployMock.on(GetDeploymentCommand, { deploymentId: '11111111' }).resolves({
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
    });
    codeDeployMock.on(GetDeploymentCommand, { deploymentId: '22222222' }).resolves({
      deploymentInfo: {
        status: DeploymentStatus.IN_PROGRESS,
      }
    });

    return lambdaTester(handler)
      .event({
        RequestType: 'Delete',
        PhysicalResourceId: '11111111',
      } as IsCompleteRequest)
      .expectResolve((resp: IsCompleteResponse) => {
        expect(codeDeployMock).toHaveReceivedCommandTimes(GetDeploymentCommand, 2);
        expect(resp).toEqual({ IsComplete: false});
      });
  });

});
