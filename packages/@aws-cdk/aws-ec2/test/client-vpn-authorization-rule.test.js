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
    cdk_build_tools_1.testDeprecated('specifying both clientVpnEndoint (deprecated, typo) and clientVpnEndpoint is not allowed', () => {
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
    cdk_build_tools_1.testDeprecated('supplying clientVpnEndoint (deprecated due to typo) should still work', () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LXZwbi1hdXRob3JpemF0aW9uLXJ1bGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsaWVudC12cG4tYXV0aG9yaXphdGlvbi1ydWxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MsOERBQTBEO0FBQzFELHdDQUEyQztBQUMzQyxnQ0FBeUQ7QUFDekQsd0ZBQWtGO0FBRWxGLElBQUksS0FBWSxDQUFDO0FBQ2pCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxNQUFNLEdBQUcsR0FBRyxJQUFJLFVBQUcsQ0FBQztRQUNsQixPQUFPLEVBQUU7WUFDUCxzQ0FBc0MsRUFBRSxLQUFLO1NBQzlDO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLENBQUMsQ0FBQyxDQUFDO0FBRUgsUUFBUSxDQUFDLHdDQUF3QyxFQUFFLEdBQUcsRUFBRTtJQUN0RCxJQUFJLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRTtRQUN4QixNQUFNLGlCQUFpQixHQUF1QjtZQUM1QyxVQUFVLEVBQUUscUJBQXFCO1lBQ2pDLHdCQUF3QixFQUFFLEVBQUU7WUFDNUIsS0FBSztZQUNMLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRTtZQUNsRCxXQUFXLEVBQUUsSUFBSSxpQkFBVyxFQUFFO1lBQzlCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixrQkFBa0IsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1NBQzlCLENBQUM7UUFDRixJQUFJLDBEQUEwQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7WUFDbEQsSUFBSSxFQUFFLGNBQWM7WUFDcEIsaUJBQWlCO1NBQ2xCLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQyxzQ0FBc0MsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxDQUFDLDZFQUE2RSxFQUFFLEdBQUcsRUFBRTtRQUN2RixNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1YsSUFBSSwwREFBMEIsQ0FBQyxLQUFLLEVBQUUseUJBQXlCLEVBQUU7Z0JBQy9ELElBQUksRUFBRSxjQUFjO2FBQ3JCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDUixJQUFJLEtBQUssQ0FDUCx5R0FBeUcsQ0FDMUcsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSCxnQ0FBYyxDQUFDLDBGQUEwRixFQUFFLEdBQUcsRUFBRTtRQUM5RyxNQUFNLGdCQUFnQixHQUF1QjtZQUMzQyxVQUFVLEVBQUUsVUFBVTtZQUN0Qix3QkFBd0IsRUFBRSxFQUFFO1lBQzVCLEtBQUs7WUFDTCxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7WUFDbEQsV0FBVyxFQUFFLElBQUksaUJBQVcsRUFBRTtZQUM5QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUM5QixDQUFDO1FBQ0YsTUFBTSxpQkFBaUIsR0FBdUI7WUFDNUMsVUFBVSxFQUFFLHFCQUFxQjtZQUNqQyx3QkFBd0IsRUFBRSxFQUFFO1lBQzVCLEtBQUs7WUFDTCxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7WUFDbEQsV0FBVyxFQUFFLElBQUksaUJBQVcsRUFBRTtZQUM5QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUM5QixDQUFDO1FBQ0YsTUFBTSxDQUFDLEdBQUcsRUFBRTtZQUNWLElBQUksMERBQTBCLENBQUMsS0FBSyxFQUFFLDRCQUE0QixFQUFFO2dCQUNsRSxJQUFJLEVBQUUsY0FBYztnQkFDcEIsZ0JBQWdCO2dCQUNoQixpQkFBaUI7YUFDbEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUNSLElBQUksS0FBSyxDQUNQLHlHQUF5RztZQUN2RyxnQkFBZ0IsQ0FDbkIsQ0FDRixDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7SUFDSCxJQUFJLENBQUMsZ0VBQWdFLEVBQUUsR0FBRyxFQUFFO1FBQzFFLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDVixJQUFJLDBEQUEwQixDQUFDLEtBQUssRUFBRSx5QkFBeUIsRUFBRTtnQkFDL0QsSUFBSSxFQUFFLGNBQWM7YUFDckIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDYixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsZ0NBQWMsQ0FBQyx1RUFBdUUsRUFBRSxHQUFHLEVBQUU7UUFDM0YsTUFBTSxnQkFBZ0IsR0FBdUI7WUFDM0MsVUFBVSxFQUFFLHFCQUFxQjtZQUNqQyx3QkFBd0IsRUFBRSxFQUFFO1lBQzVCLEtBQUs7WUFDTCxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUU7WUFDbEQsV0FBVyxFQUFFLElBQUksaUJBQVcsRUFBRTtZQUM5QixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7WUFDaEIsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztTQUM5QixDQUFDO1FBQ0YsSUFBSSwwREFBMEIsQ0FBQyxLQUFLLEVBQUUscUJBQXFCLEVBQUU7WUFDM0QsSUFBSSxFQUFFLGNBQWM7WUFDcEIsZ0JBQWdCO1NBQ2pCLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLGVBQWUsQ0FBQyxzQ0FBc0MsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNyRixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgdGVzdERlcHJlY2F0ZWQgfSBmcm9tICdAYXdzLWNkay9jZGstYnVpbGQtdG9vbHMnO1xuaW1wb3J0IHsgQXBwLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29ubmVjdGlvbnMsIElDbGllbnRWcG5FbmRwb2ludCB9IGZyb20gJy4uL2xpYic7XG5pbXBvcnQgeyBDbGllbnRWcG5BdXRob3JpemF0aW9uUnVsZSB9IGZyb20gJy4uL2xpYi9jbGllbnQtdnBuLWF1dGhvcml6YXRpb24tcnVsZSc7XG5cbmxldCBzdGFjazogU3RhY2s7XG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IEFwcCh7XG4gICAgY29udGV4dDoge1xuICAgICAgJ0Bhd3MtY2RrL2NvcmU6bmV3U3R5bGVTdGFja1N5bnRoZXNpcyc6IGZhbHNlLFxuICAgIH0sXG4gIH0pO1xuICBzdGFjayA9IG5ldyBTdGFjayhhcHApO1xufSk7XG5cbmRlc2NyaWJlKCdDbGllbnRWcG5BdXRob3JpemF0aW9uUnVsZSBjb25zdHJ1Y3RvcicsICgpID0+IHtcbiAgdGVzdCgnbm9ybWFsIHVzYWdlJywgKCkgPT4ge1xuICAgIGNvbnN0IGNsaWVudFZwbkVuZHBvaW50OiBJQ2xpZW50VnBuRW5kcG9pbnQgPSB7XG4gICAgICBlbmRwb2ludElkOiAnbXlDbGllbnRWcG5FbmRwb2ludCcsXG4gICAgICB0YXJnZXROZXR3b3Jrc0Fzc29jaWF0ZWQ6IFtdLFxuICAgICAgc3RhY2ssXG4gICAgICBlbnY6IHsgYWNjb3VudDogJ215QWNjb3VudCcsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICAgIGNvbm5lY3Rpb25zOiBuZXcgQ29ubmVjdGlvbnMoKSxcbiAgICAgIG5vZGU6IHN0YWNrLm5vZGUsXG4gICAgICBhcHBseVJlbW92YWxQb2xpY3k6ICgpID0+IHsgfSxcbiAgICB9O1xuICAgIG5ldyBDbGllbnRWcG5BdXRob3JpemF0aW9uUnVsZShzdGFjaywgJ05vcm1hbFJ1bGUnLCB7XG4gICAgICBjaWRyOiAnMTAuMC4xMC4wLzMyJyxcbiAgICAgIGNsaWVudFZwbkVuZHBvaW50LFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykucmVzb3VyY2VDb3VudElzKCdBV1M6OkVDMjo6Q2xpZW50VnBuQXV0aG9yaXphdGlvblJ1bGUnLCAxKTtcbiAgICBleHBlY3Qoc3RhY2subm9kZS5jaGlsZHJlbi5sZW5ndGgpLnRvQmUoMSk7XG4gIH0pO1xuICB0ZXN0KCdlaXRoZXIgY2xpZW50VnBuRW5kb2ludCAoZGVwcmVjYXRlZCwgdHlwbykgb3IgY2xpZW50VnBuRW5kcG9pbnQgaXMgcmVxdWlyZWQnLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBDbGllbnRWcG5BdXRob3JpemF0aW9uUnVsZShzdGFjaywgJ1J1bGVOb0VuZG9pbnROb0VuZHBvaW50Jywge1xuICAgICAgICBjaWRyOiAnMTAuMC4xMC4wLzMyJyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coXG4gICAgICBuZXcgRXJyb3IoXG4gICAgICAgICdDbGllbnRWcG5BdXRob3JpemF0aW9uUnVsZTogZWl0aGVyIGNsaWVudFZwbkVuZHBvaW50IG9yIGNsaWVudFZwbkVuZG9pbnQgKGRlcHJlY2F0ZWQpIG11c3QgYmUgc3BlY2lmaWVkJyxcbiAgICAgICksXG4gICAgKTtcbiAgfSk7XG4gIHRlc3REZXByZWNhdGVkKCdzcGVjaWZ5aW5nIGJvdGggY2xpZW50VnBuRW5kb2ludCAoZGVwcmVjYXRlZCwgdHlwbykgYW5kIGNsaWVudFZwbkVuZHBvaW50IGlzIG5vdCBhbGxvd2VkJywgKCkgPT4ge1xuICAgIGNvbnN0IGNsaWVudFZwbkVuZG9pbnQ6IElDbGllbnRWcG5FbmRwb2ludCA9IHtcbiAgICAgIGVuZHBvaW50SWQ6ICd0eXBvVHlwbycsXG4gICAgICB0YXJnZXROZXR3b3Jrc0Fzc29jaWF0ZWQ6IFtdLFxuICAgICAgc3RhY2ssXG4gICAgICBlbnY6IHsgYWNjb3VudDogJ215QWNjb3VudCcsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICAgIGNvbm5lY3Rpb25zOiBuZXcgQ29ubmVjdGlvbnMoKSxcbiAgICAgIG5vZGU6IHN0YWNrLm5vZGUsXG4gICAgICBhcHBseVJlbW92YWxQb2xpY3k6ICgpID0+IHsgfSxcbiAgICB9O1xuICAgIGNvbnN0IGNsaWVudFZwbkVuZHBvaW50OiBJQ2xpZW50VnBuRW5kcG9pbnQgPSB7XG4gICAgICBlbmRwb2ludElkOiAnbXlDbGllbnRWcG5FbmRwb2ludCcsXG4gICAgICB0YXJnZXROZXR3b3Jrc0Fzc29jaWF0ZWQ6IFtdLFxuICAgICAgc3RhY2ssXG4gICAgICBlbnY6IHsgYWNjb3VudDogJ215QWNjb3VudCcsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICAgIGNvbm5lY3Rpb25zOiBuZXcgQ29ubmVjdGlvbnMoKSxcbiAgICAgIG5vZGU6IHN0YWNrLm5vZGUsXG4gICAgICBhcHBseVJlbW92YWxQb2xpY3k6ICgpID0+IHsgfSxcbiAgICB9O1xuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBuZXcgQ2xpZW50VnBuQXV0aG9yaXphdGlvblJ1bGUoc3RhY2ssICdSdWxlQm90aEVuZG9pbnRBbmRFbmRwb2ludCcsIHtcbiAgICAgICAgY2lkcjogJzEwLjAuMTAuMC8zMicsXG4gICAgICAgIGNsaWVudFZwbkVuZG9pbnQsXG4gICAgICAgIGNsaWVudFZwbkVuZHBvaW50LFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdyhcbiAgICAgIG5ldyBFcnJvcihcbiAgICAgICAgJ0NsaWVudFZwbkF1dGhvcml6YXRpb25SdWxlOiBlaXRoZXIgY2xpZW50VnBuRW5kcG9pbnQgb3IgY2xpZW50VnBuRW5kb2ludCAoZGVwcmVjYXRlZCkgbXVzdCBiZSBzcGVjaWZpZWQnICtcbiAgICAgICAgICAnLCBidXQgbm90IGJvdGgnLFxuICAgICAgKSxcbiAgICApO1xuICB9KTtcbiAgdGVzdCgnaW52YWxpZCBjb25zdHJ1Y3RvciBjYWxscyBzaG91bGQgbm90IGFkZCBhbnl0aGluZyB0byB0aGUgc3RhY2snLCAoKSA9PiB7XG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBDbGllbnRWcG5BdXRob3JpemF0aW9uUnVsZShzdGFjaywgJ1J1bGVOb0VuZG9pbnROb0VuZHBvaW50Jywge1xuICAgICAgICBjaWRyOiAnMTAuMC4xMC4wLzMyJyxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coKTtcbiAgICBleHBlY3Qoc3RhY2subm9kZS5jaGlsZHJlbi5sZW5ndGgpLnRvQmUoMCk7XG4gIH0pO1xuICB0ZXN0RGVwcmVjYXRlZCgnc3VwcGx5aW5nIGNsaWVudFZwbkVuZG9pbnQgKGRlcHJlY2F0ZWQgZHVlIHRvIHR5cG8pIHNob3VsZCBzdGlsbCB3b3JrJywgKCkgPT4ge1xuICAgIGNvbnN0IGNsaWVudFZwbkVuZG9pbnQ6IElDbGllbnRWcG5FbmRwb2ludCA9IHtcbiAgICAgIGVuZHBvaW50SWQ6ICdteUNsaWVudFZwbkVuZHBvaW50JyxcbiAgICAgIHRhcmdldE5ldHdvcmtzQXNzb2NpYXRlZDogW10sXG4gICAgICBzdGFjayxcbiAgICAgIGVudjogeyBhY2NvdW50OiAnbXlBY2NvdW50JywgcmVnaW9uOiAndXMtZWFzdC0xJyB9LFxuICAgICAgY29ubmVjdGlvbnM6IG5ldyBDb25uZWN0aW9ucygpLFxuICAgICAgbm9kZTogc3RhY2subm9kZSxcbiAgICAgIGFwcGx5UmVtb3ZhbFBvbGljeTogKCkgPT4geyB9LFxuICAgIH07XG4gICAgbmV3IENsaWVudFZwbkF1dGhvcml6YXRpb25SdWxlKHN0YWNrLCAnUnVsZVdpdGhFbmRvaW50VHlwbycsIHtcbiAgICAgIGNpZHI6ICcxMC4wLjEwLjAvMzInLFxuICAgICAgY2xpZW50VnBuRW5kb2ludCxcbiAgICB9KTtcbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnJlc291cmNlQ291bnRJcygnQVdTOjpFQzI6OkNsaWVudFZwbkF1dGhvcml6YXRpb25SdWxlJywgMSk7XG4gICAgZXhwZWN0KHN0YWNrLm5vZGUuY2hpbGRyZW4ubGVuZ3RoKS50b0JlKDEpO1xuICB9KTtcbn0pO1xuIl19