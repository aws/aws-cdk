"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const lambda = require("@aws-cdk/aws-lambda");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('User Pool', () => {
    test('default setup', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            AdminCreateUserConfig: {
                AllowAdminCreateUserOnly: true,
                InviteMessageTemplate: assertions_1.Match.absent(),
            },
            EmailVerificationMessage: 'The verification code to your new account is {####}',
            EmailVerificationSubject: 'Verify your new account',
            SmsVerificationMessage: 'The verification code to your new account is {####}',
            VerificationMessageTemplate: {
                DefaultEmailOption: 'CONFIRM_WITH_CODE',
                EmailMessage: 'The verification code to your new account is {####}',
                EmailSubject: 'Verify your new account',
                SmsMessage: 'The verification code to your new account is {####}',
            },
            SmsAuthenticationMessage: assertions_1.Match.absent(),
            SmsConfiguration: assertions_1.Match.absent(),
            lambdaTriggers: assertions_1.Match.absent(),
        });
        assertions_1.Template.fromStack(stack).hasResource('AWS::Cognito::UserPool', {
            DeletionPolicy: 'Retain',
        });
    });
    test('self sign up option is correctly configured', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            selfSignUpEnabled: true,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            AdminCreateUserConfig: {
                AllowAdminCreateUserOnly: false,
            },
        });
    });
    test('email verification via link is configured correctly', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            userVerification: {
                emailStyle: lib_1.VerificationEmailStyle.LINK,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailVerificationMessage: assertions_1.Match.absent(),
            EmailVerificationSubject: assertions_1.Match.absent(),
            SmsVerificationMessage: 'The verification code to your new account is {####}',
            VerificationMessageTemplate: {
                DefaultEmailOption: 'CONFIRM_WITH_LINK',
                EmailMessageByLink: 'Verify your account by clicking on {##Verify Email##}',
                EmailSubjectByLink: 'Verify your new account',
                SmsMessage: 'The verification code to your new account is {####}',
            },
        });
    }),
        test('mfa authentication message is configured correctly', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const message = 'The authentication code to your account is {####}';
            // WHEN
            new lib_1.UserPool(stack, 'Pool', {
                mfaMessage: message,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                SmsAuthenticationMessage: message,
            });
        }),
        test('mfa authentication message is validated', () => {
            const stack = new core_1.Stack();
            expect(() => new lib_1.UserPool(stack, 'Pool1', {
                mfaMessage: '{####',
            })).toThrow(/MFA message must contain the template string/);
            expect(() => new lib_1.UserPool(stack, 'Pool2', {
                mfaMessage: '{####}',
            })).not.toThrow();
            expect(() => new lib_1.UserPool(stack, 'Pool3', {
                mfaMessage: `{####}${'x'.repeat(135)}`,
            })).toThrow(/MFA message must be between 6 and 140 characters/);
            expect(() => new lib_1.UserPool(stack, 'Pool4', {
                mfaMessage: `{####}${'x'.repeat(134)}`,
            })).not.toThrow();
            // Validation is skipped for tokens.
            const parameter = new core_1.CfnParameter(stack, 'Parameter');
            expect(() => new lib_1.UserPool(stack, 'Pool5', {
                mfaMessage: parameter.valueAsString,
            })).not.toThrow();
        });
    test('email and sms verification messages are validated', () => {
        const stack = new core_1.Stack();
        expect(() => new lib_1.UserPool(stack, 'Pool1', {
            userVerification: {
                emailStyle: lib_1.VerificationEmailStyle.CODE,
                emailBody: 'invalid email body',
            },
        })).toThrow(/Verification email body/);
        expect(() => new lib_1.UserPool(stack, 'Pool2', {
            userVerification: {
                emailStyle: lib_1.VerificationEmailStyle.CODE,
                emailBody: 'valid email body {####}',
            },
        })).not.toThrow();
        expect(() => new lib_1.UserPool(stack, 'Pool3', {
            userVerification: {
                emailStyle: lib_1.VerificationEmailStyle.CODE,
                smsMessage: 'invalid sms message',
            },
        })).toThrow(/SMS message/);
        expect(() => new lib_1.UserPool(stack, 'Pool4', {
            userVerification: {
                emailStyle: lib_1.VerificationEmailStyle.CODE,
                smsMessage: 'invalid sms message {####}',
            },
        })).not.toThrow();
        expect(() => new lib_1.UserPool(stack, 'Pool5', {
            userVerification: {
                emailStyle: lib_1.VerificationEmailStyle.LINK,
                emailBody: 'invalid email body {####}',
            },
        })).toThrow(/Verification email body/);
        expect(() => new lib_1.UserPool(stack, 'Pool6', {
            userVerification: {
                emailStyle: lib_1.VerificationEmailStyle.LINK,
                emailBody: 'invalid email body {##Verify Email##}',
            },
        })).not.toThrow();
    });
    test('validation is skipped for email and sms messages when tokens', () => {
        const stack = new core_1.Stack();
        const parameter = new core_1.CfnParameter(stack, 'Parameter');
        expect(() => new lib_1.UserPool(stack, 'Pool1', {
            userVerification: {
                emailStyle: lib_1.VerificationEmailStyle.CODE,
                emailBody: parameter.valueAsString,
            },
        })).not.toThrow();
        expect(() => new lib_1.UserPool(stack, 'Pool2', {
            userVerification: {
                emailStyle: lib_1.VerificationEmailStyle.CODE,
                smsMessage: parameter.valueAsString,
            },
        })).not.toThrow();
    });
    test('user invitation messages are configured correctly', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            userInvitation: {
                emailBody: 'invitation email body',
                emailSubject: 'invitation email subject',
                smsMessage: 'invitation sms',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            AdminCreateUserConfig: {
                InviteMessageTemplate: {
                    EmailMessage: 'invitation email body',
                    EmailSubject: 'invitation email subject',
                    SMSMessage: 'invitation sms',
                },
            },
        });
    });
    test('smsRole property is recognized', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const role = aws_iam_1.Role.fromRoleArn(stack, 'smsRole', 'arn:aws:iam::664773442901:role/sms-role');
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            smsRole: role,
            smsRoleExternalId: 'test-external-id',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            SmsConfiguration: {
                ExternalId: 'test-external-id',
                SnsCallerArn: role.roleArn,
            },
        });
    });
    test('snsRegion property is recognized', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const role = aws_iam_1.Role.fromRoleArn(stack, 'smsRole', 'arn:aws:iam::664773442901:role/sms-role');
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            smsRole: role,
            smsRoleExternalId: 'test-external-id',
            snsRegion: 'test-region-1',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            SmsConfiguration: {
                ExternalId: 'test-external-id',
                SnsCallerArn: role.roleArn,
                SnsRegion: 'test-region-1',
            },
        });
    });
    test('import using id', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, undefined, {
            env: { region: 'some-region-1', account: '0123456789012' },
        });
        const userPoolId = 'test-user-pool';
        // WHEN
        const pool = lib_1.UserPool.fromUserPoolId(stack, 'userpool', userPoolId);
        expect(pool.userPoolId).toEqual(userPoolId);
        expect(pool.userPoolArn).toMatch(/cognito-idp:some-region-1:0123456789012:userpool\/test-user-pool/);
    });
    test('import using arn', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const userPoolArn = 'arn:aws:cognito-idp:us-east-1:0123456789012:userpool/test-user-pool';
        // WHEN
        const pool = lib_1.UserPool.fromUserPoolArn(stack, 'userpool', userPoolArn);
        expect(pool.userPoolId).toEqual('test-user-pool');
        expect(stack.resolve(pool.userPoolArn)).toEqual('arn:aws:cognito-idp:us-east-1:0123456789012:userpool/test-user-pool');
    });
    test('import using arn without resourceName fails', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const userPoolArn = 'arn:aws:cognito-idp:us-east-1:0123456789012:*';
        // WHEN
        expect(() => {
            lib_1.UserPool.fromUserPoolArn(stack, 'userpool', userPoolArn);
        }).toThrowError(/invalid user pool ARN/);
    });
    test('import from different account region using arn', () => {
        // GIVEN
        const userPoolArn = 'arn:aws:cognito-idp:us-east-1:0123456789012:userpool/test-user-pool';
        const stack = new core_1.Stack(undefined, undefined, {
            env: {
                account: '111111111111',
                region: 'us-east-2',
            },
        });
        // WHEN
        const pool = lib_1.UserPool.fromUserPoolArn(stack, 'userpool', userPoolArn);
        expect(pool.env.account).toEqual('0123456789012');
        expect(pool.env.region).toEqual('us-east-1');
        expect(pool.userPoolArn).toEqual('arn:aws:cognito-idp:us-east-1:0123456789012:userpool/test-user-pool');
    });
    test('support tags', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const pool = new lib_1.UserPool(stack, 'Pool', {
            userPoolName: 'myPool',
        });
        core_1.Tags.of(pool).add('PoolTag', 'PoolParty');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UserPoolName: 'myPool',
            UserPoolTags: {
                PoolTag: 'PoolParty',
            },
        });
    });
    test('lambda triggers via properties are correctly configured', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = fooFunction(stack, 'preSignUp');
        // WHEN
        const pool = new lib_1.UserPool(stack, 'Pool', {
            lambdaTriggers: {
                preSignUp: fn,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            LambdaConfig: {
                PreSignUp: stack.resolve(fn.functionArn),
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
            Action: 'lambda:InvokeFunction',
            FunctionName: stack.resolve(fn.functionArn),
            Principal: 'cognito-idp.amazonaws.com',
            SourceArn: stack.resolve(pool.userPoolArn),
        });
    });
    test('custom sender lambda triggers via properties are correctly configured', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const kmsKey = fooKey(stack, 'TestKMSKey');
        const emailFn = fooFunction(stack, 'customEmailSender');
        const smsFn = fooFunction(stack, 'customSmsSender');
        // WHEN
        const pool = new lib_1.UserPool(stack, 'Pool', {
            customSenderKmsKey: kmsKey,
            lambdaTriggers: {
                customEmailSender: emailFn,
                customSmsSender: smsFn,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            LambdaConfig: {
                CustomEmailSender: {
                    LambdaArn: stack.resolve(emailFn.functionArn),
                    LambdaVersion: 'V1_0',
                },
                CustomSMSSender: {
                    LambdaArn: stack.resolve(smsFn.functionArn),
                    LambdaVersion: 'V1_0',
                },
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
            Action: 'lambda:InvokeFunction',
            FunctionName: stack.resolve(emailFn.functionArn),
            Principal: 'cognito-idp.amazonaws.com',
            SourceArn: stack.resolve(pool.userPoolArn),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
            Action: 'lambda:InvokeFunction',
            FunctionName: stack.resolve(smsFn.functionArn),
            Principal: 'cognito-idp.amazonaws.com',
            SourceArn: stack.resolve(pool.userPoolArn),
        });
    });
    test('lambda trigger KMS Key ID via properties is correctly configured', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const kmsKey = fooKey(stack, 'TestKMSKey');
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            customSenderKmsKey: kmsKey,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            LambdaConfig: {
                KMSKeyID: { 'Fn::GetAtt': ['TestKMSKey32509532', 'Arn'] },
            },
        });
    });
    test('add* API correctly appends triggers', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const kmsKey = fooKey(stack, 'TestKMSKey');
        const createAuthChallenge = fooFunction(stack, 'createAuthChallenge');
        const customMessage = fooFunction(stack, 'customMessage');
        const defineAuthChallenge = fooFunction(stack, 'defineAuthChallenge');
        const postAuthentication = fooFunction(stack, 'postAuthentication');
        const postConfirmation = fooFunction(stack, 'postConfirmation');
        const preAuthentication = fooFunction(stack, 'preAuthentication');
        const preSignUp = fooFunction(stack, 'preSignUp');
        const preTokenGeneration = fooFunction(stack, 'preTokenGeneration');
        const userMigration = fooFunction(stack, 'userMigration');
        const verifyAuthChallengeResponse = fooFunction(stack, 'verifyAuthChallengeResponse');
        const customEmailSender = fooFunction(stack, 'customEmailSender');
        const customSmsSender = fooFunction(stack, 'customSmsSender');
        // WHEN
        const pool = new lib_1.UserPool(stack, 'Pool', {
            customSenderKmsKey: kmsKey,
        });
        pool.addTrigger(lib_1.UserPoolOperation.CREATE_AUTH_CHALLENGE, createAuthChallenge);
        pool.addTrigger(lib_1.UserPoolOperation.CUSTOM_MESSAGE, customMessage);
        pool.addTrigger(lib_1.UserPoolOperation.DEFINE_AUTH_CHALLENGE, defineAuthChallenge);
        pool.addTrigger(lib_1.UserPoolOperation.POST_AUTHENTICATION, postAuthentication);
        pool.addTrigger(lib_1.UserPoolOperation.POST_CONFIRMATION, postConfirmation);
        pool.addTrigger(lib_1.UserPoolOperation.PRE_AUTHENTICATION, preAuthentication);
        pool.addTrigger(lib_1.UserPoolOperation.PRE_SIGN_UP, preSignUp);
        pool.addTrigger(lib_1.UserPoolOperation.PRE_TOKEN_GENERATION, preTokenGeneration);
        pool.addTrigger(lib_1.UserPoolOperation.USER_MIGRATION, userMigration);
        pool.addTrigger(lib_1.UserPoolOperation.VERIFY_AUTH_CHALLENGE_RESPONSE, verifyAuthChallengeResponse);
        pool.addTrigger(lib_1.UserPoolOperation.CUSTOM_EMAIL_SENDER, customEmailSender);
        pool.addTrigger(lib_1.UserPoolOperation.CUSTOM_SMS_SENDER, customSmsSender);
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            LambdaConfig: {
                CreateAuthChallenge: stack.resolve(createAuthChallenge.functionArn),
                CustomMessage: stack.resolve(customMessage.functionArn),
                DefineAuthChallenge: stack.resolve(defineAuthChallenge.functionArn),
                PostAuthentication: stack.resolve(postAuthentication.functionArn),
                PostConfirmation: stack.resolve(postConfirmation.functionArn),
                PreAuthentication: stack.resolve(preAuthentication.functionArn),
                PreSignUp: stack.resolve(preSignUp.functionArn),
                PreTokenGeneration: stack.resolve(preTokenGeneration.functionArn),
                UserMigration: stack.resolve(userMigration.functionArn),
                VerifyAuthChallengeResponse: stack.resolve(verifyAuthChallengeResponse.functionArn),
                CustomEmailSender: {
                    LambdaArn: stack.resolve(customEmailSender.functionArn),
                    LambdaVersion: 'V1_0',
                },
                CustomSMSSender: {
                    LambdaArn: stack.resolve(customSmsSender.functionArn),
                    LambdaVersion: 'V1_0',
                },
            },
        });
        [createAuthChallenge, customMessage, defineAuthChallenge, postAuthentication,
            postConfirmation, preAuthentication, preSignUp, preTokenGeneration, userMigration,
            verifyAuthChallengeResponse, customEmailSender, customSmsSender].forEach((fn) => {
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
                Action: 'lambda:InvokeFunction',
                FunctionName: stack.resolve(fn.functionArn),
                Principal: 'cognito-idp.amazonaws.com',
                SourceArn: stack.resolve(pool.userPoolArn),
            });
        });
    });
    test('can use same lambda as trigger for multiple user pools', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const fn = fooFunction(stack, 'preSignUp');
        // WHEN
        new lib_1.UserPool(stack, 'Pool1', {
            lambdaTriggers: { preSignUp: fn },
        });
        new lib_1.UserPool(stack, 'Pool2', {
            lambdaTriggers: { preSignUp: fn },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
            SourceArn: {
                'Fn::GetAtt': ['Pool1E3396DF1', 'Arn'],
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
            SourceArn: {
                'Fn::GetAtt': ['Pool28D850567', 'Arn'],
            },
        });
    });
    test('fails when the same trigger is added twice', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const userpool = new lib_1.UserPool(stack, 'Pool');
        const fn1 = new lambda.Function(stack, 'fn1', {
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
        });
        const fn2 = new lambda.Function(stack, 'fn2', {
            code: lambda.Code.fromInline('foo'),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
        });
        // WHEN
        userpool.addTrigger(lib_1.UserPoolOperation.CREATE_AUTH_CHALLENGE, fn1);
        expect(() => userpool.addTrigger(lib_1.UserPoolOperation.CREATE_AUTH_CHALLENGE, fn2)).toThrow(/createAuthChallenge already exists/);
    });
    test('no username aliases specified', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool');
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UsernameAttributes: assertions_1.Match.absent(),
            AliasAttributes: assertions_1.Match.absent(),
        });
    });
    test('fails when preferredUsername is used without username', () => {
        const stack = new core_1.Stack();
        expect(() => new lib_1.UserPool(stack, 'Pool', {
            signInAliases: { preferredUsername: true },
        })).toThrow(/username/);
    });
    test('username and email are specified as the username aliases', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            signInAliases: { username: true, email: true },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UsernameAttributes: assertions_1.Match.absent(),
            AliasAttributes: ['email'],
        });
    });
    test('email and phone number are specified as the username aliases', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            signInAliases: { email: true, phone: true },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UsernameAttributes: ['email', 'phone_number'],
            AliasAttributes: assertions_1.Match.absent(),
        });
    });
    test('email and phone number are autoverified, by default, if they are specified as signIn', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool1', {
            userPoolName: 'Pool1',
            signInAliases: { email: true },
        });
        new lib_1.UserPool(stack, 'Pool2', {
            userPoolName: 'Pool2',
            signInAliases: { email: true, phone: true },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UserPoolName: 'Pool1',
            AutoVerifiedAttributes: ['email'],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UserPoolName: 'Pool2',
            AutoVerifiedAttributes: ['email', 'phone_number'],
        });
    });
    test('explicit autoverify are correctly picked up', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            signInAliases: { username: true },
            autoVerify: { email: true, phone: true },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            AutoVerifiedAttributes: ['email', 'phone_number'],
        });
    });
    test('sign in case sensitive is correctly picked up', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            signInCaseSensitive: false,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UsernameConfiguration: {
                CaseSensitive: false,
            },
        });
    });
    test('sign in case sensitive is absent by default', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {});
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UsernameConfiguration: assertions_1.Match.absent(),
        });
    });
    test('standard attributes default to mutable', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            standardAttributes: {
                fullname: {
                    required: true,
                },
                timezone: {
                    required: true,
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            Schema: [
                {
                    Name: 'name',
                    Required: true,
                    Mutable: true,
                },
                {
                    Name: 'zoneinfo',
                    Required: true,
                    Mutable: true,
                },
            ],
        });
    });
    test('mutable standard attributes', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            userPoolName: 'Pool',
            standardAttributes: {
                fullname: {
                    required: true,
                    mutable: true,
                },
                timezone: {
                    required: true,
                    mutable: true,
                },
            },
        });
        new lib_1.UserPool(stack, 'Pool1', {
            userPoolName: 'Pool1',
            standardAttributes: {
                fullname: {
                    mutable: false,
                },
                timezone: {
                    mutable: false,
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UserPoolName: 'Pool',
            Schema: [
                {
                    Mutable: true,
                    Name: 'name',
                    Required: true,
                },
                {
                    Mutable: true,
                    Name: 'zoneinfo',
                    Required: true,
                },
            ],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UserPoolName: 'Pool1',
            Schema: [
                {
                    Name: 'name',
                    Required: false,
                    Mutable: false,
                },
                {
                    Name: 'zoneinfo',
                    Required: false,
                    Mutable: false,
                },
            ],
        });
    });
    test('schema is absent when attributes are not specified', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', { userPoolName: 'Pool' });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UserPoolName: 'Pool',
            Schema: assertions_1.Match.absent(),
        });
    });
    test('optional mutable standardAttributes', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            userPoolName: 'Pool',
            standardAttributes: {
                timezone: {
                    mutable: true,
                },
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UserPoolName: 'Pool',
            Schema: [
                {
                    Mutable: true,
                    Required: false,
                    Name: 'zoneinfo',
                },
            ],
        });
    });
    test('custom attributes with default constraints', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            customAttributes: {
                'custom-string-attr': new lib_1.StringAttribute(),
                'custom-number-attr': new lib_1.NumberAttribute(),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            Schema: [
                {
                    Name: 'custom-string-attr',
                    AttributeDataType: 'String',
                    StringAttributeConstraints: assertions_1.Match.absent(),
                    NumberAttributeConstraints: assertions_1.Match.absent(),
                },
                {
                    Name: 'custom-number-attr',
                    AttributeDataType: 'Number',
                    StringAttributeConstraints: assertions_1.Match.absent(),
                    NumberAttributeConstraints: assertions_1.Match.absent(),
                },
            ],
        });
    });
    test('custom attributes with constraints', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            customAttributes: {
                'custom-string-attr': new lib_1.StringAttribute({ minLen: 5, maxLen: 50 }),
                'custom-number-attr': new lib_1.NumberAttribute({ min: 500, max: 2000 }),
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            Schema: [
                {
                    AttributeDataType: 'String',
                    Name: 'custom-string-attr',
                    StringAttributeConstraints: {
                        MaxLength: '50',
                        MinLength: '5',
                    },
                },
                {
                    AttributeDataType: 'Number',
                    Name: 'custom-number-attr',
                    NumberAttributeConstraints: {
                        MaxValue: '2000',
                        MinValue: '500',
                    },
                },
            ],
        });
    });
    test('mfaTypes is ignored when mfaEnforcement is undefined or set to OFF', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool1', {
            userPoolName: 'Pool1',
            mfaSecondFactor: {
                sms: true,
                otp: true,
            },
        });
        new lib_1.UserPool(stack, 'Pool2', {
            userPoolName: 'Pool2',
            mfa: lib_1.Mfa.OFF,
            mfaSecondFactor: {
                sms: true,
                otp: true,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UserPoolName: 'Pool1',
            MfaConfiguration: assertions_1.Match.absent(),
            EnabledMfas: assertions_1.Match.absent(),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UserPoolName: 'Pool2',
            MfaConfiguration: 'OFF',
            EnabledMfas: assertions_1.Match.absent(),
        });
    });
    test('sms mfa type is the default when mfaEnforcement is set to REQUIRED or OPTIONAL', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool1', {
            userPoolName: 'Pool1',
            mfa: lib_1.Mfa.OPTIONAL,
        });
        new lib_1.UserPool(stack, 'Pool2', {
            userPoolName: 'Pool2',
            mfa: lib_1.Mfa.REQUIRED,
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UserPoolName: 'Pool1',
            MfaConfiguration: 'OPTIONAL',
            EnabledMfas: ['SMS_MFA'],
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            UserPoolName: 'Pool2',
            MfaConfiguration: 'ON',
            EnabledMfas: ['SMS_MFA'],
        });
    });
    test('mfa type is correctly picked up when specified', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            mfa: lib_1.Mfa.REQUIRED,
            mfaSecondFactor: {
                sms: true,
                otp: true,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EnabledMfas: ['SMS_MFA', 'SOFTWARE_TOKEN_MFA'],
        });
    });
    test('password policy is correctly set', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            passwordPolicy: {
                tempPasswordValidity: core_1.Duration.days(2),
                minLength: 15,
                requireDigits: true,
                requireLowercase: true,
                requireUppercase: true,
                requireSymbols: true,
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            Policies: {
                PasswordPolicy: {
                    TemporaryPasswordValidityDays: 2,
                    MinimumLength: 15,
                    RequireLowercase: true,
                    RequireUppercase: true,
                    RequireNumbers: true,
                    RequireSymbols: true,
                },
            },
        });
    });
    test('password minimum length is set to the default when other parts of the policy is configured', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            passwordPolicy: {
                tempPasswordValidity: core_1.Duration.days(2),
                requireDigits: true,
            },
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            Policies: {
                PasswordPolicy: {
                    MinimumLength: 8,
                },
            },
        });
    });
    test('throws when tempPassword validity is not in round days', () => {
        const stack = new core_1.Stack();
        expect(() => new lib_1.UserPool(stack, 'Pool', {
            passwordPolicy: {
                tempPasswordValidity: core_1.Duration.hours(30),
            },
        })).toThrow();
    });
    test('temp password throws an error when above the max', () => {
        const stack = new core_1.Stack();
        expect(() => new lib_1.UserPool(stack, 'Pool', {
            passwordPolicy: {
                tempPasswordValidity: core_1.Duration.days(400),
            },
        })).toThrow(/tempPasswordValidity cannot be greater than/);
    });
    test('throws when minLength is out of range', () => {
        const stack = new core_1.Stack();
        expect(() => new lib_1.UserPool(stack, 'Pool1', {
            passwordPolicy: {
                minLength: 5,
            },
        })).toThrow(/minLength for password must be between/);
        expect(() => new lib_1.UserPool(stack, 'Pool2', {
            passwordPolicy: {
                minLength: 100,
            },
        })).toThrow(/minLength for password must be between/);
    });
    cdk_build_tools_1.testDeprecated('email transmission settings are recognized correctly', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            emailSettings: {
                from: 'from@myawesomeapp.com',
                replyTo: 'replyTo@myawesomeapp.com',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                From: 'from@myawesomeapp.com',
                ReplyToEmailAddress: 'replyTo@myawesomeapp.com',
            },
        });
    });
    test('addClient', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const userpool = new lib_1.UserPool(stack, 'Pool');
        userpool.addClient('UserPoolClient', {
            userPoolClientName: 'userpoolclient',
        });
        const imported = lib_1.UserPool.fromUserPoolId(stack, 'imported', 'imported-userpool-id');
        imported.addClient('UserPoolImportedClient', {
            userPoolClientName: 'userpoolimportedclient',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ClientName: 'userpoolclient',
            UserPoolId: stack.resolve(userpool.userPoolId),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
            ClientName: 'userpoolimportedclient',
            UserPoolId: stack.resolve(imported.userPoolId),
        });
    });
    test('addResourceServer', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const userpool = new lib_1.UserPool(stack, 'Pool');
        userpool.addResourceServer('ResourceServer', {
            identifier: 'users',
            scopes: [
                {
                    scopeName: 'read',
                    scopeDescription: 'Read-only access',
                },
            ],
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolResourceServer', {
            Identifier: 'users',
            Name: 'users',
            UserPoolId: stack.resolve(userpool.userPoolId),
            Scopes: [
                {
                    ScopeDescription: 'Read-only access',
                    ScopeName: 'read',
                },
            ],
        });
    });
    test('addDomain', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        const userpool = new lib_1.UserPool(stack, 'Pool');
        userpool.addDomain('UserPoolDomain', {
            cognitoDomain: {
                domainPrefix: 'userpooldomain',
            },
        });
        const imported = lib_1.UserPool.fromUserPoolId(stack, 'imported', 'imported-userpool-id');
        imported.addDomain('UserPoolImportedDomain', {
            cognitoDomain: {
                domainPrefix: 'userpoolimporteddomain',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolDomain', {
            Domain: 'userpooldomain',
            UserPoolId: stack.resolve(userpool.userPoolId),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolDomain', {
            Domain: 'userpoolimporteddomain',
            UserPoolId: stack.resolve(imported.userPoolId),
        });
    });
    test('registered identity providers', () => {
        // GIVEN
        const stack = new core_1.Stack();
        const userPool = new lib_1.UserPool(stack, 'pool');
        const provider1 = lib_1.UserPoolIdentityProvider.fromProviderName(stack, 'provider1', 'provider1');
        const provider2 = lib_1.UserPoolIdentityProvider.fromProviderName(stack, 'provider2', 'provider2');
        // WHEN
        userPool.registerIdentityProvider(provider1);
        userPool.registerIdentityProvider(provider2);
        // THEN
        expect(userPool.identityProviders).toEqual([provider1, provider2]);
    });
    describe('AccountRecoverySetting should be configured correctly', () => {
        test('EMAIL_AND_PHONE_WITHOUT_MFA', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', { accountRecovery: lib_1.AccountRecovery.EMAIL_AND_PHONE_WITHOUT_MFA });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                AccountRecoverySetting: {
                    RecoveryMechanisms: [
                        { Name: 'verified_email', Priority: 1 },
                        { Name: 'verified_phone_number', Priority: 2 },
                    ],
                },
            });
        });
        test('PHONE_WITHOUT_MFA_AND_EMAIL', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', { accountRecovery: lib_1.AccountRecovery.PHONE_WITHOUT_MFA_AND_EMAIL });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                AccountRecoverySetting: {
                    RecoveryMechanisms: [
                        { Name: 'verified_phone_number', Priority: 1 },
                        { Name: 'verified_email', Priority: 2 },
                    ],
                },
            });
        });
        test('EMAIL_ONLY', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', { accountRecovery: lib_1.AccountRecovery.EMAIL_ONLY });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                AccountRecoverySetting: {
                    RecoveryMechanisms: [
                        { Name: 'verified_email', Priority: 1 },
                    ],
                },
            });
        });
        test('PHONE_ONLY_WITHOUT_MFA', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', { accountRecovery: lib_1.AccountRecovery.PHONE_ONLY_WITHOUT_MFA });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                AccountRecoverySetting: {
                    RecoveryMechanisms: [
                        { Name: 'verified_phone_number', Priority: 1 },
                    ],
                },
            });
        });
        test('NONE', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', { accountRecovery: lib_1.AccountRecovery.NONE });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                AccountRecoverySetting: {
                    RecoveryMechanisms: [
                        { Name: 'admin_only', Priority: 1 },
                    ],
                },
            });
        });
        test('PHONE_AND_EMAIL', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', { accountRecovery: lib_1.AccountRecovery.PHONE_AND_EMAIL });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                AccountRecoverySetting: assertions_1.Match.absent(),
            });
        });
        test('default', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                AccountRecoverySetting: {
                    RecoveryMechanisms: [
                        { Name: 'verified_phone_number', Priority: 1 },
                        { Name: 'verified_email', Priority: 2 },
                    ],
                },
            });
        });
    });
    describe('sms roles', () => {
        test('default', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool');
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                SmsConfiguration: assertions_1.Match.absent(),
            });
        });
        test('smsRole and smsExternalId is set', () => {
            // GIVEN
            const stack = new core_1.Stack();
            const smsRole = new aws_iam_1.Role(stack, 'smsRole', {
                assumedBy: new aws_iam_1.ServicePrincipal('service.amazonaws.com'),
            });
            // WHEN
            new lib_1.UserPool(stack, 'pool', {
                smsRole,
                smsRoleExternalId: 'role-external-id',
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                SmsConfiguration: {
                    ExternalId: 'role-external-id',
                    SnsCallerArn: { 'Fn::GetAtt': ['smsRoleA4587CE8', 'Arn'] },
                },
            });
        });
        test('setting enableSmsRole creates an sms role', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', {
                enableSmsRole: true,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                SmsConfiguration: {
                    ExternalId: 'pool',
                    SnsCallerArn: { 'Fn::GetAtt': ['poolsmsRole04048F13', 'Arn'] },
                },
            });
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
                AssumeRolePolicyDocument: {
                    Statement: [
                        {
                            Action: 'sts:AssumeRole',
                            Condition: {
                                StringEquals: {
                                    'sts:ExternalId': 'pool',
                                },
                            },
                            Effect: 'Allow',
                            Principal: {
                                Service: 'cognito-idp.amazonaws.com',
                            },
                        },
                    ],
                    Version: '2012-10-17',
                },
                Policies: [
                    {
                        PolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sns:Publish',
                                    Effect: 'Allow',
                                    Resource: '*',
                                },
                            ],
                            Version: '2012-10-17',
                        },
                        PolicyName: 'sns-publish',
                    },
                ],
            });
        });
        test('auto sms role is not created when MFA and phoneVerification is off', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', {
                mfa: lib_1.Mfa.OFF,
                signInAliases: {
                    phone: false,
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                SmsConfiguration: assertions_1.Match.absent(),
            });
        });
        test('auto sms role is not created when OTP-based MFA is enabled and phoneVerification is off', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', {
                mfa: lib_1.Mfa.REQUIRED,
                mfaSecondFactor: {
                    otp: true,
                    sms: false,
                },
                signInAliases: {
                    phone: false,
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                SmsConfiguration: assertions_1.Match.absent(),
            });
        });
        test('auto sms role is created when phone verification is turned on', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', {
                mfa: lib_1.Mfa.OFF,
                signInAliases: { phone: true },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                SmsConfiguration: {
                    ExternalId: 'pool',
                    SnsCallerArn: { 'Fn::GetAtt': ['poolsmsRole04048F13', 'Arn'] },
                },
            });
        });
        test('auto sms role is created when phone auto-verification is set', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', {
                mfa: lib_1.Mfa.OFF,
                signInAliases: { phone: false },
                autoVerify: { phone: true },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                SmsConfiguration: {
                    ExternalId: 'pool',
                    SnsCallerArn: { 'Fn::GetAtt': ['poolsmsRole04048F13', 'Arn'] },
                },
            });
        });
        test('auto sms role is created when MFA is turned on', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', {
                mfa: lib_1.Mfa.REQUIRED,
                mfaSecondFactor: {
                    sms: true,
                    otp: false,
                },
                signInAliases: {
                    phone: false,
                },
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                SmsConfiguration: {
                    ExternalId: 'pool',
                    SnsCallerArn: { 'Fn::GetAtt': ['poolsmsRole04048F13', 'Arn'] },
                },
            });
        });
        test('auto sms role is not created when enableSmsRole is unset, even when MFA is configured', () => {
            // GIVEN
            const stack = new core_1.Stack();
            // WHEN
            new lib_1.UserPool(stack, 'pool', {
                mfa: lib_1.Mfa.REQUIRED,
                mfaSecondFactor: {
                    sms: true,
                    otp: false,
                },
                enableSmsRole: false,
            });
            // THEN
            assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
                SmsConfiguration: assertions_1.Match.absent(),
            });
        });
        test('throws an error when smsRole is specified but enableSmsRole is unset', () => {
            const stack = new core_1.Stack();
            const smsRole = new aws_iam_1.Role(stack, 'smsRole', {
                assumedBy: new aws_iam_1.ServicePrincipal('service.amazonaws.com'),
            });
            expect(() => new lib_1.UserPool(stack, 'pool', {
                smsRole,
                enableSmsRole: false,
            })).toThrow(/enableSmsRole cannot be disabled/);
        });
    });
    cdk_build_tools_1.testDeprecated('email transmission with cyrillic characters are encoded', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            emailSettings: {
                from: 'от@домен.рф',
                replyTo: 'ответить@домен.рф',
            },
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                From: 'от@xn--d1acufc.xn--p1ai',
                ReplyToEmailAddress: 'ответить@xn--d1acufc.xn--p1ai',
            },
        });
    });
    test('email transmission with cyrillic characters in the domain are encoded', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                sesRegion: 'us-east-1',
                fromEmail: 'user@домен.рф',
                replyTo: 'user@домен.рф',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                From: 'user@xn--d1acufc.xn--p1ai',
                ReplyToEmailAddress: 'user@xn--d1acufc.xn--p1ai',
            },
        });
    });
    test('email transmission with cyrillic characters in the local part throw error', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        expect(() => new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                sesRegion: 'us-east-1',
                fromEmail: 'от@домен.рф',
                replyTo: 'user@домен.рф',
            }),
        })).toThrow(/the local part of the email address must use ASCII characters only/);
    });
    test('email transmission with cyrillic characters in the local part of replyTo throw error', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        expect(() => new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                sesRegion: 'us-east-1',
                fromEmail: 'user@домен.рф',
                replyTo: 'от@домен.рф',
            }),
        })).toThrow(/the local part of the email address must use ASCII characters only/);
    });
    test('email withCognito transmission with cyrillic characters in the local part of replyTo throw error', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        expect(() => new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withCognito('от@домен.рф'),
        })).toThrow(/the local part of the email address must use ASCII characters only/);
    });
    test('email withCognito', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withCognito(),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                EmailSendingAccount: 'COGNITO_DEFAULT',
            },
        });
    });
    test('email withCognito and replyTo', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withCognito('reply@example.com'),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                EmailSendingAccount: 'COGNITO_DEFAULT',
                ReplyToEmailAddress: 'reply@example.com',
            },
        });
    });
    test('email withSES with custom email and no region', () => {
        // GIVEN
        const stack = new core_1.Stack();
        // WHEN
        expect(() => new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                fromEmail: 'mycustomemail@example.com',
                replyTo: 'reply@example.com',
            }),
        })).toThrow(/Your stack region cannot be determined/);
    });
    test('email withSES with no name', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, undefined, {
            env: {
                region: 'us-east-1',
                account: '11111111111',
            },
        });
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                fromEmail: 'mycustomemail@example.com',
                replyTo: 'reply@example.com',
                configurationSetName: 'default',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                EmailSendingAccount: 'DEVELOPER',
                From: 'mycustomemail@example.com',
                ReplyToEmailAddress: 'reply@example.com',
                ConfigurationSet: 'default',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':ses:us-east-1:11111111111:identity/mycustomemail@example.com',
                        ],
                    ],
                },
            },
        });
    });
    test('email withSES', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, undefined, {
            env: {
                region: 'us-east-1',
                account: '11111111111',
            },
        });
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                fromEmail: 'mycustomemail@example.com',
                fromName: 'My Custom Email',
                replyTo: 'reply@example.com',
                configurationSetName: 'default',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                EmailSendingAccount: 'DEVELOPER',
                From: 'My Custom Email <mycustomemail@example.com>',
                ReplyToEmailAddress: 'reply@example.com',
                ConfigurationSet: 'default',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':ses:us-east-1:11111111111:identity/mycustomemail@example.com',
                        ],
                    ],
                },
            },
        });
    });
    test('email withSES with name as quoted-string', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, undefined, {
            env: {
                region: 'us-east-1',
                account: '11111111111',
            },
        });
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                fromEmail: 'mycustomemail@example.com',
                fromName: '"My Custom Email"',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                EmailSendingAccount: 'DEVELOPER',
                From: '"My Custom Email" <mycustomemail@example.com>',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':ses:us-east-1:11111111111:identity/mycustomemail@example.com',
                        ],
                    ],
                },
            },
        });
    });
    test('email withSES with name with non atom characters', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, undefined, {
            env: {
                region: 'us-east-1',
                account: '11111111111',
            },
        });
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                fromEmail: 'mycustomemail@example.com',
                fromName: 'mycustomname@example.com',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                EmailSendingAccount: 'DEVELOPER',
                From: '"mycustomname@example.com" <mycustomemail@example.com>',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':ses:us-east-1:11111111111:identity/mycustomemail@example.com',
                        ],
                    ],
                },
            },
        });
    });
    test('email withSES with name with quotes', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, undefined, {
            env: {
                region: 'us-east-1',
                account: '11111111111',
            },
        });
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                fromEmail: 'mycustomemail@example.com',
                fromName: 'Foo "Bar" \\Baz',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                EmailSendingAccount: 'DEVELOPER',
                From: '"Foo \\"Bar\\" \\\\Baz" <mycustomemail@example.com>',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':ses:us-east-1:11111111111:identity/mycustomemail@example.com',
                        ],
                    ],
                },
            },
        });
    });
    test('email withSES with name with non US-ASCII characters', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, undefined, {
            env: {
                region: 'us-east-1',
                account: '11111111111',
            },
        });
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                fromEmail: 'mycustomemail@example.com',
                fromName: 'あいう',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                EmailSendingAccount: 'DEVELOPER',
                From: '=?UTF-8?B?44GC44GE44GG?= <mycustomemail@example.com>',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':ses:us-east-1:11111111111:identity/mycustomemail@example.com',
                        ],
                    ],
                },
            },
        });
    });
    test('email withSES with valid region', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, undefined, {
            env: {
                region: 'us-east-2',
                account: '11111111111',
            },
        });
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                fromEmail: 'mycustomemail@example.com',
                fromName: 'My Custom Email',
                sesRegion: 'us-east-1',
                replyTo: 'reply@example.com',
                configurationSetName: 'default',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                EmailSendingAccount: 'DEVELOPER',
                From: 'My Custom Email <mycustomemail@example.com>',
                ReplyToEmailAddress: 'reply@example.com',
                ConfigurationSet: 'default',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':ses:us-east-1:11111111111:identity/mycustomemail@example.com',
                        ],
                    ],
                },
            },
        });
    });
    test('email withSES with verified domain', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, undefined, {
            env: {
                region: 'us-east-2',
                account: '11111111111',
            },
        });
        // WHEN
        new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                fromEmail: 'mycustomemail@example.com',
                fromName: 'My Custom Email',
                sesRegion: 'us-east-1',
                replyTo: 'reply@example.com',
                configurationSetName: 'default',
                sesVerifiedDomain: 'example.com',
            }),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
            EmailConfiguration: {
                EmailSendingAccount: 'DEVELOPER',
                From: 'My Custom Email <mycustomemail@example.com>',
                ReplyToEmailAddress: 'reply@example.com',
                ConfigurationSet: 'default',
                SourceArn: {
                    'Fn::Join': [
                        '',
                        [
                            'arn:',
                            {
                                Ref: 'AWS::Partition',
                            },
                            ':ses:us-east-1:11111111111:identity/example.com',
                        ],
                    ],
                },
            },
        });
    });
    test('email withSES throws, when "fromEmail" contains the different domain', () => {
        // GIVEN
        const stack = new core_1.Stack(undefined, undefined, {
            env: {
                region: 'us-east-2',
                account: '11111111111',
            },
        });
        expect(() => new lib_1.UserPool(stack, 'Pool1', {
            mfaMessage: '{####',
        })).toThrow(/MFA message must contain the template string/);
        // WHEN
        expect(() => new lib_1.UserPool(stack, 'Pool', {
            email: lib_1.UserPoolEmail.withSES({
                fromEmail: 'mycustomemail@some.com',
                fromName: 'My Custom Email',
                sesRegion: 'us-east-1',
                replyTo: 'reply@example.com',
                configurationSetName: 'default',
                sesVerifiedDomain: 'example.com',
            }),
        })).toThrow(/"fromEmail" contains a different domain than the "sesVerifiedDomain"/);
    });
});
test('device tracking is configured correctly', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.UserPool(stack, 'Pool', {
        deviceTracking: {
            challengeRequiredOnNewDevice: true,
            deviceOnlyRememberedOnUserPrompt: true,
        },
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        DeviceConfiguration: {
            ChallengeRequiredOnNewDevice: true,
            DeviceOnlyRememberedOnUserPrompt: true,
        },
    });
});
test('keep original attrs is configured correctly', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.UserPool(stack, 'Pool', {
        signInAliases: { username: true },
        autoVerify: { email: true, phone: true },
        keepOriginal: {
            email: true,
            phone: true,
        },
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        UserAttributeUpdateSettings: {
            AttributesRequireVerificationBeforeUpdate: ['email', 'phone_number'],
        },
    });
});
test('grant', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const role = new aws_iam_1.Role(stack, 'Role', {
        assumedBy: new aws_iam_1.ServicePrincipal('lambda.amazonaws.com'),
    });
    // WHEN
    const userPool = new lib_1.UserPool(stack, 'Pool');
    userPool.grant(role, 'cognito-idp:AdminCreateUser', 'cognito-idp:ListUsers');
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: [
                        'cognito-idp:AdminCreateUser',
                        'cognito-idp:ListUsers',
                    ],
                    Effect: 'Allow',
                    Resource: {
                        'Fn::GetAtt': [
                            'PoolD3F588B8',
                            'Arn',
                        ],
                    },
                },
            ],
            Version: '2012-10-17',
        },
        Roles: [
            {
                Ref: 'Role1ABCC5F0',
            },
        ],
    });
});
test('deletion protection', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.UserPool(stack, 'Pool', {
        deletionProtection: true,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        DeletionProtection: 'ACTIVE',
    });
});
test.each([
    [lib_1.AdvancedSecurityMode.ENFORCED, 'ENFORCED'],
    [lib_1.AdvancedSecurityMode.AUDIT, 'AUDIT'],
    [lib_1.AdvancedSecurityMode.OFF, 'OFF'],
])('advanced security is configured correctly when set to (%s)', (advancedSecurityMode, compareString) => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.UserPool(stack, 'Pool', {
        advancedSecurityMode: advancedSecurityMode,
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        UserPoolAddOns: {
            AdvancedSecurityMode: compareString,
        },
    });
});
test('advanced security is not present if option is not provided', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new lib_1.UserPool(stack, 'Pool', {});
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        UserPoolAddOns: assertions_1.Match.absent(),
    });
});
function fooFunction(scope, name) {
    return new lambda.Function(scope, name, {
        functionName: name,
        code: lambda.Code.fromInline('foo'),
        runtime: lambda.Runtime.NODEJS_14_X,
        handler: 'index.handler',
    });
}
function fooKey(scope, name) {
    return new kms.Key(scope, name);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1wb29sLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2VyLXBvb2wudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCw4Q0FBMEQ7QUFDMUQsd0NBQXdDO0FBQ3hDLDhDQUE4QztBQUM5Qyw4REFBMEQ7QUFDMUQsd0NBQW9FO0FBRXBFLGdDQUFvTTtBQUVwTSxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtJQUN6QixJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUN6QixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTVCLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxxQkFBcUIsRUFBRTtnQkFDckIsd0JBQXdCLEVBQUUsSUFBSTtnQkFDOUIscUJBQXFCLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUU7YUFDdEM7WUFDRCx3QkFBd0IsRUFBRSxxREFBcUQ7WUFDL0Usd0JBQXdCLEVBQUUseUJBQXlCO1lBQ25ELHNCQUFzQixFQUFFLHFEQUFxRDtZQUM3RSwyQkFBMkIsRUFBRTtnQkFDM0Isa0JBQWtCLEVBQUUsbUJBQW1CO2dCQUN2QyxZQUFZLEVBQUUscURBQXFEO2dCQUNuRSxZQUFZLEVBQUUseUJBQXlCO2dCQUN2QyxVQUFVLEVBQUUscURBQXFEO2FBQ2xFO1lBQ0Qsd0JBQXdCLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUU7WUFDeEMsZ0JBQWdCLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUU7WUFDaEMsY0FBYyxFQUFFLGtCQUFLLENBQUMsTUFBTSxFQUFFO1NBQy9CLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsRUFBRTtZQUM5RCxjQUFjLEVBQUUsUUFBUTtTQUN6QixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7UUFDdkQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsaUJBQWlCLEVBQUUsSUFBSTtTQUN4QixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUscUJBQXFCLEVBQUU7Z0JBQ3JCLHdCQUF3QixFQUFFLEtBQUs7YUFDaEM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7UUFDL0QsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsZ0JBQWdCLEVBQUU7Z0JBQ2hCLFVBQVUsRUFBRSw0QkFBc0IsQ0FBQyxJQUFJO2FBQ3hDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLHdCQUF3QixFQUFFLGtCQUFLLENBQUMsTUFBTSxFQUFFO1lBQ3hDLHdCQUF3QixFQUFFLGtCQUFLLENBQUMsTUFBTSxFQUFFO1lBQ3hDLHNCQUFzQixFQUFFLHFEQUFxRDtZQUM3RSwyQkFBMkIsRUFBRTtnQkFDM0Isa0JBQWtCLEVBQUUsbUJBQW1CO2dCQUN2QyxrQkFBa0IsRUFBRSx1REFBdUQ7Z0JBQzNFLGtCQUFrQixFQUFFLHlCQUF5QjtnQkFDN0MsVUFBVSxFQUFFLHFEQUFxRDthQUNsRTtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztRQUVGLElBQUksQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7WUFDOUQsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxPQUFPLEdBQUcsbURBQW1ELENBQUM7WUFFcEUsT0FBTztZQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzFCLFVBQVUsRUFBRSxPQUFPO2FBQ3BCLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsd0JBQXdCLEVBQUUsT0FBTzthQUNsQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO1lBQ25ELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7Z0JBQ3hDLFVBQVUsRUFBRSxPQUFPO2FBQ3BCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1lBRTVELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO2dCQUN4QyxVQUFVLEVBQUUsUUFBUTthQUNyQixDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUM7WUFFbEIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7Z0JBQ3hDLFVBQVUsRUFBRSxTQUFTLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7YUFDdkMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtEQUFrRCxDQUFDLENBQUM7WUFFaEUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7Z0JBQ3hDLFVBQVUsRUFBRSxTQUFTLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7YUFDdkMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBRWxCLG9DQUFvQztZQUNwQyxNQUFNLFNBQVMsR0FBRyxJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1lBRXZELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO2dCQUN4QyxVQUFVLEVBQUUsU0FBUyxDQUFDLGFBQWE7YUFDcEMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtRQUM3RCxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3hDLGdCQUFnQixFQUFFO2dCQUNoQixVQUFVLEVBQUUsNEJBQXNCLENBQUMsSUFBSTtnQkFDdkMsU0FBUyxFQUFFLG9CQUFvQjthQUNoQztTQUNGLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRXZDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3hDLGdCQUFnQixFQUFFO2dCQUNoQixVQUFVLEVBQUUsNEJBQXNCLENBQUMsSUFBSTtnQkFDdkMsU0FBUyxFQUFFLHlCQUF5QjthQUNyQztTQUNGLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUVsQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUN4QyxnQkFBZ0IsRUFBRTtnQkFDaEIsVUFBVSxFQUFFLDRCQUFzQixDQUFDLElBQUk7Z0JBQ3ZDLFVBQVUsRUFBRSxxQkFBcUI7YUFDbEM7U0FDRixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFM0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDeEMsZ0JBQWdCLEVBQUU7Z0JBQ2hCLFVBQVUsRUFBRSw0QkFBc0IsQ0FBQyxJQUFJO2dCQUN2QyxVQUFVLEVBQUUsNEJBQTRCO2FBQ3pDO1NBQ0YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWxCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3hDLGdCQUFnQixFQUFFO2dCQUNoQixVQUFVLEVBQUUsNEJBQXNCLENBQUMsSUFBSTtnQkFDdkMsU0FBUyxFQUFFLDJCQUEyQjthQUN2QztTQUNGLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBRXZDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3hDLGdCQUFnQixFQUFFO2dCQUNoQixVQUFVLEVBQUUsNEJBQXNCLENBQUMsSUFBSTtnQkFDdkMsU0FBUyxFQUFFLHVDQUF1QzthQUNuRDtTQUNGLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNwQixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw4REFBOEQsRUFBRSxHQUFHLEVBQUU7UUFDeEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLFNBQVMsR0FBRyxJQUFJLG1CQUFZLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRXZELE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3hDLGdCQUFnQixFQUFFO2dCQUNoQixVQUFVLEVBQUUsNEJBQXNCLENBQUMsSUFBSTtnQkFDdkMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxhQUFhO2FBQ25DO1NBQ0YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRWxCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQ3hDLGdCQUFnQixFQUFFO2dCQUNoQixVQUFVLEVBQUUsNEJBQXNCLENBQUMsSUFBSTtnQkFDdkMsVUFBVSxFQUFFLFNBQVMsQ0FBQyxhQUFhO2FBQ3BDO1NBQ0YsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtRQUM3RCxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUMxQixjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFLHVCQUF1QjtnQkFDbEMsWUFBWSxFQUFFLDBCQUEwQjtnQkFDeEMsVUFBVSxFQUFFLGdCQUFnQjthQUM3QjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxxQkFBcUIsRUFBRTtnQkFDckIscUJBQXFCLEVBQUU7b0JBQ3JCLFlBQVksRUFBRSx1QkFBdUI7b0JBQ3JDLFlBQVksRUFBRSwwQkFBMEI7b0JBQ3hDLFVBQVUsRUFBRSxnQkFBZ0I7aUJBQzdCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7UUFDMUMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxJQUFJLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLHlDQUF5QyxDQUFDLENBQUM7UUFFM0YsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsT0FBTyxFQUFFLElBQUk7WUFDYixpQkFBaUIsRUFBRSxrQkFBa0I7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLGdCQUFnQixFQUFFO2dCQUNoQixVQUFVLEVBQUUsa0JBQWtCO2dCQUM5QixZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDM0I7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7UUFDNUMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxJQUFJLEdBQUcsY0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLHlDQUF5QyxDQUFDLENBQUM7UUFFM0YsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsT0FBTyxFQUFFLElBQUk7WUFDYixpQkFBaUIsRUFBRSxrQkFBa0I7WUFDckMsU0FBUyxFQUFFLGVBQWU7U0FDM0IsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLGdCQUFnQixFQUFFO2dCQUNoQixVQUFVLEVBQUUsa0JBQWtCO2dCQUM5QixZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU87Z0JBQzFCLFNBQVMsRUFBRSxlQUFlO2FBQzNCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1FBQzNCLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO1lBQzVDLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRTtTQUMzRCxDQUFDLENBQUM7UUFDSCxNQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQztRQUVwQyxPQUFPO1FBQ1AsTUFBTSxJQUFJLEdBQUcsY0FBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3BFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLGtFQUFrRSxDQUFDLENBQUM7SUFDdkcsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1FBQzVCLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sV0FBVyxHQUFHLHFFQUFxRSxDQUFDO1FBRTFGLE9BQU87UUFDUCxNQUFNLElBQUksR0FBRyxjQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdEUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMscUVBQXFFLENBQUMsQ0FBQztJQUN6SCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7UUFDdkQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxXQUFXLEdBQUcsK0NBQStDLENBQUM7UUFFcEUsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixjQUFRLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLHVCQUF1QixDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0RBQWdELEVBQUUsR0FBRyxFQUFFO1FBQzFELFFBQVE7UUFDUixNQUFNLFdBQVcsR0FBRyxxRUFBcUUsQ0FBQztRQUUxRixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO1lBQzVDLEdBQUcsRUFBRTtnQkFDSCxPQUFPLEVBQUUsY0FBYztnQkFDdkIsTUFBTSxFQUFFLFdBQVc7YUFDcEI7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxJQUFJLEdBQUcsY0FBUSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNsRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMscUVBQXFFLENBQUMsQ0FBQztJQUMxRyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1FBQ3hCLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxNQUFNLElBQUksR0FBRyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3ZDLFlBQVksRUFBRSxRQUFRO1NBQ3ZCLENBQUMsQ0FBQztRQUNILFdBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUUxQyxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsWUFBWSxFQUFFLFFBQVE7WUFDdEIsWUFBWSxFQUFFO2dCQUNaLE9BQU8sRUFBRSxXQUFXO2FBQ3JCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1FBQ25FLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFM0MsT0FBTztRQUNQLE1BQU0sSUFBSSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDdkMsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxFQUFFO2FBQ2Q7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsWUFBWSxFQUFFO2dCQUNaLFNBQVMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUM7YUFDekM7U0FDRixDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6RSxNQUFNLEVBQUUsdUJBQXVCO1lBQy9CLFlBQVksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDM0MsU0FBUyxFQUFFLDJCQUEyQjtZQUN0QyxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQzNDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHVFQUF1RSxFQUFFLEdBQUcsRUFBRTtRQUNqRixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzNDLE1BQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUN4RCxNQUFNLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFFcEQsT0FBTztRQUNQLE1BQU0sSUFBSSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDdkMsa0JBQWtCLEVBQUUsTUFBTTtZQUMxQixjQUFjLEVBQUU7Z0JBQ2QsaUJBQWlCLEVBQUUsT0FBTztnQkFDMUIsZUFBZSxFQUFFLEtBQUs7YUFDdkI7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsWUFBWSxFQUFFO2dCQUNaLGlCQUFpQixFQUFFO29CQUNqQixTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO29CQUM3QyxhQUFhLEVBQUUsTUFBTTtpQkFDdEI7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLFNBQVMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7b0JBQzNDLGFBQWEsRUFBRSxNQUFNO2lCQUN0QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMseUJBQXlCLEVBQUU7WUFDekUsTUFBTSxFQUFFLHVCQUF1QjtZQUMvQixZQUFZLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDO1lBQ2hELFNBQVMsRUFBRSwyQkFBMkI7WUFDdEMsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUMzQyxDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtZQUN6RSxNQUFNLEVBQUUsdUJBQXVCO1lBQy9CLFlBQVksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUM7WUFDOUMsU0FBUyxFQUFFLDJCQUEyQjtZQUN0QyxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1NBQzNDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtFQUFrRSxFQUFFLEdBQUcsRUFBRTtRQUM1RSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTNDLE9BQU87UUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQzFCLGtCQUFrQixFQUFFLE1BQU07U0FDM0IsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLFlBQVksRUFBRTtnQkFDWixRQUFRLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsRUFBRTthQUMxRDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUMxQixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTNDLE1BQU0sbUJBQW1CLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3RFLE1BQU0sYUFBYSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDMUQsTUFBTSxtQkFBbUIsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLHFCQUFxQixDQUFDLENBQUM7UUFDdEUsTUFBTSxrQkFBa0IsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDcEUsTUFBTSxnQkFBZ0IsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDaEUsTUFBTSxpQkFBaUIsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDbEUsTUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztRQUNsRCxNQUFNLGtCQUFrQixHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztRQUNwRSxNQUFNLGFBQWEsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQzFELE1BQU0sMkJBQTJCLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO1FBQ3RGLE1BQU0saUJBQWlCLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2xFLE1BQU0sZUFBZSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUU5RCxPQUFPO1FBQ1AsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUN2QyxrQkFBa0IsRUFBRSxNQUFNO1NBQzNCLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxVQUFVLENBQUMsdUJBQWlCLENBQUMscUJBQXFCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztRQUM5RSxJQUFJLENBQUMsVUFBVSxDQUFDLHVCQUFpQixDQUFDLGNBQWMsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsVUFBVSxDQUFDLHVCQUFpQixDQUFDLHFCQUFxQixFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFDOUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyx1QkFBaUIsQ0FBQyxtQkFBbUIsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxVQUFVLENBQUMsdUJBQWlCLENBQUMsaUJBQWlCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsVUFBVSxDQUFDLHVCQUFpQixDQUFDLGtCQUFrQixFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDekUsSUFBSSxDQUFDLFVBQVUsQ0FBQyx1QkFBaUIsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDMUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyx1QkFBaUIsQ0FBQyxvQkFBb0IsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQzVFLElBQUksQ0FBQyxVQUFVLENBQUMsdUJBQWlCLENBQUMsY0FBYyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ2pFLElBQUksQ0FBQyxVQUFVLENBQUMsdUJBQWlCLENBQUMsOEJBQThCLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztRQUMvRixJQUFJLENBQUMsVUFBVSxDQUFDLHVCQUFpQixDQUFDLG1CQUFtQixFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDMUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyx1QkFBaUIsQ0FBQyxpQkFBaUIsRUFBRSxlQUFlLENBQUMsQ0FBQztRQUV0RSxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsWUFBWSxFQUFFO2dCQUNaLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsV0FBVyxDQUFDO2dCQUNuRSxhQUFhLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDO2dCQUN2RCxtQkFBbUIsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQztnQkFDbkUsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUM7Z0JBQ2pFLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDO2dCQUM3RCxpQkFBaUIsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLFdBQVcsQ0FBQztnQkFDL0QsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztnQkFDL0Msa0JBQWtCLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUM7Z0JBQ2pFLGFBQWEsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUM7Z0JBQ3ZELDJCQUEyQixFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsV0FBVyxDQUFDO2dCQUNuRixpQkFBaUIsRUFBRTtvQkFDakIsU0FBUyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDO29CQUN2RCxhQUFhLEVBQUUsTUFBTTtpQkFDdEI7Z0JBQ0QsZUFBZSxFQUFFO29CQUNmLFNBQVMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUM7b0JBQ3JELGFBQWEsRUFBRSxNQUFNO2lCQUN0QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsQ0FBQyxtQkFBbUIsRUFBRSxhQUFhLEVBQUUsbUJBQW1CLEVBQUUsa0JBQWtCO1lBQzFFLGdCQUFnQixFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxhQUFhO1lBQ2pGLDJCQUEyQixFQUFFLGlCQUFpQixFQUFFLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFO1lBQ2hGLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO2dCQUN6RSxNQUFNLEVBQUUsdUJBQXVCO2dCQUMvQixZQUFZLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDO2dCQUMzQyxTQUFTLEVBQUUsMkJBQTJCO2dCQUN0QyxTQUFTLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO2FBQzNDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1FBQ2xFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sRUFBRSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFM0MsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDM0IsY0FBYyxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtTQUNsQyxDQUFDLENBQUM7UUFDSCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQzNCLGNBQWMsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7U0FDbEMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO1lBQ3pFLFNBQVMsRUFBRTtnQkFDVCxZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDO2FBQ3ZDO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMseUJBQXlCLEVBQUU7WUFDekUsU0FBUyxFQUFFO2dCQUNULFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUM7YUFDdkM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7UUFDdEQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFDMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRTdDLE1BQU0sR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO1lBQzVDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDbkMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsZUFBZTtTQUN6QixDQUFDLENBQUM7UUFDSCxNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtZQUM1QyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQ25DLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLFFBQVEsQ0FBQyxVQUFVLENBQUMsdUJBQWlCLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbEUsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsdUJBQWlCLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsb0NBQW9DLENBQUMsQ0FBQztJQUNoSSxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrQkFBK0IsRUFBRSxHQUFHLEVBQUU7UUFDekMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUU1QixPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsa0JBQWtCLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUU7WUFDbEMsZUFBZSxFQUFFLGtCQUFLLENBQUMsTUFBTSxFQUFFO1NBQ2hDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtRQUNqRSxNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3ZDLGFBQWEsRUFBRSxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRTtTQUMzQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMERBQTBELEVBQUUsR0FBRyxFQUFFO1FBQ3BFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQzFCLGFBQWEsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtTQUMvQyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsa0JBQWtCLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUU7WUFDbEMsZUFBZSxFQUFFLENBQUMsT0FBTyxDQUFDO1NBQzNCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDhEQUE4RCxFQUFFLEdBQUcsRUFBRTtRQUN4RSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUMxQixhQUFhLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7U0FDNUMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLGtCQUFrQixFQUFFLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQztZQUM3QyxlQUFlLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUU7U0FDaEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0ZBQXNGLEVBQUUsR0FBRyxFQUFFO1FBQ2hHLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQzNCLFlBQVksRUFBRSxPQUFPO1lBQ3JCLGFBQWEsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7U0FDL0IsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUMzQixZQUFZLEVBQUUsT0FBTztZQUNyQixhQUFhLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7U0FDNUMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLFlBQVksRUFBRSxPQUFPO1lBQ3JCLHNCQUFzQixFQUFFLENBQUMsT0FBTyxDQUFDO1NBQ2xDLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLFlBQVksRUFBRSxPQUFPO1lBQ3JCLHNCQUFzQixFQUFFLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQztTQUNsRCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7UUFDdkQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsYUFBYSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtZQUNqQyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7U0FDekMsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLHNCQUFzQixFQUFFLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQztTQUNsRCxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7UUFDekQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsbUJBQW1CLEVBQUUsS0FBSztTQUMzQixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUscUJBQXFCLEVBQUU7Z0JBQ3JCLGFBQWEsRUFBRSxLQUFLO2FBQ3JCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNkNBQTZDLEVBQUUsR0FBRyxFQUFFO1FBQ3ZELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWhDLE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxxQkFBcUIsRUFBRSxrQkFBSyxDQUFDLE1BQU0sRUFBRTtTQUN0QyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7UUFDbEQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsa0JBQWtCLEVBQUU7Z0JBQ2xCLFFBQVEsRUFBRTtvQkFDUixRQUFRLEVBQUUsSUFBSTtpQkFDZjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsUUFBUSxFQUFFLElBQUk7aUJBQ2Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLElBQUk7b0JBQ2QsT0FBTyxFQUFFLElBQUk7aUJBQ2Q7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLFFBQVEsRUFBRSxJQUFJO29CQUNkLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7UUFDdkMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsWUFBWSxFQUFFLE1BQU07WUFDcEIsa0JBQWtCLEVBQUU7Z0JBQ2xCLFFBQVEsRUFBRTtvQkFDUixRQUFRLEVBQUUsSUFBSTtvQkFDZCxPQUFPLEVBQUUsSUFBSTtpQkFDZDtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsUUFBUSxFQUFFLElBQUk7b0JBQ2QsT0FBTyxFQUFFLElBQUk7aUJBQ2Q7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDM0IsWUFBWSxFQUFFLE9BQU87WUFDckIsa0JBQWtCLEVBQUU7Z0JBQ2xCLFFBQVEsRUFBRTtvQkFDUixPQUFPLEVBQUUsS0FBSztpQkFDZjtnQkFDRCxRQUFRLEVBQUU7b0JBQ1IsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxZQUFZLEVBQUUsTUFBTTtZQUNwQixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsT0FBTyxFQUFFLElBQUk7b0JBQ2IsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLElBQUk7aUJBQ2Y7Z0JBQ0Q7b0JBQ0UsT0FBTyxFQUFFLElBQUk7b0JBQ2IsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLFFBQVEsRUFBRSxJQUFJO2lCQUNmO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxZQUFZLEVBQUUsT0FBTztZQUNyQixNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsSUFBSSxFQUFFLE1BQU07b0JBQ1osUUFBUSxFQUFFLEtBQUs7b0JBQ2YsT0FBTyxFQUFFLEtBQUs7aUJBQ2Y7Z0JBQ0Q7b0JBQ0UsSUFBSSxFQUFFLFVBQVU7b0JBQ2hCLFFBQVEsRUFBRSxLQUFLO29CQUNmLE9BQU8sRUFBRSxLQUFLO2lCQUNmO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxvREFBb0QsRUFBRSxHQUFHLEVBQUU7UUFDOUQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUV0RCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsWUFBWSxFQUFFLE1BQU07WUFDcEIsTUFBTSxFQUFFLGtCQUFLLENBQUMsTUFBTSxFQUFFO1NBQ3ZCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtRQUMvQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUMxQixZQUFZLEVBQUUsTUFBTTtZQUNwQixrQkFBa0IsRUFBRTtnQkFDbEIsUUFBUSxFQUFFO29CQUNSLE9BQU8sRUFBRSxJQUFJO2lCQUNkO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsWUFBWSxFQUFFLE1BQU07WUFDcEIsTUFBTSxFQUFFO2dCQUNOO29CQUNFLE9BQU8sRUFBRSxJQUFJO29CQUNiLFFBQVEsRUFBRSxLQUFLO29CQUNmLElBQUksRUFBRSxVQUFVO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1FBQ3RELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQzFCLGdCQUFnQixFQUFFO2dCQUNoQixvQkFBb0IsRUFBRSxJQUFJLHFCQUFlLEVBQUU7Z0JBQzNDLG9CQUFvQixFQUFFLElBQUkscUJBQWUsRUFBRTthQUM1QztTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsSUFBSSxFQUFFLG9CQUFvQjtvQkFDMUIsaUJBQWlCLEVBQUUsUUFBUTtvQkFDM0IsMEJBQTBCLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUU7b0JBQzFDLDBCQUEwQixFQUFFLGtCQUFLLENBQUMsTUFBTSxFQUFFO2lCQUMzQztnQkFDRDtvQkFDRSxJQUFJLEVBQUUsb0JBQW9CO29CQUMxQixpQkFBaUIsRUFBRSxRQUFRO29CQUMzQiwwQkFBMEIsRUFBRSxrQkFBSyxDQUFDLE1BQU0sRUFBRTtvQkFDMUMsMEJBQTBCLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUU7aUJBQzNDO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7UUFDOUMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsZ0JBQWdCLEVBQUU7Z0JBQ2hCLG9CQUFvQixFQUFFLElBQUkscUJBQWUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDO2dCQUNwRSxvQkFBb0IsRUFBRSxJQUFJLHFCQUFlLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQzthQUNuRTtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxNQUFNLEVBQUU7Z0JBQ047b0JBQ0UsaUJBQWlCLEVBQUUsUUFBUTtvQkFDM0IsSUFBSSxFQUFFLG9CQUFvQjtvQkFDMUIsMEJBQTBCLEVBQUU7d0JBQzFCLFNBQVMsRUFBRSxJQUFJO3dCQUNmLFNBQVMsRUFBRSxHQUFHO3FCQUNmO2lCQUNGO2dCQUNEO29CQUNFLGlCQUFpQixFQUFFLFFBQVE7b0JBQzNCLElBQUksRUFBRSxvQkFBb0I7b0JBQzFCLDBCQUEwQixFQUFFO3dCQUMxQixRQUFRLEVBQUUsTUFBTTt3QkFDaEIsUUFBUSxFQUFFLEtBQUs7cUJBQ2hCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxvRUFBb0UsRUFBRSxHQUFHLEVBQUU7UUFDOUUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDM0IsWUFBWSxFQUFFLE9BQU87WUFDckIsZUFBZSxFQUFFO2dCQUNmLEdBQUcsRUFBRSxJQUFJO2dCQUNULEdBQUcsRUFBRSxJQUFJO2FBQ1Y7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQzNCLFlBQVksRUFBRSxPQUFPO1lBQ3JCLEdBQUcsRUFBRSxTQUFHLENBQUMsR0FBRztZQUNaLGVBQWUsRUFBRTtnQkFDZixHQUFHLEVBQUUsSUFBSTtnQkFDVCxHQUFHLEVBQUUsSUFBSTthQUNWO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLFlBQVksRUFBRSxPQUFPO1lBQ3JCLGdCQUFnQixFQUFFLGtCQUFLLENBQUMsTUFBTSxFQUFFO1lBQ2hDLFdBQVcsRUFBRSxrQkFBSyxDQUFDLE1BQU0sRUFBRTtTQUM1QixDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxZQUFZLEVBQUUsT0FBTztZQUNyQixnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLFdBQVcsRUFBRSxrQkFBSyxDQUFDLE1BQU0sRUFBRTtTQUM1QixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnRkFBZ0YsRUFBRSxHQUFHLEVBQUU7UUFDMUYsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDM0IsWUFBWSxFQUFFLE9BQU87WUFDckIsR0FBRyxFQUFFLFNBQUcsQ0FBQyxRQUFRO1NBQ2xCLENBQUMsQ0FBQztRQUNILElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDM0IsWUFBWSxFQUFFLE9BQU87WUFDckIsR0FBRyxFQUFFLFNBQUcsQ0FBQyxRQUFRO1NBQ2xCLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxZQUFZLEVBQUUsT0FBTztZQUNyQixnQkFBZ0IsRUFBRSxVQUFVO1lBQzVCLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQztTQUN6QixDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxZQUFZLEVBQUUsT0FBTztZQUNyQixnQkFBZ0IsRUFBRSxJQUFJO1lBQ3RCLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQztTQUN6QixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7UUFDMUQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsR0FBRyxFQUFFLFNBQUcsQ0FBQyxRQUFRO1lBQ2pCLGVBQWUsRUFBRTtnQkFDZixHQUFHLEVBQUUsSUFBSTtnQkFDVCxHQUFHLEVBQUUsSUFBSTthQUNWO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLFdBQVcsRUFBRSxDQUFDLFNBQVMsRUFBRSxvQkFBb0IsQ0FBQztTQUMvQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLEVBQUU7UUFDNUMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsY0FBYyxFQUFFO2dCQUNkLG9CQUFvQixFQUFFLGVBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxTQUFTLEVBQUUsRUFBRTtnQkFDYixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsY0FBYyxFQUFFLElBQUk7YUFDckI7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsUUFBUSxFQUFFO2dCQUNSLGNBQWMsRUFBRTtvQkFDZCw2QkFBNkIsRUFBRSxDQUFDO29CQUNoQyxhQUFhLEVBQUUsRUFBRTtvQkFDakIsZ0JBQWdCLEVBQUUsSUFBSTtvQkFDdEIsZ0JBQWdCLEVBQUUsSUFBSTtvQkFDdEIsY0FBYyxFQUFFLElBQUk7b0JBQ3BCLGNBQWMsRUFBRSxJQUFJO2lCQUNyQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNEZBQTRGLEVBQUUsR0FBRyxFQUFFO1FBQ3RHLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQzFCLGNBQWMsRUFBRTtnQkFDZCxvQkFBb0IsRUFBRSxlQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDdEMsYUFBYSxFQUFFLElBQUk7YUFDcEI7U0FDRixDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxRQUFRLEVBQUU7Z0JBQ1IsY0FBYyxFQUFFO29CQUNkLGFBQWEsRUFBRSxDQUFDO2lCQUNqQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1FBQ2xFLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDdkMsY0FBYyxFQUFFO2dCQUNkLG9CQUFvQixFQUFFLGVBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2FBQ3pDO1NBQ0YsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1FBQzVELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDdkMsY0FBYyxFQUFFO2dCQUNkLG9CQUFvQixFQUFFLGVBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO2FBQ3pDO1NBQ0YsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1FBQ2pELE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDeEMsY0FBYyxFQUFFO2dCQUNkLFNBQVMsRUFBRSxDQUFDO2FBQ2I7U0FDRixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsd0NBQXdDLENBQUMsQ0FBQztRQUV0RCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUN4QyxjQUFjLEVBQUU7Z0JBQ2QsU0FBUyxFQUFFLEdBQUc7YUFDZjtTQUNGLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQ3hELENBQUMsQ0FBQyxDQUFDO0lBRUgsZ0NBQWMsQ0FBQyxzREFBc0QsRUFBRSxHQUFHLEVBQUU7UUFDMUUsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsYUFBYSxFQUFFO2dCQUNiLElBQUksRUFBRSx1QkFBdUI7Z0JBQzdCLE9BQU8sRUFBRSwwQkFBMEI7YUFDcEM7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsa0JBQWtCLEVBQUU7Z0JBQ2xCLElBQUksRUFBRSx1QkFBdUI7Z0JBQzdCLG1CQUFtQixFQUFFLDBCQUEwQjthQUNoRDtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDckIsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3QyxRQUFRLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFO1lBQ25DLGtCQUFrQixFQUFFLGdCQUFnQjtTQUNyQyxDQUFDLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxjQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUNwRixRQUFRLENBQUMsU0FBUyxDQUFDLHdCQUF3QixFQUFFO1lBQzNDLGtCQUFrQixFQUFFLHdCQUF3QjtTQUM3QyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsOEJBQThCLEVBQUU7WUFDOUUsVUFBVSxFQUFFLGdCQUFnQjtZQUM1QixVQUFVLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1NBQy9DLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixFQUFFO1lBQzlFLFVBQVUsRUFBRSx3QkFBd0I7WUFDcEMsVUFBVSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztTQUMvQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDN0IsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3QyxRQUFRLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUU7WUFDM0MsVUFBVSxFQUFFLE9BQU87WUFDbkIsTUFBTSxFQUFFO2dCQUNOO29CQUNFLFNBQVMsRUFBRSxNQUFNO29CQUNqQixnQkFBZ0IsRUFBRSxrQkFBa0I7aUJBQ3JDO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsc0NBQXNDLEVBQUU7WUFDdEYsVUFBVSxFQUFFLE9BQU87WUFDbkIsSUFBSSxFQUFFLE9BQU87WUFDYixVQUFVLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO1lBQzlDLE1BQU0sRUFBRTtnQkFDTjtvQkFDRSxnQkFBZ0IsRUFBRSxrQkFBa0I7b0JBQ3BDLFNBQVMsRUFBRSxNQUFNO2lCQUNsQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUNyQixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdDLFFBQVEsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLEVBQUU7WUFDbkMsYUFBYSxFQUFFO2dCQUNiLFlBQVksRUFBRSxnQkFBZ0I7YUFDL0I7U0FDRixDQUFDLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBRyxjQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztRQUNwRixRQUFRLENBQUMsU0FBUyxDQUFDLHdCQUF3QixFQUFFO1lBQzNDLGFBQWEsRUFBRTtnQkFDYixZQUFZLEVBQUUsd0JBQXdCO2FBQ3ZDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixFQUFFO1lBQzlFLE1BQU0sRUFBRSxnQkFBZ0I7WUFDeEIsVUFBVSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztTQUMvQyxDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyw4QkFBOEIsRUFBRTtZQUM5RSxNQUFNLEVBQUUsd0JBQXdCO1lBQ2hDLFVBQVUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7U0FDL0MsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1FBQ3pDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBQzFCLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3QyxNQUFNLFNBQVMsR0FBRyw4QkFBd0IsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzdGLE1BQU0sU0FBUyxHQUFHLDhCQUF3QixDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFN0YsT0FBTztRQUNQLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM3QyxRQUFRLENBQUMsd0JBQXdCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFN0MsT0FBTztRQUNQLE1BQU0sQ0FBQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNyRSxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7UUFDckUsSUFBSSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtZQUN2QyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixPQUFPO1lBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLGVBQWUsRUFBRSxxQkFBZSxDQUFDLDJCQUEyQixFQUFFLENBQUMsQ0FBQztZQUU5RixPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7Z0JBQ3hFLHNCQUFzQixFQUFFO29CQUN0QixrQkFBa0IsRUFBRTt3QkFDbEIsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRTt3QkFDdkMsRUFBRSxJQUFJLEVBQUUsdUJBQXVCLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRTtxQkFDL0M7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyw2QkFBNkIsRUFBRSxHQUFHLEVBQUU7WUFDdkMsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsT0FBTztZQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxlQUFlLEVBQUUscUJBQWUsQ0FBQywyQkFBMkIsRUFBRSxDQUFDLENBQUM7WUFFOUYsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO2dCQUN4RSxzQkFBc0IsRUFBRTtvQkFDdEIsa0JBQWtCLEVBQUU7d0JBQ2xCLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUU7d0JBQzlDLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUU7cUJBQ3hDO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtZQUN0QixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixPQUFPO1lBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFFLGVBQWUsRUFBRSxxQkFBZSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7WUFFN0UsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO2dCQUN4RSxzQkFBc0IsRUFBRTtvQkFDdEIsa0JBQWtCLEVBQUU7d0JBQ2xCLEVBQUUsSUFBSSxFQUFFLGdCQUFnQixFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUU7cUJBQ3hDO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFO1lBQ2xDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBRTFCLE9BQU87WUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUUsZUFBZSxFQUFFLHFCQUFlLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO1lBRXpGLE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsc0JBQXNCLEVBQUU7b0JBQ3RCLGtCQUFrQixFQUFFO3dCQUNsQixFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFO3FCQUMvQztpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7WUFDaEIsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsT0FBTztZQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxlQUFlLEVBQUUscUJBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBRXZFLE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsc0JBQXNCLEVBQUU7b0JBQ3RCLGtCQUFrQixFQUFFO3dCQUNsQixFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRTtxQkFDcEM7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7WUFDM0IsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsT0FBTztZQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxlQUFlLEVBQUUscUJBQWUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxDQUFDO1lBRWxGLE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsc0JBQXNCLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUU7YUFDdkMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtZQUNuQixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixPQUFPO1lBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRTVCLE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsc0JBQXNCLEVBQUU7b0JBQ3RCLGtCQUFrQixFQUFFO3dCQUNsQixFQUFFLElBQUksRUFBRSx1QkFBdUIsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFO3dCQUM5QyxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFO3FCQUN4QztpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRTtRQUN6QixJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRTtZQUNuQixRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixPQUFPO1lBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBRTVCLE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsZ0JBQWdCLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUU7YUFDakMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1lBQzVDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1lBQzFCLE1BQU0sT0FBTyxHQUFHLElBQUksY0FBSSxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUU7Z0JBQ3pDLFNBQVMsRUFBRSxJQUFJLDBCQUFnQixDQUFDLHVCQUF1QixDQUFDO2FBQ3pELENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO2dCQUMxQixPQUFPO2dCQUNQLGlCQUFpQixFQUFFLGtCQUFrQjthQUN0QyxDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7Z0JBQ3hFLGdCQUFnQixFQUFFO29CQUNoQixVQUFVLEVBQUUsa0JBQWtCO29CQUM5QixZQUFZLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsRUFBRTtpQkFDM0Q7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywyQ0FBMkMsRUFBRSxHQUFHLEVBQUU7WUFDckQsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsT0FBTztZQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzFCLGFBQWEsRUFBRSxJQUFJO2FBQ3BCLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsZ0JBQWdCLEVBQUU7b0JBQ2hCLFVBQVUsRUFBRSxNQUFNO29CQUNsQixZQUFZLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsRUFBRTtpQkFDL0Q7YUFDRixDQUFDLENBQUM7WUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxnQkFBZ0IsRUFBRTtnQkFDaEUsd0JBQXdCLEVBQUU7b0JBQ3hCLFNBQVMsRUFBRTt3QkFDVDs0QkFDRSxNQUFNLEVBQUUsZ0JBQWdCOzRCQUN4QixTQUFTLEVBQUU7Z0NBQ1QsWUFBWSxFQUFFO29DQUNaLGdCQUFnQixFQUFFLE1BQU07aUNBQ3pCOzZCQUNGOzRCQUNELE1BQU0sRUFBRSxPQUFPOzRCQUNmLFNBQVMsRUFBRTtnQ0FDVCxPQUFPLEVBQUUsMkJBQTJCOzZCQUNyQzt5QkFDRjtxQkFDRjtvQkFDRCxPQUFPLEVBQUUsWUFBWTtpQkFDdEI7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSO3dCQUNFLGNBQWMsRUFBRTs0QkFDZCxTQUFTLEVBQUU7Z0NBQ1Q7b0NBQ0UsTUFBTSxFQUFFLGFBQWE7b0NBQ3JCLE1BQU0sRUFBRSxPQUFPO29DQUNmLFFBQVEsRUFBRSxHQUFHO2lDQUNkOzZCQUNGOzRCQUNELE9BQU8sRUFBRSxZQUFZO3lCQUN0Qjt3QkFDRCxVQUFVLEVBQUUsYUFBYTtxQkFDMUI7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxvRUFBb0UsRUFBRSxHQUFHLEVBQUU7WUFDOUUsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsT0FBTztZQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzFCLEdBQUcsRUFBRSxTQUFHLENBQUMsR0FBRztnQkFDWixhQUFhLEVBQUU7b0JBQ2IsS0FBSyxFQUFFLEtBQUs7aUJBQ2I7YUFDRixDQUFDLENBQUM7WUFFSCxPQUFPO1lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7Z0JBQ3hFLGdCQUFnQixFQUFFLGtCQUFLLENBQUMsTUFBTSxFQUFFO2FBQ2pDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLHlGQUF5RixFQUFFLEdBQUcsRUFBRTtZQUNuRyxRQUFRO1lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztZQUUxQixPQUFPO1lBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDMUIsR0FBRyxFQUFFLFNBQUcsQ0FBQyxRQUFRO2dCQUNqQixlQUFlLEVBQUU7b0JBQ2YsR0FBRyxFQUFFLElBQUk7b0JBQ1QsR0FBRyxFQUFFLEtBQUs7aUJBQ1g7Z0JBQ0QsYUFBYSxFQUFFO29CQUNiLEtBQUssRUFBRSxLQUFLO2lCQUNiO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTztZQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO2dCQUN4RSxnQkFBZ0IsRUFBRSxrQkFBSyxDQUFDLE1BQU0sRUFBRTthQUNqQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQywrREFBK0QsRUFBRSxHQUFHLEVBQUU7WUFDekUsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsT0FBTztZQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzFCLEdBQUcsRUFBRSxTQUFHLENBQUMsR0FBRztnQkFDWixhQUFhLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO2FBQy9CLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsZ0JBQWdCLEVBQUU7b0JBQ2hCLFVBQVUsRUFBRSxNQUFNO29CQUNsQixZQUFZLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsRUFBRTtpQkFDL0Q7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyw4REFBOEQsRUFBRSxHQUFHLEVBQUU7WUFDeEUsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsT0FBTztZQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzFCLEdBQUcsRUFBRSxTQUFHLENBQUMsR0FBRztnQkFDWixhQUFhLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO2dCQUMvQixVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFO2FBQzVCLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsZ0JBQWdCLEVBQUU7b0JBQ2hCLFVBQVUsRUFBRSxNQUFNO29CQUNsQixZQUFZLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsRUFBRTtpQkFDL0Q7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7WUFDMUQsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsT0FBTztZQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzFCLEdBQUcsRUFBRSxTQUFHLENBQUMsUUFBUTtnQkFDakIsZUFBZSxFQUFFO29CQUNmLEdBQUcsRUFBRSxJQUFJO29CQUNULEdBQUcsRUFBRSxLQUFLO2lCQUNYO2dCQUNELGFBQWEsRUFBRTtvQkFDYixLQUFLLEVBQUUsS0FBSztpQkFDYjthQUNGLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsZ0JBQWdCLEVBQUU7b0JBQ2hCLFVBQVUsRUFBRSxNQUFNO29CQUNsQixZQUFZLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsRUFBRTtpQkFDL0Q7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyx1RkFBdUYsRUFBRSxHQUFHLEVBQUU7WUFDakcsUUFBUTtZQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFFMUIsT0FBTztZQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQzFCLEdBQUcsRUFBRSxTQUFHLENBQUMsUUFBUTtnQkFDakIsZUFBZSxFQUFFO29CQUNmLEdBQUcsRUFBRSxJQUFJO29CQUNULEdBQUcsRUFBRSxLQUFLO2lCQUNYO2dCQUNELGFBQWEsRUFBRSxLQUFLO2FBQ3JCLENBQUMsQ0FBQztZQUVILE9BQU87WUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDeEUsZ0JBQWdCLEVBQUUsa0JBQUssQ0FBQyxNQUFNLEVBQUU7YUFDakMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsc0VBQXNFLEVBQUUsR0FBRyxFQUFFO1lBQ2hGLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7WUFDMUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtnQkFDekMsU0FBUyxFQUFFLElBQUksMEJBQWdCLENBQUMsdUJBQXVCLENBQUM7YUFDekQsQ0FBQyxDQUFDO1lBRUgsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7Z0JBQ3ZDLE9BQU87Z0JBQ1AsYUFBYSxFQUFFLEtBQUs7YUFDckIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILGdDQUFjLENBQUMseURBQXlELEVBQUUsR0FBRyxFQUFFO1FBQzdFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQzFCLGFBQWEsRUFBRTtnQkFDYixJQUFJLEVBQUUsYUFBYTtnQkFDbkIsT0FBTyxFQUFFLG1CQUFtQjthQUM3QjtTQUNGLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxrQkFBa0IsRUFBRTtnQkFDbEIsSUFBSSxFQUFFLHlCQUF5QjtnQkFDL0IsbUJBQW1CLEVBQUUsK0JBQStCO2FBQ3JEO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdUVBQXVFLEVBQUUsR0FBRyxFQUFFO1FBQ2pGLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQzFCLEtBQUssRUFBRSxtQkFBYSxDQUFDLE9BQU8sQ0FBQztnQkFDM0IsU0FBUyxFQUFFLFdBQVc7Z0JBQ3RCLFNBQVMsRUFBRSxlQUFlO2dCQUMxQixPQUFPLEVBQUUsZUFBZTthQUN6QixDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLGtCQUFrQixFQUFFO2dCQUNsQixJQUFJLEVBQUUsMkJBQTJCO2dCQUNqQyxtQkFBbUIsRUFBRSwyQkFBMkI7YUFDakQ7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywyRUFBMkUsRUFBRSxHQUFHLEVBQUU7UUFDckYsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3ZDLEtBQUssRUFBRSxtQkFBYSxDQUFDLE9BQU8sQ0FBQztnQkFDM0IsU0FBUyxFQUFFLFdBQVc7Z0JBQ3RCLFNBQVMsRUFBRSxhQUFhO2dCQUN4QixPQUFPLEVBQUUsZUFBZTthQUN6QixDQUFDO1NBQ0gsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLG9FQUFvRSxDQUFDLENBQUM7SUFDcEYsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0ZBQXNGLEVBQUUsR0FBRyxFQUFFO1FBQ2hHLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUN2QyxLQUFLLEVBQUUsbUJBQWEsQ0FBQyxPQUFPLENBQUM7Z0JBQzNCLFNBQVMsRUFBRSxXQUFXO2dCQUN0QixTQUFTLEVBQUUsZUFBZTtnQkFDMUIsT0FBTyxFQUFFLGFBQWE7YUFDdkIsQ0FBQztTQUNILENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxvRUFBb0UsQ0FBQyxDQUFDO0lBQ3BGLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGtHQUFrRyxFQUFFLEdBQUcsRUFBRTtRQUM1RyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDdkMsS0FBSyxFQUFFLG1CQUFhLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztTQUNoRCxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsb0VBQW9FLENBQUMsQ0FBQztJQUNwRixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDN0IsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsS0FBSyxFQUFFLG1CQUFhLENBQUMsV0FBVyxFQUFFO1NBQ25DLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxrQkFBa0IsRUFBRTtnQkFDbEIsbUJBQW1CLEVBQUUsaUJBQWlCO2FBQ3ZDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO1FBQ3pDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQzFCLEtBQUssRUFBRSxtQkFBYSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQztTQUN0RCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsa0JBQWtCLEVBQUU7Z0JBQ2xCLG1CQUFtQixFQUFFLGlCQUFpQjtnQkFDdEMsbUJBQW1CLEVBQUUsbUJBQW1CO2FBQ3pDO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO1FBQ3pELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUN2QyxLQUFLLEVBQUUsbUJBQWEsQ0FBQyxPQUFPLENBQUM7Z0JBQzNCLFNBQVMsRUFBRSwyQkFBMkI7Z0JBQ3RDLE9BQU8sRUFBRSxtQkFBbUI7YUFDN0IsQ0FBQztTQUNILENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBRXhELENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtRQUN0QyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtZQUM1QyxHQUFHLEVBQUU7Z0JBQ0gsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLE9BQU8sRUFBRSxhQUFhO2FBQ3ZCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsS0FBSyxFQUFFLG1CQUFhLENBQUMsT0FBTyxDQUFDO2dCQUMzQixTQUFTLEVBQUUsMkJBQTJCO2dCQUN0QyxPQUFPLEVBQUUsbUJBQW1CO2dCQUM1QixvQkFBb0IsRUFBRSxTQUFTO2FBQ2hDLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsa0JBQWtCLEVBQUU7Z0JBQ2xCLG1CQUFtQixFQUFFLFdBQVc7Z0JBQ2hDLElBQUksRUFBRSwyQkFBMkI7Z0JBQ2pDLG1CQUFtQixFQUFFLG1CQUFtQjtnQkFDeEMsZ0JBQWdCLEVBQUUsU0FBUztnQkFDM0IsU0FBUyxFQUFFO29CQUNULFVBQVUsRUFBRTt3QkFDVixFQUFFO3dCQUNGOzRCQUNFLE1BQU07NEJBQ047Z0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjs2QkFDdEI7NEJBQ0QsK0RBQStEO3lCQUNoRTtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRTtRQUN6QixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtZQUM1QyxHQUFHLEVBQUU7Z0JBQ0gsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLE9BQU8sRUFBRSxhQUFhO2FBQ3ZCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsS0FBSyxFQUFFLG1CQUFhLENBQUMsT0FBTyxDQUFDO2dCQUMzQixTQUFTLEVBQUUsMkJBQTJCO2dCQUN0QyxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixPQUFPLEVBQUUsbUJBQW1CO2dCQUM1QixvQkFBb0IsRUFBRSxTQUFTO2FBQ2hDLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsa0JBQWtCLEVBQUU7Z0JBQ2xCLG1CQUFtQixFQUFFLFdBQVc7Z0JBQ2hDLElBQUksRUFBRSw2Q0FBNkM7Z0JBQ25ELG1CQUFtQixFQUFFLG1CQUFtQjtnQkFDeEMsZ0JBQWdCLEVBQUUsU0FBUztnQkFDM0IsU0FBUyxFQUFFO29CQUNULFVBQVUsRUFBRTt3QkFDVixFQUFFO3dCQUNGOzRCQUNFLE1BQU07NEJBQ047Z0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjs2QkFDdEI7NEJBQ0QsK0RBQStEO3lCQUNoRTtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1FBQ3BELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO1lBQzVDLEdBQUcsRUFBRTtnQkFDSCxNQUFNLEVBQUUsV0FBVztnQkFDbkIsT0FBTyxFQUFFLGFBQWE7YUFDdkI7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUMxQixLQUFLLEVBQUUsbUJBQWEsQ0FBQyxPQUFPLENBQUM7Z0JBQzNCLFNBQVMsRUFBRSwyQkFBMkI7Z0JBQ3RDLFFBQVEsRUFBRSxtQkFBbUI7YUFDOUIsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxrQkFBa0IsRUFBRTtnQkFDbEIsbUJBQW1CLEVBQUUsV0FBVztnQkFDaEMsSUFBSSxFQUFFLCtDQUErQztnQkFDckQsU0FBUyxFQUFFO29CQUNULFVBQVUsRUFBRTt3QkFDVixFQUFFO3dCQUNGOzRCQUNFLE1BQU07NEJBQ047Z0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjs2QkFDdEI7NEJBQ0QsK0RBQStEO3lCQUNoRTtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1FBQzVELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO1lBQzVDLEdBQUcsRUFBRTtnQkFDSCxNQUFNLEVBQUUsV0FBVztnQkFDbkIsT0FBTyxFQUFFLGFBQWE7YUFDdkI7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUMxQixLQUFLLEVBQUUsbUJBQWEsQ0FBQyxPQUFPLENBQUM7Z0JBQzNCLFNBQVMsRUFBRSwyQkFBMkI7Z0JBQ3RDLFFBQVEsRUFBRSwwQkFBMEI7YUFDckMsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxrQkFBa0IsRUFBRTtnQkFDbEIsbUJBQW1CLEVBQUUsV0FBVztnQkFDaEMsSUFBSSxFQUFFLHdEQUF3RDtnQkFDOUQsU0FBUyxFQUFFO29CQUNULFVBQVUsRUFBRTt3QkFDVixFQUFFO3dCQUNGOzRCQUNFLE1BQU07NEJBQ047Z0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjs2QkFDdEI7NEJBQ0QsK0RBQStEO3lCQUNoRTtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscUNBQXFDLEVBQUUsR0FBRyxFQUFFO1FBQy9DLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO1lBQzVDLEdBQUcsRUFBRTtnQkFDSCxNQUFNLEVBQUUsV0FBVztnQkFDbkIsT0FBTyxFQUFFLGFBQWE7YUFDdkI7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUMxQixLQUFLLEVBQUUsbUJBQWEsQ0FBQyxPQUFPLENBQUM7Z0JBQzNCLFNBQVMsRUFBRSwyQkFBMkI7Z0JBQ3RDLFFBQVEsRUFBRSxpQkFBaUI7YUFDNUIsQ0FBQztTQUNILENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtZQUN4RSxrQkFBa0IsRUFBRTtnQkFDbEIsbUJBQW1CLEVBQUUsV0FBVztnQkFDaEMsSUFBSSxFQUFFLHFEQUFxRDtnQkFDM0QsU0FBUyxFQUFFO29CQUNULFVBQVUsRUFBRTt3QkFDVixFQUFFO3dCQUNGOzRCQUNFLE1BQU07NEJBQ047Z0NBQ0UsR0FBRyxFQUFFLGdCQUFnQjs2QkFDdEI7NEJBQ0QsK0RBQStEO3lCQUNoRTtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1FBQ2hFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO1lBQzVDLEdBQUcsRUFBRTtnQkFDSCxNQUFNLEVBQUUsV0FBVztnQkFDbkIsT0FBTyxFQUFFLGFBQWE7YUFDdkI7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtZQUMxQixLQUFLLEVBQUUsbUJBQWEsQ0FBQyxPQUFPLENBQUM7Z0JBQzNCLFNBQVMsRUFBRSwyQkFBMkI7Z0JBQ3RDLFFBQVEsRUFBRSxLQUFLO2FBQ2hCLENBQUM7U0FDSCxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7WUFDeEUsa0JBQWtCLEVBQUU7Z0JBQ2xCLG1CQUFtQixFQUFFLFdBQVc7Z0JBQ2hDLElBQUksRUFBRSxzREFBc0Q7Z0JBQzVELFNBQVMsRUFBRTtvQkFDVCxVQUFVLEVBQUU7d0JBQ1YsRUFBRTt3QkFDRjs0QkFDRSxNQUFNOzRCQUNOO2dDQUNFLEdBQUcsRUFBRSxnQkFBZ0I7NkJBQ3RCOzRCQUNELCtEQUErRDt5QkFDaEU7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtRQUMzQyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtZQUM1QyxHQUFHLEVBQUU7Z0JBQ0gsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLE9BQU8sRUFBRSxhQUFhO2FBQ3ZCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsS0FBSyxFQUFFLG1CQUFhLENBQUMsT0FBTyxDQUFDO2dCQUMzQixTQUFTLEVBQUUsMkJBQTJCO2dCQUN0QyxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixTQUFTLEVBQUUsV0FBVztnQkFDdEIsT0FBTyxFQUFFLG1CQUFtQjtnQkFDNUIsb0JBQW9CLEVBQUUsU0FBUzthQUNoQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLGtCQUFrQixFQUFFO2dCQUNsQixtQkFBbUIsRUFBRSxXQUFXO2dCQUNoQyxJQUFJLEVBQUUsNkNBQTZDO2dCQUNuRCxtQkFBbUIsRUFBRSxtQkFBbUI7Z0JBQ3hDLGdCQUFnQixFQUFFLFNBQVM7Z0JBQzNCLFNBQVMsRUFBRTtvQkFDVCxVQUFVLEVBQUU7d0JBQ1YsRUFBRTt3QkFDRjs0QkFDRSxNQUFNOzRCQUNOO2dDQUNFLEdBQUcsRUFBRSxnQkFBZ0I7NkJBQ3RCOzRCQUNELCtEQUErRDt5QkFDaEU7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUVMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG9DQUFvQyxFQUFFLEdBQUcsRUFBRTtRQUM5QyxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtZQUM1QyxHQUFHLEVBQUU7Z0JBQ0gsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLE9BQU8sRUFBRSxhQUFhO2FBQ3ZCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7WUFDMUIsS0FBSyxFQUFFLG1CQUFhLENBQUMsT0FBTyxDQUFDO2dCQUMzQixTQUFTLEVBQUUsMkJBQTJCO2dCQUN0QyxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixTQUFTLEVBQUUsV0FBVztnQkFDdEIsT0FBTyxFQUFFLG1CQUFtQjtnQkFDNUIsb0JBQW9CLEVBQUUsU0FBUztnQkFDL0IsaUJBQWlCLEVBQUUsYUFBYTthQUNqQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1lBQ3hFLGtCQUFrQixFQUFFO2dCQUNsQixtQkFBbUIsRUFBRSxXQUFXO2dCQUNoQyxJQUFJLEVBQUUsNkNBQTZDO2dCQUNuRCxtQkFBbUIsRUFBRSxtQkFBbUI7Z0JBQ3hDLGdCQUFnQixFQUFFLFNBQVM7Z0JBQzNCLFNBQVMsRUFBRTtvQkFDVCxVQUFVLEVBQUU7d0JBQ1YsRUFBRTt3QkFDRjs0QkFDRSxNQUFNOzRCQUNOO2dDQUNFLEdBQUcsRUFBRSxnQkFBZ0I7NkJBQ3RCOzRCQUNELGlEQUFpRDt5QkFDbEQ7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHNFQUFzRSxFQUFFLEdBQUcsRUFBRTtRQUNoRixRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtZQUM1QyxHQUFHLEVBQUU7Z0JBQ0gsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLE9BQU8sRUFBRSxhQUFhO2FBQ3ZCO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDeEMsVUFBVSxFQUFFLE9BQU87U0FDcEIsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLDhDQUE4QyxDQUFDLENBQUM7UUFFNUQsT0FBTztRQUNQLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1lBQ3ZDLEtBQUssRUFBRSxtQkFBYSxDQUFDLE9BQU8sQ0FBQztnQkFDM0IsU0FBUyxFQUFFLHdCQUF3QjtnQkFDbkMsUUFBUSxFQUFFLGlCQUFpQjtnQkFDM0IsU0FBUyxFQUFFLFdBQVc7Z0JBQ3RCLE9BQU8sRUFBRSxtQkFBbUI7Z0JBQzVCLG9CQUFvQixFQUFFLFNBQVM7Z0JBQy9CLGlCQUFpQixFQUFFLGFBQWE7YUFDakMsQ0FBQztTQUNILENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzRUFBc0UsQ0FBQyxDQUFDO0lBQ3RGLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMseUNBQXlDLEVBQUUsR0FBRyxFQUFFO0lBQ25ELFFBQVE7SUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFlBQUssRUFBRSxDQUFDO0lBRTFCLE9BQU87SUFDUCxJQUFJLGNBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFO1FBQzFCLGNBQWMsRUFBRTtZQUNkLDRCQUE0QixFQUFFLElBQUk7WUFDbEMsZ0NBQWdDLEVBQUUsSUFBSTtTQUN2QztLQUNGLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx3QkFBd0IsRUFBRTtRQUN4RSxtQkFBbUIsRUFBRTtZQUNuQiw0QkFBNEIsRUFBRSxJQUFJO1lBQ2xDLGdDQUFnQyxFQUFFLElBQUk7U0FDdkM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyw2Q0FBNkMsRUFBRSxHQUFHLEVBQUU7SUFDdkQsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFFMUIsT0FBTztJQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDMUIsYUFBYSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtRQUNqQyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUU7UUFDeEMsWUFBWSxFQUFFO1lBQ1osS0FBSyxFQUFFLElBQUk7WUFDWCxLQUFLLEVBQUUsSUFBSTtTQUNaO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1FBQ3hFLDJCQUEyQixFQUFFO1lBQzNCLHlDQUF5QyxFQUFFLENBQUMsT0FBTyxFQUFFLGNBQWMsQ0FBQztTQUNyRTtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7SUFDakIsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFDMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUNuQyxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQztLQUN4RCxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdDLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLDZCQUE2QixFQUFFLHVCQUF1QixDQUFDLENBQUM7SUFFN0UsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLGtCQUFrQixFQUFFO1FBQ2xFLGNBQWMsRUFBRTtZQUNkLFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxNQUFNLEVBQUU7d0JBQ04sNkJBQTZCO3dCQUM3Qix1QkFBdUI7cUJBQ3hCO29CQUNELE1BQU0sRUFBRSxPQUFPO29CQUNmLFFBQVEsRUFBRTt3QkFDUixZQUFZLEVBQUU7NEJBQ1osY0FBYzs0QkFDZCxLQUFLO3lCQUNOO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRCxPQUFPLEVBQUUsWUFBWTtTQUN0QjtRQUNELEtBQUssRUFBRTtZQUNMO2dCQUNFLEdBQUcsRUFBRSxjQUFjO2FBQ3BCO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFFTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7SUFDL0IsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFFMUIsT0FBTztJQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUU7UUFDMUIsa0JBQWtCLEVBQUUsSUFBSTtLQUN6QixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsd0JBQXdCLEVBQUU7UUFDeEUsa0JBQWtCLEVBQUUsUUFBUTtLQUM3QixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxJQUFJLENBQ1A7SUFDRSxDQUFDLDBCQUFvQixDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUM7SUFDM0MsQ0FBQywwQkFBb0IsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO0lBQ3JDLENBQUMsMEJBQW9CLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQztDQUNsQyxDQUFDLENBQUMsNERBQTRELEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxhQUFhLEVBQUUsRUFBRTtJQUN6RyxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsSUFBSSxjQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUMxQixvQkFBb0IsRUFBRSxvQkFBb0I7S0FDM0MsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1FBQ3hFLGNBQWMsRUFBRTtZQUNkLG9CQUFvQixFQUFFLGFBQWE7U0FDcEM7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7SUFDdEUsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFFMUIsT0FBTztJQUNQLElBQUksY0FBUSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFFaEMsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHdCQUF3QixFQUFFO1FBQ3hFLGNBQWMsRUFBRSxrQkFBSyxDQUFDLE1BQU0sRUFBRTtLQUMvQixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsV0FBVyxDQUFDLEtBQWdCLEVBQUUsSUFBWTtJQUNqRCxPQUFPLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1FBQ3RDLFlBQVksRUFBRSxJQUFJO1FBQ2xCLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7UUFDbkMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztRQUNuQyxPQUFPLEVBQUUsZUFBZTtLQUN6QixDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsU0FBUyxNQUFNLENBQUMsS0FBZ0IsRUFBRSxJQUFZO0lBQzVDLE9BQU8sSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNsQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTWF0Y2gsIFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBSb2xlLCBTZXJ2aWNlUHJpbmNpcGFsIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgeyBDZm5QYXJhbWV0ZXIsIER1cmF0aW9uLCBTdGFjaywgVGFncyB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBY2NvdW50UmVjb3ZlcnksIE1mYSwgTnVtYmVyQXR0cmlidXRlLCBTdHJpbmdBdHRyaWJ1dGUsIFVzZXJQb29sLCBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXIsIFVzZXJQb29sT3BlcmF0aW9uLCBWZXJpZmljYXRpb25FbWFpbFN0eWxlLCBVc2VyUG9vbEVtYWlsLCBBZHZhbmNlZFNlY3VyaXR5TW9kZSB9IGZyb20gJy4uL2xpYic7XG5cbmRlc2NyaWJlKCdVc2VyIFBvb2wnLCAoKSA9PiB7XG4gIHRlc3QoJ2RlZmF1bHQgc2V0dXAnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIEFkbWluQ3JlYXRlVXNlckNvbmZpZzoge1xuICAgICAgICBBbGxvd0FkbWluQ3JlYXRlVXNlck9ubHk6IHRydWUsXG4gICAgICAgIEludml0ZU1lc3NhZ2VUZW1wbGF0ZTogTWF0Y2guYWJzZW50KCksXG4gICAgICB9LFxuICAgICAgRW1haWxWZXJpZmljYXRpb25NZXNzYWdlOiAnVGhlIHZlcmlmaWNhdGlvbiBjb2RlIHRvIHlvdXIgbmV3IGFjY291bnQgaXMgeyMjIyN9JyxcbiAgICAgIEVtYWlsVmVyaWZpY2F0aW9uU3ViamVjdDogJ1ZlcmlmeSB5b3VyIG5ldyBhY2NvdW50JyxcbiAgICAgIFNtc1ZlcmlmaWNhdGlvbk1lc3NhZ2U6ICdUaGUgdmVyaWZpY2F0aW9uIGNvZGUgdG8geW91ciBuZXcgYWNjb3VudCBpcyB7IyMjI30nLFxuICAgICAgVmVyaWZpY2F0aW9uTWVzc2FnZVRlbXBsYXRlOiB7XG4gICAgICAgIERlZmF1bHRFbWFpbE9wdGlvbjogJ0NPTkZJUk1fV0lUSF9DT0RFJyxcbiAgICAgICAgRW1haWxNZXNzYWdlOiAnVGhlIHZlcmlmaWNhdGlvbiBjb2RlIHRvIHlvdXIgbmV3IGFjY291bnQgaXMgeyMjIyN9JyxcbiAgICAgICAgRW1haWxTdWJqZWN0OiAnVmVyaWZ5IHlvdXIgbmV3IGFjY291bnQnLFxuICAgICAgICBTbXNNZXNzYWdlOiAnVGhlIHZlcmlmaWNhdGlvbiBjb2RlIHRvIHlvdXIgbmV3IGFjY291bnQgaXMgeyMjIyN9JyxcbiAgICAgIH0sXG4gICAgICBTbXNBdXRoZW50aWNhdGlvbk1lc3NhZ2U6IE1hdGNoLmFic2VudCgpLFxuICAgICAgU21zQ29uZmlndXJhdGlvbjogTWF0Y2guYWJzZW50KCksXG4gICAgICBsYW1iZGFUcmlnZ2VyczogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgRGVsZXRpb25Qb2xpY3k6ICdSZXRhaW4nLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzZWxmIHNpZ24gdXAgb3B0aW9uIGlzIGNvcnJlY3RseSBjb25maWd1cmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJywge1xuICAgICAgc2VsZlNpZ25VcEVuYWJsZWQ6IHRydWUsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBBZG1pbkNyZWF0ZVVzZXJDb25maWc6IHtcbiAgICAgICAgQWxsb3dBZG1pbkNyZWF0ZVVzZXJPbmx5OiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VtYWlsIHZlcmlmaWNhdGlvbiB2aWEgbGluayBpcyBjb25maWd1cmVkIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIHVzZXJWZXJpZmljYXRpb246IHtcbiAgICAgICAgZW1haWxTdHlsZTogVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5MSU5LLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIEVtYWlsVmVyaWZpY2F0aW9uTWVzc2FnZTogTWF0Y2guYWJzZW50KCksXG4gICAgICBFbWFpbFZlcmlmaWNhdGlvblN1YmplY3Q6IE1hdGNoLmFic2VudCgpLFxuICAgICAgU21zVmVyaWZpY2F0aW9uTWVzc2FnZTogJ1RoZSB2ZXJpZmljYXRpb24gY29kZSB0byB5b3VyIG5ldyBhY2NvdW50IGlzIHsjIyMjfScsXG4gICAgICBWZXJpZmljYXRpb25NZXNzYWdlVGVtcGxhdGU6IHtcbiAgICAgICAgRGVmYXVsdEVtYWlsT3B0aW9uOiAnQ09ORklSTV9XSVRIX0xJTksnLFxuICAgICAgICBFbWFpbE1lc3NhZ2VCeUxpbms6ICdWZXJpZnkgeW91ciBhY2NvdW50IGJ5IGNsaWNraW5nIG9uIHsjI1ZlcmlmeSBFbWFpbCMjfScsXG4gICAgICAgIEVtYWlsU3ViamVjdEJ5TGluazogJ1ZlcmlmeSB5b3VyIG5ldyBhY2NvdW50JyxcbiAgICAgICAgU21zTWVzc2FnZTogJ1RoZSB2ZXJpZmljYXRpb24gY29kZSB0byB5b3VyIG5ldyBhY2NvdW50IGlzIHsjIyMjfScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KSxcblxuICB0ZXN0KCdtZmEgYXV0aGVudGljYXRpb24gbWVzc2FnZSBpcyBjb25maWd1cmVkIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3QgbWVzc2FnZSA9ICdUaGUgYXV0aGVudGljYXRpb24gY29kZSB0byB5b3VyIGFjY291bnQgaXMgeyMjIyN9JztcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJywge1xuICAgICAgbWZhTWVzc2FnZTogbWVzc2FnZSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIFNtc0F1dGhlbnRpY2F0aW9uTWVzc2FnZTogbWVzc2FnZSxcbiAgICB9KTtcbiAgfSksXG5cbiAgdGVzdCgnbWZhIGF1dGhlbnRpY2F0aW9uIG1lc3NhZ2UgaXMgdmFsaWRhdGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbDEnLCB7XG4gICAgICBtZmFNZXNzYWdlOiAneyMjIyMnLFxuICAgIH0pKS50b1Rocm93KC9NRkEgbWVzc2FnZSBtdXN0IGNvbnRhaW4gdGhlIHRlbXBsYXRlIHN0cmluZy8pO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wyJywge1xuICAgICAgbWZhTWVzc2FnZTogJ3sjIyMjfScsXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbDMnLCB7XG4gICAgICBtZmFNZXNzYWdlOiBgeyMjIyN9JHsneCcucmVwZWF0KDEzNSl9YCxcbiAgICB9KSkudG9UaHJvdygvTUZBIG1lc3NhZ2UgbXVzdCBiZSBiZXR3ZWVuIDYgYW5kIDE0MCBjaGFyYWN0ZXJzLyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbDQnLCB7XG4gICAgICBtZmFNZXNzYWdlOiBgeyMjIyN9JHsneCcucmVwZWF0KDEzNCl9YCxcbiAgICB9KSkubm90LnRvVGhyb3coKTtcblxuICAgIC8vIFZhbGlkYXRpb24gaXMgc2tpcHBlZCBmb3IgdG9rZW5zLlxuICAgIGNvbnN0IHBhcmFtZXRlciA9IG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sNScsIHtcbiAgICAgIG1mYU1lc3NhZ2U6IHBhcmFtZXRlci52YWx1ZUFzU3RyaW5nLFxuICAgIH0pKS5ub3QudG9UaHJvdygpO1xuICB9KTtcblxuICB0ZXN0KCdlbWFpbCBhbmQgc21zIHZlcmlmaWNhdGlvbiBtZXNzYWdlcyBhcmUgdmFsaWRhdGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbDEnLCB7XG4gICAgICB1c2VyVmVyaWZpY2F0aW9uOiB7XG4gICAgICAgIGVtYWlsU3R5bGU6IFZlcmlmaWNhdGlvbkVtYWlsU3R5bGUuQ09ERSxcbiAgICAgICAgZW1haWxCb2R5OiAnaW52YWxpZCBlbWFpbCBib2R5JyxcbiAgICAgIH0sXG4gICAgfSkpLnRvVGhyb3coL1ZlcmlmaWNhdGlvbiBlbWFpbCBib2R5Lyk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbDInLCB7XG4gICAgICB1c2VyVmVyaWZpY2F0aW9uOiB7XG4gICAgICAgIGVtYWlsU3R5bGU6IFZlcmlmaWNhdGlvbkVtYWlsU3R5bGUuQ09ERSxcbiAgICAgICAgZW1haWxCb2R5OiAndmFsaWQgZW1haWwgYm9keSB7IyMjI30nLFxuICAgICAgfSxcbiAgICB9KSkubm90LnRvVGhyb3coKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sMycsIHtcbiAgICAgIHVzZXJWZXJpZmljYXRpb246IHtcbiAgICAgICAgZW1haWxTdHlsZTogVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5DT0RFLFxuICAgICAgICBzbXNNZXNzYWdlOiAnaW52YWxpZCBzbXMgbWVzc2FnZScsXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KC9TTVMgbWVzc2FnZS8pO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2w0Jywge1xuICAgICAgdXNlclZlcmlmaWNhdGlvbjoge1xuICAgICAgICBlbWFpbFN0eWxlOiBWZXJpZmljYXRpb25FbWFpbFN0eWxlLkNPREUsXG4gICAgICAgIHNtc01lc3NhZ2U6ICdpbnZhbGlkIHNtcyBtZXNzYWdlIHsjIyMjfScsXG4gICAgICB9LFxuICAgIH0pKS5ub3QudG9UaHJvdygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2w1Jywge1xuICAgICAgdXNlclZlcmlmaWNhdGlvbjoge1xuICAgICAgICBlbWFpbFN0eWxlOiBWZXJpZmljYXRpb25FbWFpbFN0eWxlLkxJTkssXG4gICAgICAgIGVtYWlsQm9keTogJ2ludmFsaWQgZW1haWwgYm9keSB7IyMjI30nLFxuICAgICAgfSxcbiAgICB9KSkudG9UaHJvdygvVmVyaWZpY2F0aW9uIGVtYWlsIGJvZHkvKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sNicsIHtcbiAgICAgIHVzZXJWZXJpZmljYXRpb246IHtcbiAgICAgICAgZW1haWxTdHlsZTogVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5MSU5LLFxuICAgICAgICBlbWFpbEJvZHk6ICdpbnZhbGlkIGVtYWlsIGJvZHkgeyMjVmVyaWZ5IEVtYWlsIyN9JyxcbiAgICAgIH0sXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3ZhbGlkYXRpb24gaXMgc2tpcHBlZCBmb3IgZW1haWwgYW5kIHNtcyBtZXNzYWdlcyB3aGVuIHRva2VucycsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHBhcmFtZXRlciA9IG5ldyBDZm5QYXJhbWV0ZXIoc3RhY2ssICdQYXJhbWV0ZXInKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sMScsIHtcbiAgICAgIHVzZXJWZXJpZmljYXRpb246IHtcbiAgICAgICAgZW1haWxTdHlsZTogVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5DT0RFLFxuICAgICAgICBlbWFpbEJvZHk6IHBhcmFtZXRlci52YWx1ZUFzU3RyaW5nLFxuICAgICAgfSxcbiAgICB9KSkubm90LnRvVGhyb3coKTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sMicsIHtcbiAgICAgIHVzZXJWZXJpZmljYXRpb246IHtcbiAgICAgICAgZW1haWxTdHlsZTogVmVyaWZpY2F0aW9uRW1haWxTdHlsZS5DT0RFLFxuICAgICAgICBzbXNNZXNzYWdlOiBwYXJhbWV0ZXIudmFsdWVBc1N0cmluZyxcbiAgICAgIH0sXG4gICAgfSkpLm5vdC50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3VzZXIgaW52aXRhdGlvbiBtZXNzYWdlcyBhcmUgY29uZmlndXJlZCBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICB1c2VySW52aXRhdGlvbjoge1xuICAgICAgICBlbWFpbEJvZHk6ICdpbnZpdGF0aW9uIGVtYWlsIGJvZHknLFxuICAgICAgICBlbWFpbFN1YmplY3Q6ICdpbnZpdGF0aW9uIGVtYWlsIHN1YmplY3QnLFxuICAgICAgICBzbXNNZXNzYWdlOiAnaW52aXRhdGlvbiBzbXMnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIEFkbWluQ3JlYXRlVXNlckNvbmZpZzoge1xuICAgICAgICBJbnZpdGVNZXNzYWdlVGVtcGxhdGU6IHtcbiAgICAgICAgICBFbWFpbE1lc3NhZ2U6ICdpbnZpdGF0aW9uIGVtYWlsIGJvZHknLFxuICAgICAgICAgIEVtYWlsU3ViamVjdDogJ2ludml0YXRpb24gZW1haWwgc3ViamVjdCcsXG4gICAgICAgICAgU01TTWVzc2FnZTogJ2ludml0YXRpb24gc21zJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Ntc1JvbGUgcHJvcGVydHkgaXMgcmVjb2duaXplZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gICAgY29uc3Qgcm9sZSA9IFJvbGUuZnJvbVJvbGVBcm4oc3RhY2ssICdzbXNSb2xlJywgJ2Fybjphd3M6aWFtOjo2NjQ3NzM0NDI5MDE6cm9sZS9zbXMtcm9sZScpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBzbXNSb2xlOiByb2xlLFxuICAgICAgc21zUm9sZUV4dGVybmFsSWQ6ICd0ZXN0LWV4dGVybmFsLWlkJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIFNtc0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRXh0ZXJuYWxJZDogJ3Rlc3QtZXh0ZXJuYWwtaWQnLFxuICAgICAgICBTbnNDYWxsZXJBcm46IHJvbGUucm9sZUFybixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Nuc1JlZ2lvbiBwcm9wZXJ0eSBpcyByZWNvZ25pemVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCByb2xlID0gUm9sZS5mcm9tUm9sZUFybihzdGFjaywgJ3Ntc1JvbGUnLCAnYXJuOmF3czppYW06OjY2NDc3MzQ0MjkwMTpyb2xlL3Ntcy1yb2xlJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIHNtc1JvbGU6IHJvbGUsXG4gICAgICBzbXNSb2xlRXh0ZXJuYWxJZDogJ3Rlc3QtZXh0ZXJuYWwtaWQnLFxuICAgICAgc25zUmVnaW9uOiAndGVzdC1yZWdpb24tMScsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBTbXNDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEV4dGVybmFsSWQ6ICd0ZXN0LWV4dGVybmFsLWlkJyxcbiAgICAgICAgU25zQ2FsbGVyQXJuOiByb2xlLnJvbGVBcm4sXG4gICAgICAgIFNuc1JlZ2lvbjogJ3Rlc3QtcmVnaW9uLTEnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnaW1wb3J0IHVzaW5nIGlkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtcbiAgICAgIGVudjogeyByZWdpb246ICdzb21lLXJlZ2lvbi0xJywgYWNjb3VudDogJzAxMjM0NTY3ODkwMTInIH0sXG4gICAgfSk7XG4gICAgY29uc3QgdXNlclBvb2xJZCA9ICd0ZXN0LXVzZXItcG9vbCc7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcG9vbCA9IFVzZXJQb29sLmZyb21Vc2VyUG9vbElkKHN0YWNrLCAndXNlcnBvb2wnLCB1c2VyUG9vbElkKTtcbiAgICBleHBlY3QocG9vbC51c2VyUG9vbElkKS50b0VxdWFsKHVzZXJQb29sSWQpO1xuICAgIGV4cGVjdChwb29sLnVzZXJQb29sQXJuKS50b01hdGNoKC9jb2duaXRvLWlkcDpzb21lLXJlZ2lvbi0xOjAxMjM0NTY3ODkwMTI6dXNlcnBvb2xcXC90ZXN0LXVzZXItcG9vbC8pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnQgdXNpbmcgYXJuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB1c2VyUG9vbEFybiA9ICdhcm46YXdzOmNvZ25pdG8taWRwOnVzLWVhc3QtMTowMTIzNDU2Nzg5MDEyOnVzZXJwb29sL3Rlc3QtdXNlci1wb29sJztcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwb29sID0gVXNlclBvb2wuZnJvbVVzZXJQb29sQXJuKHN0YWNrLCAndXNlcnBvb2wnLCB1c2VyUG9vbEFybik7XG4gICAgZXhwZWN0KHBvb2wudXNlclBvb2xJZCkudG9FcXVhbCgndGVzdC11c2VyLXBvb2wnKTtcbiAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZShwb29sLnVzZXJQb29sQXJuKSkudG9FcXVhbCgnYXJuOmF3czpjb2duaXRvLWlkcDp1cy1lYXN0LTE6MDEyMzQ1Njc4OTAxMjp1c2VycG9vbC90ZXN0LXVzZXItcG9vbCcpO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnQgdXNpbmcgYXJuIHdpdGhvdXQgcmVzb3VyY2VOYW1lIGZhaWxzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB1c2VyUG9vbEFybiA9ICdhcm46YXdzOmNvZ25pdG8taWRwOnVzLWVhc3QtMTowMTIzNDU2Nzg5MDEyOionO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBVc2VyUG9vbC5mcm9tVXNlclBvb2xBcm4oc3RhY2ssICd1c2VycG9vbCcsIHVzZXJQb29sQXJuKTtcbiAgICB9KS50b1Rocm93RXJyb3IoL2ludmFsaWQgdXNlciBwb29sIEFSTi8pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnQgZnJvbSBkaWZmZXJlbnQgYWNjb3VudCByZWdpb24gdXNpbmcgYXJuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgdXNlclBvb2xBcm4gPSAnYXJuOmF3czpjb2duaXRvLWlkcDp1cy1lYXN0LTE6MDEyMzQ1Njc4OTAxMjp1c2VycG9vbC90ZXN0LXVzZXItcG9vbCc7XG5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgZW52OiB7XG4gICAgICAgIGFjY291bnQ6ICcxMTExMTExMTExMTEnLFxuICAgICAgICByZWdpb246ICd1cy1lYXN0LTInLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwb29sID0gVXNlclBvb2wuZnJvbVVzZXJQb29sQXJuKHN0YWNrLCAndXNlcnBvb2wnLCB1c2VyUG9vbEFybik7XG4gICAgZXhwZWN0KHBvb2wuZW52LmFjY291bnQpLnRvRXF1YWwoJzAxMjM0NTY3ODkwMTInKTtcbiAgICBleHBlY3QocG9vbC5lbnYucmVnaW9uKS50b0VxdWFsKCd1cy1lYXN0LTEnKTtcbiAgICBleHBlY3QocG9vbC51c2VyUG9vbEFybikudG9FcXVhbCgnYXJuOmF3czpjb2duaXRvLWlkcDp1cy1lYXN0LTE6MDEyMzQ1Njc4OTAxMjp1c2VycG9vbC90ZXN0LXVzZXItcG9vbCcpO1xuICB9KTtcblxuICB0ZXN0KCdzdXBwb3J0IHRhZ3MnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJywge1xuICAgICAgdXNlclBvb2xOYW1lOiAnbXlQb29sJyxcbiAgICB9KTtcbiAgICBUYWdzLm9mKHBvb2wpLmFkZCgnUG9vbFRhZycsICdQb29sUGFydHknKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIFVzZXJQb29sTmFtZTogJ215UG9vbCcsXG4gICAgICBVc2VyUG9vbFRhZ3M6IHtcbiAgICAgICAgUG9vbFRhZzogJ1Bvb2xQYXJ0eScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdsYW1iZGEgdHJpZ2dlcnMgdmlhIHByb3BlcnRpZXMgYXJlIGNvcnJlY3RseSBjb25maWd1cmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBmbiA9IGZvb0Z1bmN0aW9uKHN0YWNrLCAncHJlU2lnblVwJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgcG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBsYW1iZGFUcmlnZ2Vyczoge1xuICAgICAgICBwcmVTaWduVXA6IGZuLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIExhbWJkYUNvbmZpZzoge1xuICAgICAgICBQcmVTaWduVXA6IHN0YWNrLnJlc29sdmUoZm4uZnVuY3Rpb25Bcm4pLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICBBY3Rpb246ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgRnVuY3Rpb25OYW1lOiBzdGFjay5yZXNvbHZlKGZuLmZ1bmN0aW9uQXJuKSxcbiAgICAgIFByaW5jaXBhbDogJ2NvZ25pdG8taWRwLmFtYXpvbmF3cy5jb20nLFxuICAgICAgU291cmNlQXJuOiBzdGFjay5yZXNvbHZlKHBvb2wudXNlclBvb2xBcm4pLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjdXN0b20gc2VuZGVyIGxhbWJkYSB0cmlnZ2VycyB2aWEgcHJvcGVydGllcyBhcmUgY29ycmVjdGx5IGNvbmZpZ3VyZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IGttc0tleSA9IGZvb0tleShzdGFjaywgJ1Rlc3RLTVNLZXknKTtcbiAgICBjb25zdCBlbWFpbEZuID0gZm9vRnVuY3Rpb24oc3RhY2ssICdjdXN0b21FbWFpbFNlbmRlcicpO1xuICAgIGNvbnN0IHNtc0ZuID0gZm9vRnVuY3Rpb24oc3RhY2ssICdjdXN0b21TbXNTZW5kZXInKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGN1c3RvbVNlbmRlckttc0tleToga21zS2V5LFxuICAgICAgbGFtYmRhVHJpZ2dlcnM6IHtcbiAgICAgICAgY3VzdG9tRW1haWxTZW5kZXI6IGVtYWlsRm4sXG4gICAgICAgIGN1c3RvbVNtc1NlbmRlcjogc21zRm4sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgTGFtYmRhQ29uZmlnOiB7XG4gICAgICAgIEN1c3RvbUVtYWlsU2VuZGVyOiB7XG4gICAgICAgICAgTGFtYmRhQXJuOiBzdGFjay5yZXNvbHZlKGVtYWlsRm4uZnVuY3Rpb25Bcm4pLFxuICAgICAgICAgIExhbWJkYVZlcnNpb246ICdWMV8wJyxcbiAgICAgICAgfSxcbiAgICAgICAgQ3VzdG9tU01TU2VuZGVyOiB7XG4gICAgICAgICAgTGFtYmRhQXJuOiBzdGFjay5yZXNvbHZlKHNtc0ZuLmZ1bmN0aW9uQXJuKSxcbiAgICAgICAgICBMYW1iZGFWZXJzaW9uOiAnVjFfMCcsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkxhbWJkYTo6UGVybWlzc2lvbicsIHtcbiAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICBGdW5jdGlvbk5hbWU6IHN0YWNrLnJlc29sdmUoZW1haWxGbi5mdW5jdGlvbkFybiksXG4gICAgICBQcmluY2lwYWw6ICdjb2duaXRvLWlkcC5hbWF6b25hd3MuY29tJyxcbiAgICAgIFNvdXJjZUFybjogc3RhY2sucmVzb2x2ZShwb29sLnVzZXJQb29sQXJuKSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICBBY3Rpb246ICdsYW1iZGE6SW52b2tlRnVuY3Rpb24nLFxuICAgICAgRnVuY3Rpb25OYW1lOiBzdGFjay5yZXNvbHZlKHNtc0ZuLmZ1bmN0aW9uQXJuKSxcbiAgICAgIFByaW5jaXBhbDogJ2NvZ25pdG8taWRwLmFtYXpvbmF3cy5jb20nLFxuICAgICAgU291cmNlQXJuOiBzdGFjay5yZXNvbHZlKHBvb2wudXNlclBvb2xBcm4pLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdsYW1iZGEgdHJpZ2dlciBLTVMgS2V5IElEIHZpYSBwcm9wZXJ0aWVzIGlzIGNvcnJlY3RseSBjb25maWd1cmVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBrbXNLZXkgPSBmb29LZXkoc3RhY2ssICdUZXN0S01TS2V5Jyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGN1c3RvbVNlbmRlckttc0tleToga21zS2V5LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgTGFtYmRhQ29uZmlnOiB7XG4gICAgICAgIEtNU0tleUlEOiB7ICdGbjo6R2V0QXR0JzogWydUZXN0S01TS2V5MzI1MDk1MzInLCAnQXJuJ10gfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZCogQVBJIGNvcnJlY3RseSBhcHBlbmRzIHRyaWdnZXJzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBrbXNLZXkgPSBmb29LZXkoc3RhY2ssICdUZXN0S01TS2V5Jyk7XG5cbiAgICBjb25zdCBjcmVhdGVBdXRoQ2hhbGxlbmdlID0gZm9vRnVuY3Rpb24oc3RhY2ssICdjcmVhdGVBdXRoQ2hhbGxlbmdlJyk7XG4gICAgY29uc3QgY3VzdG9tTWVzc2FnZSA9IGZvb0Z1bmN0aW9uKHN0YWNrLCAnY3VzdG9tTWVzc2FnZScpO1xuICAgIGNvbnN0IGRlZmluZUF1dGhDaGFsbGVuZ2UgPSBmb29GdW5jdGlvbihzdGFjaywgJ2RlZmluZUF1dGhDaGFsbGVuZ2UnKTtcbiAgICBjb25zdCBwb3N0QXV0aGVudGljYXRpb24gPSBmb29GdW5jdGlvbihzdGFjaywgJ3Bvc3RBdXRoZW50aWNhdGlvbicpO1xuICAgIGNvbnN0IHBvc3RDb25maXJtYXRpb24gPSBmb29GdW5jdGlvbihzdGFjaywgJ3Bvc3RDb25maXJtYXRpb24nKTtcbiAgICBjb25zdCBwcmVBdXRoZW50aWNhdGlvbiA9IGZvb0Z1bmN0aW9uKHN0YWNrLCAncHJlQXV0aGVudGljYXRpb24nKTtcbiAgICBjb25zdCBwcmVTaWduVXAgPSBmb29GdW5jdGlvbihzdGFjaywgJ3ByZVNpZ25VcCcpO1xuICAgIGNvbnN0IHByZVRva2VuR2VuZXJhdGlvbiA9IGZvb0Z1bmN0aW9uKHN0YWNrLCAncHJlVG9rZW5HZW5lcmF0aW9uJyk7XG4gICAgY29uc3QgdXNlck1pZ3JhdGlvbiA9IGZvb0Z1bmN0aW9uKHN0YWNrLCAndXNlck1pZ3JhdGlvbicpO1xuICAgIGNvbnN0IHZlcmlmeUF1dGhDaGFsbGVuZ2VSZXNwb25zZSA9IGZvb0Z1bmN0aW9uKHN0YWNrLCAndmVyaWZ5QXV0aENoYWxsZW5nZVJlc3BvbnNlJyk7XG4gICAgY29uc3QgY3VzdG9tRW1haWxTZW5kZXIgPSBmb29GdW5jdGlvbihzdGFjaywgJ2N1c3RvbUVtYWlsU2VuZGVyJyk7XG4gICAgY29uc3QgY3VzdG9tU21zU2VuZGVyID0gZm9vRnVuY3Rpb24oc3RhY2ssICdjdXN0b21TbXNTZW5kZXInKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGN1c3RvbVNlbmRlckttc0tleToga21zS2V5LFxuICAgIH0pO1xuICAgIHBvb2wuYWRkVHJpZ2dlcihVc2VyUG9vbE9wZXJhdGlvbi5DUkVBVEVfQVVUSF9DSEFMTEVOR0UsIGNyZWF0ZUF1dGhDaGFsbGVuZ2UpO1xuICAgIHBvb2wuYWRkVHJpZ2dlcihVc2VyUG9vbE9wZXJhdGlvbi5DVVNUT01fTUVTU0FHRSwgY3VzdG9tTWVzc2FnZSk7XG4gICAgcG9vbC5hZGRUcmlnZ2VyKFVzZXJQb29sT3BlcmF0aW9uLkRFRklORV9BVVRIX0NIQUxMRU5HRSwgZGVmaW5lQXV0aENoYWxsZW5nZSk7XG4gICAgcG9vbC5hZGRUcmlnZ2VyKFVzZXJQb29sT3BlcmF0aW9uLlBPU1RfQVVUSEVOVElDQVRJT04sIHBvc3RBdXRoZW50aWNhdGlvbik7XG4gICAgcG9vbC5hZGRUcmlnZ2VyKFVzZXJQb29sT3BlcmF0aW9uLlBPU1RfQ09ORklSTUFUSU9OLCBwb3N0Q29uZmlybWF0aW9uKTtcbiAgICBwb29sLmFkZFRyaWdnZXIoVXNlclBvb2xPcGVyYXRpb24uUFJFX0FVVEhFTlRJQ0FUSU9OLCBwcmVBdXRoZW50aWNhdGlvbik7XG4gICAgcG9vbC5hZGRUcmlnZ2VyKFVzZXJQb29sT3BlcmF0aW9uLlBSRV9TSUdOX1VQLCBwcmVTaWduVXApO1xuICAgIHBvb2wuYWRkVHJpZ2dlcihVc2VyUG9vbE9wZXJhdGlvbi5QUkVfVE9LRU5fR0VORVJBVElPTiwgcHJlVG9rZW5HZW5lcmF0aW9uKTtcbiAgICBwb29sLmFkZFRyaWdnZXIoVXNlclBvb2xPcGVyYXRpb24uVVNFUl9NSUdSQVRJT04sIHVzZXJNaWdyYXRpb24pO1xuICAgIHBvb2wuYWRkVHJpZ2dlcihVc2VyUG9vbE9wZXJhdGlvbi5WRVJJRllfQVVUSF9DSEFMTEVOR0VfUkVTUE9OU0UsIHZlcmlmeUF1dGhDaGFsbGVuZ2VSZXNwb25zZSk7XG4gICAgcG9vbC5hZGRUcmlnZ2VyKFVzZXJQb29sT3BlcmF0aW9uLkNVU1RPTV9FTUFJTF9TRU5ERVIsIGN1c3RvbUVtYWlsU2VuZGVyKTtcbiAgICBwb29sLmFkZFRyaWdnZXIoVXNlclBvb2xPcGVyYXRpb24uQ1VTVE9NX1NNU19TRU5ERVIsIGN1c3RvbVNtc1NlbmRlcik7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBMYW1iZGFDb25maWc6IHtcbiAgICAgICAgQ3JlYXRlQXV0aENoYWxsZW5nZTogc3RhY2sucmVzb2x2ZShjcmVhdGVBdXRoQ2hhbGxlbmdlLmZ1bmN0aW9uQXJuKSxcbiAgICAgICAgQ3VzdG9tTWVzc2FnZTogc3RhY2sucmVzb2x2ZShjdXN0b21NZXNzYWdlLmZ1bmN0aW9uQXJuKSxcbiAgICAgICAgRGVmaW5lQXV0aENoYWxsZW5nZTogc3RhY2sucmVzb2x2ZShkZWZpbmVBdXRoQ2hhbGxlbmdlLmZ1bmN0aW9uQXJuKSxcbiAgICAgICAgUG9zdEF1dGhlbnRpY2F0aW9uOiBzdGFjay5yZXNvbHZlKHBvc3RBdXRoZW50aWNhdGlvbi5mdW5jdGlvbkFybiksXG4gICAgICAgIFBvc3RDb25maXJtYXRpb246IHN0YWNrLnJlc29sdmUocG9zdENvbmZpcm1hdGlvbi5mdW5jdGlvbkFybiksXG4gICAgICAgIFByZUF1dGhlbnRpY2F0aW9uOiBzdGFjay5yZXNvbHZlKHByZUF1dGhlbnRpY2F0aW9uLmZ1bmN0aW9uQXJuKSxcbiAgICAgICAgUHJlU2lnblVwOiBzdGFjay5yZXNvbHZlKHByZVNpZ25VcC5mdW5jdGlvbkFybiksXG4gICAgICAgIFByZVRva2VuR2VuZXJhdGlvbjogc3RhY2sucmVzb2x2ZShwcmVUb2tlbkdlbmVyYXRpb24uZnVuY3Rpb25Bcm4pLFxuICAgICAgICBVc2VyTWlncmF0aW9uOiBzdGFjay5yZXNvbHZlKHVzZXJNaWdyYXRpb24uZnVuY3Rpb25Bcm4pLFxuICAgICAgICBWZXJpZnlBdXRoQ2hhbGxlbmdlUmVzcG9uc2U6IHN0YWNrLnJlc29sdmUodmVyaWZ5QXV0aENoYWxsZW5nZVJlc3BvbnNlLmZ1bmN0aW9uQXJuKSxcbiAgICAgICAgQ3VzdG9tRW1haWxTZW5kZXI6IHtcbiAgICAgICAgICBMYW1iZGFBcm46IHN0YWNrLnJlc29sdmUoY3VzdG9tRW1haWxTZW5kZXIuZnVuY3Rpb25Bcm4pLFxuICAgICAgICAgIExhbWJkYVZlcnNpb246ICdWMV8wJyxcbiAgICAgICAgfSxcbiAgICAgICAgQ3VzdG9tU01TU2VuZGVyOiB7XG4gICAgICAgICAgTGFtYmRhQXJuOiBzdGFjay5yZXNvbHZlKGN1c3RvbVNtc1NlbmRlci5mdW5jdGlvbkFybiksXG4gICAgICAgICAgTGFtYmRhVmVyc2lvbjogJ1YxXzAnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFtjcmVhdGVBdXRoQ2hhbGxlbmdlLCBjdXN0b21NZXNzYWdlLCBkZWZpbmVBdXRoQ2hhbGxlbmdlLCBwb3N0QXV0aGVudGljYXRpb24sXG4gICAgICBwb3N0Q29uZmlybWF0aW9uLCBwcmVBdXRoZW50aWNhdGlvbiwgcHJlU2lnblVwLCBwcmVUb2tlbkdlbmVyYXRpb24sIHVzZXJNaWdyYXRpb24sXG4gICAgICB2ZXJpZnlBdXRoQ2hhbGxlbmdlUmVzcG9uc2UsIGN1c3RvbUVtYWlsU2VuZGVyLCBjdXN0b21TbXNTZW5kZXJdLmZvckVhY2goKGZuKSA9PiB7XG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICAgIEFjdGlvbjogJ2xhbWJkYTpJbnZva2VGdW5jdGlvbicsXG4gICAgICAgIEZ1bmN0aW9uTmFtZTogc3RhY2sucmVzb2x2ZShmbi5mdW5jdGlvbkFybiksXG4gICAgICAgIFByaW5jaXBhbDogJ2NvZ25pdG8taWRwLmFtYXpvbmF3cy5jb20nLFxuICAgICAgICBTb3VyY2VBcm46IHN0YWNrLnJlc29sdmUocG9vbC51c2VyUG9vbEFybiksXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIHVzZSBzYW1lIGxhbWJkYSBhcyB0cmlnZ2VyIGZvciBtdWx0aXBsZSB1c2VyIHBvb2xzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCBmbiA9IGZvb0Z1bmN0aW9uKHN0YWNrLCAncHJlU2lnblVwJyk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbDEnLCB7XG4gICAgICBsYW1iZGFUcmlnZ2VyczogeyBwcmVTaWduVXA6IGZuIH0sXG4gICAgfSk7XG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbDInLCB7XG4gICAgICBsYW1iZGFUcmlnZ2VyczogeyBwcmVTaWduVXA6IGZuIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6TGFtYmRhOjpQZXJtaXNzaW9uJywge1xuICAgICAgU291cmNlQXJuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogWydQb29sMUUzMzk2REYxJywgJ0FybiddLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpMYW1iZGE6OlBlcm1pc3Npb24nLCB7XG4gICAgICBTb3VyY2VBcm46IHtcbiAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ1Bvb2wyOEQ4NTA1NjcnLCAnQXJuJ10sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlscyB3aGVuIHRoZSBzYW1lIHRyaWdnZXIgaXMgYWRkZWQgdHdpY2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICAgIGNvbnN0IHVzZXJwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuXG4gICAgY29uc3QgZm4xID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ2ZuMScsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG4gICAgY29uc3QgZm4yID0gbmV3IGxhbWJkYS5GdW5jdGlvbihzdGFjaywgJ2ZuMicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgdXNlcnBvb2wuYWRkVHJpZ2dlcihVc2VyUG9vbE9wZXJhdGlvbi5DUkVBVEVfQVVUSF9DSEFMTEVOR0UsIGZuMSk7XG4gICAgZXhwZWN0KCgpID0+IHVzZXJwb29sLmFkZFRyaWdnZXIoVXNlclBvb2xPcGVyYXRpb24uQ1JFQVRFX0FVVEhfQ0hBTExFTkdFLCBmbjIpKS50b1Rocm93KC9jcmVhdGVBdXRoQ2hhbGxlbmdlIGFscmVhZHkgZXhpc3RzLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ25vIHVzZXJuYW1lIGFsaWFzZXMgc3BlY2lmaWVkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBVc2VybmFtZUF0dHJpYnV0ZXM6IE1hdGNoLmFic2VudCgpLFxuICAgICAgQWxpYXNBdHRyaWJ1dGVzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbHMgd2hlbiBwcmVmZXJyZWRVc2VybmFtZSBpcyB1c2VkIHdpdGhvdXQgdXNlcm5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBleHBlY3QoKCkgPT4gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIHNpZ25JbkFsaWFzZXM6IHsgcHJlZmVycmVkVXNlcm5hbWU6IHRydWUgfSxcbiAgICB9KSkudG9UaHJvdygvdXNlcm5hbWUvKTtcbiAgfSk7XG5cbiAgdGVzdCgndXNlcm5hbWUgYW5kIGVtYWlsIGFyZSBzcGVjaWZpZWQgYXMgdGhlIHVzZXJuYW1lIGFsaWFzZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBzaWduSW5BbGlhc2VzOiB7IHVzZXJuYW1lOiB0cnVlLCBlbWFpbDogdHJ1ZSB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgVXNlcm5hbWVBdHRyaWJ1dGVzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIEFsaWFzQXR0cmlidXRlczogWydlbWFpbCddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbWFpbCBhbmQgcGhvbmUgbnVtYmVyIGFyZSBzcGVjaWZpZWQgYXMgdGhlIHVzZXJuYW1lIGFsaWFzZXMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBzaWduSW5BbGlhc2VzOiB7IGVtYWlsOiB0cnVlLCBwaG9uZTogdHJ1ZSB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgVXNlcm5hbWVBdHRyaWJ1dGVzOiBbJ2VtYWlsJywgJ3Bob25lX251bWJlciddLFxuICAgICAgQWxpYXNBdHRyaWJ1dGVzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZW1haWwgYW5kIHBob25lIG51bWJlciBhcmUgYXV0b3ZlcmlmaWVkLCBieSBkZWZhdWx0LCBpZiB0aGV5IGFyZSBzcGVjaWZpZWQgYXMgc2lnbkluJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sMScsIHtcbiAgICAgIHVzZXJQb29sTmFtZTogJ1Bvb2wxJyxcbiAgICAgIHNpZ25JbkFsaWFzZXM6IHsgZW1haWw6IHRydWUgfSxcbiAgICB9KTtcbiAgICBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sMicsIHtcbiAgICAgIHVzZXJQb29sTmFtZTogJ1Bvb2wyJyxcbiAgICAgIHNpZ25JbkFsaWFzZXM6IHsgZW1haWw6IHRydWUsIHBob25lOiB0cnVlIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBVc2VyUG9vbE5hbWU6ICdQb29sMScsXG4gICAgICBBdXRvVmVyaWZpZWRBdHRyaWJ1dGVzOiBbJ2VtYWlsJ10sXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBVc2VyUG9vbE5hbWU6ICdQb29sMicsXG4gICAgICBBdXRvVmVyaWZpZWRBdHRyaWJ1dGVzOiBbJ2VtYWlsJywgJ3Bob25lX251bWJlciddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdleHBsaWNpdCBhdXRvdmVyaWZ5IGFyZSBjb3JyZWN0bHkgcGlja2VkIHVwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJywge1xuICAgICAgc2lnbkluQWxpYXNlczogeyB1c2VybmFtZTogdHJ1ZSB9LFxuICAgICAgYXV0b1ZlcmlmeTogeyBlbWFpbDogdHJ1ZSwgcGhvbmU6IHRydWUgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIEF1dG9WZXJpZmllZEF0dHJpYnV0ZXM6IFsnZW1haWwnLCAncGhvbmVfbnVtYmVyJ10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NpZ24gaW4gY2FzZSBzZW5zaXRpdmUgaXMgY29ycmVjdGx5IHBpY2tlZCB1cCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIHNpZ25JbkNhc2VTZW5zaXRpdmU6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgVXNlcm5hbWVDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIENhc2VTZW5zaXRpdmU6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnc2lnbiBpbiBjYXNlIHNlbnNpdGl2ZSBpcyBhYnNlbnQgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHt9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIFVzZXJuYW1lQ29uZmlndXJhdGlvbjogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3N0YW5kYXJkIGF0dHJpYnV0ZXMgZGVmYXVsdCB0byBtdXRhYmxlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJywge1xuICAgICAgc3RhbmRhcmRBdHRyaWJ1dGVzOiB7XG4gICAgICAgIGZ1bGxuYW1lOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIHRpbWV6b25lOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgU2NoZW1hOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBOYW1lOiAnbmFtZScsXG4gICAgICAgICAgUmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgTXV0YWJsZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIE5hbWU6ICd6b25laW5mbycsXG4gICAgICAgICAgUmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgTXV0YWJsZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ211dGFibGUgc3RhbmRhcmQgYXR0cmlidXRlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIHVzZXJQb29sTmFtZTogJ1Bvb2wnLFxuICAgICAgc3RhbmRhcmRBdHRyaWJ1dGVzOiB7XG4gICAgICAgIGZ1bGxuYW1lOiB7XG4gICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgbXV0YWJsZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgICAgdGltZXpvbmU6IHtcbiAgICAgICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgICAgICBtdXRhYmxlOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wxJywge1xuICAgICAgdXNlclBvb2xOYW1lOiAnUG9vbDEnLFxuICAgICAgc3RhbmRhcmRBdHRyaWJ1dGVzOiB7XG4gICAgICAgIGZ1bGxuYW1lOiB7XG4gICAgICAgICAgbXV0YWJsZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHRpbWV6b25lOiB7XG4gICAgICAgICAgbXV0YWJsZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgVXNlclBvb2xOYW1lOiAnUG9vbCcsXG4gICAgICBTY2hlbWE6IFtcbiAgICAgICAge1xuICAgICAgICAgIE11dGFibGU6IHRydWUsXG4gICAgICAgICAgTmFtZTogJ25hbWUnLFxuICAgICAgICAgIFJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgTXV0YWJsZTogdHJ1ZSxcbiAgICAgICAgICBOYW1lOiAnem9uZWluZm8nLFxuICAgICAgICAgIFJlcXVpcmVkOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgVXNlclBvb2xOYW1lOiAnUG9vbDEnLFxuICAgICAgU2NoZW1hOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBOYW1lOiAnbmFtZScsXG4gICAgICAgICAgUmVxdWlyZWQ6IGZhbHNlLFxuICAgICAgICAgIE11dGFibGU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgTmFtZTogJ3pvbmVpbmZvJyxcbiAgICAgICAgICBSZXF1aXJlZDogZmFsc2UsXG4gICAgICAgICAgTXV0YWJsZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdzY2hlbWEgaXMgYWJzZW50IHdoZW4gYXR0cmlidXRlcyBhcmUgbm90IHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHsgdXNlclBvb2xOYW1lOiAnUG9vbCcgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBVc2VyUG9vbE5hbWU6ICdQb29sJyxcbiAgICAgIFNjaGVtYTogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ29wdGlvbmFsIG11dGFibGUgc3RhbmRhcmRBdHRyaWJ1dGVzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJywge1xuICAgICAgdXNlclBvb2xOYW1lOiAnUG9vbCcsXG4gICAgICBzdGFuZGFyZEF0dHJpYnV0ZXM6IHtcbiAgICAgICAgdGltZXpvbmU6IHtcbiAgICAgICAgICBtdXRhYmxlOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIFVzZXJQb29sTmFtZTogJ1Bvb2wnLFxuICAgICAgU2NoZW1hOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBNdXRhYmxlOiB0cnVlLFxuICAgICAgICAgIFJlcXVpcmVkOiBmYWxzZSxcbiAgICAgICAgICBOYW1lOiAnem9uZWluZm8nLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnY3VzdG9tIGF0dHJpYnV0ZXMgd2l0aCBkZWZhdWx0IGNvbnN0cmFpbnRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJywge1xuICAgICAgY3VzdG9tQXR0cmlidXRlczoge1xuICAgICAgICAnY3VzdG9tLXN0cmluZy1hdHRyJzogbmV3IFN0cmluZ0F0dHJpYnV0ZSgpLFxuICAgICAgICAnY3VzdG9tLW51bWJlci1hdHRyJzogbmV3IE51bWJlckF0dHJpYnV0ZSgpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIFNjaGVtYTogW1xuICAgICAgICB7XG4gICAgICAgICAgTmFtZTogJ2N1c3RvbS1zdHJpbmctYXR0cicsXG4gICAgICAgICAgQXR0cmlidXRlRGF0YVR5cGU6ICdTdHJpbmcnLFxuICAgICAgICAgIFN0cmluZ0F0dHJpYnV0ZUNvbnN0cmFpbnRzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgICAgICBOdW1iZXJBdHRyaWJ1dGVDb25zdHJhaW50czogTWF0Y2guYWJzZW50KCksXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBOYW1lOiAnY3VzdG9tLW51bWJlci1hdHRyJyxcbiAgICAgICAgICBBdHRyaWJ1dGVEYXRhVHlwZTogJ051bWJlcicsXG4gICAgICAgICAgU3RyaW5nQXR0cmlidXRlQ29uc3RyYWludHM6IE1hdGNoLmFic2VudCgpLFxuICAgICAgICAgIE51bWJlckF0dHJpYnV0ZUNvbnN0cmFpbnRzOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2N1c3RvbSBhdHRyaWJ1dGVzIHdpdGggY29uc3RyYWludHMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBjdXN0b21BdHRyaWJ1dGVzOiB7XG4gICAgICAgICdjdXN0b20tc3RyaW5nLWF0dHInOiBuZXcgU3RyaW5nQXR0cmlidXRlKHsgbWluTGVuOiA1LCBtYXhMZW46IDUwIH0pLFxuICAgICAgICAnY3VzdG9tLW51bWJlci1hdHRyJzogbmV3IE51bWJlckF0dHJpYnV0ZSh7IG1pbjogNTAwLCBtYXg6IDIwMDAgfSksXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgU2NoZW1hOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBdHRyaWJ1dGVEYXRhVHlwZTogJ1N0cmluZycsXG4gICAgICAgICAgTmFtZTogJ2N1c3RvbS1zdHJpbmctYXR0cicsXG4gICAgICAgICAgU3RyaW5nQXR0cmlidXRlQ29uc3RyYWludHM6IHtcbiAgICAgICAgICAgIE1heExlbmd0aDogJzUwJyxcbiAgICAgICAgICAgIE1pbkxlbmd0aDogJzUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBBdHRyaWJ1dGVEYXRhVHlwZTogJ051bWJlcicsXG4gICAgICAgICAgTmFtZTogJ2N1c3RvbS1udW1iZXItYXR0cicsXG4gICAgICAgICAgTnVtYmVyQXR0cmlidXRlQ29uc3RyYWludHM6IHtcbiAgICAgICAgICAgIE1heFZhbHVlOiAnMjAwMCcsXG4gICAgICAgICAgICBNaW5WYWx1ZTogJzUwMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21mYVR5cGVzIGlzIGlnbm9yZWQgd2hlbiBtZmFFbmZvcmNlbWVudCBpcyB1bmRlZmluZWQgb3Igc2V0IHRvIE9GRicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbDEnLCB7XG4gICAgICB1c2VyUG9vbE5hbWU6ICdQb29sMScsXG4gICAgICBtZmFTZWNvbmRGYWN0b3I6IHtcbiAgICAgICAgc21zOiB0cnVlLFxuICAgICAgICBvdHA6IHRydWUsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wyJywge1xuICAgICAgdXNlclBvb2xOYW1lOiAnUG9vbDInLFxuICAgICAgbWZhOiBNZmEuT0ZGLFxuICAgICAgbWZhU2Vjb25kRmFjdG9yOiB7XG4gICAgICAgIHNtczogdHJ1ZSxcbiAgICAgICAgb3RwOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIFVzZXJQb29sTmFtZTogJ1Bvb2wxJyxcbiAgICAgIE1mYUNvbmZpZ3VyYXRpb246IE1hdGNoLmFic2VudCgpLFxuICAgICAgRW5hYmxlZE1mYXM6IE1hdGNoLmFic2VudCgpLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgVXNlclBvb2xOYW1lOiAnUG9vbDInLFxuICAgICAgTWZhQ29uZmlndXJhdGlvbjogJ09GRicsXG4gICAgICBFbmFibGVkTWZhczogTWF0Y2guYWJzZW50KCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3NtcyBtZmEgdHlwZSBpcyB0aGUgZGVmYXVsdCB3aGVuIG1mYUVuZm9yY2VtZW50IGlzIHNldCB0byBSRVFVSVJFRCBvciBPUFRJT05BTCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbDEnLCB7XG4gICAgICB1c2VyUG9vbE5hbWU6ICdQb29sMScsXG4gICAgICBtZmE6IE1mYS5PUFRJT05BTCxcbiAgICB9KTtcbiAgICBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sMicsIHtcbiAgICAgIHVzZXJQb29sTmFtZTogJ1Bvb2wyJyxcbiAgICAgIG1mYTogTWZhLlJFUVVJUkVELFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgVXNlclBvb2xOYW1lOiAnUG9vbDEnLFxuICAgICAgTWZhQ29uZmlndXJhdGlvbjogJ09QVElPTkFMJyxcbiAgICAgIEVuYWJsZWRNZmFzOiBbJ1NNU19NRkEnXSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIFVzZXJQb29sTmFtZTogJ1Bvb2wyJyxcbiAgICAgIE1mYUNvbmZpZ3VyYXRpb246ICdPTicsXG4gICAgICBFbmFibGVkTWZhczogWydTTVNfTUZBJ10sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ21mYSB0eXBlIGlzIGNvcnJlY3RseSBwaWNrZWQgdXAgd2hlbiBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBtZmE6IE1mYS5SRVFVSVJFRCxcbiAgICAgIG1mYVNlY29uZEZhY3Rvcjoge1xuICAgICAgICBzbXM6IHRydWUsXG4gICAgICAgIG90cDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBFbmFibGVkTWZhczogWydTTVNfTUZBJywgJ1NPRlRXQVJFX1RPS0VOX01GQSddLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdwYXNzd29yZCBwb2xpY3kgaXMgY29ycmVjdGx5IHNldCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIHBhc3N3b3JkUG9saWN5OiB7XG4gICAgICAgIHRlbXBQYXNzd29yZFZhbGlkaXR5OiBEdXJhdGlvbi5kYXlzKDIpLFxuICAgICAgICBtaW5MZW5ndGg6IDE1LFxuICAgICAgICByZXF1aXJlRGlnaXRzOiB0cnVlLFxuICAgICAgICByZXF1aXJlTG93ZXJjYXNlOiB0cnVlLFxuICAgICAgICByZXF1aXJlVXBwZXJjYXNlOiB0cnVlLFxuICAgICAgICByZXF1aXJlU3ltYm9sczogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBQb2xpY2llczoge1xuICAgICAgICBQYXNzd29yZFBvbGljeToge1xuICAgICAgICAgIFRlbXBvcmFyeVBhc3N3b3JkVmFsaWRpdHlEYXlzOiAyLFxuICAgICAgICAgIE1pbmltdW1MZW5ndGg6IDE1LFxuICAgICAgICAgIFJlcXVpcmVMb3dlcmNhc2U6IHRydWUsXG4gICAgICAgICAgUmVxdWlyZVVwcGVyY2FzZTogdHJ1ZSxcbiAgICAgICAgICBSZXF1aXJlTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICBSZXF1aXJlU3ltYm9sczogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Bhc3N3b3JkIG1pbmltdW0gbGVuZ3RoIGlzIHNldCB0byB0aGUgZGVmYXVsdCB3aGVuIG90aGVyIHBhcnRzIG9mIHRoZSBwb2xpY3kgaXMgY29uZmlndXJlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIHBhc3N3b3JkUG9saWN5OiB7XG4gICAgICAgIHRlbXBQYXNzd29yZFZhbGlkaXR5OiBEdXJhdGlvbi5kYXlzKDIpLFxuICAgICAgICByZXF1aXJlRGlnaXRzOiB0cnVlLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgUG9saWNpZXM6IHtcbiAgICAgICAgUGFzc3dvcmRQb2xpY3k6IHtcbiAgICAgICAgICBNaW5pbXVtTGVuZ3RoOiA4LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIHdoZW4gdGVtcFBhc3N3b3JkIHZhbGlkaXR5IGlzIG5vdCBpbiByb3VuZCBkYXlzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIHBhc3N3b3JkUG9saWN5OiB7XG4gICAgICAgIHRlbXBQYXNzd29yZFZhbGlkaXR5OiBEdXJhdGlvbi5ob3VycygzMCksXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KCk7XG4gIH0pO1xuXG4gIHRlc3QoJ3RlbXAgcGFzc3dvcmQgdGhyb3dzIGFuIGVycm9yIHdoZW4gYWJvdmUgdGhlIG1heCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBwYXNzd29yZFBvbGljeToge1xuICAgICAgICB0ZW1wUGFzc3dvcmRWYWxpZGl0eTogRHVyYXRpb24uZGF5cyg0MDApLFxuICAgICAgfSxcbiAgICB9KSkudG9UaHJvdygvdGVtcFBhc3N3b3JkVmFsaWRpdHkgY2Fubm90IGJlIGdyZWF0ZXIgdGhhbi8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3Mgd2hlbiBtaW5MZW5ndGggaXMgb3V0IG9mIHJhbmdlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbDEnLCB7XG4gICAgICBwYXNzd29yZFBvbGljeToge1xuICAgICAgICBtaW5MZW5ndGg6IDUsXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KC9taW5MZW5ndGggZm9yIHBhc3N3b3JkIG11c3QgYmUgYmV0d2Vlbi8pO1xuXG4gICAgZXhwZWN0KCgpID0+IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wyJywge1xuICAgICAgcGFzc3dvcmRQb2xpY3k6IHtcbiAgICAgICAgbWluTGVuZ3RoOiAxMDAsXG4gICAgICB9LFxuICAgIH0pKS50b1Rocm93KC9taW5MZW5ndGggZm9yIHBhc3N3b3JkIG11c3QgYmUgYmV0d2Vlbi8pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnZW1haWwgdHJhbnNtaXNzaW9uIHNldHRpbmdzIGFyZSByZWNvZ25pemVkIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGVtYWlsU2V0dGluZ3M6IHtcbiAgICAgICAgZnJvbTogJ2Zyb21AbXlhd2Vzb21lYXBwLmNvbScsXG4gICAgICAgIHJlcGx5VG86ICdyZXBseVRvQG15YXdlc29tZWFwcC5jb20nLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIEVtYWlsQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBGcm9tOiAnZnJvbUBteWF3ZXNvbWVhcHAuY29tJyxcbiAgICAgICAgUmVwbHlUb0VtYWlsQWRkcmVzczogJ3JlcGx5VG9AbXlhd2Vzb21lYXBwLmNvbScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhZGRDbGllbnQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJwb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcpO1xuICAgIHVzZXJwb29sLmFkZENsaWVudCgnVXNlclBvb2xDbGllbnQnLCB7XG4gICAgICB1c2VyUG9vbENsaWVudE5hbWU6ICd1c2VycG9vbGNsaWVudCcsXG4gICAgfSk7XG4gICAgY29uc3QgaW1wb3J0ZWQgPSBVc2VyUG9vbC5mcm9tVXNlclBvb2xJZChzdGFjaywgJ2ltcG9ydGVkJywgJ2ltcG9ydGVkLXVzZXJwb29sLWlkJyk7XG4gICAgaW1wb3J0ZWQuYWRkQ2xpZW50KCdVc2VyUG9vbEltcG9ydGVkQ2xpZW50Jywge1xuICAgICAgdXNlclBvb2xDbGllbnROYW1lOiAndXNlcnBvb2xpbXBvcnRlZGNsaWVudCcsXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xDbGllbnQnLCB7XG4gICAgICBDbGllbnROYW1lOiAndXNlcnBvb2xjbGllbnQnLFxuICAgICAgVXNlclBvb2xJZDogc3RhY2sucmVzb2x2ZSh1c2VycG9vbC51c2VyUG9vbElkKSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbENsaWVudCcsIHtcbiAgICAgIENsaWVudE5hbWU6ICd1c2VycG9vbGltcG9ydGVkY2xpZW50JyxcbiAgICAgIFVzZXJQb29sSWQ6IHN0YWNrLnJlc29sdmUoaW1wb3J0ZWQudXNlclBvb2xJZCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZFJlc291cmNlU2VydmVyJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VycG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnKTtcbiAgICB1c2VycG9vbC5hZGRSZXNvdXJjZVNlcnZlcignUmVzb3VyY2VTZXJ2ZXInLCB7XG4gICAgICBpZGVudGlmaWVyOiAndXNlcnMnLFxuICAgICAgc2NvcGVzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBzY29wZU5hbWU6ICdyZWFkJyxcbiAgICAgICAgICBzY29wZURlc2NyaXB0aW9uOiAnUmVhZC1vbmx5IGFjY2VzcycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sUmVzb3VyY2VTZXJ2ZXInLCB7XG4gICAgICBJZGVudGlmaWVyOiAndXNlcnMnLFxuICAgICAgTmFtZTogJ3VzZXJzJyxcbiAgICAgIFVzZXJQb29sSWQ6IHN0YWNrLnJlc29sdmUodXNlcnBvb2wudXNlclBvb2xJZCksXG4gICAgICBTY29wZXM6IFtcbiAgICAgICAge1xuICAgICAgICAgIFNjb3BlRGVzY3JpcHRpb246ICdSZWFkLW9ubHkgYWNjZXNzJyxcbiAgICAgICAgICBTY29wZU5hbWU6ICdyZWFkJyxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2FkZERvbWFpbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdXNlcnBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG4gICAgdXNlcnBvb2wuYWRkRG9tYWluKCdVc2VyUG9vbERvbWFpbicsIHtcbiAgICAgIGNvZ25pdG9Eb21haW46IHtcbiAgICAgICAgZG9tYWluUHJlZml4OiAndXNlcnBvb2xkb21haW4nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICBjb25zdCBpbXBvcnRlZCA9IFVzZXJQb29sLmZyb21Vc2VyUG9vbElkKHN0YWNrLCAnaW1wb3J0ZWQnLCAnaW1wb3J0ZWQtdXNlcnBvb2wtaWQnKTtcbiAgICBpbXBvcnRlZC5hZGREb21haW4oJ1VzZXJQb29sSW1wb3J0ZWREb21haW4nLCB7XG4gICAgICBjb2duaXRvRG9tYWluOiB7XG4gICAgICAgIGRvbWFpblByZWZpeDogJ3VzZXJwb29saW1wb3J0ZWRkb21haW4nLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbERvbWFpbicsIHtcbiAgICAgIERvbWFpbjogJ3VzZXJwb29sZG9tYWluJyxcbiAgICAgIFVzZXJQb29sSWQ6IHN0YWNrLnJlc29sdmUodXNlcnBvb2wudXNlclBvb2xJZCksXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2xEb21haW4nLCB7XG4gICAgICBEb21haW46ICd1c2VycG9vbGltcG9ydGVkZG9tYWluJyxcbiAgICAgIFVzZXJQb29sSWQ6IHN0YWNrLnJlc29sdmUoaW1wb3J0ZWQudXNlclBvb2xJZCksXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3JlZ2lzdGVyZWQgaWRlbnRpdHkgcHJvdmlkZXJzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICBjb25zdCB1c2VyUG9vbCA9IG5ldyBVc2VyUG9vbChzdGFjaywgJ3Bvb2wnKTtcbiAgICBjb25zdCBwcm92aWRlcjEgPSBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXIuZnJvbVByb3ZpZGVyTmFtZShzdGFjaywgJ3Byb3ZpZGVyMScsICdwcm92aWRlcjEnKTtcbiAgICBjb25zdCBwcm92aWRlcjIgPSBVc2VyUG9vbElkZW50aXR5UHJvdmlkZXIuZnJvbVByb3ZpZGVyTmFtZShzdGFjaywgJ3Byb3ZpZGVyMicsICdwcm92aWRlcjInKTtcblxuICAgIC8vIFdIRU5cbiAgICB1c2VyUG9vbC5yZWdpc3RlcklkZW50aXR5UHJvdmlkZXIocHJvdmlkZXIxKTtcbiAgICB1c2VyUG9vbC5yZWdpc3RlcklkZW50aXR5UHJvdmlkZXIocHJvdmlkZXIyKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodXNlclBvb2wuaWRlbnRpdHlQcm92aWRlcnMpLnRvRXF1YWwoW3Byb3ZpZGVyMSwgcHJvdmlkZXIyXSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdBY2NvdW50UmVjb3ZlcnlTZXR0aW5nIHNob3VsZCBiZSBjb25maWd1cmVkIGNvcnJlY3RseScsICgpID0+IHtcbiAgICB0ZXN0KCdFTUFJTF9BTkRfUEhPTkVfV0lUSE9VVF9NRkEnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sKHN0YWNrLCAncG9vbCcsIHsgYWNjb3VudFJlY292ZXJ5OiBBY2NvdW50UmVjb3ZlcnkuRU1BSUxfQU5EX1BIT05FX1dJVEhPVVRfTUZBIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgICAgQWNjb3VudFJlY292ZXJ5U2V0dGluZzoge1xuICAgICAgICAgIFJlY292ZXJ5TWVjaGFuaXNtczogW1xuICAgICAgICAgICAgeyBOYW1lOiAndmVyaWZpZWRfZW1haWwnLCBQcmlvcml0eTogMSB9LFxuICAgICAgICAgICAgeyBOYW1lOiAndmVyaWZpZWRfcGhvbmVfbnVtYmVyJywgUHJpb3JpdHk6IDIgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdQSE9ORV9XSVRIT1VUX01GQV9BTkRfRU1BSUwnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sKHN0YWNrLCAncG9vbCcsIHsgYWNjb3VudFJlY292ZXJ5OiBBY2NvdW50UmVjb3ZlcnkuUEhPTkVfV0lUSE9VVF9NRkFfQU5EX0VNQUlMIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgICAgQWNjb3VudFJlY292ZXJ5U2V0dGluZzoge1xuICAgICAgICAgIFJlY292ZXJ5TWVjaGFuaXNtczogW1xuICAgICAgICAgICAgeyBOYW1lOiAndmVyaWZpZWRfcGhvbmVfbnVtYmVyJywgUHJpb3JpdHk6IDEgfSxcbiAgICAgICAgICAgIHsgTmFtZTogJ3ZlcmlmaWVkX2VtYWlsJywgUHJpb3JpdHk6IDIgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdFTUFJTF9PTkxZJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ3Bvb2wnLCB7IGFjY291bnRSZWNvdmVyeTogQWNjb3VudFJlY292ZXJ5LkVNQUlMX09OTFkgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgICBBY2NvdW50UmVjb3ZlcnlTZXR0aW5nOiB7XG4gICAgICAgICAgUmVjb3ZlcnlNZWNoYW5pc21zOiBbXG4gICAgICAgICAgICB7IE5hbWU6ICd2ZXJpZmllZF9lbWFpbCcsIFByaW9yaXR5OiAxIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnUEhPTkVfT05MWV9XSVRIT1VUX01GQScsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2woc3RhY2ssICdwb29sJywgeyBhY2NvdW50UmVjb3Zlcnk6IEFjY291bnRSZWNvdmVyeS5QSE9ORV9PTkxZX1dJVEhPVVRfTUZBIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgICAgQWNjb3VudFJlY292ZXJ5U2V0dGluZzoge1xuICAgICAgICAgIFJlY292ZXJ5TWVjaGFuaXNtczogW1xuICAgICAgICAgICAgeyBOYW1lOiAndmVyaWZpZWRfcGhvbmVfbnVtYmVyJywgUHJpb3JpdHk6IDEgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdOT05FJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ3Bvb2wnLCB7IGFjY291bnRSZWNvdmVyeTogQWNjb3VudFJlY292ZXJ5Lk5PTkUgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgICBBY2NvdW50UmVjb3ZlcnlTZXR0aW5nOiB7XG4gICAgICAgICAgUmVjb3ZlcnlNZWNoYW5pc21zOiBbXG4gICAgICAgICAgICB7IE5hbWU6ICdhZG1pbl9vbmx5JywgUHJpb3JpdHk6IDEgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdQSE9ORV9BTkRfRU1BSUwnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sKHN0YWNrLCAncG9vbCcsIHsgYWNjb3VudFJlY292ZXJ5OiBBY2NvdW50UmVjb3ZlcnkuUEhPTkVfQU5EX0VNQUlMIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgICAgQWNjb3VudFJlY292ZXJ5U2V0dGluZzogTWF0Y2guYWJzZW50KCksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2RlZmF1bHQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sKHN0YWNrLCAncG9vbCcpO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgICAgQWNjb3VudFJlY292ZXJ5U2V0dGluZzoge1xuICAgICAgICAgIFJlY292ZXJ5TWVjaGFuaXNtczogW1xuICAgICAgICAgICAgeyBOYW1lOiAndmVyaWZpZWRfcGhvbmVfbnVtYmVyJywgUHJpb3JpdHk6IDEgfSxcbiAgICAgICAgICAgIHsgTmFtZTogJ3ZlcmlmaWVkX2VtYWlsJywgUHJpb3JpdHk6IDIgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdzbXMgcm9sZXMnLCAoKSA9PiB7XG4gICAgdGVzdCgnZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2woc3RhY2ssICdwb29sJyk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgICBTbXNDb25maWd1cmF0aW9uOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc21zUm9sZSBhbmQgc21zRXh0ZXJuYWxJZCBpcyBzZXQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHNtc1JvbGUgPSBuZXcgUm9sZShzdGFjaywgJ3Ntc1JvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3NlcnZpY2UuYW1hem9uYXdzLmNvbScpLFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ3Bvb2wnLCB7XG4gICAgICAgIHNtc1JvbGUsXG4gICAgICAgIHNtc1JvbGVFeHRlcm5hbElkOiAncm9sZS1leHRlcm5hbC1pZCcsXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICAgIFNtc0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBFeHRlcm5hbElkOiAncm9sZS1leHRlcm5hbC1pZCcsXG4gICAgICAgICAgU25zQ2FsbGVyQXJuOiB7ICdGbjo6R2V0QXR0JzogWydzbXNSb2xlQTQ1ODdDRTgnLCAnQXJuJ10gfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnc2V0dGluZyBlbmFibGVTbXNSb2xlIGNyZWF0ZXMgYW4gc21zIHJvbGUnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sKHN0YWNrLCAncG9vbCcsIHtcbiAgICAgICAgZW5hYmxlU21zUm9sZTogdHJ1ZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgICAgU21zQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIEV4dGVybmFsSWQ6ICdwb29sJyxcbiAgICAgICAgICBTbnNDYWxsZXJBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ3Bvb2xzbXNSb2xlMDQwNDhGMTMnLCAnQXJuJ10gfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6SUFNOjpSb2xlJywge1xuICAgICAgICBBc3N1bWVSb2xlUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQWN0aW9uOiAnc3RzOkFzc3VtZVJvbGUnLFxuICAgICAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICAgICAgICdzdHM6RXh0ZXJuYWxJZCc6ICdwb29sJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgIFByaW5jaXBhbDoge1xuICAgICAgICAgICAgICAgIFNlcnZpY2U6ICdjb2duaXRvLWlkcC5hbWF6b25hd3MuY29tJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIH0sXG4gICAgICAgIFBvbGljaWVzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgUG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgQWN0aW9uOiAnc25zOlB1Ymxpc2gnLFxuICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgUG9saWN5TmFtZTogJ3Nucy1wdWJsaXNoJyxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0ZXN0KCdhdXRvIHNtcyByb2xlIGlzIG5vdCBjcmVhdGVkIHdoZW4gTUZBIGFuZCBwaG9uZVZlcmlmaWNhdGlvbiBpcyBvZmYnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sKHN0YWNrLCAncG9vbCcsIHtcbiAgICAgICAgbWZhOiBNZmEuT0ZGLFxuICAgICAgICBzaWduSW5BbGlhc2VzOiB7XG4gICAgICAgICAgcGhvbmU6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIC8vIFRIRU5cbiAgICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgICBTbXNDb25maWd1cmF0aW9uOiBNYXRjaC5hYnNlbnQoKSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXV0byBzbXMgcm9sZSBpcyBub3QgY3JlYXRlZCB3aGVuIE9UUC1iYXNlZCBNRkEgaXMgZW5hYmxlZCBhbmQgcGhvbmVWZXJpZmljYXRpb24gaXMgb2ZmJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAgIC8vIFdIRU5cbiAgICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ3Bvb2wnLCB7XG4gICAgICAgIG1mYTogTWZhLlJFUVVJUkVELFxuICAgICAgICBtZmFTZWNvbmRGYWN0b3I6IHtcbiAgICAgICAgICBvdHA6IHRydWUsXG4gICAgICAgICAgc21zOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgICAgc2lnbkluQWxpYXNlczoge1xuICAgICAgICAgIHBob25lOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgICAgU21zQ29uZmlndXJhdGlvbjogTWF0Y2guYWJzZW50KCksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2F1dG8gc21zIHJvbGUgaXMgY3JlYXRlZCB3aGVuIHBob25lIHZlcmlmaWNhdGlvbiBpcyB0dXJuZWQgb24nLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sKHN0YWNrLCAncG9vbCcsIHtcbiAgICAgICAgbWZhOiBNZmEuT0ZGLFxuICAgICAgICBzaWduSW5BbGlhc2VzOiB7IHBob25lOiB0cnVlIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICAgIFNtc0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBFeHRlcm5hbElkOiAncG9vbCcsXG4gICAgICAgICAgU25zQ2FsbGVyQXJuOiB7ICdGbjo6R2V0QXR0JzogWydwb29sc21zUm9sZTA0MDQ4RjEzJywgJ0FybiddIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2F1dG8gc21zIHJvbGUgaXMgY3JlYXRlZCB3aGVuIHBob25lIGF1dG8tdmVyaWZpY2F0aW9uIGlzIHNldCcsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2woc3RhY2ssICdwb29sJywge1xuICAgICAgICBtZmE6IE1mYS5PRkYsXG4gICAgICAgIHNpZ25JbkFsaWFzZXM6IHsgcGhvbmU6IGZhbHNlIH0sXG4gICAgICAgIGF1dG9WZXJpZnk6IHsgcGhvbmU6IHRydWUgfSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgICAgU21zQ29uZmlndXJhdGlvbjoge1xuICAgICAgICAgIEV4dGVybmFsSWQ6ICdwb29sJyxcbiAgICAgICAgICBTbnNDYWxsZXJBcm46IHsgJ0ZuOjpHZXRBdHQnOiBbJ3Bvb2xzbXNSb2xlMDQwNDhGMTMnLCAnQXJuJ10gfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGVzdCgnYXV0byBzbXMgcm9sZSBpcyBjcmVhdGVkIHdoZW4gTUZBIGlzIHR1cm5lZCBvbicsICgpID0+IHtcbiAgICAgIC8vIEdJVkVOXG4gICAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgICAvLyBXSEVOXG4gICAgICBuZXcgVXNlclBvb2woc3RhY2ssICdwb29sJywge1xuICAgICAgICBtZmE6IE1mYS5SRVFVSVJFRCxcbiAgICAgICAgbWZhU2Vjb25kRmFjdG9yOiB7XG4gICAgICAgICAgc21zOiB0cnVlLFxuICAgICAgICAgIG90cDogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICAgIHNpZ25JbkFsaWFzZXM6IHtcbiAgICAgICAgICBwaG9uZTogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gVEhFTlxuICAgICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICAgIFNtc0NvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgICBFeHRlcm5hbElkOiAncG9vbCcsXG4gICAgICAgICAgU25zQ2FsbGVyQXJuOiB7ICdGbjo6R2V0QXR0JzogWydwb29sc21zUm9sZTA0MDQ4RjEzJywgJ0FybiddIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ2F1dG8gc21zIHJvbGUgaXMgbm90IGNyZWF0ZWQgd2hlbiBlbmFibGVTbXNSb2xlIGlzIHVuc2V0LCBldmVuIHdoZW4gTUZBIGlzIGNvbmZpZ3VyZWQnLCAoKSA9PiB7XG4gICAgICAvLyBHSVZFTlxuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgICAgLy8gV0hFTlxuICAgICAgbmV3IFVzZXJQb29sKHN0YWNrLCAncG9vbCcsIHtcbiAgICAgICAgbWZhOiBNZmEuUkVRVUlSRUQsXG4gICAgICAgIG1mYVNlY29uZEZhY3Rvcjoge1xuICAgICAgICAgIHNtczogdHJ1ZSxcbiAgICAgICAgICBvdHA6IGZhbHNlLFxuICAgICAgICB9LFxuICAgICAgICBlbmFibGVTbXNSb2xlOiBmYWxzZSxcbiAgICAgIH0pO1xuXG4gICAgICAvLyBUSEVOXG4gICAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgICAgU21zQ29uZmlndXJhdGlvbjogTWF0Y2guYWJzZW50KCksXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRlc3QoJ3Rocm93cyBhbiBlcnJvciB3aGVuIHNtc1JvbGUgaXMgc3BlY2lmaWVkIGJ1dCBlbmFibGVTbXNSb2xlIGlzIHVuc2V0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgICAgIGNvbnN0IHNtc1JvbGUgPSBuZXcgUm9sZShzdGFjaywgJ3Ntc1JvbGUnLCB7XG4gICAgICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ3NlcnZpY2UuYW1hem9uYXdzLmNvbScpLFxuICAgICAgfSk7XG5cbiAgICAgIGV4cGVjdCgoKSA9PiBuZXcgVXNlclBvb2woc3RhY2ssICdwb29sJywge1xuICAgICAgICBzbXNSb2xlLFxuICAgICAgICBlbmFibGVTbXNSb2xlOiBmYWxzZSxcbiAgICAgIH0pKS50b1Rocm93KC9lbmFibGVTbXNSb2xlIGNhbm5vdCBiZSBkaXNhYmxlZC8pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnZW1haWwgdHJhbnNtaXNzaW9uIHdpdGggY3lyaWxsaWMgY2hhcmFjdGVycyBhcmUgZW5jb2RlZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGVtYWlsU2V0dGluZ3M6IHtcbiAgICAgICAgZnJvbTogJ9C+0YJA0LTQvtC80LXQvS7RgNGEJyxcbiAgICAgICAgcmVwbHlUbzogJ9C+0YLQstC10YLQuNGC0YxA0LTQvtC80LXQvS7RgNGEJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBFbWFpbENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRnJvbTogJ9C+0YJAeG4tLWQxYWN1ZmMueG4tLXAxYWknLFxuICAgICAgICBSZXBseVRvRW1haWxBZGRyZXNzOiAn0L7RgtCy0LXRgtC40YLRjEB4bi0tZDFhY3VmYy54bi0tcDFhaScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbWFpbCB0cmFuc21pc3Npb24gd2l0aCBjeXJpbGxpYyBjaGFyYWN0ZXJzIGluIHRoZSBkb21haW4gYXJlIGVuY29kZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBlbWFpbDogVXNlclBvb2xFbWFpbC53aXRoU0VTKHtcbiAgICAgICAgc2VzUmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgZnJvbUVtYWlsOiAndXNlckDQtNC+0LzQtdC9LtGA0YQnLFxuICAgICAgICByZXBseVRvOiAndXNlckDQtNC+0LzQtdC9LtGA0YQnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBFbWFpbENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRnJvbTogJ3VzZXJAeG4tLWQxYWN1ZmMueG4tLXAxYWknLFxuICAgICAgICBSZXBseVRvRW1haWxBZGRyZXNzOiAndXNlckB4bi0tZDFhY3VmYy54bi0tcDFhaScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbWFpbCB0cmFuc21pc3Npb24gd2l0aCBjeXJpbGxpYyBjaGFyYWN0ZXJzIGluIHRoZSBsb2NhbCBwYXJ0IHRocm93IGVycm9yJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGVtYWlsOiBVc2VyUG9vbEVtYWlsLndpdGhTRVMoe1xuICAgICAgICBzZXNSZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICBmcm9tRW1haWw6ICfQvtGCQNC00L7QvNC10L0u0YDRhCcsXG4gICAgICAgIHJlcGx5VG86ICd1c2VyQNC00L7QvNC10L0u0YDRhCcsXG4gICAgICB9KSxcbiAgICB9KSkudG9UaHJvdygvdGhlIGxvY2FsIHBhcnQgb2YgdGhlIGVtYWlsIGFkZHJlc3MgbXVzdCB1c2UgQVNDSUkgY2hhcmFjdGVycyBvbmx5Lyk7XG4gIH0pO1xuXG4gIHRlc3QoJ2VtYWlsIHRyYW5zbWlzc2lvbiB3aXRoIGN5cmlsbGljIGNoYXJhY3RlcnMgaW4gdGhlIGxvY2FsIHBhcnQgb2YgcmVwbHlUbyB0aHJvdyBlcnJvcicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBlbWFpbDogVXNlclBvb2xFbWFpbC53aXRoU0VTKHtcbiAgICAgICAgc2VzUmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgZnJvbUVtYWlsOiAndXNlckDQtNC+0LzQtdC9LtGA0YQnLFxuICAgICAgICByZXBseVRvOiAn0L7RgkDQtNC+0LzQtdC9LtGA0YQnLFxuICAgICAgfSksXG4gICAgfSkpLnRvVGhyb3coL3RoZSBsb2NhbCBwYXJ0IG9mIHRoZSBlbWFpbCBhZGRyZXNzIG11c3QgdXNlIEFTQ0lJIGNoYXJhY3RlcnMgb25seS8pO1xuICB9KTtcblxuICB0ZXN0KCdlbWFpbCB3aXRoQ29nbml0byB0cmFuc21pc3Npb24gd2l0aCBjeXJpbGxpYyBjaGFyYWN0ZXJzIGluIHRoZSBsb2NhbCBwYXJ0IG9mIHJlcGx5VG8gdGhyb3cgZXJyb3InLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJywge1xuICAgICAgZW1haWw6IFVzZXJQb29sRW1haWwud2l0aENvZ25pdG8oJ9C+0YJA0LTQvtC80LXQvS7RgNGEJyksXG4gICAgfSkpLnRvVGhyb3coL3RoZSBsb2NhbCBwYXJ0IG9mIHRoZSBlbWFpbCBhZGRyZXNzIG11c3QgdXNlIEFTQ0lJIGNoYXJhY3RlcnMgb25seS8pO1xuICB9KTtcblxuICB0ZXN0KCdlbWFpbCB3aXRoQ29nbml0bycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGVtYWlsOiBVc2VyUG9vbEVtYWlsLndpdGhDb2duaXRvKCksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBFbWFpbENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRW1haWxTZW5kaW5nQWNjb3VudDogJ0NPR05JVE9fREVGQVVMVCcsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbWFpbCB3aXRoQ29nbml0byBhbmQgcmVwbHlUbycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGVtYWlsOiBVc2VyUG9vbEVtYWlsLndpdGhDb2duaXRvKCdyZXBseUBleGFtcGxlLmNvbScpLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgRW1haWxDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEVtYWlsU2VuZGluZ0FjY291bnQ6ICdDT0dOSVRPX0RFRkFVTFQnLFxuICAgICAgICBSZXBseVRvRW1haWxBZGRyZXNzOiAncmVwbHlAZXhhbXBsZS5jb20nLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZW1haWwgd2l0aFNFUyB3aXRoIGN1c3RvbSBlbWFpbCBhbmQgbm8gcmVnaW9uJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGVtYWlsOiBVc2VyUG9vbEVtYWlsLndpdGhTRVMoe1xuICAgICAgICBmcm9tRW1haWw6ICdteWN1c3RvbWVtYWlsQGV4YW1wbGUuY29tJyxcbiAgICAgICAgcmVwbHlUbzogJ3JlcGx5QGV4YW1wbGUuY29tJyxcbiAgICAgIH0pLFxuICAgIH0pKS50b1Rocm93KC9Zb3VyIHN0YWNrIHJlZ2lvbiBjYW5ub3QgYmUgZGV0ZXJtaW5lZC8pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2VtYWlsIHdpdGhTRVMgd2l0aCBubyBuYW1lJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtcbiAgICAgIGVudjoge1xuICAgICAgICByZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICBhY2NvdW50OiAnMTExMTExMTExMTEnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJywge1xuICAgICAgZW1haWw6IFVzZXJQb29sRW1haWwud2l0aFNFUyh7XG4gICAgICAgIGZyb21FbWFpbDogJ215Y3VzdG9tZW1haWxAZXhhbXBsZS5jb20nLFxuICAgICAgICByZXBseVRvOiAncmVwbHlAZXhhbXBsZS5jb20nLFxuICAgICAgICBjb25maWd1cmF0aW9uU2V0TmFtZTogJ2RlZmF1bHQnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBFbWFpbENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRW1haWxTZW5kaW5nQWNjb3VudDogJ0RFVkVMT1BFUicsXG4gICAgICAgIEZyb206ICdteWN1c3RvbWVtYWlsQGV4YW1wbGUuY29tJyxcbiAgICAgICAgUmVwbHlUb0VtYWlsQWRkcmVzczogJ3JlcGx5QGV4YW1wbGUuY29tJyxcbiAgICAgICAgQ29uZmlndXJhdGlvblNldDogJ2RlZmF1bHQnLFxuICAgICAgICBTb3VyY2VBcm46IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOnNlczp1cy1lYXN0LTE6MTExMTExMTExMTE6aWRlbnRpdHkvbXljdXN0b21lbWFpbEBleGFtcGxlLmNvbScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2VtYWlsIHdpdGhTRVMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgZW52OiB7XG4gICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgIGFjY291bnQ6ICcxMTExMTExMTExMScsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBlbWFpbDogVXNlclBvb2xFbWFpbC53aXRoU0VTKHtcbiAgICAgICAgZnJvbUVtYWlsOiAnbXljdXN0b21lbWFpbEBleGFtcGxlLmNvbScsXG4gICAgICAgIGZyb21OYW1lOiAnTXkgQ3VzdG9tIEVtYWlsJyxcbiAgICAgICAgcmVwbHlUbzogJ3JlcGx5QGV4YW1wbGUuY29tJyxcbiAgICAgICAgY29uZmlndXJhdGlvblNldE5hbWU6ICdkZWZhdWx0JyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgRW1haWxDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEVtYWlsU2VuZGluZ0FjY291bnQ6ICdERVZFTE9QRVInLFxuICAgICAgICBGcm9tOiAnTXkgQ3VzdG9tIEVtYWlsIDxteWN1c3RvbWVtYWlsQGV4YW1wbGUuY29tPicsXG4gICAgICAgIFJlcGx5VG9FbWFpbEFkZHJlc3M6ICdyZXBseUBleGFtcGxlLmNvbScsXG4gICAgICAgIENvbmZpZ3VyYXRpb25TZXQ6ICdkZWZhdWx0JyxcbiAgICAgICAgU291cmNlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzpzZXM6dXMtZWFzdC0xOjExMTExMTExMTExOmlkZW50aXR5L215Y3VzdG9tZW1haWxAZXhhbXBsZS5jb20nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZW1haWwgd2l0aFNFUyB3aXRoIG5hbWUgYXMgcXVvdGVkLXN0cmluZycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgYWNjb3VudDogJzExMTExMTExMTExJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGVtYWlsOiBVc2VyUG9vbEVtYWlsLndpdGhTRVMoe1xuICAgICAgICBmcm9tRW1haWw6ICdteWN1c3RvbWVtYWlsQGV4YW1wbGUuY29tJyxcbiAgICAgICAgZnJvbU5hbWU6ICdcIk15IEN1c3RvbSBFbWFpbFwiJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgRW1haWxDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEVtYWlsU2VuZGluZ0FjY291bnQ6ICdERVZFTE9QRVInLFxuICAgICAgICBGcm9tOiAnXCJNeSBDdXN0b20gRW1haWxcIiA8bXljdXN0b21lbWFpbEBleGFtcGxlLmNvbT4nLFxuICAgICAgICBTb3VyY2VBcm46IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOnNlczp1cy1lYXN0LTE6MTExMTExMTExMTE6aWRlbnRpdHkvbXljdXN0b21lbWFpbEBleGFtcGxlLmNvbScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbWFpbCB3aXRoU0VTIHdpdGggbmFtZSB3aXRoIG5vbiBhdG9tIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgZW52OiB7XG4gICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMScsXG4gICAgICAgIGFjY291bnQ6ICcxMTExMTExMTExMScsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBlbWFpbDogVXNlclBvb2xFbWFpbC53aXRoU0VTKHtcbiAgICAgICAgZnJvbUVtYWlsOiAnbXljdXN0b21lbWFpbEBleGFtcGxlLmNvbScsXG4gICAgICAgIGZyb21OYW1lOiAnbXljdXN0b21uYW1lQGV4YW1wbGUuY29tJyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgRW1haWxDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEVtYWlsU2VuZGluZ0FjY291bnQ6ICdERVZFTE9QRVInLFxuICAgICAgICBGcm9tOiAnXCJteWN1c3RvbW5hbWVAZXhhbXBsZS5jb21cIiA8bXljdXN0b21lbWFpbEBleGFtcGxlLmNvbT4nLFxuICAgICAgICBTb3VyY2VBcm46IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOnNlczp1cy1lYXN0LTE6MTExMTExMTExMTE6aWRlbnRpdHkvbXljdXN0b21lbWFpbEBleGFtcGxlLmNvbScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbWFpbCB3aXRoU0VTIHdpdGggbmFtZSB3aXRoIHF1b3RlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgYWNjb3VudDogJzExMTExMTExMTExJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGVtYWlsOiBVc2VyUG9vbEVtYWlsLndpdGhTRVMoe1xuICAgICAgICBmcm9tRW1haWw6ICdteWN1c3RvbWVtYWlsQGV4YW1wbGUuY29tJyxcbiAgICAgICAgZnJvbU5hbWU6ICdGb28gXCJCYXJcIiBcXFxcQmF6JyxcbiAgICAgIH0pLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgICAgRW1haWxDb25maWd1cmF0aW9uOiB7XG4gICAgICAgIEVtYWlsU2VuZGluZ0FjY291bnQ6ICdERVZFTE9QRVInLFxuICAgICAgICBGcm9tOiAnXCJGb28gXFxcXFwiQmFyXFxcXFwiIFxcXFxcXFxcQmF6XCIgPG15Y3VzdG9tZW1haWxAZXhhbXBsZS5jb20+JyxcbiAgICAgICAgU291cmNlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzpzZXM6dXMtZWFzdC0xOjExMTExMTExMTExOmlkZW50aXR5L215Y3VzdG9tZW1haWxAZXhhbXBsZS5jb20nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZW1haWwgd2l0aFNFUyB3aXRoIG5hbWUgd2l0aCBub24gVVMtQVNDSUkgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgYWNjb3VudDogJzExMTExMTExMTExJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGVtYWlsOiBVc2VyUG9vbEVtYWlsLndpdGhTRVMoe1xuICAgICAgICBmcm9tRW1haWw6ICdteWN1c3RvbWVtYWlsQGV4YW1wbGUuY29tJyxcbiAgICAgICAgZnJvbU5hbWU6ICfjgYLjgYTjgYYnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBFbWFpbENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRW1haWxTZW5kaW5nQWNjb3VudDogJ0RFVkVMT1BFUicsXG4gICAgICAgIEZyb206ICc9P1VURi04P0I/NDRHQzQ0R0U0NEdHPz0gPG15Y3VzdG9tZW1haWxAZXhhbXBsZS5jb20+JyxcbiAgICAgICAgU291cmNlQXJuOiB7XG4gICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgJycsXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgJzpzZXM6dXMtZWFzdC0xOjExMTExMTExMTExOmlkZW50aXR5L215Y3VzdG9tZW1haWxAZXhhbXBsZS5jb20nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgnZW1haWwgd2l0aFNFUyB3aXRoIHZhbGlkIHJlZ2lvbicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB7XG4gICAgICBlbnY6IHtcbiAgICAgICAgcmVnaW9uOiAndXMtZWFzdC0yJyxcbiAgICAgICAgYWNjb3VudDogJzExMTExMTExMTExJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICAgIGVtYWlsOiBVc2VyUG9vbEVtYWlsLndpdGhTRVMoe1xuICAgICAgICBmcm9tRW1haWw6ICdteWN1c3RvbWVtYWlsQGV4YW1wbGUuY29tJyxcbiAgICAgICAgZnJvbU5hbWU6ICdNeSBDdXN0b20gRW1haWwnLFxuICAgICAgICBzZXNSZWdpb246ICd1cy1lYXN0LTEnLFxuICAgICAgICByZXBseVRvOiAncmVwbHlAZXhhbXBsZS5jb20nLFxuICAgICAgICBjb25maWd1cmF0aW9uU2V0TmFtZTogJ2RlZmF1bHQnLFxuICAgICAgfSksXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgICBFbWFpbENvbmZpZ3VyYXRpb246IHtcbiAgICAgICAgRW1haWxTZW5kaW5nQWNjb3VudDogJ0RFVkVMT1BFUicsXG4gICAgICAgIEZyb206ICdNeSBDdXN0b20gRW1haWwgPG15Y3VzdG9tZW1haWxAZXhhbXBsZS5jb20+JyxcbiAgICAgICAgUmVwbHlUb0VtYWlsQWRkcmVzczogJ3JlcGx5QGV4YW1wbGUuY29tJyxcbiAgICAgICAgQ29uZmlndXJhdGlvblNldDogJ2RlZmF1bHQnLFxuICAgICAgICBTb3VyY2VBcm46IHtcbiAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAnJyxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAnOnNlczp1cy1lYXN0LTE6MTExMTExMTExMTE6aWRlbnRpdHkvbXljdXN0b21lbWFpbEBleGFtcGxlLmNvbScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gIH0pO1xuXG4gIHRlc3QoJ2VtYWlsIHdpdGhTRVMgd2l0aCB2ZXJpZmllZCBkb21haW4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayh1bmRlZmluZWQsIHVuZGVmaW5lZCwge1xuICAgICAgZW52OiB7XG4gICAgICAgIHJlZ2lvbjogJ3VzLWVhc3QtMicsXG4gICAgICAgIGFjY291bnQ6ICcxMTExMTExMTExMScsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBlbWFpbDogVXNlclBvb2xFbWFpbC53aXRoU0VTKHtcbiAgICAgICAgZnJvbUVtYWlsOiAnbXljdXN0b21lbWFpbEBleGFtcGxlLmNvbScsXG4gICAgICAgIGZyb21OYW1lOiAnTXkgQ3VzdG9tIEVtYWlsJyxcbiAgICAgICAgc2VzUmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgcmVwbHlUbzogJ3JlcGx5QGV4YW1wbGUuY29tJyxcbiAgICAgICAgY29uZmlndXJhdGlvblNldE5hbWU6ICdkZWZhdWx0JyxcbiAgICAgICAgc2VzVmVyaWZpZWREb21haW46ICdleGFtcGxlLmNvbScsXG4gICAgICB9KSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICAgIEVtYWlsQ29uZmlndXJhdGlvbjoge1xuICAgICAgICBFbWFpbFNlbmRpbmdBY2NvdW50OiAnREVWRUxPUEVSJyxcbiAgICAgICAgRnJvbTogJ015IEN1c3RvbSBFbWFpbCA8bXljdXN0b21lbWFpbEBleGFtcGxlLmNvbT4nLFxuICAgICAgICBSZXBseVRvRW1haWxBZGRyZXNzOiAncmVwbHlAZXhhbXBsZS5jb20nLFxuICAgICAgICBDb25maWd1cmF0aW9uU2V0OiAnZGVmYXVsdCcsXG4gICAgICAgIFNvdXJjZUFybjoge1xuICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBSZWY6ICdBV1M6OlBhcnRpdGlvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICc6c2VzOnVzLWVhc3QtMToxMTExMTExMTExMTppZGVudGl0eS9leGFtcGxlLmNvbScsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdlbWFpbCB3aXRoU0VTIHRocm93cywgd2hlbiBcImZyb21FbWFpbFwiIGNvbnRhaW5zIHRoZSBkaWZmZXJlbnQgZG9tYWluJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2sodW5kZWZpbmVkLCB1bmRlZmluZWQsIHtcbiAgICAgIGVudjoge1xuICAgICAgICByZWdpb246ICd1cy1lYXN0LTInLFxuICAgICAgICBhY2NvdW50OiAnMTExMTExMTExMTEnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sMScsIHtcbiAgICAgIG1mYU1lc3NhZ2U6ICd7IyMjIycsXG4gICAgfSkpLnRvVGhyb3coL01GQSBtZXNzYWdlIG11c3QgY29udGFpbiB0aGUgdGVtcGxhdGUgc3RyaW5nLyk7XG5cbiAgICAvLyBXSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgICBlbWFpbDogVXNlclBvb2xFbWFpbC53aXRoU0VTKHtcbiAgICAgICAgZnJvbUVtYWlsOiAnbXljdXN0b21lbWFpbEBzb21lLmNvbScsXG4gICAgICAgIGZyb21OYW1lOiAnTXkgQ3VzdG9tIEVtYWlsJyxcbiAgICAgICAgc2VzUmVnaW9uOiAndXMtZWFzdC0xJyxcbiAgICAgICAgcmVwbHlUbzogJ3JlcGx5QGV4YW1wbGUuY29tJyxcbiAgICAgICAgY29uZmlndXJhdGlvblNldE5hbWU6ICdkZWZhdWx0JyxcbiAgICAgICAgc2VzVmVyaWZpZWREb21haW46ICdleGFtcGxlLmNvbScsXG4gICAgICB9KSxcbiAgICB9KSkudG9UaHJvdygvXCJmcm9tRW1haWxcIiBjb250YWlucyBhIGRpZmZlcmVudCBkb21haW4gdGhhbiB0aGUgXCJzZXNWZXJpZmllZERvbWFpblwiLyk7XG4gIH0pO1xufSk7XG5cbnRlc3QoJ2RldmljZSB0cmFja2luZyBpcyBjb25maWd1cmVkIGNvcnJlY3RseScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgZGV2aWNlVHJhY2tpbmc6IHtcbiAgICAgIGNoYWxsZW5nZVJlcXVpcmVkT25OZXdEZXZpY2U6IHRydWUsXG4gICAgICBkZXZpY2VPbmx5UmVtZW1iZXJlZE9uVXNlclByb21wdDogdHJ1ZSxcbiAgICB9LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgIERldmljZUNvbmZpZ3VyYXRpb246IHtcbiAgICAgIENoYWxsZW5nZVJlcXVpcmVkT25OZXdEZXZpY2U6IHRydWUsXG4gICAgICBEZXZpY2VPbmx5UmVtZW1iZXJlZE9uVXNlclByb21wdDogdHJ1ZSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdrZWVwIG9yaWdpbmFsIGF0dHJzIGlzIGNvbmZpZ3VyZWQgY29ycmVjdGx5JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICBzaWduSW5BbGlhc2VzOiB7IHVzZXJuYW1lOiB0cnVlIH0sXG4gICAgYXV0b1ZlcmlmeTogeyBlbWFpbDogdHJ1ZSwgcGhvbmU6IHRydWUgfSxcbiAgICBrZWVwT3JpZ2luYWw6IHtcbiAgICAgIGVtYWlsOiB0cnVlLFxuICAgICAgcGhvbmU6IHRydWUsXG4gICAgfSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2duaXRvOjpVc2VyUG9vbCcsIHtcbiAgICBVc2VyQXR0cmlidXRlVXBkYXRlU2V0dGluZ3M6IHtcbiAgICAgIEF0dHJpYnV0ZXNSZXF1aXJlVmVyaWZpY2F0aW9uQmVmb3JlVXBkYXRlOiBbJ2VtYWlsJywgJ3Bob25lX251bWJlciddLFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2dyYW50JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCByb2xlID0gbmV3IFJvbGUoc3RhY2ssICdSb2xlJywge1xuICAgIGFzc3VtZWRCeTogbmV3IFNlcnZpY2VQcmluY2lwYWwoJ2xhbWJkYS5hbWF6b25hd3MuY29tJyksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgY29uc3QgdXNlclBvb2wgPSBuZXcgVXNlclBvb2woc3RhY2ssICdQb29sJyk7XG4gIHVzZXJQb29sLmdyYW50KHJvbGUsICdjb2duaXRvLWlkcDpBZG1pbkNyZWF0ZVVzZXInLCAnY29nbml0by1pZHA6TGlzdFVzZXJzJyk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpJQU06OlBvbGljeScsIHtcbiAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgIHtcbiAgICAgICAgICBBY3Rpb246IFtcbiAgICAgICAgICAgICdjb2duaXRvLWlkcDpBZG1pbkNyZWF0ZVVzZXInLFxuICAgICAgICAgICAgJ2NvZ25pdG8taWRwOkxpc3RVc2VycycsXG4gICAgICAgICAgXSxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICAgICAnUG9vbEQzRjU4OEI4JyxcbiAgICAgICAgICAgICAgJ0FybicsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgIH0sXG4gICAgUm9sZXM6IFtcbiAgICAgIHtcbiAgICAgICAgUmVmOiAnUm9sZTFBQkNDNUYwJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG5cbn0pO1xuXG50ZXN0KCdkZWxldGlvbiBwcm90ZWN0aW9uJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHtcbiAgICBkZWxldGlvblByb3RlY3Rpb246IHRydWUsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29nbml0bzo6VXNlclBvb2wnLCB7XG4gICAgRGVsZXRpb25Qcm90ZWN0aW9uOiAnQUNUSVZFJyxcbiAgfSk7XG59KTtcblxudGVzdC5lYWNoKFxuICBbXG4gICAgW0FkdmFuY2VkU2VjdXJpdHlNb2RlLkVORk9SQ0VELCAnRU5GT1JDRUQnXSxcbiAgICBbQWR2YW5jZWRTZWN1cml0eU1vZGUuQVVESVQsICdBVURJVCddLFxuICAgIFtBZHZhbmNlZFNlY3VyaXR5TW9kZS5PRkYsICdPRkYnXSxcbiAgXSkoJ2FkdmFuY2VkIHNlY3VyaXR5IGlzIGNvbmZpZ3VyZWQgY29ycmVjdGx5IHdoZW4gc2V0IHRvICglcyknLCAoYWR2YW5jZWRTZWN1cml0eU1vZGUsIGNvbXBhcmVTdHJpbmcpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBVc2VyUG9vbChzdGFjaywgJ1Bvb2wnLCB7XG4gICAgYWR2YW5jZWRTZWN1cml0eU1vZGU6IGFkdmFuY2VkU2VjdXJpdHlNb2RlLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgIFVzZXJQb29sQWRkT25zOiB7XG4gICAgICBBZHZhbmNlZFNlY3VyaXR5TW9kZTogY29tcGFyZVN0cmluZyxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdhZHZhbmNlZCBzZWN1cml0eSBpcyBub3QgcHJlc2VudCBpZiBvcHRpb24gaXMgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IFVzZXJQb29sKHN0YWNrLCAnUG9vbCcsIHt9KTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZ25pdG86OlVzZXJQb29sJywge1xuICAgIFVzZXJQb29sQWRkT25zOiBNYXRjaC5hYnNlbnQoKSxcbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gZm9vRnVuY3Rpb24oc2NvcGU6IENvbnN0cnVjdCwgbmFtZTogc3RyaW5nKTogbGFtYmRhLklGdW5jdGlvbiB7XG4gIHJldHVybiBuZXcgbGFtYmRhLkZ1bmN0aW9uKHNjb3BlLCBuYW1lLCB7XG4gICAgZnVuY3Rpb25OYW1lOiBuYW1lLFxuICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoJ2ZvbycpLFxuICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xNF9YLFxuICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGZvb0tleShzY29wZTogQ29uc3RydWN0LCBuYW1lOiBzdHJpbmcpOiBrbXMuS2V5IHtcbiAgcmV0dXJuIG5ldyBrbXMuS2V5KHNjb3BlLCBuYW1lKTtcbn1cbiJdfQ==