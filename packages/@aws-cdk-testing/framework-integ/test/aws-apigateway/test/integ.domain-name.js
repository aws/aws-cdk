"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_certificatemanager_1 = require("aws-cdk-lib/aws-certificatemanager");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_route53_1 = require("aws-cdk-lib/aws-route53");
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const constructs_1 = require("constructs");
const apigw = require("aws-cdk-lib/aws-apigateway");
const domainName = process.env.CDK_INTEG_DOMAIN_NAME || process.env.DOMAIN_NAME;
const hostedZoneId = process.env.CDK_INTEG_HOSTED_ZONE_ID || process.env.HOSTED_ZONE_ID;
const certArn = process.env.CDK_INTEG_CERT_ARN || process.env.CERT_ARN;
if (!domainName || !certArn || !hostedZoneId) {
    throw new Error('Env vars DOMAIN_NAME, HOSTED_ZONE_ID, and CERT_ARN must be set');
}
/**
 * -------------------------------------------------------
 * ------------------------- GIVEN------------------------
 * -------------------------------------------------------
 */
const app = new cdk.App();
const testCase = new cdk.Stack(app, 'integ-apigw-domain-name-mapping');
class Api extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.restApi = new apigw.RestApi(this, 'IntegApi' + props.statusCode, {
            endpointTypes: [apigw.EndpointType.REGIONAL],
        });
        this.resource = this.restApi.root.addResource(props.path);
        const integration = this.createIntegration(props.statusCode);
        const options = {
            methodResponses: [{
                    statusCode: props.statusCode,
                }],
        };
        this.restApi.root.addMethod('GET', integration, options);
        this.resource.addMethod('GET', integration, options);
    }
    addResource(path, statusCode, resource) {
        const subResource = (resource ?? this.resource).addResource(path);
        const integration = this.createIntegration(statusCode);
        subResource.addMethod('GET', integration, {
            methodResponses: [{ statusCode }],
        });
    }
    addRootResource(path, statusCode) {
        const subResource = this.restApi.root.addResource(path);
        const integration = this.createIntegration(statusCode);
        subResource.addMethod('GET', integration, {
            methodResponses: [{ statusCode }],
        });
        return subResource;
    }
    createIntegration(statusCode) {
        return new apigw.MockIntegration({
            requestTemplates: { 'application/json': `{ statusCode: ${Number(statusCode)} }` },
            integrationResponses: [{
                    statusCode: statusCode,
                    responseTemplates: {
                        'application/json': JSON.stringify({ message: 'Hello, world' }),
                    },
                }],
        });
    }
}
/**
 * -------------------------------------------------------
 * ------------------------- WHEN ------------------------
 * -------------------------------------------------------
 */
const certificate = aws_certificatemanager_1.Certificate.fromCertificateArn(testCase, 'Cert', certArn);
const api1 = new Api(testCase, 'IntegApi1', {
    statusCode: '201',
    path: 'items',
});
const api2 = new Api(testCase, 'IntegApi2', {
    statusCode: '202',
    path: 'items',
});
/**
 * Test 1
 *
 * Create an initial BasePathMapping for (none)
 * Then use a mixture of `addBasePathMapping` and `addApiMapping`
 * to test that they can be used together
 */
const domain = new apigw.DomainName(testCase, 'IntegDomain', {
    domainName,
    securityPolicy: apigw.SecurityPolicy.TLS_1_2,
    certificate,
    mapping: api1.restApi,
});
new aws_route53_1.CfnRecordSet(testCase, 'IntegDomainRecord', {
    name: domainName,
    type: 'A',
    hostedZoneId,
    aliasTarget: {
        hostedZoneId: domain.domainNameAliasHostedZoneId,
        dnsName: domain.domainNameAliasDomainName,
    },
});
domain.addBasePathMapping(api1.restApi, {
    basePath: 'orders',
});
domain.addApiMapping(api2.restApi.deploymentStage, {
    basePath: 'orders/v2',
});
domain.addApiMapping(api1.restApi.deploymentStage, {
    basePath: 'orders/v1',
});
/**
 * Test 2
 *
 * Create an initial BasePathMapping for 'orders'
 * and then add an ApiMapping for a multi-level path
 */
