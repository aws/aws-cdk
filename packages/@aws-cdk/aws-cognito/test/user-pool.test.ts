import { Match, Template } from '@aws-cdk/assertions';
import { Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import { CfnParameter, Duration, Stack, Tags } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { AccountRecovery, Mfa, NumberAttribute, StringAttribute, UserPool, UserPoolIdentityProvider, UserPoolOperation, VerificationEmailStyle, UserPoolEmail, AdvancedSecurityMode } from '../lib';

describe('User Pool', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: true,
        InviteMessageTemplate: Match.absent(),
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
      SmsAuthenticationMessage: Match.absent(),
      SmsConfiguration: Match.absent(),
      lambdaTriggers: Match.absent(),
    });

    Template.fromStack(stack).hasResource('AWS::Cognito::UserPool', {
      DeletionPolicy: 'Retain',
    });
  });

  test('self sign up option is correctly configured', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      selfSignUpEnabled: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: false,
      },
    });
  });

  test('email verification via link is configured correctly', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      userVerification: {
        emailStyle: VerificationEmailStyle.LINK,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      EmailVerificationMessage: Match.absent(),
      EmailVerificationSubject: Match.absent(),
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
    const stack = new Stack();
    const message = 'The authentication code to your account is {####}';

    // WHEN
    new UserPool(stack, 'Pool', {
      mfaMessage: message,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      SmsAuthenticationMessage: message,
    });
  }),

  test('mfa authentication message is validated', () => {
    const stack = new Stack();

    expect(() => new UserPool(stack, 'Pool1', {
      mfaMessage: '{####',
    })).toThrow(/MFA message must contain the template string/);

    expect(() => new UserPool(stack, 'Pool2', {
      mfaMessage: '{####}',
    })).not.toThrow();

    expect(() => new UserPool(stack, 'Pool3', {
      mfaMessage: `{####}${'x'.repeat(135)}`,
    })).toThrow(/MFA message must be between 6 and 140 characters/);

    expect(() => new UserPool(stack, 'Pool4', {
      mfaMessage: `{####}${'x'.repeat(134)}`,
    })).not.toThrow();

    // Validation is skipped for tokens.
    const parameter = new CfnParameter(stack, 'Parameter');

    expect(() => new UserPool(stack, 'Pool5', {
      mfaMessage: parameter.valueAsString,
    })).not.toThrow();
  });

  test('email and sms verification messages are validated', () => {
    const stack = new Stack();

    expect(() => new UserPool(stack, 'Pool1', {
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
        emailBody: 'invalid email body',
      },
    })).toThrow(/Verification email body/);

    expect(() => new UserPool(stack, 'Pool2', {
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
        emailBody: 'valid email body {####}',
      },
    })).not.toThrow();

    expect(() => new UserPool(stack, 'Pool3', {
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
        smsMessage: 'invalid sms message',
      },
    })).toThrow(/SMS message/);

    expect(() => new UserPool(stack, 'Pool4', {
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
        smsMessage: 'invalid sms message {####}',
      },
    })).not.toThrow();

    expect(() => new UserPool(stack, 'Pool5', {
      userVerification: {
        emailStyle: VerificationEmailStyle.LINK,
        emailBody: 'invalid email body {####}',
      },
    })).toThrow(/Verification email body/);

    expect(() => new UserPool(stack, 'Pool6', {
      userVerification: {
        emailStyle: VerificationEmailStyle.LINK,
        emailBody: 'invalid email body {##Verify Email##}',
      },
    })).not.toThrow();
  });

  test('validation is skipped for email and sms messages when tokens', () => {
    const stack = new Stack();
    const parameter = new CfnParameter(stack, 'Parameter');

    expect(() => new UserPool(stack, 'Pool1', {
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
        emailBody: parameter.valueAsString,
      },
    })).not.toThrow();

    expect(() => new UserPool(stack, 'Pool2', {
      userVerification: {
        emailStyle: VerificationEmailStyle.CODE,
        smsMessage: parameter.valueAsString,
      },
    })).not.toThrow();
  });

  test('user invitation messages are configured correctly', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      userInvitation: {
        emailBody: 'invitation email body',
        emailSubject: 'invitation email subject',
        smsMessage: 'invitation sms',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack();
    const role = Role.fromRoleArn(stack, 'smsRole', 'arn:aws:iam::664773442901:role/sms-role');

    // WHEN
    new UserPool(stack, 'Pool', {
      smsRole: role,
      smsRoleExternalId: 'test-external-id',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      SmsConfiguration: {
        ExternalId: 'test-external-id',
        SnsCallerArn: role.roleArn,
      },
    });
  });

  test('snsRegion property is recognized', () => {
    // GIVEN
    const stack = new Stack();
    const role = Role.fromRoleArn(stack, 'smsRole', 'arn:aws:iam::664773442901:role/sms-role');

    // WHEN
    new UserPool(stack, 'Pool', {
      smsRole: role,
      smsRoleExternalId: 'test-external-id',
      snsRegion: 'test-region-1',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      SmsConfiguration: {
        ExternalId: 'test-external-id',
        SnsCallerArn: role.roleArn,
        SnsRegion: 'test-region-1',
      },
    });
  });

  test('import using id', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: { region: 'some-region-1', account: '0123456789012' },
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
    expect(stack.resolve(pool.userPoolArn)).toEqual('arn:aws:cognito-idp:us-east-1:0123456789012:userpool/test-user-pool');
  });

  test('import using arn without resourceName fails', () => {
    // GIVEN
    const stack = new Stack();
    const userPoolArn = 'arn:aws:cognito-idp:us-east-1:0123456789012:*';

    // WHEN
    expect(() => {
      UserPool.fromUserPoolArn(stack, 'userpool', userPoolArn);
    }).toThrowError(/invalid user pool ARN/);
  });

  test('import from different account region using arn', () => {
    // GIVEN
    const userPoolArn = 'arn:aws:cognito-idp:us-east-1:0123456789012:userpool/test-user-pool';

    const stack = new Stack(undefined, undefined, {
      env: {
        account: '111111111111',
        region: 'us-east-2',
      },
    });

    // WHEN
    const pool = UserPool.fromUserPoolArn(stack, 'userpool', userPoolArn);
    expect(pool.env.account).toEqual('0123456789012');
    expect(pool.env.region).toEqual('us-east-1');
    expect(pool.userPoolArn).toEqual('arn:aws:cognito-idp:us-east-1:0123456789012:userpool/test-user-pool');
  });

  test('support tags', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const pool = new UserPool(stack, 'Pool', {
      userPoolName: 'myPool',
    });
    Tags.of(pool).add('PoolTag', 'PoolParty');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UserPoolName: 'myPool',
      UserPoolTags: {
        PoolTag: 'PoolParty',
      },
    });
  });

  test('lambda triggers via properties are correctly configured', () => {
    // GIVEN
    const stack = new Stack();
    const fn = fooFunction(stack, 'preSignUp');

    // WHEN
    const pool = new UserPool(stack, 'Pool', {
      lambdaTriggers: {
        preSignUp: fn,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      LambdaConfig: {
        PreSignUp: stack.resolve(fn.functionArn),
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: stack.resolve(fn.functionArn),
      Principal: 'cognito-idp.amazonaws.com',
      SourceArn: stack.resolve(pool.userPoolArn),
    });
  });

  test('custom sender lambda triggers via properties are correctly configured', () => {
    // GIVEN
    const stack = new Stack();
    const kmsKey = fooKey(stack, 'TestKMSKey');
    const emailFn = fooFunction(stack, 'customEmailSender');
    const smsFn = fooFunction(stack, 'customSmsSender');

    // WHEN
    const pool = new UserPool(stack, 'Pool', {
      customSenderKmsKey: kmsKey,
      lambdaTriggers: {
        customEmailSender: emailFn,
        customSmsSender: smsFn,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: stack.resolve(emailFn.functionArn),
      Principal: 'cognito-idp.amazonaws.com',
      SourceArn: stack.resolve(pool.userPoolArn),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Action: 'lambda:InvokeFunction',
      FunctionName: stack.resolve(smsFn.functionArn),
      Principal: 'cognito-idp.amazonaws.com',
      SourceArn: stack.resolve(pool.userPoolArn),
    });
  });

  test('lambda trigger KMS Key ID via properties is correctly configured', () => {
    // GIVEN
    const stack = new Stack();
    const kmsKey = fooKey(stack, 'TestKMSKey');

    // WHEN
    new UserPool(stack, 'Pool', {
      customSenderKmsKey: kmsKey,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      LambdaConfig: {
        KMSKeyID: { 'Fn::GetAtt': ['TestKMSKey32509532', 'Arn'] },
      },
    });
  });

  test('add* API correctly appends triggers', () => {
    // GIVEN
    const stack = new Stack();
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
    const pool = new UserPool(stack, 'Pool', {
      customSenderKmsKey: kmsKey,
    });
    pool.addTrigger(UserPoolOperation.CREATE_AUTH_CHALLENGE, createAuthChallenge);
    pool.addTrigger(UserPoolOperation.CUSTOM_MESSAGE, customMessage);
    pool.addTrigger(UserPoolOperation.DEFINE_AUTH_CHALLENGE, defineAuthChallenge);
    pool.addTrigger(UserPoolOperation.POST_AUTHENTICATION, postAuthentication);
    pool.addTrigger(UserPoolOperation.POST_CONFIRMATION, postConfirmation);
    pool.addTrigger(UserPoolOperation.PRE_AUTHENTICATION, preAuthentication);
    pool.addTrigger(UserPoolOperation.PRE_SIGN_UP, preSignUp);
    pool.addTrigger(UserPoolOperation.PRE_TOKEN_GENERATION, preTokenGeneration);
    pool.addTrigger(UserPoolOperation.USER_MIGRATION, userMigration);
    pool.addTrigger(UserPoolOperation.VERIFY_AUTH_CHALLENGE_RESPONSE, verifyAuthChallengeResponse);
    pool.addTrigger(UserPoolOperation.CUSTOM_EMAIL_SENDER, customEmailSender);
    pool.addTrigger(UserPoolOperation.CUSTOM_SMS_SENDER, customSmsSender);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
      Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
        Action: 'lambda:InvokeFunction',
        FunctionName: stack.resolve(fn.functionArn),
        Principal: 'cognito-idp.amazonaws.com',
        SourceArn: stack.resolve(pool.userPoolArn),
      });
    });
  });

  test('can use same lambda as trigger for multiple user pools', () => {
    // GIVEN
    const stack = new Stack();
    const fn = fooFunction(stack, 'preSignUp');

    // WHEN
    new UserPool(stack, 'Pool1', {
      lambdaTriggers: { preSignUp: fn },
    });
    new UserPool(stack, 'Pool2', {
      lambdaTriggers: { preSignUp: fn },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::GetAtt': ['Pool1E3396DF1', 'Arn'],
      },
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      SourceArn: {
        'Fn::GetAtt': ['Pool28D850567', 'Arn'],
      },
    });
  });

  test('fails when the same trigger is added twice', () => {
    // GIVEN
    const stack = new Stack();
    const userpool = new UserPool(stack, 'Pool');

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
    userpool.addTrigger(UserPoolOperation.CREATE_AUTH_CHALLENGE, fn1);
    expect(() => userpool.addTrigger(UserPoolOperation.CREATE_AUTH_CHALLENGE, fn2)).toThrow(/createAuthChallenge already exists/);
  });

  test('no username aliases specified', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UsernameAttributes: Match.absent(),
      AliasAttributes: Match.absent(),
    });
  });

  test('fails when preferredUsername is used without username', () => {
    const stack = new Stack();
    expect(() => new UserPool(stack, 'Pool', {
      signInAliases: { preferredUsername: true },
    })).toThrow(/username/);
  });

  test('username and email are specified as the username aliases', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      signInAliases: { username: true, email: true },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UsernameAttributes: Match.absent(),
      AliasAttributes: ['email'],
    });
  });

  test('email and phone number are specified as the username aliases', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      signInAliases: { email: true, phone: true },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UsernameAttributes: ['email', 'phone_number'],
      AliasAttributes: Match.absent(),
    });
  });

  test('email and phone number are autoverified, by default, if they are specified as signIn', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool1', {
      userPoolName: 'Pool1',
      signInAliases: { email: true },
    });
    new UserPool(stack, 'Pool2', {
      userPoolName: 'Pool2',
      signInAliases: { email: true, phone: true },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool1',
      AutoVerifiedAttributes: ['email'],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool2',
      AutoVerifiedAttributes: ['email', 'phone_number'],
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
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      AutoVerifiedAttributes: ['email', 'phone_number'],
    });
  });

  test('sign in case sensitive is correctly picked up', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      signInCaseSensitive: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UsernameConfiguration: {
        CaseSensitive: false,
      },
    });
  });

  test('sign in case sensitive is absent by default', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {});

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UsernameConfiguration: Match.absent(),
    });
  });

  test('standard attributes default to mutable', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
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

    new UserPool(stack, 'Pool1', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', { userPoolName: 'Pool' });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool',
      Schema: Match.absent(),
    });
  });

  test('optional mutable standardAttributes', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      userPoolName: 'Pool',
      standardAttributes: {
        timezone: {
          mutable: true,
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      customAttributes: {
        'custom-string-attr': new StringAttribute(),
        'custom-number-attr': new NumberAttribute(),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      Schema: [
        {
          Name: 'custom-string-attr',
          AttributeDataType: 'String',
          StringAttributeConstraints: Match.absent(),
          NumberAttributeConstraints: Match.absent(),
        },
        {
          Name: 'custom-number-attr',
          AttributeDataType: 'Number',
          StringAttributeConstraints: Match.absent(),
          NumberAttributeConstraints: Match.absent(),
        },
      ],
    });
  });

  test('custom attributes with constraints', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      customAttributes: {
        'custom-string-attr': new StringAttribute({ minLen: 5, maxLen: 50 }),
        'custom-number-attr': new NumberAttribute({ min: 500, max: 2000 }),
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool1', {
      userPoolName: 'Pool1',
      mfaSecondFactor: {
        sms: true,
        otp: true,
      },
    });
    new UserPool(stack, 'Pool2', {
      userPoolName: 'Pool2',
      mfa: Mfa.OFF,
      mfaSecondFactor: {
        sms: true,
        otp: true,
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool1',
      MfaConfiguration: Match.absent(),
      EnabledMfas: Match.absent(),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool2',
      MfaConfiguration: 'OFF',
      EnabledMfas: Match.absent(),
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
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool1',
      MfaConfiguration: 'OPTIONAL',
      EnabledMfas: ['SMS_MFA'],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      UserPoolName: 'Pool2',
      MfaConfiguration: 'ON',
      EnabledMfas: ['SMS_MFA'],
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
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      EnabledMfas: ['SMS_MFA', 'SOFTWARE_TOKEN_MFA'],
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
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      passwordPolicy: {
        tempPasswordValidity: Duration.days(2),
        requireDigits: true,
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
        },
      },
    });
  });

  test('throws when tempPassword validity is not in round days', () => {
    const stack = new Stack();

    expect(() => new UserPool(stack, 'Pool', {
      passwordPolicy: {
        tempPasswordValidity: Duration.hours(30),
      },
    })).toThrow();
  });

  test('temp password throws an error when above the max', () => {
    const stack = new Stack();

    expect(() => new UserPool(stack, 'Pool', {
      passwordPolicy: {
        tempPasswordValidity: Duration.days(400),
      },
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

  testDeprecated('email transmission settings are recognized correctly', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      emailSettings: {
        from: 'from@myawesomeapp.com',
        replyTo: 'replyTo@myawesomeapp.com',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      EmailConfiguration: {
        From: 'from@myawesomeapp.com',
        ReplyToEmailAddress: 'replyTo@myawesomeapp.com',
      },
    });
  });

  test('addClient', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const userpool = new UserPool(stack, 'Pool');
    userpool.addClient('UserPoolClient', {
      userPoolClientName: 'userpoolclient',
    });
    const imported = UserPool.fromUserPoolId(stack, 'imported', 'imported-userpool-id');
    imported.addClient('UserPoolImportedClient', {
      userPoolClientName: 'userpoolimportedclient',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'userpoolclient',
      UserPoolId: stack.resolve(userpool.userPoolId),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolClient', {
      ClientName: 'userpoolimportedclient',
      UserPoolId: stack.resolve(imported.userPoolId),
    });
  });

  test('addResourceServer', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const userpool = new UserPool(stack, 'Pool');
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
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolResourceServer', {
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
    const stack = new Stack();

    // WHEN
    const userpool = new UserPool(stack, 'Pool');
    userpool.addDomain('UserPoolDomain', {
      cognitoDomain: {
        domainPrefix: 'userpooldomain',
      },
    });
    const imported = UserPool.fromUserPoolId(stack, 'imported', 'imported-userpool-id');
    imported.addDomain('UserPoolImportedDomain', {
      cognitoDomain: {
        domainPrefix: 'userpoolimporteddomain',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolDomain', {
      Domain: 'userpooldomain',
      UserPoolId: stack.resolve(userpool.userPoolId),
    });
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPoolDomain', {
      Domain: 'userpoolimporteddomain',
      UserPoolId: stack.resolve(imported.userPoolId),
    });
  });

  test('registered identity providers', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new UserPool(stack, 'pool');
    const provider1 = UserPoolIdentityProvider.fromProviderName(stack, 'provider1', 'provider1');
    const provider2 = UserPoolIdentityProvider.fromProviderName(stack, 'provider2', 'provider2');

    // WHEN
    userPool.registerIdentityProvider(provider1);
    userPool.registerIdentityProvider(provider2);

    // THEN
    expect(userPool.identityProviders).toEqual([provider1, provider2]);
  });

  describe('AccountRecoverySetting should be configured correctly', () => {
    test('EMAIL_AND_PHONE_WITHOUT_MFA', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', { accountRecovery: AccountRecovery.EMAIL_AND_PHONE_WITHOUT_MFA });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', { accountRecovery: AccountRecovery.PHONE_WITHOUT_MFA_AND_EMAIL });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', { accountRecovery: AccountRecovery.EMAIL_ONLY });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            { Name: 'verified_email', Priority: 1 },
          ],
        },
      });
    });

    test('PHONE_ONLY_WITHOUT_MFA', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', { accountRecovery: AccountRecovery.PHONE_ONLY_WITHOUT_MFA });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            { Name: 'verified_phone_number', Priority: 1 },
          ],
        },
      });
    });

    test('NONE', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', { accountRecovery: AccountRecovery.NONE });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            { Name: 'admin_only', Priority: 1 },
          ],
        },
      });
    });

    test('PHONE_AND_EMAIL', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', { accountRecovery: AccountRecovery.PHONE_AND_EMAIL });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        AccountRecoverySetting: Match.absent(),
      });
    });

    test('default', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool');

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        SmsConfiguration: Match.absent(),
      });
    });

    test('smsRole and smsExternalId is set', () => {
      // GIVEN
      const stack = new Stack();
      const smsRole = new Role(stack, 'smsRole', {
        assumedBy: new ServicePrincipal('service.amazonaws.com'),
      });

      // WHEN
      new UserPool(stack, 'pool', {
        smsRole,
        smsRoleExternalId: 'role-external-id',
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        SmsConfiguration: {
          ExternalId: 'role-external-id',
          SnsCallerArn: { 'Fn::GetAtt': ['smsRoleA4587CE8', 'Arn'] },
        },
      });
    });

    test('setting enableSmsRole creates an sms role', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', {
        enableSmsRole: true,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        SmsConfiguration: {
          ExternalId: 'pool',
          SnsCallerArn: { 'Fn::GetAtt': ['poolsmsRole04048F13', 'Arn'] },
        },
      });
      Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', {
        mfa: Mfa.OFF,
        signInAliases: {
          phone: false,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        SmsConfiguration: Match.absent(),
      });
    });

    test('auto sms role is not created when OTP-based MFA is enabled and phoneVerification is off', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', {
        mfa: Mfa.REQUIRED,
        mfaSecondFactor: {
          otp: true,
          sms: false,
        },
        signInAliases: {
          phone: false,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        SmsConfiguration: Match.absent(),
      });
    });

    test('auto sms role is created when phone verification is turned on', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', {
        mfa: Mfa.OFF,
        signInAliases: { phone: true },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        SmsConfiguration: {
          ExternalId: 'pool',
          SnsCallerArn: { 'Fn::GetAtt': ['poolsmsRole04048F13', 'Arn'] },
        },
      });
    });

    test('auto sms role is created when phone auto-verification is set', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', {
        mfa: Mfa.OFF,
        signInAliases: { phone: false },
        autoVerify: { phone: true },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        SmsConfiguration: {
          ExternalId: 'pool',
          SnsCallerArn: { 'Fn::GetAtt': ['poolsmsRole04048F13', 'Arn'] },
        },
      });
    });

    test('auto sms role is created when MFA is turned on', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', {
        mfa: Mfa.REQUIRED,
        mfaSecondFactor: {
          sms: true,
          otp: false,
        },
        signInAliases: {
          phone: false,
        },
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        SmsConfiguration: {
          ExternalId: 'pool',
          SnsCallerArn: { 'Fn::GetAtt': ['poolsmsRole04048F13', 'Arn'] },
        },
      });
    });

    test('auto sms role is not created when enableSmsRole is unset, even when MFA is configured', () => {
      // GIVEN
      const stack = new Stack();

      // WHEN
      new UserPool(stack, 'pool', {
        mfa: Mfa.REQUIRED,
        mfaSecondFactor: {
          sms: true,
          otp: false,
        },
        enableSmsRole: false,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
        SmsConfiguration: Match.absent(),
      });
    });

    test('throws an error when smsRole is specified but enableSmsRole is unset', () => {
      const stack = new Stack();
      const smsRole = new Role(stack, 'smsRole', {
        assumedBy: new ServicePrincipal('service.amazonaws.com'),
      });

      expect(() => new UserPool(stack, 'pool', {
        smsRole,
        enableSmsRole: false,
      })).toThrow(/enableSmsRole cannot be disabled/);
    });
  });

  testDeprecated('email transmission with cyrillic characters are encoded', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      emailSettings: {
        from: 'от@домен.рф',
        replyTo: 'ответить@домен.рф',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      EmailConfiguration: {
        From: 'от@xn--d1acufc.xn--p1ai',
        ReplyToEmailAddress: 'ответить@xn--d1acufc.xn--p1ai',
      },
    });
  });

  test('email transmission with cyrillic characters in the domain are encoded', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
        sesRegion: 'us-east-1',
        fromEmail: 'user@домен.рф',
        replyTo: 'user@домен.рф',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      EmailConfiguration: {
        From: 'user@xn--d1acufc.xn--p1ai',
        ReplyToEmailAddress: 'user@xn--d1acufc.xn--p1ai',
      },
    });
  });

  test('email transmission with cyrillic characters in the local part throw error', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    expect(() => new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
        sesRegion: 'us-east-1',
        fromEmail: 'от@домен.рф',
        replyTo: 'user@домен.рф',
      }),
    })).toThrow(/the local part of the email address must use ASCII characters only/);
  });

  test('email transmission with cyrillic characters in the local part of replyTo throw error', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    expect(() => new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
        sesRegion: 'us-east-1',
        fromEmail: 'user@домен.рф',
        replyTo: 'от@домен.рф',
      }),
    })).toThrow(/the local part of the email address must use ASCII characters only/);
  });

  test('email withCognito transmission with cyrillic characters in the local part of replyTo throw error', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    expect(() => new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withCognito('от@домен.рф'),
    })).toThrow(/the local part of the email address must use ASCII characters only/);
  });

  test('email withCognito', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withCognito(),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      EmailConfiguration: {
        EmailSendingAccount: 'COGNITO_DEFAULT',
      },
    });
  });

  test('email withCognito and replyTo', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withCognito('reply@example.com'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
      EmailConfiguration: {
        EmailSendingAccount: 'COGNITO_DEFAULT',
        ReplyToEmailAddress: 'reply@example.com',
      },
    });
  });

  test('email withSES with custom email and no region', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    expect(() => new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
        fromEmail: 'mycustomemail@example.com',
        replyTo: 'reply@example.com',
      }),
    })).toThrow(/Your stack region cannot be determined/);

  });

  test('email withSES with no name', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        region: 'us-east-1',
        account: '11111111111',
      },
    });

    // WHEN
    new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
        fromEmail: 'mycustomemail@example.com',
        replyTo: 'reply@example.com',
        configurationSetName: 'default',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack(undefined, undefined, {
      env: {
        region: 'us-east-1',
        account: '11111111111',
      },
    });

    // WHEN
    new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
        fromEmail: 'mycustomemail@example.com',
        fromName: 'My Custom Email',
        replyTo: 'reply@example.com',
        configurationSetName: 'default',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack(undefined, undefined, {
      env: {
        region: 'us-east-1',
        account: '11111111111',
      },
    });

    // WHEN
    new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
        fromEmail: 'mycustomemail@example.com',
        fromName: '"My Custom Email"',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack(undefined, undefined, {
      env: {
        region: 'us-east-1',
        account: '11111111111',
      },
    });

    // WHEN
    new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
        fromEmail: 'mycustomemail@example.com',
        fromName: 'mycustomname@example.com',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack(undefined, undefined, {
      env: {
        region: 'us-east-1',
        account: '11111111111',
      },
    });

    // WHEN
    new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
        fromEmail: 'mycustomemail@example.com',
        fromName: 'Foo "Bar" \\Baz',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack(undefined, undefined, {
      env: {
        region: 'us-east-1',
        account: '11111111111',
      },
    });

    // WHEN
    new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
        fromEmail: 'mycustomemail@example.com',
        fromName: 'あいう',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack(undefined, undefined, {
      env: {
        region: 'us-east-2',
        account: '11111111111',
      },
    });

    // WHEN
    new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
        fromEmail: 'mycustomemail@example.com',
        fromName: 'My Custom Email',
        sesRegion: 'us-east-1',
        replyTo: 'reply@example.com',
        configurationSetName: 'default',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack(undefined, undefined, {
      env: {
        region: 'us-east-2',
        account: '11111111111',
      },
    });

    // WHEN
    new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
        fromEmail: 'mycustomemail@example.com',
        fromName: 'My Custom Email',
        sesRegion: 'us-east-1',
        replyTo: 'reply@example.com',
        configurationSetName: 'default',
        sesVerifiedDomain: 'example.com',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
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
    const stack = new Stack(undefined, undefined, {
      env: {
        region: 'us-east-2',
        account: '11111111111',
      },
    });

    expect(() => new UserPool(stack, 'Pool1', {
      mfaMessage: '{####',
    })).toThrow(/MFA message must contain the template string/);

    // WHEN
    expect(() => new UserPool(stack, 'Pool', {
      email: UserPoolEmail.withSES({
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
  const stack = new Stack();

  // WHEN
  new UserPool(stack, 'Pool', {
    deviceTracking: {
      challengeRequiredOnNewDevice: true,
      deviceOnlyRememberedOnUserPrompt: true,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
    DeviceConfiguration: {
      ChallengeRequiredOnNewDevice: true,
      DeviceOnlyRememberedOnUserPrompt: true,
    },
  });
});

test('keep original attrs is configured correctly', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new UserPool(stack, 'Pool', {
    signInAliases: { username: true },
    autoVerify: { email: true, phone: true },
    keepOriginal: {
      email: true,
      phone: true,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
    UserAttributeUpdateSettings: {
      AttributesRequireVerificationBeforeUpdate: ['email', 'phone_number'],
    },
  });
});

test('grant', () => {
  // GIVEN
  const stack = new Stack();
  const role = new Role(stack, 'Role', {
    assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
  });

  // WHEN
  const userPool = new UserPool(stack, 'Pool');
  userPool.grant(role, 'cognito-idp:AdminCreateUser', 'cognito-idp:ListUsers');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
  const stack = new Stack();

  // WHEN
  new UserPool(stack, 'Pool', {
    deletionProtection: true,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
    DeletionProtection: 'ACTIVE',
  });
});

test.each(
  [
    [AdvancedSecurityMode.ENFORCED, 'ENFORCED'],
    [AdvancedSecurityMode.AUDIT, 'AUDIT'],
    [AdvancedSecurityMode.OFF, 'OFF'],
  ])('advanced security is configured correctly when set to (%s)', (advancedSecurityMode, compareString) => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new UserPool(stack, 'Pool', {
    advancedSecurityMode: advancedSecurityMode,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
    UserPoolAddOns: {
      AdvancedSecurityMode: compareString,
    },
  });
});

test('advanced security is not present if option is not provided', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new UserPool(stack, 'Pool', {});

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Cognito::UserPool', {
    UserPoolAddOns: Match.absent(),
  });
});

function fooFunction(scope: Construct, name: string): lambda.IFunction {
  return new lambda.Function(scope, name, {
    functionName: name,
    code: lambda.Code.fromInline('foo'),
    runtime: lambda.Runtime.NODEJS_14_X,
    handler: 'index.handler',
  });
}

function fooKey(scope: Construct, name: string): kms.Key {
  return new kms.Key(scope, name);
}
