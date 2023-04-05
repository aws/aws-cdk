import * as assert from 'assert';
import * as fs from 'fs';
import * as https from 'https';
import * as os from 'os';
import * as path from 'path';
import * as url from 'url';
import * as entrypoint from '../../lib/custom-resource-provider/nodejs-entrypoint';

describe('nodejs entrypoint', () => {
  describe('handler return value is sent back to cloudformation as a success response', () => {

    test('physical resource id (ref)', async () => {
      // GIVEN
      const createEvent = makeEvent({ RequestType: 'Create' });

      // WHEN
      const { response } = await invokeHandler(createEvent, async _ => ({ PhysicalResourceId: 'returned-from-handler' }));

      // THEN
      expect(response.Status).toEqual('SUCCESS');
      expect(response.PhysicalResourceId).toEqual('returned-from-handler');
    });

    test('data (attributes)', async () => {
      // GIVEN
      const createEvent = makeEvent({ RequestType: 'Create' });

      // WHEN
      const { response } = await invokeHandler(createEvent, async _ => {
        return {
          Data: {
            Attribute1: 'hello',
            Attribute2: {
              Foo: 1111,
            },
          },
        };
      });

      // THEN
      expect(response.Status).toEqual('SUCCESS');
      expect(response.PhysicalResourceId).toEqual('<RequestId>');
      expect(response.Data).toEqual({
        Attribute1: 'hello',
        Attribute2: {
          Foo: 1111,
        },
      });
    });

    test('no echo', async () => {
      // GIVEN
      const createEvent = makeEvent({ RequestType: 'Create' });

      // WHEN
      const { response } = await invokeHandler(createEvent, async _ => ({ NoEcho: true }));

      // THEN
      expect(response.Status).toEqual('SUCCESS');
      expect(response.NoEcho).toEqual(true);
    });

    test('reason', async () => {
      // GIVEN
      const createEvent = makeEvent({ RequestType: 'Create' });

      // WHEN
      const { response } = await invokeHandler(createEvent, async _ => ({ Reason: 'hello, reason' }));

      // THEN
      expect(response.Status).toEqual('SUCCESS');
      expect(response.Reason).toEqual('hello, reason');
    });

    test('utf8 is supported', async () => {
      // GIVEN
      const createEvent = makeEvent({ RequestType: 'Create' });
      const { request: emptyDataRequest } = await invokeHandler(createEvent, async _ => ({
        Data: {
          Attribute: '', // 0 bytes
        },
      }));

      // WHEN
      const { request: utf8DataRequest } = await invokeHandler(createEvent, async _ => ({
        Data: {
          Attribute: 'ÅÄÖ', // 6 bytes
        },
      }));

      // THEN
      const emptyLength = emptyDataRequest.headers?.['content-length'] as number;
      const utf8Length = utf8DataRequest.headers?.['content-length'] as number;
      expect(utf8Length - emptyLength).toEqual(6);
    });
  });

  test('an error thrown by the handler is sent as a failure response to cloudformation', async () => {
    // GIVEN
    const createEvent = makeEvent({ RequestType: 'Create' });

    // WHEN
    const { response } = await invokeHandler(createEvent, async _ => {
      throw new Error('this is an error');
    });

    // THEN
    expect(response).toEqual({
      Status: 'FAILED',
      Reason: 'this is an error',
      StackId: '<StackId>',
      RequestId: '<RequestId>',
      PhysicalResourceId: 'AWSCDK::CustomResourceProviderFramework::CREATE_FAILED',
      LogicalResourceId: '<LogicalResourceId>',
    });
  });

  test('physical resource id cannot be changed in DELETE', async () => {
    // GIVEN
    const event = makeEvent({ RequestType: 'Delete' });

    // WHEN
    const { response } = await invokeHandler(event, async _ => ({
      PhysicalResourceId: 'Changed',
    }));

    // THEN
    expect(response).toEqual({
      Status: 'FAILED',
      Reason: 'DELETE: cannot change the physical resource ID from "undefined" to "Changed" during deletion',
      StackId: '<StackId>',
      RequestId: '<RequestId>',
      PhysicalResourceId: 'AWSCDK::CustomResourceProviderFramework::MISSING_PHYSICAL_ID',
      LogicalResourceId: '<LogicalResourceId>',
    });
  });

  test('DELETE after CREATE is ignored with success', async () => {
    // GIVEN
    const event = makeEvent({
      RequestType: 'Delete',
      PhysicalResourceId: 'AWSCDK::CustomResourceProviderFramework::CREATE_FAILED',
    });

    // WHEN
    const { response } = await invokeHandler(event, async _ => {
      throw new Error('handler should not be called');
    });

    // THEN
    expect(response).toEqual({
      Status: 'SUCCESS',
      Reason: 'SUCCESS',
      StackId: '<StackId>',
      RequestId: '<RequestId>',
      PhysicalResourceId: 'AWSCDK::CustomResourceProviderFramework::CREATE_FAILED',
      LogicalResourceId: '<LogicalResourceId>',
    });
  });
});

function makeEvent(req: Partial<AWSLambda.CloudFormationCustomResourceEvent>): AWSLambda.CloudFormationCustomResourceEvent {
  return {
    LogicalResourceId: '<LogicalResourceId>',
    RequestId: '<RequestId>',
    ResourceType: '<ResourceType>',
    ResponseURL: '<ResponseURL>',
    ServiceToken: '<ServiceToken>',
    StackId: '<StackId>',
    ResourceProperties: {
      ServiceToken: '<ServiceToken>',
      ...req.ResourceProperties,
    },
    ...req,
  } as any;
}

async function invokeHandler(req: AWSLambda.CloudFormationCustomResourceEvent, userHandler: entrypoint.Handler) {
  const parsedResponseUrl = url.parse(req.ResponseURL);

  // stage entry point and user handler.
  const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-custom-resource-provider-handler-test-'));
  entrypoint.external.userHandlerIndex = path.join(workdir, 'index.js');
  fs.writeFileSync(entrypoint.external.userHandlerIndex, `exports.handler = ${userHandler.toString()};`);

  // do not include stack traces in failure responses so we can assert against them.
  entrypoint.external.includeStackTraces = false;

  // disable logging
  entrypoint.external.log = () => {
    return;
  };

  let actualResponse;
  let actualRequest;
  entrypoint.external.sendHttpRequest = async (options: https.RequestOptions, responseBody: string): Promise<void> => {
    assert(options.hostname === parsedResponseUrl.hostname, 'request hostname expected to be based on response URL');
    assert(options.path === parsedResponseUrl.path, 'request path expected to be based on response URL');
    assert(options.method === 'PUT', 'request method is expected to be PUT');
    actualResponse = responseBody;
    actualRequest = options;
  };

  await entrypoint.handler(req, {} as AWSLambda.Context);
  if (!actualRequest || !actualResponse) {
    throw new Error('no response sent to cloudformation');
  }

  return {
    response: JSON.parse(actualResponse) as AWSLambda.CloudFormationCustomResourceResponse,
    request: actualRequest as https.RequestOptions,
  };
}
