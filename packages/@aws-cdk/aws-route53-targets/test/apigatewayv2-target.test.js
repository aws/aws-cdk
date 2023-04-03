"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const apigwv2 = require("@aws-cdk/aws-apigatewayv2");
const acm = require("@aws-cdk/aws-certificatemanager");
const route53 = require("@aws-cdk/aws-route53");
const core_1 = require("@aws-cdk/core");
const targets = require("../lib");
test('targets.ApiGatewayv2Domain can be used to directly reference a domain', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const name = 'example.com';
    const cert = new acm.Certificate(stack, 'cert', { domainName: name });
    const domainName = new apigwv2.DomainName(stack, 'DN', {
        domainName: name,
        certificate: cert,
    });
    const zone = new route53.HostedZone(stack, 'zone', {
        zoneName: 'example.com',
    });
    // WHEN
    new route53.ARecord(stack, 'A', {
        zone,
        target: route53.RecordTarget.fromAlias(new targets.ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId)),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
        Name: 'example.com.',
        Type: 'A',
        AliasTarget: {
            DNSName: {
                'Fn::GetAtt': [
                    'DNFDC76583',
                    'RegionalDomainName',
                ],
            },
            HostedZoneId: {
                'Fn::GetAtt': [
                    'DNFDC76583',
                    'RegionalHostedZoneId',
                ],
            },
        },
        HostedZoneId: {
            Ref: 'zoneEB40FF1E',
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpZ2F0ZXdheXYyLXRhcmdldC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBpZ2F0ZXdheXYyLXRhcmdldC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHFEQUFxRDtBQUNyRCx1REFBdUQ7QUFDdkQsZ0RBQWdEO0FBQ2hELHdDQUFzQztBQUN0QyxrQ0FBa0M7QUFFbEMsSUFBSSxDQUFDLHVFQUF1RSxFQUFFLEdBQUcsRUFBRTtJQUNqRixRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUMxQixNQUFNLElBQUksR0FBRyxhQUFhLENBQUM7SUFDM0IsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN0RSxNQUFNLFVBQVUsR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRTtRQUNyRCxVQUFVLEVBQUUsSUFBSTtRQUNoQixXQUFXLEVBQUUsSUFBSTtLQUNsQixDQUFDLENBQUM7SUFDSCxNQUFNLElBQUksR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtRQUNqRCxRQUFRLEVBQUUsYUFBYTtLQUN4QixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUU7UUFDOUIsSUFBSTtRQUNKLE1BQU0sRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsVUFBVSxDQUFDLG9CQUFvQixDQUFDLENBQUM7S0FDakosQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLHlCQUF5QixFQUFFO1FBQ3pFLElBQUksRUFBRSxjQUFjO1FBQ3BCLElBQUksRUFBRSxHQUFHO1FBQ1QsV0FBVyxFQUFFO1lBQ1gsT0FBTyxFQUFFO2dCQUNQLFlBQVksRUFBRTtvQkFDWixZQUFZO29CQUNaLG9CQUFvQjtpQkFDckI7YUFDRjtZQUNELFlBQVksRUFBRTtnQkFDWixZQUFZLEVBQUU7b0JBQ1osWUFBWTtvQkFDWixzQkFBc0I7aUJBQ3ZCO2FBQ0Y7U0FDRjtRQUNELFlBQVksRUFBRTtZQUNaLEdBQUcsRUFBRSxjQUFjO1NBQ3BCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0ICogYXMgYXBpZ3d2MiBmcm9tICdAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheXYyJztcbmltcG9ydCAqIGFzIGFjbSBmcm9tICdAYXdzLWNkay9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyJztcbmltcG9ydCAqIGFzIHJvdXRlNTMgZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHRhcmdldHMgZnJvbSAnLi4vbGliJztcblxudGVzdCgndGFyZ2V0cy5BcGlHYXRld2F5djJEb21haW4gY2FuIGJlIHVzZWQgdG8gZGlyZWN0bHkgcmVmZXJlbmNlIGEgZG9tYWluJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuICBjb25zdCBuYW1lID0gJ2V4YW1wbGUuY29tJztcbiAgY29uc3QgY2VydCA9IG5ldyBhY20uQ2VydGlmaWNhdGUoc3RhY2ssICdjZXJ0JywgeyBkb21haW5OYW1lOiBuYW1lIH0pO1xuICBjb25zdCBkb21haW5OYW1lID0gbmV3IGFwaWd3djIuRG9tYWluTmFtZShzdGFjaywgJ0ROJywge1xuICAgIGRvbWFpbk5hbWU6IG5hbWUsXG4gICAgY2VydGlmaWNhdGU6IGNlcnQsXG4gIH0pO1xuICBjb25zdCB6b25lID0gbmV3IHJvdXRlNTMuSG9zdGVkWm9uZShzdGFjaywgJ3pvbmUnLCB7XG4gICAgem9uZU5hbWU6ICdleGFtcGxlLmNvbScsXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgbmV3IHJvdXRlNTMuQVJlY29yZChzdGFjaywgJ0EnLCB7XG4gICAgem9uZSxcbiAgICB0YXJnZXQ6IHJvdXRlNTMuUmVjb3JkVGFyZ2V0LmZyb21BbGlhcyhuZXcgdGFyZ2V0cy5BcGlHYXRld2F5djJEb21haW5Qcm9wZXJ0aWVzKGRvbWFpbk5hbWUucmVnaW9uYWxEb21haW5OYW1lLCBkb21haW5OYW1lLnJlZ2lvbmFsSG9zdGVkWm9uZUlkKSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgIE5hbWU6ICdleGFtcGxlLmNvbS4nLFxuICAgIFR5cGU6ICdBJyxcbiAgICBBbGlhc1RhcmdldDoge1xuICAgICAgRE5TTmFtZToge1xuICAgICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgICAnRE5GREM3NjU4MycsXG4gICAgICAgICAgJ1JlZ2lvbmFsRG9tYWluTmFtZScsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgSG9zdGVkWm9uZUlkOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdETkZEQzc2NTgzJyxcbiAgICAgICAgICAnUmVnaW9uYWxIb3N0ZWRab25lSWQnLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgUmVmOiAnem9uZUVCNDBGRjFFJyxcbiAgICB9LFxuICB9KTtcbn0pO1xuIl19