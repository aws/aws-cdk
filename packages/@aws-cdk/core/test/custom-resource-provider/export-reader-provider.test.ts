import { App, Stack, AssetStaging } from '../../lib';
import { ExportReader } from '../../lib/custom-resource-provider/export-reader-provider';
import { toCloudFormation } from '../util';


describe('export reader provider', () => {
  test('basic configuration', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app);

    // WHEN
    new ExportReader(stack, 'ExportReader', {
      region: 'us-east-1',
    });

    // THEN
    const cfn = toCloudFormation(stack);
    const staging = stack.node.tryFindChild('Custom::CrossRegionExportReaderCustomResourceProvider')?.node.tryFindChild('Staging') as AssetStaging;
    const assetHash = staging.assetHash;

    expect(cfn).toEqual({
      Resources: {
        CustomCrossRegionExportReaderCustomResourceProviderRole10531BBD: {
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
                        'cloudformation:ListExports',
                      ],
                      Effect: 'Allow',
                      Resource: '*',
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
        ExportReader: {
          DeletionPolicy: 'Delete',
          Properties: {
            RefreshToken: expect.any(String),
            Region: 'us-east-1',
            ServiceToken: {
              'Fn::GetAtt': [
                'CustomCrossRegionExportReaderCustomResourceProviderHandler46647B68',
                'Arn',
              ],
            },
          },
          Type: 'Custom::CrossRegionExportReader',
          UpdateReplacePolicy: 'Delete',
        },
        CustomCrossRegionExportReaderCustomResourceProviderHandler46647B68: {
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
                'CustomCrossRegionExportReaderCustomResourceProviderRole10531BBD',
                'Arn',
              ],
            },
            Runtime: 'nodejs14.x',
          },
          DependsOn: [
            'CustomCrossRegionExportReaderCustomResourceProviderRole10531BBD',
          ],
        },
      },
    });
  });
});
