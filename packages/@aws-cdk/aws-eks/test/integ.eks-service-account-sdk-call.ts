//import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
//import * as ecrAssets from '@aws-cdk/aws-ecr-assets';
//import * as iam from '@aws-cdk/aws-iam';
import { App, Stack/*, CfnOutput*/ } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
//import * as cdk8s from 'cdk8s';
//import * as kplus from 'cdk8s-plus-21';
import * as eks from '../lib';
//import { BucketPinger } from './pinger/bucket-pinger/bucket-pinger';


const app = new App();
const stack = new Stack(app, 'aws-eks-oidc-provider-test');

/*
const dockerImage = new ecrAssets.DockerImageAsset(stack, 'sdk-call-making-docker-image', {
  directory: path.join(__dirname, 'docker-app/app'),
});
*/

// just need one nat gateway to simplify the test
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 3, natGateways: 1 });

// Create the cluster without an ALB. Creating the ALB
// forces the cluster to make an OIDC Provider by default,
// which we don't want. It will cause dependency issues
// even if removed via `node.tryRemoveChild()`.
/*const cluster =*/ new eks.Cluster(stack, 'Cluster', {
  vpc: vpc,
  version: eks.KubernetesVersion.V1_21,
});

// create the custom OIDC Provider that will fail when given the wrong thumbprint
/*cluster.addOpenIdConnectProvider(
  new iam.OpenIdConnectProvider(cluster, 'OpenIdConnectProvider', {
    url: cluster.clusterOpenIdConnectIssuerUrl,
    thumbprints: /*['aaaaaaaaaaaaa123aaaaaaaaaaaaaaaafaazzaaa'],*/ /*['9e99a48a9960b14926bb7f3b02e22da2b0ab7280'],
    clientIds: ['sts.amazonaws.com'],
  }),
); //modify thumbprint in eks lib, not here

const chart = new cdk8s.Chart(new cdk8s.App(), 'sdk-call-image-1'); // changing this ID remakes and runs the pod

const serviceAccount = cluster.addServiceAccount('my-service-account');
const kplusServiceAccount = kplus.ServiceAccount.fromServiceAccountName(serviceAccount.serviceAccountName);
new kplus.Pod(chart, 'Pod', {
  containers: [{ image: dockerImage.imageUri, port: 8080 }],
  restartPolicy: kplus.RestartPolicy.NEVER,
  serviceAccount: kplusServiceAccount,
});

cluster.addCdk8sChart('sdk-call', chart);

serviceAccount.role.addToPrincipalPolicy(
  new iam.PolicyStatement({
    actions: ['s3:CreateBucket'],
    resources: ['arn:aws:s3:::*'],
  }),
);

// this custom resource will check that the bucket exists and delete it
// if the bucket does not exist, then it will throw an error and fail the deployment.
const pinger = new BucketPinger(stack, 'S3BucketPinger', {
  vpc: cluster.vpc,
});
// the pinger must wait for the cluster to be updated.
// interestingly, without this dependency, CFN will always run the pinger
// before the pod.
pinger.node.addDependency(cluster);

// this should confirm that the bucket actually exists and was deleted
new CfnOutput(stack, 'PingerResponse', {
  value: pinger.response,
});
*/

new integ.IntegTest(app, 'aws-cdk-eks-service-account-sdk-call', {
  testCases: [stack],
});

app.synth();