"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_route53_1 = require("@aws-cdk/aws-route53");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
test('use another route 53 record as record target', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const zone = new aws_route53_1.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });
    const record = new aws_route53_1.ARecord(zone, 'Record', {
        zone,
        target: aws_route53_1.RecordTarget.fromIpAddresses('1.2.3.4'),
    });
    // WHEN
    new aws_route53_1.ARecord(zone, 'Alias', {
        zone,
        target: aws_route53_1.RecordTarget.fromAlias(new lib_1.Route53RecordTarget(record)),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
        AliasTarget: {
            DNSName: {
                Ref: 'HostedZoneRecordB6AB510D',
            },
            HostedZoneId: {
                Ref: 'HostedZoneDB99F866',
            },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGU1My1yZWNvcmQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJvdXRlNTMtcmVjb3JkLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msc0RBQStFO0FBQy9FLHdDQUFzQztBQUN0QyxnQ0FBNkM7QUFFN0MsSUFBSSxDQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtJQUN4RCxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLDhCQUFnQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUNwRixNQUFNLE1BQU0sR0FBRyxJQUFJLHFCQUFPLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtRQUN6QyxJQUFJO1FBQ0osTUFBTSxFQUFFLDBCQUFZLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQztLQUNoRCxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsSUFBSSxxQkFBTyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7UUFDekIsSUFBSTtRQUNKLE1BQU0sRUFBRSwwQkFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHlCQUFtQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2hFLENBQUMsQ0FBQztJQUVILE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtRQUN6RSxXQUFXLEVBQUU7WUFDWCxPQUFPLEVBQUU7Z0JBQ1AsR0FBRyxFQUFFLDBCQUEwQjthQUNoQztZQUNELFlBQVksRUFBRTtnQkFDWixHQUFHLEVBQUUsb0JBQW9CO2FBQzFCO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBBUmVjb3JkLCBQdWJsaWNIb3N0ZWRab25lLCBSZWNvcmRUYXJnZXQgfSBmcm9tICdAYXdzLWNkay9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgUm91dGU1M1JlY29yZFRhcmdldCB9IGZyb20gJy4uL2xpYic7XG5cbnRlc3QoJ3VzZSBhbm90aGVyIHJvdXRlIDUzIHJlY29yZCBhcyByZWNvcmQgdGFyZ2V0JywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCB6b25lID0gbmV3IFB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywgeyB6b25lTmFtZTogJ3Rlc3QucHVibGljJyB9KTtcbiAgY29uc3QgcmVjb3JkID0gbmV3IEFSZWNvcmQoem9uZSwgJ1JlY29yZCcsIHtcbiAgICB6b25lLFxuICAgIHRhcmdldDogUmVjb3JkVGFyZ2V0LmZyb21JcEFkZHJlc3NlcygnMS4yLjMuNCcpLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIG5ldyBBUmVjb3JkKHpvbmUsICdBbGlhcycsIHtcbiAgICB6b25lLFxuICAgIHRhcmdldDogUmVjb3JkVGFyZ2V0LmZyb21BbGlhcyhuZXcgUm91dGU1M1JlY29yZFRhcmdldChyZWNvcmQpKSxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpSb3V0ZTUzOjpSZWNvcmRTZXQnLCB7XG4gICAgQWxpYXNUYXJnZXQ6IHtcbiAgICAgIEROU05hbWU6IHtcbiAgICAgICAgUmVmOiAnSG9zdGVkWm9uZVJlY29yZEI2QUI1MTBEJyxcbiAgICAgIH0sXG4gICAgICBIb3N0ZWRab25lSWQ6IHtcbiAgICAgICAgUmVmOiAnSG9zdGVkWm9uZURCOTlGODY2JyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSk7XG59KTtcbiJdfQ==