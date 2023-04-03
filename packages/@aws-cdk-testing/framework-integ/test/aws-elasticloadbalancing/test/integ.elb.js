#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("aws-cdk-lib/aws-ec2");
const cdk = require("aws-cdk-lib");
const elb = require("aws-cdk-lib/aws-elasticloadbalancing");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-elb-integ');
const vpc = new ec2.Vpc(stack, 'VPC', {
    maxAzs: 1,
});
new elb.LoadBalancer(stack, 'LB', {
    vpc,
    internetFacing: true,
    listeners: [{
            externalPort: 80,
            allowConnectionsFrom: [ec2.Peer.anyIpv4()],
        }],
    healthCheck: {
        port: 80,
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWxiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZWxiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFDbkMsNERBQTREO0FBRTVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUV0RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUNwQyxNQUFNLEVBQUUsQ0FBQztDQUNWLENBQUMsQ0FBQztBQUVILElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0lBQ2hDLEdBQUc7SUFDSCxjQUFjLEVBQUUsSUFBSTtJQUNwQixTQUFTLEVBQUUsQ0FBQztZQUNWLFlBQVksRUFBRSxFQUFFO1lBQ2hCLG9CQUFvQixFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMzQyxDQUFDO0lBQ0YsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLEVBQUU7S0FDVDtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlbGIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5nJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWVsYi1pbnRlZycpO1xuXG5jb25zdCB2cGMgPSBuZXcgZWMyLlZwYyhzdGFjaywgJ1ZQQycsIHtcbiAgbWF4QXpzOiAxLFxufSk7XG5cbm5ldyBlbGIuTG9hZEJhbGFuY2VyKHN0YWNrLCAnTEInLCB7XG4gIHZwYyxcbiAgaW50ZXJuZXRGYWNpbmc6IHRydWUsXG4gIGxpc3RlbmVyczogW3tcbiAgICBleHRlcm5hbFBvcnQ6IDgwLFxuICAgIGFsbG93Q29ubmVjdGlvbnNGcm9tOiBbZWMyLlBlZXIuYW55SXB2NCgpXSxcbiAgfV0sXG4gIGhlYWx0aENoZWNrOiB7XG4gICAgcG9ydDogODAsXG4gIH0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=