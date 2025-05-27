// ALB controller with EKS cluster that supports API mode only
import {
  App, Stack, StackProps,
  aws_ec2 as ec2,
} from 'aws-cdk-lib';
import * as eks from 'aws-cdk-lib/aws-eks';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS } from 'aws-cdk-lib/cx-api';

class EksClusterStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_30),
      defaultCapacity: 2,
      authenticationMode: eks.AuthenticationMode.API,
    });

    // create the controller
    eks.AlbController.create(this, {
      cluster,
      version: eks.AlbControllerVersion.V2_6_2,
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

const stack = new EksClusterStack(app, 'integ-eks-stack');

new IntegTest(app, 'integtest', {
  testCases: [stack],
});
