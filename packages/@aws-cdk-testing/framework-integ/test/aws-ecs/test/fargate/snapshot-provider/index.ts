/* eslint-disable import/no-extraneous-dependencies */
import { EC2Client, CreateSnapshotCommand, DeleteSnapshotCommand, DescribeSnapshotsCommand } from '@aws-sdk/client-ec2';
import type { CloudFormationCustomResourceEvent } from 'aws-lambda';
import * as https from 'https';
import * as url from 'url';

const ec2 = new EC2Client();

async function waitForSnapshot(snapshotId: string) {
  for (;;) {
    const { Snapshots } = await ec2.send(new DescribeSnapshotsCommand({ SnapshotIds: [snapshotId] }));
    if (Snapshots?.[0]?.State === 'completed') return;
    if (Snapshots?.[0]?.State === 'error') throw new Error(`Snapshot ${snapshotId} failed`);
    await new Promise(r => setTimeout(r, 5000));
  }
}

async function sendResponse(event: CloudFormationCustomResourceEvent, status: string, data: Record<string, string> = {}, physicalId?: string) {
  const body = JSON.stringify({
    Status: status,
    Reason: 'See CloudWatch',
    PhysicalResourceId: physicalId ?? (event as any).PhysicalResourceId ?? 'none',
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    Data: data,
  });
  const parsed = url.parse(event.ResponseURL);
  await new Promise<void>((resolve, reject) => {
    const req = https.request({ ...parsed, method: 'PUT', headers: { 'Content-Type': '', 'Content-Length': body.length } }, () => resolve());
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

export async function handler(event: CloudFormationCustomResourceEvent) {
  try {
    if (event.RequestType === 'Delete') {
      try { await ec2.send(new DeleteSnapshotCommand({ SnapshotId: (event as any).PhysicalResourceId })); } catch {}
      return await sendResponse(event, 'SUCCESS');
    }
    const { SnapshotId } = await ec2.send(new CreateSnapshotCommand({
      VolumeId: event.ResourceProperties.VolumeId,
      Description: 'integ-test-ebs-volume-initialization-rate',
    }));
    await waitForSnapshot(SnapshotId!);
    return await sendResponse(event, 'SUCCESS', { SnapshotId: SnapshotId! }, SnapshotId);
  } catch (e: any) {
    return sendResponse(event, 'FAILED', { Error: e.message });
  }
}
