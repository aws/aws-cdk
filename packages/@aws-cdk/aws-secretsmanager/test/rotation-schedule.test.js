"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const kms = require("@aws-cdk/aws-kms");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const secretsmanager = require("../lib");
let stack;
beforeEach(() => {
    stack = new cdk.Stack();
});
test('create a rotation schedule with a rotation Lambda', () => {
    // GIVEN
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const rotationLambda = new lambda.Function(stack, 'Lambda', {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromInline('export.handler = event => event;'),
        handler: 'index.handler',
    });
    // WHEN
    new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
        secret,
        rotationLambda,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
        SecretId: {
            Ref: 'SecretA720EF05',
        },
        RotationLambdaARN: {
            'Fn::GetAtt': [
                'LambdaD247545B',
                'Arn',
            ],
        },
        RotationRules: {
            AutomaticallyAfterDays: 30,
        },
    });
});
test('assign permissions for rotation schedule with a rotation Lambda', () => {
    // GIVEN
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const rotationLambda = new lambda.Function(stack, 'Lambda', {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromInline('export.handler = event => event;'),
        handler: 'index.handler',
    });
    // WHEN
    new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
        secret,
        rotationLambda,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
        Action: 'lambda:InvokeFunction',
        FunctionName: {
            'Fn::GetAtt': [
                'LambdaD247545B',
                'Arn',
            ],
        },
        Principal: 'secretsmanager.amazonaws.com',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: [
                        'secretsmanager:DescribeSecret',
                        'secretsmanager:GetSecretValue',
                        'secretsmanager:PutSecretValue',
                        'secretsmanager:UpdateSecretVersionStage',
                    ],
                    Effect: 'Allow',
                    Resource: {
                        Ref: 'SecretA720EF05',
                    },
                },
                {
                    Action: 'secretsmanager:GetRandomPassword',
                    Effect: 'Allow',
                    Resource: '*',
                },
            ],
            Version: '2012-10-17',
        },
        PolicyName: 'LambdaServiceRoleDefaultPolicyDAE46E21',
        Roles: [
            {
                Ref: 'LambdaServiceRoleA8ED4D3B',
            },
        ],
    });
});
test('grants correct permissions for secret imported by name', () => {
    // GIVEN
    const secret = secretsmanager.Secret.fromSecretNameV2(stack, 'Secret', 'mySecretName');
    const rotationLambda = new lambda.Function(stack, 'Lambda', {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromInline('export.handler = event => event;'),
        handler: 'index.handler',
    });
    // WHEN
    new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
        secret,
        rotationLambda,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: assertions_1.Match.arrayWith([
                {
                    Action: [
                        'secretsmanager:DescribeSecret',
                        'secretsmanager:GetSecretValue',
                        'secretsmanager:PutSecretValue',
                        'secretsmanager:UpdateSecretVersionStage',
                    ],
                    Effect: 'Allow',
                    Resource: {
                        'Fn::Join': ['', [
                                'arn:',
                                { Ref: 'AWS::Partition' },
                                ':secretsmanager:',
                                { Ref: 'AWS::Region' },
                                ':',
                                { Ref: 'AWS::AccountId' },
                                ':secret:mySecretName-??????',
                            ]],
                    },
                },
            ]),
            Version: '2012-10-17',
        },
        PolicyName: 'LambdaServiceRoleDefaultPolicyDAE46E21',
        Roles: [
            {
                Ref: 'LambdaServiceRoleA8ED4D3B',
            },
        ],
    });
});
test('assign kms permissions for rotation schedule with a rotation Lambda', () => {
    // GIVEN
    const encryptionKey = new kms.Key(stack, 'Key');
    const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey });
    const rotationLambda = new lambda.Function(stack, 'Lambda', {
        runtime: lambda.Runtime.NODEJS_14_X,
        code: lambda.Code.fromInline('export.handler = event => event;'),
        handler: 'index.handler',
    });
    // WHEN
    new secretsmanager.RotationSchedule(stack, 'RotationSchedule', {
        secret,
        rotationLambda,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
            Statement: [assertions_1.Match.anyValue(), assertions_1.Match.anyValue(), assertions_1.Match.anyValue(),
                {
                    Action: [
                        'kms:Decrypt',
                        'kms:Encrypt',
                        'kms:ReEncrypt*',
                        'kms:GenerateDataKey*',
                    ],
                    Condition: {
                        StringEquals: {
                            'kms:ViaService': {
                                'Fn::Join': [
                                    '',
                                    [
                                        'secretsmanager.',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        '.amazonaws.com',
                                    ],
                                ],
                            },
                        },
                    },
                    Effect: 'Allow',
                    Principal: {
                        AWS: {
                            'Fn::GetAtt': [
                                'LambdaServiceRoleA8ED4D3B',
                                'Arn',
                            ],
                        },
                    },
                    Resource: '*',
                }],
        },
    });
});
describe('hosted rotation', () => {
    test('single user not in a vpc', () => {
        // GIVEN
        const app = new cdk.App();
        stack = new cdk.Stack(app, 'TestStack');
        const secret = new secretsmanager.Secret(stack, 'Secret');
        // WHEN
        secret.addRotationSchedule('RotationSchedule', {
            hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
            SecretId: {
                Ref: 'SecretA720EF05',
            },
            HostedRotationLambda: {
                RotationType: 'MySQLSingleUser',
                ExcludeCharacters: " %+~`#$&*()|[]{}:;<>?!'/@\"\\",
            },
            RotationRules: {
                AutomaticallyAfterDays: 30,
            },
        });
        expect(app.synth().getStackByName(stack.stackName).template).toEqual(expect.objectContaining({
            Transform: 'AWS::SecretsManager-2020-07-23',
        }));
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
    test('multi user not in a vpc', () => {
        // GIVEN
        const secret = new secretsmanager.Secret(stack, 'Secret');
        const masterSecret = new secretsmanager.Secret(stack, 'MasterSecret');
        // WHEN
        secret.addRotationSchedule('RotationSchedule', {
            hostedRotation: secretsmanager.HostedRotation.postgreSqlMultiUser({
                masterSecret,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
            SecretId: {
                Ref: 'SecretA720EF05',
            },
            HostedRotationLambda: {
                MasterSecretArn: {
                    Ref: 'MasterSecretA11BF785',
                },
                RotationType: 'PostgreSQLMultiUser',
            },
            RotationRules: {
                AutomaticallyAfterDays: 30,
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
    test('single user in a vpc', () => {
        // GIVEN
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const secret = new secretsmanager.Secret(stack, 'Secret');
        const dbSecurityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
        const dbConnections = new ec2.Connections({
            defaultPort: ec2.Port.tcp(3306),
            securityGroups: [dbSecurityGroup],
        });
        // WHEN
        const hostedRotation = secretsmanager.HostedRotation.mysqlSingleUser({ vpc });
        secret.addRotationSchedule('RotationSchedule', { hostedRotation });
        dbConnections.allowDefaultPortFrom(hostedRotation);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
            SecretId: {
                Ref: 'SecretA720EF05',
            },
            HostedRotationLambda: {
                RotationType: 'MySQLSingleUser',
                VpcSecurityGroupIds: {
                    'Fn::GetAtt': [
                        'SecretRotationScheduleSecurityGroup3F1F76EA',
                        'GroupId',
                    ],
                },
                VpcSubnetIds: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                Ref: 'VpcPrivateSubnet1Subnet536B997A',
                            },
                            ',',
                            {
                                Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
                            },
                        ],
                    ],
                },
            },
            RotationRules: {
                AutomaticallyAfterDays: 30,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
            FromPort: 3306,
            GroupId: {
                'Fn::GetAtt': [
                    'SecurityGroupDD263621',
                    'GroupId',
                ],
            },
            SourceSecurityGroupId: {
                'Fn::GetAtt': [
                    'SecretRotationScheduleSecurityGroup3F1F76EA',
                    'GroupId',
                ],
            },
            ToPort: 3306,
        });
    });
    test('single user in a vpc with security groups', () => {
        // GIVEN
        const vpc = new ec2.Vpc(stack, 'Vpc');
        const secret = new secretsmanager.Secret(stack, 'Secret');
        const dbSecurityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
        const dbConnections = new ec2.Connections({
            defaultPort: ec2.Port.tcp(3306),
            securityGroups: [dbSecurityGroup],
        });
        // WHEN
        const hostedRotation = secretsmanager.HostedRotation.mysqlSingleUser({
            vpc,
            securityGroups: [
                new ec2.SecurityGroup(stack, 'SG1', { vpc }),
                new ec2.SecurityGroup(stack, 'SG2', { vpc }),
            ],
        });
        secret.addRotationSchedule('RotationSchedule', { hostedRotation });
        dbConnections.allowDefaultPortFrom(hostedRotation);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
            SecretId: {
                Ref: 'SecretA720EF05',
            },
            HostedRotationLambda: {
                RotationType: 'MySQLSingleUser',
                VpcSecurityGroupIds: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                'Fn::GetAtt': [
                                    'SG1BA065B6E',
                                    'GroupId',
                                ],
                            },
                            ',',
                            {
                                'Fn::GetAtt': [
                                    'SG20CE3219C',
                                    'GroupId',
                                ],
                            },
                        ],
                    ],
                },
                VpcSubnetIds: {
                    'Fn::Join': [
                        '',
                        [
                            {
                                Ref: 'VpcPrivateSubnet1Subnet536B997A',
                            },
                            ',',
                            {
                                Ref: 'VpcPrivateSubnet2Subnet3788AAA1',
                            },
                        ],
                    ],
                },
            },
            RotationRules: {
                AutomaticallyAfterDays: 30,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
            FromPort: 3306,
            GroupId: {
                'Fn::GetAtt': [
                    'SecurityGroupDD263621',
                    'GroupId',
                ],
            },
            SourceSecurityGroupId: {
                'Fn::GetAtt': [
                    'SG20CE3219C',
                    'GroupId',
                ],
            },
            ToPort: 3306,
        });
    });
    test('throws with security groups and no vpc', () => {
        // GIVEN
        const secret = new secretsmanager.Secret(stack, 'Secret');
        // THEN
        expect(() => secret.addRotationSchedule('RotationSchedule', {
            hostedRotation: secretsmanager.HostedRotation.oracleSingleUser({
                securityGroups: [ec2.SecurityGroup.fromSecurityGroupId(secret, 'SG', 'sg-12345678')],
            }),
        })).toThrow(/`vpc` must be specified when specifying `securityGroups`/);
    });
    test('throws when accessing the connections object when not in a vpc', () => {
        // GIVEN
        const secret = new secretsmanager.Secret(stack, 'Secret');
        // WHEN
        const hostedRotation = secretsmanager.HostedRotation.sqlServerSingleUser();
        secret.addRotationSchedule('RotationSchedule', { hostedRotation });
        // THEN
        expect(() => hostedRotation.connections.allowToAnyIpv4(ec2.Port.allTraffic()))
            .toThrow(/Cannot use connections for a hosted rotation that is not deployed in a VPC/);
    });
    test('can customize exclude characters', () => {
        // GIVEN
        const app = new cdk.App();
        stack = new cdk.Stack(app, 'TestStack');
        const secret = new secretsmanager.Secret(stack, 'Secret');
        // WHEN
        secret.addRotationSchedule('RotationSchedule', {
            hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser({
                excludeCharacters: '()',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
            HostedRotationLambda: {
                RotationType: 'MySQLSingleUser',
                ExcludeCharacters: '()',
            },
        });
    });
    test('exclude characters default to secret exclude characters', () => {
        // GIVEN
        const app = new cdk.App();
        stack = new cdk.Stack(app, 'TestStack');
        const secret = new secretsmanager.Secret(stack, 'Secret', {
            generateSecretString: {
                excludeCharacters: '[]',
            },
        });
        // WHEN
        secret.addRotationSchedule('RotationSchedule', {
            hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', {
            HostedRotationLambda: {
                RotationType: 'MySQLSingleUser',
                ExcludeCharacters: '[]',
            },
        });
    });
});
describe('manual rotations', () => {
    test('automaticallyAfter with any duration of zero leaves RotationRules unset', () => {
        const checkRotationNotSet = (automaticallyAfter) => {
            // GIVEN
            const localStack = new cdk.Stack();
            const secret = new secretsmanager.Secret(localStack, 'Secret');
            const rotationLambda = new lambda.Function(localStack, 'Lambda', {
                runtime: lambda.Runtime.NODEJS_14_X,
                code: lambda.Code.fromInline('export.handler = event => event;'),
                handler: 'index.handler',
            });
            // WHEN
            new secretsmanager.RotationSchedule(localStack, 'RotationSchedule', {
                secret,
                rotationLambda,
                automaticallyAfter,
            });
            // THEN
            assertions_1.Template.fromStack(localStack).hasResourceProperties('AWS::SecretsManager::RotationSchedule', assertions_1.Match.objectEquals({
                SecretId: { Ref: 'SecretA720EF05' },
                RotationLambdaARN: {
                    'Fn::GetAtt': [
                        'LambdaD247545B',
                        'Arn',
                    ],
                },
            }));
        };
        checkRotationNotSet(core_1.Duration.days(0));
        checkRotationNotSet(core_1.Duration.hours(0));
        checkRotationNotSet(core_1.Duration.minutes(0));
        checkRotationNotSet(core_1.Duration.seconds(0));
        checkRotationNotSet(core_1.Duration.millis(0));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm90YXRpb24tc2NoZWR1bGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJvdGF0aW9uLXNjaGVkdWxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyw4Q0FBOEM7QUFDOUMscUNBQXFDO0FBQ3JDLHdDQUF5QztBQUN6Qyx5Q0FBeUM7QUFFekMsSUFBSSxLQUFnQixDQUFDO0FBQ3JCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsbURBQW1ELEVBQUUsR0FBRyxFQUFFO0lBQzdELFFBQVE7SUFDUixNQUFNLE1BQU0sR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzFELE1BQU0sY0FBYyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQzFELE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7UUFDbkMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGtDQUFrQyxDQUFDO1FBQ2hFLE9BQU8sRUFBRSxlQUFlO0tBQ3pCLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxJQUFJLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7UUFDN0QsTUFBTTtRQUNOLGNBQWM7S0FDZixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsdUNBQXVDLEVBQUU7UUFDdkYsUUFBUSxFQUFFO1lBQ1IsR0FBRyxFQUFFLGdCQUFnQjtTQUN0QjtRQUNELGlCQUFpQixFQUFFO1lBQ2pCLFlBQVks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QUMsQ0FBQyxDQUFDO1FBQ3pDLG1CQUFtQixDQUFDLGVBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxtQkFBbUIsQ0FBQyxlQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgRHVyYXRpb24gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHNlY3JldHNtYW5hZ2VyIGZyb20gJy4uL2xpYic7XG5cbmxldCBzdGFjazogY2RrLlN0YWNrO1xuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xufSk7XG5cbnRlc3QoJ2NyZWF0ZSBhIHJvdGF0aW9uIHNjaGVkdWxlIHdpdGggYSByb3RhdGlvbiBMYW1iZGEnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnKTtcbiAgY29uc3Qgcm90YXRpb25MYW1iZGEgPSBuZXcgbGFtYmRhLkZ1bmN0aW9uKHN0YWNrLCAnTGFtYmRhJywge1xuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2V4cG9ydC5oYW5kbGVyID0gZXZlbnQgPT4gZXZlbnQ7JyksXG4gICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIG5ldyBzZWNyZXRzbWFuYWdlci5Sb3RhdGlvblNjaGVkdWxlKHN0YWNrLCAnUm90YXRpb25TY2hlZHVsZScsIHtcbiAgICBzZWNyZXQsXG4gICAgcm90YXRpb25MYW1iZGEsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VjcmV0c01hbmFnZXI6OlJvdGF0aW9uU2NoZWR1bGUnLCB7XG4gICAgU2VjcmV0SWQ6IHtcbiAgICAgIFJlZjogJ1NlY3JldEE3MjBFRjA1JyxcbiAgICB9LFxuICAgIFJvdGF0aW9uTGFtYmRhQVJOOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ0xhbWJkYUQyNDc1NDVCJyxcbiAgICAgICAgJ0FybicsXG4gICAgICBdLFxuICAgIH0sXG4gICAgUm90YXRpb25SdWxlczoge1xuICAgICAgQXV0b21hdGljYWxseUFmdGVyRGF5czogMzAsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnYXNzaWduIHBlcm1pc3Npb25zIGZvciByb3RhdGlvbiBzY2hlZHVsZSB3aXRoIGEgcm90YXRpb24gTGFtYmRhJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jyk7XG4gIGNvbnN0IHJvdGF0aW9uTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0xhbWJkYScsIHtcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdleHBvcnQuaGFuZGxlciA9IGV2ZW50ID0+IGV2ZW50OycpLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc2VjcmV0c21hbmFnZXIuUm90YXRpb25TY2hlZHVsZShzdGFjaywgJ1JvdGF0aW9uU2NoZWR1bGUnLCB7XG4gICAgc2VjcmV0LFxuICAgIHJvdGF0aW9uTGFtYmRhLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6UGVybWlzc2lvbicsIHtcbiAgICBBY3Rpb246ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgIEZ1bmN0aW9uTmFtZToge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdMYW1iZGFEMjQ3NTQ1QicsXG4gICAgICAgICdBcm4nLFxuICAgICAgXSxcbiAgICB9LFxuICAgIFByaW5jaXBhbDogJ3NlY3JldHNtYW5hZ2VyLmFtYXpvbmF3cy5jb20nLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpEZXNjcmliZVNlY3JldCcsXG4gICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOlB1dFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpVcGRhdGVTZWNyZXRWZXJzaW9uU3RhZ2UnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICBSZWY6ICdTZWNyZXRBNzIwRUYwNScsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogJ3NlY3JldHNtYW5hZ2VyOkdldFJhbmRvbVBhc3N3b3JkJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgICBQb2xpY3lOYW1lOiAnTGFtYmRhU2VydmljZVJvbGVEZWZhdWx0UG9saWN5REFFNDZFMjEnLFxuICAgIFJvbGVzOiBbXG4gICAgICB7XG4gICAgICAgIFJlZjogJ0xhbWJkYVNlcnZpY2VSb2xlQThFRDREM0InLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdncmFudHMgY29ycmVjdCBwZXJtaXNzaW9ucyBmb3Igc2VjcmV0IGltcG9ydGVkIGJ5IG5hbWUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHNlY3JldCA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0TmFtZVYyKHN0YWNrLCAnU2VjcmV0JywgJ215U2VjcmV0TmFtZScpO1xuICBjb25zdCByb3RhdGlvbkxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24oc3RhY2ssICdMYW1iZGEnLCB7XG4gICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUlubGluZSgnZXhwb3J0LmhhbmRsZXIgPSBldmVudCA9PiBldmVudDsnKSxcbiAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHNlY3JldHNtYW5hZ2VyLlJvdGF0aW9uU2NoZWR1bGUoc3RhY2ssICdSb3RhdGlvblNjaGVkdWxlJywge1xuICAgIHNlY3JldCxcbiAgICByb3RhdGlvbkxhbWJkYSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBNYXRjaC5hcnJheVdpdGgoW1xuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiBbXG4gICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6RGVzY3JpYmVTZWNyZXQnLFxuICAgICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAgICdzZWNyZXRzbWFuYWdlcjpQdXRTZWNyZXRWYWx1ZScsXG4gICAgICAgICAgICAnc2VjcmV0c21hbmFnZXI6VXBkYXRlU2VjcmV0VmVyc2lvblN0YWdlJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgJzpzZWNyZXRzbWFuYWdlcjonLFxuICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAgICc6c2VjcmV0Om15U2VjcmV0TmFtZS0/Pz8/Pz8nLFxuICAgICAgICAgICAgXV0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0pLFxuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgIH0sXG4gICAgUG9saWN5TmFtZTogJ0xhbWJkYVNlcnZpY2VSb2xlRGVmYXVsdFBvbGljeURBRTQ2RTIxJyxcbiAgICBSb2xlczogW1xuICAgICAge1xuICAgICAgICBSZWY6ICdMYW1iZGFTZXJ2aWNlUm9sZUE4RUQ0RDNCJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG59KTtcblxudGVzdCgnYXNzaWduIGttcyBwZXJtaXNzaW9ucyBmb3Igcm90YXRpb24gc2NoZWR1bGUgd2l0aCBhIHJvdGF0aW9uIExhbWJkYScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgZW5jcnlwdGlvbktleSA9IG5ldyBrbXMuS2V5KHN0YWNrLCAnS2V5Jyk7XG4gIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnLCB7IGVuY3J5cHRpb25LZXkgfSk7XG4gIGNvbnN0IHJvdGF0aW9uTGFtYmRhID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ0xhbWJkYScsIHtcbiAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKCdleHBvcnQuaGFuZGxlciA9IGV2ZW50ID0+IGV2ZW50OycpLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc2VjcmV0c21hbmFnZXIuUm90YXRpb25TY2hlZHVsZShzdGFjaywgJ1JvdGF0aW9uU2NoZWR1bGUnLCB7XG4gICAgc2VjcmV0LFxuICAgIHJvdGF0aW9uTGFtYmRhLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OktNUzo6S2V5Jywge1xuICAgIEtleVBvbGljeToge1xuICAgICAgU3RhdGVtZW50OiBbTWF0Y2guYW55VmFsdWUoKSwgTWF0Y2guYW55VmFsdWUoKSwgTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICdrbXM6RW5jcnlwdCcsXG4gICAgICAgICAgICAna21zOlJlRW5jcnlwdConLFxuICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgIENvbmRpdGlvbjoge1xuICAgICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAgICdrbXM6VmlhU2VydmljZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ3NlY3JldHNtYW5hZ2VyLicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICcuYW1hem9uYXdzLmNvbScsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgQVdTOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdMYW1iZGFTZXJ2aWNlUm9sZUE4RUQ0RDNCJyxcbiAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9XSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnaG9zdGVkIHJvdGF0aW9uJywgKCkgPT4ge1xuICB0ZXN0KCdzaW5nbGUgdXNlciBub3QgaW4gYSB2cGMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbiAgICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jyk7XG5cbiAgICAvLyBXSEVOXG4gICAgc2VjcmV0LmFkZFJvdGF0aW9uU2NoZWR1bGUoJ1JvdGF0aW9uU2NoZWR1bGUnLCB7XG4gICAgICBob3N0ZWRSb3RhdGlvbjogc2VjcmV0c21hbmFnZXIuSG9zdGVkUm90YXRpb24ubXlzcWxTaW5nbGVVc2VyKCksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VjcmV0c01hbmFnZXI6OlJvdGF0aW9uU2NoZWR1bGUnLCB7XG4gICAgICBTZWNyZXRJZDoge1xuICAgICAgICBSZWY6ICdTZWNyZXRBNzIwRUYwNScsXG4gICAgICB9LFxuICAgICAgSG9zdGVkUm90YXRpb25MYW1iZGE6IHtcbiAgICAgICAgUm90YXRpb25UeXBlOiAnTXlTUUxTaW5nbGVVc2VyJyxcbiAgICAgICAgRXhjbHVkZUNoYXJhY3RlcnM6IFwiICUrfmAjJCYqKCl8W117fTo7PD4/IScvQFxcXCJcXFxcXCIsXG4gICAgICB9LFxuICAgICAgUm90YXRpb25SdWxlczoge1xuICAgICAgICBBdXRvbWF0aWNhbGx5QWZ0ZXJEYXlzOiAzMCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QoYXBwLnN5bnRoKCkuZ2V0U3RhY2tCeU5hbWUoc3RhY2suc3RhY2tOYW1lKS50ZW1wbGF0ZSkudG9FcXVhbChleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICBUcmFuc2Zvcm06ICdBV1M6OlNlY3JldHNNYW5hZ2VyLTIwMjAtMDctMjMnLFxuICAgIH0pKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlY3JldHNNYW5hZ2VyOjpSZXNvdXJjZVBvbGljeScsIHtcbiAgICAgIFJlc291cmNlUG9saWN5OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3NlY3JldHNtYW5hZ2VyOkRlbGV0ZVNlY3JldCcsXG4gICAgICAgICAgICBFZmZlY3Q6ICdEZW55JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBBV1M6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAnOmlhbTo6JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzpyb290JyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgIH0sXG4gICAgICBTZWNyZXRJZDoge1xuICAgICAgICBSZWY6ICdTZWNyZXRBNzIwRUYwNScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdtdWx0aSB1c2VyIG5vdCBpbiBhIHZwYycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnKTtcbiAgICBjb25zdCBtYXN0ZXJTZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnTWFzdGVyU2VjcmV0Jyk7XG5cbiAgICAvLyBXSEVOXG4gICAgc2VjcmV0LmFkZFJvdGF0aW9uU2NoZWR1bGUoJ1JvdGF0aW9uU2NoZWR1bGUnLCB7XG4gICAgICBob3N0ZWRSb3RhdGlvbjogc2VjcmV0c21hbmFnZXIuSG9zdGVkUm90YXRpb24ucG9zdGdyZVNxbE11bHRpVXNlcih7XG4gICAgICAgIG1hc3RlclNlY3JldCxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlY3JldHNNYW5hZ2VyOjpSb3RhdGlvblNjaGVkdWxlJywge1xuICAgICAgU2VjcmV0SWQ6IHtcbiAgICAgICAgUmVmOiAnU2VjcmV0QTcyMEVGMDUnLFxuICAgICAgfSxcbiAgICAgIEhvc3RlZFJvdGF0aW9uTGFtYmRhOiB7XG4gICAgICAgIE1hc3RlclNlY3JldEFybjoge1xuICAgICAgICAgIFJlZjogJ01hc3RlclNlY3JldEExMUJGNzg1JyxcbiAgICAgICAgfSxcbiAgICAgICAgUm90YXRpb25UeXBlOiAnUG9zdGdyZVNRTE11bHRpVXNlcicsXG4gICAgICB9LFxuICAgICAgUm90YXRpb25SdWxlczoge1xuICAgICAgICBBdXRvbWF0aWNhbGx5QWZ0ZXJEYXlzOiAzMCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZWNyZXRzTWFuYWdlcjo6UmVzb3VyY2VQb2xpY3knLCB7XG4gICAgICBSZXNvdXJjZVBvbGljeToge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzZWNyZXRzbWFuYWdlcjpEZWxldGVTZWNyZXQnLFxuICAgICAgICAgICAgRWZmZWN0OiAnRGVueScsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgQVdTOiB7XG4gICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJzppYW06OicsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICc6cm9vdCcsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgICAgU2VjcmV0SWQ6IHtcbiAgICAgICAgUmVmOiAnTWFzdGVyU2VjcmV0QTExQkY3ODUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc2luZ2xlIHVzZXIgaW4gYSB2cGMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuICAgIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnKTtcbiAgICBjb25zdCBkYlNlY3VyaXR5R3JvdXAgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZWN1cml0eUdyb3VwJywgeyB2cGMgfSk7XG4gICAgY29uc3QgZGJDb25uZWN0aW9ucyA9IG5ldyBlYzIuQ29ubmVjdGlvbnMoe1xuICAgICAgZGVmYXVsdFBvcnQ6IGVjMi5Qb3J0LnRjcCgzMzA2KSxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbZGJTZWN1cml0eUdyb3VwXSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBob3N0ZWRSb3RhdGlvbiA9IHNlY3JldHNtYW5hZ2VyLkhvc3RlZFJvdGF0aW9uLm15c3FsU2luZ2xlVXNlcih7IHZwYyB9KTtcbiAgICBzZWNyZXQuYWRkUm90YXRpb25TY2hlZHVsZSgnUm90YXRpb25TY2hlZHVsZScsIHsgaG9zdGVkUm90YXRpb24gfSk7XG4gICAgZGJDb25uZWN0aW9ucy5hbGxvd0RlZmF1bHRQb3J0RnJvbShob3N0ZWRSb3RhdGlvbik7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VjcmV0c01hbmFnZXI6OlJvdGF0aW9uU2NoZWR1bGUnLCB7XG4gICAgICBTZWNyZXRJZDoge1xuICAgICAgICBSZWY6ICdTZWNyZXRBNzIwRUYwNScsXG4gICAgICB9LFxuICAgICAgSG9zdGVkUm90YXRpb25MYW1iZGE6IHtcbiAgICAgICAgUm90YXRpb25UeXBlOiAnTXlTUUxTaW5nbGVVc2VyJyxcbiAgICAgICAgVnBjU2VjdXJpdHlHcm91cElkczoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ1NlY3JldFJvdGF0aW9uU2NoZWR1bGVTZWN1cml0eUdyb3VwM0YxRjc2RUEnLFxuICAgICAgICAgICAgJ0dyb3VwSWQnLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICAgIFZwY1N1Ym5ldElkczoge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnVnBjUHJpdmF0ZVN1Ym5ldDFTdWJuZXQ1MzZCOTk3QScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICcsJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ1ZwY1ByaXZhdGVTdWJuZXQyU3VibmV0Mzc4OEFBQTEnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIFJvdGF0aW9uUnVsZXM6IHtcbiAgICAgICAgQXV0b21hdGljYWxseUFmdGVyRGF5czogMzAsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwSW5ncmVzcycsIHtcbiAgICAgIEZyb21Qb3J0OiAzMzA2LFxuICAgICAgR3JvdXBJZDoge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnU2VjdXJpdHlHcm91cEREMjYzNjIxJyxcbiAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgU291cmNlU2VjdXJpdHlHcm91cElkOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdTZWNyZXRSb3RhdGlvblNjaGVkdWxlU2VjdXJpdHlHcm91cDNGMUY3NkVBJyxcbiAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgVG9Qb3J0OiAzMzA2LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzaW5nbGUgdXNlciBpbiBhIHZwYyB3aXRoIHNlY3VyaXR5IGdyb3VwcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG4gICAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcpO1xuICAgIGNvbnN0IGRiU2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ1NlY3VyaXR5R3JvdXAnLCB7IHZwYyB9KTtcbiAgICBjb25zdCBkYkNvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucyh7XG4gICAgICBkZWZhdWx0UG9ydDogZWMyLlBvcnQudGNwKDMzMDYpLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IFtkYlNlY3VyaXR5R3JvdXBdLFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGhvc3RlZFJvdGF0aW9uID0gc2VjcmV0c21hbmFnZXIuSG9zdGVkUm90YXRpb24ubXlzcWxTaW5nbGVVc2VyKHtcbiAgICAgIHZwYyxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbXG4gICAgICAgIG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ1NHMScsIHsgdnBjIH0pLFxuICAgICAgICBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTRzInLCB7IHZwYyB9KSxcbiAgICAgIF0sXG4gICAgfSk7XG4gICAgc2VjcmV0LmFkZFJvdGF0aW9uU2NoZWR1bGUoJ1JvdGF0aW9uU2NoZWR1bGUnLCB7IGhvc3RlZFJvdGF0aW9uIH0pO1xuICAgIGRiQ29ubmVjdGlvbnMuYWxsb3dEZWZhdWx0UG9ydEZyb20oaG9zdGVkUm90YXRpb24pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlNlY3JldHNNYW5hZ2VyOjpSb3RhdGlvblNjaGVkdWxlJywge1xuICAgICAgU2VjcmV0SWQ6IHtcbiAgICAgICAgUmVmOiAnU2VjcmV0QTcyMEVGMDUnLFxuICAgICAgfSxcbiAgICAgIEhvc3RlZFJvdGF0aW9uTGFtYmRhOiB7XG4gICAgICAgIFJvdGF0aW9uVHlwZTogJ015U1FMU2luZ2xlVXNlcicsXG4gICAgICAgIFZwY1NlY3VyaXR5R3JvdXBJZHM6IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICAgJ1NHMUJBMDY1QjZFJyxcbiAgICAgICAgICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnLCcsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdTRzIwQ0UzMjE5QycsXG4gICAgICAgICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgVnBjU3VibmV0SWRzOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdWcGNQcml2YXRlU3VibmV0MVN1Ym5ldDUzNkI5OTdBJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJywnLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnVnBjUHJpdmF0ZVN1Ym5ldDJTdWJuZXQzNzg4QUFBMScsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgUm90YXRpb25SdWxlczoge1xuICAgICAgICBBdXRvbWF0aWNhbGx5QWZ0ZXJEYXlzOiAzMCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQzI6OlNlY3VyaXR5R3JvdXBJbmdyZXNzJywge1xuICAgICAgRnJvbVBvcnQ6IDMzMDYsXG4gICAgICBHcm91cElkOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdTZWN1cml0eUdyb3VwREQyNjM2MjEnLFxuICAgICAgICAgICdHcm91cElkJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBTb3VyY2VTZWN1cml0eUdyb3VwSWQ6IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgJ1NHMjBDRTMyMTlDJyxcbiAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgVG9Qb3J0OiAzMzA2LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2l0aCBzZWN1cml0eSBncm91cHMgYW5kIG5vIHZwYycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gc2VjcmV0LmFkZFJvdGF0aW9uU2NoZWR1bGUoJ1JvdGF0aW9uU2NoZWR1bGUnLCB7XG4gICAgICBob3N0ZWRSb3RhdGlvbjogc2VjcmV0c21hbmFnZXIuSG9zdGVkUm90YXRpb24ub3JhY2xlU2luZ2xlVXNlcih7XG4gICAgICAgIHNlY3VyaXR5R3JvdXBzOiBbZWMyLlNlY3VyaXR5R3JvdXAuZnJvbVNlY3VyaXR5R3JvdXBJZChzZWNyZXQsICdTRycsICdzZy0xMjM0NTY3OCcpXSxcbiAgICAgIH0pLFxuICAgIH0pKS50b1Rocm93KC9gdnBjYCBtdXN0IGJlIHNwZWNpZmllZCB3aGVuIHNwZWNpZnlpbmcgYHNlY3VyaXR5R3JvdXBzYC8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBhY2Nlc3NpbmcgdGhlIGNvbm5lY3Rpb25zIG9iamVjdCB3aGVuIG5vdCBpbiBhIHZwYycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBob3N0ZWRSb3RhdGlvbiA9IHNlY3JldHNtYW5hZ2VyLkhvc3RlZFJvdGF0aW9uLnNxbFNlcnZlclNpbmdsZVVzZXIoKTtcbiAgICBzZWNyZXQuYWRkUm90YXRpb25TY2hlZHVsZSgnUm90YXRpb25TY2hlZHVsZScsIHsgaG9zdGVkUm90YXRpb24gfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IGhvc3RlZFJvdGF0aW9uLmNvbm5lY3Rpb25zLmFsbG93VG9BbnlJcHY0KGVjMi5Qb3J0LmFsbFRyYWZmaWMoKSkpXG4gICAgICAudG9UaHJvdygvQ2Fubm90IHVzZSBjb25uZWN0aW9ucyBmb3IgYSBob3N0ZWQgcm90YXRpb24gdGhhdCBpcyBub3QgZGVwbG95ZWQgaW4gYSBWUEMvKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGN1c3RvbWl6ZSBleGNsdWRlIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdUZXN0U3RhY2snKTtcbiAgICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jyk7XG5cbiAgICAvLyBXSEVOXG4gICAgc2VjcmV0LmFkZFJvdGF0aW9uU2NoZWR1bGUoJ1JvdGF0aW9uU2NoZWR1bGUnLCB7XG4gICAgICBob3N0ZWRSb3RhdGlvbjogc2VjcmV0c21hbmFnZXIuSG9zdGVkUm90YXRpb24ubXlzcWxTaW5nbGVVc2VyKHtcbiAgICAgICAgZXhjbHVkZUNoYXJhY3RlcnM6ICcoKScsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTZWNyZXRzTWFuYWdlcjo6Um90YXRpb25TY2hlZHVsZScsIHtcbiAgICAgIEhvc3RlZFJvdGF0aW9uTGFtYmRhOiB7XG4gICAgICAgIFJvdGF0aW9uVHlwZTogJ015U1FMU2luZ2xlVXNlcicsXG4gICAgICAgIEV4Y2x1ZGVDaGFyYWN0ZXJzOiAnKCknLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZXhjbHVkZSBjaGFyYWN0ZXJzIGRlZmF1bHQgdG8gc2VjcmV0IGV4Y2x1ZGUgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuICAgIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnLCB7XG4gICAgICBnZW5lcmF0ZVNlY3JldFN0cmluZzoge1xuICAgICAgICBleGNsdWRlQ2hhcmFjdGVyczogJ1tdJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgc2VjcmV0LmFkZFJvdGF0aW9uU2NoZWR1bGUoJ1JvdGF0aW9uU2NoZWR1bGUnLCB7XG4gICAgICBob3N0ZWRSb3RhdGlvbjogc2VjcmV0c21hbmFnZXIuSG9zdGVkUm90YXRpb24ubXlzcWxTaW5nbGVVc2VyKCksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VjcmV0c01hbmFnZXI6OlJvdGF0aW9uU2NoZWR1bGUnLCB7XG4gICAgICBIb3N0ZWRSb3RhdGlvbkxhbWJkYToge1xuICAgICAgICBSb3RhdGlvblR5cGU6ICdNeVNRTFNpbmdsZVVzZXInLFxuICAgICAgICBFeGNsdWRlQ2hhcmFjdGVyczogJ1tdJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdtYW51YWwgcm90YXRpb25zJywgKCkgPT4ge1xuICB0ZXN0KCdhdXRvbWF0aWNhbGx5QWZ0ZXIgd2l0aCBhbnkgZHVyYXRpb24gb2YgemVybyBsZWF2ZXMgUm90YXRpb25SdWxlcyB1bnNldCcsICgpID0+IHtcbiAgICBjb25zdCBjaGVja1JvdGF0aW9uTm90U2V0ID0gKGF1dG9tYXRpY2FsbHlBZnRlcjogRHVyYXRpb24pID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBsb2NhbFN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChsb2NhbFN0YWNrLCAnU2VjcmV0Jyk7XG4gICAgICBjb25zdCByb3RhdGlvbkxhbWJkYSA9IG5ldyBsYW1iZGEuRnVuY3Rpb24obG9jYWxTdGFjaywgJ0xhbWJkYScsIHtcbiAgICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2V4cG9ydC5oYW5kbGVyID0gZXZlbnQgPT4gZXZlbnQ7JyksXG4gICAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgc2VjcmV0c21hbmFnZXIuUm90YXRpb25TY2hlZHVsZShsb2NhbFN0YWNrLCAnUm90YXRpb25TY2hlZHVsZScsIHtcbiAgICAgICAgc2VjcmV0LFxuICAgICAgICByb3RhdGlvbkxhbWJkYSxcbiAgICAgICAgYXV0b21hdGljYWxseUFmdGVyLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhsb2NhbFN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U2VjcmV0c01hbmFnZXI6OlJvdGF0aW9uU2NoZWR1bGUnLCBNYXRjaC5vYmplY3RFcXVhbHMoe1xuICAgICAgICBTZWNyZXRJZDogeyBSZWY6ICdTZWNyZXRBNzIwRUYwNScgfSxcbiAgICAgICAgUm90YXRpb25MYW1iZGFBUk46IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdMYW1iZGFEMjQ3NTQ1QicsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSkpO1xuICAgIH07XG5cbiAgICBjaGVja1JvdGF0aW9uTm90U2V0KER1cmF0aW9uLmRheXMoMCkpO1xuICAgIGNoZWNrUm90YXRpb25Ob3RTZXQoRHVyYXRpb24uaG91cnMoMCkpO1xuICAgIGNoZWNrUm90YXRpb25Ob3RTZXQoRHVyYXRpb24ubWludXRlcygwKSk7XG4gICAgY2hlY2tSb3RhdGlvbk5vdFNldChEdXJhdGlvbi5zZWNvbmRzKDApKTtcbiAgICBjaGVja1JvdGF0aW9uTm90U2V0KER1cmF0aW9uLm1pbGxpcygwKSk7XG4gIH0pO1xufSk7XG4iXX0=