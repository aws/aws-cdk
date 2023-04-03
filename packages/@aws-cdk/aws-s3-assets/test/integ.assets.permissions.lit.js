"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const assets = require("../lib");
class TestStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const asset = new assets.Asset(this, 'MyFile', {
            path: path.join(__dirname, 'file-asset.txt'),
        });
        /// !show
        const group = new iam.Group(this, 'MyUserGroup');
        asset.grantRead(group);
    }
}
const app = new cdk.App();
new TestStack(app, 'aws-cdk-asset-refs');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXNzZXRzLnBlcm1pc3Npb25zLmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmFzc2V0cy5wZXJtaXNzaW9ucy5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0Isd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQyxpQ0FBaUM7QUFFakMsTUFBTSxTQUFVLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDL0IsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQzdDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQztTQUM3QyxDQUFDLENBQUM7UUFFSCxTQUFTO1FBQ1QsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNqRCxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBRXhCO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUN6QyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgYXNzZXRzIGZyb20gJy4uL2xpYic7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCBhc3NldCA9IG5ldyBhc3NldHMuQXNzZXQodGhpcywgJ015RmlsZScsIHtcbiAgICAgIHBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICdmaWxlLWFzc2V0LnR4dCcpLFxuICAgIH0pO1xuXG4gICAgLy8vICFzaG93XG4gICAgY29uc3QgZ3JvdXAgPSBuZXcgaWFtLkdyb3VwKHRoaXMsICdNeVVzZXJHcm91cCcpO1xuICAgIGFzc2V0LmdyYW50UmVhZChncm91cCk7XG4gICAgLy8vICFoaWRlXG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBUZXN0U3RhY2soYXBwLCAnYXdzLWNkay1hc3NldC1yZWZzJyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==