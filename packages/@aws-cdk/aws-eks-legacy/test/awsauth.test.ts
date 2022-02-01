import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import { Cluster, KubernetesResource } from '../lib';
import { AwsAuth } from '../lib/aws-auth';
import { testFixtureNoVpc } from './util';

/* eslint-disable max-len */

describeDeprecated('awsauth', () => {
  test('empty aws-auth', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();
    const cluster = new Cluster(stack, 'cluster');

    // WHEN
    new AwsAuth(stack, 'AwsAuth', { cluster });

    // THEN
    Template.fromStack(stack).hasResourceProperties(KubernetesResource.RESOURCE_TYPE, {
      Manifest: JSON.stringify([{
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: { name: 'aws-auth', namespace: 'kube-system' },
        data: { mapRoles: '[]', mapUsers: '[]', mapAccounts: '[]' },
      }]),
    });

  });

  test('addRoleMapping and addUserMapping can be used to define the aws-auth ConfigMap', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();
    const cluster = new Cluster(stack, 'Cluster');
    const role = new iam.Role(stack, 'role', { assumedBy: new iam.AnyPrincipal() });
    const user = new iam.User(stack, 'user');

    // WHEN
    cluster.awsAuth.addRoleMapping(role, { groups: ['role-group1'], username: 'roleuser' });
    cluster.awsAuth.addRoleMapping(role, { groups: ['role-group2', 'role-group3'] });
    cluster.awsAuth.addUserMapping(user, { groups: ['user-group1', 'user-group2'] });
    cluster.awsAuth.addUserMapping(user, { groups: ['user-group1', 'user-group2'], username: 'foo' });
    cluster.awsAuth.addAccount('112233');
    cluster.awsAuth.addAccount('5566776655');

    // THEN
    Template.fromStack(stack).resourceCountIs(KubernetesResource.RESOURCE_TYPE, 1);
    Template.fromStack(stack).hasResourceProperties(KubernetesResource.RESOURCE_TYPE, {
      Manifest: {
        'Fn::Join': [
          '',
          [
            '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
            {
              'Fn::GetAtt': [
                'ClusterDefaultCapacityInstanceRole3E209969',
                'Arn',
              ],
            },
            '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]},{\\"rolearn\\":\\"',
            {
              'Fn::GetAtt': [
                'roleC7B7E775',
                'Arn',
              ],
            },
            '\\",\\"username\\":\\"roleuser\\",\\"groups\\":[\\"role-group1\\"]},{\\"rolearn\\":\\"',
            {
              'Fn::GetAtt': [
                'roleC7B7E775',
                'Arn',
              ],
            },
            '\\",\\"groups\\":[\\"role-group2\\",\\"role-group3\\"]}]","mapUsers":"[{\\"userarn\\":\\"',
            {
              'Fn::GetAtt': [
                'user2C2B57AE',
                'Arn',
              ],
            },
            '\\",\\"groups\\":[\\"user-group1\\",\\"user-group2\\"]},{\\"userarn\\":\\"',
            {
              'Fn::GetAtt': [
                'user2C2B57AE',
                'Arn',
              ],
            },
            '\\",\\"username\\":\\"foo\\",\\"groups\\":[\\"user-group1\\",\\"user-group2\\"]}]","mapAccounts":"[\\"112233\\",\\"5566776655\\"]"}}]',
          ],
        ],
      },
    });


  });

  test('imported users and roles can be also be used', () => {
    // GIVEN
    const { stack } = testFixtureNoVpc();
    const cluster = new Cluster(stack, 'Cluster');
    const role = iam.Role.fromRoleArn(stack, 'imported-role', 'arn:aws:iam::123456789012:role/S3Access');
    const user = iam.User.fromUserName(stack, 'import-user', 'MyUserName');

    // WHEN
    cluster.awsAuth.addRoleMapping(role, { groups: ['group1'] });
    cluster.awsAuth.addUserMapping(user, { groups: ['group2'] });

    // THEN
    Template.fromStack(stack).hasResourceProperties(KubernetesResource.RESOURCE_TYPE, {
      Manifest: {
        'Fn::Join': [
          '',
          [
            '[{"apiVersion":"v1","kind":"ConfigMap","metadata":{"name":"aws-auth","namespace":"kube-system"},"data":{"mapRoles":"[{\\"rolearn\\":\\"',
            {
              'Fn::GetAtt': [
                'ClusterDefaultCapacityInstanceRole3E209969',
                'Arn',
              ],
            },
            '\\",\\"username\\":\\"system:node:{{EC2PrivateDNSName}}\\",\\"groups\\":[\\"system:bootstrappers\\",\\"system:nodes\\"]},{\\"rolearn\\":\\"arn:aws:iam::123456789012:role/S3Access\\",\\"groups\\":[\\"group1\\"]}]","mapUsers":"[{\\"userarn\\":\\"arn:',
            {
              Ref: 'AWS::Partition',
            },
            ':iam::',
            {
              Ref: 'AWS::AccountId',
            },
            ':user/MyUserName\\",\\"groups\\":[\\"group2\\"]}]","mapAccounts":"[]"}}]',
          ],
        ],
      },
    });


  });
});
