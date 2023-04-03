"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const secretsmanager = require("../lib");
let stack;
let vpc;
let secret;
let securityGroup;
let target;
beforeEach(() => {
    stack = new cdk.Stack();
    vpc = new ec2.Vpc(stack, 'VPC');
    secret = new secretsmanager.Secret(stack, 'Secret');
    securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
    target = new ec2.Connections({
        defaultPort: ec2.Port.tcp(3306),
        securityGroups: [securityGroup],
    });
});
test('secret rotation single user', () => {
    // GIVEN
    const excludeCharacters = ' ;+%{}' + '@\'"`/\\#'; // DMS and BASH problem chars
    // WHEN
    new secretsmanager.SecretRotation(stack, 'SecretRotation', {
        application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
        secret,
        target,
        vpc,
        excludeCharacters: excludeCharacters,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
        IpProtocol: 'tcp',
        Description: 'from SecretRotationSecurityGroupAEC520AB:3306',
        FromPort: 3306,
        GroupId: {
            'Fn::GetAtt': [
                'SecurityGroupDD263621',
                'GroupId',
            ],
        },
        SourceSecurityGroupId: {
            'Fn::GetAtt': [
                'SecretRotationSecurityGroup9985012B',
                'GroupId',
            ],
        },
        ToPort: 3306,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
        SecretId: {
            Ref: 'SecretA720EF05',
        },
        RotationLambdaARN: {
            'Fn::GetAtt': [
                'SecretRotationA9FFCFA9',
                'Outputs.RotationLambdaARN',
            ],
        },
        RotationRules: {
            AutomaticallyAfterDays: 30,
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
        GroupDescription: 'Default/SecretRotation/SecurityGroup',
    });
    assertions_1.Template.fromStack(stack).hasResource('AWS::Serverless::Application', {
        Properties: {
            Location: {
                ApplicationId: {
                    'Fn::FindInMap': ['SecretRotationSARMappingC10A2F5D', { Ref: 'AWS::Partition' }, 'applicationId'],
                },
                SemanticVersion: {
                    'Fn::FindInMap': ['SecretRotationSARMappingC10A2F5D', { Ref: 'AWS::Partition' }, 'semanticVersion'],
                },
            },
            Parameters: {
                endpoint: {
                    'Fn::Join': [
                        '',
                        [
                            'https://secretsmanager.',
                            {
                                Ref: 'AWS::Region',
                            },
                            '.',
                            {
                                Ref: 'AWS::URLSuffix',
                            },
                        ],
                    ],
                },
                functionName: 'SecretRotation',
                excludeCharacters: excludeCharacters,
                vpcSecurityGroupIds: {
                    'Fn::GetAtt': [
                        'SecretRotationSecurityGroup9985012B',
                        'GroupId',
                    ],
                },
                vpcSubnetIds: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
                            },
                            ',',
                            {
                                Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
                            },
                        ],
                    ],
                },
            },
        },
        DeletionPolicy: 'Delete',
        UpdateReplacePolicy: 'Delete',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::ResourcePolicy', {
        ResourcePolicy: {
            Statement: [
                {
                    Action: 'secretsmanager:DeleteSecret',
                    Effect: 'Deny',
                    Principal: {
                        AWS: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition',
                                    },
                                    ':iam::',
                                    {
                                        Ref: 'AWS::AccountId',
                                    },
                                    ':root',
                                ],
                            ],
                        },
                    },
                    Resource: '*',
                },
            ],
            Version: '2012-10-17',
        },
        SecretId: {
            Ref: 'SecretA720EF05',
        },
    });
});
test('secret rotation multi user', () => {
    // GIVEN
    const masterSecret = new secretsmanager.Secret(stack, 'MasterSecret');
    // WHEN
    new secretsmanager.SecretRotation(stack, 'SecretRotation', {
        application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
        secret,
        masterSecret,
        target,
        vpc,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
        Parameters: {
            endpoint: {
                'Fn::Join': [
                    '',
                    [
                        'https://secretsmanager.',
                        {
                            Ref: 'AWS::Region',
                        },
                        '.',
                        {
                            Ref: 'AWS::URLSuffix',
                        },
                    ],
                ],
            },
            functionName: 'SecretRotation',
            vpcSecurityGroupIds: {
                'Fn::GetAtt': [
                    'SecretRotationSecurityGroup9985012B',
                    'GroupId',
                ],
            },
            vpcSubnetIds: {
                'Fn::Join': [
                    '',
                    [
                        {
                            Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
                        },
                        ',',
                        {
                            Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
                        },
                    ],
                ],
            },
            masterSecretArn: {
                Ref: 'MasterSecretA11BF785',
            },
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::ResourcePolicy', {
        ResourcePolicy: {
            Statement: [
                {
                    Action: 'secretsmanager:DeleteSecret',
                    Effect: 'Deny',
                    Principal: {
                        AWS: {
                            'Fn::Join': [
                                '',
                                [
                                    'arn:',
                                    {
                                        Ref: 'AWS::Partition',
                                    },
                                    ':iam::',
                                    {
                                        Ref: 'AWS::AccountId',
                                    },
                                    ':root',
                                ],
                            ],
                        },
                    },
                    Resource: '*',
                },
            ],
            Version: '2012-10-17',
        },
        SecretId: {
            Ref: 'MasterSecretA11BF785',
        },
    });
});
test('secret rotation allows passing an empty string for excludeCharacters', () => {
    // WHEN
    new secretsmanager.SecretRotation(stack, 'SecretRotation', {
        application: secretsmanager.SecretRotationApplication.MARIADB_ROTATION_SINGLE_USER,
        secret,
        target,
        vpc,
        excludeCharacters: '',
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
        Parameters: {
            excludeCharacters: '',
        },
    });
});
test('throws when connections object has no default port range', () => {
    // WHEN
    const targetWithoutDefaultPort = new ec2.Connections({
        securityGroups: [securityGroup],
    });
    // THEN
    expect(() => new secretsmanager.SecretRotation(stack, 'Rotation', {
        secret,
        application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
        vpc,
        target: targetWithoutDefaultPort,
    })).toThrow(/`target`.+default port range/);
});
test('throws when master secret is missing for a multi user application', () => {
    // THEN
    expect(() => new secretsmanager.SecretRotation(stack, 'Rotation', {
        secret,
        application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
        vpc,
        target,
    })).toThrow(/The `masterSecret` must be specified for application using the multi user scheme/);
});
test('rotation function name does not exceed 64 chars', () => {
    // WHEN
    const id = 'SecretRotation'.repeat(5);
    new secretsmanager.SecretRotation(stack, id, {
        application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
        secret,
        target,
        vpc,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
        Parameters: {
            endpoint: {
                'Fn::Join': [
                    '',
                    [
                        'https://secretsmanager.',
                        {
                            Ref: 'AWS::Region',
                        },
                        '.',
                        {
                            Ref: 'AWS::URLSuffix',
                        },
                    ],
                ],
            },
            functionName: 'RotationSecretRotationSecretRotationSecretRotationSecretRotation',
            vpcSecurityGroupIds: {
                'Fn::GetAtt': [
                    'SecretRotationSecretRotationSecretRotationSecretRotationSecretRotationSecurityGroupBFCB171A',
                    'GroupId',
                ],
            },
            vpcSubnetIds: {
                'Fn::Join': [
                    '',
                    [
                        {
                            Ref: 'VPCPrivateSubnet1Subnet8BCA10E0',
                        },
                        ',',
                        {
                            Ref: 'VPCPrivateSubnet2SubnetCFCDAA7A',
                        },
                    ],
                ],
            },
        },
    });
});
test('with interface vpc endpoint', () => {
    // GIVEN
    const endpoint = new ec2.InterfaceVpcEndpoint(stack, 'SecretsManagerEndpoint', {
        service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
        vpc,
    });
    // WHEN
    new secretsmanager.SecretRotation(stack, 'SecretRotation', {
        application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER,
        secret,
        target,
        vpc,
        endpoint,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Serverless::Application', {
        Parameters: {
            endpoint: {
                'Fn::Join': ['', [
                        'https://',
                        { Ref: 'SecretsManagerEndpoint5E83C66B' },
                        '.secretsmanager.',
                        { Ref: 'AWS::Region' },
                        '.',
                        { Ref: 'AWS::URLSuffix' },
                    ]],
            },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VjcmV0LXJvdGF0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzZWNyZXQtcm90YXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLHlDQUF5QztBQUV6QyxJQUFJLEtBQWdCLENBQUM7QUFDckIsSUFBSSxHQUFhLENBQUM7QUFDbEIsSUFBSSxNQUE4QixDQUFDO0FBQ25DLElBQUksYUFBZ0MsQ0FBQztBQUNyQyxJQUFJLE1BQXVCLENBQUM7QUFDNUIsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUN4QixHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoQyxNQUFNLEdBQUcsSUFBSSxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNwRCxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZFLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUM7UUFDM0IsV0FBVyxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztRQUMvQixjQUFjLEVBQUUsQ0FBQyxhQUFhLENBQUM7S0FDaEMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFHSCxJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO0lBQ3ZDLFFBQVE7SUFDUixNQUFNLGlCQUFpQixHQUFHLFFBQVEsR0FBRyxXQUFXLENBQUMsQ0FBQyw2QkFBNkI7SUFFL0UsT0FBTztJQUNQLElBQUksY0FBYyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7UUFDekQsV0FBVyxFQUFFLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQywwQkFBMEI7UUFDaEYsTUFBTTtRQUNOLE1BQU07UUFDTixHQUFHO1FBQ0gsaUJBQWlCLEVBQUUsaUJBQWlCO0tBQ3JDLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQ0FBZ0MsRUFBRTtRQUNoRixVQUFVLEVBQUUsS0FBSztRQUNqQixXQUFXLEVBQUUsK0NBQStDO1FBQzVELFFBQVEsRUFBRSxJQUFJO1FBQ2QsT0FBTyxFQUFFO1lBQ1AsWUFBWSxFQUFFO2dCQUNaLHVCQUF1QjtnQkFDdkIsU0FBUzthQUNWO1NBQ0Y7UUFDRCxxQkFBcUIsRUFBRTtZQUNyQixZQUFZLEVBQUU7Z0JBQ1oscUNBQXFDO2dCQUNyQyxTQUFTO2FBQ1Y7U0FDRjtRQUNELE1BQU0sRUFBRSxJQUFJO0tBQ2IsQ0FBQyxDQUFDO0lBRUgscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUNBQXVDLEVBQUU7UUFDdkYsUUFBUSxFQUFFO1lBQ1IsR0FBRyxFQUFFLGdCQUFnQjtTQUN0QjtRQUNELGlCQUFpQixFQUFFO1lBQ2pCLFlBQVksRUFBRTtnQkFDWix3QkFBd0I7Z0JBQ3hCLDJCQUEyQjthQUM1QjtTQUNGO1FBQ0QsYUFBYSxFQUFFO1lBQ2Isc0JBQXNCLEVBQUUsRUFBRTtTQUMzQjtLQUNGLENBQUMsQ0FBQztJQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO1FBQ3pFLGdCQUFnQixFQUFFLHNDQUFzQztLQUN6RCxDQUFDLENBQUM7SUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsOEJBQThCLEVBQUU7UUFDcEUsVUFBVSxFQUFFO1lBQ1YsUUFBUSxFQUFFO2dCQUNSLGFBQWEsRUFBRTtvQkFDYixlQUFlLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRSxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLGVBQWUsQ0FBQztpQkFDbEc7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLGVBQWUsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsaUJBQWlCLENBQUM7aUJBQ3BHO2FBQ0Y7WUFDRCxVQUFVLEVBQUU7Z0JBQ1YsUUFBUSxFQUFFO29CQUNSLFVBQVUsRUFBRTt3QkFDVixFQUFFO3dCQUNGOzRCQUNFLHlCQUF5Qjs0QkFDekI7Z0NBQ0UsR0FBRyxFQUFFLGFBQWE7NkJBQ25COzRCQUNELEdBQUc7NEJBQ0g7Z0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjs2QkFDdEI7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7Z0JBQ0QsWUFBWSxFQUFFLGdCQUFnQjtnQkFDOUIsaUJBQWlCLEVBQUUsaUJBQWlCO2dCQUNwQyxtQkFBbUIsRUFBRTtvQkFDbkIsWUFBWSxFQUFFO3dCQUNaLHFDQUFxQzt3QkFDckMsU0FBUztxQkFDVjtpQkFDRjtnQkFDRCxZQUFZLEVBQUU7b0JBQ1osVUFBVSxFQUFFO3dCQUNWLEVBQUU7d0JBQ0Y7NEJBQ0U7Z0NBQ0UsR0FBRyxFQUFFLGlDQUFpQzs2QkFDdkM7NEJBQ0QsR0FBRzs0QkFDSDtnQ0FDRSxHQUFHLEVBQUUsaUNBQWlDOzZCQUN2Qzt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1NBQ0Y7UUFDRCxjQUFjLEVBQUUsUUFBUTtRQUN4QixtQkFBbUIsRUFBRSxRQUFRO0tBQzlCLENBQUMsQ0FBQztJQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHFDQUFxQyxFQUFFO1FBQ3JGLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxNQUFNLEVBQUUsNkJBQTZCO29CQUNyQyxNQUFNLEVBQUUsTUFBTTtvQkFDZCxTQUFTLEVBQUU7d0JBQ1QsR0FBRyxFQUFFOzRCQUNILFVBQVUsRUFBRTtnQ0FDVixFQUFFO2dDQUNGO29DQUNFLE1BQU07b0NBQ047d0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjtxQ0FDdEI7b0NBQ0QsUUFBUTtvQ0FDUjt3Q0FDRSxHQUFHLEVBQUUsZ0JBQWdCO3FDQUN0QjtvQ0FDRCxPQUFPO2lDQUNSOzZCQUNGO3lCQUNGO3FCQUNGO29CQUNELFFBQVEsRUFBRSxHQUFHO2lCQUNkO2FBQ0Y7WUFDRCxPQUFPLEVBQUUsWUFBWTtTQUN0QjtRQUNELFFBQVEsRUFBRTtZQUNSLEdBQUcsRUFBRSxnQkFBZ0I7U0FDdEI7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7SUFDdEMsUUFBUTtJQUNSLE1BQU0sWUFBWSxHQUFHLElBQUksY0FBYyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFFdEUsT0FBTztJQUNQLElBQUksY0FBYyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7UUFDekQsV0FBVyxFQUFFLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQyx5QkFBeUI7UUFDL0UsTUFBTTtRQUNOLFlBQVk7UUFDWixNQUFNO1FBQ04sR0FBRztLQUNKLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw4QkFBOEIsRUFBRTtRQUM5RSxVQUFVLEVBQUU7WUFDVixRQUFRLEVBQUU7Z0JBQ1IsVUFBVSxFQUFFO29CQUNWLEVBQUU7b0JBQ0Y7d0JBQ0UseUJBQXlCO3dCQUN6Qjs0QkFDRSxHQUFHLEVBQUUsYUFBYTt5QkFDbkI7d0JBQ0QsR0FBRzt3QkFDSDs0QkFDRSxHQUFHLEVBQUUsZ0JBQWdCO3lCQUN0QjtxQkFDRjtpQkFDRjthQUNGO1lBQ0QsWUFBWSxFQUFFLGdCQUFnQjtZQUM5QixtQkFBbUIsRUFBRTtnQkFDbkIsWUFBWSxFQUFFO29CQUNaLHFDQUFxQztvQkFDckMsU0FBUztpQkFDVjthQUNGO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLFVBQVUsRUFBRTtvQkFDVixFQUFFO29CQUNGO3dCQUNFOzRCQUNFLEdBQUcsRUFBRSxpQ0FBaUM7eUJBQ3ZDO3dCQUNELEdBQUc7d0JBQ0g7NEJBQ0UsR0FBRyxFQUFFLGlDQUFpQzt5QkFDdkM7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELGVBQWUsRUFBRTtnQkFDZixHQUFHLEVBQUUsc0JBQXNCO2FBQzVCO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxxQ0FBcUMsRUFBRTtRQUNyRixjQUFjLEVBQUU7WUFDZCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsTUFBTSxFQUFFLDZCQUE2QjtvQkFDckMsTUFBTSxFQUFFLE1BQU07b0JBQ2QsU0FBUyxFQUFFO3dCQUNULEdBQUcsRUFBRTs0QkFDSCxVQUFVLEVBQUU7Z0NBQ1YsRUFBRTtnQ0FDRjtvQ0FDRSxNQUFNO29DQUNOO3dDQUNFLEdBQUcsRUFBRSxnQkFBZ0I7cUNBQ3RCO29DQUNELFFBQVE7b0NBQ1I7d0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjtxQ0FDdEI7b0NBQ0QsT0FBTztpQ0FDUjs2QkFDRjt5QkFDRjtxQkFDRjtvQkFDRCxRQUFRLEVBQUUsR0FBRztpQkFDZDthQUNGO1lBQ0QsT0FBTyxFQUFFLFlBQVk7U0FDdEI7UUFDRCxRQUFRLEVBQUU7WUFDUixHQUFHLEVBQUUsc0JBQXNCO1NBQzVCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO0lBQ2hGLE9BQU87SUFDUCxJQUFJLGNBQWMsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLGdCQUFnQixFQUFFO1FBQ3pELFdBQVcsRUFBRSxjQUFjLENBQUMseUJBQXlCLENBQUMsNEJBQTRCO1FBQ2xGLE1BQU07UUFDTixNQUFNO1FBQ04sR0FBRztRQUNILGlCQUFpQixFQUFFLEVBQUU7S0FDdEIsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixFQUFFO1FBQzlFLFVBQVUsRUFBRTtZQUNWLGlCQUFpQixFQUFFLEVBQUU7U0FDdEI7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7SUFDcEUsT0FBTztJQUNQLE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDO1FBQ25ELGNBQWMsRUFBRSxDQUFDLGFBQWEsQ0FBQztLQUNoQyxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksY0FBYyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1FBQ2hFLE1BQU07UUFDTixXQUFXLEVBQUUsY0FBYyxDQUFDLHlCQUF5QixDQUFDLDBCQUEwQjtRQUNoRixHQUFHO1FBQ0gsTUFBTSxFQUFFLHdCQUF3QjtLQUNqQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUM5QyxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxtRUFBbUUsRUFBRSxHQUFHLEVBQUU7SUFDN0UsT0FBTztJQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtRQUNoRSxNQUFNO1FBQ04sV0FBVyxFQUFFLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQyx5QkFBeUI7UUFDL0UsR0FBRztRQUNILE1BQU07S0FDUCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0ZBQWtGLENBQUMsQ0FBQztBQUNsRyxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7SUFDM0QsT0FBTztJQUNQLE1BQU0sRUFBRSxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN0QyxJQUFJLGNBQWMsQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtRQUMzQyxXQUFXLEVBQUUsY0FBYyxDQUFDLHlCQUF5QixDQUFDLDBCQUEwQjtRQUNoRixNQUFNO1FBQ04sTUFBTTtRQUNOLEdBQUc7S0FDSixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsOEJBQThCLEVBQUU7UUFDOUUsVUFBVSxFQUFFO1lBQ1YsUUFBUSxFQUFFO2dCQUNSLFVBQVUsRUFBRTtvQkFDVixFQUFFO29CQUNGO3dCQUNFLHlCQUF5Qjt3QkFDekI7NEJBQ0UsR0FBRyxFQUFFLGFBQWE7eUJBQ25CO3dCQUNELEdBQUc7d0JBQ0g7NEJBQ0UsR0FBRyxFQUFFLGdCQUFnQjt5QkFDdEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELFlBQVksRUFBRSxrRUFBa0U7WUFDaEYsbUJBQW1CLEVBQUU7Z0JBQ25CLFlBQVksRUFBRTtvQkFDWiw2RkFBNkY7b0JBQzdGLFNBQVM7aUJBQ1Y7YUFDRjtZQUNELFlBQVksRUFBRTtnQkFDWixVQUFVLEVBQUU7b0JBQ1YsRUFBRTtvQkFDRjt3QkFDRTs0QkFDRSxHQUFHLEVBQUUsaUNBQWlDO3lCQUN2Qzt3QkFDRCxHQUFHO3dCQUNIOzRCQUNFLEdBQUcsRUFBRSxpQ0FBaUM7eUJBQ3ZDO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBR0gsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtJQUN2QyxRQUFRO0lBQ1IsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLHdCQUF3QixFQUFFO1FBQzdFLE9BQU8sRUFBRSxHQUFHLENBQUMsOEJBQThCLENBQUMsZUFBZTtRQUMzRCxHQUFHO0tBQ0osQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLElBQUksY0FBYyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7UUFDekQsV0FBVyxFQUFFLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQywwQkFBMEI7UUFDaEYsTUFBTTtRQUNOLE1BQU07UUFDTixHQUFHO1FBQ0gsUUFBUTtLQUNULENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw4QkFBOEIsRUFBRTtRQUM5RSxVQUFVLEVBQUU7WUFDVixRQUFRLEVBQUU7Z0JBQ1IsVUFBVSxFQUFFLENBQUMsRUFBRSxFQUFFO3dCQUNmLFVBQVU7d0JBQ1YsRUFBRSxHQUFHLEVBQUUsZ0NBQWdDLEVBQUU7d0JBQ3pDLGtCQUFrQjt3QkFDbEIsRUFBRSxHQUFHLEVBQUUsYUFBYSxFQUFFO3dCQUN0QixHQUFHO3dCQUNILEVBQUUsR0FBRyxFQUFFLGdCQUFnQixFQUFFO3FCQUMxQixDQUFDO2FBQ0g7U0FDRjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJy4uL2xpYic7XG5cbmxldCBzdGFjazogY2RrLlN0YWNrO1xubGV0IHZwYzogZWMyLklWcGM7XG5sZXQgc2VjcmV0OiBzZWNyZXRzbWFuYWdlci5JU2VjcmV0O1xubGV0IHNlY3VyaXR5R3JvdXA6IGVjMi5TZWN1cml0eUdyb3VwO1xubGV0IHRhcmdldDogZWMyLkNvbm5lY3Rpb25zO1xuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycpO1xuICBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jyk7XG4gIHNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwJywgeyB2cGMgfSk7XG4gIHRhcmdldCA9IG5ldyBlYzIuQ29ubmVjdGlvbnMoe1xuICAgIGRlZmF1bHRQb3J0OiBlYzIuUG9ydC50Y3AoMzMwNiksXG4gICAgc2VjdXJpdHlHcm91cHM6IFtzZWN1cml0eUdyb3VwXSxcbiAgfSk7XG59KTtcblxuXG50ZXN0KCdzZWNyZXQgcm90YXRpb24gc2luZ2xlIHVzZXInLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGV4Y2x1ZGVDaGFyYWN0ZXJzID0gJyA7KyV7fScgKyAnQFxcJ1wiYC9cXFxcIyc7IC8vIERNUyBhbmQgQkFTSCBwcm9ibGVtIGNoYXJzXG5cbiAgLy8gV0hFTlxuICBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0Um90YXRpb24oc3RhY2ssICdTZWNyZXRSb3RhdGlvbicsIHtcbiAgICBhcHBsaWNhdGlvbjogc2VjcmV0c21hbmFnZXIuU2VjcmV0Um90YXRpb25BcHBsaWNhdGlvbi5NWVNRTF9ST1RBVElPTl9TSU5HTEVfVVNFUixcbiAgICBzZWNyZXQsXG4gICAgdGFyZ2V0LFxuICAgIHZwYyxcbiAgICBleGNsdWRlQ2hhcmFjdGVyczogZXhjbHVkZUNoYXJhY3RlcnMsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwSW5ncmVzcycsIHtcbiAgICBJcFByb3RvY29sOiAndGNwJyxcbiAgICBEZXNjcmlwdGlvbjogJ2Zyb20gU2VjcmV0Um90YXRpb25TZWN1cml0eUdyb3VwQUVDNTIwQUI6MzMwNicsXG4gICAgRnJvbVBvcnQ6IDMzMDYsXG4gICAgR3JvdXBJZDoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdTZWN1cml0eUdyb3VwREQyNjM2MjEnLFxuICAgICAgICAnR3JvdXBJZCcsXG4gICAgICBdLFxuICAgIH0sXG4gICAgU291cmNlU2VjdXJpdHlHcm91cElkOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ1NlY3JldFJvdGF0aW9uU2VjdXJpdHlHcm91cDk5ODUwMTJCJyxcbiAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgXSxcbiAgICB9LFxuICAgIFRvUG9ydDogMzMwNixcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VjcmV0c01hbmFnZXI6OlJvdGF0aW9uU2NoZWR1bGUnLCB7XG4gICAgU2VjcmV0SWQ6IHtcbiAgICAgIFJlZjogJ1NlY3JldEE3MjBFRjA1JyxcbiAgICB9LFxuICAgIFJvdGF0aW9uTGFtYmRhQVJOOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ1NlY3JldFJvdGF0aW9uQTlGRkNGQTknLFxuICAgICAgICAnT3V0cHV0cy5Sb3RhdGlvbkxhbWJkYUFSTicsXG4gICAgICBdLFxuICAgIH0sXG4gICAgUm90YXRpb25SdWxlczoge1xuICAgICAgQXV0b21hdGljYWxseUFmdGVyRGF5czogMzAsXG4gICAgfSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJywge1xuICAgIEdyb3VwRGVzY3JpcHRpb246ICdEZWZhdWx0L1NlY3JldFJvdGF0aW9uL1NlY3VyaXR5R3JvdXAnLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OlNlcnZlcmxlc3M6OkFwcGxpY2F0aW9uJywge1xuICAgIFByb3BlcnRpZXM6IHtcbiAgICAgIExvY2F0aW9uOiB7XG4gICAgICAgIEFwcGxpY2F0aW9uSWQ6IHtcbiAgICAgICAgICAnRm46OkZpbmRJbk1hcCc6IFsnU2VjcmV0Um90YXRpb25TQVJNYXBwaW5nQzEwQTJGNUQnLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnYXBwbGljYXRpb25JZCddLFxuICAgICAgICB9LFxuICAgICAgICBTZW1hbnRpY1ZlcnNpb246IHtcbiAgICAgICAgICAnRm46OkZpbmRJbk1hcCc6IFsnU2VjcmV0Um90YXRpb25TQVJNYXBwaW5nQzEwQTJGNUQnLCB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LCAnc2VtYW50aWNWZXJzaW9uJ10sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBlbmRwb2ludDoge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnaHR0cHM6Ly9zZWNyZXRzbWFuYWdlci4nLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnLicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlVSTFN1ZmZpeCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIGZ1bmN0aW9uTmFtZTogJ1NlY3JldFJvdGF0aW9uJyxcbiAgICAgICAgZXhjbHVkZUNoYXJhY3RlcnM6IGV4Y2x1ZGVDaGFyYWN0ZXJzLFxuICAgICAgICB2cGNTZWN1cml0eUdyb3VwSWRzOiB7XG4gICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAnU2VjcmV0Um90YXRpb25TZWN1cml0eUdyb3VwOTk4NTAxMkInLFxuICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIHZwY1N1Ym5ldElkczoge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnVlBDUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ4QkNBMTBFMCcsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICcsJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQyU3VibmV0Q0ZDREFBN0EnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VjcmV0c01hbmFnZXI6OlJlc291cmNlUG9saWN5Jywge1xuICAgIFJlc291cmNlUG9saWN5OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogJ3NlY3JldHNtYW5hZ2VyOkRlbGV0ZVNlY3JldCcsXG4gICAgICAgICAgRWZmZWN0OiAnRGVueScsXG4gICAgICAgICAgUHJpbmNpcGFsOiB7XG4gICAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6aWFtOjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzpyb290JyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgIH0sXG4gICAgU2VjcmV0SWQ6IHtcbiAgICAgIFJlZjogJ1NlY3JldEE3MjBFRjA1JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdzZWNyZXQgcm90YXRpb24gbXVsdGkgdXNlcicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgbWFzdGVyU2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ01hc3RlclNlY3JldCcpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldFJvdGF0aW9uKHN0YWNrLCAnU2VjcmV0Um90YXRpb24nLCB7XG4gICAgYXBwbGljYXRpb246IHNlY3JldHNtYW5hZ2VyLlNlY3JldFJvdGF0aW9uQXBwbGljYXRpb24uTVlTUUxfUk9UQVRJT05fTVVMVElfVVNFUixcbiAgICBzZWNyZXQsXG4gICAgbWFzdGVyU2VjcmV0LFxuICAgIHRhcmdldCxcbiAgICB2cGMsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmVybGVzczo6QXBwbGljYXRpb24nLCB7XG4gICAgUGFyYW1ldGVyczoge1xuICAgICAgZW5kcG9pbnQ6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICdodHRwczovL3NlY3JldHNtYW5hZ2VyLicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnLicsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ0FXUzo6VVJMU3VmZml4JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBmdW5jdGlvbk5hbWU6ICdTZWNyZXRSb3RhdGlvbicsXG4gICAgICB2cGNTZWN1cml0eUdyb3VwSWRzOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdTZWNyZXRSb3RhdGlvblNlY3VyaXR5R3JvdXA5OTg1MDEyQicsXG4gICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHZwY1N1Ym5ldElkczoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnLCcsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQyU3VibmV0Q0ZDREFBN0EnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIG1hc3RlclNlY3JldEFybjoge1xuICAgICAgICBSZWY6ICdNYXN0ZXJTZWNyZXRBMTFCRjc4NScsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlY3JldHNNYW5hZ2VyOjpSZXNvdXJjZVBvbGljeScsIHtcbiAgICBSZXNvdXJjZVBvbGljeToge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdzZWNyZXRzbWFuYWdlcjpEZWxldGVTZWNyZXQnLFxuICAgICAgICAgIEVmZmVjdDogJ0RlbnknLFxuICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgQVdTOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6cm9vdCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICAgIFNlY3JldElkOiB7XG4gICAgICBSZWY6ICdNYXN0ZXJTZWNyZXRBMTFCRjc4NScsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnc2VjcmV0IHJvdGF0aW9uIGFsbG93cyBwYXNzaW5nIGFuIGVtcHR5IHN0cmluZyBmb3IgZXhjbHVkZUNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gIC8vIFdIRU5cbiAgbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldFJvdGF0aW9uKHN0YWNrLCAnU2VjcmV0Um90YXRpb24nLCB7XG4gICAgYXBwbGljYXRpb246IHNlY3JldHNtYW5hZ2VyLlNlY3JldFJvdGF0aW9uQXBwbGljYXRpb24uTUFSSUFEQl9ST1RBVElPTl9TSU5HTEVfVVNFUixcbiAgICBzZWNyZXQsXG4gICAgdGFyZ2V0LFxuICAgIHZwYyxcbiAgICBleGNsdWRlQ2hhcmFjdGVyczogJycsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmVybGVzczo6QXBwbGljYXRpb24nLCB7XG4gICAgUGFyYW1ldGVyczoge1xuICAgICAgZXhjbHVkZUNoYXJhY3RlcnM6ICcnLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3Rocm93cyB3aGVuIGNvbm5lY3Rpb25zIG9iamVjdCBoYXMgbm8gZGVmYXVsdCBwb3J0IHJhbmdlJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIGNvbnN0IHRhcmdldFdpdGhvdXREZWZhdWx0UG9ydCA9IG5ldyBlYzIuQ29ubmVjdGlvbnMoe1xuICAgIHNlY3VyaXR5R3JvdXBzOiBbc2VjdXJpdHlHcm91cF0sXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXRSb3RhdGlvbihzdGFjaywgJ1JvdGF0aW9uJywge1xuICAgIHNlY3JldCxcbiAgICBhcHBsaWNhdGlvbjogc2VjcmV0c21hbmFnZXIuU2VjcmV0Um90YXRpb25BcHBsaWNhdGlvbi5NWVNRTF9ST1RBVElPTl9TSU5HTEVfVVNFUixcbiAgICB2cGMsXG4gICAgdGFyZ2V0OiB0YXJnZXRXaXRob3V0RGVmYXVsdFBvcnQsXG4gIH0pKS50b1Rocm93KC9gdGFyZ2V0YC4rZGVmYXVsdCBwb3J0IHJhbmdlLyk7XG59KTtcblxudGVzdCgndGhyb3dzIHdoZW4gbWFzdGVyIHNlY3JldCBpcyBtaXNzaW5nIGZvciBhIG11bHRpIHVzZXIgYXBwbGljYXRpb24nLCAoKSA9PiB7XG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXRSb3RhdGlvbihzdGFjaywgJ1JvdGF0aW9uJywge1xuICAgIHNlY3JldCxcbiAgICBhcHBsaWNhdGlvbjogc2VjcmV0c21hbmFnZXIuU2VjcmV0Um90YXRpb25BcHBsaWNhdGlvbi5NWVNRTF9ST1RBVElPTl9NVUxUSV9VU0VSLFxuICAgIHZwYyxcbiAgICB0YXJnZXQsXG4gIH0pKS50b1Rocm93KC9UaGUgYG1hc3RlclNlY3JldGAgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIGFwcGxpY2F0aW9uIHVzaW5nIHRoZSBtdWx0aSB1c2VyIHNjaGVtZS8pO1xufSk7XG5cbnRlc3QoJ3JvdGF0aW9uIGZ1bmN0aW9uIG5hbWUgZG9lcyBub3QgZXhjZWVkIDY0IGNoYXJzJywgKCkgPT4ge1xuICAvLyBXSEVOXG4gIGNvbnN0IGlkID0gJ1NlY3JldFJvdGF0aW9uJy5yZXBlYXQoNSk7XG4gIG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXRSb3RhdGlvbihzdGFjaywgaWQsIHtcbiAgICBhcHBsaWNhdGlvbjogc2VjcmV0c21hbmFnZXIuU2VjcmV0Um90YXRpb25BcHBsaWNhdGlvbi5NWVNRTF9ST1RBVElPTl9TSU5HTEVfVVNFUixcbiAgICBzZWNyZXQsXG4gICAgdGFyZ2V0LFxuICAgIHZwYyxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZXJ2ZXJsZXNzOjpBcHBsaWNhdGlvbicsIHtcbiAgICBQYXJhbWV0ZXJzOiB7XG4gICAgICBlbmRwb2ludDoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJ2h0dHBzOi8vc2VjcmV0c21hbmFnZXIuJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICcuJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnQVdTOjpVUkxTdWZmaXgnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uTmFtZTogJ1JvdGF0aW9uU2VjcmV0Um90YXRpb25TZWNyZXRSb3RhdGlvblNlY3JldFJvdGF0aW9uU2VjcmV0Um90YXRpb24nLFxuICAgICAgdnBjU2VjdXJpdHlHcm91cElkczoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnU2VjcmV0Um90YXRpb25TZWNyZXRSb3RhdGlvblNlY3JldFJvdGF0aW9uU2VjcmV0Um90YXRpb25TZWNyZXRSb3RhdGlvblNlY3VyaXR5R3JvdXBCRkNCMTcxQScsXG4gICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHZwY1N1Ym5ldElkczoge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBSZWY6ICdWUENQcml2YXRlU3VibmV0MVN1Ym5ldDhCQ0ExMEUwJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnLCcsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFJlZjogJ1ZQQ1ByaXZhdGVTdWJuZXQyU3VibmV0Q0ZDREFBN0EnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG5cbnRlc3QoJ3dpdGggaW50ZXJmYWNlIHZwYyBlbmRwb2ludCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgZW5kcG9pbnQgPSBuZXcgZWMyLkludGVyZmFjZVZwY0VuZHBvaW50KHN0YWNrLCAnU2VjcmV0c01hbmFnZXJFbmRwb2ludCcsIHtcbiAgICBzZXJ2aWNlOiBlYzIuSW50ZXJmYWNlVnBjRW5kcG9pbnRBd3NTZXJ2aWNlLlNFQ1JFVFNfTUFOQUdFUixcbiAgICB2cGMsXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldFJvdGF0aW9uKHN0YWNrLCAnU2VjcmV0Um90YXRpb24nLCB7XG4gICAgYXBwbGljYXRpb246IHNlY3JldHNtYW5hZ2VyLlNlY3JldFJvdGF0aW9uQXBwbGljYXRpb24uTVlTUUxfUk9UQVRJT05fU0lOR0xFX1VTRVIsXG4gICAgc2VjcmV0LFxuICAgIHRhcmdldCxcbiAgICB2cGMsXG4gICAgZW5kcG9pbnQsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VydmVybGVzczo6QXBwbGljYXRpb24nLCB7XG4gICAgUGFyYW1ldGVyczoge1xuICAgICAgZW5kcG9pbnQ6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgJ2h0dHBzOi8vJyxcbiAgICAgICAgICB7IFJlZjogJ1NlY3JldHNNYW5hZ2VyRW5kcG9pbnQ1RTgzQzY2QicgfSxcbiAgICAgICAgICAnLnNlY3JldHNtYW5hZ2VyLicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAnLicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlVSTFN1ZmZpeCcgfSxcbiAgICAgICAgXV0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG4iXX0=