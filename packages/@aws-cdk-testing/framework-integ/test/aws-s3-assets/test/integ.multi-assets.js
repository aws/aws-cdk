"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const iam = require("aws-cdk-lib/aws-iam");
const cdk = require("aws-cdk-lib");
const assets = require("aws-cdk-lib/aws-s3-assets");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcubXVsdGktYXNzZXRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcubXVsdGktYXNzZXRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFDbkMsb0RBQW9EO0FBRXBELE1BQU0sU0FBVSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQy9CLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4Qix1RUFBdUU7UUFDdkUsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztRQUVwQyxvREFBb0Q7UUFDcEQsdUJBQXVCO1FBQ3ZCLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQ3JDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQztTQUM3QyxDQUFDLENBQUM7UUFFSCxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNyQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUM7U0FDN0MsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsSUFBSSxTQUFTLENBQUMsR0FBRyxFQUFFLHNCQUFzQixDQUFDLENBQUM7QUFDM0MsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBhc3NldHMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWFzc2V0cyc7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICAvLyBUaGUgdGVtcGxhdGUgbXVzdCBjb250YWluIGF0IGxlYXN0IG9uZSByZXNvdXJjZSwgc28gdGhlcmUgaXMgdGhpcy4uLlxuICAgIG5ldyBpYW0uVXNlcih0aGlzLCAnRHVtbXlSZXNvdXJjZScpO1xuXG4gICAgLy8gQ2hlY2sgdGhhdCB0aGUgc2FtZSBhc3NldCBhZGRlZCBtdWx0aXBsZSB0aW1lcyBpc1xuICAgIC8vIHVwbG9hZGVkIGFuZCBjb3BpZWQuXG4gICAgbmV3IGFzc2V0cy5Bc3NldCh0aGlzLCAnU2FtcGxlQXNzZXQxJywge1xuICAgICAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpbGUtYXNzZXQudHh0JyksXG4gICAgfSk7XG5cbiAgICBuZXcgYXNzZXRzLkFzc2V0KHRoaXMsICdTYW1wbGVBc3NldDInLCB7XG4gICAgICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZmlsZS1hc3NldC50eHQnKSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xubmV3IFRlc3RTdGFjayhhcHAsICdhd3MtY2RrLW11bHRpLWFzc2V0cycpO1xuYXBwLnN5bnRoKCk7XG4iXX0=