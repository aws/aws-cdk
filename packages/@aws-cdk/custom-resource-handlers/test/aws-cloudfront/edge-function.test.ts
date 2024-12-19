import { handler } from '../../lib/aws-cloudfront/edge-function/index';

type RequestType = 'Create' | 'Update' | 'Delete';

const eventCommon = {
  ServiceToken: 'token',
  ResponseURL: 'https://localhost',
  StackId: 'stackId',
  RequestId: 'requestId',
  LogicalResourceId: 'logicalResourceId',
  PhysicalResourceId: 'physicalResourceId',
  ResourceProperties: {
    Region: 'us-west-2',
    ParameterName: 'edge-function-arn',
  },
};

const mockSSM = {
  getParameter: jest.fn().mockResolvedValue({
    Parameter: { Value: 'arn:aws:lambda:us-west-2:123456789012:function:edge-function' },
  }),
};

jest.mock('@aws-sdk/client-ssm', () => {
  return {
    SSM: jest.fn().mockImplementation(() => {
      return mockSSM;
    }),
  };
});

afterAll(() => { jest.resetAllMocks(); });

describe('handler', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    mockSSM.getParameter.mockClear();
  });

  test('create event', async () => {
    // GIVEN
    const event = {
      ...eventCommon,
      RequestType: 'Create' as RequestType,
    };

    // WHEN
    const response = await handler(event);

    // THEN
    expect(mockSSM.getParameter).toHaveBeenCalledWith({ Name: 'edge-function-arn' });
    expect(response).toEqual({ Data: { FunctionArn: 'arn:aws:lambda:us-west-2:123456789012:function:edge-function' } });
  });

  test('update event', async () => {
    // GIVEN
    const event = {
      ...eventCommon,
      RequestType: 'Update' as RequestType,
    };

    // WHEN
    const response = await handler(event);

    // THEN
    expect(mockSSM.getParameter).toHaveBeenCalledWith({ Name: 'edge-function-arn' });
    expect(response).toEqual({ Data: { FunctionArn: 'arn:aws:lambda:us-west-2:123456789012:function:edge-function' } });
  });

  test('delete event', async () => {
    // GIVEN
    const event = {
      ...eventCommon,
      RequestType: 'Delete' as RequestType,
    };

    // WHEN
    const response = await handler(event);

    // THEN
    expect(mockSSM.getParameter).not.toHaveBeenCalled();
    expect(response).toBe(undefined);
  });
});
