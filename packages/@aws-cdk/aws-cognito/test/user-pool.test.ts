import '@aws-cdk/assert/jest';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack, Tag } from '@aws-cdk/core';
import { SignInType, UserPool, UserPoolAttribute } from '../lib';

describe('User Pool', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    new UserPool(stack, 'Pool', {
      userPoolName: 'myPool',
    });

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UserPoolName: 'myPool'
    });
  });

  test('support tags', () => {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const pool = new UserPool(stack, 'Pool', {
      userPoolName: 'myPool',
    });
    Tag.add(pool, "PoolTag", "PoolParty");

    // THEN
    expect(stack).toHaveResourceLike('AWS::Cognito::UserPool', {
      UserPoolName: 'myPool',
      UserPoolTags: {
        PoolTag: "PoolParty",
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