/// !cdk-integ *
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new cdk.App();

class TestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'VPC');

    // Here we test default separator as probably most useful
    const multipartUserData = new ec2.MultipartUserData();

    const userData1 = ec2.UserData.forLinux();
    userData1.addCommands('echo 大らと > /var/tmp/echo1');
    userData1.addCommands('cp /var/tmp/echo1 /var/tmp/echo1-copy');

    const userData2 = ec2.UserData.forLinux();
    userData2.addCommands(`echo 大らと ${vpc.vpcId}  > /var/tmp/echo2`);

    const rawPart1 = ec2.MultipartBody.fromRawBody({
      contentType: 'text/x-shellscript',
      body: 'echo "RawPart" > /var/tmp/rawPart1',
    });

    const rawPart2 = ec2.MultipartBody.fromRawBody({
      contentType: 'text/x-shellscript',
      body: `echo "RawPart ${vpc.vpcId}" > /var/tmp/rawPart2`,
    });

    const bootHook = ec2.UserData.forLinux();
    bootHook.addCommands(
      'echo "Boothook2" > /var/tmp/boothook',
      'cloud-init-per once docker_options echo \'OPTIONS="${OPTIONS} --storage-opt dm.basesize=20G"\' >> /etc/sysconfig/docker',
    );

    multipartUserData.addPart(ec2.MultipartBody.fromUserData(userData1));
    multipartUserData.addPart(ec2.MultipartBody.fromUserData(userData2));
    multipartUserData.addPart(ec2.MultipartBody.fromUserData(bootHook, 'text/cloud-boothook'));

    const rawPart3 = ec2.MultipartBody.fromRawBody({
      contentType: 'text/x-shellscript',
      body: 'cp $0 /var/tmp/upstart # Should be one line file no new line at the end and beginning',
    });
    multipartUserData.addPart(rawPart1);
    multipartUserData.addPart(rawPart2);
    multipartUserData.addPart(rawPart3);

    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.NANO),
      machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
      userData: multipartUserData,
    });

    instance.addToRolePolicy(new PolicyStatement({
      actions: ['ssm:*', 'ssmmessages:*', 'ec2messages:GetMessages'],
      resources: ['*'],
    }));

    instance.connections.allowFromAnyIpv4(ec2.Port.icmpPing());
  }
}

new TestStack(app, 'TestStackMultipartUserData');

app.synth();
