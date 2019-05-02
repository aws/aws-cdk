import { expect, haveResource, ResourcePart } from '@aws-cdk/assert';
import targets = require('@aws-cdk/aws-events-targets');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import config = require('../lib');

export = {
  'create a managed rule'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.ManagedRule(stack, 'Rule', {
      description: 'really cool rule',
      identifier: 'AWS_SUPER_COOL',
      inputParameters: {
        key: 'value'
      },
      maximumExecutionFrequency: config.MaximumExecutionFrequency.THREE_HOURS,
      name: 'cool rule'
    });

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
      Source: {
        Owner: 'AWS',
        SourceIdentifier: 'AWS_SUPER_COOL'
      },
      ConfigRuleName: 'cool rule',
      Description: 'really cool rule',
      InputParameters: {
        key: 'value'
      },
      MaximumExecutionFrequency: 'Three_Hours'
    }));

    test.done();
  },

  'create a custom rule'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.AssetCode.inline('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810
    });

    // WHEN
    new config.CustomRule(stack, 'Rule', {
      configurationChanges: true,
      description: 'really cool rule',
      inputParameters: {
        key: 'value'
      },
      lambdaFunction: fn,
      maximumExecutionFrequency: config.MaximumExecutionFrequency.SIX_HOURS,
      name: 'cool rule',
      periodic: true
    });

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
      Properties: {
        Source: {
          Owner: 'CUSTOM_LAMBDA',
          SourceDetails: [
            {
              EventSource: 'aws.config',
              MessageType: 'ConfigurationItemChangeNotification'
            },
            {
              EventSource: 'aws.config',
              MessageType: 'OversizedConfigurationItemChangeNotification'
            },
            {
              EventSource: 'aws.config',
              MaximumExecutionFrequency: 'Six_Hours',
              MessageType: 'ScheduledNotification'
            }
          ],
          SourceIdentifier: {
            'Fn::GetAtt': [
              'Function76856677',
              'Arn'
            ]
          }
        },
        ConfigRuleName: 'cool rule',
        Description: 'really cool rule',
        InputParameters: {
          key: 'value'
        },
        MaximumExecutionFrequency: 'Six_Hours'
      },
      DependsOn: [
        'FunctionPermissionEC8FE997',
        'Function76856677',
        'FunctionServiceRole675BB04A'
      ]
    }, ResourcePart.CompleteDefinition));

    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      Principal: 'config.amazonaws.com'
    }));

    expect(stack).to(haveResource('AWS::IAM::Role', {
      ManagedPolicyArns: [
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition'
              },
              ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
            ]
          ]
        },
        {
          'Fn::Join': [
            '',
            [
              'arn:',
              {
                Ref: 'AWS::Partition'
              },
              ':iam::aws:policy/service-role/AWSConfigRulesExecutionRole'
            ]
          ]
        }
      ]
    }));

    test.done();
  },

  'add resource scope'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const rule = new config.ManagedRule(stack, 'Rule', {
      identifier: 'AWS_SUPER_COOL'
    });

    // WHEN
    rule.addResourceScope('AWS::EC2::Instance', 'i-1234');

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
      Scope: {
        ComplianceResourceId: 'i-1234',
        ComplianceResourceTypes: [
          'AWS::EC2::Instance'
        ]
      }
    }));

    test.done();
  },

  'add resources scope'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const rule = new config.ManagedRule(stack, 'Rule', {
      identifier: 'AWS_SUPER_COOL'
    });

    // WHEN
    rule.addResourcesScope('AWS::S3::Bucket', 'AWS::CloudFormation::Stack');

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
      Scope: {
        ComplianceResourceTypes: [
          'AWS::S3::Bucket',
          'AWS::CloudFormation::Stack'
        ]
      }
    }));

    test.done();
  },

  'add tag scope'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const rule = new config.ManagedRule(stack, 'Rule', {
      identifier: 'RULE'
    });

    // WHEN
    rule.addTagScope('key', 'value');

    // THEN
    expect(stack).to(haveResource('AWS::Config::ConfigRule', {
      Scope: {
        TagKey: 'key',
        TagValue: 'value'
      }
    }));

    test.done();
  },

  'throws when adding scope to custom rule without configuration changes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.AssetCode.inline('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810
    });

    // WHEN
    const rule = new config.CustomRule(stack, 'Rule', {
      lambdaFunction: fn,
      periodic: true
    });

    // THEN
    test.throws(() => rule.addResourceScope('resource'), /`configurationChanges`/);

    test.done();
  },

  'throws when both configurationChanges and periodic are falsy'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.AssetCode.inline('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810
    });

    // THEN
    test.throws(() => new config.CustomRule(stack, 'Rule', {
      lambdaFunction: fn
    }), /`configurationChanges`.*`periodic`/);

    test.done();
  },

  'import/export'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const rule = new config.ManagedRule(stack, 'Rule', {
      identifier: 'RULE'
    });

    // WHEN
    const exportedRule = rule.export();

    const importedRule = config.ManagedRule.fromRuleName(stack, 'ImportedRule', 'name');

    // THEN
    test.deepEqual(stack.node.resolve(exportedRule), {
      ruleName: { 'Fn::ImportValue': 'Stack:RuleRuleName1741A255' }
    });
    test.deepEqual(importedRule.ruleName, 'name');

    test.done();
  },

  'on compliance change event'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const rule = new config.ManagedRule(stack, 'Rule', {
      identifier: 'RULE'
    });

    const fn = new lambda.Function(stack, 'Function', {
      code: lambda.Code.inline('dummy'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS810
    });

    // WHEN
    rule.onComplianceChange('ComplianceChange', new targets.LambdaFunction(fn));

    expect(stack).to(haveResource('AWS::Events::Rule', {
      EventPattern: {
        'source': [
          'aws.config'
        ],
        'detail': {
          configRuleName: [
            {
              Ref: 'Rule4C995B7F'
            }
          ]
        },
        'detail-type': [
          'Config Rules Compliance Change'
        ]
      }
    }));

    test.done();
  }
};
