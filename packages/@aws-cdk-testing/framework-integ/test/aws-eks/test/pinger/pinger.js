"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pinger = void 0;
const lambda = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const cr = require("aws-cdk-lib/custom-resources");
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
            timeout: aws_cdk_lib_1.Duration.minutes(10),
        });
        const provider = new cr.Provider(this, 'Provider', {
            onEventHandler: func,
        });
        this._resource = new aws_cdk_lib_1.CustomResource(this, 'Resource', {
            serviceToken: provider.serviceToken,
            properties: {
                Url: props.url,
            },
        });
    }
    get response() {
        return aws_cdk_lib_1.Token.asString(this._resource.getAtt('Value'));
    }
}
exports.Pinger = Pinger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGluZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGluZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlEQUFpRDtBQUNqRCw2Q0FBOEQ7QUFDOUQsbURBQW1EO0FBQ25ELDJDQUF1QztBQVF2QyxNQUFhLE1BQU8sU0FBUSxzQkFBUztJQUluQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQzFELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakQsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxXQUFXLENBQUM7WUFDcEQsT0FBTyxFQUFFLGVBQWU7WUFDeEIsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVTtZQUNsQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7WUFDZCxVQUFVLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ2xFLGNBQWMsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUztZQUN2RSxPQUFPLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQzlCLENBQUMsQ0FBQztRQUVILE1BQU0sUUFBUSxHQUFHLElBQUksRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2pELGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSw0QkFBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDcEQsWUFBWSxFQUFFLFFBQVEsQ0FBQyxZQUFZO1lBQ25DLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7YUFDZjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxJQUFXLFFBQVE7UUFDakIsT0FBTyxtQkFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7Q0FDRjtBQWhDRCx3QkFnQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgeyBDdXN0b21SZXNvdXJjZSwgVG9rZW4sIER1cmF0aW9uIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY3IgZnJvbSAnYXdzLWNkay1saWIvY3VzdG9tLXJlc291cmNlcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuZXhwb3J0IGludGVyZmFjZSBQaW5nZXJQcm9wcyB7XG4gIHJlYWRvbmx5IHVybDogc3RyaW5nO1xuICByZWFkb25seSBzZWN1cml0eUdyb3VwPzogZWMyLlNlY3VyaXR5R3JvdXA7XG4gIHJlYWRvbmx5IHZwYz86IGVjMi5JVnBjO1xuICByZWFkb25seSBzdWJuZXRzPzogZWMyLklTdWJuZXRbXTtcbn1cbmV4cG9ydCBjbGFzcyBQaW5nZXIgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIHByaXZhdGUgX3Jlc291cmNlOiBDdXN0b21SZXNvdXJjZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUGluZ2VyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgY29uc3QgZnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgJ0Z1bmN0aW9uJywge1xuICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KGAke19fZGlybmFtZX0vZnVuY3Rpb25gKSxcbiAgICAgIGhhbmRsZXI6ICdpbmRleC5oYW5kbGVyJyxcbiAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLlBZVEhPTl8zXzksXG4gICAgICB2cGM6IHByb3BzLnZwYyxcbiAgICAgIHZwY1N1Ym5ldHM6IHByb3BzLnN1Ym5ldHMgPyB7IHN1Ym5ldHM6IHByb3BzLnN1Ym5ldHMgfSA6IHVuZGVmaW5lZCxcbiAgICAgIHNlY3VyaXR5R3JvdXBzOiBwcm9wcy5zZWN1cml0eUdyb3VwID8gW3Byb3BzLnNlY3VyaXR5R3JvdXBdIDogdW5kZWZpbmVkLFxuICAgICAgdGltZW91dDogRHVyYXRpb24ubWludXRlcygxMCksXG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm92aWRlciA9IG5ldyBjci5Qcm92aWRlcih0aGlzLCAnUHJvdmlkZXInLCB7XG4gICAgICBvbkV2ZW50SGFuZGxlcjogZnVuYyxcbiAgICB9KTtcblxuICAgIHRoaXMuX3Jlc291cmNlID0gbmV3IEN1c3RvbVJlc291cmNlKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIHNlcnZpY2VUb2tlbjogcHJvdmlkZXIuc2VydmljZVRva2VuLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBVcmw6IHByb3BzLnVybCxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IHJlc3BvbnNlKCkge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyh0aGlzLl9yZXNvdXJjZS5nZXRBdHQoJ1ZhbHVlJykpO1xuICB9XG59XG4iXX0=