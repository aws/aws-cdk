import { validateOpenApiSchema } from '../../../lib/gateway/validation-helpers';

describe('OpenAPI Schema Validation', () => {
  describe('validateOpenApiSchema', () => {
    test('Should validate valid OpenAPI schema with HTTP URL', () => {
      const schema = JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [{ url: 'http://api.example.com' }],
        paths: {
          '/test': {
            get: {
              operationId: 'getTest',
              responses: { 200: { description: 'OK' } },
            },
          },
        },
      });

      const errors = validateOpenApiSchema({ schema });
      expect(errors).toEqual([]);
    });

    test('Should validate valid OpenAPI schema with HTTPS URL', () => {
      const schema = JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [{ url: 'https://api.example.com' }],
        paths: {
          '/test': {
            get: {
              operationId: 'getTest',
              responses: { 200: { description: 'OK' } },
            },
          },
        },
      });

      const errors = validateOpenApiSchema({ schema });
      expect(errors).toEqual([]);
    });

    test('Should validate OpenAPI schema with template variables', () => {
      const schema = JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [
          { url: '{protocol}://api.example.com' },
          { url: 'https://{environment}.example.com' },
        ],
        paths: {
          '/test': {
            get: {
              operationId: 'getTest',
              responses: { 200: { description: 'OK' } },
            },
          },
        },
      });

      const errors = validateOpenApiSchema({ schema });
      expect(errors).toEqual([]);
    });

    test('Should handle malicious input with many opening braces (ReDoS attack vector)', () => {
      const maliciousUrl = '{'.repeat(10000) + '://api.example.com';
      const schema = JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [{ url: maliciousUrl }],
        paths: {
          '/test': {
            get: {
              operationId: 'getTest',
              responses: { 200: { description: 'OK' } },
            },
          },
        },
      });

      // This should complete quickly without hanging
      const startTime = Date.now();
      const errors = validateOpenApiSchema({ schema });
      const endTime = Date.now();

      // Should complete in less than 100ms even with malicious input
      expect(endTime - startTime).toBeLessThan(100);

      // The malicious URL is treated as having a template variable in the protocol,
      // which is allowed and skips validation. This prevents ReDoS attacks.
      expect(errors).toEqual([]);
    });

    test('Should reject URLs without protocol', () => {
      const schema = JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [{ url: 'api.example.com' }],
        paths: {
          '/test': {
            get: {
              operationId: 'getTest',
              responses: { 200: { description: 'OK' } },
            },
          },
        },
      });

      const errors = validateOpenApiSchema({ schema });
      expect(errors).toContain('OpenAPI schema server[0] URL must contain a protocol (e.g., http:// or https://)');
    });

    test('Should reject non-HTTP/HTTPS protocols', () => {
      const schema = JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [{ url: 'ftp://api.example.com' }],
        paths: {
          '/test': {
            get: {
              operationId: 'getTest',
              responses: { 200: { description: 'OK' } },
            },
          },
        },
      });

      const errors = validateOpenApiSchema({ schema });
      expect(errors).toContain('OpenAPI schema server[0] URL must use HTTP or HTTPS protocol');
    });

    test('Should handle URLs with unusual but valid formats', () => {
      const schema = JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [
          { url: 'HTTP://API.EXAMPLE.COM' }, // Uppercase protocol
          { url: 'https://api.example.com:8080/v1' }, // With port and path
        ],
        paths: {
          '/test': {
            get: {
              operationId: 'getTest',
              responses: { 200: { description: 'OK' } },
            },
          },
        },
      });

      const errors = validateOpenApiSchema({ schema });
      expect(errors).toEqual([]);
    });

    test('Should handle complex URLs with multiple template variables', () => {
      const schema = JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [
          { url: '{protocol}://{subdomain}.{domain}:{port}/v{version}' },
        ],
        paths: {
          '/test': {
            get: {
              operationId: 'getTest',
              responses: { 200: { description: 'OK' } },
            },
          },
        },
      });

      const errors = validateOpenApiSchema({ schema });
      expect(errors).toEqual([]);
    });

    test('Should validate OpenAPI 3.1.x schemas', () => {
      const schema = JSON.stringify({
        openapi: '3.1.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [{ url: 'https://api.example.com' }],
        paths: {
          '/test': {
            get: {
              operationId: 'getTest',
              responses: { 200: { description: 'OK' } },
            },
          },
        },
      });

      const errors = validateOpenApiSchema({ schema });
      expect(errors).toEqual([]);
    });

    test('Should reject invalid OpenAPI versions', () => {
      const schema = JSON.stringify({
        openapi: '2.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [{ url: 'https://api.example.com' }],
        paths: {},
      });

      const errors = validateOpenApiSchema({ schema });
      expect(errors).toContain('OpenAPI schema version 2.0 is not supported. Only OpenAPI 3.0.x and 3.1.x are supported');
    });

    test('Should detect missing operationId', () => {
      const schema = JSON.stringify({
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        servers: [{ url: 'https://api.example.com' }],
        paths: {
          '/test': {
            get: {
              responses: { 200: { description: 'OK' } },
            },
          },
        },
      });

      const errors = validateOpenApiSchema({ schema });
      expect(errors).toContain('OpenAPI schema operations must include \'operationId\' field. Missing in: GET /test');
    });
  });
});
