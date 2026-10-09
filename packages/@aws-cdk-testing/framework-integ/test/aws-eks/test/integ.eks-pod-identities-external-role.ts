import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import * as eks from 'aws-cdk-lib/aws-eks';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * After deployment, verify it with:
 *
 * $ kubectl get po
 *
 * You should see a pod named `demo-external-role` in Completed STATUS.
 *
 * $ kubectl logs -f demo-external-role
 *
 * You should see a log message with UserId, Account and Arn followed by `yum install`.
 * This indicates the pod is running with correct eks pod identity defined with
 * ServiceAccount using an externally-created IAM role.
 */

class EksClusterStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const mastersRole = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    const vpc = new ec2.Vpc(this, 'VPC', { natGateways: 1 });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      mastersRole,
      defaultCapacity: 1,
      ...getClusterVersionConfig(this, eks.KubernetesVersion.V1_30),
      authenticationMode: eks.AuthenticationMode.API_AND_CONFIG_MAP,
    });

    // Create an IAM role externally (caller is responsible for the trust policy)
    const externalRole = new iam.Role(this, 'ExternalRole', {
      assumedBy: new iam.SessionTagsPrincipal(
        new iam.ServicePrincipal('pods.eks.amazonaws.com'),
      ),
    });
    externalRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));

    // Pass the existing role to ServiceAccount via the `role` prop
    const sa = new eks.ServiceAccount(this, 'ServiceAccount', {
      cluster,
      name: 'test-sa-external-role',
      namespace: 'default',
      identityType: eks.IdentityType.POD_IDENTITY,
      role: externalRole,
    });

    const pod = cluster.addManifest('demopod', {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: { name: 'demo-external-role' },
      spec: {
        serviceAccountName: sa.serviceAccountName,
        containers: [
          {
            name: 'demo',
            image: 'public.ecr.aws/amazonlinux/amazonlinux:2023',
            command: ['/bin/bash', '-c', 'yum update -y && yum install -y awscli && aws sts get-caller-identity'],
          },
        ],
      },
    });
    pod.node.addDependency(sa);
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new EksClusterStack(app, 'eks-pod-identities-external-role');

new IntegTest(app, 'integ-eks-pod-identities-external-role', {
  testCases: [stack],
});
