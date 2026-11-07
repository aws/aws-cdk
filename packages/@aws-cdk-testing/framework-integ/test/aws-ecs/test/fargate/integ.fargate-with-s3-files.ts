import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';

import * as integ from '@aws-cdk/integ-tests-alpha';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CfnFileSystem } from 'aws-cdk-lib/aws-s3files';

class FargateWithS3FilesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this, 'S3Bucket', {
      bucketName: 'cdk-fargate-with-s3-files',
      versioned: true, // Versioning is required — S3 Files relies on object versions for consistency.
    });

    // S3 Files assumes this role to sync data between S3 and the file system.
    const role = new Role(this, 'S3FilesRole', {
      assumedBy: new ServicePrincipal('elasticfilesystem.amazonaws.com'),
    });
    bucket.grantReadWrite(role);
    // EventBridge permissions: S3 Files creates rules prefixed "DO-NOT-DELETE-S3-Files"
    // to detect S3 object changes and trigger data synchronization.
    role.addToPolicy(
      new PolicyStatement({
        actions: [
          'events:DeleteRule',
          'events:DisableRule',
          'events:EnableRule',
          'events:PutRule',
          'events:PutTargets',
          'events:RemoveTargets',
        ],
        resources: [`arn:${cdk.Aws.PARTITION}:events:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:rule/DO-NOT-DELETE-S3-Files*`],
        conditions: { StringEquals: { 'events:ManagedBy': 'elasticfilesystem.amazonaws.com' } },
      }),
    );
    role.addToPolicy(
      new PolicyStatement({
        actions: [
          'events:DescribeRule',
          'events:ListRuleNamesByTarget',
          'events:ListRules',
          'events:ListTargetsByRule',
        ],
        resources: [`arn:${cdk.Aws.PARTITION}:events:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:rule/*`],
      }),
    );

    const s3FileSystem = new CfnFileSystem(this, 'S3FileSystem', {
      bucket: bucket.bucketArn,
      roleArn: role.roleArn,
    });

    // Just need a TaskDefinition to test this
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');
    taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });
    taskDefinition.addVolume({
      name: 'somedata',
      s3FilesVolumeConfiguration: {
        fileSystemArn: s3FileSystem.attrFileSystemArn,
      },
    });
  }
}

const app = new cdk.App();
const stack = new FargateWithS3FilesStack(app, 'aws-ecs-fargate-s3-files');

new integ.IntegTest(app, 'aws-ecs-fargate-test', {
  testCases: [stack],
});
app.synth();
