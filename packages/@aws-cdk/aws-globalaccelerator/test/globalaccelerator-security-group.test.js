"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const util_1 = require("./util");
const ga = require("../lib");
test('custom resource exists', () => {
    // GIVEN
    const { stack, vpc } = util_1.testFixture();
    const accelerator = new ga.Accelerator(stack, 'Accelerator');
    const listener = new ga.Listener(stack, 'Listener', {
        accelerator,
        portRanges: [
            {
                fromPort: 443,
                toPort: 443,
            },
        ],
    });
    const endpointGroup = new ga.EndpointGroup(stack, 'Group', { listener });
    // WHEN
    endpointGroup.connectionsPeer('GlobalAcceleratorSG', vpc);
    // THEN
    assertions_1.Template.fromStack(stack).hasResource('Custom::AWS', {
        Properties: {
            ServiceToken: {
                'Fn::GetAtt': [
                    'AWS679f53fac002430cb0da5b7982bd22872D164C4C',
                    'Arn',
                ],
            },
            Create: {
                'Fn::Join': [
                    '',
                    [
                        '{"service":"EC2","action":"describeSecurityGroups","parameters":{"Filters":[{"Name":"group-name","Values":["GlobalAccelerator"]},{"Name":"vpc-id","Values":["',
                        {
                            Ref: 'VPCB9E5F0B4',
                        },
                        '"]}]},"physicalResourceId":{"responsePath":"SecurityGroups.0.GroupId"}}',
                    ],
                ],
            },
            InstallLatestAwsSdk: false,
        },
        DependsOn: [
            'GroupGlobalAcceleratorSGCustomResourceCustomResourcePolicy9C957AD2',
            'GroupC77FDACD',
        ],
    });
});
test('can create security group rule', () => {
    // GIVEN
    const { stack, vpc } = util_1.testFixture();
    const accelerator = new ga.Accelerator(stack, 'Accelerator');
    const listener = new ga.Listener(stack, 'Listener', {
        accelerator,
        portRanges: [
            {
                fromPort: 443,
                toPort: 443,
            },
        ],
    });
    const endpointGroup = new ga.EndpointGroup(stack, 'Group', { listener });
    // WHEN
    const gaSg = endpointGroup.connectionsPeer('GlobalAcceleratorSG', vpc);
    const instanceSg = new ec2.SecurityGroup(stack, 'SG', { vpc });
    const instanceConnections = new ec2.Connections({ securityGroups: [instanceSg] });
    instanceConnections.allowFrom(gaSg, ec2.Port.tcp(443));
    // THEN
    assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
        IpProtocol: 'tcp',
        FromPort: 443,
        GroupId: {
            'Fn::GetAtt': [
                'SGADB53937',
                'GroupId',
            ],
        },
        SourceSecurityGroupId: {
            'Fn::GetAtt': [
                'GroupGlobalAcceleratorSGCustomResource0C8056E9',
                'SecurityGroups.0.GroupId',
            ],
        },
        ToPort: 443,
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsYWNjZWxlcmF0b3Itc2VjdXJpdHktZ3JvdXAudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdsb2JhbGFjY2VsZXJhdG9yLXNlY3VyaXR5LWdyb3VwLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0Msd0NBQXdDO0FBQ3hDLGlDQUFxQztBQUNyQyw2QkFBNkI7QUFFN0IsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtJQUNsQyxRQUFRO0lBQ1IsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxrQkFBVyxFQUFFLENBQUM7SUFDckMsTUFBTSxXQUFXLEdBQUcsSUFBSSxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztJQUM3RCxNQUFNLFFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRTtRQUNsRCxXQUFXO1FBQ1gsVUFBVSxFQUFFO1lBQ1Y7Z0JBQ0UsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsTUFBTSxFQUFFLEdBQUc7YUFDWjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxhQUFhLEdBQUcsSUFBSSxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0lBRXpFLE9BQU87SUFDUCxhQUFhLENBQUMsZUFBZSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBRTFELE9BQU87SUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFO1FBQ25ELFVBQVUsRUFBRTtZQUNWLFlBQVksRUFBRTtnQkFDWixZQUFZLEVBQUU7b0JBQ1osNkNBQTZDO29CQUM3QyxLQUFLO2lCQUNOO2FBQ0Y7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sVUFBVSxFQUFFO29CQUNWLEVBQUU7b0JBQ0Y7d0JBQ0UsK0pBQStKO3dCQUMvSjs0QkFDRSxHQUFHLEVBQUUsYUFBYTt5QkFDbkI7d0JBQ0QseUVBQXlFO3FCQUMxRTtpQkFDRjthQUNGO1lBQ0QsbUJBQW1CLEVBQUUsS0FBSztTQUMzQjtRQUNELFNBQVMsRUFBRTtZQUNULG9FQUFvRTtZQUNwRSxlQUFlO1NBQ2hCO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxJQUFJLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO0lBQzFDLFFBQVE7SUFDUixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLGtCQUFXLEVBQUUsQ0FBQztJQUNyQyxNQUFNLFdBQVcsR0FBRyxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzdELE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFO1FBQ2xELFdBQVc7UUFDWCxVQUFVLEVBQUU7WUFDVjtnQkFDRSxRQUFRLEVBQUUsR0FBRztnQkFDYixNQUFNLEVBQUUsR0FBRzthQUNaO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFDSCxNQUFNLGFBQWEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFFekUsT0FBTztJQUNQLE1BQU0sSUFBSSxHQUFHLGFBQWEsQ0FBQyxlQUFlLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdkUsTUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQy9ELE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2xGLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUV2RCxPQUFPO0lBQ1AscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMscUJBQXFCLENBQUMsZ0NBQWdDLEVBQUU7UUFDaEYsVUFBVSxFQUFFLEtBQUs7UUFDakIsUUFBUSxFQUFFLEdBQUc7UUFDYixPQUFPLEVBQUU7WUFDUCxZQUFZLEVBQUU7Z0JBQ1osWUFBWTtnQkFDWixTQUFTO2FBQ1Y7U0FDRjtRQUNELHFCQUFxQixFQUFFO1lBQ3JCLFlBQVksRUFBRTtnQkFDWixnREFBZ0Q7Z0JBQ2hELDBCQUEwQjthQUMzQjtTQUNGO1FBQ0QsTUFBTSxFQUFFLEdBQUc7S0FDWixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgeyB0ZXN0Rml4dHVyZSB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgKiBhcyBnYSBmcm9tICcuLi9saWInO1xuXG50ZXN0KCdjdXN0b20gcmVzb3VyY2UgZXhpc3RzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCB7IHN0YWNrLCB2cGMgfSA9IHRlc3RGaXh0dXJlKCk7XG4gIGNvbnN0IGFjY2VsZXJhdG9yID0gbmV3IGdhLkFjY2VsZXJhdG9yKHN0YWNrLCAnQWNjZWxlcmF0b3InKTtcbiAgY29uc3QgbGlzdGVuZXIgPSBuZXcgZ2EuTGlzdGVuZXIoc3RhY2ssICdMaXN0ZW5lcicsIHtcbiAgICBhY2NlbGVyYXRvcixcbiAgICBwb3J0UmFuZ2VzOiBbXG4gICAgICB7XG4gICAgICAgIGZyb21Qb3J0OiA0NDMsXG4gICAgICAgIHRvUG9ydDogNDQzLFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbiAgY29uc3QgZW5kcG9pbnRHcm91cCA9IG5ldyBnYS5FbmRwb2ludEdyb3VwKHN0YWNrLCAnR3JvdXAnLCB7IGxpc3RlbmVyIH0pO1xuXG4gIC8vIFdIRU5cbiAgZW5kcG9pbnRHcm91cC5jb25uZWN0aW9uc1BlZXIoJ0dsb2JhbEFjY2VsZXJhdG9yU0cnLCB2cGMpO1xuXG4gIC8vIFRIRU5cbiAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZSgnQ3VzdG9tOjpBV1MnLCB7XG4gICAgUHJvcGVydGllczoge1xuICAgICAgU2VydmljZVRva2VuOiB7XG4gICAgICAgICdGbjo6R2V0QXR0JzogW1xuICAgICAgICAgICdBV1M2NzlmNTNmYWMwMDI0MzBjYjBkYTViNzk4MmJkMjI4NzJEMTY0QzRDJyxcbiAgICAgICAgICAnQXJuJyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBDcmVhdGU6IHtcbiAgICAgICAgJ0ZuOjpKb2luJzogW1xuICAgICAgICAgICcnLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgICd7XCJzZXJ2aWNlXCI6XCJFQzJcIixcImFjdGlvblwiOlwiZGVzY3JpYmVTZWN1cml0eUdyb3Vwc1wiLFwicGFyYW1ldGVyc1wiOntcIkZpbHRlcnNcIjpbe1wiTmFtZVwiOlwiZ3JvdXAtbmFtZVwiLFwiVmFsdWVzXCI6W1wiR2xvYmFsQWNjZWxlcmF0b3JcIl19LHtcIk5hbWVcIjpcInZwYy1pZFwiLFwiVmFsdWVzXCI6W1wiJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgUmVmOiAnVlBDQjlFNUYwQjQnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICdcIl19XX0sXCJwaHlzaWNhbFJlc291cmNlSWRcIjp7XCJyZXNwb25zZVBhdGhcIjpcIlNlY3VyaXR5R3JvdXBzLjAuR3JvdXBJZFwifX0nLFxuICAgICAgICAgIF0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgSW5zdGFsbExhdGVzdEF3c1NkazogZmFsc2UsXG4gICAgfSxcbiAgICBEZXBlbmRzT246IFtcbiAgICAgICdHcm91cEdsb2JhbEFjY2VsZXJhdG9yU0dDdXN0b21SZXNvdXJjZUN1c3RvbVJlc291cmNlUG9saWN5OUM5NTdBRDInLFxuICAgICAgJ0dyb3VwQzc3RkRBQ0QnLFxuICAgIF0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ2NhbiBjcmVhdGUgc2VjdXJpdHkgZ3JvdXAgcnVsZScsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3QgeyBzdGFjaywgdnBjIH0gPSB0ZXN0Rml4dHVyZSgpO1xuICBjb25zdCBhY2NlbGVyYXRvciA9IG5ldyBnYS5BY2NlbGVyYXRvcihzdGFjaywgJ0FjY2VsZXJhdG9yJyk7XG4gIGNvbnN0IGxpc3RlbmVyID0gbmV3IGdhLkxpc3RlbmVyKHN0YWNrLCAnTGlzdGVuZXInLCB7XG4gICAgYWNjZWxlcmF0b3IsXG4gICAgcG9ydFJhbmdlczogW1xuICAgICAge1xuICAgICAgICBmcm9tUG9ydDogNDQzLFxuICAgICAgICB0b1BvcnQ6IDQ0MyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfSk7XG4gIGNvbnN0IGVuZHBvaW50R3JvdXAgPSBuZXcgZ2EuRW5kcG9pbnRHcm91cChzdGFjaywgJ0dyb3VwJywgeyBsaXN0ZW5lciB9KTtcblxuICAvLyBXSEVOXG4gIGNvbnN0IGdhU2cgPSBlbmRwb2ludEdyb3VwLmNvbm5lY3Rpb25zUGVlcignR2xvYmFsQWNjZWxlcmF0b3JTRycsIHZwYyk7XG4gIGNvbnN0IGluc3RhbmNlU2cgPSBuZXcgZWMyLlNlY3VyaXR5R3JvdXAoc3RhY2ssICdTRycsIHsgdnBjIH0pO1xuICBjb25zdCBpbnN0YW5jZUNvbm5lY3Rpb25zID0gbmV3IGVjMi5Db25uZWN0aW9ucyh7IHNlY3VyaXR5R3JvdXBzOiBbaW5zdGFuY2VTZ10gfSk7XG4gIGluc3RhbmNlQ29ubmVjdGlvbnMuYWxsb3dGcm9tKGdhU2csIGVjMi5Qb3J0LnRjcCg0NDMpKTtcblxuICAvLyBUSEVOXG4gIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDMjo6U2VjdXJpdHlHcm91cEluZ3Jlc3MnLCB7XG4gICAgSXBQcm90b2NvbDogJ3RjcCcsXG4gICAgRnJvbVBvcnQ6IDQ0MyxcbiAgICBHcm91cElkOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ1NHQURCNTM5MzcnLFxuICAgICAgICAnR3JvdXBJZCcsXG4gICAgICBdLFxuICAgIH0sXG4gICAgU291cmNlU2VjdXJpdHlHcm91cElkOiB7XG4gICAgICAnRm46OkdldEF0dCc6IFtcbiAgICAgICAgJ0dyb3VwR2xvYmFsQWNjZWxlcmF0b3JTR0N1c3RvbVJlc291cmNlMEM4MDU2RTknLFxuICAgICAgICAnU2VjdXJpdHlHcm91cHMuMC5Hcm91cElkJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBUb1BvcnQ6IDQ0MyxcbiAgfSk7XG59KTtcbiJdfQ==