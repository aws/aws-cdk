import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import * as targets from '@aws-cdk/aws-events-targets';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as config from '../lib';

export = {
  'create a managed rule'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.ManagedRule(stack, 'Rule', {
      description: 'really cool rule',
      identifier: 'AWS_SUPER_COOL',
      inputParameters: {
        key: 'value',
      },
      maximumExecutionFrequency: config.MaximumExecutionFrequency.THREE_HOURS,
      configRuleName: 'cool rule',
    });

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
      Source: {
        Owner: 'AWS',
        SourceIdentifier: 'AWS_SUPER_COOL',
      },
      ConfigRuleName: 'cool rule',
      Description: 'really cool rule',
      InputParameters: {
        key: 'value',
      },
      MaximumExecutionFrequency: 'Three_Hours',
    }));

    test.done();
  },

  'create a custom rule'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.AssetCode.fromInline('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    new config.CustomRule(stack, 'Rule', {
      configurationChanges: true,
      description: 'really cool rule',
      inputParameters: {
        key: 'value',
      },
      lambdaFunction: fn,
      maximumExecutionFrequency: config.MaximumExecutionFrequency.SIX_HOURS,
      configRuleName: 'cool rule',
      periodic: true,
    });

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
      Properties: {
        Source: {
          Owner: 'CUSTOM_LAMBDA',
          SourceDetails: [
            {
              EventSource: 'aws.config',
              MessageType: 'ConfigurationItemChangeNotification',
            },
            {
              EventSource: 'aws.config',
              MessageType: 'OversizedConfigurationItemChangeNotification',
            },
            {
              EventSource: 'aws.config',
              MaximumExecutionFrequency: 'Six_Hours',
              MessageType: 'ScheduledNotification',
            },
          ],
          SourceIdentifier: {
            'Fn::GetAtt': [
              'Function76856677',
              'Arn',
            ],
          },
        },
        ConfigRuleName: 'cool rule',
        Description: 'really cool rule',
        InputParameters: {
          key: 'value',
        },
        MaximumExecutionFrequency: 'Six_Hours',
      },
      DependsOn: [
        'FunctionPermissionEC8FE997',
        'Function76856677',
        'FunctionServiceRole675BB04A',
      ],
    }, ResourcePart.CompleteDefinition));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      Principal: 'config.amazonaws.com',
    }));

    expect(stack).to(haveResource('AWS::IAM::Role', {
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
            ],
          ],
        },
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition',
              },
              ':iam::aws:policy/service-role/AWSConfigRulesExecutionRole',
            ],
          ],
        },
      ],
    }));

    test.done();
  },

  'scope to resource'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.ManagedRule(stack, 'Rule', {
      identifier: 'AWS_SUPER_COOL',
      ruleScope: config.RuleScope.fromResource(config.ResourceType.EC2_INSTANCE, 'i-1234'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
      Scope: {
        ComplianceResourceId: 'i-1234',
        ComplianceResourceTypes: [
          'AWS::EC2::Instance',
        ],
      },
    }));

    test.done();
  },

  'scope to resources'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.ManagedRule(stack, 'Rule', {
      identifier: 'AWS_SUPER_COOL',
      ruleScope: config.RuleScope.fromResources([config.ResourceType.S3_BUCKET, config.ResourceType.CLOUDFORMATION_STACK]),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
      Scope: {
        ComplianceResourceTypes: [
          'AWS::S3::Bucket',
          'AWS::CloudFormation::Stack',
        ],
      },
    }));

    test.done();
  },

  'scope to tag'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.ManagedRule(stack, 'Rule', {
      identifier: 'RULE',
      ruleScope: config.RuleScope.fromTag('key', 'value'),
    });

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
      Scope: {
        TagKey: 'key',
        TagValue: 'value',
      },
    }));

    test.done();
  },

  'allows scoping a custom rule without configurationChanges enabled'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.AssetCode.fromInline('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // THEN
    test.doesNotThrow(() => new config.CustomRule(stack, 'Rule', {
      lambdaFunction: fn,
      periodic: true,
      ruleScope: config.RuleScope.fromResources([config.ResourceType.of('resource')]),
    }));

    test.done();
  },

  'throws when both configurationChanges and periodic are falsy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.AssetCode.fromInline('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // THEN
    test.throws(() => new config.CustomRule(stack, 'Rule', {
      lambdaFunction: fn,
    }), /`configurationChanges`.*`periodic`/);

    test.done();
  },

  'on compliance change event'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const rule = new config.ManagedRule(stack, 'Rule', {
      identifier: 'RULE',
    });

    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.fromInline('dummy'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_10_X,
    });

    // WHEN
    rule.onComplianceChange('ComplianceChange', {
      target: new targets.LambdaFunction(fn),
    });

    expect(stack).to(haveResource('AWS::Events::Rule', {
      EventPattern: {
        'source': [
          'aws.config',
        ],
        'detail': {
          configRuleName: [
            {
              Ref: 'Rule4C995B7F',
            },
          ],
        },
        'detail-type': [
          'Config Rules Compliance Change',
        ],
      },
    }));

    test.done();
  },
};