const secondDomain = new apigw.DomainName(testCase, 'Integ2Domain', {
    domainName: `another-${domainName}`,
    securityPolicy: apigw.SecurityPolicy.TLS_1_2,
    certificate,
    mapping: api1.restApi,
    basePath: 'orders',
});
new aws_route53_1.CfnRecordSet(testCase, 'Integ2DomainRecord', {
    name: `another-${domainName}`,
    type: 'A',
    hostedZoneId,
    aliasTarget: {
        hostedZoneId: secondDomain.domainNameAliasHostedZoneId,
        dnsName: secondDomain.domainNameAliasDomainName,
    },
});
secondDomain.addApiMapping(api2.restApi.deploymentStage, {
    basePath: 'orders/v2',
});
/**
 * Test 3
 *
 * Test that you can create an initial BasePathMapping (none)
 * and then add additional base path mappings
 */
const thirdDomain = new apigw.DomainName(testCase, 'Integ3Domain', {
    domainName: `yet-another-${domainName}`,
    securityPolicy: apigw.SecurityPolicy.TLS_1_2,
    certificate,
    mapping: api1.restApi,
});
new aws_route53_1.CfnRecordSet(testCase, 'Integ3DomainRecord', {
    name: `yet-another-${domainName}`,
    type: 'A',
    hostedZoneId,
    aliasTarget: {
        hostedZoneId: thirdDomain.domainNameAliasHostedZoneId,
        dnsName: thirdDomain.domainNameAliasDomainName,
    },
});
thirdDomain.addBasePathMapping(api2.restApi, {
    basePath: 'v2',
});
/**
 * -------------------------------------------------------
 * ------------------------- THEN ------------------------
 * -------------------------------------------------------
 */
