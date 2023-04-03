"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const ecs = require("../lib");
describe('When import an ECS Service', () => {
    let stack;
    beforeEach(() => {
        stack = new cdk.Stack();
    });
    test('with serviceArnWithCluster', () => {
        // GIVEN
        const clusterName = 'cluster-name';
        const serviceName = 'my-http-service';
        const region = 'service-region';
        const account = 'service-account';
        const serviceArn = `arn:aws:ecs:${region}:${account}:service/${clusterName}/${serviceName}`;
        // WHEN
        const service = ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', serviceArn);
        // THEN
        expect(service.serviceArn).toEqual(serviceArn);
        expect(service.serviceName).toEqual(serviceName);
        expect(service.env.account).toEqual(account);
        expect(service.env.region).toEqual(region);
        expect(service.cluster.clusterName).toEqual(clusterName);
        expect(service.cluster.env.account).toEqual(account);
        expect(service.cluster.env.region).toEqual(region);
    });
    test('throws an expection if no resourceName provided on fromServiceArnWithCluster', () => {
        expect(() => {
            ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', 'arn:aws:ecs:service-region:service-account:service');
        }).toThrowError(/Missing resource Name from service ARN/);
    });
    test('throws an expection if not using cluster arn format on fromServiceArnWithCluster', () => {
        expect(() => {
            ecs.BaseService.fromServiceArnWithCluster(stack, 'Service', 'arn:aws:ecs:service-region:service-account:service/my-http-service');
        }).toThrowError(/is not using the ARN cluster format/);
    });
});
test.each([
    /* breaker, flag => controller in template */
    /* Flag off => value present if circuitbreaker */
    [false, false, false],
    [true, false, true],
    /* Flag on => value never present */
    [false, true, false],
    [true, true, false],
])('circuitbreaker is %p /\\ flag is %p => DeploymentController in output: %p', (circuitBreaker, flagValue, controllerInTemplate) => {
    // GIVEN
    const app = new core_1.App({
        context: {
            '@aws-cdk/aws-ecs:disableExplicitDeploymentControllerForCircuitBreaker': flagValue,
        },
    });
    const stack = new core_1.Stack(app, 'Stack');
    const vpc = new ec2.Vpc(stack, 'Vpc');
    const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
    const taskDefinition = new ecs.FargateTaskDefinition(stack, 'FargateTaskDef');
    taskDefinition.addContainer('web', {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    });
    // WHEN
    new ecs.FargateService(stack, 'FargateService', {
        cluster,
        taskDefinition,
        circuitBreaker: circuitBreaker ? {} : undefined,
    });
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    template.hasResourceProperties('AWS::ECS::Service', {
        DeploymentController: controllerInTemplate ? { Type: 'ECS' } : assertions_1.Match.absent(),
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1zZXJ2aWNlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJiYXNlLXNlcnZpY2UudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMscUNBQXFDO0FBQ3JDLHdDQUEyQztBQUMzQyw4QkFBOEI7QUFFOUIsUUFBUSxDQUFDLDRCQUE0QixFQUFFLEdBQUcsRUFBRTtJQUMxQyxJQUFJLEtBQWdCLENBQUM7SUFFckIsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7UUFDdEMsUUFBUTtRQUNSLE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQztRQUNuQyxNQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQztRQUN0QyxNQUFNLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQztRQUNoQyxNQUFNLE9BQU8sR0FBRyxpQkFBaUIsQ0FBQztRQUNsQyxNQUFNLFVBQVUsR0FBRyxlQUFlLE1BQU0sSUFBSSxPQUFPLFlBQVksV0FBVyxJQUFJLFdBQVcsRUFBRSxDQUFDO1FBRTVGLE9BQU87UUFDUCxNQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFeEYsT0FBTztRQUNQLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztR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Q0FBQyxDQUFDO0lBQzNDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxtQkFBbUIsRUFBRTtRQUNsRCxvQkFBb0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLGtCQUFLLENBQUMsTUFBTSxFQUFFO0tBQzlFLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnLi4vbGliJztcblxuZGVzY3JpYmUoJ1doZW4gaW1wb3J0IGFuIEVDUyBTZXJ2aWNlJywgKCkgPT4ge1xuICBsZXQgc3RhY2s6IGNkay5TdGFjaztcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgfSk7XG5cbiAgdGVzdCgnd2l0aCBzZXJ2aWNlQXJuV2l0aENsdXN0ZXInLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCBjbHVzdGVyTmFtZSA9ICdjbHVzdGVyLW5hbWUnO1xuICAgIGNvbnN0IHNlcnZpY2VOYW1lID0gJ215LWh0dHAtc2VydmljZSc7XG4gICAgY29uc3QgcmVnaW9uID0gJ3NlcnZpY2UtcmVnaW9uJztcbiAgICBjb25zdCBhY2NvdW50ID0gJ3NlcnZpY2UtYWNjb3VudCc7XG4gICAgY29uc3Qgc2VydmljZUFybiA9IGBhcm46YXdzOmVjczoke3JlZ2lvbn06JHthY2NvdW50fTpzZXJ2aWNlLyR7Y2x1c3Rlck5hbWV9LyR7c2VydmljZU5hbWV9YDtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCBzZXJ2aWNlID0gZWNzLkJhc2VTZXJ2aWNlLmZyb21TZXJ2aWNlQXJuV2l0aENsdXN0ZXIoc3RhY2ssICdTZXJ2aWNlJywgc2VydmljZUFybik7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHNlcnZpY2Uuc2VydmljZUFybikudG9FcXVhbChzZXJ2aWNlQXJuKTtcbiAgICBleHBlY3Qoc2VydmljZS5zZXJ2aWNlTmFtZSkudG9FcXVhbChzZXJ2aWNlTmFtZSk7XG4gICAgZXhwZWN0KHNlcnZpY2UuZW52LmFjY291bnQpLnRvRXF1YWwoYWNjb3VudCk7XG4gICAgZXhwZWN0KHNlcnZpY2UuZW52LnJlZ2lvbikudG9FcXVhbChyZWdpb24pO1xuXG4gICAgZXhwZWN0KHNlcnZpY2UuY2x1c3Rlci5jbHVzdGVyTmFtZSkudG9FcXVhbChjbHVzdGVyTmFtZSk7XG4gICAgZXhwZWN0KHNlcnZpY2UuY2x1c3Rlci5lbnYuYWNjb3VudCkudG9FcXVhbChhY2NvdW50KTtcbiAgICBleHBlY3Qoc2VydmljZS5jbHVzdGVyLmVudi5yZWdpb24pLnRvRXF1YWwocmVnaW9uKTtcbiAgfSk7XG5cbiAgdGVzdCgndGhyb3dzIGFuIGV4cGVjdGlvbiBpZiBubyByZXNvdXJjZU5hbWUgcHJvdmlkZWQgb24gZnJvbVNlcnZpY2VBcm5XaXRoQ2x1c3RlcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgZWNzLkJhc2VTZXJ2aWNlLmZyb21TZXJ2aWNlQXJuV2l0aENsdXN0ZXIoc3RhY2ssICdTZXJ2aWNlJywgJ2Fybjphd3M6ZWNzOnNlcnZpY2UtcmVnaW9uOnNlcnZpY2UtYWNjb3VudDpzZXJ2aWNlJyk7XG4gICAgfSkudG9UaHJvd0Vycm9yKC9NaXNzaW5nIHJlc291cmNlIE5hbWUgZnJvbSBzZXJ2aWNlIEFSTi8pO1xuICB9KTtcblxuICB0ZXN0KCd0aHJvd3MgYW4gZXhwZWN0aW9uIGlmIG5vdCB1c2luZyBjbHVzdGVyIGFybiBmb3JtYXQgb24gZnJvbVNlcnZpY2VBcm5XaXRoQ2x1c3RlcicsICgpID0+IHtcbiAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgZWNzLkJhc2VTZXJ2aWNlLmZyb21TZXJ2aWNlQXJuV2l0aENsdXN0ZXIoc3RhY2ssICdTZXJ2aWNlJywgJ2Fybjphd3M6ZWNzOnNlcnZpY2UtcmVnaW9uOnNlcnZpY2UtYWNjb3VudDpzZXJ2aWNlL215LWh0dHAtc2VydmljZScpO1xuICAgIH0pLnRvVGhyb3dFcnJvcigvaXMgbm90IHVzaW5nIHRoZSBBUk4gY2x1c3RlciBmb3JtYXQvKTtcbiAgfSk7XG59KTtcblxudGVzdC5lYWNoKFtcbiAgLyogYnJlYWtlciwgZmxhZyA9PiBjb250cm9sbGVyIGluIHRlbXBsYXRlICovXG4gIC8qIEZsYWcgb2ZmID0+IHZhbHVlIHByZXNlbnQgaWYgY2lyY3VpdGJyZWFrZXIgKi9cbiAgW2ZhbHNlLCBmYWxzZSwgZmFsc2VdLFxuICBbdHJ1ZSwgZmFsc2UsIHRydWVdLFxuICAvKiBGbGFnIG9uID0+IHZhbHVlIG5ldmVyIHByZXNlbnQgKi9cbiAgW2ZhbHNlLCB0cnVlLCBmYWxzZV0sXG4gIFt0cnVlLCB0cnVlLCBmYWxzZV0sXG5dKSgnY2lyY3VpdGJyZWFrZXIgaXMgJXAgL1xcXFwgZmxhZyBpcyAlcCA9PiBEZXBsb3ltZW50Q29udHJvbGxlciBpbiBvdXRwdXQ6ICVwJywgKGNpcmN1aXRCcmVha2VyLCBmbGFnVmFsdWUsIGNvbnRyb2xsZXJJblRlbXBsYXRlKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IGFwcCA9IG5ldyBBcHAoe1xuICAgIGNvbnRleHQ6IHtcbiAgICAgICdAYXdzLWNkay9hd3MtZWNzOmRpc2FibGVFeHBsaWNpdERlcGxveW1lbnRDb250cm9sbGVyRm9yQ2lyY3VpdEJyZWFrZXInOiBmbGFnVmFsdWUsXG4gICAgfSxcbiAgfSk7XG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKGFwcCwgJ1N0YWNrJyk7XG4gIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJyk7XG4gIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG4gIGNvbnN0IHRhc2tEZWZpbml0aW9uID0gbmV3IGVjcy5GYXJnYXRlVGFza0RlZmluaXRpb24oc3RhY2ssICdGYXJnYXRlVGFza0RlZicpO1xuICB0YXNrRGVmaW5pdGlvbi5hZGRDb250YWluZXIoJ3dlYicsIHtcbiAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gIH0pO1xuXG4gIC8vIFdIRU5cbiAgbmV3IGVjcy5GYXJnYXRlU2VydmljZShzdGFjaywgJ0ZhcmdhdGVTZXJ2aWNlJywge1xuICAgIGNsdXN0ZXIsXG4gICAgdGFza0RlZmluaXRpb24sXG4gICAgY2lyY3VpdEJyZWFrZXI6IGNpcmN1aXRCcmVha2VyID8geyB9IDogdW5kZWZpbmVkLFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkVDUzo6U2VydmljZScsIHtcbiAgICBEZXBsb3ltZW50Q29udHJvbGxlcjogY29udHJvbGxlckluVGVtcGxhdGUgPyB7IFR5cGU6ICdFQ1MnIH0gOiBNYXRjaC5hYnNlbnQoKSxcbiAgfSk7XG59KTsiXX0=