"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceDrainHook = void 0;
const fs = require("fs");
const path = require("path");
const autoscaling = require("@aws-cdk/aws-autoscaling");
const hooks = require("@aws-cdk/aws-autoscaling-hooktargets");
const iam = require("@aws-cdk/aws-iam");
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
/**
 * A hook to drain instances from ECS traffic before they're terminated
 */
class InstanceDrainHook extends constructs_1.Construct {
    /**
     * Constructs a new instance of the InstanceDrainHook class.
     */
    constructor(scope, id, props) {
        super(scope, id);
        const drainTime = props.drainTime || cdk.Duration.minutes(5);
        // Invoke Lambda via SNS Topic
        const fn = new lambda.Function(this, 'Function', {
            code: lambda.Code.fromInline(fs.readFileSync(path.join(__dirname, 'lambda-source', 'index.py'), { encoding: 'utf-8' })),
            handler: 'index.lambda_handler',
            runtime: lambda.Runtime.PYTHON_3_9,
            // Timeout: some extra margin for additional API calls made by the Lambda,
            // up to a maximum of 15 minutes.
            timeout: cdk.Duration.seconds(Math.min(drainTime.toSeconds() + 10, 900)),
            environment: {
                CLUSTER: props.cluster.clusterName,
            },
        });
        // Hook everything up: ASG -> Topic, Topic -> Lambda
        props.autoScalingGroup.addLifecycleHook('DrainHook', {
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
            defaultResult: autoscaling.DefaultResult.CONTINUE,
            notificationTarget: new hooks.FunctionHook(fn, props.topicEncryptionKey),
            heartbeatTimeout: drainTime,
        });
        // Describe actions cannot be restricted and restrict the CompleteLifecycleAction to the ASG arn
        // https://docs.aws.amazon.com/autoscaling/ec2/userguide/control-access-using-iam.html
        fn.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                'ec2:DescribeInstances',
                'ec2:DescribeInstanceAttribute',
                'ec2:DescribeInstanceStatus',
                'ec2:DescribeHosts',
            ],
            resources: ['*'],
        }));
        // Restrict to the ASG
        fn.addToRolePolicy(new iam.PolicyStatement({
            actions: ['autoscaling:CompleteLifecycleAction'],
            resources: [props.autoScalingGroup.autoScalingGroupArn],
        }));
        fn.addToRolePolicy(new iam.PolicyStatement({
            actions: ['ecs:DescribeContainerInstances', 'ecs:DescribeTasks'],
            resources: ['*'],
            conditions: {
                ArnEquals: { 'ecs:cluster': props.cluster.clusterArn },
            },
        }));
        // Restrict to the ECS Cluster
        fn.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                'ecs:ListContainerInstances',
                'ecs:SubmitContainerStateChange',
                'ecs:SubmitTaskStateChange',
            ],
            resources: [props.cluster.clusterArn],
        }));
        // Restrict the container-instance operations to the ECS Cluster
        fn.addToRolePolicy(new iam.PolicyStatement({
            actions: [
                'ecs:UpdateContainerInstancesState',
                'ecs:ListTasks',
            ],
            conditions: {
                ArnEquals: { 'ecs:cluster': props.cluster.clusterArn },
            },
            resources: ['*'],
        }));
    }
}
exports.InstanceDrainHook = InstanceDrainHook;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UtZHJhaW4taG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc3RhbmNlLWRyYWluLWhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3Qix3REFBd0Q7QUFDeEQsOERBQThEO0FBQzlELHdDQUF3QztBQUV4Qyw4Q0FBOEM7QUFDOUMscUNBQXFDO0FBQ3JDLDJDQUF1QztBQXdDdkM7O0dBRUc7QUFDSCxNQUFhLGlCQUFrQixTQUFRLHNCQUFTO0lBRTlDOztPQUVHO0lBQ0gsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUNyRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLE1BQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFN0QsOEJBQThCO1FBQzlCLE1BQU0sRUFBRSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQy9DLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLGVBQWUsRUFBRSxVQUFVLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZILE9BQU8sRUFBRSxzQkFBc0I7WUFDL0IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQywwRUFBMEU7WUFDMUUsaUNBQWlDO1lBQ2pDLE9BQU8sRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDeEUsV0FBVyxFQUFFO2dCQUNYLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFdBQVc7YUFDbkM7U0FDRixDQUFDLENBQUM7UUFFSCxvREFBb0Q7UUFDcEQsS0FBSyxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRTtZQUNuRCxtQkFBbUIsRUFBRSxXQUFXLENBQUMsbUJBQW1CLENBQUMsb0JBQW9CO1lBQ3pFLGFBQWEsRUFBRSxXQUFXLENBQUMsYUFBYSxDQUFDLFFBQVE7WUFDakQsa0JBQWtCLEVBQUUsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUM7WUFDeEUsZ0JBQWdCLEVBQUUsU0FBUztTQUM1QixDQUFDLENBQUM7UUFFSCxnR0FBZ0c7UUFDaEcsc0ZBQXNGO1FBQ3RGLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3pDLE9BQU8sRUFBRTtnQkFDUCx1QkFBdUI7Z0JBQ3ZCLCtCQUErQjtnQkFDL0IsNEJBQTRCO2dCQUM1QixtQkFBbUI7YUFDcEI7WUFDRCxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDakIsQ0FBQyxDQUFDLENBQUM7UUFFSixzQkFBc0I7UUFDdEIsRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDekMsT0FBTyxFQUFFLENBQUMscUNBQXFDLENBQUM7WUFDaEQsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLG1CQUFtQixDQUFDO1NBQ3hELENBQUMsQ0FBQyxDQUFDO1FBRUosRUFBRSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7WUFDekMsT0FBTyxFQUFFLENBQUMsZ0NBQWdDLEVBQUUsbUJBQW1CLENBQUM7WUFDaEUsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ2hCLFVBQVUsRUFBRTtnQkFDVixTQUFTLEVBQUUsRUFBRSxhQUFhLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7YUFDdkQ7U0FDRixDQUFDLENBQUMsQ0FBQztRQUVKLDhCQUE4QjtRQUM5QixFQUFFLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUN6QyxPQUFPLEVBQUU7Z0JBQ1AsNEJBQTRCO2dCQUM1QixnQ0FBZ0M7Z0JBQ2hDLDJCQUEyQjthQUM1QjtZQUNELFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1NBQ3RDLENBQUMsQ0FBQyxDQUFDO1FBRUosZ0VBQWdFO1FBQ2hFLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ3pDLE9BQU8sRUFBRTtnQkFDUCxtQ0FBbUM7Z0JBQ25DLGVBQWU7YUFDaEI7WUFDRCxVQUFVLEVBQUU7Z0JBQ1YsU0FBUyxFQUFFLEVBQUUsYUFBYSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFO2FBQ3ZEO1lBQ0QsU0FBUyxFQUFFLENBQUMsR0FBRyxDQUFDO1NBQ2pCLENBQUMsQ0FBQyxDQUFDO0tBQ0w7Q0FDRjtBQS9FRCw4Q0ErRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgYXV0b3NjYWxpbmcgZnJvbSAnQGF3cy1jZGsvYXdzLWF1dG9zY2FsaW5nJztcbmltcG9ydCAqIGFzIGhvb2tzIGZyb20gJ0Bhd3MtY2RrL2F3cy1hdXRvc2NhbGluZy1ob29rdGFyZ2V0cyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBrbXMgZnJvbSAnQGF3cy1jZGsvYXdzLWttcyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IElDbHVzdGVyIH0gZnJvbSAnLi4vY2x1c3Rlcic7XG5cbi8vIFJlZmVyZW5jZSBmb3IgdGhlIHNvdXJjZSBpbiB0aGlzIHBhY2thZ2U6XG4vL1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL2F3cy1zYW1wbGVzL2Vjcy1yZWZhcmNoLWNsb3VkZm9ybWF0aW9uL2Jsb2IvbWFzdGVyL2luZnJhc3RydWN0dXJlL2xpZmVjeWNsZWhvb2sueWFtbFxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGluc3RhbmNlIGRyYWluaW5nIGhvb2tcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJbnN0YW5jZURyYWluSG9va1Byb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBBdXRvU2NhbGluZ0dyb3VwIHRvIGluc3RhbGwgdGhlIGluc3RhbmNlIGRyYWluaW5nIGhvb2sgZm9yXG4gICAqL1xuICBhdXRvU2NhbGluZ0dyb3VwOiBhdXRvc2NhbGluZy5JQXV0b1NjYWxpbmdHcm91cDtcblxuICAvKipcbiAgICogVGhlIGNsdXN0ZXIgb24gd2hpY2ggdGFza3MgaGF2ZSBiZWVuIHNjaGVkdWxlZFxuICAgKi9cbiAgY2x1c3RlcjogSUNsdXN0ZXI7XG5cbiAgLyoqXG4gICAqIEhvdyBtYW55IHNlY29uZHMgdG8gZ2l2ZSB0YXNrcyB0byBkcmFpbiBiZWZvcmUgdGhlIGluc3RhbmNlIGlzIHRlcm1pbmF0ZWQgYW55d2F5XG4gICAqXG4gICAqIE11c3QgYmUgYmV0d2VlbiAwIGFuZCAxNSBtaW51dGVzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBEdXJhdGlvbi5taW51dGVzKDE1KVxuICAgKi9cbiAgZHJhaW5UaW1lPzogY2RrLkR1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgSW5zdGFuY2VEcmFpbkhvb2sgY3JlYXRlcyBhbiBTTlMgdG9waWMgZm9yIHRoZSBsaWZlY3ljbGUgaG9vayBvZiB0aGUgQVNHLiBJZiBwcm92aWRlZCwgdGhlbiB0aGlzXG4gICAqIGtleSB3aWxsIGJlIHVzZWQgdG8gZW5jcnlwdCB0aGUgY29udGVudHMgb2YgdGhhdCBTTlMgVG9waWMuXG4gICAqIFNlZSBbU05TIERhdGEgRW5jcnlwdGlvbl0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3Nucy9sYXRlc3QvZGcvc25zLWRhdGEtZW5jcnlwdGlvbi5odG1sKSBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgICpcbiAgICogQGRlZmF1bHQgVGhlIFNOUyBUb3BpYyB3aWxsIG5vdCBiZSBlbmNyeXB0ZWQuXG4gICAqL1xuICB0b3BpY0VuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcbn1cblxuLyoqXG4gKiBBIGhvb2sgdG8gZHJhaW4gaW5zdGFuY2VzIGZyb20gRUNTIHRyYWZmaWMgYmVmb3JlIHRoZXkncmUgdGVybWluYXRlZFxuICovXG5leHBvcnQgY2xhc3MgSW5zdGFuY2VEcmFpbkhvb2sgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBJbnN0YW5jZURyYWluSG9vayBjbGFzcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBJbnN0YW5jZURyYWluSG9va1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkKTtcblxuICAgIGNvbnN0IGRyYWluVGltZSA9IHByb3BzLmRyYWluVGltZSB8fCBjZGsuRHVyYXRpb24ubWludXRlcyg1KTtcblxuICAgIC8vIEludm9rZSBMYW1iZGEgdmlhIFNOUyBUb3BpY1xuICAgIGNvbnN0IGZuID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tSW5saW5lKGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnbGFtYmRhLXNvdXJjZScsICdpbmRleC5weScpLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5sYW1iZGFfaGFuZGxlcicsXG4gICAgICBydW50aW1lOiBsYW1iZGEuUnVudGltZS5QWVRIT05fM185LFxuICAgICAgLy8gVGltZW91dDogc29tZSBleHRyYSBtYXJnaW4gZm9yIGFkZGl0aW9uYWwgQVBJIGNhbGxzIG1hZGUgYnkgdGhlIExhbWJkYSxcbiAgICAgIC8vIHVwIHRvIGEgbWF4aW11bSBvZiAxNSBtaW51dGVzLlxuICAgICAgdGltZW91dDogY2RrLkR1cmF0aW9uLnNlY29uZHMoTWF0aC5taW4oZHJhaW5UaW1lLnRvU2Vjb25kcygpICsgMTAsIDkwMCkpLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgQ0xVU1RFUjogcHJvcHMuY2x1c3Rlci5jbHVzdGVyTmFtZSxcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICAvLyBIb29rIGV2ZXJ5dGhpbmcgdXA6IEFTRyAtPiBUb3BpYywgVG9waWMgLT4gTGFtYmRhXG4gICAgcHJvcHMuYXV0b1NjYWxpbmdHcm91cC5hZGRMaWZlY3ljbGVIb29rKCdEcmFpbkhvb2snLCB7XG4gICAgICBsaWZlY3ljbGVUcmFuc2l0aW9uOiBhdXRvc2NhbGluZy5MaWZlY3ljbGVUcmFuc2l0aW9uLklOU1RBTkNFX1RFUk1JTkFUSU5HLFxuICAgICAgZGVmYXVsdFJlc3VsdDogYXV0b3NjYWxpbmcuRGVmYXVsdFJlc3VsdC5DT05USU5VRSxcbiAgICAgIG5vdGlmaWNhdGlvblRhcmdldDogbmV3IGhvb2tzLkZ1bmN0aW9uSG9vayhmbiwgcHJvcHMudG9waWNFbmNyeXB0aW9uS2V5KSxcbiAgICAgIGhlYXJ0YmVhdFRpbWVvdXQ6IGRyYWluVGltZSxcbiAgICB9KTtcblxuICAgIC8vIERlc2NyaWJlIGFjdGlvbnMgY2Fubm90IGJlIHJlc3RyaWN0ZWQgYW5kIHJlc3RyaWN0IHRoZSBDb21wbGV0ZUxpZmVjeWNsZUFjdGlvbiB0byB0aGUgQVNHIGFyblxuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hdXRvc2NhbGluZy9lYzIvdXNlcmd1aWRlL2NvbnRyb2wtYWNjZXNzLXVzaW5nLWlhbS5odG1sXG4gICAgZm4uYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ2VjMjpEZXNjcmliZUluc3RhbmNlcycsXG4gICAgICAgICdlYzI6RGVzY3JpYmVJbnN0YW5jZUF0dHJpYnV0ZScsXG4gICAgICAgICdlYzI6RGVzY3JpYmVJbnN0YW5jZVN0YXR1cycsXG4gICAgICAgICdlYzI6RGVzY3JpYmVIb3N0cycsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbJyonXSxcbiAgICB9KSk7XG5cbiAgICAvLyBSZXN0cmljdCB0byB0aGUgQVNHXG4gICAgZm4uYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnYXV0b3NjYWxpbmc6Q29tcGxldGVMaWZlY3ljbGVBY3Rpb24nXSxcbiAgICAgIHJlc291cmNlczogW3Byb3BzLmF1dG9TY2FsaW5nR3JvdXAuYXV0b1NjYWxpbmdHcm91cEFybl0sXG4gICAgfSkpO1xuXG4gICAgZm4uYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFsnZWNzOkRlc2NyaWJlQ29udGFpbmVySW5zdGFuY2VzJywgJ2VjczpEZXNjcmliZVRhc2tzJ10sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICBBcm5FcXVhbHM6IHsgJ2VjczpjbHVzdGVyJzogcHJvcHMuY2x1c3Rlci5jbHVzdGVyQXJuIH0sXG4gICAgICB9LFxuICAgIH0pKTtcblxuICAgIC8vIFJlc3RyaWN0IHRvIHRoZSBFQ1MgQ2x1c3RlclxuICAgIGZuLmFkZFRvUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdlY3M6TGlzdENvbnRhaW5lckluc3RhbmNlcycsXG4gICAgICAgICdlY3M6U3VibWl0Q29udGFpbmVyU3RhdGVDaGFuZ2UnLFxuICAgICAgICAnZWNzOlN1Ym1pdFRhc2tTdGF0ZUNoYW5nZScsXG4gICAgICBdLFxuICAgICAgcmVzb3VyY2VzOiBbcHJvcHMuY2x1c3Rlci5jbHVzdGVyQXJuXSxcbiAgICB9KSk7XG5cbiAgICAvLyBSZXN0cmljdCB0aGUgY29udGFpbmVyLWluc3RhbmNlIG9wZXJhdGlvbnMgdG8gdGhlIEVDUyBDbHVzdGVyXG4gICAgZm4uYWRkVG9Sb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ2VjczpVcGRhdGVDb250YWluZXJJbnN0YW5jZXNTdGF0ZScsXG4gICAgICAgICdlY3M6TGlzdFRhc2tzJyxcbiAgICAgIF0sXG4gICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgIEFybkVxdWFsczogeyAnZWNzOmNsdXN0ZXInOiBwcm9wcy5jbHVzdGVyLmNsdXN0ZXJBcm4gfSxcbiAgICAgIH0sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIH0pKTtcbiAgfVxufVxuIl19