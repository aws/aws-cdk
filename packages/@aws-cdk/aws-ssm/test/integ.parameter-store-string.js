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
            // 'version' can be specified but is optional.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucGFyYW1ldGVyLXN0b3JlLXN0cmluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnBhcmFtZXRlci1zdG9yZS1zdHJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBcUM7QUFDckMsOENBQThDO0FBQzlDLDhCQUE4QjtBQUU5QixNQUFNLGlCQUFpQixHQUFHLHNCQUFzQixDQUFDO0FBRWpELE1BQU0sYUFBYyxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ25DLFlBQVksS0FBYyxFQUFFLEVBQVU7UUFDcEMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqQixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUN0QyxhQUFhLEVBQUUsc0JBQXNCO1lBQ3JDLFdBQVcsRUFBRSxRQUFRO1NBQ3RCLENBQUMsQ0FBQztRQUVILElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3hDLE9BQU8sRUFBRSxLQUFLO1lBQ2QsR0FBRyxFQUFFLGNBQWM7WUFDbkIsVUFBVSxFQUFFO2dCQUNWLElBQUksRUFBRSxpQkFBaUI7Z0JBQ3ZCLElBQUksRUFBRSxjQUFjO2dCQUNwQixLQUFLLEVBQUUsUUFBUTthQUNoQjtTQUNGLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxNQUFNLFVBQVcsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNoQyxZQUFZLEtBQWMsRUFBRSxFQUFVO1FBQ3BDLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsK0RBQStEO1FBQy9ELDRCQUE0QjtRQUM1QixNQUFNLGdCQUFnQixHQUFHLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDeEUsSUFBSSxFQUFFLFFBQVE7WUFDZCxPQUFPLEVBQUUsQ0FBQztTQUNYLENBQUMsQ0FBQyxhQUFhLENBQUM7UUFFakIsd0RBQXdEO1FBQ3hELG9DQUFvQztRQUNwQyxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLDZCQUE2QixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDckYsYUFBYSxFQUFFLHNCQUFzQjtZQUNyQyw4Q0FBOEM7U0FDL0MsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUNmLE1BQU0sMkJBQTJCLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyw2QkFBNkIsQ0FBQyxJQUFJLEVBQUUseUJBQXlCLEVBQUU7WUFDckgsYUFBYSxFQUFFLHNCQUFzQjtZQUNyQywrQkFBK0I7WUFDL0IsT0FBTyxFQUFFLGdCQUFnQjtTQUMxQixDQUFDLENBQUMsV0FBVyxDQUFDO1FBRWYsc0VBQXNFO1FBQ3RFLE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsbUNBQW1DLENBQUMsSUFBSSxFQUFFLGVBQWUsRUFBRTtZQUNqRyxhQUFhLEVBQUUsc0JBQXNCO1NBQ3RDLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFDZixNQUFNLGtCQUFrQixHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsbUNBQW1DLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFO1lBQy9HLGFBQWEsRUFBRSxzQkFBc0I7WUFDckMsT0FBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQUMsV0FBVyxDQUFDO1FBQ2YsTUFBTSwyQkFBMkIsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLG1DQUFtQyxDQUFDLElBQUksRUFBRSwrQkFBK0IsRUFBRTtZQUNqSSxhQUFhLEVBQUUsc0JBQXNCO1lBQ3JDLCtCQUErQjtZQUMvQixPQUFPLEVBQUUsZ0JBQWdCO1NBQzFCLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFFZixNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLG9DQUFvQyxFQUFFO1lBQzNFLElBQUksRUFBRSxnQkFBZ0I7WUFDdEIsVUFBVSxFQUFFO2dCQUNWLFlBQVksRUFBRTtvQkFDWixRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO3dCQUN6QixXQUFXO3dCQUNYLDJCQUEyQjt3QkFDM0IsV0FBVzt3QkFDWCxrQkFBa0I7d0JBQ2xCLDJCQUEyQjtxQkFDNUIsQ0FBQztpQkFDSDthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDcEQ7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sUUFBUSxHQUFHLElBQUksYUFBYSxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBRTFELE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFDLEdBQUcsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUNqRCxLQUFLLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBRTlCLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDcEQsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUU3QixNQUFNLFNBQVMsR0FBRyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLHVCQUF1QixFQUFFO0lBQ2xFLGNBQWMsRUFBRSxPQUFPO0lBQ3ZCLFNBQVMsRUFBRSxDQUFDLEtBQUssQ0FBQztDQUNuQixDQUFDLENBQUM7QUFFSCxTQUFTLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLEVBQUU7SUFDeEQsSUFBSSxFQUFFLGlCQUFpQjtDQUN4QixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBpbnRlZyBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cyc7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnLi4vbGliJztcblxuY29uc3QgU0VDVVJFX1BBUkFNX05BTUUgPSAnL015L1NlY3JldC9QYXJhbWV0ZXInO1xuXG5jbGFzcyBDcmVhdGluZ1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgbmV3IHNzbS5TdHJpbmdQYXJhbWV0ZXIodGhpcywgJ1N0cmluZycsIHtcbiAgICAgIHBhcmFtZXRlck5hbWU6ICcvTXkvUHVibGljL1BhcmFtZXRlcicsXG4gICAgICBzdHJpbmdWYWx1ZTogJ0FiYzEyMycsXG4gICAgfSk7XG5cbiAgICBuZXcgaW50ZWcuQXdzQXBpQ2FsbCh0aGlzLCAnU2VjdXJlUGFyYW0nLCB7XG4gICAgICBzZXJ2aWNlOiAnU1NNJyxcbiAgICAgIGFwaTogJ3B1dFBhcmFtZXRlcicsXG4gICAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIE5hbWU6IFNFQ1VSRV9QQVJBTV9OQU1FLFxuICAgICAgICBUeXBlOiAnU2VjdXJlU3RyaW5nJyxcbiAgICAgICAgVmFsdWU6ICdBYmMxMjMnLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBVc2luZ1N0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgLy8gUGFyYW1ldGVyIHRoYXQgY29udGFpbnMgdmVyc2lvbiBudW1iZXIsIHdpbGwgYmUgdXNlZCB0byBwYXNzXG4gICAgLy8gdmVyc2lvbiB2YWx1ZSBmcm9tIHRva2VuLlxuICAgIGNvbnN0IHBhcmFtZXRlclZlcnNpb24gPSBuZXcgY2RrLkNmblBhcmFtZXRlcih0aGlzLCAnTXlQYXJhbWV0ZXJWZXJzaW9uJywge1xuICAgICAgdHlwZTogJ051bWJlcicsXG4gICAgICBkZWZhdWx0OiAxLFxuICAgIH0pLnZhbHVlQXNOdW1iZXI7XG5cbiAgICAvLyBSZXRyaWV2ZSB0aGUgbGF0ZXN0IHZhbHVlIG9mIHRoZSBub24tc2VjcmV0IHBhcmFtZXRlclxuICAgIC8vIHdpdGggbmFtZSBcIi9NeS9TdHJpbmcvUGFyYW1ldGVyXCIuXG4gICAgY29uc3Qgc3RyaW5nVmFsdWUgPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHRoaXMsICdNeVZhbHVlJywge1xuICAgICAgcGFyYW1ldGVyTmFtZTogJy9NeS9QdWJsaWMvUGFyYW1ldGVyJyxcbiAgICAgIC8vICd2ZXJzaW9uJyBjYW4gYmUgc3BlY2lmaWVkIGJ1dCBpcyBvcHRpb25hbC5cbiAgICB9KS5zdHJpbmdWYWx1ZTtcbiAgICBjb25zdCBzdHJpbmdWYWx1ZVZlcnNpb25Gcm9tVG9rZW4gPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHRoaXMsICdNeVZhbHVlVmVyc2lvbkZyb21Ub2tlbicsIHtcbiAgICAgIHBhcmFtZXRlck5hbWU6ICcvTXkvUHVibGljL1BhcmFtZXRlcicsXG4gICAgICAvLyBwYXJhbWV0ZXIgdmVyc2lvbiBmcm9tIHRva2VuXG4gICAgICB2ZXJzaW9uOiBwYXJhbWV0ZXJWZXJzaW9uLFxuICAgIH0pLnN0cmluZ1ZhbHVlO1xuXG4gICAgLy8gUmV0cmlldmUgYSBzcGVjaWZpYyB2ZXJzaW9uIG9mIHRoZSBzZWNyZXQgKFNlY3VyZVN0cmluZykgcGFyYW1ldGVyLlxuICAgIGNvbnN0IHNlY3JldFZhbHVlID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyh0aGlzLCAnTXlTZWN1cmVWYWx1ZScsIHtcbiAgICAgIHBhcmFtZXRlck5hbWU6ICcvTXkvU2VjcmV0L1BhcmFtZXRlcicsXG4gICAgfSkuc3RyaW5nVmFsdWU7XG4gICAgY29uc3Qgc2VjcmV0VmFsdWVWZXJzaW9uID0gc3NtLlN0cmluZ1BhcmFtZXRlci5mcm9tU2VjdXJlU3RyaW5nUGFyYW1ldGVyQXR0cmlidXRlcyh0aGlzLCAnTXlTZWN1cmVWYWx1ZVZlcnNpb24nLCB7XG4gICAgICBwYXJhbWV0ZXJOYW1lOiAnL015L1NlY3JldC9QYXJhbWV0ZXInLFxuICAgICAgdmVyc2lvbjogMSxcbiAgICB9KS5zdHJpbmdWYWx1ZTtcbiAgICBjb25zdCBzZWNyZXRWYWx1ZVZlcnNpb25Gcm9tVG9rZW4gPSBzc20uU3RyaW5nUGFyYW1ldGVyLmZyb21TZWN1cmVTdHJpbmdQYXJhbWV0ZXJBdHRyaWJ1dGVzKHRoaXMsICdNeVNlY3VyZVZhbHVlVmVyc2lvbkZyb21Ub2tlbicsIHtcbiAgICAgIHBhcmFtZXRlck5hbWU6ICcvTXkvU2VjcmV0L1BhcmFtZXRlcicsXG4gICAgICAvLyBwYXJhbWV0ZXIgdmVyc2lvbiBmcm9tIHRva2VuXG4gICAgICB2ZXJzaW9uOiBwYXJhbWV0ZXJWZXJzaW9uLFxuICAgIH0pLnN0cmluZ1ZhbHVlO1xuXG4gICAgY29uc3QgdXNlciA9IG5ldyBjZGsuQ2ZuUmVzb3VyY2UodGhpcywgJ0R1bW15UmVzb3VyY2VVc2luZ1N0cmluZ1BhcmFtZXRlcnMnLCB7XG4gICAgICB0eXBlOiAnQVdTOjpJQU06OlVzZXInLFxuICAgICAgcHJvcGVydGllczoge1xuICAgICAgICBMb2dpblByb2ZpbGU6IHtcbiAgICAgICAgICBQYXNzd29yZDogY2RrLkZuLmpvaW4oJy0nLCBbXG4gICAgICAgICAgICBzdHJpbmdWYWx1ZSxcbiAgICAgICAgICAgIHN0cmluZ1ZhbHVlVmVyc2lvbkZyb21Ub2tlbixcbiAgICAgICAgICAgIHNlY3JldFZhbHVlLFxuICAgICAgICAgICAgc2VjcmV0VmFsdWVWZXJzaW9uLFxuICAgICAgICAgICAgc2VjcmV0VmFsdWVWZXJzaW9uRnJvbVRva2VuLFxuICAgICAgICAgIF0pLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcbiAgICB1c2VyLmFwcGx5UmVtb3ZhbFBvbGljeShjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZKTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCBjcmVhdGluZyA9IG5ldyBDcmVhdGluZ1N0YWNrKGFwcCwgJ3NzcG1zLWNyZWF0aW5nJyk7XG5cbmNvbnN0IHVzaW5nID0gbmV3IFVzaW5nU3RhY2soYXBwLCAnc3NwbXMtdXNpbmcnKTtcbnVzaW5nLmFkZERlcGVuZGVuY3koY3JlYXRpbmcpO1xuXG5jb25zdCBjbGVhbnVwID0gbmV3IGNkay5TdGFjayhhcHAsICdzc3Btcy1jbGVhbnVwJyk7XG5jbGVhbnVwLmFkZERlcGVuZGVuY3kodXNpbmcpO1xuXG5jb25zdCBpbnRlZ1Rlc3QgPSBuZXcgaW50ZWcuSW50ZWdUZXN0KGFwcCwgJ1NTTVBhcmFtZXRlclN0b3JlVGVzdCcsIHtcbiAgYXNzZXJ0aW9uU3RhY2s6IGNsZWFudXAsXG4gIHRlc3RDYXNlczogW3VzaW5nXSxcbn0pO1xuXG5pbnRlZ1Rlc3QuYXNzZXJ0aW9ucy5hd3NBcGlDYWxsKCdTU00nLCAnZGVsZXRlUGFyYW1ldGVyJywge1xuICBOYW1lOiBTRUNVUkVfUEFSQU1fTkFNRSxcbn0pO1xuIl19