import assert from 'assert';
import * as fs from 'fs';
import type { OutgoingHttpHeaders } from 'http';
import type * as https from 'https';
import * as os from 'os';
import * as path from 'path';
import * as url from 'url';
import * as entrypoint from '../lib/nodejs-entrypoint';

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
      const emptyLength = (emptyDataRequest.headers as OutgoingHttpHeaders)?.['content-length'] as number;
      const utf8Length = (utf8DataRequest.headers as OutgoingHttpHeaders)?.['content-length'] as number;
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

  describe('log redaction', () => {
    const PRESIGNED_URL = 'https://cfn-response.s3.amazonaws.com/path?X-Amz-Signature=PRESIGNED-SECRET';

    test('listed properties are redacted from the logged event, other properties are logged', async () => {
      // GIVEN
      const event = makeEvent({
        RequestType: 'Update',
        PhysicalResourceId: 'phys',
        ResourceProperties: { ServiceToken: '<ServiceToken>', Secret: 'NEW-SECRET', Plain: 'plain-value' },
        OldResourceProperties: { Secret: 'OLD-SECRET', Plain: 'old-plain-value' },
      } as any);

      // WHEN
      const { logs } = await invokeHandler(event, async _ => undefined, { redactProperties: ['Secret'] });

      // THEN
      const logged = logs.join('\n');
      expect(logged).not.toContain('NEW-SECRET');
      expect(logged).not.toContain('OLD-SECRET');
      expect(logged).toContain('plain-value');
      expect(logged).toContain('old-plain-value');
      const loggedEvent = JSON.parse(logs[0]);
      expect(loggedEvent.ResourceProperties).toEqual({ ServiceToken: '<ServiceToken>', Secret: '*****', Plain: 'plain-value' });
      expect(loggedEvent.OldResourceProperties).toEqual({ Secret: '*****', Plain: 'old-plain-value' });
    });

    test('the user handler receives the real property values', async () => {
      // GIVEN
      const event = makeEvent({ RequestType: 'Create', ResourceProperties: { ServiceToken: '<ServiceToken>', Secret: 'REAL-SECRET' } });
      let received: any;

      // WHEN
      await invokeHandler(event, async e => {
        received = e.ResourceProperties;
      }, { redactProperties: ['Secret'] });

      // THEN
      expect(received.Secret).toEqual('REAL-SECRET');
    });

    test('properties that are not present are not added to the logged event', async () => {
      // GIVEN
      const event = makeEvent({ RequestType: 'Create' });

      // WHEN
      const { logs } = await invokeHandler(event, async _ => undefined, { redactProperties: ['Missing'] });

      // THEN
      const loggedEvent = JSON.parse(logs[0]);
      expect(loggedEvent.ResourceProperties).toEqual({ ServiceToken: '<ServiceToken>' });
      expect(loggedEvent).not.toHaveProperty('OldResourceProperties');
    });

    test('without options, properties are logged as before', async () => {
      // GIVEN
      const event = makeEvent({ RequestType: 'Create', ResourceProperties: { ServiceToken: '<ServiceToken>', Secret: 'VISIBLE' } });

      // WHEN
      const { logs } = await invokeHandler(event, async _ => undefined);

      // THEN
      expect(JSON.parse(logs[0]).ResourceProperties.Secret).toEqual('VISIBLE');
    });

    test('malformed event log hides the ResponseURL and redacted properties', async () => {
      // GIVEN - an Update without a PhysicalResourceId, and a failing handler
      const event = makeEvent({
        RequestType: 'Update',
        ResponseURL: PRESIGNED_URL,
        ResourceProperties: { ServiceToken: '<ServiceToken>', Secret: 'NEW-SECRET' },
        OldResourceProperties: { Secret: 'OLD-SECRET' },
      } as any);

      // WHEN
      const { logs, response } = await invokeHandler(event, async _ => {
        throw new Error('boom');
      }, { redactProperties: ['Secret'] });

      // THEN
      expect(response.Status).toEqual('FAILED');
      const malformed = logs.find(l => l.startsWith('ERROR: Malformed event.'));
      expect(malformed).toBeDefined();
      const logged = logs.join('\n');
      expect(logged).not.toContain('PRESIGNED-SECRET');
      expect(logged).not.toContain('NEW-SECRET');
      expect(logged).not.toContain('OLD-SECRET');
    });

    test('response Data is redacted from the log when NoEcho is set, but sent to cloudformation', async () => {
      // GIVEN
      const event = makeEvent({ RequestType: 'Create' });

      // WHEN
      const { logs, response } = await invokeHandler(event, async _ => ({ NoEcho: true, Data: { Attr: 'SECRET-ATTR' } }));

      // THEN
      expect(response.Data).toEqual({ Attr: 'SECRET-ATTR' });
      expect(logs.join('\n')).not.toContain('SECRET-ATTR');
      expect(logs.join('\n')).toContain('"Attr":"*****"');
    });

    test('response Data is logged when NoEcho is not set', async () => {
      // GIVEN
      const event = makeEvent({ RequestType: 'Create' });

      // WHEN
      const { logs } = await invokeHandler(event, async _ => ({ Data: { Attr: 'VISIBLE-ATTR' } }));

      // THEN
      expect(logs.join('\n')).toContain('VISIBLE-ATTR');
    });

    test.each([
      [['Config.Nested'], /^Invalid makeHandler option "redactProperties": "Config\.Nested" contains '\.'; only top-level property names are supported, nested paths are not supported yet$/],
      [[''], /entries must be non-empty strings/],
      [[42], /entries must be non-empty strings, got 42/],
      ['Config', /expected an array of top-level property names, got string/],
    ])('invalid redactProperties %j fails when the handler is created', (redactProperties, error) => {
      expect(() => entrypoint.makeHandler(async _ => undefined, { redactProperties: redactProperties as any })).toThrow(error);
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

async function invokeHandler(
  req: AWSLambda.CloudFormationCustomResourceEvent,
  userHandler: entrypoint.Handler,
  handlerOptions?: entrypoint.MakeHandlerOptions,
) {
  const parsedResponseUrl = url.parse(req.ResponseURL);

  // stage entry point and user handler.
  const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'cdk-custom-resource-provider-handler-test-'));
  process.on('exit', () => {
    fs.rmSync(workdir, { recursive: true, force: true });
  });
  entrypoint.external.userHandlerIndex = path.join(workdir, 'index.js');
  fs.writeFileSync(entrypoint.external.userHandlerIndex, `exports.handler = ${userHandler.toString()};`);

  // do not include stack traces in failure responses so we can assert against them.
  entrypoint.external.includeStackTraces = false;

  // capture logs instead of printing them
  const logs = new Array<string>();
  entrypoint.external.log = (fmt: string, ...params: any[]) => {
    logs.push([fmt, ...params.map(p => typeof p === 'string' ? p : JSON.stringify(p))].join(' '));
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

  const handler = entrypoint.makeHandler(userHandler, handlerOptions);
  await handler(req);
  if (!actualRequest || !actualResponse) {
    throw new Error('no response sent to cloudformation');
  }

  return {
    response: JSON.parse(actualResponse) as AWSLambda.CloudFormationCustomResourceResponse,
    request: actualRequest as https.RequestOptions,
    logs,
  };
}

