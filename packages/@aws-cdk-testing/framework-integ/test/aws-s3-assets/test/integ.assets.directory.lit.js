"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
const cdk = require("aws-cdk-lib");
const assets = require("aws-cdk-lib/aws-s3-assets");
class TestStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /// !show
        const asset = new assets.Asset(this, 'SampleAsset', {
            path: path.join(__dirname, 'sample-asset-directory'),
        });
        /// !hide
        const user = new iam.User(this, 'MyUser');
        asset.grantRead(user);
    }
}
const app = new cdk.App();
new TestStack(app, 'aws-cdk-asset-test');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYXNzZXRzLmRpcmVjdG9yeS5saXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5hc3NldHMuZGlyZWN0b3J5LmxpdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3QiwyQ0FBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLG9EQUFvRDtBQUVwRCxNQUFNLFNBQVUsU0FBUSxHQUFHLENBQUMsS0FBSztJQUMvQixZQUFZLEtBQWMsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDNUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsU0FBUztRQUNULE1BQU0sS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ2xELElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx3QkFBd0IsQ0FBQztTQUNyRCxDQUFDLENBQUM7UUFDSCxTQUFTO1FBRVQsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUMxQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLENBQUM7Q0FDRjtBQUVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3pDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgYXNzZXRzIGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMy1hc3NldHMnO1xuXG5jbGFzcyBUZXN0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgLy8vICFzaG93XG4gICAgY29uc3QgYXNzZXQgPSBuZXcgYXNzZXRzLkFzc2V0KHRoaXMsICdTYW1wbGVBc3NldCcsIHtcbiAgICAgIHBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICdzYW1wbGUtYXNzZXQtZGlyZWN0b3J5JyksXG4gICAgfSk7XG4gICAgLy8vICFoaWRlXG5cbiAgICBjb25zdCB1c2VyID0gbmV3IGlhbS5Vc2VyKHRoaXMsICdNeVVzZXInKTtcbiAgICBhc3NldC5ncmFudFJlYWQodXNlcik7XG4gIH1cbn1cblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbm5ldyBUZXN0U3RhY2soYXBwLCAnYXdzLWNkay1hc3NldC10ZXN0Jyk7XG5hcHAuc3ludGgoKTtcbiJdfQ==