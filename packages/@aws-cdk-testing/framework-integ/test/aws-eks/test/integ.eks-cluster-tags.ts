/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as eks from 'aws-cdk-lib/aws-eks';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';

class EksClusterTagsStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    // just need one nat gateway to simplify the test
    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });
    new eks.Cluster(this, 'Cluster', {
      vpc,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_31),
      defaultCapacity: 0,
      tags: {
        foo: 'world',
      },
    },
    );
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new EksClusterTagsStack(app, 'EKSTagStack');
new integ.IntegTest(app, 'aws-cdk-eks-cluster-tags-integ', {
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
