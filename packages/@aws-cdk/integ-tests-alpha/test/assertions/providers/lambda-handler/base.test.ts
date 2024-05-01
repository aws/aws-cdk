import { isDeepStrictEqual } from 'util';
import * as nock from 'nock';
import { handler as lambda_handler, isComplete, onTimeout } from '../../../../lib/assertions/providers/lambda-handler';
import { CustomResourceHandler } from '../../../../lib/assertions/providers/lambda-handler/base';
import { mockClient } from 'aws-sdk-client-mock';
import { ListBucketsCommand, ListBucketsOutput, S3Client } from '@aws-sdk/client-s3';
import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';
import 'aws-sdk-client-mock-jest';

interface MyHandlerRequest {
  readonly input: string;
}

interface MyHandlerResponse {
  readonly apiCallResponse: any;
}

interface CloudFormationResponse extends Omit<AWSLambda.CloudFormationCustomResourceResponse, 'Data'> {
  readonly Data: any;
}

const s3Mock = mockClient(S3Client);
const sfnMock = mockClient(SFNClient);
describe('CustomResourceHandler', () => {
  beforeEach(() => {
    s3Mock.on(ListBucketsCommand).resolves({
      Buckets: [{
        Name: 'somebucket',
      }],
    } as ListBucketsOutput);
    sfnMock.on(StartExecutionCommand).resolves({});
    jest.spyOn(console, 'log').mockImplementation(() => { return true; });
    jest.spyOn(console, 'info').mockImplementation(() => { return true; });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    nock.cleanAll();
    s3Mock.reset();
    sfnMock.reset();
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

      expect(sfnMock).toHaveReceivedCommandTimes(StartExecutionCommand, 1);
      expect(s3Mock).toHaveReceivedCommandTimes(ListBucketsCommand, 0);

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

      expect(s3Mock).toHaveReceivedCommandTimes(ListBucketsCommand, 1);
      expect(sfnMock).toHaveReceivedCommandTimes(StartExecutionCommand, 0);

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

      expect(s3Mock).toHaveReceivedCommandTimes(ListBucketsCommand, 1);
      expect(sfnMock).toHaveReceivedCommandTimes(StartExecutionCommand, 0);

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

      expect(s3Mock).toHaveReceivedCommandTimes(ListBucketsCommand, 1);
      expect(sfnMock).toHaveReceivedCommandTimes(StartExecutionCommand, 0);

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

      expect(s3Mock).toHaveReceivedCommandTimes(ListBucketsCommand, 1);

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

      expect(s3Mock).toHaveReceivedCommandTimes(ListBucketsCommand, 1);

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

      expect(s3Mock).toHaveReceivedCommandTimes(ListBucketsCommand, 1);
      expect(sfnMock).toHaveReceivedCommandTimes(StartExecutionCommand, 0);

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

function nockUp(_predicate: (body: CloudFormationResponse) => boolean) {
  return nock('https://someurl.com')
    .put('/')
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
