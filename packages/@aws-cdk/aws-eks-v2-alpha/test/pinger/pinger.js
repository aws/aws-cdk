"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pinger = void 0;
const lambda = require("aws-cdk-lib/aws-lambda");
const core_1 = require("aws-cdk-lib/core");
const cr = require("aws-cdk-lib/custom-resources");
const constructs_1 = require("constructs");
class Pinger extends constructs_1.Construct {
    _resource;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGluZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlEQUFpRDtBQUNqRCwyQ0FBbUU7QUFDbkUsbURBQW1EO0FBQ25ELDJDQUF1QztBQVF2QyxNQUFhLE1BQU8sU0FBUSxzQkFBUztJQUMzQixTQUFTLENBQWlCO0lBRWxDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNqRCxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLFdBQVcsQ0FBQztZQUNwRCxPQUFPLEVBQUUsZUFBZTtZQUN4QixPQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1lBQ2xDLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztZQUNkLFVBQVUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDbEUsY0FBYyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ3ZFLE9BQU8sRUFBRSxlQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztTQUM5QixDQUFDLENBQUM7UUFFSCxNQUFNLFFBQVEsR0FBRyxJQUFJLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNqRCxjQUFjLEVBQUUsSUFBSTtTQUNyQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUkscUJBQWMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ3BELFlBQVksRUFBRSxRQUFRLENBQUMsWUFBWTtZQUNuQyxVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEtBQUssQ0FBQyxHQUFHO2FBQ2Y7U0FDRixDQUFDLENBQUM7S0FDSjtJQUVELElBQVcsUUFBUTtRQUNqQixPQUFPLFlBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUN2RDtDQUNGO0FBL0JELHdCQStCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCB7IEN1c3RvbVJlc291cmNlLCBUb2tlbiwgRHVyYXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9jb3JlJztcbmltcG9ydCAqIGFzIGNyIGZyb20gJ2F3cy1jZGstbGliL2N1c3RvbS1yZXNvdXJjZXMnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGluZ2VyUHJvcHMge1xuICByZWFkb25seSB1cmw6IHN0cmluZztcbiAgcmVhZG9ubHkgc2VjdXJpdHlHcm91cD86IGVjMi5TZWN1cml0eUdyb3VwO1xuICByZWFkb25seSB2cGM/OiBlYzIuSVZwYztcbiAgcmVhZG9ubHkgc3VibmV0cz86IGVjMi5JU3VibmV0W107XG59XG5leHBvcnQgY2xhc3MgUGluZ2VyIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgcHJpdmF0ZSBfcmVzb3VyY2U6IEN1c3RvbVJlc291cmNlO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQaW5nZXJQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBjb25zdCBmdW5jID0gbmV3IGxhbWJkYS5GdW5jdGlvbih0aGlzLCAnRnVuY3Rpb24nLCB7XG4gICAgICBjb2RlOiBsYW1iZGEuQ29kZS5mcm9tQXNzZXQoYCR7X19kaXJuYW1lfS9mdW5jdGlvbmApLFxuICAgICAgaGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgcnVudGltZTogbGFtYmRhLlJ1bnRpbWUuUFlUSE9OXzNfOSxcbiAgICAgIHZwYzogcHJvcHMudnBjLFxuICAgICAgdnBjU3VibmV0czogcHJvcHMuc3VibmV0cyA/IHsgc3VibmV0czogcHJvcHMuc3VibmV0cyB9IDogdW5kZWZpbmVkLFxuICAgICAgc2VjdXJpdHlHcm91cHM6IHByb3BzLnNlY3VyaXR5R3JvdXAgPyBbcHJvcHMuc2VjdXJpdHlHcm91cF0gOiB1bmRlZmluZWQsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5taW51dGVzKDEwKSxcbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3ZpZGVyID0gbmV3IGNyLlByb3ZpZGVyKHRoaXMsICdQcm92aWRlcicsIHtcbiAgICAgIG9uRXZlbnRIYW5kbGVyOiBmdW5jLFxuICAgIH0pO1xuXG4gICAgdGhpcy5fcmVzb3VyY2UgPSBuZXcgQ3VzdG9tUmVzb3VyY2UodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgc2VydmljZVRva2VuOiBwcm92aWRlci5zZXJ2aWNlVG9rZW4sXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIFVybDogcHJvcHMudXJsLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgcmVzcG9uc2UoKSB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMuX3Jlc291cmNlLmdldEF0dCgnVmFsdWUnKSk7XG4gIH1cbn1cbiJdfQ==