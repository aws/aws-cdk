"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const stack_1 = require("../../core/lib/stack");
const lib_1 = require("../lib");
const app = new cdk.App();
class StackUnderTest extends stack_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new lib_1.Function(this, 'MyFunc1', {
            runtime: lib_1.Runtime.NODEJS_14_X,
            handler: 'index.handler',
            code: lib_1.Code.fromInline(`exports.handler = ${handler.toString()}`),
            architecture: props.architecture,
            adotInstrumentation: {
                layerVersion: lib_1.AdotLayerVersion.fromJavaScriptSdkLayerVersion(lib_1.AdotLambdaLayerJavaScriptSdkVersion.LATEST),
                execWrapper: lib_1.AdotLambdaExecWrapper.REGULAR_HANDLER,
            },
        });
        new lib_1.Function(this, 'MyFunc2', {
            runtime: lib_1.Runtime.PYTHON_3_9,
            handler: 'index.handler',
            code: lib_1.Code.fromInline('def handler(event, context): pass'),
            adotInstrumentation: {
                layerVersion: lib_1.AdotLayerVersion.fromPythonSdkLayerVersion(lib_1.AdotLambdaLayerPythonSdkVersion.LATEST),
                execWrapper: lib_1.AdotLambdaExecWrapper.REGULAR_HANDLER,
            },
        });
        new lib_1.Function(this, 'MyFunc3', {
            runtime: lib_1.Runtime.PYTHON_3_9,
            handler: 'index.handler',
            code: lib_1.Code.fromInline('def handler(event, context): pass'),
            adotInstrumentation: {
                layerVersion: lib_1.AdotLayerVersion.fromJavaSdkLayerVersion(lib_1.AdotLambdaLayerJavaSdkVersion.LATEST),
                execWrapper: lib_1.AdotLambdaExecWrapper.REGULAR_HANDLER,
            },
        });
        new lib_1.Function(this, 'MyFunc4', {
            runtime: lib_1.Runtime.PYTHON_3_9,
            handler: 'index.handler',
            code: lib_1.Code.fromInline('def handler(event, context): pass'),
            adotInstrumentation: {
                layerVersion: lib_1.AdotLayerVersion.fromJavaAutoInstrumentationLayerVersion(lib_1.AdotLambdaLayerJavaAutoInstrumentationVersion.LATEST),
                execWrapper: lib_1.AdotLambdaExecWrapper.REGULAR_HANDLER,
            },
        });
        new lib_1.Function(this, 'MyFunc5', {
            runtime: lib_1.Runtime.PYTHON_3_9,
            handler: 'index.handler',
            code: lib_1.Code.fromInline('def handler(event, context): pass'),
            adotInstrumentation: {
                layerVersion: lib_1.AdotLayerVersion.fromGenericLayerVersion(lib_1.AdotLambdaLayerGenericVersion.LATEST),
                execWrapper: lib_1.AdotLambdaExecWrapper.REGULAR_HANDLER,
            },
        });
    }
}
/* eslint-disable no-console */
function handler(event, _context, callback) {
    console.log(JSON.stringify(event, undefined, 2));
    return callback();
}
new integ_tests_1.IntegTest(app, 'IntegTest', {
    testCases: [
        new StackUnderTest(app, 'Stack1', {
            architecture: lib_1.Architecture.ARM_64,
        }),
        new StackUnderTest(app, 'Stack2', {
            architecture: lib_1.Architecture.X86_64,
        }),
    ],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubGFtYmRhLWFkb3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5sYW1iZGEtYWRvdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQyxzREFBaUQ7QUFFakQsZ0RBQXlEO0FBQ3pELGdDQVlnQjtBQUVoQixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQU0xQixNQUFNLGNBQWUsU0FBUSxhQUFLO0lBQ2hDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMEI7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxjQUFRLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUM1QixPQUFPLEVBQUUsYUFBTyxDQUFDLFdBQVc7WUFDNUIsT0FBTyxFQUFFLGVBQWU7WUFDeEIsSUFBSSxFQUFFLFVBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO1lBQ2hFLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtZQUNoQyxtQkFBbUIsRUFBRTtnQkFDbkIsWUFBWSxFQUFFLHNCQUFnQixDQUFDLDZCQUE2QixDQUFDLHlDQUFtQyxDQUFDLE1BQU0sQ0FBQztnQkFDeEcsV0FBVyxFQUFFLDJCQUFxQixDQUFDLGVBQWU7YUFDbkQ7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLGNBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzVCLE9BQU8sRUFBRSxhQUFPLENBQUMsVUFBVTtZQUMzQixPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsVUFBSSxDQUFDLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQztZQUMxRCxtQkFBbUIsRUFBRTtnQkFDbkIsWUFBWSxFQUFFLHNCQUFnQixDQUFDLHlCQUF5QixDQUFDLHFDQUErQixDQUFDLE1BQU0sQ0FBQztnQkFDaEcsV0FBVyxFQUFFLDJCQUFxQixDQUFDLGVBQWU7YUFDbkQ7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLGNBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzVCLE9BQU8sRUFBRSxhQUFPLENBQUMsVUFBVTtZQUMzQixPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsVUFBSSxDQUFDLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQztZQUMxRCxtQkFBbUIsRUFBRTtnQkFDbkIsWUFBWSxFQUFFLHNCQUFnQixDQUFDLHVCQUF1QixDQUFDLG1DQUE2QixDQUFDLE1BQU0sQ0FBQztnQkFDNUYsV0FBVyxFQUFFLDJCQUFxQixDQUFDLGVBQWU7YUFDbkQ7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLGNBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzVCLE9BQU8sRUFBRSxhQUFPLENBQUMsVUFBVTtZQUMzQixPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsVUFBSSxDQUFDLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQztZQUMxRCxtQkFBbUIsRUFBRTtnQkFDbkIsWUFBWSxFQUFFLHNCQUFnQixDQUFDLHVDQUF1QyxDQUFDLG1EQUE2QyxDQUFDLE1BQU0sQ0FBQztnQkFDNUgsV0FBVyxFQUFFLDJCQUFxQixDQUFDLGVBQWU7YUFDbkQ7U0FDRixDQUFDLENBQUM7UUFFSCxJQUFJLGNBQVEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzVCLE9BQU8sRUFBRSxhQUFPLENBQUMsVUFBVTtZQUMzQixPQUFPLEVBQUUsZUFBZTtZQUN4QixJQUFJLEVBQUUsVUFBSSxDQUFDLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQztZQUMxRCxtQkFBbUIsRUFBRTtnQkFDbkIsWUFBWSxFQUFFLHNCQUFnQixDQUFDLHVCQUF1QixDQUFDLG1DQUE2QixDQUFDLE1BQU0sQ0FBQztnQkFDNUYsV0FBVyxFQUFFLDJCQUFxQixDQUFDLGVBQWU7YUFDbkQ7U0FDRixDQUFDLENBQUM7S0FDSjtDQUNGO0FBRUQsK0JBQStCO0FBQy9CLFNBQVMsT0FBTyxDQUFDLEtBQVUsRUFBRSxRQUFhLEVBQUUsUUFBYTtJQUN2RCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELE9BQU8sUUFBUSxFQUFFLENBQUM7QUFDcEIsQ0FBQztBQUVELElBQUksdUJBQVMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFO0lBQzlCLFNBQVMsRUFBRTtRQUNULElBQUksY0FBYyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7WUFDaEMsWUFBWSxFQUFFLGtCQUFZLENBQUMsTUFBTTtTQUNsQyxDQUFDO1FBQ0YsSUFBSSxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtZQUNoQyxZQUFZLEVBQUUsa0JBQVksQ0FBQyxNQUFNO1NBQ2xDLENBQUM7S0FDSDtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgU3RhY2tQcm9wcywgU3RhY2sgfSBmcm9tICcuLi8uLi9jb3JlL2xpYi9zdGFjayc7XG5pbXBvcnQge1xuICBBZG90TGFtYmRhTGF5ZXJQeXRob25TZGtWZXJzaW9uLFxuICBBZG90TGFtYmRhTGF5ZXJKYXZhU2RrVmVyc2lvbixcbiAgQWRvdExhbWJkYUV4ZWNXcmFwcGVyLFxuICBBZG90TGFtYmRhTGF5ZXJKYXZhU2NyaXB0U2RrVmVyc2lvbixcbiAgQWRvdExhbWJkYUxheWVySmF2YUF1dG9JbnN0cnVtZW50YXRpb25WZXJzaW9uLFxuICBBZG90TGFtYmRhTGF5ZXJHZW5lcmljVmVyc2lvbixcbiAgQ29kZSxcbiAgQXJjaGl0ZWN0dXJlLFxuICBGdW5jdGlvbixcbiAgUnVudGltZSxcbiAgQWRvdExheWVyVmVyc2lvbixcbn0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuaW50ZXJmYWNlIFN0YWNrVW5kZXJUZXN0UHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgYXJjaGl0ZWN0dXJlPzogQXJjaGl0ZWN0dXJlO1xufVxuXG5jbGFzcyBTdGFja1VuZGVyVGVzdCBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0YWNrVW5kZXJUZXN0UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIG5ldyBGdW5jdGlvbih0aGlzLCAnTXlGdW5jMScsIHtcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE0X1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBDb2RlLmZyb21JbmxpbmUoYGV4cG9ydHMuaGFuZGxlciA9ICR7aGFuZGxlci50b1N0cmluZygpfWApLFxuICAgICAgYXJjaGl0ZWN0dXJlOiBwcm9wcy5hcmNoaXRlY3R1cmUsXG4gICAgICBhZG90SW5zdHJ1bWVudGF0aW9uOiB7XG4gICAgICAgIGxheWVyVmVyc2lvbjogQWRvdExheWVyVmVyc2lvbi5mcm9tSmF2YVNjcmlwdFNka0xheWVyVmVyc2lvbihBZG90TGFtYmRhTGF5ZXJKYXZhU2NyaXB0U2RrVmVyc2lvbi5MQVRFU1QpLFxuICAgICAgICBleGVjV3JhcHBlcjogQWRvdExhbWJkYUV4ZWNXcmFwcGVyLlJFR1VMQVJfSEFORExFUixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBuZXcgRnVuY3Rpb24odGhpcywgJ015RnVuYzInLCB7XG4gICAgICBydW50aW1lOiBSdW50aW1lLlBZVEhPTl8zXzksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBDb2RlLmZyb21JbmxpbmUoJ2RlZiBoYW5kbGVyKGV2ZW50LCBjb250ZXh0KTogcGFzcycpLFxuICAgICAgYWRvdEluc3RydW1lbnRhdGlvbjoge1xuICAgICAgICBsYXllclZlcnNpb246IEFkb3RMYXllclZlcnNpb24uZnJvbVB5dGhvblNka0xheWVyVmVyc2lvbihBZG90TGFtYmRhTGF5ZXJQeXRob25TZGtWZXJzaW9uLkxBVEVTVCksXG4gICAgICAgIGV4ZWNXcmFwcGVyOiBBZG90TGFtYmRhRXhlY1dyYXBwZXIuUkVHVUxBUl9IQU5ETEVSLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIG5ldyBGdW5jdGlvbih0aGlzLCAnTXlGdW5jMycsIHtcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIGNvZGU6IENvZGUuZnJvbUlubGluZSgnZGVmIGhhbmRsZXIoZXZlbnQsIGNvbnRleHQpOiBwYXNzJyksXG4gICAgICBhZG90SW5zdHJ1bWVudGF0aW9uOiB7XG4gICAgICAgIGxheWVyVmVyc2lvbjogQWRvdExheWVyVmVyc2lvbi5mcm9tSmF2YVNka0xheWVyVmVyc2lvbihBZG90TGFtYmRhTGF5ZXJKYXZhU2RrVmVyc2lvbi5MQVRFU1QpLFxuICAgICAgICBleGVjV3JhcHBlcjogQWRvdExhbWJkYUV4ZWNXcmFwcGVyLlJFR1VMQVJfSEFORExFUixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBuZXcgRnVuY3Rpb24odGhpcywgJ015RnVuYzQnLCB7XG4gICAgICBydW50aW1lOiBSdW50aW1lLlBZVEhPTl8zXzksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBDb2RlLmZyb21JbmxpbmUoJ2RlZiBoYW5kbGVyKGV2ZW50LCBjb250ZXh0KTogcGFzcycpLFxuICAgICAgYWRvdEluc3RydW1lbnRhdGlvbjoge1xuICAgICAgICBsYXllclZlcnNpb246IEFkb3RMYXllclZlcnNpb24uZnJvbUphdmFBdXRvSW5zdHJ1bWVudGF0aW9uTGF5ZXJWZXJzaW9uKEFkb3RMYW1iZGFMYXllckphdmFBdXRvSW5zdHJ1bWVudGF0aW9uVmVyc2lvbi5MQVRFU1QpLFxuICAgICAgICBleGVjV3JhcHBlcjogQWRvdExhbWJkYUV4ZWNXcmFwcGVyLlJFR1VMQVJfSEFORExFUixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBuZXcgRnVuY3Rpb24odGhpcywgJ015RnVuYzUnLCB7XG4gICAgICBydW50aW1lOiBSdW50aW1lLlBZVEhPTl8zXzksXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBDb2RlLmZyb21JbmxpbmUoJ2RlZiBoYW5kbGVyKGV2ZW50LCBjb250ZXh0KTogcGFzcycpLFxuICAgICAgYWRvdEluc3RydW1lbnRhdGlvbjoge1xuICAgICAgICBsYXllclZlcnNpb246IEFkb3RMYXllclZlcnNpb24uZnJvbUdlbmVyaWNMYXllclZlcnNpb24oQWRvdExhbWJkYUxheWVyR2VuZXJpY1ZlcnNpb24uTEFURVNUKSxcbiAgICAgICAgZXhlY1dyYXBwZXI6IEFkb3RMYW1iZGFFeGVjV3JhcHBlci5SRUdVTEFSX0hBTkRMRVIsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbmZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IGFueSwgX2NvbnRleHQ6IGFueSwgY2FsbGJhY2s6IGFueSkge1xuICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShldmVudCwgdW5kZWZpbmVkLCAyKSk7XG4gIHJldHVybiBjYWxsYmFjaygpO1xufVxuXG5uZXcgSW50ZWdUZXN0KGFwcCwgJ0ludGVnVGVzdCcsIHtcbiAgdGVzdENhc2VzOiBbXG4gICAgbmV3IFN0YWNrVW5kZXJUZXN0KGFwcCwgJ1N0YWNrMScsIHtcbiAgICAgIGFyY2hpdGVjdHVyZTogQXJjaGl0ZWN0dXJlLkFSTV82NCxcbiAgICB9KSxcbiAgICBuZXcgU3RhY2tVbmRlclRlc3QoYXBwLCAnU3RhY2syJywge1xuICAgICAgYXJjaGl0ZWN0dXJlOiBBcmNoaXRlY3R1cmUuWDg2XzY0LFxuICAgIH0pLFxuICBdLFxufSk7XG4iXX0=