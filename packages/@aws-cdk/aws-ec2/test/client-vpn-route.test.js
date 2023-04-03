"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const ec2 = require("../lib");
const lib_1 = require("../lib");
let stack;
let vpc;
beforeEach(() => {
    const app = new core_1.App({
        context: {
            '@aws-cdk/core:newStyleStackSynthesis': false,
        },
    });
    stack = new core_1.Stack(app);
    vpc = new ec2.Vpc(stack, 'Vpc');
});
describe('ClientVpnRoute constructor', () => {
    test('normal usage', () => {
        const samlProvider = new aws_iam_1.SamlProvider(stack, 'Provider', {
            metadataDocument: aws_iam_1.SamlMetadataDocument.fromXml('xml'),
        });
        const clientVpnEndpoint = vpc.addClientVpnEndpoint('Endpoint', {
            cidr: '10.100.0.0/16',
            serverCertificateArn: 'server-certificate-arn',
            clientCertificateArn: 'client-certificate-arn',
            clientConnectionHandler: {
                functionArn: 'function-arn',
                functionName: 'AWSClientVPN-function-name',
            },
            dnsServers: ['8.8.8.8', '8.8.4.4'],
            userBasedAuthentication: lib_1.ClientVpnUserBasedAuthentication.federated(samlProvider),
        });
        new lib_1.ClientVpnRoute(stack, 'NormalRoute', {
            clientVpnEndpoint,
            cidr: '0.0.0.0/0',
            target: lib_1.ClientVpnRouteTarget.local(),
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnEndpoint', 1);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnRoute', 1);
        expect(stack.node.children.length).toBe(3);
    });
    (0, cdk_build_tools_1.testDeprecated)('either clientVpnEndoint (deprecated, typo) or clientVpnEndpoint is required', () => {
        expect(() => {
            new lib_1.ClientVpnRoute(stack, 'RouteNoEndointOrEndpoint', {
                cidr: '0.0.0.0/0',
                target: lib_1.ClientVpnRouteTarget.local(),
            });
        }).toThrow(new Error('ClientVpnRoute: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified'));
    });
    (0, cdk_build_tools_1.testDeprecated)('specifying both clientVpnEndoint (deprecated, typo) and clientVpnEndpoint is not allowed', () => {
        const samlProvider = new aws_iam_1.SamlProvider(stack, 'Provider', {
            metadataDocument: aws_iam_1.SamlMetadataDocument.fromXml('xml'),
        });
        const clientVpnEndpoint = vpc.addClientVpnEndpoint('Endpoint', {
            cidr: '10.100.0.0/16',
            serverCertificateArn: 'server-certificate-arn',
            clientCertificateArn: 'client-certificate-arn',
            clientConnectionHandler: {
                functionArn: 'function-arn',
                functionName: 'AWSClientVPN-function-name',
            },
            dnsServers: ['8.8.8.8', '8.8.4.4'],
            userBasedAuthentication: lib_1.ClientVpnUserBasedAuthentication.federated(samlProvider),
        });
        const clientVpnEndoint = clientVpnEndpoint;
        expect(() => {
            new lib_1.ClientVpnRoute(stack, 'RouteBothEndointAndEndpoint', {
                clientVpnEndoint,
                clientVpnEndpoint,
                cidr: '0.0.0.0/0',
                target: lib_1.ClientVpnRouteTarget.local(),
            });
        }).toThrow(new Error('ClientVpnRoute: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified' +
            ', but not both'));
    });
    test('invalid constructor calls should not add anything to the stack', () => {
        expect(() => {
            new lib_1.ClientVpnRoute(stack, 'RouteNoEndointOrEndpoint', {
                cidr: '0.0.0.0/0',
                target: lib_1.ClientVpnRouteTarget.local(),
            });
        }).toThrow();
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
        expect(stack.node.children.length).toBe(1);
    });
    (0, cdk_build_tools_1.testDeprecated)('supplying clientVpnEndoint (deprecated due to typo) should still work', () => {
        const samlProvider = new aws_iam_1.SamlProvider(stack, 'Provider', {
            metadataDocument: aws_iam_1.SamlMetadataDocument.fromXml('xml'),
        });
        const clientVpnEndoint = vpc.addClientVpnEndpoint('Endpoint', {
            cidr: '10.100.0.0/16',
            serverCertificateArn: 'server-certificate-arn',
            clientCertificateArn: 'client-certificate-arn',
            clientConnectionHandler: {
                functionArn: 'function-arn',
                functionName: 'AWSClientVPN-function-name',
            },
            dnsServers: ['8.8.8.8', '8.8.4.4'],
            userBasedAuthentication: lib_1.ClientVpnUserBasedAuthentication.federated(samlProvider),
        });
        new lib_1.ClientVpnRoute(stack, 'RouteWithEndointTypo', {
            clientVpnEndoint,
            cidr: '0.0.0.0/0',
            target: lib_1.ClientVpnRouteTarget.local(),
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::VPC', 1);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnEndpoint', 1);
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnRoute', 1);
        expect(stack.node.children.length).toBe(3);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LXZwbi1yb3V0ZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpZW50LXZwbi1yb3V0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLDhDQUFzRTtBQUN0RSw4REFBMEQ7QUFDMUQsd0NBQTJDO0FBQzNDLDhCQUE4QjtBQUM5QixnQ0FJZ0I7QUFFaEIsSUFBSSxLQUFZLENBQUM7QUFDakIsSUFBSSxHQUFhLENBQUM7QUFDbEIsVUFBVSxDQUFDLEdBQUcsRUFBRTtJQUNkLE1BQU0sR0FBRyxHQUFHLElBQUksVUFBRyxDQUFDO1FBQ2xCLE9BQU8sRUFBRTtZQUNQLHNDQUFzQyxFQUFFLEtBQUs7U0FDOUM7S0FDRixDQUFDLENBQUM7SUFDSCxLQUFLLEdBQUcsSUFBSSxZQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdkIsR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRLENBQUMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFO0lBQzFDLElBQUksQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO1FBQ3hCLE1BQU0sWUFBWSxHQUFHLElBQUksc0JBQVksQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1lBQ3ZELGdCQUFnQixFQUFFLDhCQUFvQixDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7U0FDdEQsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsb0JBQW9CLENBQUMsVUFBVSxFQUFFO1lBQzdELElBQUksRUFBRSxlQUFlO1lBQ3JCLG9CQUFvQixFQUFFLHdCQUF3QjtZQUM5QyxvQkFBb0IsRUFBRSx3QkFBd0I7WUFDOUMsdUJBQXVCLEVBQUU7Z0JBQ3ZCLFdBQVcsRUFBRSxjQUFjO2dCQUMzQixZQUFZLEVBQUUsNEJBQTRCO2FBQzNDO1lBQ0QsVUFBVSxF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QkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUMsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDNUUscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsZUFBZSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTYW1sTWV0YWRhdGFEb2N1bWVudCwgU2FtbFByb3ZpZGVyIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyB0ZXN0RGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnLi4vbGliJztcbmltcG9ydCB7XG4gIENsaWVudFZwblJvdXRlLFxuICBDbGllbnRWcG5Sb3V0ZVRhcmdldCxcbiAgQ2xpZW50VnBuVXNlckJhc2VkQXV0aGVudGljYXRpb24sXG59IGZyb20gJy4uL2xpYic7XG5cbmxldCBzdGFjazogU3RhY2s7XG5sZXQgdnBjOiBlYzIuSVZwYztcbmJlZm9yZUVhY2goKCkgPT4ge1xuICBjb25zdCBhcHAgPSBuZXcgQXBwKHtcbiAgICBjb250ZXh0OiB7XG4gICAgICAnQGF3cy1jZGsvY29yZTpuZXdTdHlsZVN0YWNrU3ludGhlc2lzJzogZmFsc2UsXG4gICAgfSxcbiAgfSk7XG4gIHN0YWNrID0gbmV3IFN0YWNrKGFwcCk7XG4gIHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG59KTtcblxuZGVzY3JpYmUoJ0NsaWVudFZwblJvdXRlIGNvbnN0cnVjdG9yJywgKCkgPT4ge1xuICB0ZXN0KCdub3JtYWwgdXNhZ2UnLCAoKSA9PiB7XG4gICAgY29uc3Qgc2FtbFByb3ZpZGVyID0gbmV3IFNhbWxQcm92aWRlcihzdGFjaywgJ1Byb3ZpZGVyJywge1xuICAgICAgbWV0YWRhdGFEb2N1bWVudDogU2FtbE1ldGFkYXRhRG9jdW1lbnQuZnJvbVhtbCgneG1sJyksXG4gICAgfSk7XG4gICAgY29uc3QgY2xpZW50VnBuRW5kcG9pbnQgPSB2cGMuYWRkQ2xpZW50VnBuRW5kcG9pbnQoJ0VuZHBvaW50Jywge1xuICAgICAgY2lkcjogJzEwLjEwMC4wLjAvMTYnLFxuICAgICAgc2VydmVyQ2VydGlmaWNhdGVBcm46ICdzZXJ2ZXItY2VydGlmaWNhdGUtYXJuJyxcbiAgICAgIGNsaWVudENlcnRpZmljYXRlQXJuOiAnY2xpZW50LWNlcnRpZmljYXRlLWFybicsXG4gICAgICBjbGllbnRDb25uZWN0aW9uSGFuZGxlcjoge1xuICAgICAgICBmdW5jdGlvbkFybjogJ2Z1bmN0aW9uLWFybicsXG4gICAgICAgIGZ1bmN0aW9uTmFtZTogJ0FXU0NsaWVudFZQTi1mdW5jdGlvbi1uYW1lJyxcbiAgICAgIH0sXG4gICAgICBkbnNTZXJ2ZXJzOiBbJzguOC44LjgnLCAnOC44LjQuNCddLFxuICAgICAgdXNlckJhc2VkQXV0aGVudGljYXRpb246IENsaWVudFZwblVzZXJCYXNlZEF1dGhlbnRpY2F0aW9uLmZlZGVyYXRlZChzYW1sUHJvdmlkZXIpLFxuICAgIH0pO1xuICAgIG5ldyBDbGllbnRWcG5Sb3V0ZShzdGFjaywgJ05vcm1hbFJvdXRlJywge1xuICAgICAgY2xpZW50VnBuRW5kcG9pbnQsXG4gICAgICBjaWRyOiAnMC4wLjAuMC8wJyxcbiAgICAgIHRhcmdldDogQ2xpZW50VnBuUm91dGVUYXJnZXQubG9jYWwoKSxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OlZQQycsIDEpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6Q2xpZW50VnBuRW5kcG9pbnQnLCAxKTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OkNsaWVudFZwblJvdXRlJywgMSk7XG4gICAgZXhwZWN0KHN0YWNrLm5vZGUuY2hpbGRyZW4ubGVuZ3RoKS50b0JlKDMpO1xuICB9KTtcbiAgdGVzdERlcHJlY2F0ZWQoJ2VpdGhlciBjbGllbnRWcG5FbmRvaW50IChkZXByZWNhdGVkLCB0eXBvKSBvciBjbGllbnRWcG5FbmRwb2ludCBpcyByZXF1aXJlZCcsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IENsaWVudFZwblJvdXRlKHN0YWNrLCAnUm91dGVOb0VuZG9pbnRPckVuZHBvaW50Jywge1xuICAgICAgICBjaWRyOiAnMC4wLjAuMC8wJyxcbiAgICAgICAgdGFyZ2V0OiBDbGllbnRWcG5Sb3V0ZVRhcmdldC5sb2NhbCgpLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdyhcbiAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgJ0NsaWVudFZwblJvdXRlOiBlaXRoZXIgY2xpZW50VnBuRW5kcG9pbnQgb3IgY2xpZW50VnBuRW5kb2ludCAoZGVwcmVjYXRlZCkgbXVzdCBiZSBzcGVjaWZpZWQnLFxuICAgICAgKSxcbiAgICApO1xuICB9KTtcbiAgdGVzdERlcHJlY2F0ZWQoJ3NwZWNpZnlpbmcgYm90aCBjbGllbnRWcG5FbmRvaW50IChkZXByZWNhdGVkLCB0eXBvKSBhbmQgY2xpZW50VnBuRW5kcG9pbnQgaXMgbm90IGFsbG93ZWQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc2FtbFByb3ZpZGVyID0gbmV3IFNhbWxQcm92aWRlcihzdGFjaywgJ1Byb3ZpZGVyJywge1xuICAgICAgbWV0YWRhdGFEb2N1bWVudDogU2FtbE1ldGFkYXRhRG9jdW1lbnQuZnJvbVhtbCgneG1sJyksXG4gICAgfSk7XG4gICAgY29uc3QgY2xpZW50VnBuRW5kcG9pbnQgPSB2cGMuYWRkQ2xpZW50VnBuRW5kcG9pbnQoJ0VuZHBvaW50Jywge1xuICAgICAgY2lkcjogJzEwLjEwMC4wLjAvMTYnLFxuICAgICAgc2VydmVyQ2VydGlmaWNhdGVBcm46ICdzZXJ2ZXItY2VydGlmaWNhdGUtYXJuJyxcbiAgICAgIGNsaWVudENlcnRpZmljYXRlQXJuOiAnY2xpZW50LWNlcnRpZmljYXRlLWFybicsXG4gICAgICBjbGllbnRDb25uZWN0aW9uSGFuZGxlcjoge1xuICAgICAgICBmdW5jdGlvbkFybjogJ2Z1bmN0aW9uLWFybicsXG4gICAgICAgIGZ1bmN0aW9uTmFtZTogJ0FXU0NsaWVudFZQTi1mdW5jdGlvbi1uYW1lJyxcbiAgICAgIH0sXG4gICAgICBkbnNTZXJ2ZXJzOiBbJzguOC44LjgnLCAnOC44LjQuNCddLFxuICAgICAgdXNlckJhc2VkQXV0aGVudGljYXRpb246IENsaWVudFZwblVzZXJCYXNlZEF1dGhlbnRpY2F0aW9uLmZlZGVyYXRlZChzYW1sUHJvdmlkZXIpLFxuICAgIH0pO1xuICAgIGNvbnN0IGNsaWVudFZwbkVuZG9pbnQgPSBjbGllbnRWcG5FbmRwb2ludDtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IENsaWVudFZwblJvdXRlKHN0YWNrLCAnUm91dGVCb3RoRW5kb2ludEFuZEVuZHBvaW50Jywge1xuICAgICAgICBjbGllbnRWcG5FbmRvaW50LFxuICAgICAgICBjbGllbnRWcG5FbmRwb2ludCxcbiAgICAgICAgY2lkcjogJzAuMC4wLjAvMCcsXG4gICAgICAgIHRhcmdldDogQ2xpZW50VnBuUm91dGVUYXJnZXQubG9jYWwoKSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coXG4gICAgICBuZXcgRXJyb3IoXG4gICAgICAgICdDbGllbnRWcG5Sb3V0ZTogZWl0aGVyIGNsaWVudFZwbkVuZHBvaW50IG9yIGNsaWVudFZwbkVuZG9pbnQgKGRlcHJlY2F0ZWQpIG11c3QgYmUgc3BlY2lmaWVkJyArXG4gICAgICAgICAgJywgYnV0IG5vdCBib3RoJyxcbiAgICAgICksXG4gICAgKTtcbiAgfSk7XG4gIHRlc3QoJ2ludmFsaWQgY29uc3RydWN0b3IgY2FsbHMgc2hvdWxkIG5vdCBhZGQgYW55dGhpbmcgdG8gdGhlIHN0YWNrJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQ2xpZW50VnBuUm91dGUoc3RhY2ssICdSb3V0ZU5vRW5kb2ludE9yRW5kcG9pbnQnLCB7XG4gICAgICAgIGNpZHI6ICcwLjAuMC4wLzAnLFxuICAgICAgICB0YXJnZXQ6IENsaWVudFZwblJvdXRlVGFyZ2V0LmxvY2FsKCksXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpWUEMnLCAxKTtcbiAgICBleHBlY3Qoc3RhY2subm9kZS5jaGlsZHJlbi5sZW5ndGgpLnRvQmUoMSk7XG4gIH0pO1xuICB0ZXN0RGVwcmVjYXRlZCgnc3VwcGx5aW5nIGNsaWVudFZwbkVuZG9pbnQgKGRlcHJlY2F0ZWQgZHVlIHRvIHR5cG8pIHNob3VsZCBzdGlsbCB3b3JrJywgKCkgPT4ge1xuICAgIGNvbnN0IHNhbWxQcm92aWRlciA9IG5ldyBTYW1sUHJvdmlkZXIoc3RhY2ssICdQcm92aWRlcicsIHtcbiAgICAgIG1ldGFkYXRhRG9jdW1lbnQ6IFNhbWxNZXRhZGF0YURvY3VtZW50LmZyb21YbWwoJ3htbCcpLFxuICAgIH0pO1xuICAgIGNvbnN0IGNsaWVudFZwbkVuZG9pbnQgPSB2cGMuYWRkQ2xpZW50VnBuRW5kcG9pbnQoJ0VuZHBvaW50Jywge1xuICAgICAgY2lkcjogJzEwLjEwMC4wLjAvMTYnLFxuICAgICAgc2VydmVyQ2VydGlmaWNhdGVBcm46ICdzZXJ2ZXItY2VydGlmaWNhdGUtYXJuJyxcbiAgICAgIGNsaWVudENlcnRpZmljYXRlQXJuOiAnY2xpZW50LWNlcnRpZmljYXRlLWFybicsXG4gICAgICBjbGllbnRDb25uZWN0aW9uSGFuZGxlcjoge1xuICAgICAgICBmdW5jdGlvbkFybjogJ2Z1bmN0aW9uLWFybicsXG4gICAgICAgIGZ1bmN0aW9uTmFtZTogJ0FXU0NsaWVudFZQTi1mdW5jdGlvbi1uYW1lJyxcbiAgICAgIH0sXG4gICAgICBkbnNTZXJ2ZXJzOiBbJzguOC44LjgnLCAnOC44LjQuNCddLFxuICAgICAgdXNlckJhc2VkQXV0aGVudGljYXRpb246IENsaWVudFZwblVzZXJCYXNlZEF1dGhlbnRpY2F0aW9uLmZlZGVyYXRlZChzYW1sUHJvdmlkZXIpLFxuICAgIH0pO1xuICAgIG5ldyBDbGllbnRWcG5Sb3V0ZShzdGFjaywgJ1JvdXRlV2l0aEVuZG9pbnRUeXBvJywge1xuICAgICAgY2xpZW50VnBuRW5kb2ludCxcbiAgICAgIGNpZHI6ICcwLjAuMC4wLzAnLFxuICAgICAgdGFyZ2V0OiBDbGllbnRWcG5Sb3V0ZVRhcmdldC5sb2NhbCgpLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6VlBDJywgMSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpDbGllbnRWcG5FbmRwb2ludCcsIDEpO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6Q2xpZW50VnBuUm91dGUnLCAxKTtcbiAgICBleHBlY3Qoc3RhY2subm9kZS5jaGlsZHJlbi5sZW5ndGgpLnRvQmUoMyk7XG4gIH0pO1xufSk7XG4iXX0=