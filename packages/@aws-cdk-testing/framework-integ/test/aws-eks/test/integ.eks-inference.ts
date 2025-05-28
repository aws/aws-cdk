/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';
import { IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS } from 'aws-cdk-lib/cx-api';

class EksClusterInferenceStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // just need one nat gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      ...getClusterVersionConfig(this),
      albController: {
        version: eks.AlbControllerVersion.V2_5_1,
      },
    });

    cluster.addAutoScalingGroupCapacity('InferenceInstances', {
      instanceType: new ec2.InstanceType('inf1.2xlarge'),
      minCapacity: 1,
    });

    cluster.addAutoScalingGroupCapacity('Inference2Instances', {
      instanceType: new ec2.InstanceType('inf2.xlarge'),
      minCapacity: 1,
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
const stack = new EksClusterInferenceStack(app, 'aws-cdk-eks-cluster-inference');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-interence-integ', {
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
app.synth();
