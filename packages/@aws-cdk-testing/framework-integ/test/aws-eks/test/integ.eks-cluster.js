"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const path = require("path");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const kms = require("aws-cdk-lib/aws-kms");
const aws_s3_assets_1 = require("aws-cdk-lib/aws-s3-assets");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const cdk8s = require("cdk8s");
const kplus = require("cdk8s-plus-24");
const hello = require("./hello-k8s");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const eks = require("aws-cdk-lib/aws-eks");
class EksClusterStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // allow all account users to assume this role in order to admin the cluster
        const mastersRole = new iam.Role(this, 'AdminRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        const secretsEncryptionKey = new kms.Key(this, 'SecretsKey');
        // just need one nat gateway to simplify the test
        this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });
        // Changing the subnets order should be supported
        const vpcSubnets = [
            { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
            { subnetType: ec2.SubnetType.PUBLIC },
        ];
        // create the cluster with a default nodegroup capacity
        this.cluster = new eks.Cluster(this, 'Cluster', {
            vpc: this.vpc,
            vpcSubnets,
            mastersRole,
            defaultCapacity: 2,
            ...(0, integ_tests_kubernetes_version_1.getClusterVersionConfig)(this),
            secretsEncryptionKey,
            tags: {
                foo: 'bar',
            },
            clusterLogging: [
                eks.ClusterLoggingTypes.API,
                eks.ClusterLoggingTypes.AUTHENTICATOR,
                eks.ClusterLoggingTypes.SCHEDULER,
            ],
        });
        this.assertFargateProfile();
        this.assertCapacityX86();
        this.assertCapacityArm();
        this.assertBottlerocket();
        this.assertSpotCapacity();
        this.assertNodeGroupX86();
        this.assertNodeGroupSpot();
        this.assertNodeGroupArm();
        this.assertNodeGroupGraviton3();
        this.assertNodeGroupCustomAmi();
        this.assertSimpleManifest();
        this.assertManifestWithoutValidation();
        this.assertSimpleHelmChart();
        this.assertHelmChartAsset();
        this.assertSimpleCdk8sChart();
        this.assertCreateNamespace();
        this.assertServiceAccount();
        this.assertExtendedServiceAccount();
        new aws_cdk_lib_1.CfnOutput(this, 'ClusterEndpoint', { value: this.cluster.clusterEndpoint });
        new aws_cdk_lib_1.CfnOutput(this, 'ClusterArn', { value: this.cluster.clusterArn });
        new aws_cdk_lib_1.CfnOutput(this, 'ClusterCertificateAuthorityData', { value: this.cluster.clusterCertificateAuthorityData });
        new aws_cdk_lib_1.CfnOutput(this, 'ClusterSecurityGroupId', { value: this.cluster.clusterSecurityGroupId });
        new aws_cdk_lib_1.CfnOutput(this, 'ClusterEncryptionConfigKeyArn', { value: this.cluster.clusterEncryptionConfigKeyArn });
        new aws_cdk_lib_1.CfnOutput(this, 'ClusterName', { value: this.cluster.clusterName });
    }
    assertServiceAccount() {
        // add a service account connected to a IAM role
        this.cluster.addServiceAccount('MyServiceAccount');
    }
    assertExtendedServiceAccount() {
        // add a service account connected to a IAM role
        this.cluster.addServiceAccount('MyExtendedServiceAccount', {
            annotations: {
                'eks.amazonaws.com/sts-regional-endpoints': 'false',
            },
            labels: {
                'some-label': 'with-some-value',
            },
        });
    }
    assertCreateNamespace() {
        // deploy an nginx ingress in a namespace
        const nginxNamespace = this.cluster.addManifest('nginx-namespace', {
            apiVersion: 'v1',
            kind: 'Namespace',
            metadata: {
                name: 'nginx',
            },
        });
        const nginxIngress = this.cluster.addHelmChart('nginx-ingress', {
            chart: 'nginx-ingress',
            repository: 'https://helm.nginx.com/stable',
            namespace: 'nginx',
            wait: true,
            createNamespace: false,
            timeout: aws_cdk_lib_1.Duration.minutes(15),
        });
        // make sure namespace is deployed before the chart
        nginxIngress.node.addDependency(nginxNamespace);
    }
    assertSimpleCdk8sChart() {
        class Chart extends cdk8s.Chart {
            constructor(scope, ns, cluster) {
                super(scope, ns);
                new kplus.ConfigMap(this, 'config-map', {
                    data: {
                        clusterName: cluster.clusterName,
                    },
                });
            }
        }
        const app = new cdk8s.App();
        const chart = new Chart(app, 'Chart', this.cluster);
        this.cluster.addCdk8sChart('cdk8s-chart', chart);
    }
    assertSimpleHelmChart() {
        // deploy the Kubernetes dashboard through a helm chart
        this.cluster.addHelmChart('dashboard', {
            chart: 'kubernetes-dashboard',
            repository: 'https://kubernetes.github.io/dashboard/',
        });
    }
    assertHelmChartAsset() {
        // get helm chart from Asset
        const chartAsset = new aws_s3_assets_1.Asset(this, 'ChartAsset', {
            path: path.join(__dirname, 'test-chart'),
        });
        this.cluster.addHelmChart('test-chart', {
            chartAsset: chartAsset,
        });
    }
    assertSimpleManifest() {
        // apply a kubernetes manifest
        this.cluster.addManifest('HelloApp', ...hello.resources);
    }
    assertManifestWithoutValidation() {
        // apply a kubernetes manifest
        new eks.KubernetesManifest(this, 'HelloAppWithoutValidation', {
            cluster: this.cluster,
            manifest: [{
                    apiVersion: 'v1',
                    kind: 'ConfigMap',
                    data: { hello: 'world' },
                    metadata: { name: 'config-map' },
                    unknown: { key: 'value' },
                }],
            skipValidation: true,
        });
    }
    assertNodeGroupX86() {
        // add a extra nodegroup
        this.cluster.addNodegroupCapacity('extra-ng', {
            instanceTypes: [new ec2.InstanceType('t3.small')],
            minSize: 1,
            // reusing the default capacity nodegroup instance role when available
            nodeRole: this.cluster.defaultCapacity ? this.cluster.defaultCapacity.role : undefined,
        });
    }
    assertNodeGroupSpot() {
        // add a extra nodegroup
        this.cluster.addNodegroupCapacity('extra-ng-spot', {
            instanceTypes: [
                new ec2.InstanceType('c5.large'),
                new ec2.InstanceType('c5a.large'),
                new ec2.InstanceType('c5d.large'),
            ],
            minSize: 3,
            // reusing the default capacity nodegroup instance role when available
            nodeRole: this.cluster.defaultCapacity ? this.cluster.defaultCapacity.role : undefined,
            capacityType: eks.CapacityType.SPOT,
        });
    }
    assertNodeGroupCustomAmi() {
        // add a extra nodegroup
        const userData = ec2.UserData.forLinux();
        userData.addCommands('set -o xtrace', `/etc/eks/bootstrap.sh ${this.cluster.clusterName}`);
        const lt = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
            launchTemplateData: {
                imageId: new eks.EksOptimizedImage({
                    kubernetesVersion: eks.KubernetesVersion.V1_25.version,
                }).getImage(this).imageId,
                instanceType: new ec2.InstanceType('t3.small').toString(),
                userData: aws_cdk_lib_1.Fn.base64(userData.render()),
            },
        });
        this.cluster.addNodegroupCapacity('extra-ng2', {
            minSize: 1,
            // reusing the default capacity nodegroup instance role when available
            nodeRole: this.cluster.defaultNodegroup?.role || this.cluster.defaultCapacity?.role,
            launchTemplateSpec: {
                id: lt.ref,
                version: lt.attrDefaultVersionNumber,
            },
        });
    }
    assertNodeGroupArm() {
        // add a extra nodegroup
        this.cluster.addNodegroupCapacity('extra-ng-arm', {
            instanceTypes: [new ec2.InstanceType('m6g.medium')],
            minSize: 1,
            // reusing the default capacity nodegroup instance role when available
            nodeRole: this.cluster.defaultCapacity ? this.cluster.defaultCapacity.role : undefined,
        });
    }
    assertNodeGroupGraviton3() {
        // add a Graviton3 nodegroup
        this.cluster.addNodegroupCapacity('extra-ng-arm3', {
            instanceTypes: [new ec2.InstanceType('c7g.large')],
            minSize: 1,
            // reusing the default capacity nodegroup instance role when available
            nodeRole: this.cluster.defaultCapacity ? this.cluster.defaultCapacity.role : undefined,
        });
    }
    assertSpotCapacity() {
        // spot instances (up to 10)
        this.cluster.addAutoScalingGroupCapacity('spot', {
            spotPrice: '0.1094',
            instanceType: new ec2.InstanceType('t3.large'),
            maxCapacity: 10,
            bootstrapOptions: {
                kubeletExtraArgs: '--node-labels foo=bar,goo=far',
                awsApiRetryAttempts: 5,
            },
        });
    }
    assertBottlerocket() {
        // add bottlerocket nodes
        this.cluster.addAutoScalingGroupCapacity('BottlerocketNodes', {
            instanceType: new ec2.InstanceType('t3.small'),
            minCapacity: 2,
            machineImageType: eks.MachineImageType.BOTTLEROCKET,
        });
    }
    assertCapacityX86() {
        // add some x86_64 capacity to the cluster. The IAM instance role will
        // automatically be mapped via aws-auth to allow nodes to join the cluster.
        this.cluster.addAutoScalingGroupCapacity('Nodes', {
            instanceType: new ec2.InstanceType('t2.medium'),
            minCapacity: 3,
        });
    }
    assertCapacityArm() {
        // add some arm64 capacity to the cluster. The IAM instance role will
        // automatically be mapped via aws-auth to allow nodes to join the cluster.
        this.cluster.addAutoScalingGroupCapacity('NodesArm', {
            instanceType: new ec2.InstanceType('m6g.medium'),
            minCapacity: 1,
        });
    }
    assertFargateProfile() {
        // fargate profile for resources in the "default" namespace
        this.cluster.addFargateProfile('default', {
            selectors: [{ namespace: 'default' }],
        });
    }
}
// this test uses both the bottlerocket image and the inf1 instance, which are only supported in these
// regions. see https://github.com/aws/aws-cdk/tree/main/packages/%40aws-cdk/aws-eks#bottlerocket
// and https://aws.amazon.com/about-aws/whats-new/2019/12/introducing-amazon-ec2-inf1-instances-high-performance-and-the-lowest-cost-machine-learning-inference-in-the-cloud/
const supportedRegions = [
    'us-east-1',
    'us-west-2',
];
const app = new aws_cdk_lib_1.App();
// since the EKS optimized AMI is hard-coded here based on the region,
// we need to actually pass in a specific region.
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-test', {
    env: { region: 'us-east-1' },
});
if (process.env.CDK_INTEG_ACCOUNT !== '12345678') {
    // only validate if we are about to actually deploy.
    // TODO: better way to determine this, right now the 'CDK_INTEG_ACCOUNT' seems like the only way.
    if (aws_cdk_lib_1.Token.isUnresolved(stack.region)) {
        throw new Error(`region (${stack.region}) cannot be a token and must be configured to one of: ${supportedRegions}`);
    }
    if (!supportedRegions.includes(stack.region)) {
        throw new Error(`region (${stack.region}) must be configured to one of: ${supportedRegions}`);
    }
}
new integ.IntegTest(app, 'aws-cdk-eks-cluster', {
    testCases: [stack],
    cdkCommandOptions: {
        deploy: {
            args: {
                rollback: true,
            },
        },
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWNsdXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3MtY2x1c3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsNkRBQWtEO0FBQ2xELDZDQUFxRjtBQUNyRixvREFBb0Q7QUFDcEQsK0JBQStCO0FBQy9CLHVDQUF1QztBQUV2QyxxQ0FBcUM7QUFDckMscUZBQTJFO0FBQzNFLDJDQUEyQztBQUczQyxNQUFNLGVBQWdCLFNBQVEsbUJBQUs7SUFLakMsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDRFQUE0RTtRQUM1RSxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNsRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLEVBQUU7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTdELGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVuRSxpREFBaUQ7UUFDakQsTUFBTSxVQUFVLEdBQTBCO1lBQ3hDLEVBQUUsVUFBVSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsbUJBQW1CLEVBQUU7WUFDbEQsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7U0FDdEMsQ0FB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REFBb0Q7SUFDcEQsaUdBQWlHO0lBRWpHLElBQUksbUJBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3BDLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxLQUFLLENBQUMsTUFBTSx5REFBeUQsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0tBQ3JIO0lBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssQ0FBQyxNQUFNLG1DQUFtQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7S0FDL0Y7Q0FFRjtBQUVELElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUscUJBQXFCLEVBQUU7SUFDOUMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLGlCQUFpQixFQUFFO1FBQ2pCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRTtnQkFDSixRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTpkaXNhYmxlLXVwZGF0ZS13b3JrZmxvd1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mta21zJztcbmltcG9ydCB7IEFzc2V0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWFzc2V0cyc7XG5pbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgRHVyYXRpb24sIFRva2VuLCBGbiwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgKiBhcyBjZGs4cyBmcm9tICdjZGs4cyc7XG5pbXBvcnQgKiBhcyBrcGx1cyBmcm9tICdjZGs4cy1wbHVzLTI0JztcbmltcG9ydCAqIGFzIGNvbnN0cnVjdHMgZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBoZWxsbyBmcm9tICcuL2hlbGxvLWs4cyc7XG5pbXBvcnQgeyBnZXRDbHVzdGVyVmVyc2lvbkNvbmZpZyB9IGZyb20gJy4vaW50ZWctdGVzdHMta3ViZXJuZXRlcy12ZXJzaW9uJztcbmltcG9ydCAqIGFzIGVrcyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWtzJztcblxuXG5jbGFzcyBFa3NDbHVzdGVyU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG5cbiAgcHJpdmF0ZSBjbHVzdGVyOiBla3MuQ2x1c3RlcjtcbiAgcHJpdmF0ZSB2cGM6IGVjMi5JVnBjO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8gYWxsb3cgYWxsIGFjY291bnQgdXNlcnMgdG8gYXNzdW1lIHRoaXMgcm9sZSBpbiBvcmRlciB0byBhZG1pbiB0aGUgY2x1c3RlclxuICAgIGNvbnN0IG1hc3RlcnNSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdBZG1pblJvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uQWNjb3VudFJvb3RQcmluY2lwYWwoKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlY3JldHNFbmNyeXB0aW9uS2V5ID0gbmV3IGttcy5LZXkodGhpcywgJ1NlY3JldHNLZXknKTtcblxuICAgIC8vIGp1c3QgbmVlZCBvbmUgbmF0IGdhdGV3YXkgdG8gc2ltcGxpZnkgdGhlIHRlc3RcbiAgICB0aGlzLnZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWcGMnLCB7IG1heEF6czogMywgbmF0R2F0ZXdheXM6IDEgfSk7XG5cbiAgICAvLyBDaGFuZ2luZyB0aGUgc3VibmV0cyBvcmRlciBzaG91bGQgYmUgc3VwcG9ydGVkXG4gICAgY29uc3QgdnBjU3VibmV0czogZWMyLlN1Ym5ldFNlbGVjdGlvbltdID0gW1xuICAgICAgeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QUklWQVRFX1dJVEhfRUdSRVNTIH0sXG4gICAgICB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBVQkxJQyB9LFxuICAgIF07XG5cbiAgICAvLyBjcmVhdGUgdGhlIGNsdXN0ZXIgd2l0aCBhIGRlZmF1bHQgbm9kZWdyb3VwIGNhcGFjaXR5XG4gICAgdGhpcy5jbHVzdGVyID0gbmV3IGVrcy5DbHVzdGVyKHRoaXMsICdDbHVzdGVyJywge1xuICAgICAgdnBjOiB0aGlzLnZwYyxcbiAgICAgIHZwY1N1Ym5ldHMsXG4gICAgICBtYXN0ZXJzUm9sZSxcbiAgICAgIGRlZmF1bHRDYXBhY2l0eTogMixcbiAgICAgIC4uLmdldENsdXN0ZXJWZXJzaW9uQ29uZmlnKHRoaXMpLFxuICAgICAgc2VjcmV0c0VuY3J5cHRpb25LZXksXG4gICAgICB0YWdzOiB7XG4gICAgICAgIGZvbzogJ2JhcicsXG4gICAgICB9LFxuICAgICAgY2x1c3RlckxvZ2dpbmc6IFtcbiAgICAgICAgZWtzLkNsdXN0ZXJMb2dnaW5nVHlwZXMuQVBJLFxuICAgICAgICBla3MuQ2x1c3RlckxvZ2dpbmdUeXBlcy5BVVRIRU5USUNBVE9SLFxuICAgICAgICBla3MuQ2x1c3RlckxvZ2dpbmdUeXBlcy5TQ0hFRFVMRVIsXG4gICAgICBdLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hc3NlcnRGYXJnYXRlUHJvZmlsZSgpO1xuXG4gICAgdGhpcy5hc3NlcnRDYXBhY2l0eVg4NigpO1xuXG4gICAgdGhpcy5hc3NlcnRDYXBhY2l0eUFybSgpO1xuXG4gICAgdGhpcy5hc3NlcnRCb3R0bGVyb2NrZXQoKTtcblxuICAgIHRoaXMuYXNzZXJ0U3BvdENhcGFjaXR5KCk7XG5cbiAgICB0aGlzLmFzc2VydE5vZGVHcm91cFg4NigpO1xuXG4gICAgdGhpcy5hc3NlcnROb2RlR3JvdXBTcG90KCk7XG5cbiAgICB0aGlzLmFzc2VydE5vZGVHcm91cEFybSgpO1xuXG4gICAgdGhpcy5hc3NlcnROb2RlR3JvdXBHcmF2aXRvbjMoKTtcblxuICAgIHRoaXMuYXNzZXJ0Tm9kZUdyb3VwQ3VzdG9tQW1pKCk7XG5cbiAgICB0aGlzLmFzc2VydFNpbXBsZU1hbmlmZXN0KCk7XG5cbiAgICB0aGlzLmFzc2VydE1hbmlmZXN0V2l0aG91dFZhbGlkYXRpb24oKTtcblxuICAgIHRoaXMuYXNzZXJ0U2ltcGxlSGVsbUNoYXJ0KCk7XG5cbiAgICB0aGlzLmFzc2VydEhlbG1DaGFydEFzc2V0KCk7XG5cbiAgICB0aGlzLmFzc2VydFNpbXBsZUNkazhzQ2hhcnQoKTtcblxuICAgIHRoaXMuYXNzZXJ0Q3JlYXRlTmFtZXNwYWNlKCk7XG5cbiAgICB0aGlzLmFzc2VydFNlcnZpY2VBY2NvdW50KCk7XG5cbiAgICB0aGlzLmFzc2VydEV4dGVuZGVkU2VydmljZUFjY291bnQoKTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0NsdXN0ZXJFbmRwb2ludCcsIHsgdmFsdWU6IHRoaXMuY2x1c3Rlci5jbHVzdGVyRW5kcG9pbnQgfSk7XG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnQ2x1c3RlckFybicsIHsgdmFsdWU6IHRoaXMuY2x1c3Rlci5jbHVzdGVyQXJuIH0pO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0NsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEnLCB7IHZhbHVlOiB0aGlzLmNsdXN0ZXIuY2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YSB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdDbHVzdGVyU2VjdXJpdHlHcm91cElkJywgeyB2YWx1ZTogdGhpcy5jbHVzdGVyLmNsdXN0ZXJTZWN1cml0eUdyb3VwSWQgfSk7XG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnQ2x1c3RlckVuY3J5cHRpb25Db25maWdLZXlBcm4nLCB7IHZhbHVlOiB0aGlzLmNsdXN0ZXIuY2x1c3RlckVuY3J5cHRpb25Db25maWdLZXlBcm4gfSk7XG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnQ2x1c3Rlck5hbWUnLCB7IHZhbHVlOiB0aGlzLmNsdXN0ZXIuY2x1c3Rlck5hbWUgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydFNlcnZpY2VBY2NvdW50KCkge1xuICAgIC8vIGFkZCBhIHNlcnZpY2UgYWNjb3VudCBjb25uZWN0ZWQgdG8gYSBJQU0gcm9sZVxuICAgIHRoaXMuY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnTXlTZXJ2aWNlQWNjb3VudCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnRFeHRlbmRlZFNlcnZpY2VBY2NvdW50KCkge1xuICAgIC8vIGFkZCBhIHNlcnZpY2UgYWNjb3VudCBjb25uZWN0ZWQgdG8gYSBJQU0gcm9sZVxuICAgIHRoaXMuY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnTXlFeHRlbmRlZFNlcnZpY2VBY2NvdW50Jywge1xuICAgICAgYW5ub3RhdGlvbnM6IHtcbiAgICAgICAgJ2Vrcy5hbWF6b25hd3MuY29tL3N0cy1yZWdpb25hbC1lbmRwb2ludHMnOiAnZmFsc2UnLFxuICAgICAgfSxcbiAgICAgIGxhYmVsczoge1xuICAgICAgICAnc29tZS1sYWJlbCc6ICd3aXRoLXNvbWUtdmFsdWUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0Q3JlYXRlTmFtZXNwYWNlKCkge1xuICAgIC8vIGRlcGxveSBhbiBuZ2lueCBpbmdyZXNzIGluIGEgbmFtZXNwYWNlXG4gICAgY29uc3QgbmdpbnhOYW1lc3BhY2UgPSB0aGlzLmNsdXN0ZXIuYWRkTWFuaWZlc3QoJ25naW54LW5hbWVzcGFjZScsIHtcbiAgICAgIGFwaVZlcnNpb246ICd2MScsXG4gICAgICBraW5kOiAnTmFtZXNwYWNlJyxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIG5hbWU6ICduZ2lueCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgbmdpbnhJbmdyZXNzID0gdGhpcy5jbHVzdGVyLmFkZEhlbG1DaGFydCgnbmdpbngtaW5ncmVzcycsIHtcbiAgICAgIGNoYXJ0OiAnbmdpbngtaW5ncmVzcycsXG4gICAgICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9oZWxtLm5naW54LmNvbS9zdGFibGUnLFxuICAgICAgbmFtZXNwYWNlOiAnbmdpbngnLFxuICAgICAgd2FpdDogdHJ1ZSxcbiAgICAgIGNyZWF0ZU5hbWVzcGFjZTogZmFsc2UsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDE1KSxcbiAgICB9KTtcblxuICAgIC8vIG1ha2Ugc3VyZSBuYW1lc3BhY2UgaXMgZGVwbG95ZWQgYmVmb3JlIHRoZSBjaGFydFxuICAgIG5naW54SW5ncmVzcy5ub2RlLmFkZERlcGVuZGVuY3kobmdpbnhOYW1lc3BhY2UpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnRTaW1wbGVDZGs4c0NoYXJ0KCkge1xuXG4gICAgY2xhc3MgQ2hhcnQgZXh0ZW5kcyBjZGs4cy5DaGFydCB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIG5zOiBzdHJpbmcsIGNsdXN0ZXI6IGVrcy5JQ2x1c3Rlcikge1xuICAgICAgICBzdXBlcihzY29wZSwgbnMpO1xuXG4gICAgICAgIG5ldyBrcGx1cy5Db25maWdNYXAodGhpcywgJ2NvbmZpZy1tYXAnLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgY2x1c3Rlck5hbWU6IGNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG5cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgYXBwID0gbmV3IGNkazhzLkFwcCgpO1xuICAgIGNvbnN0IGNoYXJ0ID0gbmV3IENoYXJ0KGFwcCwgJ0NoYXJ0JywgdGhpcy5jbHVzdGVyKTtcblxuICAgIHRoaXMuY2x1c3Rlci5hZGRDZGs4c0NoYXJ0KCdjZGs4cy1jaGFydCcsIGNoYXJ0KTtcbiAgfVxuICBwcml2YXRlIGFzc2VydFNpbXBsZUhlbG1DaGFydCgpIHtcbiAgICAvLyBkZXBsb3kgdGhlIEt1YmVybmV0ZXMgZGFzaGJvYXJkIHRocm91Z2ggYSBoZWxtIGNoYXJ0XG4gICAgdGhpcy5jbHVzdGVyLmFkZEhlbG1DaGFydCgnZGFzaGJvYXJkJywge1xuICAgICAgY2hhcnQ6ICdrdWJlcm5ldGVzLWRhc2hib2FyZCcsXG4gICAgICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9rdWJlcm5ldGVzLmdpdGh1Yi5pby9kYXNoYm9hcmQvJyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0SGVsbUNoYXJ0QXNzZXQoKSB7XG4gICAgLy8gZ2V0IGhlbG0gY2hhcnQgZnJvbSBBc3NldFxuICAgIGNvbnN0IGNoYXJ0QXNzZXQgPSBuZXcgQXNzZXQodGhpcywgJ0NoYXJ0QXNzZXQnLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdC1jaGFydCcpLFxuICAgIH0pO1xuICAgIHRoaXMuY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ3Rlc3QtY2hhcnQnLCB7XG4gICAgICBjaGFydEFzc2V0OiBjaGFydEFzc2V0LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnRTaW1wbGVNYW5pZmVzdCgpIHtcbiAgICAvLyBhcHBseSBhIGt1YmVybmV0ZXMgbWFuaWZlc3RcbiAgICB0aGlzLmNsdXN0ZXIuYWRkTWFuaWZlc3QoJ0hlbGxvQXBwJywgLi4uaGVsbG8ucmVzb3VyY2VzKTtcbiAgfVxuICBwcml2YXRlIGFzc2VydE1hbmlmZXN0V2l0aG91dFZhbGlkYXRpb24oKSB7XG4gICAgLy8gYXBwbHkgYSBrdWJlcm5ldGVzIG1hbmlmZXN0XG4gICAgbmV3IGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QodGhpcywgJ0hlbGxvQXBwV2l0aG91dFZhbGlkYXRpb24nLCB7XG4gICAgICBjbHVzdGVyOiB0aGlzLmNsdXN0ZXIsXG4gICAgICBtYW5pZmVzdDogW3tcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAga2luZDogJ0NvbmZpZ01hcCcsXG4gICAgICAgIGRhdGE6IHsgaGVsbG86ICd3b3JsZCcgfSxcbiAgICAgICAgbWV0YWRhdGE6IHsgbmFtZTogJ2NvbmZpZy1tYXAnIH0sXG4gICAgICAgIHVua25vd246IHsga2V5OiAndmFsdWUnIH0sXG4gICAgICB9XSxcbiAgICAgIHNraXBWYWxpZGF0aW9uOiB0cnVlLFxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgYXNzZXJ0Tm9kZUdyb3VwWDg2KCkge1xuICAgIC8vIGFkZCBhIGV4dHJhIG5vZGVncm91cFxuICAgIHRoaXMuY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnZXh0cmEtbmcnLCB7XG4gICAgICBpbnN0YW5jZVR5cGVzOiBbbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLnNtYWxsJyldLFxuICAgICAgbWluU2l6ZTogMSxcbiAgICAgIC8vIHJldXNpbmcgdGhlIGRlZmF1bHQgY2FwYWNpdHkgbm9kZWdyb3VwIGluc3RhbmNlIHJvbGUgd2hlbiBhdmFpbGFibGVcbiAgICAgIG5vZGVSb2xlOiB0aGlzLmNsdXN0ZXIuZGVmYXVsdENhcGFjaXR5ID8gdGhpcy5jbHVzdGVyLmRlZmF1bHRDYXBhY2l0eS5yb2xlIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgYXNzZXJ0Tm9kZUdyb3VwU3BvdCgpIHtcbiAgICAvLyBhZGQgYSBleHRyYSBub2RlZ3JvdXBcbiAgICB0aGlzLmNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ2V4dHJhLW5nLXNwb3QnLCB7XG4gICAgICBpbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNS5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzVhLmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNWQubGFyZ2UnKSxcbiAgICAgIF0sXG4gICAgICBtaW5TaXplOiAzLFxuICAgICAgLy8gcmV1c2luZyB0aGUgZGVmYXVsdCBjYXBhY2l0eSBub2RlZ3JvdXAgaW5zdGFuY2Ugcm9sZSB3aGVuIGF2YWlsYWJsZVxuICAgICAgbm9kZVJvbGU6IHRoaXMuY2x1c3Rlci5kZWZhdWx0Q2FwYWNpdHkgPyB0aGlzLmNsdXN0ZXIuZGVmYXVsdENhcGFjaXR5LnJvbGUgOiB1bmRlZmluZWQsXG4gICAgICBjYXBhY2l0eVR5cGU6IGVrcy5DYXBhY2l0eVR5cGUuU1BPVCxcbiAgICB9KTtcbiAgfVxuICBwcml2YXRlIGFzc2VydE5vZGVHcm91cEN1c3RvbUFtaSgpIHtcbiAgICAvLyBhZGQgYSBleHRyYSBub2RlZ3JvdXBcbiAgICBjb25zdCB1c2VyRGF0YSA9IGVjMi5Vc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIHVzZXJEYXRhLmFkZENvbW1hbmRzKFxuICAgICAgJ3NldCAtbyB4dHJhY2UnLFxuICAgICAgYC9ldGMvZWtzL2Jvb3RzdHJhcC5zaCAke3RoaXMuY2x1c3Rlci5jbHVzdGVyTmFtZX1gLFxuICAgICk7XG4gICAgY29uc3QgbHQgPSBuZXcgZWMyLkNmbkxhdW5jaFRlbXBsYXRlKHRoaXMsICdMYXVuY2hUZW1wbGF0ZScsIHtcbiAgICAgIGxhdW5jaFRlbXBsYXRlRGF0YToge1xuICAgICAgICBpbWFnZUlkOiBuZXcgZWtzLkVrc09wdGltaXplZEltYWdlKHtcbiAgICAgICAgICBrdWJlcm5ldGVzVmVyc2lvbjogZWtzLkt1YmVybmV0ZXNWZXJzaW9uLlYxXzI1LnZlcnNpb24sXG4gICAgICAgIH0pLmdldEltYWdlKHRoaXMpLmltYWdlSWQsXG4gICAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLnNtYWxsJykudG9TdHJpbmcoKSxcbiAgICAgICAgdXNlckRhdGE6IEZuLmJhc2U2NCh1c2VyRGF0YS5yZW5kZXIoKSksXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHRoaXMuY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnZXh0cmEtbmcyJywge1xuICAgICAgbWluU2l6ZTogMSxcbiAgICAgIC8vIHJldXNpbmcgdGhlIGRlZmF1bHQgY2FwYWNpdHkgbm9kZWdyb3VwIGluc3RhbmNlIHJvbGUgd2hlbiBhdmFpbGFibGVcbiAgICAgIG5vZGVSb2xlOiB0aGlzLmNsdXN0ZXIuZGVmYXVsdE5vZGVncm91cD8ucm9sZSB8fCB0aGlzLmNsdXN0ZXIuZGVmYXVsdENhcGFjaXR5Py5yb2xlLFxuICAgICAgbGF1bmNoVGVtcGxhdGVTcGVjOiB7XG4gICAgICAgIGlkOiBsdC5yZWYsXG4gICAgICAgIHZlcnNpb246IGx0LmF0dHJEZWZhdWx0VmVyc2lvbk51bWJlcixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cbiAgcHJpdmF0ZSBhc3NlcnROb2RlR3JvdXBBcm0oKSB7XG4gICAgLy8gYWRkIGEgZXh0cmEgbm9kZWdyb3VwXG4gICAgdGhpcy5jbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCdleHRyYS1uZy1hcm0nLCB7XG4gICAgICBpbnN0YW5jZVR5cGVzOiBbbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ202Zy5tZWRpdW0nKV0sXG4gICAgICBtaW5TaXplOiAxLFxuICAgICAgLy8gcmV1c2luZyB0aGUgZGVmYXVsdCBjYXBhY2l0eSBub2RlZ3JvdXAgaW5zdGFuY2Ugcm9sZSB3aGVuIGF2YWlsYWJsZVxuICAgICAgbm9kZVJvbGU6IHRoaXMuY2x1c3Rlci5kZWZhdWx0Q2FwYWNpdHkgPyB0aGlzLmNsdXN0ZXIuZGVmYXVsdENhcGFjaXR5LnJvbGUgOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gIH1cbiAgcHJpdmF0ZSBhc3NlcnROb2RlR3JvdXBHcmF2aXRvbjMoKSB7XG4gICAgLy8gYWRkIGEgR3Jhdml0b24zIG5vZGVncm91cFxuICAgIHRoaXMuY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnZXh0cmEtbmctYXJtMycsIHtcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzdnLmxhcmdlJyldLFxuICAgICAgbWluU2l6ZTogMSxcbiAgICAgIC8vIHJldXNpbmcgdGhlIGRlZmF1bHQgY2FwYWNpdHkgbm9kZWdyb3VwIGluc3RhbmNlIHJvbGUgd2hlbiBhdmFpbGFibGVcbiAgICAgIG5vZGVSb2xlOiB0aGlzLmNsdXN0ZXIuZGVmYXVsdENhcGFjaXR5ID8gdGhpcy5jbHVzdGVyLmRlZmF1bHRDYXBhY2l0eS5yb2xlIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgYXNzZXJ0U3BvdENhcGFjaXR5KCkge1xuICAgIC8vIHNwb3QgaW5zdGFuY2VzICh1cCB0byAxMClcbiAgICB0aGlzLmNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdzcG90Jywge1xuICAgICAgc3BvdFByaWNlOiAnMC4xMDk0JyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLmxhcmdlJyksXG4gICAgICBtYXhDYXBhY2l0eTogMTAsXG4gICAgICBib290c3RyYXBPcHRpb25zOiB7XG4gICAgICAgIGt1YmVsZXRFeHRyYUFyZ3M6ICctLW5vZGUtbGFiZWxzIGZvbz1iYXIsZ29vPWZhcicsXG4gICAgICAgIGF3c0FwaVJldHJ5QXR0ZW1wdHM6IDUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgYXNzZXJ0Qm90dGxlcm9ja2V0KCkge1xuICAgIC8vIGFkZCBib3R0bGVyb2NrZXQgbm9kZXNcbiAgICB0aGlzLmNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdCb3R0bGVyb2NrZXROb2RlcycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLnNtYWxsJyksXG4gICAgICBtaW5DYXBhY2l0eTogMixcbiAgICAgIG1hY2hpbmVJbWFnZVR5cGU6IGVrcy5NYWNoaW5lSW1hZ2VUeXBlLkJPVFRMRVJPQ0tFVCxcbiAgICB9KTtcblxuICB9XG4gIHByaXZhdGUgYXNzZXJ0Q2FwYWNpdHlYODYoKSB7XG4gICAgLy8gYWRkIHNvbWUgeDg2XzY0IGNhcGFjaXR5IHRvIHRoZSBjbHVzdGVyLiBUaGUgSUFNIGluc3RhbmNlIHJvbGUgd2lsbFxuICAgIC8vIGF1dG9tYXRpY2FsbHkgYmUgbWFwcGVkIHZpYSBhd3MtYXV0aCB0byBhbGxvdyBub2RlcyB0byBqb2luIHRoZSBjbHVzdGVyLlxuICAgIHRoaXMuY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ05vZGVzJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWVkaXVtJyksXG4gICAgICBtaW5DYXBhY2l0eTogMyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0Q2FwYWNpdHlBcm0oKSB7XG4gICAgLy8gYWRkIHNvbWUgYXJtNjQgY2FwYWNpdHkgdG8gdGhlIGNsdXN0ZXIuIFRoZSBJQU0gaW5zdGFuY2Ugcm9sZSB3aWxsXG4gICAgLy8gYXV0b21hdGljYWxseSBiZSBtYXBwZWQgdmlhIGF3cy1hdXRoIHRvIGFsbG93IG5vZGVzIHRvIGpvaW4gdGhlIGNsdXN0ZXIuXG4gICAgdGhpcy5jbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnTm9kZXNBcm0nLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNmcubWVkaXVtJyksXG4gICAgICBtaW5DYXBhY2l0eTogMSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0RmFyZ2F0ZVByb2ZpbGUoKSB7XG4gICAgLy8gZmFyZ2F0ZSBwcm9maWxlIGZvciByZXNvdXJjZXMgaW4gdGhlIFwiZGVmYXVsdFwiIG5hbWVzcGFjZVxuICAgIHRoaXMuY2x1c3Rlci5hZGRGYXJnYXRlUHJvZmlsZSgnZGVmYXVsdCcsIHtcbiAgICAgIHNlbGVjdG9yczogW3sgbmFtZXNwYWNlOiAnZGVmYXVsdCcgfV0sXG4gICAgfSk7XG5cbiAgfVxuXG59XG5cbi8vIHRoaXMgdGVzdCB1c2VzIGJvdGggdGhlIGJvdHRsZXJvY2tldCBpbWFnZSBhbmQgdGhlIGluZjEgaW5zdGFuY2UsIHdoaWNoIGFyZSBvbmx5IHN1cHBvcnRlZCBpbiB0aGVzZVxuLy8gcmVnaW9ucy4gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay90cmVlL21haW4vcGFja2FnZXMvJTQwYXdzLWNkay9hd3MtZWtzI2JvdHRsZXJvY2tldFxuLy8gYW5kIGh0dHBzOi8vYXdzLmFtYXpvbi5jb20vYWJvdXQtYXdzL3doYXRzLW5ldy8yMDE5LzEyL2ludHJvZHVjaW5nLWFtYXpvbi1lYzItaW5mMS1pbnN0YW5jZXMtaGlnaC1wZXJmb3JtYW5jZS1hbmQtdGhlLWxvd2VzdC1jb3N0LW1hY2hpbmUtbGVhcm5pbmctaW5mZXJlbmNlLWluLXRoZS1jbG91ZC9cbmNvbnN0IHN1cHBvcnRlZFJlZ2lvbnMgPSBbXG4gICd1cy1lYXN0LTEnLFxuICAndXMtd2VzdC0yJyxcbl07XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxuLy8gc2luY2UgdGhlIEVLUyBvcHRpbWl6ZWQgQU1JIGlzIGhhcmQtY29kZWQgaGVyZSBiYXNlZCBvbiB0aGUgcmVnaW9uLFxuLy8gd2UgbmVlZCB0byBhY3R1YWxseSBwYXNzIGluIGEgc3BlY2lmaWMgcmVnaW9uLlxuY29uc3Qgc3RhY2sgPSBuZXcgRWtzQ2x1c3RlclN0YWNrKGFwcCwgJ2F3cy1jZGstZWtzLWNsdXN0ZXItdGVzdCcsIHtcbiAgZW52OiB7IHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbn0pO1xuXG5pZiAocHJvY2Vzcy5lbnYuQ0RLX0lOVEVHX0FDQ09VTlQgIT09ICcxMjM0NTY3OCcpIHtcblxuICAvLyBvbmx5IHZhbGlkYXRlIGlmIHdlIGFyZSBhYm91dCB0byBhY3R1YWxseSBkZXBsb3kuXG4gIC8vIFRPRE86IGJldHRlciB3YXkgdG8gZGV0ZXJtaW5lIHRoaXMsIHJpZ2h0IG5vdyB0aGUgJ0NES19JTlRFR19BQ0NPVU5UJyBzZWVtcyBsaWtlIHRoZSBvbmx5IHdheS5cblxuICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHN0YWNrLnJlZ2lvbikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHJlZ2lvbiAoJHtzdGFjay5yZWdpb259KSBjYW5ub3QgYmUgYSB0b2tlbiBhbmQgbXVzdCBiZSBjb25maWd1cmVkIHRvIG9uZSBvZjogJHtzdXBwb3J0ZWRSZWdpb25zfWApO1xuICB9XG5cbiAgaWYgKCFzdXBwb3J0ZWRSZWdpb25zLmluY2x1ZGVzKHN0YWNrLnJlZ2lvbikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYHJlZ2lvbiAoJHtzdGFjay5yZWdpb259KSBtdXN0IGJlIGNvbmZpZ3VyZWQgdG8gb25lIG9mOiAke3N1cHBvcnRlZFJlZ2lvbnN9YCk7XG4gIH1cblxufVxuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ2F3cy1jZGstZWtzLWNsdXN0ZXInLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgY2RrQ29tbWFuZE9wdGlvbnM6IHtcbiAgICBkZXBsb3k6IHtcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgcm9sbGJhY2s6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=