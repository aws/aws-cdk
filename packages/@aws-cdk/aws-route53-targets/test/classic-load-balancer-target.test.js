"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const elb = require("@aws-cdk/aws-elasticloadbalancing");
const route53 = require("@aws-cdk/aws-route53");
const core_1 = require("@aws-cdk/core");
const targets = require("../lib");
test('use classic ELB as record target', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC', {
        maxAzs: 2,
    });
    const lb = new elb.LoadBalancer(stack, 'LB', {
        vpc,
        internetFacing: true,
    });
    const zone = new route53.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });
    // WHEN
    new route53.ARecord(zone, 'Alias', {
        zone,
        recordName: '_foo',
        target: route53.RecordTarget.fromAlias(new targets.ClassicLoadBalancerTarget(lb)),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
        AliasTarget: {
            DNSName: { 'Fn::Join': ['', ['dualstack.', { 'Fn::GetAtt': ['LB8A12904C', 'DNSName'] }]] },
            HostedZoneId: { 'Fn::GetAtt': ['LB8A12904C', 'CanonicalHostedZoneNameID'] },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3NpYy1sb2FkLWJhbGFuY2VyLXRhcmdldC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xhc3NpYy1sb2FkLWJhbGFuY2VyLXRhcmdldC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUF3QztBQUN4Qyx5REFBeUQ7QUFDekQsZ0RBQWdEO0FBQ2hELHdDQUFzQztBQUN0QyxrQ0FBa0M7QUFFbEMsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRTtJQUM1QyxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUMxQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtRQUNwQyxNQUFNLEVBQUUsQ0FBQztLQUNWLENBQUMsQ0FBQztJQUNILE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO1FBQzNDLEdBQUc7UUFDSCxjQUFjLEVBQUUsSUFBSTtLQUNyQixDQUFDLENBQUM7SUFFSCxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFFNUYsT0FBTztJQUNQLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1FBQ2pDLElBQUk7UUFDSixVQUFVLEVBQUUsTUFBTTtRQUNsQixNQUFNLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMseUJBQXlCLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDbEYsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO1FBQ3pFLFdBQVcsRUFBRTtZQUNYLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLFlBQVksRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtZQUMxRixZQUFZLEVBQUUsRUFBRSxZQUFZLEVBQUUsQ0FBQyxZQUFZLEVBQUUsMkJBQTJCLENBQUMsRUFBRTtTQUM1RTtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGVsYiBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmcnO1xuaW1wb3J0ICogYXMgcm91dGU1MyBmcm9tICdAYXdzLWNkay9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgdGFyZ2V0cyBmcm9tICcuLi9saWInO1xuXG50ZXN0KCd1c2UgY2xhc3NpYyBFTEIgYXMgcmVjb3JkIHRhcmdldCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgY29uc3QgdnBjID0gbmV3IGVjMi5WcGMoc3RhY2ssICdWUEMnLCB7XG4gICAgbWF4QXpzOiAyLFxuICB9KTtcbiAgY29uc3QgbGIgPSBuZXcgZWxiLkxvYWRCYWxhbmNlcihzdGFjaywgJ0xCJywge1xuICAgIHZwYyxcbiAgICBpbnRlcm5ldEZhY2luZzogdHJ1ZSxcbiAgfSk7XG5cbiAgY29uc3Qgem9uZSA9IG5ldyByb3V0ZTUzLlB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywgeyB6b25lTmFtZTogJ3Rlc3QucHVibGljJyB9KTtcblxuICAvLyBXSEVOXG4gIG5ldyByb3V0ZTUzLkFSZWNvcmQoem9uZSwgJ0FsaWFzJywge1xuICAgIHpvbmUsXG4gICAgcmVjb3JkTmFtZTogJ19mb28nLFxuICAgIHRhcmdldDogcm91dGU1My5SZWNvcmRUYXJnZXQuZnJvbUFsaWFzKG5ldyB0YXJnZXRzLkNsYXNzaWNMb2FkQmFsYW5jZXJUYXJnZXQobGIpKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpSb3V0ZTUzOjpSZWNvcmRTZXQnLCB7XG4gICAgQWxpYXNUYXJnZXQ6IHtcbiAgICAgIEROU05hbWU6IHsgJ0ZuOjpKb2luJzogWycnLCBbJ2R1YWxzdGFjay4nLCB7ICdGbjo6R2V0QXR0JzogWydMQjhBMTI5MDRDJywgJ0ROU05hbWUnXSB9XV0gfSxcbiAgICAgIEhvc3RlZFpvbmVJZDogeyAnRm46OkdldEF0dCc6IFsnTEI4QTEyOTA0QycsICdDYW5vbmljYWxIb3N0ZWRab25lTmFtZUlEJ10gfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuIl19