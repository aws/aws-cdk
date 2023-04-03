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
        const cfn = (0, util_1.toCloudFormation)(stack);
        const stack2Cfn = (0, util_1.toCloudFormation)(stack2);
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
        const cfn = (0, util_1.toCloudFormation)(stack);
        const stack2Cfn = (0, util_1.toCloudFormation)(stack2);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0LXdyaXRlci1wcm92aWRlci50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXhwb3J0LXdyaXRlci1wcm92aWRlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQStFO0FBQy9FLG9JQUF1SDtBQUN2SCxrQ0FBMkM7QUFHM0MsUUFBUSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtJQUN0QyxJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQy9CLFFBQVE7UUFDUixNQUFNLEdBQUcsR0FBRyxJQUFJLFNBQUcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2QyxNQUFNLE1BQU0sR0FBRyxJQUFJLFdBQUssQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDeEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxpQkFBVyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDcEQsSUFBSSxFQUFFLG9CQUFvQjtTQUMzQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxZQUFZLEdBQUcsSUFBSSxxQ0FBWSxDQUFDLEtBQUssRUFBRSxjQUFjLEVBQUU7WUFDM0QsTUFBTSxFQUFFLFdBQVc7U0FDcEIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxXQUFXLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRS9GLE9BQU87UUFDUCxNQUFNLEdBQUcsR0FBRyxJQUFBLHVCQUFnQixFQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sU0FBUyxHQUFHLElBQUEsdUJBQWdCLEVBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsdURBQXVE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Q0Y7cUJBQ0Y7b0JBQ0QsSUFBSSxFQUFFLGlDQUFpQztvQkFDdkMsbUJBQW1CLEVBQUUsUUFBUTtpQkFDOUI7Z0JBQ0Qsb0RBQW9ELEVBQUU7b0JBQ3BELGNBQWMsRUFBRSxRQUFRO29CQUN4QixVQUFVLEVBQUU7d0JBQ1YsV0FBVyxFQUFFLGNBQWM7cUJBQzVCO29CQUNELElBQUksRUFBRSw0QkFBNEI7b0JBQ2xDLG1CQUFtQixFQUFFLFFBQVE7aUJBQzlCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwLCBTdGFjaywgQXNzZXRTdGFnaW5nLCBDZm5SZXNvdXJjZSwgTmVzdGVkU3RhY2sgfSBmcm9tICcuLi8uLi9saWInO1xuaW1wb3J0IHsgRXhwb3J0V3JpdGVyIH0gZnJvbSAnLi4vLi4vbGliL2N1c3RvbS1yZXNvdXJjZS1wcm92aWRlci9jcm9zcy1yZWdpb24tZXhwb3J0LXByb3ZpZGVycy9leHBvcnQtd3JpdGVyLXByb3ZpZGVyJztcbmltcG9ydCB7IHRvQ2xvdWRGb3JtYXRpb24gfSBmcm9tICcuLi91dGlsJztcblxuXG5kZXNjcmliZSgnZXhwb3J0IHdyaXRlciBwcm92aWRlcicsICgpID0+IHtcbiAgdGVzdCgnYmFzaWMgY29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdTdGFjazEnKTtcbiAgICBjb25zdCBzdGFjazIgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2syJyk7XG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuUmVzb3VyY2Uoc3RhY2ssICdNeVJlc291cmNlJywge1xuICAgICAgdHlwZTogJ0N1c3RvbTo6TXlSZXNvdXJjZScsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgZXhwb3J0V3JpdGVyID0gbmV3IEV4cG9ydFdyaXRlcihzdGFjaywgJ0V4cG9ydFdyaXRlcicsIHtcbiAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgfSk7XG4gICAgY29uc3QgZXhwb3J0VmFsdWUgPSBleHBvcnRXcml0ZXIuZXhwb3J0VmFsdWUoJ015UmVzb3VyY2VOYW1lJywgcmVzb3VyY2UuZ2V0QXR0KCdhcm4nKSwgc3RhY2syKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBjZm4gPSB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKTtcbiAgICBjb25zdCBzdGFjazJDZm4gPSB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrMik7XG4gICAgY29uc3Qgc3RhZ2luZyA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdDdXN0b206OkNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlcicpPy5ub2RlLnRyeUZpbmRDaGlsZCgnU3RhZ2luZycpIGFzIEFzc2V0U3RhZ2luZztcbiAgICBjb25zdCBhc3NldEhhc2ggPSBzdGFnaW5nLmFzc2V0SGFzaDtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGV4cG9ydFZhbHVlKSkudG9FcXVhbCh7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ0V4cG9ydHNSZWFkZXI4QjI0OTUyNCcsXG4gICAgICAgICcvY2RrL2V4cG9ydHMvTXlSZXNvdXJjZU5hbWUnLFxuICAgICAgXSxcbiAgICB9KTtcbiAgICBleHBlY3QoY2ZuKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeVJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ0N1c3RvbTo6TXlSZXNvdXJjZScsXG4gICAgICAgIH0sXG4gICAgICAgIEN1c3RvbUNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGVDOTUxQjFFMToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdsYW1iZGEuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUG9saWNpZXM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICAgICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ3NzbTpEZWxldGVQYXJhbWV0ZXJzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzc206TGlzdFRhZ3NGb3JSZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3NtOkdldFBhcmFtZXRlcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NzbTpQdXRQYXJhbWV0ZXInLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6c3NtOnVzLWVhc3QtMTonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyL2Nkay9leHBvcnRzLyonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFBvbGljeU5hbWU6ICdJbmxpbmUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIE1hbmFnZWRQb2xpY3lBcm5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OlN1Yic6ICdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBFeHBvcnRXcml0ZXJBNzcwNDQ5Qzoge1xuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBXcml0ZXJQcm9wczoge1xuICAgICAgICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICAgICAgICBleHBvcnRzOiB7XG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVJlc291cmNlTmFtZSc6IHtcbiAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAnTXlSZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAgICdhcm4nLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRXcml0ZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlckQ4Nzg2RThBJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFdyaXRlcicsXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgIH0sXG4gICAgICAgIEN1c3RvbUNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXJEODc4NkU4QToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIENvZGU6IHtcbiAgICAgICAgICAgICAgUzNCdWNrZXQ6IHtcbiAgICAgICAgICAgICAgICAnRm46OlN1Yic6ICdjZGstaG5iNjU5ZmRzLWFzc2V0cy0ke0FXUzo6QWNjb3VudElkfS0ke0FXUzo6UmVnaW9ufScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFMzS2V5OiBgJHthc3NldEhhc2h9LnppcGAsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgVGltZW91dDogOTAwLFxuICAgICAgICAgICAgTWVtb3J5U2l6ZTogMTI4LFxuICAgICAgICAgICAgSGFuZGxlcjogJ19fZW50cnlwb2ludF9fLmhhbmRsZXInLFxuICAgICAgICAgICAgUm9sZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRXcml0ZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVyUm9sZUM5NTFCMUUxJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSdW50aW1lOiAnbm9kZWpzMTQueCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlQzk1MUIxRTEnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIGV4cGVjdChzdGFjazJDZm4pLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIEN1c3RvbUNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXI0NjY0N0I2ODoge1xuICAgICAgICAgIERlcGVuZHNPbjogW1xuICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGUxMDUzMUJCRCcsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBDb2RlOiB7XG4gICAgICAgICAgICAgIFMzQnVja2V0OiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTdWInOiAnY2RrLWhuYjY1OWZkcy1hc3NldHMtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBTM0tleTogZXhwZWN0LmFueShTdHJpbmcpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIEhhbmRsZXI6ICdfX2VudHJ5cG9pbnRfXy5oYW5kbGVyJyxcbiAgICAgICAgICAgIE1lbW9yeVNpemU6IDEyOCxcbiAgICAgICAgICAgIFJvbGU6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGUxMDUzMUJCRCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUnVudGltZTogJ25vZGVqczE0LngnLFxuICAgICAgICAgICAgVGltZW91dDogOTAwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVHlwZTogJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbicsXG4gICAgICAgIH0sXG4gICAgICAgIEN1c3RvbUNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGUxMDUzMUJCRDoge1xuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICAgICAgU2VydmljZTogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIE1hbmFnZWRQb2xpY3lBcm5zOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OlN1Yic6ICdhcm46JHtBV1M6OlBhcnRpdGlvbn06aWFtOjphd3M6cG9saWN5L3NlcnZpY2Utcm9sZS9BV1NMYW1iZGFCYXNpY0V4ZWN1dGlvblJvbGUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFBvbGljaWVzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdzc206QWRkVGFnc1RvUmVzb3VyY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NzbTpSZW1vdmVUYWdzRnJvbVJlc291cmNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzc206R2V0UGFyYW1ldGVycycsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzpzc206JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzpwYXJhbWV0ZXIvY2RrL2V4cG9ydHMvU3RhY2syLyonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFBvbGljeU5hbWU6ICdJbmxpbmUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdBV1M6OklBTTo6Um9sZScsXG4gICAgICAgIH0sXG4gICAgICAgIEV4cG9ydHNSZWFkZXI4QjI0OTUyNDoge1xuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBSZWFkZXJQcm9wczoge1xuICAgICAgICAgICAgICBpbXBvcnRzOiB7XG4gICAgICAgICAgICAgICAgJy9jZGsvZXhwb3J0cy9NeVJlc291cmNlTmFtZSc6ICd7e3Jlc29sdmU6c3NtOi9jZGsvZXhwb3J0cy9NeVJlc291cmNlTmFtZX19JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcmVnaW9uOiB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBwcmVmaXg6ICdTdGFjazInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFNlcnZpY2VUb2tlbjoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRSZWFkZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVySGFuZGxlcjQ2NjQ3QjY4JyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAnQ3VzdG9tOjpDcm9zc1JlZ2lvbkV4cG9ydFJlYWRlcicsXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aGVuIGNvbnN1bWVyIGlzIGEgbmVzdGVkIHN0YWNrLCBFeHBvcnRSZWFkZXIgaXMgY3JlYXRlZCBpbiB0aGUgcGFyZW50IHN0YWNrJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrMScpO1xuICAgIGNvbnN0IHN0YWNrMiA9IG5ldyBTdGFjayhhcHAsICdTdGFjazInKTtcbiAgICBjb25zdCBuZXN0ZWQyID0gbmV3IE5lc3RlZFN0YWNrKHN0YWNrMiwgJ05lc3RlZDEnKTtcbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiAnQ3VzdG9tOjpNeVJlc291cmNlJyxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBleHBvcnRXcml0ZXIgPSBuZXcgRXhwb3J0V3JpdGVyKHN0YWNrLCAnRXhwb3J0V3JpdGVyJywge1xuICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICB9KTtcbiAgICBjb25zdCBleHBvcnRWYWx1ZSA9IGV4cG9ydFdyaXRlci5leHBvcnRWYWx1ZSgnTXlSZXNvdXJjZU5hbWUnLCByZXNvdXJjZS5nZXRBdHQoJ2FybicpLCBuZXN0ZWQyKTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBjZm4gPSB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKTtcbiAgICBjb25zdCBzdGFjazJDZm4gPSB0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrMik7XG4gICAgY29uc3Qgc3RhZ2luZyA9IHN0YWNrLm5vZGUudHJ5RmluZENoaWxkKCdDdXN0b206OkNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlcicpPy5ub2RlLnRyeUZpbmRDaGlsZCgnU3RhZ2luZycpIGFzIEFzc2V0U3RhZ2luZztcbiAgICBjb25zdCBhc3NldEhhc2ggPSBzdGFnaW5nLmFzc2V0SGFzaDtcblxuICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGV4cG9ydFZhbHVlKSkudG9FcXVhbCh7XG4gICAgICAnRm46OkdldEF0dCc6IFsnRXhwb3J0c1JlYWRlcjhCMjQ5NTI0JywgJy9jZGsvZXhwb3J0cy9NeVJlc291cmNlTmFtZSddLFxuICAgIH0pO1xuICAgIGV4cGVjdChjZm4pLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15UmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnQ3VzdG9tOjpNeVJlc291cmNlJyxcbiAgICAgICAgfSxcbiAgICAgICAgQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRXcml0ZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVyUm9sZUM5NTFCMUUxOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICAgICAgU2VydmljZTogJ2xhbWJkYS5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBQb2xpY2llczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3NtOkRlbGV0ZVBhcmFtZXRlcnMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3NzbTpMaXN0VGFnc0ZvclJlc291cmNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzc206R2V0UGFyYW1ldGVycycsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3NtOlB1dFBhcmFtZXRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzpzc206dXMtZWFzdC0xOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzpwYXJhbWV0ZXIvY2RrL2V4cG9ydHMvKicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgUG9saWN5TmFtZTogJ0lubGluZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgTWFuYWdlZFBvbGljeUFybnM6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6U3ViJzogJ2Fybjoke0FXUzo6UGFydGl0aW9ufTppYW06OmF3czpwb2xpY3kvc2VydmljZS1yb2xlL0FXU0xhbWJkYUJhc2ljRXhlY3V0aW9uUm9sZScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIEV4cG9ydFdyaXRlckE3NzA0NDlDOiB7XG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFdyaXRlclByb3BzOiB7XG4gICAgICAgICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgICAgICAgIGV4cG9ydHM6IHtcbiAgICAgICAgICAgICAgICAnL2Nkay9leHBvcnRzL015UmVzb3VyY2VOYW1lJzoge1xuICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICdNeVJlc291cmNlJyxcbiAgICAgICAgICAgICAgICAgICAgJ2FybicsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXJEODc4NkU4QScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVHlwZTogJ0N1c3RvbTo6Q3Jvc3NSZWdpb25FeHBvcnRXcml0ZXInLFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICB9LFxuICAgICAgICBDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFdyaXRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyRDg3ODZFOEE6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBDb2RlOiB7XG4gICAgICAgICAgICAgIFMzQnVja2V0OiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTdWInOiAnY2RrLWhuYjY1OWZkcy1hc3NldHMtJHtBV1M6OkFjY291bnRJZH0tJHtBV1M6OlJlZ2lvbn0nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBTM0tleTogYCR7YXNzZXRIYXNofS56aXBgLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFRpbWVvdXQ6IDkwMCxcbiAgICAgICAgICAgIE1lbW9yeVNpemU6IDEyOCxcbiAgICAgICAgICAgIEhhbmRsZXI6ICdfX2VudHJ5cG9pbnRfXy5oYW5kbGVyJyxcbiAgICAgICAgICAgIFJvbGU6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0V3JpdGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlclJvbGVDOTUxQjFFMScsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUnVudGltZTogJ25vZGVqczE0LngnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRGVwZW5kc09uOiBbXG4gICAgICAgICAgICAnQ3VzdG9tQ3Jvc3NSZWdpb25FeHBvcnRXcml0ZXJDdXN0b21SZXNvdXJjZVByb3ZpZGVyUm9sZUM5NTFCMUUxJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBleHBlY3Qoc3RhY2syQ2ZuKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFJlYWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJIYW5kbGVyNDY2NDdCNjg6IHtcbiAgICAgICAgICBEZXBlbmRzT246IFtcbiAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFJlYWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlMTA1MzFCQkQnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgQ29kZToge1xuICAgICAgICAgICAgICBTM0J1Y2tldDoge1xuICAgICAgICAgICAgICAgICdGbjo6U3ViJzogJ2Nkay1obmI2NTlmZHMtYXNzZXRzLSR7QVdTOjpBY2NvdW50SWR9LSR7QVdTOjpSZWdpb259JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUzNLZXk6IGV4cGVjdC5hbnkoU3RyaW5nKSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBIYW5kbGVyOiAnX19lbnRyeXBvaW50X18uaGFuZGxlcicsXG4gICAgICAgICAgICBNZW1vcnlTaXplOiAxMjgsXG4gICAgICAgICAgICBSb2xlOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFJlYWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlMTA1MzFCQkQnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFJ1bnRpbWU6ICdub2RlanMxNC54JyxcbiAgICAgICAgICAgIFRpbWVvdXQ6IDkwMCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLFxuICAgICAgICB9LFxuICAgICAgICBDdXN0b21Dcm9zc1JlZ2lvbkV4cG9ydFJlYWRlckN1c3RvbVJlc291cmNlUHJvdmlkZXJSb2xlMTA1MzFCQkQ6IHtcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdsYW1iZGEuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBNYW5hZ2VkUG9saWN5QXJuczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpTdWInOiAnYXJuOiR7QVdTOjpQYXJ0aXRpb259OmlhbTo6YXdzOnBvbGljeS9zZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBQb2xpY2llczogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3NtOkFkZFRhZ3NUb1Jlc291cmNlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdzc206UmVtb3ZlVGFnc0Zyb21SZXNvdXJjZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAnc3NtOkdldFBhcmFtZXRlcnMnLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6c3NtOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyL2Nkay9leHBvcnRzL1N0YWNrMi8qJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBQb2xpY3lOYW1lOiAnSW5saW5lJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICB9LFxuICAgICAgICBFeHBvcnRzUmVhZGVyOEIyNDk1MjQ6IHtcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgUmVhZGVyUHJvcHM6IHtcbiAgICAgICAgICAgICAgaW1wb3J0czoge1xuICAgICAgICAgICAgICAgICcvY2RrL2V4cG9ydHMvTXlSZXNvdXJjZU5hbWUnOiAne3tyZXNvbHZlOnNzbTovY2RrL2V4cG9ydHMvTXlSZXNvdXJjZU5hbWV9fScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHJlZ2lvbjoge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcHJlZml4OiAnU3RhY2syJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZXJ2aWNlVG9rZW46IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ0N1c3RvbUNyb3NzUmVnaW9uRXhwb3J0UmVhZGVyQ3VzdG9tUmVzb3VyY2VQcm92aWRlckhhbmRsZXI0NjY0N0I2OCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVHlwZTogJ0N1c3RvbTo6Q3Jvc3NSZWdpb25FeHBvcnRSZWFkZXInLFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICB9LFxuICAgICAgICBOZXN0ZWQxTmVzdGVkU3RhY2tOZXN0ZWQxTmVzdGVkU3RhY2tSZXNvdXJjZUNEMEFEMzZCOiB7XG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFRlbXBsYXRlVVJMOiAnPHVucmVzb2x2ZWQ+JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFR5cGU6ICdBV1M6OkNsb3VkRm9ybWF0aW9uOjpTdGFjaycsXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19