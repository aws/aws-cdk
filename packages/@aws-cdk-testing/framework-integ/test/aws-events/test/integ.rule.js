"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const aws_events_1 = require("aws-cdk-lib/aws-events");
const app = new aws_cdk_lib_1.App();
const stack = new aws_cdk_lib_1.Stack(app, 'RuleStack');
new aws_events_1.Rule(stack, 'MyRule', {
    eventPattern: {
        account: ['account1', 'account2'],
        detail: {
            foo: [1, 2],
            strings: ['foo', 'bar'],
            rangeMatcher: aws_events_1.Match.interval(-1, 1),
            stringMatcher: aws_events_1.Match.exactString('I am just a string'),
            prefixMatcher: aws_events_1.Match.prefix('aws.'),
            ipAddress: aws_events_1.Match.ipAddressRange('192.0.2.0/24'),
            shouldExist: aws_events_1.Match.exists(),
            shouldNotExist: aws_events_1.Match.doesNotExist(),
            numbers: aws_events_1.Match.allOf(aws_events_1.Match.greaterThan(0), aws_events_1.Match.lessThan(5)),
            topLevel: {
                deeper: aws_events_1.Match.equal(42),
                oneMoreLevel: {
                    deepest: aws_events_1.Match.anyOf(aws_events_1.Match.lessThanOrEqual(-1), aws_events_1.Match.greaterThanOrEqual(1)),
                },
            },
            state: aws_events_1.Match.anythingBut('initializing'),
            limit: aws_events_1.Match.anythingBut(100, 200, 300),
            notPrefixedBy: aws_events_1.Match.anythingButPrefix('sensitive-'),
            suffix: aws_events_1.Match.suffix('.com'),
            equalsIgnoreCase: aws_events_1.Match.equalsIgnoreCase('ignore case'),
        },
        detailType: ['detailType1'],
        id: ['id1', 'id2'],
        region: ['region1', 'region2', 'region3'],
        resources: ['r1'],
        source: ['src1', 'src2'],
        time: ['t1'],
        version: ['0'],
    },
});
new integ_tests_alpha_1.IntegTest(app, 'IntegTest-BatchDefaultEnvVarsStack', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBeUM7QUFDekMsa0VBQXVEO0FBQ3ZELHVEQUFxRDtBQUVyRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUV0QixNQUFNLEtBQUssR0FBRyxJQUFJLG1CQUFLLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBRzFDLElBQUksaUJBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFO0lBQ3hCLFlBQVksRUFBRTtRQUNaLE9BQU8sRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7UUFDakMsTUFBTSxFQUFFO1lBQ04sR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNYLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7WUFDdkIsWUFBWSxFQUFFLGtCQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNuQyxhQUFhLEVBQUUsa0JBQUssQ0FBQyxXQUFXLENBQUMsb0JBQW9CLENBQUM7WUFDdEQsYUFBYSxFQUFFLGtCQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNuQyxTQUFTLEVBQUUsa0JBQUssQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDO1lBQy9DLFdBQVcsRUFBRSxrQkFBSyxDQUFDLE1BQU0sRUFBRTtZQUMzQixjQUFjLEVBQUUsa0JBQUssQ0FBQyxZQUFZLEVBQUU7WUFDcEMsT0FBTyxFQUFFLGtCQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFLGtCQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdELFFBQVEsRUFBRTtnQkFDUixNQUFNLEVBQUUsa0JBQUssQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO2dCQUN2QixZQUFZLEVBQUU7b0JBQ1osT0FBTyxFQUFFLGtCQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsa0JBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDN0U7YUFDRjtZQUNELEtBQUssRUFBRSxrQkFBSyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUM7WUFDeEMsS0FBSyxFQUFFLGtCQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1lBQ3ZDLGFBQWEsRUFBRSxrQkFBSyxDQUFDLGlCQUFpQixDQUFDLFlBQVksQ0FBQztZQUNwRCxNQUFNLEVBQUUsa0JBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQzVCLGdCQUFnQixFQUFFLGtCQUFLLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDO1NBQ3hEO1FBQ0QsVUFBVSxFQUFFLENBQUMsYUFBYSxDQUFDO1FBQzNCLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUM7UUFDbEIsTUFBTSxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7UUFDekMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ2pCLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUM7UUFDeEIsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDO1FBQ1osT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO0tBQ2Y7Q0FDRixDQUFDLENBQUM7QUFFSCxJQUFJLDZCQUFTLENBQUMsR0FBRyxFQUFFLG9DQUFvQyxFQUFFO0lBQ3ZELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgUnVsZSwgTWF0Y2ggfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZXZlbnRzJztcblxuY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdSdWxlU3RhY2snKTtcblxuXG5uZXcgUnVsZShzdGFjaywgJ015UnVsZScsIHtcbiAgZXZlbnRQYXR0ZXJuOiB7XG4gICAgYWNjb3VudDogWydhY2NvdW50MScsICdhY2NvdW50MiddLFxuICAgIGRldGFpbDoge1xuICAgICAgZm9vOiBbMSwgMl0sXG4gICAgICBzdHJpbmdzOiBbJ2ZvbycsICdiYXInXSxcbiAgICAgIHJhbmdlTWF0Y2hlcjogTWF0Y2guaW50ZXJ2YWwoLTEsIDEpLFxuICAgICAgc3RyaW5nTWF0Y2hlcjogTWF0Y2guZXhhY3RTdHJpbmcoJ0kgYW0ganVzdCBhIHN0cmluZycpLFxuICAgICAgcHJlZml4TWF0Y2hlcjogTWF0Y2gucHJlZml4KCdhd3MuJyksXG4gICAgICBpcEFkZHJlc3M6IE1hdGNoLmlwQWRkcmVzc1JhbmdlKCcxOTIuMC4yLjAvMjQnKSxcbiAgICAgIHNob3VsZEV4aXN0OiBNYXRjaC5leGlzdHMoKSxcbiAgICAgIHNob3VsZE5vdEV4aXN0OiBNYXRjaC5kb2VzTm90RXhpc3QoKSxcbiAgICAgIG51bWJlcnM6IE1hdGNoLmFsbE9mKE1hdGNoLmdyZWF0ZXJUaGFuKDApLCBNYXRjaC5sZXNzVGhhbig1KSksXG4gICAgICB0b3BMZXZlbDoge1xuICAgICAgICBkZWVwZXI6IE1hdGNoLmVxdWFsKDQyKSxcbiAgICAgICAgb25lTW9yZUxldmVsOiB7XG4gICAgICAgICAgZGVlcGVzdDogTWF0Y2guYW55T2YoTWF0Y2gubGVzc1RoYW5PckVxdWFsKC0xKSwgTWF0Y2guZ3JlYXRlclRoYW5PckVxdWFsKDEpKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBzdGF0ZTogTWF0Y2guYW55dGhpbmdCdXQoJ2luaXRpYWxpemluZycpLFxuICAgICAgbGltaXQ6IE1hdGNoLmFueXRoaW5nQnV0KDEwMCwgMjAwLCAzMDApLFxuICAgICAgbm90UHJlZml4ZWRCeTogTWF0Y2guYW55dGhpbmdCdXRQcmVmaXgoJ3NlbnNpdGl2ZS0nKSxcbiAgICAgIHN1ZmZpeDogTWF0Y2guc3VmZml4KCcuY29tJyksXG4gICAgICBlcXVhbHNJZ25vcmVDYXNlOiBNYXRjaC5lcXVhbHNJZ25vcmVDYXNlKCdpZ25vcmUgY2FzZScpLFxuICAgIH0sXG4gICAgZGV0YWlsVHlwZTogWydkZXRhaWxUeXBlMSddLFxuICAgIGlkOiBbJ2lkMScsICdpZDInXSxcbiAgICByZWdpb246IFsncmVnaW9uMScsICdyZWdpb24yJywgJ3JlZ2lvbjMnXSxcbiAgICByZXNvdXJjZXM6IFsncjEnXSxcbiAgICBzb3VyY2U6IFsnc3JjMScsICdzcmMyJ10sXG4gICAgdGltZTogWyd0MSddLFxuICAgIHZlcnNpb246IFsnMCddLFxuICB9LFxufSk7XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAnSW50ZWdUZXN0LUJhdGNoRGVmYXVsdEVudlZhcnNTdGFjaycsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7XG4iXX0=