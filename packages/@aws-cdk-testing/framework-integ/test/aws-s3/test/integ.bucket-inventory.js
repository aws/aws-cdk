#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const s3 = require("aws-cdk-lib/aws-s3");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-s3');
const inventoryBucket = new s3.Bucket(stack, 'InventoryBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const myBucket = new s3.Bucket(stack, 'MyBucket', {
    inventories: [
        {
            destination: {
                bucket: inventoryBucket,
                prefix: 'reports',
            },
            frequency: s3.InventoryFrequency.DAILY,
            format: s3.InventoryFormat.PARQUET,
        },
    ],
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
const secondInventoryBucket = new s3.Bucket(stack, 'SecondBucket', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
});
myBucket.addInventory({
    destination: {
        bucket: secondInventoryBucket,
    },
});
new integ_tests_alpha_1.IntegTest(app, 'cdk-integ-bucket-inventory', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVja2V0LWludmVudG9yeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmJ1Y2tldC1pbnZlbnRvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbUNBQW1DO0FBQ25DLGtFQUF1RDtBQUN2RCx5Q0FBeUM7QUFFekMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUUvQyxNQUFNLGVBQWUsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO0lBQzlELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87Q0FDekMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxVQUFVLEVBQUU7SUFDaEQsV0FBVyxFQUFFO1FBQ1g7WUFDRSxXQUFXLEVBQUU7Z0JBQ1gsTUFBTSxFQUFFLGVBQWU7Z0JBQ3ZCLE1BQU0sRUFBRSxTQUFTO2FBQ2xCO1lBQ0QsU0FBUyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLO1lBQ3RDLE1BQU0sRUFBRSxFQUFFLENBQUMsZUFBZSxDQUFDLE9BQU87U0FDbkM7S0FDRjtJQUNELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87Q0FDekMsQ0FBQyxDQUFDO0FBRUgsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRTtJQUNqRSxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPO0NBQ3pDLENBQUMsQ0FBQztBQUVILFFBQVEsQ0FBQyxZQUFZLENBQUM7SUFDcEIsV0FBVyxFQUFFO1FBQ1gsTUFBTSxFQUFFLHFCQUFxQjtLQUM5QjtDQUNGLENBQUMsQ0FBQztBQUVILElBQUksNkJBQVMsQ0FBQyxHQUFHLEVBQUUsNEJBQTRCLEVBQUU7SUFDL0MsU0FBUyxFQUFFLENBQUMsS0FBSyxDQUFDO0NBQ25CLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIiMhL3Vzci9iaW4vZW52IG5vZGVcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgeyBJbnRlZ1Rlc3QgfSBmcm9tICdAYXdzLWNkay9pbnRlZy10ZXN0cy1hbHBoYSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpO1xuXG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWNkay1zMycpO1xuXG5jb25zdCBpbnZlbnRvcnlCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnSW52ZW50b3J5QnVja2V0Jywge1xuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5cbmNvbnN0IG15QnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ015QnVja2V0Jywge1xuICBpbnZlbnRvcmllczogW1xuICAgIHtcbiAgICAgIGRlc3RpbmF0aW9uOiB7XG4gICAgICAgIGJ1Y2tldDogaW52ZW50b3J5QnVja2V0LFxuICAgICAgICBwcmVmaXg6ICdyZXBvcnRzJyxcbiAgICAgIH0sXG4gICAgICBmcmVxdWVuY3k6IHMzLkludmVudG9yeUZyZXF1ZW5jeS5EQUlMWSxcbiAgICAgIGZvcm1hdDogczMuSW52ZW50b3J5Rm9ybWF0LlBBUlFVRVQsXG4gICAgfSxcbiAgXSxcbiAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbn0pO1xuXG5jb25zdCBzZWNvbmRJbnZlbnRvcnlCdWNrZXQgPSBuZXcgczMuQnVja2V0KHN0YWNrLCAnU2Vjb25kQnVja2V0Jywge1xuICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxufSk7XG5cbm15QnVja2V0LmFkZEludmVudG9yeSh7XG4gIGRlc3RpbmF0aW9uOiB7XG4gICAgYnVja2V0OiBzZWNvbmRJbnZlbnRvcnlCdWNrZXQsXG4gIH0sXG59KTtcblxubmV3IEludGVnVGVzdChhcHAsICdjZGstaW50ZWctYnVja2V0LWludmVudG9yeScsIHtcbiAgdGVzdENhc2VzOiBbc3RhY2tdLFxufSk7Il19