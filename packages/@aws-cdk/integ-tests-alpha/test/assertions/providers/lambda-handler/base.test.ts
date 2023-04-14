import { isDeepStrictEqual } from 'util';
import * as SDK from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import * as nock from 'nock';
import * as sinon from 'sinon';
import { handler as lambda_handler, isComplete, onTimeout } from '../../../../lib/assertions/providers/lambda-handler';
import { CustomResourceHandler } from '../../../../lib/assertions/providers/lambda-handler/base';

interface MyHandlerRequest {
  readonly input: string;
}

interface MyHandlerResponse {
  readonly apiCallResponse: any;
}

interface CloudFormationResponse extends Omit<AWSLambda.CloudFormationCustomResourceResponse, 'Data'> {
  readonly Data: any;
}


let mockMyApi: sinon.SinonSpy;
let mockStartExecution: sinon.SinonSpy;
describe('CustomResourceHandler', () => {
  beforeEach(() => {
    AWS.setSDK(require.resolve('aws-sdk'));
    mockMyApi = sinon.fake.resolves({
      Buckets: [{
        Name: 'somebucket',
      }],
    } as SDK.S3.ListBucketsOutput);
    mockStartExecution = sinon.fake.resolves({});
    AWS.mock('S3', 'listBuckets', mockMyApi);
    AWS.mock('StepFunctions', 'startExecution', mockStartExecution);
    jest.spyOn(console, 'log').mockImplementation(() => { return true; });
    jest.spyOn(console, 'info').mockImplementation(() => { return true; });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    nock.cleanAll();
    AWS.restore();
  });

  describe('lambda handler', () => {
    test('create async request', async () => {
      const nocked = nockUp((body) => {
        return body.Status === 'SUCCESS'
        && body.Reason === 'OK'
        && isDeepStrictEqual(body.Data, {})
        && body.StackId === 'MyStackId'
        && body.RequestId === 'MyRequestId'
        && body.NoEcho === false;
      });
      const event = createEvent({
        stateMachineArn: 'arn',
        service: 'MyService',
        api: 'myApi',
      }, 'Custom::DeployAssert@SdkCall');
      await lambda_handler(event, standardContext);

      sinon.assert.calledOnce(mockStartExecution);
      sinon.assert.notCalled(mockMyApi);

      // THEN
      // started async workflow so no response to CFN
      expect(nocked.isDone()).toEqual(false);
    });

    test('create sync request', async () => {
      const nocked = nockUp((body) => {
        return body.Status === 'SUCCESS'
        && body.Reason === 'OK'
        && body.Data.apiCallResponse.Buckets[0].Name === 'somebucket'
        && body.StackId === 'MyStackId'
        && body.RequestId === 'MyRequestId'
        && body.NoEcho === false;
      });
      const event = createEvent({
        service: 'S3',
        api: 'listBuckets',
      }, 'Custom::DeployAssert@SdkCall');
      await lambda_handler(event, standardContext);

      sinon.assert.calledOnce(mockMyApi);
      sinon.assert.notCalled(mockStartExecution);

      // THEN
      expect(nocked.isDone()).toEqual(true);
    });

    test('create request with assertions', async () => {
      const nocked = nockUp((body) => {
        return body.Status === 'SUCCESS'
        && body.Reason === 'OK'
        && body.Data.assertion === '{"status":"success"}'
        && body.Data.apiCallResponse.Buckets[0].Name === 'somebucket'
        && body.StackId === 'MyStackId'
        && body.RequestId === 'MyRequestId'
        && body.NoEcho === false;
      });
      const event = createEvent({
        service: 'S3',
        api: 'listBuckets',
        expected: JSON.stringify({ $ObjectLike: { Buckets: [{ Name: 'somebucket' }] } }),
      }, 'Custom::DeployAssert@SdkCall');
      await lambda_handler(event, standardContext);

      sinon.assert.calledOnce(mockMyApi);
      sinon.assert.notCalled(mockStartExecution);

      // THEN
      expect(nocked.isDone()).toEqual(true);
    });

    test('create request with assertions fails', async () => {
      const nocked = nockUp((body) => {
        return body.Status === 'FAILED'
        && (body.Reason?.match(/Expected someotherbucket/) ?? []).length === 1;
      });
      const event = createEvent({
        service: 'S3',
        api: 'listBuckets',
        expected: JSON.stringify({ $ObjectLike: { Buckets: [{ Name: 'someotherbucket' }] } }),
      }, 'Custom::DeployAssert@SdkCall');
      await lambda_handler(event, standardContext);

      sinon.assert.calledOnce(mockMyApi);
      sinon.assert.notCalled(mockStartExecution);

      // THEN
      expect(nocked.isDone()).toEqual(true);
    });
  });

  describe('lambda isCompleteHandler', () => {
    test('basic', async () => {
      const nocked = nockUp((body) => {
        return body.Status === 'SUCCESS'
        && body.Reason === 'OK'
        && 'apiCallResponse' in body.Data
        && body.StackId === 'MyStackId'
        && body.RequestId === 'MyRequestId'
        && body.NoEcho === false;
      });
      const event = createEvent({
        stateMachineArn: 'arn',
        service: 'S3',
        api: 'listBuckets',
      }, 'Custom::DeployAssert@SdkCall');
      await isComplete(event, standardContext);

      sinon.assert.calledOnce(mockMyApi);

      // THEN
      expect(nocked.isDone()).toEqual(true);
    });

    test('create request with assertions', async () => {
      const nocked = nockUp((body) => {
        return body.Status === 'SUCCESS'
        && body.Reason === 'OK'
        && body.Data.assertion === '{"status":"success"}'
        && body.StackId === 'MyStackId'
        && body.RequestId === 'MyRequestId'
        && body.NoEcho === false;
      });
      const event = createEvent({
        service: 'S3',
        api: 'listBuckets',
        expected: JSON.stringify({ $ObjectLike: { Buckets: [{ Name: 'somebucket' }] } }),
      }, 'Custom::DeployAssert@SdkCall');
      await isComplete(event, standardContext);

      sinon.assert.calledOnce(mockMyApi);

      // THEN
      expect(nocked.isDone()).toEqual(true);
    });

    test('create request with assertions fails', async () => {
      const nocked = nockUp((body) => {
        return body.Status === 'FAILED'
        && (body.Reason?.match(/Expected someotherbucket/) ?? []).length === 1;
      });
      const event = createEvent({
        service: 'S3',
        api: 'listBuckets',
        expected: JSON.stringify({ $ObjectLike: { Buckets: [{ Name: 'someotherbucket' }] } }),
      }, 'Custom::DeployAssert@SdkCall');
      await expect(isComplete(event, standardContext)).rejects.toThrow();

      sinon.assert.calledOnce(mockMyApi);
      sinon.assert.notCalled(mockStartExecution);

      // THEN
      expect(nocked.isDone()).toEqual(false);
    });
  });

  describe('onTimeout', () => {
    test('timeout', async () => {
      const nocked = nockUp((body) => {
        return body.Status === 'FAILED'
        && (body.Reason?.match(/Operation timed out/) ?? []).length === 1;
      });
      await onTimeout({
        Cause: JSON.stringify({
          errorMessage: JSON.stringify(createEvent({
            service: 'S3',
            api: 'listBuckets',
          }, 'Custom::DeployAssert@SdkCall')),
        }),
      });
      expect(nocked.isDone()).toEqual(true);
    });
  });

  test('timeout kicks in', async () => {
    // GIVEN
    class MyHandler extends CustomResourceHandler<MyHandlerRequest, MyHandlerResponse> {
      protected async processEvent(_: MyHandlerRequest): Promise<MyHandlerResponse | undefined> {
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
        return new Promise((resolve, _reject) => resolve(undefined));
      }
    }

    const nocked = nockUp((body) => {
      return body.Status === 'FAILED'
      && body.Reason !== undefined
      && /Timeout/.test(body.Reason);
    });

    const handler = new MyHandler(createEvent(), {
      ...standardContext,
      getRemainingTimeInMillis: () => 1300,
    });

    // WHEN
    await handler.handle();

    // THEN
    expect(nocked.isDone()).toEqual(true);
  });
});

function nockUp(predicate: (body: CloudFormationResponse) => boolean) {
  return nock('https://someurl.com')
    .put('/', predicate)
    .reply(200);
}

const standardContext: any = { // keeping this as any so as to not have to fill all the mandatory attributes of AWSLambda.Context
  getRemainingTimeInMillis: () => 5000,
};

function createEvent(data?: any, resourceType: string = 'MyResourceType'): AWSLambda.CloudFormationCustomResourceCreateEvent {
  return {
    LogicalResourceId: 'MyLogicalResourceId',
    RequestId: 'MyRequestId',
    RequestType: 'Create',
    ResourceType: resourceType,
    ResourceProperties: {
      ...data,
      ServiceToken: 'MyServiceToken',
    },
    ResponseURL: 'https://someurl.com',
    ServiceToken: 'MyServiceToken',
    StackId: 'MyStackId',
  };
}
