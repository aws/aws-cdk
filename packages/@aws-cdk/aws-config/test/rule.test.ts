import { Template } from '@aws-cdk/assertions';
import * as targets from '@aws-cdk/aws-events-targets';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as config from '../lib';

describe('rule', () => {
  test('create a managed rule', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::Config::ConfigRule', {
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
    });
  });

  test('create a custom rule', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.AssetCode.fromInline('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
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
    Template.fromStack(stack).hasResource('AWS::Config::ConfigRule', {
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
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
      Principal: 'config.amazonaws.com',
      SourceAccount: {
        Ref: 'AWS::AccountId',
      },
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
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
    });
  });

  test('scope to resource', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.ManagedRule(stack, 'Rule', {
      identifier: 'AWS_SUPER_COOL',
      ruleScope: config.RuleScope.fromResource(config.ResourceType.EC2_INSTANCE, 'i-1234'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Config::ConfigRule', {
      Scope: {
        ComplianceResourceId: 'i-1234',
        ComplianceResourceTypes: [
          'AWS::EC2::Instance',
        ],
      },
    });
  });

  test('scope to resources', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.ManagedRule(stack, 'Rule', {
      identifier: 'AWS_SUPER_COOL',
      ruleScope: config.RuleScope.fromResources([config.ResourceType.S3_BUCKET, config.ResourceType.CLOUDFORMATION_STACK]),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Config::ConfigRule', {
      Scope: {
        ComplianceResourceTypes: [
          'AWS::S3::Bucket',
          'AWS::CloudFormation::Stack',
        ],
      },
    });
  }),

  test('scope to tag', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.ManagedRule(stack, 'Rule', {
      identifier: 'RULE',
      ruleScope: config.RuleScope.fromTag('key', 'value'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Config::ConfigRule', {
      Scope: {
        TagKey: 'key',
        TagValue: 'value',
      },
    });
  }),

  test('allows scoping a custom rule without configurationChanges enabled', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.AssetCode.fromInline('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    // THEN
    expect(() => new config.CustomRule(stack, 'Rule', {
      lambdaFunction: fn,
      periodic: true,
      ruleScope: config.RuleScope.fromResources([config.ResourceType.of('resource')]),
    })).not.toThrow();
  }),

  test('throws when both configurationChanges and periodic are falsy', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.AssetCode.fromInline('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    // THEN
    expect(() => new config.CustomRule(stack, 'Rule', {
      lambdaFunction: fn,
    })).toThrow(/`configurationChanges`.*`periodic`/);
  }),

  test('on compliance change event', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const rule = new config.ManagedRule(stack, 'Rule', {
      identifier: 'RULE',
    });

    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.fromInline('dummy'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NODEJS_14_X,
    });

    // WHEN
    rule.onComplianceChange('ComplianceChange', {
      target: new targets.LambdaFunction(fn),
    });

    Template.fromStack(stack).hasResourceProperties('AWS::Events::Rule', {
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
    });
  });

  test('Add EKS Cluster check to ManagedRule', () => {
    // GIVEN
    const stack1 = new cdk.Stack();
    const stack2 = new cdk.Stack();

    // WHEN
    new config.ManagedRule(stack1, 'RuleEksClusterOldest', {
      identifier: config.ManagedRuleIdentifiers.EKS_CLUSTER_OLDEST_SUPPORTED_VERSION,
      ruleScope: config.RuleScope.fromResource(config.ResourceType.EKS_CLUSTER),
    });
    new config.ManagedRule(stack2, 'RuleEksClusterVersion', {
      identifier: config.ManagedRuleIdentifiers.EKS_CLUSTER_SUPPORTED_VERSION,
      ruleScope: config.RuleScope.fromResources([config.ResourceType.EKS_CLUSTER]),
    });

    // THEN
    Template.fromStack(stack1).hasResourceProperties('AWS::Config::ConfigRule', {
      Source: {
        SourceIdentifier: 'EKS_CLUSTER_OLDEST_SUPPORTED_VERSION',
      },
      Scope: {
        ComplianceResourceTypes: ['AWS::EKS::Cluster'],
      },
    });
    Template.fromStack(stack2).hasResourceProperties('AWS::Config::ConfigRule', {
      Source: {
        SourceIdentifier: 'EKS_CLUSTER_SUPPORTED_VERSION',
      },
      Scope: {
        ComplianceResourceTypes: ['AWS::EKS::Cluster'],
      },
    });
  });
});
