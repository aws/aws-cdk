"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Stack verification steps:
 * * aws ssm start-session --target <bastion host instance id>
 * * lscpu  # Architecture should be aarch64
 */
const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYmFzdGlvbi1ob3N0LWFybS1zdXBwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuYmFzdGlvbi1ob3N0LWFybS1zdXBwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7R0FJRztBQUNILG1DQUFtQztBQUNuQywyQ0FBMkM7QUFFM0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxTQUFVLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDL0IsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFckMsSUFBSSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUM1QyxHQUFHO1lBQ0gsWUFBWSxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1NBQ2hGLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQUVELElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUVoQyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogU3RhY2sgdmVyaWZpY2F0aW9uIHN0ZXBzOlxuICogKiBhd3Mgc3NtIHN0YXJ0LXNlc3Npb24gLS10YXJnZXQgPGJhc3Rpb24gaG9zdCBpbnN0YW5jZSBpZD5cbiAqICogbHNjcHUgICMgQXJjaGl0ZWN0dXJlIHNob3VsZCBiZSBhYXJjaDY0XG4gKi9cbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnVlBDJyk7XG5cbiAgICBuZXcgZWMyLkJhc3Rpb25Ib3N0TGludXgodGhpcywgJ0Jhc3Rpb25Ib3N0Jywge1xuICAgICAgdnBjLFxuICAgICAgaW5zdGFuY2VUeXBlOiBlYzIuSW5zdGFuY2VUeXBlLm9mKGVjMi5JbnN0YW5jZUNsYXNzLlQ0RywgZWMyLkluc3RhbmNlU2l6ZS5OQU5PKSxcbiAgICB9KTtcbiAgfVxufVxuXG5uZXcgVGVzdFN0YWNrKGFwcCwgJ1Rlc3RTdGFjaycpO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==