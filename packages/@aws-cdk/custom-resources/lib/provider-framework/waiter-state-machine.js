"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaiterStateMachine = void 0;
const aws_iam_1 = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const constructs_1 = require("constructs");
/**
 * A very simple StateMachine construct highly customized to the provider framework.
 * This is so that this package does not need to depend on aws-stepfunctions module.
 *
 * The state machine continuously calls the isCompleteHandler, until it succeeds or times out.
 * The handler is called `maxAttempts` times with an `interval` duration and a `backoffRate` rate.
 */
class WaiterStateMachine extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const role = new aws_iam_1.Role(this, 'Role', {
            assumedBy: new aws_iam_1.ServicePrincipal('states.amazonaws.com'),
        });
        props.isCompleteHandler.grantInvoke(role);
        props.timeoutHandler.grantInvoke(role);
        const definition = core_1.Stack.of(this).toJsonString({
            StartAt: 'framework-isComplete-task',
            States: {
                'framework-isComplete-task': {
                    End: true,
                    Retry: [{
                            ErrorEquals: ['States.ALL'],
                            IntervalSeconds: props.interval.toSeconds(),
                            MaxAttempts: props.maxAttempts,
                            BackoffRate: props.backoffRate,
                        }],
                    Catch: [{
                            ErrorEquals: ['States.ALL'],
                            Next: 'framework-onTimeout-task',
                        }],
                    Type: 'Task',
                    Resource: props.isCompleteHandler.functionArn,
                },
                'framework-onTimeout-task': {
                    End: true,
                    Type: 'Task',
                    Resource: props.timeoutHandler.functionArn,
                },
            },
        });
        const resource = new core_1.CfnResource(this, 'Resource', {
            type: 'AWS::StepFunctions::StateMachine',
            properties: {
                DefinitionString: definition,
                RoleArn: role.roleArn,
            },
        });
        resource.node.addDependency(role);
        this.stateMachineArn = resource.ref;
    }
    grantStartExecution(identity) {
        return aws_iam_1.Grant.addToPrincipal({
            grantee: identity,
            actions: ['states:StartExecution'],
            resourceArns: [this.stateMachineArn],
        });
    }
}
exports.WaiterStateMachine = WaiterStateMachine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FpdGVyLXN0YXRlLW1hY2hpbmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3YWl0ZXItc3RhdGUtbWFjaGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw4Q0FBNkU7QUFFN0Usd0NBQTZEO0FBQzdELDJDQUF1QztBQTZCdkM7Ozs7OztHQU1HO0FBQ0gsTUFBYSxrQkFBbUIsU0FBUSxzQkFBUztJQUcvQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQThCO1FBQ3RFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtZQUNsQyxTQUFTLEVBQUUsSUFBSSwwQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQztTQUN4RCxDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsaUJBQWlCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLEtBQUssQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZDLE1BQU0sVUFBVSxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDO1lBQzdDLE9BQU8sRUFBRSwyQkFBMkI7WUFDcEMsTUFBTSxFQUFFO2dCQUNOLDJCQUEyQixFQUFFO29CQUMzQixHQUFHLEVBQUUsSUFBSTtvQkFDVCxLQUFLLEVBQUUsQ0FBQzs0QkFDTixXQUFXLEVBQUUsQ0FBQyxZQUFZLENBQUM7NEJBQzNCLGVBQWUsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTs0QkFDM0MsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXOzRCQUM5QixXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVc7eUJBQy9CLENBQUM7b0JBQ0YsS0FBSyxFQUFFLENBQUM7NEJBQ04sV0FBVyxFQUFFLENBQUMsWUFBWSxDQUFDOzRCQUMzQixJQUFJLEVBQUUsMEJBQTBCO3lCQUNqQyxDQUFDO29CQUNGLElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEsRUFBRSxLQUFLLENBQUMsaUJBQWlCLENBQUMsV0FBVztpQkFDOUM7Z0JBQ0QsMEJBQTBCLEVBQUU7b0JBQzFCLEdBQUcsRUFBRSxJQUFJO29CQUNULElBQUksRUFBRSxNQUFNO29CQUNaLFFBQVEsRUFBRSxLQUFLLENBQUMsY0FBYyxDQUFDLFdBQVc7aUJBQzNDO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLGtCQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNqRCxJQUFJLEVBQUUsa0NBQWtDO1lBQ3hDLFVBQVUsRUFBRTtnQkFDVixnQkFBZ0IsRUFBRSxVQUFVO2dCQUM1QixPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87YUFDdEI7U0FDRixDQUFDLENBQUM7UUFDSCxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVsQyxJQUFJLENBQUMsZUFBZSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUM7S0FDckM7SUFFTSxtQkFBbUIsQ0FBQyxRQUFvQjtRQUM3QyxPQUFPLGVBQUssQ0FBQyxjQUFjLENBQUM7WUFDMUIsT0FBTyxFQUFFLFFBQVE7WUFDakIsT0FBTyxFQUFFLENBQUMsdUJBQXVCLENBQUM7WUFDbEMsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQztTQUNyQyxDQUFDLENBQUM7S0FDSjtDQUNGO0FBekRELGdEQXlEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdyYW50LCBJR3JhbnRhYmxlLCBSb2xlLCBTZXJ2aWNlUHJpbmNpcGFsIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBJRnVuY3Rpb24gfSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCB7IENmblJlc291cmNlLCBEdXJhdGlvbiwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFdhaXRlclN0YXRlTWFjaGluZVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBtYWluIGhhbmRsZXIgdGhhdCBub3RpZmllcyBpZiB0aGUgd2FpdGVyIHRvIGRlY2lkZSAnY29tcGxldGUnIG9yICdpbmNvbXBsZXRlJy5cbiAgICovXG4gIHJlYWRvbmx5IGlzQ29tcGxldGVIYW5kbGVyOiBJRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIFRoZSBoYW5kbGVyIHRvIGNhbGwgaWYgdGhlIHdhaXRlciB0aW1lcyBvdXQgYW5kIGlzIGluY29tcGxldGUuXG4gICAqL1xuICByZWFkb25seSB0aW1lb3V0SGFuZGxlcjogSUZ1bmN0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgaW50ZXJ2YWwgdG8gd2FpdCBiZXR3ZWVuIGF0dGVtcHRzLlxuICAgKi9cbiAgcmVhZG9ubHkgaW50ZXJ2YWw6IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgYXR0ZW1wdHMuXG4gICAqL1xuICByZWFkb25seSBtYXhBdHRlbXB0czogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBCYWNrb2ZmIGJldHdlZW4gYXR0ZW1wdHMuXG4gICAqL1xuICByZWFkb25seSBiYWNrb2ZmUmF0ZTogbnVtYmVyO1xufVxuXG4vKipcbiAqIEEgdmVyeSBzaW1wbGUgU3RhdGVNYWNoaW5lIGNvbnN0cnVjdCBoaWdobHkgY3VzdG9taXplZCB0byB0aGUgcHJvdmlkZXIgZnJhbWV3b3JrLlxuICogVGhpcyBpcyBzbyB0aGF0IHRoaXMgcGFja2FnZSBkb2VzIG5vdCBuZWVkIHRvIGRlcGVuZCBvbiBhd3Mtc3RlcGZ1bmN0aW9ucyBtb2R1bGUuXG4gKlxuICogVGhlIHN0YXRlIG1hY2hpbmUgY29udGludW91c2x5IGNhbGxzIHRoZSBpc0NvbXBsZXRlSGFuZGxlciwgdW50aWwgaXQgc3VjY2VlZHMgb3IgdGltZXMgb3V0LlxuICogVGhlIGhhbmRsZXIgaXMgY2FsbGVkIGBtYXhBdHRlbXB0c2AgdGltZXMgd2l0aCBhbiBgaW50ZXJ2YWxgIGR1cmF0aW9uIGFuZCBhIGBiYWNrb2ZmUmF0ZWAgcmF0ZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFdhaXRlclN0YXRlTWFjaGluZSBleHRlbmRzIENvbnN0cnVjdCB7XG4gIHB1YmxpYyByZWFkb25seSBzdGF0ZU1hY2hpbmVBcm46IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogV2FpdGVyU3RhdGVNYWNoaW5lUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3Qgcm9sZSA9IG5ldyBSb2xlKHRoaXMsICdSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgU2VydmljZVByaW5jaXBhbCgnc3RhdGVzLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcbiAgICBwcm9wcy5pc0NvbXBsZXRlSGFuZGxlci5ncmFudEludm9rZShyb2xlKTtcbiAgICBwcm9wcy50aW1lb3V0SGFuZGxlci5ncmFudEludm9rZShyb2xlKTtcblxuICAgIGNvbnN0IGRlZmluaXRpb24gPSBTdGFjay5vZih0aGlzKS50b0pzb25TdHJpbmcoe1xuICAgICAgU3RhcnRBdDogJ2ZyYW1ld29yay1pc0NvbXBsZXRlLXRhc2snLFxuICAgICAgU3RhdGVzOiB7XG4gICAgICAgICdmcmFtZXdvcmstaXNDb21wbGV0ZS10YXNrJzoge1xuICAgICAgICAgIEVuZDogdHJ1ZSxcbiAgICAgICAgICBSZXRyeTogW3tcbiAgICAgICAgICAgIEVycm9yRXF1YWxzOiBbJ1N0YXRlcy5BTEwnXSxcbiAgICAgICAgICAgIEludGVydmFsU2Vjb25kczogcHJvcHMuaW50ZXJ2YWwudG9TZWNvbmRzKCksXG4gICAgICAgICAgICBNYXhBdHRlbXB0czogcHJvcHMubWF4QXR0ZW1wdHMsXG4gICAgICAgICAgICBCYWNrb2ZmUmF0ZTogcHJvcHMuYmFja29mZlJhdGUsXG4gICAgICAgICAgfV0sXG4gICAgICAgICAgQ2F0Y2g6IFt7XG4gICAgICAgICAgICBFcnJvckVxdWFsczogWydTdGF0ZXMuQUxMJ10sXG4gICAgICAgICAgICBOZXh0OiAnZnJhbWV3b3JrLW9uVGltZW91dC10YXNrJyxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBUeXBlOiAnVGFzaycsXG4gICAgICAgICAgUmVzb3VyY2U6IHByb3BzLmlzQ29tcGxldGVIYW5kbGVyLmZ1bmN0aW9uQXJuLFxuICAgICAgICB9LFxuICAgICAgICAnZnJhbWV3b3JrLW9uVGltZW91dC10YXNrJzoge1xuICAgICAgICAgIEVuZDogdHJ1ZSxcbiAgICAgICAgICBUeXBlOiAnVGFzaycsXG4gICAgICAgICAgUmVzb3VyY2U6IHByb3BzLnRpbWVvdXRIYW5kbGVyLmZ1bmN0aW9uQXJuLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IENmblJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHR5cGU6ICdBV1M6OlN0ZXBGdW5jdGlvbnM6OlN0YXRlTWFjaGluZScsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIERlZmluaXRpb25TdHJpbmc6IGRlZmluaXRpb24sXG4gICAgICAgIFJvbGVBcm46IHJvbGUucm9sZUFybixcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmVzb3VyY2Uubm9kZS5hZGREZXBlbmRlbmN5KHJvbGUpO1xuXG4gICAgdGhpcy5zdGF0ZU1hY2hpbmVBcm4gPSByZXNvdXJjZS5yZWY7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnRTdGFydEV4ZWN1dGlvbihpZGVudGl0eTogSUdyYW50YWJsZSkge1xuICAgIHJldHVybiBHcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlOiBpZGVudGl0eSxcbiAgICAgIGFjdGlvbnM6IFsnc3RhdGVzOlN0YXJ0RXhlY3V0aW9uJ10sXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLnN0YXRlTWFjaGluZUFybl0sXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==