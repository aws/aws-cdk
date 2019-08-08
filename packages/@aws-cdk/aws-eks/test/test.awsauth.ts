import { countResources, expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Cluster, KubernetesResource } from '../lib';
import { AwsAuth } from '../lib/aws-auth';
import { testFixture } from './util';

// tslint:disable:max-line-length

export = {
  'empty aws-auth'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'vpc');
    const cluster = new Cluster(stack, 'cluster', { vpc });

    // WHEN
    new AwsAuth(stack, 'AwsAuth', { cluster });

    // THEN
    expect(stack).to(haveResource(KubernetesResource.RESOURCE_TYPE, {
      Manifest: JSON.stringify([{
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: { name: 'aws-auth', namespace: 'kube-system' },
        data: { mapRoles: '[]', mapUsers: '[]', mapAccounts: '[]' }
      }])
    }));
    test.done();
  },

  'addRoleMapping and addUserMapping can be used to define the aws-auth ConfigMap'(test: Test) {
    // GIVEN
    const { stack, vpc } = testFixture();
    const cluster = new Cluster(stack, 'Cluster', { vpc });
    const role = new iam.Role(stack, 'role', { assumedBy: new iam.AnyPrincipal() });
    const user = new iam.User(stack, 'user');

    // WHEN
    cluster.awsAuth.addRoleMapping(role, { groups: [ 'role-group1' ], username: 'roleuser' });
    cluster.awsAuth.addRoleMapping(role, { groups: [ 'role-group2', 'role-group3' ] });
    cluster.awsAuth.addUserMapping(user, { groups: [ 'user-group1', 'user-group2' ] });
    cluster.awsAuth.addUserMapping(user, { groups: [ 'user-group1', 'user-group2' ], username: 'foo' });
    cluster.awsAuth.addAccount('112233');
    cluster.awsAuth.addAccount('5566776655');

    // THEN
    expect(stack).to(countResources(KubernetesResource.RESOURCE_TYPE, 1));
    expect(stack).to(haveResource(KubernetesResource.RESOURCE_TYPE, {
      Manifest: {
        "Fn::Join": [
          "",
          [
            "[{\"apiVersion\":\"v1\",\"kind\":\"ConfigMap\",\"metadata\":{\"name\":\"aws-auth\",\"namespace\":\"kube-system\"},\"data\":{\"mapRoles\":\"[{\\\"rolearn\\\":\\\"",
            {
              "Fn::GetAtt": [
                "roleC7B7E775",
                "Arn"
              ]
            },
            "\\\",\\\"username\\\":\\\"roleuser\\\",\\\"groups\\\":[\\\"role-group1\\\"]},{\\\"rolearn\\\":\\\"",
            {
              "Fn::GetAtt": [
                "roleC7B7E775",
                "Arn"
              ]
            },
            "\\\",\\\"groups\\\":[\\\"role-group2\\\",\\\"role-group3\\\"]}]\",\"mapUsers\":\"[{\\\"userarn\\\":\\\"arn:",
            {
              Ref: "AWS::Partition"
            },
            ":iam:us-east-1:",
            {
              Ref: "AWS::AccountId"
            },
            ":user/",
            {
              Ref: "user2C2B57AE"
            },
            "\\\",\\\"groups\\\":[\\\"user-group1\\\",\\\"user-group2\\\"]},{\\\"userarn\\\":\\\"arn:",
            {
              Ref: "AWS::Partition"
            },
            ":iam:us-east-1:",
            {
              Ref: "AWS::AccountId"
            },
            ":user/",
            {
              Ref: "user2C2B57AE"
            },
            "\\\",\\\"username\\\":\\\"foo\\\",\\\"groups\\\":[\\\"user-group1\\\",\\\"user-group2\\\"]}]\",\"mapAccounts\":\"[\\\"112233\\\",\\\"5566776655\\\"]\"}}]"
          ]
        ]
      }
    }));
    test.done();
  },

};
