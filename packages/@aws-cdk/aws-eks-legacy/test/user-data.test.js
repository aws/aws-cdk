"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const autoscaling = require("@aws-cdk/aws-autoscaling");
const ec2 = require("@aws-cdk/aws-ec2");
const cdk_build_tools_1 = require("@aws-cdk/cdk-build-tools");
const core_1 = require("@aws-cdk/core");
const user_data_1 = require("../lib/user-data");
/* eslint-disable max-len */
cdk_build_tools_1.describeDeprecated('user data', () => {
    test('default user data', () => {
        // GIVEN
        const { asg, stack } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderUserData('my-cluster-name', asg));
        // THEN
        expect(userData).toEqual([
            'set -o xtrace',
            '/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true',
            '/opt/aws/bin/cfn-signal --exit-code $? --stack my-stack --resource ASG46ED3070 --region us-west-33',
        ]);
    });
    test('--use-max-pods=true', () => {
        // GIVEN
        const { asg, stack } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderUserData('my-cluster-name', asg, {
            useMaxPods: true,
        }));
        // THEN
        expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true');
    });
    test('--use-max-pods=false', () => {
        // GIVEN
        const { asg, stack } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderUserData('my-cluster-name', asg, {
            useMaxPods: false,
        }));
        // THEN
        expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods false');
    });
    test('--aws-api-retry-attempts', () => {
        // GIVEN
        const { asg, stack } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderUserData('my-cluster-name', asg, {
            awsApiRetryAttempts: 123,
        }));
        // THEN
        expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true --aws-api-retry-attempts 123');
    });
    test('--docker-config-json', () => {
        // GIVEN
        const { asg } = newFixtures();
        // WHEN
        const userData = user_data_1.renderUserData('my-cluster-name', asg, {
            dockerConfigJson: '{"docker":123}',
        });
        // THEN
        expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true --docker-config-json \'{"docker":123}\'');
    });
    test('--enable-docker-bridge=true', () => {
        // GIVEN
        const { asg, stack } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderUserData('my-cluster-name', asg, {
            enableDockerBridge: true,
        }));
        // THEN
        expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true --enable-docker-bridge');
    });
    test('--enable-docker-bridge=false', () => {
        // GIVEN
        const { asg, stack } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderUserData('my-cluster-name', asg, {
            enableDockerBridge: false,
        }));
        // THEN
        expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true');
    });
    test('--kubelet-extra-args', () => {
        // GIVEN
        const { asg, stack } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderUserData('my-cluster-name', asg, {
            kubeletExtraArgs: '--extra-args-for --kubelet',
        }));
        // THEN
        expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand  --extra-args-for --kubelet" --use-max-pods true');
    });
    test('arbitrary additional bootstrap arguments can be passed through "additionalArgs"', () => {
        // GIVEN
        const { asg, stack } = newFixtures();
        // WHEN
        const userData = stack.resolve(user_data_1.renderUserData('my-cluster-name', asg, {
            additionalArgs: '--apiserver-endpoint 1111 --foo-bar',
        }));
        // THEN
        expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=OnDemand" --use-max-pods true --apiserver-endpoint 1111 --foo-bar');
    });
    test('if asg has spot instances, the correct label and taint is used', () => {
        // GIVEN
        const { asg, stack } = newFixtures(true);
        // WHEN
        const userData = stack.resolve(user_data_1.renderUserData('my-cluster-name', asg, {
            kubeletExtraArgs: '--node-labels X=y',
        }));
        // THEN
        expect(userData[1]).toEqual('/etc/eks/bootstrap.sh my-cluster-name --kubelet-extra-args "--node-labels lifecycle=Ec2Spot --register-with-taints=spotInstance=true:PreferNoSchedule --node-labels X=y" --use-max-pods true');
    });
});
function newFixtures(spot = false) {
    const app = new core_1.App();
    const stack = new core_1.Stack(app, 'my-stack', { env: { region: 'us-west-33' } });
    const vpc = new ec2.Vpc(stack, 'vpc');
    const asg = new autoscaling.AutoScalingGroup(stack, 'ASG', {
        instanceType: new ec2.InstanceType('m4.xlarge'),
        machineImage: new ec2.AmazonLinuxImage(),
        spotPrice: spot ? '0.01' : undefined,
        vpc,
    });
    return { stack, vpc, asg };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1kYXRhLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2VyLWRhdGEudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHdEQUF3RDtBQUN4RCx3Q0FBd0M7QUFDeEMsOERBQThEO0FBQzlELHdDQUEyQztBQUMzQyxnREFBa0Q7QUFFbEQsNEJBQTRCO0FBRTVCLG9DQUFrQixDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDbkMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtRQUM3QixRQUFRO1FBQ1IsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxXQUFXLEVBQUUsQ0FBQztRQUVyQyxPQUFPO1FBQ1AsTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQywwQkFBYyxDQUFDLGlCQUFpQixFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFdkUsT0FBTztRQUNQLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDdkIsZUFBZTtZQUNmLG1IQUFtSDtZQUNuSCxvR0FBb0c7U0FDckcsQ0FBQyxDQUFDO0lBR0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQy9CLFFBQVE7UUFDUixNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLFdBQVcsRUFBRSxDQUFDO1FBRXJDLE9BQU87UUFDUCxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLDBCQUFjLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFO1lBQ3BFLFVBQVUsRUFBRSxJQUFJO1NBQ2pCLENBQUMsQ0FBQyxDQUFDO1FBRUosT0FBTztRQUNQLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsbUhBQW1ILENBQUMsQ0FBQztJQUVuSixDQUFDLENBQUMsQ0FBQztJQUVILElBQUksQ0FBQyxzQkFB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QUcsR0FBRyxJQUFJLFVBQUcsRUFBRSxDQUFDO0lBQ3RCLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzVFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxXQUFXLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtRQUN6RCxZQUFZLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztRQUMvQyxZQUFZLEVBQUUsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLEVBQUU7UUFDeEMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTO1FBQ3BDLEdBQUc7S0FDSixDQUFDLENBQUM7SUFFSCxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUM3QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgYXV0b3NjYWxpbmcgZnJvbSAnQGF3cy1jZGsvYXdzLWF1dG9zY2FsaW5nJztcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCB7IGRlc2NyaWJlRGVwcmVjYXRlZCB9IGZyb20gJ0Bhd3MtY2RrL2Nkay1idWlsZC10b29scyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyByZW5kZXJVc2VyRGF0YSB9IGZyb20gJy4uL2xpYi91c2VyLWRhdGEnO1xuXG4vKiBlc2xpbnQtZGlzYWJsZSBtYXgtbGVuICovXG5cbmRlc2NyaWJlRGVwcmVjYXRlZCgndXNlciBkYXRhJywgKCkgPT4ge1xuICB0ZXN0KCdkZWZhdWx0IHVzZXIgZGF0YScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgYXNnLCBzdGFjayB9ID0gbmV3Rml4dHVyZXMoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IHN0YWNrLnJlc29sdmUocmVuZGVyVXNlckRhdGEoJ215LWNsdXN0ZXItbmFtZScsIGFzZykpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh1c2VyRGF0YSkudG9FcXVhbChbXG4gICAgICAnc2V0IC1vIHh0cmFjZScsXG4gICAgICAnL2V0Yy9la3MvYm9vdHN0cmFwLnNoIG15LWNsdXN0ZXItbmFtZSAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS11c2UtbWF4LXBvZHMgdHJ1ZScsXG4gICAgICAnL29wdC9hd3MvYmluL2Nmbi1zaWduYWwgLS1leGl0LWNvZGUgJD8gLS1zdGFjayBteS1zdGFjayAtLXJlc291cmNlIEFTRzQ2RUQzMDcwIC0tcmVnaW9uIHVzLXdlc3QtMzMnLFxuICAgIF0pO1xuXG5cbiAgfSk7XG5cbiAgdGVzdCgnLS11c2UtbWF4LXBvZHM9dHJ1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgYXNnLCBzdGFjayB9ID0gbmV3Rml4dHVyZXMoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IHN0YWNrLnJlc29sdmUocmVuZGVyVXNlckRhdGEoJ215LWNsdXN0ZXItbmFtZScsIGFzZywge1xuICAgICAgdXNlTWF4UG9kczogdHJ1ZSxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHVzZXJEYXRhWzFdKS50b0VxdWFsKCcvZXRjL2Vrcy9ib290c3RyYXAuc2ggbXktY2x1c3Rlci1uYW1lIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9T25EZW1hbmRcIiAtLXVzZS1tYXgtcG9kcyB0cnVlJyk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnLS11c2UtbWF4LXBvZHM9ZmFsc2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IGFzZywgc3RhY2sgfSA9IG5ld0ZpeHR1cmVzKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBzdGFjay5yZXNvbHZlKHJlbmRlclVzZXJEYXRhKCdteS1jbHVzdGVyLW5hbWUnLCBhc2csIHtcbiAgICAgIHVzZU1heFBvZHM6IGZhbHNlLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodXNlckRhdGFbMV0pLnRvRXF1YWwoJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCBteS1jbHVzdGVyLW5hbWUgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZFwiIC0tdXNlLW1heC1wb2RzIGZhbHNlJyk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnLS1hd3MtYXBpLXJldHJ5LWF0dGVtcHRzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJVc2VyRGF0YSgnbXktY2x1c3Rlci1uYW1lJywgYXNnLCB7XG4gICAgICBhd3NBcGlSZXRyeUF0dGVtcHRzOiAxMjMsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh1c2VyRGF0YVsxXSkudG9FcXVhbCgnL2V0Yy9la3MvYm9vdHN0cmFwLnNoIG15LWNsdXN0ZXItbmFtZSAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS11c2UtbWF4LXBvZHMgdHJ1ZSAtLWF3cy1hcGktcmV0cnktYXR0ZW1wdHMgMTIzJyk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnLS1kb2NrZXItY29uZmlnLWpzb24nLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IGFzZyB9ID0gbmV3Rml4dHVyZXMoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IHJlbmRlclVzZXJEYXRhKCdteS1jbHVzdGVyLW5hbWUnLCBhc2csIHtcbiAgICAgIGRvY2tlckNvbmZpZ0pzb246ICd7XCJkb2NrZXJcIjoxMjN9JyxcbiAgICB9KTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodXNlckRhdGFbMV0pLnRvRXF1YWwoJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCBteS1jbHVzdGVyLW5hbWUgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZFwiIC0tdXNlLW1heC1wb2RzIHRydWUgLS1kb2NrZXItY29uZmlnLWpzb24gXFwne1wiZG9ja2VyXCI6MTIzfVxcJycpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJy0tZW5hYmxlLWRvY2tlci1icmlkZ2U9dHJ1ZScsICgpID0+IHtcbiAgICAvLyBHSVZFTlxuICAgIGNvbnN0IHsgYXNnLCBzdGFjayB9ID0gbmV3Rml4dHVyZXMoKTtcblxuICAgIC8vIFdIRU5cbiAgICBjb25zdCB1c2VyRGF0YSA9IHN0YWNrLnJlc29sdmUocmVuZGVyVXNlckRhdGEoJ215LWNsdXN0ZXItbmFtZScsIGFzZywge1xuICAgICAgZW5hYmxlRG9ja2VyQnJpZGdlOiB0cnVlLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodXNlckRhdGFbMV0pLnRvRXF1YWwoJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCBteS1jbHVzdGVyLW5hbWUgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZFwiIC0tdXNlLW1heC1wb2RzIHRydWUgLS1lbmFibGUtZG9ja2VyLWJyaWRnZScpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJy0tZW5hYmxlLWRvY2tlci1icmlkZ2U9ZmFsc2UnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IGFzZywgc3RhY2sgfSA9IG5ld0ZpeHR1cmVzKCk7XG5cbiAgICAvLyBXSEVOXG4gICAgY29uc3QgdXNlckRhdGEgPSBzdGFjay5yZXNvbHZlKHJlbmRlclVzZXJEYXRhKCdteS1jbHVzdGVyLW5hbWUnLCBhc2csIHtcbiAgICAgIGVuYWJsZURvY2tlckJyaWRnZTogZmFsc2UsXG4gICAgfSkpO1xuXG4gICAgLy8gVEhFTlxuICAgIGV4cGVjdCh1c2VyRGF0YVsxXSkudG9FcXVhbCgnL2V0Yy9la3MvYm9vdHN0cmFwLnNoIG15LWNsdXN0ZXItbmFtZSAtLWt1YmVsZXQtZXh0cmEtYXJncyBcIi0tbm9kZS1sYWJlbHMgbGlmZWN5Y2xlPU9uRGVtYW5kXCIgLS11c2UtbWF4LXBvZHMgdHJ1ZScpO1xuXG4gIH0pO1xuXG4gIHRlc3QoJy0ta3ViZWxldC1leHRyYS1hcmdzJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJVc2VyRGF0YSgnbXktY2x1c3Rlci1uYW1lJywgYXNnLCB7XG4gICAgICBrdWJlbGV0RXh0cmFBcmdzOiAnLS1leHRyYS1hcmdzLWZvciAtLWt1YmVsZXQnLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodXNlckRhdGFbMV0pLnRvRXF1YWwoJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCBteS1jbHVzdGVyLW5hbWUgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1PbkRlbWFuZCAgLS1leHRyYS1hcmdzLWZvciAtLWt1YmVsZXRcIiAtLXVzZS1tYXgtcG9kcyB0cnVlJyk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnYXJiaXRyYXJ5IGFkZGl0aW9uYWwgYm9vdHN0cmFwIGFyZ3VtZW50cyBjYW4gYmUgcGFzc2VkIHRocm91Z2ggXCJhZGRpdGlvbmFsQXJnc1wiJywgKCkgPT4ge1xuICAgIC8vIEdJVkVOXG4gICAgY29uc3QgeyBhc2csIHN0YWNrIH0gPSBuZXdGaXh0dXJlcygpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJVc2VyRGF0YSgnbXktY2x1c3Rlci1uYW1lJywgYXNnLCB7XG4gICAgICBhZGRpdGlvbmFsQXJnczogJy0tYXBpc2VydmVyLWVuZHBvaW50IDExMTEgLS1mb28tYmFyJyxcbiAgICB9KSk7XG5cbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0KHVzZXJEYXRhWzFdKS50b0VxdWFsKCcvZXRjL2Vrcy9ib290c3RyYXAuc2ggbXktY2x1c3Rlci1uYW1lIC0ta3ViZWxldC1leHRyYS1hcmdzIFwiLS1ub2RlLWxhYmVscyBsaWZlY3ljbGU9T25EZW1hbmRcIiAtLXVzZS1tYXgtcG9kcyB0cnVlIC0tYXBpc2VydmVyLWVuZHBvaW50IDExMTEgLS1mb28tYmFyJyk7XG5cbiAgfSk7XG5cbiAgdGVzdCgnaWYgYXNnIGhhcyBzcG90IGluc3RhbmNlcywgdGhlIGNvcnJlY3QgbGFiZWwgYW5kIHRhaW50IGlzIHVzZWQnLCAoKSA9PiB7XG4gICAgLy8gR0lWRU5cbiAgICBjb25zdCB7IGFzZywgc3RhY2sgfSA9IG5ld0ZpeHR1cmVzKHRydWUpO1xuXG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHVzZXJEYXRhID0gc3RhY2sucmVzb2x2ZShyZW5kZXJVc2VyRGF0YSgnbXktY2x1c3Rlci1uYW1lJywgYXNnLCB7XG4gICAgICBrdWJlbGV0RXh0cmFBcmdzOiAnLS1ub2RlLWxhYmVscyBYPXknLFxuICAgIH0pKTtcblxuICAgIC8vIFRIRU5cbiAgICBleHBlY3QodXNlckRhdGFbMV0pLnRvRXF1YWwoJy9ldGMvZWtzL2Jvb3RzdHJhcC5zaCBteS1jbHVzdGVyLW5hbWUgLS1rdWJlbGV0LWV4dHJhLWFyZ3MgXCItLW5vZGUtbGFiZWxzIGxpZmVjeWNsZT1FYzJTcG90IC0tcmVnaXN0ZXItd2l0aC10YWludHM9c3BvdEluc3RhbmNlPXRydWU6UHJlZmVyTm9TY2hlZHVsZSAtLW5vZGUtbGFiZWxzIFg9eVwiIC0tdXNlLW1heC1wb2RzIHRydWUnKTtcblxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBuZXdGaXh0dXJlcyhzcG90ID0gZmFsc2UpIHtcbiAgY29uc3QgYXBwID0gbmV3IEFwcCgpO1xuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjayhhcHAsICdteS1zdGFjaycsIHsgZW52OiB7IHJlZ2lvbjogJ3VzLXdlc3QtMzMnIH0gfSk7XG4gIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAndnBjJyk7XG4gIGNvbnN0IGFzZyA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHN0YWNrLCAnQVNHJywge1xuICAgIGluc3RhbmNlVHlwZTogbmV3IGVjMi5JbnN0YW5jZVR5cGUoJ200LnhsYXJnZScpLFxuICAgIG1hY2hpbmVJbWFnZTogbmV3IGVjMi5BbWF6b25MaW51eEltYWdlKCksXG4gICAgc3BvdFByaWNlOiBzcG90ID8gJzAuMDEnIDogdW5kZWZpbmVkLFxuICAgIHZwYyxcbiAgfSk7XG5cbiAgcmV0dXJuIHsgc3RhY2ssIHZwYywgYXNnIH07XG59XG4iXX0=