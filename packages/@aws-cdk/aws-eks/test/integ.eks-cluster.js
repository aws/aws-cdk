"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const path = require("path");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const aws_s3_assets_1 = require("@aws-cdk/aws-s3-assets");
const core_1 = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const cdk8s = require("cdk8s");
const kplus = require("cdk8s-plus-24");
const hello = require("./hello-k8s");
const integ_tests_kubernetes_version_1 = require("./integ-tests-kubernetes-version");
const eks = require("../lib");
class EksClusterStack extends core_1.Stack {
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
            ...integ_tests_kubernetes_version_1.getClusterVersionConfig(this),
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
        new core_1.CfnOutput(this, 'ClusterEndpoint', { value: this.cluster.clusterEndpoint });
        new core_1.CfnOutput(this, 'ClusterArn', { value: this.cluster.clusterArn });
        new core_1.CfnOutput(this, 'ClusterCertificateAuthorityData', { value: this.cluster.clusterCertificateAuthorityData });
        new core_1.CfnOutput(this, 'ClusterSecurityGroupId', { value: this.cluster.clusterSecurityGroupId });
        new core_1.CfnOutput(this, 'ClusterEncryptionConfigKeyArn', { value: this.cluster.clusterEncryptionConfigKeyArn });
        new core_1.CfnOutput(this, 'ClusterName', { value: this.cluster.clusterName });
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
            timeout: core_1.Duration.minutes(15),
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
                userData: core_1.Fn.base64(userData.render()),
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
const app = new core_1.App();
// since the EKS optimized AMI is hard-coded here based on the region,
// we need to actually pass in a specific region.
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-test', {
    env: { region: 'us-east-1' },
});
if (process.env.CDK_INTEG_ACCOUNT !== '12345678') {
    // only validate if we are about to actually deploy.
    // TODO: better way to determine this, right now the 'CDK_INTEG_ACCOUNT' seems like the only way.
    if (core_1.Token.isUnresolved(stack.region)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWNsdXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3MtY2x1c3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0Isd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyx3Q0FBd0M7QUFDeEMsMERBQStDO0FBQy9DLHdDQUF1RjtBQUN2Riw4Q0FBOEM7QUFDOUMsK0JBQStCO0FBQy9CLHVDQUF1QztBQUV2QyxxQ0FBcUM7QUFDckMscUZBQTJFO0FBQzNFLDhCQUE4QjtBQUc5QixNQUFNLGVBQWdCLFNBQVEsWUFBSztJQUtqQyxZQUFZLEtBQVUsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDcEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsNEVBQTRFO1FBQzVFLE1BQU0sV0FBVyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ2xELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRTtTQUMxQyxDQUFDLENBQUM7UUFFSCxNQUFNLG9CQUFvQixHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFFN0QsaURBQWlEO1FBQ2pELElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRW5FLGlEQUFpRDtRQUNqRCxNQUFNLFVBQVUsR0FBMEI7WUFDeEMsRUFBRSxVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxtQkFBbUIsRUFBRTtZQUNsRCxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtTQUN0QyxDQUFD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VyxLQUFLLENBQUMsTUFBTSx5REFBeUQsZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDO0tBQ3JIO0lBRUQsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssQ0FBQyxNQUFNLG1DQUFtQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7S0FDL0Y7Q0FFRjtBQUVELElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUscUJBQXFCLEVBQUU7SUFDOUMsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2xCLGlCQUFpQixFQUFFO1FBQ2pCLE1BQU0sRUFBRTtZQUNOLElBQUksRUFBRTtnQkFDSixRQUFRLEVBQUUsSUFBSTthQUNmO1NBQ0Y7S0FDRjtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLyAhY2RrLWludGVnIHByYWdtYTpkaXNhYmxlLXVwZGF0ZS13b3JrZmxvd1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCB7IEFzc2V0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLXMzLWFzc2V0cyc7XG5pbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgRHVyYXRpb24sIFRva2VuLCBGbiwgU3RhY2ssIFN0YWNrUHJvcHMgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCAqIGFzIGNkazhzIGZyb20gJ2NkazhzJztcbmltcG9ydCAqIGFzIGtwbHVzIGZyb20gJ2NkazhzLXBsdXMtMjQnO1xuaW1wb3J0ICogYXMgY29uc3RydWN0cyBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGhlbGxvIGZyb20gJy4vaGVsbG8tazhzJztcbmltcG9ydCB7IGdldENsdXN0ZXJWZXJzaW9uQ29uZmlnIH0gZnJvbSAnLi9pbnRlZy10ZXN0cy1rdWJlcm5ldGVzLXZlcnNpb24nO1xuaW1wb3J0ICogYXMgZWtzIGZyb20gJy4uL2xpYic7XG5cblxuY2xhc3MgRWtzQ2x1c3RlclN0YWNrIGV4dGVuZHMgU3RhY2sge1xuXG4gIHByaXZhdGUgY2x1c3RlcjogZWtzLkNsdXN0ZXI7XG4gIHByaXZhdGUgdnBjOiBlYzIuSVZwYztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIGFsbG93IGFsbCBhY2NvdW50IHVzZXJzIHRvIGFzc3VtZSB0aGlzIHJvbGUgaW4gb3JkZXIgdG8gYWRtaW4gdGhlIGNsdXN0ZXJcbiAgICBjb25zdCBtYXN0ZXJzUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQWRtaW5Sb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZWNyZXRzRW5jcnlwdGlvbktleSA9IG5ldyBrbXMuS2V5KHRoaXMsICdTZWNyZXRzS2V5Jyk7XG5cbiAgICAvLyBqdXN0IG5lZWQgb25lIG5hdCBnYXRld2F5IHRvIHNpbXBsaWZ5IHRoZSB0ZXN0XG4gICAgdGhpcy52cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVnBjJywgeyBtYXhBenM6IDMsIG5hdEdhdGV3YXlzOiAxIH0pO1xuXG4gICAgLy8gQ2hhbmdpbmcgdGhlIHN1Ym5ldHMgb3JkZXIgc2hvdWxkIGJlIHN1cHBvcnRlZFxuICAgIGNvbnN0IHZwY1N1Ym5ldHM6IGVjMi5TdWJuZXRTZWxlY3Rpb25bXSA9IFtcbiAgICAgIHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFJJVkFURV9XSVRIX0VHUkVTUyB9LFxuICAgICAgeyBzdWJuZXRUeXBlOiBlYzIuU3VibmV0VHlwZS5QVUJMSUMgfSxcbiAgICBdO1xuXG4gICAgLy8gY3JlYXRlIHRoZSBjbHVzdGVyIHdpdGggYSBkZWZhdWx0IG5vZGVncm91cCBjYXBhY2l0eVxuICAgIHRoaXMuY2x1c3RlciA9IG5ldyBla3MuQ2x1c3Rlcih0aGlzLCAnQ2x1c3RlcicsIHtcbiAgICAgIHZwYzogdGhpcy52cGMsXG4gICAgICB2cGNTdWJuZXRzLFxuICAgICAgbWFzdGVyc1JvbGUsXG4gICAgICBkZWZhdWx0Q2FwYWNpdHk6IDIsXG4gICAgICAuLi5nZXRDbHVzdGVyVmVyc2lvbkNvbmZpZyh0aGlzKSxcbiAgICAgIHNlY3JldHNFbmNyeXB0aW9uS2V5LFxuICAgICAgdGFnczoge1xuICAgICAgICBmb286ICdiYXInLFxuICAgICAgfSxcbiAgICAgIGNsdXN0ZXJMb2dnaW5nOiBbXG4gICAgICAgIGVrcy5DbHVzdGVyTG9nZ2luZ1R5cGVzLkFQSSxcbiAgICAgICAgZWtzLkNsdXN0ZXJMb2dnaW5nVHlwZXMuQVVUSEVOVElDQVRPUixcbiAgICAgICAgZWtzLkNsdXN0ZXJMb2dnaW5nVHlwZXMuU0NIRURVTEVSLFxuICAgICAgXSxcbiAgICB9KTtcblxuICAgIHRoaXMuYXNzZXJ0RmFyZ2F0ZVByb2ZpbGUoKTtcblxuICAgIHRoaXMuYXNzZXJ0Q2FwYWNpdHlYODYoKTtcblxuICAgIHRoaXMuYXNzZXJ0Q2FwYWNpdHlBcm0oKTtcblxuICAgIHRoaXMuYXNzZXJ0Qm90dGxlcm9ja2V0KCk7XG5cbiAgICB0aGlzLmFzc2VydFNwb3RDYXBhY2l0eSgpO1xuXG4gICAgdGhpcy5hc3NlcnROb2RlR3JvdXBYODYoKTtcblxuICAgIHRoaXMuYXNzZXJ0Tm9kZUdyb3VwU3BvdCgpO1xuXG4gICAgdGhpcy5hc3NlcnROb2RlR3JvdXBBcm0oKTtcblxuICAgIHRoaXMuYXNzZXJ0Tm9kZUdyb3VwR3Jhdml0b24zKCk7XG5cbiAgICB0aGlzLmFzc2VydE5vZGVHcm91cEN1c3RvbUFtaSgpO1xuXG4gICAgdGhpcy5hc3NlcnRTaW1wbGVNYW5pZmVzdCgpO1xuXG4gICAgdGhpcy5hc3NlcnRNYW5pZmVzdFdpdGhvdXRWYWxpZGF0aW9uKCk7XG5cbiAgICB0aGlzLmFzc2VydFNpbXBsZUhlbG1DaGFydCgpO1xuXG4gICAgdGhpcy5hc3NlcnRIZWxtQ2hhcnRBc3NldCgpO1xuXG4gICAgdGhpcy5hc3NlcnRTaW1wbGVDZGs4c0NoYXJ0KCk7XG5cbiAgICB0aGlzLmFzc2VydENyZWF0ZU5hbWVzcGFjZSgpO1xuXG4gICAgdGhpcy5hc3NlcnRTZXJ2aWNlQWNjb3VudCgpO1xuXG4gICAgdGhpcy5hc3NlcnRFeHRlbmRlZFNlcnZpY2VBY2NvdW50KCk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdDbHVzdGVyRW5kcG9pbnQnLCB7IHZhbHVlOiB0aGlzLmNsdXN0ZXIuY2x1c3RlckVuZHBvaW50IH0pO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0NsdXN0ZXJBcm4nLCB7IHZhbHVlOiB0aGlzLmNsdXN0ZXIuY2x1c3RlckFybiB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdDbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhJywgeyB2YWx1ZTogdGhpcy5jbHVzdGVyLmNsdXN0ZXJDZXJ0aWZpY2F0ZUF1dGhvcml0eURhdGEgfSk7XG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnQ2x1c3RlclNlY3VyaXR5R3JvdXBJZCcsIHsgdmFsdWU6IHRoaXMuY2x1c3Rlci5jbHVzdGVyU2VjdXJpdHlHcm91cElkIH0pO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0NsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuJywgeyB2YWx1ZTogdGhpcy5jbHVzdGVyLmNsdXN0ZXJFbmNyeXB0aW9uQ29uZmlnS2V5QXJuIH0pO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0NsdXN0ZXJOYW1lJywgeyB2YWx1ZTogdGhpcy5jbHVzdGVyLmNsdXN0ZXJOYW1lIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnRTZXJ2aWNlQWNjb3VudCgpIHtcbiAgICAvLyBhZGQgYSBzZXJ2aWNlIGFjY291bnQgY29ubmVjdGVkIHRvIGEgSUFNIHJvbGVcbiAgICB0aGlzLmNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ015U2VydmljZUFjY291bnQnKTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0RXh0ZW5kZWRTZXJ2aWNlQWNjb3VudCgpIHtcbiAgICAvLyBhZGQgYSBzZXJ2aWNlIGFjY291bnQgY29ubmVjdGVkIHRvIGEgSUFNIHJvbGVcbiAgICB0aGlzLmNsdXN0ZXIuYWRkU2VydmljZUFjY291bnQoJ015RXh0ZW5kZWRTZXJ2aWNlQWNjb3VudCcsIHtcbiAgICAgIGFubm90YXRpb25zOiB7XG4gICAgICAgICdla3MuYW1hem9uYXdzLmNvbS9zdHMtcmVnaW9uYWwtZW5kcG9pbnRzJzogJ2ZhbHNlJyxcbiAgICAgIH0sXG4gICAgICBsYWJlbHM6IHtcbiAgICAgICAgJ3NvbWUtbGFiZWwnOiAnd2l0aC1zb21lLXZhbHVlJyxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydENyZWF0ZU5hbWVzcGFjZSgpIHtcbiAgICAvLyBkZXBsb3kgYW4gbmdpbnggaW5ncmVzcyBpbiBhIG5hbWVzcGFjZVxuICAgIGNvbnN0IG5naW54TmFtZXNwYWNlID0gdGhpcy5jbHVzdGVyLmFkZE1hbmlmZXN0KCduZ2lueC1uYW1lc3BhY2UnLCB7XG4gICAgICBhcGlWZXJzaW9uOiAndjEnLFxuICAgICAga2luZDogJ05hbWVzcGFjZScsXG4gICAgICBtZXRhZGF0YToge1xuICAgICAgICBuYW1lOiAnbmdpbngnLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG5naW54SW5ncmVzcyA9IHRoaXMuY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ25naW54LWluZ3Jlc3MnLCB7XG4gICAgICBjaGFydDogJ25naW54LWluZ3Jlc3MnLFxuICAgICAgcmVwb3NpdG9yeTogJ2h0dHBzOi8vaGVsbS5uZ2lueC5jb20vc3RhYmxlJyxcbiAgICAgIG5hbWVzcGFjZTogJ25naW54JyxcbiAgICAgIHdhaXQ6IHRydWUsXG4gICAgICBjcmVhdGVOYW1lc3BhY2U6IGZhbHNlLFxuICAgICAgdGltZW91dDogRHVyYXRpb24ubWludXRlcygxNSksXG4gICAgfSk7XG5cbiAgICAvLyBtYWtlIHN1cmUgbmFtZXNwYWNlIGlzIGRlcGxveWVkIGJlZm9yZSB0aGUgY2hhcnRcbiAgICBuZ2lueEluZ3Jlc3Mubm9kZS5hZGREZXBlbmRlbmN5KG5naW54TmFtZXNwYWNlKTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0U2ltcGxlQ2RrOHNDaGFydCgpIHtcblxuICAgIGNsYXNzIENoYXJ0IGV4dGVuZHMgY2RrOHMuQ2hhcnQge1xuICAgICAgY29uc3RydWN0b3Ioc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBuczogc3RyaW5nLCBjbHVzdGVyOiBla3MuSUNsdXN0ZXIpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIG5zKTtcblxuICAgICAgICBuZXcga3BsdXMuQ29uZmlnTWFwKHRoaXMsICdjb25maWctbWFwJywge1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGNsdXN0ZXJOYW1lOiBjbHVzdGVyLmNsdXN0ZXJOYW1lLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGs4cy5BcHAoKTtcbiAgICBjb25zdCBjaGFydCA9IG5ldyBDaGFydChhcHAsICdDaGFydCcsIHRoaXMuY2x1c3Rlcik7XG5cbiAgICB0aGlzLmNsdXN0ZXIuYWRkQ2RrOHNDaGFydCgnY2RrOHMtY2hhcnQnLCBjaGFydCk7XG4gIH1cbiAgcHJpdmF0ZSBhc3NlcnRTaW1wbGVIZWxtQ2hhcnQoKSB7XG4gICAgLy8gZGVwbG95IHRoZSBLdWJlcm5ldGVzIGRhc2hib2FyZCB0aHJvdWdoIGEgaGVsbSBjaGFydFxuICAgIHRoaXMuY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ2Rhc2hib2FyZCcsIHtcbiAgICAgIGNoYXJ0OiAna3ViZXJuZXRlcy1kYXNoYm9hcmQnLFxuICAgICAgcmVwb3NpdG9yeTogJ2h0dHBzOi8va3ViZXJuZXRlcy5naXRodWIuaW8vZGFzaGJvYXJkLycsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydEhlbG1DaGFydEFzc2V0KCkge1xuICAgIC8vIGdldCBoZWxtIGNoYXJ0IGZyb20gQXNzZXRcbiAgICBjb25zdCBjaGFydEFzc2V0ID0gbmV3IEFzc2V0KHRoaXMsICdDaGFydEFzc2V0Jywge1xuICAgICAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ3Rlc3QtY2hhcnQnKSxcbiAgICB9KTtcbiAgICB0aGlzLmNsdXN0ZXIuYWRkSGVsbUNoYXJ0KCd0ZXN0LWNoYXJ0Jywge1xuICAgICAgY2hhcnRBc3NldDogY2hhcnRBc3NldCxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0U2ltcGxlTWFuaWZlc3QoKSB7XG4gICAgLy8gYXBwbHkgYSBrdWJlcm5ldGVzIG1hbmlmZXN0XG4gICAgdGhpcy5jbHVzdGVyLmFkZE1hbmlmZXN0KCdIZWxsb0FwcCcsIC4uLmhlbGxvLnJlc291cmNlcyk7XG4gIH1cbiAgcHJpdmF0ZSBhc3NlcnRNYW5pZmVzdFdpdGhvdXRWYWxpZGF0aW9uKCkge1xuICAgIC8vIGFwcGx5IGEga3ViZXJuZXRlcyBtYW5pZmVzdFxuICAgIG5ldyBla3MuS3ViZXJuZXRlc01hbmlmZXN0KHRoaXMsICdIZWxsb0FwcFdpdGhvdXRWYWxpZGF0aW9uJywge1xuICAgICAgY2x1c3RlcjogdGhpcy5jbHVzdGVyLFxuICAgICAgbWFuaWZlc3Q6IFt7XG4gICAgICAgIGFwaVZlcnNpb246ICd2MScsXG4gICAgICAgIGtpbmQ6ICdDb25maWdNYXAnLFxuICAgICAgICBkYXRhOiB7IGhlbGxvOiAnd29ybGQnIH0sXG4gICAgICAgIG1ldGFkYXRhOiB7IG5hbWU6ICdjb25maWctbWFwJyB9LFxuICAgICAgICB1bmtub3duOiB7IGtleTogJ3ZhbHVlJyB9LFxuICAgICAgfV0sXG4gICAgICBza2lwVmFsaWRhdGlvbjogdHJ1ZSxcbiAgICB9KTtcbiAgfVxuICBwcml2YXRlIGFzc2VydE5vZGVHcm91cFg4NigpIHtcbiAgICAvLyBhZGQgYSBleHRyYSBub2RlZ3JvdXBcbiAgICB0aGlzLmNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ2V4dHJhLW5nJywge1xuICAgICAgaW5zdGFuY2VUeXBlczogW25ldyBlYzIuSW5zdGFuY2VUeXBlKCd0My5zbWFsbCcpXSxcbiAgICAgIG1pblNpemU6IDEsXG4gICAgICAvLyByZXVzaW5nIHRoZSBkZWZhdWx0IGNhcGFjaXR5IG5vZGVncm91cCBpbnN0YW5jZSByb2xlIHdoZW4gYXZhaWxhYmxlXG4gICAgICBub2RlUm9sZTogdGhpcy5jbHVzdGVyLmRlZmF1bHRDYXBhY2l0eSA/IHRoaXMuY2x1c3Rlci5kZWZhdWx0Q2FwYWNpdHkucm9sZSA6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfVxuICBwcml2YXRlIGFzc2VydE5vZGVHcm91cFNwb3QoKSB7XG4gICAgLy8gYWRkIGEgZXh0cmEgbm9kZWdyb3VwXG4gICAgdGhpcy5jbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCdleHRyYS1uZy1zcG90Jywge1xuICAgICAgaW5zdGFuY2VUeXBlczogW1xuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzUubGFyZ2UnKSxcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M1YS5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzVkLmxhcmdlJyksXG4gICAgICBdLFxuICAgICAgbWluU2l6ZTogMyxcbiAgICAgIC8vIHJldXNpbmcgdGhlIGRlZmF1bHQgY2FwYWNpdHkgbm9kZWdyb3VwIGluc3RhbmNlIHJvbGUgd2hlbiBhdmFpbGFibGVcbiAgICAgIG5vZGVSb2xlOiB0aGlzLmNsdXN0ZXIuZGVmYXVsdENhcGFjaXR5ID8gdGhpcy5jbHVzdGVyLmRlZmF1bHRDYXBhY2l0eS5yb2xlIDogdW5kZWZpbmVkLFxuICAgICAgY2FwYWNpdHlUeXBlOiBla3MuQ2FwYWNpdHlUeXBlLlNQT1QsXG4gICAgfSk7XG4gIH1cbiAgcHJpdmF0ZSBhc3NlcnROb2RlR3JvdXBDdXN0b21BbWkoKSB7XG4gICAgLy8gYWRkIGEgZXh0cmEgbm9kZWdyb3VwXG4gICAgY29uc3QgdXNlckRhdGEgPSBlYzIuVXNlckRhdGEuZm9yTGludXgoKTtcbiAgICB1c2VyRGF0YS5hZGRDb21tYW5kcyhcbiAgICAgICdzZXQgLW8geHRyYWNlJyxcbiAgICAgIGAvZXRjL2Vrcy9ib290c3RyYXAuc2ggJHt0aGlzLmNsdXN0ZXIuY2x1c3Rlck5hbWV9YCxcbiAgICApO1xuICAgIGNvbnN0IGx0ID0gbmV3IGVjMi5DZm5MYXVuY2hUZW1wbGF0ZSh0aGlzLCAnTGF1bmNoVGVtcGxhdGUnLCB7XG4gICAgICBsYXVuY2hUZW1wbGF0ZURhdGE6IHtcbiAgICAgICAgaW1hZ2VJZDogbmV3IGVrcy5Fa3NPcHRpbWl6ZWRJbWFnZSh7XG4gICAgICAgICAga3ViZXJuZXRlc1ZlcnNpb246IGVrcy5LdWJlcm5ldGVzVmVyc2lvbi5WMV8yNS52ZXJzaW9uLFxuICAgICAgICB9KS5nZXRJbWFnZSh0aGlzKS5pbWFnZUlkLFxuICAgICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0My5zbWFsbCcpLnRvU3RyaW5nKCksXG4gICAgICAgIHVzZXJEYXRhOiBGbi5iYXNlNjQodXNlckRhdGEucmVuZGVyKCkpLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICB0aGlzLmNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ2V4dHJhLW5nMicsIHtcbiAgICAgIG1pblNpemU6IDEsXG4gICAgICAvLyByZXVzaW5nIHRoZSBkZWZhdWx0IGNhcGFjaXR5IG5vZGVncm91cCBpbnN0YW5jZSByb2xlIHdoZW4gYXZhaWxhYmxlXG4gICAgICBub2RlUm9sZTogdGhpcy5jbHVzdGVyLmRlZmF1bHROb2RlZ3JvdXA/LnJvbGUgfHwgdGhpcy5jbHVzdGVyLmRlZmF1bHRDYXBhY2l0eT8ucm9sZSxcbiAgICAgIGxhdW5jaFRlbXBsYXRlU3BlYzoge1xuICAgICAgICBpZDogbHQucmVmLFxuICAgICAgICB2ZXJzaW9uOiBsdC5hdHRyRGVmYXVsdFZlcnNpb25OdW1iZXIsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgYXNzZXJ0Tm9kZUdyb3VwQXJtKCkge1xuICAgIC8vIGFkZCBhIGV4dHJhIG5vZGVncm91cFxuICAgIHRoaXMuY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnZXh0cmEtbmctYXJtJywge1xuICAgICAgaW5zdGFuY2VUeXBlczogW25ldyBlYzIuSW5zdGFuY2VUeXBlKCdtNmcubWVkaXVtJyldLFxuICAgICAgbWluU2l6ZTogMSxcbiAgICAgIC8vIHJldXNpbmcgdGhlIGRlZmF1bHQgY2FwYWNpdHkgbm9kZWdyb3VwIGluc3RhbmNlIHJvbGUgd2hlbiBhdmFpbGFibGVcbiAgICAgIG5vZGVSb2xlOiB0aGlzLmNsdXN0ZXIuZGVmYXVsdENhcGFjaXR5ID8gdGhpcy5jbHVzdGVyLmRlZmF1bHRDYXBhY2l0eS5yb2xlIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgYXNzZXJ0Tm9kZUdyb3VwR3Jhdml0b24zKCkge1xuICAgIC8vIGFkZCBhIEdyYXZpdG9uMyBub2RlZ3JvdXBcbiAgICB0aGlzLmNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ2V4dHJhLW5nLWFybTMnLCB7XG4gICAgICBpbnN0YW5jZVR5cGVzOiBbbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ2M3Zy5sYXJnZScpXSxcbiAgICAgIG1pblNpemU6IDEsXG4gICAgICAvLyByZXVzaW5nIHRoZSBkZWZhdWx0IGNhcGFjaXR5IG5vZGVncm91cCBpbnN0YW5jZSByb2xlIHdoZW4gYXZhaWxhYmxlXG4gICAgICBub2RlUm9sZTogdGhpcy5jbHVzdGVyLmRlZmF1bHRDYXBhY2l0eSA/IHRoaXMuY2x1c3Rlci5kZWZhdWx0Q2FwYWNpdHkucm9sZSA6IHVuZGVmaW5lZCxcbiAgICB9KTtcbiAgfVxuICBwcml2YXRlIGFzc2VydFNwb3RDYXBhY2l0eSgpIHtcbiAgICAvLyBzcG90IGluc3RhbmNlcyAodXAgdG8gMTApXG4gICAgdGhpcy5jbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnc3BvdCcsIHtcbiAgICAgIHNwb3RQcmljZTogJzAuMTA5NCcsXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0My5sYXJnZScpLFxuICAgICAgbWF4Q2FwYWNpdHk6IDEwLFxuICAgICAgYm9vdHN0cmFwT3B0aW9uczoge1xuICAgICAgICBrdWJlbGV0RXh0cmFBcmdzOiAnLS1ub2RlLWxhYmVscyBmb289YmFyLGdvbz1mYXInLFxuICAgICAgICBhd3NBcGlSZXRyeUF0dGVtcHRzOiA1LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuICBwcml2YXRlIGFzc2VydEJvdHRsZXJvY2tldCgpIHtcbiAgICAvLyBhZGQgYm90dGxlcm9ja2V0IG5vZGVzXG4gICAgdGhpcy5jbHVzdGVyLmFkZEF1dG9TY2FsaW5nR3JvdXBDYXBhY2l0eSgnQm90dGxlcm9ja2V0Tm9kZXMnLCB7XG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0My5zbWFsbCcpLFxuICAgICAgbWluQ2FwYWNpdHk6IDIsXG4gICAgICBtYWNoaW5lSW1hZ2VUeXBlOiBla3MuTWFjaGluZUltYWdlVHlwZS5CT1RUTEVST0NLRVQsXG4gICAgfSk7XG5cbiAgfVxuICBwcml2YXRlIGFzc2VydENhcGFjaXR5WDg2KCkge1xuICAgIC8vIGFkZCBzb21lIHg4Nl82NCBjYXBhY2l0eSB0byB0aGUgY2x1c3Rlci4gVGhlIElBTSBpbnN0YW5jZSByb2xlIHdpbGxcbiAgICAvLyBhdXRvbWF0aWNhbGx5IGJlIG1hcHBlZCB2aWEgYXdzLWF1dGggdG8gYWxsb3cgbm9kZXMgdG8gam9pbiB0aGUgY2x1c3Rlci5cbiAgICB0aGlzLmNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdOb2RlcycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1lZGl1bScpLFxuICAgICAgbWluQ2FwYWNpdHk6IDMsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydENhcGFjaXR5QXJtKCkge1xuICAgIC8vIGFkZCBzb21lIGFybTY0IGNhcGFjaXR5IHRvIHRoZSBjbHVzdGVyLiBUaGUgSUFNIGluc3RhbmNlIHJvbGUgd2lsbFxuICAgIC8vIGF1dG9tYXRpY2FsbHkgYmUgbWFwcGVkIHZpYSBhd3MtYXV0aCB0byBhbGxvdyBub2RlcyB0byBqb2luIHRoZSBjbHVzdGVyLlxuICAgIHRoaXMuY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ05vZGVzQXJtJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTZnLm1lZGl1bScpLFxuICAgICAgbWluQ2FwYWNpdHk6IDEsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydEZhcmdhdGVQcm9maWxlKCkge1xuICAgIC8vIGZhcmdhdGUgcHJvZmlsZSBmb3IgcmVzb3VyY2VzIGluIHRoZSBcImRlZmF1bHRcIiBuYW1lc3BhY2VcbiAgICB0aGlzLmNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoJ2RlZmF1bHQnLCB7XG4gICAgICBzZWxlY3RvcnM6IFt7IG5hbWVzcGFjZTogJ2RlZmF1bHQnIH1dLFxuICAgIH0pO1xuXG4gIH1cblxufVxuXG4vLyB0aGlzIHRlc3QgdXNlcyBib3RoIHRoZSBib3R0bGVyb2NrZXQgaW1hZ2UgYW5kIHRoZSBpbmYxIGluc3RhbmNlLCB3aGljaCBhcmUgb25seSBzdXBwb3J0ZWQgaW4gdGhlc2Vcbi8vIHJlZ2lvbnMuIHNlZSBodHRwczovL2dpdGh1Yi5jb20vYXdzL2F3cy1jZGsvdHJlZS9tYWluL3BhY2thZ2VzLyU0MGF3cy1jZGsvYXdzLWVrcyNib3R0bGVyb2NrZXRcbi8vIGFuZCBodHRwczovL2F3cy5hbWF6b24uY29tL2Fib3V0LWF3cy93aGF0cy1uZXcvMjAxOS8xMi9pbnRyb2R1Y2luZy1hbWF6b24tZWMyLWluZjEtaW5zdGFuY2VzLWhpZ2gtcGVyZm9ybWFuY2UtYW5kLXRoZS1sb3dlc3QtY29zdC1tYWNoaW5lLWxlYXJuaW5nLWluZmVyZW5jZS1pbi10aGUtY2xvdWQvXG5jb25zdCBzdXBwb3J0ZWRSZWdpb25zID0gW1xuICAndXMtZWFzdC0xJyxcbiAgJ3VzLXdlc3QtMicsXG5dO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5cbi8vIHNpbmNlIHRoZSBFS1Mgb3B0aW1pemVkIEFNSSBpcyBoYXJkLWNvZGVkIGhlcmUgYmFzZWQgb24gdGhlIHJlZ2lvbixcbi8vIHdlIG5lZWQgdG8gYWN0dWFsbHkgcGFzcyBpbiBhIHNwZWNpZmljIHJlZ2lvbi5cbmNvbnN0IHN0YWNrID0gbmV3IEVrc0NsdXN0ZXJTdGFjayhhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyLXRlc3QnLCB7XG4gIGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0sXG59KTtcblxuaWYgKHByb2Nlc3MuZW52LkNES19JTlRFR19BQ0NPVU5UICE9PSAnMTIzNDU2NzgnKSB7XG5cbiAgLy8gb25seSB2YWxpZGF0ZSBpZiB3ZSBhcmUgYWJvdXQgdG8gYWN0dWFsbHkgZGVwbG95LlxuICAvLyBUT0RPOiBiZXR0ZXIgd2F5IHRvIGRldGVybWluZSB0aGlzLCByaWdodCBub3cgdGhlICdDREtfSU5URUdfQUNDT1VOVCcgc2VlbXMgbGlrZSB0aGUgb25seSB3YXkuXG5cbiAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChzdGFjay5yZWdpb24pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGByZWdpb24gKCR7c3RhY2sucmVnaW9ufSkgY2Fubm90IGJlIGEgdG9rZW4gYW5kIG11c3QgYmUgY29uZmlndXJlZCB0byBvbmUgb2Y6ICR7c3VwcG9ydGVkUmVnaW9uc31gKTtcbiAgfVxuXG4gIGlmICghc3VwcG9ydGVkUmVnaW9ucy5pbmNsdWRlcyhzdGFjay5yZWdpb24pKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGByZWdpb24gKCR7c3RhY2sucmVnaW9ufSkgbXVzdCBiZSBjb25maWd1cmVkIHRvIG9uZSBvZjogJHtzdXBwb3J0ZWRSZWdpb25zfWApO1xuICB9XG5cbn1cblxubmV3IGludGVnLkludGVnVGVzdChhcHAsICdhd3MtY2RrLWVrcy1jbHVzdGVyJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG4gIGNka0NvbW1hbmRPcHRpb25zOiB7XG4gICAgZGVwbG95OiB7XG4gICAgICBhcmdzOiB7XG4gICAgICAgIHJvbGxiYWNrOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19