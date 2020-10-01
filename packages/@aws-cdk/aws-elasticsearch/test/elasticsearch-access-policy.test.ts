import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
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
