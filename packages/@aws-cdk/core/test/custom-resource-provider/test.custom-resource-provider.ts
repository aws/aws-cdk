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
                Ref: 'AssetParametersd46d1ebe2c1958c6352664721f77acb9c78131013956eb82d3d36cf503098e7aS3Bucket1D703CB8',
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
                              Ref: 'AssetParametersd46d1ebe2c1958c6352664721f77acb9c78131013956eb82d3d36cf503098e7aS3VersionKey01A97AE3',
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
                              Ref: 'AssetParametersd46d1ebe2c1958c6352664721f77acb9c78131013956eb82d3d36cf503098e7aS3VersionKey01A97AE3',
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
        AssetParametersd46d1ebe2c1958c6352664721f77acb9c78131013956eb82d3d36cf503098e7aS3Bucket1D703CB8: {
          Type: 'String',
          Description: 'S3 bucket for asset "d46d1ebe2c1958c6352664721f77acb9c78131013956eb82d3d36cf503098e7a"',
        },
        AssetParametersd46d1ebe2c1958c6352664721f77acb9c78131013956eb82d3d36cf503098e7aS3VersionKey01A97AE3: {
          Type: 'String',
          Description: 'S3 key for asset version "d46d1ebe2c1958c6352664721f77acb9c78131013956eb82d3d36cf503098e7a"',
        },
        AssetParametersd46d1ebe2c1958c6352664721f77acb9c78131013956eb82d3d36cf503098e7aArtifactHash16A571C9: {
          Type: 'String',
          Description: 'Artifact hash for asset "d46d1ebe2c1958c6352664721f77acb9c78131013956eb82d3d36cf503098e7a"',
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
