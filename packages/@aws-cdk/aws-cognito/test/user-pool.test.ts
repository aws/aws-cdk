import '@aws-cdk/assert/jest';
import { ABSENT } from '@aws-cdk/assert/lib/assertions/have-resource';
import { Role } from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack, Tag } from '@aws-cdk/core';
import { SignInType, UserPool, UserPoolAttribute, VerificationEmailStyle } from '../lib';

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
      }
    });

    expect(stack).toHaveResourceLike('AWS::IAM::Role', {
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
        ]
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
            ]
          }
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

  test('set sign in type', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      signInType: SignInType.EMAIL,
      autoVerifiedAttributes: [ UserPoolAttribute.EMAIL ]
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UsernameAttributes: [ 'email' ],
      AutoVerifiedAttributes: [ 'email' ]
    });
  });

  test('usernameAliasAttributes require signInType of USERNAME', () => {
    const stack = new Stack();

    expect(() => {
      new UserPool(stack, 'Pool', {
        signInType: SignInType.EMAIL,
        usernameAliasAttributes: [ UserPoolAttribute.PREFERRED_USERNAME ]
      });
    }).toThrow(/'usernameAliasAttributes' can only be set with a signInType of 'USERNAME'/);
  });

  test('usernameAliasAttributes must be one or more of EMAIL, PHONE_NUMBER, or PREFERRED_USERNAME', () => {
    const stack = new Stack();

    expect(() => {
      new UserPool(stack, 'Pool', {
        signInType: SignInType.USERNAME,
        usernameAliasAttributes: [ UserPoolAttribute.GIVEN_NAME ]
      });
    }).toThrow(/'usernameAliasAttributes' can only include EMAIL, PHONE_NUMBER, or PREFERRED_USERNAME/);
  });

  test('autoVerifiedAttributes must be one or more of EMAIL or PHONE_NUMBER', () => {
    const stack = new Stack();

    expect(() => {
      new UserPool(stack, 'Pool', {
        signInType: SignInType.EMAIL,
        autoVerifiedAttributes: [ UserPoolAttribute.EMAIL, UserPoolAttribute.GENDER ]
      });
    }).toThrow(/'autoVerifiedAttributes' can only include EMAIL or PHONE_NUMBER/);
  });
});