const integ = new integ_tests_alpha_1.IntegTest(app, 'domain-name-mapping-test', {
    testCases: [testCase],
    enableLookups: true,
});
const invoke = new aws_lambda_1.Function(testCase, 'InvokeApi', {
    code: aws_lambda_1.Code.fromInline(`
const https = require('https');
exports.handler = async function(event) {
  console.log(event);
  const options = {
    hostname: event.hostname,
    path: event.path,
  };
  let dataString = '';
  const response = await new Promise((resolve, reject) => {
    const req = https.get(options, (res) => {
      res.on('data', data => {
        dataString += data;
      })
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: dataString,
        });
      })
    });
    req.on('error', err => {
      reject({
        statusCode: 500,
        body: JSON.stringify({
          cause: 'Something went wrong',
          error: err,
        })
      });
    });
    req.end();
  });
  return response;
}

`),
    handler: 'index.handler',
    runtime: aws_lambda_1.Runtime.NODEJS_16_X,
});
const api1Invoke = integ.assertions.invokeFunction({
    functionName: invoke.functionName,
    payload: JSON.stringify({
        hostname: domain.domainName,
        path: '/orders/v1/items',
    }),
});
api1Invoke.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    Payload: integ_tests_alpha_1.Match.stringLikeRegexp('201'),
}));
const api2Invoke = integ.assertions.invokeFunction({
    functionName: invoke.functionName,
    payload: JSON.stringify({
        hostname: domain.domainName,
        path: '/orders/v2/items',
    }),
});
api2Invoke.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    Payload: integ_tests_alpha_1.Match.stringLikeRegexp('202'),
}));
const domain2api1Invoke = integ.assertions.invokeFunction({
    functionName: invoke.functionName,
    payload: JSON.stringify({
        hostname: secondDomain.domainName,
        path: '/orders/items',
    }),
});
domain2api1Invoke.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    Payload: integ_tests_alpha_1.Match.stringLikeRegexp('201'),
}));
const domain2api2Invoke = integ.assertions.invokeFunction({
    functionName: invoke.functionName,
    payload: JSON.stringify({
        hostname: secondDomain.domainName,
        path: '/orders/v2/items',
    }),
});
domain2api2Invoke.expect(integ_tests_alpha_1.ExpectedResult.objectLike({
    Payload: integ_tests_alpha_1.Match.stringLikeRegexp('202'),
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZG9tYWluLW5hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5kb21haW4tbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtFQUFpRTtBQUNqRSx1REFBaUU7QUFDakUseURBQXVEO0FBQ3ZELG1DQUFtQztBQUNuQyxrRUFJb0M7QUFDcEMsMkNBQXVDO0FBQ3ZDLG9EQUFvRDtBQUVwRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0FBQ2hGLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7QUFDeEYsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUN2RSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsWUFBWSxFQUFFO0lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztDQUNuRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGlDQUFpQyxDQUFDLENBQUM7QUFPdkUsTUFBTSxHQUFJLFNBQVEsc0JBQVM7SUFHekIsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFlO1FBQ3ZELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFVBQVUsR0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ2xF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O1FBQ2pDLElBQUksRUFBRSxlQUFlO0tBQ3RCLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFDSCxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsa0NBQWMsQ0FBQyxVQUFVLENBQUM7SUFDakQsT0FBTyxFQUFFLHlCQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO0NBQ3ZDLENBQUMsQ0FBQyxDQUFDO0FBQ0osTUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztJQUN4RCxZQUFZLEVBQUUsTUFBTSxDQUFDLFlBQVk7SUFDakMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDdEIsUUFBUSxFQUFFLFlBQVksQ0FBQyxVQUFVO1FBQ2pDLElBQUksRUFBRSxrQkFBa0I7S0FDekIsQ0FBQztDQUNILENBQUMsQ0FBQztBQUNILGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxrQ0FBYyxDQUFDLFVBQVUsQ0FBQztJQUNqRCxPQUFPLEVBQUUseUJBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUM7Q0FDdkMsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDZXJ0aWZpY2F0ZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXInO1xuaW1wb3J0IHsgRnVuY3Rpb24sIENvZGUsIFJ1bnRpbWUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCB7IENmblJlY29yZFNldCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1yb3V0ZTUzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQge1xuICBJbnRlZ1Rlc3QsXG4gIEV4cGVjdGVkUmVzdWx0LFxuICBNYXRjaCxcbn0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBhcGlndyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5cbmNvbnN0IGRvbWFpbk5hbWUgPSBwcm9jZXNzLmVudi5DREtfSU5URUdfRE9NQUlOX05BTUUgfHwgcHJvY2Vzcy5lbnYuRE9NQUlOX05BTUU7XG5jb25zdCBob3N0ZWRab25lSWQgPSBwcm9jZXNzLmVudi5DREtfSU5URUdfSE9TVEVEX1pPTkVfSUQgfHwgcHJvY2Vzcy5lbnYuSE9TVEVEX1pPTkVfSUQ7XG5jb25zdCBjZXJ0QXJuID0gcHJvY2Vzcy5lbnYuQ0RLX0lOVEVHX0NFUlRfQVJOIHx8IHByb2Nlc3MuZW52LkNFUlRfQVJOO1xuaWYgKCFkb21haW5OYW1lIHx8ICFjZXJ0QXJuIHx8ICFob3N0ZWRab25lSWQpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdFbnYgdmFycyBET01BSU5fTkFNRSwgSE9TVEVEX1pPTkVfSUQsIGFuZCBDRVJUX0FSTiBtdXN0IGJlIHNldCcpO1xufVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gR0lWRU4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHRlc3RDYXNlID0gbmV3IGNkay5TdGFjayhhcHAsICdpbnRlZy1hcGlndy1kb21haW4tbmFtZS1tYXBwaW5nJyk7XG5cbmludGVyZmFjZSBBcGlQcm9wcyB7XG4gIHN0YXR1c0NvZGU6IHN0cmluZztcbiAgcGF0aDogc3RyaW5nO1xufVxuXG5jbGFzcyBBcGkgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuICBwdWJsaWMgcmVhZG9ubHkgcmVzdEFwaTogYXBpZ3cuSVJlc3RBcGk7XG4gIHByaXZhdGUgcmVhZG9ubHkgcmVzb3VyY2U6IGFwaWd3LlJlc291cmNlO1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQXBpUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuICAgIHRoaXMucmVzdEFwaSA9IG5ldyBhcGlndy5SZXN0QXBpKHRoaXMsICdJbnRlZ0FwaScrcHJvcHMuc3RhdHVzQ29kZSwge1xuICAgICAgZW5kcG9pbnRUeXBlczogW2FwaWd3LkVuZHBvaW50VHlwZS5SRUdJT05BTF0sXG4gICAgfSk7XG4gICAgdGhpcy5yZXNvdXJjZSA9IHRoaXMucmVzdEFwaS5yb290LmFkZFJlc291cmNlKHByb3BzLnBhdGgpO1xuICAgIGNvbnN0IGludGVncmF0aW9uID0gdGhpcy5jcmVhdGVJbnRlZ3JhdGlvbihwcm9wcy5zdGF0dXNDb2RlKTtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbe1xuICAgICAgICBzdGF0dXNDb2RlOiBwcm9wcy5zdGF0dXNDb2RlLFxuICAgICAgfV0sXG4gICAgfTtcbiAgICB0aGlzLnJlc3RBcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcsIGludGVncmF0aW9uLCBvcHRpb25zKTtcbiAgICB0aGlzLnJlc291cmNlLmFkZE1ldGhvZCgnR0VUJywgaW50ZWdyYXRpb24sIG9wdGlvbnMpO1xuICB9XG4gIHB1YmxpYyBhZGRSZXNvdXJjZShwYXRoOiBzdHJpbmcsIHN0YXR1c0NvZGU6IHN0cmluZywgcmVzb3VyY2U/OiBhcGlndy5SZXNvdXJjZSk6IHZvaWQge1xuICAgIGNvbnN0IHN1YlJlc291cmNlID0gKHJlc291cmNlID8/IHRoaXMucmVzb3VyY2UpLmFkZFJlc291cmNlKHBhdGgpO1xuICAgIGNvbnN0IGludGVncmF0aW9uID0gdGhpcy5jcmVhdGVJbnRlZ3JhdGlvbihzdGF0dXNDb2RlKTtcbiAgICBzdWJSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIGludGVncmF0aW9uLCB7XG4gICAgICBtZXRob2RSZXNwb25zZXM6IFt7IHN0YXR1c0NvZGUgfV0sXG4gICAgfSk7XG4gIH1cbiAgcHVibGljIGFkZFJvb3RSZXNvdXJjZShwYXRoOiBzdHJpbmcsIHN0YXR1c0NvZGU6IHN0cmluZyk6IGFwaWd3LlJlc291cmNlIHtcbiAgICBjb25zdCBzdWJSZXNvdXJjZSA9IHRoaXMucmVzdEFwaS5yb290LmFkZFJlc291cmNlKHBhdGgpO1xuICAgIGNvbnN0IGludGVncmF0aW9uID0gdGhpcy5jcmVhdGVJbnRlZ3JhdGlvbihzdGF0dXNDb2RlKTtcbiAgICBzdWJSZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIGludGVncmF0aW9uLCB7XG4gICAgICBtZXRob2RSZXNwb25zZXM6IFt7IHN0YXR1c0NvZGUgfV0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHN1YlJlc291cmNlO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVJbnRlZ3JhdGlvbihzdGF0dXNDb2RlOiBzdHJpbmcpOiBhcGlndy5Nb2NrSW50ZWdyYXRpb24ge1xuICAgIHJldHVybiBuZXcgYXBpZ3cuTW9ja0ludGVncmF0aW9uKHtcbiAgICAgIHJlcXVlc3RUZW1wbGF0ZXM6IHsgJ2FwcGxpY2F0aW9uL2pzb24nOiBgeyBzdGF0dXNDb2RlOiAke051bWJlcihzdGF0dXNDb2RlKX0gfWAgfSxcbiAgICAgIGludGVncmF0aW9uUmVzcG9uc2VzOiBbe1xuICAgICAgICBzdGF0dXNDb2RlOiBzdGF0dXNDb2RlLFxuICAgICAgICByZXNwb25zZVRlbXBsYXRlczoge1xuICAgICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogSlNPTi5zdHJpbmdpZnkoeyBtZXNzYWdlOiAnSGVsbG8sIHdvcmxkJyB9KSxcbiAgICAgICAgfSxcbiAgICAgIH1dLFxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBXSEVOIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICovXG5jb25zdCBjZXJ0aWZpY2F0ZSA9IENlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybih0ZXN0Q2FzZSwgJ0NlcnQnLCBjZXJ0QXJuKTtcbmNvbnN0IGFwaTEgPSBuZXcgQXBpKHRlc3RDYXNlLCAnSW50ZWdBcGkxJywge1xuICBzdGF0dXNDb2RlOiAnMjAxJyxcbiAgcGF0aDogJ2l0ZW1zJyxcbn0pO1xuY29uc3QgYXBpMiA9IG5ldyBBcGkodGVzdENhc2UsICdJbnRlZ0FwaTInLCB7XG4gIHN0YXR1c0NvZGU6ICcyMDInLFxuICBwYXRoOiAnaXRlbXMnLFxufSk7XG5cblxuLyoqXG4gKiBUZXN0IDFcbiAqXG4gKiBDcmVhdGUgYW4gaW5pdGlhbCBCYXNlUGF0aE1hcHBpbmcgZm9yIChub25lKVxuICogVGhlbiB1c2UgYSBtaXh0dXJlIG9mIGBhZGRCYXNlUGF0aE1hcHBpbmdgIGFuZCBgYWRkQXBpTWFwcGluZ2BcbiAqIHRvIHRlc3QgdGhhdCB0aGV5IGNhbiBiZSB1c2VkIHRvZ2V0aGVyXG4gKi9cbmNvbnN0IGRvbWFpbiA9IG5ldyBhcGlndy5Eb21haW5OYW1lKHRlc3RDYXNlLCAnSW50ZWdEb21haW4nLCB7XG4gIGRvbWFpbk5hbWUsXG4gIHNlY3VyaXR5UG9saWN5OiBhcGlndy5TZWN1cml0eVBvbGljeS5UTFNfMV8yLFxuICBjZXJ0aWZpY2F0ZSxcbiAgbWFwcGluZzogYXBpMS5yZXN0QXBpLFxufSk7XG5uZXcgQ2ZuUmVjb3JkU2V0KHRlc3RDYXNlLCAnSW50ZWdEb21haW5SZWNvcmQnLCB7XG4gIG5hbWU6IGRvbWFpbk5hbWUsXG4gIHR5cGU6ICdBJyxcbiAgaG9zdGVkWm9uZUlkLFxuICBhbGlhc1RhcmdldDoge1xuICAgIGhvc3RlZFpvbmVJZDogZG9tYWluLmRvbWFpbk5hbWVBbGlhc0hvc3RlZFpvbmVJZCxcbiAgICBkbnNOYW1lOiBkb21haW4uZG9tYWluTmFtZUFsaWFzRG9tYWluTmFtZSxcbiAgfSxcbn0pO1xuZG9tYWluLmFkZEJhc2VQYXRoTWFwcGluZyhhcGkxLnJlc3RBcGksIHtcbiAgYmFzZVBhdGg6ICdvcmRlcnMnLFxufSk7XG5kb21haW4uYWRkQXBpTWFwcGluZyhhcGkyLnJlc3RBcGkuZGVwbG95bWVudFN0YWdlLCB7XG4gIGJhc2VQYXRoOiAnb3JkZXJzL3YyJyxcbn0pO1xuZG9tYWluLmFkZEFwaU1hcHBpbmcoYXBpMS5yZXN0QXBpLmRlcGxveW1lbnRTdGFnZSwge1xuICBiYXNlUGF0aDogJ29yZGVycy92MScsXG59KTtcblxuLyoqXG4gKiBUZXN0IDJcbiAqXG4gKiBDcmVhdGUgYW4gaW5pdGlhbCBCYXNlUGF0aE1hcHBpbmcgZm9yICdvcmRlcnMnXG4gKiBhbmQgdGhlbiBhZGQgYW4gQXBpTWFwcGluZyBmb3IgYSBtdWx0aS1sZXZlbCBwYXRoXG4gKi9cbmNvbnN0IHNlY29uZERvbWFpbiA9IG5ldyBhcGlndy5Eb21haW5OYW1lKHRlc3RDYXNlLCAnSW50ZWcyRG9tYWluJywge1xuICBkb21haW5OYW1lOiBgYW5vdGhlci0ke2RvbWFpbk5hbWV9YCxcbiAgc2VjdXJpdHlQb2xpY3k6IGFwaWd3LlNlY3VyaXR5UG9saWN5LlRMU18xXzIsXG4gIGNlcnRpZmljYXRlLFxuICBtYXBwaW5nOiBhcGkxLnJlc3RBcGksXG4gIGJhc2VQYXRoOiAnb3JkZXJzJyxcbn0pO1xubmV3IENmblJlY29yZFNldCh0ZXN0Q2FzZSwgJ0ludGVnMkRvbWFpblJlY29yZCcsIHtcbiAgbmFtZTogYGFub3RoZXItJHtkb21haW5OYW1lfWAsXG4gIHR5cGU6ICdBJyxcbiAgaG9zdGVkWm9uZUlkLFxuICBhbGlhc1RhcmdldDoge1xuICAgIGhvc3RlZFpvbmVJZDogc2Vjb25kRG9tYWluLmRvbWFpbk5hbWVBbGlhc0hvc3RlZFpvbmVJZCxcbiAgICBkbnNOYW1lOiBzZWNvbmREb21haW4uZG9tYWluTmFtZUFsaWFzRG9tYWluTmFtZSxcbiAgfSxcbn0pO1xuc2Vjb25kRG9tYWluLmFkZEFwaU1hcHBpbmcoYXBpMi5yZXN0QXBpLmRlcGxveW1lbnRTdGFnZSwge1xuICBiYXNlUGF0aDogJ29yZGVycy92MicsXG59KTtcblxuXG4vKipcbiAqIFRlc3QgM1xuICpcbiAqIFRlc3QgdGhhdCB5b3UgY2FuIGNyZWF0ZSBhbiBpbml0aWFsIEJhc2VQYXRoTWFwcGluZyAobm9uZSlcbiAqIGFuZCB0aGVuIGFkZCBhZGRpdGlvbmFsIGJhc2UgcGF0aCBtYXBwaW5nc1xuICovXG5jb25zdCB0aGlyZERvbWFpbiA9IG5ldyBhcGlndy5Eb21haW5OYW1lKHRlc3RDYXNlLCAnSW50ZWczRG9tYWluJywge1xuICBkb21haW5OYW1lOiBgeWV0LWFub3RoZXItJHtkb21haW5OYW1lfWAsXG4gIHNlY3VyaXR5UG9saWN5OiBhcGlndy5TZWN1cml0eVBvbGljeS5UTFNfMV8yLFxuICBjZXJ0aWZpY2F0ZSxcbiAgbWFwcGluZzogYXBpMS5yZXN0QXBpLFxufSk7XG5uZXcgQ2ZuUmVjb3JkU2V0KHRlc3RDYXNlLCAnSW50ZWczRG9tYWluUmVjb3JkJywge1xuICBuYW1lOiBgeWV0LWFub3RoZXItJHtkb21haW5OYW1lfWAsXG4gIHR5cGU6ICdBJyxcbiAgaG9zdGVkWm9uZUlkLFxuICBhbGlhc1RhcmdldDoge1xuICAgIGhvc3RlZFpvbmVJZDogdGhpcmREb21haW4uZG9tYWluTmFtZUFsaWFzSG9zdGVkWm9uZUlkLFxuICAgIGRuc05hbWU6IHRoaXJkRG9tYWluLmRvbWFpbk5hbWVBbGlhc0RvbWFpbk5hbWUsXG4gIH0sXG59KTtcbnRoaXJkRG9tYWluLmFkZEJhc2VQYXRoTWFwcGluZyhhcGkyLnJlc3RBcGksIHtcbiAgYmFzZVBhdGg6ICd2MicsXG59KTtcblxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gVEhFTiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuY29uc3QgaW50ZWcgPSBuZXcgSW50ZWdUZXN0KGFwcCwgJ2RvbWFpbi1uYW1lLW1hcHBpbmctdGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxuICBlbmFibGVMb29rdXBzOiB0cnVlLFxufSk7XG5cbmNvbnN0IGludm9rZSA9IG5ldyBGdW5jdGlvbih0ZXN0Q2FzZSwgJ0ludm9rZUFwaScsIHtcbiAgY29kZTogQ29kZS5mcm9tSW5saW5lKGBcbmNvbnN0IGh0dHBzID0gcmVxdWlyZSgnaHR0cHMnKTtcbmV4cG9ydHMuaGFuZGxlciA9IGFzeW5jIGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICBob3N0bmFtZTogZXZlbnQuaG9zdG5hbWUsXG4gICAgcGF0aDogZXZlbnQucGF0aCxcbiAgfTtcbiAgbGV0IGRhdGFTdHJpbmcgPSAnJztcbiAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3QgcmVxID0gaHR0cHMuZ2V0KG9wdGlvbnMsIChyZXMpID0+IHtcbiAgICAgIHJlcy5vbignZGF0YScsIGRhdGEgPT4ge1xuICAgICAgICBkYXRhU3RyaW5nICs9IGRhdGE7XG4gICAgICB9KVxuICAgICAgcmVzLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgIHN0YXR1c0NvZGU6IHJlcy5zdGF0dXNDb2RlLFxuICAgICAgICAgIGJvZHk6IGRhdGFTdHJpbmcsXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICB9KTtcbiAgICByZXEub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgIHJlamVjdCh7XG4gICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGNhdXNlOiAnU29tZXRoaW5nIHdlbnQgd3JvbmcnLFxuICAgICAgICAgIGVycm9yOiBlcnIsXG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXEuZW5kKCk7XG4gIH0pO1xuICByZXR1cm4gcmVzcG9uc2U7XG59XG5cbmApLFxuICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE2X1gsXG59KTtcblxuY29uc3QgYXBpMUludm9rZSA9IGludGVnLmFzc2VydGlvbnMuaW52b2tlRnVuY3Rpb24oe1xuICBmdW5jdGlvbk5hbWU6IGludm9rZS5mdW5jdGlvbk5hbWUsXG4gIHBheWxvYWQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICBob3N0bmFtZTogZG9tYWluLmRvbWFpbk5hbWUsXG4gICAgcGF0aDogJy9vcmRlcnMvdjEvaXRlbXMnLFxuICB9KSxcbn0pO1xuYXBpMUludm9rZS5leHBlY3QoRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSh7XG4gIFBheWxvYWQ6IE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJzIwMScpLFxufSkpO1xuY29uc3QgYXBpMkludm9rZSA9IGludGVnLmFzc2VydGlvbnMuaW52b2tlRnVuY3Rpb24oe1xuICBmdW5jdGlvbk5hbWU6IGludm9rZS5mdW5jdGlvbk5hbWUsXG4gIHBheWxvYWQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICBob3N0bmFtZTogZG9tYWluLmRvbWFpbk5hbWUsXG4gICAgcGF0aDogJy9vcmRlcnMvdjIvaXRlbXMnLFxuICB9KSxcbn0pO1xuYXBpMkludm9rZS5leHBlY3QoRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSh7XG4gIFBheWxvYWQ6IE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJzIwMicpLFxufSkpO1xuXG5jb25zdCBkb21haW4yYXBpMUludm9rZSA9IGludGVnLmFzc2VydGlvbnMuaW52b2tlRnVuY3Rpb24oe1xuICBmdW5jdGlvbk5hbWU6IGludm9rZS5mdW5jdGlvbk5hbWUsXG4gIHBheWxvYWQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICBob3N0bmFtZTogc2Vjb25kRG9tYWluLmRvbWFpbk5hbWUsXG4gICAgcGF0aDogJy9vcmRlcnMvaXRlbXMnLFxuICB9KSxcbn0pO1xuZG9tYWluMmFwaTFJbnZva2UuZXhwZWN0KEV4cGVjdGVkUmVzdWx0Lm9iamVjdExpa2Uoe1xuICBQYXlsb2FkOiBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCcyMDEnKSxcbn0pKTtcbmNvbnN0IGRvbWFpbjJhcGkySW52b2tlID0gaW50ZWcuYXNzZXJ0aW9ucy5pbnZva2VGdW5jdGlvbih7XG4gIGZ1bmN0aW9uTmFtZTogaW52b2tlLmZ1bmN0aW9uTmFtZSxcbiAgcGF5bG9hZDogSlNPTi5zdHJpbmdpZnkoe1xuICAgIGhvc3RuYW1lOiBzZWNvbmREb21haW4uZG9tYWluTmFtZSxcbiAgICBwYXRoOiAnL29yZGVycy92Mi9pdGVtcycsXG4gIH0pLFxufSk7XG5kb21haW4yYXBpMkludm9rZS5leHBlY3QoRXhwZWN0ZWRSZXN1bHQub2JqZWN0TGlrZSh7XG4gIFBheWxvYWQ6IE1hdGNoLnN0cmluZ0xpa2VSZWdleHAoJzIwMicpLFxufSkpO1xuIl19