// Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
import * as SDK from 'aws-sdk';
import * as AWS from 'aws-sdk-mock';
import * as sinon from 'sinon';
import { SdkRequest, SdkResult } from '../../../../lib/assertions';
import { SdkHandler } from '../../../../lib/assertions/providers/lambda-handler/sdk';

function sdkHandler() {
  const context: any = {
    getRemainingTimeInMillis: () => 50000,
  };
  return new SdkHandler({} as any, context); // as any to ignore all type checks
}
beforeAll(() => {
  jest.useFakeTimers();
  jest.spyOn(console, 'log').mockImplementation(() => { return true; });
});
afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('SdkHandler', () => {
  beforeEach(() => {
    AWS.setSDKInstance(SDK);
  });

  afterEach(() => {
    AWS.restore();
  });

  test('default', async () => {
    // GIVEN
    const expectedResponse = {
      Contents: [
        {
          Key: 'first-key',
          ETag: 'first-key-etag',
        },
        {
          Key: 'second-key',
          ETag: 'second-key-etag',
        },
      ],
    } as SDK.S3.ListObjectsOutput;
    AWS.mock('S3', 'listObjects', sinon.fake.resolves(expectedResponse));
    const handler = sdkHandler() as any;
    const request: SdkRequest = {
      service: 'S3',
      api: 'listObjects',
      parameters: {
        Bucket: 'myBucket',
      },
    };

    // WHEN
    const response: SdkResult = await handler.processEvent(request);


    // THEN
    expect(response.apiCallResponse).toEqual(expectedResponse);
  });

  describe('decode', () => {
    test('boolean true', async () => {
      // GIVEN
      const fake = sinon.fake.resolves({});
      AWS.mock('EC2', 'describeInstances', fake);
      const handler = sdkHandler() as any;
      const request: SdkRequest = {
        service: 'EC2',
        api: 'describeInstances',
        parameters: {
          DryRun: 'TRUE:BOOLEAN',
        },
      };

      // WHEN
      await handler.processEvent(request);


      // THEN
      sinon.assert.calledWith(fake, { DryRun: true });
    });

    test('boolean false', async () => {
      // GIVEN
      const fake = sinon.fake.resolves({});
      AWS.mock('EC2', 'describeInstances', fake);
      const handler = sdkHandler() as any;
      const request: SdkRequest = {
        service: 'EC2',
        api: 'describeInstances',
        parameters: {
          DryRun: 'FALSE:BOOLEAN',
        },
      };

      // WHEN
      await handler.processEvent(request);


      // THEN
      sinon.assert.calledWith(fake, { DryRun: false });
    });
  });
});
