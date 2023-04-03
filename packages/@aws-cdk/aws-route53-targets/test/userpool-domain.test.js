"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const aws_cognito_1 = require("@aws-cdk/aws-cognito");
const aws_route53_1 = require("@aws-cdk/aws-route53");
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
test('use user pool domain as record target', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const zone = new aws_route53_1.PublicHostedZone(stack, 'HostedZone', { zoneName: 'test.public' });
    const userPool = new aws_cognito_1.UserPool(stack, 'UserPool');
    const domain = new aws_cognito_1.UserPoolDomain(stack, 'UserPoolDomain', {
        userPool,
        cognitoDomain: { domainPrefix: 'domain-prefix' },
    });
    // WHEN
    new aws_route53_1.ARecord(zone, 'Alias', {
        zone,
        target: aws_route53_1.RecordTarget.fromAlias(new lib_1.UserPoolDomainTarget(domain)),
    });
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::RecordSet', {
        AliasTarget: {
            DNSName: {
                'Fn::GetAtt': ['UserPoolDomainCloudFrontDomainName0B254952', 'DomainDescription.CloudFrontDistribution'],
            },
            HostedZoneId: {
                'Fn::FindInMap': [
                    'AWSCloudFrontPartitionHostedZoneIdMap',
                    {
                        Ref: 'AWS::Partition',
                    },
                    'zoneId',
                ],
            },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlcnBvb2wtZG9tYWluLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2VycG9vbC1kb21haW4udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyxzREFBZ0U7QUFDaEUsc0RBQStFO0FBQy9FLHdDQUFzQztBQUN0QyxnQ0FBOEM7QUFFOUMsSUFBSSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtJQUNqRCxRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUMxQixNQUFNLElBQUksR0FBRyxJQUFJLDhCQUFnQixDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLENBQUMsQ0FBQztJQUNwRixNQUFNLFFBQVEsR0FBRyxJQUFJLHNCQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELE1BQU0sTUFBTSxHQUFHLElBQUksNEJBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7UUFDekQsUUFBUTtRQUNSLGFBQWEsRUFBRSxFQUFFLFlBQVksRUFBRSxlQUFlLEVBQUU7S0FDakQsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLElBQUkscUJBQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO1FBQ3pCLElBQUk7UUFDSixNQUFNLEVBQUUsMEJBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSwwQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNqRSxDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMseUJBQXlCLEVBQUU7UUFDekUsV0FBVyxFQUFFO1lBQ1gsT0FBTyxFQUFFO2dCQUNQLFlBQVksRUFBRSxDQUFDLDRDQUE0QyxFQUFFLDBDQUEwQyxDQUFDO2FBQ3pHO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLGVBQWUsRUFBRTtvQkFDZix1Q0FBdUM7b0JBQ3ZDO3dCQUNFLEdBQUcsRUFBRSxnQkFBZ0I7cUJBQ3RCO29CQUNELFFBQVE7aUJBQ1Q7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgVXNlclBvb2wsIFVzZXJQb29sRG9tYWluIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWNvZ25pdG8nO1xuaW1wb3J0IHsgQVJlY29yZCwgUHVibGljSG9zdGVkWm9uZSwgUmVjb3JkVGFyZ2V0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLXJvdXRlNTMnO1xuaW1wb3J0IHsgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFVzZXJQb29sRG9tYWluVGFyZ2V0IH0gZnJvbSAnLi4vbGliJztcblxudGVzdCgndXNlIHVzZXIgcG9vbCBkb21haW4gYXMgcmVjb3JkIHRhcmdldCcsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcbiAgY29uc3Qgem9uZSA9IG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHsgem9uZU5hbWU6ICd0ZXN0LnB1YmxpYycgfSk7XG4gIGNvbnN0IHVzZXJQb29sID0gbmV3IFVzZXJQb29sKHN0YWNrLCAnVXNlclBvb2wnKTtcbiAgY29uc3QgZG9tYWluID0gbmV3IFVzZXJQb29sRG9tYWluKHN0YWNrLCAnVXNlclBvb2xEb21haW4nLCB7XG4gICAgdXNlclBvb2wsXG4gICAgY29nbml0b0RvbWFpbjogeyBkb21haW5QcmVmaXg6ICdkb21haW4tcHJlZml4JyB9LFxuICB9KTtcblxuICAvLyBXSEVOXG4gIG5ldyBBUmVjb3JkKHpvbmUsICdBbGlhcycsIHtcbiAgICB6b25lLFxuICAgIHRhcmdldDogUmVjb3JkVGFyZ2V0LmZyb21BbGlhcyhuZXcgVXNlclBvb2xEb21haW5UYXJnZXQoZG9tYWluKSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Um91dGU1Mzo6UmVjb3JkU2V0Jywge1xuICAgIEFsaWFzVGFyZ2V0OiB7XG4gICAgICBETlNOYW1lOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogWydVc2VyUG9vbERvbWFpbkNsb3VkRnJvbnREb21haW5OYW1lMEIyNTQ5NTInLCAnRG9tYWluRGVzY3JpcHRpb24uQ2xvdWRGcm9udERpc3RyaWJ1dGlvbiddLFxuICAgICAgfSxcbiAgICAgIEhvc3RlZFpvbmVJZDoge1xuICAgICAgICAnRm46OkZpbmRJbk1hcCc6IFtcbiAgICAgICAgICAnQVdTQ2xvdWRGcm9udFBhcnRpdGlvbkhvc3RlZFpvbmVJZE1hcCcsXG4gICAgICAgICAge1xuICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3pvbmVJZCcsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG4iXX0=