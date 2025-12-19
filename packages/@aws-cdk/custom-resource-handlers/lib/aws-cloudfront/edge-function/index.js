"use strict";
/* eslint-disable import/no-extraneous-dependencies */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = handler;
const client_ssm_1 = require("@aws-sdk/client-ssm");
async function handler(event) {
    const props = event.ResourceProperties;
    console.info(`Reading function ARN from SSM parameter ${props.ParameterName} in region ${props.Region}`);
    if (event.RequestType === 'Create' || event.RequestType === 'Update') {
        const ssm = new client_ssm_1.SSM({ region: props.Region });
        const ssmParameter = await ssm.getParameter({ Name: props.ParameterName });
        console.info('Response: %j', ssmParameter);
        const functionArn = ssmParameter.Parameter?.Value ?? '';
        return {
            Data: {
                FunctionArn: functionArn,
            },
        };
    }
    return undefined;
}
