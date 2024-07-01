import { Match, Template } from 'aws-cdk-lib/assertions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as iot from '@aws-cdk/aws-iot-alpha';
import * as opensearch from 'aws-cdk-lib/aws-opensearchservice';
import * as cdk from 'aws-cdk-lib';
import * as actions from '../../lib';

test('Default opensearch action', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic() as topic_name, * FROM 'input/#'"),
  });
  const domain = new opensearch.Domain(stack, 'Domain', {
    version: opensearch.EngineVersion.OPENSEARCH_1_0,
    useUnsignedBasicAuth: true,
    capacity: {
      multiAzWithStandbyEnabled: false,
    },
  });
  // WHEN
  topicRule.addAction(
    new actions.OpenSearchAction(domain, {
      id: 'id',
      index: 'index',
      type: 'type',
    }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          OpenSearch: {
            Id: 'id',
            Type: 'type',
            Index: 'index',
            Endpoint: {
              'Fn::Join': ['', ['https://', {
                'Fn::GetAtt': ['Domain66AC69E0', 'DomainEndpoint'],
              }]],
            },
            RoleArn: {
              'Fn::GetAtt': ['MyTopicRuleTopicRuleActionRoleCE2D05DA', 'Arn'],
            },
          },
        },
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Role', {
    AssumeRolePolicyDocument: {
      Statement: [
        {
          Action: 'sts:AssumeRole',
          Effect: 'Allow',
          Principal: {
            Service: 'iot.amazonaws.com',
          },
        },
      ],
      Version: '2012-10-17',
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'es:ESHttpPut',
          Effect: 'Allow',
          Resource: [
            {
              'Fn::GetAtt': ['Domain66AC69E0', 'Arn'],
            },
            {
              'Fn::Join': ['', [{
                'Fn::GetAtt': ['Domain66AC69E0', 'Arn'],
              }, '/*']],
            },
          ],
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'MyTopicRuleTopicRuleActionRoleDefaultPolicy54A701F7',
    Roles: [
      { Ref: 'MyTopicRuleTopicRuleActionRoleCE2D05DA' },
    ],
  });
});

test('can set role', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT topic(2) as device_id FROM 'device/+/data'"),
  });
  const domain = new opensearch.Domain(stack, 'Domain', {
    version: opensearch.EngineVersion.OPENSEARCH_1_0,
    useUnsignedBasicAuth: true,
    capacity: {
      multiAzWithStandbyEnabled: false,
    },
  });
  const role = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::123456789012:role/ForTest');

  // WHEN
  topicRule.addAction(
    new actions.OpenSearchAction(domain, {
      role,
      id: 'id',
      index: 'index',
      type: 'type',
    }),
  );

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        Match.objectLike({ OpenSearch: { RoleArn: 'arn:aws:iam::123456789012:role/ForTest' } }),
      ],
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyName: 'MyRolePolicy64AB00A5',
    Roles: ['ForTest'],
  });
});
