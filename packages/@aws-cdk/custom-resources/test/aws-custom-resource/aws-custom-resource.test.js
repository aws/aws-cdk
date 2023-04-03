"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const logs = require("@aws-cdk/aws-logs");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../../lib");
/* eslint-disable quote-props */
test('aws sdk js custom resource with onCreate and onDelete', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        resourceType: 'Custom::LogRetentionPolicy',
        onCreate: {
            service: 'CloudWatchLogs',
            action: 'putRetentionPolicy',
            parameters: {
                logGroupName: '/aws/lambda/loggroup',
                retentionInDays: 90,
            },
            physicalResourceId: lib_1.PhysicalResourceId.of('loggroup'),
        },
        onDelete: {
            service: 'CloudWatchLogs',
            action: 'deleteRetentionPolicy',
            parameters: {
                logGroupName: '/aws/lambda/loggroup',
            },
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetentionPolicy', {
        'Create': JSON.stringify({
            'service': 'CloudWatchLogs',
            'action': 'putRetentionPolicy',
            'parameters': {
                'logGroupName': '/aws/lambda/loggroup',
                'retentionInDays': 90,
            },
            'physicalResourceId': {
                'id': 'loggroup',
            },
        }),
        'Delete': JSON.stringify({
            'service': 'CloudWatchLogs',
            'action': 'deleteRetentionPolicy',
            'parameters': {
                'logGroupName': '/aws/lambda/loggroup',
            },
        }),
        'InstallLatestAwsSdk': true,
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
            'Statement': [
                {
                    'Action': 'logs:PutRetentionPolicy',
                    'Effect': 'Allow',
                    'Resource': '*',
                },
                {
                    'Action': 'logs:DeleteRetentionPolicy',
                    'Effect': 'Allow',
                    'Resource': '*',
                },
            ],
            'Version': '2012-10-17',
        },
    });
});
test('onCreate defaults to onUpdate', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        resourceType: 'Custom::S3PutObject',
        onUpdate: {
            service: 's3',
            action: 'putObject',
            parameters: {
                Bucket: 'my-bucket',
                Key: 'my-key',
                Body: 'my-body',
            },
            physicalResourceId: lib_1.PhysicalResourceId.fromResponse('ETag'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::S3PutObject', {
        'Create': JSON.stringify({
            'service': 's3',
            'action': 'putObject',
            'parameters': {
                'Bucket': 'my-bucket',
                'Key': 'my-key',
                'Body': 'my-body',
            },
            'physicalResourceId': {
                'responsePath': 'ETag',
            },
        }),
        'Update': JSON.stringify({
            'service': 's3',
            'action': 'putObject',
            'parameters': {
                'Bucket': 'my-bucket',
                'Key': 'my-key',
                'Body': 'my-body',
            },
            'physicalResourceId': {
                'responsePath': 'ETag',
            },
        }),
    });
});
test('with custom policyStatements', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onUpdate: {
            service: 'S3',
            action: 'putObject',
            parameters: {
                Bucket: 'my-bucket',
                Key: 'my-key',
                Body: 'my-body',
            },
            physicalResourceId: lib_1.PhysicalResourceId.fromResponse('ETag'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromStatements([
            new iam.PolicyStatement({
                actions: ['s3:PutObject'],
                resources: ['arn:aws:s3:::my-bucket/my-key'],
            }),
        ]),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        'PolicyDocument': {
            'Statement': [
                {
                    'Action': 's3:PutObject',
                    'Effect': 'Allow',
                    'Resource': 'arn:aws:s3:::my-bucket/my-key',
                },
            ],
            'Version': '2012-10-17',
        },
    });
});
test('fails when no calls are specified', () => {
    const stack = new cdk.Stack();
    expect(() => new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    })).toThrow(/`onCreate`.+`onUpdate`.+`onDelete`/);
});
// test patterns for physicalResourceId
// | # |    onCreate.physicalResourceId    |   onUpdate.physicalResourceId    | Error thrown? |
// |---|-----------------------------------|----------------------------------|---------------|
// | 1 | ANY_VALUE                         | ANY_VALUE                        | no            |
// | 2 | ANY_VALUE                         | undefined                        | no            |
// | 3 | undefined                         | ANY_VALLUE                       | yes           |
// | 4 | undefined                         | undefined                        | yes           |
// | 5 | ANY_VALUE                         | undefined (*omit whole onUpdate) | no            |
// | 6 | undefined                         | undefined (*omit whole onUpdate) | yes           |
// | 7 | ANY_VALUE (*copied from onUpdate) | ANY_VALUE                        | no            |
// | 8 | undefined (*copied from onUpdate) | undefined                        | yes           |
describe('physicalResourceId patterns', () => {
    // physicalResourceId pattern #1
    test('physicalResourceId is specified both in onCreate and onUpdate then success', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.AwsCustomResource(stack, 'AwsSdk', {
            resourceType: 'Custom::AthenaNotebook',
            onCreate: {
                service: 'Athena',
                action: 'createNotebook',
                physicalResourceId: lib_1.PhysicalResourceId.of('id'),
                parameters: {
                    WorkGroup: 'WorkGroupA',
                    Name: 'Notebook1',
                },
            },
            onUpdate: {
                service: 'Athena',
                action: 'updateNotebookMetadata',
                physicalResourceId: lib_1.PhysicalResourceId.of('id'),
                parameters: {
                    Name: 'Notebook1',
                    NotebookId: new lib_1.PhysicalResourceIdReference(),
                },
            },
            policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AthenaNotebook', {
            Create: JSON.stringify({
                service: 'Athena',
                action: 'createNotebook',
                physicalResourceId: {
                    id: 'id',
                },
                parameters: {
                    WorkGroup: 'WorkGroupA',
                    Name: 'Notebook1',
                },
            }),
            Update: JSON.stringify({
                service: 'Athena',
                action: 'updateNotebookMetadata',
                physicalResourceId: {
                    id: 'id',
                },
                parameters: {
                    Name: 'Notebook1',
                    NotebookId: 'PHYSICAL:RESOURCEID:',
                },
            }),
        });
    });
    // physicalResourceId pattern #2
    test('physicalResourceId is specified in onCreate, is not in onUpdate then absent', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.AwsCustomResource(stack, 'AwsSdk', {
            resourceType: 'Custom::AthenaNotebook',
            onCreate: {
                service: 'Athena',
                action: 'createNotebook',
                physicalResourceId: lib_1.PhysicalResourceId.fromResponse('NotebookId'),
                parameters: {
                    WorkGroup: 'WorkGroupA',
                    Name: 'Notebook1',
                },
            },
            onUpdate: {
                service: 'Athena',
                action: 'updateNotebookMetadata',
                parameters: {
                    Name: 'Notebook1',
                    NotebookId: new lib_1.PhysicalResourceIdReference(),
                },
            },
            policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AthenaNotebook', {
            Create: JSON.stringify({
                service: 'Athena',
                action: 'createNotebook',
                physicalResourceId: {
                    responsePath: 'NotebookId',
                },
                parameters: {
                    WorkGroup: 'WorkGroupA',
                    Name: 'Notebook1',
                },
            }),
            Update: JSON.stringify({
                service: 'Athena',
                action: 'updateNotebookMetadata',
                parameters: {
                    Name: 'Notebook1',
                    NotebookId: 'PHYSICAL:RESOURCEID:',
                },
            }),
        });
    });
    // physicalResourceId pattern #3
    test('physicalResourceId is not specified in onCreate but onUpdate then fail', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        expect(() => {
            new lib_1.AwsCustomResource(stack, 'AwsSdk', {
                resourceType: 'Custom::AthenaNotebook',
                onCreate: {
                    service: 'Athena',
                    action: 'createNotebook',
                    parameters: {
                        WorkGroup: 'WorkGroupA',
                        Name: 'Notebook1',
                    },
                },
                onUpdate: {
                    service: 'Athena',
                    action: 'updateNotebookMetadata',
                    physicalResourceId: lib_1.PhysicalResourceId.of('id'),
                    parameters: {
                        Name: 'Notebook1',
                        NotebookId: new lib_1.PhysicalResourceIdReference(),
                    },
                },
                policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
            });
        }).toThrow(/'physicalResourceId' must be specified for 'onCreate' call./);
    });
    // physicalResourceId pattern #4
    test('physicalResourceId is not specified both in onCreate and onUpdate then fail', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        expect(() => {
            new lib_1.AwsCustomResource(stack, 'AwsSdk', {
                resourceType: 'Custom::AthenaNotebook',
                onCreate: {
                    service: 'Athena',
                    action: 'createNotebook',
                    parameters: {
                        WorkGroup: 'WorkGroupA',
                        Name: 'Notebook1',
                    },
                },
                onUpdate: {
                    service: 'Athena',
                    action: 'updateNotebookMetadata',
                    parameters: {
                        Name: 'Notebook1',
                        NotebookId: new lib_1.PhysicalResourceIdReference(),
                    },
                },
                policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
            });
        }).toThrow(/'physicalResourceId' must be specified for 'onCreate' call./);
    });
    // physicalResourceId pattern #5
    test('physicalResourceId is specified in onCreate with empty onUpdate then success', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.AwsCustomResource(stack, 'AwsSdk', {
            resourceType: 'Custom::AthenaNotebook',
            onCreate: {
                service: 'Athena',
                action: 'createNotebook',
                physicalResourceId: lib_1.PhysicalResourceId.of('id'),
                parameters: {
                    WorkGroup: 'WorkGroupA',
                    Name: 'Notebook1',
                },
            },
            policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AthenaNotebook', {
            Create: JSON.stringify({
                service: 'Athena',
                action: 'createNotebook',
                physicalResourceId: {
                    id: 'id',
                },
                parameters: {
                    WorkGroup: 'WorkGroupA',
                    Name: 'Notebook1',
                },
            }),
        });
    });
    // physicalResourceId pattern #6
    test('physicalResourceId is not specified onCreate with empty onUpdate then fail', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        expect(() => {
            new lib_1.AwsCustomResource(stack, 'AwsSdk', {
                resourceType: 'Custom::AthenaNotebook',
                onCreate: {
                    service: 'Athena',
                    action: 'createNotebook',
                    parameters: {
                        WorkGroup: 'WorkGroupA',
                        Name: 'Notebook1',
                    },
                },
                policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
            });
        }).toThrow(/'physicalResourceId' must be specified for 'onCreate' call./);
    });
    // physicalResourceId pattern #7
    test('onCreate and onUpdate both have physicalResourceId when physicalResourceId is specified in onUpdate, even when onCreate is unspecified', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        new lib_1.AwsCustomResource(stack, 'AwsSdk', {
            resourceType: 'Custom::AthenaNotebook',
            onUpdate: {
                service: 'Athena',
                action: 'updateNotebookMetadata',
                physicalResourceId: lib_1.PhysicalResourceId.of('id'),
                parameters: {
                    Name: 'Notebook1',
                    NotebookId: 'XXXX',
                },
            },
            policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AthenaNotebook', {
            Create: JSON.stringify({
                service: 'Athena',
                action: 'updateNotebookMetadata',
                physicalResourceId: {
                    id: 'id',
                },
                parameters: {
                    Name: 'Notebook1',
                    NotebookId: 'XXXX',
                },
            }),
            Update: JSON.stringify({
                service: 'Athena',
                action: 'updateNotebookMetadata',
                physicalResourceId: {
                    id: 'id',
                },
                parameters: {
                    Name: 'Notebook1',
                    NotebookId: 'XXXX',
                },
            }),
        });
    });
    // physicalResourceId pattern #8
    test('Omitting physicalResourceId in onCreate when onUpdate is undefined throws an error', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        expect(() => {
            new lib_1.AwsCustomResource(stack, 'AwsSdk', {
                resourceType: 'Custom::AthenaNotebook',
                onUpdate: {
                    service: 'Athena',
                    action: 'updateNotebookMetadata',
                    parameters: {
                        Name: 'Notebook1',
                        NotebookId: 'XXXX',
                    },
                },
                policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
            });
        }).toThrow(/'physicalResourceId' must be specified for 'onUpdate' call when 'onCreate' is omitted./);
    });
});
test('booleans are encoded in the stringified parameters object', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        resourceType: 'Custom::ServiceAction',
        onCreate: {
            service: 'service',
            action: 'action',
            parameters: {
                trueBoolean: true,
                trueString: 'true',
                falseBoolean: false,
                falseString: 'false',
            },
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::ServiceAction', {
        'Create': JSON.stringify({
            'service': 'service',
            'action': 'action',
            'parameters': {
                'trueBoolean': true,
                'trueString': 'true',
                'falseBoolean': false,
                'falseString': 'false',
            },
            'physicalResourceId': {
                'id': 'id',
            },
        }),
    });
});
test('fails PhysicalResourceIdReference is passed to onCreate parameters', () => {
    const stack = new cdk.Stack();
    expect(() => new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        resourceType: 'Custom::ServiceAction',
        onCreate: {
            service: 'service',
            action: 'action',
            parameters: {
                physicalResourceIdReference: new lib_1.PhysicalResourceIdReference(),
            },
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    })).toThrow('`PhysicalResourceIdReference` must not be specified in `onCreate` parameters.');
});
test('encodes physical resource id reference', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        resourceType: 'Custom::ServiceAction',
        onUpdate: {
            service: 'service',
            action: 'action',
            parameters: {
                trueBoolean: true,
                trueString: 'true',
                falseBoolean: false,
                falseString: 'false',
                physicalResourceIdReference: new lib_1.PhysicalResourceIdReference(),
            },
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::ServiceAction', {
        'Create': JSON.stringify({
            'service': 'service',
            'action': 'action',
            'parameters': {
                'trueBoolean': true,
                'trueString': 'true',
                'falseBoolean': false,
                'falseString': 'false',
                'physicalResourceIdReference': 'PHYSICAL:RESOURCEID:',
            },
            'physicalResourceId': {
                'id': 'id',
            },
        }),
    });
});
test('timeout defaults to 2 minutes', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Timeout: 120,
    });
});
test('can specify timeout', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        timeout: cdk.Duration.minutes(15),
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Timeout: 900,
    });
});
test('implements IGrantable', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });
    const customResource = new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // WHEN
    role.grantPassRole(customResource.grantPrincipal);
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: 'iam:PassRole',
                    Effect: 'Allow',
                    Resource: {
                        'Fn::GetAtt': [
                            'Role1ABCC5F0',
                            'Arn',
                        ],
                    },
                },
            ],
            Version: '2012-10-17',
        },
    });
});
test('can use existing role', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/CoolRole');
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        role,
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        Role: 'arn:aws:iam::123456789012:role/CoolRole',
    });
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
});
test('getData', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const awsSdk = new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // WHEN
    const token = awsSdk.getResponseFieldReference('Data');
    // THEN
    expect(stack.resolve(token)).toEqual({
        'Fn::GetAtt': [
            'AwsSdkE966FE43',
            'Data',
        ],
    });
});
test('fails when getData is used with `ignoreErrorCodesMatching`', () => {
    const stack = new cdk.Stack();
    const resource = new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onUpdate: {
            service: 'CloudWatchLogs',
            action: 'putRetentionPolicy',
            parameters: {
                logGroupName: '/aws/lambda/loggroup',
                retentionInDays: 90,
            },
            ignoreErrorCodesMatching: '.*',
            physicalResourceId: lib_1.PhysicalResourceId.of('Id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    expect(() => resource.getResponseFieldReference('ShouldFail')).toThrow(/`getData`.+`ignoreErrorCodesMatching`/);
});
test('fails when getDataString is used with `ignoreErrorCodesMatching`', () => {
    const stack = new cdk.Stack();
    const resource = new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onUpdate: {
            service: 'CloudWatchLogs',
            action: 'putRetentionPolicy',
            parameters: {
                logGroupName: '/aws/lambda/loggroup',
                retentionInDays: 90,
            },
            ignoreErrorCodesMatching: '.*',
            physicalResourceId: lib_1.PhysicalResourceId.of('Id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    expect(() => resource.getResponseField('ShouldFail')).toThrow(/`getDataString`.+`ignoreErrorCodesMatching`/);
});
test('fail when `PhysicalResourceId.fromResponse` is used with `ignoreErrorCodesMatching', () => {
    const stack = new cdk.Stack();
    expect(() => new lib_1.AwsCustomResource(stack, 'AwsSdkOnUpdate', {
        onUpdate: {
            service: 'CloudWatchLogs',
            action: 'putRetentionPolicy',
            parameters: {
                logGroupName: '/aws/lambda/loggroup',
                retentionInDays: 90,
            },
            ignoreErrorCodesMatching: '.*',
            physicalResourceId: lib_1.PhysicalResourceId.fromResponse('Response'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    })).toThrow(/`PhysicalResourceId.fromResponse`.+`ignoreErrorCodesMatching`/);
    expect(() => new lib_1.AwsCustomResource(stack, 'AwsSdkOnCreate', {
        onCreate: {
            service: 'CloudWatchLogs',
            action: 'putRetentionPolicy',
            parameters: {
                logGroupName: '/aws/lambda/loggroup',
                retentionInDays: 90,
            },
            ignoreErrorCodesMatching: '.*',
            physicalResourceId: lib_1.PhysicalResourceId.fromResponse('Response'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    })).toThrow(/`PhysicalResourceId.fromResponse`.+`ignoreErrorCodesMatching`/);
    expect(() => new lib_1.AwsCustomResource(stack, 'AwsSdkOnDelete', {
        onDelete: {
            service: 'CloudWatchLogs',
            action: 'putRetentionPolicy',
            parameters: {
                logGroupName: '/aws/lambda/loggroup',
                retentionInDays: 90,
            },
            ignoreErrorCodesMatching: '.*',
            physicalResourceId: lib_1.PhysicalResourceId.fromResponse('Response'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    })).toThrow(/`PhysicalResourceId.fromResponse`.+`ignoreErrorCodesMatching`/);
});
test('getDataString', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const awsSdk = new lib_1.AwsCustomResource(stack, 'AwsSdk1', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk2', {
        onCreate: {
            service: 'service',
            action: 'action',
            parameters: {
                a: awsSdk.getResponseField('Data'),
            },
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
        Create: {
            'Fn::Join': [
                '',
                [
                    '{"service":"service","action":"action","parameters":{"a":"',
                    {
                        'Fn::GetAtt': [
                            'AwsSdk155B91071',
                            'Data',
                        ],
                    },
                    '"},"physicalResourceId":{"id":"id"}}',
                ],
            ],
        },
    });
});
test('can specify log retention', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        logRetention: logs.RetentionDays.ONE_WEEK,
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetention', {
        LogGroupName: {
            'Fn::Join': [
                '',
                [
                    '/aws/lambda/',
                    {
                        Ref: 'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
                    },
                ],
            ],
        },
        RetentionInDays: 7,
    });
});
test('disable AWS SDK installation', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        installLatestAwsSdk: false,
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
        'InstallLatestAwsSdk': false,
    });
});
test('can specify function name', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
        functionName: 'my-cool-function',
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        FunctionName: 'my-cool-function',
    });
});
test('separate policies per custom resource', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new lib_1.AwsCustomResource(stack, 'Custom1', {
        onCreate: {
            service: 'service1',
            action: 'action1',
            physicalResourceId: lib_1.PhysicalResourceId.of('id1'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    new lib_1.AwsCustomResource(stack, 'Custom2', {
        onCreate: {
            service: 'service2',
            action: 'action2',
            physicalResourceId: lib_1.PhysicalResourceId.of('id2'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: 'service1:Action1',
                    Effect: 'Allow',
                    Resource: '*',
                },
            ],
            Version: '2012-10-17',
        },
    });
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: 'service2:Action2',
                    Effect: 'Allow',
                    Resource: '*',
                },
            ],
            Version: '2012-10-17',
        },
    });
});
test('tokens can be used as dictionary keys', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const dummy = new cdk.CfnResource(stack, 'MyResource', {
        type: 'AWS::My::Resource',
    });
    // WHEN
    new lib_1.AwsCustomResource(stack, 'Custom1', {
        onCreate: {
            service: 'service1',
            action: 'action1',
            physicalResourceId: lib_1.PhysicalResourceId.of('id1'),
            parameters: {
                [dummy.ref]: {
                    Foo: 1234,
                    Bar: dummy.getAtt('Foorz'),
                },
            },
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::AWS', {
        Create: {
            'Fn::Join': [
                '',
                [
                    '{"service":"service1","action":"action1","physicalResourceId":{"id":"id1"},"parameters":{"',
                    {
                        'Ref': 'MyResource',
                    },
                    '":{"Foo":1234,"Bar":"',
                    {
                        'Fn::GetAtt': [
                            'MyResource',
                            'Foorz',
                        ],
                    },
                    '"}}}',
                ],
            ],
        },
    });
});
test('assumedRoleArn adds statement for sts:assumeRole', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            assumedRoleArn: 'roleArn',
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: 'sts:AssumeRole',
                    Effect: 'Allow',
                    Resource: 'roleArn',
                },
            ],
            Version: '2012-10-17',
        },
    });
});
test('fails when at least one of policy or role is not specified', () => {
    const stack = new cdk.Stack();
    expect(() => new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onUpdate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
            parameters: {
                param: 'param',
            },
        },
    })).toThrow(/`policy`.+`role`/);
});
test('can provide no policy if using existing role', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const role = iam.Role.fromRoleArn(stack, 'Role', 'arn:aws:iam::123456789012:role/CoolRole');
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        role,
    });
    // THEN
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    assertions_1.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
});
test('can specify VPC', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'TestVpc');
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
        vpc,
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: {
            SubnetIds: stack.resolve(vpc.privateSubnets.map(subnet => subnet.subnetId)),
        },
    });
});
test('specifying public subnets results in a synthesis error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'TestVpc');
    // THEN
    expect(() => {
        new lib_1.AwsCustomResource(stack, 'AwsSdk', {
            onCreate: {
                service: 'service',
                action: 'action',
                physicalResourceId: lib_1.PhysicalResourceId.of('id'),
            },
            policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
            vpc,
            vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
        });
    }).toThrow(/Lambda Functions in a public subnet/);
});
test('not specifying vpcSubnets when only public subnets exist on a VPC results in an error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'TestPublicOnlyVpc', {
        subnetConfiguration: [{ name: 'public', subnetType: ec2.SubnetType.PUBLIC }],
    });
    // THEN
    expect(() => {
        new lib_1.AwsCustomResource(stack, 'AwsSdk', {
            onCreate: {
                service: 'service',
                action: 'action',
                physicalResourceId: lib_1.PhysicalResourceId.of('id'),
            },
            policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
            vpc,
        });
    }).toThrow(/Lambda Functions in a public subnet/);
});
test('vpcSubnets filter is not required when only isolated subnets exist', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'TestPrivateOnlyVpc', {
        subnetConfiguration: [
            { name: 'test1private', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
            { name: 'test2private', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        ],
    });
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
        vpc,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: {
            SubnetIds: stack.resolve(vpc.isolatedSubnets.map(subnet => subnet.subnetId)),
        },
    });
});
test('vpcSubnets filter is not required for the default VPC configuration', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'TestVpc');
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
        vpc,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Function', {
        VpcConfig: {
            SubnetIds: stack.resolve(vpc.privateSubnets.map(subnet => subnet.subnetId)),
        },
    });
});
test('vpcSubnets without vpc results in an error', () => {
    // GIVEN
    const stack = new cdk.Stack();
    // WHEN
    expect(() => new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        onCreate: {
            service: 'service',
            action: 'action',
            physicalResourceId: lib_1.PhysicalResourceId.of('id'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
        vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
    })).toThrow('Cannot configure \'vpcSubnets\' without configuring a VPC');
});
test.each([
    [undefined, true],
    [true, true],
    [false, false],
])('feature flag %p, installLatestAwsSdk %p', (flag, expected) => {
    // GIVEN
    const app = new core_1.App({
        context: {
            '@aws-cdk/customresources:installLatestAwsSdkDefault': flag,
        },
    });
    const stack = new core_1.Stack(app, 'Stack');
    // WHEN
    new lib_1.AwsCustomResource(stack, 'AwsSdk', {
        resourceType: 'Custom::LogRetentionPolicy',
        onCreate: {
            service: 'CloudWatchLogs',
            action: 'putRetentionPolicy',
            parameters: {
                logGroupName: '/aws/lambda/loggroup',
                retentionInDays: 90,
            },
            physicalResourceId: lib_1.PhysicalResourceId.of('loggroup'),
        },
        policy: lib_1.AwsCustomResourcePolicy.fromSdkCalls({ resources: lib_1.AwsCustomResourcePolicy.ANY_RESOURCE }),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('Custom::LogRetentionPolicy', {
        'InstallLatestAwsSdk': expected,
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWN1c3RvbS1yZXNvdXJjZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzLWN1c3RvbS1yZXNvdXJjZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsMENBQTBDO0FBQzFDLHFDQUFxQztBQUNyQyx3Q0FBMkM7QUFDM0MsbUNBQXdIO0FBRXhILGdDQUFnQztBQUVoQyxJQUFJLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO0lBQ2pFLFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUU5QixPQUFPO0lBQ1AsSUFBSSx1QkFBaUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO1FBQ3JDLFlBQVksRUFBRSw0QkFBNEI7UUFDMUMsUUFBUSxFQUFFO1lBQ1IsT0FBTyxFQUFFLGdCQUFnQjtZQUN6QixNQUFNLEVBQUUsb0JBQW9CO1lBQzVCLFVBQVUsRUFBRTtnQkFDVixZQUFZLEVBQUUsc0JBQXNCO2dCQUNwQyxlQUFlLEVBQUUsRUFBRTthQUNwQjtZQUNELGtCQUFrQixFQUFFLHdCQUFrQixDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUM7U0FDdEQ7UUFDRCxRQUFRLEVBQUU7WUFDUixPQUFPLEVBQUUsZ0JBQWdCO1lBQ3pCLE1BQU0sRUFBRSx1QkFBdUI7WUFDL0IsVUFBVSxFQUFFO2dCQUNWLFlBQVksRUFBRSxzQkFBc0I7YUFDckM7U0FDRjtRQUNELE1BQU0sRUFBRSw2QkFBdUIsQ0FBQyxZQUFZLENBQUMsRUFBRSxTQUFTLEVBQUUsNkJBQXVCLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDbEcsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDRCQUE0QixFQUFFO1FBQzVFLFFBQVEsRUFBRSxJQUFJLENBQUMs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QUNWLFlBQVksRUFBRSxzQkFBc0I7Z0JBQ3BDLGVBQWUsRUFBRSxFQUFFO2FBQ3BCO1lBQ0Qsa0JBQWtCLEVBQUUsd0JBQWtCLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQztTQUN0RDtRQUNELE1BQU0sRUFBRSw2QkFBdUIsQ0FBQyxZQUFZLENBQUMsRUFBRSxTQUFTLEVBQUUsNkJBQXVCLENBQUMsWUFBWSxFQUFFLENBQUM7S0FDbEcsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDRCQUE0QixFQUFFO1FBQzVFLHFCQUFxQixFQUFFLFFBQVE7S0FDaEMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBBd3NDdXN0b21SZXNvdXJjZSwgQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3ksIFBoeXNpY2FsUmVzb3VyY2VJZCwgUGh5c2ljYWxSZXNvdXJjZUlkUmVmZXJlbmNlIH0gZnJvbSAnLi4vLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxudGVzdCgnYXdzIHNkayBqcyBjdXN0b20gcmVzb3VyY2Ugd2l0aCBvbkNyZWF0ZSBhbmQgb25EZWxldGUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6TG9nUmV0ZW50aW9uUG9saWN5JyxcbiAgICBvbkNyZWF0ZToge1xuICAgICAgc2VydmljZTogJ0Nsb3VkV2F0Y2hMb2dzJyxcbiAgICAgIGFjdGlvbjogJ3B1dFJldGVudGlvblBvbGljeScsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIGxvZ0dyb3VwTmFtZTogJy9hd3MvbGFtYmRhL2xvZ2dyb3VwJyxcbiAgICAgICAgcmV0ZW50aW9uSW5EYXlzOiA5MCxcbiAgICAgIH0sXG4gICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignbG9nZ3JvdXAnKSxcbiAgICB9LFxuICAgIG9uRGVsZXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnQ2xvdWRXYXRjaExvZ3MnLFxuICAgICAgYWN0aW9uOiAnZGVsZXRlUmV0ZW50aW9uUG9saWN5JyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgbG9nR3JvdXBOYW1lOiAnL2F3cy9sYW1iZGEvbG9nZ3JvdXAnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6TG9nUmV0ZW50aW9uUG9saWN5Jywge1xuICAgICdDcmVhdGUnOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAnc2VydmljZSc6ICdDbG91ZFdhdGNoTG9ncycsXG4gICAgICAnYWN0aW9uJzogJ3B1dFJldGVudGlvblBvbGljeScsXG4gICAgICAncGFyYW1ldGVycyc6IHtcbiAgICAgICAgJ2xvZ0dyb3VwTmFtZSc6ICcvYXdzL2xhbWJkYS9sb2dncm91cCcsXG4gICAgICAgICdyZXRlbnRpb25JbkRheXMnOiA5MCxcbiAgICAgIH0sXG4gICAgICAncGh5c2ljYWxSZXNvdXJjZUlkJzoge1xuICAgICAgICAnaWQnOiAnbG9nZ3JvdXAnLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICAnRGVsZXRlJzogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgJ3NlcnZpY2UnOiAnQ2xvdWRXYXRjaExvZ3MnLFxuICAgICAgJ2FjdGlvbic6ICdkZWxldGVSZXRlbnRpb25Qb2xpY3knLFxuICAgICAgJ3BhcmFtZXRlcnMnOiB7XG4gICAgICAgICdsb2dHcm91cE5hbWUnOiAnL2F3cy9sYW1iZGEvbG9nZ3JvdXAnLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICAnSW5zdGFsbExhdGVzdEF3c1Nkayc6IHRydWUsXG4gIH0pO1xuXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgICdQb2xpY3lEb2N1bWVudCc6IHtcbiAgICAgICdTdGF0ZW1lbnQnOiBbXG4gICAgICAgIHtcbiAgICAgICAgICAnQWN0aW9uJzogJ2xvZ3M6UHV0UmV0ZW50aW9uUG9saWN5JyxcbiAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAnQWN0aW9uJzogJ2xvZ3M6RGVsZXRlUmV0ZW50aW9uUG9saWN5JyxcbiAgICAgICAgICAnRWZmZWN0JzogJ0FsbG93JyxcbiAgICAgICAgICAnUmVzb3VyY2UnOiAnKicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnb25DcmVhdGUgZGVmYXVsdHMgdG8gb25VcGRhdGUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6UzNQdXRPYmplY3QnLFxuICAgIG9uVXBkYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnczMnLFxuICAgICAgYWN0aW9uOiAncHV0T2JqZWN0JyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgQnVja2V0OiAnbXktYnVja2V0JyxcbiAgICAgICAgS2V5OiAnbXkta2V5JyxcbiAgICAgICAgQm9keTogJ215LWJvZHknLFxuICAgICAgfSxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZSgnRVRhZycpLFxuICAgIH0sXG4gICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoeyByZXNvdXJjZXM6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LkFOWV9SRVNPVVJDRSB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpTM1B1dE9iamVjdCcsIHtcbiAgICAnQ3JlYXRlJzogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgJ3NlcnZpY2UnOiAnczMnLFxuICAgICAgJ2FjdGlvbic6ICdwdXRPYmplY3QnLFxuICAgICAgJ3BhcmFtZXRlcnMnOiB7XG4gICAgICAgICdCdWNrZXQnOiAnbXktYnVja2V0JyxcbiAgICAgICAgJ0tleSc6ICdteS1rZXknLFxuICAgICAgICAnQm9keSc6ICdteS1ib2R5JyxcbiAgICAgIH0sXG4gICAgICAncGh5c2ljYWxSZXNvdXJjZUlkJzoge1xuICAgICAgICAncmVzcG9uc2VQYXRoJzogJ0VUYWcnLFxuICAgICAgfSxcbiAgICB9KSxcbiAgICAnVXBkYXRlJzogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgJ3NlcnZpY2UnOiAnczMnLFxuICAgICAgJ2FjdGlvbic6ICdwdXRPYmplY3QnLFxuICAgICAgJ3BhcmFtZXRlcnMnOiB7XG4gICAgICAgICdCdWNrZXQnOiAnbXktYnVja2V0JyxcbiAgICAgICAgJ0tleSc6ICdteS1rZXknLFxuICAgICAgICAnQm9keSc6ICdteS1ib2R5JyxcbiAgICAgIH0sXG4gICAgICAncGh5c2ljYWxSZXNvdXJjZUlkJzoge1xuICAgICAgICAncmVzcG9uc2VQYXRoJzogJ0VUYWcnLFxuICAgICAgfSxcbiAgICB9KSxcbiAgfSk7XG59KTtcblxudGVzdCgnd2l0aCBjdXN0b20gcG9saWN5U3RhdGVtZW50cycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsnLCB7XG4gICAgb25VcGRhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdTMycsXG4gICAgICBhY3Rpb246ICdwdXRPYmplY3QnLFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBCdWNrZXQ6ICdteS1idWNrZXQnLFxuICAgICAgICBLZXk6ICdteS1rZXknLFxuICAgICAgICBCb2R5OiAnbXktYm9keScsXG4gICAgICB9LFxuICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQuZnJvbVJlc3BvbnNlKCdFVGFnJyksXG4gICAgfSxcbiAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TdGF0ZW1lbnRzKFtcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydzMzpQdXRPYmplY3QnXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbJ2Fybjphd3M6czM6OjpteS1idWNrZXQvbXkta2V5J10sXG4gICAgICB9KSxcbiAgICBdKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICAnUG9saWN5RG9jdW1lbnQnOiB7XG4gICAgICAnU3RhdGVtZW50JzogW1xuICAgICAgICB7XG4gICAgICAgICAgJ0FjdGlvbic6ICdzMzpQdXRPYmplY3QnLFxuICAgICAgICAgICdFZmZlY3QnOiAnQWxsb3cnLFxuICAgICAgICAgICdSZXNvdXJjZSc6ICdhcm46YXdzOnMzOjo6bXktYnVja2V0L215LWtleScsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgJ1ZlcnNpb24nOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnZmFpbHMgd2hlbiBubyBjYWxscyBhcmUgc3BlY2lmaWVkJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgZXhwZWN0KCgpID0+IG5ldyBBd3NDdXN0b21SZXNvdXJjZShzdGFjaywgJ0F3c1NkaycsIHtcbiAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxuICB9KSkudG9UaHJvdygvYG9uQ3JlYXRlYC4rYG9uVXBkYXRlYC4rYG9uRGVsZXRlYC8pO1xufSk7XG5cbi8vIHRlc3QgcGF0dGVybnMgZm9yIHBoeXNpY2FsUmVzb3VyY2VJZFxuLy8gfCAjIHwgICAgb25DcmVhdGUucGh5c2ljYWxSZXNvdXJjZUlkICAgIHwgICBvblVwZGF0ZS5waHlzaWNhbFJlc291cmNlSWQgICAgfCBFcnJvciB0aHJvd24/IHxcbi8vIHwtLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS18LS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLXwtLS0tLS0tLS0tLS0tLS18XG4vLyB8IDEgfCBBTllfVkFMVUUgICAgICAgICAgICAgICAgICAgICAgICAgfCBBTllfVkFMVUUgICAgICAgICAgICAgICAgICAgICAgICB8IG5vICAgICAgICAgICAgfFxuLy8gfCAyIHwgQU5ZX1ZBTFVFICAgICAgICAgICAgICAgICAgICAgICAgIHwgdW5kZWZpbmVkICAgICAgICAgICAgICAgICAgICAgICAgfCBubyAgICAgICAgICAgIHxcbi8vIHwgMyB8IHVuZGVmaW5lZCAgICAgICAgICAgICAgICAgICAgICAgICB8IEFOWV9WQUxMVUUgICAgICAgICAgICAgICAgICAgICAgIHwgeWVzICAgICAgICAgICB8XG4vLyB8IDQgfCB1bmRlZmluZWQgICAgICAgICAgICAgICAgICAgICAgICAgfCB1bmRlZmluZWQgICAgICAgICAgICAgICAgICAgICAgICB8IHllcyAgICAgICAgICAgfFxuLy8gfCA1IHwgQU5ZX1ZBTFVFICAgICAgICAgICAgICAgICAgICAgICAgIHwgdW5kZWZpbmVkICgqb21pdCB3aG9sZSBvblVwZGF0ZSkgfCBubyAgICAgICAgICAgIHxcbi8vIHwgNiB8IHVuZGVmaW5lZCAgICAgICAgICAgICAgICAgICAgICAgICB8IHVuZGVmaW5lZCAoKm9taXQgd2hvbGUgb25VcGRhdGUpIHwgeWVzICAgICAgICAgICB8XG4vLyB8IDcgfCBBTllfVkFMVUUgKCpjb3BpZWQgZnJvbSBvblVwZGF0ZSkgfCBBTllfVkFMVUUgICAgICAgICAgICAgICAgICAgICAgICB8IG5vICAgICAgICAgICAgfFxuLy8gfCA4IHwgdW5kZWZpbmVkICgqY29waWVkIGZyb20gb25VcGRhdGUpIHwgdW5kZWZpbmVkICAgICAgICAgICAgICAgICAgICAgICAgfCB5ZXMgICAgICAgICAgIHxcbmRlc2NyaWJlKCdwaHlzaWNhbFJlc291cmNlSWQgcGF0dGVybnMnLCAoKSA9PiB7XG4gIC8vIHBoeXNpY2FsUmVzb3VyY2VJZCBwYXR0ZXJuICMxXG4gIHRlc3QoJ3BoeXNpY2FsUmVzb3VyY2VJZCBpcyBzcGVjaWZpZWQgYm90aCBpbiBvbkNyZWF0ZSBhbmQgb25VcGRhdGUgdGhlbiBzdWNjZXNzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpBdGhlbmFOb3RlYm9vaycsXG4gICAgICBvbkNyZWF0ZToge1xuICAgICAgICBzZXJ2aWNlOiAnQXRoZW5hJyxcbiAgICAgICAgYWN0aW9uOiAnY3JlYXRlTm90ZWJvb2snLFxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIFdvcmtHcm91cDogJ1dvcmtHcm91cEEnLFxuICAgICAgICAgIE5hbWU6ICdOb3RlYm9vazEnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG9uVXBkYXRlOiB7XG4gICAgICAgIHNlcnZpY2U6ICdBdGhlbmEnLFxuICAgICAgICBhY3Rpb246ICd1cGRhdGVOb3RlYm9va01ldGFkYXRhJyxcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ2lkJyksXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBOYW1lOiAnTm90ZWJvb2sxJyxcbiAgICAgICAgICBOb3RlYm9va0lkOiBuZXcgUGh5c2ljYWxSZXNvdXJjZUlkUmVmZXJlbmNlKCksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoeyByZXNvdXJjZXM6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LkFOWV9SRVNPVVJDRSB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBdGhlbmFOb3RlYm9vaycsIHtcbiAgICAgIENyZWF0ZTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBzZXJ2aWNlOiAnQXRoZW5hJyxcbiAgICAgICAgYWN0aW9uOiAnY3JlYXRlTm90ZWJvb2snLFxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IHtcbiAgICAgICAgICBpZDogJ2lkJyxcbiAgICAgICAgfSxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIFdvcmtHcm91cDogJ1dvcmtHcm91cEEnLFxuICAgICAgICAgIE5hbWU6ICdOb3RlYm9vazEnLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBVcGRhdGU6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc2VydmljZTogJ0F0aGVuYScsXG4gICAgICAgIGFjdGlvbjogJ3VwZGF0ZU5vdGVib29rTWV0YWRhdGEnLFxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IHtcbiAgICAgICAgICBpZDogJ2lkJyxcbiAgICAgICAgfSxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIE5hbWU6ICdOb3RlYm9vazEnLFxuICAgICAgICAgIE5vdGVib29rSWQ6ICdQSFlTSUNBTDpSRVNPVVJDRUlEOicsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gcGh5c2ljYWxSZXNvdXJjZUlkIHBhdHRlcm4gIzJcbiAgdGVzdCgncGh5c2ljYWxSZXNvdXJjZUlkIGlzIHNwZWNpZmllZCBpbiBvbkNyZWF0ZSwgaXMgbm90IGluIG9uVXBkYXRlIHRoZW4gYWJzZW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpBdGhlbmFOb3RlYm9vaycsXG4gICAgICBvbkNyZWF0ZToge1xuICAgICAgICBzZXJ2aWNlOiAnQXRoZW5hJyxcbiAgICAgICAgYWN0aW9uOiAnY3JlYXRlTm90ZWJvb2snLFxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5mcm9tUmVzcG9uc2UoJ05vdGVib29rSWQnKSxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIFdvcmtHcm91cDogJ1dvcmtHcm91cEEnLFxuICAgICAgICAgIE5hbWU6ICdOb3RlYm9vazEnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIG9uVXBkYXRlOiB7XG4gICAgICAgIHNlcnZpY2U6ICdBdGhlbmEnLFxuICAgICAgICBhY3Rpb246ICd1cGRhdGVOb3RlYm9va01ldGFkYXRhJyxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIE5hbWU6ICdOb3RlYm9vazEnLFxuICAgICAgICAgIE5vdGVib29rSWQ6IG5ldyBQaHlzaWNhbFJlc291cmNlSWRSZWZlcmVuY2UoKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkF0aGVuYU5vdGVib29rJywge1xuICAgICAgQ3JlYXRlOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHNlcnZpY2U6ICdBdGhlbmEnLFxuICAgICAgICBhY3Rpb246ICdjcmVhdGVOb3RlYm9vaycsXG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDoge1xuICAgICAgICAgIHJlc3BvbnNlUGF0aDogJ05vdGVib29rSWQnLFxuICAgICAgICB9LFxuICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgV29ya0dyb3VwOiAnV29ya0dyb3VwQScsXG4gICAgICAgICAgTmFtZTogJ05vdGVib29rMScsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFVwZGF0ZTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBzZXJ2aWNlOiAnQXRoZW5hJyxcbiAgICAgICAgYWN0aW9uOiAndXBkYXRlTm90ZWJvb2tNZXRhZGF0YScsXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBOYW1lOiAnTm90ZWJvb2sxJyxcbiAgICAgICAgICBOb3RlYm9va0lkOiAnUEhZU0lDQUw6UkVTT1VSQ0VJRDonLFxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIHBoeXNpY2FsUmVzb3VyY2VJZCBwYXR0ZXJuICMzXG4gIHRlc3QoJ3BoeXNpY2FsUmVzb3VyY2VJZCBpcyBub3Qgc3BlY2lmaWVkIGluIG9uQ3JlYXRlIGJ1dCBvblVwZGF0ZSB0aGVuIGZhaWwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgICAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206OkF0aGVuYU5vdGVib29rJyxcbiAgICAgICAgb25DcmVhdGU6IHtcbiAgICAgICAgICBzZXJ2aWNlOiAnQXRoZW5hJyxcbiAgICAgICAgICBhY3Rpb246ICdjcmVhdGVOb3RlYm9vaycsXG4gICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgV29ya0dyb3VwOiAnV29ya0dyb3VwQScsXG4gICAgICAgICAgICBOYW1lOiAnTm90ZWJvb2sxJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBvblVwZGF0ZToge1xuICAgICAgICAgIHNlcnZpY2U6ICdBdGhlbmEnLFxuICAgICAgICAgIGFjdGlvbjogJ3VwZGF0ZU5vdGVib29rTWV0YWRhdGEnLFxuICAgICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdpZCcpLFxuICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIE5hbWU6ICdOb3RlYm9vazEnLFxuICAgICAgICAgICAgTm90ZWJvb2tJZDogbmV3IFBoeXNpY2FsUmVzb3VyY2VJZFJlZmVyZW5jZSgpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC8ncGh5c2ljYWxSZXNvdXJjZUlkJyBtdXN0IGJlIHNwZWNpZmllZCBmb3IgJ29uQ3JlYXRlJyBjYWxsLi8pO1xuICB9KTtcblxuICAvLyBwaHlzaWNhbFJlc291cmNlSWQgcGF0dGVybiAjNFxuICB0ZXN0KCdwaHlzaWNhbFJlc291cmNlSWQgaXMgbm90IHNwZWNpZmllZCBib3RoIGluIG9uQ3JlYXRlIGFuZCBvblVwZGF0ZSB0aGVuIGZhaWwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgICAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206OkF0aGVuYU5vdGVib29rJyxcbiAgICAgICAgb25DcmVhdGU6IHtcbiAgICAgICAgICBzZXJ2aWNlOiAnQXRoZW5hJyxcbiAgICAgICAgICBhY3Rpb246ICdjcmVhdGVOb3RlYm9vaycsXG4gICAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgV29ya0dyb3VwOiAnV29ya0dyb3VwQScsXG4gICAgICAgICAgICBOYW1lOiAnTm90ZWJvb2sxJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBvblVwZGF0ZToge1xuICAgICAgICAgIHNlcnZpY2U6ICdBdGhlbmEnLFxuICAgICAgICAgIGFjdGlvbjogJ3VwZGF0ZU5vdGVib29rTWV0YWRhdGEnLFxuICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIE5hbWU6ICdOb3RlYm9vazEnLFxuICAgICAgICAgICAgTm90ZWJvb2tJZDogbmV3IFBoeXNpY2FsUmVzb3VyY2VJZFJlZmVyZW5jZSgpLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC8ncGh5c2ljYWxSZXNvdXJjZUlkJyBtdXN0IGJlIHNwZWNpZmllZCBmb3IgJ29uQ3JlYXRlJyBjYWxsLi8pO1xuICB9KTtcblxuICAvLyBwaHlzaWNhbFJlc291cmNlSWQgcGF0dGVybiAjNVxuICB0ZXN0KCdwaHlzaWNhbFJlc291cmNlSWQgaXMgc3BlY2lmaWVkIGluIG9uQ3JlYXRlIHdpdGggZW1wdHkgb25VcGRhdGUgdGhlbiBzdWNjZXNzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpBdGhlbmFOb3RlYm9vaycsXG4gICAgICBvbkNyZWF0ZToge1xuICAgICAgICBzZXJ2aWNlOiAnQXRoZW5hJyxcbiAgICAgICAgYWN0aW9uOiAnY3JlYXRlTm90ZWJvb2snLFxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIFdvcmtHcm91cDogJ1dvcmtHcm91cEEnLFxuICAgICAgICAgIE5hbWU6ICdOb3RlYm9vazEnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QXRoZW5hTm90ZWJvb2snLCB7XG4gICAgICBDcmVhdGU6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc2VydmljZTogJ0F0aGVuYScsXG4gICAgICAgIGFjdGlvbjogJ2NyZWF0ZU5vdGVib29rJyxcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiB7XG4gICAgICAgICAgaWQ6ICdpZCcsXG4gICAgICAgIH0sXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBXb3JrR3JvdXA6ICdXb3JrR3JvdXBBJyxcbiAgICAgICAgICBOYW1lOiAnTm90ZWJvb2sxJyxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9KTtcblxuICAvLyBwaHlzaWNhbFJlc291cmNlSWQgcGF0dGVybiAjNlxuICB0ZXN0KCdwaHlzaWNhbFJlc291cmNlSWQgaXMgbm90IHNwZWNpZmllZCBvbkNyZWF0ZSB3aXRoIGVtcHR5IG9uVXBkYXRlIHRoZW4gZmFpbCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsnLCB7XG4gICAgICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6QXRoZW5hTm90ZWJvb2snLFxuICAgICAgICBvbkNyZWF0ZToge1xuICAgICAgICAgIHNlcnZpY2U6ICdBdGhlbmEnLFxuICAgICAgICAgIGFjdGlvbjogJ2NyZWF0ZU5vdGVib29rJyxcbiAgICAgICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgICBXb3JrR3JvdXA6ICdXb3JrR3JvdXBBJyxcbiAgICAgICAgICAgIE5hbWU6ICdOb3RlYm9vazEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC8ncGh5c2ljYWxSZXNvdXJjZUlkJyBtdXN0IGJlIHNwZWNpZmllZCBmb3IgJ29uQ3JlYXRlJyBjYWxsLi8pO1xuICB9KTtcblxuICAvLyBwaHlzaWNhbFJlc291cmNlSWQgcGF0dGVybiAjN1xuICB0ZXN0KCdvbkNyZWF0ZSBhbmQgb25VcGRhdGUgYm90aCBoYXZlIHBoeXNpY2FsUmVzb3VyY2VJZCB3aGVuIHBoeXNpY2FsUmVzb3VyY2VJZCBpcyBzcGVjaWZpZWQgaW4gb25VcGRhdGUsIGV2ZW4gd2hlbiBvbkNyZWF0ZSBpcyB1bnNwZWNpZmllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBBd3NDdXN0b21SZXNvdXJjZShzdGFjaywgJ0F3c1NkaycsIHtcbiAgICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6QXRoZW5hTm90ZWJvb2snLFxuICAgICAgb25VcGRhdGU6IHtcbiAgICAgICAgc2VydmljZTogJ0F0aGVuYScsXG4gICAgICAgIGFjdGlvbjogJ3VwZGF0ZU5vdGVib29rTWV0YWRhdGEnLFxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIE5hbWU6ICdOb3RlYm9vazEnLFxuICAgICAgICAgIE5vdGVib29rSWQ6ICdYWFhYJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxuICAgIH0pO1xuXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QXRoZW5hTm90ZWJvb2snLCB7XG4gICAgICBDcmVhdGU6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgc2VydmljZTogJ0F0aGVuYScsXG4gICAgICAgIGFjdGlvbjogJ3VwZGF0ZU5vdGVib29rTWV0YWRhdGEnLFxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IHtcbiAgICAgICAgICBpZDogJ2lkJyxcbiAgICAgICAgfSxcbiAgICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICAgIE5hbWU6ICdOb3RlYm9vazEnLFxuICAgICAgICAgIE5vdGVib29rSWQ6ICdYWFhYJyxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgVXBkYXRlOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIHNlcnZpY2U6ICdBdGhlbmEnLFxuICAgICAgICBhY3Rpb246ICd1cGRhdGVOb3RlYm9va01ldGFkYXRhJyxcbiAgICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiB7XG4gICAgICAgICAgaWQ6ICdpZCcsXG4gICAgICAgIH0sXG4gICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBOYW1lOiAnTm90ZWJvb2sxJyxcbiAgICAgICAgICBOb3RlYm9va0lkOiAnWFhYWCcsXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gcGh5c2ljYWxSZXNvdXJjZUlkIHBhdHRlcm4gIzhcbiAgdGVzdCgnT21pdHRpbmcgcGh5c2ljYWxSZXNvdXJjZUlkIGluIG9uQ3JlYXRlIHdoZW4gb25VcGRhdGUgaXMgdW5kZWZpbmVkIHRocm93cyBhbiBlcnJvcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsnLCB7XG4gICAgICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6QXRoZW5hTm90ZWJvb2snLFxuICAgICAgICBvblVwZGF0ZToge1xuICAgICAgICAgIHNlcnZpY2U6ICdBdGhlbmEnLFxuICAgICAgICAgIGFjdGlvbjogJ3VwZGF0ZU5vdGVib29rTWV0YWRhdGEnLFxuICAgICAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIE5hbWU6ICdOb3RlYm9vazEnLFxuICAgICAgICAgICAgTm90ZWJvb2tJZDogJ1hYWFgnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KC8ncGh5c2ljYWxSZXNvdXJjZUlkJyBtdXN0IGJlIHNwZWNpZmllZCBmb3IgJ29uVXBkYXRlJyBjYWxsIHdoZW4gJ29uQ3JlYXRlJyBpcyBvbWl0dGVkLi8pO1xuICB9KTtcbn0pO1xuXG50ZXN0KCdib29sZWFucyBhcmUgZW5jb2RlZCBpbiB0aGUgc3RyaW5naWZpZWQgcGFyYW1ldGVycyBvYmplY3QnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6U2VydmljZUFjdGlvbicsXG4gICAgb25DcmVhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdzZXJ2aWNlJyxcbiAgICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIHRydWVCb29sZWFuOiB0cnVlLFxuICAgICAgICB0cnVlU3RyaW5nOiAndHJ1ZScsXG4gICAgICAgIGZhbHNlQm9vbGVhbjogZmFsc2UsXG4gICAgICAgIGZhbHNlU3RyaW5nOiAnZmFsc2UnLFxuICAgICAgfSxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdpZCcpLFxuICAgIH0sXG4gICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoeyByZXNvdXJjZXM6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LkFOWV9SRVNPVVJDRSB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpTZXJ2aWNlQWN0aW9uJywge1xuICAgICdDcmVhdGUnOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAnc2VydmljZSc6ICdzZXJ2aWNlJyxcbiAgICAgICdhY3Rpb24nOiAnYWN0aW9uJyxcbiAgICAgICdwYXJhbWV0ZXJzJzoge1xuICAgICAgICAndHJ1ZUJvb2xlYW4nOiB0cnVlLFxuICAgICAgICAndHJ1ZVN0cmluZyc6ICd0cnVlJyxcbiAgICAgICAgJ2ZhbHNlQm9vbGVhbic6IGZhbHNlLFxuICAgICAgICAnZmFsc2VTdHJpbmcnOiAnZmFsc2UnLFxuICAgICAgfSxcbiAgICAgICdwaHlzaWNhbFJlc291cmNlSWQnOiB7XG4gICAgICAgICdpZCc6ICdpZCcsXG4gICAgICB9LFxuICAgIH0pLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdmYWlscyBQaHlzaWNhbFJlc291cmNlSWRSZWZlcmVuY2UgaXMgcGFzc2VkIHRvIG9uQ3JlYXRlIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBleHBlY3QoKCkgPT4gbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6U2VydmljZUFjdGlvbicsXG4gICAgb25DcmVhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdzZXJ2aWNlJyxcbiAgICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZFJlZmVyZW5jZTogbmV3IFBoeXNpY2FsUmVzb3VyY2VJZFJlZmVyZW5jZSgpLFxuICAgICAgfSxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdpZCcpLFxuICAgIH0sXG4gICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoeyByZXNvdXJjZXM6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LkFOWV9SRVNPVVJDRSB9KSxcbiAgfSkpLnRvVGhyb3coJ2BQaHlzaWNhbFJlc291cmNlSWRSZWZlcmVuY2VgIG11c3Qgbm90IGJlIHNwZWNpZmllZCBpbiBgb25DcmVhdGVgIHBhcmFtZXRlcnMuJyk7XG59KTtcblxudGVzdCgnZW5jb2RlcyBwaHlzaWNhbCByZXNvdXJjZSBpZCByZWZlcmVuY2UnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6U2VydmljZUFjdGlvbicsXG4gICAgb25VcGRhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdzZXJ2aWNlJyxcbiAgICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIHRydWVCb29sZWFuOiB0cnVlLFxuICAgICAgICB0cnVlU3RyaW5nOiAndHJ1ZScsXG4gICAgICAgIGZhbHNlQm9vbGVhbjogZmFsc2UsXG4gICAgICAgIGZhbHNlU3RyaW5nOiAnZmFsc2UnLFxuICAgICAgICBwaHlzaWNhbFJlc291cmNlSWRSZWZlcmVuY2U6IG5ldyBQaHlzaWNhbFJlc291cmNlSWRSZWZlcmVuY2UoKSxcbiAgICAgIH0sXG4gICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICB9LFxuICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6U2VydmljZUFjdGlvbicsIHtcbiAgICAnQ3JlYXRlJzogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgJ3NlcnZpY2UnOiAnc2VydmljZScsXG4gICAgICAnYWN0aW9uJzogJ2FjdGlvbicsXG4gICAgICAncGFyYW1ldGVycyc6IHtcbiAgICAgICAgJ3RydWVCb29sZWFuJzogdHJ1ZSxcbiAgICAgICAgJ3RydWVTdHJpbmcnOiAndHJ1ZScsXG4gICAgICAgICdmYWxzZUJvb2xlYW4nOiBmYWxzZSxcbiAgICAgICAgJ2ZhbHNlU3RyaW5nJzogJ2ZhbHNlJyxcbiAgICAgICAgJ3BoeXNpY2FsUmVzb3VyY2VJZFJlZmVyZW5jZSc6ICdQSFlTSUNBTDpSRVNPVVJDRUlEOicsXG4gICAgICB9LFxuICAgICAgJ3BoeXNpY2FsUmVzb3VyY2VJZCc6IHtcbiAgICAgICAgJ2lkJzogJ2lkJyxcbiAgICAgIH0sXG4gICAgfSksXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3RpbWVvdXQgZGVmYXVsdHMgdG8gMiBtaW51dGVzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBBd3NDdXN0b21SZXNvdXJjZShzdGFjaywgJ0F3c1NkaycsIHtcbiAgICBvbkNyZWF0ZToge1xuICAgICAgc2VydmljZTogJ3NlcnZpY2UnLFxuICAgICAgYWN0aW9uOiAnYWN0aW9uJyxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdpZCcpLFxuICAgIH0sXG4gICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoeyByZXNvdXJjZXM6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LkFOWV9SRVNPVVJDRSB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgIFRpbWVvdXQ6IDEyMCxcbiAgfSk7XG59KTtcblxudGVzdCgnY2FuIHNwZWNpZnkgdGltZW91dCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsnLCB7XG4gICAgb25DcmVhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdzZXJ2aWNlJyxcbiAgICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICB9LFxuICAgIHRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDE1KSxcbiAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgVGltZW91dDogOTAwLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdpbXBsZW1lbnRzIElHcmFudGFibGUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCByb2xlID0gbmV3IGlhbS5Sb2xlKHN0YWNrLCAnUm9sZScsIHtcbiAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWMyLmFtYXpvbmF3cy5jb20nKSxcbiAgfSk7XG4gIGNvbnN0IGN1c3RvbVJlc291cmNlID0gbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIG9uQ3JlYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnc2VydmljZScsXG4gICAgICBhY3Rpb246ICdhY3Rpb24nLFxuICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ2lkJyksXG4gICAgfSxcbiAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIHJvbGUuZ3JhbnRQYXNzUm9sZShjdXN0b21SZXNvdXJjZS5ncmFudFByaW5jaXBhbCk7XG5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiAnaWFtOlBhc3NSb2xlJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnUm9sZTFBQkNDNUYwJyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NhbiB1c2UgZXhpc3Rpbmcgcm9sZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHJvbGUgPSBpYW0uUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ1JvbGUnLCAnYXJuOmF3czppYW06OjEyMzQ1Njc4OTAxMjpyb2xlL0Nvb2xSb2xlJyk7XG5cbiAgLy8gV0hFTlxuICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsnLCB7XG4gICAgb25DcmVhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdzZXJ2aWNlJyxcbiAgICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICB9LFxuICAgIHJvbGUsXG4gICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoeyByZXNvdXJjZXM6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LkFOWV9SRVNPVVJDRSB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgIFJvbGU6ICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvQ29vbFJvbGUnLFxuICB9KTtcblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlJvbGUnLCAwKTtcbn0pO1xuXG50ZXN0KCdnZXREYXRhJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYXdzU2RrID0gbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIG9uQ3JlYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnc2VydmljZScsXG4gICAgICBhY3Rpb246ICdhY3Rpb24nLFxuICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ2lkJyksXG4gICAgfSxcbiAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IHRva2VuID0gYXdzU2RrLmdldFJlc3BvbnNlRmllbGRSZWZlcmVuY2UoJ0RhdGEnKTtcblxuICAvLyBUSEVOXG4gIGV4cGVjdChzdGFjay5yZXNvbHZlKHRva2VuKSkudG9FcXVhbCh7XG4gICAgJ0ZuOjpHZXRBdHQnOiBbXG4gICAgICAnQXdzU2RrRTk2NkZFNDMnLFxuICAgICAgJ0RhdGEnLFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2ZhaWxzIHdoZW4gZ2V0RGF0YSBpcyB1c2VkIHdpdGggYGlnbm9yZUVycm9yQ29kZXNNYXRjaGluZ2AnLCAoKSA9PiB7XG5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsnLCB7XG4gICAgb25VcGRhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdDbG91ZFdhdGNoTG9ncycsXG4gICAgICBhY3Rpb246ICdwdXRSZXRlbnRpb25Qb2xpY3knLFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBsb2dHcm91cE5hbWU6ICcvYXdzL2xhbWJkYS9sb2dncm91cCcsXG4gICAgICAgIHJldGVudGlvbkluRGF5czogOTAsXG4gICAgICB9LFxuICAgICAgaWdub3JlRXJyb3JDb2Rlc01hdGNoaW5nOiAnLionLFxuICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ0lkJyksXG4gICAgfSxcbiAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxuICB9KTtcblxuICBleHBlY3QoKCkgPT4gcmVzb3VyY2UuZ2V0UmVzcG9uc2VGaWVsZFJlZmVyZW5jZSgnU2hvdWxkRmFpbCcpKS50b1Rocm93KC9gZ2V0RGF0YWAuK2BpZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmdgLyk7XG5cbn0pO1xuXG50ZXN0KCdmYWlscyB3aGVuIGdldERhdGFTdHJpbmcgaXMgdXNlZCB3aXRoIGBpZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmdgJywgKCkgPT4ge1xuXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIGNvbnN0IHJlc291cmNlID0gbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIG9uVXBkYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnQ2xvdWRXYXRjaExvZ3MnLFxuICAgICAgYWN0aW9uOiAncHV0UmV0ZW50aW9uUG9saWN5JyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgbG9nR3JvdXBOYW1lOiAnL2F3cy9sYW1iZGEvbG9nZ3JvdXAnLFxuICAgICAgICByZXRlbnRpb25JbkRheXM6IDkwLFxuICAgICAgfSxcbiAgICAgIGlnbm9yZUVycm9yQ29kZXNNYXRjaGluZzogJy4qJyxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdJZCcpLFxuICAgIH0sXG4gICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoeyByZXNvdXJjZXM6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LkFOWV9SRVNPVVJDRSB9KSxcbiAgfSk7XG5cbiAgZXhwZWN0KCgpID0+IHJlc291cmNlLmdldFJlc3BvbnNlRmllbGQoJ1Nob3VsZEZhaWwnKSkudG9UaHJvdygvYGdldERhdGFTdHJpbmdgLitgaWdub3JlRXJyb3JDb2Rlc01hdGNoaW5nYC8pO1xuXG59KTtcblxudGVzdCgnZmFpbCB3aGVuIGBQaHlzaWNhbFJlc291cmNlSWQuZnJvbVJlc3BvbnNlYCBpcyB1c2VkIHdpdGggYGlnbm9yZUVycm9yQ29kZXNNYXRjaGluZycsICgpID0+IHtcblxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgZXhwZWN0KCgpID0+IG5ldyBBd3NDdXN0b21SZXNvdXJjZShzdGFjaywgJ0F3c1Nka09uVXBkYXRlJywge1xuICAgIG9uVXBkYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnQ2xvdWRXYXRjaExvZ3MnLFxuICAgICAgYWN0aW9uOiAncHV0UmV0ZW50aW9uUG9saWN5JyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgbG9nR3JvdXBOYW1lOiAnL2F3cy9sYW1iZGEvbG9nZ3JvdXAnLFxuICAgICAgICByZXRlbnRpb25JbkRheXM6IDkwLFxuICAgICAgfSxcbiAgICAgIGlnbm9yZUVycm9yQ29kZXNNYXRjaGluZzogJy4qJyxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZSgnUmVzcG9uc2UnKSxcbiAgICB9LFxuICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gIH0pKS50b1Rocm93KC9gUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZWAuK2BpZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmdgLyk7XG5cbiAgZXhwZWN0KCgpID0+IG5ldyBBd3NDdXN0b21SZXNvdXJjZShzdGFjaywgJ0F3c1Nka09uQ3JlYXRlJywge1xuICAgIG9uQ3JlYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnQ2xvdWRXYXRjaExvZ3MnLFxuICAgICAgYWN0aW9uOiAncHV0UmV0ZW50aW9uUG9saWN5JyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgbG9nR3JvdXBOYW1lOiAnL2F3cy9sYW1iZGEvbG9nZ3JvdXAnLFxuICAgICAgICByZXRlbnRpb25JbkRheXM6IDkwLFxuICAgICAgfSxcbiAgICAgIGlnbm9yZUVycm9yQ29kZXNNYXRjaGluZzogJy4qJyxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZSgnUmVzcG9uc2UnKSxcbiAgICB9LFxuICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gIH0pKS50b1Rocm93KC9gUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZWAuK2BpZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmdgLyk7XG5cbiAgZXhwZWN0KCgpID0+IG5ldyBBd3NDdXN0b21SZXNvdXJjZShzdGFjaywgJ0F3c1Nka09uRGVsZXRlJywge1xuICAgIG9uRGVsZXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnQ2xvdWRXYXRjaExvZ3MnLFxuICAgICAgYWN0aW9uOiAncHV0UmV0ZW50aW9uUG9saWN5JyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgbG9nR3JvdXBOYW1lOiAnL2F3cy9sYW1iZGEvbG9nZ3JvdXAnLFxuICAgICAgICByZXRlbnRpb25JbkRheXM6IDkwLFxuICAgICAgfSxcbiAgICAgIGlnbm9yZUVycm9yQ29kZXNNYXRjaGluZzogJy4qJyxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZSgnUmVzcG9uc2UnKSxcbiAgICB9LFxuICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gIH0pKS50b1Rocm93KC9gUGh5c2ljYWxSZXNvdXJjZUlkLmZyb21SZXNwb25zZWAuK2BpZ25vcmVFcnJvckNvZGVzTWF0Y2hpbmdgLyk7XG5cbn0pO1xuXG50ZXN0KCdnZXREYXRhU3RyaW5nJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgYXdzU2RrID0gbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrMScsIHtcbiAgICBvbkNyZWF0ZToge1xuICAgICAgc2VydmljZTogJ3NlcnZpY2UnLFxuICAgICAgYWN0aW9uOiAnYWN0aW9uJyxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdpZCcpLFxuICAgIH0sXG4gICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoeyByZXNvdXJjZXM6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LkFOWV9SRVNPVVJDRSB9KSxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsyJywge1xuICAgIG9uQ3JlYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnc2VydmljZScsXG4gICAgICBhY3Rpb246ICdhY3Rpb24nLFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBhOiBhd3NTZGsuZ2V0UmVzcG9uc2VGaWVsZCgnRGF0YScpLFxuICAgICAgfSxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdpZCcpLFxuICAgIH0sXG4gICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoeyByZXNvdXJjZXM6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LkFOWV9SRVNPVVJDRSB9KSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQ3VzdG9tOjpBV1MnLCB7XG4gICAgQ3JlYXRlOiB7XG4gICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICcnLFxuICAgICAgICBbXG4gICAgICAgICAgJ3tcInNlcnZpY2VcIjpcInNlcnZpY2VcIixcImFjdGlvblwiOlwiYWN0aW9uXCIsXCJwYXJhbWV0ZXJzXCI6e1wiYVwiOlwiJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAgICAgJ0F3c1NkazE1NUI5MTA3MScsXG4gICAgICAgICAgICAgICdEYXRhJyxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICAnXCJ9LFwicGh5c2ljYWxSZXNvdXJjZUlkXCI6e1wiaWRcIjpcImlkXCJ9fScsXG4gICAgICAgIF0sXG4gICAgICBdLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NhbiBzcGVjaWZ5IGxvZyByZXRlbnRpb24nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIG9uQ3JlYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnc2VydmljZScsXG4gICAgICBhY3Rpb246ICdhY3Rpb24nLFxuICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ2lkJyksXG4gICAgfSxcbiAgICBsb2dSZXRlbnRpb246IGxvZ3MuUmV0ZW50aW9uRGF5cy5PTkVfV0VFSyxcbiAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkxvZ1JldGVudGlvbicsIHtcbiAgICBMb2dHcm91cE5hbWU6IHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICAnL2F3cy9sYW1iZGEvJyxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBSZWY6ICdBV1M2NzlmNTNmYWMwMDI0MzBjYjBkYTViNzk4MmJkMjI4NzJEMTY0QzRDJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgXSxcbiAgICB9LFxuICAgIFJldGVudGlvbkluRGF5czogNyxcbiAgfSk7XG59KTtcblxudGVzdCgnZGlzYWJsZSBBV1MgU0RLIGluc3RhbGxhdGlvbicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsnLCB7XG4gICAgaW5zdGFsbExhdGVzdEF3c1NkazogZmFsc2UsXG4gICAgb25DcmVhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdzZXJ2aWNlJyxcbiAgICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICB9LFxuICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTJywge1xuICAgICdJbnN0YWxsTGF0ZXN0QXdzU2RrJzogZmFsc2UsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NhbiBzcGVjaWZ5IGZ1bmN0aW9uIG5hbWUnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIG9uQ3JlYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnc2VydmljZScsXG4gICAgICBhY3Rpb246ICdhY3Rpb24nLFxuICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ2lkJyksXG4gICAgfSxcbiAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxuICAgIGZ1bmN0aW9uTmFtZTogJ215LWNvb2wtZnVuY3Rpb24nLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgRnVuY3Rpb25OYW1lOiAnbXktY29vbC1mdW5jdGlvbicsXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3NlcGFyYXRlIHBvbGljaWVzIHBlciBjdXN0b20gcmVzb3VyY2UnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQ3VzdG9tMScsIHtcbiAgICBvbkNyZWF0ZToge1xuICAgICAgc2VydmljZTogJ3NlcnZpY2UxJyxcbiAgICAgIGFjdGlvbjogJ2FjdGlvbjEnLFxuICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ2lkMScpLFxuICAgIH0sXG4gICAgcG9saWN5OiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5mcm9tU2RrQ2FsbHMoeyByZXNvdXJjZXM6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LkFOWV9SRVNPVVJDRSB9KSxcbiAgfSk7XG4gIG5ldyBBd3NDdXN0b21SZXNvdXJjZShzdGFjaywgJ0N1c3RvbTInLCB7XG4gICAgb25DcmVhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdzZXJ2aWNlMicsXG4gICAgICBhY3Rpb246ICdhY3Rpb24yJyxcbiAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdpZDInKSxcbiAgICB9LFxuICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpQb2xpY3knLCB7XG4gICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiAnc2VydmljZTE6QWN0aW9uMScsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiAnKicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgIH0sXG4gIH0pO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdzZXJ2aWNlMjpBY3Rpb24yJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgndG9rZW5zIGNhbiBiZSB1c2VkIGFzIGRpY3Rpb25hcnkga2V5cycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IGR1bW15ID0gbmV3IGNkay5DZm5SZXNvdXJjZShzdGFjaywgJ015UmVzb3VyY2UnLCB7XG4gICAgdHlwZTogJ0FXUzo6TXk6OlJlc291cmNlJyxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdDdXN0b20xJywge1xuICAgIG9uQ3JlYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnc2VydmljZTEnLFxuICAgICAgYWN0aW9uOiAnYWN0aW9uMScsXG4gICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQxJyksXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIFtkdW1teS5yZWZdOiB7XG4gICAgICAgICAgRm9vOiAxMjM0LFxuICAgICAgICAgIEJhcjogZHVtbXkuZ2V0QXR0KCdGb29yeicpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0N1c3RvbTo6QVdTJywge1xuICAgIENyZWF0ZToge1xuICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAnJyxcbiAgICAgICAgW1xuICAgICAgICAgICd7XCJzZXJ2aWNlXCI6XCJzZXJ2aWNlMVwiLFwiYWN0aW9uXCI6XCJhY3Rpb24xXCIsXCJwaHlzaWNhbFJlc291cmNlSWRcIjp7XCJpZFwiOlwiaWQxXCJ9LFwicGFyYW1ldGVyc1wiOntcIicsXG4gICAgICAgICAge1xuICAgICAgICAgICAgJ1JlZic6ICdNeVJlc291cmNlJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICdcIjp7XCJGb29cIjoxMjM0LFwiQmFyXCI6XCInLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnTXlSZXNvdXJjZScsXG4gICAgICAgICAgICAgICdGb29yeicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ1wifX19JyxcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgnYXNzdW1lZFJvbGVBcm4gYWRkcyBzdGF0ZW1lbnQgZm9yIHN0czphc3N1bWVSb2xlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBBd3NDdXN0b21SZXNvdXJjZShzdGFjaywgJ0F3c1NkaycsIHtcbiAgICBvbkNyZWF0ZToge1xuICAgICAgYXNzdW1lZFJvbGVBcm46ICdyb2xlQXJuJyxcbiAgICAgIHNlcnZpY2U6ICdzZXJ2aWNlJyxcbiAgICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICB9LFxuICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cblxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgIFJlc291cmNlOiAncm9sZUFybicsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2ZhaWxzIHdoZW4gYXQgbGVhc3Qgb25lIG9mIHBvbGljeSBvciByb2xlIGlzIG5vdCBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBleHBlY3QoKCkgPT4gbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIG9uVXBkYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnc2VydmljZScsXG4gICAgICBhY3Rpb246ICdhY3Rpb24nLFxuICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ2lkJyksXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIHBhcmFtOiAncGFyYW0nLFxuICAgICAgfSxcbiAgICB9LFxuICB9KSkudG9UaHJvdygvYHBvbGljeWAuK2Byb2xlYC8pO1xufSk7XG5cbnRlc3QoJ2NhbiBwcm92aWRlIG5vIHBvbGljeSBpZiB1c2luZyBleGlzdGluZyByb2xlJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3Qgcm9sZSA9IGlhbS5Sb2xlLmZyb21Sb2xlQXJuKHN0YWNrLCAnUm9sZScsICdhcm46YXdzOmlhbTo6MTIzNDU2Nzg5MDEyOnJvbGUvQ29vbFJvbGUnKTtcbiAgLy8gV0hFTlxuICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsnLCB7XG4gICAgb25DcmVhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdzZXJ2aWNlJyxcbiAgICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICB9LFxuICAgIHJvbGUsXG4gIH0pO1xuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OklBTTo6Um9sZScsIDApO1xuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpJQU06OlBvbGljeScsIDApO1xufSk7XG5cbnRlc3QoJ2NhbiBzcGVjaWZ5IFZQQycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVGVzdFZwYycpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIG9uQ3JlYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnc2VydmljZScsXG4gICAgICBhY3Rpb246ICdhY3Rpb24nLFxuICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ2lkJyksXG4gICAgfSxcbiAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxuICAgIHZwYyxcbiAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgfSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgIFZwY0NvbmZpZzoge1xuICAgICAgU3VibmV0SWRzOiBzdGFjay5yZXNvbHZlKHZwYy5wcml2YXRlU3VibmV0cy5tYXAoc3VibmV0ID0+IHN1Ym5ldC5zdWJuZXRJZCkpLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ3NwZWNpZnlpbmcgcHVibGljIHN1Ym5ldHMgcmVzdWx0cyBpbiBhIHN5bnRoZXNpcyBlcnJvcicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVGVzdFZwYycpO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsnLCB7XG4gICAgICBvbkNyZWF0ZToge1xuICAgICAgICBzZXJ2aWNlOiAnc2VydmljZScsXG4gICAgICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdpZCcpLFxuICAgICAgfSxcbiAgICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gICAgICB2cGMsXG4gICAgICB2cGNTdWJuZXRzOiB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LFxuICAgIH0pO1xuICB9KS50b1Rocm93KC9MYW1iZGEgRnVuY3Rpb25zIGluIGEgcHVibGljIHN1Ym5ldC8pO1xufSk7XG5cbnRlc3QoJ25vdCBzcGVjaWZ5aW5nIHZwY1N1Ym5ldHMgd2hlbiBvbmx5IHB1YmxpYyBzdWJuZXRzIGV4aXN0IG9uIGEgVlBDIHJlc3VsdHMgaW4gYW4gZXJyb3InLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1Rlc3RQdWJsaWNPbmx5VnBjJywge1xuICAgIHN1Ym5ldENvbmZpZ3VyYXRpb246IFt7IG5hbWU6ICdwdWJsaWMnLCBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfV0sXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgZXhwZWN0KCgpID0+IHtcbiAgICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsnLCB7XG4gICAgICBvbkNyZWF0ZToge1xuICAgICAgICBzZXJ2aWNlOiAnc2VydmljZScsXG4gICAgICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgICAgIHBoeXNpY2FsUmVzb3VyY2VJZDogUGh5c2ljYWxSZXNvdXJjZUlkLm9mKCdpZCcpLFxuICAgICAgfSxcbiAgICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gICAgICB2cGMsXG4gICAgfSk7XG4gIH0pLnRvVGhyb3coL0xhbWJkYSBGdW5jdGlvbnMgaW4gYSBwdWJsaWMgc3VibmV0Lyk7XG59KTtcblxudGVzdCgndnBjU3VibmV0cyBmaWx0ZXIgaXMgbm90IHJlcXVpcmVkIHdoZW4gb25seSBpc29sYXRlZCBzdWJuZXRzIGV4aXN0JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdUZXN0UHJpdmF0ZU9ubHlWcGMnLCB7XG4gICAgc3VibmV0Q29uZmlndXJhdGlvbjogW1xuICAgICAgeyBuYW1lOiAndGVzdDFwcml2YXRlJywgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCB9LFxuICAgICAgeyBuYW1lOiAndGVzdDJwcml2YXRlJywgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9JU09MQVRFRCB9LFxuICAgIF0sXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgbmV3IEF3c0N1c3RvbVJlc291cmNlKHN0YWNrLCAnQXdzU2RrJywge1xuICAgIG9uQ3JlYXRlOiB7XG4gICAgICBzZXJ2aWNlOiAnc2VydmljZScsXG4gICAgICBhY3Rpb246ICdhY3Rpb24nLFxuICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ2lkJyksXG4gICAgfSxcbiAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxuICAgIHZwYyxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OkZ1bmN0aW9uJywge1xuICAgIFZwY0NvbmZpZzoge1xuICAgICAgU3VibmV0SWRzOiBzdGFjay5yZXNvbHZlKHZwYy5pc29sYXRlZFN1Ym5ldHMubWFwKHN1Ym5ldCA9PiBzdWJuZXQuc3VibmV0SWQpKSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCd2cGNTdWJuZXRzIGZpbHRlciBpcyBub3QgcmVxdWlyZWQgZm9yIHRoZSBkZWZhdWx0IFZQQyBjb25maWd1cmF0aW9uJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdUZXN0VnBjJyk7XG5cbiAgLy8gV0hFTlxuICBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsnLCB7XG4gICAgb25DcmVhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdzZXJ2aWNlJyxcbiAgICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICB9LFxuICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gICAgdnBjLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLCB7XG4gICAgVnBjQ29uZmlnOiB7XG4gICAgICBTdWJuZXRJZHM6IHN0YWNrLnJlc29sdmUodnBjLnByaXZhdGVTdWJuZXRzLm1hcChzdWJuZXQgPT4gc3VibmV0LnN1Ym5ldElkKSksXG4gICAgfSxcbiAgfSk7XG59KTtcblxudGVzdCgndnBjU3VibmV0cyB3aXRob3V0IHZwYyByZXN1bHRzIGluIGFuIGVycm9yJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIGV4cGVjdCgoKSA9PiBuZXcgQXdzQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdBd3NTZGsnLCB7XG4gICAgb25DcmVhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdzZXJ2aWNlJyxcbiAgICAgIGFjdGlvbjogJ2FjdGlvbicsXG4gICAgICBwaHlzaWNhbFJlc291cmNlSWQ6IFBoeXNpY2FsUmVzb3VyY2VJZC5vZignaWQnKSxcbiAgICB9LFxuICAgIHBvbGljeTogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuZnJvbVNka0NhbGxzKHsgcmVzb3VyY2VzOiBBd3NDdXN0b21SZXNvdXJjZVBvbGljeS5BTllfUkVTT1VSQ0UgfSksXG4gICAgdnBjU3VibmV0czogeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX0lTT0xBVEVEIH0sXG4gIH0pKS50b1Rocm93KCdDYW5ub3QgY29uZmlndXJlIFxcJ3ZwY1N1Ym5ldHNcXCcgd2l0aG91dCBjb25maWd1cmluZyBhIFZQQycpO1xufSk7XG5cbnRlc3QuZWFjaChbXG4gIFt1bmRlZmluZWQsIHRydWVdLFxuICBbdHJ1ZSwgdHJ1ZV0sXG4gIFtmYWxzZSwgZmFsc2VdLFxuXSkoJ2ZlYXR1cmUgZmxhZyAlcCwgaW5zdGFsbExhdGVzdEF3c1NkayAlcCcsIChmbGFnLCBleHBlY3RlZCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICBjb250ZXh0OiB7XG4gICAgICAnQGF3cy1jZGsvY3VzdG9tcmVzb3VyY2VzOmluc3RhbGxMYXRlc3RBd3NTZGtEZWZhdWx0JzogZmxhZyxcbiAgICB9LFxuICB9KTtcbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soYXBwLCAnU3RhY2snKTtcblxuICAvLyBXSEVOXG4gIG5ldyBBd3NDdXN0b21SZXNvdXJjZShzdGFjaywgJ0F3c1NkaycsIHtcbiAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206OkxvZ1JldGVudGlvblBvbGljeScsXG4gICAgb25DcmVhdGU6IHtcbiAgICAgIHNlcnZpY2U6ICdDbG91ZFdhdGNoTG9ncycsXG4gICAgICBhY3Rpb246ICdwdXRSZXRlbnRpb25Qb2xpY3knLFxuICAgICAgcGFyYW1ldGVyczoge1xuICAgICAgICBsb2dHcm91cE5hbWU6ICcvYXdzL2xhbWJkYS9sb2dncm91cCcsXG4gICAgICAgIHJldGVudGlvbkluRGF5czogOTAsXG4gICAgICB9LFxuICAgICAgcGh5c2ljYWxSZXNvdXJjZUlkOiBQaHlzaWNhbFJlc291cmNlSWQub2YoJ2xvZ2dyb3VwJyksXG4gICAgfSxcbiAgICBwb2xpY3k6IEF3c0N1c3RvbVJlc291cmNlUG9saWN5LmZyb21TZGtDYWxscyh7IHJlc291cmNlczogQXdzQ3VzdG9tUmVzb3VyY2VQb2xpY3kuQU5ZX1JFU09VUkNFIH0pLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdDdXN0b206OkxvZ1JldGVudGlvblBvbGljeScsIHtcbiAgICAnSW5zdGFsbExhdGVzdEF3c1Nkayc6IGV4cGVjdGVkLFxuICB9KTtcbn0pOyJdfQ==