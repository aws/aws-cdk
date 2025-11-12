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

const instances = Object.fromEntries(Object.entries({ NoLB: [0, 1], LB: [0, 1] }).map(([tagValue, indexs]) => {
  const innerInstances = indexs.map((index) => {
    const userData = ec2.UserData.forLinux();
    userData.addCommands('dnf install httpd -y', 'mkdir -p /var/www/html', 'touch /var/www/html/index.html', 'systemctl start httpd');
    const instance = new ec2.Instance(stack, `Instance-${tagValue}-${index}`, {
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
    cdk.Tags.of(instance).add('EC2-Target', tagValue);
    return instance;
  });
  return [tagValue, innerInstances];
}));

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
albTg.addTarget(...instances.LB.map((instance) => new targets.InstanceTarget(instance)));

const bucket = new s3.Bucket(stack, 'ArtifactBucket', {
  versioned: true,
  autoDeleteObjects: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
instances.LB.forEach((instance) => bucket.grantRead(instance));
instances.NoLB.forEach((instance) => bucket.grantRead(instance));
const deployment = new s3deployment.BucketDeployment(stack, 'ArtifactDeployment', {
  destinationBucket: bucket,
  sources: [s3deployment.Source.asset(path.join(__dirname, 'ec2-deploy-artifacts', 'inline'))],
  extract: false,
});

const sourceArtifact = new codepipeline.Artifact('SourceArtifact');
const sourceAction = new cpactions.S3SourceAction({
  actionName: 'Source',
  output: sourceArtifact,
  bucket,
  bucketKey: cdk.Fn.select(0, deployment.objectKeys),
});

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
          actionName: 'EC2-NoLB',
          input: sourceArtifact,
          instanceType: cpactions.Ec2InstanceType.EC2,
          instanceTagKey: 'EC2-Target',
          instanceTagValue: 'NoLB',
          deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
            targetDirectory: '/var/www/html/NoLB',
            preScript: 'scripts/pre-deploy.sh',
            postScript: 'scripts/post-deploy.sh',
          }),
          maxBatch: cpactions.Ec2MaxInstances.targets(2),
        }),
        new cpactions.Ec2DeployAction({
          actionName: 'EC2-LB',
          input: sourceArtifact,
          instanceType: cpactions.Ec2InstanceType.EC2,
          instanceTagKey: 'EC2-Target',
          instanceTagValue: 'LB',
          deploySpecifications: cpactions.Ec2DeploySpecifications.inline({
            targetDirectory: '/var/www/html/LB',
            preScript: 'scripts/pre-deploy.sh',
            postScript: 'scripts/post-deploy.sh',
          }),
          targetGroups: [albTg],
          maxBatch: cpactions.Ec2MaxInstances.targets(1),
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
    .httpApiCall(`http://${alb.loadBalancerDnsName}/LB/index.html`)
    .expect(ExpectedResult.objectLike({ status: 200 })),
);
instances.NoLB.forEach((instance) => waitPipelieneSuccess.next(
  integ.assertions
    .httpApiCall(`http://${instance.instancePublicDnsName}/NoLB/index.html`)
    .expect(ExpectedResult.objectLike({ status: 200 })),
));
