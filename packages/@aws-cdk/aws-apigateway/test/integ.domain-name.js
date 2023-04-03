"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_certificatemanager_1 = require("@aws-cdk/aws-certificatemanager");
const aws_lambda_1 = require("@aws-cdk/aws-lambda");
const aws_route53_1 = require("@aws-cdk/aws-route53");
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const constructs_1 = require("constructs");
const apigw = require("../lib");
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
const integ = new integ_tests_1.IntegTest(app, 'domain-name-mapping-test', {
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
api1Invoke.expect(integ_tests_1.ExpectedResult.objectLike({
    Payload: integ_tests_1.Match.stringLikeRegexp('201'),
}));
const api2Invoke = integ.assertions.invokeFunction({
    functionName: invoke.functionName,
    payload: JSON.stringify({
        hostname: domain.domainName,
        path: '/orders/v2/items',
    }),
});
api2Invoke.expect(integ_tests_1.ExpectedResult.objectLike({
    Payload: integ_tests_1.Match.stringLikeRegexp('202'),
}));
const domain2api1Invoke = integ.assertions.invokeFunction({
    functionName: invoke.functionName,
    payload: JSON.stringify({
        hostname: secondDomain.domainName,
        path: '/orders/items',
    }),
});
domain2api1Invoke.expect(integ_tests_1.ExpectedResult.objectLike({
    Payload: integ_tests_1.Match.stringLikeRegexp('201'),
}));
const domain2api2Invoke = integ.assertions.invokeFunction({
    functionName: invoke.functionName,
    payload: JSON.stringify({
        hostname: secondDomain.domainName,
        path: '/orders/v2/items',
    }),
});
domain2api2Invoke.expect(integ_tests_1.ExpectedResult.objectLike({
    Payload: integ_tests_1.Match.stringLikeRegexp('202'),
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZG9tYWluLW5hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5kb21haW4tbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRFQUE4RDtBQUM5RCxvREFBOEQ7QUFDOUQsc0RBQW9EO0FBQ3BELHFDQUFxQztBQUNyQyxzREFJOEI7QUFDOUIsMkNBQXVDO0FBQ3ZDLGdDQUFnQztBQUVoQyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0FBQ2hGLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7QUFDeEYsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUN2RSxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsWUFBWSxFQUFFO0lBQzVDLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0VBQWdFLENBQUMsQ0FBQztDQUNuRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLGlDQUFpQyxDQUFDLENBQUM7QUFPdkUsTUFBTSxHQUFJLFNBQVEsc0JBQVM7SUFHekIsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFlO1FBQ3ZELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFVBQVUsR0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ2xF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ZTtLQUN0QixDQUFDO0NBQ0gsQ0FBQyxDQUFDO0FBQ0gsaUJBQWlCLENBQUMsTUFBTSxDQUFDLDRCQUFjLENBQUMsVUFBVSxDQUFDO0lBQ2pELE9BQU8sRUFBRSxtQkFBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQztDQUN2QyxDQUFDLENBQUMsQ0FBQztBQUNKLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7SUFDeEQsWUFBWSxFQUFFLE1BQU0sQ0FBQyxZQUFZO0lBQ2pDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ3RCLFFBQVEsRUFBRSxZQUFZLENBQUMsVUFBVTtRQUNqQyxJQUFJLEVBQUUsa0JBQWtCO0tBQ3pCLENBQUM7Q0FDSCxDQUFDLENBQUM7QUFDSCxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsNEJBQWMsQ0FBQyxVQUFVLENBQUM7SUFDakQsT0FBTyxFQUFFLG1CQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDO0NBQ3ZDLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2VydGlmaWNhdGUgfSBmcm9tICdAYXdzLWNkay9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJztcbmltcG9ydCB7IEZ1bmN0aW9uLCBDb2RlLCBSdW50aW1lIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBDZm5SZWNvcmRTZXQgfSBmcm9tICdAYXdzLWNkay9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQge1xuICBJbnRlZ1Rlc3QsXG4gIEV4cGVjdGVkUmVzdWx0LFxuICBNYXRjaCxcbn0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBhcGlndyBmcm9tICcuLi9saWInO1xuXG5jb25zdCBkb21haW5OYW1lID0gcHJvY2Vzcy5lbnYuQ0RLX0lOVEVHX0RPTUFJTl9OQU1FIHx8IHByb2Nlc3MuZW52LkRPTUFJTl9OQU1FO1xuY29uc3QgaG9zdGVkWm9uZUlkID0gcHJvY2Vzcy5lbnYuQ0RLX0lOVEVHX0hPU1RFRF9aT05FX0lEIHx8IHByb2Nlc3MuZW52LkhPU1RFRF9aT05FX0lEO1xuY29uc3QgY2VydEFybiA9IHByb2Nlc3MuZW52LkNES19JTlRFR19DRVJUX0FSTiB8fCBwcm9jZXNzLmVudi5DRVJUX0FSTjtcbmlmICghZG9tYWluTmFtZSB8fCAhY2VydEFybiB8fCAhaG9zdGVkWm9uZUlkKSB7XG4gIHRocm93IG5ldyBFcnJvcignRW52IHZhcnMgRE9NQUlOX05BTUUsIEhPU1RFRF9aT05FX0lELCBhbmQgQ0VSVF9BUk4gbXVzdCBiZSBzZXQnKTtcbn1cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEdJVkVOLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCB0ZXN0Q2FzZSA9IG5ldyBjZGsuU3RhY2soYXBwLCAnaW50ZWctYXBpZ3ctZG9tYWluLW5hbWUtbWFwcGluZycpO1xuXG5pbnRlcmZhY2UgQXBpUHJvcHMge1xuICBzdGF0dXNDb2RlOiBzdHJpbmc7XG4gIHBhdGg6IHN0cmluZztcbn1cblxuY2xhc3MgQXBpIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHVibGljIHJlYWRvbmx5IHJlc3RBcGk6IGFwaWd3LklSZXN0QXBpO1xuICBwcml2YXRlIHJlYWRvbmx5IHJlc291cmNlOiBhcGlndy5SZXNvdXJjZTtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEFwaVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcbiAgICB0aGlzLnJlc3RBcGkgPSBuZXcgYXBpZ3cuUmVzdEFwaSh0aGlzLCAnSW50ZWdBcGknK3Byb3BzLnN0YXR1c0NvZGUsIHtcbiAgICAgIGVuZHBvaW50VHlwZXM6IFthcGlndy5FbmRwb2ludFR5cGUuUkVHSU9OQUxdLFxuICAgIH0pO1xuICAgIHRoaXMucmVzb3VyY2UgPSB0aGlzLnJlc3RBcGkucm9vdC5hZGRSZXNvdXJjZShwcm9wcy5wYXRoKTtcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IHRoaXMuY3JlYXRlSW50ZWdyYXRpb24ocHJvcHMuc3RhdHVzQ29kZSk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgIG1ldGhvZFJlc3BvbnNlczogW3tcbiAgICAgICAgc3RhdHVzQ29kZTogcHJvcHMuc3RhdHVzQ29kZSxcbiAgICAgIH1dLFxuICAgIH07XG4gICAgdGhpcy5yZXN0QXBpLnJvb3QuYWRkTWV0aG9kKCdHRVQnLCBpbnRlZ3JhdGlvbiwgb3B0aW9ucyk7XG4gICAgdGhpcy5yZXNvdXJjZS5hZGRNZXRob2QoJ0dFVCcsIGludGVncmF0aW9uLCBvcHRpb25zKTtcbiAgfVxuICBwdWJsaWMgYWRkUmVzb3VyY2UocGF0aDogc3RyaW5nLCBzdGF0dXNDb2RlOiBzdHJpbmcsIHJlc291cmNlPzogYXBpZ3cuUmVzb3VyY2UpOiB2b2lkIHtcbiAgICBjb25zdCBzdWJSZXNvdXJjZSA9IChyZXNvdXJjZSA/PyB0aGlzLnJlc291cmNlKS5hZGRSZXNvdXJjZShwYXRoKTtcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IHRoaXMuY3JlYXRlSW50ZWdyYXRpb24oc3RhdHVzQ29kZSk7XG4gICAgc3ViUmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnLCBpbnRlZ3JhdGlvbiwge1xuICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbeyBzdGF0dXNDb2RlIH1dLFxuICAgIH0pO1xuICB9XG4gIHB1YmxpYyBhZGRSb290UmVzb3VyY2UocGF0aDogc3RyaW5nLCBzdGF0dXNDb2RlOiBzdHJpbmcpOiBhcGlndy5SZXNvdXJjZSB7XG4gICAgY29uc3Qgc3ViUmVzb3VyY2UgPSB0aGlzLnJlc3RBcGkucm9vdC5hZGRSZXNvdXJjZShwYXRoKTtcbiAgICBjb25zdCBpbnRlZ3JhdGlvbiA9IHRoaXMuY3JlYXRlSW50ZWdyYXRpb24oc3RhdHVzQ29kZSk7XG4gICAgc3ViUmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnLCBpbnRlZ3JhdGlvbiwge1xuICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbeyBzdGF0dXNDb2RlIH1dLFxuICAgIH0pO1xuICAgIHJldHVybiBzdWJSZXNvdXJjZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlSW50ZWdyYXRpb24oc3RhdHVzQ29kZTogc3RyaW5nKTogYXBpZ3cuTW9ja0ludGVncmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IGFwaWd3Lk1vY2tJbnRlZ3JhdGlvbih7XG4gICAgICByZXF1ZXN0VGVtcGxhdGVzOiB7ICdhcHBsaWNhdGlvbi9qc29uJzogYHsgc3RhdHVzQ29kZTogJHtOdW1iZXIoc3RhdHVzQ29kZSl9IH1gIH0sXG4gICAgICBpbnRlZ3JhdGlvblJlc3BvbnNlczogW3tcbiAgICAgICAgc3RhdHVzQ29kZTogc3RhdHVzQ29kZSxcbiAgICAgICAgcmVzcG9uc2VUZW1wbGF0ZXM6IHtcbiAgICAgICAgICAnYXBwbGljYXRpb24vanNvbic6IEpTT04uc3RyaW5naWZ5KHsgbWVzc2FnZTogJ0hlbGxvLCB3b3JsZCcgfSksXG4gICAgICAgIH0sXG4gICAgICB9XSxcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gV0hFTiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqL1xuY29uc3QgY2VydGlmaWNhdGUgPSBDZXJ0aWZpY2F0ZS5mcm9tQ2VydGlmaWNhdGVBcm4odGVzdENhc2UsICdDZXJ0JywgY2VydEFybik7XG5jb25zdCBhcGkxID0gbmV3IEFwaSh0ZXN0Q2FzZSwgJ0ludGVnQXBpMScsIHtcbiAgc3RhdHVzQ29kZTogJzIwMScsXG4gIHBhdGg6ICdpdGVtcycsXG59KTtcbmNvbnN0IGFwaTIgPSBuZXcgQXBpKHRlc3RDYXNlLCAnSW50ZWdBcGkyJywge1xuICBzdGF0dXNDb2RlOiAnMjAyJyxcbiAgcGF0aDogJ2l0ZW1zJyxcbn0pO1xuXG5cbi8qKlxuICogVGVzdCAxXG4gKlxuICogQ3JlYXRlIGFuIGluaXRpYWwgQmFzZVBhdGhNYXBwaW5nIGZvciAobm9uZSlcbiAqIFRoZW4gdXNlIGEgbWl4dHVyZSBvZiBgYWRkQmFzZVBhdGhNYXBwaW5nYCBhbmQgYGFkZEFwaU1hcHBpbmdgXG4gKiB0byB0ZXN0IHRoYXQgdGhleSBjYW4gYmUgdXNlZCB0b2dldGhlclxuICovXG5jb25zdCBkb21haW4gPSBuZXcgYXBpZ3cuRG9tYWluTmFtZSh0ZXN0Q2FzZSwgJ0ludGVnRG9tYWluJywge1xuICBkb21haW5OYW1lLFxuICBzZWN1cml0eVBvbGljeTogYXBpZ3cuU2VjdXJpdHlQb2xpY3kuVExTXzFfMixcbiAgY2VydGlmaWNhdGUsXG4gIG1hcHBpbmc6IGFwaTEucmVzdEFwaSxcbn0pO1xubmV3IENmblJlY29yZFNldCh0ZXN0Q2FzZSwgJ0ludGVnRG9tYWluUmVjb3JkJywge1xuICBuYW1lOiBkb21haW5OYW1lLFxuICB0eXBlOiAnQScsXG4gIGhvc3RlZFpvbmVJZCxcbiAgYWxpYXNUYXJnZXQ6IHtcbiAgICBob3N0ZWRab25lSWQ6IGRvbWFpbi5kb21haW5OYW1lQWxpYXNIb3N0ZWRab25lSWQsXG4gICAgZG5zTmFtZTogZG9tYWluLmRvbWFpbk5hbWVBbGlhc0RvbWFpbk5hbWUsXG4gIH0sXG59KTtcbmRvbWFpbi5hZGRCYXNlUGF0aE1hcHBpbmcoYXBpMS5yZXN0QXBpLCB7XG4gIGJhc2VQYXRoOiAnb3JkZXJzJyxcbn0pO1xuZG9tYWluLmFkZEFwaU1hcHBpbmcoYXBpMi5yZXN0QXBpLmRlcGxveW1lbnRTdGFnZSwge1xuICBiYXNlUGF0aDogJ29yZGVycy92MicsXG59KTtcbmRvbWFpbi5hZGRBcGlNYXBwaW5nKGFwaTEucmVzdEFwaS5kZXBsb3ltZW50U3RhZ2UsIHtcbiAgYmFzZVBhdGg6ICdvcmRlcnMvdjEnLFxufSk7XG5cbi8qKlxuICogVGVzdCAyXG4gKlxuICogQ3JlYXRlIGFuIGluaXRpYWwgQmFzZVBhdGhNYXBwaW5nIGZvciAnb3JkZXJzJ1xuICogYW5kIHRoZW4gYWRkIGFuIEFwaU1hcHBpbmcgZm9yIGEgbXVsdGktbGV2ZWwgcGF0aFxuICovXG5jb25zdCBzZWNvbmREb21haW4gPSBuZXcgYXBpZ3cuRG9tYWluTmFtZSh0ZXN0Q2FzZSwgJ0ludGVnMkRvbWFpbicsIHtcbiAgZG9tYWluTmFtZTogYGFub3RoZXItJHtkb21haW5OYW1lfWAsXG4gIHNlY3VyaXR5UG9saWN5OiBhcGlndy5TZWN1cml0eVBvbGljeS5UTFNfMV8yLFxuICBjZXJ0aWZpY2F0ZSxcbiAgbWFwcGluZzogYXBpMS5yZXN0QXBpLFxuICBiYXNlUGF0aDogJ29yZGVycycsXG59KTtcbm5ldyBDZm5SZWNvcmRTZXQodGVzdENhc2UsICdJbnRlZzJEb21haW5SZWNvcmQnLCB7XG4gIG5hbWU6IGBhbm90aGVyLSR7ZG9tYWluTmFtZX1gLFxuICB0eXBlOiAnQScsXG4gIGhvc3RlZFpvbmVJZCxcbiAgYWxpYXNUYXJnZXQ6IHtcbiAgICBob3N0ZWRab25lSWQ6IHNlY29uZERvbWFpbi5kb21haW5OYW1lQWxpYXNIb3N0ZWRab25lSWQsXG4gICAgZG5zTmFtZTogc2Vjb25kRG9tYWluLmRvbWFpbk5hbWVBbGlhc0RvbWFpbk5hbWUsXG4gIH0sXG59KTtcbnNlY29uZERvbWFpbi5hZGRBcGlNYXBwaW5nKGFwaTIucmVzdEFwaS5kZXBsb3ltZW50U3RhZ2UsIHtcbiAgYmFzZVBhdGg6ICdvcmRlcnMvdjInLFxufSk7XG5cblxuLyoqXG4gKiBUZXN0IDNcbiAqXG4gKiBUZXN0IHRoYXQgeW91IGNhbiBjcmVhdGUgYW4gaW5pdGlhbCBCYXNlUGF0aE1hcHBpbmcgKG5vbmUpXG4gKiBhbmQgdGhlbiBhZGQgYWRkaXRpb25hbCBiYXNlIHBhdGggbWFwcGluZ3NcbiAqL1xuY29uc3QgdGhpcmREb21haW4gPSBuZXcgYXBpZ3cuRG9tYWluTmFtZSh0ZXN0Q2FzZSwgJ0ludGVnM0RvbWFpbicsIHtcbiAgZG9tYWluTmFtZTogYHlldC1hbm90aGVyLSR7ZG9tYWluTmFtZX1gLFxuICBzZWN1cml0eVBvbGljeTogYXBpZ3cuU2VjdXJpdHlQb2xpY3kuVExTXzFfMixcbiAgY2VydGlmaWNhdGUsXG4gIG1hcHBpbmc6IGFwaTEucmVzdEFwaSxcbn0pO1xubmV3IENmblJlY29yZFNldCh0ZXN0Q2FzZSwgJ0ludGVnM0RvbWFpblJlY29yZCcsIHtcbiAgbmFtZTogYHlldC1hbm90aGVyLSR7ZG9tYWluTmFtZX1gLFxuICB0eXBlOiAnQScsXG4gIGhvc3RlZFpvbmVJZCxcbiAgYWxpYXNUYXJnZXQ6IHtcbiAgICBob3N0ZWRab25lSWQ6IHRoaXJkRG9tYWluLmRvbWFpbk5hbWVBbGlhc0hvc3RlZFpvbmVJZCxcbiAgICBkbnNOYW1lOiB0aGlyZERvbWFpbi5kb21haW5OYW1lQWxpYXNEb21haW5OYW1lLFxuICB9LFxufSk7XG50aGlyZERvbWFpbi5hZGRCYXNlUGF0aE1hcHBpbmcoYXBpMi5yZXN0QXBpLCB7XG4gIGJhc2VQYXRoOiAndjInLFxufSk7XG5cblxuLyoqXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIFRIRU4gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKi9cbmNvbnN0IGludGVnID0gbmV3IEludGVnVGVzdChhcHAsICdkb21haW4tbmFtZS1tYXBwaW5nLXRlc3QnLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbiAgZW5hYmxlTG9va3VwczogdHJ1ZSxcbn0pO1xuXG5jb25zdCBpbnZva2UgPSBuZXcgRnVuY3Rpb24odGVzdENhc2UsICdJbnZva2VBcGknLCB7XG4gIGNvZGU6IENvZGUuZnJvbUlubGluZShgXG5jb25zdCBodHRwcyA9IHJlcXVpcmUoJ2h0dHBzJyk7XG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyBmdW5jdGlvbihldmVudCkge1xuICBjb25zb2xlLmxvZyhldmVudCk7XG4gIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgaG9zdG5hbWU6IGV2ZW50Lmhvc3RuYW1lLFxuICAgIHBhdGg6IGV2ZW50LnBhdGgsXG4gIH07XG4gIGxldCBkYXRhU3RyaW5nID0gJyc7XG4gIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHJlcSA9IGh0dHBzLmdldChvcHRpb25zLCAocmVzKSA9PiB7XG4gICAgICByZXMub24oJ2RhdGEnLCBkYXRhID0+IHtcbiAgICAgICAgZGF0YVN0cmluZyArPSBkYXRhO1xuICAgICAgfSlcbiAgICAgIHJlcy5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiByZXMuc3RhdHVzQ29kZSxcbiAgICAgICAgICBib2R5OiBkYXRhU3RyaW5nLFxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgfSk7XG4gICAgcmVxLm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICByZWplY3Qoe1xuICAgICAgICBzdGF0dXNDb2RlOiA1MDAsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBjYXVzZTogJ1NvbWV0aGluZyB3ZW50IHdyb25nJyxcbiAgICAgICAgICBlcnJvcjogZXJyLFxuICAgICAgICB9KVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmVxLmVuZCgpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3BvbnNlO1xufVxuXG5gKSxcbiAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xNl9YLFxufSk7XG5cbmNvbnN0IGFwaTFJbnZva2UgPSBpbnRlZy5hc3NlcnRpb25zLmludm9rZUZ1bmN0aW9uKHtcbiAgZnVuY3Rpb25OYW1lOiBpbnZva2UuZnVuY3Rpb25OYW1lLFxuICBwYXlsb2FkOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgaG9zdG5hbWU6IGRvbWFpbi5kb21haW5OYW1lLFxuICAgIHBhdGg6ICcvb3JkZXJzL3YxL2l0ZW1zJyxcbiAgfSksXG59KTtcbmFwaTFJbnZva2UuZXhwZWN0KEV4cGVjdGVkUmVzdWx0Lm9iamVjdExpa2Uoe1xuICBQYXlsb2FkOiBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCcyMDEnKSxcbn0pKTtcbmNvbnN0IGFwaTJJbnZva2UgPSBpbnRlZy5hc3NlcnRpb25zLmludm9rZUZ1bmN0aW9uKHtcbiAgZnVuY3Rpb25OYW1lOiBpbnZva2UuZnVuY3Rpb25OYW1lLFxuICBwYXlsb2FkOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgaG9zdG5hbWU6IGRvbWFpbi5kb21haW5OYW1lLFxuICAgIHBhdGg6ICcvb3JkZXJzL3YyL2l0ZW1zJyxcbiAgfSksXG59KTtcbmFwaTJJbnZva2UuZXhwZWN0KEV4cGVjdGVkUmVzdWx0Lm9iamVjdExpa2Uoe1xuICBQYXlsb2FkOiBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCcyMDInKSxcbn0pKTtcblxuY29uc3QgZG9tYWluMmFwaTFJbnZva2UgPSBpbnRlZy5hc3NlcnRpb25zLmludm9rZUZ1bmN0aW9uKHtcbiAgZnVuY3Rpb25OYW1lOiBpbnZva2UuZnVuY3Rpb25OYW1lLFxuICBwYXlsb2FkOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgaG9zdG5hbWU6IHNlY29uZERvbWFpbi5kb21haW5OYW1lLFxuICAgIHBhdGg6ICcvb3JkZXJzL2l0ZW1zJyxcbiAgfSksXG59KTtcbmRvbWFpbjJhcGkxSW52b2tlLmV4cGVjdChFeHBlY3RlZFJlc3VsdC5vYmplY3RMaWtlKHtcbiAgUGF5bG9hZDogTWF0Y2guc3RyaW5nTGlrZVJlZ2V4cCgnMjAxJyksXG59KSk7XG5jb25zdCBkb21haW4yYXBpMkludm9rZSA9IGludGVnLmFzc2VydGlvbnMuaW52b2tlRnVuY3Rpb24oe1xuICBmdW5jdGlvbk5hbWU6IGludm9rZS5mdW5jdGlvbk5hbWUsXG4gIHBheWxvYWQ6IEpTT04uc3RyaW5naWZ5KHtcbiAgICBob3N0bmFtZTogc2Vjb25kRG9tYWluLmRvbWFpbk5hbWUsXG4gICAgcGF0aDogJy9vcmRlcnMvdjIvaXRlbXMnLFxuICB9KSxcbn0pO1xuZG9tYWluMmFwaTJJbnZva2UuZXhwZWN0KEV4cGVjdGVkUmVzdWx0Lm9iamVjdExpa2Uoe1xuICBQYXlsb2FkOiBNYXRjaC5zdHJpbmdMaWtlUmVnZXhwKCcyMDInKSxcbn0pKTtcbiJdfQ==