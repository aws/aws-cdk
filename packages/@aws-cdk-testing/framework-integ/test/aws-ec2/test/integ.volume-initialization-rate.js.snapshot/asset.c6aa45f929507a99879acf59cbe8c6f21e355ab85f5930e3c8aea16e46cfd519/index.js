"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/@aws-cdk-testing/framework-integ/test/aws-ec2/test/snapshot-provider-handler/index.ts
var index_exports = {};
__export(index_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(index_exports);
var import_client_ec2 = require("@aws-sdk/client-ec2");
var ec2 = new import_client_ec2.EC2Client();
var sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function handler(event) {
  if (event.RequestType === "Delete") {
    const snapshotId = event.PhysicalResourceId;
    try {
      await ec2.send(new import_client_ec2.DeleteSnapshotCommand({ SnapshotId: snapshotId }));
    } catch {
    }
    return { PhysicalResourceId: snapshotId };
  }
  const az = event.ResourceProperties.AvailabilityZone;
  const vol = await ec2.send(new import_client_ec2.CreateVolumeCommand({ AvailabilityZone: az, Size: 1, VolumeType: "gp3" }));
  for (let i = 0; i < 60; i++) {
    const desc = await ec2.send(new import_client_ec2.DescribeVolumesCommand({ VolumeIds: [vol.VolumeId] }));
    if (desc.Volumes?.[0].State === "available") break;
    await sleep(5e3);
  }
  const snap = await ec2.send(new import_client_ec2.CreateSnapshotCommand({ VolumeId: vol.VolumeId }));
  for (let i = 0; i < 60; i++) {
    const desc = await ec2.send(new import_client_ec2.DescribeSnapshotsCommand({ SnapshotIds: [snap.SnapshotId] }));
    if (desc.Snapshots?.[0].State === "completed") break;
    await sleep(1e4);
  }
  await ec2.send(new import_client_ec2.DeleteVolumeCommand({ VolumeId: vol.VolumeId }));
  return { PhysicalResourceId: snap.SnapshotId, Data: { SnapshotId: snap.SnapshotId } };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
