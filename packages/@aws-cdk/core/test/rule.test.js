"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const lib_1 = require("../lib");
describe('rule', () => {
    test('Rule can be used to create rules', () => {
        const stack = new lib_1.Stack();
        const rule = new lib_1.CfnRule(stack, 'MyRule');
        rule.addAssertion(lib_1.Fn.conditionEquals('lhs', 'rhs'), 'lhs equals rhs');
        rule.addAssertion(lib_1.Fn.conditionNot(lib_1.Fn.conditionAnd(lib_1.Fn.conditionContains(['hello', 'world'], 'world'))), 'some assertion');
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Rules: {
                MyRule: {
                    Assertions: [
                        {
                            Assert: { 'Fn::Equals': ['lhs', 'rhs'] },
                            AssertDescription: 'lhs equals rhs',
                        },
                        {
                            Assert: { 'Fn::Not': [{ 'Fn::Contains': [['hello', 'world'], 'world'] }] },
                            AssertDescription: 'some assertion',
                        },
                    ],
                },
            },
        });
    });
    test('a template can contain multiple Rules', () => {
        const stack = new lib_1.Stack();
        new lib_1.CfnRule(stack, 'Rule1');
        new lib_1.CfnRule(stack, 'Rule2');
        expect((0, util_1.toCloudFormation)(stack)).toEqual({
            Rules: {
                Rule1: {},
                Rule2: {},
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnVsZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQTBDO0FBQzFDLGdDQUE0QztBQUU1QyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUNwQixJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1FBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFFMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxhQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBRSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQUUsQ0FBQyxZQUFZLENBQUMsUUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFekgsTUFBTSxDQUFDLElBQUEsdUJBQWdCLEVBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDdEMsS0FBSyxFQUFFO2dCQUNMLE1BQU0sRUFBRTtvQkFDTixVQUFVLEVBQUU7d0JBQ1Y7NEJBQ0UsTUFBTSxFQUFFLEVBQUUsWUFBWSxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFOzRCQUN4QyxpQkFBaUIsRUFBRSxnQkFBZ0I7eUJBQ3BDO3dCQUNEOzRCQUNFLE1BQU0sRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFOzRCQUMxRSxpQkFBaUIsRUFBRSxnQkFBZ0I7eUJBQ3BDO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7UUFDakQsTUFBTSxLQUFLLEdBQUcsSUFBSSxXQUFLLEVBQUUsQ0FBQztRQUUxQixJQUFJLGFBQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDNUIsSUFBSSxhQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRTVCLE1BQU0sQ0FBQyxJQUFBLHVCQUFnQixFQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3RDLEtBQUssRUFBRTtnQkFDTCxLQUFLLEVBQUUsRUFBRTtnQkFDVCxLQUFLLEVBQUUsRUFBRTthQUNWO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRvQ2xvdWRGb3JtYXRpb24gfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgQ2ZuUnVsZSwgRm4sIFN0YWNrIH0gZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ3J1bGUnLCAoKSA9PiB7XG4gIHRlc3QoJ1J1bGUgY2FuIGJlIHVzZWQgdG8gY3JlYXRlIHJ1bGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBjb25zdCBydWxlID0gbmV3IENmblJ1bGUoc3RhY2ssICdNeVJ1bGUnKTtcbiAgICBydWxlLmFkZEFzc2VydGlvbihGbi5jb25kaXRpb25FcXVhbHMoJ2xocycsICdyaHMnKSwgJ2xocyBlcXVhbHMgcmhzJyk7XG4gICAgcnVsZS5hZGRBc3NlcnRpb24oRm4uY29uZGl0aW9uTm90KEZuLmNvbmRpdGlvbkFuZChGbi5jb25kaXRpb25Db250YWlucyhbJ2hlbGxvJywgJ3dvcmxkJ10sICd3b3JsZCcpKSksICdzb21lIGFzc2VydGlvbicpO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJ1bGVzOiB7XG4gICAgICAgIE15UnVsZToge1xuICAgICAgICAgIEFzc2VydGlvbnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgQXNzZXJ0OiB7ICdGbjo6RXF1YWxzJzogWydsaHMnLCAncmhzJ10gfSxcbiAgICAgICAgICAgICAgQXNzZXJ0RGVzY3JpcHRpb246ICdsaHMgZXF1YWxzIHJocycsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBc3NlcnQ6IHsgJ0ZuOjpOb3QnOiBbeyAnRm46OkNvbnRhaW5zJzogW1snaGVsbG8nLCAnd29ybGQnXSwgJ3dvcmxkJ10gfV0gfSxcbiAgICAgICAgICAgICAgQXNzZXJ0RGVzY3JpcHRpb246ICdzb21lIGFzc2VydGlvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdhIHRlbXBsYXRlIGNhbiBjb250YWluIG11bHRpcGxlIFJ1bGVzJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgICBuZXcgQ2ZuUnVsZShzdGFjaywgJ1J1bGUxJyk7XG4gICAgbmV3IENmblJ1bGUoc3RhY2ssICdSdWxlMicpO1xuXG4gICAgZXhwZWN0KHRvQ2xvdWRGb3JtYXRpb24oc3RhY2spKS50b0VxdWFsKHtcbiAgICAgIFJ1bGVzOiB7XG4gICAgICAgIFJ1bGUxOiB7fSxcbiAgICAgICAgUnVsZTI6IHt9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==