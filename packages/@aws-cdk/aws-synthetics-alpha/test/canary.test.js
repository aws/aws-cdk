"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const assertions_1 = require("aws-cdk-lib/assertions");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const synthetics = require("../lib");
test('Basic canary properties work', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        canaryName: 'mycanary',
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        successRetentionPeriod: aws_cdk_lib_1.Duration.days(10),
        failureRetentionPeriod: aws_cdk_lib_1.Duration.days(10),
        startAfterCreation: false,
        timeToLive: aws_cdk_lib_1.Duration.minutes(30),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        Name: 'mycanary',
        SuccessRetentionPeriod: 10,
        FailureRetentionPeriod: 10,
        StartCanaryAfterCreation: false,
        Schedule: assertions_1.Match.objectLike({ DurationInSeconds: '1800' }),
        RuntimeVersion: 'syn-nodejs-puppeteer-3.8',
    });
});
test('cleanup.LAMBDA introduces custom resource to delete lambda', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code'),
        }),
        cleanup: synthetics.Cleanup.LAMBDA,
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).resourceCountIs('Custom::SyntheticsAutoDeleteUnderlyingResources', 1);
});
test('Canary can have generated name', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        Name: 'canary',
    });
});
test('Name validation does not fail when using Tokens', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        canaryName: aws_cdk_lib_1.Lazy.string({ produce: () => 'My Canary' }),
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN: no exception
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::Synthetics::Canary', 1);
});
test('Throws when name is specified incorrectly', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // THEN
    expect(() => new synthetics.Canary(stack, 'Canary', {
        canaryName: 'My Canary',
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    }))
        .toThrowError('Canary name must be lowercase, numbers, hyphens, or underscores (got "My Canary")');
});
test('Throws when name has more than 21 characters', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // THEN
    expect(() => new synthetics.Canary(stack, 'Canary', {
        canaryName: 'a'.repeat(22),
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    }))
        .toThrowError(`Canary name is too large, must be between 1 and 21 characters, but is 22 (got "${'a'.repeat(22)}")`);
});
test('An existing role can be specified instead of auto-created', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    const role = new iam.Role(stack, 'role', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    // role.addToPolicy(/* required permissions per the documentation */);
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        role,
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        ExecutionRoleArn: stack.resolve(role.roleArn),
    });
});
test('An auto-generated bucket can have lifecycle rules', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    const lifecycleRules = [{
            expiration: aws_cdk_lib_1.Duration.days(30),
        }];
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        artifactsBucketLifecycleRules: lifecycleRules,
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::S3::Bucket', {
        LifecycleConfiguration: {
            Rules: [
                {
                    ExpirationInDays: 30,
                },
            ],
        },
    });
});
test('An existing bucket and prefix can be specified instead of auto-created', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    const bucket = new s3.Bucket(stack, 'mytestbucket');
    const prefix = 'canary';
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        artifactsBucketLocation: { bucket, prefix },
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        ArtifactS3Location: stack.resolve(bucket.s3UrlForObject(prefix)),
    });
});
test('Runtime can be specified', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        RuntimeVersion: 'syn-nodejs-puppeteer-3.8',
    });
});
test('Python runtime can be specified', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        runtime: synthetics.Runtime.SYNTHETICS_PYTHON_SELENIUM_1_3,
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('# Synthetics handler code'),
        }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        RuntimeVersion: 'syn-python-selenium-1.3',
    });
});
test('environment variables can be specified', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    const environmentVariables = {
        TEST_KEY_1: 'TEST_VALUE_1',
        TEST_KEY_2: 'TEST_VALUE_2',
    };
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        environmentVariables: environmentVariables,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        RunConfig: {
            EnvironmentVariables: environmentVariables,
        },
    });
});
test('environment variables are skipped if not provided', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        RunConfig: assertions_1.Match.absent(),
    });
});
test('Runtime can be customized', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        runtime: new synthetics.Runtime('fancy-future-runtime-1337.42', synthetics.RuntimeFamily.OTHER),
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        RuntimeVersion: 'fancy-future-runtime-1337.42',
    });
});
test('Schedule can be set with Rate', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        schedule: synthetics.Schedule.rate(aws_cdk_lib_1.Duration.minutes(3)),
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        Schedule: assertions_1.Match.objectLike({ Expression: 'rate(3 minutes)' }),
    });
});
test('Schedule can be set to 1 minute', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        schedule: synthetics.Schedule.rate(aws_cdk_lib_1.Duration.minutes(1)),
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        Schedule: assertions_1.Match.objectLike({ Expression: 'rate(1 minute)' }),
    });
});
test('Schedule can be set with Cron', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        schedule: synthetics.Schedule.cron({ minute: '30' }),
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        Schedule: assertions_1.Match.objectLike({ Expression: 'cron(30 * * * ? *)' }),
    });
});
test('Schedule can be set with Expression', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        schedule: synthetics.Schedule.expression('rate(1 hour)'),
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        Schedule: assertions_1.Match.objectLike({ Expression: 'rate(1 hour)' }),
    });
});
test('Schedule can be set to run once', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        schedule: synthetics.Schedule.once(),
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        Schedule: assertions_1.Match.objectLike({ Expression: 'rate(0 minutes)' }),
    });
});
test('Throws when rate above 60 minutes', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // THEN
    expect(() => new synthetics.Canary(stack, 'Canary', {
        schedule: synthetics.Schedule.rate(aws_cdk_lib_1.Duration.minutes(61)),
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    }))
        .toThrowError('Schedule duration must be between 1 and 60 minutes');
});
test('Throws when rate above is not a whole number of minutes', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // THEN
    expect(() => new synthetics.Canary(stack, 'Canary', {
        schedule: synthetics.Schedule.rate(aws_cdk_lib_1.Duration.seconds(59)),
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    }))
        .toThrowError('\'59 seconds\' cannot be converted into a whole number of minutes.');
});
test('Can share artifacts bucket between canaries', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    const canary1 = new synthetics.Canary(stack, 'Canary1', {
        schedule: synthetics.Schedule.once(),
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    const canary2 = new synthetics.Canary(stack, 'Canary2', {
        schedule: synthetics.Schedule.once(),
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        artifactsBucketLocation: { bucket: canary1.artifactsBucket },
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    expect(canary1.artifactsBucket).toEqual(canary2.artifactsBucket);
});
test('can specify custom test', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline(`
        exports.handler = async () => {
          console.log(\'hello world\');
        };`),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        Code: {
            Handler: 'index.handler',
            Script: `
        exports.handler = async () => {
          console.log(\'hello world\');
        };`,
        },
    });
});
describe('canary in a vpc', () => {
    test('can specify vpc', () => {
        // GIVEN
        const stack = new aws_cdk_lib_1.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });
        // WHEN
        new synthetics.Canary(stack, 'Canary', {
            test: synthetics.Test.custom({
                handler: 'index.handler',
                code: synthetics.Code.fromInline(`
          exports.handler = async () => {
            console.log(\'hello world\');
          };`),
            }),
            runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
            Code: {
                Handler: 'index.handler',
                Script: `
          exports.handler = async () => {
            console.log(\'hello world\');
          };`,
            },
            VPCConfig: {
                VpcId: {
                    Ref: assertions_1.Match.anyValue(),
                },
            },
        });
    });
    test('default security group and subnets', () => {
        // GIVEN
        const stack = new aws_cdk_lib_1.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });
        // WHEN
        new synthetics.Canary(stack, 'Canary', {
            test: synthetics.Test.custom({
                handler: 'index.handler',
                code: synthetics.Code.fromInline(`
          exports.handler = async () => {
            console.log(\'hello world\');
          };`),
            }),
            runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
            vpc,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
            Code: {
                Handler: 'index.handler',
                Script: `
          exports.handler = async () => {
            console.log(\'hello world\');
          };`,
            },
            VPCConfig: {
                VpcId: {
                    Ref: assertions_1.Match.anyValue(),
                },
                SecurityGroupIds: assertions_1.Match.anyValue(),
                SubnetIds: [...vpc.privateSubnets.map(subnet => ({ Ref: assertions_1.Match.stringLikeRegexp(subnet.node.id) }))],
            },
        });
    });
    test('provided security group', () => {
        // GIVEN
        const stack = new aws_cdk_lib_1.Stack();
        const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });
        const sg = new ec2.SecurityGroup(stack, 'Sg', { vpc });
        // WHEN
        new synthetics.Canary(stack, 'Canary', {
            test: synthetics.Test.custom({
                handler: 'index.handler',
                code: synthetics.Code.fromInline(`
          exports.handler = async () => {
            console.log(\'hello world\');
          };`),
            }),
            runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
            vpc,
            securityGroups: [sg],
        });
        // THEN
        const template = assertions_1.Template.fromStack(stack);
        const sgTemplate = template.findResources('AWS::EC2::SecurityGroup');
        const sgIds = Object.keys(sgTemplate);
        expect(sgIds).toHaveLength(1);
        template.hasResourceProperties('AWS::Synthetics::Canary', {
            Code: {
                Handler: 'index.handler',
                Script: `
          exports.handler = async () => {
            console.log(\'hello world\');
          };`,
            },
            VPCConfig: {
                VpcId: {
                    Ref: assertions_1.Match.anyValue(),
                },
                SecurityGroupIds: [{ 'Fn::GetAtt': [sgIds[0], 'GroupId'] }],
            },
        });
    });
});
test('Role policy generated as expected', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        test: synthetics.Test.custom({
            handler: 'index.handler',
            code: synthetics.Code.fromInline('/* Synthetics handler code */'),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
        Policies: [{
                PolicyDocument: {
                    Statement: [
                        {
                            Action: 's3:ListAllMyBuckets',
                            Effect: 'Allow',
                            Resource: '*',
                        },
                        {
                            Action: 's3:GetBucketLocation',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::GetAtt': [
                                    'CanaryArtifactsBucket4A60D32B',
                                    'Arn',
                                ],
                            },
                        },
                        {
                            Action: 's3:PutObject',
                            Effect: 'Allow',
                            Resource: {
                                'Fn::Join': [
                                    '',
                                    [
                                        {
                                            'Fn::GetAtt': [
                                                'CanaryArtifactsBucket4A60D32B',
                                                'Arn',
                                            ],
                                        },
                                        '/*',
                                    ],
                                ],
                            },
                        },
                        {
                            Action: 'cloudwatch:PutMetricData',
                            Condition: {
                                StringEquals: {
                                    'cloudwatch:namespace': 'CloudWatchSynthetics',
                                },
                            },
                            Effect: 'Allow',
                            Resource: '*',
                        },
                        {
                            Action: [
                                'logs:CreateLogStream',
                                'logs:CreateLogGroup',
                                'logs:PutLogEvents',
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
                                        ':logs:',
                                        {
                                            Ref: 'AWS::Region',
                                        },
                                        ':',
                                        {
                                            Ref: 'AWS::AccountId',
                                        },
                                        ':log-group:/aws/lambda/cwsyn-*',
                                    ],
                                ],
                            },
                        },
                    ],
                },
            }],
    });
});
test('Should create handler with path for recent runtimes', () => {
    // GIVEN
    const stack = new aws_cdk_lib_1.Stack();
    // WHEN
    new synthetics.Canary(stack, 'Canary', {
        canaryName: 'mycanary',
        test: synthetics.Test.custom({
            handler: 'folder/canary.functionName',
            code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
        }),
        runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_8,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Synthetics::Canary', {
        Name: 'mycanary',
        Code: {
            Handler: 'folder/canary.functionName',
        },
        RuntimeVersion: 'syn-nodejs-puppeteer-3.8',
    });
});
describe('handler validation', () => {
    test('legacy runtimes', () => {
        const stack = new aws_cdk_lib_1.Stack();
        expect(() => {
            new synthetics.Canary(stack, 'Canary', {
                test: synthetics.Test.custom({
                    handler: 'index.functionName',
                    code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
                }),
                runtime: synthetics.Runtime.SYNTHETICS_PYTHON_SELENIUM_1_0,
            });
        }).toThrow(/Canary Handler must be specified as 'fileName.handler' for legacy runtimes/);
    });
    test('recent runtimes', () => {
        const stack = new aws_cdk_lib_1.Stack();
        expect(() => {
            new synthetics.Canary(stack, 'Canary', {
                test: synthetics.Test.custom({
                    handler: 'invalidHandler',
                    code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
                }),
                runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_9,
            });
        }).toThrow(/Canary Handler must be specified either as 'fileName.handler', 'fileName.functionName', or 'folder\/fileName.functionName'/);
        expect(() => {
            new synthetics.Canary(stack, 'Canary1', {
                test: synthetics.Test.custom({
                    handler: 'canary.functionName',
                    code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
                }),
                runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_9,
            });
        }).not.toThrow();
        expect(() => {
            new synthetics.Canary(stack, 'Canary2', {
                test: synthetics.Test.custom({
                    handler: 'folder/canary.functionName',
                    code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
                }),
                runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_9,
            });
        }).not.toThrow();
    });
    test('handler length', () => {
        const stack = new aws_cdk_lib_1.Stack();
        expect(() => {
            new synthetics.Canary(stack, 'Canary1', {
                test: synthetics.Test.custom({
                    handler: 'longHandlerName'.repeat(10) + '.handler',
                    code: synthetics.Code.fromAsset(path.join(__dirname, 'canaries')),
                }),
                runtime: synthetics.Runtime.SYNTHETICS_NODEJS_PUPPETEER_3_9,
            });
        }).toThrow(/Canary Handler length must be between 1 and 128/);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuYXJ5LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYW5hcnkudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3Qix1REFBeUQ7QUFDekQsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyx5Q0FBeUM7QUFDekMsNkNBQW9EO0FBQ3BELHFDQUFxQztBQUVyQyxJQUFJLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO0lBQ3hDLFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7UUFDckMsVUFBVSxFQUFFLFVBQVU7UUFDdEIsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQzNCLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQywrQkFBK0IsQ0FBQztTQUNsRSxDQUFDO1FBQ0Ysc0JBQXNCLEVBQUUsc0JBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ3pDLHNCQUFzQixFQUFFLHNCQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN6QyxrQkFBa0IsRUFBRSxLQUFLO1FBQ3pCLFVBQVUsRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7UUFDaEMsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPLENBQUMsK0JBQStCO0tBQzVELENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtRQUN6RSxJQUFJLEVBQUUsVUFBVTtRQUNoQixzQkFBc0IsRUFBRSxFQUFFO1FBQzFCLHNCQUFzQixFQUFFLEVBQUU7UUFDMUIsd0JBQXdCLEVBQUUsS0FBSztRQUMv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LENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksbUJBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtnQkFDdEMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO29CQUMzQixPQUFPLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVU7b0JBQ2xELElBQUksRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxVQUFVLENBQUMsQ0FBQztpQkFDbEUsQ0FBQztnQkFDRixPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU8sQ0FBQywrQkFBK0I7YUFDNUQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7SUFDaEUsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMyc7XG5pbXBvcnQgeyBEdXJhdGlvbiwgTGF6eSwgU3RhY2sgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBzeW50aGV0aWNzIGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ0Jhc2ljIGNhbmFyeSBwcm9wZXJ0aWVzIHdvcmsnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgY2FuYXJ5TmFtZTogJ215Y2FuYXJ5JyxcbiAgICB0ZXN0OiBzeW50aGV0aWNzLlRlc3QuY3VzdG9tKHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tSW5saW5lKCcvKiBTeW50aGV0aWNzIGhhbmRsZXIgY29kZSAqLycpLFxuICAgIH0pLFxuICAgIHN1Y2Nlc3NSZXRlbnRpb25QZXJpb2Q6IER1cmF0aW9uLmRheXMoMTApLFxuICAgIGZhaWx1cmVSZXRlbnRpb25QZXJpb2Q6IER1cmF0aW9uLmRheXMoMTApLFxuICAgIHN0YXJ0QWZ0ZXJDcmVhdGlvbjogZmFsc2UsXG4gICAgdGltZVRvTGl2ZTogRHVyYXRpb24ubWludXRlcygzMCksXG4gICAgcnVudGltZTogc3ludGhldGljcy5SdW50aW1lLlNZTlRIRVRJQ1NfTk9ERUpTX1BVUFBFVEVFUl8zXzgsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3ludGhldGljczo6Q2FuYXJ5Jywge1xuICAgIE5hbWU6ICdteWNhbmFyeScsXG4gICAgU3VjY2Vzc1JldGVudGlvblBlcmlvZDogMTAsXG4gICAgRmFpbHVyZVJldGVudGlvblBlcmlvZDogMTAsXG4gICAgU3RhcnRDYW5hcnlBZnRlckNyZWF0aW9uOiBmYWxzZSxcbiAgICBTY2hlZHVsZTogTWF0Y2gub2JqZWN0TGlrZSh7IER1cmF0aW9uSW5TZWNvbmRzOiAnMTgwMCcgfSksXG4gICAgUnVudGltZVZlcnNpb246ICdzeW4tbm9kZWpzLXB1cHBldGVlci0zLjgnLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdjbGVhbnVwLkxBTUJEQSBpbnRyb2R1Y2VzIGN1c3RvbSByZXNvdXJjZSB0byBkZWxldGUgbGFtYmRhJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHN5bnRoZXRpY3MuQ2FuYXJ5KHN0YWNrLCAnQ2FuYXJ5Jywge1xuICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogc3ludGhldGljcy5Db2RlLmZyb21JbmxpbmUoJy8qIFN5bnRoZXRpY3MgaGFuZGxlciBjb2RlJyksXG4gICAgfSksXG4gICAgY2xlYW51cDogc3ludGhldGljcy5DbGVhbnVwLkxBTUJEQSxcbiAgICBydW50aW1lOiBzeW50aGV0aWNzLlJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzNfOCxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQ3VzdG9tOjpTeW50aGV0aWNzQXV0b0RlbGV0ZVVuZGVybHlpbmdSZXNvdXJjZXMnLCAxKTtcbn0pO1xuXG50ZXN0KCdDYW5hcnkgY2FuIGhhdmUgZ2VuZXJhdGVkIG5hbWUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBzeW50aGV0aWNzLkNvZGUuZnJvbUlubGluZSgnLyogU3ludGhldGljcyBoYW5kbGVyIGNvZGUgKi8nKSxcbiAgICB9KSxcbiAgICBydW50aW1lOiBzeW50aGV0aWNzLlJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzNfOCxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTeW50aGV0aWNzOjpDYW5hcnknLCB7XG4gICAgTmFtZTogJ2NhbmFyeScsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ05hbWUgdmFsaWRhdGlvbiBkb2VzIG5vdCBmYWlsIHdoZW4gdXNpbmcgVG9rZW5zJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHN5bnRoZXRpY3MuQ2FuYXJ5KHN0YWNrLCAnQ2FuYXJ5Jywge1xuICAgIGNhbmFyeU5hbWU6IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gJ015IENhbmFyeScgfSksXG4gICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBzeW50aGV0aWNzLkNvZGUuZnJvbUlubGluZSgnLyogU3ludGhldGljcyBoYW5kbGVyIGNvZGUgKi8nKSxcbiAgICB9KSxcbiAgICBydW50aW1lOiBzeW50aGV0aWNzLlJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzNfOCxcbiAgfSk7XG5cbiAgLy8gVEhFTjogbm8gZXhjZXB0aW9uXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OlN5bnRoZXRpY3M6OkNhbmFyeScsIDEpO1xufSk7XG5cbnRlc3QoJ1Rocm93cyB3aGVuIG5hbWUgaXMgc3BlY2lmaWVkIGluY29ycmVjdGx5JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IG5ldyBzeW50aGV0aWNzLkNhbmFyeShzdGFjaywgJ0NhbmFyeScsIHtcbiAgICBjYW5hcnlOYW1lOiAnTXkgQ2FuYXJ5JyxcbiAgICB0ZXN0OiBzeW50aGV0aWNzLlRlc3QuY3VzdG9tKHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tSW5saW5lKCcvKiBTeW50aGV0aWNzIGhhbmRsZXIgY29kZSAqLycpLFxuICAgIH0pLFxuICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM184LFxuICB9KSlcbiAgICAudG9UaHJvd0Vycm9yKCdDYW5hcnkgbmFtZSBtdXN0IGJlIGxvd2VyY2FzZSwgbnVtYmVycywgaHlwaGVucywgb3IgdW5kZXJzY29yZXMgKGdvdCBcIk15IENhbmFyeVwiKScpO1xufSk7XG5cbnRlc3QoJ1Rocm93cyB3aGVuIG5hbWUgaGFzIG1vcmUgdGhhbiAyMSBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IG5ldyBzeW50aGV0aWNzLkNhbmFyeShzdGFjaywgJ0NhbmFyeScsIHtcbiAgICBjYW5hcnlOYW1lOiAnYScucmVwZWF0KDIyKSxcbiAgICB0ZXN0OiBzeW50aGV0aWNzLlRlc3QuY3VzdG9tKHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tSW5saW5lKCcvKiBTeW50aGV0aWNzIGhhbmRsZXIgY29kZSAqLycpLFxuICAgIH0pLFxuICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM184LFxuICB9KSlcbiAgICAudG9UaHJvd0Vycm9yKGBDYW5hcnkgbmFtZSBpcyB0b28gbGFyZ2UsIG11c3QgYmUgYmV0d2VlbiAxIGFuZCAyMSBjaGFyYWN0ZXJzLCBidXQgaXMgMjIgKGdvdCBcIiR7J2EnLnJlcGVhdCgyMil9XCIpYCk7XG59KTtcblxudGVzdCgnQW4gZXhpc3Rpbmcgcm9sZSBjYW4gYmUgc3BlY2lmaWVkIGluc3RlYWQgb2YgYXV0by1jcmVhdGVkJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc3RhY2ssICdyb2xlJywge1xuICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdsYW1iZGEuYW1hem9uYXdzLmNvbScpLFxuICB9KTtcblxuICAvLyByb2xlLmFkZFRvUG9saWN5KC8qIHJlcXVpcmVkIHBlcm1pc3Npb25zIHBlciB0aGUgZG9jdW1lbnRhdGlvbiAqLyk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgcm9sZSxcbiAgICB0ZXN0OiBzeW50aGV0aWNzLlRlc3QuY3VzdG9tKHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tSW5saW5lKCcvKiBTeW50aGV0aWNzIGhhbmRsZXIgY29kZSAqLycpLFxuICAgIH0pLFxuICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM184LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN5bnRoZXRpY3M6OkNhbmFyeScsIHtcbiAgICBFeGVjdXRpb25Sb2xlQXJuOiBzdGFjay5yZXNvbHZlKHJvbGUucm9sZUFybiksXG4gIH0pO1xufSk7XG5cbnRlc3QoJ0FuIGF1dG8tZ2VuZXJhdGVkIGJ1Y2tldCBjYW4gaGF2ZSBsaWZlY3ljbGUgcnVsZXMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IGxpZmVjeWNsZVJ1bGVzID0gW3tcbiAgICBleHBpcmF0aW9uOiBEdXJhdGlvbi5kYXlzKDMwKSxcbiAgfV07XG5cbiAgLy8gV0hFTlxuICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgYXJ0aWZhY3RzQnVja2V0TGlmZWN5Y2xlUnVsZXM6IGxpZmVjeWNsZVJ1bGVzLFxuICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogc3ludGhldGljcy5Db2RlLmZyb21JbmxpbmUoJy8qIFN5bnRoZXRpY3MgaGFuZGxlciBjb2RlICovJyksXG4gICAgfSksXG4gICAgcnVudGltZTogc3ludGhldGljcy5SdW50aW1lLlNZTlRIRVRJQ1NfTk9ERUpTX1BVUFBFVEVFUl8zXzgsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6UzM6OkJ1Y2tldCcsIHtcbiAgICBMaWZlY3ljbGVDb25maWd1cmF0aW9uOiB7XG4gICAgICBSdWxlczogW1xuICAgICAgICB7XG4gICAgICAgICAgRXhwaXJhdGlvbkluRGF5czogMzAsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ0FuIGV4aXN0aW5nIGJ1Y2tldCBhbmQgcHJlZml4IGNhbiBiZSBzcGVjaWZpZWQgaW5zdGVhZCBvZiBhdXRvLWNyZWF0ZWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IGJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQoc3RhY2ssICdteXRlc3RidWNrZXQnKTtcbiAgY29uc3QgcHJlZml4ID0gJ2NhbmFyeSc7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgYXJ0aWZhY3RzQnVja2V0TG9jYXRpb246IHsgYnVja2V0LCBwcmVmaXggfSxcbiAgICB0ZXN0OiBzeW50aGV0aWNzLlRlc3QuY3VzdG9tKHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tSW5saW5lKCcvKiBTeW50aGV0aWNzIGhhbmRsZXIgY29kZSAqLycpLFxuICAgIH0pLFxuICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM184LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN5bnRoZXRpY3M6OkNhbmFyeScsIHtcbiAgICBBcnRpZmFjdFMzTG9jYXRpb246IHN0YWNrLnJlc29sdmUoYnVja2V0LnMzVXJsRm9yT2JqZWN0KHByZWZpeCkpLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdSdW50aW1lIGNhbiBiZSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgcnVudGltZTogc3ludGhldGljcy5SdW50aW1lLlNZTlRIRVRJQ1NfTk9ERUpTX1BVUFBFVEVFUl8zXzgsXG4gICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBzeW50aGV0aWNzLkNvZGUuZnJvbUlubGluZSgnLyogU3ludGhldGljcyBoYW5kbGVyIGNvZGUgKi8nKSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTeW50aGV0aWNzOjpDYW5hcnknLCB7XG4gICAgUnVudGltZVZlcnNpb246ICdzeW4tbm9kZWpzLXB1cHBldGVlci0zLjgnLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdQeXRob24gcnVudGltZSBjYW4gYmUgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHN5bnRoZXRpY3MuQ2FuYXJ5KHN0YWNrLCAnQ2FuYXJ5Jywge1xuICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX1BZVEhPTl9TRUxFTklVTV8xXzMsXG4gICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBzeW50aGV0aWNzLkNvZGUuZnJvbUlubGluZSgnIyBTeW50aGV0aWNzIGhhbmRsZXIgY29kZScpLFxuICAgIH0pLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN5bnRoZXRpY3M6OkNhbmFyeScsIHtcbiAgICBSdW50aW1lVmVyc2lvbjogJ3N5bi1weXRob24tc2VsZW5pdW0tMS4zJyxcbiAgfSk7XG59KTtcblxudGVzdCgnZW52aXJvbm1lbnQgdmFyaWFibGVzIGNhbiBiZSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IGVudmlyb25tZW50VmFyaWFibGVzID0ge1xuICAgIFRFU1RfS0VZXzE6ICdURVNUX1ZBTFVFXzEnLFxuICAgIFRFU1RfS0VZXzI6ICdURVNUX1ZBTFVFXzInLFxuICB9O1xuXG4gIC8vIFdIRU5cbiAgbmV3IHN5bnRoZXRpY3MuQ2FuYXJ5KHN0YWNrLCAnQ2FuYXJ5Jywge1xuICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM184LFxuICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogc3ludGhldGljcy5Db2RlLmZyb21JbmxpbmUoJy8qIFN5bnRoZXRpY3MgaGFuZGxlciBjb2RlICovJyksXG4gICAgfSksXG4gICAgZW52aXJvbm1lbnRWYXJpYWJsZXM6IGVudmlyb25tZW50VmFyaWFibGVzLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN5bnRoZXRpY3M6OkNhbmFyeScsIHtcbiAgICBSdW5Db25maWc6IHtcbiAgICAgIEVudmlyb25tZW50VmFyaWFibGVzOiBlbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdlbnZpcm9ubWVudCB2YXJpYWJsZXMgYXJlIHNraXBwZWQgaWYgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHN5bnRoZXRpY3MuQ2FuYXJ5KHN0YWNrLCAnQ2FuYXJ5Jywge1xuICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM184LFxuICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogc3ludGhldGljcy5Db2RlLmZyb21JbmxpbmUoJy8qIFN5bnRoZXRpY3MgaGFuZGxlciBjb2RlICovJyksXG4gICAgfSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3ludGhldGljczo6Q2FuYXJ5Jywge1xuICAgIFJ1bkNvbmZpZzogTWF0Y2guYWJzZW50KCksXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1J1bnRpbWUgY2FuIGJlIGN1c3RvbWl6ZWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgcnVudGltZTogbmV3IHN5bnRoZXRpY3MuUnVudGltZSgnZmFuY3ktZnV0dXJlLXJ1bnRpbWUtMTMzNy40MicsIHN5bnRoZXRpY3MuUnVudGltZUZhbWlseS5PVEhFUiksXG4gICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBzeW50aGV0aWNzLkNvZGUuZnJvbUlubGluZSgnLyogU3ludGhldGljcyBoYW5kbGVyIGNvZGUgKi8nKSxcbiAgICB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTeW50aGV0aWNzOjpDYW5hcnknLCB7XG4gICAgUnVudGltZVZlcnNpb246ICdmYW5jeS1mdXR1cmUtcnVudGltZS0xMzM3LjQyJyxcbiAgfSk7XG59KTtcblxudGVzdCgnU2NoZWR1bGUgY2FuIGJlIHNldCB3aXRoIFJhdGUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgc2NoZWR1bGU6IHN5bnRoZXRpY3MuU2NoZWR1bGUucmF0ZShEdXJhdGlvbi5taW51dGVzKDMpKSxcbiAgICB0ZXN0OiBzeW50aGV0aWNzLlRlc3QuY3VzdG9tKHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tSW5saW5lKCcvKiBTeW50aGV0aWNzIGhhbmRsZXIgY29kZSAqLycpLFxuICAgIH0pLFxuICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM184LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN5bnRoZXRpY3M6OkNhbmFyeScsIHtcbiAgICBTY2hlZHVsZTogTWF0Y2gub2JqZWN0TGlrZSh7IEV4cHJlc3Npb246ICdyYXRlKDMgbWludXRlcyknIH0pLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdTY2hlZHVsZSBjYW4gYmUgc2V0IHRvIDEgbWludXRlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHN5bnRoZXRpY3MuQ2FuYXJ5KHN0YWNrLCAnQ2FuYXJ5Jywge1xuICAgIHNjaGVkdWxlOiBzeW50aGV0aWNzLlNjaGVkdWxlLnJhdGUoRHVyYXRpb24ubWludXRlcygxKSksXG4gICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBzeW50aGV0aWNzLkNvZGUuZnJvbUlubGluZSgnLyogU3ludGhldGljcyBoYW5kbGVyIGNvZGUgKi8nKSxcbiAgICB9KSxcbiAgICBydW50aW1lOiBzeW50aGV0aWNzLlJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzNfOCxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTeW50aGV0aWNzOjpDYW5hcnknLCB7XG4gICAgU2NoZWR1bGU6IE1hdGNoLm9iamVjdExpa2UoeyBFeHByZXNzaW9uOiAncmF0ZSgxIG1pbnV0ZSknIH0pLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdTY2hlZHVsZSBjYW4gYmUgc2V0IHdpdGggQ3JvbicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBzeW50aGV0aWNzLkNhbmFyeShzdGFjaywgJ0NhbmFyeScsIHtcbiAgICBzY2hlZHVsZTogc3ludGhldGljcy5TY2hlZHVsZS5jcm9uKHsgbWludXRlOiAnMzAnIH0pLFxuICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogc3ludGhldGljcy5Db2RlLmZyb21JbmxpbmUoJy8qIFN5bnRoZXRpY3MgaGFuZGxlciBjb2RlICovJyksXG4gICAgfSksXG4gICAgcnVudGltZTogc3ludGhldGljcy5SdW50aW1lLlNZTlRIRVRJQ1NfTk9ERUpTX1BVUFBFVEVFUl8zXzgsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3ludGhldGljczo6Q2FuYXJ5Jywge1xuICAgIFNjaGVkdWxlOiBNYXRjaC5vYmplY3RMaWtlKHsgRXhwcmVzc2lvbjogJ2Nyb24oMzAgKiAqICogPyAqKScgfSksXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1NjaGVkdWxlIGNhbiBiZSBzZXQgd2l0aCBFeHByZXNzaW9uJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHN5bnRoZXRpY3MuQ2FuYXJ5KHN0YWNrLCAnQ2FuYXJ5Jywge1xuICAgIHNjaGVkdWxlOiBzeW50aGV0aWNzLlNjaGVkdWxlLmV4cHJlc3Npb24oJ3JhdGUoMSBob3VyKScpLFxuICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogc3ludGhldGljcy5Db2RlLmZyb21JbmxpbmUoJy8qIFN5bnRoZXRpY3MgaGFuZGxlciBjb2RlICovJyksXG4gICAgfSksXG4gICAgcnVudGltZTogc3ludGhldGljcy5SdW50aW1lLlNZTlRIRVRJQ1NfTk9ERUpTX1BVUFBFVEVFUl8zXzgsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3ludGhldGljczo6Q2FuYXJ5Jywge1xuICAgIFNjaGVkdWxlOiBNYXRjaC5vYmplY3RMaWtlKHsgRXhwcmVzc2lvbjogJ3JhdGUoMSBob3VyKScgfSksXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1NjaGVkdWxlIGNhbiBiZSBzZXQgdG8gcnVuIG9uY2UnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgc2NoZWR1bGU6IHN5bnRoZXRpY3MuU2NoZWR1bGUub25jZSgpLFxuICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogc3ludGhldGljcy5Db2RlLmZyb21JbmxpbmUoJy8qIFN5bnRoZXRpY3MgaGFuZGxlciBjb2RlICovJyksXG4gICAgfSksXG4gICAgcnVudGltZTogc3ludGhldGljcy5SdW50aW1lLlNZTlRIRVRJQ1NfTk9ERUpTX1BVUFBFVEVFUl8zXzgsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3ludGhldGljczo6Q2FuYXJ5Jywge1xuICAgIFNjaGVkdWxlOiBNYXRjaC5vYmplY3RMaWtlKHsgRXhwcmVzc2lvbjogJ3JhdGUoMCBtaW51dGVzKScgfSksXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1Rocm93cyB3aGVuIHJhdGUgYWJvdmUgNjAgbWludXRlcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdCgoKSA9PiBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgc2NoZWR1bGU6IHN5bnRoZXRpY3MuU2NoZWR1bGUucmF0ZShEdXJhdGlvbi5taW51dGVzKDYxKSksXG4gICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBzeW50aGV0aWNzLkNvZGUuZnJvbUlubGluZSgnLyogU3ludGhldGljcyBoYW5kbGVyIGNvZGUgKi8nKSxcbiAgICB9KSxcbiAgICBydW50aW1lOiBzeW50aGV0aWNzLlJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzNfOCxcbiAgfSkpXG4gICAgLnRvVGhyb3dFcnJvcignU2NoZWR1bGUgZHVyYXRpb24gbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDYwIG1pbnV0ZXMnKTtcbn0pO1xuXG50ZXN0KCdUaHJvd3Mgd2hlbiByYXRlIGFib3ZlIGlzIG5vdCBhIHdob2xlIG51bWJlciBvZiBtaW51dGVzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IG5ldyBzeW50aGV0aWNzLkNhbmFyeShzdGFjaywgJ0NhbmFyeScsIHtcbiAgICBzY2hlZHVsZTogc3ludGhldGljcy5TY2hlZHVsZS5yYXRlKER1cmF0aW9uLnNlY29uZHMoNTkpKSxcbiAgICB0ZXN0OiBzeW50aGV0aWNzLlRlc3QuY3VzdG9tKHtcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tSW5saW5lKCcvKiBTeW50aGV0aWNzIGhhbmRsZXIgY29kZSAqLycpLFxuICAgIH0pLFxuICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM184LFxuICB9KSlcbiAgICAudG9UaHJvd0Vycm9yKCdcXCc1OSBzZWNvbmRzXFwnIGNhbm5vdCBiZSBjb252ZXJ0ZWQgaW50byBhIHdob2xlIG51bWJlciBvZiBtaW51dGVzLicpO1xufSk7XG5cbnRlc3QoJ0NhbiBzaGFyZSBhcnRpZmFjdHMgYnVja2V0IGJldHdlZW4gY2FuYXJpZXMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBjb25zdCBjYW5hcnkxID0gbmV3IHN5bnRoZXRpY3MuQ2FuYXJ5KHN0YWNrLCAnQ2FuYXJ5MScsIHtcbiAgICBzY2hlZHVsZTogc3ludGhldGljcy5TY2hlZHVsZS5vbmNlKCksXG4gICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBzeW50aGV0aWNzLkNvZGUuZnJvbUlubGluZSgnLyogU3ludGhldGljcyBoYW5kbGVyIGNvZGUgKi8nKSxcbiAgICB9KSxcbiAgICBydW50aW1lOiBzeW50aGV0aWNzLlJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzNfOCxcbiAgfSk7XG5cbiAgY29uc3QgY2FuYXJ5MiA9IG5ldyBzeW50aGV0aWNzLkNhbmFyeShzdGFjaywgJ0NhbmFyeTInLCB7XG4gICAgc2NoZWR1bGU6IHN5bnRoZXRpY3MuU2NoZWR1bGUub25jZSgpLFxuICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgY29kZTogc3ludGhldGljcy5Db2RlLmZyb21JbmxpbmUoJy8qIFN5bnRoZXRpY3MgaGFuZGxlciBjb2RlICovJyksXG4gICAgfSksXG4gICAgYXJ0aWZhY3RzQnVja2V0TG9jYXRpb246IHsgYnVja2V0OiBjYW5hcnkxLmFydGlmYWN0c0J1Y2tldCB9LFxuICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM184LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChjYW5hcnkxLmFydGlmYWN0c0J1Y2tldCkudG9FcXVhbChjYW5hcnkyLmFydGlmYWN0c0J1Y2tldCk7XG59KTtcblxudGVzdCgnY2FuIHNwZWNpZnkgY3VzdG9tIHRlc3QnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBzeW50aGV0aWNzLkNvZGUuZnJvbUlubGluZShgXG4gICAgICAgIGV4cG9ydHMuaGFuZGxlciA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcXCdoZWxsbyB3b3JsZFxcJyk7XG4gICAgICAgIH07YCksXG4gICAgfSksXG4gICAgcnVudGltZTogc3ludGhldGljcy5SdW50aW1lLlNZTlRIRVRJQ1NfTk9ERUpTX1BVUFBFVEVFUl8zXzgsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3ludGhldGljczo6Q2FuYXJ5Jywge1xuICAgIENvZGU6IHtcbiAgICAgIEhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIFNjcmlwdDogYFxuICAgICAgICBleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coXFwnaGVsbG8gd29ybGRcXCcpO1xuICAgICAgICB9O2AsXG4gICAgfSxcbiAgfSk7XG59KTtcblxuZGVzY3JpYmUoJ2NhbmFyeSBpbiBhIHZwYycsICgpID0+IHtcbiAgdGVzdCgnY2FuIHNwZWNpZnkgdnBjJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycsIHsgbWF4QXpzOiAyIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBzeW50aGV0aWNzLkNhbmFyeShzdGFjaywgJ0NhbmFyeScsIHtcbiAgICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tSW5saW5lKGBcbiAgICAgICAgICBleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcXCdoZWxsbyB3b3JsZFxcJyk7XG4gICAgICAgICAgfTtgKSxcbiAgICAgIH0pLFxuICAgICAgcnVudGltZTogc3ludGhldGljcy5SdW50aW1lLlNZTlRIRVRJQ1NfTk9ERUpTX1BVUFBFVEVFUl8zXzgsXG4gICAgICB2cGMsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6U3ludGhldGljczo6Q2FuYXJ5Jywge1xuICAgICAgQ29kZToge1xuICAgICAgICBIYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIFNjcmlwdDogYFxuICAgICAgICAgIGV4cG9ydHMuaGFuZGxlciA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxcJ2hlbGxvIHdvcmxkXFwnKTtcbiAgICAgICAgICB9O2AsXG4gICAgICB9LFxuICAgICAgVlBDQ29uZmlnOiB7XG4gICAgICAgIFZwY0lkOiB7XG4gICAgICAgICAgUmVmOiBNYXRjaC5hbnlWYWx1ZSgpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZGVmYXVsdCBzZWN1cml0eSBncm91cCBhbmQgc3VibmV0cycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7IG1heEF6czogMiB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgICB0ZXN0OiBzeW50aGV0aWNzLlRlc3QuY3VzdG9tKHtcbiAgICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBjb2RlOiBzeW50aGV0aWNzLkNvZGUuZnJvbUlubGluZShgXG4gICAgICAgICAgZXhwb3J0cy5oYW5kbGVyID0gYXN5bmMgKCkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXFwnaGVsbG8gd29ybGRcXCcpO1xuICAgICAgICAgIH07YCksXG4gICAgICB9KSxcbiAgICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM184LFxuICAgICAgdnBjLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN5bnRoZXRpY3M6OkNhbmFyeScsIHtcbiAgICAgIENvZGU6IHtcbiAgICAgICAgSGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBTY3JpcHQ6IGBcbiAgICAgICAgICBleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcXCdoZWxsbyB3b3JsZFxcJyk7XG4gICAgICAgICAgfTtgLFxuICAgICAgfSxcbiAgICAgIFZQQ0NvbmZpZzoge1xuICAgICAgICBWcGNJZDoge1xuICAgICAgICAgIFJlZjogTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgICAgfSxcbiAgICAgICAgU2VjdXJpdHlHcm91cElkczogTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgICAgU3VibmV0SWRzOiBbLi4udnBjLnByaXZhdGVTdWJuZXRzLm1hcChzdWJuZXQgPT4gKHsgUmVmOiBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKHN1Ym5ldC5ub2RlLmlkKSB9KSldLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncHJvdmlkZWQgc2VjdXJpdHkgZ3JvdXAnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywgeyBtYXhBenM6IDIgfSk7XG4gICAgY29uc3Qgc2cgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTZycsIHsgdnBjIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBzeW50aGV0aWNzLkNhbmFyeShzdGFjaywgJ0NhbmFyeScsIHtcbiAgICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tSW5saW5lKGBcbiAgICAgICAgICBleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcXCdoZWxsbyB3b3JsZFxcJyk7XG4gICAgICAgICAgfTtgKSxcbiAgICAgIH0pLFxuICAgICAgcnVudGltZTogc3ludGhldGljcy5SdW50aW1lLlNZTlRIRVRJQ1NfTk9ERUpTX1BVUFBFVEVFUl8zXzgsXG4gICAgICB2cGMsXG4gICAgICBzZWN1cml0eUdyb3VwczogW3NnXSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gICAgY29uc3Qgc2dUZW1wbGF0ZSA9IHRlbXBsYXRlLmZpbmRSZXNvdXJjZXMoJ0FXUzo6RUMyOjpTZWN1cml0eUdyb3VwJyk7XG4gICAgY29uc3Qgc2dJZHMgPSBPYmplY3Qua2V5cyhzZ1RlbXBsYXRlKTtcblxuICAgIGV4cGVjdChzZ0lkcykudG9IYXZlTGVuZ3RoKDEpO1xuXG4gICAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN5bnRoZXRpY3M6OkNhbmFyeScsIHtcbiAgICAgIENvZGU6IHtcbiAgICAgICAgSGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBTY3JpcHQ6IGBcbiAgICAgICAgICBleHBvcnRzLmhhbmRsZXIgPSBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcXCdoZWxsbyB3b3JsZFxcJyk7XG4gICAgICAgICAgfTtgLFxuICAgICAgfSxcbiAgICAgIFZQQ0NvbmZpZzoge1xuICAgICAgICBWcGNJZDoge1xuICAgICAgICAgIFJlZjogTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgICAgfSxcbiAgICAgICAgU2VjdXJpdHlHcm91cElkczogW3sgJ0ZuOjpHZXRBdHQnOiBbc2dJZHNbMF0sICdHcm91cElkJ10gfV0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG50ZXN0KCdSb2xlIHBvbGljeSBnZW5lcmF0ZWQgYXMgZXhwZWN0ZWQnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBzeW50aGV0aWNzLkNvZGUuZnJvbUlubGluZSgnLyogU3ludGhldGljcyBoYW5kbGVyIGNvZGUgKi8nKSxcbiAgICB9KSxcbiAgICBydW50aW1lOiBzeW50aGV0aWNzLlJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzNfOCxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlJvbGUnLCB7XG4gICAgUG9saWNpZXM6IFt7XG4gICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzMzpMaXN0QWxsTXlCdWNrZXRzJyxcbiAgICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdzMzpHZXRCdWNrZXRMb2NhdGlvbicsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAnQ2FuYXJ5QXJ0aWZhY3RzQnVja2V0NEE2MEQzMkInLFxuICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ3MzOlB1dE9iamVjdCcsXG4gICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICBSZXNvdXJjZToge1xuICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgICAgICAgICAnQ2FuYXJ5QXJ0aWZhY3RzQnVja2V0NEE2MEQzMkInLFxuICAgICAgICAgICAgICAgICAgICAgICdBcm4nLFxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICcvKicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdjbG91ZHdhdGNoOlB1dE1ldHJpY0RhdGEnLFxuICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICAgICAgICdjbG91ZHdhdGNoOm5hbWVzcGFjZSc6ICdDbG91ZFdhdGNoU3ludGhldGljcycsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogW1xuICAgICAgICAgICAgICAnbG9nczpDcmVhdGVMb2dTdHJlYW0nLFxuICAgICAgICAgICAgICAnbG9nczpDcmVhdGVMb2dHcm91cCcsXG4gICAgICAgICAgICAgICdsb2dzOlB1dExvZ0V2ZW50cycsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICc6bG9nczonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlJlZ2lvbicsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzonLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OkFjY291bnRJZCcsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgJzpsb2ctZ3JvdXA6L2F3cy9sYW1iZGEvY3dzeW4tKicsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfV0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ1Nob3VsZCBjcmVhdGUgaGFuZGxlciB3aXRoIHBhdGggZm9yIHJlY2VudCBydW50aW1lcycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBzeW50aGV0aWNzLkNhbmFyeShzdGFjaywgJ0NhbmFyeScsIHtcbiAgICBjYW5hcnlOYW1lOiAnbXljYW5hcnknLFxuICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgaGFuZGxlcjogJ2ZvbGRlci9jYW5hcnkuZnVuY3Rpb25OYW1lJyxcbiAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2NhbmFyaWVzJykpLFxuICAgIH0pLFxuICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM184LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OlN5bnRoZXRpY3M6OkNhbmFyeScsIHtcbiAgICBOYW1lOiAnbXljYW5hcnknLFxuICAgIENvZGU6IHtcbiAgICAgIEhhbmRsZXI6ICdmb2xkZXIvY2FuYXJ5LmZ1bmN0aW9uTmFtZScsXG4gICAgfSxcbiAgICBSdW50aW1lVmVyc2lvbjogJ3N5bi1ub2RlanMtcHVwcGV0ZWVyLTMuOCcsXG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdoYW5kbGVyIHZhbGlkYXRpb24nLCAoKSA9PiB7XG4gIHRlc3QoJ2xlZ2FjeSBydW50aW1lcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgc3ludGhldGljcy5DYW5hcnkoc3RhY2ssICdDYW5hcnknLCB7XG4gICAgICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgICAgIGhhbmRsZXI6ICdpbmRleC5mdW5jdGlvbk5hbWUnLFxuICAgICAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2NhbmFyaWVzJykpLFxuICAgICAgICB9KSxcbiAgICAgICAgcnVudGltZTogc3ludGhldGljcy5SdW50aW1lLlNZTlRIRVRJQ1NfUFlUSE9OX1NFTEVOSVVNXzFfMCxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0NhbmFyeSBIYW5kbGVyIG11c3QgYmUgc3BlY2lmaWVkIGFzICdmaWxlTmFtZS5oYW5kbGVyJyBmb3IgbGVnYWN5IHJ1bnRpbWVzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlY2VudCBydW50aW1lcycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzeW50aGV0aWNzLkNhbmFyeShzdGFjaywgJ0NhbmFyeScsIHtcbiAgICAgICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICAgICAgaGFuZGxlcjogJ2ludmFsaWRIYW5kbGVyJyxcbiAgICAgICAgICBjb2RlOiBzeW50aGV0aWNzLkNvZGUuZnJvbUFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdjYW5hcmllcycpKSxcbiAgICAgICAgfSksXG4gICAgICAgIHJ1bnRpbWU6IHN5bnRoZXRpY3MuUnVudGltZS5TWU5USEVUSUNTX05PREVKU19QVVBQRVRFRVJfM185LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvQ2FuYXJ5IEhhbmRsZXIgbXVzdCBiZSBzcGVjaWZpZWQgZWl0aGVyIGFzICdmaWxlTmFtZS5oYW5kbGVyJywgJ2ZpbGVOYW1lLmZ1bmN0aW9uTmFtZScsIG9yICdmb2xkZXJcXC9maWxlTmFtZS5mdW5jdGlvbk5hbWUnLyk7XG5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IHN5bnRoZXRpY3MuQ2FuYXJ5KHN0YWNrLCAnQ2FuYXJ5MScsIHtcbiAgICAgICAgdGVzdDogc3ludGhldGljcy5UZXN0LmN1c3RvbSh7XG4gICAgICAgICAgaGFuZGxlcjogJ2NhbmFyeS5mdW5jdGlvbk5hbWUnLFxuICAgICAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2NhbmFyaWVzJykpLFxuICAgICAgICB9KSxcbiAgICAgICAgcnVudGltZTogc3ludGhldGljcy5SdW50aW1lLlNZTlRIRVRJQ1NfTk9ERUpTX1BVUFBFVEVFUl8zXzksXG4gICAgICB9KTtcbiAgICB9KS5ub3QudG9UaHJvdygpO1xuXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzeW50aGV0aWNzLkNhbmFyeShzdGFjaywgJ0NhbmFyeTInLCB7XG4gICAgICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgICAgIGhhbmRsZXI6ICdmb2xkZXIvY2FuYXJ5LmZ1bmN0aW9uTmFtZScsXG4gICAgICAgICAgY29kZTogc3ludGhldGljcy5Db2RlLmZyb21Bc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnY2FuYXJpZXMnKSksXG4gICAgICAgIH0pLFxuICAgICAgICBydW50aW1lOiBzeW50aGV0aWNzLlJ1bnRpbWUuU1lOVEhFVElDU19OT0RFSlNfUFVQUEVURUVSXzNfOSxcbiAgICAgIH0pO1xuICAgIH0pLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ2hhbmRsZXIgbGVuZ3RoJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBzeW50aGV0aWNzLkNhbmFyeShzdGFjaywgJ0NhbmFyeTEnLCB7XG4gICAgICAgIHRlc3Q6IHN5bnRoZXRpY3MuVGVzdC5jdXN0b20oe1xuICAgICAgICAgIGhhbmRsZXI6ICdsb25nSGFuZGxlck5hbWUnLnJlcGVhdCgxMCkgKyAnLmhhbmRsZXInLFxuICAgICAgICAgIGNvZGU6IHN5bnRoZXRpY3MuQ29kZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ2NhbmFyaWVzJykpLFxuICAgICAgICB9KSxcbiAgICAgICAgcnVudGltZTogc3ludGhldGljcy5SdW50aW1lLlNZTlRIRVRJQ1NfTk9ERUpTX1BVUFBFVEVFUl8zXzksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC9DYW5hcnkgSGFuZGxlciBsZW5ndGggbXVzdCBiZSBiZXR3ZWVuIDEgYW5kIDEyOC8pO1xuICB9KTtcbn0pO1xuIl19