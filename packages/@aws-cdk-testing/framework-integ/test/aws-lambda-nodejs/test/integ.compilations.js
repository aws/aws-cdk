"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const lambda = require("aws-cdk-lib/aws-lambda-nodejs");
class TestStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new lambda.NodejsFunction(this, 'ts-decorator-handler', {
            entry: path.join(__dirname, 'integ-handlers/ts-decorator-handler.ts'),
            bundling: {
                minify: true,
                sourceMap: true,
                sourceMapMode: lambda.SourceMapMode.BOTH,
                preCompilation: true,
            },
            runtime: aws_lambda_1.Runtime.NODEJS_16_X,
        });
        new lambda.NodejsFunction(this, 'ts-decorator-handler-tsconfig', {
            entry: path.join(__dirname, 'integ-handlers/ts-decorator-handler.ts'),
            bundling: {
                minify: true,
                sourceMap: true,
                sourceMapMode: lambda.SourceMapMode.BOTH,
                tsconfig: path.join(__dirname, '..', 'tsconfig.json'),
                preCompilation: true,
            },
            runtime: aws_lambda_1.Runtime.NODEJS_16_X,
        });
    }
}
const app = new aws_cdk_lib_1.App();
new TestStack(app, 'cdk-integ-compilations-lambda-nodejs');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY29tcGlsYXRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY29tcGlsYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTZCO0FBQzdCLHVEQUFpRDtBQUNqRCw2Q0FBcUQ7QUFFckQsd0RBQXdEO0FBRXhELE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxzQkFBc0IsRUFBRTtZQUN0RCxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsd0NBQXdDLENBQUM7WUFDckUsUUFBUSxFQUFFO2dCQUNSLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFNBQVMsRUFBRSxJQUFJO2dCQUNmLGFBQWEsRUFBRSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQUk7Z0JBQ3hDLGNBQWMsRUFBRSxJQUFJO2FBQ3JCO1lBQ0QsT0FBTyxFQUFFLG9CQUFPLENBQUMsV0FBVztTQUM3QixDQUFDLENBQUM7UUFFSCxJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLCtCQUErQixFQUFFO1lBQy9ELEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSx3Q0FBd0MsQ0FBQztZQUNyRSxRQUFRLEVBQUU7Z0JBQ1IsTUFBTSxFQUFFLElBQUk7Z0JBQ1osU0FBUyxFQUFFLElBQUk7Z0JBQ2YsYUFBYSxFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSTtnQkFDeEMsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxlQUFlLENBQUM7Z0JBQ3JELGNBQWMsRUFBRSxJQUFJO2FBQ3JCO1lBQ0QsT0FBTyxFQUFFLG9CQUFPLENBQUMsV0FBVztTQUM3QixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUsc0NBQXNDLENBQUMsQ0FBQztBQUMzRCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgUnVudGltZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnO1xuaW1wb3J0IHsgQXBwLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgbGFtYmRhIGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEtbm9kZWpzJztcblxuY2xhc3MgVGVzdFN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wcz86IFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIG5ldyBsYW1iZGEuTm9kZWpzRnVuY3Rpb24odGhpcywgJ3RzLWRlY29yYXRvci1oYW5kbGVyJywge1xuICAgICAgZW50cnk6IHBhdGguam9pbihfX2Rpcm5hbWUsICdpbnRlZy1oYW5kbGVycy90cy1kZWNvcmF0b3ItaGFuZGxlci50cycpLFxuICAgICAgYnVuZGxpbmc6IHtcbiAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICBzb3VyY2VNYXA6IHRydWUsXG4gICAgICAgIHNvdXJjZU1hcE1vZGU6IGxhbWJkYS5Tb3VyY2VNYXBNb2RlLkJPVEgsXG4gICAgICAgIHByZUNvbXBpbGF0aW9uOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE2X1gsXG4gICAgfSk7XG5cbiAgICBuZXcgbGFtYmRhLk5vZGVqc0Z1bmN0aW9uKHRoaXMsICd0cy1kZWNvcmF0b3ItaGFuZGxlci10c2NvbmZpZycsIHtcbiAgICAgIGVudHJ5OiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnaW50ZWctaGFuZGxlcnMvdHMtZGVjb3JhdG9yLWhhbmRsZXIudHMnKSxcbiAgICAgIGJ1bmRsaW5nOiB7XG4gICAgICAgIG1pbmlmeTogdHJ1ZSxcbiAgICAgICAgc291cmNlTWFwOiB0cnVlLFxuICAgICAgICBzb3VyY2VNYXBNb2RlOiBsYW1iZGEuU291cmNlTWFwTW9kZS5CT1RILFxuICAgICAgICB0c2NvbmZpZzogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uJywgJ3RzY29uZmlnLmpzb24nKSxcbiAgICAgICAgcHJlQ29tcGlsYXRpb246IHRydWUsXG4gICAgICB9LFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMTZfWCxcbiAgICB9KTtcbiAgfVxufVxuXG5jb25zdCBhcHAgPSBuZXcgQXBwKCk7XG5uZXcgVGVzdFN0YWNrKGFwcCwgJ2Nkay1pbnRlZy1jb21waWxhdGlvbnMtbGFtYmRhLW5vZGVqcycpO1xuYXBwLnN5bnRoKCk7XG4iXX0=