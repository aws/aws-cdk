import * as nock from 'nock';
import { CustomResourceHandler } from '../../../../lib/assertions/providers/lambda-handler/base';

interface MyHandlerRequest {
  readonly input: string;
}

interface MyHandlerResponse {
  readonly output: string;
}

interface CloudFormationResponse extends Omit<AWSLambda.CloudFormationCustomResourceResponse, 'Data'> {
  readonly Data: MyHandlerResponse;
}

describe('CustomResourceHandler', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => { return true; });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    nock.cleanAll();
  });

  test('default', async () => {
    // GIVEN
    class MyHandler extends CustomResourceHandler<MyHandlerRequest, MyHandlerResponse> {
      protected async processEvent(request: MyHandlerRequest): Promise<MyHandlerResponse | undefined> {
        return { output: `MyResponseTo${request.input}` };
      }
    }

    const nocked = nockUp((body) => {
      return body.Status === 'SUCCESS'
      && body.Reason === 'OK'
      && body.Data.output === 'MyResponseToYourRequest'
      && body.StackId === 'MyStackId'
      && body.RequestId === 'MyRequestId'
      && body.NoEcho === false;
    });


    // WHEN
    const handler = new MyHandler(createEvent({ input: 'YourRequest' }), standardContext);

    await handler.handle();

    // THEN
    expect(nocked.isDone()).toEqual(true);
  });

  test('processEvent fails', async () => {
    // GIVEN
    class MyHandler extends CustomResourceHandler<MyHandlerRequest, MyHandlerResponse> {
      protected async processEvent(_: MyHandlerRequest): Promise<MyHandlerResponse | undefined> {
        throw new Error('FooFAIL');
      }
    }

    const nocked = nockUp((body) => {
      return body.Status === 'FAILED'
      && body.Reason === 'FooFAIL';
    });


    // WHEN
    const handler = new MyHandler(createEvent({ input: 'YourRequest' }), standardContext);

    await handler.handle();

    // THEN
    expect(nocked.isDone()).toEqual(true);
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

  describe('physicalResourceId', () => {
    test('create event', async () => {
      // GIVEN
      class MyHandler extends CustomResourceHandler<MyHandlerRequest, MyHandlerResponse> {
        protected async processEvent(request: MyHandlerRequest): Promise<MyHandlerResponse | undefined> {
          return { output: `MyResponseTo${request.input}` };
        }
      }

      const nocked = nockUp((body) => {
        return body.PhysicalResourceId === 'MyLogicalResourceId';
      });


      // WHEN
      const handler = new MyHandler(createEvent({ input: 'YourRequest' }), standardContext);

      await handler.handle();

      // THEN
      expect(nocked.isDone()).toEqual(true);
    });

    test('update event', async () => {
      // GIVEN
      class MyHandler extends CustomResourceHandler<MyHandlerRequest, MyHandlerResponse> {
        protected async processEvent(request: MyHandlerRequest): Promise<MyHandlerResponse | undefined> {
          return { output: `MyResponseTo${request.input}` };
        }
      }

      const nocked = nockUp((body) => {
        return body.PhysicalResourceId === 'MyPhysicalResourceId';
      });


      // WHEN
      const handler = new MyHandler(updateEvent({ input: 'YourRequest' }), standardContext);

      await handler.handle();

      // THEN
      expect(nocked.isDone()).toEqual(true);
    });
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

function createEvent(data?: MyHandlerRequest): AWSLambda.CloudFormationCustomResourceCreateEvent {
  return {
    LogicalResourceId: 'MyLogicalResourceId',
    RequestId: 'MyRequestId',
    RequestType: 'Create',
    ResourceType: 'MyResourceType',
    ResourceProperties: {
      ...data,
      ServiceToken: 'MyServiceToken',
    },
    ResponseURL: 'https://someurl.com',
    ServiceToken: 'MyServiceToken',
    StackId: 'MyStackId',
  };
}

function updateEvent(data?: MyHandlerRequest): AWSLambda.CloudFormationCustomResourceUpdateEvent {
  return {
    LogicalResourceId: 'MyLogicalResourceId',
    OldResourceProperties: {
      ...data,
      ServiceToken: 'MyServiceToken',
    },
    PhysicalResourceId: 'MyPhysicalResourceId',
    RequestId: 'MyRequestId',
    RequestType: 'Update',
    ResourceType: 'MyResourceType',
    ResourceProperties: {
      ...data,
      ServiceToken: 'MyServiceToken',
    },
    ResponseURL: 'https://someurl.com',
    ServiceToken: 'MyServiceToken',
    StackId: 'MyStackId',
  };
}
