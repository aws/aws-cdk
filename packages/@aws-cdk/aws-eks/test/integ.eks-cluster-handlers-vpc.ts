/// !cdk-integ pragma:disable-update-workflow
import { App, Stack } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as eks from '../lib';

const CLUSTER_VERSION = eks.KubernetesVersion.V1_21;


class EksAllHandlersInVpcStack extends Stack {

  constructor(scope: App, id: string) {
    super(scope, id);

    new eks.Cluster(this, 'EksAllHandlersInVpcStack', {
      version: CLUSTER_VERSION,
      placeClusterHandlerInVpc: true,
    });
  }
}

const app = new App();

const stack = new EksAllHandlersInVpcStack(app, 'aws-cdk-eks-handlers-in-vpc-test');
new integ.IntegTest(app, 'aws-cdk-eks-handlers-in-vpc', {
  testCases: [stack],
});

app.synth();
