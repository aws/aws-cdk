"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const escape_1 = require("./escape");
const redshift_data_1 = require("./redshift-data");
const util_1 = require("./util");
const validate_1 = require("./validate");
async function handler(props, event) {
    const username = props.username;
    const tablePrivileges = props.tablePrivileges;
    const clusterProps = props;
    if (event.RequestType === 'Create') {
        await grantPrivileges(username, tablePrivileges, clusterProps, event.StackId);
        return { PhysicalResourceId: (0, util_1.makePhysicalId)(username, clusterProps, event.RequestId) };
    }
    else if (event.RequestType === 'Delete') {
        await revokePrivileges(username, tablePrivileges, clusterProps, event.StackId);
        return;
    }
    else if (event.RequestType === 'Update') {
        const { replace } = await updatePrivileges(username, tablePrivileges, clusterProps, event.OldResourceProperties, event.StackId);
        const physicalId = replace ? (0, util_1.makePhysicalId)(username, clusterProps, event.RequestId) : event.PhysicalResourceId;
        return { PhysicalResourceId: physicalId };
    }
    else {
        /* eslint-disable-next-line dot-notation */
        throw new Error(`Unrecognized event type: ${event['RequestType']}`);
    }
}
async function revokePrivileges(username, tablePrivileges, clusterProps, stackId) {
    // Limited by human input
    // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
    await Promise.all(tablePrivileges.map(({ tableName, actions }) => {
        return (0, redshift_data_1.executeStatement)(`REVOKE ${actions.join(', ')} ON ${(0, escape_1.quoteQualifiedIdentifier)(normalizedTableName(tableName, stackId))} FROM ${(0, escape_1.quoteIdentifier)(username)}`, clusterProps);
    }));
}
async function grantPrivileges(username, tablePrivileges, clusterProps, stackId) {
    // Existing PUBLIC grants must remain revocable during teardown.
    (0, validate_1.validateUsername)(username);
    // Limited by human input
    // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
    await Promise.all(tablePrivileges.map(({ tableName, actions }) => {
        return (0, redshift_data_1.executeStatement)(`GRANT ${actions.join(', ')} ON ${(0, escape_1.quoteQualifiedIdentifier)(normalizedTableName(tableName, stackId))} TO ${(0, escape_1.quoteIdentifier)(username)}`, clusterProps);
    }));
}
async function updatePrivileges(username, tablePrivileges, clusterProps, oldResourceProperties, stackId) {
    const oldClusterProps = oldResourceProperties;
    if (clusterProps.clusterName !== oldClusterProps.clusterName || clusterProps.databaseName !== oldClusterProps.databaseName) {
        await grantPrivileges(username, tablePrivileges, clusterProps, stackId);
        return { replace: true };
    }
    const oldUsername = oldResourceProperties.username;
    if (oldUsername !== username) {
        await grantPrivileges(username, tablePrivileges, clusterProps, stackId);
        return { replace: true };
    }
    const oldTablePrivileges = oldResourceProperties.tablePrivileges;
    const tablesToRevoke = oldTablePrivileges.filter(({ tableId, actions }) => (tablePrivileges.find(({ tableId: otherTableId, actions: otherActions }) => (tableId === otherTableId && actions.some(action => !otherActions.includes(action))))));
    const tablesToGrant = tablePrivileges.filter(({ tableId, tableName, actions }) => {
        const tableAdded = !oldTablePrivileges.find(({ tableId: otherTableId, tableName: otherTableName }) => (tableId === otherTableId && tableName === otherTableName));
        const actionsAdded = oldTablePrivileges.find(({ tableId: otherTableId, actions: otherActions }) => (tableId === otherTableId && otherActions.some(action => !actions.includes(action))));
        return tableAdded || actionsAdded;
    });
    // Validate before the revoke below so a rejected PUBLIC narrowing runs no statements.
    if (tablesToGrant.length > 0) {
        (0, validate_1.validateUsername)(username);
    }
    if (tablesToRevoke.length > 0) {
        await revokePrivileges(username, tablesToRevoke, clusterProps, stackId);
    }
    if (tablesToGrant.length > 0) {
        await grantPrivileges(username, tablesToGrant, clusterProps, stackId);
    }
    return { replace: false };
}
/**
 * We need this normalization logic because some of the `TableName` values
 * are physical IDs generated in the {@link makePhysicalId} function.
 * */
const normalizedTableName = (tableName, stackId) => {
    const segments = tableName.split(':');
    const suffix = segments.slice(-1);
    if (suffix != null && stackId.endsWith(suffix[0])) {
        return segments.slice(-2)[0] ?? tableName;
    }
    return tableName;
};
