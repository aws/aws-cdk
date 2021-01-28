import { Endpoint } from '../lib';

// A numeric CDK token (see: https://docs.aws.amazon.com/cdk/latest/guide/tokens.html#tokens_number)
const CDK_NUMERIC_TOKEN = -1.8881545897087626e+289;

describe('Endpoint', () => {
  test('accepts tokens for the port value', () => {
    // GIVEN
    const token = CDK_NUMERIC_TOKEN;

    // WHEN
    const endpoint = new Endpoint('127.0.0.1', token);

    // THEN
    expect(endpoint.port).toBe(token);
  });

  test('accepts valid port string numbers', () => {
    // GIVEN
    for (const port of [1, 50, 65535]) {
      // WHEN
      const endpoint = new Endpoint('127.0.0.1', port);

      // THEN
      expect(endpoint.port).toBe(port);
    }
  });

});
