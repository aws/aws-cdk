"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lambda = require("@aws-cdk/aws-lambda");
const cdk = require("@aws-cdk/cdk");
const fs = require("fs");
const customResource = require("../lib");
class DemoResource extends cdk.Construct {
    constructor(parent, name, props) {
        super(parent, name);
        const resource = new customResource.CustomResource(this, 'Resource', {
            lambdaProvider: new customResource.SingletonLambda(this, 'Singleton', {
                uuid: 'f7d4f730-4ee1-11e8-9c2d-fa7ae01bbebc',
                // This makes the demo only work as top-level TypeScript program, but that's fine for now
                code: new lambda.LambdaInlineCode(fs.readFileSync('integ.trivial-lambda-provider.py', { encoding: 'utf-8' })),
                handler: 'index.main',
                timeout: 300,
                runtime: lambda.LambdaRuntime.Python27,
            }),
            properties: props
        });
        this.response = resource.getAtt('Response');
    }
}
/**
 * A stack that only sets up the CustomResource and shows how to get an attribute from it
 */
class SucceedingStack extends cdk.Stack {
    constructor(parent, name, props) {
        super(parent, name, props);
        const resource = new DemoResource(this, 'DemoResource', {
            message: 'CustomResource says hello',
        });
        // Publish the custom resource output
        new cdk.Output(this, 'ResponseMessage', {
            description: 'The message that came back from the Custom Resource',
            value: resource.response
        });
    }
}
const app = new cdk.App(process.argv);
new SucceedingStack(app, 'SucceedingStack');
process.stdout.write(app.run());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcudHJpdmlhbC1sYW1iZGEtcmVzb3VyY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy50cml2aWFsLWxhbWJkYS1yZXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhDQUErQztBQUMvQyxvQ0FBcUM7QUFDckMseUJBQTBCO0FBQzFCLHlDQUEwQztBQWMxQyxrQkFBbUIsU0FBUSxHQUFHLENBQUMsU0FBUztJQUdwQyxZQUFZLE1BQXFCLEVBQUUsSUFBWSxFQUFFLEtBQXdCO1FBQ3JFLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFcEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxjQUFjLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDakUsY0FBYyxFQUFFLElBQUksY0FBYyxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO2dCQUNsRSxJQUFJLEVBQUUsc0NBQXNDO2dCQUM1Qyx5RkFBeUY7Z0JBQ3pGLElBQUksRUFBRSxJQUFJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGtDQUFrQyxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQzdHLE9BQU8sRUFBRSxZQUFZO2dCQUNyQixPQUFPLEVBQUUsR0FBRztnQkFDWixPQUFPLEVBQUUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRO2FBQ3pDLENBQUM7WUFDRixVQUFVLEVBQUUsS0FBSztTQUNwQixDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDaEQsQ0FBQztDQUNKO0FBRUQ7O0dBRUc7QUFDSCxxQkFBc0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNuQyxZQUFZLE1BQWUsRUFBRSxJQUFZLEVBQUUsS0FBc0I7UUFDN0QsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFM0IsTUFBTSxRQUFRLEdBQUcsSUFBSSxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRTtZQUNwRCxPQUFPLEVBQUUsMkJBQTJCO1NBQ3ZDLENBQUMsQ0FBQztRQUVILHFDQUFxQztRQUNyQyxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFO1lBQ3BDLFdBQVcsRUFBRSxxREFBcUQ7WUFDbEUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRO1NBQzNCLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQUNELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdEMsSUFBSSxlQUFlLENBQUMsR0FBRyxFQUFFLGlCQUFpQixDQUFDLENBQUM7QUFFNUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMifQ==