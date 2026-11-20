/// !cdk-integ pragma:disable-update-workflow
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, CfnOutput, Stack } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';
import { NodegroupAmiType, TaintEffect } from 'aws-cdk-lib/aws-eks';
import { EC2_RESTRICT_DEFAULT_SECURITY_GROUP } from 'aws-cdk-lib/cx-api';

class EksClusterStack extends Stack {
  private cluster: eks.Cluster;
  private vpc: ec2.IVpc;

  constructor(scope: App, id: string) {
    super(scope, id);
    this.node.setContext(EC2_RESTRICT_DEFAULT_SECURITY_GROUP, false);

    // allow all account users to assume this role in order to admin the cluster
    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    // just need one nat gateway to simplify the test
    this.vpc = new ec2.Vpc(this, 'Vpc', { natGateways: 1 });

    // create the cluster with a default nodegroup capacity
    this.cluster = new eks.Cluster(this, 'Cluster', {
      vpc: this.vpc,
      mastersRole,
      defaultCapacity: 0,
      ...getClusterVersionConfig(this),
    });

    this.cluster.addNodegroupCapacity('LinuxNodegroup', {
      amiType: NodegroupAmiType.AL2023_X86_64_STANDARD,
    });
    const windowsNodegroup = this.cluster.addNodegroupCapacity('WindowsNodegroup', {
      amiType: NodegroupAmiType.WINDOWS_FULL_2022_X86_64,
      taints: [
        {
          effect: TaintEffect.NO_SCHEDULE,
          key: 'os',
          value: 'windows',
        },
      ],
    });

    // Read back the deployed aws-auth role mappings: kube-proxy on Windows nodes
    // needs the node role mapped to the eks:kube-proxy-windows group.
    const mapRoles = new eks.KubernetesObjectValue(this, 'AwsAuthMapRolesValue', {
      cluster: this.cluster,
      objectType: 'configmap',
      objectName: 'aws-auth',
      objectNamespace: 'kube-system',
      jsonPath: '.data.mapRoles',
    });
    mapRoles.node.addDependency(windowsNodegroup);
    mapRoles.node.addDependency(this.cluster.awsAuth);

    new CfnOutput(this, 'AwsAuthMapRoles', { value: mapRoles.value });
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new EksClusterStack(app, 'aws-cdk-eks-cluster-windows-ng-test');
const test = new integ.IntegTest(app, 'aws-cdk-eks-cluster-windows-ng', {
  testCases: [stack],
  // Test includes assets that are updated weekly. If not disabled, the upgrade PR will fail.
  diffAssets: false,
});

// Fails the run unless the deployed aws-auth ConfigMap maps a node role to eks:kube-proxy-windows.
test.assertions.awsApiCall('CloudFormation', 'describeStacks', {
  StackName: stack.stackName,
}).expect(integ.ExpectedResult.objectLike({
  Stacks: integ.Match.arrayWith([
    integ.Match.objectLike({
      Outputs: integ.Match.arrayWith([
        integ.Match.objectLike({
          OutputKey: 'AwsAuthMapRoles',
          OutputValue: integ.Match.stringLikeRegexp('eks:kube-proxy-windows'),
        }),
      ]),
    }),
  ]),
}));
app.synth();
