"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("../../lib");
const export_writer_provider_1 = require("../../lib/custom-resource-provider/cross-region-export-providers/export-writer-provider");
const util_1 = require("../util");
describe('export writer provider', () => {
    test('basic configuration', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack1');
        const stack2 = new lib_1.Stack(app, 'Stack2');
        const resource = new lib_1.CfnResource(stack, 'MyResource', {
            type: 'Custom::MyResource',
        });
        // WHEN
        const exportWriter = new export_writer_provider_1.ExportWriter(stack, 'ExportWriter', {
            region: 'us-east-1',
        });
        const exportValue = exportWriter.exportValue('MyResourceName', resource.getAtt('arn'), stack2);
        // THEN
        const cfn = util_1.toCloudFormation(stack);
        const stack2Cfn = util_1.toCloudFormation(stack2);
        const staging = stack.node.tryFindChild('Custom::CrossRegionExportWriterCustomResourceProvider')?.node.tryFindChild('Staging');
        const assetHash = staging.assetHash;
        expect(stack.resolve(exportValue)).toEqual({
            'Fn::GetAtt': [
                'ExportsReader8B249524',
                '/cdk/exports/MyResourceName',
            ],
        });
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
                                                'ssm:DeleteParameters',
                                                'ssm:ListTagsForResource',
                                                'ssm:GetParameters',
                                                'ssm:PutParameter',
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
                ExportWriterA770449C: {
                    DeletionPolicy: 'Delete',
                    Properties: {
                        WriterProps: {
                            region: 'us-east-1',
                            exports: {
                                '/cdk/exports/MyResourceName': {
                                    'Fn::GetAtt': [
                                        'MyResource',
                                        'arn',
                                    ],
                                },
                            },
                        },
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
                                'Arn',
                            ],
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
        expect(stack2Cfn).toEqual({
            Resources: {
                CustomCrossRegionExportReaderCustomResourceProviderHandler46647B68: {
                    DependsOn: [
                        'CustomCrossRegionExportReaderCustomResourceProviderRole10531BBD',
                    ],
                    Properties: {
                        Code: {
                            S3Bucket: {
                                'Fn::Sub': 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}',
                            },
                            S3Key: expect.any(String),
                        },
                        Handler: '__entrypoint__.handler',
                        MemorySize: 128,
                        Role: {
                            'Fn::GetAtt': [
                                'CustomCrossRegionExportReaderCustomResourceProviderRole10531BBD',
                                'Arn',
                            ],
                        },
                        Runtime: 'nodejs14.x',
                        Timeout: 900,
                    },
                    Type: 'AWS::Lambda::Function',
                },
                CustomCrossRegionExportReaderCustomResourceProviderRole10531BBD: {
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: {
                                        Service: 'lambda.amazonaws.com',
                                    },
                                },
                            ],
                            Version: '2012-10-17',
                        },
                        ManagedPolicyArns: [
                            {
                                'Fn::Sub': 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                            },
                        ],
                        Policies: [
                            {
                                PolicyDocument: {
                                    Statement: [
                                        {
                                            Action: [
                                                'ssm:AddTagsToResource',
                                                'ssm:RemoveTagsFromResource',
                                                'ssm:GetParameters',
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
                                                        ':ssm:',
                                                        {
                                                            Ref: 'AWS::Region',
                                                        },
                                                        ':',
                                                        {
                                                            Ref: 'AWS::AccountId',
                                                        },
                                                        ':parameter/cdk/exports/Stack2/*',
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
                    },
                    Type: 'AWS::IAM::Role',
                },
                ExportsReader8B249524: {
                    DeletionPolicy: 'Delete',
                    Properties: {
                        ReaderProps: {
                            imports: {
                                '/cdk/exports/MyResourceName': '{{resolve:ssm:/cdk/exports/MyResourceName}}',
                            },
                            region: {
                                Ref: 'AWS::Region',
                            },
                            prefix: 'Stack2',
                        },
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
            },
        });
    });
    test('when consumer is a nested stack, ExportReader is created in the parent stack', () => {
        // GIVEN
        const app = new lib_1.App();
        const stack = new lib_1.Stack(app, 'Stack1');
        const stack2 = new lib_1.Stack(app, 'Stack2');
        const nested2 = new lib_1.NestedStack(stack2, 'Nested1');
        const resource = new lib_1.CfnResource(stack, 'MyResource', {
            type: 'Custom::MyResource',
        });
        // WHEN
        const exportWriter = new export_writer_provider_1.ExportWriter(stack, 'ExportWriter', {
            region: 'us-east-1',
        });
        const exportValue = exportWriter.exportValue('MyResourceName', resource.getAtt('arn'), nested2);
        // THEN
        const cfn = util_1.toCloudFormation(stack);
        const stack2Cfn = util_1.toCloudFormation(stack2);
        const staging = stack.node.tryFindChild('Custom::CrossRegionExportWriterCustomResourceProvider')?.node.tryFindChild('Staging');
        const assetHash = staging.assetHash;
        expect(stack.resolve(exportValue)).toEqual({
            'Fn::GetAtt': ['ExportsReader8B249524', '/cdk/exports/MyResourceName'],
        });
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
                                                'ssm:DeleteParameters',
                                                'ssm:ListTagsForResource',
                                                'ssm:GetParameters',
                                                'ssm:PutParameter',
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
                ExportWriterA770449C: {
                    DeletionPolicy: 'Delete',
                    Properties: {
                        WriterProps: {
                            region: 'us-east-1',
                            exports: {
                                '/cdk/exports/MyResourceName': {
                                    'Fn::GetAtt': [
                                        'MyResource',
                                        'arn',
                                    ],
                                },
                            },
                        },
                        ServiceToken: {
                            'Fn::GetAtt': [
                                'CustomCrossRegionExportWriterCustomResourceProviderHandlerD8786E8A',
                                'Arn',
                            ],
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
        expect(stack2Cfn).toEqual({
            Resources: {
                CustomCrossRegionExportReaderCustomResourceProviderHandler46647B68: {
                    DependsOn: [
                        'CustomCrossRegionExportReaderCustomResourceProviderRole10531BBD',
                    ],
                    Properties: {
                        Code: {
                            S3Bucket: {
                                'Fn::Sub': 'cdk-hnb659fds-assets-${AWS::AccountId}-${AWS::Region}',
                            },
                            S3Key: expect.any(String),
                        },
                        Handler: '__entrypoint__.handler',
                        MemorySize: 128,
                        Role: {
                            'Fn::GetAtt': [
                                'CustomCrossRegionExportReaderCustomResourceProviderRole10531BBD',
                                'Arn',
                            ],
                        },
                        Runtime: 'nodejs14.x',
                        Timeout: 900,
                    },
                    Type: 'AWS::Lambda::Function',
                },
                CustomCrossRegionExportReaderCustomResourceProviderRole10531BBD: {
                    Properties: {
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: {
                                        Service: 'lambda.amazonaws.com',
                                    },
                                },
                            ],
                            Version: '2012-10-17',
                        },
                        ManagedPolicyArns: [
                            {
                                'Fn::Sub': 'arn:${AWS::Partition}:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
                            },
                        ],
                        Policies: [
                            {
                                PolicyDocument: {
                                    Statement: [
                                        {
                                            Action: [
                                                'ssm:AddTagsToResource',
                                                'ssm:RemoveTagsFromResource',
                                                'ssm:GetParameters',
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
                                                        ':ssm:',
                                                        {
                                                            Ref: 'AWS::Region',
                                                        },
                                                        ':',
                                                        {
                                                            Ref: 'AWS::AccountId',
                                                        },
                                                        ':parameter/cdk/exports/Stack2/*',
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
                    },
                    Type: 'AWS::IAM::Role',
                },
                ExportsReader8B249524: {
                    DeletionPolicy: 'Delete',
                    Properties: {
                        ReaderProps: {
                            imports: {
                                '/cdk/exports/MyResourceName': '{{resolve:ssm:/cdk/exports/MyResourceName}}',
                            },
                            region: {
                                Ref: 'AWS::Region',
                            },
                            prefix: 'Stack2',
                        },
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
                Nested1NestedStackNested1NestedStackResourceCD0AD36B: {
                    DeletionPolicy: 'Delete',
                    Properties: {
                        TemplateURL: '<unresolved>',
                    },
                    Type: 'AWS::CloudFormation::Stack',
                    UpdateReplacePolicy: 'Delete',
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LXdyaXRlci1wcm92aWRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhwb3J0LXdyaXRlci1wcm92aWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQStFO0FBQy9FLG9JQUF1SDtBQUN2SCxrQ0FBMkM7QUFHM0MsUUFBUSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtJQUN0QyxJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQy9CLFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2QyxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDcEQsSUFBSSxFQUFFLG9CQUFvQjtTQUMzQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxZQUFZLEdBQUcsSUFBSSxxQ0FBWSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7WUFDM0QsTUFBTSxFQUFFLFdBQVc7U0FDcEIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9GLE9BQU87UUFDUCxNQUFNLEdBQUcsR0FBRyx1QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxNQUFNLFNBQVMsR0FBRyx1QkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzQyxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyx1REFBdUQsQ0FBQyxFQUFF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RUFBRSxpQ0FBaUM7b0JBQ3ZDLG1CQUFtQixFQUFFLFFBQVE7aUJBQzlCO2dCQUNELG9EQUFvRCxFQUFFO29CQUNwRCxjQUFjLEVBQUUsUUFBUTtvQkFDeEIsVUFBVSxFQUFFO3dCQUNWLFdBQVcsRUFBRSxjQUFjO3FCQUM1QjtvQkFDRCxJQUFJLEVBQUUsNEJBQTRCO29CQUNsQyxtQkFBbUIsRUFBRSxRQUFRO2lCQUM5QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcCwgU3RhY2ssIEFzc2V0U3RhZ2luZywgQ2ZuUmVzb3VyY2UsIE5lc3RlZFN0YWNrIH0gZnJvbSAnLi4vLi4vbGliJztcbmltcG9ydCB7IEV4cG9ydFdyaXRlciB9IGZyb20gJy4uLy4uL2xpYi9jdXN0b20tcmVzb3VyY2UtcHJvdmlkZXIvY3Jvc3MtcmVnaW9uLWV4cG9ydC1wcm92aWRlcnMvZXhwb3J0LXdyaXRlci1wcm92aWRlcic7XG5pbXBvcnQgeyB0b0Nsb3VkRm9ybWF0aW9uIH0gZnJvbSAnLi4vdXRpbCc7XG5cblxuZGVzY3JpYmUoJ2V4cG9ydCB3cml0ZXIgcHJvdmlkZXInLCAoKSA9PiB7XG4gIHRlc3QoJ2Jhc2ljIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2sxJyk7XG4gICAgY29uc3Qgc3RhY2syID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMicpO1xuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblJlc291cmNlKHN0YWNrLCAnTXlSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdDdXN0b206Ok15UmVzb3VyY2UnLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGV4cG9ydFdyaXRlciA9IG5ldyBFeHBvcnRXcml0ZXIoc3RhY2ssICdFeHBvcnRXcml0ZXInLCB7XG4gICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgIH0pO1xuICAgIGNvbnN0IGV4cG9ydFZhbHVlID0gZXhwb3J0V3JpdGVyLmV4cG9ydFZhbHVlKCdNeVJlc291cmNlTmFtZScsIHJlc291cmNlLmdldEF0dCgnYXJuJyksIHN0YWNrMik7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgY2ZuID0gdG9DbG91ZEZvcm1hdGlvbihzdGFjayk7XG4gICAgY29uc3Qgc3RhY2syQ2ZuID0gdG9DbG91ZEZvcm1hdGlvbihzdGFjazIpO1xuICAgIGNvbnN0IHN0YWdpbmcgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXInKT8ubm9kZS50cnlGaW5kQ2hpbGQoJ1N0YWdpbmcnKSBhcyBBc3NldFN0YWdpbmc7XG4gICAgY29uc3QgYXNzZXRIYXNoID0gc3RhZ2luZy5hc3NldEhhc2g7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShleHBvcnRWYWx1ZSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdFeHBvcnRzUmVhZGVyOEIyNDk1MjQnLFxuICAgICAgICAnL2Nkay9leHBvcnRzL015UmVzb3VyY2VOYW1lJyxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgZXhwZWN0KGNmbikudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlSZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdDdXN0b206Ok15UmVzb3VyY2UnLFxuICAgICAgICB9LFxuICAgICAgICBDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlQzk1MUIxRTE6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgICAgICBTZXJ2aWNlOiAnbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFBvbGljaWVzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzc206RGVsZXRlUGFyYW1ldGVycycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3NtOkxpc3RUYWdzRm9yUmVzb3VyY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzc206UHV0UGFyYW1ldGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnOnNzbTp1cy1lYXN0LTE6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnOnBhcmFtZXRlci9jZGsvZXhwb3J0cy8qJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBQb2xpY3lOYW1lOiAnSW5saW5lJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTdWInOiAnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgRXhwb3J0V3JpdGVyQTc3MDQ0OUM6IHtcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgV3JpdGVyUHJvcHM6IHtcbiAgICAgICAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgICAgICAgZXhwb3J0czoge1xuICAgICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlSZXNvdXJjZU5hbWUnOiB7XG4gICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgJ015UmVzb3VyY2UnLFxuICAgICAgICAgICAgICAgICAgICAnYXJuJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXJEODc4NkU4QScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVHlwZTogJ0N1c3RvbTo6Q3Jvc3NSZWdpb25FeHBvcnRXcml0ZXInLFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICB9LFxuICAgICAgICBDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyRDg3ODZFOEE6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBDb2RlOiB7XG4gICAgICAgICAgICAgIFMzQnVja2V0OiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTdWInOiAnY2RrLWhuYjY1OWZkcy1hc3NldHMtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBTM0tleTogYCR7YXNzZXRIYXNofS56aXBgLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFRpbWVvdXQ6IDkwMCxcbiAgICAgICAgICAgIE1lbW9yeVNpemU6IDEyOCxcbiAgICAgICAgICAgIEhhbmRsZXI6ICdfX2VudHJ5cG9pbnRfXy5oYW5kbGVyJyxcbiAgICAgICAgICAgIFJvbGU6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGVDOTUxQjFFMScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUnVudGltZTogJ25vZGVqczE0LngnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRXcml0ZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVyUm9sZUM5NTFCMUUxJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3Qoc3RhY2syQ2ZuKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFJlYWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyNDY2NDdCNjg6IHtcbiAgICAgICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFJlYWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlMTA1MzFCQkQnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgQ29kZToge1xuICAgICAgICAgICAgICBTM0J1Y2tldDoge1xuICAgICAgICAgICAgICAgICdGbjo6U3ViJzogJ2Nkay1obmI2NTlmZHMtYXNzZXRzLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUzNLZXk6IGV4cGVjdC5hbnkoU3RyaW5nKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBIYW5kbGVyOiAnX19lbnRyeXBvaW50X18uaGFuZGxlcicsXG4gICAgICAgICAgICBNZW1vcnlTaXplOiAxMjgsXG4gICAgICAgICAgICBSb2xlOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFJlYWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlMTA1MzFCQkQnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJ1bnRpbWU6ICdub2RlanMxNC54JyxcbiAgICAgICAgICAgIFRpbWVvdXQ6IDkwMCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLFxuICAgICAgICB9LFxuICAgICAgICBDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFJlYWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlMTA1MzFCQkQ6IHtcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdsYW1iZGEuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTdWInOiAnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBQb2xpY2llczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3NtOkFkZFRhZ3NUb1Jlc291cmNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzc206UmVtb3ZlVGFnc0Zyb21SZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3NtOkdldFBhcmFtZXRlcnMnLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6c3NtOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyL2Nkay9leHBvcnRzL1N0YWNrMi8qJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBQb2xpY3lOYW1lOiAnSW5saW5lJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICB9LFxuICAgICAgICBFeHBvcnRzUmVhZGVyOEIyNDk1MjQ6IHtcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUmVhZGVyUHJvcHM6IHtcbiAgICAgICAgICAgICAgaW1wb3J0czoge1xuICAgICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlSZXNvdXJjZU5hbWUnOiAne3tyZXNvbHZlOnNzbTovY2RrL2V4cG9ydHMvTXlSZXNvdXJjZU5hbWV9fScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlZ2lvbjoge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcHJlZml4OiAnU3RhY2syJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXI0NjY0N0I2OCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVHlwZTogJ0N1c3RvbTo6Q3Jvc3NSZWdpb25FeHBvcnRSZWFkZXInLFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2hlbiBjb25zdW1lciBpcyBhIG5lc3RlZCBzdGFjaywgRXhwb3J0UmVhZGVyIGlzIGNyZWF0ZWQgaW4gdGhlIHBhcmVudCBzdGFjaycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG4gICAgY29uc3QgbmVzdGVkMiA9IG5ldyBOZXN0ZWRTdGFjayhzdGFjazIsICdOZXN0ZWQxJyk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0N1c3RvbTo6TXlSZXNvdXJjZScsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgZXhwb3J0V3JpdGVyID0gbmV3IEV4cG9ydFdyaXRlcihzdGFjaywgJ0V4cG9ydFdyaXRlcicsIHtcbiAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgfSk7XG4gICAgY29uc3QgZXhwb3J0VmFsdWUgPSBleHBvcnRXcml0ZXIuZXhwb3J0VmFsdWUoJ015UmVzb3VyY2VOYW1lJywgcmVzb3VyY2UuZ2V0QXR0KCdhcm4nKSwgbmVzdGVkMik7XG5cbiAgICAvLyBUSEVOXG4gICAgY29uc3QgY2ZuID0gdG9DbG91ZEZvcm1hdGlvbihzdGFjayk7XG4gICAgY29uc3Qgc3RhY2syQ2ZuID0gdG9DbG91ZEZvcm1hdGlvbihzdGFjazIpO1xuICAgIGNvbnN0IHN0YWdpbmcgPSBzdGFjay5ub2RlLnRyeUZpbmRDaGlsZCgnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXInKT8ubm9kZS50cnlGaW5kQ2hpbGQoJ1N0YWdpbmcnKSBhcyBBc3NldFN0YWdpbmc7XG4gICAgY29uc3QgYXNzZXRIYXNoID0gc3RhZ2luZy5hc3NldEhhc2g7XG5cbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShleHBvcnRWYWx1ZSkpLnRvRXF1YWwoe1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0V4cG9ydHNSZWFkZXI4QjI0OTUyNCcsICcvY2RrL2V4cG9ydHMvTXlSZXNvdXJjZU5hbWUnXSxcbiAgICB9KTtcbiAgICBleHBlY3QoY2ZuKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeVJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ0N1c3RvbTo6TXlSZXNvdXJjZScsXG4gICAgICAgIH0sXG4gICAgICAgIEN1c3RvbUNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGVDOTUxQjFFMToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdsYW1iZGEuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUG9saWNpZXM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3NzbTpEZWxldGVQYXJhbWV0ZXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzc206TGlzdFRhZ3NGb3JSZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3NtOkdldFBhcmFtZXRlcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NzbTpQdXRQYXJhbWV0ZXInLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6c3NtOnVzLWVhc3QtMTonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyL2Nkay9leHBvcnRzLyonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFBvbGljeU5hbWU6ICdJbmxpbmUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIE1hbmFnZWRQb2xpY3lBcm5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OlN1Yic6ICdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBFeHBvcnRXcml0ZXJBNzcwNDQ5Qzoge1xuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVJlc291cmNlTmFtZSc6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnTXlSZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAgICdhcm4nLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyRDg3ODZFOEEnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdDdXN0b206OkNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyJyxcbiAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgfSxcbiAgICAgICAgQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRXcml0ZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlckQ4Nzg2RThBOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgQ29kZToge1xuICAgICAgICAgICAgICBTM0J1Y2tldDoge1xuICAgICAgICAgICAgICAgICdGbjo6U3ViJzogJ2Nkay1obmI2NTlmZHMtYXNzZXRzLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUzNLZXk6IGAke2Fzc2V0SGFzaH0uemlwYCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBUaW1lb3V0OiA5MDAsXG4gICAgICAgICAgICBNZW1vcnlTaXplOiAxMjgsXG4gICAgICAgICAgICBIYW5kbGVyOiAnX19lbnRyeXBvaW50X18uaGFuZGxlcicsXG4gICAgICAgICAgICBSb2xlOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlQzk1MUIxRTEnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJ1bnRpbWU6ICdub2RlanMxNC54JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIERlcGVuZHNPbjogW1xuICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGVDOTUxQjFFMScsXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgZXhwZWN0KHN0YWNrMkNmbikudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRSZWFkZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlcjQ2NjQ3QjY4OiB7XG4gICAgICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRSZWFkZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVyUm9sZTEwNTMxQkJEJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIENvZGU6IHtcbiAgICAgICAgICAgICAgUzNCdWNrZXQ6IHtcbiAgICAgICAgICAgICAgICAnRm46OlN1Yic6ICdjZGstaG5iNjU5ZmRzLWFzc2V0cy0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFMzS2V5OiBleHBlY3QuYW55KFN0cmluZyksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgSGFuZGxlcjogJ19fZW50cnlwb2ludF9fLmhhbmRsZXInLFxuICAgICAgICAgICAgTWVtb3J5U2l6ZTogMTI4LFxuICAgICAgICAgICAgUm9sZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRSZWFkZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVyUm9sZTEwNTMxQkJEJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSdW50aW1lOiAnbm9kZWpzMTQueCcsXG4gICAgICAgICAgICBUaW1lb3V0OiA5MDAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyxcbiAgICAgICAgfSxcbiAgICAgICAgQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRSZWFkZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVyUm9sZTEwNTMxQkJEOiB7XG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgICAgICBTZXJ2aWNlOiAnbGFtYmRhLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgTWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6U3ViJzogJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgUG9saWNpZXM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3NzbTpBZGRUYWdzVG9SZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3NtOlJlbW92ZVRhZ3NGcm9tUmVzb3VyY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NzbTpHZXRQYXJhbWV0ZXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnOnNzbTonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnOnBhcmFtZXRlci9jZGsvZXhwb3J0cy9TdGFjazIvKicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgUG9saWN5TmFtZTogJ0lubGluZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgfSxcbiAgICAgICAgRXhwb3J0c1JlYWRlcjhCMjQ5NTI0OiB7XG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFJlYWRlclByb3BzOiB7XG4gICAgICAgICAgICAgIGltcG9ydHM6IHtcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015UmVzb3VyY2VOYW1lJzogJ3t7cmVzb2x2ZTpzc206L2Nkay9leHBvcnRzL015UmVzb3VyY2VOYW1lfX0nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICByZWdpb246IHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHByZWZpeDogJ1N0YWNrMicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFJlYWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyNDY2NDdCNjgnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdDdXN0b206OkNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyJyxcbiAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgfSxcbiAgICAgICAgTmVzdGVkMU5lc3RlZFN0YWNrTmVzdGVkMU5lc3RlZFN0YWNrUmVzb3VyY2VDRDBBRDM2Qjoge1xuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBUZW1wbGF0ZVVSTDogJzx1bnJlc29sdmVkPicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6U3RhY2snLFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==