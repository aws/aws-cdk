"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const iam = require("@aws-cdk/aws-iam");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
describe('hosted zone', () => {
    describe('Hosted Zone', () => {
        test('Hosted Zone constructs the ARN', () => {
            // GIVEN
            const stack = new cdk.Stack(undefined, 'TestStack', {
                env: { account: '123456789012', region: 'us-east-1' },
            });
            const testZone = new lib_1.HostedZone(stack, 'HostedZone', {
                zoneName: 'testZone',
            });
            expect(stack.resolve(testZone.hostedZoneArn)).toEqual({
                'Fn::Join': [
                    '',
                    [
                        'arn:',
                        { Ref: 'AWS::Partition' },
                        ':route53:::hostedzone/',
                        { Ref: 'HostedZoneDB99F866' },
                    ],
                ],
            });
        });
    });
    test('Supports tags', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const hostedZone = new lib_1.HostedZone(stack, 'HostedZone', {
            zoneName: 'test.zone',
        });
        cdk.Tags.of(hostedZone).add('zoneTag', 'inMyZone');
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                HostedZoneDB99F866: {
                    Type: 'AWS::Route53::HostedZone',
                    Properties: {
                        Name: 'test.zone.',
                        HostedZoneTags: [
                            {
                                Key: 'zoneTag',
                                Value: 'inMyZone',
                            },
                        ],
                    },
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('with crossAccountZoneDelegationPrincipal', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'TestStack', {
            env: { account: '123456789012', region: 'us-east-1' },
        });
        // WHEN
        new lib_1.PublicHostedZone(stack, 'HostedZone', {
            zoneName: 'testZone',
            crossAccountZoneDelegationPrincipal: new iam.AccountPrincipal('223456789012'),
            crossAccountZoneDelegationRoleName: 'myrole',
        });
        // THEN
        assertions_1.Template.fromStack(stack).templateMatches({
            Resources: {
                HostedZoneDB99F866: {
                    Type: 'AWS::Route53::HostedZone',
                    Properties: {
                        Name: 'testZone.',
                    },
                },
                HostedZoneCrossAccountZoneDelegationRole685DF755: {
                    Type: 'AWS::IAM::Role',
                    Properties: {
                        RoleName: 'myrole',
                        AssumeRolePolicyDocument: {
                            Statement: [
                                {
                                    Action: 'sts:AssumeRole',
                                    Effect: 'Allow',
                                    Principal: {
                                        AWS: {
                                            'Fn::Join': [
                                                '',
                                                [
                                                    'arn:',
                                                    {
                                                        Ref: 'AWS::Partition',
                                                    },
                                                    ':iam::223456789012:root',
                                                ],
                                            ],
                                        },
                                    },
                                },
                            ],
                            Version: '2012-10-17',
                        },
                        Policies: [
                            {
                                PolicyDocument: {
                                    Statement: [
                                        {
                                            Action: 'route53:ChangeResourceRecordSets',
                                            Effect: 'Allow',
                                            Resource: {
                                                'Fn::Join': [
                                                    '',
                                                    [
                                                        'arn:',
                                                        {
                                                            Ref: 'AWS::Partition',
                                                        },
                                                        ':route53:::hostedzone/',
                                                        {
                                                            Ref: 'HostedZoneDB99F866',
                                                        },
                                                    ],
                                                ],
                                            },
                                            Condition: {
                                                'ForAllValues:StringEquals': {
                                                    'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
                                                    'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
                                                },
                                            },
                                        },
                                        {
                                            Action: 'route53:ListHostedZonesByName',
                                            Effect: 'Allow',
                                            Resource: '*',
                                        },
                                    ],
                                    Version: '2012-10-17',
                                },
                                PolicyName: 'delegation',
                            },
                        ],
                    },
                },
            },
        });
    });
    cdk_build_tools_1.testDeprecated('with crossAccountZoneDelegationPrincipal, throws if name provided without principal', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'TestStack', {
            env: { account: '123456789012', region: 'us-east-1' },
        });
        // THEN
        expect(() => {
            new lib_1.PublicHostedZone(stack, 'HostedZone', {
                zoneName: 'testZone',
                crossAccountZoneDelegationRoleName: 'myrole',
            });
        }).toThrow(/crossAccountZoneDelegationRoleName property is not supported without crossAccountZoneDelegationPrincipal/);
    });
    test('fromHostedZoneId throws error when zoneName is referenced', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'TestStack', {
            env: { account: '123456789012', region: 'us-east-1' },
        });
        // WHEN
        const hz = lib_1.HostedZone.fromHostedZoneId(stack, 'HostedZone', 'abcdefgh');
        // THEN
        expect(() => {
            hz.zoneName;
        }).toThrow('Cannot reference `zoneName` when using `HostedZone.fromHostedZoneId()`. A construct consuming this hosted zone may be trying to reference its `zoneName`. If this is the case, use `fromHostedZoneAttributes()` or `fromLookup()` instead.');
    });
    test('fromLookup throws error when domainName is undefined', () => {
        // GIVEN
        let domainName;
        const stack = new cdk.Stack(undefined, 'TestStack', {
            env: { account: '123456789012', region: 'us-east-1' },
        });
        // THEN
        expect(() => {
            lib_1.HostedZone.fromLookup(stack, 'HostedZone', {
                domainName,
            });
        }).toThrow(/Cannot use undefined value for attribute `domainName`/);
    });
});
describe('Vpc', () => {
    test('different region in vpc and hosted zone', () => {
        // GIVEN
        const stack = new cdk.Stack(undefined, 'TestStack', {
            env: { account: '123456789012', region: 'us-east-1' },
        });
        // WHEN
        new lib_1.PrivateHostedZone(stack, 'HostedZone', {
            vpc: ec2.Vpc.fromVpcAttributes(stack, 'Vpc', {
                vpcId: '1234',
                availabilityZones: ['region-12345a', 'region-12345b', 'region-12345c'],
                region: 'region-12345',
            }),
            zoneName: 'SomeZone',
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::Route53::HostedZone', {
            VPCs: [
                {
                    VPCId: '1234',
                    VPCRegion: 'region-12345',
                },
            ],
            Name: assertions_1.Match.anyValue(),
        });
    });
});
test('grantDelegation', () => {
    // GIVEN
    const stack = new cdk.Stack(undefined, 'TestStack', {
        env: { account: '123456789012', region: 'us-east-1' },
    });
    const role = new iam.Role(stack, 'Role', {
        assumedBy: new iam.AccountPrincipal('22222222222222'),
    });
    const zone = new lib_1.PublicHostedZone(stack, 'Zone', {
        zoneName: 'banana.com',
    });
    // WHEN
    zone.grantDelegation(role);
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    template.hasResourceProperties('AWS::IAM::Policy', {
        PolicyDocument: {
            Statement: [
                {
                    Action: 'route53:ChangeResourceRecordSets',
                    Effect: 'Allow',
                    Resource: {
                        'Fn::Join': [
                            '',
                            [
                                'arn:',
                                {
                                    Ref: 'AWS::Partition',
                                },
                                ':route53:::hostedzone/',
                                {
                                    Ref: 'ZoneA5DE4B68',
                                },
                            ],
                        ],
                    },
                    Condition: {
                        'ForAllValues:StringEquals': {
                            'route53:ChangeResourceRecordSetsRecordTypes': ['NS'],
                            'route53:ChangeResourceRecordSetsActions': ['UPSERT', 'DELETE'],
                        },
                    },
                },
                {
                    Action: 'route53:ListHostedZonesByName',
                    Effect: 'Allow',
                    Resource: '*',
                },
            ],
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9zdGVkLXpvbmUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhvc3RlZC16b25lLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBc0Q7QUFDdEQsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4Qyw4REFBMEQ7QUFDMUQscUNBQXFDO0FBQ3JDLGdDQUF5RTtBQUV6RSxRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtJQUMzQixRQUFRLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRTtRQUMzQixJQUFJLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1lBQzFDLFFBQVE7WUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRTtnQkFDbEQsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFO2FBQ3RELENBQUMsQ0FBQztZQUVILE1BQU0sUUFBUSxHQUFHLElBQUksZ0JBQVUsQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFO2dCQUNuRCxRQUFRLEVBQUUsVUFBVTthQUNyQixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3BELFVBQVUsRUFBRTtvQkFDVixFQUFFO29CQUNGO3dCQUNFLE1BQU07d0JBQ04sRUFBRSxHQUFHLEVBQUUsZ0JBQWdCLEVBQUU7d0JBQ3pCLHdCQUF3Qjt3QkFDeEIsRUFBRSxHQUFHLEVBQUUsb0JBQW9CLEVBQUU7cUJBQzlCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQ3pCLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FB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UUFDakQsY0FBYyxFQUFFO1lBQ2QsU0FBUyxFQUFFO2dCQUNUO29CQUNFLE1BQU0sRUFBRSxrQ0FBa0M7b0JBQzFDLE1BQU0sRUFBRSxPQUFPO29CQUNmLFFBQVEsRUFBRTt3QkFDUixVQUFVLEVBQUU7NEJBQ1YsRUFBRTs0QkFDRjtnQ0FDRSxNQUFNO2dDQUNOO29DQUNFLEdBQUcsRUFBRSxnQkFBZ0I7aUNBQ3RCO2dDQUNELHdCQUF3QjtnQ0FDeEI7b0NBQ0UsR0FBRyxFQUFFLGNBQWM7aUNBQ3BCOzZCQUNGO3lCQUNGO3FCQUNGO29CQUNELFNBQVMsRUFBRTt3QkFDVCwyQkFBMkIsRUFBRTs0QkFDM0IsNkNBQTZDLEVBQUUsQ0FBQyxJQUFJLENBQUM7NEJBQ3JELHlDQUF5QyxFQUFFLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQzt5QkFDaEU7cUJBQ0Y7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsTUFBTSxFQUFFLCtCQUErQjtvQkFDdkMsTUFBTSxFQUFFLE9BQU87b0JBQ2YsUUFBUSxFQUFFLEdBQUc7aUJBQ2Q7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IHRlc3REZXByZWNhdGVkIH0gZnJvbSAnQGF3cy1jZGsvY2RrLWJ1aWxkLXRvb2xzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEhvc3RlZFpvbmUsIFByaXZhdGVIb3N0ZWRab25lLCBQdWJsaWNIb3N0ZWRab25lIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2hvc3RlZCB6b25lJywgKCkgPT4ge1xuICBkZXNjcmliZSgnSG9zdGVkIFpvbmUnLCAoKSA9PiB7XG4gICAgdGVzdCgnSG9zdGVkIFpvbmUgY29uc3RydWN0cyB0aGUgQVJOJywgKCkgPT4ge1xuICAgICAgLy8gR0lWRU5cbiAgICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snLCB7XG4gICAgICAgIGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9LFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHRlc3Rab25lID0gbmV3IEhvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgICB6b25lTmFtZTogJ3Rlc3Rab25lJyxcbiAgICAgIH0pO1xuXG4gICAgICBleHBlY3Qoc3RhY2sucmVzb2x2ZSh0ZXN0Wm9uZS5ob3N0ZWRab25lQXJuKSkudG9FcXVhbCh7XG4gICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAnJyxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICB7IFJlZjogJ0FXUzo6UGFydGl0aW9uJyB9LFxuICAgICAgICAgICAgJzpyb3V0ZTUzOjo6aG9zdGVkem9uZS8nLFxuICAgICAgICAgICAgeyBSZWY6ICdIb3N0ZWRab25lREI5OUY4NjYnIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgXSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdTdXBwb3J0cyB0YWdzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgaG9zdGVkWm9uZSA9IG5ldyBIb3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHtcbiAgICAgIHpvbmVOYW1lOiAndGVzdC56b25lJyxcbiAgICB9KTtcbiAgICBjZGsuVGFncy5vZihob3N0ZWRab25lKS5hZGQoJ3pvbmVUYWcnLCAnaW5NeVpvbmUnKTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLnRlbXBsYXRlTWF0Y2hlcyh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgSG9zdGVkWm9uZURCOTlGODY2OiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6Um91dGU1Mzo6SG9zdGVkWm9uZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgTmFtZTogJ3Rlc3Quem9uZS4nLFxuICAgICAgICAgICAgSG9zdGVkWm9uZVRhZ3M6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIEtleTogJ3pvbmVUYWcnLFxuICAgICAgICAgICAgICAgIFZhbHVlOiAnaW5NeVpvbmUnLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdERlcHJlY2F0ZWQoJ3dpdGggY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25QcmluY2lwYWwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJywge1xuICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd1cy1lYXN0LTEnIH0sXG4gICAgfSk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IFB1YmxpY0hvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgem9uZU5hbWU6ICd0ZXN0Wm9uZScsXG4gICAgICBjcm9zc0FjY291bnRab25lRGVsZWdhdGlvblByaW5jaXBhbDogbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKCcyMjM0NTY3ODkwMTInKSxcbiAgICAgIGNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUm9sZU5hbWU6ICdteXJvbGUnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykudGVtcGxhdGVNYXRjaGVzKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBIb3N0ZWRab25lREI5OUY4NjY6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpSb3V0ZTUzOjpIb3N0ZWRab25lJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBOYW1lOiAndGVzdFpvbmUuJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBIb3N0ZWRab25lQ3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlNjg1REY3NTU6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpJQU06OlJvbGUnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFJvbGVOYW1lOiAnbXlyb2xlJyxcbiAgICAgICAgICAgIEFzc3VtZVJvbGVQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBBY3Rpb246ICdzdHM6QXNzdW1lUm9sZScsXG4gICAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICBQcmluY2lwYWw6IHtcbiAgICAgICAgICAgICAgICAgICAgQVdTOiB7XG4gICAgICAgICAgICAgICAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhcm46JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzppYW06OjIyMzQ1Njc4OTAxMjpyb290JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFBvbGljaWVzOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBQb2xpY3lEb2N1bWVudDoge1xuICAgICAgICAgICAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBBY3Rpb246ICdyb3V0ZTUzOkNoYW5nZVJlc291cmNlUmVjb3JkU2V0cycsXG4gICAgICAgICAgICAgICAgICAgICAgRWZmZWN0OiAnQWxsb3cnLFxuICAgICAgICAgICAgICAgICAgICAgIFJlc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm46OkpvaW4nOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FybjonLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFJlZjogJ0FXUzo6UGFydGl0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc6cm91dGU1Mzo6Omhvc3RlZHpvbmUvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBSZWY6ICdIb3N0ZWRab25lREI5OUY4NjYnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgQ29uZGl0aW9uOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAnRm9yQWxsVmFsdWVzOlN0cmluZ0VxdWFscyc6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3JvdXRlNTM6Q2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzUmVjb3JkVHlwZXMnOiBbJ05TJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdyb3V0ZTUzOkNoYW5nZVJlc291cmNlUmVjb3JkU2V0c0FjdGlvbnMnOiBbJ1VQU0VSVCcsICdERUxFVEUnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgIEFjdGlvbjogJ3JvdXRlNTM6TGlzdEhvc3RlZFpvbmVzQnlOYW1lJyxcbiAgICAgICAgICAgICAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgICAgICAgICAgICAgUmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBQb2xpY3lOYW1lOiAnZGVsZWdhdGlvbicsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0RGVwcmVjYXRlZCgnd2l0aCBjcm9zc0FjY291bnRab25lRGVsZWdhdGlvblByaW5jaXBhbCwgdGhyb3dzIGlmIG5hbWUgcHJvdmlkZWQgd2l0aG91dCBwcmluY2lwYWwnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2sodW5kZWZpbmVkLCAnVGVzdFN0YWNrJywge1xuICAgICAgZW52OiB7IGFjY291bnQ6ICcxMjM0NTY3ODkwMTInLCByZWdpb246ICd1cy1lYXN0LTEnIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IHtcbiAgICAgIG5ldyBQdWJsaWNIb3N0ZWRab25lKHN0YWNrLCAnSG9zdGVkWm9uZScsIHtcbiAgICAgICAgem9uZU5hbWU6ICd0ZXN0Wm9uZScsXG4gICAgICAgIGNyb3NzQWNjb3VudFpvbmVEZWxlZ2F0aW9uUm9sZU5hbWU6ICdteXJvbGUnLFxuICAgICAgfSk7XG4gICAgfSkudG9UaHJvdygvY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25Sb2xlTmFtZSBwcm9wZXJ0eSBpcyBub3Qgc3VwcG9ydGVkIHdpdGhvdXQgY3Jvc3NBY2NvdW50Wm9uZURlbGVnYXRpb25QcmluY2lwYWwvKTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbUhvc3RlZFpvbmVJZCB0aHJvd3MgZXJyb3Igd2hlbiB6b25lTmFtZSBpcyByZWZlcmVuY2VkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHtcbiAgICAgIGVudjogeyBhY2NvdW50OiAnMTIzNDU2Nzg5MDEyJywgcmVnaW9uOiAndXMtZWFzdC0xJyB9LFxuICAgIH0pO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGh6ID0gSG9zdGVkWm9uZS5mcm9tSG9zdGVkWm9uZUlkKHN0YWNrLCAnSG9zdGVkWm9uZScsICdhYmNkZWZnaCcpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBoei56b25lTmFtZTtcbiAgICB9KS50b1Rocm93KCdDYW5ub3QgcmVmZXJlbmNlIGB6b25lTmFtZWAgd2hlbiB1c2luZyBgSG9zdGVkWm9uZS5mcm9tSG9zdGVkWm9uZUlkKClgLiBBIGNvbnN0cnVjdCBjb25zdW1pbmcgdGhpcyBob3N0ZWQgem9uZSBtYXkgYmUgdHJ5aW5nIHRvIHJlZmVyZW5jZSBpdHMgYHpvbmVOYW1lYC4gSWYgdGhpcyBpcyB0aGUgY2FzZSwgdXNlIGBmcm9tSG9zdGVkWm9uZUF0dHJpYnV0ZXMoKWAgb3IgYGZyb21Mb29rdXAoKWAgaW5zdGVhZC4nKTtcbiAgfSk7XG5cbiAgdGVzdCgnZnJvbUxvb2t1cCB0aHJvd3MgZXJyb3Igd2hlbiBkb21haW5OYW1lIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGxldCBkb21haW5OYW1lITogc3RyaW5nO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snLCB7XG4gICAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgSG9zdGVkWm9uZS5mcm9tTG9va3VwKHN0YWNrLCAnSG9zdGVkWm9uZScsIHtcbiAgICAgICAgZG9tYWluTmFtZSxcbiAgICAgIH0pO1xuICAgIH0pLnRvVGhyb3coL0Nhbm5vdCB1c2UgdW5kZWZpbmVkIHZhbHVlIGZvciBhdHRyaWJ1dGUgYGRvbWFpbk5hbWVgLyk7XG4gIH0pO1xufSk7XG5cbmRlc2NyaWJlKCdWcGMnLCAoKSA9PiB7XG4gIHRlc3QoJ2RpZmZlcmVudCByZWdpb24gaW4gdnBjIGFuZCBob3N0ZWQgem9uZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayh1bmRlZmluZWQsICdUZXN0U3RhY2snLCB7XG4gICAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgICB9KTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgUHJpdmF0ZUhvc3RlZFpvbmUoc3RhY2ssICdIb3N0ZWRab25lJywge1xuICAgICAgdnBjOiBlYzIuVnBjLmZyb21WcGNBdHRyaWJ1dGVzKHN0YWNrLCAnVnBjJywge1xuICAgICAgICB2cGNJZDogJzEyMzQnLFxuICAgICAgICBhdmFpbGFiaWxpdHlab25lczogWydyZWdpb24tMTIzNDVhJywgJ3JlZ2lvbi0xMjM0NWInLCAncmVnaW9uLTEyMzQ1YyddLFxuICAgICAgICByZWdpb246ICdyZWdpb24tMTIzNDUnLFxuICAgICAgfSksXG4gICAgICB6b25lTmFtZTogJ1NvbWVab25lJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpSb3V0ZTUzOjpIb3N0ZWRab25lJywge1xuICAgICAgVlBDczogW1xuICAgICAgICB7XG4gICAgICAgICAgVlBDSWQ6ICcxMjM0JyxcbiAgICAgICAgICBWUENSZWdpb246ICdyZWdpb24tMTIzNDUnLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICAgIE5hbWU6IE1hdGNoLmFueVZhbHVlKCksXG4gICAgfSk7XG4gIH0pO1xufSk7XG5cbnRlc3QoJ2dyYW50RGVsZWdhdGlvbicsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKHVuZGVmaW5lZCwgJ1Rlc3RTdGFjaycsIHtcbiAgICBlbnY6IHsgYWNjb3VudDogJzEyMzQ1Njc4OTAxMicsIHJlZ2lvbjogJ3VzLWVhc3QtMScgfSxcbiAgfSk7XG5cbiAgY29uc3Qgcm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ1JvbGUnLCB7XG4gICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRQcmluY2lwYWwoJzIyMjIyMjIyMjIyMjIyJyksXG4gIH0pO1xuXG4gIGNvbnN0IHpvbmUgPSBuZXcgUHVibGljSG9zdGVkWm9uZShzdGFjaywgJ1pvbmUnLCB7XG4gICAgem9uZU5hbWU6ICdiYW5hbmEuY29tJyxcbiAgfSk7XG5cbiAgLy8gV0hFTlxuICB6b25lLmdyYW50RGVsZWdhdGlvbihyb2xlKTtcblxuICAvLyBUSEVOXG4gIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OklBTTo6UG9saWN5Jywge1xuICAgIFBvbGljeURvY3VtZW50OiB7XG4gICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAge1xuICAgICAgICAgIEFjdGlvbjogJ3JvdXRlNTM6Q2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzJyxcbiAgICAgICAgICBFZmZlY3Q6ICdBbGxvdycsXG4gICAgICAgICAgUmVzb3VyY2U6IHtcbiAgICAgICAgICAgICdGbjo6Sm9pbic6IFtcbiAgICAgICAgICAgICAgJycsXG4gICAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgICAnYXJuOicsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgUmVmOiAnQVdTOjpQYXJ0aXRpb24nLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgJzpyb3V0ZTUzOjo6aG9zdGVkem9uZS8nLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFJlZjogJ1pvbmVBNURFNEI2OCcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBDb25kaXRpb246IHtcbiAgICAgICAgICAgICdGb3JBbGxWYWx1ZXM6U3RyaW5nRXF1YWxzJzoge1xuICAgICAgICAgICAgICAncm91dGU1MzpDaGFuZ2VSZXNvdXJjZVJlY29yZFNldHNSZWNvcmRUeXBlcyc6IFsnTlMnXSxcbiAgICAgICAgICAgICAgJ3JvdXRlNTM6Q2hhbmdlUmVzb3VyY2VSZWNvcmRTZXRzQWN0aW9ucyc6IFsnVVBTRVJUJywgJ0RFTEVURSddLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgQWN0aW9uOiAncm91dGU1MzpMaXN0SG9zdGVkWm9uZXNCeU5hbWUnLFxuICAgICAgICAgIEVmZmVjdDogJ0FsbG93JyxcbiAgICAgICAgICBSZXNvdXJjZTogJyonLFxuICAgICAgICB9LFxuICAgICAgXSxcbiAgICB9LFxuICB9KTtcbn0pOyJdfQ==