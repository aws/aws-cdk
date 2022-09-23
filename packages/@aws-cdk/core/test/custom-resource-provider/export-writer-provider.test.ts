import { App, Stack, AssetStaging, CfnResource } from '../../lib';
import { ExportWriter } from '../../lib/custom-resource-provider/export-writer-provider';
import { toCloudFormation } from '../util';


describe('export writer provider', () => {
  test('basic configuration', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app);
    const resource = new CfnResource(stack, 'MyResource', {
      type: 'Custom::MyResource',
    });

    // WHEN
    const exportWriter = new ExportWriter(stack, 'ExportWriter', {
      region: 'us-east-1',
    });
    const exportValue = exportWriter.exportValue('MyResourceName', resource.getAtt('arn'));

    // THEN
    const cfn = toCloudFormation(stack);
    const staging = stack.node.tryFindChild('Custom::CrossRegionExportWriterCustomResourceProvider')?.node.tryFindChild('Staging') as AssetStaging;
    const assetHash = staging.assetHash;

    expect(stack.resolve(exportValue)).toEqual('{{resolve:ssm:/cdk/exports/MyResourceName}}');
    expect(cfn).toEqual({
      Resources: {
        MyResource: {
          Type: 'Custom::MyResource',
        },
        CustomCrossRegionExportWriterCustomResourceProviderRoleC951B1E1: {
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
            Policies: [
              {
                PolicyDocument: {
                  Statement: [
                    {
                      Action: [
                        'ssm:GetParametersByPath',
                        'ssm:PutParameter',
                        'ssm:DeleteParameters',
                      ],
                      Effect: 'Allow',
                      Resource: {
                        'Fn::Join': [
                          '',
                          [
                            'arn:',
                            {
                              Ref: 'AWS::Partition',
                            },
                            ':ssm:us-east-1:',
                            {
                              Ref: 'AWS::AccountId',
                            },
                            ':parameter/cdk/exports/*',
                          ],
                        ],
                      },
                    },
                  ],
                  Version: '2012-10-17',
                },
                PolicyName: 'Inline',
              },
            ],
            ManagedPolicyArns: [
              {
                'Fn::Sub': 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
              },
            ],
          },
        },
        ExportWriter: {
          DeletionPolicy: 'Delete',
          Properties: {
            Region: 'us-east-1',
            ServiceToken: {
              'Fn::GetAtt': [
                'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
                'Arn',
              ],
            },
            Exports: {
              MyResourceName: {
                'Fn::GetAtt': [
                  'MyResource',
                  'arn',
                ],
              },
            },
          },
          Type: 'Custom::CrossRegionExportWriter',
          UpdateReplacePolicy: 'Delete',
        },
        CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A: {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Code: {
              S3Bucket: {
                'Fn::Sub': 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}',
              },
              S3Key: `${assetHash}.zip`,
            },
            Timeout: 900,
            MemorySize: 128,
            Handler: '__entrypoint__.handler',
            Role: {
              'Fn::GetAtt': [
                'CustomCrossRegionExportWriterCustomResourceProviderRoleC951B1E1',
                'Arn',
              ],
            },
            Runtime: 'nodejs14.x',
          },
          DependsOn: [
            'CustomCrossRegionExportWriterCustomResourceProviderRoleC951B1E1',
          ],
        },
      },
    });
  });
});
