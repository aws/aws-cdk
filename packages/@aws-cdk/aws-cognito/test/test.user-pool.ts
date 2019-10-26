import { expect, haveResourceLike } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import { Test } from 'nodeunit';
import cognito = require('../lib');

export = {
  'default setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new cognito.UserPool(stack, 'Pool', {
      userPoolName: 'myPool',
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::Cognito::UserPool', {
      UserPoolName: 'myPool'
    }));

    test.done();
  },

  'lambda triggers are defined'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    // WHEN
    const pool = new cognito.UserPool(stack, 'Pool', {
      lambdaTriggers: {
        preSignUp: fn
      }
    });
    pool.addCustomMessageTrigger(fn);

    // THEN
    expect(stack).to(haveResourceLike('AWS::Cognito::UserPool', {
      LambdaConfig: {
        PreSignUp: stack.resolve(fn.functionArn),
        CustomMessage: stack.resolve(fn.functionArn)
      }
    }));

    test.done();
  },

  'on* API correctly appends triggers'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    const createAuthChallengeLambdaFn = new lambda.Function(stack, 'createAuthChallengeLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    const customMessageLambdaFn = new lambda.Function(stack, 'customMessageLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    const defineAuthChallengeLambdaFn = new lambda.Function(stack, 'defineAuthChallengeLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    const postAuthenticationLambdaFn = new lambda.Function(stack, 'postAuthenticationLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    const postConfirmationLambdaFn = new lambda.Function(stack, 'postConfirmationLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    const preAuthenticationLambdaFn = new lambda.Function(stack, 'preAuthenticationLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    const preSignUpLambdaFn = new lambda.Function(stack, 'preSignUpLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    const preTokenGenerationLambdaFn = new lambda.Function(stack, 'preTokenGenerationLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    const userMigrationLambdaFn = new lambda.Function(stack, 'userMigrationLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    const verifyAuthChallengeResponseLambdaFn = new lambda.Function(stack, 'verifyAuthChallengeResponseLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    // WHEN
    const pool = new cognito.UserPool(stack, 'Pool', { });
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
    expect(stack).to(haveResourceLike('AWS::Cognito::UserPool', {
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
    }));

    test.done();
  },

  'lambdas are given cognito service grant'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_LATEST,
    });

    // WHEN
    new cognito.UserPool(stack, 'Pool', {
      lambdaTriggers: {
        preSignUp: fn
      }
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::Lambda::Permission', {
      FunctionName: stack.resolve(fn.functionArn),
      Principal: 'cognito-idp.amazonaws.com'
    }));

    test.done();
  },

  'set sign in type'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new cognito.UserPool(stack, 'Pool', {
      signInType: cognito.SignInType.EMAIL,
      autoVerifiedAttributes: [cognito.UserPoolAttribute.EMAIL]
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::Cognito::UserPool', {
      UsernameAttributes: ['email'],
      AutoVerifiedAttributes: ['email']
    }));

    test.done();
  },

  'usernameAliasAttributes require signInType of USERNAME'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const toThrow = () => {
      new cognito.UserPool(stack, 'Pool', {
        signInType: cognito.SignInType.EMAIL,
        usernameAliasAttributes: [cognito.UserPoolAttribute.PREFERRED_USERNAME]
      });
    };

    // THEN
    test.throws(() => toThrow(), /'usernameAliasAttributes' can only be set with a signInType of 'USERNAME'/);
    test.done();
  },

  'usernameAliasAttributes must be one or more of EMAIL, PHONE_NUMBER, or PREFERRED_USERNAME'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const toThrow = () => {
      new cognito.UserPool(stack, 'Pool', {
        signInType: cognito.SignInType.USERNAME,
        usernameAliasAttributes: [cognito.UserPoolAttribute.GIVEN_NAME]
      });
    };

    // THEN
    test.throws(() => toThrow(), /'usernameAliasAttributes' can only include EMAIL, PHONE_NUMBER, or PREFERRED_USERNAME/);
    test.done();
  },

  'autoVerifiedAttributes must be one or more of EMAIL or PHONE_NUMBER'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const toThrow = () => {
      new cognito.UserPool(stack, 'Pool', {
        signInType: cognito.SignInType.EMAIL,
        autoVerifiedAttributes: [cognito.UserPoolAttribute.EMAIL, cognito.UserPoolAttribute.GENDER]
      });
    };

    // THEN
    test.throws(() => toThrow(), /'autoVerifiedAttributes' can only include EMAIL or PHONE_NUMBER/);
    test.done();
  }
};
