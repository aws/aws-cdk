import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CustomResource } from 'aws-cdk-lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'volume-initialization-rate-stack');

const az = stack.availabilityZones[0];

const fn = new lambda.Function(stack, 'SnapshotProvider', {
  runtime: lambda.Runtime.NODEJS_LATEST,
  handler: 'index.handler',
  timeout: cdk.Duration.minutes(10),
  code: lambda.Code.fromInline(`
const { EC2Client, CreateVolumeCommand, CreateSnapshotCommand, DeleteVolumeCommand, DeleteSnapshotCommand, DescribeSnapshotsCommand, DescribeVolumesCommand } = require('@aws-sdk/client-ec2');
const ec2 = new EC2Client();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
exports.handler = async (event) => {
  if (event.RequestType === 'Delete') {
    const snapshotId = event.PhysicalResourceId;
    try { await ec2.send(new DeleteSnapshotCommand({ SnapshotId: snapshotId })); } catch (e) {}
    return { PhysicalResourceId: snapshotId };
  }
  const az = event.ResourceProperties.AvailabilityZone;
  const vol = await ec2.send(new CreateVolumeCommand({ AvailabilityZone: az, Size: 1, VolumeType: 'gp3' }));
  // Wait for volume to be available
  for (let i = 0; i < 60; i++) {
    const desc = await ec2.send(new DescribeVolumesCommand({ VolumeIds: [vol.VolumeId] }));
    if (desc.Volumes[0].State === 'available') break;
    await sleep(5000);
  }
  const snap = await ec2.send(new CreateSnapshotCommand({ VolumeId: vol.VolumeId }));
  // Wait for snapshot to complete
  for (let i = 0; i < 60; i++) {
    const desc = await ec2.send(new DescribeSnapshotsCommand({ SnapshotIds: [snap.SnapshotId] }));
    if (desc.Snapshots[0].State === 'completed') break;
    await sleep(10000);
  }
  await ec2.send(new DeleteVolumeCommand({ VolumeId: vol.VolumeId }));
  return { PhysicalResourceId: snap.SnapshotId, Data: { SnapshotId: snap.SnapshotId } };
};
`),
});
fn.addToRolePolicy(new iam.PolicyStatement({
  actions: ['ec2:CreateVolume', 'ec2:DeleteVolume', 'ec2:CreateSnapshot', 'ec2:DeleteSnapshot', 'ec2:DescribeSnapshots', 'ec2:DescribeVolumes'],
  resources: ['*'],
}));

const provider = new cr.Provider(stack, 'Provider', {
  onEventHandler: fn,
});

const snapshotResource = new CustomResource(stack, 'SnapshotResource', {
  serviceToken: provider.serviceToken,
  properties: { AvailabilityZone: az },
});

new ec2.Volume(stack, 'Volume', {
  availabilityZone: az,
  size: cdk.Size.gibibytes(1),
  volumeType: ec2.EbsDeviceVolumeType.GP3,
  volumeInitializationRate: cdk.Size.mebibytes(100),
  snapshotId: snapshotResource.getAttString('SnapshotId'),
});

new integ.IntegTest(app, 'volume-initialization-rate-integ', {
  testCases: [stack],
});
