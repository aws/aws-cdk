import { Test } from 'nodeunit';
import * as eks from '../lib';
import { KubectlProvider } from '../lib/kubectl-provider';
import { testFixture } from './util';

export = {

  'fails on imported cluster with no kubectl role'(test: Test) {

    const { stack, vpc } = testFixture();

    // WHEN
    const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
      clusterName: 'cluster',
      vpc,
      kubectlPrivateSubnetIds: ['subnet1'],
    });

    test.throws(() => new KubectlProvider(stack, 'KubectlProvider', { cluster }), /"kubectlRole" is not defined, cannot issue kubectl commands against this cluster/);
    test.done();

  },

  'fails on imported cluster with private subnets but no security group'(test: Test) {

    const { stack, vpc } = testFixture();

    // WHEN
    const cluster = eks.Cluster.fromClusterAttributes(stack, 'Cluster', {
      clusterName: 'cluster',
      vpc,
      kubectlPrivateSubnetIds: ['subnet1'],
      kubectlRoleArn: stack.formatArn({
        resource: 'resource',
        service: 'service',
        resourceName: 'role',
        account: '1234567',
        region: 'us-east-1',
      }),
    });

    test.throws(() => new KubectlProvider(stack, 'KubectlProvider', { cluster }), /"kubectlSecurityGroup" is required if "kubectlSubnets" is specified/);
    test.done();


  },
}