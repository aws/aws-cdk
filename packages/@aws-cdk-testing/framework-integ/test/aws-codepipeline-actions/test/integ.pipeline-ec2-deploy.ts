import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deployment from 'aws-cdk-lib/aws-s3-deployment';
import * as cdk from 'aws-cdk-lib';
import * as cpactions from 'aws-cdk-lib/aws-codepipeline-actions';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as path from 'path';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-codepipeline-ec2-deploy');

const vpc = new ec2.Vpc(stack, 'VPC', {
  maxAzs: 2,
  natGateways: 0,
  restrictDefaultSecurityGroup: false,
});

const instances = [0, 1].map((index) => {
  const userData = ec2.UserData.forLinux();
  userData.addCommands( 'dnf install httpd -y', 'systemctl start httpd' );
  const instance = new ec2.Instance(stack, `Instance${index}`, {
    vpc,
    vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    availabilityZone: vpc.publicSubnets[index].availabilityZone,
    machineImage: ec2.MachineImage.latestAmazonLinux2023({ cpuType: ec2.AmazonLinuxCpuType.ARM_64 }),
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE4_GRAVITON, ec2.InstanceSize.MICRO),
    ssmSessionPermissions: true,
    userData,
  });
  instance.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
  instance.connections.allowFromAnyIpv4(ec2.Port.HTTP);
  cdk.Tags.of(instance).add('Target', 'EC2-Target');
  return instance;
});

const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc, internetFacing: true });
const albTg = new elbv2.ApplicationTargetGroup(stack, 'ALB-TG', {
  vpc,
  protocol: elbv2.ApplicationProtocol.HTTP,
  deregistrationDelay: cdk.Duration.seconds(0),
});
alb.addListener('HTTP', {
  protocol: elbv2.ApplicationProtocol.HTTP,
  defaultTargetGroups: [albTg],
});
alb.connections.allowToAnyIpv4(ec2.Port.HTTP);
albTg.addTarget(...instances.map((instance) => new targets.InstanceTarget(instance)));

const bucket = new s3.Bucket(stack, 'ArtifactBucket', {
  versioned: true,
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
instances.forEach((instance) => bucket.grantRead(instance));
const deployment = new s3deployment.BucketDeployment(stack, 'ArtifactDeployment', {
  destinationBucket: bucket,
  sources: [s3deployment.Source.asset(path.join(__dirname, 'ec2-deploy', 'artifact.zip'))],
  extract: false,
});

const sourceArtifact = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'Source',
  output: sourceArtifact,
  bucket,
  bucketKey: cdk.Fn.select(0, deployment.objectKeys),
});

const actionProps = {
  input: sourceArtifact,
  instanceType: cpactions.Ec2InstanceType.EC2,
  instanceTagKey: 'Target',
  instanceTagValue: 'EC2-Target',
  targetDirectory: '/var/www/html',
  preScript: 'scripts/pre-deploy.sh',
  postScript: 'scripts/post-deploy.sh',
};
const pipeline = new codepipeline.Pipeline(stack, 'MyPipeline', {
  pipelineType: codepipeline.PipelineType.V2,
  artifactBucket: bucket,
  stages: [
    {
      stageName: 'Source',
      actions: [sourceAction],
    },
    {
      stageName: 'Deploy',
      actions: [
        new cpactions.Ec2DeployAction({
          runOrder: 1,
          actionName: 'EC2-NoLB',
          maxBatch: cpactions.Ec2MaxInstances.targets(2),
          ...actionProps,
        }),
        new cpactions.Ec2DeployAction({
          runOrder: 2,
          actionName: 'EC2-LB',
          maxBatch: cpactions.Ec2MaxInstances.targets(1),
          targetGroups: [albTg],
          ...actionProps,
        }),
      ],
    },
  ],
});

const integ = new IntegTest(app, 'ec2-deploy-action-integ', {
  testCases: [stack],
});

const pipelineExecutionId = integ.assertions
  .awsApiCall('codepipeline', 'StartPipelineExecution', { name: pipeline.pipelineName })
  .getAttString('pipelineExecutionId');
const waitPipelieneSuccess = integ.assertions
  .awsApiCall('codepipeline', 'GetPipelineExecution', { pipelineName: pipeline.pipelineName, pipelineExecutionId })
  .waitForAssertions({ interval: cdk.Duration.seconds(30) })
  .expect(ExpectedResult.objectLike({ pipelineExecution: { status: 'Succeeded' } }));
waitPipelieneSuccess.next(
  integ.assertions
    .httpApiCall(`http://${alb.loadBalancerDnsName}/index.html`)
    .expect(ExpectedResult.objectLike({ status: 200 })),
);
instances.forEach((instance) => waitPipelieneSuccess.next(
  integ.assertions
    .httpApiCall(`http://${instance.instancePublicDnsName}/index.html`)
    .expect(ExpectedResult.objectLike({ status: 200 })),
));
