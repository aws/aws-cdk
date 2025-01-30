import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as api from 'aws-cdk-lib/aws-apigateway';

const app = new cdk.App({
  analyticsReporting: true,
});
app.node.setContext('@aws-cdk/core:enableAdditionalMetadataCollection', true);
const stack = new cdk.Stack(app, 'metadata-testing-example');

// Create an S3 bucket (L2 construct)
new s3.Bucket(stack, 'MyBucket', {
  bucketName: 'my-cdk-example-bucket', // String type
  versioned: true, // Boolean type
  removalPolicy: cdk.RemovalPolicy.DESTROY, // ENUM type
  lifecycleRules: [{ // Array of object type
    expirationDate: new Date('2019-10-01'),
    objectSizeLessThan: 600,
    objectSizeGreaterThan: 500,
  }],
  websiteRedirect: {
    hostName: 'myHost',
  },
});

new api.SpecRestApi(stack, 'MyRestApi', {
  description: 'My Rest API',
  deployOptions: {
    stageName: 'dev',
  },
  // Define the API using OpenAPI specification
  apiDefinition: api.ApiDefinition.fromInline({
    openapi: '3.0.2',
    info: {
      title: 'My API',
      version: '1.0.0',
    },
    paths: {
      '/pets': {
        get: {
          'responses': {
            200: {
              description: 'Successful response',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/PetResponse',
                  },
                },
              },
            },
          },
          'x-amazon-apigateway-integration': {
            type: 'MOCK',
            requestTemplates: {
              'application/json': '{ "statusCode": 200 }',
            },
            responses: {
              default: {
                statusCode: '200',
                responseTemplates: {
                  'application/json': '{"pets": []}',
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        PetResponse: {
          type: 'object',
          properties: {
            pets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  }),
});

new integ.IntegTest(app, 'cdk-metadata-testing-example1', {
  testCases: [stack],
});
