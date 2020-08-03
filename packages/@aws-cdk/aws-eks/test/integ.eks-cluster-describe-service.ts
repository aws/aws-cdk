/// !cdk-integ pragma:ignore-assets
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { App, CfnOutput } from '@aws-cdk/core';
import * as eks from '../lib';
// import { Pinger } from './pinger/pinger';
import { Pinger } from './pinger/pinger';
import { TestStack } from './util';

class EksClusterStack extends TestStack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // allow all account users to assume this role in order to admin the cluster
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // just need one nat gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 3, natGateways: 1 });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      mastersRole,
      defaultCapacity: 2,
      version: eks.KubernetesVersion.V1_16,
    });

    const serviceName = 'webservice';
    const labels = { app: 'simple-web' };
    const containerPort = 80;
    const servicePort = 9000;

    const pingerSecurityGroup = new ec2.SecurityGroup(this, 'WebServiceSecurityGroup', {
      vpc: vpc,
    });

    pingerSecurityGroup.addIngressRule(pingerSecurityGroup, ec2.Port.tcp(servicePort), `allow http ${servicePort} access from myself`);

    cluster.addResource('simple-web-pod', {
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

    const service = cluster.addResource('simple-web-service', {
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

    const serviceDescription = cluster.describeService({serviceName: serviceName});
    // TODO is this really needed? If so, would be nice to do this automagically.
    serviceDescription.node.addDependency(service);

    // create a resource that hits the load balancer to make sure
    // everything is wired properly.
    const pinger = new Pinger(this, 'ServicePinger', {
      url: `http://${serviceDescription.loadBalancerAddress}:${servicePort}`,
      securityGroup: pingerSecurityGroup,
      vpc: vpc,
    });

    // this should display a proper nginx response
    // <title>Welcome to nginx!</title>...
    new CfnOutput(this, 'Response', {
      value: pinger.response,
    });

  }
}


const app = new App();

new EksClusterStack(app, 'aws-cdk-eks-cluster-kubectl-describe-service-test');

app.synth();
