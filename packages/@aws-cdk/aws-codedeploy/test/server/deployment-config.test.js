"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const cdk = require("@aws-cdk/core");
const codedeploy = require("../../lib");
/* eslint-disable quote-props */
describe('CodeDeploy DeploymentConfig', () => {
    test('can be created by specifying only minHealthyHostCount', () => {
        const stack = new cdk.Stack();
        new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
            minimumHealthyHosts: codedeploy.MinimumHealthyHosts.count(1),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
            'MinimumHealthyHosts': {
                'Type': 'HOST_COUNT',
                'Value': 1,
            },
        });
    });
    test('can be created by specifying only minHealthyHostPercentage', () => {
        const stack = new cdk.Stack();
        new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
            minimumHealthyHosts: codedeploy.MinimumHealthyHosts.percentage(75),
        });
        assertions_1.Template.fromStack(stack).hasResourceProperties('AWS::CodeDeploy::DeploymentConfig', {
            'MinimumHealthyHosts': {
                'Type': 'FLEET_PERCENT',
                'Value': 75,
            },
        });
    });
    test('can be imported', () => {
        const stack = new cdk.Stack();
        const deploymentConfig = codedeploy.ServerDeploymentConfig.fromServerDeploymentConfigName(stack, 'MyDC', 'MyDC');
        expect(deploymentConfig).not.toEqual(undefined);
    });
    test('fail with more than 100 characters in name', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
            minimumHealthyHosts: codedeploy.MinimumHealthyHosts.percentage(75),
            deploymentConfigName: 'a'.repeat(101),
        });
        expect(() => app.synth()).toThrow(`Deployment config name: "${'a'.repeat(101)}" can be a max of 100 characters.`);
    });
    test('fail with unallowed characters in name', () => {
        const app = new cdk.App();
        const stack = new cdk.Stack(app);
        new codedeploy.ServerDeploymentConfig(stack, 'DeploymentConfig', {
            minimumHealthyHosts: codedeploy.MinimumHealthyHosts.percentage(75),
            deploymentConfigName: 'my name',
        });
        expect(() => app.synth()).toThrow('Deployment config name: "my name" can only contain letters (a-z, A-Z), numbers (0-9), periods (.), underscores (_), + (plus signs), = (equals signs), , (commas), @ (at signs), - (minus signs).');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95bWVudC1jb25maWcudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRlcGxveW1lbnQtY29uZmlnLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvREFBK0M7QUFDL0MscUNBQXFDO0FBQ3JDLHdDQUF3QztBQUV4QyxnQ0FBZ0M7QUFFaEMsUUFBUSxDQUFDLDZCQUE2QixFQUFFLEdBQUcsRUFBRTtJQUMzQyxJQUFJLENBQUMsdURBQXVELEVBQUUsR0FBRyxFQUFFO1FBQ2pFLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTlCLElBQUksVUFBVSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtZQUMvRCxtQkFBbUIsRUFBRSxVQUFVLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUM3RCxDQUFDLENBQUM7UUFFSCxxQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxtQ0FBbUMsRUFBRTtZQUNuRixxQkFBcUIsRUFBRTtnQkFDckIsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLE9BQU8sRUFBRSxDQUFDO2FBQ1g7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyw0REFBNEQsRUFBRSxHQUFHLEVBQUU7UUFDdEUsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFOUIsSUFBSSxVQUFVLENBQUMsc0JBQXNCLENBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFFO1lBQy9ELG1CQUFtQixFQUFFLFVBQVUsQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1NBQ25FLENBQUMsQ0FBQztRQUVILHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLHFCQUFxQixDQUFDLG1DQUFtQyxFQUFFO1lBQ25GLHFCQUFxQixFQUFFO2dCQUNyQixNQUFNLEVBQUUsZUFBZTtnQkFDdkIsT0FBTyxFQUFFLEVBQUU7YUFDWjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBSSxDQUFDLGlCQUFpQixFQUFFLEdBQUcsRUFBRTtRQUMzQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUU5QixNQUFNLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyw4QkFBOEIsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWpILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFO1FBQ3RELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFJLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUU7WUFDL0QsbUJBQW1CLEVBQUUsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDbEUsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztJQUNwSCxDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7UUFDbEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLElBQUksVUFBVSxDQUFDLHNCQUFzQixDQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBRTtZQUMvRCxtQkFBbUIsRUFBRSxVQUFVLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUNsRSxvQkFBb0IsRUFBRSxTQUFTO1NBQ2hDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsa01BQWtNLENBQUMsQ0FBQztJQUN4TyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGVtcGxhdGUgfSBmcm9tICdAYXdzLWNkay9hc3NlcnRpb25zJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNvZGVkZXBsb3kgZnJvbSAnLi4vLi4vbGliJztcblxuLyogZXNsaW50LWRpc2FibGUgcXVvdGUtcHJvcHMgKi9cblxuZGVzY3JpYmUoJ0NvZGVEZXBsb3kgRGVwbG95bWVudENvbmZpZycsICgpID0+IHtcbiAgdGVzdCgnY2FuIGJlIGNyZWF0ZWQgYnkgc3BlY2lmeWluZyBvbmx5IG1pbkhlYWx0aHlIb3N0Q291bnQnLCAoKSA9PiB7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKCk7XG5cbiAgICBuZXcgY29kZWRlcGxveS5TZXJ2ZXJEZXBsb3ltZW50Q29uZmlnKHN0YWNrLCAnRGVwbG95bWVudENvbmZpZycsIHtcbiAgICAgIG1pbmltdW1IZWFsdGh5SG9zdHM6IGNvZGVkZXBsb3kuTWluaW11bUhlYWx0aHlIb3N0cy5jb3VudCgxKSxcbiAgICB9KTtcblxuICAgIFRlbXBsYXRlLmZyb21TdGFjayhzdGFjaykuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkNvZGVEZXBsb3k6OkRlcGxveW1lbnRDb25maWcnLCB7XG4gICAgICAnTWluaW11bUhlYWx0aHlIb3N0cyc6IHtcbiAgICAgICAgJ1R5cGUnOiAnSE9TVF9DT1VOVCcsXG4gICAgICAgICdWYWx1ZSc6IDEsXG4gICAgICB9LFxuICAgIH0pO1xuICB9KTtcblxuICB0ZXN0KCdjYW4gYmUgY3JlYXRlZCBieSBzcGVjaWZ5aW5nIG9ubHkgbWluSGVhbHRoeUhvc3RQZXJjZW50YWdlJywgKCkgPT4ge1xuICAgIGNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjaygpO1xuXG4gICAgbmV3IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudENvbmZpZyhzdGFjaywgJ0RlcGxveW1lbnRDb25maWcnLCB7XG4gICAgICBtaW5pbXVtSGVhbHRoeUhvc3RzOiBjb2RlZGVwbG95Lk1pbmltdW1IZWFsdGh5SG9zdHMucGVyY2VudGFnZSg3NSksXG4gICAgfSk7XG5cbiAgICBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpDb2RlRGVwbG95OjpEZXBsb3ltZW50Q29uZmlnJywge1xuICAgICAgJ01pbmltdW1IZWFsdGh5SG9zdHMnOiB7XG4gICAgICAgICdUeXBlJzogJ0ZMRUVUX1BFUkNFTlQnLFxuICAgICAgICAnVmFsdWUnOiA3NSxcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0pO1xuXG4gIHRlc3QoJ2NhbiBiZSBpbXBvcnRlZCcsICgpID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soKTtcblxuICAgIGNvbnN0IGRlcGxveW1lbnRDb25maWcgPSBjb2RlZGVwbG95LlNlcnZlckRlcGxveW1lbnRDb25maWcuZnJvbVNlcnZlckRlcGxveW1lbnRDb25maWdOYW1lKHN0YWNrLCAnTXlEQycsICdNeURDJyk7XG5cbiAgICBleHBlY3QoZGVwbG95bWVudENvbmZpZykubm90LnRvRXF1YWwodW5kZWZpbmVkKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbCB3aXRoIG1vcmUgdGhhbiAxMDAgY2hhcmFjdGVycyBpbiBuYW1lJywgKCkgPT4ge1xuICAgIGNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG4gICAgY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCk7XG4gICAgbmV3IGNvZGVkZXBsb3kuU2VydmVyRGVwbG95bWVudENvbmZpZyhzdGFjaywgJ0RlcGxveW1lbnRDb25maWcnLCB7XG4gICAgICBtaW5pbXVtSGVhbHRoeUhvc3RzOiBjb2RlZGVwbG95Lk1pbmltdW1IZWFsdGh5SG9zdHMucGVyY2VudGFnZSg3NSksXG4gICAgICBkZXBsb3ltZW50Q29uZmlnTmFtZTogJ2EnLnJlcGVhdCgxMDEpLFxuICAgIH0pO1xuXG4gICAgZXhwZWN0KCgpID0+IGFwcC5zeW50aCgpKS50b1Rocm93KGBEZXBsb3ltZW50IGNvbmZpZyBuYW1lOiBcIiR7J2EnLnJlcGVhdCgxMDEpfVwiIGNhbiBiZSBhIG1heCBvZiAxMDAgY2hhcmFjdGVycy5gKTtcbiAgfSk7XG5cbiAgdGVzdCgnZmFpbCB3aXRoIHVuYWxsb3dlZCBjaGFyYWN0ZXJzIGluIG5hbWUnLCAoKSA9PiB7XG4gICAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwKTtcbiAgICBuZXcgY29kZWRlcGxveS5TZXJ2ZXJEZXBsb3ltZW50Q29uZmlnKHN0YWNrLCAnRGVwbG95bWVudENvbmZpZycsIHtcbiAgICAgIG1pbmltdW1IZWFsdGh5SG9zdHM6IGNvZGVkZXBsb3kuTWluaW11bUhlYWx0aHlIb3N0cy5wZXJjZW50YWdlKDc1KSxcbiAgICAgIGRlcGxveW1lbnRDb25maWdOYW1lOiAnbXkgbmFtZScsXG4gICAgfSk7XG5cbiAgICBleHBlY3QoKCkgPT4gYXBwLnN5bnRoKCkpLnRvVGhyb3coJ0RlcGxveW1lbnQgY29uZmlnIG5hbWU6IFwibXkgbmFtZVwiIGNhbiBvbmx5IGNvbnRhaW4gbGV0dGVycyAoYS16LCBBLVopLCBudW1iZXJzICgwLTkpLCBwZXJpb2RzICguKSwgdW5kZXJzY29yZXMgKF8pLCArIChwbHVzIHNpZ25zKSwgPSAoZXF1YWxzIHNpZ25zKSwgLCAoY29tbWFzKSwgQCAoYXQgc2lnbnMpLCAtIChtaW51cyBzaWducykuJyk7XG4gIH0pO1xufSk7XG4iXX0=