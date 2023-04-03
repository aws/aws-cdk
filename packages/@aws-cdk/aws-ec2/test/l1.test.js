"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const ec2 = require("../lib");
test('NetworkAclEntry CidrBlock should be optional', () => {
    const stack = new cdk.Stack();
    new ec2.CfnNetworkAclEntry(stack, 'ACL', {
        // Note the conspicuous absence of cidrBlock
        networkAclId: 'asdf',
        protocol: 5,
        ruleAction: 'action',
        ruleNumber: 1,
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibDEudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImwxLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsOEJBQThCO0FBRTlCLElBQUksQ0FBQyw4Q0FBOEMsRUFBRSxHQUFHLEVBQUU7SUFDeEQsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFOUIsSUFBSSxHQUFHLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtRQUN2Qyw0Q0FBNEM7UUFDNUMsWUFBWSxFQUFFLE1BQU07UUFDcEIsUUFBUSxFQUFFLENBQUM7UUFDWCxVQUFVLEVBQUUsUUFBUTtRQUNwQixVQUFVLEVBQUUsQ0FBQztLQUNkLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ05ldHdvcmtBY2xFbnRyeSBDaWRyQmxvY2sgc2hvdWxkIGJlIG9wdGlvbmFsJywgKCkgPT4ge1xuICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICBuZXcgZWMyLkNmbk5ldHdvcmtBY2xFbnRyeShzdGFjaywgJ0FDTCcsIHtcbiAgICAvLyBOb3RlIHRoZSBjb25zcGljdW91cyBhYnNlbmNlIG9mIGNpZHJCbG9ja1xuICAgIG5ldHdvcmtBY2xJZDogJ2FzZGYnLFxuICAgIHByb3RvY29sOiA1LFxuICAgIHJ1bGVBY3Rpb246ICdhY3Rpb24nLFxuICAgIHJ1bGVOdW1iZXI6IDEsXG4gIH0pO1xufSk7XG4iXX0=