"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePhysicalId = makePhysicalId;
exports.getDistKeyColumn = getDistKeyColumn;
exports.getSortKeyColumns = getSortKeyColumns;
exports.areColumnsEqual = areColumnsEqual;
function makePhysicalId(resourceName, clusterProps, requestId) {
    return `${clusterProps.clusterName}:${clusterProps.databaseName}:${resourceName}:${requestId}`;
}
function getDistKeyColumn(columns) {
    // string comparison is required for custom resource since everything is passed as string
    const distKeyColumns = columns.filter(column => column.distKey === true || column.distKey === 'true');
    if (distKeyColumns.length === 0) {
        return undefined;
    }
    else if (distKeyColumns.length > 1) {
        throw new Error('Multiple dist key columns found');
    }
    return distKeyColumns[0];
}
function getSortKeyColumns(columns) {
    // string comparison is required for custom resource since everything is passed as string
    return columns.filter(column => column.sortKey === true || column.sortKey === 'true');
}
function areColumnsEqual(columnsA, columnsB) {
    if (columnsA.length !== columnsB.length) {
        return false;
    }
    return columnsA.every(columnA => {
        return columnsB.find(column => column.name === columnA.name && column.dataType === columnA.dataType);
    });
}
