"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// !cdk-integ pragma:disable-update-workflow
const path = require("path");
const integ = require("@aws-cdk/integ-tests-alpha");
const lambda_layer_kubectl_v32_1 = require("@aws-cdk/lambda-layer-kubectl-v32");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const kms = require("aws-cdk-lib/aws-kms");
const aws_s3_assets_1 = require("aws-cdk-lib/aws-s3-assets");
const cx_api_1 = require("aws-cdk-lib/cx-api");
const cdk8s = require("cdk8s");
const kplus = require("cdk8s-plus-27");
const hello = require("./hello-k8s");
const eks = require("../lib");
class EksClusterStack extends aws_cdk_lib_1.Stack {
    cluster;
    vpc;
    constructor(scope, id, props) {
        super(scope, id, props);
        // allow all account users to assume this role in order to admin the cluster
        const mastersRole = new iam.Role(this, 'AdminRole', {
            assumedBy: new iam.AccountRootPrincipal(),
        });
        const secretsEncryptionKey = new kms.Key(this, 'SecretsKey');
        // just need one nat gateway to simplify the test
        this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1, restrictDefaultSecurityGroup: false });
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
            defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
            defaultCapacity: 2,
            version: eks.KubernetesVersion.V1_32,
            secretsEncryptionKey,
            tags: {
                foo: 'bar',
            },
            clusterLogging: [
                eks.ClusterLoggingTypes.API,
                eks.ClusterLoggingTypes.AUTHENTICATOR,
                eks.ClusterLoggingTypes.SCHEDULER,
            ],
            kubectlProviderOptions: {
                kubectlLayer: new lambda_layer_kubectl_v32_1.KubectlV32Layer(this, 'kubectlLayer'),
            },
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
        this.assertNodeGroupGpu();
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
        new aws_cdk_lib_1.CfnOutput(this, 'NodegroupName', { value: this.cluster.defaultNodegroup.nodegroupName });
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
            release: 'nginx-ingress',
            // https://github.com/nginxinc/helm-charts/tree/master/stable
            version: '0.17.1',
            values: {
                controller: {
                    service: {
                        create: false,
                    },
                },
            },
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
            // https://artifacthub.io/packages/helm/k8s-dashboard/kubernetes-dashboard
            version: '6.0.8',
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
            maxSize: 4,
            maxUnavailable: 3,
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
                new ec2.InstanceType('m7i-flex.large'),
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
            maxUnavailablePercentage: 33,
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
    assertNodeGroupGpu() {
        // add a GPU nodegroup
        this.cluster.addNodegroupCapacity('extra-ng-gpu', {
            instanceTypes: [
                new ec2.InstanceType('p2.xlarge'),
                new ec2.InstanceType('g5.xlarge'),
                new ec2.InstanceType('g6e.xlarge'),
            ],
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
// regions. see https://github.com/aws/aws-cdk/tree/main/packages/aws-cdk-lib/aws-eks#bottlerocket
// and https://aws.amazon.com/about-aws/whats-new/2019/12/introducing-amazon-ec2-inf1-instances-high-performance-and-the-lowest-cost-machine-learning-inference-in-the-cloud/
const supportedRegions = [
    'us-east-1',
    'us-west-2',
];
const app = new aws_cdk_lib_1.App({
    postCliContext: {
        [cx_api_1.IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS]: false,
        '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
        '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    },
});
// since the EKS optimized AMI is hard-coded here based on the region,
// we need to actually pass in a specific region.
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster', {
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
new integ.IntegTest(app, 'aws-cdk-eks-cluster-integ', {
    testCases: [stack],
    // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
    diffAssets: false,
    cdkCommandOptions: {
        deploy: {
            args: {
                rollback: true,
            },
        },
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWtzLWNsdXN0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5la3MtY2x1c3Rlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0Isb0RBQW9EO0FBQ3BELGdGQUFvRTtBQUNwRSw2Q0FBcUY7QUFDckYsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsNkRBQWtEO0FBQ2xELCtDQUE4RTtBQUM5RSwrQkFBK0I7QUFDL0IsdUNBQXVDO0FBRXZDLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFFOUIsTUFBTSxlQUFnQixTQUFRLG1CQUFLO0lBQ3pCLE9BQU8sQ0FBYztJQUNyQixHQUFHLENBQVc7SUFFdEIsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDRFQUE0RTtRQUM1RSxNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRTtZQUNsRCxTQUFTLEVBQUUsSUFBSSxHQUFHLENBQUMsb0JBQW9CLEVBQUU7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBRTdELGlEQUFpRDtRQUNqRCxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsQ0FBQyxFQUFFLDRCQUE0QixFQUFFLEtBQUssRUFBRSxDQUFDLENBQUM7UUFFeEcsaURBQWlEO1FBQ2pELE1BQU0sVUFBVSxHQUEwQjtZQUN4QyxFQUFFLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLG1CQUFt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QzdCLENBQUMsQ0FBQztBQUVILElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsS0FBSyxVQUFVLEVBQUUsQ0FBQztJQUNqRCxvREFBb0Q7SUFDcEQsaUdBQWlHO0lBRWpHLElBQUksbUJBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDckMsTUFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssQ0FBQyxNQUFNLHlEQUF5RCxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7SUFDdEgsQ0FBQztJQUVELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7UUFDN0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxXQUFXLEtBQUssQ0FBQyxNQUFNLG1DQUFtQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7SUFDaEcsQ0FBQztBQUNILENBQUM7QUFFRCxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLDJCQUEyQixFQUFFO0lBQ3BELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNsQiwyRkFBMkY7SUFDM0YsVUFBVSxFQUFFLEtBQUs7SUFDakIsaUJBQWlCLEVBQUU7UUFDakIsTUFBTSxFQUFFO1lBQ04sSUFBSSxFQUFFO2dCQUNKLFFBQVEsRUFBRSxJQUFJO2FBQ2Y7U0FDRjtLQUNGO0NBQ0YsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vICFjZGstaW50ZWcgcHJhZ21hOmRpc2FibGUtdXBkYXRlLXdvcmtmbG93XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgaW50ZWcgZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgS3ViZWN0bFYzMkxheWVyIH0gZnJvbSAnQGF3cy1jZGsvbGFtYmRhLWxheWVyLWt1YmVjdGwtdjMyJztcbmltcG9ydCB7IEFwcCwgQ2ZuT3V0cHV0LCBEdXJhdGlvbiwgVG9rZW4sIEZuLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mta21zJztcbmltcG9ydCB7IEFzc2V0IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWFzc2V0cyc7XG5pbXBvcnQgeyBJQU1fT0lEQ19SRUpFQ1RfVU5BVVRIT1JJWkVEX0NPTk5FQ1RJT05TIH0gZnJvbSAnYXdzLWNkay1saWIvY3gtYXBpJztcbmltcG9ydCAqIGFzIGNkazhzIGZyb20gJ2NkazhzJztcbmltcG9ydCAqIGFzIGtwbHVzIGZyb20gJ2NkazhzLXBsdXMtMjcnO1xuaW1wb3J0ICogYXMgY29uc3RydWN0cyBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGhlbGxvIGZyb20gJy4vaGVsbG8tazhzJztcbmltcG9ydCAqIGFzIGVrcyBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBFa3NDbHVzdGVyU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIHByaXZhdGUgY2x1c3RlcjogZWtzLkNsdXN0ZXI7XG4gIHByaXZhdGUgdnBjOiBlYzIuSVZwYztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIGFsbG93IGFsbCBhY2NvdW50IHVzZXJzIHRvIGFzc3VtZSB0aGlzIHJvbGUgaW4gb3JkZXIgdG8gYWRtaW4gdGhlIGNsdXN0ZXJcbiAgICBjb25zdCBtYXN0ZXJzUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQWRtaW5Sb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRSb290UHJpbmNpcGFsKCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBzZWNyZXRzRW5jcnlwdGlvbktleSA9IG5ldyBrbXMuS2V5KHRoaXMsICdTZWNyZXRzS2V5Jyk7XG5cbiAgICAvLyBqdXN0IG5lZWQgb25lIG5hdCBnYXRld2F5IHRvIHNpbXBsaWZ5IHRoZSB0ZXN0XG4gICAgdGhpcy52cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVnBjJywgeyBtYXhBenM6IDMsIG5hdEdhdGV3YXlzOiAxLCByZXN0cmljdERlZmF1bHRTZWN1cml0eUdyb3VwOiBmYWxzZSB9KTtcblxuICAgIC8vIENoYW5naW5nIHRoZSBzdWJuZXRzIG9yZGVyIHNob3VsZCBiZSBzdXBwb3J0ZWRcbiAgICBjb25zdCB2cGNTdWJuZXRzOiBlYzIuU3VibmV0U2VsZWN0aW9uW10gPSBbXG4gICAgICB7IHN1Ym5ldFR5cGU6IGVjMi5TdWJuZXRUeXBlLlBSSVZBVEVfV0lUSF9FR1JFU1MgfSxcbiAgICAgIHsgc3VibmV0VHlwZTogZWMyLlN1Ym5ldFR5cGUuUFVCTElDIH0sXG4gICAgXTtcblxuICAgIC8vIGNyZWF0ZSB0aGUgY2x1c3RlciB3aXRoIGEgZGVmYXVsdCBub2RlZ3JvdXAgY2FwYWNpdHlcbiAgICB0aGlzLmNsdXN0ZXIgPSBuZXcgZWtzLkNsdXN0ZXIodGhpcywgJ0NsdXN0ZXInLCB7XG4gICAgICB2cGM6IHRoaXMudnBjLFxuICAgICAgdnBjU3VibmV0cyxcbiAgICAgIG1hc3RlcnNSb2xlLFxuICAgICAgZGVmYXVsdENhcGFjaXR5VHlwZTogZWtzLkRlZmF1bHRDYXBhY2l0eVR5cGUuTk9ERUdST1VQLFxuICAgICAgZGVmYXVsdENhcGFjaXR5OiAyLFxuICAgICAgdmVyc2lvbjogZWtzLkt1YmVybmV0ZXNWZXJzaW9uLlYxXzMyLFxuICAgICAgc2VjcmV0c0VuY3J5cHRpb25LZXksXG4gICAgICB0YWdzOiB7XG4gICAgICAgIGZvbzogJ2JhcicsXG4gICAgICB9LFxuICAgICAgY2x1c3RlckxvZ2dpbmc6IFtcbiAgICAgICAgZWtzLkNsdXN0ZXJMb2dnaW5nVHlwZXMuQVBJLFxuICAgICAgICBla3MuQ2x1c3RlckxvZ2dpbmdUeXBlcy5BVVRIRU5USUNBVE9SLFxuICAgICAgICBla3MuQ2x1c3RlckxvZ2dpbmdUeXBlcy5TQ0hFRFVMRVIsXG4gICAgICBdLFxuICAgICAga3ViZWN0bFByb3ZpZGVyT3B0aW9uczoge1xuICAgICAgICBrdWJlY3RsTGF5ZXI6IG5ldyBLdWJlY3RsVjMyTGF5ZXIodGhpcywgJ2t1YmVjdGxMYXllcicpLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMuYXNzZXJ0RmFyZ2F0ZVByb2ZpbGUoKTtcblxuICAgIHRoaXMuYXNzZXJ0Q2FwYWNpdHlYODYoKTtcblxuICAgIHRoaXMuYXNzZXJ0Q2FwYWNpdHlBcm0oKTtcblxuICAgIHRoaXMuYXNzZXJ0Qm90dGxlcm9ja2V0KCk7XG5cbiAgICB0aGlzLmFzc2VydFNwb3RDYXBhY2l0eSgpO1xuXG4gICAgdGhpcy5hc3NlcnROb2RlR3JvdXBYODYoKTtcblxuICAgIHRoaXMuYXNzZXJ0Tm9kZUdyb3VwU3BvdCgpO1xuXG4gICAgdGhpcy5hc3NlcnROb2RlR3JvdXBBcm0oKTtcblxuICAgIHRoaXMuYXNzZXJ0Tm9kZUdyb3VwR3Jhdml0b24zKCk7XG5cbiAgICB0aGlzLmFzc2VydE5vZGVHcm91cEN1c3RvbUFtaSgpO1xuXG4gICAgdGhpcy5hc3NlcnROb2RlR3JvdXBHcHUoKTtcblxuICAgIHRoaXMuYXNzZXJ0U2ltcGxlTWFuaWZlc3QoKTtcblxuICAgIHRoaXMuYXNzZXJ0TWFuaWZlc3RXaXRob3V0VmFsaWRhdGlvbigpO1xuXG4gICAgdGhpcy5hc3NlcnRTaW1wbGVIZWxtQ2hhcnQoKTtcblxuICAgIHRoaXMuYXNzZXJ0SGVsbUNoYXJ0QXNzZXQoKTtcblxuICAgIHRoaXMuYXNzZXJ0U2ltcGxlQ2RrOHNDaGFydCgpO1xuXG4gICAgdGhpcy5hc3NlcnRDcmVhdGVOYW1lc3BhY2UoKTtcblxuICAgIHRoaXMuYXNzZXJ0U2VydmljZUFjY291bnQoKTtcblxuICAgIHRoaXMuYXNzZXJ0RXh0ZW5kZWRTZXJ2aWNlQWNjb3VudCgpO1xuXG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnQ2x1c3RlckVuZHBvaW50JywgeyB2YWx1ZTogdGhpcy5jbHVzdGVyLmNsdXN0ZXJFbmRwb2ludCB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdDbHVzdGVyQXJuJywgeyB2YWx1ZTogdGhpcy5jbHVzdGVyLmNsdXN0ZXJBcm4gfSk7XG4gICAgbmV3IENmbk91dHB1dCh0aGlzLCAnQ2x1c3RlckNlcnRpZmljYXRlQXV0aG9yaXR5RGF0YScsIHsgdmFsdWU6IHRoaXMuY2x1c3Rlci5jbHVzdGVyQ2VydGlmaWNhdGVBdXRob3JpdHlEYXRhIH0pO1xuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0NsdXN0ZXJTZWN1cml0eUdyb3VwSWQnLCB7IHZhbHVlOiB0aGlzLmNsdXN0ZXIuY2x1c3RlclNlY3VyaXR5R3JvdXBJZCB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdDbHVzdGVyRW5jcnlwdGlvbkNvbmZpZ0tleUFybicsIHsgdmFsdWU6IHRoaXMuY2x1c3Rlci5jbHVzdGVyRW5jcnlwdGlvbkNvbmZpZ0tleUFybiB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdDbHVzdGVyTmFtZScsIHsgdmFsdWU6IHRoaXMuY2x1c3Rlci5jbHVzdGVyTmFtZSB9KTtcbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdOb2RlZ3JvdXBOYW1lJywgeyB2YWx1ZTogdGhpcy5jbHVzdGVyLmRlZmF1bHROb2RlZ3JvdXAhLm5vZGVncm91cE5hbWUgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydFNlcnZpY2VBY2NvdW50KCkge1xuICAgIC8vIGFkZCBhIHNlcnZpY2UgYWNjb3VudCBjb25uZWN0ZWQgdG8gYSBJQU0gcm9sZVxuICAgIHRoaXMuY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnTXlTZXJ2aWNlQWNjb3VudCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnRFeHRlbmRlZFNlcnZpY2VBY2NvdW50KCkge1xuICAgIC8vIGFkZCBhIHNlcnZpY2UgYWNjb3VudCBjb25uZWN0ZWQgdG8gYSBJQU0gcm9sZVxuICAgIHRoaXMuY2x1c3Rlci5hZGRTZXJ2aWNlQWNjb3VudCgnTXlFeHRlbmRlZFNlcnZpY2VBY2NvdW50Jywge1xuICAgICAgYW5ub3RhdGlvbnM6IHtcbiAgICAgICAgJ2Vrcy5hbWF6b25hd3MuY29tL3N0cy1yZWdpb25hbC1lbmRwb2ludHMnOiAnZmFsc2UnLFxuICAgICAgfSxcbiAgICAgIGxhYmVsczoge1xuICAgICAgICAnc29tZS1sYWJlbCc6ICd3aXRoLXNvbWUtdmFsdWUnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0Q3JlYXRlTmFtZXNwYWNlKCkge1xuICAgIC8vIGRlcGxveSBhbiBuZ2lueCBpbmdyZXNzIGluIGEgbmFtZXNwYWNlXG4gICAgY29uc3QgbmdpbnhOYW1lc3BhY2UgPSB0aGlzLmNsdXN0ZXIuYWRkTWFuaWZlc3QoJ25naW54LW5hbWVzcGFjZScsIHtcbiAgICAgIGFwaVZlcnNpb246ICd2MScsXG4gICAgICBraW5kOiAnTmFtZXNwYWNlJyxcbiAgICAgIG1ldGFkYXRhOiB7XG4gICAgICAgIG5hbWU6ICduZ2lueCcsXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgY29uc3QgbmdpbnhJbmdyZXNzID0gdGhpcy5jbHVzdGVyLmFkZEhlbG1DaGFydCgnbmdpbngtaW5ncmVzcycsIHtcbiAgICAgIGNoYXJ0OiAnbmdpbngtaW5ncmVzcycsXG4gICAgICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9oZWxtLm5naW54LmNvbS9zdGFibGUnLFxuICAgICAgbmFtZXNwYWNlOiAnbmdpbngnLFxuICAgICAgd2FpdDogdHJ1ZSxcbiAgICAgIHJlbGVhc2U6ICduZ2lueC1pbmdyZXNzJyxcbiAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9uZ2lueGluYy9oZWxtLWNoYXJ0cy90cmVlL21hc3Rlci9zdGFibGVcbiAgICAgIHZlcnNpb246ICcwLjE3LjEnLFxuICAgICAgdmFsdWVzOiB7XG4gICAgICAgIGNvbnRyb2xsZXI6IHtcbiAgICAgICAgICBzZXJ2aWNlOiB7XG4gICAgICAgICAgICBjcmVhdGU6IGZhbHNlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgY3JlYXRlTmFtZXNwYWNlOiBmYWxzZSxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLm1pbnV0ZXMoMTUpLFxuICAgIH0pO1xuXG4gICAgLy8gbWFrZSBzdXJlIG5hbWVzcGFjZSBpcyBkZXBsb3llZCBiZWZvcmUgdGhlIGNoYXJ0XG4gICAgbmdpbnhJbmdyZXNzLm5vZGUuYWRkRGVwZW5kZW5jeShuZ2lueE5hbWVzcGFjZSk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydFNpbXBsZUNkazhzQ2hhcnQoKSB7XG4gICAgY2xhc3MgQ2hhcnQgZXh0ZW5kcyBjZGs4cy5DaGFydCB7XG4gICAgICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIG5zOiBzdHJpbmcsIGNsdXN0ZXI6IGVrcy5JQ2x1c3Rlcikge1xuICAgICAgICBzdXBlcihzY29wZSwgbnMpO1xuXG4gICAgICAgIG5ldyBrcGx1cy5Db25maWdNYXAodGhpcywgJ2NvbmZpZy1tYXAnLCB7XG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgY2x1c3Rlck5hbWU6IGNsdXN0ZXIuY2x1c3Rlck5hbWUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGs4cy5BcHAoKTtcbiAgICBjb25zdCBjaGFydCA9IG5ldyBDaGFydChhcHAsICdDaGFydCcsIHRoaXMuY2x1c3Rlcik7XG5cbiAgICB0aGlzLmNsdXN0ZXIuYWRkQ2RrOHNDaGFydCgnY2RrOHMtY2hhcnQnLCBjaGFydCk7XG4gIH1cbiAgcHJpdmF0ZSBhc3NlcnRTaW1wbGVIZWxtQ2hhcnQoKSB7XG4gICAgLy8gZGVwbG95IHRoZSBLdWJlcm5ldGVzIGRhc2hib2FyZCB0aHJvdWdoIGEgaGVsbSBjaGFydFxuICAgIHRoaXMuY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ2Rhc2hib2FyZCcsIHtcbiAgICAgIGNoYXJ0OiAna3ViZXJuZXRlcy1kYXNoYm9hcmQnLFxuICAgICAgLy8gaHR0cHM6Ly9hcnRpZmFjdGh1Yi5pby9wYWNrYWdlcy9oZWxtL2s4cy1kYXNoYm9hcmQva3ViZXJuZXRlcy1kYXNoYm9hcmRcbiAgICAgIHZlcnNpb246ICc2LjAuOCcsXG4gICAgICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9rdWJlcm5ldGVzLmdpdGh1Yi5pby9kYXNoYm9hcmQvJyxcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgYXNzZXJ0SGVsbUNoYXJ0QXNzZXQoKSB7XG4gICAgLy8gZ2V0IGhlbG0gY2hhcnQgZnJvbSBBc3NldFxuICAgIGNvbnN0IGNoYXJ0QXNzZXQgPSBuZXcgQXNzZXQodGhpcywgJ0NoYXJ0QXNzZXQnLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAndGVzdC1jaGFydCcpLFxuICAgIH0pO1xuICAgIHRoaXMuY2x1c3Rlci5hZGRIZWxtQ2hhcnQoJ3Rlc3QtY2hhcnQnLCB7XG4gICAgICBjaGFydEFzc2V0OiBjaGFydEFzc2V0LFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlcnRTaW1wbGVNYW5pZmVzdCgpIHtcbiAgICAvLyBhcHBseSBhIGt1YmVybmV0ZXMgbWFuaWZlc3RcbiAgICB0aGlzLmNsdXN0ZXIuYWRkTWFuaWZlc3QoJ0hlbGxvQXBwJywgLi4uaGVsbG8ucmVzb3VyY2VzKTtcbiAgfVxuICBwcml2YXRlIGFzc2VydE1hbmlmZXN0V2l0aG91dFZhbGlkYXRpb24oKSB7XG4gICAgLy8gYXBwbHkgYSBrdWJlcm5ldGVzIG1hbmlmZXN0XG4gICAgbmV3IGVrcy5LdWJlcm5ldGVzTWFuaWZlc3QodGhpcywgJ0hlbGxvQXBwV2l0aG91dFZhbGlkYXRpb24nLCB7XG4gICAgICBjbHVzdGVyOiB0aGlzLmNsdXN0ZXIsXG4gICAgICBtYW5pZmVzdDogW3tcbiAgICAgICAgYXBpVmVyc2lvbjogJ3YxJyxcbiAgICAgICAga2luZDogJ0NvbmZpZ01hcCcsXG4gICAgICAgIGRhdGE6IHsgaGVsbG86ICd3b3JsZCcgfSxcbiAgICAgICAgbWV0YWRhdGE6IHsgbmFtZTogJ2NvbmZpZy1tYXAnIH0sXG4gICAgICAgIHVua25vd246IHsga2V5OiAndmFsdWUnIH0sXG4gICAgICB9XSxcbiAgICAgIHNraXBWYWxpZGF0aW9uOiB0cnVlLFxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgYXNzZXJ0Tm9kZUdyb3VwWDg2KCkge1xuICAgIC8vIGFkZCBhIGV4dHJhIG5vZGVncm91cFxuICAgIHRoaXMuY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnZXh0cmEtbmcnLCB7XG4gICAgICBpbnN0YW5jZVR5cGVzOiBbbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLnNtYWxsJyldLFxuICAgICAgbWluU2l6ZTogMSxcbiAgICAgIG1heFNpemU6IDQsXG4gICAgICBtYXhVbmF2YWlsYWJsZTogMyxcbiAgICAgIC8vIHJldXNpbmcgdGhlIGRlZmF1bHQgY2FwYWNpdHkgbm9kZWdyb3VwIGluc3RhbmNlIHJvbGUgd2hlbiBhdmFpbGFibGVcbiAgICAgIG5vZGVSb2xlOiB0aGlzLmNsdXN0ZXIuZGVmYXVsdENhcGFjaXR5ID8gdGhpcy5jbHVzdGVyLmRlZmF1bHRDYXBhY2l0eS5yb2xlIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgYXNzZXJ0Tm9kZUdyb3VwU3BvdCgpIHtcbiAgICAvLyBhZGQgYSBleHRyYSBub2RlZ3JvdXBcbiAgICB0aGlzLmNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ2V4dHJhLW5nLXNwb3QnLCB7XG4gICAgICBpbnN0YW5jZVR5cGVzOiBbXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdjNS5sYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzVhLmxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdtN2ktZmxleC5sYXJnZScpLFxuICAgICAgXSxcbiAgICAgIG1pblNpemU6IDMsXG4gICAgICAvLyByZXVzaW5nIHRoZSBkZWZhdWx0IGNhcGFjaXR5IG5vZGVncm91cCBpbnN0YW5jZSByb2xlIHdoZW4gYXZhaWxhYmxlXG4gICAgICBub2RlUm9sZTogdGhpcy5jbHVzdGVyLmRlZmF1bHRDYXBhY2l0eSA/IHRoaXMuY2x1c3Rlci5kZWZhdWx0Q2FwYWNpdHkucm9sZSA6IHVuZGVmaW5lZCxcbiAgICAgIGNhcGFjaXR5VHlwZTogZWtzLkNhcGFjaXR5VHlwZS5TUE9ULFxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgYXNzZXJ0Tm9kZUdyb3VwQ3VzdG9tQW1pKCkge1xuICAgIC8vIGFkZCBhIGV4dHJhIG5vZGVncm91cFxuICAgIGNvbnN0IHVzZXJEYXRhID0gZWMyLlVzZXJEYXRhLmZvckxpbnV4KCk7XG4gICAgdXNlckRhdGEuYWRkQ29tbWFuZHMoXG4gICAgICAnc2V0IC1vIHh0cmFjZScsXG4gICAgICBgL2V0Yy9la3MvYm9vdHN0cmFwLnNoICR7dGhpcy5jbHVzdGVyLmNsdXN0ZXJOYW1lfWAsXG4gICAgKTtcbiAgICBjb25zdCBsdCA9IG5ldyBlYzIuQ2ZuTGF1bmNoVGVtcGxhdGUodGhpcywgJ0xhdW5jaFRlbXBsYXRlJywge1xuICAgICAgbGF1bmNoVGVtcGxhdGVEYXRhOiB7XG4gICAgICAgIGltYWdlSWQ6IG5ldyBla3MuRWtzT3B0aW1pemVkSW1hZ2Uoe1xuICAgICAgICAgIGt1YmVybmV0ZXNWZXJzaW9uOiBla3MuS3ViZXJuZXRlc1ZlcnNpb24uVjFfMjUudmVyc2lvbixcbiAgICAgICAgfSkuZ2V0SW1hZ2UodGhpcykuaW1hZ2VJZCxcbiAgICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDMuc21hbGwnKS50b1N0cmluZygpLFxuICAgICAgICB1c2VyRGF0YTogRm4uYmFzZTY0KHVzZXJEYXRhLnJlbmRlcigpKSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgdGhpcy5jbHVzdGVyLmFkZE5vZGVncm91cENhcGFjaXR5KCdleHRyYS1uZzInLCB7XG4gICAgICBtaW5TaXplOiAxLFxuICAgICAgLy8gcmV1c2luZyB0aGUgZGVmYXVsdCBjYXBhY2l0eSBub2RlZ3JvdXAgaW5zdGFuY2Ugcm9sZSB3aGVuIGF2YWlsYWJsZVxuICAgICAgbm9kZVJvbGU6IHRoaXMuY2x1c3Rlci5kZWZhdWx0Tm9kZWdyb3VwPy5yb2xlIHx8IHRoaXMuY2x1c3Rlci5kZWZhdWx0Q2FwYWNpdHk/LnJvbGUsXG4gICAgICBsYXVuY2hUZW1wbGF0ZVNwZWM6IHtcbiAgICAgICAgaWQ6IGx0LnJlZixcbiAgICAgICAgdmVyc2lvbjogbHQuYXR0ckRlZmF1bHRWZXJzaW9uTnVtYmVyLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuICBwcml2YXRlIGFzc2VydE5vZGVHcm91cEFybSgpIHtcbiAgICAvLyBhZGQgYSBleHRyYSBub2RlZ3JvdXBcbiAgICB0aGlzLmNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ2V4dHJhLW5nLWFybScsIHtcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTZnLm1lZGl1bScpXSxcbiAgICAgIG1pblNpemU6IDEsXG4gICAgICBtYXhVbmF2YWlsYWJsZVBlcmNlbnRhZ2U6IDMzLFxuICAgICAgLy8gcmV1c2luZyB0aGUgZGVmYXVsdCBjYXBhY2l0eSBub2RlZ3JvdXAgaW5zdGFuY2Ugcm9sZSB3aGVuIGF2YWlsYWJsZVxuICAgICAgbm9kZVJvbGU6IHRoaXMuY2x1c3Rlci5kZWZhdWx0Q2FwYWNpdHkgPyB0aGlzLmNsdXN0ZXIuZGVmYXVsdENhcGFjaXR5LnJvbGUgOiB1bmRlZmluZWQsXG4gICAgfSk7XG4gIH1cbiAgcHJpdmF0ZSBhc3NlcnROb2RlR3JvdXBHcmF2aXRvbjMoKSB7XG4gICAgLy8gYWRkIGEgR3Jhdml0b24zIG5vZGVncm91cFxuICAgIHRoaXMuY2x1c3Rlci5hZGROb2RlZ3JvdXBDYXBhY2l0eSgnZXh0cmEtbmctYXJtMycsIHtcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtuZXcgZWMyLkluc3RhbmNlVHlwZSgnYzdnLmxhcmdlJyldLFxuICAgICAgbWluU2l6ZTogMSxcbiAgICAgIC8vIHJldXNpbmcgdGhlIGRlZmF1bHQgY2FwYWNpdHkgbm9kZWdyb3VwIGluc3RhbmNlIHJvbGUgd2hlbiBhdmFpbGFibGVcbiAgICAgIG5vZGVSb2xlOiB0aGlzLmNsdXN0ZXIuZGVmYXVsdENhcGFjaXR5ID8gdGhpcy5jbHVzdGVyLmRlZmF1bHRDYXBhY2l0eS5yb2xlIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgYXNzZXJ0Tm9kZUdyb3VwR3B1KCkge1xuICAgIC8vIGFkZCBhIEdQVSBub2RlZ3JvdXBcbiAgICB0aGlzLmNsdXN0ZXIuYWRkTm9kZWdyb3VwQ2FwYWNpdHkoJ2V4dHJhLW5nLWdwdScsIHtcbiAgICAgIGluc3RhbmNlVHlwZXM6IFtcbiAgICAgICAgbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3AyLnhsYXJnZScpLFxuICAgICAgICBuZXcgZWMyLkluc3RhbmNlVHlwZSgnZzUueGxhcmdlJyksXG4gICAgICAgIG5ldyBlYzIuSW5zdGFuY2VUeXBlKCdnNmUueGxhcmdlJyksXG4gICAgICBdLFxuICAgICAgbWluU2l6ZTogMSxcbiAgICAgIC8vIHJldXNpbmcgdGhlIGRlZmF1bHQgY2FwYWNpdHkgbm9kZWdyb3VwIGluc3RhbmNlIHJvbGUgd2hlbiBhdmFpbGFibGVcbiAgICAgIG5vZGVSb2xlOiB0aGlzLmNsdXN0ZXIuZGVmYXVsdENhcGFjaXR5ID8gdGhpcy5jbHVzdGVyLmRlZmF1bHRDYXBhY2l0eS5yb2xlIDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgYXNzZXJ0U3BvdENhcGFjaXR5KCkge1xuICAgIC8vIHNwb3QgaW5zdGFuY2VzICh1cCB0byAxMClcbiAgICB0aGlzLmNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdzcG90Jywge1xuICAgICAgc3BvdFByaWNlOiAnMC4xMDk0JyxcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLmxhcmdlJyksXG4gICAgICBtYXhDYXBhY2l0eTogMTAsXG4gICAgICBib290c3RyYXBPcHRpb25zOiB7XG4gICAgICAgIGt1YmVsZXRFeHRyYUFyZ3M6ICctLW5vZGUtbGFiZWxzIGZvbz1iYXIsZ29vPWZhcicsXG4gICAgICAgIGF3c0FwaVJldHJ5QXR0ZW1wdHM6IDUsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG4gIHByaXZhdGUgYXNzZXJ0Qm90dGxlcm9ja2V0KCkge1xuICAgIC8vIGFkZCBib3R0bGVyb2NrZXQgbm9kZXNcbiAgICB0aGlzLmNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdCb3R0bGVyb2NrZXROb2RlcycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QzLnNtYWxsJyksXG4gICAgICBtaW5DYXBhY2l0eTogMixcbiAgICAgIG1hY2hpbmVJbWFnZVR5cGU6IGVrcy5NYWNoaW5lSW1hZ2VUeXBlLkJPVFRMRVJPQ0tFVCxcbiAgICB9KTtcbiAgfVxuICBwcml2YXRlIGFzc2VydENhcGFjaXR5WDg2KCkge1xuICAgIC8vIGFkZCBzb21lIHg4Nl82NCBjYXBhY2l0eSB0byB0aGUgY2x1c3Rlci4gVGhlIElBTSBpbnN0YW5jZSByb2xlIHdpbGxcbiAgICAvLyBhdXRvbWF0aWNhbGx5IGJlIG1hcHBlZCB2aWEgYXdzLWF1dGggdG8gYWxsb3cgbm9kZXMgdG8gam9pbiB0aGUgY2x1c3Rlci5cbiAgICB0aGlzLmNsdXN0ZXIuYWRkQXV0b1NjYWxpbmdHcm91cENhcGFjaXR5KCdOb2RlcycsIHtcbiAgICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ3QyLm1lZGl1bScpLFxuICAgICAgbWluQ2FwYWNpdHk6IDMsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydENhcGFjaXR5QXJtKCkge1xuICAgIC8vIGFkZCBzb21lIGFybTY0IGNhcGFjaXR5IHRvIHRoZSBjbHVzdGVyLiBUaGUgSUFNIGluc3RhbmNlIHJvbGUgd2lsbFxuICAgIC8vIGF1dG9tYXRpY2FsbHkgYmUgbWFwcGVkIHZpYSBhd3MtYXV0aCB0byBhbGxvdyBub2RlcyB0byBqb2luIHRoZSBjbHVzdGVyLlxuICAgIHRoaXMuY2x1c3Rlci5hZGRBdXRvU2NhbGluZ0dyb3VwQ2FwYWNpdHkoJ05vZGVzQXJtJywge1xuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgnbTZnLm1lZGl1bScpLFxuICAgICAgbWluQ2FwYWNpdHk6IDEsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzc2VydEZhcmdhdGVQcm9maWxlKCkge1xuICAgIC8vIGZhcmdhdGUgcHJvZmlsZSBmb3IgcmVzb3VyY2VzIGluIHRoZSBcImRlZmF1bHRcIiBuYW1lc3BhY2VcbiAgICB0aGlzLmNsdXN0ZXIuYWRkRmFyZ2F0ZVByb2ZpbGUoJ2RlZmF1bHQnLCB7XG4gICAgICBzZWxlY3RvcnM6IFt7IG5hbWVzcGFjZTogJ2RlZmF1bHQnIH1dLFxuICAgIH0pO1xuICB9XG59XG5cbi8vIHRoaXMgdGVzdCB1c2VzIGJvdGggdGhlIGJvdHRsZXJvY2tldCBpbWFnZSBhbmQgdGhlIGluZjEgaW5zdGFuY2UsIHdoaWNoIGFyZSBvbmx5IHN1cHBvcnRlZCBpbiB0aGVzZVxuLy8gcmVnaW9ucy4gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWNkay90cmVlL21haW4vcGFja2FnZXMvYXdzLWNkay1saWIvYXdzLWVrcyNib3R0bGVyb2NrZXRcbi8vIGFuZCBodHRwczovL2F3cy5hbWF6b24uY29tL2Fib3V0LWF3cy93aGF0cy1uZXcvMjAxOS8xMi9pbnRyb2R1Y2luZy1hbWF6b24tZWMyLWluZjEtaW5zdGFuY2VzLWhpZ2gtcGVyZm9ybWFuY2UtYW5kLXRoZS1sb3dlc3QtY29zdC1tYWNoaW5lLWxlYXJuaW5nLWluZmVyZW5jZS1pbi10aGUtY2xvdWQvXG5jb25zdCBzdXBwb3J0ZWRSZWdpb25zID0gW1xuICAndXMtZWFzdC0xJyxcbiAgJ3VzLXdlc3QtMicsXG5dO1xuXG5jb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgcG9zdENsaUNvbnRleHQ6IHtcbiAgICBbSUFNX09JRENfUkVKRUNUX1VOQVVUSE9SSVpFRF9DT05ORUNUSU9OU106IGZhbHNlLFxuICAgICdAYXdzLWNkay9hd3MtbGFtYmRhOmNyZWF0ZU5ld1BvbGljaWVzV2l0aEFkZFRvUm9sZVBvbGljeSc6IHRydWUsXG4gICAgJ0Bhd3MtY2RrL2F3cy1sYW1iZGE6dXNlQ2RrTWFuYWdlZExvZ0dyb3VwJzogZmFsc2UsXG4gIH0sXG59KTtcblxuLy8gc2luY2UgdGhlIEVLUyBvcHRpbWl6ZWQgQU1JIGlzIGhhcmQtY29kZWQgaGVyZSBiYXNlZCBvbiB0aGUgcmVnaW9uLFxuLy8gd2UgbmVlZCB0byBhY3R1YWxseSBwYXNzIGluIGEgc3BlY2lmaWMgcmVnaW9uLlxuY29uc3Qgc3RhY2sgPSBuZXcgRWtzQ2x1c3RlclN0YWNrKGFwcCwgJ2F3cy1jZGstZWtzLWNsdXN0ZXInLCB7XG4gIGVudjogeyByZWdpb246ICd1cy1lYXN0LTEnIH0sXG59KTtcblxuaWYgKHByb2Nlc3MuZW52LkNES19JTlRFR19BQ0NPVU5UICE9PSAnMTIzNDU2NzgnKSB7XG4gIC8vIG9ubHkgdmFsaWRhdGUgaWYgd2UgYXJlIGFib3V0IHRvIGFjdHVhbGx5IGRlcGxveS5cbiAgLy8gVE9ETzogYmV0dGVyIHdheSB0byBkZXRlcm1pbmUgdGhpcywgcmlnaHQgbm93IHRoZSAnQ0RLX0lOVEVHX0FDQ09VTlQnIHNlZW1zIGxpa2UgdGhlIG9ubHkgd2F5LlxuXG4gIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQoc3RhY2sucmVnaW9uKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgcmVnaW9uICgke3N0YWNrLnJlZ2lvbn0pIGNhbm5vdCBiZSBhIHRva2VuIGFuZCBtdXN0IGJlIGNvbmZpZ3VyZWQgdG8gb25lIG9mOiAke3N1cHBvcnRlZFJlZ2lvbnN9YCk7XG4gIH1cblxuICBpZiAoIXN1cHBvcnRlZFJlZ2lvbnMuaW5jbHVkZXMoc3RhY2sucmVnaW9uKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgcmVnaW9uICgke3N0YWNrLnJlZ2lvbn0pIG11c3QgYmUgY29uZmlndXJlZCB0byBvbmUgb2Y6ICR7c3VwcG9ydGVkUmVnaW9uc31gKTtcbiAgfVxufVxuXG5uZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ2F3cy1jZGstZWtzLWNsdXN0ZXItaW50ZWcnLCB7XG4gIHRlc3RDYXNlczogW3N0YWNrXSxcbiAgLy8gVGVzdCBpbmNsdWRlcyBhc3NldHMgdGhhdCBhcmUgdXBkYXRlZCB3ZWVrbHkuIElmIG5vdCBkaXNhYmxlZCwgdGhlIHVwZ3JhZGUgUFIgd2lsbCBmYWlsLlxuICBkaWZmQXNzZXRzOiBmYWxzZSxcbiAgY2RrQ29tbWFuZE9wdGlvbnM6IHtcbiAgICBkZXBsb3k6IHtcbiAgICAgIGFyZ3M6IHtcbiAgICAgICAgcm9sbGJhY2s6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdfQ==