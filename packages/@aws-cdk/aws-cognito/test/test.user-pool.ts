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
      runtime: lambda.Runtime.NODEJS_8_10,
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
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_8_10,
    });

    // WHEN
    const pool = new cognito.UserPool(stack, 'Pool', { });
    pool.addCreateAuthChallengeTrigger(fn);
    pool.addCustomMessageTrigger(fn);
    pool.addDefineAuthChallengeTrigger(fn);
    pool.addPostAuthenticationTrigger(fn);
    pool.addPostConfirmationTrigger(fn);
    pool.addPreAuthenticationTrigger(fn);
    pool.addPreSignUpTrigger(fn);
    pool.addVerifyAuthChallengeResponseTrigger(fn);
    pool.addPreTokenGenerationTrigger(fn);

    // THEN
    expect(stack).to(haveResourceLike('AWS::Cognito::UserPool', {
      LambdaConfig: {
        CreateAuthChallenge: stack.resolve(fn.functionArn),
        CustomMessage: stack.resolve(fn.functionArn),
        DefineAuthChallenge: stack.resolve(fn.functionArn),
        PostAuthentication: stack.resolve(fn.functionArn),
        PostConfirmation: stack.resolve(fn.functionArn),
        PreAuthentication: stack.resolve(fn.functionArn),
        PreSignUp: stack.resolve(fn.functionArn),
        VerifyAuthChallengeResponse: stack.resolve(fn.functionArn),
        PreTokenGeneration: stack.resolve(fn.functionArn)
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
      runtime: lambda.Runtime.NODEJS_8_10,
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
