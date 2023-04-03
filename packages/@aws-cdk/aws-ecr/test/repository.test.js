"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const assertions_1 = require("@aws-cdk/assertions");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const cdk = require("@aws-cdk/core");
const ecr = require("../lib");
/* eslint-disable quote-props */
describe('repository', () => {
    test('construct repository', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new ecr.Repository(stack, 'Repo');
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                Repo02AC86CF: {
                    Type: 'AWS::ECR::Repository',
                    DeletionPolicy: 'Retain',
                    UpdateReplacePolicy: 'Retain',
                },
            },
        });
    });
    test('repository creation with imageScanOnPush', () => {
        // GIVEN
        const noScanStack = new cdk.Stack();
        const scanStack = new cdk.Stack();
        // WHEN
        new ecr.Repository(noScanStack, 'NoScanRepo', { imageScanOnPush: false });
        new ecr.Repository(scanStack, 'ScanRepo', { imageScanOnPush: true });
        // THEN
        assertions_1.Template.fromStack(noScanStack).hasResourceProperties('AWS::ECR::Repository', {
            ImageScanningConfiguration: {
                ScanOnPush: false,
            },
        });
        assertions_1.Template.fromStack(scanStack).hasResourceProperties('AWS::ECR::Repository', {
            ImageScanningConfiguration: {
                ScanOnPush: true,
            },
        });
    });
    test('tag-based lifecycle policy', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const repo = new ecr.Repository(stack, 'Repo');
        // WHEN
        repo.addLifecycleRule({ tagPrefixList: ['abc'], maxImageCount: 1 });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
            LifecyclePolicy: {
                // eslint-disable-next-line max-len
                LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"tagged","tagPrefixList":["abc"],"countType":"imageCountMoreThan","countNumber":1},"action":{"type":"expire"}}]}',
            },
        });
    });
    test('image tag mutability can be set', () => {
        // GIVEN
        const stack = new cdk.Stack();
        new ecr.Repository(stack, 'Repo', { imageTagMutability: ecr.TagMutability.IMMUTABLE });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
            ImageTagMutability: 'IMMUTABLE',
        });
    });
    test('add day-based lifecycle policy', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const repo = new ecr.Repository(stack, 'Repo');
        repo.addLifecycleRule({
            maxImageAge: cdk.Duration.days(5),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
            LifecyclePolicy: {
                // eslint-disable-next-line max-len
                LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"sinceImagePushed","countNumber":5,"countUnit":"days"},"action":{"type":"expire"}}]}',
            },
        });
    });
    test('add count-based lifecycle policy', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const repo = new ecr.Repository(stack, 'Repo');
        // WHEN
        repo.addLifecycleRule({
            maxImageCount: 5,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
            LifecyclePolicy: {
                // eslint-disable-next-line max-len
                LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}}]}',
            },
        });
    });
    test('mixing numbered and unnumbered rules', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const repo = new ecr.Repository(stack, 'Repo');
        // WHEN
        repo.addLifecycleRule({ tagStatus: ecr.TagStatus.TAGGED, tagPrefixList: ['a'], maxImageCount: 5 });
        repo.addLifecycleRule({ rulePriority: 10, tagStatus: ecr.TagStatus.TAGGED, tagPrefixList: ['b'], maxImageCount: 5 });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
            LifecyclePolicy: {
                // eslint-disable-next-line max-len
                LifecyclePolicyText: '{"rules":[{"rulePriority":10,"selection":{"tagStatus":"tagged","tagPrefixList":["b"],"countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}},{"rulePriority":11,"selection":{"tagStatus":"tagged","tagPrefixList":["a"],"countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}}]}',
            },
        });
    });
    test('tagstatus Any is automatically sorted to the back', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const repo = new ecr.Repository(stack, 'Repo');
        // WHEN
        repo.addLifecycleRule({ maxImageCount: 5 });
        repo.addLifecycleRule({ tagStatus: ecr.TagStatus.TAGGED, tagPrefixList: ['important'], maxImageCount: 999 });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
            LifecyclePolicy: {
                // eslint-disable-next-line max-len
                LifecyclePolicyText: '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"tagged","tagPrefixList":["important"],"countType":"imageCountMoreThan","countNumber":999},"action":{"type":"expire"}},{"rulePriority":2,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}}]}',
            },
        });
    });
    test('lifecycle rules can be added upon initialization', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new ecr.Repository(stack, 'Repo', {
            lifecycleRules: [
                { maxImageCount: 3 },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
            'LifecyclePolicy': {
                // eslint-disable-next-line max-len
                'LifecyclePolicyText': '{"rules":[{"rulePriority":1,"selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":3},"action":{"type":"expire"}}]}',
            },
        });
    });
    test('calculate repository URI', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const repo = new ecr.Repository(stack, 'Repo');
        new cdk.CfnOutput(stack, 'RepoUri', {
            value: repo.repositoryUri,
        });
        // THEN
        const arnSplit = { 'Fn::Split': [':', { 'Fn::GetAtt': ['Repo02AC86CF', 'Arn'] }] };
        assertions_1.Template.fromStack(stack).hasOutput('*', {
            'Value': {
                'Fn::Join': ['', [
                        { 'Fn::Select': [4, arnSplit] },
                        '.dkr.ecr.',
                        { 'Fn::Select': [3, arnSplit] },
                        '.',
                        { Ref: 'AWS::URLSuffix' },
                        '/',
                        { Ref: 'Repo02AC86CF' },
                    ]],
            },
        });
    });
    test('import with concrete arn', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const repo2 = ecr.Repository.fromRepositoryArn(stack, 'repo', 'arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo');
        // THEN
        expect(stack.resolve(repo2.repositoryArn)).toBe('arn:aws:ecr:us-east-1:585695036304:repository/foo/bar/foo/fooo');
        expect(stack.resolve(repo2.repositoryName)).toBe('foo/bar/foo/fooo');
    });
    test('fails if importing with token arn and no name', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN/THEN
        expect(() => {
            ecr.Repository.fromRepositoryArn(stack, 'arn', cdk.Fn.getAtt('Boom', 'Boom').toString());
        }).toThrow(/\"repositoryArn\" is a late-bound value, and therefore \"repositoryName\" is required\. Use \`fromRepositoryAttributes\` instead/);
    });
    test('import with token arn and repository name (see awslabs/aws-cdk#1232)', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const repo = ecr.Repository.fromRepositoryAttributes(stack, 'Repo', {
            repositoryArn: cdk.Fn.getAtt('Boom', 'Arn').toString(),
            repositoryName: cdk.Fn.getAtt('Boom', 'Name').toString(),
        });
        new cdk.CfnOutput(stack, 'RepoArn', {
            value: repo.repositoryArn,
        });
        new cdk.CfnOutput(stack, 'RepoName', {
            value: repo.repositoryName,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasOutput('*', {
            Value: { 'Fn::GetAtt': ['Boom', 'Arn'] },
        });
        assertions_1.Template.fromStack(stack).hasOutput('*', {
            Value: { 'Fn::GetAtt': ['Boom', 'Name'] },
        });
    });
    test('import only with a repository name (arn is deduced)', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const repo = ecr.Repository.fromRepositoryName(stack, 'just-name', 'my-repo');
        new cdk.CfnOutput(stack, 'RepoArn', {
            value: repo.repositoryArn,
        });
        new cdk.CfnOutput(stack, 'RepoName', {
            value: repo.repositoryName,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasOutput('*', {
            Value: {
                'Fn::Join': ['', [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':ecr:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':repository/my-repo',
                    ]],
            },
        });
        assertions_1.Template.fromStack(stack).hasOutput('*', {
            Value: 'my-repo',
        });
    });
    test('arnForLocalRepository can be used to render an ARN for a local repository', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const repoName = cdk.Fn.getAtt('Boom', 'Name').toString();
        // WHEN
        const repo = ecr.Repository.fromRepositoryAttributes(stack, 'Repo', {
            repositoryArn: ecr.Repository.arnForLocalRepository(repoName, stack),
            repositoryName: repoName,
        });
        new cdk.CfnOutput(stack, 'RepoArn', {
            value: repo.repositoryArn,
        });
        new cdk.CfnOutput(stack, 'RepoName', {
            value: repo.repositoryName,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasOutput('*', {
            Value: { 'Fn::GetAtt': ['Boom', 'Name'] },
        });
        assertions_1.Template.fromStack(stack).hasOutput('*', {
            Value: {
                'Fn::Join': ['', [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':ecr:',
                        { Ref: 'AWS::Region' },
                        ':',
                        { Ref: 'AWS::AccountId' },
                        ':repository/',
                        { 'Fn::GetAtt': ['Boom', 'Name'] },
                    ]],
            },
        });
    });
    test('resource policy', () => {
        // GIVEN
        const stack = new cdk.Stack();
        const repo = new ecr.Repository(stack, 'Repo');
        // WHEN
        repo.addToResourcePolicy(new iam.PolicyStatement({
            actions: ['*'],
            principals: [new iam.AnyPrincipal()],
        }));
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
            RepositoryPolicyText: {
                Statement: [
                    {
                        Action: '*',
                        Effect: 'Allow',
                        Principal: { AWS: '*' },
                    },
                ],
                Version: '2012-10-17',
            },
        });
    });
    test('fails if repository policy has no actions', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'my-stack');
        const repo = new ecr.Repository(stack, 'Repo');
        // WHEN
        repo.addToResourcePolicy(new iam.PolicyStatement({
            resources: ['*'],
            principals: [new iam.ArnPrincipal('arn')],
        }));
        // THEN
        expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
    });
    test('fails if repository policy has no IAM principals', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'my-stack');
        const repo = new ecr.Repository(stack, 'Repo');
        // WHEN
        repo.addToResourcePolicy(new iam.PolicyStatement({
            resources: ['*'],
            actions: ['ecr:*'],
        }));
        // THEN
        expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
    });
    test('default encryption configuration', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'my-stack');
        // WHEN
        new ecr.Repository(stack, 'Repo', { encryption: ecr.RepositoryEncryption.AES_256 });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                Repo02AC86CF: {
                    Type: 'AWS::ECR::Repository',
                    DeletionPolicy: 'Retain',
                    UpdateReplacePolicy: 'Retain',
                },
            },
        });
    });
    test('kms encryption configuration', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'my-stack');
        // WHEN
        new ecr.Repository(stack, 'Repo', { encryption: ecr.RepositoryEncryption.KMS });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
            EncryptionConfiguration: {
                EncryptionType: 'KMS',
            },
        });
    });
    test('kms encryption with custom kms configuration', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'my-stack');
        // WHEN
        const custom_key = new kms.Key(stack, 'Key');
        new ecr.Repository(stack, 'Repo', { encryptionKey: custom_key });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
            EncryptionConfiguration: {
                EncryptionType: 'KMS',
                KmsKey: {
                    'Fn::GetAtt': [
                        'Key961B73FD',
                        'Arn',
                    ],
                },
            },
        });
    });
    test('fails if with custom kms key and AES256 as encryption', () => {
        // GIVEN
        const app = new cdk.App();
        const stack = new cdk.Stack(app, 'my-stack');
        const custom_key = new kms.Key(stack, 'Key');
        // THEN
        expect(() => {
            new ecr.Repository(stack, 'Repo', { encryption: ecr.RepositoryEncryption.AES_256, encryptionKey: custom_key });
        }).toThrow('encryptionKey is specified, so \'encryption\' must be set to KMS (value: AES256)');
    });
    test('removal policy is "Retain" by default', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new ecr.Repository(stack, 'Repo');
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::ECR::Repository', {
            'Type': 'AWS::ECR::Repository',
            'DeletionPolicy': 'Retain',
        });
    });
    test('"Delete" removal policy can be set explicitly', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new ecr.Repository(stack, 'Repo', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResource('AWS::ECR::Repository', {
            'Type': 'AWS::ECR::Repository',
            'DeletionPolicy': 'Delete',
        });
    });
    describe('events', () => {
        test('onImagePushed without imageTag creates the correct event', () => {
            const stack = new cdk.Stack();
            const repo = new ecr.Repository(stack, 'Repo');
            repo.onCloudTrailImagePushed('EventRule', {
                target: {
                    bind: () => ({ arn: 'ARN', id: '' }),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                'EventPattern': {
                    'source': [
                        'aws.ecr',
                    ],
                    'detail': {
                        'eventName': [
                            'PutImage',
                        ],
                        'requestParameters': {
                            'repositoryName': [
                                {
                                    'Ref': 'Repo02AC86CF',
                                },
                            ],
                        },
                    },
                },
                'State': 'ENABLED',
            });
        });
        test('onImageScanCompleted without imageTags creates the correct event', () => {
            const stack = new cdk.Stack();
            const repo = new ecr.Repository(stack, 'Repo');
            repo.onImageScanCompleted('EventRule', {
                target: {
                    bind: () => ({ arn: 'ARN', id: '' }),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                'EventPattern': {
                    'source': [
                        'aws.ecr',
                    ],
                    'detail': {
                        'repository-name': [
                            {
                                'Ref': 'Repo02AC86CF',
                            },
                        ],
                        'scan-status': [
                            'COMPLETE',
                        ],
                    },
                },
                'State': 'ENABLED',
            });
        });
        test('onImageScanCompleted with one imageTag creates the correct event', () => {
            const stack = new cdk.Stack();
            const repo = new ecr.Repository(stack, 'Repo');
            repo.onImageScanCompleted('EventRule', {
                imageTags: ['some-tag'],
                target: {
                    bind: () => ({ arn: 'ARN', id: '' }),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                'EventPattern': {
                    'source': [
                        'aws.ecr',
                    ],
                    'detail': {
                        'repository-name': [
                            {
                                'Ref': 'Repo02AC86CF',
                            },
                        ],
                        'image-tags': [
                            'some-tag',
                        ],
                        'scan-status': [
                            'COMPLETE',
                        ],
                    },
                },
                'State': 'ENABLED',
            });
        });
        test('onImageScanCompleted with multiple imageTags creates the correct event', () => {
            const stack = new cdk.Stack();
            const repo = new ecr.Repository(stack, 'Repo');
            repo.onImageScanCompleted('EventRule', {
                imageTags: ['tag1', 'tag2', 'tag3'],
                target: {
                    bind: () => ({ arn: 'ARN', id: '' }),
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
                'EventPattern': {
                    'source': [
                        'aws.ecr',
                    ],
                    'detail': {
                        'repository-name': [
                            {
                                'Ref': 'Repo02AC86CF',
                            },
                        ],
                        'image-tags': [
                            'tag1',
                            'tag2',
                            'tag3',
                        ],
                        'scan-status': [
                            'COMPLETE',
                        ],
                    },
                },
                'State': 'ENABLED',
            });
        });
        test('removal policy is "Retain" by default', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new ecr.Repository(stack, 'Repo');
            // THEN
            assertions_1.Template.fromStack(stack).hasResource('AWS::ECR::Repository', {
                'Type': 'AWS::ECR::Repository',
                'DeletionPolicy': 'Retain',
            });
        });
        test('"Delete" removal policy can be set explicitly', () => {
            // GIVEN
            const stack = new cdk.Stack();
            // WHEN
            new ecr.Repository(stack, 'Repo', {
                removalPolicy: cdk.RemovalPolicy.DESTROY,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResource('AWS::ECR::Repository', {
                'Type': 'AWS::ECR::Repository',
                'DeletionPolicy': 'Delete',
            });
        });
        test('grant adds appropriate resource-*', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const repo = new ecr.Repository(stack, 'TestHarnessRepo');
            // WHEN
            repo.grantPull(new iam.AnyPrincipal());
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
                'RepositoryPolicyText': {
                    'Statement': [
                        {
                            'Action': [
                                'ecr:BatchCheckLayerAvailability',
                                'ecr:GetDownloadUrlForLayer',
                                'ecr:BatchGetImage',
                            ],
                            'Effect': 'Allow',
                            'Principal': { 'AWS': '*' },
                        },
                    ],
                    'Version': '2012-10-17',
                },
            });
        });
    });
    describe('repository name validation', () => {
        test('repository name validations', () => {
            const stack = new cdk.Stack();
            expect(() => new ecr.Repository(stack, 'Repo1', {
                repositoryName: 'abc-xyz-34ab',
            })).not.toThrow();
            expect(() => new ecr.Repository(stack, 'Repo2', {
                repositoryName: '124/pp-33',
            })).not.toThrow();
        });
        test('repository name validation skips tokenized values', () => {
            const stack = new cdk.Stack();
            expect(() => new ecr.Repository(stack, 'Repo', {
                repositoryName: cdk.Lazy.string({ produce: () => '_REPO' }),
            })).not.toThrow();
        });
        test('fails with message on invalid repository names', () => {
            const stack = new cdk.Stack();
            const repositoryName = `-repositoRy.--${new Array(256).join('$')}`;
            const expectedErrors = [
                `Invalid ECR repository name (value: ${repositoryName})`,
                'Repository name must be at least 2 and no more than 256 characters',
                'Repository name must follow the specified pattern: (?:[a-z0-9]+(?:[._-][a-z0-9]+)*/)*[a-z0-9]+(?:[._-][a-z0-9]+)*',
            ].join(os_1.EOL);
            expect(() => new ecr.Repository(stack, 'Repo', {
                repositoryName,
            })).toThrow(expectedErrors);
        });
        test('fails if repository name has less than 2 or more than 256 characters', () => {
            const stack = new cdk.Stack();
            expect(() => new ecr.Repository(stack, 'Repo1', {
                repositoryName: 'a',
            })).toThrow(/at least 2/);
            expect(() => new ecr.Repository(stack, 'Repo2', {
                repositoryName: new Array(258).join('x'),
            })).toThrow(/no more than 256/);
        });
        test('fails if repository name does not follow the specified pattern', () => {
            const stack = new cdk.Stack();
            expect(() => new ecr.Repository(stack, 'Repo1', {
                repositoryName: 'aAa',
            })).toThrow(/must follow the specified pattern/);
            expect(() => new ecr.Repository(stack, 'Repo2', {
                repositoryName: 'a--a',
            })).toThrow(/must follow the specified pattern/);
            expect(() => new ecr.Repository(stack, 'Repo3', {
                repositoryName: 'a./a-a',
            })).toThrow(/must follow the specified pattern/);
            expect(() => new ecr.Repository(stack, 'Repo4', {
                repositoryName: 'a//a-a',
            })).toThrow(/must follow the specified pattern/);
        });
        test('return value addToResourcePolicy', () => {
            // GIVEN
            const stack = new cdk.Stack();
            const policyStmt1 = new iam.PolicyStatement({
                actions: ['*'],
                principals: [new iam.AnyPrincipal()],
            });
            const policyStmt2 = new iam.PolicyStatement({
                effect: iam.Effect.DENY,
                actions: ['ecr:BatchGetImage', 'ecr:GetDownloadUrlForLayer'],
                principals: [new iam.AnyPrincipal()],
            });
            const policyText1 = '{"Statement": [{"Action": "*", "Effect": "Allow", "Principal": {"AWS": "*"}}], "Version": "2012-10-17"}';
            const policyText2 = `{"Statement": [
        {"Action": "*", "Effect": "Allow", "Principal": {"AWS": "*"}},
        {"Action": ["ecr:BatchGetImage", "ecr:GetDownloadUrlForLayer"], "Effect": "Deny", "Principal": {"AWS": "*"}}
      ], "Version": "2012-10-17"}`;
            // WHEN
            const artifact1 = new ecr.Repository(stack, 'Repo1').addToResourcePolicy(policyStmt1);
            const repo = new ecr.Repository(stack, 'Repo2');
            repo.addToResourcePolicy(policyStmt1);
            const artifact2 = repo.addToResourcePolicy(policyStmt2);
            // THEN
            expect(stack.resolve(artifact1.statementAdded)).toEqual(true);
            expect(stack.resolve(artifact1.policyDependable)).toEqual(JSON.parse(policyText1));
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
                RepositoryPolicyText: JSON.parse(policyText1),
            });
            expect(stack.resolve(artifact2.statementAdded)).toEqual(true);
            expect(stack.resolve(artifact2.policyDependable)).toEqual(JSON.parse(policyText2));
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::ECR::Repository', {
                RepositoryPolicyText: JSON.parse(policyText2),
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwb3NpdG9yeS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVwb3NpdG9yeS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQXlCO0FBQ3pCLG9EQUErQztBQUMvQyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFFOUIsZ0NBQWdDO0FBRWhDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO0lBQzFCLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLE9BQU87UUFDUCxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWxDLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUM7WUFDeEMsU0FBUyxFQUFFO2dCQUNULFlBQVksRUFBRTtvQkFDWixJQUFJLEVBQUUsc0JBQXNCO29CQUM1QixjQUFjLEVBQUUsUUFBUTtvQkFDeEIsbUJBQW1CLEVBQUUsUUFBUTtpQkFDOUI7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtRQUNwRCxRQUFRO1FBQ1IsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDcEMsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFbEMsT0FBTztRQUNQLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsWUFBWSxFQUFFLEVBQUUsZUFBZSxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDMUUsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFB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QUMscUJBQXFCLENBQUMsc0JBQXNCLEVBQUU7Z0JBQ3RFLG9CQUFvQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO2FBQzlDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVPTCB9IGZyb20gJ29zJztcbmltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlY3IgZnJvbSAnLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ3JlcG9zaXRvcnknLCAoKSA9PiB7XG4gIHRlc3QoJ2NvbnN0cnVjdCByZXBvc2l0b3J5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjci5SZXBvc2l0b3J5KHN0YWNrLCAnUmVwbycpO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBSZXBvMDJBQzg2Q0Y6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpFQ1I6OlJlcG9zaXRvcnknLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcbiAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlcG9zaXRvcnkgY3JlYXRpb24gd2l0aCBpbWFnZVNjYW5PblB1c2gnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBub1NjYW5TdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCBzY2FuU3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IGVjci5SZXBvc2l0b3J5KG5vU2NhblN0YWNrLCAnTm9TY2FuUmVwbycsIHsgaW1hZ2VTY2FuT25QdXNoOiBmYWxzZSB9KTtcbiAgICBuZXcgZWNyLlJlcG9zaXRvcnkoc2NhblN0YWNrLCAnU2NhblJlcG8nLCB7IGltYWdlU2Nhbk9uUHVzaDogdHJ1ZSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2sobm9TY2FuU3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1I6OlJlcG9zaXRvcnknLCB7XG4gICAgICBJbWFnZVNjYW5uaW5nQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBTY2FuT25QdXNoOiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHNjYW5TdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUjo6UmVwb3NpdG9yeScsIHtcbiAgICAgIEltYWdlU2Nhbm5pbmdDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIFNjYW5PblB1c2g6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCd0YWctYmFzZWQgbGlmZWN5Y2xlIHBvbGljeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHJlcG8gPSBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgcmVwby5hZGRMaWZlY3ljbGVSdWxlKHsgdGFnUHJlZml4TGlzdDogWydhYmMnXSwgbWF4SW1hZ2VDb3VudDogMSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1I6OlJlcG9zaXRvcnknLCB7XG4gICAgICBMaWZlY3ljbGVQb2xpY3k6IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgTGlmZWN5Y2xlUG9saWN5VGV4dDogJ3tcInJ1bGVzXCI6W3tcInJ1bGVQcmlvcml0eVwiOjEsXCJzZWxlY3Rpb25cIjp7XCJ0YWdTdGF0dXNcIjpcInRhZ2dlZFwiLFwidGFnUHJlZml4TGlzdFwiOltcImFiY1wiXSxcImNvdW50VHlwZVwiOlwiaW1hZ2VDb3VudE1vcmVUaGFuXCIsXCJjb3VudE51bWJlclwiOjF9LFwiYWN0aW9uXCI6e1widHlwZVwiOlwiZXhwaXJlXCJ9fV19JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltYWdlIHRhZyBtdXRhYmlsaXR5IGNhbiBiZSBzZXQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvJywgeyBpbWFnZVRhZ011dGFiaWxpdHk6IGVjci5UYWdNdXRhYmlsaXR5LklNTVVUQUJMRSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1I6OlJlcG9zaXRvcnknLCB7XG4gICAgICBJbWFnZVRhZ011dGFiaWxpdHk6ICdJTU1VVEFCTEUnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGQgZGF5LWJhc2VkIGxpZmVjeWNsZSBwb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXBvID0gbmV3IGVjci5SZXBvc2l0b3J5KHN0YWNrLCAnUmVwbycpO1xuICAgIHJlcG8uYWRkTGlmZWN5Y2xlUnVsZSh7XG4gICAgICBtYXhJbWFnZUFnZTogY2RrLkR1cmF0aW9uLmRheXMoNSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNSOjpSZXBvc2l0b3J5Jywge1xuICAgICAgTGlmZWN5Y2xlUG9saWN5OiB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgIExpZmVjeWNsZVBvbGljeVRleHQ6ICd7XCJydWxlc1wiOlt7XCJydWxlUHJpb3JpdHlcIjoxLFwic2VsZWN0aW9uXCI6e1widGFnU3RhdHVzXCI6XCJhbnlcIixcImNvdW50VHlwZVwiOlwic2luY2VJbWFnZVB1c2hlZFwiLFwiY291bnROdW1iZXJcIjo1LFwiY291bnRVbml0XCI6XCJkYXlzXCJ9LFwiYWN0aW9uXCI6e1widHlwZVwiOlwiZXhwaXJlXCJ9fV19JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCBjb3VudC1iYXNlZCBsaWZlY3ljbGUgcG9saWN5JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgcmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nKTtcblxuICAgIC8vIFdIRU5cbiAgICByZXBvLmFkZExpZmVjeWNsZVJ1bGUoe1xuICAgICAgbWF4SW1hZ2VDb3VudDogNSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1I6OlJlcG9zaXRvcnknLCB7XG4gICAgICBMaWZlY3ljbGVQb2xpY3k6IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgTGlmZWN5Y2xlUG9saWN5VGV4dDogJ3tcInJ1bGVzXCI6W3tcInJ1bGVQcmlvcml0eVwiOjEsXCJzZWxlY3Rpb25cIjp7XCJ0YWdTdGF0dXNcIjpcImFueVwiLFwiY291bnRUeXBlXCI6XCJpbWFnZUNvdW50TW9yZVRoYW5cIixcImNvdW50TnVtYmVyXCI6NX0sXCJhY3Rpb25cIjp7XCJ0eXBlXCI6XCJleHBpcmVcIn19XX0nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnbWl4aW5nIG51bWJlcmVkIGFuZCB1bm51bWJlcmVkIHJ1bGVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgY29uc3QgcmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nKTtcblxuICAgIC8vIFdIRU5cbiAgICByZXBvLmFkZExpZmVjeWNsZVJ1bGUoeyB0YWdTdGF0dXM6IGVjci5UYWdTdGF0dXMuVEFHR0VELCB0YWdQcmVmaXhMaXN0OiBbJ2EnXSwgbWF4SW1hZ2VDb3VudDogNSB9KTtcbiAgICByZXBvLmFkZExpZmVjeWNsZVJ1bGUoeyBydWxlUHJpb3JpdHk6IDEwLCB0YWdTdGF0dXM6IGVjci5UYWdTdGF0dXMuVEFHR0VELCB0YWdQcmVmaXhMaXN0OiBbJ2InXSwgbWF4SW1hZ2VDb3VudDogNSB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1I6OlJlcG9zaXRvcnknLCB7XG4gICAgICBMaWZlY3ljbGVQb2xpY3k6IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgTGlmZWN5Y2xlUG9saWN5VGV4dDogJ3tcInJ1bGVzXCI6W3tcInJ1bGVQcmlvcml0eVwiOjEwLFwic2VsZWN0aW9uXCI6e1widGFnU3RhdHVzXCI6XCJ0YWdnZWRcIixcInRhZ1ByZWZpeExpc3RcIjpbXCJiXCJdLFwiY291bnRUeXBlXCI6XCJpbWFnZUNvdW50TW9yZVRoYW5cIixcImNvdW50TnVtYmVyXCI6NX0sXCJhY3Rpb25cIjp7XCJ0eXBlXCI6XCJleHBpcmVcIn19LHtcInJ1bGVQcmlvcml0eVwiOjExLFwic2VsZWN0aW9uXCI6e1widGFnU3RhdHVzXCI6XCJ0YWdnZWRcIixcInRhZ1ByZWZpeExpc3RcIjpbXCJhXCJdLFwiY291bnRUeXBlXCI6XCJpbWFnZUNvdW50TW9yZVRoYW5cIixcImNvdW50TnVtYmVyXCI6NX0sXCJhY3Rpb25cIjp7XCJ0eXBlXCI6XCJleHBpcmVcIn19XX0nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndGFnc3RhdHVzIEFueSBpcyBhdXRvbWF0aWNhbGx5IHNvcnRlZCB0byB0aGUgYmFjaycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHJlcG8gPSBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgcmVwby5hZGRMaWZlY3ljbGVSdWxlKHsgbWF4SW1hZ2VDb3VudDogNSB9KTtcbiAgICByZXBvLmFkZExpZmVjeWNsZVJ1bGUoeyB0YWdTdGF0dXM6IGVjci5UYWdTdGF0dXMuVEFHR0VELCB0YWdQcmVmaXhMaXN0OiBbJ2ltcG9ydGFudCddLCBtYXhJbWFnZUNvdW50OiA5OTkgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNSOjpSZXBvc2l0b3J5Jywge1xuICAgICAgTGlmZWN5Y2xlUG9saWN5OiB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgICAgIExpZmVjeWNsZVBvbGljeVRleHQ6ICd7XCJydWxlc1wiOlt7XCJydWxlUHJpb3JpdHlcIjoxLFwic2VsZWN0aW9uXCI6e1widGFnU3RhdHVzXCI6XCJ0YWdnZWRcIixcInRhZ1ByZWZpeExpc3RcIjpbXCJpbXBvcnRhbnRcIl0sXCJjb3VudFR5cGVcIjpcImltYWdlQ291bnRNb3JlVGhhblwiLFwiY291bnROdW1iZXJcIjo5OTl9LFwiYWN0aW9uXCI6e1widHlwZVwiOlwiZXhwaXJlXCJ9fSx7XCJydWxlUHJpb3JpdHlcIjoyLFwic2VsZWN0aW9uXCI6e1widGFnU3RhdHVzXCI6XCJhbnlcIixcImNvdW50VHlwZVwiOlwiaW1hZ2VDb3VudE1vcmVUaGFuXCIsXCJjb3VudE51bWJlclwiOjV9LFwiYWN0aW9uXCI6e1widHlwZVwiOlwiZXhwaXJlXCJ9fV19JyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2xpZmVjeWNsZSBydWxlcyBjYW4gYmUgYWRkZWQgdXBvbiBpbml0aWFsaXphdGlvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nLCB7XG4gICAgICBsaWZlY3ljbGVSdWxlczogW1xuICAgICAgICB7IG1heEltYWdlQ291bnQ6IDMgfSxcbiAgICAgIF0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNSOjpSZXBvc2l0b3J5Jywge1xuICAgICAgJ0xpZmVjeWNsZVBvbGljeSc6IHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cbiAgICAgICAgJ0xpZmVjeWNsZVBvbGljeVRleHQnOiAne1wicnVsZXNcIjpbe1wicnVsZVByaW9yaXR5XCI6MSxcInNlbGVjdGlvblwiOntcInRhZ1N0YXR1c1wiOlwiYW55XCIsXCJjb3VudFR5cGVcIjpcImltYWdlQ291bnRNb3JlVGhhblwiLFwiY291bnROdW1iZXJcIjozfSxcImFjdGlvblwiOntcInR5cGVcIjpcImV4cGlyZVwifX1dfScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYWxjdWxhdGUgcmVwb3NpdG9yeSBVUkknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCByZXBvID0gbmV3IGVjci5SZXBvc2l0b3J5KHN0YWNrLCAnUmVwbycpO1xuXG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdSZXBvVXJpJywge1xuICAgICAgdmFsdWU6IHJlcG8ucmVwb3NpdG9yeVVyaSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCBhcm5TcGxpdCA9IHsgJ0ZuOjpTcGxpdCc6IFsnOicsIHsgJ0ZuOjpHZXRBdHQnOiBbJ1JlcG8wMkFDODZDRicsICdBcm4nXSB9XSB9O1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzT3V0cHV0KCcqJywge1xuICAgICAgJ1ZhbHVlJzoge1xuICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICB7ICdGbjo6U2VsZWN0JzogWzQsIGFyblNwbGl0XSB9LFxuICAgICAgICAgICcuZGtyLmVjci4nLFxuICAgICAgICAgIHsgJ0ZuOjpTZWxlY3QnOiBbMywgYXJuU3BsaXRdIH0sXG4gICAgICAgICAgJy4nLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpVUkxTdWZmaXgnIH0sXG4gICAgICAgICAgJy8nLFxuICAgICAgICAgIHsgUmVmOiAnUmVwbzAyQUM4NkNGJyB9LFxuICAgICAgICBdXSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydCB3aXRoIGNvbmNyZXRlIGFybicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlcG8yID0gZWNyLlJlcG9zaXRvcnkuZnJvbVJlcG9zaXRvcnlBcm4oc3RhY2ssICdyZXBvJywgJ2Fybjphd3M6ZWNyOnVzLWVhc3QtMTo1ODU2OTUwMzYzMDQ6cmVwb3NpdG9yeS9mb28vYmFyL2Zvby9mb29vJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocmVwbzIucmVwb3NpdG9yeUFybikpLnRvQmUoJ2Fybjphd3M6ZWNyOnVzLWVhc3QtMTo1ODU2OTUwMzYzMDQ6cmVwb3NpdG9yeS9mb28vYmFyL2Zvby9mb29vJyk7XG4gICAgZXhwZWN0KHN0YWNrLnJlc29sdmUocmVwbzIucmVwb3NpdG9yeU5hbWUpKS50b0JlKCdmb28vYmFyL2Zvby9mb29vJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ZhaWxzIGlmIGltcG9ydGluZyB3aXRoIHRva2VuIGFybiBhbmQgbm8gbmFtZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTi9USEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIGVjci5SZXBvc2l0b3J5LmZyb21SZXBvc2l0b3J5QXJuKHN0YWNrLCAnYXJuJywgY2RrLkZuLmdldEF0dCgnQm9vbScsICdCb29tJykudG9TdHJpbmcoKSk7XG4gICAgfSkudG9UaHJvdygvXFxcInJlcG9zaXRvcnlBcm5cXFwiIGlzIGEgbGF0ZS1ib3VuZCB2YWx1ZSwgYW5kIHRoZXJlZm9yZSBcXFwicmVwb3NpdG9yeU5hbWVcXFwiIGlzIHJlcXVpcmVkXFwuIFVzZSBcXGBmcm9tUmVwb3NpdG9yeUF0dHJpYnV0ZXNcXGAgaW5zdGVhZC8pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnQgd2l0aCB0b2tlbiBhcm4gYW5kIHJlcG9zaXRvcnkgbmFtZSAoc2VlIGF3c2xhYnMvYXdzLWNkayMxMjMyKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlcG8gPSBlY3IuUmVwb3NpdG9yeS5mcm9tUmVwb3NpdG9yeUF0dHJpYnV0ZXMoc3RhY2ssICdSZXBvJywge1xuICAgICAgcmVwb3NpdG9yeUFybjogY2RrLkZuLmdldEF0dCgnQm9vbScsICdBcm4nKS50b1N0cmluZygpLFxuICAgICAgcmVwb3NpdG9yeU5hbWU6IGNkay5Gbi5nZXRBdHQoJ0Jvb20nLCAnTmFtZScpLnRvU3RyaW5nKCksXG4gICAgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdSZXBvQXJuJywge1xuICAgICAgdmFsdWU6IHJlcG8ucmVwb3NpdG9yeUFybixcbiAgICB9KTtcbiAgICBuZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ1JlcG9OYW1lJywge1xuICAgICAgdmFsdWU6IHJlcG8ucmVwb3NpdG9yeU5hbWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNPdXRwdXQoJyonLCB7XG4gICAgICBWYWx1ZTogeyAnRm46OkdldEF0dCc6IFsnQm9vbScsICdBcm4nXSB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzT3V0cHV0KCcqJywge1xuICAgICAgVmFsdWU6IHsgJ0ZuOjpHZXRBdHQnOiBbJ0Jvb20nLCAnTmFtZSddIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydCBvbmx5IHdpdGggYSByZXBvc2l0b3J5IG5hbWUgKGFybiBpcyBkZWR1Y2VkKScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHJlcG8gPSBlY3IuUmVwb3NpdG9yeS5mcm9tUmVwb3NpdG9yeU5hbWUoc3RhY2ssICdqdXN0LW5hbWUnLCAnbXktcmVwbycpO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnUmVwb0FybicsIHtcbiAgICAgIHZhbHVlOiByZXBvLnJlcG9zaXRvcnlBcm4sXG4gICAgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdSZXBvTmFtZScsIHtcbiAgICAgIHZhbHVlOiByZXBvLnJlcG9zaXRvcnlOYW1lLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzT3V0cHV0KCcqJywge1xuICAgICAgVmFsdWU6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogWycnLCBbXG4gICAgICAgICAgJ2FybjonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpQYXJ0aXRpb24nIH0sXG4gICAgICAgICAgJzplY3I6JyxcbiAgICAgICAgICB7IFJlZjogJ0FXUzo6UmVnaW9uJyB9LFxuICAgICAgICAgICc6JyxcbiAgICAgICAgICB7IFJlZjogJ0FXUzo6QWNjb3VudElkJyB9LFxuICAgICAgICAgICc6cmVwb3NpdG9yeS9teS1yZXBvJyxcbiAgICAgICAgXV0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzT3V0cHV0KCcqJywge1xuICAgICAgVmFsdWU6ICdteS1yZXBvJyxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnYXJuRm9yTG9jYWxSZXBvc2l0b3J5IGNhbiBiZSB1c2VkIHRvIHJlbmRlciBhbiBBUk4gZm9yIGEgbG9jYWwgcmVwb3NpdG9yeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgIGNvbnN0IHJlcG9OYW1lID0gY2RrLkZuLmdldEF0dCgnQm9vbScsICdOYW1lJykudG9TdHJpbmcoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCByZXBvID0gZWNyLlJlcG9zaXRvcnkuZnJvbVJlcG9zaXRvcnlBdHRyaWJ1dGVzKHN0YWNrLCAnUmVwbycsIHtcbiAgICAgIHJlcG9zaXRvcnlBcm46IGVjci5SZXBvc2l0b3J5LmFybkZvckxvY2FsUmVwb3NpdG9yeShyZXBvTmFtZSwgc3RhY2spLFxuICAgICAgcmVwb3NpdG9yeU5hbWU6IHJlcG9OYW1lLFxuICAgIH0pO1xuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHN0YWNrLCAnUmVwb0FybicsIHtcbiAgICAgIHZhbHVlOiByZXBvLnJlcG9zaXRvcnlBcm4sXG4gICAgfSk7XG4gICAgbmV3IGNkay5DZm5PdXRwdXQoc3RhY2ssICdSZXBvTmFtZScsIHtcbiAgICAgIHZhbHVlOiByZXBvLnJlcG9zaXRvcnlOYW1lLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzT3V0cHV0KCcqJywge1xuICAgICAgVmFsdWU6IHsgJ0ZuOjpHZXRBdHQnOiBbJ0Jvb20nLCAnTmFtZSddIH0sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNPdXRwdXQoJyonLCB7XG4gICAgICBWYWx1ZToge1xuICAgICAgICAnRm46OkpvaW4nOiBbJycsIFtcbiAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgeyBSZWY6ICdBV1M6OlBhcnRpdGlvbicgfSxcbiAgICAgICAgICAnOmVjcjonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpSZWdpb24nIH0sXG4gICAgICAgICAgJzonLFxuICAgICAgICAgIHsgUmVmOiAnQVdTOjpBY2NvdW50SWQnIH0sXG4gICAgICAgICAgJzpyZXBvc2l0b3J5LycsXG4gICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnQm9vbScsICdOYW1lJ10gfSxcbiAgICAgICAgXV0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNvdXJjZSBwb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBjb25zdCByZXBvID0gbmV3IGVjci5SZXBvc2l0b3J5KHN0YWNrLCAnUmVwbycpO1xuXG4gICAgLy8gV0hFTlxuICAgIHJlcG8uYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbJyonXSxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFueVByaW5jaXBhbCgpXSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNSOjpSZXBvc2l0b3J5Jywge1xuICAgICAgUmVwb3NpdG9yeVBvbGljeVRleHQ6IHtcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnKicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBQcmluY2lwYWw6IHsgQVdTOiAnKicgfSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiByZXBvc2l0b3J5IHBvbGljeSBoYXMgbm8gYWN0aW9ucycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ215LXN0YWNrJyk7XG4gICAgY29uc3QgcmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nKTtcblxuICAgIC8vIFdIRU5cbiAgICByZXBvLmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLkFyblByaW5jaXBhbCgnYXJuJyldLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coL0EgUG9saWN5U3RhdGVtZW50IG11c3Qgc3BlY2lmeSBhdCBsZWFzdCBvbmUgXFwnYWN0aW9uXFwnIG9yIFxcJ25vdEFjdGlvblxcJy8pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyBpZiByZXBvc2l0b3J5IHBvbGljeSBoYXMgbm8gSUFNIHByaW5jaXBhbHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdteS1zdGFjaycpO1xuICAgIGNvbnN0IHJlcG8gPSBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgcmVwby5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgICBhY3Rpb25zOiBbJ2VjcjoqJ10sXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygvQSBQb2xpY3lTdGF0ZW1lbnQgdXNlZCBpbiBhIHJlc291cmNlLWJhc2VkIHBvbGljeSBtdXN0IHNwZWNpZnkgYXQgbGVhc3Qgb25lIElBTSBwcmluY2lwYWwvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVmYXVsdCBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdteS1zdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nLCB7IGVuY3J5cHRpb246IGVjci5SZXBvc2l0b3J5RW5jcnlwdGlvbi5BRVNfMjU2IH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBSZXBvMDJBQzg2Q0Y6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpFQ1I6OlJlcG9zaXRvcnknLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcbiAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ttcyBlbmNyeXB0aW9uIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdteS1zdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nLCB7IGVuY3J5cHRpb246IGVjci5SZXBvc2l0b3J5RW5jcnlwdGlvbi5LTVMgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNSOjpSZXBvc2l0b3J5JyxcbiAgICAgIHtcbiAgICAgICAgRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBFbmNyeXB0aW9uVHlwZTogJ0tNUycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgna21zIGVuY3J5cHRpb24gd2l0aCBjdXN0b20ga21zIGNvbmZpZ3VyYXRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdteS1zdGFjaycpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGN1c3RvbV9rZXkgPSBuZXcga21zLktleShzdGFjaywgJ0tleScpO1xuICAgIG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nLCB7IGVuY3J5cHRpb25LZXk6IGN1c3RvbV9rZXkgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNSOjpSZXBvc2l0b3J5JyxcbiAgICAgIHtcbiAgICAgICAgRW5jcnlwdGlvbkNvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBFbmNyeXB0aW9uVHlwZTogJ0tNUycsXG4gICAgICAgICAgS21zS2V5OiB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ0tleTk2MUI3M0ZEJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgaWYgd2l0aCBjdXN0b20ga21zIGtleSBhbmQgQUVTMjU2IGFzIGVuY3J5cHRpb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdteS1zdGFjaycpO1xuICAgIGNvbnN0IGN1c3RvbV9rZXkgPSBuZXcga21zLktleShzdGFjaywgJ0tleScpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvJywgeyBlbmNyeXB0aW9uOiBlY3IuUmVwb3NpdG9yeUVuY3J5cHRpb24uQUVTXzI1NiwgZW5jcnlwdGlvbktleTogY3VzdG9tX2tleSB9KTtcbiAgICB9KS50b1Rocm93KCdlbmNyeXB0aW9uS2V5IGlzIHNwZWNpZmllZCwgc28gXFwnZW5jcnlwdGlvblxcJyBtdXN0IGJlIHNldCB0byBLTVMgKHZhbHVlOiBBRVMyNTYpJyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlbW92YWwgcG9saWN5IGlzIFwiUmV0YWluXCIgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkVDUjo6UmVwb3NpdG9yeScsIHtcbiAgICAgICdUeXBlJzogJ0FXUzo6RUNSOjpSZXBvc2l0b3J5JyxcbiAgICAgICdEZWxldGlvblBvbGljeSc6ICdSZXRhaW4nLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdcIkRlbGV0ZVwiIHJlbW92YWwgcG9saWN5IGNhbiBiZSBzZXQgZXhwbGljaXRseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUNSOjpSZXBvc2l0b3J5Jywge1xuICAgICAgJ1R5cGUnOiAnQVdTOjpFQ1I6OlJlcG9zaXRvcnknLFxuICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ0RlbGV0ZScsXG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdldmVudHMnLCAoKSA9PiB7XG4gICAgdGVzdCgnb25JbWFnZVB1c2hlZCB3aXRob3V0IGltYWdlVGFnIGNyZWF0ZXMgdGhlIGNvcnJlY3QgZXZlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHJlcG8gPSBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvJyk7XG5cbiAgICAgIHJlcG8ub25DbG91ZFRyYWlsSW1hZ2VQdXNoZWQoJ0V2ZW50UnVsZScsIHtcbiAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgYmluZDogKCkgPT4gKHsgYXJuOiAnQVJOJywgaWQ6ICcnIH0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgJ0V2ZW50UGF0dGVybic6IHtcbiAgICAgICAgICAnc291cmNlJzogW1xuICAgICAgICAgICAgJ2F3cy5lY3InLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgJ2RldGFpbCc6IHtcbiAgICAgICAgICAgICdldmVudE5hbWUnOiBbXG4gICAgICAgICAgICAgICdQdXRJbWFnZScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3JlcXVlc3RQYXJhbWV0ZXJzJzoge1xuICAgICAgICAgICAgICAncmVwb3NpdG9yeU5hbWUnOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJ1JlZic6ICdSZXBvMDJBQzg2Q0YnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdTdGF0ZSc6ICdFTkFCTEVEJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnb25JbWFnZVNjYW5Db21wbGV0ZWQgd2l0aG91dCBpbWFnZVRhZ3MgY3JlYXRlcyB0aGUgY29ycmVjdCBldmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nKTtcblxuICAgICAgcmVwby5vbkltYWdlU2NhbkNvbXBsZXRlZCgnRXZlbnRSdWxlJywge1xuICAgICAgICB0YXJnZXQ6IHtcbiAgICAgICAgICBiaW5kOiAoKSA9PiAoeyBhcm46ICdBUk4nLCBpZDogJycgfSksXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpSdWxlJywge1xuICAgICAgICAnRXZlbnRQYXR0ZXJuJzoge1xuICAgICAgICAgICdzb3VyY2UnOiBbXG4gICAgICAgICAgICAnYXdzLmVjcicsXG4gICAgICAgICAgXSxcbiAgICAgICAgICAnZGV0YWlsJzoge1xuICAgICAgICAgICAgJ3JlcG9zaXRvcnktbmFtZSc6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICdSZWYnOiAnUmVwbzAyQUM4NkNGJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAnc2Nhbi1zdGF0dXMnOiBbXG4gICAgICAgICAgICAgICdDT01QTEVURScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgICdTdGF0ZSc6ICdFTkFCTEVEJyxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnb25JbWFnZVNjYW5Db21wbGV0ZWQgd2l0aCBvbmUgaW1hZ2VUYWcgY3JlYXRlcyB0aGUgY29ycmVjdCBldmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nKTtcblxuICAgICAgcmVwby5vbkltYWdlU2NhbkNvbXBsZXRlZCgnRXZlbnRSdWxlJywge1xuICAgICAgICBpbWFnZVRhZ3M6IFsnc29tZS10YWcnXSxcbiAgICAgICAgdGFyZ2V0OiB7XG4gICAgICAgICAgYmluZDogKCkgPT4gKHsgYXJuOiAnQVJOJywgaWQ6ICcnIH0pLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6UnVsZScsIHtcbiAgICAgICAgJ0V2ZW50UGF0dGVybic6IHtcbiAgICAgICAgICAnc291cmNlJzogW1xuICAgICAgICAgICAgJ2F3cy5lY3InLFxuICAgICAgICAgIF0sXG4gICAgICAgICAgJ2RldGFpbCc6IHtcbiAgICAgICAgICAgICdyZXBvc2l0b3J5LW5hbWUnOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnUmVmJzogJ1JlcG8wMkFDODZDRicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ2ltYWdlLXRhZ3MnOiBbXG4gICAgICAgICAgICAgICdzb21lLXRhZycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgJ3NjYW4tc3RhdHVzJzogW1xuICAgICAgICAgICAgICAnQ09NUExFVEUnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICAnU3RhdGUnOiAnRU5BQkxFRCcsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ29uSW1hZ2VTY2FuQ29tcGxldGVkIHdpdGggbXVsdGlwbGUgaW1hZ2VUYWdzIGNyZWF0ZXMgdGhlIGNvcnJlY3QgZXZlbnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHJlcG8gPSBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvJyk7XG5cbiAgICAgIHJlcG8ub25JbWFnZVNjYW5Db21wbGV0ZWQoJ0V2ZW50UnVsZScsIHtcbiAgICAgICAgaW1hZ2VUYWdzOiBbJ3RhZzEnLCAndGFnMicsICd0YWczJ10sXG4gICAgICAgIHRhcmdldDoge1xuICAgICAgICAgIGJpbmQ6ICgpID0+ICh7IGFybjogJ0FSTicsIGlkOiAnJyB9KSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OlJ1bGUnLCB7XG4gICAgICAgICdFdmVudFBhdHRlcm4nOiB7XG4gICAgICAgICAgJ3NvdXJjZSc6IFtcbiAgICAgICAgICAgICdhd3MuZWNyJyxcbiAgICAgICAgICBdLFxuICAgICAgICAgICdkZXRhaWwnOiB7XG4gICAgICAgICAgICAncmVwb3NpdG9yeS1uYW1lJzogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ1JlZic6ICdSZXBvMDJBQzg2Q0YnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdpbWFnZS10YWdzJzogW1xuICAgICAgICAgICAgICAndGFnMScsXG4gICAgICAgICAgICAgICd0YWcyJyxcbiAgICAgICAgICAgICAgJ3RhZzMnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICdzY2FuLXN0YXR1cyc6IFtcbiAgICAgICAgICAgICAgJ0NPTVBMRVRFJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgJ1N0YXRlJzogJ0VOQUJMRUQnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdyZW1vdmFsIHBvbGljeSBpcyBcIlJldGFpblwiIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nKTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQVdTOjpFQ1I6OlJlcG9zaXRvcnknLCB7XG4gICAgICAgICdUeXBlJzogJ0FXUzo6RUNSOjpSZXBvc2l0b3J5JyxcbiAgICAgICAgJ0RlbGV0aW9uUG9saWN5JzogJ1JldGFpbicsXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ1wiRGVsZXRlXCIgcmVtb3ZhbCBwb2xpY3kgY2FuIGJlIHNldCBleHBsaWNpdGx5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvJywge1xuICAgICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2UoJ0FXUzo6RUNSOjpSZXBvc2l0b3J5Jywge1xuICAgICAgICAnVHlwZSc6ICdBV1M6OkVDUjo6UmVwb3NpdG9yeScsXG4gICAgICAgICdEZWxldGlvblBvbGljeSc6ICdEZWxldGUnLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdncmFudCBhZGRzIGFwcHJvcHJpYXRlIHJlc291cmNlLSonLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgICBjb25zdCByZXBvID0gbmV3IGVjci5SZXBvc2l0b3J5KHN0YWNrLCAnVGVzdEhhcm5lc3NSZXBvJyk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIHJlcG8uZ3JhbnRQdWxsKG5ldyBpYW0uQW55UHJpbmNpcGFsKCkpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFQ1I6OlJlcG9zaXRvcnknLCB7XG4gICAgICAgICdSZXBvc2l0b3J5UG9saWN5VGV4dCc6IHtcbiAgICAgICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnQWN0aW9uJzogW1xuICAgICAgICAgICAgICAgICdlY3I6QmF0Y2hDaGVja0xheWVyQXZhaWxhYmlsaXR5JyxcbiAgICAgICAgICAgICAgICAnZWNyOkdldERvd25sb2FkVXJsRm9yTGF5ZXInLFxuICAgICAgICAgICAgICAgICdlY3I6QmF0Y2hHZXRJbWFnZScsXG4gICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICAgICAnUHJpbmNpcGFsJzogeyAnQVdTJzogJyonIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3JlcG9zaXRvcnkgbmFtZSB2YWxpZGF0aW9uJywgKCkgPT4ge1xuICAgIHRlc3QoJ3JlcG9zaXRvcnkgbmFtZSB2YWxpZGF0aW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGVjci5SZXBvc2l0b3J5KHN0YWNrLCAnUmVwbzEnLCB7XG4gICAgICAgIHJlcG9zaXRvcnlOYW1lOiAnYWJjLXh5ei0zNGFiJyxcbiAgICAgIH0pKS5ub3QudG9UaHJvdygpO1xuXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGVjci5SZXBvc2l0b3J5KHN0YWNrLCAnUmVwbzInLCB7XG4gICAgICAgIHJlcG9zaXRvcnlOYW1lOiAnMTI0L3BwLTMzJyxcbiAgICAgIH0pKS5ub3QudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgncmVwb3NpdG9yeSBuYW1lIHZhbGlkYXRpb24gc2tpcHMgdG9rZW5pemVkIHZhbHVlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGVjci5SZXBvc2l0b3J5KHN0YWNrLCAnUmVwbycsIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6IGNkay5MYXp5LnN0cmluZyh7IHByb2R1Y2U6ICgpID0+ICdfUkVQTycgfSksXG4gICAgICB9KSkubm90LnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIHdpdGggbWVzc2FnZSBvbiBpbnZhbGlkIHJlcG9zaXRvcnkgbmFtZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICAgIGNvbnN0IHJlcG9zaXRvcnlOYW1lID0gYC1yZXBvc2l0b1J5Li0tJHtuZXcgQXJyYXkoMjU2KS5qb2luKCckJyl9YDtcbiAgICAgIGNvbnN0IGV4cGVjdGVkRXJyb3JzID0gW1xuICAgICAgICBgSW52YWxpZCBFQ1IgcmVwb3NpdG9yeSBuYW1lICh2YWx1ZTogJHtyZXBvc2l0b3J5TmFtZX0pYCxcbiAgICAgICAgJ1JlcG9zaXRvcnkgbmFtZSBtdXN0IGJlIGF0IGxlYXN0IDIgYW5kIG5vIG1vcmUgdGhhbiAyNTYgY2hhcmFjdGVycycsXG4gICAgICAgICdSZXBvc2l0b3J5IG5hbWUgbXVzdCBmb2xsb3cgdGhlIHNwZWNpZmllZCBwYXR0ZXJuOiAoPzpbYS16MC05XSsoPzpbLl8tXVthLXowLTldKykqLykqW2EtejAtOV0rKD86Wy5fLV1bYS16MC05XSspKicsXG4gICAgICBdLmpvaW4oRU9MKTtcblxuICAgICAgZXhwZWN0KCgpID0+IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8nLCB7XG4gICAgICAgIHJlcG9zaXRvcnlOYW1lLFxuICAgICAgfSkpLnRvVGhyb3coZXhwZWN0ZWRFcnJvcnMpO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnZmFpbHMgaWYgcmVwb3NpdG9yeSBuYW1lIGhhcyBsZXNzIHRoYW4gMiBvciBtb3JlIHRoYW4gMjU2IGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgICAgZXhwZWN0KCgpID0+IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8xJywge1xuICAgICAgICByZXBvc2l0b3J5TmFtZTogJ2EnLFxuICAgICAgfSkpLnRvVGhyb3coL2F0IGxlYXN0IDIvKTtcblxuICAgICAgZXhwZWN0KCgpID0+IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8yJywge1xuICAgICAgICByZXBvc2l0b3J5TmFtZTogbmV3IEFycmF5KDI1OCkuam9pbigneCcpLFxuICAgICAgfSkpLnRvVGhyb3coL25vIG1vcmUgdGhhbiAyNTYvKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2ZhaWxzIGlmIHJlcG9zaXRvcnkgbmFtZSBkb2VzIG5vdCBmb2xsb3cgdGhlIHNwZWNpZmllZCBwYXR0ZXJuJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvMScsIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdhQWEnLFxuICAgICAgfSkpLnRvVGhyb3coL211c3QgZm9sbG93IHRoZSBzcGVjaWZpZWQgcGF0dGVybi8pO1xuXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGVjci5SZXBvc2l0b3J5KHN0YWNrLCAnUmVwbzInLCB7XG4gICAgICAgIHJlcG9zaXRvcnlOYW1lOiAnYS0tYScsXG4gICAgICB9KSkudG9UaHJvdygvbXVzdCBmb2xsb3cgdGhlIHNwZWNpZmllZCBwYXR0ZXJuLyk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvMycsIHtcbiAgICAgICAgcmVwb3NpdG9yeU5hbWU6ICdhLi9hLWEnLFxuICAgICAgfSkpLnRvVGhyb3coL211c3QgZm9sbG93IHRoZSBzcGVjaWZpZWQgcGF0dGVybi8pO1xuXG4gICAgICBleHBlY3QoKCkgPT4gbmV3IGVjci5SZXBvc2l0b3J5KHN0YWNrLCAnUmVwbzQnLCB7XG4gICAgICAgIHJlcG9zaXRvcnlOYW1lOiAnYS8vYS1hJyxcbiAgICAgIH0pKS50b1Rocm93KC9tdXN0IGZvbGxvdyB0aGUgc3BlY2lmaWVkIHBhdHRlcm4vKTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3JldHVybiB2YWx1ZSBhZGRUb1Jlc291cmNlUG9saWN5JywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICAgICAgY29uc3QgcG9saWN5U3RtdDEgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsnKiddLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHBvbGljeVN0bXQyID0gbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuREVOWSxcbiAgICAgICAgYWN0aW9uczogWydlY3I6QmF0Y2hHZXRJbWFnZScsICdlY3I6R2V0RG93bmxvYWRVcmxGb3JMYXllciddLFxuICAgICAgICBwcmluY2lwYWxzOiBbbmV3IGlhbS5BbnlQcmluY2lwYWwoKV0sXG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHBvbGljeVRleHQxID0gJ3tcIlN0YXRlbWVudFwiOiBbe1wiQWN0aW9uXCI6IFwiKlwiLCBcIkVmZmVjdFwiOiBcIkFsbG93XCIsIFwiUHJpbmNpcGFsXCI6IHtcIkFXU1wiOiBcIipcIn19XSwgXCJWZXJzaW9uXCI6IFwiMjAxMi0xMC0xN1wifSc7XG4gICAgICBjb25zdCBwb2xpY3lUZXh0MiA9IGB7XCJTdGF0ZW1lbnRcIjogW1xuICAgICAgICB7XCJBY3Rpb25cIjogXCIqXCIsIFwiRWZmZWN0XCI6IFwiQWxsb3dcIiwgXCJQcmluY2lwYWxcIjoge1wiQVdTXCI6IFwiKlwifX0sXG4gICAgICAgIHtcIkFjdGlvblwiOiBbXCJlY3I6QmF0Y2hHZXRJbWFnZVwiLCBcImVjcjpHZXREb3dubG9hZFVybEZvckxheWVyXCJdLCBcIkVmZmVjdFwiOiBcIkRlbnlcIiwgXCJQcmluY2lwYWxcIjoge1wiQVdTXCI6IFwiKlwifX1cbiAgICAgIF0sIFwiVmVyc2lvblwiOiBcIjIwMTItMTAtMTdcIn1gO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBjb25zdCBhcnRpZmFjdDEgPSBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvMScpLmFkZFRvUmVzb3VyY2VQb2xpY3kocG9saWN5U3RtdDEpO1xuICAgICAgY29uc3QgcmVwbyA9IG5ldyBlY3IuUmVwb3NpdG9yeShzdGFjaywgJ1JlcG8yJyk7XG4gICAgICByZXBvLmFkZFRvUmVzb3VyY2VQb2xpY3kocG9saWN5U3RtdDEpO1xuICAgICAgY29uc3QgYXJ0aWZhY3QyID1yZXBvLmFkZFRvUmVzb3VyY2VQb2xpY3kocG9saWN5U3RtdDIpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShhcnRpZmFjdDEuc3RhdGVtZW50QWRkZWQpKS50b0VxdWFsKHRydWUpO1xuICAgICAgZXhwZWN0KHN0YWNrLnJlc29sdmUoYXJ0aWZhY3QxLnBvbGljeURlcGVuZGFibGUpKS50b0VxdWFsKEpTT04ucGFyc2UocG9saWN5VGV4dDEpKTtcbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUjo6UmVwb3NpdG9yeScsIHtcbiAgICAgICAgUmVwb3NpdG9yeVBvbGljeVRleHQ6IEpTT04ucGFyc2UocG9saWN5VGV4dDEpLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdChzdGFjay5yZXNvbHZlKGFydGlmYWN0Mi5zdGF0ZW1lbnRBZGRlZCkpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShhcnRpZmFjdDIucG9saWN5RGVwZW5kYWJsZSkpLnRvRXF1YWwoSlNPTi5wYXJzZShwb2xpY3lUZXh0MikpO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RUNSOjpSZXBvc2l0b3J5Jywge1xuICAgICAgICBSZXBvc2l0b3J5UG9saWN5VGV4dDogSlNPTi5wYXJzZShwb2xpY3lUZXh0MiksXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==