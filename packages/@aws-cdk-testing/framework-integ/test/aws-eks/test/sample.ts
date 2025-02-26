import {
  App, Stack,
  aws_eks as eks,
  aws_ec2 as ec2,
} from 'aws-cdk-lib';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';

const app = new App();
const env = { region: process.env.CDK_DEFAULT_REGION, account: process.env.CDK_DEFAULT_ACCOUNT };
const stack = new Stack(app, 'my-test-stack', { env });
const vpc = ec2.Vpc.fromLookup(stack, 'Vpc', { isDefault: true });
new eks.Cluster(stack, 'Cluster', {
  vpc: vpc,
  ...getClusterVersionConfig(stack, eks.KubernetesVersion.V1_32),
  defaultCapacity: 0,
  bootstrapSelfManagedAddons: true,
});
app.synth();
