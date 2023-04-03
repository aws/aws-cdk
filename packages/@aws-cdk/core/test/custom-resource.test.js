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
        expect(util_1.toCloudFormation(stack)).toEqual({
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
        expect(util_1.toCloudFormation(stack)).toEqual({
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
        expect(util_1.toCloudFormation(stack)).toEqual({
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
        expect(util_1.toCloudFormation(stack)).toEqual({
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
        expect(util_1.toCloudFormation(stack)).toEqual({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLXJlc291cmNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjdXN0b20tcmVzb3VyY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUEwQztBQUMxQyxnQ0FBOEQ7QUFFOUQsUUFBUSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtJQUMvQixJQUFJLENBQUMsa0RBQWtELEVBQUUsR0FBRyxFQUFFO1FBQzVELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLG9CQUFjLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO1lBQzVDLFlBQVksRUFBRSxnQkFBZ0I7WUFDOUIsVUFBVSxFQUFFO2dCQUNWLEtBQUssRUFBRSxLQUFLO2dCQUNaLEtBQUssRUFBRSxLQUFLO2FBQ2I7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLHVCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3RDLFNBQVMsRUFBRTtnQkFDVCxnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLHFDQUFxQztvQkFDM0MsVUFBVSxFQUFFO3dCQUNWLFlBQVksRUFBRSxnQkFBZ0I7d0JBQzlCLEtBQUssRUFBRSxLQUFLO3dCQUNaLEtBQUssRUFBRSxLQUFLO3FCQUNiO29CQUNELG1CQUFtQixFQUFFLFFBQVE7b0JBQzdCLGNBQWMsRUFBRSxRQUFRO2lCQUN6QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0NBQWdDLEVBQUUsR0FBRyxFQUFFO1FBQzFDLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLG9CQUFjLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO1lBQzVDLFlBQVksRUFBRSxnQkFBZ0I7WUFDOUIsWUFBWSxFQUFFLHdCQUF3QjtTQUN2QyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLHVCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3RDLFNBQVMsRUFBRTtnQkFDVCxnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLHdCQUF3QjtvQkFDOUIsVUFBVSxFQUFFO3dCQUNWLFlBQVksRUFBRSxnQkFBZ0I7cUJBQy9CO29CQUNELG1CQUFtQixFQUFFLFFBQVE7b0JBQzdCLGNBQWMsRUFBRSxRQUFRO2lCQUN6QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1FBQzFCLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxJQUFJLG9CQUFjLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO1lBQzVDLFlBQVksRUFBRSxnQkFBZ0I7WUFDOUIsYUFBYSxFQUFFLG1CQUFhLENBQUMsTUFBTTtTQUNwQyxDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLHVCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3RDLFNBQVMsRUFBRTtnQkFDVCxnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLHFDQUFxQztvQkFDM0MsVUFBVSxFQUFFO3dCQUNWLFlBQVksRUFBRSxnQkFBZ0I7cUJBQy9CO29CQUNELG1CQUFtQixFQUFFLFFBQVE7b0JBQzdCLGNBQWMsRUFBRSxRQUFRO2lCQUN6QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1FBQ3BELFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQUssRUFBRSxDQUFDO1FBRTFCLE9BQU87UUFDUCxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxvQkFBYyxDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtZQUN6RCxZQUFZLEVBQUUsZ0JBQWdCO1lBQzlCLFlBQVksRUFBRSxRQUFRO1NBQ3ZCLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO0lBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDZEQUE2RCxFQUFFLEdBQUcsRUFBRTtRQUN2RSxRQUFRO1FBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLEVBQUUsQ0FBQztRQUUxQixPQUFPO1FBQ1AsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7WUFDekQsWUFBWSxFQUFFLCtEQUErRDtZQUM3RSxZQUFZLEVBQUUsUUFBUTtTQUV2QixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQztJQUNsRCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxHQUFHLEVBQUU7UUFDMUMsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7WUFDNUMsWUFBWSxFQUFFLGdCQUFnQjtZQUM5QixvQkFBb0IsRUFBRSxJQUFJO1lBQzFCLFVBQVUsRUFBRTtnQkFDVixLQUFLLEVBQUUsS0FBSztnQkFDWixJQUFJLEVBQUU7b0JBQ0osY0FBYyxFQUFFLElBQUk7aUJBQ3JCO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxPQUFPO1FBQ1AsTUFBTSxDQUFDLHVCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3RDLFNBQVMsRUFBRTtnQkFDVCxnQkFBZ0IsRUFBRTtvQkFDaEIsSUFBSSxFQUFFLHFDQUFxQztvQkFDM0MsVUFBVSxFQUFFO3dCQUNWLFlBQVksRUFBRSxnQkFBZ0I7d0JBQzlCLEtBQUssRUFBRSxLQUFLO3dCQUNaLElBQUksRUFBRTs0QkFDSixjQUFjLEVBQUUsSUFBSTt5QkFDckI7cUJBQ0Y7b0JBQ0QsbUJBQW1CLEVBQUUsUUFBUTtvQkFDN0IsY0FBYyxFQUFFLFFBQVE7aUJBQ3pCO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQywrQ0FBK0MsRUFBRSxHQUFHLEVBQUU7UUFDekQsUUFBUTtRQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFFMUIsT0FBTztRQUNQLElBQUksb0JBQWMsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7WUFDNUMsWUFBWSxFQUFFLGdCQUFnQjtZQUM5QixVQUFVLEVBQUU7Z0JBQ1YsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osSUFBSSxFQUFFO29CQUNKLGNBQWMsRUFBRSxJQUFJO2lCQUNyQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsT0FBTztRQUNQLE1BQU0sQ0FBQyx1QkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN0QyxTQUFTLEVBQUU7Z0JBQ1QsZ0JBQWdCLEVBQUU7b0JBQ2hCLElBQUksRUFBRSxxQ0FBcUM7b0JBQzNDLFVBQVUsRUFBRTt3QkFDVixZQUFZLEVBQUUsZ0JBQWdCO3dCQUM5QixLQUFLLEVBQUUsS0FBSzt3QkFDWixJQUFJLEVBQUU7NEJBQ0osY0FBYyxFQUFFLElBQUk7eUJBQ3JCO3FCQUNGO29CQUNELG1CQUFtQixFQUFFLFFBQVE7b0JBQzdCLGNBQWMsRUFBRSxRQUFRO2lCQUN6QjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRvQ2xvdWRGb3JtYXRpb24gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgQ3VzdG9tUmVzb3VyY2UsIFJlbW92YWxQb2xpY3ksIFN0YWNrIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ2N1c3RvbSByZXNvdXJjZScsICgpID0+IHtcbiAgdGVzdCgnc2ltcGxlIGNhc2UgcHJvdmlkZXIgaWRlbnRpZmllZCBieSBzZXJ2aWNlIHRva2VuJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdNeUN1c3RvbVJlc291cmNlJywge1xuICAgICAgc2VydmljZVRva2VuOiAnTXlTZXJ2aWNlVG9rZW4nLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBQcm9wMTogJ2JvbycsXG4gICAgICAgIFByb3AyOiAnYmFyJyxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeUN1c3RvbVJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6Q2xvdWRGb3JtYXRpb246OkN1c3RvbVJlc291cmNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBTZXJ2aWNlVG9rZW46ICdNeVNlcnZpY2VUb2tlbicsXG4gICAgICAgICAgICBQcm9wMTogJ2JvbycsXG4gICAgICAgICAgICBQcm9wMjogJ2JhcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBVcGRhdGVSZXBsYWNlUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgICBEZWxldGlvblBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdyZXNvdXJjZSB0eXBlIGNhbiBiZSBzcGVjaWZpZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBDdXN0b21SZXNvdXJjZShzdGFjaywgJ015Q3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46ICdNeVNlcnZpY2VUb2tlbicsXG4gICAgICByZXNvdXJjZVR5cGU6ICdDdXN0b206Ok15UmVzb3VyY2VUeXBlJyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15Q3VzdG9tUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnQ3VzdG9tOjpNeVJlc291cmNlVHlwZScsXG4gICAgICAgICAgUHJvcGVydGllczoge1xuICAgICAgICAgICAgU2VydmljZVRva2VuOiAnTXlTZXJ2aWNlVG9rZW4nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncmVtb3ZhbCBwb2xpY3knLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIG5ldyBDdXN0b21SZXNvdXJjZShzdGFjaywgJ015Q3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgICBzZXJ2aWNlVG9rZW46ICdNeVNlcnZpY2VUb2tlbicsXG4gICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LlJFVEFJTixcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15Q3VzdG9tUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2UnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFNlcnZpY2VUb2tlbjogJ015U2VydmljZVRva2VuJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdSZXRhaW4nLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnUmV0YWluJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ3Jlc291cmNlIHR5cGUgbXVzdCBiZWdpbiB3aXRoIFwiQ3VzdG9tOjpcIicsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KCgpID0+IG5ldyBDdXN0b21SZXNvdXJjZShzdGFjaywgJ015Q3VzdG9tUmVzb3VyY2UnLCB7XG4gICAgICByZXNvdXJjZVR5cGU6ICdNeVJlc291cmNlVHlwZScsXG4gICAgICBzZXJ2aWNlVG9rZW46ICdGb29CYXInLFxuICAgIH0pKS50b1Rocm93KC9DdXN0b20gcmVzb3VyY2UgdHlwZSBtdXN0IGJlZ2luIHdpdGggXCJDdXN0b206OlwiLyk7XG4gIH0pO1xuXG4gIHRlc3QoJ0N1c3RvbSByZXNvdXJjZSB0eXBlIGxlbmd0aCBtdXN0IGJlIGxlc3MgdGhhbiA2MCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBleHBlY3QoKCkgPT4gbmV3IEN1c3RvbVJlc291cmNlKHN0YWNrLCAnTXlDdXN0b21SZXNvdXJjZScsIHtcbiAgICAgIHJlc291cmNlVHlwZTogJ0N1c3RvbTo6QWRkaW5nX0FuX0FkZGl0aW9uYWxfRmlmdHlfVGhyZWVfQ2hhcmFjdGVyc19Gb3JfRXJyb3InLFxuICAgICAgc2VydmljZVRva2VuOiAnRm9vQmFyJyxcbiAgICAgIC8vIFRIRU5cbiAgICB9KSkudG9UaHJvdygvQ3VzdG9tIHJlc291cmNlIHR5cGUgbGVuZ3RoID4gNjAvKTtcbiAgfSk7XG5cbiAgdGVzdCgncHJvcGVydGllcyBjYW4gYmUgcGFzY2FsLWNhc2VkJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdNeUN1c3RvbVJlc291cmNlJywge1xuICAgICAgc2VydmljZVRva2VuOiAnTXlTZXJ2aWNlVG9rZW4nLFxuICAgICAgcGFzY2FsQ2FzZVByb3BlcnRpZXM6IHRydWUsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIHByb3AxOiAnYm9vJyxcbiAgICAgICAgYm9vbToge1xuICAgICAgICAgIG9ubHlGaXJzdExldmVsOiAxMjM0LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUmVzb3VyY2VzOiB7XG4gICAgICAgIE15Q3VzdG9tUmVzb3VyY2U6IHtcbiAgICAgICAgICBUeXBlOiAnQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2UnLFxuICAgICAgICAgIFByb3BlcnRpZXM6IHtcbiAgICAgICAgICAgIFNlcnZpY2VUb2tlbjogJ015U2VydmljZVRva2VuJyxcbiAgICAgICAgICAgIFByb3AxOiAnYm9vJyxcbiAgICAgICAgICAgIEJvb206IHtcbiAgICAgICAgICAgICAgb25seUZpcnN0TGV2ZWw6IDEyMzQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgVXBkYXRlUmVwbGFjZVBvbGljeTogJ0RlbGV0ZScsXG4gICAgICAgICAgRGVsZXRpb25Qb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgdGVzdCgncGFzY2FsLWNhc2luZyBvZiBwcm9wcyBpcyBkaXNhYmxlZCBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIC8vIFdIRU5cbiAgICBuZXcgQ3VzdG9tUmVzb3VyY2Uoc3RhY2ssICdNeUN1c3RvbVJlc291cmNlJywge1xuICAgICAgc2VydmljZVRva2VuOiAnTXlTZXJ2aWNlVG9rZW4nLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBwcm9wMTogJ2JvbycsXG4gICAgICAgIGJvb206IHtcbiAgICAgICAgICBvbmx5Rmlyc3RMZXZlbDogMTIzNCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJlc291cmNlczoge1xuICAgICAgICBNeUN1c3RvbVJlc291cmNlOiB7XG4gICAgICAgICAgVHlwZTogJ0FXUzo6Q2xvdWRGb3JtYXRpb246OkN1c3RvbVJlc291cmNlJyxcbiAgICAgICAgICBQcm9wZXJ0aWVzOiB7XG4gICAgICAgICAgICBTZXJ2aWNlVG9rZW46ICdNeVNlcnZpY2VUb2tlbicsXG4gICAgICAgICAgICBwcm9wMTogJ2JvbycsXG4gICAgICAgICAgICBib29tOiB7XG4gICAgICAgICAgICAgIG9ubHlGaXJzdExldmVsOiAxMjM0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIFVwZGF0ZVJlcGxhY2VQb2xpY3k6ICdEZWxldGUnLFxuICAgICAgICAgIERlbGV0aW9uUG9saWN5OiAnRGVsZXRlJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=