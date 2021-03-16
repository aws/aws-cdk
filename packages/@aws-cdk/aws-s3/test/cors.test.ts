import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { nodeunitShim, Test } from 'nodeunit-shim';
import { Bucket, HttpMethods } from '../lib';

nodeunitShim({
  'Can use addCors() to add a CORS configuration'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const bucket = new Bucket(stack, 'Bucket');
    bucket.addCorsRule({
      allowedMethods: [HttpMethods.GET, HttpMethods.HEAD],
      allowedOrigins: ['https://example.com'],
    });

    // THEN
    expect(stack).to(haveResource('AWS::S3::Bucket', {
      CorsConfiguration: {
        CorsRules: [{
          AllowedMethods: ['GET', 'HEAD'],
          AllowedOrigins: ['https://example.com'],
        }],
      },
    }));

    test.done();
  },

  'Bucket with multiple cors configurations'(test: Test) {
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
    expect(stack).to(haveResource('AWS::S3::Bucket', {
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
    }));

    test.done();
  },
});
