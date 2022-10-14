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

  test('scope to resource', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.ManagedRule(stack, 'Rule', {
      identifier: 'AWS_SUPER_COOL',
      ruleScope: config.RuleScope.fromResources([
        config.ResourceType.EC2_NETWORK_INTERFACE,
        config.ResourceType.EC2_TRANSIT_GATEWAY,
        config.ResourceType.EC2_TRANSIT_GATEWAY_ATTACHMENT,
        config.ResourceType.EC2_TRANSIT_GATEWAY_ROUTE_TABLE,
        config.ResourceType.EC2_REGISTERED_HA_INSTANCE,
        config.ResourceType.EC2_LAUNCH_TEMPLATE,
        config.ResourceType.ECR_REPOSITORY,
        config.ResourceType.ECR_PUBLIC_REPOSITORY,
        config.ResourceType.ECS_CLUSTER,
        config.ResourceType.ECS_TASK_DEFINITION,
        config.ResourceType.ECS_SERVICE,
        config.ResourceType.EFS_FILE_SYSTEM,
        config.ResourceType.EFS_ACCESS_POINT,
        config.ResourceType.EMR_SECURITY_CONFIGURATION,
        config.ResourceType.GUARDDUTY_DETECTOR,
        config.ResourceType.OPENSEARCH_DOMAIN,
        config.ResourceType.KINESIS_STREAM,
        config.ResourceType.KINESIS_STREAM_CONSUMER,
        config.ResourceType.MSK_CLUSTER,
        config.ResourceType.ROUTE53_RESOLVER_RESOLVER_ENDPOINT,
        config.ResourceType.ROUTE53_RESOLVER_RESOLVER_RULE,
        config.ResourceType.ROUTE53_RESOLVER_RESOLVER_RULE_ASSOCIATION,
        config.ResourceType.SAGEMAKER_CODE_REPOSITORY,
        config.ResourceType.SAGEMAKER_MODEL,
        config.ResourceType.SAGEMAKER_NOTEBOOK_INSTANCE,
        config.ResourceType.WORKSPACES_CONNECTION_ALIAS,
        config.ResourceType.WORKSPACES_WORKSPACE,
        config.ResourceType.BACKUP_BACKUP_PLAN,
        config.ResourceType.BACKUP_BACKUP_SELECTION,
        config.ResourceType.BACKUP_BACKUP_VAULT,
        config.ResourceType.BACKUP_RECOVERY_POINT,
        config.ResourceType.BATCH_JOB_QUEUE,
        config.ResourceType.BATCH_COMPUTE_ENVIRONMENT,
        config.ResourceType.CODEDEPLOY_APPLICATION,
        config.ResourceType.CODEDEPLOY_DEPLOYMENT_CONFIG,
        config.ResourceType.CODEDEPLOY_DEPLOYMENT_GROUP,
        config.ResourceType.CONFIG_RESOURCE_COMPLIANCE,
        config.ResourceType.CONFIG_CONFORMANCE_PACK_COMPLIANCE,
        config.ResourceType.DMS_EVENT_SUBSCRIPTION,
        config.ResourceType.DMS_REPLICATION_SUBNET_GROUP,
        config.ResourceType.GLOBALACCELERATOR_LISTENER,
        config.ResourceType.GLOBALACCELERATOR_ENDPOINT_GROUP,
        config.ResourceType.GLOBALACCELERATOR_ACCELERATOR,
        config.ResourceType.IAM_ACCESSANALYZER_ANALYZER,
        config.ResourceType.STEPFUNCTIONS_ACTIVITY,
        config.ResourceType.STEPFUNCTIONS_STATE_MACHINE,
        config.ResourceType.WAFV2_IP_SET,
        config.ResourceType.WAFV2_REGEX_PATTERN_SET,
        config.ResourceType.ELBV2_LISTENER,
      ]),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Config::ConfigRule', {
      Scope: {
        ComplianceResourceTypes: [
          'AWS::EC2::NetworkInterface',
          'AWS::EC2::TransitGateway',
          'AWS::EC2::TransitGatewayAttachment',
          'AWS::EC2::TransitGatewayRouteTable',
          'AWS::EC2::RegisteredHAInstance',
          'AWS::EC2::LaunchTemplate',
          'AWS::ECR::Repository',
          'AWS::ECR::PublicRepository',
          'AWS::ECS::Cluster',
          'AWS::ECS::TaskDefinition',
          'AWS::ECS::Service',
          'AWS::EFS::FileSystem',
          'AWS::EFS::AccessPoint',
          'AWS::EMR::SecurityConfiguration',
          'AWS::GuardDuty::Detector',
          'AWS::OpenSearch::Domain',
          'AWS::Kinesis::Stream',
          'AWS::Kinesis::StreamConsumer',
          'AWS::MSK::Cluster',
          'AWS::Route53Resolver::ResolverEndpoint',
          'AWS::Route53Resolver::ResolverRule',
          'AWS::Route53Resolver::ResolverRuleAssociation',
          'AWS::SageMaker::CodeRepository',
          'AWS::SageMaker::Model',
          'AWS::SageMaker::NotebookInstance',
          'AWS::WorkSpaces::ConnectionAlias',
          'AWS::WorkSpaces::Workspace',
          'AWS::Backup::BackupPlan',
          'AWS::Backup::BackupSelection',
          'AWS::Backup::BackupVault',
          'AWS::Backup::RecoveryPoint',
          'AWS::Batch::JobQueue',
          'AWS::Batch::ComputeEnvironment',
          'AWS::CodeDeploy::Application',
          'AWS::CodeDeploy::DeploymentConfig',
          'AWS::CodeDeploy::DeploymentGroup',
          'AWS::Config::ResourceCompliance',
          'AWS::Config::ConformancePackCompliance',
          'AWS::DMS::EventSubscription',
          'AWS::DMS::ReplicationSubnetGroup',
          'AWS::GlobalAccelerator::Listener',
          'AWS::GlobalAccelerator::EndpointGroup',
          'AWS::GlobalAccelerator::Accelerator',
          'AWS::AccessAnalyzer::Analyzer',
          'AWS::StepFunctions::Activity',
          'AWS::StepFunctions::StateMachine',
          'AWS::WAFv2::IPSet',
          'AWS::WAFv2::RegexPatternSet',
          'AWS::ElasticLoadBalancingV2::Listener',
        ],
      },
    });
  });
  test('create a custom policy', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new config.CustomPolicy(stack, 'Rule', {
      policyText: `
      let status = ['ACTIVE']
  
      rule tableisactive when
          resourceType == "AWS::DynamoDB::Table" {
          configuration.tableStatus == %status
      }
  
      rule checkcompliance when
          resourceType == "AWS::DynamoDB::Table"
          tableisactive {
              let pitr = supplementaryConfiguration.ContinuousBackupsDescription.pointInTimeRecoveryDescription.pointInTimeRecoveryStatus
              %pitr == "ENABLED"
      }`,
      description: 'really cool rule',
      configRuleName: 'cool rule',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Config::ConfigRule', {
      Source: {
        Owner: 'CUSTOM_POLICY',
        SourceDetails: [
          {
            EventSource: 'aws.config',
            MessageType: 'ConfigurationItemChangeNotification',
          },
          {
            EventSource: 'aws.config',
            MessageType: 'OversizedConfigurationItemChangeNotification',
          },
        ],
      },
      ConfigRuleName: 'cool rule',
      Description: 'really cool rule',
    });
  });

  test('create a 0 charactor policy', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    // THEN
    expect(() => new config.CustomPolicy(stack, 'Rule', {
      policyText: '',
    })).toThrow('Policy Text cannot be empty.');
  });

  test('create over 10000 charactor policy', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const stringLen10001 = '0123456789'.repeat(1000) + 'a';
    // WHEN
    // THEN
    expect(() => new config.CustomPolicy(stack, 'Rule', {
      policyText: stringLen10001,
    })).toThrow('Policy Text is limited to 10,000 characters or less.');
  });
});
