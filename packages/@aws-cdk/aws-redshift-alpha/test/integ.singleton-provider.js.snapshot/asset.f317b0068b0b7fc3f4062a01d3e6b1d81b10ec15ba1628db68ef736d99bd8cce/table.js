"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const escape_1 = require("./escape");
const redshift_data_1 = require("./redshift-data");
const types_1 = require("./types");
const util_1 = require("./util");
async function handler(props, event) {
    const tableNamePrefix = props.tableName.prefix;
    const getTableNameSuffix = (generateSuffix) => generateSuffix === 'true' ? `${event.StackId.substring(event.StackId.length - 12)}` : '';
    const tableColumns = props.tableColumns;
    const tableAndClusterProps = props;
    const useColumnIds = props.useColumnIds;
    let tableName = tableNamePrefix + getTableNameSuffix(props.tableName.generateSuffix);
    if ((event.RequestType === 'Create' || event.RequestType === 'Update') && tableName.split('.').includes('')) {
        throw new Error(`table name ${JSON.stringify(tableName)} must not contain empty components`);
    }
    if (event.RequestType === 'Create') {
        tableName = await createTable(tableNamePrefix, getTableNameSuffix(props.tableName.generateSuffix), tableColumns, tableAndClusterProps);
        return { PhysicalResourceId: (0, util_1.makePhysicalId)(tableName, tableAndClusterProps, event.StackId.substring(event.StackId.length - 12)) };
    }
    else if (event.RequestType === 'Delete') {
        await dropTable(event.PhysicalResourceId.includes(event.StackId.substring(event.StackId.length - 12)) ? tableName : event.PhysicalResourceId, tableAndClusterProps);
        return;
    }
    else if (event.RequestType === 'Update') {
        const isTableV2 = event.PhysicalResourceId.includes(event.StackId.substring(event.StackId.length - 12));
        const oldTableName = event.OldResourceProperties.tableName.prefix + getTableNameSuffix(event.OldResourceProperties.tableName.generateSuffix);
        // CloudFormation rolls back a failed update by sending the previous properties as the new ones,
        // so reading the setting from both sets makes an update and its rollback compare names alike.
        const caseSensitive = props.caseSensitiveIdentifier === 'true' || event.OldResourceProperties.caseSensitiveIdentifier === 'true';
        // A rejected update ran no statements, so its rollback has nothing to undo.
        if (isTableV2 && isRollbackOfRejectedUpdate(oldTableName, tableName, event.PhysicalResourceId, caseSensitive)) {
            return { PhysicalResourceId: event.PhysicalResourceId };
        }
        tableName = await updateTable(isTableV2 ? oldTableName : event.PhysicalResourceId, tableNamePrefix, getTableNameSuffix(props.tableName.generateSuffix), tableColumns, useColumnIds, tableAndClusterProps, event.OldResourceProperties, isTableV2, caseSensitive);
        return { PhysicalResourceId: event.PhysicalResourceId };
    }
    else {
        /* eslint-disable-next-line dot-notation */
        throw new Error(`Unrecognized event type: ${event['RequestType']}`);
    }
}
async function createTable(tableNamePrefix, tableNameSuffix, tableColumns, tableAndClusterProps) {
    const tableName = tableNamePrefix + tableNameSuffix;
    const tableColumnsString = tableColumns.map(column => `${(0, escape_1.quoteIdentifier)(column.name)} ${column.dataType}${getEncodingColumnString(column)}`).join();
    let statement = `CREATE TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} (${tableColumnsString})`;
    if (tableAndClusterProps.distStyle) {
        statement += ` DISTSTYLE ${tableAndClusterProps.distStyle}`;
    }
    const distKeyColumn = (0, util_1.getDistKeyColumn)(tableColumns);
    if (distKeyColumn) {
        statement += ` DISTKEY(${(0, escape_1.quoteIdentifier)(distKeyColumn.name)})`;
    }
    const sortKeyColumns = (0, util_1.getSortKeyColumns)(tableColumns);
    if (sortKeyColumns.length > 0) {
        const sortKeyColumnsString = getSortKeyColumnsString(sortKeyColumns);
        statement += ` ${tableAndClusterProps.sortStyle} SORTKEY(${sortKeyColumnsString})`;
    }
    await (0, redshift_data_1.executeStatement)(statement, tableAndClusterProps);
    for (const column of tableColumns) {
        if (column.comment) {
            await (0, redshift_data_1.executeStatement)(`COMMENT ON COLUMN ${(0, escape_1.quoteQualifiedIdentifier)(tableName)}.${(0, escape_1.quoteIdentifier)(column.name)} IS ${(0, escape_1.quoteLiteral)(column.comment)}`, tableAndClusterProps);
        }
    }
    if (tableAndClusterProps.tableComment) {
        await (0, redshift_data_1.executeStatement)(`COMMENT ON TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} IS ${(0, escape_1.quoteLiteral)(tableAndClusterProps.tableComment)}`, tableAndClusterProps);
    }
    return tableName;
}
async function dropTable(tableName, clusterProps) {
    await (0, redshift_data_1.executeStatement)(`DROP TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)}`, clusterProps);
}
async function updateTable(tableName, tableNamePrefix, tableNameSuffix, tableColumns, useColumnIds, tableAndClusterProps, oldResourceProperties, isTableV2, caseSensitive) {
    const alterationStatements = [];
    const newTableName = tableNamePrefix + tableNameSuffix;
    const comparableTableName = comparableName(tableName, caseSensitive);
    const comparableNewTableName = comparableName(newTableName, caseSensitive);
    // Redshift RENAME TO keeps the table in its existing schema.
    // Keep the qualifier unchanged so later operations target the renamed table.
    if (isTableV2 && qualifierOf(tableName, caseSensitive) !== qualifierOf(newTableName, caseSensitive)) {
        throw new Error(`changing the table qualifier is not supported: ${JSON.stringify(tableName)} to ${JSON.stringify(newTableName)}; keep the same qualifier when renaming`);
    }
    const oldClusterProps = oldResourceProperties;
    if (tableAndClusterProps.clusterName !== oldClusterProps.clusterName || tableAndClusterProps.databaseName !== oldClusterProps.databaseName) {
        return createTable(tableNamePrefix, tableNameSuffix, tableColumns, tableAndClusterProps);
    }
    const oldTableColumns = oldResourceProperties.tableColumns;
    const columnDeletions = oldTableColumns.filter(oldColumn => (tableColumns.every(column => {
        if (useColumnIds) {
            return oldColumn.id ? oldColumn.id !== column.id : oldColumn.name !== column.name;
        }
        return oldColumn.name !== column.name;
    })));
    if (columnDeletions.length > 0) {
        alterationStatements.push(...columnDeletions.map(column => `ALTER TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} DROP COLUMN ${(0, escape_1.quoteIdentifier)(column.name)}`));
    }
    const columnAdditions = tableColumns.filter(column => {
        return !oldTableColumns.some(oldColumn => {
            if (useColumnIds) {
                return oldColumn.id ? oldColumn.id === column.id : oldColumn.name === column.name;
            }
            return oldColumn.name === column.name;
        });
    }).map(column => `ADD ${(0, escape_1.quoteIdentifier)(column.name)} ${column.dataType}`);
    if (columnAdditions.length > 0) {
        alterationStatements.push(...columnAdditions.map(addition => `ALTER TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} ${addition}`));
    }
    const columnEncoding = tableColumns.filter(column => {
        return oldTableColumns.some(oldColumn => column.name === oldColumn.name && column.encoding !== oldColumn.encoding);
    }).map(column => `ALTER COLUMN ${(0, escape_1.quoteIdentifier)(column.name)} ENCODE ${column.encoding || 'AUTO'}`);
    if (columnEncoding.length > 0) {
        alterationStatements.push(`ALTER TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} ${columnEncoding.join(', ')}`);
    }
    const columnComments = tableColumns.filter(column => {
        return oldTableColumns.some(oldColumn => column.name === oldColumn.name && column.comment !== oldColumn.comment);
    }).map(column => `COMMENT ON COLUMN ${(0, escape_1.quoteQualifiedIdentifier)(tableName)}.${(0, escape_1.quoteIdentifier)(column.name)} IS ${column.comment ? (0, escape_1.quoteLiteral)(column.comment) : 'NULL'}`);
    if (columnComments.length > 0) {
        alterationStatements.push(...columnComments);
    }
    if (useColumnIds) {
        const columnNameUpdates = tableColumns.reduce((updates, column) => {
            const oldColumn = oldTableColumns.find(oldCol => oldCol.id && oldCol.id === column.id);
            if (oldColumn && oldColumn.name !== column.name) {
                updates[oldColumn.name] = column.name;
            }
            return updates;
        }, {});
        if (Object.keys(columnNameUpdates).length > 0) {
            alterationStatements.push(...Object.entries(columnNameUpdates).map(([oldName, newName]) => (`ALTER TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} RENAME COLUMN ${(0, escape_1.quoteIdentifier)(oldName)} TO ${(0, escape_1.quoteIdentifier)(newName)}`)));
        }
    }
    const oldDistStyle = oldResourceProperties.distStyle;
    if ((!oldDistStyle && tableAndClusterProps.distStyle) ||
        (oldDistStyle && !tableAndClusterProps.distStyle)) {
        return createTable(tableNamePrefix, tableNameSuffix, tableColumns, tableAndClusterProps);
    }
    else if (oldDistStyle !== tableAndClusterProps.distStyle) {
        alterationStatements.push(`ALTER TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} ALTER DISTSTYLE ${tableAndClusterProps.distStyle}`);
    }
    const oldDistKey = (0, util_1.getDistKeyColumn)(oldTableColumns)?.name;
    const newDistKey = (0, util_1.getDistKeyColumn)(tableColumns)?.name;
    if (!oldDistKey && newDistKey) {
        // Table has no existing distribution key, add a new one
        alterationStatements.push(`ALTER TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} ALTER DISTSTYLE KEY DISTKEY ${(0, escape_1.quoteIdentifier)(newDistKey)}`);
    }
    else if (oldDistKey && !newDistKey) {
        // Table has a distribution key, remove and set to AUTO
        alterationStatements.push(`ALTER TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} ALTER DISTSTYLE AUTO`);
    }
    else if (oldDistKey !== newDistKey) {
        // Table has an existing distribution key, change it
        // (both keys are defined here; the undefined cases are handled by the branches above)
        alterationStatements.push(`ALTER TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} ALTER DISTKEY ${(0, escape_1.quoteIdentifier)(newDistKey)}`);
    }
    const oldSortKeyColumns = (0, util_1.getSortKeyColumns)(oldTableColumns);
    const newSortKeyColumns = (0, util_1.getSortKeyColumns)(tableColumns);
    const oldSortStyle = oldResourceProperties.sortStyle;
    const newSortStyle = tableAndClusterProps.sortStyle;
    if ((oldSortStyle === newSortStyle && !(0, util_1.areColumnsEqual)(oldSortKeyColumns, newSortKeyColumns))
        || (oldSortStyle !== newSortStyle)) {
        switch (newSortStyle) {
            case types_1.TableSortStyle.INTERLEAVED:
                // INTERLEAVED sort key addition requires replacement.
                // https://docs.aws.amazon.com/redshift/latest/dg/r_ALTER_TABLE.html
                return createTable(tableNamePrefix, tableNameSuffix, tableColumns, tableAndClusterProps);
            case types_1.TableSortStyle.COMPOUND: {
                const sortKeyColumnsString = getSortKeyColumnsString(newSortKeyColumns);
                alterationStatements.push(`ALTER TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} ALTER ${newSortStyle} SORTKEY(${sortKeyColumnsString})`);
                break;
            }
            case types_1.TableSortStyle.AUTO: {
                alterationStatements.push(`ALTER TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} ALTER SORTKEY ${newSortStyle}`);
                break;
            }
        }
    }
    const oldComment = oldResourceProperties.tableComment;
    const newComment = tableAndClusterProps.tableComment;
    if (oldComment !== newComment) {
        alterationStatements.push(`COMMENT ON TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} IS ${newComment ? (0, escape_1.quoteLiteral)(newComment) : 'NULL'}`);
    }
    // Limited by human input
    // eslint-disable-next-line @cdklabs/promiseall-no-unbounded-parallelism
    await Promise.all(alterationStatements.map(statement => (0, redshift_data_1.executeStatement)(statement, tableAndClusterProps)));
    if (isTableV2) {
        const oldTableNamePrefix = oldResourceProperties.tableName.prefix;
        if (tableNamePrefix !== oldTableNamePrefix && comparableTableName !== comparableNewTableName) {
            await (0, redshift_data_1.executeStatement)(`ALTER TABLE ${(0, escape_1.quoteQualifiedIdentifier)(tableName)} RENAME TO ${(0, escape_1.quoteIdentifier)(newTableName.split('.').pop())}`, tableAndClusterProps);
            return tableNamePrefix + tableNameSuffix;
        }
    }
    return tableName;
}
// Redshift folds ASCII letters in identifiers to lowercase, and keeps the case of quoted ones only
// when enable_case_sensitive_identifier is on.
function comparableName(name, caseSensitive) {
    return name.split('.').map(component => (caseSensitive && (0, escape_1.quoteIdentifier)(component) !== component ? component : component.replace(/[A-Z]/g, letter => letter.toLowerCase()))).join('.');
}
function qualifierOf(name, caseSensitive) {
    const comparable = comparableName(name, caseSensitive);
    return comparable.slice(0, comparable.lastIndexOf('.') + 1);
}
function isRollbackOfRejectedUpdate(oldTableName, newTableName, physicalResourceId, caseSensitive) {
    // cluster:database:name:stack physical IDs (isTableV2) keep the created name, and updateTable keeps its qualifier.
    // Tables renamed across a qualifier by earlier releases are indistinguishable here and are treated as rolled back.
    // The created name cannot be read back when it, or a cluster or database name, contains ":".
    const createdName = physicalResourceId.split(':').slice(2, -1).join(':');
    if (createdName.includes(':')) {
        return false;
    }
    const createdQualifier = qualifierOf(createdName, caseSensitive);
    const oldWasRejected = oldTableName.split('.').includes('') || qualifierOf(oldTableName, caseSensitive) !== createdQualifier;
    return oldWasRejected && !createdName.split('.').includes('') && qualifierOf(newTableName, caseSensitive) === createdQualifier;
}
function getSortKeyColumnsString(sortKeyColumns) {
    return sortKeyColumns.map(column => (0, escape_1.quoteIdentifier)(column.name)).join();
}
function getEncodingColumnString(column) {
    if (column.encoding) {
        return ` ENCODE ${column.encoding}`;
    }
    return '';
}
