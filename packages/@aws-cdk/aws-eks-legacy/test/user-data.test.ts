import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import { App, Stack } from '@aws-cdk/core';
import { renderUserData } from '../lib/user-data';

/* eslint-disable max-len */

describeDeprecated('user data', () => {
  test('default user data', () => {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg));

    // THEN
    expect(userData).toEqual([
      'set -o xtrace',
      '/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true',
      '/opt/aws/bin/cfn-signal --exit-code $? --stack my-stack --resource ASG46ED3070 --region us-west-33',
    ]);


  });

  test('--use-max-pods=true', () => {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      useMaxPods: true,
    }));

    // THEN
    expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true');

  });

  test('--use-max-pods=false', () => {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      useMaxPods: false,
    }));

    // THEN
    expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods false');

  });

  test('--aws-api-retry-attempts', () => {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      awsApiRetryAttempts: 123,
    }));

    // THEN
    expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true --aws-api-retry-attempts 123');

  });

  test('--docker-config-json', () => {
    // GIVEN
    const { asg } = newFixtures();

    // WHEN
    const userData = renderUserData('my-cluster-name', asg, {
      dockerConfigJson: '{"docker":123}',
    });

    // THEN
    expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true --docker-config-json \'{"docker":123}\'');

  });

  test('--enable-docker-bridge=true', () => {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      enableDockerBridge: true,
    }));

    // THEN
    expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true --enable-docker-bridge');

  });

  test('--enable-docker-bridge=false', () => {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      enableDockerBridge: false,
    }));

    // THEN
    expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true');

  });

  test('--kubelet-extra-args', () => {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      kubeletExtraArgs: '--extra-args-for --kubelet',
    }));

    // THEN
    expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand  --extra-args-for --kubelet" --use-max-pods true');

  });

  test('arbitrary additional bootstrap arguments can be passed through "additionalArgs"', () => {
    // GIVEN
    const { asg, stack } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      additionalArgs: '--apiserver-endpoint 1111 --foo-bar',
    }));

    // THEN
    expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true --apiserver-endpoint 1111 --foo-bar');

  });

  test('if asg has spot instances, the correct label and taint is used', () => {
    // GIVEN
    const { asg, stack } = newFixtures(true);

    // WHEN
    const userData = stack.resolve(renderUserData('my-cluster-name', asg, {
      kubeletExtraArgs: '--node-labels X=y',
    }));

    // THEN
    expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=Ec2Spot --register-with-taints=spotInstance=true:PreferNoSchedule --node-labels X=y" --use-max-pods true');

  });
});

function newFixtures(spot = false) {
  const app = new App();
  const stack = new Stack(app, 'my-stack', { env: { region: 'us-west-33' } });
  const vpc = new ec2.Vpc(stack, 'vpc');
  const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
    instanceType: new ec2.InstanceType('m4.xlarge'),
    machineImage: new ec2.AmazonLinuxImage(),
    spotPrice: spot ? '0.01' : undefined,
    vpc,
  });

  return { stack, vpc, asg };
}
