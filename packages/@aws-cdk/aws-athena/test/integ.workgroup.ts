import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as athena from '../lib';

class WorkGroupStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const encryptionKey = new kms.Key(this, 'EncryptionKey', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const athenaBucket = new s3.Bucket(this, 'AthenaResultsBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const workgroup = new athena.WorkGroup(this, 'Workgroup', {
      workGroupName: 'super-workgroup',
      description: 'A test workgroup',
      configuration: {
        publishCloudWatchMetricsEnabled: true,
        requesterPaysEnabled: true,
        enforceWorkGroupConfiguration: true,
        resultConfigurations: {
          encryptionConfiguration: {
            encryptionOption: athena.EncryptionOption.KMS,
            kmsKey: encryptionKey,
          },
          outputLocation: {
            bucket: athenaBucket,
          },
        },
      },
    });

    const user = new iam.User(this, 'MyUser');
    workgroup.grantFullAccess(user);

    new cdk.CfnOutput(this, 'WorkgroupArn', {
      value: workgroup.workgroupArn,
    });
  }
}

const app = new cdk.App();
new WorkGroupStack(app, 'aws-workgroup-test-stack');
app.synth();