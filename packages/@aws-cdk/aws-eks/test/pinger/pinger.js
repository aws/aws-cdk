"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pinger = void 0;
const lambda = require("@aws-cdk/aws-lambda");
const core_1 = require("@aws-cdk/core");
const cr = require("@aws-cdk/custom-resources");
const constructs_1 = require("constructs");
class Pinger extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const func = new lambda.Function(this, 'Function', {
            code: lambda.Code.fromAsset(`${__dirname}/function`),
            handler: 'index.handler',
            runtime: lambda.Runtime.PYTHON_3_9,
            vpc: props.vpc,
            vpcSubnets: props.subnets ? { subnets: props.subnets } : undefined,
            securityGroups: props.securityGroup ? [props.securityGroup] : undefined,
            timeout: core_1.Duration.minutes(10),
        });
        const provider = new cr.Provider(this, 'Provider', {
            onEventHandler: func,
        });
        this._resource = new core_1.CustomResource(this, 'Resource', {
            serviceToken: provider.serviceToken,
            properties: {
                Url: props.url,
            },
        });
    }
    get response() {
        return core_1.Token.asString(this._resource.getAtt('Value'));
    }
}
exports.Pinger = Pinger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGluZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDhDQUE4QztBQUM5Qyx3Q0FBZ0U7QUFDaEUsZ0RBQWdEO0FBQ2hELDJDQUF1QztBQVF2QyxNQUFhLE1BQU8sU0FBUSxzQkFBUztJQUluQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakQsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxXQUFXLENBQUM7WUFDcEQsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxVQUFVLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ2xFLGNBQWMsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUN2RSxPQUFPLEVBQUUsZUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7U0FDOUIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakQsY0FBYyxFQUFFLElBQUk7U0FDckIsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLHFCQUFjLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNwRCxZQUFZLEVBQUUsUUFBUSxDQUFDLFlBQVk7WUFDbkMsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRzthQUNmO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxJQUFXLFFBQVE7UUFDakIsT0FBTyxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7S0FDdkQ7Q0FDRjtBQWhDRCx3QkFnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnQGF3cy1jZGsvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZSwgVG9rZW4sIER1cmF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjciBmcm9tICdAYXdzLWNkay9jdXN0b20tcmVzb3VyY2VzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBpbmdlclByb3BzIHtcbiAgcmVhZG9ubHkgdXJsOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHNlY3VyaXR5R3JvdXA/OiBlYzIuU2VjdXJpdHlHcm91cDtcbiAgcmVhZG9ubHkgdnBjPzogZWMyLklWcGM7XG4gIHJlYWRvbmx5IHN1Ym5ldHM/OiBlYzIuSVN1Ym5ldFtdO1xufVxuZXhwb3J0IGNsYXNzIFBpbmdlciBleHRlbmRzIENvbnN0cnVjdCB7XG5cbiAgcHJpdmF0ZSBfcmVzb3VyY2U6IEN1c3RvbVJlc291cmNlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQaW5nZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBmdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoYCR7X19kaXJuYW1lfS9mdW5jdGlvbmApLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgIHZwYzogcHJvcHMudnBjLFxuICAgICAgdnBjU3VibmV0czogcHJvcHMuc3VibmV0cyA/IHsgc3VibmV0czogcHJvcHMuc3VibmV0cyB9IDogdW5kZWZpbmVkLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IHByb3BzLnNlY3VyaXR5R3JvdXAgPyBbcHJvcHMuc2VjdXJpdHlHcm91cF0gOiB1bmRlZmluZWQsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDEwKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IGNyLlByb3ZpZGVyKHRoaXMsICdQcm92aWRlcicsIHtcbiAgICAgIG9uRXZlbnRIYW5kbGVyOiBmdW5jLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fcmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgc2VydmljZVRva2VuOiBwcm92aWRlci5zZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFVybDogcHJvcHMudXJsLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMuX3Jlc291cmNlLmdldEF0dCgnVmFsdWUnKSk7XG4gIH1cbn1cbiJdfQ==