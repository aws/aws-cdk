import {Test} from 'nodeunit';
import * as apigateway from '../lib';

export = {
    'if jsonWithStandardFields method called with no parameter'(test: Test) {
        const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields();
        test.deepEqual(testFormat.toString(), "{\"requestId\":\"$context.requestId\",\"ip\":\"$context.identity.sourceIp\",\"user\":\"$context.identity.user\",\"caller\":\"$context.identity.caller\",\"requestTime\":\"$context.requestTime\",\"httpMethod\":\"$context.httpMethod\",\"resourcePath\":\"$context.resourcePath\",\"status\":\"$context.status\",\"protocol\":\"$context.protocol\",\"responseLength\":\"$context.responseLength\"}");

        test.done();
    },

    'if jsonWithStandardFields method called with all parameters false'(test: Test) {
        const testFormat = apigateway.AccessLogFormat.jsonWithStandardFields({
            caller: false,
            httpMethod: false,
            ip: false,
            protocol: false,
            requestTime: false,
            resourcePath: false,
            responseLength: false,
            status: false,
            user: false
        });
        test.deepEqual(testFormat.toString(), "{\"requestId\":\"$context.requestId\"}");

        test.done();
    },

};
