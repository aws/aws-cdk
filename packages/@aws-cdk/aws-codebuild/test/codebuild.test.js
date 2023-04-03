"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const codecommit = require("@aws-cdk/aws-codecommit");
const ec2 = require("@aws-cdk/aws-ec2");
const kms = require("@aws-cdk/aws-kms");
const s3 = require("@aws-cdk/aws-s3");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
const codepipeline_source_1 = require("../lib/codepipeline-source");
const no_source_1 = require("../lib/no-source");
/* eslint-disable quote-props */
describe('default properties', () => {
    test('with CodePipeline source', () => {
        const stack = new cdk.Stack();
        new codebuild.PipelineProject(stack, 'MyProject');
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'MyProjectRole9BBE5233': {
                    'Type': 'AWS::IAM::Role',
                    'Properties': {
                        'AssumeRolePolicyDocument': {
                            'Statement': [
                                {
                                    'Action': 'sts:AssumeRole',
                                    'Effect': 'Allow',
                                    'Principal': {
                                        'Service': 'codebuild.amazonaws.com',
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                    },
                },
                'MyProjectRoleDefaultPolicyB19B7C29': {
                    'Type': 'AWS::IAM::Policy',
                    'Properties': {
                        'PolicyDocument': {
                            'Statement': [
                                {
                                    'Action': [
                                        'logs:CreateLogGroup',
                                        'logs:CreateLogStream',
                                        'logs:PutLogEvents',
                                    ],
                                    'Effect': 'Allow',
                                    'Resource': [
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':logs:',
                                                    {
                                                        'Ref': 'AWS::Region',
                                                    },
                                                    ':',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':log-group:/aws/codebuild/',
                                                    {
                                                        'Ref': 'MyProject39F7B0AE',
                                                    },
                                                ],
                                            ],
                                        },
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':logs:',
                                                    {
                                                        'Ref': 'AWS::Region',
                                                    },
                                                    ':',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':log-group:/aws/codebuild/',
                                                    {
                                                        'Ref': 'MyProject39F7B0AE',
                                                    },
                                                    ':*',
                                                ],
                                            ],
                                        },
                                    ],
                                },
                                {
                                    'Action': [
                                        'codebuild:CreateReportGroup',
                                        'codebuild:CreateReport',
                                        'codebuild:UpdateReport',
                                        'codebuild:BatchPutTestCases',
                                        'codebuild:BatchPutCodeCoverages',
                                    ],
                                    'Effect': 'Allow',
                                    'Resource': {
                                        'Fn::Join': ['', [
                                                'arn:',
                                                { 'Ref': 'AWS::Partition' },
                                                ':codebuild:',
                                                { 'Ref': 'AWS::Region' },
                                                ':',
                                                { 'Ref': 'AWS::AccountId' },
                                                ':report-group/',
                                                { 'Ref': 'MyProject39F7B0AE' },
                                                '-*',
                                            ]],
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                        'PolicyName': 'MyProjectRoleDefaultPolicyB19B7C29',
                        'Roles': [
                            {
                                'Ref': 'MyProjectRole9BBE5233',
                            },
                        ],
                    },
                },
                'MyProject39F7B0AE': {
                    'Type': 'AWS::CodeBuild::Project',
                    'Properties': {
                        'Source': {
                            'Type': 'CODEPIPELINE',
                        },
                        'Artifacts': {
                            'Type': 'CODEPIPELINE',
                        },
                        'ServiceRole': {
                            'Fn::GetAtt': [
                                'MyProjectRole9BBE5233',
                                'Arn',
                            ],
                        },
                        'Environment': {
                            'Type': 'LINUX_CONTAINER',
                            'PrivilegedMode': false,
                            'Image': 'aws/codebuild/standard:1.0',
                            'ImagePullCredentialsType': 'CODEBUILD',
                            'ComputeType': 'BUILD_GENERAL1_SMALL',
                        },
                        'EncryptionKey': 'alias/aws/s3',
                        'Cache': {
                            'Type': 'NO_CACHE',
                        },
                    },
                },
            },
        });
    });
    test('with CodeCommit source', () => {
        const stack = new cdk.Stack();
        const repo = new codecommit.Repository(stack, 'MyRepo', {
            repositoryName: 'hello-cdk',
        });
        const source = codebuild.Source.codeCommit({ repository: repo, cloneDepth: 2 });
        new codebuild.Project(stack, 'MyProject', {
            source,
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'MyRepoF4F48043': {
                    'Type': 'AWS::CodeCommit::Repository',
                    'Properties': {
                        'RepositoryName': 'hello-cdk',
                    },
                },
                'MyProjectRole9BBE5233': {
                    'Type': 'AWS::IAM::Role',
                    'Properties': {
                        'AssumeRolePolicyDocument': {
                            'Statement': [
                                {
                                    'Action': 'sts:AssumeRole',
                                    'Effect': 'Allow',
                                    'Principal': {
                                        'Service': 'codebuild.amazonaws.com',
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                    },
                },
                'MyProjectRoleDefaultPolicyB19B7C29': {
                    'Type': 'AWS::IAM::Policy',
                    'Properties': {
                        'PolicyDocument': {
                            'Statement': [
                                {
                                    'Action': 'codecommit:GitPull',
                                    'Effect': 'Allow',
                                    'Resource': {
                                        'Fn::GetAtt': [
                                            'MyRepoF4F48043',
                                            'Arn',
                                        ],
                                    },
                                },
                                {
                                    'Action': [
                                        'logs:CreateLogGroup',
                                        'logs:CreateLogStream',
                                        'logs:PutLogEvents',
                                    ],
                                    'Effect': 'Allow',
                                    'Resource': [
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':logs:',
                                                    {
                                                        'Ref': 'AWS::Region',
                                                    },
                                                    ':',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':log-group:/aws/codebuild/',
                                                    {
                                                        'Ref': 'MyProject39F7B0AE',
                                                    },
                                                ],
                                            ],
                                        },
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':logs:',
                                                    {
                                                        'Ref': 'AWS::Region',
                                                    },
                                                    ':',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':log-group:/aws/codebuild/',
                                                    {
                                                        'Ref': 'MyProject39F7B0AE',
                                                    },
                                                    ':*',
                                                ],
                                            ],
                                        },
                                    ],
                                },
                                {
                                    'Action': [
                                        'codebuild:CreateReportGroup',
                                        'codebuild:CreateReport',
                                        'codebuild:UpdateReport',
                                        'codebuild:BatchPutTestCases',
                                        'codebuild:BatchPutCodeCoverages',
                                    ],
                                    'Effect': 'Allow',
                                    'Resource': {
                                        'Fn::Join': ['', [
                                                'arn:',
                                                { 'Ref': 'AWS::Partition' },
                                                ':codebuild:',
                                                { 'Ref': 'AWS::Region' },
                                                ':',
                                                { 'Ref': 'AWS::AccountId' },
                                                ':report-group/',
                                                { 'Ref': 'MyProject39F7B0AE' },
                                                '-*',
                                            ]],
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                        'PolicyName': 'MyProjectRoleDefaultPolicyB19B7C29',
                        'Roles': [
                            {
                                'Ref': 'MyProjectRole9BBE5233',
                            },
                        ],
                    },
                },
                'MyProject39F7B0AE': {
                    'Type': 'AWS::CodeBuild::Project',
                    'Properties': {
                        'Artifacts': {
                            'Type': 'NO_ARTIFACTS',
                        },
                        'Environment': {
                            'ComputeType': 'BUILD_GENERAL1_SMALL',
                            'Image': 'aws/codebuild/standard:1.0',
                            'ImagePullCredentialsType': 'CODEBUILD',
                            'PrivilegedMode': false,
                            'Type': 'LINUX_CONTAINER',
                        },
                        'ServiceRole': {
                            'Fn::GetAtt': [
                                'MyProjectRole9BBE5233',
                                'Arn',
                            ],
                        },
                        'Source': {
                            'Location': {
                                'Fn::GetAtt': [
                                    'MyRepoF4F48043',
                                    'CloneUrlHttp',
                                ],
                            },
                            'GitCloneDepth': 2,
                            'Type': 'CODECOMMIT',
                        },
                        'EncryptionKey': 'alias/aws/s3',
                        'Cache': {
                            'Type': 'NO_CACHE',
                        },
                    },
                },
            },
        });
    });
    test('with S3Bucket source', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        new codebuild.Project(stack, 'MyProject', {
            source: codebuild.Source.s3({
                bucket,
                path: 'path/to/source.zip',
            }),
            environment: {
                buildImage: codebuild.WindowsBuildImage.WINDOWS_BASE_2_0,
            },
        });
        assertions_1.Template.fromStack(stack).templateMatches({
            'Resources': {
                'MyBucketF68F3FF0': {
                    'Type': 'AWS::S3::Bucket',
                    'DeletionPolicy': 'Retain',
                    'UpdateReplacePolicy': 'Retain',
                },
                'MyProjectRole9BBE5233': {
                    'Type': 'AWS::IAM::Role',
                    'Properties': {
                        'AssumeRolePolicyDocument': {
                            'Statement': [
                                {
                                    'Action': 'sts:AssumeRole',
                                    'Effect': 'Allow',
                                    'Principal': {
                                        'Service': 'codebuild.amazonaws.com',
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                    },
                },
                'MyProjectRoleDefaultPolicyB19B7C29': {
                    'Type': 'AWS::IAM::Policy',
                    'Properties': {
                        'PolicyDocument': {
                            'Statement': [
                                {
                                    'Action': [
                                        's3:GetObject*',
                                        's3:GetBucket*',
                                        's3:List*',
                                    ],
                                    'Effect': 'Allow',
                                    'Resource': [
                                        {
                                            'Fn::GetAtt': [
                                                'MyBucketF68F3FF0',
                                                'Arn',
                                            ],
                                        },
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    {
                                                        'Fn::GetAtt': [
                                                            'MyBucketF68F3FF0',
                                                            'Arn',
                                                        ],
                                                    },
                                                    '/path/to/source.zip',
                                                ],
                                            ],
                                        },
                                    ],
                                },
                                {
                                    'Action': [
                                        'logs:CreateLogGroup',
                                        'logs:CreateLogStream',
                                        'logs:PutLogEvents',
                                    ],
                                    'Effect': 'Allow',
                                    'Resource': [
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':logs:',
                                                    {
                                                        'Ref': 'AWS::Region',
                                                    },
                                                    ':',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':log-group:/aws/codebuild/',
                                                    {
                                                        'Ref': 'MyProject39F7B0AE',
                                                    },
                                                ],
                                            ],
                                        },
                                        {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        'Ref': 'AWS::Partition',
                                                    },
                                                    ':logs:',
                                                    {
                                                        'Ref': 'AWS::Region',
                                                    },
                                                    ':',
                                                    {
                                                        'Ref': 'AWS::AccountId',
                                                    },
                                                    ':log-group:/aws/codebuild/',
                                                    {
                                                        'Ref': 'MyProject39F7B0AE',
                                                    },
                                                    ':*',
                                                ],
                                            ],
                                        },
                                    ],
                                },
                                {
                                    'Action': [
                                        'codebuild:CreateReportGroup',
                                        'codebuild:CreateReport',
                                        'codebuild:UpdateReport',
                                        'codebuild:BatchPutTestCases',
                                        'codebuild:BatchPutCodeCoverages',
                                    ],
                                    'Effect': 'Allow',
                                    'Resource': {
                                        'Fn::Join': ['', [
                                                'arn:',
                                                { 'Ref': 'AWS::Partition' },
                                                ':codebuild:',
                                                { 'Ref': 'AWS::Region' },
                                                ':',
                                                { 'Ref': 'AWS::AccountId' },
                                                ':report-group/',
                                                { 'Ref': 'MyProject39F7B0AE' },
                                                '-*',
                                            ]],
                                    },
                                },
                            ],
                            'Version': '2012-10-17',
                        },
                        'PolicyName': 'MyProjectRoleDefaultPolicyB19B7C29',
                        'Roles': [
                            {
                                'Ref': 'MyProjectRole9BBE5233',
                            },
                        ],
                    },
                },
                'MyProject39F7B0AE': {
                    'Type': 'AWS::CodeBuild::Project',
                    'Properties': {
                        'Artifacts': {
                            'Type': 'NO_ARTIFACTS',
                        },
                        'Environment': {
                            'ComputeType': 'BUILD_GENERAL1_MEDIUM',
                            'Image': 'aws/codebuild/windows-base:2.0',
                            'ImagePullCredentialsType': 'CODEBUILD',
                            'PrivilegedMode': false,
                            'Type': 'WINDOWS_CONTAINER',
                        },
                        'ServiceRole': {
                            'Fn::GetAtt': [
                                'MyProjectRole9BBE5233',
                                'Arn',
                            ],
                        },
                        'Source': {
                            'Location': {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Ref': 'MyBucketF68F3FF0',
                                        },
                                        '/path/to/source.zip',
                                    ],
                                ],
                            },
                            'Type': 'S3',
                        },
                        'EncryptionKey': 'alias/aws/s3',
                        'Cache': {
                            'Type': 'NO_CACHE',
                        },
                    },
                },
            },
        });
    });
    test('with GitHub source', () => {
        const stack = new cdk.Stack();
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.gitHub({
                owner: 'testowner',
                repo: 'testrepo',
                cloneDepth: 3,
                fetchSubmodules: true,
                webhook: true,
                reportBuildStatus: false,
                webhookFilters: [
                    codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andTagIsNot('stable'),
                    codebuild.FilterGroup.inEventOf(codebuild.EventAction.PULL_REQUEST_REOPENED).andBaseBranchIs('main'),
                ],
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Source: {
                Type: 'GITHUB',
                Location: 'https://github.com/testowner/testrepo.git',
                ReportBuildStatus: false,
                GitCloneDepth: 3,
                GitSubmodulesConfig: {
                    FetchSubmodules: true,
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Triggers: {
                Webhook: true,
                FilterGroups: [
                    [
                        { Type: 'EVENT', Pattern: 'PUSH' },
                        { Type: 'HEAD_REF', Pattern: 'refs/tags/stable', ExcludeMatchedPattern: true },
                    ],
                    [
                        { Type: 'EVENT', Pattern: 'PULL_REQUEST_REOPENED' },
                        { Type: 'BASE_REF', Pattern: 'refs/heads/main' },
                    ],
                ],
            },
        });
    });
    test('with GitHubEnterprise source', () => {
        const stack = new cdk.Stack();
        const pushFilterGroup = codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH);
        new codebuild.Project(stack, 'MyProject', {
            source: codebuild.Source.gitHubEnterprise({
                httpsCloneUrl: 'https://github.testcompany.com/testowner/testrepo',
                ignoreSslErrors: true,
                cloneDepth: 4,
                webhook: true,
                reportBuildStatus: false,
                webhookFilters: [
                    pushFilterGroup.andBranchIs('main'),
                    pushFilterGroup.andBranchIs('develop'),
                    pushFilterGroup.andFilePathIs('ReadMe.md'),
                ],
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Source: {
                Type: 'GITHUB_ENTERPRISE',
                InsecureSsl: true,
                GitCloneDepth: 4,
                ReportBuildStatus: false,
                Location: 'https://github.testcompany.com/testowner/testrepo',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Triggers: {
                Webhook: true,
                FilterGroups: [
                    [
                        { Type: 'EVENT', Pattern: 'PUSH' },
                        { Type: 'HEAD_REF', Pattern: 'refs/heads/main' },
                    ],
                    [
                        { Type: 'EVENT', Pattern: 'PUSH' },
                        { Type: 'HEAD_REF', Pattern: 'refs/heads/develop' },
                    ],
                    [
                        { Type: 'EVENT', Pattern: 'PUSH' },
                        { Type: 'FILE_PATH', Pattern: 'ReadMe.md' },
                    ],
                ],
            },
        });
    });
    test('with Bitbucket source', () => {
        const stack = new cdk.Stack();
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.bitBucket({
                owner: 'testowner',
                repo: 'testrepo',
                cloneDepth: 5,
                reportBuildStatus: false,
                webhookFilters: [
                    codebuild.FilterGroup.inEventOf(codebuild.EventAction.PULL_REQUEST_CREATED, codebuild.EventAction.PULL_REQUEST_UPDATED, codebuild.EventAction.PULL_REQUEST_MERGED).andTagIs('v.*'),
                    // duplicate event actions are fine
                    codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH, codebuild.EventAction.PUSH).andActorAccountIsNot('aws-cdk-dev'),
                ],
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Source: {
                Type: 'BITBUCKET',
                Location: 'https://bitbucket.org/testowner/testrepo.git',
                GitCloneDepth: 5,
                ReportBuildStatus: false,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Triggers: {
                Webhook: true,
                FilterGroups: [
                    [
                        { Type: 'EVENT', Pattern: 'PULL_REQUEST_CREATED, PULL_REQUEST_UPDATED, PULL_REQUEST_MERGED' },
                        { Type: 'HEAD_REF', Pattern: 'refs/tags/v.*' },
                    ],
                    [
                        { Type: 'EVENT', Pattern: 'PUSH' },
                        { Type: 'ACTOR_ACCOUNT_ID', Pattern: 'aws-cdk-dev', ExcludeMatchedPattern: true },
                    ],
                ],
            },
        });
    });
    test('with webhookTriggersBatchBuild option', () => {
        const stack = new cdk.Stack();
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.gitHub({
                owner: 'testowner',
                repo: 'testrepo',
                webhook: true,
                webhookTriggersBatchBuild: true,
            }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Triggers: {
                Webhook: true,
                BuildType: 'BUILD_BATCH',
            },
            BuildBatchConfig: {
                ServiceRole: {
                    'Fn::GetAtt': [
                        'ProjectBatchServiceRoleF97A1CFB',
                        'Arn',
                    ],
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
            AssumeRolePolicyDocument: {
                Statement: [
                    {
                        Action: 'sts:AssumeRole',
                        Effect: 'Allow',
                        Principal: {
                            Service: 'codebuild.amazonaws.com',
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            PolicyDocument: {
                Statement: [
                    {
                        Action: [
                            'codebuild:StartBuild',
                            'codebuild:StopBuild',
                            'codebuild:RetryBuild',
                        ],
                        Effect: 'Allow',
                        Resource: {
                            'Fn::GetAtt': [
                                'ProjectC78D97AD',
                                'Arn',
                            ],
                        },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('fail creating a Project when webhook false and webhookTriggersBatchBuild option', () => {
        [false, undefined].forEach((webhook) => {
            const stack = new cdk.Stack();
            expect(() => {
                new codebuild.Project(stack, 'Project', {
                    source: codebuild.Source.gitHub({
                        owner: 'testowner',
                        repo: 'testrepo',
                        webhook,
                        webhookTriggersBatchBuild: true,
                    }),
                });
            }).toThrow(/`webhookTriggersBatchBuild` cannot be used when `webhook` is `false`/);
        });
    });
    test('fail creating a Project when no build spec is given', () => {
        const stack = new cdk.Stack();
        expect(() => {
            new codebuild.Project(stack, 'MyProject', {});
        }).toThrow(/buildSpec/);
    });
    test('with VPC configuration', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        const vpc = new ec2.Vpc(stack, 'MyVPC');
        const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
            securityGroupName: 'Bob',
            vpc,
            allowAllOutbound: true,
            description: 'Example',
        });
        const project = new codebuild.Project(stack, 'MyProject', {
            source: codebuild.Source.s3({
                bucket,
                path: 'path/to/source.zip',
            }),
            vpc,
            securityGroups: [securityGroup],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            'VpcConfig': {
                'SecurityGroupIds': [
                    {
                        'Fn::GetAtt': [
                            'SecurityGroup1F554B36F',
                            'GroupId',
                        ],
                    },
                ],
                'Subnets': [
                    {
                        'Ref': 'MyVPCPrivateSubnet1Subnet641543F4',
                    },
                    {
                        'Ref': 'MyVPCPrivateSubnet2SubnetA420D3F0',
                    },
                ],
                'VpcId': {
                    'Ref': 'MyVPCAFB07A31',
                },
            },
        });
        expect(project.connections).toBeDefined();
    });
    test('without VPC configuration but security group identified', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        const vpc = new ec2.Vpc(stack, 'MyVPC');
        const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
            securityGroupName: 'Bob',
            vpc,
            allowAllOutbound: true,
            description: 'Example',
        });
        expect(() => new codebuild.Project(stack, 'MyProject', {
            source: codebuild.Source.s3({
                bucket,
                path: 'path/to/source.zip',
            }),
            securityGroups: [securityGroup],
        })).toThrow(/Cannot configure 'securityGroup' or 'allowAllOutbound' without configuring a VPC/);
    });
    test('with VPC configuration but allowAllOutbound identified', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        const vpc = new ec2.Vpc(stack, 'MyVPC');
        const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup1', {
            securityGroupName: 'Bob',
            vpc,
            allowAllOutbound: true,
            description: 'Example',
        });
        expect(() => new codebuild.Project(stack, 'MyProject', {
            source: codebuild.Source.s3({
                bucket,
                path: 'path/to/source.zip',
            }),
            vpc,
            allowAllOutbound: true,
            securityGroups: [securityGroup],
        })).toThrow(/Configure 'allowAllOutbound' directly on the supplied SecurityGroup/);
    });
    test('without passing a VPC cannot access the connections property', () => {
        const stack = new cdk.Stack();
        const project = new codebuild.PipelineProject(stack, 'MyProject');
        expect(() => project.connections).toThrow(/Only VPC-associated Projects have security groups to manage. Supply the "vpc" parameter when creating the Project/);
    });
    test('no KMS Key defaults to default S3 managed key', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.PipelineProject(stack, 'MyProject');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            EncryptionKey: 'alias/aws/s3',
        });
    });
    test('with a KMS Key adds decrypt permissions to the CodeBuild Role', () => {
        const stack = new cdk.Stack();
        const key = new kms.Key(stack, 'MyKey');
        new codebuild.PipelineProject(stack, 'MyProject', {
            encryptionKey: key,
            grantReportGroupPermissions: false,
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {},
                    {
                        'Action': [
                            'kms:Decrypt',
                            'kms:Encrypt',
                            'kms:ReEncrypt*',
                            'kms:GenerateDataKey*',
                        ],
                        'Effect': 'Allow',
                        'Resource': {
                            'Fn::GetAtt': [
                                'MyKey6AB29FA6',
                                'Arn',
                            ],
                        },
                    },
                ],
            },
            'Roles': [
                {
                    'Ref': 'MyProjectRole9BBE5233',
                },
            ],
        });
    });
});
test('using timeout and path in S3 artifacts sets it correctly', () => {
    const stack = new cdk.Stack();
    const bucket = new s3.Bucket(stack, 'Bucket');
    new codebuild.Project(stack, 'Project', {
        buildSpec: codebuild.BuildSpec.fromObject({
            version: '0.2',
        }),
        artifacts: codebuild.Artifacts.s3({
            path: 'some/path',
            name: 'some_name',
            bucket,
        }),
        timeout: cdk.Duration.minutes(123),
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        'Artifacts': {
            'Path': 'some/path',
            'Name': 'some_name',
            'Type': 'S3',
        },
        'TimeoutInMinutes': 123,
    });
});
describe('secondary sources', () => {
    test('require providing an identifier when creating a Project', () => {
        const stack = new cdk.Stack();
        expect(() => {
            new codebuild.Project(stack, 'MyProject', {
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: '0.2',
                }),
                secondarySources: [
                    codebuild.Source.s3({
                        bucket: new s3.Bucket(stack, 'MyBucket'),
                        path: 'path',
                    }),
                ],
            });
        }).toThrow(/identifier/);
    });
    test('are not allowed for a Project with CodePipeline as Source', () => {
        const stack = new cdk.Stack();
        const project = new codebuild.PipelineProject(stack, 'MyProject');
        project.addSecondarySource(codebuild.Source.s3({
            bucket: new s3.Bucket(stack, 'MyBucket'),
            path: 'some/path',
            identifier: 'id',
        }));
        expect(() => assertions_1.Template.fromStack(stack)).toThrow(/secondary sources/);
    });
    test('added with an identifer after the Project has been created are rendered in the template', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        const project = new codebuild.Project(stack, 'MyProject', {
            source: codebuild.Source.s3({
                bucket,
                path: 'some/path',
            }),
        });
        project.addSecondarySource(codebuild.Source.s3({
            bucket,
            path: 'another/path',
            identifier: 'source1',
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            'SecondarySources': [
                {
                    'SourceIdentifier': 'source1',
                    'Type': 'S3',
                },
            ],
        });
    });
});
describe('sources with customised build status configuration', () => {
    test('GitHub', () => {
        const context = 'My custom CodeBuild worker!';
        const stack = new cdk.Stack();
        const source = codebuild.Source.gitHub({
            owner: 'awslabs',
            repo: 'aws-cdk',
            buildStatusContext: context,
        });
        new codebuild.Project(stack, 'MyProject', { source });
        assertions_1.Template.fromStack(stack).findParameters('AWS::CodeBuild::Project', {
            Source: {
                buildStatusConfig: {
                    context: context,
                },
            },
        });
    });
    test('GitHub Enterprise', () => {
        const context = 'My custom CodeBuild worker!';
        const stack = new cdk.Stack();
        const source = codebuild.Source.gitHubEnterprise({
            httpsCloneUrl: 'url',
            buildStatusContext: context,
        });
        new codebuild.Project(stack, 'MyProject', { source });
        assertions_1.Template.fromStack(stack).findParameters('AWS::CodeBuild::Project', {
            Source: {
                buildStatusConfig: {
                    context: context,
                },
            },
        });
    });
    test('BitBucket', () => {
        const context = 'My custom CodeBuild worker!';
        const stack = new cdk.Stack();
        const source = codebuild.Source.bitBucket({ owner: 'awslabs', repo: 'aws-cdk' });
        new codebuild.Project(stack, 'MyProject', { source });
        assertions_1.Template.fromStack(stack).findParameters('AWS::CodeBuild::Project', {
            Source: {
                buildStatusConfig: {
                    context: context,
                },
            },
        });
    });
});
describe('sources with customised build status configuration', () => {
    test('GitHub with targetUrl', () => {
        const targetUrl = 'https://example.com';
        const stack = new cdk.Stack();
        const source = codebuild.Source.gitHub({
            owner: 'awslabs',
            repo: 'aws-cdk',
            buildStatusUrl: targetUrl,
        });
        new codebuild.Project(stack, 'MyProject', { source });
        assertions_1.Template.fromStack(stack).findParameters('AWS::CodeBuild::Project', {
            Source: {
                buildStatusConfig: {
                    targetUrl: targetUrl,
                },
            },
        });
    });
});
describe('secondary source versions', () => {
    test('allow secondary source versions', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        const project = new codebuild.Project(stack, 'MyProject', {
            source: codebuild.Source.s3({
                bucket,
                path: 'some/path',
            }),
        });
        project.addSecondarySource(codebuild.Source.s3({
            bucket,
            path: 'another/path',
            identifier: 'source1',
            version: 'someversion',
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            'SecondarySources': [
                {
                    'SourceIdentifier': 'source1',
                    'Type': 'S3',
                },
            ],
            'SecondarySourceVersions': [
                {
                    'SourceIdentifier': 'source1',
                    'SourceVersion': 'someversion',
                },
            ],
        });
    });
    test('allow not to specify secondary source versions', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        const project = new codebuild.Project(stack, 'MyProject', {
            source: codebuild.Source.s3({
                bucket,
                path: 'some/path',
            }),
        });
        project.addSecondarySource(codebuild.Source.s3({
            bucket,
            path: 'another/path',
            identifier: 'source1',
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            'SecondarySources': [
                {
                    'SourceIdentifier': 'source1',
                    'Type': 'S3',
                },
            ],
        });
    });
});
describe('fileSystemLocations', () => {
    test('create fileSystemLocation and validate attributes', () => {
        const stack = new cdk.Stack();
        new codebuild.Project(stack, 'MyProject', {
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
            }),
            fileSystemLocations: [codebuild.FileSystemLocation.efs({
                    identifier: 'myidentifier2',
                    location: 'myclodation.mydnsroot.com:/loc',
                    mountPoint: '/media',
                    mountOptions: 'opts',
                })],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            'FileSystemLocations': [
                {
                    'Identifier': 'myidentifier2',
                    'MountPoint': '/media',
                    'MountOptions': 'opts',
                    'Location': 'myclodation.mydnsroot.com:/loc',
                    'Type': 'EFS',
                },
            ],
        });
    });
    test('Multiple fileSystemLocation created', () => {
        const stack = new cdk.Stack();
        const project = new codebuild.Project(stack, 'MyProject', {
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
            }),
        });
        project.addFileSystemLocation(codebuild.FileSystemLocation.efs({
            identifier: 'myidentifier3',
            location: 'myclodation.mydnsroot.com:/loc',
            mountPoint: '/media',
            mountOptions: 'opts',
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            'FileSystemLocations': [
                {
                    'Identifier': 'myidentifier3',
                    'MountPoint': '/media',
                    'MountOptions': 'opts',
                    'Location': 'myclodation.mydnsroot.com:/loc',
                    'Type': 'EFS',
                },
            ],
        });
    });
});
describe('secondary artifacts', () => {
    test('require providing an identifier when creating a Project', () => {
        const stack = new cdk.Stack();
        expect(() => {
            new codebuild.Project(stack, 'MyProject', {
                buildSpec: codebuild.BuildSpec.fromObject({
                    version: '0.2',
                }),
                secondaryArtifacts: [
                    codebuild.Artifacts.s3({
                        bucket: new s3.Bucket(stack, 'MyBucket'),
                        path: 'some/path',
                        name: 'name',
                    }),
                ],
            });
        }).toThrow(/identifier/);
    });
    test('are not allowed for a Project with CodePipeline as Source', () => {
        const stack = new cdk.Stack();
        const project = new codebuild.PipelineProject(stack, 'MyProject');
        project.addSecondaryArtifact(codebuild.Artifacts.s3({
            bucket: new s3.Bucket(stack, 'MyBucket'),
            path: 'some/path',
            name: 'name',
            identifier: 'id',
        }));
        expect(() => assertions_1.Template.fromStack(stack)).toThrow(/secondary artifacts/);
    });
    test('added with an identifier after the Project has been created are rendered in the template', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        const project = new codebuild.Project(stack, 'MyProject', {
            source: codebuild.Source.s3({
                bucket,
                path: 'some/path',
            }),
        });
        project.addSecondaryArtifact(codebuild.Artifacts.s3({
            bucket,
            path: 'another/path',
            name: 'name',
            identifier: 'artifact1',
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            'SecondaryArtifacts': [
                {
                    'ArtifactIdentifier': 'artifact1',
                    'Type': 'S3',
                },
            ],
        });
    });
    test('disabledEncryption is set', () => {
        const stack = new cdk.Stack();
        const bucket = new s3.Bucket(stack, 'MyBucket');
        const project = new codebuild.Project(stack, 'MyProject', {
            source: codebuild.Source.s3({
                bucket,
                path: 'some/path',
            }),
        });
        project.addSecondaryArtifact(codebuild.Artifacts.s3({
            bucket,
            path: 'another/path',
            name: 'name',
            identifier: 'artifact1',
            encryption: false,
        }));
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            'SecondaryArtifacts': [
                {
                    'ArtifactIdentifier': 'artifact1',
                    'EncryptionDisabled': true,
                },
            ],
        });
    });
});
describe('artifacts', () => {
    describe('CodePipeline', () => {
        test('both source and artifacs are set to CodePipeline', () => {
            const stack = new cdk.Stack();
            new codebuild.PipelineProject(stack, 'MyProject');
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Source': {
                    'Type': 'CODEPIPELINE',
                },
                'Artifacts': {
                    'Type': 'CODEPIPELINE',
                },
                'ServiceRole': {
                    'Fn::GetAtt': [
                        'MyProjectRole9BBE5233',
                        'Arn',
                    ],
                },
                'Environment': {
                    'Type': 'LINUX_CONTAINER',
                    'PrivilegedMode': false,
                    'Image': 'aws/codebuild/standard:1.0',
                    'ImagePullCredentialsType': 'CODEBUILD',
                    'ComputeType': 'BUILD_GENERAL1_SMALL',
                },
            });
        });
    });
    describe('S3', () => {
        test('name is not set so use buildspec', () => {
            const stack = new cdk.Stack();
            const bucket = new s3.Bucket(stack, 'MyBucket');
            new codebuild.Project(stack, 'MyProject', {
                source: codebuild.Source.s3({
                    bucket,
                    path: 'some/path',
                }),
                artifacts: codebuild.Artifacts.s3({
                    bucket,
                    path: 'another/path',
                    identifier: 'artifact1',
                }),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Artifacts': {
                    'Name': assertions_1.Match.absent(),
                    'ArtifactIdentifier': 'artifact1',
                    'OverrideArtifactName': true,
                },
            });
        });
        test('name is set so use it', () => {
            const stack = new cdk.Stack();
            const bucket = new s3.Bucket(stack, 'MyBucket');
            new codebuild.Project(stack, 'MyProject', {
                source: codebuild.Source.s3({
                    bucket,
                    path: 'some/path',
                }),
                artifacts: codebuild.Artifacts.s3({
                    bucket,
                    path: 'another/path',
                    name: 'specificname',
                    identifier: 'artifact1',
                }),
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Artifacts': {
                    'ArtifactIdentifier': 'artifact1',
                    'Name': 'specificname',
                    'OverrideArtifactName': assertions_1.Match.absent(),
                },
            });
        });
    });
});
test('events', () => {
    const stack = new cdk.Stack();
    const project = new codebuild.Project(stack, 'MyProject', {
        source: codebuild.Source.s3({
            bucket: new s3.Bucket(stack, 'MyBucket'),
            path: 'path',
        }),
    });
    project.onBuildFailed('OnBuildFailed', { target: { bind: () => ({ arn: 'ARN', id: 'ID' }) } });
    project.onBuildSucceeded('OnBuildSucceeded', { target: { bind: () => ({ arn: 'ARN', id: 'ID' }) } });
    project.onPhaseChange('OnPhaseChange', { target: { bind: () => ({ arn: 'ARN', id: 'ID' }) } });
    project.onStateChange('OnStateChange', { target: { bind: () => ({ arn: 'ARN', id: 'ID' }) } });
    project.onBuildStarted('OnBuildStarted', { target: { bind: () => ({ arn: 'ARN', id: 'ID' }) } });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        'EventPattern': {
            'source': [
                'aws.codebuild',
            ],
            'detail-type': [
                'CodeBuild Build State Change',
            ],
            'detail': {
                'project-name': [
                    {
                        'Ref': 'MyProject39F7B0AE',
                    },
                ],
                'build-status': [
                    'FAILED',
                ],
            },
        },
        'State': 'ENABLED',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        'EventPattern': {
            'source': [
                'aws.codebuild',
            ],
            'detail-type': [
                'CodeBuild Build State Change',
            ],
            'detail': {
                'project-name': [
                    {
                        'Ref': 'MyProject39F7B0AE',
                    },
                ],
                'build-status': [
                    'SUCCEEDED',
                ],
            },
        },
        'State': 'ENABLED',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        'EventPattern': {
            'source': [
                'aws.codebuild',
            ],
            'detail-type': [
                'CodeBuild Build Phase Change',
            ],
            'detail': {
                'project-name': [
                    {
                        'Ref': 'MyProject39F7B0AE',
                    },
                ],
            },
        },
        'State': 'ENABLED',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        'EventPattern': {
            'source': [
                'aws.codebuild',
            ],
            'detail-type': [
                'CodeBuild Build State Change',
            ],
            'detail': {
                'project-name': [
                    {
                        'Ref': 'MyProject39F7B0AE',
                    },
                ],
            },
        },
        'State': 'ENABLED',
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
        'EventPattern': {
            'source': [
                'aws.codebuild',
            ],
            'detail-type': [
                'CodeBuild Build State Change',
            ],
            'detail': {
                'project-name': [
                    {
                        'Ref': 'MyProject39F7B0AE',
                    },
                ],
                'build-status': [
                    'IN_PROGRESS',
                ],
            },
        },
        'State': 'ENABLED',
    });
});
test('environment variables can be overridden at the project level', () => {
    const stack = new cdk.Stack();
    new codebuild.PipelineProject(stack, 'Project', {
        environment: {
            environmentVariables: {
                FOO: { value: '1234' },
                BAR: { value: `111${cdk.Token.asString({ twotwotwo: '222' })}`, type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE },
            },
        },
        environmentVariables: {
            GOO: { value: 'ABC' },
            FOO: { value: 'OVERRIDE!' },
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        'Source': {
            'Type': 'CODEPIPELINE',
        },
        'Artifacts': {
            'Type': 'CODEPIPELINE',
        },
        'ServiceRole': {
            'Fn::GetAtt': [
                'ProjectRole4CCB274E',
                'Arn',
            ],
        },
        'Environment': {
            'Type': 'LINUX_CONTAINER',
            'EnvironmentVariables': [
                {
                    'Type': 'PLAINTEXT',
                    'Value': 'OVERRIDE!',
                    'Name': 'FOO',
                },
                {
                    'Type': 'PARAMETER_STORE',
                    'Value': {
                        'Fn::Join': [
                            '',
                            [
                                '111',
                                { twotwotwo: '222' },
                            ],
                        ],
                    },
                    'Name': 'BAR',
                },
                {
                    'Type': 'PLAINTEXT',
                    'Value': 'ABC',
                    'Name': 'GOO',
                },
            ],
            'PrivilegedMode': false,
            'Image': 'aws/codebuild/standard:1.0',
            'ImagePullCredentialsType': 'CODEBUILD',
            'ComputeType': 'BUILD_GENERAL1_SMALL',
        },
    });
});
test('.metricXxx() methods can be used to obtain Metrics for CodeBuild projects', () => {
    const stack = new cdk.Stack();
    const project = new codebuild.Project(stack, 'MyBuildProject', {
        source: codebuild.Source.s3({
            bucket: new s3.Bucket(stack, 'MyBucket'),
            path: 'path',
        }),
    });
    const metricBuilds = project.metricBuilds();
    expect(metricBuilds.dimensions.ProjectName).toEqual(project.projectName);
    expect(metricBuilds.namespace).toEqual('AWS/CodeBuild');
    expect(metricBuilds.statistic).toEqual('Sum');
    expect(metricBuilds.metricName).toEqual('Builds');
    const metricDuration = project.metricDuration({ label: 'hello' });
    expect(metricDuration.metricName).toEqual('Duration');
    expect(metricDuration.label).toEqual('hello');
    expect(project.metricFailedBuilds().metricName).toEqual('FailedBuilds');
    expect(project.metricSucceededBuilds().metricName).toEqual('SucceededBuilds');
});
test('using ComputeType.Small with a Windows image fails validation', () => {
    const stack = new cdk.Stack();
    const invalidEnvironment = {
        buildImage: codebuild.WindowsBuildImage.WINDOWS_BASE_2_0,
        computeType: codebuild.ComputeType.SMALL,
    };
    expect(() => {
        new codebuild.Project(stack, 'MyProject', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'MyBucket'),
                path: 'path',
            }),
            environment: invalidEnvironment,
        });
    }).toThrow(/Windows images do not support the Small ComputeType/);
});
test('fromCodebuildImage', () => {
    const stack = new cdk.Stack();
    new codebuild.PipelineProject(stack, 'Project', {
        environment: {
            buildImage: codebuild.LinuxBuildImage.fromCodeBuildImageId('aws/codebuild/standard:4.0'),
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        'Environment': {
            'Image': 'aws/codebuild/standard:4.0',
        },
    });
});
describe('Windows2019 image', () => {
    describe('WIN_SERVER_CORE_2016_BASE', () => {
        test('has type WINDOWS_SERVER_2019_CONTAINER and default ComputeType MEDIUM', () => {
            const stack = new cdk.Stack();
            new codebuild.PipelineProject(stack, 'Project', {
                environment: {
                    buildImage: codebuild.WindowsBuildImage.WIN_SERVER_CORE_2019_BASE,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'Type': 'WINDOWS_SERVER_2019_CONTAINER',
                    'ComputeType': 'BUILD_GENERAL1_MEDIUM',
                },
            });
        });
    });
});
describe('ARM image', () => {
    describe('AMAZON_LINUX_2_ARM', () => {
        test('has type ARM_CONTAINER and default ComputeType LARGE', () => {
            const stack = new cdk.Stack();
            new codebuild.PipelineProject(stack, 'Project', {
                environment: {
                    buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_ARM,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'Type': 'ARM_CONTAINER',
                    'ComputeType': 'BUILD_GENERAL1_LARGE',
                },
            });
        });
        test('can be used with ComputeType SMALL', () => {
            const stack = new cdk.Stack();
            new codebuild.PipelineProject(stack, 'Project', {
                environment: {
                    computeType: codebuild.ComputeType.SMALL,
                    buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_ARM,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'Type': 'ARM_CONTAINER',
                    'ComputeType': 'BUILD_GENERAL1_SMALL',
                },
            });
        });
        test('cannot be used in conjunction with ComputeType MEDIUM', () => {
            const stack = new cdk.Stack();
            expect(() => {
                new codebuild.PipelineProject(stack, 'Project', {
                    environment: {
                        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_ARM,
                        computeType: codebuild.ComputeType.MEDIUM,
                    },
                });
            }).toThrow(/ARM images only support ComputeTypes 'BUILD_GENERAL1_SMALL' and 'BUILD_GENERAL1_LARGE' - 'BUILD_GENERAL1_MEDIUM' was given/);
        });
        test('can be used with ComputeType LARGE', () => {
            const stack = new cdk.Stack();
            new codebuild.PipelineProject(stack, 'Project', {
                environment: {
                    computeType: codebuild.ComputeType.LARGE,
                    buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_ARM,
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'Type': 'ARM_CONTAINER',
                    'ComputeType': 'BUILD_GENERAL1_LARGE',
                },
            });
        });
        test('cannot be used in conjunction with ComputeType X2_LARGE', () => {
            const stack = new cdk.Stack();
            expect(() => {
                new codebuild.PipelineProject(stack, 'Project', {
                    environment: {
                        buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_ARM,
                        computeType: codebuild.ComputeType.X2_LARGE,
                    },
                });
            }).toThrow(/ARM images only support ComputeTypes 'BUILD_GENERAL1_SMALL' and 'BUILD_GENERAL1_LARGE' - 'BUILD_GENERAL1_2XLARGE' was given/);
        });
    });
});
test('badge support test', () => {
    const stack = new cdk.Stack();
    const repo = new codecommit.Repository(stack, 'MyRepo', {
        repositoryName: 'hello-cdk',
    });
    const bucket = new s3.Bucket(stack, 'MyBucket');
    const cases = [
        { source: new no_source_1.NoSource(), allowsBadge: false },
        { source: new codepipeline_source_1.CodePipelineSource(), allowsBadge: false },
        { source: codebuild.Source.codeCommit({ repository: repo }), allowsBadge: true },
        { source: codebuild.Source.s3({ bucket, path: 'path/to/source.zip' }), allowsBadge: false },
        { source: codebuild.Source.gitHub({ owner: 'awslabs', repo: 'aws-cdk' }), allowsBadge: true },
        { source: codebuild.Source.gitHubEnterprise({ httpsCloneUrl: 'url' }), allowsBadge: true },
        { source: codebuild.Source.bitBucket({ owner: 'awslabs', repo: 'aws-cdk' }), allowsBadge: true },
    ];
    cases.forEach(testCase => {
        const source = testCase.source;
        const validationBlock = () => { new codebuild.Project(stack, `MyProject-${source.type}`, { source, badge: true }); };
        if (testCase.allowsBadge) {
            expect(validationBlock).not.toThrow();
        }
        else {
            expect(validationBlock).toThrow(/Badge is not supported for source type /);
        }
    });
});
describe('webhook Filters', () => {
    test('a Group cannot be created with an empty set of event actions', () => {
        expect(() => {
            codebuild.FilterGroup.inEventOf();
        }).toThrow(/A filter group must contain at least one event action/);
    });
    test('cannot have base ref conditions if the Group contains the PUSH action', () => {
        const filterGroup = codebuild.FilterGroup.inEventOf(codebuild.EventAction.PULL_REQUEST_CREATED, codebuild.EventAction.PUSH);
        expect(() => {
            filterGroup.andBaseRefIs('.*');
        }).toThrow(/A base reference condition cannot be added if a Group contains a PUSH event action/);
    });
    test('cannot be used when webhook is false', () => {
        const stack = new cdk.Stack();
        expect(() => {
            new codebuild.Project(stack, 'Project', {
                source: codebuild.Source.bitBucket({
                    owner: 'owner',
                    repo: 'repo',
                    webhook: false,
                    webhookFilters: [
                        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH),
                    ],
                }),
            });
        }).toThrow(/`webhookFilters` cannot be used when `webhook` is `false`/);
    });
    test('can have FILE_PATH filters if the Group contains PUSH and PR_CREATED events', () => {
        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PULL_REQUEST_CREATED, codebuild.EventAction.PUSH)
            .andFilePathIsNot('.*\\.java');
    });
    test('BitBucket sources do not support the PULL_REQUEST_REOPENED event action', () => {
        const stack = new cdk.Stack();
        expect(() => {
            new codebuild.Project(stack, 'Project', {
                source: codebuild.Source.bitBucket({
                    owner: 'owner',
                    repo: 'repo',
                    webhookFilters: [
                        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PULL_REQUEST_REOPENED),
                    ],
                }),
            });
        }).toThrow(/BitBucket sources do not support the PULL_REQUEST_REOPENED webhook event action/);
    });
    test('BitBucket sources support file path conditions', () => {
        const stack = new cdk.Stack();
        const filterGroup = codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andFilePathIs('.*');
        expect(() => {
            new codebuild.Project(stack, 'Project', {
                source: codebuild.Source.bitBucket({
                    owner: 'owner',
                    repo: 'repo',
                    webhookFilters: [filterGroup],
                }),
            });
        }).not.toThrow();
    });
    test('GitHub Enterprise Server sources do not support FILE_PATH filters on PR events', () => {
        const stack = new cdk.Stack();
        const pullFilterGroup = codebuild.FilterGroup.inEventOf(codebuild.EventAction.PULL_REQUEST_CREATED, codebuild.EventAction.PULL_REQUEST_MERGED, codebuild.EventAction.PULL_REQUEST_REOPENED, codebuild.EventAction.PULL_REQUEST_UPDATED);
        expect(() => {
            new codebuild.Project(stack, 'MyFilePathProject', {
                source: codebuild.Source.gitHubEnterprise({
                    httpsCloneUrl: 'https://github.testcompany.com/testowner/testrepo',
                    webhookFilters: [
                        pullFilterGroup.andFilePathIs('ReadMe.md'),
                    ],
                }),
            });
        }).toThrow(/FILE_PATH filters cannot be used with GitHub Enterprise Server pull request events/);
    });
    describe('COMMIT_MESSAGE Filter', () => {
        test('GitHub Enterprise Server sources do not support COMMIT_MESSAGE filters on PR events', () => {
            const stack = new cdk.Stack();
            const pullFilterGroup = codebuild.FilterGroup.inEventOf(codebuild.EventAction.PULL_REQUEST_CREATED, codebuild.EventAction.PULL_REQUEST_MERGED, codebuild.EventAction.PULL_REQUEST_REOPENED, codebuild.EventAction.PULL_REQUEST_UPDATED);
            expect(() => {
                new codebuild.Project(stack, 'MyProject', {
                    source: codebuild.Source.gitHubEnterprise({
                        httpsCloneUrl: 'https://github.testcompany.com/testowner/testrepo',
                        webhookFilters: [
                            pullFilterGroup.andCommitMessageIs('the commit message'),
                        ],
                    }),
                });
            }).toThrow(/COMMIT_MESSAGE filters cannot be used with GitHub Enterprise Server pull request events/);
        });
        test('GitHub Enterprise Server sources support COMMIT_MESSAGE filters on PUSH events', () => {
            const stack = new cdk.Stack();
            const pushFilterGroup = codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH);
            expect(() => {
                new codebuild.Project(stack, 'MyProject', {
                    source: codebuild.Source.gitHubEnterprise({
                        httpsCloneUrl: 'https://github.testcompany.com/testowner/testrepo',
                        webhookFilters: [
                            pushFilterGroup.andCommitMessageIs('the commit message'),
                        ],
                    }),
                });
            }).not.toThrow();
        });
        test('BitBucket and GitHub sources support a COMMIT_MESSAGE filter', () => {
            const stack = new cdk.Stack();
            const filterGroup = codebuild
                .FilterGroup
                .inEventOf(codebuild.EventAction.PUSH, codebuild.EventAction.PULL_REQUEST_CREATED)
                .andCommitMessageIs('the commit message');
            expect(() => {
                new codebuild.Project(stack, 'BitBucket Project', {
                    source: codebuild.Source.bitBucket({
                        owner: 'owner',
                        repo: 'repo',
                        webhookFilters: [filterGroup],
                    }),
                });
                new codebuild.Project(stack, 'GitHub Project', {
                    source: codebuild.Source.gitHub({
                        owner: 'owner',
                        repo: 'repo',
                        webhookFilters: [filterGroup],
                    }),
                });
            }).not.toThrow();
        });
    });
});
test('enableBatchBuilds()', () => {
    const stack = new cdk.Stack();
    const project = new codebuild.Project(stack, 'Project', {
        source: codebuild.Source.gitHub({
            owner: 'testowner',
            repo: 'testrepo',
        }),
    });
    const returnVal = project.enableBatchBuilds();
    if (!returnVal?.role) {
        throw new Error('Expecting return value with role');
    }
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        BuildBatchConfig: {
            ServiceRole: {
                'Fn::GetAtt': [
                    'ProjectBatchServiceRoleF97A1CFB',
                    'Arn',
                ],
            },
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        AssumeRolePolicyDocument: {
            Statement: [
                {
                    Action: 'sts:AssumeRole',
                    Effect: 'Allow',
                    Principal: {
                        Service: 'codebuild.amazonaws.com',
                    },
                },
            ],
            Version: '2012-10-17',
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: [
                        'codebuild:StartBuild',
                        'codebuild:StopBuild',
                        'codebuild:RetryBuild',
                    ],
                    Effect: 'Allow',
                    Resource: {
                        'Fn::GetAtt': [
                            'ProjectC78D97AD',
                            'Arn',
                        ],
                    },
                },
            ],
            Version: '2012-10-17',
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29kZWJ1aWxkLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb2RlYnVpbGQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCxzREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QyxzQ0FBc0M7QUFDdEMscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUNwQyxvRUFBZ0U7QUFDaEUsZ0RBQTRDO0FBRTVDLGdDQUFnQztBQUVoQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxFQUFFO0lBQ2xDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7UUFDcEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsSUFBSSxTQUFTLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVsRCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDeEMsV0FBVyxFQUFFO2dCQUNYLHVCQUF1QixFQUFFO29CQUN2QixNQUFNLEVBQUUsZ0JBQWdCO29CQUN4QixZQUFZLEVBQUU7d0JBQ1osMEJBQTBCLEVBQUU7NEJBQzFCLFdBQVcsRUFBRTtnQ0FDWDtvQ0FDRSxRQUFRLEVBQUUsZ0JBQWdCO29DQUMxQixRQUFRLEVBQUUsT0FBTztvQ0FDakIsV0FBVyxFQUFFO3dDQUNYLFNBQVMsRUFBRSx5QkFBeUI7cUNBQ3JDO2lDQUNGOzZCQUNGOzRCQUNELFNBQVMsRUFBRSxZQUFZO3lCQUN4QjtxQkFDRjtpQkFDRjtnQkFDRCxvQ0FBb0MsRUFBRTtvQkFDcEMsTUFBTSxFQUFFLGtCQUFrQjtvQkFDMUIsWUFBWSxFQUFFO3dCQUNaLGdCQUFnQixFQUFFOzRCQUNoQixXQUFXLEVBQUU7Z0NBQ1g7b0NBQ0UsUUFBUSxFQUFFO3dDQUNSLHFCQUFxQjt3Q0FDckIsc0JBQXNCO3dDQUN0QixtQkFBbUI7cUNBQ3BC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QUs7eUJBQ047cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELE9BQU8sRUFBRSxZQUFZO1NBQ3RCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNvZGVjb21taXQgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVjb21taXQnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgQ29kZVBpcGVsaW5lU291cmNlIH0gZnJvbSAnLi4vbGliL2NvZGVwaXBlbGluZS1zb3VyY2UnO1xuaW1wb3J0IHsgTm9Tb3VyY2UgfSBmcm9tICcuLi9saWIvbm8tc291cmNlJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ2RlZmF1bHQgcHJvcGVydGllcycsICgpID0+IHtcbiAgdGVzdCgnd2l0aCBDb2RlUGlwZWxpbmUgc291cmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgICdSZXNvdXJjZXMnOiB7XG4gICAgICAgICdNeVByb2plY3RSb2xlOUJCRTUyMzMnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0Fzc3VtZVJvbGVQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWN0aW9uJzogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgJ1ByaW5jaXBhbCc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ1NlcnZpY2UnOiAnY29kZWJ1aWxkLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ015UHJvamVjdFJvbGVEZWZhdWx0UG9saWN5QjE5QjdDMjknOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpJQU06OlBvbGljeScsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nR3JvdXAnLFxuICAgICAgICAgICAgICAgICAgICAnbG9nczpDcmVhdGVMb2dTdHJlYW0nLFxuICAgICAgICAgICAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlJzogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnOmxvZ3M6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzpsb2ctZ3JvdXA6L2F3cy9jb2RlYnVpbGQvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnTXlQcm9qZWN0MzlGN0IwQUUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnOmxvZ3M6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6QWNjb3VudElkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzpsb2ctZ3JvdXA6L2F3cy9jb2RlYnVpbGQvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnTXlQcm9qZWN0MzlGN0IwQUUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnOionLFxuICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgICAgICdjb2RlYnVpbGQ6Q3JlYXRlUmVwb3J0R3JvdXAnLFxuICAgICAgICAgICAgICAgICAgICAnY29kZWJ1aWxkOkNyZWF0ZVJlcG9ydCcsXG4gICAgICAgICAgICAgICAgICAgICdjb2RlYnVpbGQ6VXBkYXRlUmVwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgJ2NvZGVidWlsZDpCYXRjaFB1dFRlc3RDYXNlcycsXG4gICAgICAgICAgICAgICAgICAgICdjb2RlYnVpbGQ6QmF0Y2hQdXRDb2RlQ292ZXJhZ2VzJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOmNvZGVidWlsZDonLFxuICAgICAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOicsXG4gICAgICAgICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6cmVwb3J0LWdyb3VwLycsXG4gICAgICAgICAgICAgICAgICAgICAgeyAnUmVmJzogJ015UHJvamVjdDM5RjdCMEFFJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICctKicsXG4gICAgICAgICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAnVmVyc2lvbic6ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnUG9saWN5TmFtZSc6ICdNeVByb2plY3RSb2xlRGVmYXVsdFBvbGljeUIxOUI3QzI5JyxcbiAgICAgICAgICAgICdSb2xlcyc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdSZWYnOiAnTXlQcm9qZWN0Um9sZTlCQkU1MjMzJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ015UHJvamVjdDM5RjdCMEFFJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0JyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdTb3VyY2UnOiB7XG4gICAgICAgICAgICAgICdUeXBlJzogJ0NPREVQSVBFTElORScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ0FydGlmYWN0cyc6IHtcbiAgICAgICAgICAgICAgJ1R5cGUnOiAnQ09ERVBJUEVMSU5FJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnU2VydmljZVJvbGUnOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdNeVByb2plY3RSb2xlOUJCRTUyMzMnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdFbnZpcm9ubWVudCc6IHtcbiAgICAgICAgICAgICAgJ1R5cGUnOiAnTElOVVhfQ09OVEFJTkVSJyxcbiAgICAgICAgICAgICAgJ1ByaXZpbGVnZWRNb2RlJzogZmFsc2UsXG4gICAgICAgICAgICAgICdJbWFnZSc6ICdhd3MvY29kZWJ1aWxkL3N0YW5kYXJkOjEuMCcsXG4gICAgICAgICAgICAgICdJbWFnZVB1bGxDcmVkZW50aWFsc1R5cGUnOiAnQ09ERUJVSUxEJyxcbiAgICAgICAgICAgICAgJ0NvbXB1dGVUeXBlJzogJ0JVSUxEX0dFTkVSQUwxX1NNQUxMJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnRW5jcnlwdGlvbktleSc6ICdhbGlhcy9hd3MvczMnLFxuICAgICAgICAgICAgJ0NhY2hlJzoge1xuICAgICAgICAgICAgICAnVHlwZSc6ICdOT19DQUNIRScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd3aXRoIENvZGVDb21taXQgc291cmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgcmVwbyA9IG5ldyBjb2RlY29tbWl0LlJlcG9zaXRvcnkoc3RhY2ssICdNeVJlcG8nLCB7XG4gICAgICByZXBvc2l0b3J5TmFtZTogJ2hlbGxvLWNkaycsXG4gICAgfSk7XG5cbiAgICBjb25zdCBzb3VyY2UgPSBjb2RlYnVpbGQuU291cmNlLmNvZGVDb21taXQoeyByZXBvc2l0b3J5OiByZXBvLCBjbG9uZURlcHRoOiAyIH0pO1xuXG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICAgICAgc291cmNlLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015UmVwb0Y0RjQ4MDQzJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6Q29kZUNvbW1pdDo6UmVwb3NpdG9yeScsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnUmVwb3NpdG9yeU5hbWUnOiAnaGVsbG8tY2RrJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnTXlQcm9qZWN0Um9sZTlCQkU1MjMzJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgICAgICdTZXJ2aWNlJzogJ2NvZGVidWlsZC5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdNeVByb2plY3RSb2xlRGVmYXVsdFBvbGljeUIxOUI3QzI5Jzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpQb2xpY3knLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdBY3Rpb24nOiAnY29kZWNvbW1pdDpHaXRQdWxsJyxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnTXlSZXBvRjRGNDgwNDMnLFxuICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ0dyb3VwJyxcbiAgICAgICAgICAgICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgICAgICAgICAgICAgJ2xvZ3M6UHV0TG9nRXZlbnRzJyxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICdSZXNvdXJjZSc6IFtcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6bG9nLWdyb3VwOi9hd3MvY29kZWJ1aWxkLycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ015UHJvamVjdDM5RjdCMEFFJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzpsb2dzOicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ0FXUzo6UmVnaW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6bG9nLWdyb3VwOi9hd3MvY29kZWJ1aWxkLycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnUmVmJzogJ015UHJvamVjdDM5RjdCMEFFJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzoqJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICAgICAnY29kZWJ1aWxkOkNyZWF0ZVJlcG9ydEdyb3VwJyxcbiAgICAgICAgICAgICAgICAgICAgJ2NvZGVidWlsZDpDcmVhdGVSZXBvcnQnLFxuICAgICAgICAgICAgICAgICAgICAnY29kZWJ1aWxkOlVwZGF0ZVJlcG9ydCcsXG4gICAgICAgICAgICAgICAgICAgICdjb2RlYnVpbGQ6QmF0Y2hQdXRUZXN0Q2FzZXMnLFxuICAgICAgICAgICAgICAgICAgICAnY29kZWJ1aWxkOkJhdGNoUHV0Q29kZUNvdmVyYWdlcycsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzpjb2RlYnVpbGQ6JyxcbiAgICAgICAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnOnJlcG9ydC1ncm91cC8nLFxuICAgICAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdNeVByb2plY3QzOUY3QjBBRScgfSxcbiAgICAgICAgICAgICAgICAgICAgICAnLSonLFxuICAgICAgICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1BvbGljeU5hbWUnOiAnTXlQcm9qZWN0Um9sZURlZmF1bHRQb2xpY3lCMTlCN0MyOScsXG4gICAgICAgICAgICAnUm9sZXMnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnUmVmJzogJ015UHJvamVjdFJvbGU5QkJFNTIzMycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdNeVByb2plY3QzOUY3QjBBRSc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsXG4gICAgICAgICAgJ1Byb3BlcnRpZXMnOiB7XG4gICAgICAgICAgICAnQXJ0aWZhY3RzJzoge1xuICAgICAgICAgICAgICAnVHlwZSc6ICdOT19BUlRJRkFDVFMnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdFbnZpcm9ubWVudCc6IHtcbiAgICAgICAgICAgICAgJ0NvbXB1dGVUeXBlJzogJ0JVSUxEX0dFTkVSQUwxX1NNQUxMJyxcbiAgICAgICAgICAgICAgJ0ltYWdlJzogJ2F3cy9jb2RlYnVpbGQvc3RhbmRhcmQ6MS4wJyxcbiAgICAgICAgICAgICAgJ0ltYWdlUHVsbENyZWRlbnRpYWxzVHlwZSc6ICdDT0RFQlVJTEQnLFxuICAgICAgICAgICAgICAnUHJpdmlsZWdlZE1vZGUnOiBmYWxzZSxcbiAgICAgICAgICAgICAgJ1R5cGUnOiAnTElOVVhfQ09OVEFJTkVSJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnU2VydmljZVJvbGUnOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdNeVByb2plY3RSb2xlOUJCRTUyMzMnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdTb3VyY2UnOiB7XG4gICAgICAgICAgICAgICdMb2NhdGlvbic6IHtcbiAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICdNeVJlcG9GNEY0ODA0MycsXG4gICAgICAgICAgICAgICAgICAnQ2xvbmVVcmxIdHRwJyxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnR2l0Q2xvbmVEZXB0aCc6IDIsXG4gICAgICAgICAgICAgICdUeXBlJzogJ0NPREVDT01NSVQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdFbmNyeXB0aW9uS2V5JzogJ2FsaWFzL2F3cy9zMycsXG4gICAgICAgICAgICAnQ2FjaGUnOiB7XG4gICAgICAgICAgICAgICdUeXBlJzogJ05PX0NBQ0hFJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggUzNCdWNrZXQgc291cmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuXG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgICAgYnVja2V0LFxuICAgICAgICBwYXRoOiAncGF0aC90by9zb3VyY2UuemlwJyxcbiAgICAgIH0pLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLldpbmRvd3NCdWlsZEltYWdlLldJTkRPV1NfQkFTRV8yXzAsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS50ZW1wbGF0ZU1hdGNoZXMoe1xuICAgICAgJ1Jlc291cmNlcyc6IHtcbiAgICAgICAgJ015QnVja2V0RjY4RjNGRjAnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpTMzo6QnVja2V0JyxcbiAgICAgICAgICAnRGVsZXRpb25Qb2xpY3knOiAnUmV0YWluJyxcbiAgICAgICAgICAnVXBkYXRlUmVwbGFjZVBvbGljeSc6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgICAnTXlQcm9qZWN0Um9sZTlCQkU1MjMzJzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpSb2xlJyxcbiAgICAgICAgICAnUHJvcGVydGllcyc6IHtcbiAgICAgICAgICAgICdBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICAgICAgICdQcmluY2lwYWwnOiB7XG4gICAgICAgICAgICAgICAgICAgICdTZXJ2aWNlJzogJ2NvZGVidWlsZC5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdNeVByb2plY3RSb2xlRGVmYXVsdFBvbGljeUIxOUI3QzI5Jzoge1xuICAgICAgICAgICdUeXBlJzogJ0FXUzo6SUFNOjpQb2xpY3knLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICdBY3Rpb24nOiBbXG4gICAgICAgICAgICAgICAgICAgICdzMzpHZXRPYmplY3QqJyxcbiAgICAgICAgICAgICAgICAgICAgJ3MzOkdldEJ1Y2tldConLFxuICAgICAgICAgICAgICAgICAgICAnczM6TGlzdConLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlJzogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnTXlCdWNrZXRGNjhGM0ZGMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICcvcGF0aC90by9zb3VyY2UuemlwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICAgICAnbG9nczpDcmVhdGVMb2dHcm91cCcsXG4gICAgICAgICAgICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICAgICAgICAgICAgICdsb2dzOlB1dExvZ0V2ZW50cycsXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAnUmVzb3VyY2UnOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6bG9nczonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnOmxvZy1ncm91cDovYXdzL2NvZGVidWlsZC8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeVByb2plY3QzOUY3QjBBRScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6bG9nczonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdSZWYnOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAnOmxvZy1ncm91cDovYXdzL2NvZGVidWlsZC8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeVByb2plY3QzOUY3QjBBRScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc6KicsXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgICAgICAgJ2NvZGVidWlsZDpDcmVhdGVSZXBvcnRHcm91cCcsXG4gICAgICAgICAgICAgICAgICAgICdjb2RlYnVpbGQ6Q3JlYXRlUmVwb3J0JyxcbiAgICAgICAgICAgICAgICAgICAgJ2NvZGVidWlsZDpVcGRhdGVSZXBvcnQnLFxuICAgICAgICAgICAgICAgICAgICAnY29kZWJ1aWxkOkJhdGNoUHV0VGVzdENhc2VzJyxcbiAgICAgICAgICAgICAgICAgICAgJ2NvZGVidWlsZDpCYXRjaFB1dENvZGVDb3ZlcmFnZXMnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6Y29kZWJ1aWxkOicsXG4gICAgICAgICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJzpyZXBvcnQtZ3JvdXAvJyxcbiAgICAgICAgICAgICAgICAgICAgICB7ICdSZWYnOiAnTXlQcm9qZWN0MzlGN0IwQUUnIH0sXG4gICAgICAgICAgICAgICAgICAgICAgJy0qJyxcbiAgICAgICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdWZXJzaW9uJzogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdQb2xpY3lOYW1lJzogJ015UHJvamVjdFJvbGVEZWZhdWx0UG9saWN5QjE5QjdDMjknLFxuICAgICAgICAgICAgJ1JvbGVzJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ1JlZic6ICdNeVByb2plY3RSb2xlOUJCRTUyMzMnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnTXlQcm9qZWN0MzlGN0IwQUUnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLFxuICAgICAgICAgICdQcm9wZXJ0aWVzJzoge1xuICAgICAgICAgICAgJ0FydGlmYWN0cyc6IHtcbiAgICAgICAgICAgICAgJ1R5cGUnOiAnTk9fQVJUSUZBQ1RTJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnRW52aXJvbm1lbnQnOiB7XG4gICAgICAgICAgICAgICdDb21wdXRlVHlwZSc6ICdCVUlMRF9HRU5FUkFMMV9NRURJVU0nLFxuICAgICAgICAgICAgICAnSW1hZ2UnOiAnYXdzL2NvZGVidWlsZC93aW5kb3dzLWJhc2U6Mi4wJyxcbiAgICAgICAgICAgICAgJ0ltYWdlUHVsbENyZWRlbnRpYWxzVHlwZSc6ICdDT0RFQlVJTEQnLFxuICAgICAgICAgICAgICAnUHJpdmlsZWdlZE1vZGUnOiBmYWxzZSxcbiAgICAgICAgICAgICAgJ1R5cGUnOiAnV0lORE9XU19DT05UQUlORVInLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdTZXJ2aWNlUm9sZSc6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ015UHJvamVjdFJvbGU5QkJFNTIzMycsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1NvdXJjZSc6IHtcbiAgICAgICAgICAgICAgJ0xvY2F0aW9uJzoge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgJ1JlZic6ICdNeUJ1Y2tldEY2OEYzRkYwJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgJy9wYXRoL3RvL3NvdXJjZS56aXAnLFxuICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnVHlwZSc6ICdTMycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ0VuY3J5cHRpb25LZXknOiAnYWxpYXMvYXdzL3MzJyxcbiAgICAgICAgICAgICdDYWNoZSc6IHtcbiAgICAgICAgICAgICAgJ1R5cGUnOiAnTk9fQ0FDSEUnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBHaXRIdWIgc291cmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5naXRIdWIoe1xuICAgICAgICBvd25lcjogJ3Rlc3Rvd25lcicsXG4gICAgICAgIHJlcG86ICd0ZXN0cmVwbycsXG4gICAgICAgIGNsb25lRGVwdGg6IDMsXG4gICAgICAgIGZldGNoU3VibW9kdWxlczogdHJ1ZSxcbiAgICAgICAgd2ViaG9vazogdHJ1ZSxcbiAgICAgICAgcmVwb3J0QnVpbGRTdGF0dXM6IGZhbHNlLFxuICAgICAgICB3ZWJob29rRmlsdGVyczogW1xuICAgICAgICAgIGNvZGVidWlsZC5GaWx0ZXJHcm91cC5pbkV2ZW50T2YoY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVU0gpLmFuZFRhZ0lzTm90KCdzdGFibGUnKSxcbiAgICAgICAgICBjb2RlYnVpbGQuRmlsdGVyR3JvdXAuaW5FdmVudE9mKGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfUkVPUEVORUQpLmFuZEJhc2VCcmFuY2hJcygnbWFpbicpLFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICBTb3VyY2U6IHtcbiAgICAgICAgVHlwZTogJ0dJVEhVQicsXG4gICAgICAgIExvY2F0aW9uOiAnaHR0cHM6Ly9naXRodWIuY29tL3Rlc3Rvd25lci90ZXN0cmVwby5naXQnLFxuICAgICAgICBSZXBvcnRCdWlsZFN0YXR1czogZmFsc2UsXG4gICAgICAgIEdpdENsb25lRGVwdGg6IDMsXG4gICAgICAgIEdpdFN1Ym1vZHVsZXNDb25maWc6IHtcbiAgICAgICAgICBGZXRjaFN1Ym1vZHVsZXM6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgVHJpZ2dlcnM6IHtcbiAgICAgICAgV2ViaG9vazogdHJ1ZSxcbiAgICAgICAgRmlsdGVyR3JvdXBzOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgeyBUeXBlOiAnRVZFTlQnLCBQYXR0ZXJuOiAnUFVTSCcgfSxcbiAgICAgICAgICAgIHsgVHlwZTogJ0hFQURfUkVGJywgUGF0dGVybjogJ3JlZnMvdGFncy9zdGFibGUnLCBFeGNsdWRlTWF0Y2hlZFBhdHRlcm46IHRydWUgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHsgVHlwZTogJ0VWRU5UJywgUGF0dGVybjogJ1BVTExfUkVRVUVTVF9SRU9QRU5FRCcgfSxcbiAgICAgICAgICAgIHsgVHlwZTogJ0JBU0VfUkVGJywgUGF0dGVybjogJ3JlZnMvaGVhZHMvbWFpbicgfSxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBHaXRIdWJFbnRlcnByaXNlIHNvdXJjZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IHB1c2hGaWx0ZXJHcm91cCA9IGNvZGVidWlsZC5GaWx0ZXJHcm91cC5pbkV2ZW50T2YoY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVU0gpO1xuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHtcbiAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5naXRIdWJFbnRlcnByaXNlKHtcbiAgICAgICAgaHR0cHNDbG9uZVVybDogJ2h0dHBzOi8vZ2l0aHViLnRlc3Rjb21wYW55LmNvbS90ZXN0b3duZXIvdGVzdHJlcG8nLFxuICAgICAgICBpZ25vcmVTc2xFcnJvcnM6IHRydWUsXG4gICAgICAgIGNsb25lRGVwdGg6IDQsXG4gICAgICAgIHdlYmhvb2s6IHRydWUsXG4gICAgICAgIHJlcG9ydEJ1aWxkU3RhdHVzOiBmYWxzZSxcbiAgICAgICAgd2ViaG9va0ZpbHRlcnM6IFtcbiAgICAgICAgICBwdXNoRmlsdGVyR3JvdXAuYW5kQnJhbmNoSXMoJ21haW4nKSxcbiAgICAgICAgICBwdXNoRmlsdGVyR3JvdXAuYW5kQnJhbmNoSXMoJ2RldmVsb3AnKSxcbiAgICAgICAgICBwdXNoRmlsdGVyR3JvdXAuYW5kRmlsZVBhdGhJcygnUmVhZE1lLm1kJyksXG4gICAgICAgIF0sXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgIFNvdXJjZToge1xuICAgICAgICBUeXBlOiAnR0lUSFVCX0VOVEVSUFJJU0UnLFxuICAgICAgICBJbnNlY3VyZVNzbDogdHJ1ZSxcbiAgICAgICAgR2l0Q2xvbmVEZXB0aDogNCxcbiAgICAgICAgUmVwb3J0QnVpbGRTdGF0dXM6IGZhbHNlLFxuICAgICAgICBMb2NhdGlvbjogJ2h0dHBzOi8vZ2l0aHViLnRlc3Rjb21wYW55LmNvbS90ZXN0b3duZXIvdGVzdHJlcG8nLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgIFRyaWdnZXJzOiB7XG4gICAgICAgIFdlYmhvb2s6IHRydWUsXG4gICAgICAgIEZpbHRlckdyb3VwczogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIHsgVHlwZTogJ0VWRU5UJywgUGF0dGVybjogJ1BVU0gnIH0sXG4gICAgICAgICAgICB7IFR5cGU6ICdIRUFEX1JFRicsIFBhdHRlcm46ICdyZWZzL2hlYWRzL21haW4nIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7IFR5cGU6ICdFVkVOVCcsIFBhdHRlcm46ICdQVVNIJyB9LFxuICAgICAgICAgICAgeyBUeXBlOiAnSEVBRF9SRUYnLCBQYXR0ZXJuOiAncmVmcy9oZWFkcy9kZXZlbG9wJyB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgeyBUeXBlOiAnRVZFTlQnLCBQYXR0ZXJuOiAnUFVTSCcgfSxcbiAgICAgICAgICAgIHsgVHlwZTogJ0ZJTEVfUEFUSCcsIFBhdHRlcm46ICdSZWFkTWUubWQnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggQml0YnVja2V0IHNvdXJjZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuYml0QnVja2V0KHtcbiAgICAgICAgb3duZXI6ICd0ZXN0b3duZXInLFxuICAgICAgICByZXBvOiAndGVzdHJlcG8nLFxuICAgICAgICBjbG9uZURlcHRoOiA1LFxuICAgICAgICByZXBvcnRCdWlsZFN0YXR1czogZmFsc2UsXG4gICAgICAgIHdlYmhvb2tGaWx0ZXJzOiBbXG4gICAgICAgICAgY29kZWJ1aWxkLkZpbHRlckdyb3VwLmluRXZlbnRPZihcbiAgICAgICAgICAgIGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfQ1JFQVRFRCxcbiAgICAgICAgICAgIGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfVVBEQVRFRCxcbiAgICAgICAgICAgIGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfTUVSR0VELFxuICAgICAgICAgICkuYW5kVGFnSXMoJ3YuKicpLFxuICAgICAgICAgIC8vIGR1cGxpY2F0ZSBldmVudCBhY3Rpb25zIGFyZSBmaW5lXG4gICAgICAgICAgY29kZWJ1aWxkLkZpbHRlckdyb3VwLmluRXZlbnRPZihjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVTSCwgY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVU0gpLmFuZEFjdG9yQWNjb3VudElzTm90KCdhd3MtY2RrLWRldicpLFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICBTb3VyY2U6IHtcbiAgICAgICAgVHlwZTogJ0JJVEJVQ0tFVCcsXG4gICAgICAgIExvY2F0aW9uOiAnaHR0cHM6Ly9iaXRidWNrZXQub3JnL3Rlc3Rvd25lci90ZXN0cmVwby5naXQnLFxuICAgICAgICBHaXRDbG9uZURlcHRoOiA1LFxuICAgICAgICBSZXBvcnRCdWlsZFN0YXR1czogZmFsc2UsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgVHJpZ2dlcnM6IHtcbiAgICAgICAgV2ViaG9vazogdHJ1ZSxcbiAgICAgICAgRmlsdGVyR3JvdXBzOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgeyBUeXBlOiAnRVZFTlQnLCBQYXR0ZXJuOiAnUFVMTF9SRVFVRVNUX0NSRUFURUQsIFBVTExfUkVRVUVTVF9VUERBVEVELCBQVUxMX1JFUVVFU1RfTUVSR0VEJyB9LFxuICAgICAgICAgICAgeyBUeXBlOiAnSEVBRF9SRUYnLCBQYXR0ZXJuOiAncmVmcy90YWdzL3YuKicgfSxcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIHsgVHlwZTogJ0VWRU5UJywgUGF0dGVybjogJ1BVU0gnIH0sXG4gICAgICAgICAgICB7IFR5cGU6ICdBQ1RPUl9BQ0NPVU5UX0lEJywgUGF0dGVybjogJ2F3cy1jZGstZGV2JywgRXhjbHVkZU1hdGNoZWRQYXR0ZXJuOiB0cnVlIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggd2ViaG9va1RyaWdnZXJzQmF0Y2hCdWlsZCBvcHRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLmdpdEh1Yih7XG4gICAgICAgIG93bmVyOiAndGVzdG93bmVyJyxcbiAgICAgICAgcmVwbzogJ3Rlc3RyZXBvJyxcbiAgICAgICAgd2ViaG9vazogdHJ1ZSxcbiAgICAgICAgd2ViaG9va1RyaWdnZXJzQmF0Y2hCdWlsZDogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgVHJpZ2dlcnM6IHtcbiAgICAgICAgV2ViaG9vazogdHJ1ZSxcbiAgICAgICAgQnVpbGRUeXBlOiAnQlVJTERfQkFUQ0gnLFxuICAgICAgfSxcbiAgICAgIEJ1aWxkQmF0Y2hDb25maWc6IHtcbiAgICAgICAgU2VydmljZVJvbGU6IHtcbiAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICdQcm9qZWN0QmF0Y2hTZXJ2aWNlUm9sZUY5N0ExQ0ZCJyxcbiAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgQXNzdW1lUm9sZVBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3N0czpBc3N1bWVSb2xlJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICBTZXJ2aWNlOiAnY29kZWJ1aWxkLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICAgJ2NvZGVidWlsZDpTdGFydEJ1aWxkJyxcbiAgICAgICAgICAgICAgJ2NvZGVidWlsZDpTdG9wQnVpbGQnLFxuICAgICAgICAgICAgICAnY29kZWJ1aWxkOlJldHJ5QnVpbGQnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAgICdQcm9qZWN0Qzc4RDk3QUQnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlsIGNyZWF0aW5nIGEgUHJvamVjdCB3aGVuIHdlYmhvb2sgZmFsc2UgYW5kIHdlYmhvb2tUcmlnZ2Vyc0JhdGNoQnVpbGQgb3B0aW9uJywgKCkgPT4ge1xuICAgIFtmYWxzZSwgdW5kZWZpbmVkXS5mb3JFYWNoKCh3ZWJob29rKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuZ2l0SHViKHtcbiAgICAgICAgICAgIG93bmVyOiAndGVzdG93bmVyJyxcbiAgICAgICAgICAgIHJlcG86ICd0ZXN0cmVwbycsXG4gICAgICAgICAgICB3ZWJob29rLFxuICAgICAgICAgICAgd2ViaG9va1RyaWdnZXJzQmF0Y2hCdWlsZDogdHJ1ZSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9gd2ViaG9va1RyaWdnZXJzQmF0Y2hCdWlsZGAgY2Fubm90IGJlIHVzZWQgd2hlbiBgd2ViaG9va2AgaXMgYGZhbHNlYC8pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlsIGNyZWF0aW5nIGEgUHJvamVjdCB3aGVuIG5vIGJ1aWxkIHNwZWMgaXMgZ2l2ZW4nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvYnVpbGRTcGVjLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggVlBDIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VlBDJyk7XG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ1NlY3VyaXR5R3JvdXAxJywge1xuICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdCb2InLFxuICAgICAgdnBjLFxuICAgICAgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRXhhbXBsZScsXG4gICAgfSk7XG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHtcbiAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5zMyh7XG4gICAgICAgIGJ1Y2tldCxcbiAgICAgICAgcGF0aDogJ3BhdGgvdG8vc291cmNlLnppcCcsXG4gICAgICB9KSxcbiAgICAgIHZwYyxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBbc2VjdXJpdHlHcm91cF0sXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAnVnBjQ29uZmlnJzoge1xuICAgICAgICAnU2VjdXJpdHlHcm91cElkcyc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ1NlY3VyaXR5R3JvdXAxRjU1NEIzNkYnLFxuICAgICAgICAgICAgICAnR3JvdXBJZCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgICdTdWJuZXRzJzogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgICdSZWYnOiAnTXlWUENQcml2YXRlU3VibmV0MVN1Ym5ldDY0MTU0M0Y0JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdSZWYnOiAnTXlWUENQcml2YXRlU3VibmV0MlN1Ym5ldEE0MjBEM0YwJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAnVnBjSWQnOiB7XG4gICAgICAgICAgJ1JlZic6ICdNeVZQQ0FGQjA3QTMxJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBleHBlY3QocHJvamVjdC5jb25uZWN0aW9ucykudG9CZURlZmluZWQoKTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aG91dCBWUEMgY29uZmlndXJhdGlvbiBidXQgc2VjdXJpdHkgZ3JvdXAgaWRlbnRpZmllZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnTXlWUEMnKTtcbiAgICBjb25zdCBzZWN1cml0eUdyb3VwID0gbmV3IGVjMi5TZWN1cml0eUdyb3VwKHN0YWNrLCAnU2VjdXJpdHlHcm91cDEnLCB7XG4gICAgICBzZWN1cml0eUdyb3VwTmFtZTogJ0JvYicsXG4gICAgICB2cGMsXG4gICAgICBhbGxvd0FsbE91dGJvdW5kOiB0cnVlLFxuICAgICAgZGVzY3JpcHRpb246ICdFeGFtcGxlJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PlxuICAgICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICAgICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgICAgIGJ1Y2tldCxcbiAgICAgICAgICBwYXRoOiAncGF0aC90by9zb3VyY2UuemlwJyxcbiAgICAgICAgfSksXG4gICAgICAgIHNlY3VyaXR5R3JvdXBzOiBbc2VjdXJpdHlHcm91cF0sXG4gICAgICB9KSxcbiAgICApLnRvVGhyb3coL0Nhbm5vdCBjb25maWd1cmUgJ3NlY3VyaXR5R3JvdXAnIG9yICdhbGxvd0FsbE91dGJvdW5kJyB3aXRob3V0IGNvbmZpZ3VyaW5nIGEgVlBDLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggVlBDIGNvbmZpZ3VyYXRpb24gYnV0IGFsbG93QWxsT3V0Ym91bmQgaWRlbnRpZmllZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ015VlBDJyk7XG4gICAgY29uc3Qgc2VjdXJpdHlHcm91cCA9IG5ldyBlYzIuU2VjdXJpdHlHcm91cChzdGFjaywgJ1NlY3VyaXR5R3JvdXAxJywge1xuICAgICAgc2VjdXJpdHlHcm91cE5hbWU6ICdCb2InLFxuICAgICAgdnBjLFxuICAgICAgYWxsb3dBbGxPdXRib3VuZDogdHJ1ZSxcbiAgICAgIGRlc2NyaXB0aW9uOiAnRXhhbXBsZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT5cbiAgICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHtcbiAgICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgICAgICBidWNrZXQsXG4gICAgICAgICAgcGF0aDogJ3BhdGgvdG8vc291cmNlLnppcCcsXG4gICAgICAgIH0pLFxuICAgICAgICB2cGMsXG4gICAgICAgIGFsbG93QWxsT3V0Ym91bmQ6IHRydWUsXG4gICAgICAgIHNlY3VyaXR5R3JvdXBzOiBbc2VjdXJpdHlHcm91cF0sXG4gICAgICB9KSxcbiAgICApLnRvVGhyb3coL0NvbmZpZ3VyZSAnYWxsb3dBbGxPdXRib3VuZCcgZGlyZWN0bHkgb24gdGhlIHN1cHBsaWVkIFNlY3VyaXR5R3JvdXAvKTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aG91dCBwYXNzaW5nIGEgVlBDIGNhbm5vdCBhY2Nlc3MgdGhlIGNvbm5lY3Rpb25zIHByb3BlcnR5JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jyk7XG5cbiAgICBleHBlY3QoKCkgPT4gcHJvamVjdC5jb25uZWN0aW9ucykudG9UaHJvdyhcbiAgICAgIC9Pbmx5IFZQQy1hc3NvY2lhdGVkIFByb2plY3RzIGhhdmUgc2VjdXJpdHkgZ3JvdXBzIHRvIG1hbmFnZS4gU3VwcGx5IHRoZSBcInZwY1wiIHBhcmFtZXRlciB3aGVuIGNyZWF0aW5nIHRoZSBQcm9qZWN0Lyk7XG4gIH0pO1xuXG4gIHRlc3QoJ25vIEtNUyBLZXkgZGVmYXVsdHMgdG8gZGVmYXVsdCBTMyBtYW5hZ2VkIGtleScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgRW5jcnlwdGlvbktleTogJ2FsaWFzL2F3cy9zMycsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3dpdGggYSBLTVMgS2V5IGFkZHMgZGVjcnlwdCBwZXJtaXNzaW9ucyB0byB0aGUgQ29kZUJ1aWxkIFJvbGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCBrZXkgPSBuZXcga21zLktleShzdGFjaywgJ015S2V5Jyk7XG5cbiAgICBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHtcbiAgICAgIGVuY3J5cHRpb25LZXk6IGtleSxcbiAgICAgIGdyYW50UmVwb3J0R3JvdXBQZXJtaXNzaW9uczogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7fSwgLy8gQ2xvdWRXYXRjaCBsb2dzXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ0FjdGlvbic6IFtcbiAgICAgICAgICAgICAgJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICAgJ2ttczpFbmNyeXB0JyxcbiAgICAgICAgICAgICAgJ2ttczpSZUVuY3J5cHQqJyxcbiAgICAgICAgICAgICAgJ2ttczpHZW5lcmF0ZURhdGFLZXkqJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICAgICAgICAgJ015S2V5NkFCMjlGQTYnLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgICdSb2xlcyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICdSZWYnOiAnTXlQcm9qZWN0Um9sZTlCQkU1MjMzJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbnRlc3QoJ3VzaW5nIHRpbWVvdXQgYW5kIHBhdGggaW4gUzMgYXJ0aWZhY3RzIHNldHMgaXQgY29ycmVjdGx5JywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpO1xuICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0KHtcbiAgICAgIHZlcnNpb246ICcwLjInLFxuICAgIH0pLFxuICAgIGFydGlmYWN0czogY29kZWJ1aWxkLkFydGlmYWN0cy5zMyh7XG4gICAgICBwYXRoOiAnc29tZS9wYXRoJyxcbiAgICAgIG5hbWU6ICdzb21lX25hbWUnLFxuICAgICAgYnVja2V0LFxuICAgIH0pLFxuICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDEyMyksXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAnQXJ0aWZhY3RzJzoge1xuICAgICAgJ1BhdGgnOiAnc29tZS9wYXRoJyxcbiAgICAgICdOYW1lJzogJ3NvbWVfbmFtZScsXG4gICAgICAnVHlwZSc6ICdTMycsXG4gICAgfSxcbiAgICAnVGltZW91dEluTWludXRlcyc6IDEyMyxcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3NlY29uZGFyeSBzb3VyY2VzJywgKCkgPT4ge1xuICB0ZXN0KCdyZXF1aXJlIHByb3ZpZGluZyBhbiBpZGVudGlmaWVyIHdoZW4gY3JlYXRpbmcgYSBQcm9qZWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHtcbiAgICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICAgIHZlcnNpb246ICcwLjInLFxuICAgICAgICB9KSxcbiAgICAgICAgc2Vjb25kYXJ5U291cmNlczogW1xuICAgICAgICAgIGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgICAgICAgYnVja2V0OiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKSxcbiAgICAgICAgICAgIHBhdGg6ICdwYXRoJyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL2lkZW50aWZpZXIvKTtcbiAgfSk7XG5cbiAgdGVzdCgnYXJlIG5vdCBhbGxvd2VkIGZvciBhIFByb2plY3Qgd2l0aCBDb2RlUGlwZWxpbmUgYXMgU291cmNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcpO1xuXG4gICAgcHJvamVjdC5hZGRTZWNvbmRhcnlTb3VyY2UoY29kZWJ1aWxkLlNvdXJjZS5zMyh7XG4gICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpLFxuICAgICAgcGF0aDogJ3NvbWUvcGF0aCcsXG4gICAgICBpZGVudGlmaWVyOiAnaWQnLFxuICAgIH0pKTtcblxuICAgIGV4cGVjdCgoKSA9PiBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spKS50b1Rocm93KC9zZWNvbmRhcnkgc291cmNlcy8pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRlZCB3aXRoIGFuIGlkZW50aWZlciBhZnRlciB0aGUgUHJvamVjdCBoYXMgYmVlbiBjcmVhdGVkIGFyZSByZW5kZXJlZCBpbiB0aGUgdGVtcGxhdGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHtcbiAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5zMyh7XG4gICAgICAgIGJ1Y2tldCxcbiAgICAgICAgcGF0aDogJ3NvbWUvcGF0aCcsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIHByb2plY3QuYWRkU2Vjb25kYXJ5U291cmNlKGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgYnVja2V0LFxuICAgICAgcGF0aDogJ2Fub3RoZXIvcGF0aCcsXG4gICAgICBpZGVudGlmaWVyOiAnc291cmNlMScsXG4gICAgfSkpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgJ1NlY29uZGFyeVNvdXJjZXMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnU291cmNlSWRlbnRpZmllcic6ICdzb3VyY2UxJyxcbiAgICAgICAgICAnVHlwZSc6ICdTMycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnc291cmNlcyB3aXRoIGN1c3RvbWlzZWQgYnVpbGQgc3RhdHVzIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gIHRlc3QoJ0dpdEh1YicsICgpID0+IHtcbiAgICBjb25zdCBjb250ZXh0ID0gJ015IGN1c3RvbSBDb2RlQnVpbGQgd29ya2VyISc7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc291cmNlID0gY29kZWJ1aWxkLlNvdXJjZS5naXRIdWIoe1xuICAgICAgb3duZXI6ICdhd3NsYWJzJyxcbiAgICAgIHJlcG86ICdhd3MtY2RrJyxcbiAgICAgIGJ1aWxkU3RhdHVzQ29udGV4dDogY29udGV4dCxcbiAgICB9KTtcblxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHsgc291cmNlIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuZmluZFBhcmFtZXRlcnMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgU291cmNlOiB7XG4gICAgICAgIGJ1aWxkU3RhdHVzQ29uZmlnOiB7XG4gICAgICAgICAgY29udGV4dDogY29udGV4dCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ0dpdEh1YiBFbnRlcnByaXNlJywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbnRleHQgPSAnTXkgY3VzdG9tIENvZGVCdWlsZCB3b3JrZXIhJztcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2UgPSBjb2RlYnVpbGQuU291cmNlLmdpdEh1YkVudGVycHJpc2Uoe1xuICAgICAgaHR0cHNDbG9uZVVybDogJ3VybCcsXG4gICAgICBidWlsZFN0YXR1c0NvbnRleHQ6IGNvbnRleHQsXG4gICAgfSk7XG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0JywgeyBzb3VyY2UgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kUGFyYW1ldGVycygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICBTb3VyY2U6IHtcbiAgICAgICAgYnVpbGRTdGF0dXNDb25maWc6IHtcbiAgICAgICAgICBjb250ZXh0OiBjb250ZXh0LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnQml0QnVja2V0JywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbnRleHQgPSAnTXkgY3VzdG9tIENvZGVCdWlsZCB3b3JrZXIhJztcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBzb3VyY2UgPSBjb2RlYnVpbGQuU291cmNlLmJpdEJ1Y2tldCh7IG93bmVyOiAnYXdzbGFicycsIHJlcG86ICdhd3MtY2RrJyB9KTtcbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnLCB7IHNvdXJjZSB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmZpbmRQYXJhbWV0ZXJzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgIFNvdXJjZToge1xuICAgICAgICBidWlsZFN0YXR1c0NvbmZpZzoge1xuICAgICAgICAgIGNvbnRleHQ6IGNvbnRleHQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnc291cmNlcyB3aXRoIGN1c3RvbWlzZWQgYnVpbGQgc3RhdHVzIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gIHRlc3QoJ0dpdEh1YiB3aXRoIHRhcmdldFVybCcsICgpID0+IHtcbiAgICBjb25zdCB0YXJnZXRVcmwgPSAnaHR0cHM6Ly9leGFtcGxlLmNvbSc7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc291cmNlID0gY29kZWJ1aWxkLlNvdXJjZS5naXRIdWIoe1xuICAgICAgb3duZXI6ICdhd3NsYWJzJyxcbiAgICAgIHJlcG86ICdhd3MtY2RrJyxcbiAgICAgIGJ1aWxkU3RhdHVzVXJsOiB0YXJnZXRVcmwsXG4gICAgfSk7XG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0JywgeyBzb3VyY2UgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5maW5kUGFyYW1ldGVycygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICBTb3VyY2U6IHtcbiAgICAgICAgYnVpbGRTdGF0dXNDb25maWc6IHtcbiAgICAgICAgICB0YXJnZXRVcmw6IHRhcmdldFVybCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdzZWNvbmRhcnkgc291cmNlIHZlcnNpb25zJywgKCkgPT4ge1xuICB0ZXN0KCdhbGxvdyBzZWNvbmRhcnkgc291cmNlIHZlcnNpb25zJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgIGNvbnN0IHByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgICBidWNrZXQsXG4gICAgICAgIHBhdGg6ICdzb21lL3BhdGgnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBwcm9qZWN0LmFkZFNlY29uZGFyeVNvdXJjZShjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIHBhdGg6ICdhbm90aGVyL3BhdGgnLFxuICAgICAgaWRlbnRpZmllcjogJ3NvdXJjZTEnLFxuICAgICAgdmVyc2lvbjogJ3NvbWV2ZXJzaW9uJyxcbiAgICB9KSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAnU2Vjb25kYXJ5U291cmNlcyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICdTb3VyY2VJZGVudGlmaWVyJzogJ3NvdXJjZTEnLFxuICAgICAgICAgICdUeXBlJzogJ1MzJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICAnU2Vjb25kYXJ5U291cmNlVmVyc2lvbnMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnU291cmNlSWRlbnRpZmllcic6ICdzb3VyY2UxJyxcbiAgICAgICAgICAnU291cmNlVmVyc2lvbic6ICdzb21ldmVyc2lvbicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhbGxvdyBub3QgdG8gc3BlY2lmeSBzZWNvbmRhcnkgc291cmNlIHZlcnNpb25zJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgIGNvbnN0IHByb2plY3QgPSBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgICBidWNrZXQsXG4gICAgICAgIHBhdGg6ICdzb21lL3BhdGgnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBwcm9qZWN0LmFkZFNlY29uZGFyeVNvdXJjZShjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIHBhdGg6ICdhbm90aGVyL3BhdGgnLFxuICAgICAgaWRlbnRpZmllcjogJ3NvdXJjZTEnLFxuICAgIH0pKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgICdTZWNvbmRhcnlTb3VyY2VzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ1NvdXJjZUlkZW50aWZpZXInOiAnc291cmNlMScsXG4gICAgICAgICAgJ1R5cGUnOiAnUzMnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2ZpbGVTeXN0ZW1Mb2NhdGlvbnMnLCAoKSA9PiB7XG4gIHRlc3QoJ2NyZWF0ZSBmaWxlU3lzdGVtTG9jYXRpb24gYW5kIHZhbGlkYXRlIGF0dHJpYnV0ZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICAgIH0pLFxuICAgICAgZmlsZVN5c3RlbUxvY2F0aW9uczogW2NvZGVidWlsZC5GaWxlU3lzdGVtTG9jYXRpb24uZWZzKHtcbiAgICAgICAgaWRlbnRpZmllcjogJ215aWRlbnRpZmllcjInLFxuICAgICAgICBsb2NhdGlvbjogJ215Y2xvZGF0aW9uLm15ZG5zcm9vdC5jb206L2xvYycsXG4gICAgICAgIG1vdW50UG9pbnQ6ICcvbWVkaWEnLFxuICAgICAgICBtb3VudE9wdGlvbnM6ICdvcHRzJyxcbiAgICAgIH0pXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgICdGaWxlU3lzdGVtTG9jYXRpb25zJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0lkZW50aWZpZXInOiAnbXlpZGVudGlmaWVyMicsXG4gICAgICAgICAgJ01vdW50UG9pbnQnOiAnL21lZGlhJyxcbiAgICAgICAgICAnTW91bnRPcHRpb25zJzogJ29wdHMnLFxuICAgICAgICAgICdMb2NhdGlvbic6ICdteWNsb2RhdGlvbi5teWRuc3Jvb3QuY29tOi9sb2MnLFxuICAgICAgICAgICdUeXBlJzogJ0VGUycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdNdWx0aXBsZSBmaWxlU3lzdGVtTG9jYXRpb24gY3JlYXRlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICB2ZXJzaW9uOiAnMC4yJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuICAgIHByb2plY3QuYWRkRmlsZVN5c3RlbUxvY2F0aW9uKGNvZGVidWlsZC5GaWxlU3lzdGVtTG9jYXRpb24uZWZzKHtcbiAgICAgIGlkZW50aWZpZXI6ICdteWlkZW50aWZpZXIzJyxcbiAgICAgIGxvY2F0aW9uOiAnbXljbG9kYXRpb24ubXlkbnNyb290LmNvbTovbG9jJyxcbiAgICAgIG1vdW50UG9pbnQ6ICcvbWVkaWEnLFxuICAgICAgbW91bnRPcHRpb25zOiAnb3B0cycsXG4gICAgfSkpO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgJ0ZpbGVTeXN0ZW1Mb2NhdGlvbnMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnSWRlbnRpZmllcic6ICdteWlkZW50aWZpZXIzJyxcbiAgICAgICAgICAnTW91bnRQb2ludCc6ICcvbWVkaWEnLFxuICAgICAgICAgICdNb3VudE9wdGlvbnMnOiAnb3B0cycsXG4gICAgICAgICAgJ0xvY2F0aW9uJzogJ215Y2xvZGF0aW9uLm15ZG5zcm9vdC5jb206L2xvYycsXG4gICAgICAgICAgJ1R5cGUnOiAnRUZTJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdzZWNvbmRhcnkgYXJ0aWZhY3RzJywgKCkgPT4ge1xuICB0ZXN0KCdyZXF1aXJlIHByb3ZpZGluZyBhbiBpZGVudGlmaWVyIHdoZW4gY3JlYXRpbmcgYSBQcm9qZWN0JywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHtcbiAgICAgICAgYnVpbGRTcGVjOiBjb2RlYnVpbGQuQnVpbGRTcGVjLmZyb21PYmplY3Qoe1xuICAgICAgICAgIHZlcnNpb246ICcwLjInLFxuICAgICAgICB9KSxcbiAgICAgICAgc2Vjb25kYXJ5QXJ0aWZhY3RzOiBbXG4gICAgICAgICAgY29kZWJ1aWxkLkFydGlmYWN0cy5zMyh7XG4gICAgICAgICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpLFxuICAgICAgICAgICAgcGF0aDogJ3NvbWUvcGF0aCcsXG4gICAgICAgICAgICBuYW1lOiAnbmFtZScsXG4gICAgICAgICAgfSksXG4gICAgICAgIF0sXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9pZGVudGlmaWVyLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FyZSBub3QgYWxsb3dlZCBmb3IgYSBQcm9qZWN0IHdpdGggQ29kZVBpcGVsaW5lIGFzIFNvdXJjZScsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnKTtcblxuICAgIHByb2plY3QuYWRkU2Vjb25kYXJ5QXJ0aWZhY3QoY29kZWJ1aWxkLkFydGlmYWN0cy5zMyh7XG4gICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpLFxuICAgICAgcGF0aDogJ3NvbWUvcGF0aCcsXG4gICAgICBuYW1lOiAnbmFtZScsXG4gICAgICBpZGVudGlmaWVyOiAnaWQnLFxuICAgIH0pKTtcblxuICAgIGV4cGVjdCgoKSA9PiBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spKS50b1Rocm93KC9zZWNvbmRhcnkgYXJ0aWZhY3RzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZGVkIHdpdGggYW4gaWRlbnRpZmllciBhZnRlciB0aGUgUHJvamVjdCBoYXMgYmVlbiBjcmVhdGVkIGFyZSByZW5kZXJlZCBpbiB0aGUgdGVtcGxhdGUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHtcbiAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5zMyh7XG4gICAgICAgIGJ1Y2tldCxcbiAgICAgICAgcGF0aDogJ3NvbWUvcGF0aCcsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIHByb2plY3QuYWRkU2Vjb25kYXJ5QXJ0aWZhY3QoY29kZWJ1aWxkLkFydGlmYWN0cy5zMyh7XG4gICAgICBidWNrZXQsXG4gICAgICBwYXRoOiAnYW5vdGhlci9wYXRoJyxcbiAgICAgIG5hbWU6ICduYW1lJyxcbiAgICAgIGlkZW50aWZpZXI6ICdhcnRpZmFjdDEnLFxuICAgIH0pKTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgICdTZWNvbmRhcnlBcnRpZmFjdHMnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnQXJ0aWZhY3RJZGVudGlmaWVyJzogJ2FydGlmYWN0MScsXG4gICAgICAgICAgJ1R5cGUnOiAnUzMnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGlzYWJsZWRFbmNyeXB0aW9uIGlzIHNldCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBidWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKTtcbiAgICBjb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgICAgYnVja2V0LFxuICAgICAgICBwYXRoOiAnc29tZS9wYXRoJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgcHJvamVjdC5hZGRTZWNvbmRhcnlBcnRpZmFjdChjb2RlYnVpbGQuQXJ0aWZhY3RzLnMzKHtcbiAgICAgIGJ1Y2tldCxcbiAgICAgIHBhdGg6ICdhbm90aGVyL3BhdGgnLFxuICAgICAgbmFtZTogJ25hbWUnLFxuICAgICAgaWRlbnRpZmllcjogJ2FydGlmYWN0MScsXG4gICAgICBlbmNyeXB0aW9uOiBmYWxzZSxcbiAgICB9KSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAnU2Vjb25kYXJ5QXJ0aWZhY3RzJzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0FydGlmYWN0SWRlbnRpZmllcic6ICdhcnRpZmFjdDEnLFxuICAgICAgICAgICdFbmNyeXB0aW9uRGlzYWJsZWQnOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2FydGlmYWN0cycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ0NvZGVQaXBlbGluZScsICgpID0+IHtcbiAgICB0ZXN0KCdib3RoIHNvdXJjZSBhbmQgYXJ0aWZhY3MgYXJlIHNldCB0byBDb2RlUGlwZWxpbmUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnKTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICAnU291cmNlJzoge1xuICAgICAgICAgICdUeXBlJzogJ0NPREVQSVBFTElORScsXG4gICAgICAgIH0sXG4gICAgICAgICdBcnRpZmFjdHMnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQ09ERVBJUEVMSU5FJyxcbiAgICAgICAgfSxcbiAgICAgICAgJ1NlcnZpY2VSb2xlJzoge1xuICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgJ015UHJvamVjdFJvbGU5QkJFNTIzMycsXG4gICAgICAgICAgICAnQXJuJyxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgICAnRW52aXJvbm1lbnQnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnTElOVVhfQ09OVEFJTkVSJyxcbiAgICAgICAgICAnUHJpdmlsZWdlZE1vZGUnOiBmYWxzZSxcbiAgICAgICAgICAnSW1hZ2UnOiAnYXdzL2NvZGVidWlsZC9zdGFuZGFyZDoxLjAnLFxuICAgICAgICAgICdJbWFnZVB1bGxDcmVkZW50aWFsc1R5cGUnOiAnQ09ERUJVSUxEJyxcbiAgICAgICAgICAnQ29tcHV0ZVR5cGUnOiAnQlVJTERfR0VORVJBTDFfU01BTEwnLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdTMycsICgpID0+IHtcbiAgICB0ZXN0KCduYW1lIGlzIG5vdCBzZXQgc28gdXNlIGJ1aWxkc3BlYycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG4gICAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnLCB7XG4gICAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5zMyh7XG4gICAgICAgICAgYnVja2V0LFxuICAgICAgICAgIHBhdGg6ICdzb21lL3BhdGgnLFxuICAgICAgICB9KSxcbiAgICAgICAgYXJ0aWZhY3RzOiBjb2RlYnVpbGQuQXJ0aWZhY3RzLnMzKHtcbiAgICAgICAgICBidWNrZXQsXG4gICAgICAgICAgcGF0aDogJ2Fub3RoZXIvcGF0aCcsXG4gICAgICAgICAgaWRlbnRpZmllcjogJ2FydGlmYWN0MScsXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgICAgJ0FydGlmYWN0cyc6IHtcbiAgICAgICAgICAnTmFtZSc6IE1hdGNoLmFic2VudCgpLFxuICAgICAgICAgICdBcnRpZmFjdElkZW50aWZpZXInOiAnYXJ0aWZhY3QxJyxcbiAgICAgICAgICAnT3ZlcnJpZGVBcnRpZmFjdE5hbWUnOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCduYW1lIGlzIHNldCBzbyB1c2UgaXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdNeUJ1Y2tldCcpO1xuICAgICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICAgICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgICAgIGJ1Y2tldCxcbiAgICAgICAgICBwYXRoOiAnc29tZS9wYXRoJyxcbiAgICAgICAgfSksXG4gICAgICAgIGFydGlmYWN0czogY29kZWJ1aWxkLkFydGlmYWN0cy5zMyh7XG4gICAgICAgICAgYnVja2V0LFxuICAgICAgICAgIHBhdGg6ICdhbm90aGVyL3BhdGgnLFxuICAgICAgICAgIG5hbWU6ICdzcGVjaWZpY25hbWUnLFxuICAgICAgICAgIGlkZW50aWZpZXI6ICdhcnRpZmFjdDEnLFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAgICdBcnRpZmFjdHMnOiB7XG4gICAgICAgICAgJ0FydGlmYWN0SWRlbnRpZmllcic6ICdhcnRpZmFjdDEnLFxuICAgICAgICAgICdOYW1lJzogJ3NwZWNpZmljbmFtZScsXG4gICAgICAgICAgJ092ZXJyaWRlQXJ0aWZhY3ROYW1lJzogTWF0Y2guYWJzZW50KCksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxudGVzdCgnZXZlbnRzJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHtcbiAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgYnVja2V0OiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKSxcbiAgICAgIHBhdGg6ICdwYXRoJyxcbiAgICB9KSxcbiAgfSk7XG5cbiAgcHJvamVjdC5vbkJ1aWxkRmFpbGVkKCdPbkJ1aWxkRmFpbGVkJywgeyB0YXJnZXQ6IHsgYmluZDogKCkgPT4gKHsgYXJuOiAnQVJOJywgaWQ6ICdJRCcgfSkgfSB9KTtcbiAgcHJvamVjdC5vbkJ1aWxkU3VjY2VlZGVkKCdPbkJ1aWxkU3VjY2VlZGVkJywgeyB0YXJnZXQ6IHsgYmluZDogKCkgPT4gKHsgYXJuOiAnQVJOJywgaWQ6ICdJRCcgfSkgfSB9KTtcbiAgcHJvamVjdC5vblBoYXNlQ2hhbmdlKCdPblBoYXNlQ2hhbmdlJywgeyB0YXJnZXQ6IHsgYmluZDogKCkgPT4gKHsgYXJuOiAnQVJOJywgaWQ6ICdJRCcgfSkgfSB9KTtcbiAgcHJvamVjdC5vblN0YXRlQ2hhbmdlKCdPblN0YXRlQ2hhbmdlJywgeyB0YXJnZXQ6IHsgYmluZDogKCkgPT4gKHsgYXJuOiAnQVJOJywgaWQ6ICdJRCcgfSkgfSB9KTtcbiAgcHJvamVjdC5vbkJ1aWxkU3RhcnRlZCgnT25CdWlsZFN0YXJ0ZWQnLCB7IHRhcmdldDogeyBiaW5kOiAoKSA9PiAoeyBhcm46ICdBUk4nLCBpZDogJ0lEJyB9KSB9IH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAnRXZlbnRQYXR0ZXJuJzoge1xuICAgICAgJ3NvdXJjZSc6IFtcbiAgICAgICAgJ2F3cy5jb2RlYnVpbGQnLFxuICAgICAgXSxcbiAgICAgICdkZXRhaWwtdHlwZSc6IFtcbiAgICAgICAgJ0NvZGVCdWlsZCBCdWlsZCBTdGF0ZSBDaGFuZ2UnLFxuICAgICAgXSxcbiAgICAgICdkZXRhaWwnOiB7XG4gICAgICAgICdwcm9qZWN0LW5hbWUnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVByb2plY3QzOUY3QjBBRScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ2J1aWxkLXN0YXR1cyc6IFtcbiAgICAgICAgICAnRkFJTEVEJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAnU3RhdGUnOiAnRU5BQkxFRCcsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAnRXZlbnRQYXR0ZXJuJzoge1xuICAgICAgJ3NvdXJjZSc6IFtcbiAgICAgICAgJ2F3cy5jb2RlYnVpbGQnLFxuICAgICAgXSxcbiAgICAgICdkZXRhaWwtdHlwZSc6IFtcbiAgICAgICAgJ0NvZGVCdWlsZCBCdWlsZCBTdGF0ZSBDaGFuZ2UnLFxuICAgICAgXSxcbiAgICAgICdkZXRhaWwnOiB7XG4gICAgICAgICdwcm9qZWN0LW5hbWUnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVByb2plY3QzOUY3QjBBRScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ2J1aWxkLXN0YXR1cyc6IFtcbiAgICAgICAgICAnU1VDQ0VFREVEJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAnU3RhdGUnOiAnRU5BQkxFRCcsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAnRXZlbnRQYXR0ZXJuJzoge1xuICAgICAgJ3NvdXJjZSc6IFtcbiAgICAgICAgJ2F3cy5jb2RlYnVpbGQnLFxuICAgICAgXSxcbiAgICAgICdkZXRhaWwtdHlwZSc6IFtcbiAgICAgICAgJ0NvZGVCdWlsZCBCdWlsZCBQaGFzZSBDaGFuZ2UnLFxuICAgICAgXSxcbiAgICAgICdkZXRhaWwnOiB7XG4gICAgICAgICdwcm9qZWN0LW5hbWUnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVByb2plY3QzOUY3QjBBRScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAnU3RhdGUnOiAnRU5BQkxFRCcsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAnRXZlbnRQYXR0ZXJuJzoge1xuICAgICAgJ3NvdXJjZSc6IFtcbiAgICAgICAgJ2F3cy5jb2RlYnVpbGQnLFxuICAgICAgXSxcbiAgICAgICdkZXRhaWwtdHlwZSc6IFtcbiAgICAgICAgJ0NvZGVCdWlsZCBCdWlsZCBTdGF0ZSBDaGFuZ2UnLFxuICAgICAgXSxcbiAgICAgICdkZXRhaWwnOiB7XG4gICAgICAgICdwcm9qZWN0LW5hbWUnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVByb2plY3QzOUY3QjBBRScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAnU3RhdGUnOiAnRU5BQkxFRCcsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAnRXZlbnRQYXR0ZXJuJzoge1xuICAgICAgJ3NvdXJjZSc6IFtcbiAgICAgICAgJ2F3cy5jb2RlYnVpbGQnLFxuICAgICAgXSxcbiAgICAgICdkZXRhaWwtdHlwZSc6IFtcbiAgICAgICAgJ0NvZGVCdWlsZCBCdWlsZCBTdGF0ZSBDaGFuZ2UnLFxuICAgICAgXSxcbiAgICAgICdkZXRhaWwnOiB7XG4gICAgICAgICdwcm9qZWN0LW5hbWUnOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVByb2plY3QzOUY3QjBBRScsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgJ2J1aWxkLXN0YXR1cyc6IFtcbiAgICAgICAgICAnSU5fUFJPR1JFU1MnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuICAgICdTdGF0ZSc6ICdFTkFCTEVEJyxcbiAgfSk7XG59KTtcblxudGVzdCgnZW52aXJvbm1lbnQgdmFyaWFibGVzIGNhbiBiZSBvdmVycmlkZGVuIGF0IHRoZSBwcm9qZWN0IGxldmVsJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgIEZPTzogeyB2YWx1ZTogJzEyMzQnIH0sXG4gICAgICAgIEJBUjogeyB2YWx1ZTogYDExMSR7Y2RrLlRva2VuLmFzU3RyaW5nKHsgdHdvdHdvdHdvOiAnMjIyJyB9KX1gLCB0eXBlOiBjb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5QQVJBTUVURVJfU1RPUkUgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgR09POiB7IHZhbHVlOiAnQUJDJyB9LFxuICAgICAgRk9POiB7IHZhbHVlOiAnT1ZFUlJJREUhJyB9LFxuICAgIH0sXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAnU291cmNlJzoge1xuICAgICAgJ1R5cGUnOiAnQ09ERVBJUEVMSU5FJyxcbiAgICB9LFxuICAgICdBcnRpZmFjdHMnOiB7XG4gICAgICAnVHlwZSc6ICdDT0RFUElQRUxJTkUnLFxuICAgIH0sXG4gICAgJ1NlcnZpY2VSb2xlJzoge1xuICAgICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAgICdQcm9qZWN0Um9sZTRDQ0IyNzRFJyxcbiAgICAgICAgJ0FybicsXG4gICAgICBdLFxuICAgIH0sXG4gICAgJ0Vudmlyb25tZW50Jzoge1xuICAgICAgJ1R5cGUnOiAnTElOVVhfQ09OVEFJTkVSJyxcbiAgICAgICdFbnZpcm9ubWVudFZhcmlhYmxlcyc6IFtcbiAgICAgICAge1xuICAgICAgICAgICdUeXBlJzogJ1BMQUlOVEVYVCcsXG4gICAgICAgICAgJ1ZhbHVlJzogJ09WRVJSSURFIScsXG4gICAgICAgICAgJ05hbWUnOiAnRk9PJyxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICdUeXBlJzogJ1BBUkFNRVRFUl9TVE9SRScsXG4gICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAnJyxcbiAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICcxMTEnLFxuICAgICAgICAgICAgICAgIHsgdHdvdHdvdHdvOiAnMjIyJyB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdOYW1lJzogJ0JBUicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnVHlwZSc6ICdQTEFJTlRFWFQnLFxuICAgICAgICAgICdWYWx1ZSc6ICdBQkMnLFxuICAgICAgICAgICdOYW1lJzogJ0dPTycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgJ1ByaXZpbGVnZWRNb2RlJzogZmFsc2UsXG4gICAgICAnSW1hZ2UnOiAnYXdzL2NvZGVidWlsZC9zdGFuZGFyZDoxLjAnLFxuICAgICAgJ0ltYWdlUHVsbENyZWRlbnRpYWxzVHlwZSc6ICdDT0RFQlVJTEQnLFxuICAgICAgJ0NvbXB1dGVUeXBlJzogJ0JVSUxEX0dFTkVSQUwxX1NNQUxMJyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCcubWV0cmljWHh4KCkgbWV0aG9kcyBjYW4gYmUgdXNlZCB0byBvYnRhaW4gTWV0cmljcyBmb3IgQ29kZUJ1aWxkIHByb2plY3RzJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICBjb25zdCBwcm9qZWN0ID0gbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlCdWlsZFByb2plY3QnLCB7XG4gICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgIGJ1Y2tldDogbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0JyksXG4gICAgICBwYXRoOiAncGF0aCcsXG4gICAgfSksXG4gIH0pO1xuXG4gIGNvbnN0IG1ldHJpY0J1aWxkcyA9IHByb2plY3QubWV0cmljQnVpbGRzKCk7XG4gIGV4cGVjdChtZXRyaWNCdWlsZHMuZGltZW5zaW9ucyEuUHJvamVjdE5hbWUpLnRvRXF1YWwocHJvamVjdC5wcm9qZWN0TmFtZSk7XG4gIGV4cGVjdChtZXRyaWNCdWlsZHMubmFtZXNwYWNlKS50b0VxdWFsKCdBV1MvQ29kZUJ1aWxkJyk7XG4gIGV4cGVjdChtZXRyaWNCdWlsZHMuc3RhdGlzdGljKS50b0VxdWFsKCdTdW0nKTtcbiAgZXhwZWN0KG1ldHJpY0J1aWxkcy5tZXRyaWNOYW1lKS50b0VxdWFsKCdCdWlsZHMnKTtcblxuICBjb25zdCBtZXRyaWNEdXJhdGlvbiA9IHByb2plY3QubWV0cmljRHVyYXRpb24oeyBsYWJlbDogJ2hlbGxvJyB9KTtcblxuICBleHBlY3QobWV0cmljRHVyYXRpb24ubWV0cmljTmFtZSkudG9FcXVhbCgnRHVyYXRpb24nKTtcbiAgZXhwZWN0KG1ldHJpY0R1cmF0aW9uLmxhYmVsKS50b0VxdWFsKCdoZWxsbycpO1xuXG4gIGV4cGVjdChwcm9qZWN0Lm1ldHJpY0ZhaWxlZEJ1aWxkcygpLm1ldHJpY05hbWUpLnRvRXF1YWwoJ0ZhaWxlZEJ1aWxkcycpO1xuICBleHBlY3QocHJvamVjdC5tZXRyaWNTdWNjZWVkZWRCdWlsZHMoKS5tZXRyaWNOYW1lKS50b0VxdWFsKCdTdWNjZWVkZWRCdWlsZHMnKTtcbn0pO1xuXG50ZXN0KCd1c2luZyBDb21wdXRlVHlwZS5TbWFsbCB3aXRoIGEgV2luZG93cyBpbWFnZSBmYWlscyB2YWxpZGF0aW9uJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgaW52YWxpZEVudmlyb25tZW50OiBjb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudCA9IHtcbiAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuV2luZG93c0J1aWxkSW1hZ2UuV0lORE9XU19CQVNFXzJfMCxcbiAgICBjb21wdXRlVHlwZTogY29kZWJ1aWxkLkNvbXB1dGVUeXBlLlNNQUxMLFxuICB9O1xuXG4gIGV4cGVjdCgoKSA9PiB7XG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnTXlQcm9qZWN0Jywge1xuICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgICAgYnVja2V0OiBuZXcgczMuQnVja2V0KHN0YWNrLCAnTXlCdWNrZXQnKSxcbiAgICAgICAgcGF0aDogJ3BhdGgnLFxuICAgICAgfSksXG4gICAgICBlbnZpcm9ubWVudDogaW52YWxpZEVudmlyb25tZW50LFxuICAgIH0pO1xuICB9KS50b1Rocm93KC9XaW5kb3dzIGltYWdlcyBkbyBub3Qgc3VwcG9ydCB0aGUgU21hbGwgQ29tcHV0ZVR5cGUvKTtcbn0pO1xuXG50ZXN0KCdmcm9tQ29kZWJ1aWxkSW1hZ2UnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuZnJvbUNvZGVCdWlsZEltYWdlSWQoJ2F3cy9jb2RlYnVpbGQvc3RhbmRhcmQ6NC4wJyksXG4gICAgfSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICdFbnZpcm9ubWVudCc6IHtcbiAgICAgICdJbWFnZSc6ICdhd3MvY29kZWJ1aWxkL3N0YW5kYXJkOjQuMCcsXG4gICAgfSxcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ1dpbmRvd3MyMDE5IGltYWdlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnV0lOX1NFUlZFUl9DT1JFXzIwMTZfQkFTRScsICgpID0+IHtcbiAgICB0ZXN0KCdoYXMgdHlwZSBXSU5ET1dTX1NFUlZFUl8yMDE5X0NPTlRBSU5FUiBhbmQgZGVmYXVsdCBDb21wdXRlVHlwZSBNRURJVU0nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuV2luZG93c0J1aWxkSW1hZ2UuV0lOX1NFUlZFUl9DT1JFXzIwMTlfQkFTRSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAgICdFbnZpcm9ubWVudCc6IHtcbiAgICAgICAgICAnVHlwZSc6ICdXSU5ET1dTX1NFUlZFUl8yMDE5X0NPTlRBSU5FUicsXG4gICAgICAgICAgJ0NvbXB1dGVUeXBlJzogJ0JVSUxEX0dFTkVSQUwxX01FRElVTScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ0FSTSBpbWFnZScsICgpID0+IHtcbiAgZGVzY3JpYmUoJ0FNQVpPTl9MSU5VWF8yX0FSTScsICgpID0+IHtcbiAgICB0ZXN0KCdoYXMgdHlwZSBBUk1fQ09OVEFJTkVSIGFuZCBkZWZhdWx0IENvbXB1dGVUeXBlIExBUkdFJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5BTUFaT05fTElOVVhfMl9BUk0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICAnRW52aXJvbm1lbnQnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVJNX0NPTlRBSU5FUicsXG4gICAgICAgICAgJ0NvbXB1dGVUeXBlJzogJ0JVSUxEX0dFTkVSQUwxX0xBUkdFJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIHVzZWQgd2l0aCBDb21wdXRlVHlwZSBTTUFMTCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIGNvbXB1dGVUeXBlOiBjb2RlYnVpbGQuQ29tcHV0ZVR5cGUuU01BTEwsXG4gICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5BTUFaT05fTElOVVhfMl9BUk0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICAnRW52aXJvbm1lbnQnOiB7XG4gICAgICAgICAgJ1R5cGUnOiAnQVJNX0NPTlRBSU5FUicsXG4gICAgICAgICAgJ0NvbXB1dGVUeXBlJzogJ0JVSUxEX0dFTkVSQUwxX1NNQUxMJyxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2Fubm90IGJlIHVzZWQgaW4gY29uanVuY3Rpb24gd2l0aCBDb21wdXRlVHlwZSBNRURJVU0nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhCdWlsZEltYWdlLkFNQVpPTl9MSU5VWF8yX0FSTSxcbiAgICAgICAgICAgIGNvbXB1dGVUeXBlOiBjb2RlYnVpbGQuQ29tcHV0ZVR5cGUuTUVESVVNLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvQVJNIGltYWdlcyBvbmx5IHN1cHBvcnQgQ29tcHV0ZVR5cGVzICdCVUlMRF9HRU5FUkFMMV9TTUFMTCcgYW5kICdCVUlMRF9HRU5FUkFMMV9MQVJHRScgLSAnQlVJTERfR0VORVJBTDFfTUVESVVNJyB3YXMgZ2l2ZW4vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBiZSB1c2VkIHdpdGggQ29tcHV0ZVR5cGUgTEFSR0UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgICBjb21wdXRlVHlwZTogY29kZWJ1aWxkLkNvbXB1dGVUeXBlLkxBUkdFLFxuICAgICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuQU1BWk9OX0xJTlVYXzJfQVJNLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgICAgJ0Vudmlyb25tZW50Jzoge1xuICAgICAgICAgICdUeXBlJzogJ0FSTV9DT05UQUlORVInLFxuICAgICAgICAgICdDb21wdXRlVHlwZSc6ICdCVUlMRF9HRU5FUkFMMV9MQVJHRScsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2Nhbm5vdCBiZSB1c2VkIGluIGNvbmp1bmN0aW9uIHdpdGggQ29tcHV0ZVR5cGUgWDJfTEFSR0UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhCdWlsZEltYWdlLkFNQVpPTl9MSU5VWF8yX0FSTSxcbiAgICAgICAgICAgIGNvbXB1dGVUeXBlOiBjb2RlYnVpbGQuQ29tcHV0ZVR5cGUuWDJfTEFSR0UsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9BUk0gaW1hZ2VzIG9ubHkgc3VwcG9ydCBDb21wdXRlVHlwZXMgJ0JVSUxEX0dFTkVSQUwxX1NNQUxMJyBhbmQgJ0JVSUxEX0dFTkVSQUwxX0xBUkdFJyAtICdCVUlMRF9HRU5FUkFMMV8yWExBUkdFJyB3YXMgZ2l2ZW4vKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxudGVzdCgnYmFkZ2Ugc3VwcG9ydCB0ZXN0JywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICBpbnRlcmZhY2UgQmFkZ2VWYWxpZGF0aW9uVGVzdENhc2Uge1xuICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZSxcbiAgICBhbGxvd3NCYWRnZTogYm9vbGVhblxuICB9XG5cbiAgY29uc3QgcmVwbyA9IG5ldyBjb2RlY29tbWl0LlJlcG9zaXRvcnkoc3RhY2ssICdNeVJlcG8nLCB7XG4gICAgcmVwb3NpdG9yeU5hbWU6ICdoZWxsby1jZGsnLFxuICB9KTtcbiAgY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jyk7XG5cbiAgY29uc3QgY2FzZXM6IEJhZGdlVmFsaWRhdGlvblRlc3RDYXNlW10gPSBbXG4gICAgeyBzb3VyY2U6IG5ldyBOb1NvdXJjZSgpLCBhbGxvd3NCYWRnZTogZmFsc2UgfSxcbiAgICB7IHNvdXJjZTogbmV3IENvZGVQaXBlbGluZVNvdXJjZSgpLCBhbGxvd3NCYWRnZTogZmFsc2UgfSxcbiAgICB7IHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5jb2RlQ29tbWl0KHsgcmVwb3NpdG9yeTogcmVwbyB9KSwgYWxsb3dzQmFkZ2U6IHRydWUgfSxcbiAgICB7IHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5zMyh7IGJ1Y2tldCwgcGF0aDogJ3BhdGgvdG8vc291cmNlLnppcCcgfSksIGFsbG93c0JhZGdlOiBmYWxzZSB9LFxuICAgIHsgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLmdpdEh1Yih7IG93bmVyOiAnYXdzbGFicycsIHJlcG86ICdhd3MtY2RrJyB9KSwgYWxsb3dzQmFkZ2U6IHRydWUgfSxcbiAgICB7IHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5naXRIdWJFbnRlcnByaXNlKHsgaHR0cHNDbG9uZVVybDogJ3VybCcgfSksIGFsbG93c0JhZGdlOiB0cnVlIH0sXG4gICAgeyBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuYml0QnVja2V0KHsgb3duZXI6ICdhd3NsYWJzJywgcmVwbzogJ2F3cy1jZGsnIH0pLCBhbGxvd3NCYWRnZTogdHJ1ZSB9LFxuICBdO1xuXG4gIGNhc2VzLmZvckVhY2godGVzdENhc2UgPT4ge1xuICAgIGNvbnN0IHNvdXJjZSA9IHRlc3RDYXNlLnNvdXJjZTtcbiAgICBjb25zdCB2YWxpZGF0aW9uQmxvY2sgPSAoKSA9PiB7IG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgYE15UHJvamVjdC0ke3NvdXJjZS50eXBlfWAsIHsgc291cmNlLCBiYWRnZTogdHJ1ZSB9KTsgfTtcbiAgICBpZiAodGVzdENhc2UuYWxsb3dzQmFkZ2UpIHtcbiAgICAgIGV4cGVjdCh2YWxpZGF0aW9uQmxvY2spLm5vdC50b1Rocm93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4cGVjdCh2YWxpZGF0aW9uQmxvY2spLnRvVGhyb3coL0JhZGdlIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHNvdXJjZSB0eXBlIC8pO1xuICAgIH1cbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ3dlYmhvb2sgRmlsdGVycycsICgpID0+IHtcbiAgdGVzdCgnYSBHcm91cCBjYW5ub3QgYmUgY3JlYXRlZCB3aXRoIGFuIGVtcHR5IHNldCBvZiBldmVudCBhY3Rpb25zJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBjb2RlYnVpbGQuRmlsdGVyR3JvdXAuaW5FdmVudE9mKCk7XG4gICAgfSkudG9UaHJvdygvQSBmaWx0ZXIgZ3JvdXAgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSBldmVudCBhY3Rpb24vKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2Fubm90IGhhdmUgYmFzZSByZWYgY29uZGl0aW9ucyBpZiB0aGUgR3JvdXAgY29udGFpbnMgdGhlIFBVU0ggYWN0aW9uJywgKCkgPT4ge1xuICAgIGNvbnN0IGZpbHRlckdyb3VwID0gY29kZWJ1aWxkLkZpbHRlckdyb3VwLmluRXZlbnRPZihjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVMTF9SRVFVRVNUX0NSRUFURUQsXG4gICAgICBjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVTSCk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgZmlsdGVyR3JvdXAuYW5kQmFzZVJlZklzKCcuKicpO1xuICAgIH0pLnRvVGhyb3coL0EgYmFzZSByZWZlcmVuY2UgY29uZGl0aW9uIGNhbm5vdCBiZSBhZGRlZCBpZiBhIEdyb3VwIGNvbnRhaW5zIGEgUFVTSCBldmVudCBhY3Rpb24vKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2Fubm90IGJlIHVzZWQgd2hlbiB3ZWJob29rIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5iaXRCdWNrZXQoe1xuICAgICAgICAgIG93bmVyOiAnb3duZXInLFxuICAgICAgICAgIHJlcG86ICdyZXBvJyxcbiAgICAgICAgICB3ZWJob29rOiBmYWxzZSxcbiAgICAgICAgICB3ZWJob29rRmlsdGVyczogW1xuICAgICAgICAgICAgY29kZWJ1aWxkLkZpbHRlckdyb3VwLmluRXZlbnRPZihjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVTSCksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9gd2ViaG9va0ZpbHRlcnNgIGNhbm5vdCBiZSB1c2VkIHdoZW4gYHdlYmhvb2tgIGlzIGBmYWxzZWAvKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGhhdmUgRklMRV9QQVRIIGZpbHRlcnMgaWYgdGhlIEdyb3VwIGNvbnRhaW5zIFBVU0ggYW5kIFBSX0NSRUFURUQgZXZlbnRzJywgKCkgPT4ge1xuICAgIGNvZGVidWlsZC5GaWx0ZXJHcm91cC5pbkV2ZW50T2YoXG4gICAgICBjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVMTF9SRVFVRVNUX0NSRUFURUQsXG4gICAgICBjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVTSClcbiAgICAgIC5hbmRGaWxlUGF0aElzTm90KCcuKlxcXFwuamF2YScpO1xuICB9KTtcblxuICB0ZXN0KCdCaXRCdWNrZXQgc291cmNlcyBkbyBub3Qgc3VwcG9ydCB0aGUgUFVMTF9SRVFVRVNUX1JFT1BFTkVEIGV2ZW50IGFjdGlvbicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuYml0QnVja2V0KHtcbiAgICAgICAgICBvd25lcjogJ293bmVyJyxcbiAgICAgICAgICByZXBvOiAncmVwbycsXG4gICAgICAgICAgd2ViaG9va0ZpbHRlcnM6IFtcbiAgICAgICAgICAgIGNvZGVidWlsZC5GaWx0ZXJHcm91cC5pbkV2ZW50T2YoY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVTExfUkVRVUVTVF9SRU9QRU5FRCksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9CaXRCdWNrZXQgc291cmNlcyBkbyBub3Qgc3VwcG9ydCB0aGUgUFVMTF9SRVFVRVNUX1JFT1BFTkVEIHdlYmhvb2sgZXZlbnQgYWN0aW9uLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0JpdEJ1Y2tldCBzb3VyY2VzIHN1cHBvcnQgZmlsZSBwYXRoIGNvbmRpdGlvbnMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgZmlsdGVyR3JvdXAgPSBjb2RlYnVpbGQuRmlsdGVyR3JvdXAuaW5FdmVudE9mKGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVVNIKS5hbmRGaWxlUGF0aElzKCcuKicpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5iaXRCdWNrZXQoe1xuICAgICAgICAgIG93bmVyOiAnb3duZXInLFxuICAgICAgICAgIHJlcG86ICdyZXBvJyxcbiAgICAgICAgICB3ZWJob29rRmlsdGVyczogW2ZpbHRlckdyb3VwXSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICB9KS5ub3QudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdHaXRIdWIgRW50ZXJwcmlzZSBTZXJ2ZXIgc291cmNlcyBkbyBub3Qgc3VwcG9ydCBGSUxFX1BBVEggZmlsdGVycyBvbiBQUiBldmVudHMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgcHVsbEZpbHRlckdyb3VwID0gY29kZWJ1aWxkLkZpbHRlckdyb3VwLmluRXZlbnRPZihcbiAgICAgIGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfQ1JFQVRFRCxcbiAgICAgIGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfTUVSR0VELFxuICAgICAgY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVTExfUkVRVUVTVF9SRU9QRU5FRCxcbiAgICAgIGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfVVBEQVRFRCxcbiAgICApO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015RmlsZVBhdGhQcm9qZWN0Jywge1xuICAgICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuZ2l0SHViRW50ZXJwcmlzZSh7XG4gICAgICAgICAgaHR0cHNDbG9uZVVybDogJ2h0dHBzOi8vZ2l0aHViLnRlc3Rjb21wYW55LmNvbS90ZXN0b3duZXIvdGVzdHJlcG8nLFxuICAgICAgICAgIHdlYmhvb2tGaWx0ZXJzOiBbXG4gICAgICAgICAgICBwdWxsRmlsdGVyR3JvdXAuYW5kRmlsZVBhdGhJcygnUmVhZE1lLm1kJyksXG4gICAgICAgICAgXSxcbiAgICAgICAgfSksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9GSUxFX1BBVEggZmlsdGVycyBjYW5ub3QgYmUgdXNlZCB3aXRoIEdpdEh1YiBFbnRlcnByaXNlIFNlcnZlciBwdWxsIHJlcXVlc3QgZXZlbnRzLyk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdDT01NSVRfTUVTU0FHRSBGaWx0ZXInLCAoKSA9PiB7XG4gICAgdGVzdCgnR2l0SHViIEVudGVycHJpc2UgU2VydmVyIHNvdXJjZXMgZG8gbm90IHN1cHBvcnQgQ09NTUlUX01FU1NBR0UgZmlsdGVycyBvbiBQUiBldmVudHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHB1bGxGaWx0ZXJHcm91cCA9IGNvZGVidWlsZC5GaWx0ZXJHcm91cC5pbkV2ZW50T2YoXG4gICAgICAgIGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfQ1JFQVRFRCxcbiAgICAgICAgY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVTExfUkVRVUVTVF9NRVJHRUQsXG4gICAgICAgIGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfUkVPUEVORUQsXG4gICAgICAgIGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVUxMX1JFUVVFU1RfVVBEQVRFRCxcbiAgICAgICk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ015UHJvamVjdCcsIHtcbiAgICAgICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuZ2l0SHViRW50ZXJwcmlzZSh7XG4gICAgICAgICAgICBodHRwc0Nsb25lVXJsOiAnaHR0cHM6Ly9naXRodWIudGVzdGNvbXBhbnkuY29tL3Rlc3Rvd25lci90ZXN0cmVwbycsXG4gICAgICAgICAgICB3ZWJob29rRmlsdGVyczogW1xuICAgICAgICAgICAgICBwdWxsRmlsdGVyR3JvdXAuYW5kQ29tbWl0TWVzc2FnZUlzKCd0aGUgY29tbWl0IG1lc3NhZ2UnKSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pO1xuICAgICAgfSkudG9UaHJvdygvQ09NTUlUX01FU1NBR0UgZmlsdGVycyBjYW5ub3QgYmUgdXNlZCB3aXRoIEdpdEh1YiBFbnRlcnByaXNlIFNlcnZlciBwdWxsIHJlcXVlc3QgZXZlbnRzLyk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdHaXRIdWIgRW50ZXJwcmlzZSBTZXJ2ZXIgc291cmNlcyBzdXBwb3J0IENPTU1JVF9NRVNTQUdFIGZpbHRlcnMgb24gUFVTSCBldmVudHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHB1c2hGaWx0ZXJHcm91cCA9IGNvZGVidWlsZC5GaWx0ZXJHcm91cC5pbkV2ZW50T2YoY29kZWJ1aWxkLkV2ZW50QWN0aW9uLlBVU0gpO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdNeVByb2plY3QnLCB7XG4gICAgICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLmdpdEh1YkVudGVycHJpc2Uoe1xuICAgICAgICAgICAgaHR0cHNDbG9uZVVybDogJ2h0dHBzOi8vZ2l0aHViLnRlc3Rjb21wYW55LmNvbS90ZXN0b3duZXIvdGVzdHJlcG8nLFxuICAgICAgICAgICAgd2ViaG9va0ZpbHRlcnM6IFtcbiAgICAgICAgICAgICAgcHVzaEZpbHRlckdyb3VwLmFuZENvbW1pdE1lc3NhZ2VJcygndGhlIGNvbW1pdCBtZXNzYWdlJyksXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KTtcbiAgICAgIH0pLm5vdC50b1Rocm93KCk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdCaXRCdWNrZXQgYW5kIEdpdEh1YiBzb3VyY2VzIHN1cHBvcnQgYSBDT01NSVRfTUVTU0FHRSBmaWx0ZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IGZpbHRlckdyb3VwID0gY29kZWJ1aWxkXG4gICAgICAgIC5GaWx0ZXJHcm91cFxuICAgICAgICAuaW5FdmVudE9mKGNvZGVidWlsZC5FdmVudEFjdGlvbi5QVVNILCBjb2RlYnVpbGQuRXZlbnRBY3Rpb24uUFVMTF9SRVFVRVNUX0NSRUFURUQpXG4gICAgICAgIC5hbmRDb21taXRNZXNzYWdlSXMoJ3RoZSBjb21taXQgbWVzc2FnZScpO1xuXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdCaXRCdWNrZXQgUHJvamVjdCcsIHtcbiAgICAgICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuYml0QnVja2V0KHtcbiAgICAgICAgICAgIG93bmVyOiAnb3duZXInLFxuICAgICAgICAgICAgcmVwbzogJ3JlcG8nLFxuICAgICAgICAgICAgd2ViaG9va0ZpbHRlcnM6IFtmaWx0ZXJHcm91cF0sXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pO1xuICAgICAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdHaXRIdWIgUHJvamVjdCcsIHtcbiAgICAgICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuZ2l0SHViKHtcbiAgICAgICAgICAgIG93bmVyOiAnb3duZXInLFxuICAgICAgICAgICAgcmVwbzogJ3JlcG8nLFxuICAgICAgICAgICAgd2ViaG9va0ZpbHRlcnM6IFtmaWx0ZXJHcm91cF0sXG4gICAgICAgICAgfSksXG4gICAgICAgIH0pO1xuICAgICAgfSkubm90LnRvVGhyb3coKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxudGVzdCgnZW5hYmxlQmF0Y2hCdWlsZHMoKScsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLmdpdEh1Yih7XG4gICAgICBvd25lcjogJ3Rlc3Rvd25lcicsXG4gICAgICByZXBvOiAndGVzdHJlcG8nLFxuICAgIH0pLFxuICB9KTtcblxuICBjb25zdCByZXR1cm5WYWwgPSBwcm9qZWN0LmVuYWJsZUJhdGNoQnVpbGRzKCk7XG4gIGlmICghcmV0dXJuVmFsPy5yb2xlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RpbmcgcmV0dXJuIHZhbHVlIHdpdGggcm9sZScpO1xuICB9XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgIEJ1aWxkQmF0Y2hDb25maWc6IHtcbiAgICAgIFNlcnZpY2VSb2xlOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdQcm9qZWN0QmF0Y2hTZXJ2aWNlUm9sZUY5N0ExQ0ZCJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgU2VydmljZTogJ2NvZGVidWlsZC5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdjb2RlYnVpbGQ6U3RhcnRCdWlsZCcsXG4gICAgICAgICAgICAnY29kZWJ1aWxkOlN0b3BCdWlsZCcsXG4gICAgICAgICAgICAnY29kZWJ1aWxkOlJldHJ5QnVpbGQnLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ1Byb2plY3RDNzhEOTdBRCcsXG4gICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuIl19