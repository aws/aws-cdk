/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, CfnOutput, Duration, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk8s from 'cdk8s';
import * as kplus from 'cdk8s-plus-27';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import { Pinger } from './pinger/pinger';
import * as eks from 'aws-cdk-lib/aws-eks';
import { IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS } from 'aws-cdk-lib/cx-api';

const LATEST_VERSION: eks.AlbControllerVersion = eks.AlbControllerVersion.V2_8_2;
class EksClusterAlbControllerStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // just need one nat gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_30),
      albController: {
        version: LATEST_VERSION,
        additionalHelmChartValues: {
          enableWafv2: false,
        },
      },
    });

    const chart = new cdk8s.Chart(new cdk8s.App(), 'hello-server');

    const ingress = new kplus.Deployment(chart, 'Deployment', {
      containers: [{
        image: 'hashicorp/http-echo',
        args: ['-text', 'hello'],
        port: 5678,
        securityContext: {
          user: 1005,
        },
      }],
    })
      .exposeViaService({ serviceType: kplus.ServiceType.NODE_PORT })
      .exposeViaIngress('/');

    // allow vpc to access the ELB so our pinger can hit it.
    ingress.metadata.addAnnotation('alb.ingress.kubernetes.io/inbound-cidrs', cluster.vpc.vpcCidrBlock);

    const echoServer = cluster.addCdk8sChart('echo-server', chart, { ingressAlb: true, ingressAlbScheme: eks.AlbScheme.INTERNAL });

    // the deletion of `echoServer` is what instructs the controller to delete the ELB.
    // so we need to make sure this happens before the controller is deleted.
    echoServer.node.addDependency(cluster.albController ?? []);

    const loadBalancerAddress = cluster.getIngressLoadBalancerAddress(ingress.name, { timeout: Duration.minutes(10) });

    // create a resource that hits the load balancer to make sure
    // everything is wired properly.
    const pinger = new Pinger(this, 'IngressPinger', {
      url: `http://${loadBalancerAddress}`,
      vpc: cluster.vpc,
    });

    // the pinger must wait for the ingress and echoServer to be deployed.
    pinger.node.addDependency(ingress, echoServer);

    // this should display the 'hello' text we gave to the server
    new CfnOutput(this, 'IngressPingerResponse', {
      value: pinger.response,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    [IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS]: false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new EksClusterAlbControllerStack(app, 'aws-cdk-eks-cluster-alb-controller');
new integ.IntegTest(app, 'aws-cdk-cluster-alb-controller-integ', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});
app.synth();
