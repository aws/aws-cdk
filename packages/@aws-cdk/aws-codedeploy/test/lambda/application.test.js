"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const codedeploy = require("../../lib");
describe('CodeDeploy Lambda Application', () => {
    test('can be created', () => {
        const stack = new cdk.Stack();
        new codedeploy.LambdaApplication(stack, 'MyApp');
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::Application', {
            ComputePlatform: 'Lambda',
        });
    });
    test('can be created with explicit name', () => {
        const stack = new cdk.Stack();
        new codedeploy.LambdaApplication(stack, 'MyApp', {
            applicationName: 'my-name',
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::Application', {
            ApplicationName: 'my-name',
            ComputePlatform: 'Lambda',
        });
    });
    test('fail with more than 100 characters in name', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        new codedeploy.LambdaApplication(stack, 'MyApp', {
            applicationName: 'a'.repeat(101),
        });
        expect(() => app.synth()).toThrow(`Application name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
    });
    test('fail with unallowed characters in name', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        new codedeploy.LambdaApplication(stack, 'MyApp', {
            applicationName: 'my name',
        });
        expect(() => app.synth()).toThrow('Application name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
    });
    test('can be imported', () => {
        const stack = new cdk.Stack();
        const application = codedeploy.LambdaApplication.fromLambdaApplicationName(stack, 'MyApp', 'MyApp');
        expect(application).not.toEqual(undefined);
        expect(application.applicationName).toEqual('MyApp');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24udGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcGxpY2F0aW9uLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MscUNBQXFDO0FBQ3JDLHdDQUF3QztBQUV4QyxRQUFRLENBQUMsK0JBQStCLEVBQUUsR0FBRyxFQUFFO0lBQzdDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUU7UUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDOUIsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2pELHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixFQUFFO1lBQzlFLGVBQWUsRUFBRSxRQUFRO1NBQzFCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUM3QyxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM5QixJQUFJLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO1lBQy9DLGVBQWUsRUFBRSxTQUFTO1NBQzNCLENBQUMsQ0FBQztRQUNILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLDhCQUE4QixFQUFFO1lBQzlFLGVBQWUsRUFBRSxTQUFTO1lBQzFCLGVBQWUsRUFBRSxRQUFRO1NBQzFCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLDRDQUE0QyxFQUFFLEdBQUcsRUFBRTtRQUN0RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDakMsSUFBSSxVQUFVLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRTtZQUMvQyxlQUFlLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7U0FDakMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztJQUM5RyxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7UUFDbEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUU7WUFDL0MsZUFBZSxFQUFFLFNBQVM7U0FDM0IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0TEFBNEwsQ0FBQyxDQUFDO0lBQ2xPLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtRQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixNQUFNLFdBQVcsR0FBRyxVQUFVLENBQUMsaUJBQWlCLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVwRyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMzQyxNQUFNLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2RCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvZGVkZXBsb3kgZnJvbSAnLi4vLi4vbGliJztcblxuZGVzY3JpYmUoJ0NvZGVEZXBsb3kgTGFtYmRhIEFwcGxpY2F0aW9uJywgKCkgPT4ge1xuICB0ZXN0KCdjYW4gYmUgY3JlYXRlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcbiAgICBuZXcgY29kZWRlcGxveS5MYW1iZGFBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwJyk7XG4gICAgVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6Q29kZURlcGxveTo6QXBwbGljYXRpb24nLCB7XG4gICAgICBDb21wdXRlUGxhdGZvcm06ICdMYW1iZGEnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgY3JlYXRlZCB3aXRoIGV4cGxpY2l0IG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG4gICAgbmV3IGNvZGVkZXBsb3kuTGFtYmRhQXBwbGljYXRpb24oc3RhY2ssICdNeUFwcCcsIHtcbiAgICAgIGFwcGxpY2F0aW9uTmFtZTogJ215LW5hbWUnLFxuICAgIH0pO1xuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkFwcGxpY2F0aW9uJywge1xuICAgICAgQXBwbGljYXRpb25OYW1lOiAnbXktbmFtZScsXG4gICAgICBDb21wdXRlUGxhdGZvcm06ICdMYW1iZGEnLFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdmYWlsIHdpdGggbW9yZSB0aGFuIDEwMCBjaGFyYWN0ZXJzIGluIG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcbiAgICBuZXcgY29kZWRlcGxveS5MYW1iZGFBcHBsaWNhdGlvbihzdGFjaywgJ015QXBwJywge1xuICAgICAgYXBwbGljYXRpb25OYW1lOiAnYScucmVwZWF0KDEwMSksXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coYEFwcGxpY2F0aW9uIG5hbWU6IFwiJHsnYScucmVwZWF0KDEwMSl9XCIgY2FuIGJlIGEgbWF4IG9mIDEwMCBjaGFyYWN0ZXJzLmApO1xuICB9KTtcblxuICB0ZXN0KCdmYWlsIHdpdGggdW5hbGxvd2VkIGNoYXJhY3RlcnMgaW4gbmFtZScsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHApO1xuICAgIG5ldyBjb2RlZGVwbG95LkxhbWJkYUFwcGxpY2F0aW9uKHN0YWNrLCAnTXlBcHAnLCB7XG4gICAgICBhcHBsaWNhdGlvbk5hbWU6ICdteSBuYW1lJyxcbiAgICB9KTtcblxuICAgIGV4cGVjdCgoKSA9PiBhcHAuc3ludGgoKSkudG9UaHJvdygnQXBwbGljYXRpb24gbmFtZTogXCJteSBuYW1lXCIgY2FuIG9ubHkgY29udGFpbiBsZXR0ZXJzIChhLXosIEEtWiksIG51bWJlcnMgKDAtOSksIHBlcmlvZHMgKC4pLCB1bmRlcnNjb3JlcyAoXyksICsgKHBsdXMgc2lnbnMpLCA9IChlcXVhbHMgc2lnbnMpLCAsIChjb21tYXMpLCBAIChhdCBzaWducyksIC0gKG1pbnVzIHNpZ25zKS4nKTtcbiAgfSk7XG5cbiAgdGVzdCgnY2FuIGJlIGltcG9ydGVkJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgY29uc3QgYXBwbGljYXRpb24gPSBjb2RlZGVwbG95LkxhbWJkYUFwcGxpY2F0aW9uLmZyb21MYW1iZGFBcHBsaWNhdGlvbk5hbWUoc3RhY2ssICdNeUFwcCcsICdNeUFwcCcpO1xuXG4gICAgZXhwZWN0KGFwcGxpY2F0aW9uKS5ub3QudG9FcXVhbCh1bmRlZmluZWQpO1xuICAgIGV4cGVjdChhcHBsaWNhdGlvbi5hcHBsaWNhdGlvbk5hbWUpLnRvRXF1YWwoJ015QXBwJyk7XG4gIH0pO1xufSk7XG4iXX0=