"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda-nodejs");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new lambda.NodejsFunction(this, 'esm', {
            entry: path.join(__dirname, 'integ-handlers/esm.ts'),
            bundling: {
                format: lambda.OutputFormat.ESM,
            },
        });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-lambda-nodejs-esm');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZXNtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuZXNtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLDZDQUFxRDtBQUVyRCx3REFBd0Q7QUFFeEQsTUFBTSxTQUFVLFNBQVEsbUJBQUs7SUFDM0IsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjtRQUMxRCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUNyQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsdUJBQXVCLENBQUM7WUFDcEQsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUc7YUFDaEM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsNkJBQTZCLENBQUMsQ0FBQztBQUNsRCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIG5ldyBsYW1iZGEuTm9kZWpzRnVuY3Rpb24odGhpcywgJ2VzbScsIHtcbiAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnaW50ZWctaGFuZGxlcnMvZXNtLnRzJyksXG4gICAgICBidW5kbGluZzoge1xuICAgICAgICBmb3JtYXQ6IGxhbWJkYS5PdXRwdXRGb3JtYXQuRVNNLFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2Nkay1pbnRlZy1sYW1iZGEtbm9kZWpzLWVzbScpO1xuYXBwLnN5bnRoKCk7XG4iXX0=