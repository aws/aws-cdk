"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onEventHandler = onEventHandler;
exports.isCompleteHandler = isCompleteHandler;
/* eslint-disable no-console */
/// <reference path="../../../../../../../node_modules/aws-cdk-lib/custom-resources/lib/provider-framework/types.d.ts" />
const client_rds_1 = require("@aws-sdk/client-rds"); // eslint-disable-line import/no-extraneous-dependencies
async function onEventHandler(event) {
    console.log('Event: %j', event);
    const rds = new client_rds_1.RDS();
    const physicalResourceId = `${event.ResourceProperties.DBInstanceIdentifier}-${event.ResourceProperties.DBInstanceIdentifier}`;
    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
        const data = await rds.createDBSnapshot({
            DBInstanceIdentifier: event.ResourceProperties.DBInstanceIdentifier,
            DBSnapshotIdentifier: event.ResourceProperties.DBSnapshotIdentifier,
        });
        return {
            PhysicalResourceId: physicalResourceId,
            Data: {
                DBSnapshotArn: data.DBSnapshot?.DBSnapshotArn,
            },
        };
    }
    if (event.RequestType === 'Delete') {
        await rds.deleteDBSnapshot({
            DBSnapshotIdentifier: event.ResourceProperties.DBSnapshotIdentifier,
        });
    }
    return {
        PhysicalResourceId: `${event.ResourceProperties.DBInstanceIdentifier}-${event.ResourceProperties.DBInstanceIdentifier}`,
    };
}
async function isCompleteHandler(event) {
    console.log('Event: %j', event);
    const snapshotStatus = await tryGetSnapshotStatus(event.ResourceProperties.DBSnapshotIdentifier);
    switch (event.RequestType) {
        case 'Create':
        case 'Update':
            return { IsComplete: snapshotStatus === 'available' };
        case 'Delete':
            return { IsComplete: snapshotStatus === undefined };
    }
}
async function tryGetSnapshotStatus(identifier) {
    try {
        const rds = new client_rds_1.RDS();
        const data = await rds.describeDBSnapshots({
            DBSnapshotIdentifier: identifier,
        });
        return data.DBSnapshots?.[0].Status;
    }
    catch (err) {
        if (err.name === 'DBSnapshotNotFoundFault') {
            return undefined;
        }
        throw err;
    }
}
