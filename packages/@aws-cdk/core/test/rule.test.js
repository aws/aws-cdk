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
        expect(util_1.toCloudFormation(stack)).toEqual({
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
        expect(util_1.toCloudFormation(stack)).toEqual({
            Rules: {
                Rule1: {},
                Rule2: {},
            },
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicnVsZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaUNBQTBDO0FBQzFDLGdDQUE0QztBQUU1QyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRTtJQUNwQixJQUFJLENBQUMsa0NBQWtDLEVBQUUsR0FBRyxFQUFFO1FBQzVDLE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFFMUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxhQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBRSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN0RSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQUUsQ0FBQyxZQUFZLENBQUMsUUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFFLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFFekgsTUFBTSxDQUFDLHVCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3RDLEtBQUssRUFBRTtnQkFDTCxNQUFNLEVBQUU7b0JBQ04sVUFBVSxFQUFFO3dCQUNWOzRCQUNFLE1BQU0sRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBRTs0QkFDeEMsaUJBQWlCLEVBQUUsZ0JBQWdCO3lCQUNwQzt3QkFDRDs0QkFDRSxNQUFNLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTs0QkFDMUUsaUJBQWlCLEVBQUUsZ0JBQWdCO3lCQUNwQztxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsdUNBQXVDLEVBQUUsR0FBRyxFQUFFO1FBQ2pELE1BQU0sS0FBSyxHQUFHLElBQUksV0FBSyxFQUFFLENBQUM7UUFFMUIsSUFBSSxhQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzVCLElBQUksYUFBTyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUU1QixNQUFNLENBQUMsdUJBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDdEMsS0FBSyxFQUFFO2dCQUNMLEtBQUssRUFBRSxFQUFFO2dCQUNULEtBQUssRUFBRSxFQUFFO2FBQ1Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdG9DbG91ZEZvcm1hdGlvbiB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyBDZm5SdWxlLCBGbiwgU3RhY2sgfSBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgncnVsZScsICgpID0+IHtcbiAgdGVzdCgnUnVsZSBjYW4gYmUgdXNlZCB0byBjcmVhdGUgcnVsZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIGNvbnN0IHJ1bGUgPSBuZXcgQ2ZuUnVsZShzdGFjaywgJ015UnVsZScpO1xuICAgIHJ1bGUuYWRkQXNzZXJ0aW9uKEZuLmNvbmRpdGlvbkVxdWFscygnbGhzJywgJ3JocycpLCAnbGhzIGVxdWFscyByaHMnKTtcbiAgICBydWxlLmFkZEFzc2VydGlvbihGbi5jb25kaXRpb25Ob3QoRm4uY29uZGl0aW9uQW5kKEZuLmNvbmRpdGlvbkNvbnRhaW5zKFsnaGVsbG8nLCAnd29ybGQnXSwgJ3dvcmxkJykpKSwgJ3NvbWUgYXNzZXJ0aW9uJyk7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUnVsZXM6IHtcbiAgICAgICAgTXlSdWxlOiB7XG4gICAgICAgICAgQXNzZXJ0aW9uczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBBc3NlcnQ6IHsgJ0ZuOjpFcXVhbHMnOiBbJ2xocycsICdyaHMnXSB9LFxuICAgICAgICAgICAgICBBc3NlcnREZXNjcmlwdGlvbjogJ2xocyBlcXVhbHMgcmhzJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIEFzc2VydDogeyAnRm46Ok5vdCc6IFt7ICdGbjo6Q29udGFpbnMnOiBbWydoZWxsbycsICd3b3JsZCddLCAnd29ybGQnXSB9XSB9LFxuICAgICAgICAgICAgICBBc3NlcnREZXNjcmlwdGlvbjogJ3NvbWUgYXNzZXJ0aW9uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2EgdGVtcGxhdGUgY2FuIGNvbnRhaW4gbXVsdGlwbGUgUnVsZXMnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAgIG5ldyBDZm5SdWxlKHN0YWNrLCAnUnVsZTEnKTtcbiAgICBuZXcgQ2ZuUnVsZShzdGFjaywgJ1J1bGUyJyk7XG5cbiAgICBleHBlY3QodG9DbG91ZEZvcm1hdGlvbihzdGFjaykpLnRvRXF1YWwoe1xuICAgICAgUnVsZXM6IHtcbiAgICAgICAgUnVsZTE6IHt9LFxuICAgICAgICBSdWxlMjoge30sXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19