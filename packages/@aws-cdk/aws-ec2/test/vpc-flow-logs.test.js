"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const logs = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('vpc flow logs', () => {
    test('with defaults set, it successfully creates with cloudwatch logs destination', () => {
        const stack = getTestStack();
        new lib_1.FlowLog(stack, 'FlowLogs', {
            resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
            ResourceType: 'NetworkInterface',
            TrafficType: 'ALL',
            ResourceId: 'eni-123455',
            DeliverLogsPermissionArn: {
                'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
            },
            LogGroupName: {
                Ref: 'FlowLogsLogGroup9853A85F',
            },
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 1);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 0);
    });
    test('with cloudwatch logs as the destination, allows use of existing resources', () => {
        const stack = getTestStack();
        new lib_1.FlowLog(stack, 'FlowLogs', {
            resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
            destination: lib_1.FlowLogDestination.toCloudWatchLogs(new logs.LogGroup(stack, 'TestLogGroup', {
                retention: logs.RetentionDays.FIVE_DAYS,
            }), new iam.Role(stack, 'TestRole', {
                roleName: 'TestName',
                assumedBy: new iam.ServicePrincipal('vpc-flow-logs.amazonaws.com'),
            })),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Logs::LogGroup', {
            RetentionInDays: 5,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            RoleName: 'TestName',
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 0);
    });
    test('with s3 as the destination, allows use of existing resources', () => {
        const stack = getTestStack();
        new lib_1.FlowLog(stack, 'FlowLogs', {
            resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
            destination: lib_1.FlowLogDestination.toS3(new s3.Bucket(stack, 'TestBucket', {
                bucketName: 'testbucket',
            })),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
            DestinationOptions: assertions_1.Match.absent(),
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            BucketName: 'testbucket',
        });
    });
    test('allows setting destination options', () => {
        const stack = getTestStack();
        new lib_1.FlowLog(stack, 'FlowLogs', {
            resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
            destination: lib_1.FlowLogDestination.toS3(undefined, undefined, {
                hiveCompatiblePartitions: true,
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
            ResourceType: 'NetworkInterface',
            TrafficType: 'ALL',
            ResourceId: 'eni-123456',
            DestinationOptions: {
                hiveCompatiblePartitions: true,
                fileFormat: 'plain-text',
                perHourPartition: false,
            },
            LogDestination: {
                'Fn::GetAtt': [
                    'FlowLogsBucket87F67F60',
                    'Arn',
                ],
            },
            LogDestinationType: 's3',
        });
    });
    describe('s3 bucket policy - @aws-cdk/aws-s3:createDefaultLoggingPolicy feature flag', () => {
        test('creates default S3 bucket policy with options', () => {
            const stack = new core_1.Stack();
            stack.node.setContext('@aws-cdk/aws-s3:createDefaultLoggingPolicy', true);
            new lib_1.FlowLog(stack, 'FlowLogs', {
                resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
                destination: lib_1.FlowLogDestination.toS3(undefined, 'custom-prefix', {
                    hiveCompatiblePartitions: true,
                }),
            });
            const template = assertions_1.Template.fromStack(stack);
            template.hasResourceProperties('AWS::S3::BucketPolicy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:PutObject',
                            Effect: 'Allow',
                            Condition: {
                                StringEquals: {
                                    's3:x-amz-acl': 'bucket-owner-full-control',
                                    'aws:SourceAccount': {
                                        Ref: 'AWS::AccountId',
                                    },
                                },
                                ArnLike: {
                                    'aws:SourceArn': {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {
                                                    Ref: 'AWS::Partition',
                                                },
                                                ':logs:',
                                                {
                                                    Ref: 'AWS::Region',
                                                },
                                                ':',
                                                {
                                                    Ref: 'AWS::AccountId',
                                                },
                                                ':*',
                                            ],
                                        ],
                                    },
                                },
                            },
                            Principal: {
                                Service: 'delivery.logs.amazonaws.com',
                            },
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': [
                                                'FlowLogsBucket87F67F60',
                                                'Arn',
                                            ],
                                        },
                                        '/custom-prefix/AWSLogs/aws-account-id=',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        '/*',
                                    ],
                                ],
                            },
                        },
                        {
                            Action: [
                                's3:GetBucketAcl',
                                's3:ListBucket',
                            ],
                            Condition: {
                                StringEquals: {
                                    'aws:SourceAccount': {
                                        Ref: 'AWS::AccountId',
                                    },
                                },
                                ArnLike: {
                                    'aws:SourceArn': {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {
                                                    Ref: 'AWS::Partition',
                                                },
                                                ':logs:',
                                                {
                                                    Ref: 'AWS::Region',
                                                },
                                                ':',
                                                {
                                                    Ref: 'AWS::AccountId',
                                                },
                                                ':*',
                                            ],
                                        ],
                                    },
                                },
                            },
                            Effect: 'Allow',
                            Principal: {
                                Service: 'delivery.logs.amazonaws.com',
                            },
                            Resource: {
                                'Fn::GetAtt': [
                                    'FlowLogsBucket87F67F60',
                                    'Arn',
                                ],
                            },
                        },
                    ],
                },
            });
        });
        test('creates default S3 bucket policy', () => {
            const stack = new core_1.Stack();
            stack.node.setContext('@aws-cdk/aws-s3:createDefaultLoggingPolicy', true);
            new lib_1.FlowLog(stack, 'FlowLogs', {
                resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
                destination: lib_1.FlowLogDestination.toS3(),
            });
            const template = assertions_1.Template.fromStack(stack);
            template.hasResourceProperties('AWS::S3::BucketPolicy', {
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:PutObject',
                            Effect: 'Allow',
                            Condition: {
                                StringEquals: {
                                    's3:x-amz-acl': 'bucket-owner-full-control',
                                    'aws:SourceAccount': {
                                        Ref: 'AWS::AccountId',
                                    },
                                },
                                ArnLike: {
                                    'aws:SourceArn': {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {
                                                    Ref: 'AWS::Partition',
                                                },
                                                ':logs:',
                                                {
                                                    Ref: 'AWS::Region',
                                                },
                                                ':',
                                                {
                                                    Ref: 'AWS::AccountId',
                                                },
                                                ':*',
                                            ],
                                        ],
                                    },
                                },
                            },
                            Principal: {
                                Service: 'delivery.logs.amazonaws.com',
                            },
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': [
                                                'FlowLogsBucket87F67F60',
                                                'Arn',
                                            ],
                                        },
                                        '/AWSLogs/',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        '/*',
                                    ],
                                ],
                            },
                        },
                        {
                            Action: [
                                's3:GetBucketAcl',
                                's3:ListBucket',
                            ],
                            Condition: {
                                StringEquals: {
                                    'aws:SourceAccount': {
                                        Ref: 'AWS::AccountId',
                                    },
                                },
                                ArnLike: {
                                    'aws:SourceArn': {
                                        'Fn::Join': [
                                            '',
                                            [
                                                'arn:',
                                                {
                                                    Ref: 'AWS::Partition',
                                                },
                                                ':logs:',
                                                {
                                                    Ref: 'AWS::Region',
                                                },
                                                ':',
                                                {
                                                    Ref: 'AWS::AccountId',
                                                },
                                                ':*',
                                            ],
                                        ],
                                    },
                                },
                            },
                            Effect: 'Allow',
                            Principal: {
                                Service: 'delivery.logs.amazonaws.com',
                            },
                            Resource: {
                                'Fn::GetAtt': [
                                    'FlowLogsBucket87F67F60',
                                    'Arn',
                                ],
                            },
                        },
                    ],
                },
            });
        });
        test('adds necessary dependencies', () => {
            const stack = new core_1.Stack();
            stack.node.setContext('@aws-cdk/aws-s3:createDefaultLoggingPolicy', true);
            const bucket = new s3.Bucket(stack, 'Bucket', {
                removalPolicy: core_1.RemovalPolicy.DESTROY,
                autoDeleteObjects: true,
            });
            new lib_1.FlowLog(stack, 'FlowLogs', {
                resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
                destination: lib_1.FlowLogDestination.toS3(bucket),
            });
            const template = assertions_1.Template.fromStack(stack);
            template.hasResource('AWS::EC2::FlowLog', {
                Properties: assertions_1.Match.anyValue(),
                DependsOn: [
                    'BucketAutoDeleteObjectsCustomResourceBAFD23C2',
                    'BucketPolicyE9A3008A',
                ],
            });
        });
        test('without future flag, does not create default bucket policy', () => {
            const stack = new core_1.Stack();
            new lib_1.FlowLog(stack, 'FlowLogs', {
                resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
                destination: lib_1.FlowLogDestination.toS3(),
            });
            assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::BucketPolicy', 0);
        });
    });
    test('with s3 as the destination, allows use of key prefix', () => {
        const stack = getTestStack();
        new lib_1.FlowLog(stack, 'FlowLogs', {
            resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
            destination: lib_1.FlowLogDestination.toS3(new s3.Bucket(stack, 'TestBucket', {
                bucketName: 'testbucket',
            }), 'FlowLogs/'),
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
            BucketName: 'testbucket',
        });
    });
    test('with s3 as the destination and all the defaults set, it successfully creates all the resources', () => {
        const stack = getTestStack();
        new lib_1.FlowLog(stack, 'FlowLogs', {
            resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123456'),
            destination: lib_1.FlowLogDestination.toS3(),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
            ResourceType: 'NetworkInterface',
            TrafficType: 'ALL',
            ResourceId: 'eni-123456',
            LogDestination: {
                'Fn::GetAtt': ['FlowLogsBucket87F67F60', 'Arn'],
            },
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Logs::LogGroup', 0);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::S3::Bucket', 1);
    });
    test('create with vpc', () => {
        const stack = getTestStack();
        new lib_1.Vpc(stack, 'VPC', {
            flowLogs: {
                flowLogs: {},
            },
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
            ResourceType: 'VPC',
            TrafficType: 'ALL',
            ResourceId: {
                Ref: 'VPCB9E5F0B4',
            },
            DeliverLogsPermissionArn: {
                'Fn::GetAtt': ['VPCflowLogsIAMRole9D21E1A6', 'Arn'],
            },
            LogGroupName: {
                Ref: 'VPCflowLogsLogGroupE900F980',
            },
        });
    });
    test('add to vpc', () => {
        const stack = getTestStack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        vpc.addFlowLog('FlowLogs');
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
            ResourceType: 'VPC',
            TrafficType: 'ALL',
            ResourceId: {
                Ref: 'VPCB9E5F0B4',
            },
            DeliverLogsPermissionArn: {
                'Fn::GetAtt': ['VPCFlowLogsIAMRole55343234', 'Arn'],
            },
            LogGroupName: {
                Ref: 'VPCFlowLogsLogGroupF48E1B0A',
            },
        });
    });
    test('flowlog has defaultchild', () => {
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        const flowlog = new lib_1.FlowLog(stack, 'FlowLog', {
            resourceType: lib_1.FlowLogResourceType.fromVpc(vpc),
        });
        expect(flowlog.node.defaultChild).toBeDefined();
    });
    test('flowlog change maxAggregationInterval', () => {
        const stack = new core_1.Stack();
        const vpc = new lib_1.Vpc(stack, 'VPC');
        new lib_1.FlowLog(stack, 'FlowLog', {
            resourceType: lib_1.FlowLogResourceType.fromVpc(vpc),
            maxAggregationInterval: lib_1.FlowLogMaxAggregationInterval.ONE_MINUTE,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
            ResourceType: 'VPC',
            TrafficType: 'ALL',
            DeliverLogsPermissionArn: {
                'Fn::GetAtt': ['FlowLogIAMRoleDCBD2EB4', 'Arn'],
            },
            LogDestinationType: 'cloud-watch-logs',
            LogGroupName: {
                Ref: 'FlowLogLogGroupAFFB9038',
            },
            MaxAggregationInterval: 60,
        });
    });
});
test('add to vpc with maxAggregationInterval', () => {
    const stack = getTestStack();
    const vpc = new lib_1.Vpc(stack, 'VPC');
    vpc.addFlowLog('FlowLogs', {
        maxAggregationInterval: lib_1.FlowLogMaxAggregationInterval.ONE_MINUTE,
    });
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
        ResourceType: 'VPC',
        TrafficType: 'ALL',
        ResourceId: {
            Ref: 'VPCB9E5F0B4',
        },
        DeliverLogsPermissionArn: {
            'Fn::GetAtt': ['VPCFlowLogsIAMRole55343234', 'Arn'],
        },
        LogGroupName: {
            Ref: 'VPCFlowLogsLogGroupF48E1B0A',
        },
        MaxAggregationInterval: 60,
    });
});
test('with custom log format set, it successfully creates with cloudwatch log destination', () => {
    const stack = getTestStack();
    new lib_1.FlowLog(stack, 'FlowLogs', {
        resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
        logFormat: [
            lib_1.LogFormat.SRC_PORT,
            lib_1.LogFormat.DST_PORT,
        ],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
        ResourceType: 'NetworkInterface',
        TrafficType: 'ALL',
        ResourceId: 'eni-123455',
        DeliverLogsPermissionArn: {
            'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
        },
        LogFormat: '${srcport} ${dstport}',
        LogGroupName: {
            Ref: 'FlowLogsLogGroup9853A85F',
        },
    });
});
test('log format for built-in types is correct', () => {
    const stack = getTestStack();
    const vpc = new lib_1.Vpc(stack, 'TestVpc');
    new lib_1.FlowLog(stack, 'FlowLogs1', {
        resourceType: lib_1.FlowLogResourceType.fromVpc(vpc),
        logFormat: [
            lib_1.LogFormat.VERSION,
            lib_1.LogFormat.ACCOUNT_ID,
            lib_1.LogFormat.INTERFACE_ID,
            lib_1.LogFormat.SRC_ADDR,
            lib_1.LogFormat.DST_ADDR,
            lib_1.LogFormat.SRC_PORT,
            lib_1.LogFormat.DST_PORT,
            lib_1.LogFormat.PROTOCOL,
            lib_1.LogFormat.PACKETS,
            lib_1.LogFormat.BYTES,
            lib_1.LogFormat.START_TIMESTAMP,
            lib_1.LogFormat.END_TIMESTAMP,
            lib_1.LogFormat.ACTION,
            lib_1.LogFormat.LOG_STATUS,
            lib_1.LogFormat.VPC_ID,
            lib_1.LogFormat.SUBNET_ID,
            lib_1.LogFormat.INSTANCE_ID,
            lib_1.LogFormat.TCP_FLAGS,
            lib_1.LogFormat.TRAFFIC_TYPE,
            lib_1.LogFormat.PKT_SRC_ADDR,
            lib_1.LogFormat.PKT_DST_ADDR,
            lib_1.LogFormat.REGION,
            lib_1.LogFormat.AZ_ID,
            lib_1.LogFormat.SUBLOCATION_TYPE,
            lib_1.LogFormat.SUBLOCATION_ID,
            lib_1.LogFormat.PKT_SRC_AWS_SERVICE,
            lib_1.LogFormat.PKT_DST_AWS_SERVICE,
            lib_1.LogFormat.FLOW_DIRECTION,
            lib_1.LogFormat.TRAFFIC_PATH,
        ],
    });
    const template = assertions_1.Template.fromStack(stack);
    template.hasResourceProperties('AWS::EC2::FlowLog', {
        LogFormat: ('${version} ${account-id} ${interface-id} ${srcaddr} ${dstaddr} ${srcport} '
            + '${dstport} ${protocol} ${packets} ${bytes} ${start} ${end} ${action} ${log-status} '
            + '${vpc-id} ${subnet-id} ${instance-id} ${tcp-flags} ${type} ${pkt-srcaddr} '
            + '${pkt-dstaddr} ${region} ${az-id} ${sublocation-type} ${sublocation-id} '
            + '${pkt-src-aws-service} ${pkt-dst-aws-service} ${flow-direction} ${traffic-path}'),
    });
});
test('with custom log format set empty, it not creates with cloudwatch log destination', () => {
    const stack = getTestStack();
    new lib_1.FlowLog(stack, 'FlowLogs', {
        resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
        logFormat: [],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
        ResourceType: 'NetworkInterface',
        TrafficType: 'ALL',
        ResourceId: 'eni-123455',
        DeliverLogsPermissionArn: {
            'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
        },
        LogGroupName: {
            Ref: 'FlowLogsLogGroup9853A85F',
        },
    });
});
function getTestStack() {
    return new core_1.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
    });
}
test('with custom log format set all default field, it not creates with cloudwatch log destination', () => {
    const stack = getTestStack();
    new lib_1.FlowLog(stack, 'FlowLogs', {
        resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
        logFormat: [
            lib_1.LogFormat.VERSION,
            lib_1.LogFormat.ALL_DEFAULT_FIELDS,
        ],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
        ResourceType: 'NetworkInterface',
        TrafficType: 'ALL',
        ResourceId: 'eni-123455',
        DeliverLogsPermissionArn: {
            'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
        },
        LogFormat: '${version} ${version} ${account-id} ${interface-id} ${srcaddr} ${dstaddr} ${srcport} ${dstport} ${protocol} ${packets} ${bytes} ${start} ${end} ${action} ${log-status}',
        LogGroupName: {
            Ref: 'FlowLogsLogGroup9853A85F',
        },
    });
});
test('with custom log format set custom, it not creates with cloudwatch log destination', () => {
    const stack = getTestStack();
    new lib_1.FlowLog(stack, 'FlowLogs', {
        resourceType: lib_1.FlowLogResourceType.fromNetworkInterfaceId('eni-123455'),
        logFormat: [
            lib_1.LogFormat.SRC_PORT,
            lib_1.LogFormat.custom('${new-field}'),
        ],
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::FlowLog', {
        ResourceType: 'NetworkInterface',
        TrafficType: 'ALL',
        ResourceId: 'eni-123455',
        DeliverLogsPermissionArn: {
            'Fn::GetAtt': ['FlowLogsIAMRoleF18F4209', 'Arn'],
        },
        LogFormat: '${srcport} ${new-field}',
        LogGroupName: {
            Ref: 'FlowLogsLogGroup9853A85F',
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLWZsb3ctbG9ncy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidnBjLWZsb3ctbG9ncy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHdDQUF3QztBQUN4QywwQ0FBMEM7QUFDMUMsc0NBQXNDO0FBQ3RDLHdDQUFxRDtBQUNyRCxnQ0FBeUg7QUFFekgsUUFBUSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7SUFDN0IsSUFBSSxDQUFDLDZFQUE2RSxFQUFFLEdBQUcsRUFBRTtRQUN2RixNQUFNLEtBQUssR0FBRyxZQUFZLEVBQUUsQ0FBQztRQUU3QixJQUFJLGFBQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQzdCLFlBQVksRUFBRSx5QkFBbUIsQ0FBQyxzQkFBc0IsQ0FBQyxZQUFZLENBQUM7U0FDdkUsQ0FBQyxDQUFDO1FBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsbUJBQW1CLEVBQUU7WUFDbkUsWUFBWSxFQUFFLGtCQUFrQjtZQUNoQyxXQUFXLEVBQUUsS0FBSztZQUNsQixVQUFVLEVBQUUsWUFBWTtZQUN4Qix3QkFBd0IsRUFBRTtnQkFDeEIsWUFBWSxFQUFFLENBQUMseUJBQXlCLEVBQUUsS0FBSyxDQUFDO2FBQ2pEO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLEdBQUcsRUFBRSwwQkFBMEI7YUFDaEM7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEUscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQy9ELHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLENB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QixDQUFDLG1CQUFtQixFQUFFO1FBQ25FLFlBQVksRUFBRSxrQkFBa0I7UUFDaEMsV0FBVyxFQUFFLEtBQUs7UUFDbEIsVUFBVSxFQUFFLFlBQVk7UUFDeEIsd0JBQXdCLEVBQUU7WUFDeEIsWUFBWSxFQUFFLENBQUMseUJBQXlCLEVBQUUsS0FBSyxDQUFDO1NBQ2pEO1FBQ0QsU0FBUyxFQUFFLHlCQUF5QjtRQUNwQyxZQUFZLEVBQUU7WUFDWixHQUFHLEVBQUUsMEJBQTBCO1NBQ2hDO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSwgTWF0Y2ggfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnQGF3cy1jZGsvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IFJlbW92YWxQb2xpY3ksIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBGbG93TG9nLCBGbG93TG9nRGVzdGluYXRpb24sIEZsb3dMb2dSZXNvdXJjZVR5cGUsIEZsb3dMb2dNYXhBZ2dyZWdhdGlvbkludGVydmFsLCBMb2dGb3JtYXQsIFZwYyB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCd2cGMgZmxvdyBsb2dzJywgKCkgPT4ge1xuICB0ZXN0KCd3aXRoIGRlZmF1bHRzIHNldCwgaXQgc3VjY2Vzc2Z1bGx5IGNyZWF0ZXMgd2l0aCBjbG91ZHdhdGNoIGxvZ3MgZGVzdGluYXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBnZXRUZXN0U3RhY2soKTtcblxuICAgIG5ldyBGbG93TG9nKHN0YWNrLCAnRmxvd0xvZ3MnLCB7XG4gICAgICByZXNvdXJjZVR5cGU6IEZsb3dMb2dSZXNvdXJjZVR5cGUuZnJvbU5ldHdvcmtJbnRlcmZhY2VJZCgnZW5pLTEyMzQ1NScpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpGbG93TG9nJywge1xuICAgICAgUmVzb3VyY2VUeXBlOiAnTmV0d29ya0ludGVyZmFjZScsXG4gICAgICBUcmFmZmljVHlwZTogJ0FMTCcsXG4gICAgICBSZXNvdXJjZUlkOiAnZW5pLTEyMzQ1NScsXG4gICAgICBEZWxpdmVyTG9nc1Blcm1pc3Npb25Bcm46IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0Zsb3dMb2dzSUFNUm9sZUYxOEY0MjA5JywgJ0FybiddLFxuICAgICAgfSxcbiAgICAgIExvZ0dyb3VwTmFtZToge1xuICAgICAgICBSZWY6ICdGbG93TG9nc0xvZ0dyb3VwOTg1M0E4NUYnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkxvZ3M6OkxvZ0dyb3VwJywgMSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6SUFNOjpSb2xlJywgMSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIDApO1xuXG4gIH0pO1xuICB0ZXN0KCd3aXRoIGNsb3Vkd2F0Y2ggbG9ncyBhcyB0aGUgZGVzdGluYXRpb24sIGFsbG93cyB1c2Ugb2YgZXhpc3RpbmcgcmVzb3VyY2VzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICBuZXcgRmxvd0xvZyhzdGFjaywgJ0Zsb3dMb2dzJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21OZXR3b3JrSW50ZXJmYWNlSWQoJ2VuaS0xMjM0NTYnKSxcbiAgICAgIGRlc3RpbmF0aW9uOiBGbG93TG9nRGVzdGluYXRpb24udG9DbG91ZFdhdGNoTG9ncyhcbiAgICAgICAgbmV3IGxvZ3MuTG9nR3JvdXAoc3RhY2ssICdUZXN0TG9nR3JvdXAnLCB7XG4gICAgICAgICAgcmV0ZW50aW9uOiBsb2dzLlJldGVudGlvbkRheXMuRklWRV9EQVlTLFxuICAgICAgICB9KSxcbiAgICAgICAgbmV3IGlhbS5Sb2xlKHN0YWNrLCAnVGVzdFJvbGUnLCB7XG4gICAgICAgICAgcm9sZU5hbWU6ICdUZXN0TmFtZScsXG4gICAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3ZwYy1mbG93LWxvZ3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICB9KSxcbiAgICAgICksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMb2dzOjpMb2dHcm91cCcsIHtcbiAgICAgIFJldGVudGlvbkluRGF5czogNSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgICBSb2xlTmFtZTogJ1Rlc3ROYW1lJyxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpTMzo6QnVja2V0JywgMCk7XG5cbiAgfSk7XG4gIHRlc3QoJ3dpdGggczMgYXMgdGhlIGRlc3RpbmF0aW9uLCBhbGxvd3MgdXNlIG9mIGV4aXN0aW5nIHJlc291cmNlcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgbmV3IEZsb3dMb2coc3RhY2ssICdGbG93TG9ncycsIHtcbiAgICAgIHJlc291cmNlVHlwZTogRmxvd0xvZ1Jlc291cmNlVHlwZS5mcm9tTmV0d29ya0ludGVyZmFjZUlkKCdlbmktMTIzNDU2JyksXG4gICAgICBkZXN0aW5hdGlvbjogRmxvd0xvZ0Rlc3RpbmF0aW9uLnRvUzMoXG4gICAgICAgIG5ldyBzMy5CdWNrZXQoc3RhY2ssICdUZXN0QnVja2V0Jywge1xuICAgICAgICAgIGJ1Y2tldE5hbWU6ICd0ZXN0YnVja2V0JyxcbiAgICAgICAgfSksXG4gICAgICApLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpGbG93TG9nJywge1xuICAgICAgRGVzdGluYXRpb25PcHRpb25zOiBNYXRjaC5hYnNlbnQoKSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpMb2dzOjpMb2dHcm91cCcsIDApO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6Um9sZScsIDApO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlMzOjpCdWNrZXQnLCB7XG4gICAgICBCdWNrZXROYW1lOiAndGVzdGJ1Y2tldCcsXG4gICAgfSk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnYWxsb3dzIHNldHRpbmcgZGVzdGluYXRpb24gb3B0aW9ucycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgbmV3IEZsb3dMb2coc3RhY2ssICdGbG93TG9ncycsIHtcbiAgICAgIHJlc291cmNlVHlwZTogRmxvd0xvZ1Jlc291cmNlVHlwZS5mcm9tTmV0d29ya0ludGVyZmFjZUlkKCdlbmktMTIzNDU2JyksXG4gICAgICBkZXN0aW5hdGlvbjogRmxvd0xvZ0Rlc3RpbmF0aW9uLnRvUzModW5kZWZpbmVkLCB1bmRlZmluZWQsIHtcbiAgICAgICAgaGl2ZUNvbXBhdGlibGVQYXJ0aXRpb25zOiB0cnVlLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkZsb3dMb2cnLCB7XG4gICAgICBSZXNvdXJjZVR5cGU6ICdOZXR3b3JrSW50ZXJmYWNlJyxcbiAgICAgIFRyYWZmaWNUeXBlOiAnQUxMJyxcbiAgICAgIFJlc291cmNlSWQ6ICdlbmktMTIzNDU2JyxcbiAgICAgIERlc3RpbmF0aW9uT3B0aW9uczoge1xuICAgICAgICBoaXZlQ29tcGF0aWJsZVBhcnRpdGlvbnM6IHRydWUsXG4gICAgICAgIGZpbGVGb3JtYXQ6ICdwbGFpbi10ZXh0JyxcbiAgICAgICAgcGVySG91clBhcnRpdGlvbjogZmFsc2UsXG4gICAgICB9LFxuICAgICAgTG9nRGVzdGluYXRpb246IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ0Zsb3dMb2dzQnVja2V0ODdGNjdGNjAnLFxuICAgICAgICAgICdBcm4nLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIExvZ0Rlc3RpbmF0aW9uVHlwZTogJ3MzJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3MzIGJ1Y2tldCBwb2xpY3kgLSBAYXdzLWNkay9hd3MtczM6Y3JlYXRlRGVmYXVsdExvZ2dpbmdQb2xpY3kgZmVhdHVyZSBmbGFnJywgKCkgPT4ge1xuICAgIHRlc3QoJ2NyZWF0ZXMgZGVmYXVsdCBTMyBidWNrZXQgcG9saWN5IHdpdGggb3B0aW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgICBzdGFjay5ub2RlLnNldENvbnRleHQoJ0Bhd3MtY2RrL2F3cy1zMzpjcmVhdGVEZWZhdWx0TG9nZ2luZ1BvbGljeScsIHRydWUpO1xuICAgICAgbmV3IEZsb3dMb2coc3RhY2ssICdGbG93TG9ncycsIHtcbiAgICAgICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21OZXR3b3JrSW50ZXJmYWNlSWQoJ2VuaS0xMjM0NTYnKSxcbiAgICAgICAgZGVzdGluYXRpb246IEZsb3dMb2dEZXN0aW5hdGlvbi50b1MzKHVuZGVmaW5lZCwgJ2N1c3RvbS1wcmVmaXgnLCB7XG4gICAgICAgICAgaGl2ZUNvbXBhdGlibGVQYXJ0aXRpb25zOiB0cnVlLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsIHtcbiAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnczM6UHV0T2JqZWN0JyxcbiAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICAgICAgICdzMzp4LWFtei1hY2wnOiAnYnVja2V0LW93bmVyLWZ1bGwtY29udHJvbCcsXG4gICAgICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFjY291bnQnOiB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBBcm5MaWtlOiB7XG4gICAgICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICc6bG9nczonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJzoqJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICBTZXJ2aWNlOiAnZGVsaXZlcnkubG9ncy5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ0Zsb3dMb2dzQnVja2V0ODdGNjdGNjAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJy9jdXN0b20tcHJlZml4L0FXU0xvZ3MvYXdzLWFjY291bnQtaWQ9JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdzMzpHZXRCdWNrZXRBY2wnLFxuICAgICAgICAgICAgICAgICdzMzpMaXN0QnVja2V0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFjY291bnQnOiB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBBcm5MaWtlOiB7XG4gICAgICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICc6bG9nczonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJzoqJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdkZWxpdmVyeS5sb2dzLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ0Zsb3dMb2dzQnVja2V0ODdGNjdGNjAnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY3JlYXRlcyBkZWZhdWx0IFMzIGJ1Y2tldCBwb2xpY3knLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgc3RhY2subm9kZS5zZXRDb250ZXh0KCdAYXdzLWNkay9hd3MtczM6Y3JlYXRlRGVmYXVsdExvZ2dpbmdQb2xpY3knLCB0cnVlKTtcbiAgICAgIG5ldyBGbG93TG9nKHN0YWNrLCAnRmxvd0xvZ3MnLCB7XG4gICAgICAgIHJlc291cmNlVHlwZTogRmxvd0xvZ1Jlc291cmNlVHlwZS5mcm9tTmV0d29ya0ludGVyZmFjZUlkKCdlbmktMTIzNDU2JyksXG4gICAgICAgIGRlc3RpbmF0aW9uOiBGbG93TG9nRGVzdGluYXRpb24udG9TMygpLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgICAgIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0UG9saWN5Jywge1xuICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBY3Rpb246ICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICAgICAgICAgJ3MzOngtYW16LWFjbCc6ICdidWNrZXQtb3duZXItZnVsbC1jb250cm9sJyxcbiAgICAgICAgICAgICAgICAgICdhd3M6U291cmNlQWNjb3VudCc6IHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIEFybkxpa2U6IHtcbiAgICAgICAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAnOionLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdkZWxpdmVyeS5sb2dzLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnRmxvd0xvZ3NCdWNrZXQ4N0Y2N0Y2MCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnL0FXU0xvZ3MvJyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJy8qJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAgICdzMzpHZXRCdWNrZXRBY2wnLFxuICAgICAgICAgICAgICAgICdzMzpMaXN0QnVja2V0JyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFjY291bnQnOiB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBBcm5MaWtlOiB7XG4gICAgICAgICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICc6bG9nczonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgJzoqJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdkZWxpdmVyeS5sb2dzLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ0Zsb3dMb2dzQnVja2V0ODdGNjdGNjAnLFxuICAgICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYWRkcyBuZWNlc3NhcnkgZGVwZW5kZW5jaWVzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIHN0YWNrLm5vZGUuc2V0Q29udGV4dCgnQGF3cy1jZGsvYXdzLXMzOmNyZWF0ZURlZmF1bHRMb2dnaW5nUG9saWN5JywgdHJ1ZSk7XG4gICAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0Jywge1xuICAgICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgICAgfSk7XG4gICAgICBuZXcgRmxvd0xvZyhzdGFjaywgJ0Zsb3dMb2dzJywge1xuICAgICAgICByZXNvdXJjZVR5cGU6IEZsb3dMb2dSZXNvdXJjZVR5cGUuZnJvbU5ldHdvcmtJbnRlcmZhY2VJZCgnZW5pLTEyMzQ1NicpLFxuICAgICAgICBkZXN0aW5hdGlvbjogRmxvd0xvZ0Rlc3RpbmF0aW9uLnRvUzMoYnVja2V0KSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZSgnQVdTOjpFQzI6OkZsb3dMb2cnLCB7XG4gICAgICAgIFByb3BlcnRpZXM6IE1hdGNoLmFueVZhbHVlKCksXG4gICAgICAgIERlcGVuZHNPbjogW1xuICAgICAgICAgICdCdWNrZXRBdXRvRGVsZXRlT2JqZWN0c0N1c3RvbVJlc291cmNlQkFGRDIzQzInLFxuICAgICAgICAgICdCdWNrZXRQb2xpY3lFOUEzMDA4QScsXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3dpdGhvdXQgZnV0dXJlIGZsYWcsIGRvZXMgbm90IGNyZWF0ZSBkZWZhdWx0IGJ1Y2tldCBwb2xpY3knLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgICAgbmV3IEZsb3dMb2coc3RhY2ssICdGbG93TG9ncycsIHtcbiAgICAgICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21OZXR3b3JrSW50ZXJmYWNlSWQoJ2VuaS0xMjM0NTYnKSxcbiAgICAgICAgZGVzdGluYXRpb246IEZsb3dMb2dEZXN0aW5hdGlvbi50b1MzKCksXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6UzM6OkJ1Y2tldFBvbGljeScsIDApO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIHMzIGFzIHRoZSBkZXN0aW5hdGlvbiwgYWxsb3dzIHVzZSBvZiBrZXkgcHJlZml4JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICBuZXcgRmxvd0xvZyhzdGFjaywgJ0Zsb3dMb2dzJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21OZXR3b3JrSW50ZXJmYWNlSWQoJ2VuaS0xMjM0NTYnKSxcbiAgICAgIGRlc3RpbmF0aW9uOiBGbG93TG9nRGVzdGluYXRpb24udG9TMyhcbiAgICAgICAgbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1Rlc3RCdWNrZXQnLCB7XG4gICAgICAgICAgYnVja2V0TmFtZTogJ3Rlc3RidWNrZXQnLFxuICAgICAgICB9KSxcbiAgICAgICAgJ0Zsb3dMb2dzLycsXG4gICAgICApLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6TG9nczo6TG9nR3JvdXAnLCAwKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAwKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTMzo6QnVja2V0Jywge1xuICAgICAgQnVja2V0TmFtZTogJ3Rlc3RidWNrZXQnLFxuICAgIH0pO1xuXG4gIH0pO1xuICB0ZXN0KCd3aXRoIHMzIGFzIHRoZSBkZXN0aW5hdGlvbiBhbmQgYWxsIHRoZSBkZWZhdWx0cyBzZXQsIGl0IHN1Y2Nlc3NmdWxseSBjcmVhdGVzIGFsbCB0aGUgcmVzb3VyY2VzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgICBuZXcgRmxvd0xvZyhzdGFjaywgJ0Zsb3dMb2dzJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21OZXR3b3JrSW50ZXJmYWNlSWQoJ2VuaS0xMjM0NTYnKSxcbiAgICAgIGRlc3RpbmF0aW9uOiBGbG93TG9nRGVzdGluYXRpb24udG9TMygpLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpGbG93TG9nJywge1xuICAgICAgUmVzb3VyY2VUeXBlOiAnTmV0d29ya0ludGVyZmFjZScsXG4gICAgICBUcmFmZmljVHlwZTogJ0FMTCcsXG4gICAgICBSZXNvdXJjZUlkOiAnZW5pLTEyMzQ1NicsXG4gICAgICBMb2dEZXN0aW5hdGlvbjoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFsnRmxvd0xvZ3NCdWNrZXQ4N0Y2N0Y2MCcsICdBcm4nXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6TG9nczo6TG9nR3JvdXAnLCAwKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAwKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpTMzo6QnVja2V0JywgMSk7XG5cbiAgfSk7XG4gIHRlc3QoJ2NyZWF0ZSB3aXRoIHZwYycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgbmV3IFZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgICAgIGZsb3dMb2dzOiB7XG4gICAgICAgIGZsb3dMb2dzOiB7fSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlZQQycsIDEpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Rmxvd0xvZycsIHtcbiAgICAgIFJlc291cmNlVHlwZTogJ1ZQQycsXG4gICAgICBUcmFmZmljVHlwZTogJ0FMTCcsXG4gICAgICBSZXNvdXJjZUlkOiB7XG4gICAgICAgIFJlZjogJ1ZQQ0I5RTVGMEI0JyxcbiAgICAgIH0sXG4gICAgICBEZWxpdmVyTG9nc1Blcm1pc3Npb25Bcm46IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ1ZQQ2Zsb3dMb2dzSUFNUm9sZTlEMjFFMUE2JywgJ0FybiddLFxuICAgICAgfSxcbiAgICAgIExvZ0dyb3VwTmFtZToge1xuICAgICAgICBSZWY6ICdWUENmbG93TG9nc0xvZ0dyb3VwRTkwMEY5ODAnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICB9KTtcbiAgdGVzdCgnYWRkIHRvIHZwYycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gICAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICAgIHZwYy5hZGRGbG93TG9nKCdGbG93TG9ncycpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpWUEMnLCAxKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkZsb3dMb2cnLCB7XG4gICAgICBSZXNvdXJjZVR5cGU6ICdWUEMnLFxuICAgICAgVHJhZmZpY1R5cGU6ICdBTEwnLFxuICAgICAgUmVzb3VyY2VJZDoge1xuICAgICAgICBSZWY6ICdWUENCOUU1RjBCNCcsXG4gICAgICB9LFxuICAgICAgRGVsaXZlckxvZ3NQZXJtaXNzaW9uQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogWydWUENGbG93TG9nc0lBTVJvbGU1NTM0MzIzNCcsICdBcm4nXSxcbiAgICAgIH0sXG4gICAgICBMb2dHcm91cE5hbWU6IHtcbiAgICAgICAgUmVmOiAnVlBDRmxvd0xvZ3NMb2dHcm91cEY0OEUxQjBBJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuICB0ZXN0KCdmbG93bG9nIGhhcyBkZWZhdWx0Y2hpbGQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgVnBjKHN0YWNrLCAnVlBDJyk7XG5cbiAgICBjb25zdCBmbG93bG9nID0gbmV3IEZsb3dMb2coc3RhY2ssICdGbG93TG9nJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21WcGModnBjKSxcbiAgICB9KTtcblxuICAgIGV4cGVjdChmbG93bG9nLm5vZGUuZGVmYXVsdENoaWxkKS50b0JlRGVmaW5lZCgpO1xuICB9KTtcbiAgdGVzdCgnZmxvd2xvZyBjaGFuZ2UgbWF4QWdncmVnYXRpb25JbnRlcnZhbCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBWcGMoc3RhY2ssICdWUEMnKTtcblxuICAgIG5ldyBGbG93TG9nKHN0YWNrLCAnRmxvd0xvZycsIHtcbiAgICAgIHJlc291cmNlVHlwZTogRmxvd0xvZ1Jlc291cmNlVHlwZS5mcm9tVnBjKHZwYyksXG4gICAgICBtYXhBZ2dyZWdhdGlvbkludGVydmFsOiBGbG93TG9nTWF4QWdncmVnYXRpb25JbnRlcnZhbC5PTkVfTUlOVVRFLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpGbG93TG9nJywge1xuICAgICAgUmVzb3VyY2VUeXBlOiAnVlBDJyxcbiAgICAgIFRyYWZmaWNUeXBlOiAnQUxMJyxcblxuICAgICAgRGVsaXZlckxvZ3NQZXJtaXNzaW9uQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogWydGbG93TG9nSUFNUm9sZURDQkQyRUI0JywgJ0FybiddLFxuICAgICAgfSxcbiAgICAgIExvZ0Rlc3RpbmF0aW9uVHlwZTogJ2Nsb3VkLXdhdGNoLWxvZ3MnLFxuICAgICAgTG9nR3JvdXBOYW1lOiB7XG4gICAgICAgIFJlZjogJ0Zsb3dMb2dMb2dHcm91cEFGRkI5MDM4JyxcbiAgICAgIH0sXG4gICAgICBNYXhBZ2dyZWdhdGlvbkludGVydmFsOiA2MCxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxudGVzdCgnYWRkIHRvIHZwYyB3aXRoIG1heEFnZ3JlZ2F0aW9uSW50ZXJ2YWwnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1ZQQycpO1xuICB2cGMuYWRkRmxvd0xvZygnRmxvd0xvZ3MnLCB7XG4gICAgbWF4QWdncmVnYXRpb25JbnRlcnZhbDogRmxvd0xvZ01heEFnZ3JlZ2F0aW9uSW50ZXJ2YWwuT05FX01JTlVURSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpWUEMnLCAxKTtcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpGbG93TG9nJywge1xuICAgIFJlc291cmNlVHlwZTogJ1ZQQycsXG4gICAgVHJhZmZpY1R5cGU6ICdBTEwnLFxuICAgIFJlc291cmNlSWQ6IHtcbiAgICAgIFJlZjogJ1ZQQ0I5RTVGMEI0JyxcbiAgICB9LFxuICAgIERlbGl2ZXJMb2dzUGVybWlzc2lvbkFybjoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ1ZQQ0Zsb3dMb2dzSUFNUm9sZTU1MzQzMjM0JywgJ0FybiddLFxuICAgIH0sXG4gICAgTG9nR3JvdXBOYW1lOiB7XG4gICAgICBSZWY6ICdWUENGbG93TG9nc0xvZ0dyb3VwRjQ4RTFCMEEnLFxuICAgIH0sXG4gICAgTWF4QWdncmVnYXRpb25JbnRlcnZhbDogNjAsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3dpdGggY3VzdG9tIGxvZyBmb3JtYXQgc2V0LCBpdCBzdWNjZXNzZnVsbHkgY3JlYXRlcyB3aXRoIGNsb3Vkd2F0Y2ggbG9nIGRlc3RpbmF0aW9uJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gIG5ldyBGbG93TG9nKHN0YWNrLCAnRmxvd0xvZ3MnLCB7XG4gICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21OZXR3b3JrSW50ZXJmYWNlSWQoJ2VuaS0xMjM0NTUnKSxcbiAgICBsb2dGb3JtYXQ6IFtcbiAgICAgIExvZ0Zvcm1hdC5TUkNfUE9SVCxcbiAgICAgIExvZ0Zvcm1hdC5EU1RfUE9SVCxcbiAgICBdLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkZsb3dMb2cnLCB7XG4gICAgUmVzb3VyY2VUeXBlOiAnTmV0d29ya0ludGVyZmFjZScsXG4gICAgVHJhZmZpY1R5cGU6ICdBTEwnLFxuICAgIFJlc291cmNlSWQ6ICdlbmktMTIzNDU1JyxcbiAgICBEZWxpdmVyTG9nc1Blcm1pc3Npb25Bcm46IHtcbiAgICAgICdGbjo6R2V0QXR0JzogWydGbG93TG9nc0lBTVJvbGVGMThGNDIwOScsICdBcm4nXSxcbiAgICB9LFxuICAgIExvZ0Zvcm1hdDogJyR7c3JjcG9ydH0gJHtkc3Rwb3J0fScsXG4gICAgTG9nR3JvdXBOYW1lOiB7XG4gICAgICBSZWY6ICdGbG93TG9nc0xvZ0dyb3VwOTg1M0E4NUYnLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2xvZyBmb3JtYXQgZm9yIGJ1aWx0LWluIHR5cGVzIGlzIGNvcnJlY3QnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgY29uc3QgdnBjID0gbmV3IFZwYyhzdGFjaywgJ1Rlc3RWcGMnKTtcbiAgbmV3IEZsb3dMb2coc3RhY2ssICdGbG93TG9nczEnLCB7XG4gICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21WcGModnBjKSxcbiAgICBsb2dGb3JtYXQ6IFtcbiAgICAgIExvZ0Zvcm1hdC5WRVJTSU9OLFxuICAgICAgTG9nRm9ybWF0LkFDQ09VTlRfSUQsXG4gICAgICBMb2dGb3JtYXQuSU5URVJGQUNFX0lELFxuICAgICAgTG9nRm9ybWF0LlNSQ19BRERSLFxuICAgICAgTG9nRm9ybWF0LkRTVF9BRERSLFxuICAgICAgTG9nRm9ybWF0LlNSQ19QT1JULFxuICAgICAgTG9nRm9ybWF0LkRTVF9QT1JULFxuICAgICAgTG9nRm9ybWF0LlBST1RPQ09MLFxuICAgICAgTG9nRm9ybWF0LlBBQ0tFVFMsXG4gICAgICBMb2dGb3JtYXQuQllURVMsXG4gICAgICBMb2dGb3JtYXQuU1RBUlRfVElNRVNUQU1QLFxuICAgICAgTG9nRm9ybWF0LkVORF9USU1FU1RBTVAsXG4gICAgICBMb2dGb3JtYXQuQUNUSU9OLFxuICAgICAgTG9nRm9ybWF0LkxPR19TVEFUVVMsXG4gICAgICBMb2dGb3JtYXQuVlBDX0lELFxuICAgICAgTG9nRm9ybWF0LlNVQk5FVF9JRCxcbiAgICAgIExvZ0Zvcm1hdC5JTlNUQU5DRV9JRCxcbiAgICAgIExvZ0Zvcm1hdC5UQ1BfRkxBR1MsXG4gICAgICBMb2dGb3JtYXQuVFJBRkZJQ19UWVBFLFxuICAgICAgTG9nRm9ybWF0LlBLVF9TUkNfQUREUixcbiAgICAgIExvZ0Zvcm1hdC5QS1RfRFNUX0FERFIsXG4gICAgICBMb2dGb3JtYXQuUkVHSU9OLFxuICAgICAgTG9nRm9ybWF0LkFaX0lELFxuICAgICAgTG9nRm9ybWF0LlNVQkxPQ0FUSU9OX1RZUEUsXG4gICAgICBMb2dGb3JtYXQuU1VCTE9DQVRJT05fSUQsXG4gICAgICBMb2dGb3JtYXQuUEtUX1NSQ19BV1NfU0VSVklDRSxcbiAgICAgIExvZ0Zvcm1hdC5QS1RfRFNUX0FXU19TRVJWSUNFLFxuICAgICAgTG9nRm9ybWF0LkZMT1dfRElSRUNUSU9OLFxuICAgICAgTG9nRm9ybWF0LlRSQUZGSUNfUEFUSCxcbiAgICBdLFxuICB9KTtcblxuICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG5cbiAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Rmxvd0xvZycsIHtcbiAgICBMb2dGb3JtYXQ6ICgnJHt2ZXJzaW9ufSAke2FjY291bnQtaWR9ICR7aW50ZXJmYWNlLWlkfSAke3NyY2FkZHJ9ICR7ZHN0YWRkcn0gJHtzcmNwb3J0fSAnXG4gICAgICAgICAgICAgICAgKyAnJHtkc3Rwb3J0fSAke3Byb3RvY29sfSAke3BhY2tldHN9ICR7Ynl0ZXN9ICR7c3RhcnR9ICR7ZW5kfSAke2FjdGlvbn0gJHtsb2ctc3RhdHVzfSAnXG4gICAgICAgICAgICAgICAgKyAnJHt2cGMtaWR9ICR7c3VibmV0LWlkfSAke2luc3RhbmNlLWlkfSAke3RjcC1mbGFnc30gJHt0eXBlfSAke3BrdC1zcmNhZGRyfSAnXG4gICAgICAgICAgICAgICAgKyAnJHtwa3QtZHN0YWRkcn0gJHtyZWdpb259ICR7YXotaWR9ICR7c3VibG9jYXRpb24tdHlwZX0gJHtzdWJsb2NhdGlvbi1pZH0gJ1xuICAgICAgICAgICAgICAgICsgJyR7cGt0LXNyYy1hd3Mtc2VydmljZX0gJHtwa3QtZHN0LWF3cy1zZXJ2aWNlfSAke2Zsb3ctZGlyZWN0aW9ufSAke3RyYWZmaWMtcGF0aH0nKSxcbiAgfSk7XG59KTtcblxudGVzdCgnd2l0aCBjdXN0b20gbG9nIGZvcm1hdCBzZXQgZW1wdHksIGl0IG5vdCBjcmVhdGVzIHdpdGggY2xvdWR3YXRjaCBsb2cgZGVzdGluYXRpb24nLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gZ2V0VGVzdFN0YWNrKCk7XG5cbiAgbmV3IEZsb3dMb2coc3RhY2ssICdGbG93TG9ncycsIHtcbiAgICByZXNvdXJjZVR5cGU6IEZsb3dMb2dSZXNvdXJjZVR5cGUuZnJvbU5ldHdvcmtJbnRlcmZhY2VJZCgnZW5pLTEyMzQ1NScpLFxuICAgIGxvZ0Zvcm1hdDogW10sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Rmxvd0xvZycsIHtcbiAgICBSZXNvdXJjZVR5cGU6ICdOZXR3b3JrSW50ZXJmYWNlJyxcbiAgICBUcmFmZmljVHlwZTogJ0FMTCcsXG4gICAgUmVzb3VyY2VJZDogJ2VuaS0xMjM0NTUnLFxuICAgIERlbGl2ZXJMb2dzUGVybWlzc2lvbkFybjoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0Zsb3dMb2dzSUFNUm9sZUYxOEY0MjA5JywgJ0FybiddLFxuICAgIH0sXG4gICAgTG9nR3JvdXBOYW1lOiB7XG4gICAgICBSZWY6ICdGbG93TG9nc0xvZ0dyb3VwOTg1M0E4NUYnLFxuICAgIH0sXG4gIH0pO1xuXG59KTtcblxuXG5mdW5jdGlvbiBnZXRUZXN0U3RhY2soKTogU3RhY2sge1xuICByZXR1cm4gbmV3IFN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHtcbiAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgfSk7XG59XG5cbnRlc3QoJ3dpdGggY3VzdG9tIGxvZyBmb3JtYXQgc2V0IGFsbCBkZWZhdWx0IGZpZWxkLCBpdCBub3QgY3JlYXRlcyB3aXRoIGNsb3Vkd2F0Y2ggbG9nIGRlc3RpbmF0aW9uJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gIG5ldyBGbG93TG9nKHN0YWNrLCAnRmxvd0xvZ3MnLCB7XG4gICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21OZXR3b3JrSW50ZXJmYWNlSWQoJ2VuaS0xMjM0NTUnKSxcbiAgICBsb2dGb3JtYXQ6IFtcbiAgICAgIExvZ0Zvcm1hdC5WRVJTSU9OLFxuICAgICAgTG9nRm9ybWF0LkFMTF9ERUZBVUxUX0ZJRUxEUyxcbiAgICBdLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OkZsb3dMb2cnLCB7XG4gICAgUmVzb3VyY2VUeXBlOiAnTmV0d29ya0ludGVyZmFjZScsXG4gICAgVHJhZmZpY1R5cGU6ICdBTEwnLFxuICAgIFJlc291cmNlSWQ6ICdlbmktMTIzNDU1JyxcbiAgICBEZWxpdmVyTG9nc1Blcm1pc3Npb25Bcm46IHtcbiAgICAgICdGbjo6R2V0QXR0JzogWydGbG93TG9nc0lBTVJvbGVGMThGNDIwOScsICdBcm4nXSxcbiAgICB9LFxuICAgIExvZ0Zvcm1hdDogJyR7dmVyc2lvbn0gJHt2ZXJzaW9ufSAke2FjY291bnQtaWR9ICR7aW50ZXJmYWNlLWlkfSAke3NyY2FkZHJ9ICR7ZHN0YWRkcn0gJHtzcmNwb3J0fSAke2RzdHBvcnR9ICR7cHJvdG9jb2x9ICR7cGFja2V0c30gJHtieXRlc30gJHtzdGFydH0gJHtlbmR9ICR7YWN0aW9ufSAke2xvZy1zdGF0dXN9JyxcbiAgICBMb2dHcm91cE5hbWU6IHtcbiAgICAgIFJlZjogJ0Zsb3dMb2dzTG9nR3JvdXA5ODUzQTg1RicsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnd2l0aCBjdXN0b20gbG9nIGZvcm1hdCBzZXQgY3VzdG9tLCBpdCBub3QgY3JlYXRlcyB3aXRoIGNsb3Vkd2F0Y2ggbG9nIGRlc3RpbmF0aW9uJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IGdldFRlc3RTdGFjaygpO1xuXG4gIG5ldyBGbG93TG9nKHN0YWNrLCAnRmxvd0xvZ3MnLCB7XG4gICAgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlLmZyb21OZXR3b3JrSW50ZXJmYWNlSWQoJ2VuaS0xMjM0NTUnKSxcbiAgICBsb2dGb3JtYXQ6IFtcbiAgICAgIExvZ0Zvcm1hdC5TUkNfUE9SVCxcbiAgICAgIExvZ0Zvcm1hdC5jdXN0b20oJyR7bmV3LWZpZWxkfScpLFxuICAgIF0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6Rmxvd0xvZycsIHtcbiAgICBSZXNvdXJjZVR5cGU6ICdOZXR3b3JrSW50ZXJmYWNlJyxcbiAgICBUcmFmZmljVHlwZTogJ0FMTCcsXG4gICAgUmVzb3VyY2VJZDogJ2VuaS0xMjM0NTUnLFxuICAgIERlbGl2ZXJMb2dzUGVybWlzc2lvbkFybjoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0Zsb3dMb2dzSUFNUm9sZUYxOEY0MjA5JywgJ0FybiddLFxuICAgIH0sXG4gICAgTG9nRm9ybWF0OiAnJHtzcmNwb3J0fSAke25ldy1maWVsZH0nLFxuICAgIExvZ0dyb3VwTmFtZToge1xuICAgICAgUmVmOiAnRmxvd0xvZ3NMb2dHcm91cDk4NTNBODVGJyxcbiAgICB9LFxuICB9KTtcbn0pO1xuIl19