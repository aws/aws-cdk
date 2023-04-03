"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@aws-cdk/core");
const lib_1 = require("../lib");
/**
 * This file showcases how to split up a RestApi's Resources and Methods across nested stacks.
 *
 * The root stack 'RootStack' first defines a RestApi.
 * Two nested stacks BooksStack and PetsStack, create corresponding Resources '/books' and '/pets'.
 * They are then deployed to a 'prod' Stage via a third nested stack - DeployStack.
 *
 * To verify this worked, go to the APIGateway
 */
class RootStack extends core_1.Stack {
    constructor(scope) {
        super(scope, 'integ-restapi-import-RootStack');
        const restApi = new lib_1.RestApi(this, 'RestApi', {
            cloudWatchRole: true,
            deploy: false,
        });
        restApi.root.addMethod('ANY');
        const petsStack = new PetsStack(this, {
            restApiId: restApi.restApiId,
            rootResourceId: restApi.restApiRootResourceId,
        });
        const booksStack = new BooksStack(this, {
            restApiId: restApi.restApiId,
            rootResourceId: restApi.restApiRootResourceId,
        });
        new DeployStack(this, {
            restApiId: restApi.restApiId,
            methods: petsStack.methods.concat(booksStack.methods),
        });
        new core_1.CfnOutput(this, 'PetsURL', {
            value: `https://${restApi.restApiId}.execute-api.${this.region}.amazonaws.com/prod/pets`,
        });
        new core_1.CfnOutput(this, 'BooksURL', {
            value: `https://${restApi.restApiId}.execute-api.${this.region}.amazonaws.com/prod/books`,
        });
    }
}
class PetsStack extends core_1.NestedStack {
    constructor(scope, props) {
        super(scope, 'integ-restapi-import-PetsStack', props);
        this.methods = [];
        const api = lib_1.RestApi.fromRestApiAttributes(this, 'RestApi', {
            restApiId: props.restApiId,
            rootResourceId: props.rootResourceId,
        });
        const method = api.root.addResource('pets').addMethod('GET', new lib_1.MockIntegration({
            integrationResponses: [{
                    statusCode: '200',
                }],
            passthroughBehavior: lib_1.PassthroughBehavior.NEVER,
            requestTemplates: {
                'application/json': '{ "statusCode": 200 }',
            },
        }), {
            methodResponses: [{ statusCode: '200' }],
        });
        this.methods.push(method);
    }
}
class BooksStack extends core_1.NestedStack {
    constructor(scope, props) {
        super(scope, 'integ-restapi-import-BooksStack', props);
        this.methods = [];
        const api = lib_1.RestApi.fromRestApiAttributes(this, 'RestApi', {
            restApiId: props.restApiId,
            rootResourceId: props.rootResourceId,
        });
        const method = api.root.addResource('books').addMethod('GET', new lib_1.MockIntegration({
            integrationResponses: [{
                    statusCode: '200',
                }],
            passthroughBehavior: lib_1.PassthroughBehavior.NEVER,
            requestTemplates: {
                'application/json': '{ "statusCode": 200 }',
            },
        }), {
            methodResponses: [{ statusCode: '200' }],
        });
        this.methods.push(method);
    }
}
class DeployStack extends core_1.NestedStack {
    constructor(scope, props) {
        super(scope, 'integ-restapi-import-DeployStack', props);
        const deployment = new lib_1.Deployment(this, 'Deployment', {
            api: lib_1.RestApi.fromRestApiId(this, 'RestApi', props.restApiId),
        });
        if (props.methods) {
            for (const method of props.methods) {
                deployment.node.addDependency(method);
            }
        }
        new lib_1.Stage(this, 'Stage', { deployment });
    }
}
new RootStack(new core_1.App());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVzdGFwaS1pbXBvcnQubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucmVzdGFwaS1pbXBvcnQubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsd0NBQXFGO0FBRXJGLGdDQUFrRztBQUVsRzs7Ozs7Ozs7R0FRRztBQUVILE1BQU0sU0FBVSxTQUFRLFlBQUs7SUFDM0IsWUFBWSxLQUFnQjtRQUMxQixLQUFLLENBQUMsS0FBSyxFQUFFLGdDQUFnQyxDQUFDLENBQUM7UUFFL0MsTUFBTSxPQUFPLEdBQUcsSUFBSSxhQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUMzQyxjQUFjLEVBQUUsSUFBSTtZQUNwQixNQUFNLEVBQUUsS0FBSztTQUNkLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTlCLE1BQU0sU0FBUyxHQUFHLElBQUksU0FBUyxDQUFDLElBQUksRUFBRTtZQUNwQyxTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7WUFDNUIsY0FBYyxFQUFFLE9BQU8sQ0FBQyxxQkFBcUI7U0FDOUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxVQUFVLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFO1lBQ3RDLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztZQUM1QixjQUFjLEVBQUUsT0FBTyxDQUFDLHFCQUFxQjtTQUM5QyxDQUFDLENBQUM7UUFDSCxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUU7WUFDcEIsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO1lBQzVCLE9BQU8sRUFBRSxTQUFTLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO1NBQ3RELENBQUMsQ0FBQztRQUVILElBQUksZ0JBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzdCLEtBQUssRUFBRSxXQUFXLE9BQU8sQ0FBQyxTQUFTLGdCQUFnQixJQUFJLENBQUMsTUFBTSwwQkFBMEI7U0FDekYsQ0FBQyxDQUFDO1FBRUgsSUFBSSxnQkFBUyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDOUIsS0FBSyxFQUFFLFdBQVcsT0FBTyxDQUFDLFNBQVMsZ0JBQWdCLElBQUksQ0FBQyxNQUFNLDJCQUEyQjtTQUMxRixDQUFDLENBQUM7S0FDSjtDQUNGO0FBUUQsTUFBTSxTQUFVLFNBQVEsa0JBQVc7SUFHakMsWUFBWSxLQUFnQixFQUFFLEtBQStCO1FBQzNELEtBQUssQ0FBQyxLQUFLLEVBQUUsZ0NBQWdDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFIeEMsWUFBTyxHQUFhLEVBQUUsQ0FBQztRQUtyQyxNQUFNLEdBQUcsR0FBRyxhQUFPLENBQUMscUJBQXFCLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUN6RCxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7WUFDMUIsY0FBYyxFQUFFLEtBQUssQ0FBQyxjQUFjO1NBQ3JDLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxxQkFBZSxDQUFDO1lBQy9FLG9CQUFvQixFQUFFLENBQUM7b0JBQ3JCLFVBQVUsRUFBRSxLQUFLO2lCQUNsQixDQUFDO1lBQ0YsbUJBQW1CLEVBQUUseUJBQW1CLENBQUMsS0FBSztZQUM5QyxnQkFBZ0IsRUFBRTtnQkFDaEIsa0JBQWtCLEVBQUUsdUJBQXVCO2FBQzVDO1NBQ0YsQ0FBQyxFQUFFO1lBQ0YsZUFBZSxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLENBQUM7U0FDekMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDM0I7Q0FDRjtBQUVELE1BQU0sVUFBVyxTQUFRLGtCQUFXO0lBR2xDLFlBQVksS0FBZ0IsRUFBRSxLQUErQjtRQUMzRCxLQUFLLENBQUMsS0FBSyxFQUFFLGlDQUFpQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBSHpDLFlBQU8sR0FBYSxFQUFFLENBQUM7UUFLckMsTUFBTSxHQUFHLEdBQUcsYUFBTyxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDekQsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQzFCLGNBQWMsRUFBRSxLQUFLLENBQUMsY0FBYztTQUNyQyxDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUkscUJBQWUsQ0FBQztZQUNoRixvQkFBb0IsRUFBRSxDQUFDO29CQUNyQixVQUFVLEVBQUUsS0FBSztpQkFDbEIsQ0FBQztZQUNGLG1CQUFtQixFQUFFLHlCQUFtQixDQUFDLEtBQUs7WUFDOUMsZ0JBQWdCLEVBQUU7Z0JBQ2hCLGtCQUFrQixFQUFFLHVCQUF1QjthQUM1QztTQUNGLENBQUMsRUFBRTtZQUNGLGVBQWUsRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxDQUFDO1NBQ3pDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQzNCO0NBQ0Y7QUFRRCxNQUFNLFdBQVksU0FBUSxrQkFBVztJQUNuQyxZQUFZLEtBQWdCLEVBQUUsS0FBdUI7UUFDbkQsS0FBSyxDQUFDLEtBQUssRUFBRSxrQ0FBa0MsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4RCxNQUFNLFVBQVUsR0FBRyxJQUFJLGdCQUFVLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNwRCxHQUFHLEVBQUUsYUFBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUM7U0FDN0QsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO1lBQ2pCLEtBQUssTUFBTSxNQUFNLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtnQkFDbEMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDdkM7U0FDRjtRQUNELElBQUksV0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0tBQzFDO0NBQ0Y7QUFFRCxJQUFJLFNBQVMsQ0FBQyxJQUFJLFVBQUcsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgTmVzdGVkU3RhY2ssIE5lc3RlZFN0YWNrUHJvcHMsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IERlcGxveW1lbnQsIE1ldGhvZCwgTW9ja0ludGVncmF0aW9uLCBQYXNzdGhyb3VnaEJlaGF2aW9yLCBSZXN0QXBpLCBTdGFnZSB9IGZyb20gJy4uL2xpYic7XG5cbi8qKlxuICogVGhpcyBmaWxlIHNob3djYXNlcyBob3cgdG8gc3BsaXQgdXAgYSBSZXN0QXBpJ3MgUmVzb3VyY2VzIGFuZCBNZXRob2RzIGFjcm9zcyBuZXN0ZWQgc3RhY2tzLlxuICpcbiAqIFRoZSByb290IHN0YWNrICdSb290U3RhY2snIGZpcnN0IGRlZmluZXMgYSBSZXN0QXBpLlxuICogVHdvIG5lc3RlZCBzdGFja3MgQm9va3NTdGFjayBhbmQgUGV0c1N0YWNrLCBjcmVhdGUgY29ycmVzcG9uZGluZyBSZXNvdXJjZXMgJy9ib29rcycgYW5kICcvcGV0cycuXG4gKiBUaGV5IGFyZSB0aGVuIGRlcGxveWVkIHRvIGEgJ3Byb2QnIFN0YWdlIHZpYSBhIHRoaXJkIG5lc3RlZCBzdGFjayAtIERlcGxveVN0YWNrLlxuICpcbiAqIFRvIHZlcmlmeSB0aGlzIHdvcmtlZCwgZ28gdG8gdGhlIEFQSUdhdGV3YXlcbiAqL1xuXG5jbGFzcyBSb290U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICBzdXBlcihzY29wZSwgJ2ludGVnLXJlc3RhcGktaW1wb3J0LVJvb3RTdGFjaycpO1xuXG4gICAgY29uc3QgcmVzdEFwaSA9IG5ldyBSZXN0QXBpKHRoaXMsICdSZXN0QXBpJywge1xuICAgICAgY2xvdWRXYXRjaFJvbGU6IHRydWUsXG4gICAgICBkZXBsb3k6IGZhbHNlLFxuICAgIH0pO1xuICAgIHJlc3RBcGkucm9vdC5hZGRNZXRob2QoJ0FOWScpO1xuXG4gICAgY29uc3QgcGV0c1N0YWNrID0gbmV3IFBldHNTdGFjayh0aGlzLCB7XG4gICAgICByZXN0QXBpSWQ6IHJlc3RBcGkucmVzdEFwaUlkLFxuICAgICAgcm9vdFJlc291cmNlSWQ6IHJlc3RBcGkucmVzdEFwaVJvb3RSZXNvdXJjZUlkLFxuICAgIH0pO1xuICAgIGNvbnN0IGJvb2tzU3RhY2sgPSBuZXcgQm9va3NTdGFjayh0aGlzLCB7XG4gICAgICByZXN0QXBpSWQ6IHJlc3RBcGkucmVzdEFwaUlkLFxuICAgICAgcm9vdFJlc291cmNlSWQ6IHJlc3RBcGkucmVzdEFwaVJvb3RSZXNvdXJjZUlkLFxuICAgIH0pO1xuICAgIG5ldyBEZXBsb3lTdGFjayh0aGlzLCB7XG4gICAgICByZXN0QXBpSWQ6IHJlc3RBcGkucmVzdEFwaUlkLFxuICAgICAgbWV0aG9kczogcGV0c1N0YWNrLm1ldGhvZHMuY29uY2F0KGJvb2tzU3RhY2subWV0aG9kcyksXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdQZXRzVVJMJywge1xuICAgICAgdmFsdWU6IGBodHRwczovLyR7cmVzdEFwaS5yZXN0QXBpSWR9LmV4ZWN1dGUtYXBpLiR7dGhpcy5yZWdpb259LmFtYXpvbmF3cy5jb20vcHJvZC9wZXRzYCxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0Jvb2tzVVJMJywge1xuICAgICAgdmFsdWU6IGBodHRwczovLyR7cmVzdEFwaS5yZXN0QXBpSWR9LmV4ZWN1dGUtYXBpLiR7dGhpcy5yZWdpb259LmFtYXpvbmF3cy5jb20vcHJvZC9ib29rc2AsXG4gICAgfSk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFJlc291cmNlTmVzdGVkU3RhY2tQcm9wcyBleHRlbmRzIE5lc3RlZFN0YWNrUHJvcHMge1xuICByZWFkb25seSByZXN0QXBpSWQ6IHN0cmluZztcblxuICByZWFkb25seSByb290UmVzb3VyY2VJZDogc3RyaW5nO1xufVxuXG5jbGFzcyBQZXRzU3RhY2sgZXh0ZW5kcyBOZXN0ZWRTdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBtZXRob2RzOiBNZXRob2RbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIHByb3BzOiBSZXNvdXJjZU5lc3RlZFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgJ2ludGVnLXJlc3RhcGktaW1wb3J0LVBldHNTdGFjaycsIHByb3BzKTtcblxuICAgIGNvbnN0IGFwaSA9IFJlc3RBcGkuZnJvbVJlc3RBcGlBdHRyaWJ1dGVzKHRoaXMsICdSZXN0QXBpJywge1xuICAgICAgcmVzdEFwaUlkOiBwcm9wcy5yZXN0QXBpSWQsXG4gICAgICByb290UmVzb3VyY2VJZDogcHJvcHMucm9vdFJlc291cmNlSWQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBtZXRob2QgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncGV0cycpLmFkZE1ldGhvZCgnR0VUJywgbmV3IE1vY2tJbnRlZ3JhdGlvbih7XG4gICAgICBpbnRlZ3JhdGlvblJlc3BvbnNlczogW3tcbiAgICAgICAgc3RhdHVzQ29kZTogJzIwMCcsXG4gICAgICB9XSxcbiAgICAgIHBhc3N0aHJvdWdoQmVoYXZpb3I6IFBhc3N0aHJvdWdoQmVoYXZpb3IuTkVWRVIsXG4gICAgICByZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ3sgXCJzdGF0dXNDb2RlXCI6IDIwMCB9JyxcbiAgICAgIH0sXG4gICAgfSksIHtcbiAgICAgIG1ldGhvZFJlc3BvbnNlczogW3sgc3RhdHVzQ29kZTogJzIwMCcgfV0sXG4gICAgfSk7XG5cbiAgICB0aGlzLm1ldGhvZHMucHVzaChtZXRob2QpO1xuICB9XG59XG5cbmNsYXNzIEJvb2tzU3RhY2sgZXh0ZW5kcyBOZXN0ZWRTdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBtZXRob2RzOiBNZXRob2RbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIHByb3BzOiBSZXNvdXJjZU5lc3RlZFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgJ2ludGVnLXJlc3RhcGktaW1wb3J0LUJvb2tzU3RhY2snLCBwcm9wcyk7XG5cbiAgICBjb25zdCBhcGkgPSBSZXN0QXBpLmZyb21SZXN0QXBpQXR0cmlidXRlcyh0aGlzLCAnUmVzdEFwaScsIHtcbiAgICAgIHJlc3RBcGlJZDogcHJvcHMucmVzdEFwaUlkLFxuICAgICAgcm9vdFJlc291cmNlSWQ6IHByb3BzLnJvb3RSZXNvdXJjZUlkLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWV0aG9kID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2Jvb2tzJykuYWRkTWV0aG9kKCdHRVQnLCBuZXcgTW9ja0ludGVncmF0aW9uKHtcbiAgICAgIGludGVncmF0aW9uUmVzcG9uc2VzOiBbe1xuICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgIH1dLFxuICAgICAgcGFzc3Rocm91Z2hCZWhhdmlvcjogUGFzc3Rocm91Z2hCZWhhdmlvci5ORVZFUixcbiAgICAgIHJlcXVlc3RUZW1wbGF0ZXM6IHtcbiAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAneyBcInN0YXR1c0NvZGVcIjogMjAwIH0nLFxuICAgICAgfSxcbiAgICB9KSwge1xuICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbeyBzdGF0dXNDb2RlOiAnMjAwJyB9XSxcbiAgICB9KTtcblxuICAgIHRoaXMubWV0aG9kcy5wdXNoKG1ldGhvZCk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIERlcGxveVN0YWNrUHJvcHMgZXh0ZW5kcyBOZXN0ZWRTdGFja1Byb3BzIHtcbiAgcmVhZG9ubHkgcmVzdEFwaUlkOiBzdHJpbmc7XG5cbiAgcmVhZG9ubHkgbWV0aG9kcz86IE1ldGhvZFtdO1xufVxuXG5jbGFzcyBEZXBsb3lTdGFjayBleHRlbmRzIE5lc3RlZFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgcHJvcHM6IERlcGxveVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgJ2ludGVnLXJlc3RhcGktaW1wb3J0LURlcGxveVN0YWNrJywgcHJvcHMpO1xuXG4gICAgY29uc3QgZGVwbG95bWVudCA9IG5ldyBEZXBsb3ltZW50KHRoaXMsICdEZXBsb3ltZW50Jywge1xuICAgICAgYXBpOiBSZXN0QXBpLmZyb21SZXN0QXBpSWQodGhpcywgJ1Jlc3RBcGknLCBwcm9wcy5yZXN0QXBpSWQpLFxuICAgIH0pO1xuICAgIGlmIChwcm9wcy5tZXRob2RzKSB7XG4gICAgICBmb3IgKGNvbnN0IG1ldGhvZCBvZiBwcm9wcy5tZXRob2RzKSB7XG4gICAgICAgIGRlcGxveW1lbnQubm9kZS5hZGREZXBlbmRlbmN5KG1ldGhvZCk7XG4gICAgICB9XG4gICAgfVxuICAgIG5ldyBTdGFnZSh0aGlzLCAnU3RhZ2UnLCB7IGRlcGxveW1lbnQgfSk7XG4gIH1cbn1cblxubmV3IFJvb3RTdGFjayhuZXcgQXBwKCkpO1xuIl19