"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autoscaling = require("@aws-cdk/aws-autoscaling");
const ec2 = require("@aws-cdk/aws-ec2");
const core_1 = require("@aws-cdk/core");
const cluster_1 = require("../lib/cluster");
const user_data_1 = require("../lib/user-data");
/* eslint-disable max-len */
describe('user data', () => {
    test('default user data', () => {
        // GIVEN
        const { asg, stack, cluster } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(cluster, asg));
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
        const importedCluster = cluster_1.Cluster.fromClusterAttributes(stack, 'ImportedCluster', {
            clusterName: cluster.clusterName,
            openIdConnectProvider: cluster.openIdConnectProvider,
            clusterCertificateAuthorityData: cluster.clusterCertificateAuthorityData,
        });
        // WHEN
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(importedCluster, asg));
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
        const importedCluster = cluster_1.Cluster.fromClusterAttributes(stack, 'ImportedCluster', {
            clusterName: cluster.clusterName,
            openIdConnectProvider: cluster.openIdConnectProvider,
            clusterEndpoint: cluster.clusterEndpoint,
        });
        // WHEN
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(importedCluster, asg));
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
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(cluster, asg, {
            useMaxPods: true,
        }));
        // THEN
        expect(userData[1]).toEqual({
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
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(cluster, asg, {
            useMaxPods: false,
        }));
        // THEN
        expect(userData[1]).toEqual({
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
        });
    });
    test('--aws-api-retry-attempts', () => {
        // GIVEN
        const { asg, stack, cluster } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(cluster, asg, {
            awsApiRetryAttempts: 123,
        }));
        // THEN
        expect(userData[1]).toEqual({
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
        });
    });
    test('--dns-cluster-ip', () => {
        // GIVEN
        const { asg, stack, cluster } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(cluster, asg, {
            dnsClusterIp: '192.0.2.53',
        }));
        // THEN
        expect(userData[1]).toEqual({
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
        });
    });
    test('--docker-config-json', () => {
        // GIVEN
        const { asg, stack, cluster } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(cluster, asg, {
            dockerConfigJson: '{"docker":123}',
        }));
        // THEN
        expect(userData[1]).toEqual({
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
        });
    });
    test('--enable-docker-bridge=true', () => {
        // GIVEN
        const { asg, stack, cluster } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(cluster, asg, {
            enableDockerBridge: true,
        }));
        // THEN
        expect(userData[1]).toEqual({
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
        });
    });
    test('--enable-docker-bridge=false', () => {
        // GIVEN
        const { asg, stack, cluster } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(cluster, asg, {
            enableDockerBridge: false,
        }));
        // THEN
        expect(userData[1]).toEqual({
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
    test('--kubelet-extra-args', () => {
        // GIVEN
        const { asg, stack, cluster } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(cluster, asg, {
            kubeletExtraArgs: '--extra-args-for --kubelet',
        }));
        // THEN
        expect(userData[1]).toEqual({
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
        });
    });
    test('arbitrary additional bootstrap arguments can be passed through "additionalArgs"', () => {
        // GIVEN
        const { asg, stack, cluster } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(cluster, asg, {
            additionalArgs: '--apiserver-endpoint 1111 --foo-bar',
        }));
        // THEN
        // NB: duplicated --apiserver-endpoint is fine.  Last wins.
        expect(userData[1]).toEqual({
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
        });
    });
    test('if asg has spot instances, the correct label and taint is used', () => {
        // GIVEN
        const { asg, stack, cluster } = newFixtures(true);
        // WHEN
        const userData = stack.resolve(user_data_1.renderAmazonLinuxUserData(cluster, asg, {
            kubeletExtraArgs: '--node-labels X=y',
        }));
        // THEN
        expect(userData[1]).toEqual({
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
        });
    });
});
function newFixtures(spot = false) {
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'my-stack', { env: { region: 'us-west-33' } });
    const vpc = new ec2.Vpc(stack, 'vpc');
    const cluster = new cluster_1.Cluster(stack, 'cluster', {
        version: cluster_1.KubernetesVersion.V1_21,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1kYXRhLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2VyLWRhdGEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdEQUF3RDtBQUN4RCx3Q0FBd0M7QUFDeEMsd0NBQTJDO0FBQzNDLDRDQUE0RDtBQUM1RCxnREFBNkQ7QUFFN0QsNEJBQTRCO0FBRTVCLFFBQVEsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFO0lBQ3pCLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUU7UUFDN0IsUUFBUTtRQUNSLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRTlDLE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLHFDQUF5QixDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRXhFLE9BQU87UUFDUCxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3ZCLGVBQWU7WUFDZjtnQkFDRSxVQUFVLEVBQUU7b0JBQ1YsRUFBRTtvQkFDRjt3QkFDRSx3QkFBd0I7d0JBQ3hCLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixFQUFFO3dCQUMxQixrRkFBa0Y7d0JBQ2xGLEVBQUUsWUFBWSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLEVBQUU7d0JBQ2pELHNCQUFzQjt3QkFDdEI7NEJBQ0UsWUFBWSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsMEJBQTBCLENBQUM7eUJBQzlEO3dCQUNELHVCQUF1QjtxQkFDeEI7aUJBQ0Y7YUFDRjtZQUNELG9HQUFvRztTQUNyRyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywwQ0FBMEMsRUFBRSxHQUFHLEVBQUU7UUFDcEQsUUFBUTtRQUNSLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRTlDLE1BQU0sZUFBZSxHQUFHLGlCQUFPLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO1lBQzlFLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVztZQUNoQyxxQkFBcUIsRUFBRSxPQUFPLENBQUMscUJBQXFCO1lBQ3BELCtCQUErQixFQUFFLE9BQU8sQ0FBQywrQkFBK0I7U0FDekUsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMscUNBQXlCLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFaEYsT0FBTztRQUNQLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDdkIsZUFBZTtZQUNmO2dCQUNFLFVBQVUsRUFBRTtvQkFDVixFQUFFO29CQUNGO3dCQUNFLHdCQUF3Qjt3QkFDeEIsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7d0JBQzFCLDhFQUE4RTtxQkFDL0U7aUJBQ0Y7YUFDRjtZQUNELG9HQUFvRztTQUNyRyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywwREFBMEQsRUFBRSxHQUFHLEVBQUU7UUFDcEUsUUFBUTtRQUNSLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRTlDLE1BQU0sZUFBZSxHQUFHLGlCQUFPLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO1lBQzlFLFdBQVcsRUFBRSxPQUFPLENBQUMsV0FBVztZQUNoQyxxQkFBcUIsRUFBRSxPQUFPLENBQUMscUJBQXFCO1lBQ3BELGVBQWUsRUFBRSxPQUFPLENBQUMsZUFBZTtTQUN6QyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxxQ0FBeUIsQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUVoRixPQUFPO1FBQ1AsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN2QixlQUFlO1lBQ2Y7Z0JBQ0UsVUFBVSxFQUFFO29CQUNWLEVBQUU7b0JBQ0Y7d0JBQ0Usd0JBQXdCO3dCQUN4QixFQUFFLEdBQUcsRUFBRSxpQkFBaUIsRUFBRTt3QkFDMUIsOEVBQThFO3FCQUMvRTtpQkFDRjthQUNGO1lBQ0Qsb0dBQW9HO1NBQ3JHLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUMvQixRQUFRO1FBQ1IsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFFOUMsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMscUNBQXlCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNyRSxVQUFVLEVBQUUsSUFBSTtTQUNqQixDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU87UUFDUCxNQUFNLENBQ0osUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUNaLENBQUMsT0FBTyxDQUFDO1lBQ1IsVUFBVSxFQUFFO2dCQUNWLEVBQUU7Z0JBQ0Y7b0JBQ0Usd0JBQXdCO29CQUN4QixFQUFFLEdBQUcsRUFBRSxpQkFBaUIsRUFBRTtvQkFDMUIsa0ZBQWtGO29CQUNsRixFQUFFLFlBQVksRUFBRSxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxFQUFFO29CQUNqRCxzQkFBc0I7b0JBQ3RCO3dCQUNFLFlBQVksRUFBRSxDQUFDLGlCQUFpQixFQUFFLDBCQUEwQixDQUFDO3FCQUM5RDtvQkFDRCx1QkFBdUI7aUJBQ3hCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDaEMsUUFBUTtRQUNSLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRTlDLE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLHFDQUF5QixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDckUsVUFBVSxFQUFFLEtBQUs7U0FDbEIsQ0FBQyxDQUFDLENBQUM7UUFFSixPQUFPO1FBQ1AsTUFBTSxDQUNKLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDWixDQUFDLE9BQU8sQ0FDUDtZQUNFLFVBQVUsRUFBRTtnQkFDVixFQUFFO2dCQUNGO29CQUNFLHdCQUF3QjtvQkFDeEIsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7b0JBQzFCLGtGQUFrRjtvQkFDbEYsRUFBRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsRUFBRTtvQkFDakQsc0JBQXNCO29CQUN0Qjt3QkFDRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSwwQkFBMEIsQ0FBQztxQkFDOUQ7b0JBQ0Qsd0JBQXdCO2lCQUN6QjthQUNGO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLFFBQVE7UUFDUixNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUU5QyxPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxxQ0FBeUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3JFLG1CQUFtQixFQUFFLEdBQUc7U0FDekIsQ0FBQyxDQUFDLENBQUM7UUFFSixPQUFPO1FBQ1AsTUFBTSxDQUNKLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDWixDQUFDLE9BQU8sQ0FDUDtZQUNFLFVBQVUsRUFBRTtnQkFDVixFQUFFO2dCQUNGO29CQUNFLHdCQUF3QjtvQkFDeEIsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7b0JBQzFCLGtGQUFrRjtvQkFDbEYsRUFBRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsRUFBRTtvQkFDakQsc0JBQXNCO29CQUN0Qjt3QkFDRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSwwQkFBMEIsQ0FBQztxQkFDOUQ7b0JBQ0Qsb0RBQW9EO2lCQUNyRDthQUNGO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFO1FBQzVCLFFBQVE7UUFDUixNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUU5QyxPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxxQ0FBeUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3JFLFlBQVksRUFBRSxZQUFZO1NBQzNCLENBQUMsQ0FBQyxDQUFDO1FBRUosT0FBTztRQUNQLE1BQU0sQ0FDSixRQUFRLENBQUMsQ0FBQyxDQUFDLENBQ1osQ0FBQyxPQUFPLENBQ1A7WUFDRSxVQUFVLEVBQUU7Z0JBQ1YsRUFBRTtnQkFDRjtvQkFDRSx3QkFBd0I7b0JBQ3hCLEVBQUUsR0FBRyxFQUFFLGlCQUFpQixFQUFFO29CQUMxQixrRkFBa0Y7b0JBQ2xGLEVBQUUsWUFBWSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLEVBQUU7b0JBQ2pELHNCQUFzQjtvQkFDdEI7d0JBQ0UsWUFBWSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsMEJBQTBCLENBQUM7cUJBQzlEO29CQUNELG1EQUFtRDtpQkFDcEQ7YUFDRjtTQUNGLENBQ0YsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRTtRQUNoQyxRQUFRO1FBQ1IsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFFOUMsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMscUNBQXlCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNyRSxnQkFBZ0IsRUFBRSxnQkFBZ0I7U0FDbkMsQ0FBQyxDQUFDLENBQUM7UUFFSixPQUFPO1FBQ1AsTUFBTSxDQUNKLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDWixDQUFDLE9BQU8sQ0FDUDtZQUNFLFVBQVUsRUFBRTtnQkFDVixFQUFFO2dCQUNGO29CQUNFLHdCQUF3QjtvQkFDeEIsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7b0JBQzFCLGtGQUFrRjtvQkFDbEYsRUFBRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsRUFBRTtvQkFDakQsc0JBQXNCO29CQUN0Qjt3QkFDRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSwwQkFBMEIsQ0FBQztxQkFDOUQ7b0JBQ0QsZ0VBQWdFO2lCQUNqRTthQUNGO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFO1FBQ3ZDLFFBQVE7UUFDUixNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUU5QyxPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxxQ0FBeUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3JFLGtCQUFrQixFQUFFLElBQUk7U0FDekIsQ0FBQyxDQUFDLENBQUM7UUFFSixPQUFPO1FBQ1AsTUFBTSxDQUNKLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDWixDQUFDLE9BQU8sQ0FDUDtZQUNFLFVBQVUsRUFBRTtnQkFDVixFQUFFO2dCQUNGO29CQUNFLHdCQUF3QjtvQkFDeEIsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7b0JBQzFCLGtGQUFrRjtvQkFDbEYsRUFBRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsRUFBRTtvQkFDakQsc0JBQXNCO29CQUN0Qjt3QkFDRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSwwQkFBMEIsQ0FBQztxQkFDOUQ7b0JBQ0QsbURBQW1EO2lCQUNwRDthQUNGO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1FBQ3hDLFFBQVE7UUFDUixNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUU5QyxPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxxQ0FBeUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3JFLGtCQUFrQixFQUFFLEtBQUs7U0FDMUIsQ0FBQyxDQUFDLENBQUM7UUFFSixPQUFPO1FBQ1AsTUFBTSxDQUNKLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDWixDQUFDLE9BQU8sQ0FDUDtZQUNFLFVBQVUsRUFBRTtnQkFDVixFQUFFO2dCQUNGO29CQUNFLHdCQUF3QjtvQkFDeEIsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7b0JBQzFCLGtGQUFrRjtvQkFDbEYsRUFBRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsRUFBRTtvQkFDakQsc0JBQXNCO29CQUN0Qjt3QkFDRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSwwQkFBMEIsQ0FBQztxQkFDOUQ7b0JBQ0QsdUJBQXVCO2lCQUN4QjthQUNGO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQ2hDLFFBQVE7UUFDUixNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUU5QyxPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxxQ0FBeUIsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO1lBQ3JFLGdCQUFnQixFQUFFLDRCQUE0QjtTQUMvQyxDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU87UUFDUCxNQUFNLENBQ0osUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUNaLENBQUMsT0FBTyxDQUNQO1lBQ0UsVUFBVSxFQUFFO2dCQUNWLEVBQUU7Z0JBQ0Y7b0JBQ0Usd0JBQXdCO29CQUN4QixFQUFFLEdBQUcsRUFBRSxpQkFBaUIsRUFBRTtvQkFDMUIsOEdBQThHO29CQUM5RyxFQUFFLFlBQVksRUFBRSxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxFQUFFO29CQUNqRCxzQkFBc0I7b0JBQ3RCO3dCQUNFLFlBQVksRUFBRSxDQUFDLGlCQUFpQixFQUFFLDBCQUEwQixDQUFDO3FCQUM5RDtvQkFDRCx1QkFBdUI7aUJBQ3hCO2FBQ0Y7U0FDRixDQUNGLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxpRkFBaUYsRUFBRSxHQUFHLEVBQUU7UUFDM0YsUUFBUTtRQUNSLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRTlDLE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLHFDQUF5QixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUU7WUFDckUsY0FBYyxFQUFFLHFDQUFxQztTQUN0RCxDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU87UUFDUCwyREFBMkQ7UUFDM0QsTUFBTSxDQUNKLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDWixDQUFDLE9BQU8sQ0FDUDtZQUNFLFVBQVUsRUFBRTtnQkFDVixFQUFFO2dCQUNGO29CQUNFLHdCQUF3QjtvQkFDeEIsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7b0JBQzFCLGtGQUFrRjtvQkFDbEYsRUFBRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsRUFBRTtvQkFDakQsc0JBQXNCO29CQUN0Qjt3QkFDRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSwwQkFBMEIsQ0FBQztxQkFDOUQ7b0JBQ0QsMkRBQTJEO2lCQUM1RDthQUNGO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0VBQWdFLEVBQUUsR0FBRyxFQUFFO1FBQzFFLFFBQVE7UUFDUixNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEQsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMscUNBQXlCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNyRSxnQkFBZ0IsRUFBRSxtQkFBbUI7U0FDdEMsQ0FBQyxDQUFDLENBQUM7UUFFSixPQUFPO1FBQ1AsTUFBTSxDQUNKLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FDWixDQUFDLE9BQU8sQ0FDUDtZQUNFLFVBQVUsRUFBRTtnQkFDVixFQUFFO2dCQUNGO29CQUNFLHdCQUF3QjtvQkFDeEIsRUFBRSxHQUFHLEVBQUUsaUJBQWlCLEVBQUU7b0JBQzFCLDZKQUE2SjtvQkFDN0osRUFBRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxVQUFVLENBQUMsRUFBRTtvQkFDakQsc0JBQXNCO29CQUN0Qjt3QkFDRSxZQUFZLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSwwQkFBMEIsQ0FBQztxQkFDOUQ7b0JBQ0QsdUJBQXVCO2lCQUN4QjthQUNGO1NBQ0YsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILFNBQVMsV0FBVyxDQUFDLElBQUksR0FBRyxLQUFLO0lBQy9CLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7SUFDdEIsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxFQUFFLFVBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDNUUsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN0QyxNQUFNLE9BQU8sR0FBRyxJQUFJLGlCQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtRQUM1QyxPQUFPLEVBQUUsMkJBQWlCLENBQUMsS0FBSztRQUNoQyxXQUFXLEVBQUUsaUJBQWlCO1FBQzlCLEdBQUc7S0FDSixDQUFDLENBQUM7SUFDSCxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFO1FBQ3pELFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDO1FBQy9DLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN4QyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVM7UUFDcEMsR0FBRztLQUNKLENBQUMsQ0FBQztJQUVILE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUN0QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXV0b3NjYWxpbmcgZnJvbSAnQGF3cy1jZGsvYXdzLWF1dG9zY2FsaW5nJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENsdXN0ZXIsIEt1YmVybmV0ZXNWZXJzaW9uIH0gZnJvbSAnLi4vbGliL2NsdXN0ZXInO1xuaW1wb3J0IHsgcmVuZGVyQW1hem9uTGludXhVc2VyRGF0YSB9IGZyb20gJy4uL2xpYi91c2VyLWRhdGEnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cbmRlc2NyaWJlKCd1c2VyIGRhdGEnLCAoKSA9PiB7XG4gIHRlc3QoJ2RlZmF1bHQgdXNlciBkYXRhJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZykpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh1c2VyRGF0YSkudG9FcXVhbChbXG4gICAgICAnc2V0IC1vIHh0cmFjZScsXG4gICAgICB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsXG4gICAgICAgICAgICB7IFJlZjogJ2NsdXN0ZXJDNUIyNUQwRCcgfSxcbiAgICAgICAgICAgICcgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZFwiIC0tYXBpc2VydmVyLWVuZHBvaW50IFxcJycsXG4gICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydjbHVzdGVyQzVCMjVEMEQnLCAnRW5kcG9pbnQnXSB9LFxuICAgICAgICAgICAgXCInIC0tYjY0LWNsdXN0ZXItY2EgJ1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnY2x1c3RlckM1QjI1RDBEJywgJ0NlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJyAtLXVzZS1tYXgtcG9kcyB0cnVlXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICAnL29wdC9hd3MvYmluL2Nmbi1zaWduYWwgLS1leGl0LWNvZGUgJD8gLS1zdGFjayBteS1zdGFjayAtLXJlc291cmNlIEFTRzQ2RUQzMDcwIC0tcmVnaW9uIHVzLXdlc3QtMzMnLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnRlZCBjbHVzdGVyIHdpdGhvdXQgY2x1c3RlckVuZHBvaW50JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgY29uc3QgaW1wb3J0ZWRDbHVzdGVyID0gQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZENsdXN0ZXInLCB7XG4gICAgICBjbHVzdGVyTmFtZTogY2x1c3Rlci5jbHVzdGVyTmFtZSxcbiAgICAgIG9wZW5JZENvbm5lY3RQcm92aWRlcjogY2x1c3Rlci5vcGVuSWRDb25uZWN0UHJvdmlkZXIsXG4gICAgICBjbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhOiBjbHVzdGVyLmNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEsXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBzdGFjay5yZXNvbHZlKHJlbmRlckFtYXpvbkxpbnV4VXNlckRhdGEoaW1wb3J0ZWRDbHVzdGVyLCBhc2cpKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodXNlckRhdGEpLnRvRXF1YWwoW1xuICAgICAgJ3NldCAtbyB4dHJhY2UnLFxuICAgICAge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAnLFxuICAgICAgICAgICAgeyBSZWY6ICdjbHVzdGVyQzVCMjVEMEQnIH0sXG4gICAgICAgICAgICAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9T25EZW1hbmRcIiAtLXVzZS1tYXgtcG9kcyB0cnVlJyxcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgICcvb3B0L2F3cy9iaW4vY2ZuLXNpZ25hbCAtLWV4aXQtY29kZSAkPyAtLXN0YWNrIG15LXN0YWNrIC0tcmVzb3VyY2UgQVNHNDZFRDMwNzAgLS1yZWdpb24gdXMtd2VzdC0zMycsXG4gICAgXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIGNsdXN0ZXIgd2l0aG91dCBjbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgY29uc3QgaW1wb3J0ZWRDbHVzdGVyID0gQ2x1c3Rlci5mcm9tQ2x1c3RlckF0dHJpYnV0ZXMoc3RhY2ssICdJbXBvcnRlZENsdXN0ZXInLCB7XG4gICAgICBjbHVzdGVyTmFtZTogY2x1c3Rlci5jbHVzdGVyTmFtZSxcbiAgICAgIG9wZW5JZENvbm5lY3RQcm92aWRlcjogY2x1c3Rlci5vcGVuSWRDb25uZWN0UHJvdmlkZXIsXG4gICAgICBjbHVzdGVyRW5kcG9pbnQ6IGNsdXN0ZXIuY2x1c3RlckVuZHBvaW50LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGltcG9ydGVkQ2x1c3RlciwgYXNnKSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHVzZXJEYXRhKS50b0VxdWFsKFtcbiAgICAgICdzZXQgLW8geHRyYWNlJyxcbiAgICAgIHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICcvZXRjL2Vrcy9ib290c3RyYXAuc2ggJyxcbiAgICAgICAgICAgIHsgUmVmOiAnY2x1c3RlckM1QjI1RDBEJyB9LFxuICAgICAgICAgICAgJyAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS11c2UtbWF4LXBvZHMgdHJ1ZScsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICAnL29wdC9hd3MvYmluL2Nmbi1zaWduYWwgLS1leGl0LWNvZGUgJD8gLS1zdGFjayBteS1zdGFjayAtLXJlc291cmNlIEFTRzQ2RUQzMDcwIC0tcmVnaW9uIHVzLXdlc3QtMzMnLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCctLXVzZS1tYXgtcG9kcz10cnVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAgdXNlTWF4UG9kczogdHJ1ZSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFxuICAgICAgdXNlckRhdGFbMV0sXG4gICAgKS50b0VxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICAnL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsXG4gICAgICAgICAgeyBSZWY6ICdjbHVzdGVyQzVCMjVEMEQnIH0sXG4gICAgICAgICAgJyAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgXFwnJyxcbiAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydjbHVzdGVyQzVCMjVEMEQnLCAnRW5kcG9pbnQnXSB9LFxuICAgICAgICAgIFwiJyAtLWI2NC1jbHVzdGVyLWNhICdcIixcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnY2x1c3RlckM1QjI1RDBEJywgJ0NlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSddLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCInIC0tdXNlLW1heC1wb2RzIHRydWVcIixcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJy0tdXNlLW1heC1wb2RzPWZhbHNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAgdXNlTWF4UG9kczogZmFsc2UsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChcbiAgICAgIHVzZXJEYXRhWzFdLFxuICAgICkudG9FcXVhbChcbiAgICAgIHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICcvZXRjL2Vrcy9ib290c3RyYXAuc2ggJyxcbiAgICAgICAgICAgIHsgUmVmOiAnY2x1c3RlckM1QjI1RDBEJyB9LFxuICAgICAgICAgICAgJyAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgXFwnJyxcbiAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ2NsdXN0ZXJDNUIyNUQwRCcsICdFbmRwb2ludCddIH0sXG4gICAgICAgICAgICBcIicgLS1iNjQtY2x1c3Rlci1jYSAnXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydjbHVzdGVyQzVCMjVEMEQnLCAnQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCInIC0tdXNlLW1heC1wb2RzIGZhbHNlXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG5cbiAgdGVzdCgnLS1hd3MtYXBpLXJldHJ5LWF0dGVtcHRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAgYXdzQXBpUmV0cnlBdHRlbXB0czogMTIzLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoXG4gICAgICB1c2VyRGF0YVsxXSxcbiAgICApLnRvRXF1YWwoXG4gICAgICB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsXG4gICAgICAgICAgICB7IFJlZjogJ2NsdXN0ZXJDNUIyNUQwRCcgfSxcbiAgICAgICAgICAgICcgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZFwiIC0tYXBpc2VydmVyLWVuZHBvaW50IFxcJycsXG4gICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydjbHVzdGVyQzVCMjVEMEQnLCAnRW5kcG9pbnQnXSB9LFxuICAgICAgICAgICAgXCInIC0tYjY0LWNsdXN0ZXItY2EgJ1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnY2x1c3RlckM1QjI1RDBEJywgJ0NlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJyAtLXVzZS1tYXgtcG9kcyB0cnVlIC0tYXdzLWFwaS1yZXRyeS1hdHRlbXB0cyAxMjNcIixcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCctLWRucy1jbHVzdGVyLWlwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAgZG5zQ2x1c3RlcklwOiAnMTkyLjAuMi41MycsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChcbiAgICAgIHVzZXJEYXRhWzFdLFxuICAgICkudG9FcXVhbChcbiAgICAgIHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICcvZXRjL2Vrcy9ib290c3RyYXAuc2ggJyxcbiAgICAgICAgICAgIHsgUmVmOiAnY2x1c3RlckM1QjI1RDBEJyB9LFxuICAgICAgICAgICAgJyAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgXFwnJyxcbiAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ2NsdXN0ZXJDNUIyNUQwRCcsICdFbmRwb2ludCddIH0sXG4gICAgICAgICAgICBcIicgLS1iNjQtY2x1c3Rlci1jYSAnXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydjbHVzdGVyQzVCMjVEMEQnLCAnQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCInIC0tdXNlLW1heC1wb2RzIHRydWUgLS1kbnMtY2x1c3Rlci1pcCAxOTIuMC4yLjUzXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG5cbiAgdGVzdCgnLS1kb2NrZXItY29uZmlnLWpzb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IGFzZywgc3RhY2ssIGNsdXN0ZXIgfSA9IG5ld0ZpeHR1cmVzKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBzdGFjay5yZXNvbHZlKHJlbmRlckFtYXpvbkxpbnV4VXNlckRhdGEoY2x1c3RlciwgYXNnLCB7XG4gICAgICBkb2NrZXJDb25maWdKc29uOiAne1wiZG9ja2VyXCI6MTIzfScsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChcbiAgICAgIHVzZXJEYXRhWzFdLFxuICAgICkudG9FcXVhbChcbiAgICAgIHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICcvZXRjL2Vrcy9ib290c3RyYXAuc2ggJyxcbiAgICAgICAgICAgIHsgUmVmOiAnY2x1c3RlckM1QjI1RDBEJyB9LFxuICAgICAgICAgICAgJyAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgXFwnJyxcbiAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ2NsdXN0ZXJDNUIyNUQwRCcsICdFbmRwb2ludCddIH0sXG4gICAgICAgICAgICBcIicgLS1iNjQtY2x1c3Rlci1jYSAnXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydjbHVzdGVyQzVCMjVEMEQnLCAnQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcJyAtLXVzZS1tYXgtcG9kcyB0cnVlIC0tZG9ja2VyLWNvbmZpZy1qc29uIFxcJ3tcImRvY2tlclwiOjEyM31cXCcnLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJy0tZW5hYmxlLWRvY2tlci1icmlkZ2U9dHJ1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgYXNnLCBzdGFjaywgY2x1c3RlciB9ID0gbmV3Rml4dHVyZXMoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IHN0YWNrLnJlc29sdmUocmVuZGVyQW1hem9uTGludXhVc2VyRGF0YShjbHVzdGVyLCBhc2csIHtcbiAgICAgIGVuYWJsZURvY2tlckJyaWRnZTogdHJ1ZSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFxuICAgICAgdXNlckRhdGFbMV0sXG4gICAgKS50b0VxdWFsKFxuICAgICAge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAnLFxuICAgICAgICAgICAgeyBSZWY6ICdjbHVzdGVyQzVCMjVEMEQnIH0sXG4gICAgICAgICAgICAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9T25EZW1hbmRcIiAtLWFwaXNlcnZlci1lbmRwb2ludCBcXCcnLFxuICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnY2x1c3RlckM1QjI1RDBEJywgJ0VuZHBvaW50J10gfSxcbiAgICAgICAgICAgIFwiJyAtLWI2NC1jbHVzdGVyLWNhICdcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ2NsdXN0ZXJDNUIyNUQwRCcsICdDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIicgLS11c2UtbWF4LXBvZHMgdHJ1ZSAtLWVuYWJsZS1kb2NrZXItYnJpZGdlIHRydWVcIixcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCctLWVuYWJsZS1kb2NrZXItYnJpZGdlPWZhbHNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAgZW5hYmxlRG9ja2VyQnJpZGdlOiBmYWxzZSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFxuICAgICAgdXNlckRhdGFbMV0sXG4gICAgKS50b0VxdWFsKFxuICAgICAge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAnLFxuICAgICAgICAgICAgeyBSZWY6ICdjbHVzdGVyQzVCMjVEMEQnIH0sXG4gICAgICAgICAgICAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9T25EZW1hbmRcIiAtLWFwaXNlcnZlci1lbmRwb2ludCBcXCcnLFxuICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnY2x1c3RlckM1QjI1RDBEJywgJ0VuZHBvaW50J10gfSxcbiAgICAgICAgICAgIFwiJyAtLWI2NC1jbHVzdGVyLWNhICdcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ2NsdXN0ZXJDNUIyNUQwRCcsICdDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIicgLS11c2UtbWF4LXBvZHMgdHJ1ZVwiLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJy0ta3ViZWxldC1leHRyYS1hcmdzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAga3ViZWxldEV4dHJhQXJnczogJy0tZXh0cmEtYXJncy1mb3IgLS1rdWJlbGV0JyxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFxuICAgICAgdXNlckRhdGFbMV0sXG4gICAgKS50b0VxdWFsKFxuICAgICAge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAnLFxuICAgICAgICAgICAgeyBSZWY6ICdjbHVzdGVyQzVCMjVEMEQnIH0sXG4gICAgICAgICAgICAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9T25EZW1hbmQgIC0tZXh0cmEtYXJncy1mb3IgLS1rdWJlbGV0XCIgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgXFwnJyxcbiAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ2NsdXN0ZXJDNUIyNUQwRCcsICdFbmRwb2ludCddIH0sXG4gICAgICAgICAgICBcIicgLS1iNjQtY2x1c3Rlci1jYSAnXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydjbHVzdGVyQzVCMjVEMEQnLCAnQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCInIC0tdXNlLW1heC1wb2RzIHRydWVcIixcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCdhcmJpdHJhcnkgYWRkaXRpb25hbCBib290c3RyYXAgYXJndW1lbnRzIGNhbiBiZSBwYXNzZWQgdGhyb3VnaCBcImFkZGl0aW9uYWxBcmdzXCInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IGFzZywgc3RhY2ssIGNsdXN0ZXIgfSA9IG5ld0ZpeHR1cmVzKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBzdGFjay5yZXNvbHZlKHJlbmRlckFtYXpvbkxpbnV4VXNlckRhdGEoY2x1c3RlciwgYXNnLCB7XG4gICAgICBhZGRpdGlvbmFsQXJnczogJy0tYXBpc2VydmVyLWVuZHBvaW50IDExMTEgLS1mb28tYmFyJyxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgLy8gTkI6IGR1cGxpY2F0ZWQgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgaXMgZmluZS4gIExhc3Qgd2lucy5cbiAgICBleHBlY3QoXG4gICAgICB1c2VyRGF0YVsxXSxcbiAgICApLnRvRXF1YWwoXG4gICAgICB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsXG4gICAgICAgICAgICB7IFJlZjogJ2NsdXN0ZXJDNUIyNUQwRCcgfSxcbiAgICAgICAgICAgICcgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZFwiIC0tYXBpc2VydmVyLWVuZHBvaW50IFxcJycsXG4gICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydjbHVzdGVyQzVCMjVEMEQnLCAnRW5kcG9pbnQnXSB9LFxuICAgICAgICAgICAgXCInIC0tYjY0LWNsdXN0ZXItY2EgJ1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnY2x1c3RlckM1QjI1RDBEJywgJ0NlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJyAtLXVzZS1tYXgtcG9kcyB0cnVlIC0tYXBpc2VydmVyLWVuZHBvaW50IDExMTEgLS1mb28tYmFyXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG5cbiAgdGVzdCgnaWYgYXNnIGhhcyBzcG90IGluc3RhbmNlcywgdGhlIGNvcnJlY3QgbGFiZWwgYW5kIHRhaW50IGlzIHVzZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IGFzZywgc3RhY2ssIGNsdXN0ZXIgfSA9IG5ld0ZpeHR1cmVzKHRydWUpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAga3ViZWxldEV4dHJhQXJnczogJy0tbm9kZS1sYWJlbHMgWD15JyxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFxuICAgICAgdXNlckRhdGFbMV0sXG4gICAgKS50b0VxdWFsKFxuICAgICAge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAnLFxuICAgICAgICAgICAgeyBSZWY6ICdjbHVzdGVyQzVCMjVEMEQnIH0sXG4gICAgICAgICAgICAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9RWMyU3BvdCAtLXJlZ2lzdGVyLXdpdGgtdGFpbnRzPXNwb3RJbnN0YW5jZT10cnVlOlByZWZlck5vU2NoZWR1bGUgLS1ub2RlLWxhYmVscyBYPXlcIiAtLWFwaXNlcnZlci1lbmRwb2ludCBcXCcnLFxuICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnY2x1c3RlckM1QjI1RDBEJywgJ0VuZHBvaW50J10gfSxcbiAgICAgICAgICAgIFwiJyAtLWI2NC1jbHVzdGVyLWNhICdcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ2NsdXN0ZXJDNUIyNUQwRCcsICdDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIicgLS11c2UtbWF4LXBvZHMgdHJ1ZVwiLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIG5ld0ZpeHR1cmVzKHNwb3QgPSBmYWxzZSkge1xuICBjb25zdCBhcHAgPSBuZXcgQXBwKCk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ215LXN0YWNrJywgeyBlbnY6IHsgcmVnaW9uOiAndXMtd2VzdC0zMycgfSB9KTtcbiAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICd2cGMnKTtcbiAgY29uc3QgY2x1c3RlciA9IG5ldyBDbHVzdGVyKHN0YWNrLCAnY2x1c3RlcicsIHtcbiAgICB2ZXJzaW9uOiBLdWJlcm5ldGVzVmVyc2lvbi5WMV8yMSxcbiAgICBjbHVzdGVyTmFtZTogJ215LWNsdXN0ZXItbmFtZScsXG4gICAgdnBjLFxuICB9KTtcbiAgY29uc3QgYXNnID0gbmV3IGF1dG9zY2FsaW5nLkF1dG9TY2FsaW5nR3JvdXAoc3RhY2ssICdBU0cnLCB7XG4gICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTQueGxhcmdlJyksXG4gICAgbWFjaGluZUltYWdlOiBuZXcgZWMyLkFtYXpvbkxpbnV4SW1hZ2UoKSxcbiAgICBzcG90UHJpY2U6IHNwb3QgPyAnMC4wMScgOiB1bmRlZmluZWQsXG4gICAgdnBjLFxuICB9KTtcblxuICByZXR1cm4geyBzdGFjaywgdnBjLCBjbHVzdGVyLCBhc2cgfTtcbn1cbiJdfQ==