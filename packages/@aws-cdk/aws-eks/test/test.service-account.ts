import { expect, haveResource } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import { Test } from 'nodeunit';
import * as eks from '../lib';
import { testFixtureCluster } from './util';

/* eslint-disable max-len */

export = {
  'add Service Account': {
    'defaults should have default namespace and lowercase unique id'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      new eks.ServiceAccount(stack, 'MyServiceAccount', { cluster });

      // THEN
      expect(stack).to(haveResource(eks.KubernetesResource.RESOURCE_TYPE, {
        ServiceToken: {
          'Fn::GetAtt': [
            'awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B',
            'Outputs.StackawscdkawseksKubectlProviderframeworkonEvent8897FD9BArn',
          ],
        },
        Manifest: {
          'Fn::Join': [
            '',
            [
              '[{\"apiVersion\":\"v1\",\"kind\":\"ServiceAccount\",\"metadata\":{\"name\":\"stackmyserviceaccount58b9529e\",\"namespace\":\"default\",\"labels\":{\"app.kubernetes.io/name\":\"stackmyserviceaccount58b9529e\"},\"annotations\":{\"eks.amazonaws.com/role-arn\":\"',
              {
                'Fn::GetAtt': [
                  'MyServiceAccountRoleB41709FF',
                  'Arn',
                ],
              },
              '\"}}}]',
            ],
          ],
        },
      }));
      expect(stack).to(haveResource(iam.CfnRole.CFN_RESOURCE_TYPE_NAME, {
        AssumeRolePolicyDocument: {
          Statement: [
            {
              Action: 'sts:AssumeRoleWithWebIdentity',
              Effect: 'Allow',
              Principal: {
                Federated: {
                  Ref: 'ClusterOpenIdConnectProviderE7EB0530',
                },
              },
              Condition: {
                StringEquals: {
                  'Fn::GetAtt': [
                    'MyServiceAccountConditionJson1ED3BC54',
                    'Value',
                  ],
                },
              },
            },
          ],
          Version: '2012-10-17',
        },
      }));
      test.done();
    },
    'should have allow multiple services accounts'(test: Test) {
      // GIVEN
      const { stack, cluster } = testFixtureCluster();

      // WHEN
      cluster.addServiceAccount('MyServiceAccount');
      cluster.addServiceAccount('MyOtherServiceAccount');

      // THEN
      expect(stack).to(haveResource(eks.KubernetesResource.RESOURCE_TYPE, {
        ServiceToken: {
          'Fn::GetAtt': [
            'awscdkawseksKubectlProviderNestedStackawscdkawseksKubectlProviderNestedStackResourceA7AEBA6B',
            'Outputs.StackawscdkawseksKubectlProviderframeworkonEvent8897FD9BArn',
          ],
        },
        Manifest: {
          'Fn::Join': [
            '',
            [
              '[{\"apiVersion\":\"v1\",\"kind\":\"ServiceAccount\",\"metadata\":{\"name\":\"stackclustermyotherserviceaccounta472761a\",\"namespace\":\"default\",\"labels\":{\"app.kubernetes.io/name\":\"stackclustermyotherserviceaccounta472761a\"},\"annotations\":{\"eks.amazonaws.com/role-arn\":\"',
              {
                'Fn::GetAtt': [
                  'ClusterMyOtherServiceAccountRole764583C5',
                  'Arn',
                ],
              },
              '\"}}}]',
            ],
          ],
        },
      }));
      test.done();
    },
    'should have unique resource name'(test: Test) {
      // GIVEN
      const { cluster } = testFixtureCluster();

      // WHEN
      cluster.addServiceAccount('MyServiceAccount');

      // THEN
      test.throws(() => cluster.addServiceAccount('MyServiceAccount'));
      test.done();
    },
  },
};
