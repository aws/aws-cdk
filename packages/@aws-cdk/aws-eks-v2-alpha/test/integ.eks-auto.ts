import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { KubectlV33Layer } from '@aws-cdk/lambda-layer-kubectl-v33';
import * as eks from '../lib';
import { Construct } from 'constructs';
import * as integ from '@aws-cdk/integ-tests-alpha';

interface EksMinimalClusterProps {
  readonly vpc: ec2.Vpc;
  readonly mastersRole: iam.Role;
  readonly compute?: {
    nodePools: any[];
  };
}

class EksMinimalCluster extends Construct {
  constructor(scope: Construct, id: string, props: EksMinimalClusterProps) {
    super(scope, id);

    const clusterProps: any = {
      vpc: props.vpc,
      mastersRole: props.mastersRole,
      version: eks.KubernetesVersion.V1_33,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV33Layer(this, 'kubectl'),
      },
      defaultCapacityType: eks.DefaultCapacityType.AUTOMODE,
    };

    // Add compute configuration if provided
    if (props.compute) {
      clusterProps.compute = props.compute;
    }

    new eks.Cluster(this, 'cluster', clusterProps);
  }
}

/**
 * This stack is used to test the EKS cluster with auto mode enabled.
 */
export class EksAutoModeBaseStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
    const mastersRole = new iam.Role(this, 'Role', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    new EksMinimalCluster(this, 'hello-eks', {
      vpc,
      mastersRole,
    });
  }
}

/**
 * This stack is used to test the EKS cluster with auto mode enabled with empty node pools.
 */
export class EksAutoModeNodePoolsStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });
    const mastersRole = new iam.Role(this, 'Role', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    new EksMinimalCluster(this, 'hello-eks', {
      vpc,
      mastersRole,
      compute: {
        nodePools: [],
      },
    });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack1 = new EksAutoModeBaseStack(app, 'eks-auto-mode-stack', { env: { region: 'us-east-1' } });
const stack2 = new EksAutoModeNodePoolsStack(app, 'eks-auto-mode-empty-nodepools-stack', { env: { region: 'us-east-1' } });

new integ.IntegTest(app, 'aws-cdk-eks-cluster-integ', {
  testCases: [stack1, stack2],
});
