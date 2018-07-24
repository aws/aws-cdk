import { expect, haveResource } from '@aws-cdk/assert';
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import { Lambda, LambdaInlineCode, LambdaRef, LambdaRuntime } from '../lib';

// tslint:disable:object-literal-key-quotes

export = {
    'default function'(test: Test) {
        const stack = new cdk.Stack();

        new Lambda(stack, 'MyLambda', {
            code: new LambdaInlineCode('foo'),
            handler: 'index.handler',
            runtime: LambdaRuntime.NodeJS610,
        });

        expect(stack).toMatch({ Resources:
            { MyLambdaServiceRole4539ECB6:
               { Type: 'AWS::IAM::Role',
                 Properties:
                  { AssumeRolePolicyDocument:
                     { Statement:
                        [ { Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'lambda.amazonaws.com' } } ],
                       Version: '2012-10-17' },
                    ManagedPolicyArns:
                    // arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
                     // tslint:disable-next-line:max-line-length
                     [{'Fn::Join': ['', ['arn', ':', {Ref: 'AWS::Partition'}, ':', 'iam', ':', '', ':', 'aws', ':', 'policy', '/', 'service-role/AWSLambdaBasicExecutionRole']]}],
                  }},
              MyLambdaCCE802FB:
               { Type: 'AWS::Lambda::Function',
                 Properties:
                  { Code: { ZipFile: 'foo' },
                    Handler: 'index.handler',
                    Role: { 'Fn::GetAtt': [ 'MyLambdaServiceRole4539ECB6', 'Arn' ] },
                    Runtime: 'nodejs6.10' },
                 DependsOn: [ 'MyLambdaServiceRole4539ECB6' ] } } });
        test.done();
    },

    'adds policy permissions'(test: Test) {
        const stack = new cdk.Stack();
        new Lambda(stack, 'MyLambda', {
            code: new LambdaInlineCode('foo'),
            handler: 'index.handler',
            runtime: LambdaRuntime.NodeJS610,
            initialPolicy: [new cdk.PolicyStatement().addAction("*").addResource("*")]
        });
        expect(stack).toMatch({ Resources:
            { MyLambdaServiceRole4539ECB6:
               { Type: 'AWS::IAM::Role',
                 Properties:
                  { AssumeRolePolicyDocument:
                     { Statement:
                        [ { Action: 'sts:AssumeRole',
                            Effect: 'Allow',
                            Principal: { Service: 'lambda.amazonaws.com' } } ],
                       Version: '2012-10-17' },
                    ManagedPolicyArns:
                    // tslint:disable-next-line:max-line-length
                    [{'Fn::Join': ['', ['arn', ':', {Ref: 'AWS::Partition'}, ':', 'iam', ':', '', ':', 'aws', ':', 'policy', '/', 'service-role/AWSLambdaBasicExecutionRole']]}],
                }},
                MyLambdaServiceRoleDefaultPolicy5BBC6F68: {
                    Type: "AWS::IAM::Policy",
                    Properties: {
                        PolicyDocument: {
                        Statement: [
                            {
                            Action: "*",
                            Effect: "Allow",
                            Resource: "*"
                            }
                        ],
                        Version: "2012-10-17"
                        },
                        PolicyName: "MyLambdaServiceRoleDefaultPolicy5BBC6F68",
                        Roles: [
                        {
                            Ref: "MyLambdaServiceRole4539ECB6"
                        }
                        ]
                    }
                },
              MyLambdaCCE802FB:
               { Type: 'AWS::Lambda::Function',
                 Properties:
                  { Code: { ZipFile: 'foo' },
                    Handler: 'index.handler',
                    Role: { 'Fn::GetAtt': [ 'MyLambdaServiceRole4539ECB6', 'Arn' ] },
                    Runtime: 'nodejs6.10' },
                 DependsOn: [ 'MyLambdaServiceRole4539ECB6', 'MyLambdaServiceRoleDefaultPolicy5BBC6F68' ] } } } );
        test.done();

    },

    'fails if inline code is used for an invalid runtime'(test: Test) {
        const stack = new cdk.Stack();
        test.throws(() => new Lambda(stack, 'MyLambda', {
            code: new LambdaInlineCode('foo'),
            handler: 'bar',
            runtime: LambdaRuntime.DotNetCore2
        }));
        test.done();
    },

    'addToResourcePolicy': {
        'can be used to add permissions to the Lambda function'(test: Test) {
            const stack = new cdk.Stack();
            const lambda = newTestLambda(stack);

            lambda.addPermission('S3Permission', {
                action: 'lambda:*',
                principal: new cdk.ServicePrincipal('s3.amazonaws.com'),
                sourceAccount: new cdk.AwsAccountId(),
                sourceArn: new cdk.Arn('arn:aws:s3:::my_bucket')
            });

            expect(stack).toMatch({
                "Resources": {
                "MyLambdaServiceRole4539ECB6": {
                    "Type": "AWS::IAM::Role",
                    "Properties": {
                    "AssumeRolePolicyDocument": {
                        "Statement": [
                        {
                            "Action": "sts:AssumeRole",
                            "Effect": "Allow",
                            "Principal": {
                            "Service": "lambda.amazonaws.com"
                            }
                        }
                        ],
                        "Version": "2012-10-17"
                    },
                    "ManagedPolicyArns":
                    // tslint:disable-next-line:max-line-length
                    [{'Fn::Join': ['', ['arn', ':', {Ref: 'AWS::Partition'}, ':', 'iam', ':', '', ':', 'aws', ':', 'policy', '/', 'service-role/AWSLambdaBasicExecutionRole']]}],
                    }
                },
                "MyLambdaCCE802FB": {
                    "Type": "AWS::Lambda::Function",
                    "Properties": {
                    "Code": {
                        "ZipFile": "foo"
                    },
                    "Handler": "bar",
                    "Role": {
                        "Fn::GetAtt": [
                        "MyLambdaServiceRole4539ECB6",
                        "Arn"
                        ]
                    },
                    "Runtime": "python2.7"
                    },
                    "DependsOn": [
                    "MyLambdaServiceRole4539ECB6"
                    ]
                },
                "MyLambdaS3Permission99D0EA08": {
                    "Type": "AWS::Lambda::Permission",
                    "Properties": {
                    "Action": "lambda:*",
                    "FunctionName": {
                        "Ref": "MyLambdaCCE802FB"
                    },
                    "Principal": "s3.amazonaws.com",
                    "SourceAccount": {
                        "Ref": "AWS::AccountId"
                    },
                    "SourceArn": "arn:aws:s3:::my_bucket"
                    }
                }
              }
            });

            test.done();
        },

        'fails if the principal is not a service or account principals'(test: Test) {
            const stack = new cdk.Stack();
            const lambda = newTestLambda(stack);

            test.throws(() => lambda.addPermission('F1', { principal: new cdk.ArnPrincipal('just:arn') }),
                /Invalid principal type for Lambda permission statement/);

            lambda.addPermission('S1', { principal: new cdk.ServicePrincipal('my-service') });
            lambda.addPermission('S2', { principal: new cdk.AccountPrincipal('account') });

            test.done();
        },

        'BYORole'(test: Test) {
            // GIVEN
            const stack = new cdk.Stack();
            const role = new iam.Role(stack, 'SomeRole', {
                assumedBy: new cdk.ServicePrincipal('lambda.amazonaws.com'),
            });
            role.addToPolicy(new cdk.PolicyStatement().addAction('confirm:itsthesame'));

            // WHEN
            const fn = new Lambda(stack, 'Function', {
                code: new LambdaInlineCode('test'),
                runtime: LambdaRuntime.Python36,
                handler: 'index.test',
                role,
                initialPolicy: [
                    new cdk.PolicyStatement().addAction('inline:inline')
                ]
            });

            fn.addToRolePolicy(new cdk.PolicyStatement().addAction('explicit:explicit'));

            // THEN
            expect(stack).to(haveResource('AWS::IAM::Policy', {
                "PolicyDocument": {
                "Statement": [
                    { "Action": "confirm:itsthesame", "Effect": "Allow" },
                    { "Action": "inline:inline", "Effect": "Allow" },
                    { "Action": "explicit:explicit", "Effect": "Allow" }
                ],
                },
            }));

            test.done();
        }
    },

    'import/export': {
        'lambda.export() can be used to add Outputs to the stack and returns a LambdaRef object'(test: Test) {
            // GIVEN
            const stack1 = new cdk.Stack();
            const stack2 = new cdk.Stack();
            const lambda = newTestLambda(stack1);

            // WHEN
            const props = lambda.export();
            const imported = LambdaRef.import(stack2, 'Imported', props);

            // Can call addPermission() but it won't do anything
            imported.addPermission('Hello', {
                principal: new cdk.ServicePrincipal('harry')
            });

            test.done();
        },
    },

    'Lambda can serve as EventRule target, permission gets added'(test: Test) {
        // GIVEN
        const stack = new cdk.Stack();
        const lambda = newTestLambda(stack);
        const rule = new events.EventRule(stack, 'Rule');

        // WHEN
        rule.addTarget(lambda);

        // THEN
        const lambdaId = "MyLambdaCCE802FB";

        expect(stack).to(haveResource('AWS::Lambda::Permission', {
            "Action": "lambda:InvokeFunction",
            "FunctionName": { "Ref": lambdaId },
            "Principal": "events.amazonaws.com"
        }));

        expect(stack).to(haveResource('AWS::Events::Rule', {
            "Targets": [
              {
                "Arn": { "Fn::GetAtt": [ lambdaId, "Arn" ] },
                "Id": "MyLambda"
              }
            ]
        }));

        test.done();
    }
};

function newTestLambda(parent: cdk.Construct) {
    return new Lambda(parent, 'MyLambda', {
        code: new LambdaInlineCode('foo'),
        handler: 'bar',
        runtime: LambdaRuntime.Python27
    });
}
