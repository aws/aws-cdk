"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestStack = exports.FakeNotificationTarget = void 0;
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const sns = require("aws-cdk-lib/aws-sns");
const cdk = require("aws-cdk-lib");
const autoscaling = require("aws-cdk-lib/aws-autoscaling");
class FakeNotificationTarget {
    constructor(topic) {
        this.topic = topic;
    }
    createRole(scope, _role) {
        let role = _role;
        if (!role) {
            role = new iam.Role(scope, 'Role', {
                assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
            });
        }
        return role;
    }
    bind(_scope, options) {
        const role = this.createRole(options.lifecycleHook, options.role);
        this.topic.grantPublish(role);
        return {
            notificationTargetArn: this.topic.topicArn,
            createdRole: role,
        };
    }
}
exports.FakeNotificationTarget = FakeNotificationTarget;
class TestStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        let vpc = new ec2.Vpc(this, 'myVpcAuto', {});
        const myrole = new iam.Role(this, 'MyRole', {
            assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
        });
        const topic = new sns.Topic(this, 'topic', {});
        const topic2 = new sns.Topic(this, 'topic2', {});
        const asg = new autoscaling.AutoScalingGroup(this, 'ASG', {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
            machineImage: new ec2.AmazonLinuxImage(),
            healthCheck: autoscaling.HealthCheck.ec2(),
        });
        // no role or notificationTarget
        new autoscaling.LifecycleHook(this, 'LCHookNoRoleNoTarget', {
            autoScalingGroup: asg,
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
        });
        // no role with notificationTarget
        new autoscaling.LifecycleHook(this, 'LCHookNoRoleTarget', {
            notificationTarget: new FakeNotificationTarget(topic),
            autoScalingGroup: asg,
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
        });
        // role with target
        new autoscaling.LifecycleHook(this, 'LCHookRoleTarget', {
            notificationTarget: new FakeNotificationTarget(topic2),
            role: myrole,
            autoScalingGroup: asg,
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_TERMINATING,
        });
    }
}
exports.TestStack = TestStack;
const app = new cdk.App();
new TestStack(app, 'integ-role-target-hook');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucm9sZS10YXJnZXQtaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLnJvbGUtdGFyZ2V0LWhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQywyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBRW5DLDJEQUEyRDtBQUUzRCxNQUFhLHNCQUFzQjtJQUNqQyxZQUE2QixLQUFpQjtRQUFqQixVQUFLLEdBQUwsS0FBSyxDQUFZO0lBQzlDLENBQUM7SUFFTyxVQUFVLENBQUMsS0FBMkIsRUFBRSxLQUFpQjtRQUMvRCxJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNULElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtnQkFDakMsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLDJCQUEyQixDQUFDO2FBQ2pFLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU0sSUFBSSxDQUFDLE1BQTRCLEVBQUUsT0FBMEM7UUFDbEYsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUU5QixPQUFPO1lBQ0wscUJBQXFCLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO1lBQzFDLFdBQVcsRUFBRSxJQUFJO1NBQ2xCLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUF4QkQsd0RBd0JDO0FBRUQsTUFBYSxTQUFVLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDdEMsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLElBQUksR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQzdDLE1BQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQzFDLFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQywyQkFBMkIsQ0FBQztTQUNqRSxDQUFDLENBQUM7UUFDSCxNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMvQyxNQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVqRCxNQUFNLEdBQUcsR0FBRyxJQUFJLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO1lBQ3hELEdBQUc7WUFDSCxZQUFZLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDdkYsWUFBWSxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixFQUFFO1lBQ3hDLFdBQVcsRUFBRSxXQUFXLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRTtTQUMzQyxDQUFDLENBQUM7UUFFSCxnQ0FBZ0M7UUFDaEMsSUFBSSxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxzQkFBc0IsRUFBRTtZQUMxRCxnQkFBZ0IsRUFBRSxHQUFHO1lBQ3JCLG1CQUFtQixFQUFFLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0I7U0FDMUUsQ0FBQyxDQUFDO1FBRUgsa0NBQWtDO1FBQ2xDLElBQUksV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUU7WUFDeEQsa0JBQWtCLEVBQUUsSUFBSSxzQkFBc0IsQ0FBQyxLQUFLLENBQUM7WUFDckQsZ0JBQWdCLEVBQUUsR0FBRztZQUNyQixtQkFBbUIsRUFBRSxXQUFXLENBQUMsbUJBQW1CLENBQUMsb0JBQW9CO1NBQzFFLENBQUMsQ0FBQztRQUVILG1CQUFtQjtRQUNuQixJQUFJLFdBQVcsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQ3RELGtCQUFrQixFQUFFLElBQUksc0JBQXNCLENBQUMsTUFBTSxDQUFDO1lBQ3RELElBQUksRUFBRSxNQUFNO1lBQ1osZ0JBQWdCLEVBQUUsR0FBRztZQUNyQixtQkFBbUIsRUFBRSxXQUFXLENBQUMsbUJBQW1CLENBQUMsb0JBQW9CO1NBQzFFLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXZDRCw4QkF1Q0M7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztBQUU3QyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzbnMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNucyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgY29uc3RydWN0cyBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGF1dG9zY2FsaW5nIGZyb20gJ2F3cy1jZGstbGliL2F3cy1hdXRvc2NhbGluZyc7XG5cbmV4cG9ydCBjbGFzcyBGYWtlTm90aWZpY2F0aW9uVGFyZ2V0IGltcGxlbWVudHMgYXV0b3NjYWxpbmcuSUxpZmVjeWNsZUhvb2tUYXJnZXQge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHRvcGljOiBzbnMuSVRvcGljKSB7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVJvbGUoc2NvcGU6IGNvbnN0cnVjdHMuQ29uc3RydWN0LCBfcm9sZT86IGlhbS5JUm9sZSkge1xuICAgIGxldCByb2xlID0gX3JvbGU7XG4gICAgaWYgKCFyb2xlKSB7XG4gICAgICByb2xlID0gbmV3IGlhbS5Sb2xlKHNjb3BlLCAnUm9sZScsIHtcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2F1dG9zY2FsaW5nLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByb2xlO1xuICB9XG5cbiAgcHVibGljIGJpbmQoX3Njb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgb3B0aW9uczogYXV0b3NjYWxpbmcuQmluZEhvb2tUYXJnZXRPcHRpb25zKTogYXV0b3NjYWxpbmcuTGlmZWN5Y2xlSG9va1RhcmdldENvbmZpZyB7XG4gICAgY29uc3Qgcm9sZSA9IHRoaXMuY3JlYXRlUm9sZShvcHRpb25zLmxpZmVjeWNsZUhvb2ssIG9wdGlvbnMucm9sZSk7XG4gICAgdGhpcy50b3BpYy5ncmFudFB1Ymxpc2gocm9sZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbm90aWZpY2F0aW9uVGFyZ2V0QXJuOiB0aGlzLnRvcGljLnRvcGljQXJuLFxuICAgICAgY3JlYXRlZFJvbGU6IHJvbGUsXG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGxldCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnbXlWcGNBdXRvJywge30pO1xuICAgIGNvbnN0IG15cm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnTXlSb2xlJywge1xuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2F1dG9zY2FsaW5nLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcbiAgICBjb25zdCB0b3BpYyA9IG5ldyBzbnMuVG9waWModGhpcywgJ3RvcGljJywge30pO1xuICAgIGNvbnN0IHRvcGljMiA9IG5ldyBzbnMuVG9waWModGhpcywgJ3RvcGljMicsIHt9KTtcblxuICAgIGNvbnN0IGFzZyA9IG5ldyBhdXRvc2NhbGluZy5BdXRvU2NhbGluZ0dyb3VwKHRoaXMsICdBU0cnLCB7XG4gICAgICB2cGMsXG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuQlVSU1RBQkxFMiwgZWMyLkluc3RhbmNlU2l6ZS5NSUNSTyksXG4gICAgICBtYWNoaW5lSW1hZ2U6IG5ldyBlYzIuQW1hem9uTGludXhJbWFnZSgpLCAvLyBnZXQgdGhlIGxhdGVzdCBBbWF6b24gTGludXggaW1hZ2VcbiAgICAgIGhlYWx0aENoZWNrOiBhdXRvc2NhbGluZy5IZWFsdGhDaGVjay5lYzIoKSxcbiAgICB9KTtcblxuICAgIC8vIG5vIHJvbGUgb3Igbm90aWZpY2F0aW9uVGFyZ2V0XG4gICAgbmV3IGF1dG9zY2FsaW5nLkxpZmVjeWNsZUhvb2sodGhpcywgJ0xDSG9va05vUm9sZU5vVGFyZ2V0Jywge1xuICAgICAgYXV0b1NjYWxpbmdHcm91cDogYXNnLFxuICAgICAgbGlmZWN5Y2xlVHJhbnNpdGlvbjogYXV0b3NjYWxpbmcuTGlmZWN5Y2xlVHJhbnNpdGlvbi5JTlNUQU5DRV9URVJNSU5BVElORyxcbiAgICB9KTtcblxuICAgIC8vIG5vIHJvbGUgd2l0aCBub3RpZmljYXRpb25UYXJnZXRcbiAgICBuZXcgYXV0b3NjYWxpbmcuTGlmZWN5Y2xlSG9vayh0aGlzLCAnTENIb29rTm9Sb2xlVGFyZ2V0Jywge1xuICAgICAgbm90aWZpY2F0aW9uVGFyZ2V0OiBuZXcgRmFrZU5vdGlmaWNhdGlvblRhcmdldCh0b3BpYyksXG4gICAgICBhdXRvU2NhbGluZ0dyb3VwOiBhc2csXG4gICAgICBsaWZlY3ljbGVUcmFuc2l0aW9uOiBhdXRvc2NhbGluZy5MaWZlY3ljbGVUcmFuc2l0aW9uLklOU1RBTkNFX1RFUk1JTkFUSU5HLFxuICAgIH0pO1xuXG4gICAgLy8gcm9sZSB3aXRoIHRhcmdldFxuICAgIG5ldyBhdXRvc2NhbGluZy5MaWZlY3ljbGVIb29rKHRoaXMsICdMQ0hvb2tSb2xlVGFyZ2V0Jywge1xuICAgICAgbm90aWZpY2F0aW9uVGFyZ2V0OiBuZXcgRmFrZU5vdGlmaWNhdGlvblRhcmdldCh0b3BpYzIpLFxuICAgICAgcm9sZTogbXlyb2xlLFxuICAgICAgYXV0b1NjYWxpbmdHcm91cDogYXNnLFxuICAgICAgbGlmZWN5Y2xlVHJhbnNpdGlvbjogYXV0b3NjYWxpbmcuTGlmZWN5Y2xlVHJhbnNpdGlvbi5JTlNUQU5DRV9URVJNSU5BVElORyxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2ludGVnLXJvbGUtdGFyZ2V0LWhvb2snKTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=