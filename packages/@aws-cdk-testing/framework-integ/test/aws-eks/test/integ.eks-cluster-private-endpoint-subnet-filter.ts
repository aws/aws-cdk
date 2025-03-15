/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { App } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as eks from 'aws-cdk-lib/aws-eks';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new cdk.Stack(app, 'StackWithVpc', {
  env: {
    region: 'eu-west-1',
    account: '123456',
  },
});
stack.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

const testVpc = new ec2.Vpc(stack, 'MyVpc', {
  vpcName: 'my-vpc-name',
});

// allow all account users to assume this role in order to admin the cluster
const mastersRole = new iam.Role(stack, 'AdminRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});

// Look up an existing VPC
const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', {
  vpcName: 'my-vpc-name',
});

// Create EKS cluster with private endpoint and subnet filtering
new eks.Cluster(stack, 'Cluster', {
  vpc,
  mastersRole,
  ...getClusterVersionConfig(stack),
  endpointAccess: eks.EndpointAccess.PRIVATE,
  vpcSubnets: [
    {
      subnetFilters: [
        ec2.SubnetFilter.byIds([testVpc.privateSubnets[0].subnetId]), // Replace with subnetIds
      ],
    },
  ],
  prune: false,
});

new integ.IntegTest(app, 'aws-cdk-eks-cluster-private-endpoint-subnet-filter', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});
