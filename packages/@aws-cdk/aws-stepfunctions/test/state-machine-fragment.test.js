"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const stepfunctions = require("../lib");
describe('State Machine Fragment', () => {
    test('Prefix applied correctly on Fragments with Parallel states', () => {
        // GIVEN
        const stack = new cdk.Stack();
        // WHEN
        const fragment1 = new ParallelMachineFragment(stack, 'Fragment 1').prefixStates();
        const fragment2 = new ParallelMachineFragment(stack, 'Fragment 2').prefixStates();
        new stepfunctions.StateMachine(stack, 'State Machine', {
            definition: fragment1.next(fragment2),
        });
        // THEN
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::StepFunctions::StateMachine', {
            DefinitionString: assertions_1.Match.serializedJson({
                StartAt: 'Fragment 1: Parallel State',
                States: {
                    'Fragment 1: Parallel State': assertions_1.Match.objectLike({
                        Branches: [assertions_1.Match.objectLike({
                                States: {
                                    'Fragment 1: Step 1': assertions_1.Match.anyValue(),
                                },
                            })],
                    }),
                    'Fragment 2: Parallel State': assertions_1.Match.objectLike({
                        Branches: [assertions_1.Match.objectLike({
                                States: {
                                    'Fragment 2: Step 1': assertions_1.Match.anyValue(),
                                },
                            })],
                    }),
                },
            }),
        });
    });
});
class ParallelMachineFragment extends stepfunctions.StateMachineFragment {
    constructor(scope, id) {
        super(scope, id);
        const step1 = new stepfunctions.Pass(this, 'Step 1');
        const parallelState = new stepfunctions.Parallel(this, 'Parallel State');
        const chain = parallelState.branch(step1);
        this.startState = parallelState;
        this.endStates = [chain];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGUtbWFjaGluZS1mcmFnbWVudC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RhdGUtbWFjaGluZS1mcmFnbWVudC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQXNEO0FBQ3RELHFDQUFxQztBQUVyQyx3Q0FBd0M7QUFFeEMsUUFBUSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRTtJQUN0QyxJQUFJLENBQUMsNERBQTRELEVBQUUsR0FBRyxFQUFFO1FBQ3RFLFFBQVE7UUFDUixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixPQUFPO1FBQ1AsTUFBTSxTQUFTLEdBQUcsSUFBSSx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDbEYsTUFBTSxTQUFTLEdBQUcsSUFBSSx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7UUFFbEYsSUFBSSxhQUFhLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7WUFDckQsVUFBVSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBQ3RDLENBQUMsQ0FBQztRQUVILE9BQU87UUFDUCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxrQ0FBa0MsRUFBRTtZQUNsRixnQkFBZ0IsRUFBRSxrQkFBSyxDQUFDLGNBQWMsQ0FBQztnQkFDckMsT0FBTyxFQUFFLDRCQUE0QjtnQkFDckMsTUFBTSxFQUFFO29CQUNOLDRCQUE0QixFQUFFLGtCQUFLLENBQUMsVUFBVSxDQUFDO3dCQUM3QyxRQUFRLEVBQUUsQ0FBQyxrQkFBSyxDQUFDLFVBQVUsQ0FBQztnQ0FDMUIsTUFBTSxFQUFFO29DQUNOLG9CQUFvQixFQUFFLGtCQUFLLENBQUMsUUFBUSxFQUFFO2lDQUN2Qzs2QkFDRixDQUFDLENBQUM7cUJBQ0osQ0FBQztvQkFDRiw0QkFBNEIsRUFBRSxrQkFBSyxDQUFDLFVBQVUsQ0FBQzt3QkFDN0MsUUFBUSxFQUFFLENBQUMsa0JBQUssQ0FBQyxVQUFVLENBQUM7Z0NBQzFCLE1BQU0sRUFBRTtvQ0FDTixvQkFBb0IsRUFBRSxrQkFBSyxDQUFDLFFBQVEsRUFBRTtpQ0FDdkM7NkJBQ0YsQ0FBQyxDQUFDO3FCQUNKLENBQUM7aUJBQ0g7YUFDRixDQUFDO1NBQ0gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILE1BQU0sdUJBQXdCLFNBQVEsYUFBYSxDQUFDLG9CQUFvQjtJQUl0RSxZQUFZLEtBQWdCLEVBQUUsRUFBVTtRQUN0QyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sS0FBSyxHQUFHLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDckQsTUFBTSxhQUFhLEdBQUcsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3pFLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxhQUFhLENBQUM7UUFDaEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFCO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXRjaCwgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgc3RlcGZ1bmN0aW9ucyBmcm9tICcuLi9saWInO1xuXG5kZXNjcmliZSgnU3RhdGUgTWFjaGluZSBGcmFnbWVudCcsICgpID0+IHtcbiAgdGVzdCgnUHJlZml4IGFwcGxpZWQgY29ycmVjdGx5IG9uIEZyYWdtZW50cyB3aXRoIFBhcmFsbGVsIHN0YXRlcycsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IGZyYWdtZW50MSA9IG5ldyBQYXJhbGxlbE1hY2hpbmVGcmFnbWVudChzdGFjaywgJ0ZyYWdtZW50IDEnKS5wcmVmaXhTdGF0ZXMoKTtcbiAgICBjb25zdCBmcmFnbWVudDIgPSBuZXcgUGFyYWxsZWxNYWNoaW5lRnJhZ21lbnQoc3RhY2ssICdGcmFnbWVudCAyJykucHJlZml4U3RhdGVzKCk7XG5cbiAgICBuZXcgc3RlcGZ1bmN0aW9ucy5TdGF0ZU1hY2hpbmUoc3RhY2ssICdTdGF0ZSBNYWNoaW5lJywge1xuICAgICAgZGVmaW5pdGlvbjogZnJhZ21lbnQxLm5leHQoZnJhZ21lbnQyKSxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTdGVwRnVuY3Rpb25zOjpTdGF0ZU1hY2hpbmUnLCB7XG4gICAgICBEZWZpbml0aW9uU3RyaW5nOiBNYXRjaC5zZXJpYWxpemVkSnNvbih7XG4gICAgICAgIFN0YXJ0QXQ6ICdGcmFnbWVudCAxOiBQYXJhbGxlbCBTdGF0ZScsXG4gICAgICAgIFN0YXRlczoge1xuICAgICAgICAgICdGcmFnbWVudCAxOiBQYXJhbGxlbCBTdGF0ZSc6IE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgQnJhbmNoZXM6IFtNYXRjaC5vYmplY3RMaWtlKHtcbiAgICAgICAgICAgICAgU3RhdGVzOiB7XG4gICAgICAgICAgICAgICAgJ0ZyYWdtZW50IDE6IFN0ZXAgMSc6IE1hdGNoLmFueVZhbHVlKCksXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB9KV0sXG4gICAgICAgICAgfSksXG4gICAgICAgICAgJ0ZyYWdtZW50IDI6IFBhcmFsbGVsIFN0YXRlJzogTWF0Y2gub2JqZWN0TGlrZSh7XG4gICAgICAgICAgICBCcmFuY2hlczogW01hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICAgICAgICBTdGF0ZXM6IHtcbiAgICAgICAgICAgICAgICAnRnJhZ21lbnQgMjogU3RlcCAxJzogTWF0Y2guYW55VmFsdWUoKSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0pXSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5jbGFzcyBQYXJhbGxlbE1hY2hpbmVGcmFnbWVudCBleHRlbmRzIHN0ZXBmdW5jdGlvbnMuU3RhdGVNYWNoaW5lRnJhZ21lbnQge1xuICBwdWJsaWMgcmVhZG9ubHkgc3RhcnRTdGF0ZTogc3RlcGZ1bmN0aW9ucy5TdGF0ZTtcbiAgcHVibGljIHJlYWRvbmx5IGVuZFN0YXRlczogc3RlcGZ1bmN0aW9ucy5JTmV4dGFibGVbXTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IHN0ZXAxID0gbmV3IHN0ZXBmdW5jdGlvbnMuUGFzcyh0aGlzLCAnU3RlcCAxJyk7XG4gICAgY29uc3QgcGFyYWxsZWxTdGF0ZSA9IG5ldyBzdGVwZnVuY3Rpb25zLlBhcmFsbGVsKHRoaXMsICdQYXJhbGxlbCBTdGF0ZScpO1xuICAgIGNvbnN0IGNoYWluID0gcGFyYWxsZWxTdGF0ZS5icmFuY2goc3RlcDEpO1xuICAgIHRoaXMuc3RhcnRTdGF0ZSA9IHBhcmFsbGVsU3RhdGU7XG4gICAgdGhpcy5lbmRTdGF0ZXMgPSBbY2hhaW5dO1xuICB9XG59Il19