import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as config from 'aws-cdk-lib/aws-config';
import { Construct } from 'constructs';

export interface ConfigPrerequisitesProps {
  readonly resourceTypes: string[];
}

export class ConfigPrerequisites extends Construct {
  public readonly recorder: config.CfnConfigurationRecorder;
  public readonly deliveryChannel: config.CfnDeliveryChannel;

  constructor(scope: Construct, id: string, props: ConfigPrerequisitesProps) {
    super(scope, id);

    const configRole = new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('config.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWS_ConfigRole')],
    });
    this.recorder = new config.CfnConfigurationRecorder(this, 'Recorder', {
      roleArn: configRole.roleArn,
      recordingGroup: { allSupported: false, resourceTypes: props.resourceTypes },
    });
    const deliveryBucket = new s3.Bucket(this, 'DeliveryBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    deliveryBucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal('config.amazonaws.com')],
      actions: ['s3:GetBucketAcl', 's3:ListBucket'],
      resources: [deliveryBucket.bucketArn],
    }));
    deliveryBucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [new iam.ServicePrincipal('config.amazonaws.com')],
      actions: ['s3:PutObject'],
      resources: [deliveryBucket.arnForObjects('AWSLogs/*')],
      conditions: {
        StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
      },
    }));
    this.deliveryChannel = new config.CfnDeliveryChannel(this, 'DeliveryChannel', {
      s3BucketName: deliveryBucket.bucketName,
    });
  }
}
