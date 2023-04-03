"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const integ = require("@aws-cdk/integ-tests");
const ssm = require("../lib");
const SECURE_PARAM_NAME = '/My/Secret/Parameter';
class CreatingStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        new ssm.StringParameter(this, 'String', {
            parameterName: '/My/Public/Parameter',
            stringValue: 'Abc123',
        });
        new integ.AwsApiCall(this, 'SecureParam', {
            service: 'SSM',
            api: 'putParameter',
            parameters: {
                Name: SECURE_PARAM_NAME,
                Type: 'SecureString',
                Value: 'Abc123',
            },
        });
    }
}
class UsingStack extends cdk.Stack {
    constructor(scope, id) {
        super(scope, id);
        // Parameter that contains version number, will be used to pass
        // version value from token.
        const parameterVersion = new cdk.CfnParameter(this, 'MyParameterVersion', {
            type: 'Number',
            default: 1,
        }).valueAsNumber;
        // Retrieve the latest value of the non-secret parameter
        // with name "/My/String/Parameter".
        const stringValue = ssm.StringParameter.fromStringParameterAttributes(this, 'MyValue', {
            parameterName: '/My/Public/Parameter',
        }).stringValue;
        const stringValueVersionFromToken = ssm.StringParameter.fromStringParameterAttributes(this, 'MyValueVersionFromToken', {
            parameterName: '/My/Public/Parameter',
            // parameter version from token
            version: parameterVersion,
        }).stringValue;
        // Retrieve a specific version of the secret (SecureString) parameter.
        const secretValue = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'MySecureValue', {
            parameterName: '/My/Secret/Parameter',
        }).stringValue;
        const secretValueVersion = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'MySecureValueVersion', {
            parameterName: '/My/Secret/Parameter',
            version: 1,
        }).stringValue;
        const secretValueVersionFromToken = ssm.StringParameter.fromSecureStringParameterAttributes(this, 'MySecureValueVersionFromToken', {
            parameterName: '/My/Secret/Parameter',
            // parameter version from token
            version: parameterVersion,
        }).stringValue;
        const user = new cdk.CfnResource(this, 'DummyResourceUsingStringParameters', {
            type: 'AWS::IAM::User',
            properties: {
                LoginProfile: {
                    Password: cdk.Fn.join('-', [
                        stringValue,
                        stringValueVersionFromToken,
                        secretValue,
                        secretValueVersion,
                        secretValueVersionFromToken,
                    ]),
                },
            },
        });
        user.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);
    }
}
const app = new cdk.App();
const creating = new CreatingStack(app, 'sspms-creating');
const using = new UsingStack(app, 'sspms-using');
using.addDependency(creating);
const cleanup = new cdk.Stack(app, 'sspms-cleanup');
cleanup.addDependency(using);
const integTest = new integ.IntegTest(app, 'SSMParameterStoreTest', {
    assertionStack: cleanup,
    testCases: [using],
});
integTest.assertions.awsApiCall('SSM', 'deleteParameter', {
    Name: SECURE_PARAM_NAME,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGFyYW1ldGVyLXN0b3JlLXN0cmluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnBhcmFtZXRlci1zdG9yZS1zdHJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsOENBQThDO0FBQzlDLDhCQUE4QjtBQUU5QixNQUFNLGlCQUFpQixHQUFHLHNCQUFzQixDQUFDO0FBRWpELE1BQU0sYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUN0QyxhQUFhLEVBQUUsc0JBQXNCO1lBQ3JDLFdBQVcsRUFBRSxRQUFRO1NBQ3RCLENBQUMsQ0FBQztRQUVILElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3hDLE9BQU8sRUFBRSxLQUFLO1lBQ2QsR0FBRyxFQUFFLGNBQWM7WUFDbkIsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLElBQUksRUFBRSxjQUFjO2dCQUNwQixLQUFLLEVBQUUsUUFBUTthQUNoQjtTQUNGLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxNQUFNLFVBQVcsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNoQyxZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsK0RBQStEO1FBQy9ELDRCQUE0QjtRQUM1QixNQUFNLGdCQUFnQixHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDeEUsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsQ0FBQztTQUNYLENBQUMsQ0FBQyxhQUFhLENBQUM7UUFFakIsd0RBQXdEO1FBQ3hELG9DQUFvQztRQUNwQyxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLDZCQUE2QixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDckYsYUFBYSxFQUFFLHNCQUFzQjtTQUV0QyxDQUFDLENBQUMsV0FBVyxDQUFDO1FBQ2YsTUFBTSwyQkFBMkIsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLDZCQUE2QixDQUFDLElBQUksRUFBRSx5QkFBeUIsRUFBRTtZQUNySCxhQUFhLEVBQUUsc0JBQXNCO1lBQ3JDLCtCQUErQjtZQUMvQixPQUFPLEVBQUUsZ0JBQWdCO1NBQzFCLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFFZixzRUFBc0U7UUFDdEUsTUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxtQ0FBbUMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQ2pHLGFBQWEsRUFBRSxzQkFBc0I7U0FDdEMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUNmLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxtQ0FBbUMsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDL0csYUFBYSxFQUFFLHNCQUFzQjtZQUNyQyxPQUFPLEVBQUUsQ0FBQztTQUNYLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFDZixNQUFNLDJCQUEyQixHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsbUNBQW1DLENBQUMsSUFBSSxFQUFFLCtCQUErQixFQUFFO1lBQ2pJLGFBQWEsRUFBRSxzQkFBc0I7WUFDckMsK0JBQStCO1lBQy9CLE9BQU8sRUFBRSxnQkFBZ0I7U0FDMUIsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUVmLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsb0NBQW9DLEVBQUU7WUFDM0UsSUFBSSxFQUFFLGdCQUFnQjtZQUN0QixVQUFVLEVBQUU7Z0JBQ1YsWUFBWSxFQUFFO29CQUNaLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQ3pCLFdBQVc7d0JBQ1gsMkJBQTJCO3dCQUMzQixXQUFXO3dCQUNYLGtCQUFrQjt3QkFDbEIsMkJBQTJCO3FCQUM1QixDQUFDO2lCQUNIO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNwRDtDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxhQUFhLENBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFFMUQsTUFBTSxLQUFLLEdBQUcsSUFBSSxVQUFVLENBQUMsR0FBRyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0FBQ2pELEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFOUIsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUNwRCxPQUFPLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBRTdCLE1BQU0sU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsdUJBQXVCLEVBQUU7SUFDbEUsY0FBYyxFQUFFLE9BQU87SUFDdkIsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQztBQUVILFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtJQUN4RCxJQUFJLEVBQUUsaUJBQWlCO0NBQ3hCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzJztcbmltcG9ydCAqIGFzIHNzbSBmcm9tICcuLi9saWInO1xuXG5jb25zdCBTRUNVUkVfUEFSQU1fTkFNRSA9ICcvTXkvU2VjcmV0L1BhcmFtZXRlcic7XG5cbmNsYXNzIENyZWF0aW5nU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBuZXcgc3NtLlN0cmluZ1BhcmFtZXRlcih0aGlzLCAnU3RyaW5nJywge1xuICAgICAgcGFyYW1ldGVyTmFtZTogJy9NeS9QdWJsaWMvUGFyYW1ldGVyJyxcbiAgICAgIHN0cmluZ1ZhbHVlOiAnQWJjMTIzJyxcbiAgICB9KTtcblxuICAgIG5ldyBpbnRlZy5Bd3NBcGlDYWxsKHRoaXMsICdTZWN1cmVQYXJhbScsIHtcbiAgICAgIHNlcnZpY2U6ICdTU00nLFxuICAgICAgYXBpOiAncHV0UGFyYW1ldGVyJyxcbiAgICAgIHBhcmFtZXRlcnM6IHtcbiAgICAgICAgTmFtZTogU0VDVVJFX1BBUkFNX05BTUUsXG4gICAgICAgIFR5cGU6ICdTZWN1cmVTdHJpbmcnLFxuICAgICAgICBWYWx1ZTogJ0FiYzEyMycsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIFVzaW5nU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBQYXJhbWV0ZXIgdGhhdCBjb250YWlucyB2ZXJzaW9uIG51bWJlciwgd2lsbCBiZSB1c2VkIHRvIHBhc3NcbiAgICAvLyB2ZXJzaW9uIHZhbHVlIGZyb20gdG9rZW4uXG4gICAgY29uc3QgcGFyYW1ldGVyVmVyc2lvbiA9IG5ldyBjZGsuQ2ZuUGFyYW1ldGVyKHRoaXMsICdNeVBhcmFtZXRlclZlcnNpb24nLCB7XG4gICAgICB0eXBlOiAnTnVtYmVyJyxcbiAgICAgIGRlZmF1bHQ6IDEsXG4gICAgfSkudmFsdWVBc051bWJlcjtcblxuICAgIC8vIFJldHJpZXZlIHRoZSBsYXRlc3QgdmFsdWUgb2YgdGhlIG5vbi1zZWNyZXQgcGFyYW1ldGVyXG4gICAgLy8gd2l0aCBuYW1lIFwiL015L1N0cmluZy9QYXJhbWV0ZXJcIi5cbiAgICBjb25zdCBzdHJpbmdWYWx1ZSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXModGhpcywgJ015VmFsdWUnLCB7XG4gICAgICBwYXJhbWV0ZXJOYW1lOiAnL015L1B1YmxpYy9QYXJhbWV0ZXInLFxuICAgICAgLy8gJ3ZlcnNpb24nIGNhbiBiZSBzcGVjaWZpZWQgYnV0IGlzIG9wdGlvbmFsLlxuICAgIH0pLnN0cmluZ1ZhbHVlO1xuICAgIGNvbnN0IHN0cmluZ1ZhbHVlVmVyc2lvbkZyb21Ub2tlbiA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXModGhpcywgJ015VmFsdWVWZXJzaW9uRnJvbVRva2VuJywge1xuICAgICAgcGFyYW1ldGVyTmFtZTogJy9NeS9QdWJsaWMvUGFyYW1ldGVyJyxcbiAgICAgIC8vIHBhcmFtZXRlciB2ZXJzaW9uIGZyb20gdG9rZW5cbiAgICAgIHZlcnNpb246IHBhcmFtZXRlclZlcnNpb24sXG4gICAgfSkuc3RyaW5nVmFsdWU7XG5cbiAgICAvLyBSZXRyaWV2ZSBhIHNwZWNpZmljIHZlcnNpb24gb2YgdGhlIHNlY3JldCAoU2VjdXJlU3RyaW5nKSBwYXJhbWV0ZXIuXG4gICAgY29uc3Qgc2VjcmV0VmFsdWUgPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHRoaXMsICdNeVNlY3VyZVZhbHVlJywge1xuICAgICAgcGFyYW1ldGVyTmFtZTogJy9NeS9TZWNyZXQvUGFyYW1ldGVyJyxcbiAgICB9KS5zdHJpbmdWYWx1ZTtcbiAgICBjb25zdCBzZWNyZXRWYWx1ZVZlcnNpb24gPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHRoaXMsICdNeVNlY3VyZVZhbHVlVmVyc2lvbicsIHtcbiAgICAgIHBhcmFtZXRlck5hbWU6ICcvTXkvU2VjcmV0L1BhcmFtZXRlcicsXG4gICAgICB2ZXJzaW9uOiAxLFxuICAgIH0pLnN0cmluZ1ZhbHVlO1xuICAgIGNvbnN0IHNlY3JldFZhbHVlVmVyc2lvbkZyb21Ub2tlbiA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIuZnJvbVNlY3VyZVN0cmluZ1BhcmFtZXRlckF0dHJpYnV0ZXModGhpcywgJ015U2VjdXJlVmFsdWVWZXJzaW9uRnJvbVRva2VuJywge1xuICAgICAgcGFyYW1ldGVyTmFtZTogJy9NeS9TZWNyZXQvUGFyYW1ldGVyJyxcbiAgICAgIC8vIHBhcmFtZXRlciB2ZXJzaW9uIGZyb20gdG9rZW5cbiAgICAgIHZlcnNpb246IHBhcmFtZXRlclZlcnNpb24sXG4gICAgfSkuc3RyaW5nVmFsdWU7XG5cbiAgICBjb25zdCB1c2VyID0gbmV3IGNkay5DZm5SZXNvdXJjZSh0aGlzLCAnRHVtbXlSZXNvdXJjZVVzaW5nU3RyaW5nUGFyYW1ldGVycycsIHtcbiAgICAgIHR5cGU6ICdBV1M6OklBTTo6VXNlcicsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIExvZ2luUHJvZmlsZToge1xuICAgICAgICAgIFBhc3N3b3JkOiBjZGsuRm4uam9pbignLScsIFtcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlLFxuICAgICAgICAgICAgc3RyaW5nVmFsdWVWZXJzaW9uRnJvbVRva2VuLFxuICAgICAgICAgICAgc2VjcmV0VmFsdWUsXG4gICAgICAgICAgICBzZWNyZXRWYWx1ZVZlcnNpb24sXG4gICAgICAgICAgICBzZWNyZXRWYWx1ZVZlcnNpb25Gcm9tVG9rZW4sXG4gICAgICAgICAgXSksXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pO1xuICAgIHVzZXIuYXBwbHlSZW1vdmFsUG9saWN5KGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1kpO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IGNyZWF0aW5nID0gbmV3IENyZWF0aW5nU3RhY2soYXBwLCAnc3NwbXMtY3JlYXRpbmcnKTtcblxuY29uc3QgdXNpbmcgPSBuZXcgVXNpbmdTdGFjayhhcHAsICdzc3Btcy11c2luZycpO1xudXNpbmcuYWRkRGVwZW5kZW5jeShjcmVhdGluZyk7XG5cbmNvbnN0IGNsZWFudXAgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ3NzcG1zLWNsZWFudXAnKTtcbmNsZWFudXAuYWRkRGVwZW5kZW5jeSh1c2luZyk7XG5cbmNvbnN0IGludGVnVGVzdCA9IG5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnU1NNUGFyYW1ldGVyU3RvcmVUZXN0Jywge1xuICBhc3NlcnRpb25TdGFjazogY2xlYW51cCxcbiAgdGVzdENhc2VzOiBbdXNpbmddLFxufSk7XG5cbmludGVnVGVzdC5hc3NlcnRpb25zLmF3c0FwaUNhbGwoJ1NTTScsICdkZWxldGVQYXJhbWV0ZXInLCB7XG4gIE5hbWU6IFNFQ1VSRV9QQVJBTV9OQU1FLFxufSk7XG4iXX0=