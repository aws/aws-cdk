import * as fs from 'fs';
import { Test } from 'nodeunit';
import * as path from 'path';
import { CustomResourceProvider, CustomResourceProviderRuntime, Duration, Size, Stack } from '../../lib';
import { toCloudFormation } from '../util';

const TEST_HANDLER = `${__dirname}/mock-provider`;

export = {
  'minimal configuration'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_12,
    });

    // THEN
    test.ok(fs.existsSync(path.join(TEST_HANDLER, '__entrypoint__.js')), 'expecting entrypoint to be copied to the handler directory');
    const cfn = toCloudFormation(stack);
    test.deepEqual(cfn, {
      Resources: {
        CustomMyResourceTypeCustomResourceProviderRoleBD5E655F: {
          Type: 'AWS::IAM::Role',
          Properties: {
            AssumeRolePolicyDocument: {
              Version: '2012-10-17',
              Statement: [
                {
                  Action: 'sts:AssumeRole',
                  Effect: 'Allow',
                  Principal: {
                    Service: 'lambda.amazonaws.com',
                  },
                },
              ],
            },
            ManagedPolicyArns: [
              {
                'Fn::Sub': 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
              },
            ],
          },
        },
        CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: {
                Ref: 'AssetParameters925e7fbbec7bdbf0136ef5a07b8a0fbe0b1f1bb4ea50ae2154163df78aa9f226S3Bucket8B4D0E9E',
              },
              S3Key: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::Select': [
                        0,
                        {
                          'Fn::Split': [
                            '||',
                            {
                              Ref: 'AssetParameters925e7fbbec7bdbf0136ef5a07b8a0fbe0b1f1bb4ea50ae2154163df78aa9f226S3VersionKeyDECB34FE',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      'Fn::Select': [
                        1,
                        {
                          'Fn::Split': [
                            '||',
                            {
                              Ref: 'AssetParameters925e7fbbec7bdbf0136ef5a07b8a0fbe0b1f1bb4ea50ae2154163df78aa9f226S3VersionKeyDECB34FE',
                            },
                          ],
                        },
                      ],
                    },
                  ],
                ],
              },
            },
            Timeout: 900,
            MemorySize: 128,
            Handler: '__entrypoint__.handler',
            Role: {
              'Fn::GetAtt': [
                'CustomMyResourceTypeCustomResourceProviderRoleBD5E655F',
                'Arn',
              ],
            },
            Runtime: 'nodejs12.x',
          },
          DependsOn: [
            'CustomMyResourceTypeCustomResourceProviderRoleBD5E655F',
          ],
        },
      },
      Parameters: {
        AssetParameters925e7fbbec7bdbf0136ef5a07b8a0fbe0b1f1bb4ea50ae2154163df78aa9f226S3Bucket8B4D0E9E: {
          Type: 'String',
          Description: 'S3 bucket for asset "925e7fbbec7bdbf0136ef5a07b8a0fbe0b1f1bb4ea50ae2154163df78aa9f226"',
        },
        AssetParameters925e7fbbec7bdbf0136ef5a07b8a0fbe0b1f1bb4ea50ae2154163df78aa9f226S3VersionKeyDECB34FE: {
          Type: 'String',
          Description: 'S3 key for asset version "925e7fbbec7bdbf0136ef5a07b8a0fbe0b1f1bb4ea50ae2154163df78aa9f226"',
        },
        AssetParameters925e7fbbec7bdbf0136ef5a07b8a0fbe0b1f1bb4ea50ae2154163df78aa9f226ArtifactHashEEC400F2: {
          Type: 'String',
          Description: 'Artifact hash for asset "925e7fbbec7bdbf0136ef5a07b8a0fbe0b1f1bb4ea50ae2154163df78aa9f226"',
        },
      },
    });
    test.done();
  },

  'policyStatements can be used to add statements to the inline policy'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_12,
      policyStatements: [
        { statement1: 123 },
        { statement2: { foo: 111 } },
      ],
    });

    // THEN
    const template = toCloudFormation(stack);
    const role = template.Resources.CustomMyResourceTypeCustomResourceProviderRoleBD5E655F;
    test.deepEqual(role.Properties.Policies, [{
      PolicyName: 'Inline',
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{ statement1: 123 }, { statement2: { foo: 111 } }],
      },
    }]);
    test.done();
  },

  'memorySize and timeout'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    CustomResourceProvider.getOrCreate(stack, 'Custom:MyResourceType', {
      codeDirectory: TEST_HANDLER,
      runtime: CustomResourceProviderRuntime.NODEJS_12,
      memorySize: Size.gibibytes(2),
      timeout: Duration.minutes(5),
    });

    // THEN
    const template = toCloudFormation(stack);
    const lambda = template.Resources.CustomMyResourceTypeCustomResourceProviderHandler29FBDD2A;
    test.deepEqual(lambda.Properties.MemorySize, 2048);
    test.deepEqual(lambda.Properties.Timeout, 300);
    test.done();
  },
};
