"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeStatement = executeStatement;
/* eslint-disable-next-line import/no-extraneous-dependencies */
const client_redshift_data_1 = require("@aws-sdk/client-redshift-data");
const redshiftData = new client_redshift_data_1.RedshiftData({});
async function executeStatement(statement, clusterProps) {
    const executeStatementProps = {
        ClusterIdentifier: clusterProps.clusterName,
        Database: clusterProps.databaseName,
        SecretArn: clusterProps.adminUserArn,
        Sql: statement,
    };
    const executedStatement = await redshiftData.executeStatement(executeStatementProps);
    if (!executedStatement.Id) {
        throw new Error('Service error: Statement execution did not return a statement ID');
    }
    await waitForStatementComplete(executedStatement.Id);
}
const waitTimeout = 100;
async function waitForStatementComplete(statementId) {
    await new Promise((resolve) => {
        setTimeout(() => resolve(), waitTimeout);
    });
    const statement = await redshiftData.describeStatement({ Id: statementId });
    if (statement.Status !== 'FINISHED' && statement.Status !== 'FAILED' && statement.Status !== 'ABORTED') {
        return waitForStatementComplete(statementId);
    }
    else if (statement.Status === 'FINISHED') {
        return;
    }
    else {
        throw new Error(`Statement status was ${statement.Status}: ${statement.Error}`);
    }
}
