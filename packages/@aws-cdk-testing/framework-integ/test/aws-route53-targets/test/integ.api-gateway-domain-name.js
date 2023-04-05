#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apig = require("aws-cdk-lib/aws-apigateway");
const acm = require("aws-cdk-lib/aws-certificatemanager");
const lambda = require("aws-cdk-lib/aws-lambda");
const route53 = require("aws-cdk-lib/aws-route53");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const targets = require("aws-cdk-lib/aws-route53-targets");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id) {
        super(scope, id);
        const domainName = 'example.com';
        const certArn = 'arn:aws:acm:us-east-1:111111111111:certificate';
        const hostedZoneId = 'AAAAAAAAAAAAA';
        const handler = new lambda.Function(this, 'Handler', {
            code: lambda.Code.fromInline(`exports.handler = async () => {
        return {
          statusCode: '200',
          body: 'hello, world!'
        };
      };`),
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'index.handler',
        });
        const certificate = acm.Certificate.fromCertificateArn(this, 'cert', certArn);
        const api = new apig.LambdaRestApi(this, 'api', {
            cloudWatchRole: true,
            handler,
            domainName: {
                certificate,
                domainName,
                endpointType: apig.EndpointType.REGIONAL,
            },
        });
        const zone = route53.HostedZone.fromHostedZoneAttributes(this, 'hosted-zone', {
            zoneName: domainName,
            hostedZoneId,
        });
        new route53.ARecord(this, 'Alias', {
            zone,
            target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api)),
        });
    }
}
const app = new aws_cdk_lib_1.App();
const testCase = new TestStack(app, 'aws-cdk-apigw-alias-integ');
new integ_tests_alpha_1.IntegTest(app, 'apigateway-domain-name', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXBpLWdhdGV3YXktZG9tYWluLW5hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5hcGktZ2F0ZXdheS1kb21haW4tbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxtREFBbUQ7QUFDbkQsMERBQTBEO0FBQzFELGlEQUFpRDtBQUNqRCxtREFBbUQ7QUFDbkQsNkNBQXlDO0FBQ3pDLGtFQUF1RDtBQUV2RCwyREFBMkQ7QUFFM0QsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVU7UUFDdEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUM7UUFDakMsTUFBTSxPQUFPLEdBQUcsZ0RBQWdELENBQUM7UUFDakUsTUFBTSxZQUFZLEdBQUcsZUFBZSxDQUFDO1FBRXJDLE1BQU0sT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ25ELElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQzs7Ozs7U0FLMUIsQ0FBQztZQUNKLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVc7WUFDbkMsT0FBTyxFQUFFLGVBQWU7U0FDekIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTlFLE1BQU0sR0FBRyxHQUFHLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQzlDLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLE9BQU87WUFDUCxVQUFVLEVBQUU7Z0JBQ1YsV0FBVztnQkFDWCxVQUFVO2dCQUNWLFlBQVksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVE7YUFDekM7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7WUFDNUUsUUFBUSxFQUFFLFVBQVU7WUFDcEIsWUFBWTtTQUNiLENBQUMsQ0FBQztRQUVILElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1lBQ2pDLElBQUk7WUFDSixNQUFNLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BFLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksaUJBQUcsRUFBRSxDQUFDO0FBQ3RCLE1BQU0sUUFBUSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO0FBQ2pFLElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsd0JBQXdCLEVBQUU7SUFDM0MsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAqIGFzIGFwaWcgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuaW1wb3J0ICogYXMgYWNtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXInO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0ICogYXMgcm91dGU1MyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1yb3V0ZTUzLXRhcmdldHMnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgZG9tYWluTmFtZSA9ICdleGFtcGxlLmNvbSc7XG4gICAgY29uc3QgY2VydEFybiA9ICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6MTExMTExMTExMTExOmNlcnRpZmljYXRlJztcbiAgICBjb25zdCBob3N0ZWRab25lSWQgPSAnQUFBQUFBQUFBQUFBQSc7XG5cbiAgICBjb25zdCBoYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnSGFuZGxlcicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoYGV4cG9ydHMuaGFuZGxlciA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgICAgICBib2R5OiAnaGVsbG8sIHdvcmxkISdcbiAgICAgICAgfTtcbiAgICAgIH07YCksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNlcnRpZmljYXRlID0gYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybih0aGlzLCAnY2VydCcsIGNlcnRBcm4pO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWcuTGFtYmRhUmVzdEFwaSh0aGlzLCAnYXBpJywge1xuICAgICAgY2xvdWRXYXRjaFJvbGU6IHRydWUsXG4gICAgICBoYW5kbGVyLFxuICAgICAgZG9tYWluTmFtZToge1xuICAgICAgICBjZXJ0aWZpY2F0ZSxcbiAgICAgICAgZG9tYWluTmFtZSxcbiAgICAgICAgZW5kcG9pbnRUeXBlOiBhcGlnLkVuZHBvaW50VHlwZS5SRUdJT05BTCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCB6b25lID0gcm91dGU1My5Ib3N0ZWRab25lLmZyb21Ib3N0ZWRab25lQXR0cmlidXRlcyh0aGlzLCAnaG9zdGVkLXpvbmUnLCB7XG4gICAgICB6b25lTmFtZTogZG9tYWluTmFtZSxcbiAgICAgIGhvc3RlZFpvbmVJZCxcbiAgICB9KTtcblxuICAgIG5ldyByb3V0ZTUzLkFSZWNvcmQodGhpcywgJ0FsaWFzJywge1xuICAgICAgem9uZSxcbiAgICAgIHRhcmdldDogcm91dGU1My5SZWNvcmRUYXJnZXQuZnJvbUFsaWFzKG5ldyB0YXJnZXRzLkFwaUdhdGV3YXkoYXBpKSksXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgVGVzdFN0YWNrKGFwcCwgJ2F3cy1jZGstYXBpZ3ctYWxpYXMtaW50ZWcnKTtcbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnYXBpZ2F0ZXdheS1kb21haW4tbmFtZScsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxufSk7XG4iXX0=