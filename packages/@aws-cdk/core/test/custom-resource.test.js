"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const lib_1 = require("../lib");
describe('custom resource', () => {
    test('simple case provider identified by service token', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        new lib_1.CustomResource(stack, 'MyCustomResource', {
            serviceToken: 'MyServiceToken',
            properties: {
                Prop1: 'boo',
                Prop2: 'bar',
            },
        });
        // THEN
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                MyCustomResource: {
                    Type: 'AWS::CloudFormation::CustomResource',
                    Properties: {
                        ServiceToken: 'MyServiceToken',
                        Prop1: 'boo',
                        Prop2: 'bar',
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete',
                },
            },
        });
    });
    test('resource type can be specified', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        new lib_1.CustomResource(stack, 'MyCustomResource', {
            serviceToken: 'MyServiceToken',
            resourceType: 'Custom::MyResourceType',
        });
        // THEN
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                MyCustomResource: {
                    Type: 'Custom::MyResourceType',
                    Properties: {
                        ServiceToken: 'MyServiceToken',
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete',
                },
            },
        });
    });
    test('removal policy', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        new lib_1.CustomResource(stack, 'MyCustomResource', {
            serviceToken: 'MyServiceToken',
            removalPolicy: lib_1.RemovalPolicy.RETAIN,
        });
        // THEN
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                MyCustomResource: {
                    Type: 'AWS::CloudFormation::CustomResource',
                    Properties: {
                        ServiceToken: 'MyServiceToken',
                    },
                    UpdateReplacePolicy: 'Retain',
                    DeletionPolicy: 'Retain',
                },
            },
        });
    });
    test('resource type must begin with "Custom::"', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // THEN
        expect(() => new lib_1.CustomResource(stack, 'MyCustomResource', {
            resourceType: 'MyResourceType',
            serviceToken: 'FooBar',
        })).toThrow(/Custom resource type must begin with "Custom::"/);
    });
    test('Custom resource type length must be less than 60 characters', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        expect(() => new lib_1.CustomResource(stack, 'MyCustomResource', {
            resourceType: 'Custom::Adding_An_Additional_Fifty_Three_Characters_For_Error',
            serviceToken: 'FooBar',
            // THEN
        })).toThrow(/Custom resource type length > 60/);
    });
    test('properties can be pascal-cased', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        new lib_1.CustomResource(stack, 'MyCustomResource', {
            serviceToken: 'MyServiceToken',
            pascalCaseProperties: true,
            properties: {
                prop1: 'boo',
                boom: {
                    onlyFirstLevel: 1234,
                },
            },
        });
        // THEN
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                MyCustomResource: {
                    Type: 'AWS::CloudFormation::CustomResource',
                    Properties: {
                        ServiceToken: 'MyServiceToken',
                        Prop1: 'boo',
                        Boom: {
                            onlyFirstLevel: 1234,
                        },
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete',
                },
            },
        });
    });
    test('pascal-casing of props is disabled by default', () => {
        // GIVEN
        const stack = new lib_1.Stack();
        // WHEN
        new lib_1.CustomResource(stack, 'MyCustomResource', {
            serviceToken: 'MyServiceToken',
            properties: {
                prop1: 'boo',
                boom: {
                    onlyFirstLevel: 1234,
                },
            },
        });
        // THEN
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Resources: {
                MyCustomResource: {
                    Type: 'AWS::CloudFormation::CustomResource',
                    Properties: {
                        ServiceToken: 'MyServiceToken',
                        prop1: 'boo',
                        boom: {
                            onlyFirstLevel: 1234,
                        },
                    },
                    UpdateReplacePolicy: 'Delete',
                    DeletionPolicy: 'Delete',
                },
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXJlc291cmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjdXN0b20tcmVzb3VyY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUEwQztBQUMxQyxnQ0FBOEQ7QUFFOUQsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1FBQzVELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLG9CQUFjLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO1lBQzVDLFlBQVksRUFBRSxnQkFBZ0I7WUFDOUIsVUFBVSxFQUFFO2dCQUNWLEtBQUssRUFBRSxLQUFLO2dCQUNaLEtBQUssRUFBRSxLQUFLO2FBQ2I7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLElBQUEsdUJBQWdCLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDdEMsU0FBUyxFQUFFO2dCQUNULGdCQUFnQixFQUFFO29CQUNoQixJQUFJLEVBQUUscUNBQXFDO29CQUMzQyxVQUFVLEVBQUU7d0JBQ1YsWUFBWSxFQUFFLGdCQUFnQjt3QkFDOUIsS0FBSyxFQUFFLEtBQUs7d0JBQ1osS0FBSyxFQUFFLEtBQUs7cUJBQ2I7b0JBQ0QsbUJBQW1CLEVBQUUsUUFBUTtvQkFDN0IsY0FBYyxFQUFFLFFBQVE7aUJBQ3pCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7UUFDMUMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7WUFDNUMsWUFBWSxFQUFF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QUFFO3dCQUNWLFlBQVksRUFBRSxnQkFBZ0I7d0JBQzlCLEtBQUssRUFBRSxLQUFLO3dCQUNaLElBQUksRUFBRTs0QkFDSixjQUFjLEVBQUUsSUFBSTt5QkFDckI7cUJBQ0Y7b0JBQ0QsbUJBQW1CLEVBQUUsUUFBUTtvQkFDN0IsY0FBYyxFQUFFLFFBQVE7aUJBQ3pCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7UUFDekQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7WUFDNUMsWUFBWSxFQUFFLGdCQUFnQjtZQUM5QixVQUFVLEVBQUU7Z0JBQ1YsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osSUFBSSxFQUFFO29CQUNKLGNBQWMsRUFBRSxJQUFJO2lCQUNyQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyxJQUFBLHVCQUFnQixFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3RDLFNBQVMsRUFBRTtnQkFDVCxnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLHFDQUFxQztvQkFDM0MsVUFBVSxFQUFFO3dCQUNWLFlBQVksRUFBRSxnQkFBZ0I7d0JBQzlCLEtBQUssRUFBRSxLQUFLO3dCQUNaLElBQUksRUFBRTs0QkFDSixjQUFjLEVBQUUsSUFBSTt5QkFDckI7cUJBQ0Y7b0JBQ0QsbUJBQW1CLEVBQUUsUUFBUTtvQkFDN0IsY0FBYyxFQUFFLFFBQVE7aUJBQ3pCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdG9DbG91ZEZvcm1hdGlvbiB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZSwgUmVtb3ZhbFBvbGljeSwgU3RhY2sgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnY3VzdG9tIHJlc291cmNlJywgKCkgPT4ge1xuICB0ZXN0KCdzaW1wbGUgY2FzZSBwcm92aWRlciBpZGVudGlmaWVkIGJ5IHNlcnZpY2UgdG9rZW4nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBDdXN0b21SZXNvdXJjZShzdGFjaywgJ015Q3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46ICdNeVNlcnZpY2VUb2tlbicsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFByb3AxOiAnYm9vJyxcbiAgICAgICAgUHJvcDI6ICdiYXInLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15Q3VzdG9tUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2UnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFNlcnZpY2VUb2tlbjogJ015U2VydmljZVRva2VuJyxcbiAgICAgICAgICAgIFByb3AxOiAnYm9vJyxcbiAgICAgICAgICAgIFByb3AyOiAnYmFyJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc291cmNlIHR5cGUgY2FuIGJlIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEN1c3RvbVJlc291cmNlKHN0YWNrLCAnTXlDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogJ015U2VydmljZVRva2VuJyxcbiAgICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6TXlSZXNvdXJjZVR5cGUnLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlDdXN0b21SZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdDdXN0b206Ok15UmVzb3VyY2VUeXBlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBTZXJ2aWNlVG9rZW46ICdNeVNlcnZpY2VUb2tlbicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZW1vdmFsIHBvbGljeScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgbmV3IEN1c3RvbVJlc291cmNlKHN0YWNrLCAnTXlDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogJ015U2VydmljZVRva2VuJyxcbiAgICAgIHJlbW92YWxQb2xpY3k6IFJlbW92YWxQb2xpY3kuUkVUQUlOLFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlDdXN0b21SZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkNsb3VkRm9ybWF0aW9uOjpDdXN0b21SZXNvdXJjZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgU2VydmljZVRva2VuOiAnTXlTZXJ2aWNlVG9rZW4nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ1JldGFpbicsXG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdSZXRhaW4nLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVzb3VyY2UgdHlwZSBtdXN0IGJlZ2luIHdpdGggXCJDdXN0b206OlwiJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IEN1c3RvbVJlc291cmNlKHN0YWNrLCAnTXlDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgIHJlc291cmNlVHlwZTogJ015UmVzb3VyY2VUeXBlJyxcbiAgICAgIHNlcnZpY2VUb2tlbjogJ0Zvb0JhcicsXG4gICAgfSkpLnRvVGhyb3coL0N1c3RvbSByZXNvdXJjZSB0eXBlIG11c3QgYmVnaW4gd2l0aCBcIkN1c3RvbTo6XCIvKTtcbiAgfSk7XG5cbiAgdGVzdCgnQ3VzdG9tIHJlc291cmNlIHR5cGUgbGVuZ3RoIG11c3QgYmUgbGVzcyB0aGFuIDYwIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGV4cGVjdCgoKSA9PiBuZXcgQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdNeUN1c3RvbVJlc291cmNlJywge1xuICAgICAgcmVzb3VyY2VUeXBlOiAnQ3VzdG9tOjpBZGRpbmdfQW5fQWRkaXRpb25hbF9GaWZ0eV9UaHJlZV9DaGFyYWN0ZXJzX0Zvcl9FcnJvcicsXG4gICAgICBzZXJ2aWNlVG9rZW46ICdGb29CYXInLFxuICAgICAgLy8gVEhFTlxuICAgIH0pKS50b1Rocm93KC9DdXN0b20gcmVzb3VyY2UgdHlwZSBsZW5ndGggPiA2MC8pO1xuICB9KTtcblxuICB0ZXN0KCdwcm9wZXJ0aWVzIGNhbiBiZSBwYXNjYWwtY2FzZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBDdXN0b21SZXNvdXJjZShzdGFjaywgJ015Q3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46ICdNeVNlcnZpY2VUb2tlbicsXG4gICAgICBwYXNjYWxDYXNlUHJvcGVydGllczogdHJ1ZSxcbiAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgcHJvcDE6ICdib28nLFxuICAgICAgICBib29tOiB7XG4gICAgICAgICAgb25seUZpcnN0TGV2ZWw6IDEyMzQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh0b0Nsb3VkRm9ybWF0aW9uKHN0YWNrKSkudG9FcXVhbCh7XG4gICAgICBSZXNvdXJjZXM6IHtcbiAgICAgICAgTXlDdXN0b21SZXNvdXJjZToge1xuICAgICAgICAgIFR5cGU6ICdBV1M6OkNsb3VkRm9ybWF0aW9uOjpDdXN0b21SZXNvdXJjZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgU2VydmljZVRva2VuOiAnTXlTZXJ2aWNlVG9rZW4nLFxuICAgICAgICAgICAgUHJvcDE6ICdib28nLFxuICAgICAgICAgICAgQm9vbToge1xuICAgICAgICAgICAgICBvbmx5Rmlyc3RMZXZlbDogMTIzNCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdwYXNjYWwtY2FzaW5nIG9mIHByb3BzIGlzIGRpc2FibGVkIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBDdXN0b21SZXNvdXJjZShzdGFjaywgJ015Q3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46ICdNeVNlcnZpY2VUb2tlbicsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHByb3AxOiAnYm9vJyxcbiAgICAgICAgYm9vbToge1xuICAgICAgICAgIG9ubHlGaXJzdExldmVsOiAxMjM0LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15Q3VzdG9tUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2UnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFNlcnZpY2VUb2tlbjogJ015U2VydmljZVRva2VuJyxcbiAgICAgICAgICAgIHByb3AxOiAnYm9vJyxcbiAgICAgICAgICAgIGJvb206IHtcbiAgICAgICAgICAgICAgb25seUZpcnN0TGV2ZWw6IDEyMzQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==