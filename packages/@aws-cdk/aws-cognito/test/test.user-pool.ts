import { expect, haveResourceLike } from '@aws-cdk/assert';
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import cognito = require('../lib');

export = {
  'default setup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new cognito.UserPool(stack, 'Pool', {
      poolName: 'myPool'
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
      runtime: lambda.Runtime.NodeJS610,
    });

    // WHEN
    const pool = new cognito.UserPool(stack, 'Pool', {
      lambdaTriggers: {
        preSignUp: fn
      }
    });
    pool.onCustomMessage(fn);

    // THEN
    expect(stack).to(haveResourceLike('AWS::Cognito::UserPool', {
      LambdaConfig: {
        PreSignUp: fn.node.resolve(fn.functionArn),
        CustomMessage: fn.node.resolve(fn.functionArn)
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
      runtime: lambda.Runtime.NodeJS610,
    });

    // WHEN
    const pool = new cognito.UserPool(stack, 'Pool', { });
    pool.onCreateAuthChallenge(fn);
    pool.onCustomMessage(fn);
    pool.onDefineAuthChallenge(fn);
    pool.onPostAuthentication(fn);
    pool.onPostConfirmation(fn);
    pool.onPreAuthentication(fn);
    pool.onPreSignUp(fn);
    pool.onVerifyAuthChallengeResponse(fn);

    // THEN
    expect(stack).to(haveResourceLike('AWS::Cognito::UserPool', {
      LambdaConfig: {
        CreateAuthChallenge: fn.node.resolve(fn.functionArn),
        CustomMessage: fn.node.resolve(fn.functionArn),
        DefineAuthChallenge: fn.node.resolve(fn.functionArn),
        PostAuthentication: fn.node.resolve(fn.functionArn),
        PostConfirmation: fn.node.resolve(fn.functionArn),
        PreAuthentication: fn.node.resolve(fn.functionArn),
        PreSignUp: fn.node.resolve(fn.functionArn),
        VerifyAuthChallengeResponse: fn.node.resolve(fn.functionArn)
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
      runtime: lambda.Runtime.NodeJS610,
    });

    // WHEN
    new cognito.UserPool(stack, 'Pool', {
      lambdaTriggers: {
        preSignUp: fn
      }
    });

    // THEN
    expect(stack).to(haveResourceLike('AWS::Lambda::Permission', {
      FunctionName: fn.node.resolve(fn.functionArn),
      Principal: 'cognito-idp.amazonaws.com'
    }));

    test.done();
  },

  'set sign in type'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new cognito.UserPool(stack, 'Pool', {
      signInType: cognito.SignInType.Email,
      autoVerifiedAttributes: [cognito.UserPoolAttribute.Email]
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
        signInType: cognito.SignInType.Email,
        usernameAliasAttributes: [cognito.UserPoolAttribute.PreferredUsername]
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
        signInType: cognito.SignInType.Username,
        usernameAliasAttributes: [cognito.UserPoolAttribute.GivenName]
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
        signInType: cognito.SignInType.Email,
        autoVerifiedAttributes: [cognito.UserPoolAttribute.Email, cognito.UserPoolAttribute.Gender]
      });
    };

    // THEN
    test.throws(() => toThrow(), /'autoVerifiedAttributes' can only include EMAIL or PHONE_NUMBER/);
    test.done();
  }
};