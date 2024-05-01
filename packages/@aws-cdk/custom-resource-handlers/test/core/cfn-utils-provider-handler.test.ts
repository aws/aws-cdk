import { handler, CfnUtilsResourceType } from '../../lib/core/cfn-utils-provider/index';

test('parses value as JSON', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
    ResourceType: CfnUtilsResourceType.CFN_JSON,
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
      Value: JSON.stringify({
        test: 'Random',
      }),
    },
  };

  // WHEN
  const response = await invokeHandler(event);

  // THEN
  expect(response).toEqual({
    Data: {
      Value: {
        test: 'Random',
      },
    },
  });
});

test('format JSON value as string', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
    ResourceType: CfnUtilsResourceType.CFN_JSON_STRINGIFY,
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
      Value: {
        test: 'Random',
      },
    },
  };

  // WHEN
  const response = await invokeHandler(event);

  // THEN
  expect(response).toEqual({
    Data: {
      Value: JSON.stringify({
        test: 'Random',
      }),
    },
  });
});

test('fails if wrong resource type', async () => {
  // GIVEN
  const event: Partial<AWSLambda.CloudFormationCustomResourceEvent> = {
    ResourceType: 'Create',
    ResourceProperties: {
      ServiceToken: 'Foo',
      RepositoryName: 'MyRepo',
    },
  };

  // WHEN
  await expect(() => invokeHandler(event)).rejects.toThrow(/unexpected resource type "Create"/);
});

test('resource provider simply parses json and reflects back as an attribute', async () => {
  const input = { foo: 1234 };
  const response = await handler({
    ResourceType: CfnUtilsResourceType.CFN_JSON,
    ResourceProperties: {
      Value: JSON.stringify(input),
    },
  } as any);
  expect(input).toEqual(response.Data.Value);
});

// helper function to get around TypeScript expecting a complete event object,
// even though our tests only need some of the fields
async function invokeHandler(event: Partial<AWSLambda.CloudFormationCustomResourceEvent>) {
  return handler(event as AWSLambda.CloudFormationCustomResourceEvent);
}