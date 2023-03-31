"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestStack = void 0;
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const apigateway = require("aws-cdk-lib/aws-apigateway");
class TestStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        const restApi = new apigateway.RestApi(this, 'Api');
        restApi.root.addMethod('GET');
        const domainName = apigateway.DomainName.fromDomainNameAttributes(this, 'Domain', {
            domainName: 'domainName',
            domainNameAliasHostedZoneId: 'domainNameAliasHostedZoneId',
            domainNameAliasTarget: 'domainNameAliasTarget',
        });
        new apigateway.BasePathMapping(this, 'MappingOne', {
            domainName,
            restApi,
        });
        new apigateway.BasePathMapping(this, 'MappingTwo', {
            domainName,
            restApi,
            basePath: 'path',
            attachToStage: false,
        });
        new apigateway.BasePathMapping(this, 'MappingThree', {
            domainName,
            restApi,
            basePath: 'api/v1/multi-level-path',
            attachToStage: false,
        });
    }
}
exports.TestStack = TestStack;
const app = new cdk.App();
const testStack = new TestStack(app, 'test-stack');
new integ_tests_alpha_1.IntegTest(app, 'base-path-mapping', {
    testCases: [testStack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYmFzZS1wYXRoLW1hcHBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5iYXNlLXBhdGgtbWFwcGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtQ0FBbUM7QUFDbkMsa0VBQXVEO0FBQ3ZELHlEQUF5RDtBQUV6RCxNQUFhLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN0QyxZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxPQUFPLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVwRCxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU5QixNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDaEYsVUFBVSxFQUFFLFlBQVk7WUFDeEIsMkJBQTJCLEVBQUUsNkJBQTZCO1lBQzFELHFCQUFxQixFQUFFLHVCQUF1QjtTQUMvQyxDQUFDLENBQUM7UUFFSCxJQUFJLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNqRCxVQUFVO1lBQ1YsT0FBTztTQUNSLENBQUMsQ0FBQztRQUVILElBQUksVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2pELFVBQVU7WUFDVixPQUFPO1lBQ1AsUUFBUSxFQUFFLE1BQU07WUFDaEIsYUFBYSxFQUFFLEtBQUs7U0FDckIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDbkQsVUFBVTtZQUNWLE9BQU87WUFDUCxRQUFRLEVBQUUseUJBQXlCO1lBQ25DLGFBQWEsRUFBRSxLQUFLO1NBQ3JCLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQWpDRCw4QkFpQ0M7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsWUFBWSxDQUFDLENBQUM7QUFFbkQsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSxtQkFBbUIsRUFBRTtJQUN0QyxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUM7Q0FDdkIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuXG5leHBvcnQgY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgcmVzdEFwaSA9IG5ldyBhcGlnYXRld2F5LlJlc3RBcGkodGhpcywgJ0FwaScpO1xuXG4gICAgcmVzdEFwaS5yb290LmFkZE1ldGhvZCgnR0VUJyk7XG5cbiAgICBjb25zdCBkb21haW5OYW1lID0gYXBpZ2F0ZXdheS5Eb21haW5OYW1lLmZyb21Eb21haW5OYW1lQXR0cmlidXRlcyh0aGlzLCAnRG9tYWluJywge1xuICAgICAgZG9tYWluTmFtZTogJ2RvbWFpbk5hbWUnLFxuICAgICAgZG9tYWluTmFtZUFsaWFzSG9zdGVkWm9uZUlkOiAnZG9tYWluTmFtZUFsaWFzSG9zdGVkWm9uZUlkJyxcbiAgICAgIGRvbWFpbk5hbWVBbGlhc1RhcmdldDogJ2RvbWFpbk5hbWVBbGlhc1RhcmdldCcsXG4gICAgfSk7XG5cbiAgICBuZXcgYXBpZ2F0ZXdheS5CYXNlUGF0aE1hcHBpbmcodGhpcywgJ01hcHBpbmdPbmUnLCB7XG4gICAgICBkb21haW5OYW1lLFxuICAgICAgcmVzdEFwaSxcbiAgICB9KTtcblxuICAgIG5ldyBhcGlnYXRld2F5LkJhc2VQYXRoTWFwcGluZyh0aGlzLCAnTWFwcGluZ1R3bycsIHtcbiAgICAgIGRvbWFpbk5hbWUsXG4gICAgICByZXN0QXBpLFxuICAgICAgYmFzZVBhdGg6ICdwYXRoJyxcbiAgICAgIGF0dGFjaFRvU3RhZ2U6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwaWdhdGV3YXkuQmFzZVBhdGhNYXBwaW5nKHRoaXMsICdNYXBwaW5nVGhyZWUnLCB7XG4gICAgICBkb21haW5OYW1lLFxuICAgICAgcmVzdEFwaSxcbiAgICAgIGJhc2VQYXRoOiAnYXBpL3YxL211bHRpLWxldmVsLXBhdGgnLFxuICAgICAgYXR0YWNoVG9TdGFnZTogZmFsc2UsXG4gICAgfSk7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3QgdGVzdFN0YWNrID0gbmV3IFRlc3RTdGFjayhhcHAsICd0ZXN0LXN0YWNrJyk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnYmFzZS1wYXRoLW1hcHBpbmcnLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RTdGFja10sXG59KTtcbiJdfQ==