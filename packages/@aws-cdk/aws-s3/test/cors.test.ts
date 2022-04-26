import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { Bucket, HttpMethods } from '../lib';

describe('cors', () => {
  test('Can use addCors() to add a CORS configuration', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const bucket = new Bucket(stack, 'Bucket');
    bucket.addCorsRule({
      allowedMethods: [HttpMethods.GET, HttpMethods.HEAD],
      allowedOrigins: ['https://example.com'],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      CorsConfiguration: {
        CorsRules: [{
          AllowedMethods: ['GET', 'HEAD'],
          AllowedOrigins: ['https://example.com'],
        }],
      },
    });
  });

  test('Bucket with multiple cors configurations', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new Bucket(stack, 'Bucket', {
      cors: [
        {
          allowedHeaders: [
            '*',
          ],
          allowedMethods: [
            HttpMethods.GET,
          ],
          allowedOrigins: [
            '*',
          ],
          exposedHeaders: [
            'Date',
          ],
          id: 'myCORSRuleId1',
          maxAge: 3600,
        },
        {
          allowedHeaders: [
            'x-amz-*',
          ],
          allowedMethods: [
            HttpMethods.DELETE,
          ],
          allowedOrigins: [
            'http://www.example1.com',
            'http://www.example2.com',
          ],
          exposedHeaders: [
            'Connection',
            'Server',
            'Date',
          ],
          id: 'myCORSRuleId2',
          maxAge: 1800,
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
      CorsConfiguration: {
        CorsRules: [
          {
            AllowedHeaders: [
              '*',
            ],
            AllowedMethods: [
              'GET',
            ],
            AllowedOrigins: [
              '*',
            ],
            ExposedHeaders: [
              'Date',
            ],
            Id: 'myCORSRuleId1',
            MaxAge: 3600,
          },
          {
            AllowedHeaders: [
              'x-amz-*',
            ],
            AllowedMethods: [
              'DELETE',
            ],
            AllowedOrigins: [
              'http://www.example1.com',
              'http://www.example2.com',
            ],
            ExposedHeaders: [
              'Connection',
              'Server',
              'Date',
            ],
            Id: 'myCORSRuleId2',
            MaxAge: 1800,
          },
        ],
      },
    });
  });
});
