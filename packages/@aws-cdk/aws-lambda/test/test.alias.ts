import { beASupersetOfTemplate, expect, haveResource, haveResourceLike } from '@aws-cdk/assert';
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import lambda = require('../lib');

export = {
  'version and aliases'(test: Test): void {
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1');

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
    });

    expect(stack).to(beASupersetOfTemplate({
      MyLambdaVersion16CDE3C40: {
        Type: "AWS::Lambda::Version",
        Properties: {
          FunctionName: { Ref: "MyLambdaCCE802FB" }
        }
        },
        Alias325C5727: {
        Type: "AWS::Lambda::Alias",
        Properties: {
          FunctionName: { Ref: "MyLambdaCCE802FB" },
          FunctionVersion: stack.resolve(version.version),
          Name: "prod"
        }
        }
    }));

    test.done();
  },

  'can create an alias to $LATEST'(test: Test): void {
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'latest',
      version: fn.latestVersion,
    });

    expect(stack).to(haveResource('AWS::Lambda::Alias', {
      FunctionName: { Ref: "MyLambdaCCE802FB" },
      FunctionVersion: '$LATEST',
      Name: 'latest',
    }));
    expect(stack).notTo(haveResource('AWS::Lambda::Version'));

    test.done();
  },

  'can use newVersion to create a new Version'(test: Test) {
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('NewVersion');

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
    });

    expect(stack).to(haveResourceLike('AWS::Lambda::Version', {
      FunctionName: { Ref: "MyLambdaCCE802FB" },
    }));

    expect(stack).to(haveResourceLike('AWS::Lambda::Alias', {
      FunctionName: { Ref: "MyLambdaCCE802FB" },
      Name: "prod"
    }));

    test.done();
  },

  'can add additional versions to alias'(test: Test) {
    const stack = new Stack();

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version1 = fn.addVersion('1');
    const version2 = fn.addVersion('2');

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: version1,
      additionalVersions: [{ version: version2, weight: 0.1 }]
    });

    expect(stack).to(haveResource('AWS::Lambda::Alias', {
      FunctionVersion: stack.resolve(version1.version),
      RoutingConfig: {
        AdditionalVersionWeights: [
          {
          FunctionVersion: stack.resolve(version2.version),
          FunctionWeight: 0.1
          }
        ]
        }
    }));

    test.done();
  },

  'sanity checks on version weights'(test: Test) {
    const stack = new Stack();

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1');

    // WHEN: Individual weight too high
    test.throws(() => {
      new lambda.Alias(stack, 'Alias1', {
        aliasName: 'prod', version,
        additionalVersions: [{ version, weight: 5 }]
      });
    });

    // WHEN: Sum too high
    test.throws(() => {
      new lambda.Alias(stack, 'Alias2', {
        aliasName: 'prod', version,
        additionalVersions: [{ version, weight: 0.5 }, { version, weight: 0.6 }]
      });
    });

    test.done();
  },

  'metric adds Resource: aliasArn to dimensions'(test: Test) {
    const stack = new Stack();

    // GIVEN
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1');
    const alias = new lambda.Alias(stack, 'Alias', { aliasName: 'prod', version });

    // WHEN
    new cloudwatch.Alarm(stack, 'Alarm', {
      metric: alias.metric('Test'),
      alarmName: 'Test',
      threshold: 1,
      evaluationPeriods: 1
    });

    // THEN
    expect(stack).to(haveResource('AWS::CloudWatch::Alarm', {
      Dimensions: [{
        Name: "FunctionName",
        Value: {
          Ref: "MyLambdaCCE802FB"
        }
      }, {
        Name: "Resource",
        Value: {
          'Fn::Join': [
            '',
            [
              { Ref: "MyLambdaCCE802FB" },
              ':prod'
            ]
          ]
        }
      }]
    }));

    test.done();
  },

  'alias exposes real Lambdas role'(test: Test) {
    const stack = new Stack();

    // GIVEN
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1');
    const alias = new lambda.Alias(stack, 'Alias', { aliasName: 'prod', version });

    // THEN
    test.equals(alias.role, fn.role);

    test.done();
  },

  'functionName is derived from the aliasArn so that dependencies are sound'(test: Test) {
    const stack = new Stack();

    // GIVEN
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    const version = fn.addVersion('1');
    const alias = new lambda.Alias(stack, 'Alias', { aliasName: 'prod', version });

    // WHEN
    test.deepEqual(stack.resolve(alias.functionName), {
      "Fn::Join": [
        "",
        [
          {
            "Fn::Select": [
              6,
              {
                "Fn::Split": [
                  ":",
                  {
                    Ref: "Alias325C5727"
                  }
                ]
              }
            ]
          },
          ":prod"
        ]
      ]
    });

    test.done();
  },

  'with event invoke config'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'fn', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });
    const version = fn.addVersion('1');

    // WHEN
    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version,
      onSuccess: {
        bind: () => ({
          destination: 'on-success-arn'
        })
      }
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: {
        Ref: 'fn5FF616E3'
      },
      Qualifier: {
        'Fn::Select': [
          7,
          {
            'Fn::Split': [
              ':',
              {
                Ref: 'Alias325C5727'
              }
            ]
          }
        ]
      },
      DestinationConfig: {
        OnSuccess: {
          Destination: 'on-success-arn'
        }
      }
    }));

    test.done();
  },

  'event invoke config on imported alias'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const fn = lambda.Version.fromVersionArn(stack, 'Fn', 'arn:aws:lambda:region:account-id:function:function-name:version');
    const alias = lambda.Alias.fromAliasAttributes(stack, 'Alias', { aliasName: 'alias-name', aliasVersion: fn });

    // WHEN
    alias.configureAsyncInvoke({
      retryAttempts: 1
    });

    // THEN
    expect(stack).to(haveResource('AWS::Lambda::EventInvokeConfig', {
      FunctionName: 'function-name',
      Qualifier: 'alias-name',
      MaximumRetryAttempts: 1
    }));

    test.done();
  }
};
