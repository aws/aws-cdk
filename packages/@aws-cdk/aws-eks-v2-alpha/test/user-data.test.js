"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autoscaling = require("aws-cdk-lib/aws-autoscaling");
const ec2 = require("aws-cdk-lib/aws-ec2");
const util_1 = require("./util");
const cluster_1 = require("../lib/cluster");
const user_data_1 = require("../lib/user-data");
describe('user data', () => {
    test('default user data', () => {
        // GIVEN
        const { asg, stack, cluster } = newFixtures();
        // WHEN
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(cluster, asg));
        // THEN
        expect(userData).toEqual([
            'set -o xtrace',
            {
                'Fn::Join': [
                    '',
                    [
                        '/etc/eks/bootstrap.sh ',
                        { Ref: 'ClusterEB0386A7' },
                        ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
                        { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] },
                        "' --b64-cluster-ca '",
                        {
                            'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'],
                        },
                        "' --use-max-pods true",
                    ],
                ],
            },
            '/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ASG46ED3070 --region us-east-1',
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
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(importedCluster, asg));
        // THEN
        expect(userData).toEqual([
            'set -o xtrace',
            {
                'Fn::Join': [
                    '',
                    [
                        '/etc/eks/bootstrap.sh ',
                        { Ref: 'ClusterEB0386A7' },
                        ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true',
                    ],
                ],
            },
            '/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ASG46ED3070 --region us-east-1',
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
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(importedCluster, asg));
        // THEN
        expect(userData).toEqual([
            'set -o xtrace',
            {
                'Fn::Join': [
                    '',
                    [
                        '/etc/eks/bootstrap.sh ',
                        { Ref: 'ClusterEB0386A7' },
                        ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true',
                    ],
                ],
            },
            '/opt/aws/bin/cfn-signal --exit-code $? --stack Stack --resource ASG46ED3070 --region us-east-1',
        ]);
    });
    test('--use-max-pods=true', () => {
        // GIVEN
        const { asg, stack, cluster } = newFixtures();
        // WHEN
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(cluster, asg, {
            useMaxPods: true,
        }));
        // THEN
        expect(userData[1]).toEqual({
            'Fn::Join': [
                '',
                [
                    '/etc/eks/bootstrap.sh ',
                    { Ref: 'ClusterEB0386A7' },
                    ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
                    { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] },
                    "' --b64-cluster-ca '",
                    {
                        'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'],
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
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(cluster, asg, {
            useMaxPods: false,
        }));
        // THEN
        expect(userData[1]).toEqual({
            'Fn::Join': [
                '',
                [
                    '/etc/eks/bootstrap.sh ',
                    { Ref: 'ClusterEB0386A7' },
                    ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
                    { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] },
                    "' --b64-cluster-ca '",
                    {
                        'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'],
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
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(cluster, asg, {
            awsApiRetryAttempts: 123,
        }));
        // THEN
        expect(userData[1]).toEqual({
            'Fn::Join': [
                '',
                [
                    '/etc/eks/bootstrap.sh ',
                    { Ref: 'ClusterEB0386A7' },
                    ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
                    { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] },
                    "' --b64-cluster-ca '",
                    {
                        'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'],
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
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(cluster, asg, {
            dnsClusterIp: '192.0.2.53',
        }));
        // THEN
        expect(userData[1]).toEqual({
            'Fn::Join': [
                '',
                [
                    '/etc/eks/bootstrap.sh ',
                    { Ref: 'ClusterEB0386A7' },
                    ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
                    { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] },
                    "' --b64-cluster-ca '",
                    {
                        'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'],
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
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(cluster, asg, {
            dockerConfigJson: '{"docker":123}',
        }));
        // THEN
        expect(userData[1]).toEqual({
            'Fn::Join': [
                '',
                [
                    '/etc/eks/bootstrap.sh ',
                    { Ref: 'ClusterEB0386A7' },
                    ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
                    { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] },
                    "' --b64-cluster-ca '",
                    {
                        'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'],
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
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(cluster, asg, {
            enableDockerBridge: true,
        }));
        // THEN
        expect(userData[1]).toEqual({
            'Fn::Join': [
                '',
                [
                    '/etc/eks/bootstrap.sh ',
                    { Ref: 'ClusterEB0386A7' },
                    ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
                    { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] },
                    "' --b64-cluster-ca '",
                    {
                        'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'],
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
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(cluster, asg, {
            enableDockerBridge: false,
        }));
        // THEN
        expect(userData[1]).toEqual({
            'Fn::Join': [
                '',
                [
                    '/etc/eks/bootstrap.sh ',
                    { Ref: 'ClusterEB0386A7' },
                    ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
                    { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] },
                    "' --b64-cluster-ca '",
                    {
                        'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'],
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
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(cluster, asg, {
            kubeletExtraArgs: '--extra-args-for --kubelet',
        }));
        // THEN
        expect(userData[1]).toEqual({
            'Fn::Join': [
                '',
                [
                    '/etc/eks/bootstrap.sh ',
                    { Ref: 'ClusterEB0386A7' },
                    ' --kubelet-extra-args "--node-labels lifecycle=OnDemand  --extra-args-for --kubelet" --apiserver-endpoint \'',
                    { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] },
                    "' --b64-cluster-ca '",
                    {
                        'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'],
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
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(cluster, asg, {
            additionalArgs: '--apiserver-endpoint 1111 --foo-bar',
        }));
        // THEN
        // NB: duplicated --apiserver-endpoint is fine.  Last wins.
        expect(userData[1]).toEqual({
            'Fn::Join': [
                '',
                [
                    '/etc/eks/bootstrap.sh ',
                    { Ref: 'ClusterEB0386A7' },
                    ' --kubelet-extra-args "--node-labels lifecycle=OnDemand" --apiserver-endpoint \'',
                    { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] },
                    "' --b64-cluster-ca '",
                    {
                        'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'],
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
        const userData = stack.resolve((0, user_data_1.renderAmazonLinuxUserData)(cluster, asg, {
            kubeletExtraArgs: '--node-labels X=y',
        }));
        // THEN
        expect(userData[1]).toEqual({
            'Fn::Join': [
                '',
                [
                    '/etc/eks/bootstrap.sh ',
                    { Ref: 'ClusterEB0386A7' },
                    ' --kubelet-extra-args "--node-labels lifecycle=Ec2Spot --register-with-taints=spotInstance=true:PreferNoSchedule --node-labels X=y" --apiserver-endpoint \'',
                    { 'Fn::GetAtt': ['ClusterEB0386A7', 'Endpoint'] },
                    "' --b64-cluster-ca '",
                    {
                        'Fn::GetAtt': ['ClusterEB0386A7', 'CertificateAuthorityData'],
                    },
                    "' --use-max-pods true",
                ],
            ],
        });
    });
});
function newFixtures(spot = false) {
    const { stack, cluster } = (0, util_1.testFixtureCluster)();
    const vpc = cluster.vpc;
    const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
        instanceType: new ec2.InstanceType('m4.xlarge'),
        machineImage: new ec2.AmazonLinuxImage(),
        spotPrice: spot ? '0.01' : undefined,
        vpc,
    });
    return { stack, vpc, cluster, asg };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1kYXRhLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2VyLWRhdGEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJEQUEyRDtBQUMzRCwyQ0FBMkM7QUFDM0MsaUNBQTRDO0FBQzVDLDRDQUF5QztBQUN6QyxnREFBNkQ7QUFFN0QsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDekIsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtRQUM3QixRQUFRO1FBQ1IsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsV0FBVyxFQUFFLENBQUM7UUFFOUMsT0FBTztRQUNQLE1BQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBQSxxQ0FBeUIsRUFBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUV4RSxPQUFPO1FBQ1AsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN2QixlQUFlO1lBQ2Y7Z0JBQ0UsVUFBVSxFQUFFO29CQUNWLEVBQUU7b0JBQ0Y7d0JBQ0Usd0JBQXdCO3dCQUN4QixFQUFFLEdBQUcsRUFBRSxpQkFBaUIsRUFBRTt3QkFDMUIsa0ZBQWtGO3dCQUNsRixFQUFFLFlBQVksRUFBRSxDQUFDLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxFQUFFO3dCQUNqRCxzQkFBc0I7d0JBQ3RCOzRCQUNFLFlBQVksRUFBRSxDQUFDLGlCQUFpQixFQUFFLDBCQUEwQixDQUFDO3lCQUM5RDt3QkFDRCx1QkFBdUI7cUJBQ3hCO2lCQUNGO2FBQ0Y7WUFDRCxnR0FBZ0c7U0FDakcsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1FBQ3BELFFBQVE7UUFDUixNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxXQUFXLEVBQUUs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R0FBRyxDQUFDO0lBQ3hCLE1BQU0sR0FBRyxHQUFHLElBQUksV0FBVyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7UUFDekQsWUFBWSxFQUFFLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7UUFDL0MsWUFBWSxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixFQUFFO1FBQ3hDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUztRQUNwQyxHQUFHO0tBQ0osQ0FBQyxDQUFDO0lBRUgsT0FBTyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3RDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhdXRvc2NhbGluZyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXV0b3NjYWxpbmcnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0IHsgdGVzdEZpeHR1cmVDbHVzdGVyIH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7IENsdXN0ZXIgfSBmcm9tICcuLi9saWIvY2x1c3Rlcic7XG5pbXBvcnQgeyByZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhIH0gZnJvbSAnLi4vbGliL3VzZXItZGF0YSc7XG5cbmRlc2NyaWJlKCd1c2VyIGRhdGEnLCAoKSA9PiB7XG4gIHRlc3QoJ2RlZmF1bHQgdXNlciBkYXRhJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZykpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh1c2VyRGF0YSkudG9FcXVhbChbXG4gICAgICAnc2V0IC1vIHh0cmFjZScsXG4gICAgICB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsXG4gICAgICAgICAgICB7IFJlZjogJ0NsdXN0ZXJFQjAzODZBNycgfSxcbiAgICAgICAgICAgICcgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZFwiIC0tYXBpc2VydmVyLWVuZHBvaW50IFxcJycsXG4gICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnRW5kcG9pbnQnXSB9LFxuICAgICAgICAgICAgXCInIC0tYjY0LWNsdXN0ZXItY2EgJ1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckVCMDM4NkE3JywgJ0NlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJyAtLXVzZS1tYXgtcG9kcyB0cnVlXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICAnL29wdC9hd3MvYmluL2Nmbi1zaWduYWwgLS1leGl0LWNvZGUgJD8gLS1zdGFjayBTdGFjayAtLXJlc291cmNlIEFTRzQ2RUQzMDcwIC0tcmVnaW9uIHVzLWVhc3QtMScsXG4gICAgXSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2ltcG9ydGVkIGNsdXN0ZXIgd2l0aG91dCBjbHVzdGVyRW5kcG9pbnQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IGFzZywgc3RhY2ssIGNsdXN0ZXIgfSA9IG5ld0ZpeHR1cmVzKCk7XG5cbiAgICBjb25zdCBpbXBvcnRlZENsdXN0ZXIgPSBDbHVzdGVyLmZyb21DbHVzdGVyQXR0cmlidXRlcyhzdGFjaywgJ0ltcG9ydGVkQ2x1c3RlcicsIHtcbiAgICAgIGNsdXN0ZXJOYW1lOiBjbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgb3BlbklkQ29ubmVjdFByb3ZpZGVyOiBjbHVzdGVyLm9wZW5JZENvbm5lY3RQcm92aWRlcixcbiAgICAgIGNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGE6IGNsdXN0ZXIuY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IHN0YWNrLnJlc29sdmUocmVuZGVyQW1hem9uTGludXhVc2VyRGF0YShpbXBvcnRlZENsdXN0ZXIsIGFzZykpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh1c2VyRGF0YSkudG9FcXVhbChbXG4gICAgICAnc2V0IC1vIHh0cmFjZScsXG4gICAgICB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsXG4gICAgICAgICAgICB7IFJlZjogJ0NsdXN0ZXJFQjAzODZBNycgfSxcbiAgICAgICAgICAgICcgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZFwiIC0tdXNlLW1heC1wb2RzIHRydWUnLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgJy9vcHQvYXdzL2Jpbi9jZm4tc2lnbmFsIC0tZXhpdC1jb2RlICQ/IC0tc3RhY2sgU3RhY2sgLS1yZXNvdXJjZSBBU0c0NkVEMzA3MCAtLXJlZ2lvbiB1cy1lYXN0LTEnLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCdpbXBvcnRlZCBjbHVzdGVyIHdpdGhvdXQgY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgYXNnLCBzdGFjaywgY2x1c3RlciB9ID0gbmV3Rml4dHVyZXMoKTtcblxuICAgIGNvbnN0IGltcG9ydGVkQ2x1c3RlciA9IENsdXN0ZXIuZnJvbUNsdXN0ZXJBdHRyaWJ1dGVzKHN0YWNrLCAnSW1wb3J0ZWRDbHVzdGVyJywge1xuICAgICAgY2x1c3Rlck5hbWU6IGNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICBvcGVuSWRDb25uZWN0UHJvdmlkZXI6IGNsdXN0ZXIub3BlbklkQ29ubmVjdFByb3ZpZGVyLFxuICAgICAgY2x1c3RlckVuZHBvaW50OiBjbHVzdGVyLmNsdXN0ZXJFbmRwb2ludCxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IHN0YWNrLnJlc29sdmUocmVuZGVyQW1hem9uTGludXhVc2VyRGF0YShpbXBvcnRlZENsdXN0ZXIsIGFzZykpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh1c2VyRGF0YSkudG9FcXVhbChbXG4gICAgICAnc2V0IC1vIHh0cmFjZScsXG4gICAgICB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsXG4gICAgICAgICAgICB7IFJlZjogJ0NsdXN0ZXJFQjAzODZBNycgfSxcbiAgICAgICAgICAgICcgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZFwiIC0tdXNlLW1heC1wb2RzIHRydWUnLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgJy9vcHQvYXdzL2Jpbi9jZm4tc2lnbmFsIC0tZXhpdC1jb2RlICQ/IC0tc3RhY2sgU3RhY2sgLS1yZXNvdXJjZSBBU0c0NkVEMzA3MCAtLXJlZ2lvbiB1cy1lYXN0LTEnLFxuICAgIF0pO1xuICB9KTtcblxuICB0ZXN0KCctLXVzZS1tYXgtcG9kcz10cnVlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAgdXNlTWF4UG9kczogdHJ1ZSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFxuICAgICAgdXNlckRhdGFbMV0sXG4gICAgKS50b0VxdWFsKHtcbiAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgJycsXG4gICAgICAgIFtcbiAgICAgICAgICAnL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsXG4gICAgICAgICAgeyBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnIH0sXG4gICAgICAgICAgJyAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgXFwnJyxcbiAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnRW5kcG9pbnQnXSB9LFxuICAgICAgICAgIFwiJyAtLWI2NC1jbHVzdGVyLWNhICdcIixcbiAgICAgICAgICB7XG4gICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckVCMDM4NkE3JywgJ0NlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSddLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCInIC0tdXNlLW1heC1wb2RzIHRydWVcIixcbiAgICAgICAgXSxcbiAgICAgIF0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJy0tdXNlLW1heC1wb2RzPWZhbHNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAgdXNlTWF4UG9kczogZmFsc2UsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChcbiAgICAgIHVzZXJEYXRhWzFdLFxuICAgICkudG9FcXVhbChcbiAgICAgIHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICcvZXRjL2Vrcy9ib290c3RyYXAuc2ggJyxcbiAgICAgICAgICAgIHsgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyB9LFxuICAgICAgICAgICAgJyAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgXFwnJyxcbiAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXJFQjAzODZBNycsICdFbmRwb2ludCddIH0sXG4gICAgICAgICAgICBcIicgLS1iNjQtY2x1c3Rlci1jYSAnXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCInIC0tdXNlLW1heC1wb2RzIGZhbHNlXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG5cbiAgdGVzdCgnLS1hd3MtYXBpLXJldHJ5LWF0dGVtcHRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAgYXdzQXBpUmV0cnlBdHRlbXB0czogMTIzLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoXG4gICAgICB1c2VyRGF0YVsxXSxcbiAgICApLnRvRXF1YWwoXG4gICAgICB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsXG4gICAgICAgICAgICB7IFJlZjogJ0NsdXN0ZXJFQjAzODZBNycgfSxcbiAgICAgICAgICAgICcgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZFwiIC0tYXBpc2VydmVyLWVuZHBvaW50IFxcJycsXG4gICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnRW5kcG9pbnQnXSB9LFxuICAgICAgICAgICAgXCInIC0tYjY0LWNsdXN0ZXItY2EgJ1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckVCMDM4NkE3JywgJ0NlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJyAtLXVzZS1tYXgtcG9kcyB0cnVlIC0tYXdzLWFwaS1yZXRyeS1hdHRlbXB0cyAxMjNcIixcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCctLWRucy1jbHVzdGVyLWlwJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAgZG5zQ2x1c3RlcklwOiAnMTkyLjAuMi41MycsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChcbiAgICAgIHVzZXJEYXRhWzFdLFxuICAgICkudG9FcXVhbChcbiAgICAgIHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICcvZXRjL2Vrcy9ib290c3RyYXAuc2ggJyxcbiAgICAgICAgICAgIHsgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyB9LFxuICAgICAgICAgICAgJyAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgXFwnJyxcbiAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXJFQjAzODZBNycsICdFbmRwb2ludCddIH0sXG4gICAgICAgICAgICBcIicgLS1iNjQtY2x1c3Rlci1jYSAnXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCInIC0tdXNlLW1heC1wb2RzIHRydWUgLS1kbnMtY2x1c3Rlci1pcCAxOTIuMC4yLjUzXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG5cbiAgdGVzdCgnLS1kb2NrZXItY29uZmlnLWpzb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IGFzZywgc3RhY2ssIGNsdXN0ZXIgfSA9IG5ld0ZpeHR1cmVzKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBzdGFjay5yZXNvbHZlKHJlbmRlckFtYXpvbkxpbnV4VXNlckRhdGEoY2x1c3RlciwgYXNnLCB7XG4gICAgICBkb2NrZXJDb25maWdKc29uOiAne1wiZG9ja2VyXCI6MTIzfScsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdChcbiAgICAgIHVzZXJEYXRhWzFdLFxuICAgICkudG9FcXVhbChcbiAgICAgIHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICcvZXRjL2Vrcy9ib290c3RyYXAuc2ggJyxcbiAgICAgICAgICAgIHsgUmVmOiAnQ2x1c3RlckVCMDM4NkE3JyB9LFxuICAgICAgICAgICAgJyAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgXFwnJyxcbiAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXJFQjAzODZBNycsICdFbmRwb2ludCddIH0sXG4gICAgICAgICAgICBcIicgLS1iNjQtY2x1c3Rlci1jYSAnXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ1xcJyAtLXVzZS1tYXgtcG9kcyB0cnVlIC0tZG9ja2VyLWNvbmZpZy1qc29uIFxcJ3tcImRvY2tlclwiOjEyM31cXCcnLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJy0tZW5hYmxlLWRvY2tlci1icmlkZ2U9dHJ1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgYXNnLCBzdGFjaywgY2x1c3RlciB9ID0gbmV3Rml4dHVyZXMoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IHN0YWNrLnJlc29sdmUocmVuZGVyQW1hem9uTGludXhVc2VyRGF0YShjbHVzdGVyLCBhc2csIHtcbiAgICAgIGVuYWJsZURvY2tlckJyaWRnZTogdHJ1ZSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFxuICAgICAgdXNlckRhdGFbMV0sXG4gICAgKS50b0VxdWFsKFxuICAgICAge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAnLFxuICAgICAgICAgICAgeyBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnIH0sXG4gICAgICAgICAgICAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9T25EZW1hbmRcIiAtLWFwaXNlcnZlci1lbmRwb2ludCBcXCcnLFxuICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckVCMDM4NkE3JywgJ0VuZHBvaW50J10gfSxcbiAgICAgICAgICAgIFwiJyAtLWI2NC1jbHVzdGVyLWNhICdcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXJFQjAzODZBNycsICdDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIicgLS11c2UtbWF4LXBvZHMgdHJ1ZSAtLWVuYWJsZS1kb2NrZXItYnJpZGdlIHRydWVcIixcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCctLWVuYWJsZS1kb2NrZXItYnJpZGdlPWZhbHNlJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAgZW5hYmxlRG9ja2VyQnJpZGdlOiBmYWxzZSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFxuICAgICAgdXNlckRhdGFbMV0sXG4gICAgKS50b0VxdWFsKFxuICAgICAge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAnLFxuICAgICAgICAgICAgeyBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnIH0sXG4gICAgICAgICAgICAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9T25EZW1hbmRcIiAtLWFwaXNlcnZlci1lbmRwb2ludCBcXCcnLFxuICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckVCMDM4NkE3JywgJ0VuZHBvaW50J10gfSxcbiAgICAgICAgICAgIFwiJyAtLWI2NC1jbHVzdGVyLWNhICdcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXJFQjAzODZBNycsICdDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIicgLS11c2UtbWF4LXBvZHMgdHJ1ZVwiLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xuXG4gIHRlc3QoJy0ta3ViZWxldC1leHRyYS1hcmdzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrLCBjbHVzdGVyIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAga3ViZWxldEV4dHJhQXJnczogJy0tZXh0cmEtYXJncy1mb3IgLS1rdWJlbGV0JyxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFxuICAgICAgdXNlckRhdGFbMV0sXG4gICAgKS50b0VxdWFsKFxuICAgICAge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAnLFxuICAgICAgICAgICAgeyBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnIH0sXG4gICAgICAgICAgICAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9T25EZW1hbmQgIC0tZXh0cmEtYXJncy1mb3IgLS1rdWJlbGV0XCIgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgXFwnJyxcbiAgICAgICAgICAgIHsgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXJFQjAzODZBNycsICdFbmRwb2ludCddIH0sXG4gICAgICAgICAgICBcIicgLS1iNjQtY2x1c3Rlci1jYSAnXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhJ10sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCInIC0tdXNlLW1heC1wb2RzIHRydWVcIixcbiAgICAgICAgICBdLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICApO1xuICB9KTtcblxuICB0ZXN0KCdhcmJpdHJhcnkgYWRkaXRpb25hbCBib290c3RyYXAgYXJndW1lbnRzIGNhbiBiZSBwYXNzZWQgdGhyb3VnaCBcImFkZGl0aW9uYWxBcmdzXCInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IGFzZywgc3RhY2ssIGNsdXN0ZXIgfSA9IG5ld0ZpeHR1cmVzKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBzdGFjay5yZXNvbHZlKHJlbmRlckFtYXpvbkxpbnV4VXNlckRhdGEoY2x1c3RlciwgYXNnLCB7XG4gICAgICBhZGRpdGlvbmFsQXJnczogJy0tYXBpc2VydmVyLWVuZHBvaW50IDExMTEgLS1mb28tYmFyJyxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgLy8gTkI6IGR1cGxpY2F0ZWQgLS1hcGlzZXJ2ZXItZW5kcG9pbnQgaXMgZmluZS4gIExhc3Qgd2lucy5cbiAgICBleHBlY3QoXG4gICAgICB1c2VyRGF0YVsxXSxcbiAgICApLnRvRXF1YWwoXG4gICAgICB7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnL2V0Yy9la3MvYm9vdHN0cmFwLnNoICcsXG4gICAgICAgICAgICB7IFJlZjogJ0NsdXN0ZXJFQjAzODZBNycgfSxcbiAgICAgICAgICAgICcgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZFwiIC0tYXBpc2VydmVyLWVuZHBvaW50IFxcJycsXG4gICAgICAgICAgICB7ICdGbjo6R2V0QXR0JzogWydDbHVzdGVyRUIwMzg2QTcnLCAnRW5kcG9pbnQnXSB9LFxuICAgICAgICAgICAgXCInIC0tYjY0LWNsdXN0ZXItY2EgJ1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckVCMDM4NkE3JywgJ0NlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwiJyAtLXVzZS1tYXgtcG9kcyB0cnVlIC0tYXBpc2VydmVyLWVuZHBvaW50IDExMTEgLS1mb28tYmFyXCIsXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgKTtcbiAgfSk7XG5cbiAgdGVzdCgnaWYgYXNnIGhhcyBzcG90IGluc3RhbmNlcywgdGhlIGNvcnJlY3QgbGFiZWwgYW5kIHRhaW50IGlzIHVzZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IGFzZywgc3RhY2ssIGNsdXN0ZXIgfSA9IG5ld0ZpeHR1cmVzKHRydWUpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJBbWF6b25MaW51eFVzZXJEYXRhKGNsdXN0ZXIsIGFzZywge1xuICAgICAga3ViZWxldEV4dHJhQXJnczogJy0tbm9kZS1sYWJlbHMgWD15JyxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KFxuICAgICAgdXNlckRhdGFbMV0sXG4gICAgKS50b0VxdWFsKFxuICAgICAge1xuICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgJycsXG4gICAgICAgICAgW1xuICAgICAgICAgICAgJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAnLFxuICAgICAgICAgICAgeyBSZWY6ICdDbHVzdGVyRUIwMzg2QTcnIH0sXG4gICAgICAgICAgICAnIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9RWMyU3BvdCAtLXJlZ2lzdGVyLXdpdGgtdGFpbnRzPXNwb3RJbnN0YW5jZT10cnVlOlByZWZlck5vU2NoZWR1bGUgLS1ub2RlLWxhYmVscyBYPXlcIiAtLWFwaXNlcnZlci1lbmRwb2ludCBcXCcnLFxuICAgICAgICAgICAgeyAnRm46OkdldEF0dCc6IFsnQ2x1c3RlckVCMDM4NkE3JywgJ0VuZHBvaW50J10gfSxcbiAgICAgICAgICAgIFwiJyAtLWI2NC1jbHVzdGVyLWNhICdcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ0ZuOjpHZXRBdHQnOiBbJ0NsdXN0ZXJFQjAzODZBNycsICdDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEnXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIicgLS11c2UtbWF4LXBvZHMgdHJ1ZVwiLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICk7XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIG5ld0ZpeHR1cmVzKHNwb3QgPSBmYWxzZSkge1xuICBjb25zdCB7IHN0YWNrLCBjbHVzdGVyIH0gPSB0ZXN0Rml4dHVyZUNsdXN0ZXIoKTtcbiAgY29uc3QgdnBjID0gY2x1c3Rlci52cGM7XG4gIGNvbnN0IGFzZyA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnQVNHJywge1xuICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ200LnhsYXJnZScpLFxuICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgc3BvdFByaWNlOiBzcG90ID8gJzAuMDEnIDogdW5kZWZpbmVkLFxuICAgIHZwYyxcbiAgfSk7XG5cbiAgcmV0dXJuIHsgc3RhY2ssIHZwYywgY2x1c3RlciwgYXNnIH07XG59XG4iXX0=