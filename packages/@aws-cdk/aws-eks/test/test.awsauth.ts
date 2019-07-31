import { expect, haveResource } from '@aws-cdk/assert';
import ec2 = require('@aws-cdk/aws-ec2');
import { Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { Cluster, KubernetesManifest } from '../lib';
import { AwsAuth } from '../lib/aws-auth';

export = {
  'empty aws-auth'(test: Test) {
    // GIVEN
    const stack = new Stack();
    const vpc = new ec2.Vpc(stack, 'vpc');
    const cluster = new Cluster(stack, 'cluster', { vpc });

    // WHEN
    new AwsAuth(stack, 'AwsAuth', { cluster });

    // THEN
    expect(stack).to(haveResource(KubernetesManifest.RESORUCE_TYPE, {
      Manifest: JSON.stringify([{
        apiVersion: 'v1',
        kind: 'ConfigMap',
        metadata: { name: 'aws-auth', namespace: 'kube-system' },
        data: { mapRoles: '[]', mapUsers: '[]' }
      }])
    }));
    test.done();
  }
};
