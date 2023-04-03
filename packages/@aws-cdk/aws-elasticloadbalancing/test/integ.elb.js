#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ec2 = require("@aws-cdk/aws-ec2");
const cdk = require("@aws-cdk/core");
const elb = require("../lib");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZWxiLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZWxiLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsOEJBQThCO0FBRTlCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUV0RCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUNwQyxNQUFNLEVBQUUsQ0FBQztDQUNWLENBQUMsQ0FBQztBQUVILElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0lBQ2hDLEdBQUc7SUFDSCxjQUFjLEVBQUUsSUFBSTtJQUNwQixTQUFTLEVBQUUsQ0FBQztZQUNWLFlBQVksRUFBRSxFQUFFO1lBQ2hCLG9CQUFvQixFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMzQyxDQUFDO0lBQ0YsV0FBVyxFQUFFO1FBQ1gsSUFBSSxFQUFFLEVBQUU7S0FDVDtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGVsYiBmcm9tICcuLi9saWInO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstZWxiLWludGVnJyk7XG5cbmNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVlBDJywge1xuICBtYXhBenM6IDEsXG59KTtcblxubmV3IGVsYi5Mb2FkQmFsYW5jZXIoc3RhY2ssICdMQicsIHtcbiAgdnBjLFxuICBpbnRlcm5ldEZhY2luZzogdHJ1ZSxcbiAgbGlzdGVuZXJzOiBbe1xuICAgIGV4dGVybmFsUG9ydDogODAsXG4gICAgYWxsb3dDb25uZWN0aW9uc0Zyb206IFtlYzIuUGVlci5hbnlJcHY0KCldLFxuICB9XSxcbiAgaGVhbHRoQ2hlY2s6IHtcbiAgICBwb3J0OiA4MCxcbiAgfSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==