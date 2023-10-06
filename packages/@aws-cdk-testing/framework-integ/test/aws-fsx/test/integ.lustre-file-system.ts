import { AmazonLinuxGeneration, AmazonLinuxImage, Instance, InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { LustreDeploymentType, LustreFileSystem, LustreDataCompressionType } from 'aws-cdk-lib/aws-fsx';

const app = new App();

const stack = new Stack(app, 'AwsCdkFsxLustre');

const vpc = new Vpc(stack, 'VPC', { restrictDefaultSecurityGroup: false });

const storageCapacity = 1200;
const lustreConfiguration = {
  deploymentType: LustreDeploymentType.SCRATCH_2,
  dataCompressionType: LustreDataCompressionType.LZ4,
};
const fs = new LustreFileSystem(stack, 'FsxLustreFileSystem', {
  lustreConfiguration,
  storageCapacityGiB: storageCapacity,
  vpc,
  vpcSubnet: vpc.privateSubnets[0],
  removalPolicy: RemovalPolicy.DESTROY,
});

const inst = new Instance(stack, 'inst', {
  instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.LARGE),
  machineImage: new AmazonLinuxImage({
    generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
  vpc,
  vpcSubnets: {
    subnetType: SubnetType.PUBLIC,
  },
});
fs.connections.allowDefaultPortFrom(inst);

app.synth();
