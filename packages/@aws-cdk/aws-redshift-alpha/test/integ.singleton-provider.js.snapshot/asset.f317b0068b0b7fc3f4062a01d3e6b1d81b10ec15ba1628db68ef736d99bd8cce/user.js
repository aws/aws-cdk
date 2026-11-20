"use strict";
/* eslint-disable import/no-extraneous-dependencies */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const escape_1 = require("./escape");
const redshift_data_1 = require("./redshift-data");
const util_1 = require("./util");
const validate_1 = require("./validate");
const secretsManager = new client_secrets_manager_1.SecretsManager({});
async function handler(props, event) {
    const username = props.username;
    const passwordSecretArn = props.passwordSecretArn;
    const clusterProps = props;
    if (event.RequestType === 'Create') {
        await createUser(username, passwordSecretArn, clusterProps);
        return { PhysicalResourceId: (0, util_1.makePhysicalId)(username, clusterProps, event.RequestId), Data: { username: username } };
    }
    else if (event.RequestType === 'Delete') {
        await dropUser(username, clusterProps);
        return;
    }
    else if (event.RequestType === 'Update') {
        const { replace } = await updateUser(username, passwordSecretArn, clusterProps, event.OldResourceProperties);
        const physicalId = replace ? (0, util_1.makePhysicalId)(username, clusterProps, event.RequestId) : event.PhysicalResourceId;
        return { PhysicalResourceId: physicalId, Data: { username: username } };
    }
    else {
        /* eslint-disable-next-line dot-notation */
        throw new Error(`Unrecognized event type: ${event['RequestType']}`);
    }
}
async function dropUser(username, clusterProps) {
    await (0, redshift_data_1.executeStatement)(`DROP USER ${(0, escape_1.quoteIdentifier)(username)}`, clusterProps);
}
async function createUser(username, passwordSecretArn, clusterProps) {
    // Existing users must remain removable during teardown.
    (0, validate_1.validateUsername)(username);
    const password = await getPasswordFromSecret(passwordSecretArn);
    await (0, redshift_data_1.executeStatement)(`CREATE USER ${(0, escape_1.quoteIdentifier)(username)} PASSWORD ${(0, escape_1.quoteLiteral)(password)}`, clusterProps);
}
async function updateUser(username, passwordSecretArn, clusterProps, oldResourceProperties) {
    const oldClusterProps = oldResourceProperties;
    if (clusterProps.clusterName !== oldClusterProps.clusterName || clusterProps.databaseName !== oldClusterProps.databaseName) {
        await createUser(username, passwordSecretArn, clusterProps);
        return { replace: true };
    }
    const oldUsername = oldResourceProperties.username;
    const oldPasswordSecretArn = oldResourceProperties.passwordSecretArn;
    const oldPassword = await getPasswordFromSecret(oldPasswordSecretArn);
    const password = await getPasswordFromSecret(passwordSecretArn);
    if (username !== oldUsername) {
        await createUser(username, passwordSecretArn, clusterProps);
        return { replace: true };
    }
    if (password !== oldPassword) {
        (0, validate_1.validateUsername)(username);
        await (0, redshift_data_1.executeStatement)(`ALTER USER ${(0, escape_1.quoteIdentifier)(username)} PASSWORD ${(0, escape_1.quoteLiteral)(password)}`, clusterProps);
        return { replace: false };
    }
    return { replace: false };
}
async function getPasswordFromSecret(passwordSecretArn) {
    const secretValue = await secretsManager.getSecretValue({
        SecretId: passwordSecretArn,
    });
    const secretString = secretValue.SecretString;
    if (!secretString) {
        throw new Error(`Secret string for ${passwordSecretArn} was empty`);
    }
    const { password } = JSON.parse(secretString);
    return password;
}
