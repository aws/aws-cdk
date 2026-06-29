import { handler } from '../../lib/aws-stepfunctions-tasks/cross-region-aws-sdk-handler';

// Mock AWS SDK
const mockSend = jest.fn();
jest.mock('@aws-sdk/client-lambda', () => ({
  LambdaClient: jest.fn().mockImplementation(() => ({
    send: mockSend,
  })),
  InvokeCommand: jest.fn().mockImplementation((params) => params),
}));

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({
    send: mockSend,
  })),
  ListTablesCommand: jest.fn().mockImplementation((params) => params),
}));

jest.mock('@aws-sdk/client-sts', () => ({
  STSClient: jest.fn().mockImplementation(() => ({
    send: jest.fn(),
  })),
  AssumeRoleCommand: jest.fn(),
}));

describe('Cross-Region AWS SDK Handler - Lambda Payload Processing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Lambda Invoke with Binary Payload Handling', () => {
    test('should convert Uint8Array payload to JSON object', async () => {
      // GIVEN - Lambda response with Uint8Array payload
      const lambdaResponseJson = JSON.stringify({
        statusCode: 200,
        body: { status: 'success', message: 'Hello from Lambda' },
      });
      const uint8ArrayPayload = new TextEncoder().encode(lambdaResponseJson);

      mockSend.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
        ExecutedVersion: '$LATEST',
        Payload: uint8ArrayPayload,
        StatusCode: 200,
      });

      const event = {
        service: 'lambda',
        action: 'invoke',
        parameters: {
          FunctionName: 'test-function',
          Payload: JSON.stringify({ test: 'data' }),
        },
        region: 'us-west-2',
        endpoint: 'https://lambda.us-west-2.amazonaws.com',
      };

      // WHEN
      const result = await handler(event);

      // THEN - Should return proper JSON instead of byte array
      expect(result.Payload).toEqual({
        statusCode: 200,
        body: { status: 'success', message: 'Hello from Lambda' },
      });
      expect(result.Payload).not.toHaveProperty('0'); // Should not be byte array
    });

    test('should handle Buffer payload', async () => {
      // GIVEN - Lambda response with Buffer payload
      const lambdaResponseJson = JSON.stringify({ result: 'buffer test' });
      const bufferPayload = Buffer.from(lambdaResponseJson, 'utf8');

      mockSend.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
        Payload: bufferPayload,
        StatusCode: 200,
      });

      const event = {
        service: 'lambda',
        action: 'invoke',
        parameters: { FunctionName: 'test-function' },
        region: 'us-west-2',
        endpoint: 'https://lambda.us-west-2.amazonaws.com',
      };

      // WHEN
      const result = await handler(event);

      // THEN
      expect(result.Payload).toEqual({ result: 'buffer test' });
    });

    test('should handle malformed JSON payload gracefully', async () => {
      // GIVEN - Malformed JSON in payload
      const malformedJson = '{"incomplete": json';
      const malformedPayload = new TextEncoder().encode(malformedJson);

      mockSend.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
        Payload: malformedPayload,
        StatusCode: 200,
      });

      const event = {
        service: 'lambda',
        action: 'invoke',
        parameters: { FunctionName: 'test-function' },
        region: 'us-west-2',
        endpoint: 'https://lambda.us-west-2.amazonaws.com',
      };

      // WHEN
      const result = await handler(event);

      // THEN - Should fall back to decoded string
      expect(result.Payload).toBe(malformedJson);
    });

    test('should not modify non-binary payload', async () => {
      // GIVEN - Already parsed payload
      mockSend.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
        Payload: { alreadyParsed: true },
        StatusCode: 200,
      });

      const event = {
        service: 'lambda',
        action: 'invoke',
        parameters: { FunctionName: 'test-function' },
        region: 'us-west-2',
        endpoint: 'https://lambda.us-west-2.amazonaws.com',
      };

      // WHEN
      const result = await handler(event);

      // THEN
      expect(result.Payload).toEqual({ alreadyParsed: true });
    });
  });

  describe('Non-Lambda Services (Backward Compatibility)', () => {
    test('should handle DynamoDB responses without Payload field', async () => {
      // GIVEN - DynamoDB response
      mockSend.mockResolvedValue({
        $metadata: { httpStatusCode: 200 },
        TableNames: ['table1', 'table2'],
        LastEvaluatedTableName: 'table2',
      });

      const event = {
        service: 'dynamodb',
        action: 'listTables',
        parameters: {},
        region: 'us-west-2',
        endpoint: 'https://dynamodb.us-west-2.amazonaws.com',
      };

      // WHEN
      const result = await handler(event);

      // THEN
      expect(result.TableNames).toEqual(['table1', 'table2']);
      expect(result.LastEvaluatedTableName).toBe('table2');
    });
  });

  describe('Binary Payload Processing', () => {
    test('should properly decode Lambda binary payloads to JSON', async () => {
      // GIVEN - Lambda response with binary payload containing JSON
      const originalLambdaResponse = {
        statusCode: 200,
        body: { status: 'success' },
      };

      const uint8ArrayPayload = new TextEncoder().encode(JSON.stringify(originalLambdaResponse));

      mockSend.mockResolvedValue({
        $metadata: {
          httpStatusCode: 200,
          requestId: '8f4f0076-f64e-42c5-a7bb-1b607a0a265f',
        },
        ExecutedVersion: '$LATEST',
        Payload: uint8ArrayPayload,
        StatusCode: 200,
      });

      const event = {
        service: 'lambda',
        action: 'invoke',
        parameters: {
          FunctionName: 'test-function',
          Payload: JSON.stringify({ input: 'test' }),
        },
        region: 'us-west-2',
        endpoint: 'https://lambda.us-west-2.amazonaws.com',
      };

      // WHEN
      const result = await handler(event);

      // THEN - Should return proper JSON instead of byte arrays
      expect(result.Payload).toEqual(originalLambdaResponse);
      expect(result.Payload).not.toHaveProperty('0'); // Not byte array
      expect(result.Payload).not.toHaveProperty('1'); // Not byte array
      expect(result.Payload.statusCode).toBe(200);
      expect(result.Payload.body.status).toBe('success');
    });
  });
});
