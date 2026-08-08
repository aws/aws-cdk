#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route53 = require("aws-cdk-lib/aws-route53");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const targets = require("aws-cdk-lib/aws-route53-targets");
const aws_cognito_1 = require("aws-cdk-lib/aws-cognito");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const zone = new route53.PublicHostedZone(this, 'HostedZone', { zoneName: 'test.public' });
        const userPool = new aws_cognito_1.UserPool(this, 'UserPool');
        const domain = new aws_cognito_1.UserPoolDomain(this, 'UserPoolDomain', {
            userPool,
            cognitoDomain: { domainPrefix: 'domain-prefix' },
        });
        new route53.ARecord(zone, 'Alias', {
            zone,
            target: route53.RecordTarget.fromAlias(new targets.UserPoolDomainTarget(domain)),
        });
    }
}
const app = new aws_cdk_lib_1.App();
const stack = new TestStack(app, 'userpool-domain-alias-target');
new integ_tests_alpha_1.IntegTest(app, 'userpool-domain-alias-target-integ', {
    testCases: [stack],
});
app.synth();
