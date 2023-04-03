"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const assets = require("../lib");
class TestStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // The template must contain at least one resource, so there is this...
        new iam.User(this, 'DummyResource');
        // Check that the same asset added multiple times is
        // uploaded and copied.
        new assets.Asset(this, 'SampleAsset1', {
            path: path.join(__dirname, 'file-asset.txt'),
        });
        new assets.Asset(this, 'SampleAsset2', {
            path: path.join(__dirname, 'file-asset.txt'),
        });
    }
}
const app = new cdk.App();
new TestStack(app, 'aws-cdk-multi-assets');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubXVsdGktYXNzZXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubXVsdGktYXNzZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFDckMsaUNBQWlDO0FBRWpDLE1BQU0sU0FBVSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQy9CLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qix1RUFBdUU7UUFDdkUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztRQUVwQyxvREFBb0Q7UUFDcEQsdUJBQXVCO1FBQ3ZCLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3JDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQztTQUM3QyxDQUFDLENBQUM7UUFFSCxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNyQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUM7U0FDN0MsQ0FBQyxDQUFDO0tBQ0o7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxzQkFBc0IsQ0FBQyxDQUFDO0FBQzNDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBhc3NldHMgZnJvbSAnLi4vbGliJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIC8vIFRoZSB0ZW1wbGF0ZSBtdXN0IGNvbnRhaW4gYXQgbGVhc3Qgb25lIHJlc291cmNlLCBzbyB0aGVyZSBpcyB0aGlzLi4uXG4gICAgbmV3IGlhbS5Vc2VyKHRoaXMsICdEdW1teVJlc291cmNlJyk7XG5cbiAgICAvLyBDaGVjayB0aGF0IHRoZSBzYW1lIGFzc2V0IGFkZGVkIG11bHRpcGxlIHRpbWVzIGlzXG4gICAgLy8gdXBsb2FkZWQgYW5kIGNvcGllZC5cbiAgICBuZXcgYXNzZXRzLkFzc2V0KHRoaXMsICdTYW1wbGVBc3NldDEnLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZmlsZS1hc3NldC50eHQnKSxcbiAgICB9KTtcblxuICAgIG5ldyBhc3NldHMuQXNzZXQodGhpcywgJ1NhbXBsZUFzc2V0MicsIHtcbiAgICAgIHBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaWxlLWFzc2V0LnR4dCcpLFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2F3cy1jZGstbXVsdGktYXNzZXRzJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==