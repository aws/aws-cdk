import { Match, Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as oss from '@aws-cdk/aws-opensearchservice';
import * as cdk from '@aws-cdk/core';
import * as actions from '../../lib';

let stack: cdk.Stack;
let topicRule: iot.TopicRule;
let domain: oss.Domain;

const TOPIC_RULE_ROLE_ID = 'MyTopicRuleTopicRuleActionRoleCE2D05DA';
const ID: string = 'TestID';
const INDEX: string = '/test/index';
const TYPE: string = '.zip';

beforeEach(() => {
  stack = new cdk.Stack();
  topicRule = new iot.TopicRule(stack, 'MyTopicRule', {
    sql: iot.IotSql.fromStringAsVer20160323("SELECT * FROM 'device/+/data'"),
  });
  domain = new oss.Domain(stack, 'MyOpenSearchDomain', {
    version: oss.EngineVersion.OPENSEARCH_1_3,
  });
});

test('Default Open Search action', () => {
  topicRule.addAction(new actions.OpenSearchAction(domain, ID, INDEX, TYPE));

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [
        {
          OpenSearch: {
            RoleArn: {
              'Fn::GetAtt': [TOPIC_RULE_ROLE_ID, 'Arn'],
            },
            Endpoint: {
              'Fn::GetAtt': [
                Match.stringLikeRegexp('MyOpenSearchDomain'),
                'DomainEndpoint',
              ],
            },
            Id: Match.exact(ID),
            Index: Match.exact(INDEX),
            Type: Match.exact(TYPE),
          },
        },
      ],
      AwsIotSqlVersion: Match.exact('2016-03-23'),
      Sql: Match.exact("SELECT * FROM 'device/+/data'"),
    },
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'es:ESHttpPut',
          Effect: 'Allow',
          Resource: {
            'Fn::GetAtt': [Match.stringLikeRegexp('MyOpenSearchDomain'), 'Arn'],
          },
        },
      ],
    },
  });
});

test('Can set role', () => {
  const ROLE_ARN = 'arn:aws:iam::123456789012:role/testrole';
  const role = iam.Role.fromRoleArn(stack, 'TestRole', ROLE_ARN);

  topicRule.addAction(
    new actions.OpenSearchAction(domain, ID, INDEX, TYPE, {
      role,
    }),
  );

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::TopicRule', {
    TopicRulePayload: {
      Actions: [Match.objectLike({ OpenSearch: { RoleArn: ROLE_ARN } })],
    },
  });
});
