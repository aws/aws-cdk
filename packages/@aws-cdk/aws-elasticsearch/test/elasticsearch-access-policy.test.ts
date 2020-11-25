import '@aws-cdk/assert/jest';
import * as assert from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { App, Stack } from '@aws-cdk/core';
import { ElasticsearchAccessPolicy } from '../lib/elasticsearch-access-policy';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('grants kms permissions if needed', () => {

  const key = new kms.Key(stack, 'Key');

  new ElasticsearchAccessPolicy(stack, 'ElasticsearchAccessPolicy', {
    domainName: 'TestDomain',
    domainArn: 'test:arn',
    accessPolicies: [new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['es:ESHttp*'],
      principals: [new iam.Anyone()],
      resources: ['test:arn'],
    })],
    kmsKey: key,
  });

  const resources = assert.expect(stack).value.Resources;
  expect(resources.AWS679f53fac002430cb0da5b7982bd2287ServiceRoleDefaultPolicyD28E1A5E.Properties.PolicyDocument).toEqual({
    Statement: [
      {
        Action: [
          'kms:List*',
          'kms:Describe*',
          'kms:CreateGrant',
        ],
        Effect: 'Allow',
        Resource: {
          'Fn::GetAtt': [
            'Key961B73FD',
            'Arn',
          ],
        },
      },
    ],
    Version: '2012-10-17',
  });
});

test('minimal example renders correctly', () => {
  new ElasticsearchAccessPolicy(stack, 'ElasticsearchAccessPolicy', {
    domainName: 'TestDomain',
    domainArn: 'test:arn',
    accessPolicies: [new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['es:ESHttp*'],
      principals: [new iam.Anyone()],
      resources: ['test:arn'],

    })],
  });

  expect(stack).toHaveResource('Custom::ElasticsearchAccessPolicy', {
    ServiceToken: {
      'Fn::GetAtt': [
        'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
        'Arn',
      ],
    },
    Create: {
      service: 'ES',
      action: 'updateElasticsearchDomainConfig',
      parameters: {
        DomainName: 'TestDomain',
        AccessPolicies: '{\"Statement\":[{\"Action\":\"es:ESHttp*\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Resource\":\"test:arn\"}],\"Version\":\"2012-10-17\"}',
      },
      outputPath: 'DomainConfig.ElasticsearchClusterConfig.AccessPolicies',
      physicalResourceId: {
        id: 'TestDomainAccessPolicy',
      },
    },
    Update: {
      service: 'ES',
      action: 'updateElasticsearchDomainConfig',
      parameters: {
        DomainName: 'TestDomain',
        AccessPolicies: '{\"Statement\":[{\"Action\":\"es:ESHttp*\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Resource\":\"test:arn\"}],\"Version\":\"2012-10-17\"}',
      },
      outputPath: 'DomainConfig.ElasticsearchClusterConfig.AccessPolicies',
      physicalResourceId: {
        id: 'TestDomainAccessPolicy',
      },
    },
  });
});
