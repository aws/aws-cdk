import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as ec2 from '@aws-cdk/aws-ec2';
import { App, Stack } from '@aws-cdk/core';
import { Cluster, KubernetesVersion } from '../lib/cluster';
import { renderAmazonLinuxUserData } from '../lib/user-data';

/* eslint-disable max-len */

describe('user data', () => {
  test('default user data', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(cluster, asg));

    // THEN
    expect(userData).toEqual([
      'set -o xtrace',
      {
        'Fn::Join': [
          '',
          [
            '/etc/eks/bootstrap.sh ',
            { Ref: 'clusterC5B25D0D' },
            ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
            { 'Fn::GetAtt': ['clusterC5B25D0D', 'Endpoint'] },
            "' --b64-cluster-ca '",
            {
              'Fn::GetAtt': ['clusterC5B25D0D', 'CertificateAuthorityData'],
            },
            "' --use-max-pods true",
          ],
        ],
      },
      '/opt/aws/bin/cfn-signal --exit-code $? --stack my-stack --resource ASG46ED3070 --region us-west-33',
    ]);
  });

  test('imported cluster without clusterEndpoint', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures();

    const importedCluster = Cluster.fromClusterAttributes(stack, 'ImportedCluster', {
      clusterName: cluster.clusterName,
      openIdConnectProvider: cluster.openIdConnectProvider,
      clusterCertificateAuthorityData: cluster.clusterCertificateAuthorityData,
    });

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(importedCluster, asg));

    // THEN
    expect(userData).toEqual([
      'set -o xtrace',
      {
        'Fn::Join': [
          '',
          [
            '/etc/eks/bootstrap.sh ',
            { Ref: 'clusterC5B25D0D' },
            ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true',
          ],
        ],
      },
      '/opt/aws/bin/cfn-signal --exit-code $? --stack my-stack --resource ASG46ED3070 --region us-west-33',
    ]);
  });

  test('imported cluster without clusterCertificateAuthorityData', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures();

    const importedCluster = Cluster.fromClusterAttributes(stack, 'ImportedCluster', {
      clusterName: cluster.clusterName,
      openIdConnectProvider: cluster.openIdConnectProvider,
      clusterEndpoint: cluster.clusterEndpoint,
    });

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(importedCluster, asg));

    // THEN
    expect(userData).toEqual([
      'set -o xtrace',
      {
        'Fn::Join': [
          '',
          [
            '/etc/eks/bootstrap.sh ',
            { Ref: 'clusterC5B25D0D' },
            ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true',
          ],
        ],
      },
      '/opt/aws/bin/cfn-signal --exit-code $? --stack my-stack --resource ASG46ED3070 --region us-west-33',
    ]);
  });

  test('--use-max-pods=true', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(cluster, asg, {
      useMaxPods: true,
    }));

    // THEN
    expect(
      userData[1],
    ).toEqual({
      'Fn::Join': [
        '',
        [
          '/etc/eks/bootstrap.sh ',
          { Ref: 'clusterC5B25D0D' },
          ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
          { 'Fn::GetAtt': ['clusterC5B25D0D', 'Endpoint'] },
          "' --b64-cluster-ca '",
          {
            'Fn::GetAtt': ['clusterC5B25D0D', 'CertificateAuthorityData'],
          },
          "' --use-max-pods true",
        ],
      ],
    });
  });

  test('--use-max-pods=false', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(cluster, asg, {
      useMaxPods: false,
    }));

    // THEN
    expect(
      userData[1],
    ).toEqual(
      {
        'Fn::Join': [
          '',
          [
            '/etc/eks/bootstrap.sh ',
            { Ref: 'clusterC5B25D0D' },
            ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
            { 'Fn::GetAtt': ['clusterC5B25D0D', 'Endpoint'] },
            "' --b64-cluster-ca '",
            {
              'Fn::GetAtt': ['clusterC5B25D0D', 'CertificateAuthorityData'],
            },
            "' --use-max-pods false",
          ],
        ],
      },
    );
  });

  test('--aws-api-retry-attempts', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(cluster, asg, {
      awsApiRetryAttempts: 123,
    }));

    // THEN
    expect(
      userData[1],
    ).toEqual(
      {
        'Fn::Join': [
          '',
          [
            '/etc/eks/bootstrap.sh ',
            { Ref: 'clusterC5B25D0D' },
            ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
            { 'Fn::GetAtt': ['clusterC5B25D0D', 'Endpoint'] },
            "' --b64-cluster-ca '",
            {
              'Fn::GetAtt': ['clusterC5B25D0D', 'CertificateAuthorityData'],
            },
            "' --use-max-pods true --aws-api-retry-attempts 123",
          ],
        ],
      },
    );
  });

  test('--dns-cluster-ip', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(cluster, asg, {
      dnsClusterIp: '192.0.2.53',
    }));

    // THEN
    expect(
      userData[1],
    ).toEqual(
      {
        'Fn::Join': [
          '',
          [
            '/etc/eks/bootstrap.sh ',
            { Ref: 'clusterC5B25D0D' },
            ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
            { 'Fn::GetAtt': ['clusterC5B25D0D', 'Endpoint'] },
            "' --b64-cluster-ca '",
            {
              'Fn::GetAtt': ['clusterC5B25D0D', 'CertificateAuthorityData'],
            },
            "' --use-max-pods true --dns-cluster-ip 192.0.2.53",
          ],
        ],
      },
    );
  });

  test('--docker-config-json', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(cluster, asg, {
      dockerConfigJson: '{"docker":123}',
    }));

    // THEN
    expect(
      userData[1],
    ).toEqual(
      {
        'Fn::Join': [
          '',
          [
            '/etc/eks/bootstrap.sh ',
            { Ref: 'clusterC5B25D0D' },
            ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
            { 'Fn::GetAtt': ['clusterC5B25D0D', 'Endpoint'] },
            "' --b64-cluster-ca '",
            {
              'Fn::GetAtt': ['clusterC5B25D0D', 'CertificateAuthorityData'],
            },
            '\' --use-max-pods true --docker-config-json \'{"docker":123}\'',
          ],
        ],
      },
    );
  });

  test('--enable-docker-bridge=true', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(cluster, asg, {
      enableDockerBridge: true,
    }));

    // THEN
    expect(
      userData[1],
    ).toEqual(
      {
        'Fn::Join': [
          '',
          [
            '/etc/eks/bootstrap.sh ',
            { Ref: 'clusterC5B25D0D' },
            ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
            { 'Fn::GetAtt': ['clusterC5B25D0D', 'Endpoint'] },
            "' --b64-cluster-ca '",
            {
              'Fn::GetAtt': ['clusterC5B25D0D', 'CertificateAuthorityData'],
            },
            "' --use-max-pods true --enable-docker-bridge true",
          ],
        ],
      },
    );
  });

  test('--enable-docker-bridge=false', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(cluster, asg, {
      enableDockerBridge: false,
    }));

    // THEN
    expect(
      userData[1],
    ).toEqual(
      {
        'Fn::Join': [
          '',
          [
            '/etc/eks/bootstrap.sh ',
            { Ref: 'clusterC5B25D0D' },
            ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
            { 'Fn::GetAtt': ['clusterC5B25D0D', 'Endpoint'] },
            "' --b64-cluster-ca '",
            {
              'Fn::GetAtt': ['clusterC5B25D0D', 'CertificateAuthorityData'],
            },
            "' --use-max-pods true",
          ],
        ],
      },
    );
  });

  test('--kubelet-extra-args', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(cluster, asg, {
      kubeletExtraArgs: '--extra-args-for --kubelet',
    }));

    // THEN
    expect(
      userData[1],
    ).toEqual(
      {
        'Fn::Join': [
          '',
          [
            '/etc/eks/bootstrap.sh ',
            { Ref: 'clusterC5B25D0D' },
            ' --kubelet-extra-args "--node-labels lifecycle=OnDemand  --extra-args-for --kubelet" --apiserver-endpoint \'',
            { 'Fn::GetAtt': ['clusterC5B25D0D', 'Endpoint'] },
            "' --b64-cluster-ca '",
            {
              'Fn::GetAtt': ['clusterC5B25D0D', 'CertificateAuthorityData'],
            },
            "' --use-max-pods true",
          ],
        ],
      },
    );
  });

  test('arbitrary additional bootstrap arguments can be passed through "additionalArgs"', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures();

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(cluster, asg, {
      additionalArgs: '--apiserver-endpoint 1111 --foo-bar',
    }));

    // THEN
    // NB: duplicated --apiserver-endpoint is fine.  Last wins.
    expect(
      userData[1],
    ).toEqual(
      {
        'Fn::Join': [
          '',
          [
            '/etc/eks/bootstrap.sh ',
            { Ref: 'clusterC5B25D0D' },
            ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
            { 'Fn::GetAtt': ['clusterC5B25D0D', 'Endpoint'] },
            "' --b64-cluster-ca '",
            {
              'Fn::GetAtt': ['clusterC5B25D0D', 'CertificateAuthorityData'],
            },
            "' --use-max-pods true --apiserver-endpoint 1111 --foo-bar",
          ],
        ],
      },
    );
  });

  test('if asg has spot instances, the correct label and taint is used', () => {
    // GIVEN
    const { asg, stack, cluster } = newFixtures(true);

    // WHEN
    const userData = stack.resolve(renderAmazonLinuxUserData(cluster, asg, {
      kubeletExtraArgs: '--node-labels X=y',
    }));

    // THEN
    expect(
      userData[1],
    ).toEqual(
      {
        'Fn::Join': [
          '',
          [
            '/etc/eks/bootstrap.sh ',
            { Ref: 'clusterC5B25D0D' },
            ' --kubelet-extra-args "--node-labels lifecycle=Ec2Spot --register-with-taints=spotInstance=true:PreferNoSchedule --node-labels X=y" --apiserver-endpoint \'',
            { 'Fn::GetAtt': ['clusterC5B25D0D', 'Endpoint'] },
            "' --b64-cluster-ca '",
            {
              'Fn::GetAtt': ['clusterC5B25D0D', 'CertificateAuthorityData'],
            },
            "' --use-max-pods true",
          ],
        ],
      },
    );
  });
});

function newFixtures(spot = false) {
  const app = new App();
  const stack = new Stack(app, 'my-stack', { env: { region: 'us-west-33' } });
  const vpc = new ec2.Vpc(stack, 'vpc');
  const cluster = new Cluster(stack, 'cluster', {
    version: KubernetesVersion.V1_21,
    clusterName: 'my-cluster-name',
    vpc,
  });
  const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
    instanceType: new ec2.InstanceType('m4.xlarge'),
    machineImage: new ec2.AmazonLinuxImage(),
    spotPrice: spot ? '0.01' : undefined,
    vpc,
  });

  return { stack, vpc, cluster, asg };
}
