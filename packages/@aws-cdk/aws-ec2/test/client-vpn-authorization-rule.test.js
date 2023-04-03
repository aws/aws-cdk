"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
const client_vpn_authorization_rule_1 = require("../lib/client-vpn-authorization-rule");
let stack;
beforeEach(() => {
    const app = new core_1.App({
        context: {
            '@aws-cdk/core:newStyleStackSynthesis': false,
        },
    });
    stack = new core_1.Stack(app);
});
describe('ClientVpnAuthorizationRule constructor', () => {
    test('normal usage', () => {
        const clientVpnEndpoint = {
            endpointId: 'myClientVpnEndpoint',
            targetNetworksAssociated: [],
            stack,
            env: { account: 'myAccount', region: 'us-east-1' },
            connections: new lib_1.Connections(),
            node: stack.node,
            applyRemovalPolicy: () => { },
        };
        new client_vpn_authorization_rule_1.ClientVpnAuthorizationRule(stack, 'NormalRule', {
            cidr: '10.0.10.0/32',
            clientVpnEndpoint,
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnAuthorizationRule', 1);
        expect(stack.node.children.length).toBe(1);
    });
    test('either clientVpnEndoint (deprecated, typo) or clientVpnEndpoint is required', () => {
        expect(() => {
            new client_vpn_authorization_rule_1.ClientVpnAuthorizationRule(stack, 'RuleNoEndointNoEndpoint', {
                cidr: '10.0.10.0/32',
            });
        }).toThrow(new Error('ClientVpnAuthorizationRule: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified'));
    });
    (0, cdk_build_tools_1.testDeprecated)('specifying both clientVpnEndoint (deprecated, typo) and clientVpnEndpoint is not allowed', () => {
        const clientVpnEndoint = {
            endpointId: 'typoTypo',
            targetNetworksAssociated: [],
            stack,
            env: { account: 'myAccount', region: 'us-east-1' },
            connections: new lib_1.Connections(),
            node: stack.node,
            applyRemovalPolicy: () => { },
        };
        const clientVpnEndpoint = {
            endpointId: 'myClientVpnEndpoint',
            targetNetworksAssociated: [],
            stack,
            env: { account: 'myAccount', region: 'us-east-1' },
            connections: new lib_1.Connections(),
            node: stack.node,
            applyRemovalPolicy: () => { },
        };
        expect(() => {
            new client_vpn_authorization_rule_1.ClientVpnAuthorizationRule(stack, 'RuleBothEndointAndEndpoint', {
                cidr: '10.0.10.0/32',
                clientVpnEndoint,
                clientVpnEndpoint,
            });
        }).toThrow(new Error('ClientVpnAuthorizationRule: either clientVpnEndpoint or clientVpnEndoint (deprecated) must be specified' +
            ', but not both'));
    });
    test('invalid constructor calls should not add anything to the stack', () => {
        expect(() => {
            new client_vpn_authorization_rule_1.ClientVpnAuthorizationRule(stack, 'RuleNoEndointNoEndpoint', {
                cidr: '10.0.10.0/32',
            });
        }).toThrow();
        expect(stack.node.children.length).toBe(0);
    });
    (0, cdk_build_tools_1.testDeprecated)('supplying clientVpnEndoint (deprecated due to typo) should still work', () => {
        const clientVpnEndoint = {
            endpointId: 'myClientVpnEndpoint',
            targetNetworksAssociated: [],
            stack,
            env: { account: 'myAccount', region: 'us-east-1' },
            connections: new lib_1.Connections(),
            node: stack.node,
            applyRemovalPolicy: () => { },
        };
        new client_vpn_authorization_rule_1.ClientVpnAuthorizationRule(stack, 'RuleWithEndointTypo', {
            cidr: '10.0.10.0/32',
            clientVpnEndoint,
        });
        assertions_1.Template.fromStack(stack).resourceCountIs('AWS::EC2::ClientVpnAuthorizationRule', 1);
        expect(stack.node.children.length).toBe(1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LXZwbi1hdXRob3JpemF0aW9uLXJ1bGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsaWVudC12cG4tYXV0aG9yaXphdGlvbi1ydWxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsOERBQTBEO0FBQzFELHdDQUEyQztBQUMzQyxnQ0FBeUQ7QUFDekQsd0ZBQWtGO0FBRWxGLElBQUksS0FBWSxDQUFDO0FBQ2pCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsQ0FBQztRQUNsQixPQUFPLEVBQUU7WUFDUCxzQ0FBc0MsRUFBRSxLQUFLO1NBQzlDO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtJQUN0RCxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUN4QixNQUFNLGlCQUFpQixHQUF1QjtZQUM1QyxVQUFVLEVBQUUscUJBQXFCO1lBQ2pDLHdCQUF3QixFQUFFLEVBQUU7WUFDNUIsS0FBSztZQUNMLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTtZQUNsRCxXQUFXLEVBQUUsSUFBSSxpQkFBVyxFQUFFO1lBQzlCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixrQkFBa0IsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1NBQzlCLENBQUM7UUFDRixJQUFJLDBEQUEwQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDbEQsSUFBSSxFQUFFLGNBQWM7WUFDcEIsaUJBQWlCO1NBQ2xCLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQyxzQ0FBc0Ms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QjtTQUNqQixDQUFDLENBQUM7UUFDSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxlQUFlLENBQUMsc0NBQXNDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDckYsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCB7IEFwcCwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbm5lY3Rpb25zLCBJQ2xpZW50VnBuRW5kcG9pbnQgfSBmcm9tICcuLi9saWInO1xuaW1wb3J0IHsgQ2xpZW50VnBuQXV0aG9yaXphdGlvblJ1bGUgfSBmcm9tICcuLi9saWIvY2xpZW50LXZwbi1hdXRob3JpemF0aW9uLXJ1bGUnO1xuXG5sZXQgc3RhY2s6IFN0YWNrO1xuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgIGNvbnRleHQ6IHtcbiAgICAgICdAYXdzLWNkay9jb3JlOm5ld1N0eWxlU3RhY2tTeW50aGVzaXMnOiBmYWxzZSxcbiAgICB9LFxuICB9KTtcbiAgc3RhY2sgPSBuZXcgU3RhY2soYXBwKTtcbn0pO1xuXG5kZXNjcmliZSgnQ2xpZW50VnBuQXV0aG9yaXphdGlvblJ1bGUgY29uc3RydWN0b3InLCAoKSA9PiB7XG4gIHRlc3QoJ25vcm1hbCB1c2FnZScsICgpID0+IHtcbiAgICBjb25zdCBjbGllbnRWcG5FbmRwb2ludDogSUNsaWVudFZwbkVuZHBvaW50ID0ge1xuICAgICAgZW5kcG9pbnRJZDogJ215Q2xpZW50VnBuRW5kcG9pbnQnLFxuICAgICAgdGFyZ2V0TmV0d29ya3NBc3NvY2lhdGVkOiBbXSxcbiAgICAgIHN0YWNrLFxuICAgICAgZW52OiB7IGFjY291bnQ6ICdteUFjY291bnQnLCByZWdpb246ICd1cy1lYXN0LTEnIH0sXG4gICAgICBjb25uZWN0aW9uczogbmV3IENvbm5lY3Rpb25zKCksXG4gICAgICBub2RlOiBzdGFjay5ub2RlLFxuICAgICAgYXBwbHlSZW1vdmFsUG9saWN5OiAoKSA9PiB7IH0sXG4gICAgfTtcbiAgICBuZXcgQ2xpZW50VnBuQXV0aG9yaXphdGlvblJ1bGUoc3RhY2ssICdOb3JtYWxSdWxlJywge1xuICAgICAgY2lkcjogJzEwLjAuMTAuMC8zMicsXG4gICAgICBjbGllbnRWcG5FbmRwb2ludCxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OkNsaWVudFZwbkF1dGhvcml6YXRpb25SdWxlJywgMSk7XG4gICAgZXhwZWN0KHN0YWNrLm5vZGUuY2hpbGRyZW4ubGVuZ3RoKS50b0JlKDEpO1xuICB9KTtcbiAgdGVzdCgnZWl0aGVyIGNsaWVudFZwbkVuZG9pbnQgKGRlcHJlY2F0ZWQsIHR5cG8pIG9yIGNsaWVudFZwbkVuZHBvaW50IGlzIHJlcXVpcmVkJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQ2xpZW50VnBuQXV0aG9yaXphdGlvblJ1bGUoc3RhY2ssICdSdWxlTm9FbmRvaW50Tm9FbmRwb2ludCcsIHtcbiAgICAgICAgY2lkcjogJzEwLjAuMTAuMC8zMicsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KFxuICAgICAgbmV3IEVycm9yKFxuICAgICAgICAnQ2xpZW50VnBuQXV0aG9yaXphdGlvblJ1bGU6IGVpdGhlciBjbGllbnRWcG5FbmRwb2ludCBvciBjbGllbnRWcG5FbmRvaW50IChkZXByZWNhdGVkKSBtdXN0IGJlIHNwZWNpZmllZCcsXG4gICAgICApLFxuICAgICk7XG4gIH0pO1xuICB0ZXN0RGVwcmVjYXRlZCgnc3BlY2lmeWluZyBib3RoIGNsaWVudFZwbkVuZG9pbnQgKGRlcHJlY2F0ZWQsIHR5cG8pIGFuZCBjbGllbnRWcG5FbmRwb2ludCBpcyBub3QgYWxsb3dlZCcsICgpID0+IHtcbiAgICBjb25zdCBjbGllbnRWcG5FbmRvaW50OiBJQ2xpZW50VnBuRW5kcG9pbnQgPSB7XG4gICAgICBlbmRwb2ludElkOiAndHlwb1R5cG8nLFxuICAgICAgdGFyZ2V0TmV0d29ya3NBc3NvY2lhdGVkOiBbXSxcbiAgICAgIHN0YWNrLFxuICAgICAgZW52OiB7IGFjY291bnQ6ICdteUFjY291bnQnLCByZWdpb246ICd1cy1lYXN0LTEnIH0sXG4gICAgICBjb25uZWN0aW9uczogbmV3IENvbm5lY3Rpb25zKCksXG4gICAgICBub2RlOiBzdGFjay5ub2RlLFxuICAgICAgYXBwbHlSZW1vdmFsUG9saWN5OiAoKSA9PiB7IH0sXG4gICAgfTtcbiAgICBjb25zdCBjbGllbnRWcG5FbmRwb2ludDogSUNsaWVudFZwbkVuZHBvaW50ID0ge1xuICAgICAgZW5kcG9pbnRJZDogJ215Q2xpZW50VnBuRW5kcG9pbnQnLFxuICAgICAgdGFyZ2V0TmV0d29ya3NBc3NvY2lhdGVkOiBbXSxcbiAgICAgIHN0YWNrLFxuICAgICAgZW52OiB7IGFjY291bnQ6ICdteUFjY291bnQnLCByZWdpb246ICd1cy1lYXN0LTEnIH0sXG4gICAgICBjb25uZWN0aW9uczogbmV3IENvbm5lY3Rpb25zKCksXG4gICAgICBub2RlOiBzdGFjay5ub2RlLFxuICAgICAgYXBwbHlSZW1vdmFsUG9saWN5OiAoKSA9PiB7IH0sXG4gICAgfTtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgbmV3IENsaWVudFZwbkF1dGhvcml6YXRpb25SdWxlKHN0YWNrLCAnUnVsZUJvdGhFbmRvaW50QW5kRW5kcG9pbnQnLCB7XG4gICAgICAgIGNpZHI6ICcxMC4wLjEwLjAvMzInLFxuICAgICAgICBjbGllbnRWcG5FbmRvaW50LFxuICAgICAgICBjbGllbnRWcG5FbmRwb2ludCxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coXG4gICAgICBuZXcgRXJyb3IoXG4gICAgICAgICdDbGllbnRWcG5BdXRob3JpemF0aW9uUnVsZTogZWl0aGVyIGNsaWVudFZwbkVuZHBvaW50IG9yIGNsaWVudFZwbkVuZG9pbnQgKGRlcHJlY2F0ZWQpIG11c3QgYmUgc3BlY2lmaWVkJyArXG4gICAgICAgICAgJywgYnV0IG5vdCBib3RoJyxcbiAgICAgICksXG4gICAgKTtcbiAgfSk7XG4gIHRlc3QoJ2ludmFsaWQgY29uc3RydWN0b3IgY2FsbHMgc2hvdWxkIG5vdCBhZGQgYW55dGhpbmcgdG8gdGhlIHN0YWNrJywgKCkgPT4ge1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQ2xpZW50VnBuQXV0aG9yaXphdGlvblJ1bGUoc3RhY2ssICdSdWxlTm9FbmRvaW50Tm9FbmRwb2ludCcsIHtcbiAgICAgICAgY2lkcjogJzEwLjAuMTAuMC8zMicsXG4gICAgICB9KTtcbiAgICB9KS50b1Rocm93KCk7XG4gICAgZXhwZWN0KHN0YWNrLm5vZGUuY2hpbGRyZW4ubGVuZ3RoKS50b0JlKDApO1xuICB9KTtcbiAgdGVzdERlcHJlY2F0ZWQoJ3N1cHBseWluZyBjbGllbnRWcG5FbmRvaW50IChkZXByZWNhdGVkIGR1ZSB0byB0eXBvKSBzaG91bGQgc3RpbGwgd29yaycsICgpID0+IHtcbiAgICBjb25zdCBjbGllbnRWcG5FbmRvaW50OiBJQ2xpZW50VnBuRW5kcG9pbnQgPSB7XG4gICAgICBlbmRwb2ludElkOiAnbXlDbGllbnRWcG5FbmRwb2ludCcsXG4gICAgICB0YXJnZXROZXR3b3Jrc0Fzc29jaWF0ZWQ6IFtdLFxuICAgICAgc3RhY2ssXG4gICAgICBlbnY6IHsgYWNjb3VudDogJ215QWNjb3VudCcsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICAgIGNvbm5lY3Rpb25zOiBuZXcgQ29ubmVjdGlvbnMoKSxcbiAgICAgIG5vZGU6IHN0YWNrLm5vZGUsXG4gICAgICBhcHBseVJlbW92YWxQb2xpY3k6ICgpID0+IHsgfSxcbiAgICB9O1xuICAgIG5ldyBDbGllbnRWcG5BdXRob3JpemF0aW9uUnVsZShzdGFjaywgJ1J1bGVXaXRoRW5kb2ludFR5cG8nLCB7XG4gICAgICBjaWRyOiAnMTAuMC4xMC4wLzMyJyxcbiAgICAgIGNsaWVudFZwbkVuZG9pbnQsXG4gICAgfSk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5yZXNvdXJjZUNvdW50SXMoJ0FXUzo6RUMyOjpDbGllbnRWcG5BdXRob3JpemF0aW9uUnVsZScsIDEpO1xuICAgIGV4cGVjdChzdGFjay5ub2RlLmNoaWxkcmVuLmxlbmd0aCkudG9CZSgxKTtcbiAgfSk7XG59KTtcbiJdfQ==