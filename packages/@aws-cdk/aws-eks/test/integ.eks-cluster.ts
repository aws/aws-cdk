/// !cdk-integ pragma:ignore-assets
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { App, CfnOutput, Duration, Token } from '@aws-cdk/core';
import * as eks from '../lib';
import * as hello from './hello-k8s';
import { Pinger } from './pinger/pinger';
import { TestStack } from './util';

class EksClusterStack extends TestStack {

  private cluster: eks.Cluster;
  private vpc: ec2.Vpc;

  constructor(scope: App, id: string) {
    super(scope, id);

    // allow all account users to assume this role in order to admin the cluster
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // just need one nat gateway to simplify the test
    this.vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });

    // create the cluster with a default nodegroup capacity
    this.cluster = new eks.Cluster(this, 'Cluster', {
      vpc: this.vpc,
      mastersRole,
      defaultCapacity: 2,
      version: eks.KubernetesVersion.V1_16,
    });

    this.assertFargateProfile();

    this.assertCapacity();

    this.assertBottlerocket();

    this.assertSpotCapacity();

    this.assertInferenceInstances();

    this.assertNodeGroup();

    this.assertSimpleManifest();

    this.assertSimpleHelmChart();

    this.assertCreateNamespace();

    this.assertServiceAccount();

    this.assertServiceLoadBalancerAddress();

    new CfnOutput(this, 'ClusterEndpoint', { value: this.cluster.clusterEndpoint });
    new CfnOutput(this, 'ClusterArn', { value: this.cluster.clusterArn });
    new CfnOutput(this, 'ClusterCertificateAuthorityData', { value: this.cluster.clusterCertificateAuthorityData });
    new CfnOutput(this, 'ClusterSecurityGroupId', { value: this.cluster.clusterSecurityGroupId });
    new CfnOutput(this, 'ClusterEncryptionConfigKeyArn', { value: this.cluster.clusterEncryptionConfigKeyArn });
    new CfnOutput(this, 'ClusterName', { value: this.cluster.clusterName });
  }

  private assertServiceAccount() {
    // add a service account connected to a IAM role
    this.cluster.addServiceAccount('MyServiceAccount');
  }

  private assertCreateNamespace() {
    // deploy an nginx ingress in a namespace
    const nginxNamespace = this.cluster.addManifest('nginx-namespace', {
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: {
        name: 'nginx',
      },
    });

    const nginxIngress = this.cluster.addChart('nginx-ingress', {
      chart: 'nginx-ingress',
      repository: 'https://helm.nginx.com/stable',
      namespace: 'nginx',
      wait: true,
      createNamespace: false,
      timeout: Duration.minutes(15),
    });

    // make sure namespace is deployed before the chart
    nginxIngress.node.addDependency(nginxNamespace);


  }
  private assertSimpleHelmChart() {
    // deploy the Kubernetes dashboard through a helm chart
    this.cluster.addChart('dashboard', {
      chart: 'kubernetes-dashboard',
      repository: 'https://kubernetes.github.io/dashboard/',
    });
  }
  private assertSimpleManifest() {
    // apply a kubernetes manifest
    this.cluster.addManifest('HelloApp', ...hello.resources);
  }
  private assertNodeGroup() {
    // add a extra nodegroup
    this.cluster.addNodegroup('extra-ng', {
      instanceType: new ec2.InstanceType('t3.small'),
      minSize: 1,
      // reusing the default capacity nodegroup instance role when available
      nodeRole: this.cluster.defaultCapacity ? this.cluster.defaultCapacity.role : undefined,
    });
  }
  private assertInferenceInstances() {
    // inference instances
    this.cluster.addCapacity('InferenceInstances', {
      instanceType: new ec2.InstanceType('inf1.2xlarge'),
      minCapacity: 1,
    });
  }
  private assertSpotCapacity() {
    // spot instances (up to 10)
    this.cluster.addCapacity('spot', {
      spotPrice: '0.1094',
      instanceType: new ec2.InstanceType('t3.large'),
      maxCapacity: 10,
      bootstrapOptions: {
        kubeletExtraArgs: '--node-labels foo=bar,goo=far',
        awsApiRetryAttempts: 5,
      },
    });
  }
  private assertBottlerocket() {
    // add bottlerocket nodes
    this.cluster.addCapacity('BottlerocketNodes', {
      instanceType: new ec2.InstanceType('t3.small'),
      minCapacity: 2,
      machineImageType: eks.MachineImageType.BOTTLEROCKET,
    });

  }
  private assertCapacity() {
    // add some capacity to the cluster. The IAM instance role will
    // automatically be mapped via aws-auth to allow nodes to join the cluster.
    this.cluster.addCapacity('Nodes', {
      instanceType: new ec2.InstanceType('t2.medium'),
      minCapacity: 3,
    });
  }
  private assertFargateProfile() {
    // fargate profile for resources in the "default" namespace
    this.cluster.addFargateProfile('default', {
      selectors: [{ namespace: 'default' }],
    });

  }

  private assertServiceLoadBalancerAddress() {

    const serviceName = 'webservice';
    const labels = { app: 'simple-web' };
    const containerPort = 80;
    const servicePort = 9000;

    const pingerSecurityGroup = new ec2.SecurityGroup(this, 'WebServiceSecurityGroup', {
      vpc: this.vpc,
    });

    pingerSecurityGroup.addIngressRule(pingerSecurityGroup, ec2.Port.tcp(servicePort), `allow http ${servicePort} access from myself`);

    this.cluster.addManifest('simple-web-pod', {
      kind: 'Pod',
      apiVersion: 'v1',
      metadata: { name: 'webpod', labels: labels },
      spec: {
        containers: [{
          name: 'simplewebcontainer',
          image: 'nginx',
          ports: [{ containerPort: containerPort }],
        }],
      },
    });

    this.cluster.addManifest('simple-web-service', {
      kind: 'Service',
      apiVersion: 'v1',
      metadata: {
        name: serviceName,
        annotations: {
          // this is furtile soil for cdk8s-plus! :)
          'service.beta.kubernetes.io/aws-load-balancer-internal': 'true',
          'service.beta.kubernetes.io/aws-load-balancer-extra-security-groups': pingerSecurityGroup.securityGroupId,
        },
      },
      spec: {
        type: 'LoadBalancer',
        ports: [{ port: servicePort, targetPort: containerPort }],
        selector: labels,
      },
    });

    const loadBalancerAddress = this.cluster.getServiceLoadBalancerAddress(serviceName);

    // create a resource that hits the load balancer to make sure
    // everything is wired properly.
    const pinger = new Pinger(this, 'ServicePinger', {
      url: `http://${loadBalancerAddress}:${servicePort}`,
      securityGroup: pingerSecurityGroup,
      vpc: this.vpc,
    });

    // this should display a proper nginx response
    // <title>Welcome to nginx!</title>...
    new CfnOutput(this, 'Response', {
      value: pinger.response,
    });

  }
}

// this test uses the bottlerocket image, which is only supported in these
// regions. see https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/aws-eks#bottlerocket
const supportedRegions = [
  'ap-northeast-1',
  'ap-south-1',
  'eu-central-1',
  'us-east-1',
  'us-west-2',
];

const app = new App();

// since the EKS optimized AMI is hard-coded here based on the region,
// we need to actually pass in a specific region.
const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-test');

if (process.env.CDK_INTEG_ACCOUNT !== '12345678') {

  // only validate if we are about to actually deploy.
  // TODO: better way to determine this, right now the 'CDK_INTEG_ACCOUNT' seems like the only way.

  if (Token.isUnresolved(stack.region)) {
    throw new Error(`region (${stack.region}) cannot be a token and must be configured to one of: ${supportedRegions}`);
  }

  if (!supportedRegions.includes(stack.region)) {
    throw new Error(`region (${stack.region}) must be configured to one of: ${supportedRegions}`);
  }

}


app.synth();
