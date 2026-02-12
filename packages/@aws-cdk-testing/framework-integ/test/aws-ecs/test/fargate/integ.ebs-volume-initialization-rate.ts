import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as integ from '@aws-cdk/integ-tests-alpha';
import type { Construct } from 'constructs';

class TestStack extends cdk.Stack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 1,
      restrictDefaultSecurityGroup: false,
    });

    // Create an EBS volume and snapshot within the stack
    const sourceVolume = new ec2.Volume(this, 'SourceVolume', {
      availabilityZone: vpc.availabilityZones[0],
      size: cdk.Size.gibibytes(1),
      volumeType: ec2.EbsDeviceVolumeType.GP3,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Lambda that creates a snapshot and waits for it to complete
    const snapshotFn = new lambda.Function(this, 'SnapshotFn', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.handler',
      timeout: cdk.Duration.minutes(10),
      code: lambda.Code.fromInline(`
import boto3, json, urllib.request, time
def send(event, context, status, data={}, physical_id=None):
    body = json.dumps({'Status': status, 'Reason': 'See CloudWatch', 'PhysicalResourceId': physical_id or event.get('PhysicalResourceId','none'), 'StackId': event['StackId'], 'RequestId': event['RequestId'], 'LogicalResourceId': event['LogicalResourceId'], 'Data': data})
    urllib.request.urlopen(urllib.request.Request(event['ResponseURL'], data=body.encode(), method='PUT', headers={'Content-Type':''}))
def handler(event, context):
    ec2 = boto3.client('ec2')
    try:
        if event['RequestType'] == 'Delete':
            snap_id = event['PhysicalResourceId']
            try:
                ec2.delete_snapshot(SnapshotId=snap_id)
            except Exception:
                pass
            return send(event, context, 'SUCCESS', {}, snap_id)
        vol_id = event['ResourceProperties']['VolumeId']
        resp = ec2.create_snapshot(VolumeId=vol_id, Description='integ-test-ebs-init-rate')
        snap_id = resp['SnapshotId']
        ec2.get_waiter('snapshot_completed').wait(SnapshotIds=[snap_id])
        return send(event, context, 'SUCCESS', {'SnapshotId': snap_id}, snap_id)
    except Exception as e:
        return send(event, context, 'FAILED', {'Error': str(e)})
`),
    });
    snapshotFn.addToRolePolicy(new iam.PolicyStatement({
      actions: ['ec2:CreateSnapshot', 'ec2:DescribeSnapshots', 'ec2:DeleteSnapshot'],
      resources: ['*'],
    }));

    const snapshotCr = new cdk.CustomResource(this, 'Snapshot', {
      serviceToken: snapshotFn.functionArn,
      properties: { VolumeId: sourceVolume.volumeId },
    });

    const snapShotId = snapshotCr.getAttString('SnapshotId');

    const cluster = new ecs.Cluster(this, 'FargateCluster', { vpc });

    const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');

    const container = taskDefinition.addContainer('web', {
      image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      portMappings: [{
        containerPort: 80,
        protocol: ecs.Protocol.TCP,
      }],
    });

    const ebsVolume = new ecs.ServiceManagedVolume(this, 'EBSVolume', {
      name: 'ebs1',
      managedEBSVolume: {
        volumeType: ec2.EbsDeviceVolumeType.GP3,
        size: cdk.Size.gibibytes(1),
        fileSystemType: ecs.FileSystemType.EXT4,
        volumeInitializationRate: cdk.Size.mebibytes(200),
        snapShotId: snapShotId,
      },
    });

    ebsVolume.mountIn(container, {
      containerPath: '/var/lib',
      readOnly: false,
    });

    taskDefinition.addVolume(ebsVolume);

    const service = new ecs.FargateService(this, 'FargateService', {
      cluster,
      taskDefinition,
      desiredCount: 1,
    });

    service.addVolume(ebsVolume);
  }
}

const app = new cdk.App();
const stack = new TestStack(app, 'integ-aws-ecs-ebs-volume-initialization-rate');

new integ.IntegTest(app, 'EBSVolumeInitializationRate', {
  testCases: [stack],
});
