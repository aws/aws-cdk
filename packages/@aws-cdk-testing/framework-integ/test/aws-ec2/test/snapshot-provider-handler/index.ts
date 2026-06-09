
import { EC2Client, CreateVolumeCommand, CreateSnapshotCommand, DeleteVolumeCommand, DeleteSnapshotCommand, DescribeSnapshotsCommand, DescribeVolumesCommand } from '@aws-sdk/client-ec2';

const ec2 = new EC2Client();
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function handler(event: AWSLambda.CloudFormationCustomResourceEvent) {
  if (event.RequestType === 'Delete') {
    const snapshotId = event.PhysicalResourceId;
    try { await ec2.send(new DeleteSnapshotCommand({ SnapshotId: snapshotId })); } catch {}
    return { PhysicalResourceId: snapshotId };
  }

  const az = event.ResourceProperties.AvailabilityZone;
  const vol = await ec2.send(new CreateVolumeCommand({ AvailabilityZone: az, Size: 1, VolumeType: 'gp3' }));

  for (let i = 0; i < 60; i++) {
    const desc = await ec2.send(new DescribeVolumesCommand({ VolumeIds: [vol.VolumeId!] }));
    if (desc.Volumes?.[0].State === 'available') break;
    await sleep(5000);
  }

  const snap = await ec2.send(new CreateSnapshotCommand({ VolumeId: vol.VolumeId }));

  for (let i = 0; i < 60; i++) {
    const desc = await ec2.send(new DescribeSnapshotsCommand({ SnapshotIds: [snap.SnapshotId!] }));
    if (desc.Snapshots?.[0].State === 'completed') break;
    await sleep(10000);
  }

  await ec2.send(new DeleteVolumeCommand({ VolumeId: vol.VolumeId }));

  return { PhysicalResourceId: snap.SnapshotId!, Data: { SnapshotId: snap.SnapshotId! } };
}
