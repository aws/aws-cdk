"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
const cdk = require("aws-cdk-lib");
const assets = require("aws-cdk-lib/aws-s3-assets");
class TestStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const asset = new assets.Asset(this, 'MyFile', {
            path: path.join(__dirname, 'file-asset.txt'),
        });
        /// !show
        const group = new iam.Group(this, 'MyUserGroup');
        asset.grantRead(group);
        /// !hide
    }
}
const app = new cdk.App();
new TestStack(app, 'aws-cdk-asset-refs');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXNzZXRzLnBlcm1pc3Npb25zLmxpdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmFzc2V0cy5wZXJtaXNzaW9ucy5saXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLG1DQUFtQztBQUNuQyxvREFBb0Q7QUFFcEQsTUFBTSxTQUFVLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDL0IsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO1lBQzdDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQztTQUM3QyxDQUFDLENBQUM7UUFFSCxTQUFTO1FBQ1QsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNqRCxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZCLFNBQVM7SUFDWCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztBQUN6QyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGFzc2V0cyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtYXNzZXRzJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5BcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGFzc2V0ID0gbmV3IGFzc2V0cy5Bc3NldCh0aGlzLCAnTXlGaWxlJywge1xuICAgICAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpbGUtYXNzZXQudHh0JyksXG4gICAgfSk7XG5cbiAgICAvLy8gIXNob3dcbiAgICBjb25zdCBncm91cCA9IG5ldyBpYW0uR3JvdXAodGhpcywgJ015VXNlckdyb3VwJyk7XG4gICAgYXNzZXQuZ3JhbnRSZWFkKGdyb3VwKTtcbiAgICAvLy8gIWhpZGVcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdhd3MtY2RrLWFzc2V0LXJlZnMnKTtcbmFwcC5zeW50aCgpO1xuIl19