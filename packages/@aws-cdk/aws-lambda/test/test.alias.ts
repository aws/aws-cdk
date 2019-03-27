import cloudwatch = require('@aws-cdk/aws-cloudwatch');

import { beASupersetOfTemplate, expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import lambda = require('../lib');

export = {
  'version and aliases'(test: Test): void {
    const stack = new Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NodeJS610,
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
          FunctionVersion: stack.node.resolve(version.functionVersion),
          Name: "prod"
        }
        }
    }));

    test.done();
  },

  'can add additional versions to alias'(test: Test) {
    const stack = new Stack();

    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('hello()'),
      handler: 'index.hello',
      runtime: lambda.Runtime.NodeJS610,
    });

    const version1 = fn.addVersion('1');
    const version2 = fn.addVersion('2');

    new lambda.Alias(stack, 'Alias', {
      aliasName: 'prod',
      version: version1,
      additionalVersions: [{ version: version2, weight: 0.1 }]
    });

    expect(stack).to(haveResource('AWS::Lambda::Alias', {
      FunctionVersion: stack.node.resolve(version1.functionVersion),
      RoutingConfig: {
        AdditionalVersionWeights: [
          {
          FunctionVersion: stack.node.resolve(version2.functionVersion),
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
      runtime: lambda.Runtime.NodeJS610,
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
      runtime: lambda.Runtime.NodeJS610,
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
          Ref: "Alias325C5727"
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
      runtime: lambda.Runtime.NodeJS610,
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
      runtime: lambda.Runtime.NodeJS610,
    });

    const version = fn.addVersion('1');
    const alias = new lambda.Alias(stack, 'Alias', { aliasName: 'prod', version });

    // WHEN
    test.deepEqual(stack.node.resolve(alias.functionName), {
      "Fn::Join": [
        "",
        [
          {
            Ref: "MyLambdaCCE802FB"
          },
          ":",
          {
            "Fn::Select": [
              7,
              {
                "Fn::Split": [
                  ":",
                  {
                    Ref: "Alias325C5727"
                  }
                ]
              }
            ]
          }
        ]
      ]
    });

    test.done();
  }
};
