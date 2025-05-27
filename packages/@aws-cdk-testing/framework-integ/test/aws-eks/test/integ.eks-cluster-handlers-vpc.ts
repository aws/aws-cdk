/// !cdk-integ pragma:disable-update-workflow
import { App, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

class EksAllHandlersInVpcStack extends Stack {
  constructor(scope: App, id: string) {
    super(scope, id);

    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);
    new eks.Cluster(this, 'EksAllHandlersInVpcStack', {
      ...getClusterVersionConfig(this),
      placeClusterHandlerInVpc: true,
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new EksAllHandlersInVpcStack(app, 'aws-cdk-eks-handlers-in-vpc-test');
new integ.IntegTest(app, 'aws-cdk-eks-handlers-in-vpc', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});

app.synth();
