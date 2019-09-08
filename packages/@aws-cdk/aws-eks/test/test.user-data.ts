import autoscaling = require('@aws-cdk/aws-autoscaling');
import ec2 = require('@aws-cdk/aws-ec2');
import { App, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { renderUserData } from '../lib/user-data';

// tslint:disable:max-line-length

export = {
  'default user data'(test: Test) {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg));

    // THEN
    test.deepEqual(userData, [
      'set -o xtrace',
      '/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand"',
      '/opt/aws/bin/cfn-signal --exit-code $? --stack my-stack --resource ASG46ED3070 --region us-west-33'
    ]);

    test.done();
  },

  '--use-max-pods'(test: Test) {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      useMaxPods: true
    }));

    // THEN
    test.deepEqual(userData[1], '/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods');
    test.done();
  },

  '--aws-api-retry-attempts'(test: Test) {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      awsApiRetryAttempts: 123
    }));

    // THEN
    test.deepEqual(userData[1], '/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --aws-api-retry-attempts 123');
    test.done();
  },

  '--docker-config-json'(test: Test) {
    // GIVEN
    const { asg } = newFixtures();

    // WHEN
    const userData = renderUserData('my-cluster-name', asg, {
      dockerConfigJson: '{"docker":123}'
    });

    // THEN
    test.deepEqual(userData[1], `/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --docker-config-json '{"docker":123}'`);
    test.done();
  },

  '--enable-docker-bridge=true'(test: Test) {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      enableDockerBridge: true
    }));

    // THEN
    test.deepEqual(userData[1], `/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --enable-docker-bridge`);
    test.done();
  },

  '--enable-docker-bridge=false'(test: Test) {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      enableDockerBridge: false
    }));

    // THEN
    test.deepEqual(userData[1], `/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand"`);
    test.done();
  },

  '--kubelet-extra-args'(test: Test) {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      kubeletExtraArgs: '--extra-args-for --kubelet'
    }));

    // THEN
    test.deepEqual(userData[1], `/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand  --extra-args-for --kubelet"`);
    test.done();
  },

  'arbitrary additional bootstrap arguments can be passed through "additionalArgs"'(test: Test) {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      additionalArgs: '--apiserver-endpoint 1111 --foo-bar'
    }));

    // THEN
    test.deepEqual(userData[1], `/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint 1111 --foo-bar`);
    test.done();
  },

  'if asg has spot instances, the correct label and taint is used'(test: Test) {
    // GIVEN
    const { asg, stack } = newFixtures(true);

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      kubeletExtraArgs: '--node-labels X=y'
    }));

    // THEN
    test.deepEqual(userData[1], `/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=Ec2Spot --register-with-taints=spotInstance=true:PreferNoSchedule --node-labels X=y"`);
    test.done();
  }
};

function newFixtures(spot = false) {
  const app = new App();
  const stack = new Stack(app, 'my-stack', { env: { region: 'us-west-33' }});
  const vpc = new ec2.Vpc(stack, 'vpc');
  const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
    instanceType: new ec2.InstanceType('m4.xlarge'),
    machineImage: new ec2.AmazonLinuxImage(),
    spotPrice: spot ? '0.01' : undefined,
    vpc
  });

  return { stack, vpc, asg };
}