import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { StackProps } from 'aws-cdk-lib';
import { App, Stack } from 'aws-cdk-lib';
import { KubectlV32Layer } from '@aws-cdk/lambda-layer-kubectl-v32';
import * as eks from 'aws-cdk-lib/aws-eks-v2';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

/**
 * After deployment, verify with:
 *
 * $ kubectl get po
 *
 * You should see two pods named `demo` and `demo-external-role` in Completed STATUS.
 *
 * $ kubectl logs -f demo
 * $ kubectl logs -f demo-external-role
 *
 * Both pods should show a log message with UserId, Account and Arn,
 * indicating they are running with the correct eks pod identity defined with ServiceAccount.
 * The `demo-external-role` pod uses an externally-created IAM role passed via the `role` prop.
 */

class EksPodIdentitiesStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC', { natGateways: 1 });

    const cluster = new eks.Cluster(this, 'Cluster', {
      vpc,
      defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
      defaultCapacity: 1,
      version: eks.KubernetesVersion.V1_32,
      kubectlProviderOptions: {
        kubectlLayer: new KubectlV32Layer(this, 'kubectlLayer'),
      },
    });

    // Case 1: auto-generated IAM role (existing behavior)
    const sa = new eks.ServiceAccount(this, 'ServiceAccount', {
      cluster,
      name: 'test-sa',
      namespace: 'default',
      identityType: eks.IdentityType.POD_IDENTITY,
    });

    sa.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));

    const pod = cluster.addManifest('demopod', {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: { name: 'demo' },
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

    // Case 2: externally-created IAM role passed via the `role` prop
    // The trust policy must allow pods.eks.amazonaws.com with sts:AssumeRole and sts:TagSession.
    const externalRole = new iam.Role(this, 'ExternalRole', {
      assumedBy: new iam.SessionTagsPrincipal(
        new iam.ServicePrincipal('pods.eks.amazonaws.com'),
      ),
    });
    externalRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'));

    const saWithExternalRole = new eks.ServiceAccount(this, 'ServiceAccountWithExternalRole', {
      cluster,
      name: 'test-sa-external-role',
      namespace: 'default',
      identityType: eks.IdentityType.POD_IDENTITY,
      role: externalRole,
    });

    const podWithExternalRole = cluster.addManifest('demopod-external-role', {
      apiVersion: 'v1',
      kind: 'Pod',
      metadata: { name: 'demo-external-role' },
      spec: {
        serviceAccountName: saWithExternalRole.serviceAccountName,
        containers: [
          {
            name: 'demo',
            image: 'public.ecr.aws/amazonlinux/amazonlinux:2023',
            command: ['/bin/bash', '-c', 'yum update -y && yum install -y awscli && aws sts get-caller-identity'],
          },
        ],
      },
    });
    podWithExternalRole.node.addDependency(saWithExternalRole);
  }
}

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

const stack = new EksPodIdentitiesStack(app, 'eks-pod-identities-v2');

new IntegTest(app, 'integ-eks-pod-identities-v2', {
  testCases: [stack],
});
