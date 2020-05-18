import { expect, haveResource } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import { Test } from 'nodeunit';
import * as eks from '../lib';
import { testFixtureCluster } from './util';

// tslint:disable:max-line-length

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
            },
          ],
          Version: '2012-10-17',
        },
      }));
      test.done();
    },
  },
};
