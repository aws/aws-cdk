"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestStack = void 0;
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const apigateway = require("../lib");
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
new integ_tests_1.IntegTest(app, 'base-path-mapping', {
    testCases: [testStack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYmFzZS1wYXRoLW1hcHBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5iYXNlLXBhdGgtbWFwcGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBcUM7QUFDckMsc0RBQWlEO0FBQ2pELHFDQUFxQztBQUVyQyxNQUFhLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUN0QyxZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxPQUFPLEdBQUcsSUFBSSxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVwRCxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU5QixNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7WUFDaEYsVUFBVSxFQUFFLFlBQVk7WUFDeEIsMkJBQTJCLEVBQUUsNkJBQTZCO1lBQzFELHFCQUFxQixFQUFFLHVCQUF1QjtTQUMvQyxDQUFDLENBQUM7UUFFSCxJQUFJLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNqRCxVQUFVO1lBQ1YsT0FBTztTQUNSLENBQUMsQ0FBQztRQUVILElBQUksVUFBVSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFO1lBQ2pELFVBQVU7WUFDVixPQUFPO1lBQ1AsUUFBUSxFQUFFLE1BQU07WUFDaEIsYUFBYSxFQUFFLEtBQUs7U0FDckIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxVQUFVLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDbkQsVUFBVTtZQUNWLE9BQU87WUFDUCxRQUFRLEVBQUUseUJBQXlCO1lBQ25DLGFBQWEsRUFBRSxLQUFLO1NBQ3JCLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFqQ0QsOEJBaUNDO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBRW5ELElBQUksdUJBQVMsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLEVBQUU7SUFDdEMsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDO0NBQ3ZCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCAqIGFzIGFwaWdhdGV3YXkgZnJvbSAnLi4vbGliJztcblxuZXhwb3J0IGNsYXNzIFRlc3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHJlc3RBcGkgPSBuZXcgYXBpZ2F0ZXdheS5SZXN0QXBpKHRoaXMsICdBcGknKTtcblxuICAgIHJlc3RBcGkucm9vdC5hZGRNZXRob2QoJ0dFVCcpO1xuXG4gICAgY29uc3QgZG9tYWluTmFtZSA9IGFwaWdhdGV3YXkuRG9tYWluTmFtZS5mcm9tRG9tYWluTmFtZUF0dHJpYnV0ZXModGhpcywgJ0RvbWFpbicsIHtcbiAgICAgIGRvbWFpbk5hbWU6ICdkb21haW5OYW1lJyxcbiAgICAgIGRvbWFpbk5hbWVBbGlhc0hvc3RlZFpvbmVJZDogJ2RvbWFpbk5hbWVBbGlhc0hvc3RlZFpvbmVJZCcsXG4gICAgICBkb21haW5OYW1lQWxpYXNUYXJnZXQ6ICdkb21haW5OYW1lQWxpYXNUYXJnZXQnLFxuICAgIH0pO1xuXG4gICAgbmV3IGFwaWdhdGV3YXkuQmFzZVBhdGhNYXBwaW5nKHRoaXMsICdNYXBwaW5nT25lJywge1xuICAgICAgZG9tYWluTmFtZSxcbiAgICAgIHJlc3RBcGksXG4gICAgfSk7XG5cbiAgICBuZXcgYXBpZ2F0ZXdheS5CYXNlUGF0aE1hcHBpbmcodGhpcywgJ01hcHBpbmdUd28nLCB7XG4gICAgICBkb21haW5OYW1lLFxuICAgICAgcmVzdEFwaSxcbiAgICAgIGJhc2VQYXRoOiAncGF0aCcsXG4gICAgICBhdHRhY2hUb1N0YWdlOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIG5ldyBhcGlnYXRld2F5LkJhc2VQYXRoTWFwcGluZyh0aGlzLCAnTWFwcGluZ1RocmVlJywge1xuICAgICAgZG9tYWluTmFtZSxcbiAgICAgIHJlc3RBcGksXG4gICAgICBiYXNlUGF0aDogJ2FwaS92MS9tdWx0aS1sZXZlbC1wYXRoJyxcbiAgICAgIGF0dGFjaFRvU3RhZ2U6IGZhbHNlLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHRlc3RTdGFjayA9IG5ldyBUZXN0U3RhY2soYXBwLCAndGVzdC1zdGFjaycpO1xuXG5uZXcgSW50ZWdUZXN0KGFwcCwgJ2Jhc2UtcGF0aC1tYXBwaW5nJywge1xuICB0ZXN0Q2FzZXM6IFt0ZXN0U3RhY2tdLFxufSk7XG4iXX0=