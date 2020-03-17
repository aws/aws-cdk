import '@aws-cdk/assert/jest';
import { ABSENT } from '@aws-cdk/assert/lib/assertions/have-resource';
import { Role } from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, Stack, Tag } from '@aws-cdk/core';
import { Mfa, UserPool, VerificationEmailStyle } from '../lib';

describe('User Pool', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool');

    // THEN
    expect(stack).toHaveResource('AWS::Cognito::UserPool', {
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: true,
        InviteMessageTemplate: ABSENT
      },
      EmailVerificationMessage: 'Hello {username}, Your verification code is {####}',
      EmailVerificationSubject: 'Verify your new account',
      SmsVerificationMessage: 'The verification code to your new account is {####}',
      VerificationMessageTemplate: {
        DefaultEmailOption: 'CONFIRM_WITH_CODE',
        EmailMessage: 'Hello {username}, Your verification code is {####}',
        EmailSubject: 'Verify your new account',
        SmsMessage: 'The verification code to your new account is {####}',
      },
      SmsConfiguration: {
        SnsCallerArn: {
          'Fn::GetAtt': [ 'PoolsmsRoleC3352CE6', 'Arn' ],
        },
        ExternalId: 'Pool'
      },
    });

    expect(stack).toHaveResource('AWS::IAM::Role', {
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Condition: {
              StringEquals: {
                'sts:ExternalId': 'Pool'
              }
            },
            Effect: 'Allow',
            Principal: {
              Service: 'cognito-idp.amazonaws.com'
            }
          }
        ],
        Version: '2012-10-17'
      },
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: 'sns:Publish',
                Effect: 'Allow',
                Resource: '*'
              }
            ],
            Version: '2012-10-17'
          },
          PolicyName: 'sns-publish'
        }
      ]
    });
  });

  test('self sign up option is correctly configured', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      selfSignUpEnabled: true
    });

    // THEN
    expect(stack).toHaveResource('AWS::Cognito::UserPool', {
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: false
      }
    });
  });

  test('email verification via link is configured correctly', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      userVerification: {
        emailStyle: VerificationEmailStyle.LINK
      }
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      EmailVerificationMessage: 'Hello {username}, Your verification code is {####}',
      EmailVerificationSubject: 'Verify your new account',
      VerificationMessageTemplate: {
        DefaultEmailOption: 'CONFIRM_WITH_LINK',
        EmailMessageByLink: 'Hello {username}, Your verification code is {####}',
        EmailSubjectByLink: 'Verify your new account',
      }
    });
  }),

  test('user invitation messages are configured correctly', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      userInvitation: {
        emailBody: 'invitation email body',
        emailSubject: 'invitation email subject',
        smsMessage: 'invitation sms'
      }
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      AdminCreateUserConfig: {
        InviteMessageTemplate: {
          EmailMessage: 'invitation email body',
          EmailSubject: 'invitation email subject',
          SMSMessage: 'invitation sms'
        }
      }
    });
  });

  test('smsRole property is recognized', () => {
    // GIVEN
    const stack = new Stack();
    const role = Role.fromRoleArn(stack, 'smsRole', 'arn:aws:iam::664773442901:role/sms-role');

    // WHEN
    new UserPool(stack, 'Pool', {
      smsRole: role,
      smsRoleExternalId: 'test-external-id'
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      SmsConfiguration: {
        ExternalId: 'test-external-id',
        SnsCallerArn: role.roleArn
      }
    });
  });

  test('import using id', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: { region: 'some-region-1', account: '0123456789012' }
    });
    const userPoolId = 'test-user-pool';

    // WHEN
    const pool = UserPool.fromUserPoolId(stack, 'userpool', userPoolId);
    expect(pool.userPoolId).toEqual(userPoolId);
    expect(pool.userPoolArn).toMatch(/cognito-idp:some-region-1:0123456789012:userpool\/test-user-pool/);
  });

  test('import using arn', () => {
    // GIVEN
    const stack = new Stack();
    const userPoolArn = 'arn:aws:cognito-idp:us-east-1:0123456789012:userpool/test-user-pool';

    // WHEN
    const pool = UserPool.fromUserPoolArn(stack, 'userpool', userPoolArn);
    expect(pool.userPoolId).toEqual('test-user-pool');
    expect(pool.userPoolArn).toEqual(userPoolArn);
  });

  test('support tags', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const pool = new UserPool(stack, 'Pool', {
      userPoolName: 'myPool',
    });
    Tag.add(pool, 'PoolTag', 'PoolParty');

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UserPoolName: 'myPool',
      UserPoolTags: {
        PoolTag: 'PoolParty',
      }
    });
  });

  test('lambda triggers are defined', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    const pool = new UserPool(stack, 'Pool', {
      lambdaTriggers: {
        preSignUp: fn
      }
    });
    pool.addCustomMessageTrigger(fn);

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      LambdaConfig: {
        PreSignUp: stack.resolve(fn.functionArn),
        CustomMessage: stack.resolve(fn.functionArn)
      }
    });
  });

  test('on* API correctly appends triggers', () => {
    // GIVEN
    const stack = new Stack();

    const createAuthChallengeLambdaFn = new lambda.Function(stack, 'createAuthChallengeLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const customMessageLambdaFn = new lambda.Function(stack, 'customMessageLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const defineAuthChallengeLambdaFn = new lambda.Function(stack, 'defineAuthChallengeLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const postAuthenticationLambdaFn = new lambda.Function(stack, 'postAuthenticationLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const postConfirmationLambdaFn = new lambda.Function(stack, 'postConfirmationLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const preAuthenticationLambdaFn = new lambda.Function(stack, 'preAuthenticationLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const preSignUpLambdaFn = new lambda.Function(stack, 'preSignUpLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const preTokenGenerationLambdaFn = new lambda.Function(stack, 'preTokenGenerationLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const userMigrationLambdaFn = new lambda.Function(stack, 'userMigrationLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const verifyAuthChallengeResponseLambdaFn = new lambda.Function(stack, 'verifyAuthChallengeResponseLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    const pool = new UserPool(stack, 'Pool', { });
    pool.addCreateAuthChallengeTrigger(createAuthChallengeLambdaFn);
    pool.addCustomMessageTrigger(customMessageLambdaFn);
    pool.addDefineAuthChallengeTrigger(defineAuthChallengeLambdaFn);
    pool.addPostAuthenticationTrigger(postAuthenticationLambdaFn);
    pool.addPostConfirmationTrigger(postConfirmationLambdaFn);
    pool.addPreAuthenticationTrigger(preAuthenticationLambdaFn);
    pool.addPreSignUpTrigger(preSignUpLambdaFn);
    pool.addPreTokenGenerationTrigger(preTokenGenerationLambdaFn);
    pool.addUserMigrationTrigger(userMigrationLambdaFn);
    pool.addVerifyAuthChallengeResponseTrigger(verifyAuthChallengeResponseLambdaFn);

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      LambdaConfig: {
        CreateAuthChallenge: stack.resolve(createAuthChallengeLambdaFn.functionArn),
        CustomMessage: stack.resolve(customMessageLambdaFn.functionArn),
        DefineAuthChallenge: stack.resolve(defineAuthChallengeLambdaFn.functionArn),
        PostAuthentication: stack.resolve(postAuthenticationLambdaFn.functionArn),
        PostConfirmation: stack.resolve(postConfirmationLambdaFn.functionArn),
        PreAuthentication: stack.resolve(preAuthenticationLambdaFn.functionArn),
        PreSignUp: stack.resolve(preSignUpLambdaFn.functionArn),
        PreTokenGeneration: stack.resolve(preTokenGenerationLambdaFn.functionArn),
        UserMigration: stack.resolve(userMigrationLambdaFn.functionArn),
        VerifyAuthChallengeResponse: stack.resolve(verifyAuthChallengeResponseLambdaFn.functionArn)
      }
    });
  });

  test('lambdas are given cognito service grant', () => {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    new UserPool(stack, 'Pool', {
      lambdaTriggers: {
        preSignUp: fn
      }
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Lambda::Permission', {
      FunctionName: stack.resolve(fn.functionArn),
      Principal: 'cognito-idp.amazonaws.com'
    });
  });

  test('no username aliases specified', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool');

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UsernameAttributes: ABSENT,
      AliasAttributes: ABSENT,
    });
  });

  test('fails when preferredUsername is used without username', () => {
    const stack = new Stack();
    expect(() => new UserPool(stack, 'Pool', {
      signInAliases: { preferredUsername: true }
    })).toThrow(/username/);
  });

  test('username and email are specified as the username aliases', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      signInAliases: { username: true, email: true }
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UsernameAttributes: ABSENT,
      AliasAttributes: [ 'email' ],
    });
  });

  test('email and phone number are specified as the username aliases', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      signInAliases: { email: true, phone: true }
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UsernameAttributes: [ 'email', 'phone_number' ],
      AliasAttributes: ABSENT,
    });
  });

  test('email and phone number are autoverified, by default, if they are specified as signIn', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool1', {
      userPoolName: 'Pool1',
      signInAliases: { email: true }
    });
    new UserPool(stack, 'Pool2', {
      userPoolName: 'Pool2',
      signInAliases: { email: true, phone: true }
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool1',
      AutoVerifiedAttributes: [ 'email' ],
    });
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool2',
      AutoVerifiedAttributes: [ 'email', 'phone_number' ],
    });
  });

  test('explicit autoverify are correctly picked up', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      signInAliases: { username: true },
      autoVerify: { email: true, phone: true },
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      AutoVerifiedAttributes: [ 'email', 'phone_number' ],
    });
  });

  test('mfaTypes is ignored when mfaEnforcement is undefined or set to OFF', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool1', {
      userPoolName: 'Pool1',
      mfaSecondFactor: {
        sms: true,
        otp: true,
      }
    });
    new UserPool(stack, 'Pool2', {
      userPoolName: 'Pool2',
      mfa: Mfa.OFF,
      mfaSecondFactor: {
        sms: true,
        otp: true,
      }
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool1',
      MfaConfiguration: ABSENT,
      EnabledMfas: ABSENT,
    });
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool2',
      MfaConfiguration: 'OFF',
      EnabledMfas: ABSENT,
    });
  });

  test('sms mfa type is the default when mfaEnforcement is set to REQUIRED or OPTIONAL', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool1', {
      userPoolName: 'Pool1',
      mfa: Mfa.OPTIONAL,
    });
    new UserPool(stack, 'Pool2', {
      userPoolName: 'Pool2',
      mfa: Mfa.REQUIRED,
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool1',
      MfaConfiguration: 'OPTIONAL',
      EnabledMfas: [ 'SMS_MFA' ],
    });
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool2',
      MfaConfiguration: 'ON',
      EnabledMfas: [ 'SMS_MFA' ],
    });
  });

  test('mfa type is correctly picked up when specified', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      mfa: Mfa.REQUIRED,
      mfaSecondFactor: {
        sms: true,
        otp: true,
      }
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      EnabledMfas: [ 'SMS_MFA', 'SOFTWARE_TOKEN_MFA' ],
    });
  });

  test('password policy is correctly set', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      passwordPolicy: {
        tempPasswordValidity: Duration.days(2),
        minLength: 15,
        requireDigits: true,
        requireLowercase: true,
        requireUppercase: true,
        requireSymbols: true,
      }
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
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

  test('throws when tempPassword validity is not in round days', () => {
    const stack = new Stack();

    expect(() => new UserPool(stack, 'Pool', {
      passwordPolicy: {
        tempPasswordValidity: Duration.hours(30),
      }
    })).toThrow();
  });

  test('temp password throws an error when above the max', () => {
    const stack = new Stack();

    expect(() => new UserPool(stack, 'Pool', {
      passwordPolicy: {
        tempPasswordValidity: Duration.days(400),
      }
    })).toThrow(/tempPasswordValidity cannot be greater than/);
  });

  test('throws when minLength is out of range', () => {
    const stack = new Stack();

    expect(() => new UserPool(stack, 'Pool1', {
      passwordPolicy: {
        minLength: 5,
      },
    })).toThrow(/minLength for password must be between/);

    expect(() => new UserPool(stack, 'Pool2', {
      passwordPolicy: {
        minLength: 100,
      },
    })).toThrow(/minLength for password must be between/);
  });

  test('email transmission settings are recognized correctly', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      emailSettings: {
        from: 'from@myawesomeapp.com',
        replyTo: 'replyTo@myawesomeapp.com'
      }
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      EmailConfiguration: {
        From: 'from@myawesomeapp.com',
        ReplyToEmailAddress: 'replyTo@myawesomeapp.com'
      }
    });
  });
});