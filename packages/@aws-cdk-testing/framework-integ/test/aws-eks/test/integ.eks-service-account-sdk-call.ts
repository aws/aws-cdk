import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecrAssets from 'aws-cdk-lib/aws-ecr-assets';
import * as iam from 'aws-cdk-lib/aws-iam';
import { App, Stack, CfnOutput, Duration } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as cdk8s from 'cdk8s';
import * as kplus from 'cdk8s-plus-27';
import { BucketPinger } from './bucket-pinger/bucket-pinger';
import * as eks from 'aws-cdk-lib/aws-eks';
import { getClusterVersionConfig } from './integ-tests-kubernetes-version';
import { IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS } from 'aws-cdk-lib/cx-api';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    [IAM_OIDC_REJECT_UNAUTHORIZED_CONNECTIONS]: false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});
const stack = new Stack(app, 'aws-eks-service-account-sdk-calls-test');

// this bucket gets created by a kubernetes pod.
const bucketName = `eks-bucket-${stack.account}-${stack.region}`;

const dockerImage = new ecrAssets.DockerImageAsset(stack, 'sdk-call-making-docker-image', {
  directory: path.join(__dirname, 'sdk-call-integ-test-docker-app/app'),
  cacheDisabled: true,
});

// just need one nat gateway to simplify the test
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1, restrictDefaultSecurityGroup: false });

const cluster = new eks.Cluster(stack, 'Cluster', {
  vpc,
  ...getClusterVersionConfig(stack),
});

const chart = new cdk8s.Chart(new cdk8s.App(), 'sdk-call-image');

const serviceAccount = cluster.addServiceAccount('my-service-account');
const kplusServiceAccount = kplus.ServiceAccount.fromServiceAccountName(stack, 'kplus-sa', serviceAccount.serviceAccountName);
new kplus.Deployment(chart, 'Deployment', {
  containers: [{
    image: dockerImage.imageUri,
    envVariables: {
      BUCKET_NAME: kplus.EnvValue.fromValue(bucketName),
      REGION: kplus.EnvValue.fromValue(stack.region),
    },
    securityContext: {
      user: 1000,
    },
  }],
  restartPolicy: kplus.RestartPolicy.ALWAYS,
  serviceAccount: kplusServiceAccount,
});

cluster.addCdk8sChart('sdk-call', chart).node.addDependency(serviceAccount);

serviceAccount.role.addToPrincipalPolicy(
  new iam.PolicyStatement({
    actions: ['s3:CreateBucket'],
    resources: [`arn:aws:s3:::${bucketName}`],
  }),
);

// this custom resource will check that the bucket exists
// the bucket will be deleted when the custom resource is deleted
// if the bucket does not exist, then it will throw an error and fail the deployment.
const pinger = new BucketPinger(stack, 'S3BucketPinger', {
  bucketName,
  // we need more timeout for the sdk-call in the pod as it could take more than 1 minute.
  timeout: Duration.minutes(3),
});

// the pinger must wait for the cluster to be updated.
// interestingly, without this dependency, CFN will always run the pinger
// before the pod.
pinger.node.addDependency(cluster);

// this should confirm that the bucket actually exists
new CfnOutput(stack, 'PingerResponse', {
  value: pinger.response,
});

new integ.IntegTest(app, 'aws-cdk-eks-service-account-sdk-call', {
  testCases: [stack],
  diffAssets: false, // otherwise this test will block every dependency upgrade PR
});

app.synth();
