"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Stack verification steps:
 * * aws ssm start-session --target <bastion host instance id>
 * * lscpu  # Architecture should be aarch64
 */
const cdk = require("@aws-cdk/core");
const ec2 = require("../lib");
const app = new cdk.App();
class TestStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const vpc = new ec2.Vpc(this, 'VPC');
        new ec2.BastionHostLinux(this, 'BastionHost', {
            vpc,
            instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.NANO),
        });
    }
}
new TestStack(app, 'TestStack');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYmFzdGlvbi1ob3N0LWFybS1zdXBwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYmFzdGlvbi1ob3N0LWFybS1zdXBwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7R0FJRztBQUNILHFDQUFxQztBQUNyQyw4QkFBOEI7QUFFOUIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxTQUFVLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDL0IsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFckMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUM1QyxHQUFHO1lBQ0gsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1NBQ2hGLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFFaEMsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiAqIFN0YWNrIHZlcmlmaWNhdGlvbiBzdGVwczpcbiAqICogYXdzIHNzbSBzdGFydC1zZXNzaW9uIC0tdGFyZ2V0IDxiYXN0aW9uIGhvc3QgaW5zdGFuY2UgaWQ+XG4gKiAqIGxzY3B1ICAjIEFyY2hpdGVjdHVyZSBzaG91bGQgYmUgYWFyY2g2NFxuICovXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdWUEMnKTtcblxuICAgIG5ldyBlYzIuQmFzdGlvbkhvc3RMaW51eCh0aGlzLCAnQmFzdGlvbkhvc3QnLCB7XG4gICAgICB2cGMsXG4gICAgICBpbnN0YW5jZVR5cGU6IGVjMi5JbnN0YW5jZVR5cGUub2YoZWMyLkluc3RhbmNlQ2xhc3MuVDRHLCBlYzIuSW5zdGFuY2VTaXplLk5BTk8pLFxuICAgIH0pO1xuICB9XG59XG5cbm5ldyBUZXN0U3RhY2soYXBwLCAnVGVzdFN0YWNrJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19