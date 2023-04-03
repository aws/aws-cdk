#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apig = require("@aws-cdk/aws-apigateway");
const acm = require("@aws-cdk/aws-certificatemanager");
const lambda = require("@aws-cdk/aws-lambda");
const route53 = require("@aws-cdk/aws-route53");
const core_1 = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const targets = require("../lib");
class TestStack extends core_1.Stack {
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
const app = new core_1.App();
const testCase = new TestStack(app, 'aws-cdk-apigw-alias-integ');
new integ_tests_1.IntegTest(app, 'apigateway-domain-name', {
    testCases: [testCase],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXBpLWdhdGV3YXktZG9tYWluLW5hbWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5hcGktZ2F0ZXdheS1kb21haW4tbmFtZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxnREFBZ0Q7QUFDaEQsdURBQXVEO0FBQ3ZELDhDQUE4QztBQUM5QyxnREFBZ0Q7QUFDaEQsd0NBQTJDO0FBQzNDLHNEQUFpRDtBQUVqRCxrQ0FBa0M7QUFFbEMsTUFBTSxTQUFVLFNBQVEsWUFBSztJQUMzQixZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQztRQUNqQyxNQUFNLE9BQU8sR0FBRyxnREFBZ0QsQ0FBQztRQUNqRSxNQUFNLFlBQVksR0FBRyxlQUFlLENBQUM7UUFFckMsTUFBTSxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDbkQsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDOzs7OztTQUsxQixDQUFDO1lBQ0osT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxPQUFPLEVBQUUsZUFBZTtTQUN6QixDQUFDLENBQUM7UUFFSCxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFOUUsTUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7WUFDOUMsY0FBYyxFQUFFLElBQUk7WUFDcEIsT0FBTztZQUNQLFVBQVUsRUFBRTtnQkFDVixXQUFXO2dCQUNYLFVBQVU7Z0JBQ1YsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUTthQUN6QztTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsd0JBQXdCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUM1RSxRQUFRLEVBQUUsVUFBVTtZQUNwQixZQUFZO1NBQ2IsQ0FBQyxDQUFDO1FBRUgsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7WUFDakMsSUFBSTtZQUNKLE1BQU0sRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDcEUsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxFQUFFLENBQUM7QUFDdEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLENBQUM7QUFDakUsSUFBSSx1QkFBUyxDQUFDLEdBQUcsRUFBRSx3QkFBd0IsRUFBRTtJQUMzQyxTQUFTLEVBQUUsQ0FBQyxRQUFRLENBQUM7Q0FDdEIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgYXBpZyBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgKiBhcyBhY20gZnJvbSAnQGF3cy1jZGsvYXdzLWNlcnRpZmljYXRlbWFuYWdlcic7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgdGFyZ2V0cyBmcm9tICcuLi9saWInO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgZG9tYWluTmFtZSA9ICdleGFtcGxlLmNvbSc7XG4gICAgY29uc3QgY2VydEFybiA9ICdhcm46YXdzOmFjbTp1cy1lYXN0LTE6MTExMTExMTExMTExOmNlcnRpZmljYXRlJztcbiAgICBjb25zdCBob3N0ZWRab25lSWQgPSAnQUFBQUFBQUFBQUFBQSc7XG5cbiAgICBjb25zdCBoYW5kbGVyID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnSGFuZGxlcicsIHtcbiAgICAgIGNvZGU6IGxhbWJkYS5Db2RlLmZyb21JbmxpbmUoYGV4cG9ydHMuaGFuZGxlciA9IGFzeW5jICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgICAgICBib2R5OiAnaGVsbG8sIHdvcmxkISdcbiAgICAgICAgfTtcbiAgICAgIH07YCksXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5OT0RFSlNfMTRfWCxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICB9KTtcblxuICAgIGNvbnN0IGNlcnRpZmljYXRlID0gYWNtLkNlcnRpZmljYXRlLmZyb21DZXJ0aWZpY2F0ZUFybih0aGlzLCAnY2VydCcsIGNlcnRBcm4pO1xuXG4gICAgY29uc3QgYXBpID0gbmV3IGFwaWcuTGFtYmRhUmVzdEFwaSh0aGlzLCAnYXBpJywge1xuICAgICAgY2xvdWRXYXRjaFJvbGU6IHRydWUsXG4gICAgICBoYW5kbGVyLFxuICAgICAgZG9tYWluTmFtZToge1xuICAgICAgICBjZXJ0aWZpY2F0ZSxcbiAgICAgICAgZG9tYWluTmFtZSxcbiAgICAgICAgZW5kcG9pbnRUeXBlOiBhcGlnLkVuZHBvaW50VHlwZS5SRUdJT05BTCxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCB6b25lID0gcm91dGU1My5Ib3N0ZWRab25lLmZyb21Ib3N0ZWRab25lQXR0cmlidXRlcyh0aGlzLCAnaG9zdGVkLXpvbmUnLCB7XG4gICAgICB6b25lTmFtZTogZG9tYWluTmFtZSxcbiAgICAgIGhvc3RlZFpvbmVJZCxcbiAgICB9KTtcblxuICAgIG5ldyByb3V0ZTUzLkFSZWNvcmQodGhpcywgJ0FsaWFzJywge1xuICAgICAgem9uZSxcbiAgICAgIHRhcmdldDogcm91dGU1My5SZWNvcmRUYXJnZXQuZnJvbUFsaWFzKG5ldyB0YXJnZXRzLkFwaUdhdGV3YXkoYXBpKSksXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuY29uc3QgdGVzdENhc2UgPSBuZXcgVGVzdFN0YWNrKGFwcCwgJ2F3cy1jZGstYXBpZ3ctYWxpYXMtaW50ZWcnKTtcbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnYXBpZ2F0ZXdheS1kb21haW4tbmFtZScsIHtcbiAgdGVzdENhc2VzOiBbdGVzdENhc2VdLFxufSk7XG4iXX0=