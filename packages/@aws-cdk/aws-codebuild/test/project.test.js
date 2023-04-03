"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const logs = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const secretsmanager = require("@aws-cdk/aws-secretsmanager");
const cdk = require("@aws-cdk/core");
const codebuild = require("../lib");
/* eslint-disable quote-props */
test('can use filename as buildspec', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new codebuild.Project(stack, 'Project', {
        source: codebuild.Source.s3({
            bucket: new s3.Bucket(stack, 'Bucket'),
            path: 'path',
        }),
        buildSpec: codebuild.BuildSpec.fromSourceFilename('hello.yml'),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Source: {
            BuildSpec: 'hello.yml',
        },
    });
});
test('can use buildspec literal', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new codebuild.Project(stack, 'Project', {
        buildSpec: codebuild.BuildSpec.fromObject({ phases: ['say hi'] }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Source: {
            BuildSpec: '{\n  "phases": [\n    "say hi"\n  ]\n}',
        },
    });
});
test('can use yamlbuildspec literal', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new codebuild.Project(stack, 'Project', {
        buildSpec: codebuild.BuildSpec.fromObjectToYaml({
            text: 'text',
            decimal: 10,
            list: ['say hi'],
            obj: {
                text: 'text',
                decimal: 10,
                list: ['say hi'],
            },
        }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
        Source: {
            BuildSpec: 'text: text\ndecimal: 10\nlist:\n  - say hi\nobj:\n  text: text\n  decimal: 10\n  list:\n    - say hi\n',
        },
    });
});
test('must supply buildspec when using nosource', () => {
    // GIVEN
    const stack = new cdk.Stack();
    expect(() => {
        new codebuild.Project(stack, 'Project', {});
    }).toThrow(/you need to provide a concrete buildSpec/);
});
test('must supply literal buildspec when using nosource', () => {
    // GIVEN
    const stack = new cdk.Stack();
    expect(() => {
        new codebuild.Project(stack, 'Project', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename('bla.yml'),
        });
    }).toThrow(/you need to provide a concrete buildSpec/);
});
describe('GitHub source', () => {
    test('has reportBuildStatus on by default', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.gitHub({
                owner: 'testowner',
                repo: 'testrepo',
                cloneDepth: 3,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Source: {
                Type: 'GITHUB',
                Location: 'https://github.com/testowner/testrepo.git',
                ReportBuildStatus: true,
                GitCloneDepth: 3,
            },
        });
    });
    test('can set a branch as the SourceVersion', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.gitHub({
                owner: 'testowner',
                repo: 'testrepo',
                branchOrRef: 'testbranch',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            SourceVersion: 'testbranch',
        });
    });
    test('can explicitly set reportBuildStatus to false', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.gitHub({
                owner: 'testowner',
                repo: 'testrepo',
                reportBuildStatus: false,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Source: {
                ReportBuildStatus: false,
            },
        });
    });
    test('can explicitly set webhook to true', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.gitHub({
                owner: 'testowner',
                repo: 'testrepo',
                webhook: true,
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Triggers: {
                Webhook: true,
            },
        });
    });
    test('can be added to a CodePipeline', () => {
        const stack = new cdk.Stack();
        const project = new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.gitHub({
                owner: 'testowner',
                repo: 'testrepo',
            }),
        });
        expect(() => {
            project.bindToCodePipeline(project, {
                artifactBucket: new s3.Bucket(stack, 'Bucket'),
            });
        }).not.toThrow(); // no exception
    });
    test('can provide credentials to use with the source', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.GitHubSourceCredentials(stack, 'GitHubSourceCredentials', {
            accessToken: cdk.SecretValue.unsafePlainText('my-access-token'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::SourceCredential', {
            'ServerType': 'GITHUB',
            'AuthType': 'PERSONAL_ACCESS_TOKEN',
            'Token': 'my-access-token',
        });
    });
});
describe('GitHub Enterprise source', () => {
    test('can use branchOrRef to set the source version', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.gitHubEnterprise({
                httpsCloneUrl: 'https://mygithub-enterprise.com/myuser/myrepo',
                branchOrRef: 'testbranch',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            SourceVersion: 'testbranch',
        });
    });
    test('can provide credentials to use with the source', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.GitHubEnterpriseSourceCredentials(stack, 'GitHubEnterpriseSourceCredentials', {
            accessToken: cdk.SecretValue.unsafePlainText('my-access-token'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::SourceCredential', {
            'ServerType': 'GITHUB_ENTERPRISE',
            'AuthType': 'PERSONAL_ACCESS_TOKEN',
            'Token': 'my-access-token',
        });
    });
});
describe('BitBucket source', () => {
    test('can use branchOrRef to set the source version', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.bitBucket({
                owner: 'testowner',
                repo: 'testrepo',
                branchOrRef: 'testbranch',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            SourceVersion: 'testbranch',
        });
    });
    test('can provide credentials to use with the source', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.BitBucketSourceCredentials(stack, 'BitBucketSourceCredentials', {
            username: cdk.SecretValue.unsafePlainText('my-username'),
            password: cdk.SecretValue.unsafePlainText('password'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::SourceCredential', {
            'ServerType': 'BITBUCKET',
            'AuthType': 'BASIC_AUTH',
            'Username': 'my-username',
            'Token': 'password',
        });
    });
});
describe('caching', () => {
    test('using Cache.none() results in NO_CACHE in the template', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.PipelineProject(stack, 'Project', {
            cache: codebuild.Cache.none(),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Cache: {
                Type: 'NO_CACHE',
                Location: assertions_1.Match.absent(),
            },
        });
    });
    test('project with s3 cache bucket', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'SourceBucket'),
                path: 'path',
            }),
            cache: codebuild.Cache.bucket(new s3.Bucket(stack, 'Bucket'), {
                prefix: 'cache-prefix',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Cache: {
                Type: 'S3',
                Location: {
                    'Fn::Join': [
                        '/',
                        [
                            {
                                'Ref': 'Bucket83908E77',
                            },
                            'cache-prefix',
                        ],
                    ],
                },
            },
        });
    });
    test('s3 codebuild project with sourceVersion', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'Bucket'),
                path: 'path',
                version: 's3version',
            }),
            cache: codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM, codebuild.LocalCacheMode.DOCKER_LAYER, codebuild.LocalCacheMode.SOURCE),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            SourceVersion: 's3version',
        });
    });
    test('project with local cache modes', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'Bucket'),
                path: 'path',
            }),
            cache: codebuild.Cache.local(codebuild.LocalCacheMode.CUSTOM, codebuild.LocalCacheMode.DOCKER_LAYER, codebuild.LocalCacheMode.SOURCE),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Cache: {
                Type: 'LOCAL',
                Modes: [
                    'LOCAL_CUSTOM_CACHE',
                    'LOCAL_DOCKER_LAYER_CACHE',
                    'LOCAL_SOURCE_CACHE',
                ],
            },
        });
    });
    test('project by default has cache type set to NO_CACHE', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'Bucket'),
                path: 'path',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Cache: {
                Type: 'NO_CACHE',
                Location: assertions_1.Match.absent(),
            },
        });
    });
});
test('if a role is shared between projects in a VPC, the VPC Policy is only attached once', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });
    const source = codebuild.Source.gitHubEnterprise({
        httpsCloneUrl: 'https://mygithub-enterprise.com/myuser/myrepo',
    });
    // WHEN
    new codebuild.Project(stack, 'Project1', { source, role, vpc, projectName: 'P1' });
    new codebuild.Project(stack, 'Project2', { source, role, vpc, projectName: 'P2' });
    // THEN
    // - 1 is for `ec2:CreateNetworkInterfacePermission`, deduplicated as they're part of a single policy
    // - 1 is for `ec2:CreateNetworkInterface`, this is the separate Policy we're deduplicating
    // We would have found 3 if the deduplication didn't work.
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 2);
    // THEN - both Projects have a DependsOn on the same policy
    assertions_1.Template.fromStack(stack).hasResource('AWS::CodeBuild::Project', {
        Properties: { Name: 'P1' },
        DependsOn: ['Project1PolicyDocumentF9761562'],
    });
    assertions_1.Template.fromStack(stack).hasResource('AWS::CodeBuild::Project', {
        Properties: { Name: 'P1' },
        DependsOn: ['Project1PolicyDocumentF9761562'],
    });
});
test('can use an imported Role for a Project within a VPC', () => {
    const stack = new cdk.Stack();
    const importedRole = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::1234567890:role/service-role/codebuild-bruiser-service-role');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    new codebuild.Project(stack, 'Project', {
        source: codebuild.Source.gitHubEnterprise({
            httpsCloneUrl: 'https://mygithub-enterprise.com/myuser/myrepo',
        }),
        role: importedRole,
        vpc,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
    // no need to do any assertions
    });
});
test('can use an imported Role with mutable = false for a Project within a VPC', () => {
    const stack = new cdk.Stack();
    const importedRole = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::1234567890:role/service-role/codebuild-bruiser-service-role', {
        mutable: false,
    });
    const vpc = new ec2.Vpc(stack, 'Vpc');
    new codebuild.Project(stack, 'Project', {
        source: codebuild.Source.gitHubEnterprise({
            httpsCloneUrl: 'https://mygithub-enterprise.com/myuser/myrepo',
        }),
        role: importedRole,
        vpc,
    });
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
    // Check that the CodeBuild project does not have a DependsOn
    assertions_1.Template.fromStack(stack).hasResource('AWS::CodeBuild::Project', (res) => {
        if (res.DependsOn && res.DependsOn.length > 0) {
            throw new Error(`CodeBuild project should have no DependsOn, but got: ${JSON.stringify(res, undefined, 2)}`);
        }
        return true;
    });
});
test('can use an ImmutableRole for a Project within a VPC', () => {
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });
    const vpc = new ec2.Vpc(stack, 'Vpc');
    new codebuild.Project(stack, 'Project', {
        source: codebuild.Source.gitHubEnterprise({
            httpsCloneUrl: 'https://mygithub-enterprise.com/myuser/myrepo',
        }),
        role: role.withoutPolicyUpdates(),
        vpc,
    });
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
    // Check that the CodeBuild project does not have a DependsOn
    assertions_1.Template.fromStack(stack).hasResource('AWS::CodeBuild::Project', (res) => {
        if (res.DependsOn && res.DependsOn.length > 0) {
            throw new Error(`CodeBuild project should have no DependsOn, but got: ${JSON.stringify(res, undefined, 2)}`);
        }
        return true;
    });
});
test('metric method generates a valid CloudWatch metric', () => {
    const stack = new cdk.Stack();
    const project = new codebuild.Project(stack, 'Project', {
        source: codebuild.Source.gitHubEnterprise({
            httpsCloneUrl: 'https://mygithub-enterprise.com/myuser/myrepo',
        }),
    });
    const metric = project.metric('Builds');
    expect(metric.metricName).toEqual('Builds');
    expect(metric.period.toSeconds()).toEqual(cdk.Duration.minutes(5).toSeconds());
    expect(metric.statistic).toEqual('Average');
});
describe('CodeBuild test reports group', () => {
    test('adds the appropriate permissions when reportGroup.grantWrite() is called', () => {
        const stack = new cdk.Stack();
        const reportGroup = new codebuild.ReportGroup(stack, 'ReportGroup');
        const project = new codebuild.Project(stack, 'Project', {
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                reports: {
                    [reportGroup.reportGroupArn]: {
                        files: '**/*',
                    },
                },
            }),
            grantReportGroupPermissions: false,
        });
        reportGroup.grantWrite(project);
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
            'PolicyDocument': {
                'Statement': [
                    {},
                    {
                        'Action': [
                            'codebuild:CreateReport',
                            'codebuild:UpdateReport',
                            'codebuild:BatchPutTestCases',
                        ],
                        'Resource': {
                            'Fn::GetAtt': [
                                'ReportGroup8A84C76D',
                                'Arn',
                            ],
                        },
                    },
                ],
            },
        });
    });
});
describe('Environment', () => {
    test('build image - can use secret to access build image', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const secret = new secretsmanager.Secret(stack, 'Secret');
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'Bucket'),
                path: 'path',
            }),
            environment: {
                buildImage: codebuild.LinuxBuildImage.fromDockerRegistry('myimage', { secretsManagerCredentials: secret }),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Environment: assertions_1.Match.objectLike({
                RegistryCredential: {
                    CredentialProvider: 'SECRETS_MANAGER',
                    Credential: { 'Ref': 'SecretA720EF05' },
                },
            }),
        });
    });
    test('build image - can use imported secret by name', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const secret = secretsmanager.Secret.fromSecretNameV2(stack, 'Secret', 'MySecretName');
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'Bucket'),
                path: 'path',
            }),
            environment: {
                buildImage: codebuild.LinuxBuildImage.fromDockerRegistry('myimage', { secretsManagerCredentials: secret }),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Environment: assertions_1.Match.objectLike({
                RegistryCredential: {
                    CredentialProvider: 'SECRETS_MANAGER',
                    Credential: 'MySecretName',
                },
            }),
        });
    });
    test('logs config - cloudWatch', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const logGroup = logs.LogGroup.fromLogGroupName(stack, 'LogGroup', 'MyLogGroupName');
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'Bucket'),
                path: 'path',
            }),
            logging: {
                cloudWatch: {
                    logGroup,
                    prefix: '/my-logs',
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            LogsConfig: assertions_1.Match.objectLike({
                CloudWatchLogs: {
                    GroupName: 'MyLogGroupName',
                    Status: 'ENABLED',
                    StreamName: '/my-logs',
                },
            }),
        });
    });
    test('logs config - cloudWatch disabled', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'Bucket'),
                path: 'path',
            }),
            logging: {
                cloudWatch: {
                    enabled: false,
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            LogsConfig: assertions_1.Match.objectLike({
                CloudWatchLogs: {
                    Status: 'DISABLED',
                },
            }),
        });
    });
    test('logs config - s3', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const bucket = s3.Bucket.fromBucketName(stack, 'LogBucket', 'mybucketname');
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'Bucket'),
                path: 'path',
            }),
            logging: {
                s3: {
                    bucket,
                    prefix: 'my-logs',
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            LogsConfig: assertions_1.Match.objectLike({
                S3Logs: {
                    Location: 'mybucketname/my-logs',
                    Status: 'ENABLED',
                },
            }),
        });
    });
    test('logs config - cloudWatch and s3', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const bucket = s3.Bucket.fromBucketName(stack, 'LogBucket2', 'mybucketname');
        const logGroup = logs.LogGroup.fromLogGroupName(stack, 'LogGroup2', 'MyLogGroupName');
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'Bucket'),
                path: 'path',
            }),
            logging: {
                cloudWatch: {
                    logGroup,
                },
                s3: {
                    bucket,
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            LogsConfig: assertions_1.Match.objectLike({
                CloudWatchLogs: {
                    GroupName: 'MyLogGroupName',
                    Status: 'ENABLED',
                },
                S3Logs: {
                    Location: 'mybucketname',
                    Status: 'ENABLED',
                },
            }),
        });
    });
    test('certificate arn', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'my-bucket'); // (stack, 'Bucket');
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket,
                path: 'path',
            }),
            environment: {
                certificate: {
                    bucket,
                    objectKey: 'path',
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Environment: assertions_1.Match.objectLike({
                Certificate: {
                    'Fn::Join': ['', [
                            'arn:',
                            { 'Ref': 'AWS::Partition' },
                            ':s3:::my-bucket/path',
                        ]],
                },
            }),
        });
    });
    test.each([
        ['Standard 6.0', codebuild.LinuxBuildImage.STANDARD_6_0, 'aws/codebuild/standard:6.0'],
        ['Amazon Linux 4.0', codebuild.LinuxBuildImage.AMAZON_LINUX_2_4, 'aws/codebuild/amazonlinux2-x86_64-standard:4.0'],
        ['Windows Server Core 2019 2.0', codebuild.WindowsBuildImage.WIN_SERVER_CORE_2019_BASE_2_0, 'aws/codebuild/windows-base:2019-2.0'],
    ])('has build image for %s', (_, buildImage, expected) => {
        // GIVEN
        const stack = new cdk.Stack();
        const bucket = s3.Bucket.fromBucketName(stack, 'Bucket', 'my-bucket'); // (stack, 'Bucket');
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket,
                path: 'path',
            }),
            environment: {
                buildImage: buildImage,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            Environment: assertions_1.Match.objectLike({
                Image: expected,
            }),
        });
    });
});
describe('EnvironmentVariables', () => {
    describe('from SSM', () => {
        test('can use environment variables', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new codebuild.Project(stack, 'Project', {
                source: codebuild.Source.s3({
                    bucket: new s3.Bucket(stack, 'Bucket'),
                    path: 'path',
                }),
                environment: {
                    buildImage: codebuild.LinuxBuildImage.fromDockerRegistry('myimage'),
                },
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
                        value: '/params/param1',
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                Environment: assertions_1.Match.objectLike({
                    EnvironmentVariables: [{
                            Name: 'ENV_VAR1',
                            Type: 'PARAMETER_STORE',
                            Value: '/params/param1',
                        }],
                }),
            });
        });
        test('grants the correct read permissions', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new codebuild.Project(stack, 'Project', {
                source: codebuild.Source.s3({
                    bucket: new s3.Bucket(stack, 'Bucket'),
                    path: 'path',
                }),
                environment: {
                    buildImage: codebuild.LinuxBuildImage.fromDockerRegistry('myimage'),
                },
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
                        value: '/params/param1',
                    },
                    'ENV_VAR2': {
                        type: codebuild.BuildEnvironmentVariableType.PARAMETER_STORE,
                        value: 'params/param2',
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([assertions_1.Match.objectLike({
                            'Action': 'ssm:GetParameters',
                            'Effect': 'Allow',
                            'Resource': [{
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
                                            ':parameter/params/param1',
                                        ],
                                    ],
                                },
                                {
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
                                            ':parameter/params/param2',
                                        ],
                                    ],
                                }],
                        })]),
                },
            });
        });
        test('does not grant read permissions when variables are not from parameter store', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new codebuild.Project(stack, 'Project', {
                source: codebuild.Source.s3({
                    bucket: new s3.Bucket(stack, 'Bucket'),
                    path: 'path',
                }),
                environment: {
                    buildImage: codebuild.LinuxBuildImage.fromDockerRegistry('myimage'),
                },
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
                        value: 'var1-value',
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', assertions_1.Match.not({
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([assertions_1.Match.objectLike({
                            'Action': 'ssm:GetParameters',
                            'Effect': 'Allow',
                        })]),
                },
            }));
        });
    });
    describe('from SecretsManager', () => {
        test('can be provided as a verbatim secret name', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: 'my-secret',
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': 'my-secret',
                        },
                    ],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':secretsmanager:',
                                        { Ref: 'AWS::Region' },
                                        ':',
                                        { Ref: 'AWS::AccountId' },
                                        ':secret:my-secret-??????',
                                    ]],
                            },
                        }]),
                },
            });
        });
        test('can be provided as a verbatim secret name followed by a JSON key', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: 'my-secret:json-key',
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': 'my-secret:json-key',
                        },
                    ],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { Ref: 'AWS::Partition' },
                                        ':secretsmanager:',
                                        { Ref: 'AWS::Region' },
                                        ':',
                                        { Ref: 'AWS::AccountId' },
                                        ':secret:my-secret-??????',
                                    ]],
                            },
                        }]),
                },
            });
        });
        test('can be provided as a verbatim full secret ARN followed by a JSON key', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: 'arn:aws:secretsmanager:us-west-2:123456789012:secret:my-secret-123456:json-key',
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': 'arn:aws:secretsmanager:us-west-2:123456789012:secret:my-secret-123456:json-key',
                        },
                    ],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': 'arn:aws:secretsmanager:us-west-2:123456789012:secret:my-secret-123456*',
                        }]),
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', assertions_1.Match.not({
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'kms:Decrypt',
                            'Effect': 'Allow',
                            'Resource': 'arn:aws:kms:us-west-2:123456789012:key/*',
                        }]),
                },
            }));
        });
        test('can be provided as a verbatim partial secret ARN', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: 'arn:aws:secretsmanager:us-west-2:123456789012:secret:mysecret',
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': 'arn:aws:secretsmanager:us-west-2:123456789012:secret:mysecret',
                        },
                    ],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': 'arn:aws:secretsmanager:us-west-2:123456789012:secret:mysecret*',
                        }]),
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', assertions_1.Match.not({
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'kms:Decrypt',
                            'Effect': 'Allow',
                            'Resource': 'arn:aws:kms:us-west-2:123456789012:key/*',
                        }]),
                },
            }));
        });
        test("when provided as a verbatim partial secret ARN from another account, adds permission to decrypt keys in the Secret's account", () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'ProjectStack', {
                env: { account: '123456789012' },
            });
            // WHEN
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: 'arn:aws:secretsmanager:us-west-2:901234567890:secret:mysecret',
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'kms:Decrypt',
                            'Effect': 'Allow',
                            'Resource': 'arn:aws:kms:us-west-2:901234567890:key/*',
                        }]),
                },
            });
        });
        test('when two secrets from another account are provided as verbatim partial secret ARNs, adds only one permission for decrypting', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'ProjectStack', {
                env: { account: '123456789012' },
            });
            // WHEN
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: 'arn:aws:secretsmanager:us-west-2:901234567890:secret:mysecret',
                    },
                    'ENV_VAR2': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: 'arn:aws:secretsmanager:us-west-2:901234567890:secret:other-secret',
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'kms:Decrypt',
                            'Effect': 'Allow',
                            'Resource': 'arn:aws:kms:us-west-2:901234567890:key/*',
                        }]),
                },
            });
        });
        test('can be provided as the ARN attribute of a new Secret', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const secret = new secretsmanager.Secret(stack, 'Secret');
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: secret.secretArn,
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': { 'Ref': 'SecretA720EF05' },
                        },
                    ],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': { 'Ref': 'SecretA720EF05' },
                        }]),
                },
            });
        });
        test('when the same new secret is provided with different JSON keys, only adds the resource once', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const secret = new secretsmanager.Secret(stack, 'Secret');
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: `${secret.secretArn}:json-key1`,
                    },
                    'ENV_VAR2': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: `${secret.secretArn}:json-key2`,
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': { 'Fn::Join': ['', [{ 'Ref': 'SecretA720EF05' }, ':json-key1']] },
                        },
                        {
                            'Name': 'ENV_VAR2',
                            'Type': 'SECRETS_MANAGER',
                            'Value': { 'Fn::Join': ['', [{ 'Ref': 'SecretA720EF05' }, ':json-key2']] },
                        },
                    ],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': { 'Ref': 'SecretA720EF05' },
                        }]),
                },
            });
        });
        test('can be provided as the ARN attribute of a new Secret, followed by a JSON key', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const secret = new secretsmanager.Secret(stack, 'Secret');
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: `${secret.secretArn}:json-key:version-stage`,
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': {
                                'Fn::Join': ['', [
                                        { 'Ref': 'SecretA720EF05' },
                                        ':json-key:version-stage',
                                    ]],
                            },
                        },
                    ],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': { 'Ref': 'SecretA720EF05' },
                        }]),
                },
            });
        });
        test('can be provided as the name attribute of a Secret imported by name', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const secret = secretsmanager.Secret.fromSecretNameV2(stack, 'Secret', 'mysecret');
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: secret.secretName,
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': 'mysecret',
                        },
                    ],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { 'Ref': 'AWS::Partition' },
                                        ':secretsmanager:',
                                        { 'Ref': 'AWS::Region' },
                                        ':',
                                        { 'Ref': 'AWS::AccountId' },
                                        ':secret:mysecret-??????',
                                    ]],
                            },
                        }]),
                },
            });
        });
        test('can be provided as the ARN attribute of a Secret imported by partial ARN, followed by a JSON key', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const secret = secretsmanager.Secret.fromSecretPartialArn(stack, 'Secret', 'arn:aws:secretsmanager:us-west-2:123456789012:secret:mysecret');
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: `${secret.secretArn}:json-key`,
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': 'arn:aws:secretsmanager:us-west-2:123456789012:secret:mysecret:json-key',
                        },
                    ],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': 'arn:aws:secretsmanager:us-west-2:123456789012:secret:mysecret*',
                        }]),
                },
            });
        });
        test('can be provided as the ARN attribute of a Secret imported by complete ARN, followed by a JSON key', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            const secret = secretsmanager.Secret.fromSecretCompleteArn(stack, 'Secret', 'arn:aws:secretsmanager:us-west-2:123456789012:secret:mysecret-123456');
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: `${secret.secretArn}:json-key`,
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': 'arn:aws:secretsmanager:us-west-2:123456789012:secret:mysecret-123456:json-key',
                        },
                    ],
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': 'arn:aws:secretsmanager:us-west-2:123456789012:secret:mysecret-123456*',
                        }]),
                },
            });
        });
        test('can be provided as a SecretArn of a new Secret, with its physical name set, created in a different account', () => {
            // GIVEN
            const app = new cdk.App();
            const secretStack = new cdk.Stack(app, 'SecretStack', {
                env: { account: '012345678912' },
            });
            const stack = new cdk.Stack(app, 'ProjectStack', {
                env: { account: '123456789012' },
            });
            // WHEN
            const secret = new secretsmanager.Secret(secretStack, 'Secret', { secretName: 'secret-name' });
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: secret.secretArn,
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { 'Ref': 'AWS::Partition' },
                                        ':secretsmanager:',
                                        { 'Ref': 'AWS::Region' },
                                        ':012345678912:secret:secret-name',
                                    ]],
                            },
                        },
                    ],
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { 'Ref': 'AWS::Partition' },
                                        ':secretsmanager:',
                                        { 'Ref': 'AWS::Region' },
                                        ':012345678912:secret:secret-name-??????',
                                    ]],
                            },
                        }]),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'kms:Decrypt',
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { 'Ref': 'AWS::Partition' },
                                        ':kms:',
                                        { 'Ref': 'AWS::Region' },
                                        ':012345678912:key/*',
                                    ]],
                            },
                        }]),
                },
            });
        });
        test('can be provided as a SecretArn of a Secret imported by name in a different account', () => {
            // GIVEN
            const app = new cdk.App();
            const secretStack = new cdk.Stack(app, 'SecretStack', {
                env: { account: '012345678912' },
            });
            const stack = new cdk.Stack(app, 'ProjectStack', {
                env: { account: '123456789012' },
            });
            // WHEN
            const secret = secretsmanager.Secret.fromSecretNameV2(secretStack, 'Secret', 'secret-name');
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: `${secret.secretArn}:json-key`,
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { 'Ref': 'AWS::Partition' },
                                        ':secretsmanager:',
                                        { 'Ref': 'AWS::Region' },
                                        ':012345678912:secret:secret-name:json-key',
                                    ]],
                            },
                        },
                    ],
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { 'Ref': 'AWS::Partition' },
                                        ':secretsmanager:',
                                        { 'Ref': 'AWS::Region' },
                                        ':012345678912:secret:secret-name*',
                                    ]],
                            },
                        }]),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'kms:Decrypt',
                            'Effect': 'Allow',
                            'Resource': {
                                'Fn::Join': ['', [
                                        'arn:',
                                        { 'Ref': 'AWS::Partition' },
                                        ':kms:',
                                        { 'Ref': 'AWS::Region' },
                                        ':012345678912:key/*',
                                    ]],
                            },
                        }]),
                },
            });
        });
        test('can be provided as a SecretArn of a Secret imported by complete ARN from a different account', () => {
            // GIVEN
            const app = new cdk.App();
            const stack = new cdk.Stack(app, 'ProjectStack', {
                env: { account: '123456789012' },
            });
            const secretArn = 'arn:aws:secretsmanager:us-west-2:901234567890:secret:mysecret-123456';
            // WHEN
            const secret = secretsmanager.Secret.fromSecretCompleteArn(stack, 'Secret', secretArn);
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'ENV_VAR1': {
                        type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                        value: secret.secretArn,
                    },
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
                'Environment': {
                    'EnvironmentVariables': [
                        {
                            'Name': 'ENV_VAR1',
                            'Type': 'SECRETS_MANAGER',
                            'Value': secretArn,
                        },
                    ],
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'secretsmanager:GetSecretValue',
                            'Effect': 'Allow',
                            'Resource': `${secretArn}*`,
                        }]),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
                'PolicyDocument': {
                    'Statement': assertions_1.Match.arrayWith([{
                            'Action': 'kms:Decrypt',
                            'Effect': 'Allow',
                            'Resource': 'arn:aws:kms:us-west-2:901234567890:key/*',
                        }]),
                },
            });
        });
        test('should fail when the parsed Arn does not contain a secret name', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            expect(() => {
                new codebuild.PipelineProject(stack, 'Project', {
                    environmentVariables: {
                        'ENV_VAR1': {
                            type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
                            value: 'arn:aws:secretsmanager:us-west-2:123456789012:secret',
                        },
                    },
                });
            }).toThrow(/SecretManager ARN is missing the name of the secret:/);
        });
    });
    test('should fail creating when using a secret value in a plaintext variable', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // THEN
        expect(() => {
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'a': {
                        value: `a_${cdk.SecretValue.secretsManager('my-secret')}_b`,
                    },
                },
            });
        }).toThrow(/Plaintext environment variable 'a' contains a secret value!/);
    });
    test("should allow opting out of the 'secret value in a plaintext variable' validation", () => {
        // GIVEN
        const stack = new cdk.Stack();
        // THEN
        expect(() => {
            new codebuild.PipelineProject(stack, 'Project', {
                environmentVariables: {
                    'b': {
                        value: cdk.SecretValue.secretsManager('my-secret'),
                    },
                },
                checkSecretsInPlainTextEnvVariables: false,
            });
        }).not.toThrow();
    });
});
describe('Timeouts', () => {
    test('can add queued timeout', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'Bucket'),
                path: 'path',
            }),
            queuedTimeout: cdk.Duration.minutes(30),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            QueuedTimeoutInMinutes: 30,
        });
    });
    test('can override build timeout', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'Bucket'),
                path: 'path',
            }),
            timeout: cdk.Duration.minutes(30),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            TimeoutInMinutes: 30,
        });
    });
});
describe('Maximum concurrency', () => {
    test('can limit maximum concurrency', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new codebuild.Project(stack, 'Project', {
            source: codebuild.Source.s3({
                bucket: new s3.Bucket(stack, 'Bucket'),
                path: 'path',
            }),
            concurrentBuildLimit: 1,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeBuild::Project', {
            ConcurrentBuildLimit: 1,
        });
    });
});
test('can automatically add ssm permissions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new codebuild.Project(stack, 'Project', {
        source: codebuild.Source.s3({
            bucket: new s3.Bucket(stack, 'Bucket'),
            path: 'path',
        }),
        ssmSessionPermissions: true,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: assertions_1.Match.arrayWith([
                assertions_1.Match.objectLike({
                    Action: assertions_1.Match.arrayWith([
                        'ssmmessages:CreateControlChannel',
                        'ssmmessages:CreateDataChannel',
                    ]),
                }),
            ]),
        },
    });
});
describe('can be imported', () => {
    test('by ARN', () => {
        const stack = new cdk.Stack();
        const project = codebuild.Project.fromProjectArn(stack, 'Project', 'arn:aws:codebuild:us-west-2:123456789012:project/My-Project');
        expect(project.projectName).toEqual('My-Project');
        expect(project.env.account).toEqual('123456789012');
        expect(project.env.region).toEqual('us-west-2');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvamVjdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicHJvamVjdC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsMENBQTBDO0FBQzFDLHNDQUFzQztBQUN0Qyw4REFBOEQ7QUFDOUQscUNBQXFDO0FBQ3JDLG9DQUFvQztBQUVwQyxnQ0FBZ0M7QUFFaEMsSUFBSSxDQUFDLCtCQUErQixFQUFFLEdBQUcsRUFBRTtJQUN6QyxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFOUIsT0FBTztJQUNQLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFO1FBQ3RDLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUMxQixNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7WUFDdEMsSUFBSSxFQUFFLE1BQU07U0FDYixDQUFDO1FBQ0YsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDO0tBQy9ELENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtRQUN6RSxNQUFNLEVBQUU7WUFDTixTQUFTLEVBQUUsV0FBVztTQUN2QjtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLDJCQUEyQixFQUFFLEdBQUcsRUFBRTtJQUNyQyxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFOUIsT0FBTztJQUNQLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FB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Z0JBQ3pCLGtCQUFLLENBQUMsVUFBVSxDQUFDO29CQUNmLE1BQU0sRUFBRSxrQkFBSyxDQUFDLFNBQVMsQ0FBQzt3QkFDdEIsa0NBQWtDO3dCQUNsQywrQkFBK0I7cUJBQ2hDLENBQUM7aUJBQ0gsQ0FBQzthQUNILENBQUM7U0FDSDtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRTtRQUNsQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUMvRCw2REFBNkQsQ0FBQyxDQUFDO1FBRWpFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNwRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1hdGNoLCBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0ICogYXMgc2VjcmV0c21hbmFnZXIgZnJvbSAnQGF3cy1jZGsvYXdzLXNlY3JldHNtYW5hZ2VyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvZGVidWlsZCBmcm9tICcuLi9saWInO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBxdW90ZS1wcm9wcyAqL1xuXG50ZXN0KCdjYW4gdXNlIGZpbGVuYW1lIGFzIGJ1aWxkc3BlYycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5zMyh7XG4gICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSxcbiAgICAgIHBhdGg6ICdwYXRoJyxcbiAgICB9KSxcbiAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbVNvdXJjZUZpbGVuYW1lKCdoZWxsby55bWwnKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgU291cmNlOiB7XG4gICAgICBCdWlsZFNwZWM6ICdoZWxsby55bWwnLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NhbiB1c2UgYnVpbGRzcGVjIGxpdGVyYWwnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7IHBoYXNlczogWydzYXkgaGknXSB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgU291cmNlOiB7XG4gICAgICBCdWlsZFNwZWM6ICd7XFxuICBcInBoYXNlc1wiOiBbXFxuICAgIFwic2F5IGhpXCJcXG4gIF1cXG59JyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdjYW4gdXNlIHlhbWxidWlsZHNwZWMgbGl0ZXJhbCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgIGJ1aWxkU3BlYzogY29kZWJ1aWxkLkJ1aWxkU3BlYy5mcm9tT2JqZWN0VG9ZYW1sKHtcbiAgICAgIHRleHQ6ICd0ZXh0JyxcbiAgICAgIGRlY2ltYWw6IDEwLFxuICAgICAgbGlzdDogWydzYXkgaGknXSxcbiAgICAgIG9iajoge1xuICAgICAgICB0ZXh0OiAndGV4dCcsXG4gICAgICAgIGRlY2ltYWw6IDEwLFxuICAgICAgICBsaXN0OiBbJ3NheSBoaSddLFxuICAgICAgfSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgU291cmNlOiB7XG4gICAgICBCdWlsZFNwZWM6ICd0ZXh0OiB0ZXh0XFxuZGVjaW1hbDogMTBcXG5saXN0OlxcbiAgLSBzYXkgaGlcXG5vYmo6XFxuICB0ZXh0OiB0ZXh0XFxuICBkZWNpbWFsOiAxMFxcbiAgbGlzdDpcXG4gICAgLSBzYXkgaGlcXG4nLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ211c3Qgc3VwcGx5IGJ1aWxkc3BlYyB3aGVuIHVzaW5nIG5vc291cmNlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgfSk7XG4gIH0pLnRvVGhyb3coL3lvdSBuZWVkIHRvIHByb3ZpZGUgYSBjb25jcmV0ZSBidWlsZFNwZWMvKTtcbn0pO1xuXG50ZXN0KCdtdXN0IHN1cHBseSBsaXRlcmFsIGJ1aWxkc3BlYyB3aGVuIHVzaW5nIG5vc291cmNlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICBleHBlY3QoKCkgPT4ge1xuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbVNvdXJjZUZpbGVuYW1lKCdibGEueW1sJyksXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coL3lvdSBuZWVkIHRvIHByb3ZpZGUgYSBjb25jcmV0ZSBidWlsZFNwZWMvKTtcbn0pO1xuXG5kZXNjcmliZSgnR2l0SHViIHNvdXJjZScsICgpID0+IHtcbiAgdGVzdCgnaGFzIHJlcG9ydEJ1aWxkU3RhdHVzIG9uIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLmdpdEh1Yih7XG4gICAgICAgIG93bmVyOiAndGVzdG93bmVyJyxcbiAgICAgICAgcmVwbzogJ3Rlc3RyZXBvJyxcbiAgICAgICAgY2xvbmVEZXB0aDogMyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgIFNvdXJjZToge1xuICAgICAgICBUeXBlOiAnR0lUSFVCJyxcbiAgICAgICAgTG9jYXRpb246ICdodHRwczovL2dpdGh1Yi5jb20vdGVzdG93bmVyL3Rlc3RyZXBvLmdpdCcsXG4gICAgICAgIFJlcG9ydEJ1aWxkU3RhdHVzOiB0cnVlLFxuICAgICAgICBHaXRDbG9uZURlcHRoOiAzLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHNldCBhIGJyYW5jaCBhcyB0aGUgU291cmNlVmVyc2lvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuZ2l0SHViKHtcbiAgICAgICAgb3duZXI6ICd0ZXN0b3duZXInLFxuICAgICAgICByZXBvOiAndGVzdHJlcG8nLFxuICAgICAgICBicmFuY2hPclJlZjogJ3Rlc3RicmFuY2gnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgU291cmNlVmVyc2lvbjogJ3Rlc3RicmFuY2gnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gZXhwbGljaXRseSBzZXQgcmVwb3J0QnVpbGRTdGF0dXMgdG8gZmFsc2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLmdpdEh1Yih7XG4gICAgICAgIG93bmVyOiAndGVzdG93bmVyJyxcbiAgICAgICAgcmVwbzogJ3Rlc3RyZXBvJyxcbiAgICAgICAgcmVwb3J0QnVpbGRTdGF0dXM6IGZhbHNlLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgU291cmNlOiB7XG4gICAgICAgIFJlcG9ydEJ1aWxkU3RhdHVzOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBleHBsaWNpdGx5IHNldCB3ZWJob29rIHRvIHRydWUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLmdpdEh1Yih7XG4gICAgICAgIG93bmVyOiAndGVzdG93bmVyJyxcbiAgICAgICAgcmVwbzogJ3Rlc3RyZXBvJyxcbiAgICAgICAgd2ViaG9vazogdHJ1ZSxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgIFRyaWdnZXJzOiB7XG4gICAgICAgIFdlYmhvb2s6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgYWRkZWQgdG8gYSBDb2RlUGlwZWxpbmUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuZ2l0SHViKHtcbiAgICAgICAgb3duZXI6ICd0ZXN0b3duZXInLFxuICAgICAgICByZXBvOiAndGVzdHJlcG8nLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgcHJvamVjdC5iaW5kVG9Db2RlUGlwZWxpbmUocHJvamVjdCwge1xuICAgICAgICBhcnRpZmFjdEJ1Y2tldDogbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpLFxuICAgICAgfSk7XG4gICAgfSkubm90LnRvVGhyb3coKTsgLy8gbm8gZXhjZXB0aW9uXG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBwcm92aWRlIGNyZWRlbnRpYWxzIHRvIHVzZSB3aXRoIHRoZSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgY29kZWJ1aWxkLkdpdEh1YlNvdXJjZUNyZWRlbnRpYWxzKHN0YWNrLCAnR2l0SHViU291cmNlQ3JlZGVudGlhbHMnLCB7XG4gICAgICBhY2Nlc3NUb2tlbjogY2RrLlNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnbXktYWNjZXNzLXRva2VuJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpTb3VyY2VDcmVkZW50aWFsJywge1xuICAgICAgJ1NlcnZlclR5cGUnOiAnR0lUSFVCJyxcbiAgICAgICdBdXRoVHlwZSc6ICdQRVJTT05BTF9BQ0NFU1NfVE9LRU4nLFxuICAgICAgJ1Rva2VuJzogJ215LWFjY2Vzcy10b2tlbicsXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdHaXRIdWIgRW50ZXJwcmlzZSBzb3VyY2UnLCAoKSA9PiB7XG4gIHRlc3QoJ2NhbiB1c2UgYnJhbmNoT3JSZWYgdG8gc2V0IHRoZSBzb3VyY2UgdmVyc2lvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuZ2l0SHViRW50ZXJwcmlzZSh7XG4gICAgICAgIGh0dHBzQ2xvbmVVcmw6ICdodHRwczovL215Z2l0aHViLWVudGVycHJpc2UuY29tL215dXNlci9teXJlcG8nLFxuICAgICAgICBicmFuY2hPclJlZjogJ3Rlc3RicmFuY2gnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgU291cmNlVmVyc2lvbjogJ3Rlc3RicmFuY2gnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gcHJvdmlkZSBjcmVkZW50aWFscyB0byB1c2Ugd2l0aCB0aGUgc291cmNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGNvZGVidWlsZC5HaXRIdWJFbnRlcnByaXNlU291cmNlQ3JlZGVudGlhbHMoc3RhY2ssICdHaXRIdWJFbnRlcnByaXNlU291cmNlQ3JlZGVudGlhbHMnLCB7XG4gICAgICBhY2Nlc3NUb2tlbjogY2RrLlNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgnbXktYWNjZXNzLXRva2VuJyksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpTb3VyY2VDcmVkZW50aWFsJywge1xuICAgICAgJ1NlcnZlclR5cGUnOiAnR0lUSFVCX0VOVEVSUFJJU0UnLFxuICAgICAgJ0F1dGhUeXBlJzogJ1BFUlNPTkFMX0FDQ0VTU19UT0tFTicsXG4gICAgICAnVG9rZW4nOiAnbXktYWNjZXNzLXRva2VuJyxcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ0JpdEJ1Y2tldCBzb3VyY2UnLCAoKSA9PiB7XG4gIHRlc3QoJ2NhbiB1c2UgYnJhbmNoT3JSZWYgdG8gc2V0IHRoZSBzb3VyY2UgdmVyc2lvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuYml0QnVja2V0KHtcbiAgICAgICAgb3duZXI6ICd0ZXN0b3duZXInLFxuICAgICAgICByZXBvOiAndGVzdHJlcG8nLFxuICAgICAgICBicmFuY2hPclJlZjogJ3Rlc3RicmFuY2gnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgU291cmNlVmVyc2lvbjogJ3Rlc3RicmFuY2gnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gcHJvdmlkZSBjcmVkZW50aWFscyB0byB1c2Ugd2l0aCB0aGUgc291cmNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGNvZGVidWlsZC5CaXRCdWNrZXRTb3VyY2VDcmVkZW50aWFscyhzdGFjaywgJ0JpdEJ1Y2tldFNvdXJjZUNyZWRlbnRpYWxzJywge1xuICAgICAgdXNlcm5hbWU6IGNkay5TZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ215LXVzZXJuYW1lJyksXG4gICAgICBwYXNzd29yZDogY2RrLlNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgncGFzc3dvcmQnKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlNvdXJjZUNyZWRlbnRpYWwnLCB7XG4gICAgICAnU2VydmVyVHlwZSc6ICdCSVRCVUNLRVQnLFxuICAgICAgJ0F1dGhUeXBlJzogJ0JBU0lDX0FVVEgnLFxuICAgICAgJ1VzZXJuYW1lJzogJ215LXVzZXJuYW1lJyxcbiAgICAgICdUb2tlbic6ICdwYXNzd29yZCcsXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjYWNoaW5nJywgKCkgPT4ge1xuICB0ZXN0KCd1c2luZyBDYWNoZS5ub25lKCkgcmVzdWx0cyBpbiBOT19DQUNIRSBpbiB0aGUgdGVtcGxhdGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBjYWNoZTogY29kZWJ1aWxkLkNhY2hlLm5vbmUoKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICBDYWNoZToge1xuICAgICAgICBUeXBlOiAnTk9fQ0FDSEUnLFxuICAgICAgICBMb2NhdGlvbjogTWF0Y2guYWJzZW50KCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdwcm9qZWN0IHdpdGggczMgY2FjaGUgYnVja2V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5zMyh7XG4gICAgICAgIGJ1Y2tldDogbmV3IHMzLkJ1Y2tldChzdGFjaywgJ1NvdXJjZUJ1Y2tldCcpLFxuICAgICAgICBwYXRoOiAncGF0aCcsXG4gICAgICB9KSxcbiAgICAgIGNhY2hlOiBjb2RlYnVpbGQuQ2FjaGUuYnVja2V0KG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSwge1xuICAgICAgICBwcmVmaXg6ICdjYWNoZS1wcmVmaXgnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgQ2FjaGU6IHtcbiAgICAgICAgVHlwZTogJ1MzJyxcbiAgICAgICAgTG9jYXRpb246IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnLycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnUmVmJzogJ0J1Y2tldDgzOTA4RTc3JyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJ2NhY2hlLXByZWZpeCcsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzMyBjb2RlYnVpbGQgcHJvamVjdCB3aXRoIHNvdXJjZVZlcnNpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgICAgYnVja2V0OiBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0JyksXG4gICAgICAgIHBhdGg6ICdwYXRoJyxcbiAgICAgICAgdmVyc2lvbjogJ3MzdmVyc2lvbicsXG4gICAgICB9KSxcbiAgICAgIGNhY2hlOiBjb2RlYnVpbGQuQ2FjaGUubG9jYWwoY29kZWJ1aWxkLkxvY2FsQ2FjaGVNb2RlLkNVU1RPTSwgY29kZWJ1aWxkLkxvY2FsQ2FjaGVNb2RlLkRPQ0tFUl9MQVlFUixcbiAgICAgICAgY29kZWJ1aWxkLkxvY2FsQ2FjaGVNb2RlLlNPVVJDRSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgU291cmNlVmVyc2lvbjogJ3MzdmVyc2lvbicsXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Byb2plY3Qgd2l0aCBsb2NhbCBjYWNoZSBtb2RlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSxcbiAgICAgICAgcGF0aDogJ3BhdGgnLFxuICAgICAgfSksXG4gICAgICBjYWNoZTogY29kZWJ1aWxkLkNhY2hlLmxvY2FsKGNvZGVidWlsZC5Mb2NhbENhY2hlTW9kZS5DVVNUT00sIGNvZGVidWlsZC5Mb2NhbENhY2hlTW9kZS5ET0NLRVJfTEFZRVIsXG4gICAgICAgIGNvZGVidWlsZC5Mb2NhbENhY2hlTW9kZS5TT1VSQ0UpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgIENhY2hlOiB7XG4gICAgICAgIFR5cGU6ICdMT0NBTCcsXG4gICAgICAgIE1vZGVzOiBbXG4gICAgICAgICAgJ0xPQ0FMX0NVU1RPTV9DQUNIRScsXG4gICAgICAgICAgJ0xPQ0FMX0RPQ0tFUl9MQVlFUl9DQUNIRScsXG4gICAgICAgICAgJ0xPQ0FMX1NPVVJDRV9DQUNIRScsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdwcm9qZWN0IGJ5IGRlZmF1bHQgaGFzIGNhY2hlIHR5cGUgc2V0IHRvIE5PX0NBQ0hFJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5zMyh7XG4gICAgICAgIGJ1Y2tldDogbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpLFxuICAgICAgICBwYXRoOiAncGF0aCcsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICBDYWNoZToge1xuICAgICAgICBUeXBlOiAnTk9fQ0FDSEUnLFxuICAgICAgICBMb2NhdGlvbjogTWF0Y2guYWJzZW50KCksXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG50ZXN0KCdpZiBhIHJvbGUgaXMgc2hhcmVkIGJldHdlZW4gcHJvamVjdHMgaW4gYSBWUEMsIHRoZSBWUEMgUG9saWN5IGlzIG9ubHkgYXR0YWNoZWQgb25jZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG4gIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjb2RlYnVpbGQuYW1hem9uYXdzLmNvbScpLFxuICB9KTtcbiAgY29uc3Qgc291cmNlID0gY29kZWJ1aWxkLlNvdXJjZS5naXRIdWJFbnRlcnByaXNlKHtcbiAgICBodHRwc0Nsb25lVXJsOiAnaHR0cHM6Ly9teWdpdGh1Yi1lbnRlcnByaXNlLmNvbS9teXVzZXIvbXlyZXBvJyxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0MScsIHsgc291cmNlLCByb2xlLCB2cGMsIHByb2plY3ROYW1lOiAnUDEnIH0pO1xuICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0MicsIHsgc291cmNlLCByb2xlLCB2cGMsIHByb2plY3ROYW1lOiAnUDInIH0pO1xuXG4gIC8vIFRIRU5cbiAgLy8gLSAxIGlzIGZvciBgZWMyOkNyZWF0ZU5ldHdvcmtJbnRlcmZhY2VQZXJtaXNzaW9uYCwgZGVkdXBsaWNhdGVkIGFzIHRoZXkncmUgcGFydCBvZiBhIHNpbmdsZSBwb2xpY3lcbiAgLy8gLSAxIGlzIGZvciBgZWMyOkNyZWF0ZU5ldHdvcmtJbnRlcmZhY2VgLCB0aGlzIGlzIHRoZSBzZXBhcmF0ZSBQb2xpY3kgd2UncmUgZGVkdXBsaWNhdGluZ1xuICAvLyBXZSB3b3VsZCBoYXZlIGZvdW5kIDMgaWYgdGhlIGRlZHVwbGljYXRpb24gZGlkbid0IHdvcmsuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6UG9saWN5JywgMik7XG5cbiAgLy8gVEhFTiAtIGJvdGggUHJvamVjdHMgaGF2ZSBhIERlcGVuZHNPbiBvbiB0aGUgc2FtZSBwb2xpY3lcbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgUHJvcGVydGllczogeyBOYW1lOiAnUDEnIH0sXG4gICAgRGVwZW5kc09uOiBbJ1Byb2plY3QxUG9saWN5RG9jdW1lbnRGOTc2MTU2MiddLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICBQcm9wZXJ0aWVzOiB7IE5hbWU6ICdQMScgfSxcbiAgICBEZXBlbmRzT246IFsnUHJvamVjdDFQb2xpY3lEb2N1bWVudEY5NzYxNTYyJ10sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NhbiB1c2UgYW4gaW1wb3J0ZWQgUm9sZSBmb3IgYSBQcm9qZWN0IHdpdGhpbiBhIFZQQycsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgY29uc3QgaW1wb3J0ZWRSb2xlID0gaWFtLlJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdSb2xlJywgJ2Fybjphd3M6aWFtOjoxMjM0NTY3ODkwOnJvbGUvc2VydmljZS1yb2xlL2NvZGVidWlsZC1icnVpc2VyLXNlcnZpY2Utcm9sZScpO1xuICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZwYycpO1xuXG4gIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLmdpdEh1YkVudGVycHJpc2Uoe1xuICAgICAgaHR0cHNDbG9uZVVybDogJ2h0dHBzOi8vbXlnaXRodWItZW50ZXJwcmlzZS5jb20vbXl1c2VyL215cmVwbycsXG4gICAgfSksXG4gICAgcm9sZTogaW1wb3J0ZWRSb2xlLFxuICAgIHZwYyxcbiAgfSk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgIC8vIG5vIG5lZWQgdG8gZG8gYW55IGFzc2VydGlvbnNcbiAgfSk7XG59KTtcblxudGVzdCgnY2FuIHVzZSBhbiBpbXBvcnRlZCBSb2xlIHdpdGggbXV0YWJsZSA9IGZhbHNlIGZvciBhIFByb2plY3Qgd2l0aGluIGEgVlBDJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICBjb25zdCBpbXBvcnRlZFJvbGUgPSBpYW0uUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ1JvbGUnLFxuICAgICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDpyb2xlL3NlcnZpY2Utcm9sZS9jb2RlYnVpbGQtYnJ1aXNlci1zZXJ2aWNlLXJvbGUnLCB7XG4gICAgICBtdXRhYmxlOiBmYWxzZSxcbiAgICB9KTtcbiAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcblxuICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5naXRIdWJFbnRlcnByaXNlKHtcbiAgICAgIGh0dHBzQ2xvbmVVcmw6ICdodHRwczovL215Z2l0aHViLWVudGVycHJpc2UuY29tL215dXNlci9teXJlcG8nLFxuICAgIH0pLFxuICAgIHJvbGU6IGltcG9ydGVkUm9sZSxcbiAgICB2cGMsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6UG9saWN5JywgMCk7XG5cbiAgLy8gQ2hlY2sgdGhhdCB0aGUgQ29kZUJ1aWxkIHByb2plY3QgZG9lcyBub3QgaGF2ZSBhIERlcGVuZHNPblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIChyZXM6IGFueSkgPT4ge1xuICAgIGlmIChyZXMuRGVwZW5kc09uICYmIHJlcy5EZXBlbmRzT24ubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb2RlQnVpbGQgcHJvamVjdCBzaG91bGQgaGF2ZSBubyBEZXBlbmRzT24sIGJ1dCBnb3Q6ICR7SlNPTi5zdHJpbmdpZnkocmVzLCB1bmRlZmluZWQsIDIpfWApO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59KTtcblxudGVzdCgnY2FuIHVzZSBhbiBJbW11dGFibGVSb2xlIGZvciBhIFByb2plY3Qgd2l0aGluIGEgVlBDJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnY29kZWJ1aWxkLmFtYXpvbmF3cy5jb20nKSxcbiAgfSk7XG5cbiAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWcGMnKTtcblxuICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5naXRIdWJFbnRlcnByaXNlKHtcbiAgICAgIGh0dHBzQ2xvbmVVcmw6ICdodHRwczovL215Z2l0aHViLWVudGVycHJpc2UuY29tL215dXNlci9teXJlcG8nLFxuICAgIH0pLFxuICAgIHJvbGU6IHJvbGUud2l0aG91dFBvbGljeVVwZGF0ZXMoKSxcbiAgICB2cGMsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6UG9saWN5JywgMCk7XG5cbiAgLy8gQ2hlY2sgdGhhdCB0aGUgQ29kZUJ1aWxkIHByb2plY3QgZG9lcyBub3QgaGF2ZSBhIERlcGVuZHNPblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIChyZXM6IGFueSkgPT4ge1xuICAgIGlmIChyZXMuRGVwZW5kc09uICYmIHJlcy5EZXBlbmRzT24ubGVuZ3RoID4gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb2RlQnVpbGQgcHJvamVjdCBzaG91bGQgaGF2ZSBubyBEZXBlbmRzT24sIGJ1dCBnb3Q6ICR7SlNPTi5zdHJpbmdpZnkocmVzLCB1bmRlZmluZWQsIDIpfWApO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSk7XG59KTtcblxudGVzdCgnbWV0cmljIG1ldGhvZCBnZW5lcmF0ZXMgYSB2YWxpZCBDbG91ZFdhdGNoIG1ldHJpYycsICgpID0+IHtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLmdpdEh1YkVudGVycHJpc2Uoe1xuICAgICAgaHR0cHNDbG9uZVVybDogJ2h0dHBzOi8vbXlnaXRodWItZW50ZXJwcmlzZS5jb20vbXl1c2VyL215cmVwbycsXG4gICAgfSksXG4gIH0pO1xuXG4gIGNvbnN0IG1ldHJpYyA9IHByb2plY3QubWV0cmljKCdCdWlsZHMnKTtcbiAgZXhwZWN0KG1ldHJpYy5tZXRyaWNOYW1lKS50b0VxdWFsKCdCdWlsZHMnKTtcbiAgZXhwZWN0KG1ldHJpYy5wZXJpb2QudG9TZWNvbmRzKCkpLnRvRXF1YWwoY2RrLkR1cmF0aW9uLm1pbnV0ZXMoNSkudG9TZWNvbmRzKCkpO1xuICBleHBlY3QobWV0cmljLnN0YXRpc3RpYykudG9FcXVhbCgnQXZlcmFnZScpO1xufSk7XG5cbmRlc2NyaWJlKCdDb2RlQnVpbGQgdGVzdCByZXBvcnRzIGdyb3VwJywgKCkgPT4ge1xuICB0ZXN0KCdhZGRzIHRoZSBhcHByb3ByaWF0ZSBwZXJtaXNzaW9ucyB3aGVuIHJlcG9ydEdyb3VwLmdyYW50V3JpdGUoKSBpcyBjYWxsZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBjb25zdCByZXBvcnRHcm91cCA9IG5ldyBjb2RlYnVpbGQuUmVwb3J0R3JvdXAoc3RhY2ssICdSZXBvcnRHcm91cCcpO1xuXG4gICAgY29uc3QgcHJvamVjdCA9IG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBidWlsZFNwZWM6IGNvZGVidWlsZC5CdWlsZFNwZWMuZnJvbU9iamVjdCh7XG4gICAgICAgIHZlcnNpb246ICcwLjInLFxuICAgICAgICByZXBvcnRzOiB7XG4gICAgICAgICAgW3JlcG9ydEdyb3VwLnJlcG9ydEdyb3VwQXJuXToge1xuICAgICAgICAgICAgZmlsZXM6ICcqKi8qJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBncmFudFJlcG9ydEdyb3VwUGVybWlzc2lvbnM6IGZhbHNlLFxuICAgIH0pO1xuICAgIHJlcG9ydEdyb3VwLmdyYW50V3JpdGUocHJvamVjdCk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgJ1N0YXRlbWVudCc6IFtcbiAgICAgICAgICB7fSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAnY29kZWJ1aWxkOkNyZWF0ZVJlcG9ydCcsXG4gICAgICAgICAgICAgICdjb2RlYnVpbGQ6VXBkYXRlUmVwb3J0JyxcbiAgICAgICAgICAgICAgJ2NvZGVidWlsZDpCYXRjaFB1dFRlc3RDYXNlcycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnUmVwb3J0R3JvdXA4QTg0Qzc2RCcsXG4gICAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnRW52aXJvbm1lbnQnLCAoKSA9PiB7XG4gIHRlc3QoJ2J1aWxkIGltYWdlIC0gY2FuIHVzZSBzZWNyZXQgdG8gYWNjZXNzIGJ1aWxkIGltYWdlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSxcbiAgICAgICAgcGF0aDogJ3BhdGgnLFxuICAgICAgfSksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhCdWlsZEltYWdlLmZyb21Eb2NrZXJSZWdpc3RyeSgnbXlpbWFnZScsIHsgc2VjcmV0c01hbmFnZXJDcmVkZW50aWFsczogc2VjcmV0IH0pLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICBFbnZpcm9ubWVudDogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgIFJlZ2lzdHJ5Q3JlZGVudGlhbDoge1xuICAgICAgICAgIENyZWRlbnRpYWxQcm92aWRlcjogJ1NFQ1JFVFNfTUFOQUdFUicsXG4gICAgICAgICAgQ3JlZGVudGlhbDogeyAnUmVmJzogJ1NlY3JldEE3MjBFRjA1JyB9LFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2J1aWxkIGltYWdlIC0gY2FuIHVzZSBpbXBvcnRlZCBzZWNyZXQgYnkgbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHNlY3JldCA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0TmFtZVYyKHN0YWNrLCAnU2VjcmV0JywgJ015U2VjcmV0TmFtZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSxcbiAgICAgICAgcGF0aDogJ3BhdGgnLFxuICAgICAgfSksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBidWlsZEltYWdlOiBjb2RlYnVpbGQuTGludXhCdWlsZEltYWdlLmZyb21Eb2NrZXJSZWdpc3RyeSgnbXlpbWFnZScsIHsgc2VjcmV0c01hbmFnZXJDcmVkZW50aWFsczogc2VjcmV0IH0pLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICBFbnZpcm9ubWVudDogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgIFJlZ2lzdHJ5Q3JlZGVudGlhbDoge1xuICAgICAgICAgIENyZWRlbnRpYWxQcm92aWRlcjogJ1NFQ1JFVFNfTUFOQUdFUicsXG4gICAgICAgICAgQ3JlZGVudGlhbDogJ015U2VjcmV0TmFtZScsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbG9ncyBjb25maWcgLSBjbG91ZFdhdGNoJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgbG9nR3JvdXAgPSBsb2dzLkxvZ0dyb3VwLmZyb21Mb2dHcm91cE5hbWUoc3RhY2ssICdMb2dHcm91cCcsICdNeUxvZ0dyb3VwTmFtZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSxcbiAgICAgICAgcGF0aDogJ3BhdGgnLFxuICAgICAgfSksXG4gICAgICBsb2dnaW5nOiB7XG4gICAgICAgIGNsb3VkV2F0Y2g6IHtcbiAgICAgICAgICBsb2dHcm91cCxcbiAgICAgICAgICBwcmVmaXg6ICcvbXktbG9ncycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgIExvZ3NDb25maWc6IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBDbG91ZFdhdGNoTG9nczoge1xuICAgICAgICAgIEdyb3VwTmFtZTogJ015TG9nR3JvdXBOYW1lJyxcbiAgICAgICAgICBTdGF0dXM6ICdFTkFCTEVEJyxcbiAgICAgICAgICBTdHJlYW1OYW1lOiAnL215LWxvZ3MnLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvZ3MgY29uZmlnIC0gY2xvdWRXYXRjaCBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSxcbiAgICAgICAgcGF0aDogJ3BhdGgnLFxuICAgICAgfSksXG4gICAgICBsb2dnaW5nOiB7XG4gICAgICAgIGNsb3VkV2F0Y2g6IHtcbiAgICAgICAgICBlbmFibGVkOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgTG9nc0NvbmZpZzogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgIENsb3VkV2F0Y2hMb2dzOiB7XG4gICAgICAgICAgU3RhdHVzOiAnRElTQUJMRUQnLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xvZ3MgY29uZmlnIC0gczMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBidWNrZXQgPSBzMy5CdWNrZXQuZnJvbUJ1Y2tldE5hbWUoc3RhY2ssICdMb2dCdWNrZXQnLCAnbXlidWNrZXRuYW1lJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5zMyh7XG4gICAgICAgIGJ1Y2tldDogbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpLFxuICAgICAgICBwYXRoOiAncGF0aCcsXG4gICAgICB9KSxcbiAgICAgIGxvZ2dpbmc6IHtcbiAgICAgICAgczM6IHtcbiAgICAgICAgICBidWNrZXQsXG4gICAgICAgICAgcHJlZml4OiAnbXktbG9ncycsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgIExvZ3NDb25maWc6IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBTM0xvZ3M6IHtcbiAgICAgICAgICBMb2NhdGlvbjogJ215YnVja2V0bmFtZS9teS1sb2dzJyxcbiAgICAgICAgICBTdGF0dXM6ICdFTkFCTEVEJyxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdsb2dzIGNvbmZpZyAtIGNsb3VkV2F0Y2ggYW5kIHMzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXROYW1lKHN0YWNrLCAnTG9nQnVja2V0MicsICdteWJ1Y2tldG5hbWUnKTtcbiAgICBjb25zdCBsb2dHcm91cCA9IGxvZ3MuTG9nR3JvdXAuZnJvbUxvZ0dyb3VwTmFtZShzdGFjaywgJ0xvZ0dyb3VwMicsICdNeUxvZ0dyb3VwTmFtZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBjb2RlYnVpbGQuUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSxcbiAgICAgICAgcGF0aDogJ3BhdGgnLFxuICAgICAgfSksXG4gICAgICBsb2dnaW5nOiB7XG4gICAgICAgIGNsb3VkV2F0Y2g6IHtcbiAgICAgICAgICBsb2dHcm91cCxcbiAgICAgICAgfSxcbiAgICAgICAgczM6IHtcbiAgICAgICAgICBidWNrZXQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgIExvZ3NDb25maWc6IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBDbG91ZFdhdGNoTG9nczoge1xuICAgICAgICAgIEdyb3VwTmFtZTogJ015TG9nR3JvdXBOYW1lJyxcbiAgICAgICAgICBTdGF0dXM6ICdFTkFCTEVEJyxcbiAgICAgICAgfSxcbiAgICAgICAgUzNMb2dzOiB7XG4gICAgICAgICAgTG9jYXRpb246ICdteWJ1Y2tldG5hbWUnLFxuICAgICAgICAgIFN0YXR1czogJ0VOQUJMRUQnLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NlcnRpZmljYXRlIGFybicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IGJ1Y2tldCA9IHMzLkJ1Y2tldC5mcm9tQnVja2V0TmFtZShzdGFjaywgJ0J1Y2tldCcsICdteS1idWNrZXQnKTsgLy8gKHN0YWNrLCAnQnVja2V0Jyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5zMyh7XG4gICAgICAgIGJ1Y2tldCxcbiAgICAgICAgcGF0aDogJ3BhdGgnLFxuICAgICAgfSksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBjZXJ0aWZpY2F0ZToge1xuICAgICAgICAgIGJ1Y2tldCxcbiAgICAgICAgICBvYmplY3RLZXk6ICdwYXRoJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgRW52aXJvbm1lbnQ6IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBDZXJ0aWZpY2F0ZToge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgJzpzMzo6Om15LWJ1Y2tldC9wYXRoJyxcbiAgICAgICAgICBdXSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0LmVhY2goW1xuICAgIFsnU3RhbmRhcmQgNi4wJywgY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5TVEFOREFSRF82XzAsICdhd3MvY29kZWJ1aWxkL3N0YW5kYXJkOjYuMCddLFxuICAgIFsnQW1hem9uIExpbnV4IDQuMCcsIGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuQU1BWk9OX0xJTlVYXzJfNCwgJ2F3cy9jb2RlYnVpbGQvYW1hem9ubGludXgyLXg4Nl82NC1zdGFuZGFyZDo0LjAnXSxcbiAgICBbJ1dpbmRvd3MgU2VydmVyIENvcmUgMjAxOSAyLjAnLCBjb2RlYnVpbGQuV2luZG93c0J1aWxkSW1hZ2UuV0lOX1NFUlZFUl9DT1JFXzIwMTlfQkFTRV8yXzAsICdhd3MvY29kZWJ1aWxkL3dpbmRvd3MtYmFzZToyMDE5LTIuMCddLFxuICBdKSgnaGFzIGJ1aWxkIGltYWdlIGZvciAlcycsIChfLCBidWlsZEltYWdlLCBleHBlY3RlZCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgYnVja2V0ID0gczMuQnVja2V0LmZyb21CdWNrZXROYW1lKHN0YWNrLCAnQnVja2V0JywgJ215LWJ1Y2tldCcpOyAvLyAoc3RhY2ssICdCdWNrZXQnKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgICAgYnVja2V0LFxuICAgICAgICBwYXRoOiAncGF0aCcsXG4gICAgICB9KSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIGJ1aWxkSW1hZ2U6IGJ1aWxkSW1hZ2UsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgIEVudmlyb25tZW50OiBNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgSW1hZ2U6IGV4cGVjdGVkLFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdFbnZpcm9ubWVudFZhcmlhYmxlcycsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2Zyb20gU1NNJywgKCkgPT4ge1xuICAgIHRlc3QoJ2NhbiB1c2UgZW52aXJvbm1lbnQgdmFyaWFibGVzJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgICAgIGJ1Y2tldDogbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpLFxuICAgICAgICAgIHBhdGg6ICdwYXRoJyxcbiAgICAgICAgfSksXG4gICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgYnVpbGRJbWFnZTogY29kZWJ1aWxkLkxpbnV4QnVpbGRJbWFnZS5mcm9tRG9ja2VyUmVnaXN0cnkoJ215aW1hZ2UnKSxcbiAgICAgICAgfSxcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgICAnRU5WX1ZBUjEnOiB7XG4gICAgICAgICAgICB0eXBlOiBjb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5QQVJBTUVURVJfU1RPUkUsXG4gICAgICAgICAgICB2YWx1ZTogJy9wYXJhbXMvcGFyYW0xJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgICAgRW52aXJvbm1lbnQ6IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIEVudmlyb25tZW50VmFyaWFibGVzOiBbe1xuICAgICAgICAgICAgTmFtZTogJ0VOVl9WQVIxJyxcbiAgICAgICAgICAgIFR5cGU6ICdQQVJBTUVURVJfU1RPUkUnLFxuICAgICAgICAgICAgVmFsdWU6ICcvcGFyYW1zL3BhcmFtMScsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdncmFudHMgdGhlIGNvcnJlY3QgcmVhZCBwZXJtaXNzaW9ucycsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSxcbiAgICAgICAgICBwYXRoOiAncGF0aCcsXG4gICAgICAgIH0pLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuZnJvbURvY2tlclJlZ2lzdHJ5KCdteWltYWdlJyksXG4gICAgICAgIH0sXG4gICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICAgJ0VOVl9WQVIxJzoge1xuICAgICAgICAgICAgdHlwZTogY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuUEFSQU1FVEVSX1NUT1JFLFxuICAgICAgICAgICAgdmFsdWU6ICcvcGFyYW1zL3BhcmFtMScsXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnRU5WX1ZBUjInOiB7XG4gICAgICAgICAgICB0eXBlOiBjb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5QQVJBTUVURVJfU1RPUkUsXG4gICAgICAgICAgICB2YWx1ZTogJ3BhcmFtcy9wYXJhbTInLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFtNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgICdBY3Rpb24nOiAnc3NtOkdldFBhcmFtZXRlcnMnLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiBbe1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzpzc206JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyL3BhcmFtcy9wYXJhbTEnLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzpzc206JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpSZWdpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpBY2NvdW50SWQnLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6cGFyYW1ldGVyL3BhcmFtcy9wYXJhbTInLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICB9KV0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdkb2VzIG5vdCBncmFudCByZWFkIHBlcm1pc3Npb25zIHdoZW4gdmFyaWFibGVzIGFyZSBub3QgZnJvbSBwYXJhbWV0ZXIgc3RvcmUnLCAoKSA9PiB7XG5cbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgICAgICBidWNrZXQ6IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdCdWNrZXQnKSxcbiAgICAgICAgICBwYXRoOiAncGF0aCcsXG4gICAgICAgIH0pLFxuICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgIGJ1aWxkSW1hZ2U6IGNvZGVidWlsZC5MaW51eEJ1aWxkSW1hZ2UuZnJvbURvY2tlclJlZ2lzdHJ5KCdteWltYWdlJyksXG4gICAgICAgIH0sXG4gICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICAgJ0VOVl9WQVIxJzoge1xuICAgICAgICAgICAgdHlwZTogY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuUExBSU5URVhULFxuICAgICAgICAgICAgdmFsdWU6ICd2YXIxLXZhbHVlJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5JywgTWF0Y2gubm90KHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBNYXRjaC5hcnJheVdpdGgoW01hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgJ0FjdGlvbic6ICdzc206R2V0UGFyYW1ldGVycycsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICB9KV0pLFxuICAgICAgICB9LFxuICAgICAgfSkpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnZnJvbSBTZWNyZXRzTWFuYWdlcicsICgpID0+IHtcbiAgICB0ZXN0KCdjYW4gYmUgcHJvdmlkZWQgYXMgYSB2ZXJiYXRpbSBzZWNyZXQgbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICAgICdFTlZfVkFSMSc6IHtcbiAgICAgICAgICAgIHR5cGU6IGNvZGVidWlsZC5CdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLlNFQ1JFVFNfTUFOQUdFUixcbiAgICAgICAgICAgIHZhbHVlOiAnbXktc2VjcmV0JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgICAgJ0Vudmlyb25tZW50Jzoge1xuICAgICAgICAgICdFbnZpcm9ubWVudFZhcmlhYmxlcyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ05hbWUnOiAnRU5WX1ZBUjEnLFxuICAgICAgICAgICAgICAnVHlwZSc6ICdTRUNSRVRTX01BTkFHRVInLFxuICAgICAgICAgICAgICAnVmFsdWUnOiAnbXktc2VjcmV0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgICAgICdBY3Rpb24nOiAnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiB7XG4gICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICc6c2VjcmV0c21hbmFnZXI6JyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAgICc6JyxcbiAgICAgICAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICAgICAgICc6c2VjcmV0Om15LXNlY3JldC0/Pz8/Pz8nLFxuICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gYmUgcHJvdmlkZWQgYXMgYSB2ZXJiYXRpbSBzZWNyZXQgbmFtZSBmb2xsb3dlZCBieSBhIEpTT04ga2V5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICAgJ0VOVl9WQVIxJzoge1xuICAgICAgICAgICAgdHlwZTogY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuU0VDUkVUU19NQU5BR0VSLFxuICAgICAgICAgICAgdmFsdWU6ICdteS1zZWNyZXQ6anNvbi1rZXknLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICAnRW52aXJvbm1lbnQnOiB7XG4gICAgICAgICAgJ0Vudmlyb25tZW50VmFyaWFibGVzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnTmFtZSc6ICdFTlZfVkFSMScsXG4gICAgICAgICAgICAgICdUeXBlJzogJ1NFQ1JFVFNfTUFOQUdFUicsXG4gICAgICAgICAgICAgICdWYWx1ZSc6ICdteS1zZWNyZXQ6anNvbi1rZXknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICAgICAgJ0FjdGlvbic6ICdzZWNyZXRzbWFuYWdlcjpHZXRTZWNyZXRWYWx1ZScsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdSZXNvdXJjZSc6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgICAgICAgJzpzZWNyZXRzbWFuYWdlcjonLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgICAgICAgJzpzZWNyZXQ6bXktc2VjcmV0LT8/Pz8/PycsXG4gICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBiZSBwcm92aWRlZCBhcyBhIHZlcmJhdGltIGZ1bGwgc2VjcmV0IEFSTiBmb2xsb3dlZCBieSBhIEpTT04ga2V5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICAgJ0VOVl9WQVIxJzoge1xuICAgICAgICAgICAgdHlwZTogY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuU0VDUkVUU19NQU5BR0VSLFxuICAgICAgICAgICAgdmFsdWU6ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c2VjcmV0Om15LXNlY3JldC0xMjM0NTY6anNvbi1rZXknLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICAnRW52aXJvbm1lbnQnOiB7XG4gICAgICAgICAgJ0Vudmlyb25tZW50VmFyaWFibGVzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnTmFtZSc6ICdFTlZfVkFSMScsXG4gICAgICAgICAgICAgICdUeXBlJzogJ1NFQ1JFVFNfTUFOQUdFUicsXG4gICAgICAgICAgICAgICdWYWx1ZSc6ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c2VjcmV0Om15LXNlY3JldC0xMjM0NTY6anNvbi1rZXknLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICAgICAgJ0FjdGlvbic6ICdzZWNyZXRzbWFuYWdlcjpHZXRTZWNyZXRWYWx1ZScsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdSZXNvdXJjZSc6ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c2VjcmV0Om15LXNlY3JldC0xMjM0NTYqJyxcbiAgICAgICAgICB9XSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCBNYXRjaC5ub3Qoe1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICAgICAgJ0FjdGlvbic6ICdrbXM6RGVjcnlwdCcsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdSZXNvdXJjZSc6ICdhcm46YXdzOmttczp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOmtleS8qJyxcbiAgICAgICAgICB9XSksXG4gICAgICAgIH0sXG4gICAgICB9KSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gYmUgcHJvdmlkZWQgYXMgYSB2ZXJiYXRpbSBwYXJ0aWFsIHNlY3JldCBBUk4nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgICAnRU5WX1ZBUjEnOiB7XG4gICAgICAgICAgICB0eXBlOiBjb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5TRUNSRVRTX01BTkFHRVIsXG4gICAgICAgICAgICB2YWx1ZTogJ2Fybjphd3M6c2VjcmV0c21hbmFnZXI6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpzZWNyZXQ6bXlzZWNyZXQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICAnRW52aXJvbm1lbnQnOiB7XG4gICAgICAgICAgJ0Vudmlyb25tZW50VmFyaWFibGVzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnTmFtZSc6ICdFTlZfVkFSMScsXG4gICAgICAgICAgICAgICdUeXBlJzogJ1NFQ1JFVFNfTUFOQUdFUicsXG4gICAgICAgICAgICAgICdWYWx1ZSc6ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c2VjcmV0Om15c2VjcmV0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgICAgICdBY3Rpb24nOiAnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnNlY3JldDpteXNlY3JldConLFxuICAgICAgICAgIH1dKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIE1hdGNoLm5vdCh7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzogJ2Fybjphd3M6a21zOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6a2V5LyonLFxuICAgICAgICAgIH1dKSxcbiAgICAgICAgfSxcbiAgICAgIH0pKTtcbiAgICB9KTtcblxuICAgIHRlc3QoXCJ3aGVuIHByb3ZpZGVkIGFzIGEgdmVyYmF0aW0gcGFydGlhbCBzZWNyZXQgQVJOIGZyb20gYW5vdGhlciBhY2NvdW50LCBhZGRzIHBlcm1pc3Npb24gdG8gZGVjcnlwdCBrZXlzIGluIHRoZSBTZWNyZXQncyBhY2NvdW50XCIsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1Byb2plY3RTdGFjaycsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICAgICdFTlZfVkFSMSc6IHtcbiAgICAgICAgICAgIHR5cGU6IGNvZGVidWlsZC5CdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLlNFQ1JFVFNfTUFOQUdFUixcbiAgICAgICAgICAgIHZhbHVlOiAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjp1cy13ZXN0LTI6OTAxMjM0NTY3ODkwOnNlY3JldDpteXNlY3JldCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgICAgICdBY3Rpb24nOiAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiAnYXJuOmF3czprbXM6dXMtd2VzdC0yOjkwMTIzNDU2Nzg5MDprZXkvKicsXG4gICAgICAgICAgfV0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCd3aGVuIHR3byBzZWNyZXRzIGZyb20gYW5vdGhlciBhY2NvdW50IGFyZSBwcm92aWRlZCBhcyB2ZXJiYXRpbSBwYXJ0aWFsIHNlY3JldCBBUk5zLCBhZGRzIG9ubHkgb25lIHBlcm1pc3Npb24gZm9yIGRlY3J5cHRpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdQcm9qZWN0U3RhY2snLCB7XG4gICAgICAgIGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgICAnRU5WX1ZBUjEnOiB7XG4gICAgICAgICAgICB0eXBlOiBjb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5TRUNSRVRTX01BTkFHRVIsXG4gICAgICAgICAgICB2YWx1ZTogJ2Fybjphd3M6c2VjcmV0c21hbmFnZXI6dXMtd2VzdC0yOjkwMTIzNDU2Nzg5MDpzZWNyZXQ6bXlzZWNyZXQnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0VOVl9WQVIyJzoge1xuICAgICAgICAgICAgdHlwZTogY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuU0VDUkVUU19NQU5BR0VSLFxuICAgICAgICAgICAgdmFsdWU6ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOnVzLXdlc3QtMjo5MDEyMzQ1Njc4OTA6c2VjcmV0Om90aGVyLXNlY3JldCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgICAgICdBY3Rpb24nOiAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiAnYXJuOmF3czprbXM6dXMtd2VzdC0yOjkwMTIzNDU2Nzg5MDprZXkvKicsXG4gICAgICAgICAgfV0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gYmUgcHJvdmlkZWQgYXMgdGhlIEFSTiBhdHRyaWJ1dGUgb2YgYSBuZXcgU2VjcmV0JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHN0YWNrLCAnU2VjcmV0Jyk7XG4gICAgICBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICAgJ0VOVl9WQVIxJzoge1xuICAgICAgICAgICAgdHlwZTogY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuU0VDUkVUU19NQU5BR0VSLFxuICAgICAgICAgICAgdmFsdWU6IHNlY3JldC5zZWNyZXRBcm4sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAgICdFbnZpcm9ubWVudCc6IHtcbiAgICAgICAgICAnRW52aXJvbm1lbnRWYXJpYWJsZXMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdOYW1lJzogJ0VOVl9WQVIxJyxcbiAgICAgICAgICAgICAgJ1R5cGUnOiAnU0VDUkVUU19NQU5BR0VSJyxcbiAgICAgICAgICAgICAgJ1ZhbHVlJzogeyAnUmVmJzogJ1NlY3JldEE3MjBFRjA1JyB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICAgICAgJ0FjdGlvbic6ICdzZWNyZXRzbWFuYWdlcjpHZXRTZWNyZXRWYWx1ZScsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdSZXNvdXJjZSc6IHsgJ1JlZic6ICdTZWNyZXRBNzIwRUYwNScgfSxcbiAgICAgICAgICB9XSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3doZW4gdGhlIHNhbWUgbmV3IHNlY3JldCBpcyBwcm92aWRlZCB3aXRoIGRpZmZlcmVudCBKU09OIGtleXMsIG9ubHkgYWRkcyB0aGUgcmVzb3VyY2Ugb25jZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc2VjcmV0ID0gbmV3IHNlY3JldHNtYW5hZ2VyLlNlY3JldChzdGFjaywgJ1NlY3JldCcpO1xuICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICAgICdFTlZfVkFSMSc6IHtcbiAgICAgICAgICAgIHR5cGU6IGNvZGVidWlsZC5CdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLlNFQ1JFVFNfTUFOQUdFUixcbiAgICAgICAgICAgIHZhbHVlOiBgJHtzZWNyZXQuc2VjcmV0QXJufTpqc29uLWtleTFgLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ0VOVl9WQVIyJzoge1xuICAgICAgICAgICAgdHlwZTogY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuU0VDUkVUU19NQU5BR0VSLFxuICAgICAgICAgICAgdmFsdWU6IGAke3NlY3JldC5zZWNyZXRBcm59Ompzb24ta2V5MmAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAgICdFbnZpcm9ubWVudCc6IHtcbiAgICAgICAgICAnRW52aXJvbm1lbnRWYXJpYWJsZXMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdOYW1lJzogJ0VOVl9WQVIxJyxcbiAgICAgICAgICAgICAgJ1R5cGUnOiAnU0VDUkVUU19NQU5BR0VSJyxcbiAgICAgICAgICAgICAgJ1ZhbHVlJzogeyAnRm46OkpvaW4nOiBbJycsIFt7ICdSZWYnOiAnU2VjcmV0QTcyMEVGMDUnIH0sICc6anNvbi1rZXkxJ11dIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnTmFtZSc6ICdFTlZfVkFSMicsXG4gICAgICAgICAgICAgICdUeXBlJzogJ1NFQ1JFVFNfTUFOQUdFUicsXG4gICAgICAgICAgICAgICdWYWx1ZSc6IHsgJ0ZuOjpKb2luJzogWycnLCBbeyAnUmVmJzogJ1NlY3JldEE3MjBFRjA1JyB9LCAnOmpzb24ta2V5MiddXSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAgICAgJ1N0YXRlbWVudCc6IE1hdGNoLmFycmF5V2l0aChbe1xuICAgICAgICAgICAgJ0FjdGlvbic6ICdzZWNyZXRzbWFuYWdlcjpHZXRTZWNyZXRWYWx1ZScsXG4gICAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAgICdSZXNvdXJjZSc6IHsgJ1JlZic6ICdTZWNyZXRBNzIwRUYwNScgfSxcbiAgICAgICAgICB9XSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBiZSBwcm92aWRlZCBhcyB0aGUgQVJOIGF0dHJpYnV0ZSBvZiBhIG5ldyBTZWNyZXQsIGZvbGxvd2VkIGJ5IGEgSlNPTiBrZXknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNlY3JldCA9IG5ldyBzZWNyZXRzbWFuYWdlci5TZWNyZXQoc3RhY2ssICdTZWNyZXQnKTtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgICAnRU5WX1ZBUjEnOiB7XG4gICAgICAgICAgICB0eXBlOiBjb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5TRUNSRVRTX01BTkFHRVIsXG4gICAgICAgICAgICB2YWx1ZTogYCR7c2VjcmV0LnNlY3JldEFybn06anNvbi1rZXk6dmVyc2lvbi1zdGFnZWAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICAgICdFbnZpcm9ubWVudCc6IHtcbiAgICAgICAgICAnRW52aXJvbm1lbnRWYXJpYWJsZXMnOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdOYW1lJzogJ0VOVl9WQVIxJyxcbiAgICAgICAgICAgICAgJ1R5cGUnOiAnU0VDUkVUU19NQU5BR0VSJyxcbiAgICAgICAgICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAgICAgICAgICdGbjo6Sm9pbic6IFsnJywgW1xuICAgICAgICAgICAgICAgICAgeyAnUmVmJzogJ1NlY3JldEE3MjBFRjA1JyB9LFxuICAgICAgICAgICAgICAgICAgJzpqc29uLWtleTp2ZXJzaW9uLXN0YWdlJyxcbiAgICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgICAgICdBY3Rpb24nOiAnc2VjcmV0c21hbmFnZXI6R2V0U2VjcmV0VmFsdWUnLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiB7ICdSZWYnOiAnU2VjcmV0QTcyMEVGMDUnIH0sXG4gICAgICAgICAgfV0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gYmUgcHJvdmlkZWQgYXMgdGhlIG5hbWUgYXR0cmlidXRlIG9mIGEgU2VjcmV0IGltcG9ydGVkIGJ5IG5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNlY3JldCA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0TmFtZVYyKHN0YWNrLCAnU2VjcmV0JywgJ215c2VjcmV0Jyk7XG4gICAgICBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICAgJ0VOVl9WQVIxJzoge1xuICAgICAgICAgICAgdHlwZTogY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuU0VDUkVUU19NQU5BR0VSLFxuICAgICAgICAgICAgdmFsdWU6IHNlY3JldC5zZWNyZXROYW1lLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICAnRW52aXJvbm1lbnQnOiB7XG4gICAgICAgICAgJ0Vudmlyb25tZW50VmFyaWFibGVzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnTmFtZSc6ICdFTlZfVkFSMScsXG4gICAgICAgICAgICAgICdUeXBlJzogJ1NFQ1JFVFNfTUFOQUdFUicsXG4gICAgICAgICAgICAgICdWYWx1ZSc6ICdteXNlY3JldCcsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICc6c2VjcmV0c21hbmFnZXI6JyxcbiAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OkFjY291bnRJZCcgfSxcbiAgICAgICAgICAgICAgICAnOnNlY3JldDpteXNlY3JldC0/Pz8/Pz8nLFxuICAgICAgICAgICAgICBdXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfV0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gYmUgcHJvdmlkZWQgYXMgdGhlIEFSTiBhdHRyaWJ1dGUgb2YgYSBTZWNyZXQgaW1wb3J0ZWQgYnkgcGFydGlhbCBBUk4sIGZvbGxvd2VkIGJ5IGEgSlNPTiBrZXknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNlY3JldCA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0UGFydGlhbEFybihzdGFjaywgJ1NlY3JldCcsXG4gICAgICAgICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c2VjcmV0Om15c2VjcmV0Jyk7XG4gICAgICBuZXcgY29kZWJ1aWxkLlBpcGVsaW5lUHJvamVjdChzdGFjaywgJ1Byb2plY3QnLCB7XG4gICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICAgJ0VOVl9WQVIxJzoge1xuICAgICAgICAgICAgdHlwZTogY29kZWJ1aWxkLkJ1aWxkRW52aXJvbm1lbnRWYXJpYWJsZVR5cGUuU0VDUkVUU19NQU5BR0VSLFxuICAgICAgICAgICAgdmFsdWU6IGAke3NlY3JldC5zZWNyZXRBcm59Ompzb24ta2V5YCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgICAgJ0Vudmlyb25tZW50Jzoge1xuICAgICAgICAgICdFbnZpcm9ubWVudFZhcmlhYmxlcyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ05hbWUnOiAnRU5WX1ZBUjEnLFxuICAgICAgICAgICAgICAnVHlwZSc6ICdTRUNSRVRTX01BTkFHRVInLFxuICAgICAgICAgICAgICAnVmFsdWUnOiAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnNlY3JldDpteXNlY3JldDpqc29uLWtleScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzogJ2Fybjphd3M6c2VjcmV0c21hbmFnZXI6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpzZWNyZXQ6bXlzZWNyZXQqJyxcbiAgICAgICAgICB9XSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2NhbiBiZSBwcm92aWRlZCBhcyB0aGUgQVJOIGF0dHJpYnV0ZSBvZiBhIFNlY3JldCBpbXBvcnRlZCBieSBjb21wbGV0ZSBBUk4sIGZvbGxvd2VkIGJ5IGEgSlNPTiBrZXknLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIGNvbnN0IHNlY3JldCA9IHNlY3JldHNtYW5hZ2VyLlNlY3JldC5mcm9tU2VjcmV0Q29tcGxldGVBcm4oc3RhY2ssICdTZWNyZXQnLFxuICAgICAgICAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnNlY3JldDpteXNlY3JldC0xMjM0NTYnKTtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgICAnRU5WX1ZBUjEnOiB7XG4gICAgICAgICAgICB0eXBlOiBjb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5TRUNSRVRTX01BTkFHRVIsXG4gICAgICAgICAgICB2YWx1ZTogYCR7c2VjcmV0LnNlY3JldEFybn06anNvbi1rZXlgLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICAnRW52aXJvbm1lbnQnOiB7XG4gICAgICAgICAgJ0Vudmlyb25tZW50VmFyaWFibGVzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnTmFtZSc6ICdFTlZfVkFSMScsXG4gICAgICAgICAgICAgICdUeXBlJzogJ1NFQ1JFVFNfTUFOQUdFUicsXG4gICAgICAgICAgICAgICdWYWx1ZSc6ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c2VjcmV0Om15c2VjcmV0LTEyMzQ1Njpqc29uLWtleScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzogJ2Fybjphd3M6c2VjcmV0c21hbmFnZXI6dXMtd2VzdC0yOjEyMzQ1Njc4OTAxMjpzZWNyZXQ6bXlzZWNyZXQtMTIzNDU2KicsXG4gICAgICAgICAgfV0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdjYW4gYmUgcHJvdmlkZWQgYXMgYSBTZWNyZXRBcm4gb2YgYSBuZXcgU2VjcmV0LCB3aXRoIGl0cyBwaHlzaWNhbCBuYW1lIHNldCwgY3JlYXRlZCBpbiBhIGRpZmZlcmVudCBhY2NvdW50JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgICBjb25zdCBzZWNyZXRTdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnU2VjcmV0U3RhY2snLCB7XG4gICAgICAgIGVudjogeyBhY2NvdW50OiAnMDEyMzQ1Njc4OTEyJyB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnUHJvamVjdFN0YWNrJywge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzZWNyZXQgPSBuZXcgc2VjcmV0c21hbmFnZXIuU2VjcmV0KHNlY3JldFN0YWNrLCAnU2VjcmV0JywgeyBzZWNyZXROYW1lOiAnc2VjcmV0LW5hbWUnIH0pO1xuICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICAgICdFTlZfVkFSMSc6IHtcbiAgICAgICAgICAgIHR5cGU6IGNvZGVidWlsZC5CdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLlNFQ1JFVFNfTUFOQUdFUixcbiAgICAgICAgICAgIHZhbHVlOiBzZWNyZXQuc2VjcmV0QXJuLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICAnRW52aXJvbm1lbnQnOiB7XG4gICAgICAgICAgJ0Vudmlyb25tZW50VmFyaWFibGVzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnTmFtZSc6ICdFTlZfVkFSMScsXG4gICAgICAgICAgICAgICdUeXBlJzogJ1NFQ1JFVFNfTUFOQUdFUicsXG4gICAgICAgICAgICAgICdWYWx1ZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6c2VjcmV0c21hbmFnZXI6JyxcbiAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6MDEyMzQ1Njc4OTEyOnNlY3JldDpzZWNyZXQtbmFtZScsXG4gICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICc6c2VjcmV0c21hbmFnZXI6JyxcbiAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICAgJzowMTIzNDU2Nzg5MTI6c2VjcmV0OnNlY3JldC1uYW1lLT8/Pz8/PycsXG4gICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICc6a21zOicsXG4gICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAgICc6MDEyMzQ1Njc4OTEyOmtleS8qJyxcbiAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIHByb3ZpZGVkIGFzIGEgU2VjcmV0QXJuIG9mIGEgU2VjcmV0IGltcG9ydGVkIGJ5IG5hbWUgaW4gYSBkaWZmZXJlbnQgYWNjb3VudCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgICAgY29uc3Qgc2VjcmV0U3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1NlY3JldFN0YWNrJywge1xuICAgICAgICBlbnY6IHsgYWNjb3VudDogJzAxMjM0NTY3ODkxMicgfSxcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ1Byb2plY3RTdGFjaycsIHtcbiAgICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgY29uc3Qgc2VjcmV0ID0gc2VjcmV0c21hbmFnZXIuU2VjcmV0LmZyb21TZWNyZXROYW1lVjIoc2VjcmV0U3RhY2ssICdTZWNyZXQnLCAnc2VjcmV0LW5hbWUnKTtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgICAnRU5WX1ZBUjEnOiB7XG4gICAgICAgICAgICB0eXBlOiBjb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5TRUNSRVRTX01BTkFHRVIsXG4gICAgICAgICAgICB2YWx1ZTogYCR7c2VjcmV0LnNlY3JldEFybn06anNvbi1rZXlgLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgICAnRW52aXJvbm1lbnQnOiB7XG4gICAgICAgICAgJ0Vudmlyb25tZW50VmFyaWFibGVzJzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnTmFtZSc6ICdFTlZfVkFSMScsXG4gICAgICAgICAgICAgICdUeXBlJzogJ1NFQ1JFVFNfTUFOQUdFUicsXG4gICAgICAgICAgICAgICdWYWx1ZSc6IHtcbiAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6c2VjcmV0c21hbmFnZXI6JyxcbiAgICAgICAgICAgICAgICAgIHsgJ1JlZic6ICdBV1M6OlJlZ2lvbicgfSxcbiAgICAgICAgICAgICAgICAgICc6MDEyMzQ1Njc4OTEyOnNlY3JldDpzZWNyZXQtbmFtZTpqc29uLWtleScsXG4gICAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICc6c2VjcmV0c21hbmFnZXI6JyxcbiAgICAgICAgICAgICAgICB7ICdSZWYnOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgICAgICAgJzowMTIzNDU2Nzg5MTI6c2VjcmV0OnNlY3JldC1uYW1lKicsXG4gICAgICAgICAgICAgIF1dLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9XSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ2ttczpEZWNyeXB0JyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzoge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgICAgICc6a21zOicsXG4gICAgICAgICAgICAgICAgeyAnUmVmJzogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICAgICAgICc6MDEyMzQ1Njc4OTEyOmtleS8qJyxcbiAgICAgICAgICAgICAgXV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH1dKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnY2FuIGJlIHByb3ZpZGVkIGFzIGEgU2VjcmV0QXJuIG9mIGEgU2VjcmV0IGltcG9ydGVkIGJ5IGNvbXBsZXRlIEFSTiBmcm9tIGEgZGlmZmVyZW50IGFjY291bnQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdQcm9qZWN0U3RhY2snLCB7XG4gICAgICAgIGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJyB9LFxuICAgICAgfSk7XG4gICAgICBjb25zdCBzZWNyZXRBcm4gPSAnYXJuOmF3czpzZWNyZXRzbWFuYWdlcjp1cy13ZXN0LTI6OTAxMjM0NTY3ODkwOnNlY3JldDpteXNlY3JldC0xMjM0NTYnO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBzZWNyZXQgPSBzZWNyZXRzbWFuYWdlci5TZWNyZXQuZnJvbVNlY3JldENvbXBsZXRlQXJuKHN0YWNrLCAnU2VjcmV0Jywgc2VjcmV0QXJuKTtcbiAgICAgIG5ldyBjb2RlYnVpbGQuUGlwZWxpbmVQcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IHtcbiAgICAgICAgICAnRU5WX1ZBUjEnOiB7XG4gICAgICAgICAgICB0eXBlOiBjb2RlYnVpbGQuQnVpbGRFbnZpcm9ubWVudFZhcmlhYmxlVHlwZS5TRUNSRVRTX01BTkFHRVIsXG4gICAgICAgICAgICB2YWx1ZTogc2VjcmV0LnNlY3JldEFybixcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgICAgJ0Vudmlyb25tZW50Jzoge1xuICAgICAgICAgICdFbnZpcm9ubWVudFZhcmlhYmxlcyc6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ05hbWUnOiAnRU5WX1ZBUjEnLFxuICAgICAgICAgICAgICAnVHlwZSc6ICdTRUNSRVRTX01BTkFHRVInLFxuICAgICAgICAgICAgICAnVmFsdWUnOiBzZWNyZXRBcm4sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogTWF0Y2guYXJyYXlXaXRoKFt7XG4gICAgICAgICAgICAnQWN0aW9uJzogJ3NlY3JldHNtYW5hZ2VyOkdldFNlY3JldFZhbHVlJyxcbiAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgJ1Jlc291cmNlJzogYCR7c2VjcmV0QXJufSpgLFxuICAgICAgICAgIH1dKSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAgICAgJ1BvbGljeURvY3VtZW50Jzoge1xuICAgICAgICAgICdTdGF0ZW1lbnQnOiBNYXRjaC5hcnJheVdpdGgoW3tcbiAgICAgICAgICAgICdBY3Rpb24nOiAna21zOkRlY3J5cHQnLFxuICAgICAgICAgICAgJ0VmZmVjdCc6ICdBbGxvdycsXG4gICAgICAgICAgICAnUmVzb3VyY2UnOiAnYXJuOmF3czprbXM6dXMtd2VzdC0yOjkwMTIzNDU2Nzg5MDprZXkvKicsXG4gICAgICAgICAgfV0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdzaG91bGQgZmFpbCB3aGVuIHRoZSBwYXJzZWQgQXJuIGRvZXMgbm90IGNvbnRhaW4gYSBzZWNyZXQgbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICAgIGVudmlyb25tZW50VmFyaWFibGVzOiB7XG4gICAgICAgICAgICAnRU5WX1ZBUjEnOiB7XG4gICAgICAgICAgICAgIHR5cGU6IGNvZGVidWlsZC5CdWlsZEVudmlyb25tZW50VmFyaWFibGVUeXBlLlNFQ1JFVFNfTUFOQUdFUixcbiAgICAgICAgICAgICAgdmFsdWU6ICdhcm46YXdzOnNlY3JldHNtYW5hZ2VyOnVzLXdlc3QtMjoxMjM0NTY3ODkwMTI6c2VjcmV0JyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9KS50b1Rocm93KC9TZWNyZXRNYW5hZ2VyIEFSTiBpcyBtaXNzaW5nIHRoZSBuYW1lIG9mIHRoZSBzZWNyZXQ6Lyk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Nob3VsZCBmYWlsIGNyZWF0aW5nIHdoZW4gdXNpbmcgYSBzZWNyZXQgdmFsdWUgaW4gYSBwbGFpbnRleHQgdmFyaWFibGUnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICAgICdhJzoge1xuICAgICAgICAgICAgdmFsdWU6IGBhXyR7Y2RrLlNlY3JldFZhbHVlLnNlY3JldHNNYW5hZ2VyKCdteS1zZWNyZXQnKX1fYmAsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL1BsYWludGV4dCBlbnZpcm9ubWVudCB2YXJpYWJsZSAnYScgY29udGFpbnMgYSBzZWNyZXQgdmFsdWUhLyk7XG4gIH0pO1xuXG4gIHRlc3QoXCJzaG91bGQgYWxsb3cgb3B0aW5nIG91dCBvZiB0aGUgJ3NlY3JldCB2YWx1ZSBpbiBhIHBsYWludGV4dCB2YXJpYWJsZScgdmFsaWRhdGlvblwiLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IGNvZGVidWlsZC5QaXBlbGluZVByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgICBlbnZpcm9ubWVudFZhcmlhYmxlczoge1xuICAgICAgICAgICdiJzoge1xuICAgICAgICAgICAgdmFsdWU6IGNkay5TZWNyZXRWYWx1ZS5zZWNyZXRzTWFuYWdlcignbXktc2VjcmV0JyksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgY2hlY2tTZWNyZXRzSW5QbGFpblRleHRFbnZWYXJpYWJsZXM6IGZhbHNlLFxuICAgICAgfSk7XG4gICAgfSkubm90LnRvVGhyb3coKTtcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ1RpbWVvdXRzJywgKCkgPT4ge1xuICB0ZXN0KCdjYW4gYWRkIHF1ZXVlZCB0aW1lb3V0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICAgIHNvdXJjZTogY29kZWJ1aWxkLlNvdXJjZS5zMyh7XG4gICAgICAgIGJ1Y2tldDogbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcpLFxuICAgICAgICBwYXRoOiAncGF0aCcsXG4gICAgICB9KSxcbiAgICAgIHF1ZXVlZFRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDMwKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlQnVpbGQ6OlByb2plY3QnLCB7XG4gICAgICBRdWV1ZWRUaW1lb3V0SW5NaW51dGVzOiAzMCxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIG92ZXJyaWRlIGJ1aWxkIHRpbWVvdXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgICAgYnVja2V0OiBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0JyksXG4gICAgICAgIHBhdGg6ICdwYXRoJyxcbiAgICAgIH0pLFxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLm1pbnV0ZXMoMzApLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVCdWlsZDo6UHJvamVjdCcsIHtcbiAgICAgIFRpbWVvdXRJbk1pbnV0ZXM6IDMwLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnTWF4aW11bSBjb25jdXJyZW5jeScsICgpID0+IHtcbiAgdGVzdCgnY2FuIGxpbWl0IG1heGltdW0gY29uY3VycmVuY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgY29kZWJ1aWxkLlByb2plY3Qoc3RhY2ssICdQcm9qZWN0Jywge1xuICAgICAgc291cmNlOiBjb2RlYnVpbGQuU291cmNlLnMzKHtcbiAgICAgICAgYnVja2V0OiBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0JyksXG4gICAgICAgIHBhdGg6ICdwYXRoJyxcbiAgICAgIH0pLFxuICAgICAgY29uY3VycmVudEJ1aWxkTGltaXQ6IDEsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZUJ1aWxkOjpQcm9qZWN0Jywge1xuICAgICAgQ29uY3VycmVudEJ1aWxkTGltaXQ6IDEsXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NhbiBhdXRvbWF0aWNhbGx5IGFkZCBzc20gcGVybWlzc2lvbnMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IGNvZGVidWlsZC5Qcm9qZWN0KHN0YWNrLCAnUHJvamVjdCcsIHtcbiAgICBzb3VyY2U6IGNvZGVidWlsZC5Tb3VyY2UuczMoe1xuICAgICAgYnVja2V0OiBuZXcgczMuQnVja2V0KHN0YWNrLCAnQnVja2V0JyksXG4gICAgICBwYXRoOiAncGF0aCcsXG4gICAgfSksXG4gICAgc3NtU2Vzc2lvblBlcm1pc3Npb25zOiB0cnVlLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IE1hdGNoLmFycmF5V2l0aChbXG4gICAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgIEFjdGlvbjogTWF0Y2guYXJyYXlXaXRoKFtcbiAgICAgICAgICAgICdzc21tZXNzYWdlczpDcmVhdGVDb250cm9sQ2hhbm5lbCcsXG4gICAgICAgICAgICAnc3NtbWVzc2FnZXM6Q3JlYXRlRGF0YUNoYW5uZWwnLFxuICAgICAgICAgIF0pLFxuICAgICAgICB9KSxcbiAgICAgIF0pLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdjYW4gYmUgaW1wb3J0ZWQnLCAoKSA9PiB7XG4gIHRlc3QoJ2J5IEFSTicsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBwcm9qZWN0ID0gY29kZWJ1aWxkLlByb2plY3QuZnJvbVByb2plY3RBcm4oc3RhY2ssICdQcm9qZWN0JyxcbiAgICAgICdhcm46YXdzOmNvZGVidWlsZDp1cy13ZXN0LTI6MTIzNDU2Nzg5MDEyOnByb2plY3QvTXktUHJvamVjdCcpO1xuXG4gICAgZXhwZWN0KHByb2plY3QucHJvamVjdE5hbWUpLnRvRXF1YWwoJ015LVByb2plY3QnKTtcbiAgICBleHBlY3QocHJvamVjdC5lbnYuYWNjb3VudCkudG9FcXVhbCgnMTIzNDU2Nzg5MDEyJyk7XG4gICAgZXhwZWN0KHByb2plY3QuZW52LnJlZ2lvbikudG9FcXVhbCgndXMtd2VzdC0yJyk7XG4gIH0pO1xufSk7XG4iXX0=