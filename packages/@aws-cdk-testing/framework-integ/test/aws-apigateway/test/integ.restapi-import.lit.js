"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
/**
 * This file showcases how to split up a RestApi's Resources and Methods across nested stacks.
 *
 * The root stack 'RootStack' first defines a RestApi.
 * Two nested stacks BooksStack and PetsStack, create corresponding Resources '/books' and '/pets'.
 * They are then deployed to a 'prod' Stage via a third nested stack - DeployStack.
 *
 * To verify this worked, go to the APIGateway
 */
class RootStack extends aws_cdk_lib_1.Stack {
    constructor(scope) {
        super(scope, 'integ-restapi-import-RootStack');
        const restApi = new aws_apigateway_1.RestApi(this, 'RestApi', {
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
        new aws_cdk_lib_1.CfnOutput(this, 'PetsURL', {
            value: `https://${restApi.restApiId}.execute-api.${this.region}.amazonaws.com/prod/pets`,
        });
        new aws_cdk_lib_1.CfnOutput(this, 'BooksURL', {
            value: `https://${restApi.restApiId}.execute-api.${this.region}.amazonaws.com/prod/books`,
        });
    }
}
class PetsStack extends aws_cdk_lib_1.NestedStack {
    constructor(scope, props) {
        super(scope, 'integ-restapi-import-PetsStack', props);
        this.methods = [];
        const api = aws_apigateway_1.RestApi.fromRestApiAttributes(this, 'RestApi', {
            restApiId: props.restApiId,
            rootResourceId: props.rootResourceId,
        });
        const method = api.root.addResource('pets').addMethod('GET', new aws_apigateway_1.MockIntegration({
            integrationResponses: [{
                    statusCode: '200',
                }],
            passthroughBehavior: aws_apigateway_1.PassthroughBehavior.NEVER,
            requestTemplates: {
                'application/json': '{ "statusCode": 200 }',
            },
        }), {
            methodResponses: [{ statusCode: '200' }],
        });
        this.methods.push(method);
    }
}
class BooksStack extends aws_cdk_lib_1.NestedStack {
    constructor(scope, props) {
        super(scope, 'integ-restapi-import-BooksStack', props);
        this.methods = [];
        const api = aws_apigateway_1.RestApi.fromRestApiAttributes(this, 'RestApi', {
            restApiId: props.restApiId,
            rootResourceId: props.rootResourceId,
        });
        const method = api.root.addResource('books').addMethod('GET', new aws_apigateway_1.MockIntegration({
            integrationResponses: [{
                    statusCode: '200',
                }],
            passthroughBehavior: aws_apigateway_1.PassthroughBehavior.NEVER,
            requestTemplates: {
                'application/json': '{ "statusCode": 200 }',
            },
        }), {
            methodResponses: [{ statusCode: '200' }],
        });
        this.methods.push(method);
    }
}
class DeployStack extends aws_cdk_lib_1.NestedStack {
    constructor(scope, props) {
        super(scope, 'integ-restapi-import-DeployStack', props);
        const deployment = new aws_apigateway_1.Deployment(this, 'Deployment', {
            api: aws_apigateway_1.RestApi.fromRestApiId(this, 'RestApi', props.restApiId),
        });
        if (props.methods) {
            for (const method of props.methods) {
                deployment.node.addDependency(method);
            }
        }
        new aws_apigateway_1.Stage(this, 'Stage', { deployment });
    }
}
new RootStack(new aws_cdk_lib_1.App());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVzdGFwaS1pbXBvcnQubGl0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcucmVzdGFwaS1pbXBvcnQubGl0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkNBQW1GO0FBRW5GLCtEQUFzSDtBQUV0SDs7Ozs7Ozs7R0FRRztBQUVILE1BQU0sU0FBVSxTQUFRLG1CQUFLO0lBQzNCLFlBQVksS0FBZ0I7UUFDMUIsS0FBSyxDQUFDLEtBQUssRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO1FBRS9DLE1BQU0sT0FBTyxHQUFHLElBQUksd0JBQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQzNDLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLE1BQU0sRUFBRSxLQUFLO1NBQ2QsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFOUIsTUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFO1lBQ3BDLFNBQVMsRUFBRSxPQUFPLENBQUMsU0FBUztZQUM1QixjQUFjLEVBQUUsT0FBTyxDQUFDLHFCQUFxQjtTQUM5QyxDQUFDLENBQUM7UUFDSCxNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDdEMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxTQUFTO1lBQzVCLGNBQWMsRUFBRSxPQUFPLENBQUMscUJBQXFCO1NBQzlDLENBQUMsQ0FBQztRQUNILElBQUksV0FBVyxDQUFDLElBQUksRUFBRTtZQUNwQixTQUFTLEVBQUUsT0FBTyxDQUFDLFNBQVM7WUFDNUIsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUM7U0FDdEQsQ0FBQyxDQUFDO1FBRUgsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDN0IsS0FBSyxFQUFFLFdBQVcsT0FBTyxDQUFDLFNBQVMsZ0JB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S0FBSyxNQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxFQUFFO2dCQUNsQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUN2QztTQUNGO1FBQ0QsSUFBSSxzQkFBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7Q0FDRjtBQUVELElBQUksU0FBUyxDQUFDLElBQUksaUJBQUcsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHAsIENmbk91dHB1dCwgTmVzdGVkU3RhY2ssIE5lc3RlZFN0YWNrUHJvcHMsIFN0YWNrIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBEZXBsb3ltZW50LCBNZXRob2QsIE1vY2tJbnRlZ3JhdGlvbiwgUGFzc3Rocm91Z2hCZWhhdmlvciwgUmVzdEFwaSwgU3RhZ2UgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5cbi8qKlxuICogVGhpcyBmaWxlIHNob3djYXNlcyBob3cgdG8gc3BsaXQgdXAgYSBSZXN0QXBpJ3MgUmVzb3VyY2VzIGFuZCBNZXRob2RzIGFjcm9zcyBuZXN0ZWQgc3RhY2tzLlxuICpcbiAqIFRoZSByb290IHN0YWNrICdSb290U3RhY2snIGZpcnN0IGRlZmluZXMgYSBSZXN0QXBpLlxuICogVHdvIG5lc3RlZCBzdGFja3MgQm9va3NTdGFjayBhbmQgUGV0c1N0YWNrLCBjcmVhdGUgY29ycmVzcG9uZGluZyBSZXNvdXJjZXMgJy9ib29rcycgYW5kICcvcGV0cycuXG4gKiBUaGV5IGFyZSB0aGVuIGRlcGxveWVkIHRvIGEgJ3Byb2QnIFN0YWdlIHZpYSBhIHRoaXJkIG5lc3RlZCBzdGFjayAtIERlcGxveVN0YWNrLlxuICpcbiAqIFRvIHZlcmlmeSB0aGlzIHdvcmtlZCwgZ28gdG8gdGhlIEFQSUdhdGV3YXlcbiAqL1xuXG5jbGFzcyBSb290U3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QpIHtcbiAgICBzdXBlcihzY29wZSwgJ2ludGVnLXJlc3RhcGktaW1wb3J0LVJvb3RTdGFjaycpO1xuXG4gICAgY29uc3QgcmVzdEFwaSA9IG5ldyBSZXN0QXBpKHRoaXMsICdSZXN0QXBpJywge1xuICAgICAgY2xvdWRXYXRjaFJvbGU6IHRydWUsXG4gICAgICBkZXBsb3k6IGZhbHNlLFxuICAgIH0pO1xuICAgIHJlc3RBcGkucm9vdC5hZGRNZXRob2QoJ0FOWScpO1xuXG4gICAgY29uc3QgcGV0c1N0YWNrID0gbmV3IFBldHNTdGFjayh0aGlzLCB7XG4gICAgICByZXN0QXBpSWQ6IHJlc3RBcGkucmVzdEFwaUlkLFxuICAgICAgcm9vdFJlc291cmNlSWQ6IHJlc3RBcGkucmVzdEFwaVJvb3RSZXNvdXJjZUlkLFxuICAgIH0pO1xuICAgIGNvbnN0IGJvb2tzU3RhY2sgPSBuZXcgQm9va3NTdGFjayh0aGlzLCB7XG4gICAgICByZXN0QXBpSWQ6IHJlc3RBcGkucmVzdEFwaUlkLFxuICAgICAgcm9vdFJlc291cmNlSWQ6IHJlc3RBcGkucmVzdEFwaVJvb3RSZXNvdXJjZUlkLFxuICAgIH0pO1xuICAgIG5ldyBEZXBsb3lTdGFjayh0aGlzLCB7XG4gICAgICByZXN0QXBpSWQ6IHJlc3RBcGkucmVzdEFwaUlkLFxuICAgICAgbWV0aG9kczogcGV0c1N0YWNrLm1ldGhvZHMuY29uY2F0KGJvb2tzU3RhY2subWV0aG9kcyksXG4gICAgfSk7XG5cbiAgICBuZXcgQ2ZuT3V0cHV0KHRoaXMsICdQZXRzVVJMJywge1xuICAgICAgdmFsdWU6IGBodHRwczovLyR7cmVzdEFwaS5yZXN0QXBpSWR9LmV4ZWN1dGUtYXBpLiR7dGhpcy5yZWdpb259LmFtYXpvbmF3cy5jb20vcHJvZC9wZXRzYCxcbiAgICB9KTtcblxuICAgIG5ldyBDZm5PdXRwdXQodGhpcywgJ0Jvb2tzVVJMJywge1xuICAgICAgdmFsdWU6IGBodHRwczovLyR7cmVzdEFwaS5yZXN0QXBpSWR9LmV4ZWN1dGUtYXBpLiR7dGhpcy5yZWdpb259LmFtYXpvbmF3cy5jb20vcHJvZC9ib29rc2AsXG4gICAgfSk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFJlc291cmNlTmVzdGVkU3RhY2tQcm9wcyBleHRlbmRzIE5lc3RlZFN0YWNrUHJvcHMge1xuICByZWFkb25seSByZXN0QXBpSWQ6IHN0cmluZztcblxuICByZWFkb25seSByb290UmVzb3VyY2VJZDogc3RyaW5nO1xufVxuXG5jbGFzcyBQZXRzU3RhY2sgZXh0ZW5kcyBOZXN0ZWRTdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBtZXRob2RzOiBNZXRob2RbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIHByb3BzOiBSZXNvdXJjZU5lc3RlZFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgJ2ludGVnLXJlc3RhcGktaW1wb3J0LVBldHNTdGFjaycsIHByb3BzKTtcblxuICAgIGNvbnN0IGFwaSA9IFJlc3RBcGkuZnJvbVJlc3RBcGlBdHRyaWJ1dGVzKHRoaXMsICdSZXN0QXBpJywge1xuICAgICAgcmVzdEFwaUlkOiBwcm9wcy5yZXN0QXBpSWQsXG4gICAgICByb290UmVzb3VyY2VJZDogcHJvcHMucm9vdFJlc291cmNlSWQsXG4gICAgfSk7XG5cbiAgICBjb25zdCBtZXRob2QgPSBhcGkucm9vdC5hZGRSZXNvdXJjZSgncGV0cycpLmFkZE1ldGhvZCgnR0VUJywgbmV3IE1vY2tJbnRlZ3JhdGlvbih7XG4gICAgICBpbnRlZ3JhdGlvblJlc3BvbnNlczogW3tcbiAgICAgICAgc3RhdHVzQ29kZTogJzIwMCcsXG4gICAgICB9XSxcbiAgICAgIHBhc3N0aHJvdWdoQmVoYXZpb3I6IFBhc3N0aHJvdWdoQmVoYXZpb3IuTkVWRVIsXG4gICAgICByZXF1ZXN0VGVtcGxhdGVzOiB7XG4gICAgICAgICdhcHBsaWNhdGlvbi9qc29uJzogJ3sgXCJzdGF0dXNDb2RlXCI6IDIwMCB9JyxcbiAgICAgIH0sXG4gICAgfSksIHtcbiAgICAgIG1ldGhvZFJlc3BvbnNlczogW3sgc3RhdHVzQ29kZTogJzIwMCcgfV0sXG4gICAgfSk7XG5cbiAgICB0aGlzLm1ldGhvZHMucHVzaChtZXRob2QpO1xuICB9XG59XG5cbmNsYXNzIEJvb2tzU3RhY2sgZXh0ZW5kcyBOZXN0ZWRTdGFjayB7XG4gIHB1YmxpYyByZWFkb25seSBtZXRob2RzOiBNZXRob2RbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIHByb3BzOiBSZXNvdXJjZU5lc3RlZFN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgJ2ludGVnLXJlc3RhcGktaW1wb3J0LUJvb2tzU3RhY2snLCBwcm9wcyk7XG5cbiAgICBjb25zdCBhcGkgPSBSZXN0QXBpLmZyb21SZXN0QXBpQXR0cmlidXRlcyh0aGlzLCAnUmVzdEFwaScsIHtcbiAgICAgIHJlc3RBcGlJZDogcHJvcHMucmVzdEFwaUlkLFxuICAgICAgcm9vdFJlc291cmNlSWQ6IHByb3BzLnJvb3RSZXNvdXJjZUlkLFxuICAgIH0pO1xuXG4gICAgY29uc3QgbWV0aG9kID0gYXBpLnJvb3QuYWRkUmVzb3VyY2UoJ2Jvb2tzJykuYWRkTWV0aG9kKCdHRVQnLCBuZXcgTW9ja0ludGVncmF0aW9uKHtcbiAgICAgIGludGVncmF0aW9uUmVzcG9uc2VzOiBbe1xuICAgICAgICBzdGF0dXNDb2RlOiAnMjAwJyxcbiAgICAgIH1dLFxuICAgICAgcGFzc3Rocm91Z2hCZWhhdmlvcjogUGFzc3Rocm91Z2hCZWhhdmlvci5ORVZFUixcbiAgICAgIHJlcXVlc3RUZW1wbGF0ZXM6IHtcbiAgICAgICAgJ2FwcGxpY2F0aW9uL2pzb24nOiAneyBcInN0YXR1c0NvZGVcIjogMjAwIH0nLFxuICAgICAgfSxcbiAgICB9KSwge1xuICAgICAgbWV0aG9kUmVzcG9uc2VzOiBbeyBzdGF0dXNDb2RlOiAnMjAwJyB9XSxcbiAgICB9KTtcblxuICAgIHRoaXMubWV0aG9kcy5wdXNoKG1ldGhvZCk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIERlcGxveVN0YWNrUHJvcHMgZXh0ZW5kcyBOZXN0ZWRTdGFja1Byb3BzIHtcbiAgcmVhZG9ubHkgcmVzdEFwaUlkOiBzdHJpbmc7XG5cbiAgcmVhZG9ubHkgbWV0aG9kcz86IE1ldGhvZFtdO1xufVxuXG5jbGFzcyBEZXBsb3lTdGFjayBleHRlbmRzIE5lc3RlZFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgcHJvcHM6IERlcGxveVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgJ2ludGVnLXJlc3RhcGktaW1wb3J0LURlcGxveVN0YWNrJywgcHJvcHMpO1xuXG4gICAgY29uc3QgZGVwbG95bWVudCA9IG5ldyBEZXBsb3ltZW50KHRoaXMsICdEZXBsb3ltZW50Jywge1xuICAgICAgYXBpOiBSZXN0QXBpLmZyb21SZXN0QXBpSWQodGhpcywgJ1Jlc3RBcGknLCBwcm9wcy5yZXN0QXBpSWQpLFxuICAgIH0pO1xuICAgIGlmIChwcm9wcy5tZXRob2RzKSB7XG4gICAgICBmb3IgKGNvbnN0IG1ldGhvZCBvZiBwcm9wcy5tZXRob2RzKSB7XG4gICAgICAgIGRlcGxveW1lbnQubm9kZS5hZGREZXBlbmRlbmN5KG1ldGhvZCk7XG4gICAgICB9XG4gICAgfVxuICAgIG5ldyBTdGFnZSh0aGlzLCAnU3RhZ2UnLCB7IGRlcGxveW1lbnQgfSk7XG4gIH1cbn1cblxubmV3IFJvb3RTdGFjayhuZXcgQXBwKCkpO1xuIl19