"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const events = require("../lib");
test('creates an api destination for an EventBus', () => {
    // GIVEN
    const stack = new core_1.Stack();
    const connection = new events.Connection(stack, 'Connection', {
        authorization: events.Authorization.basic('username', core_1.SecretValue.unsafePlainText('password')),
        connectionName: 'testConnection',
        description: 'ConnectionDescription',
    });
    // WHEN
    new events.ApiDestination(stack, 'ApiDestination', {
        apiDestinationName: 'ApiDestination',
        connection,
        description: 'ApiDestination',
        httpMethod: events.HttpMethod.GET,
        endpoint: 'someendpoint',
        rateLimitPerSecond: 60,
    });
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    template.hasResourceProperties('AWS::Events::ApiDestination', {
        ConnectionArn: { 'Fn::GetAtt': ['Connection07624BCD', 'Arn'] },
        Description: 'ApiDestination',
        HttpMethod: 'GET',
        InvocationEndpoint: 'someendpoint',
        InvocationRateLimitPerSecond: 60,
        Name: 'ApiDestination',
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWRlc3RpbmF0aW9uLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGktZGVzdGluYXRpb24udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG9EQUErQztBQUMvQyx3Q0FBbUQ7QUFDbkQsaUNBQWlDO0FBR2pDLElBQUksQ0FBQyw0Q0FBNEMsRUFBRSxHQUFHLEVBQUU7SUFDdEQsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFDMUIsTUFBTSxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7UUFDNUQsYUFBYSxFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxrQkFBVyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5RixjQUFjLEVBQUUsZ0JBQWdCO1FBQ2hDLFdBQVcsRUFBRSx1QkFBdUI7S0FDckMsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUU7UUFDakQsa0JBQWtCLEVBQUUsZ0JBQWdCO1FBQ3BDLFVBQVU7UUFDVixXQUFXLEVBQUUsZ0JBQWdCO1FBQzdCLFVBQVUsRUFBRSxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUc7UUFDakMsUUFBUSxFQUFFLGNBQWM7UUFDeEIsa0JBQWtCLEVBQUUsRUFBRTtLQUN2QixDQUFDLENBQUM7SUFFSCxPQUFPO0lBQ1AsTUFBTSxRQUFRLEdBQUcscUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDM0MsUUFBUSxDQUFDLHFCQUFxQixDQUFDLDZCQUE2QixFQUFFO1FBQzVELGFBQWEsRUFBRSxFQUFFLFlBQVksRUFBRSxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxFQUFFO1FBQzlELFdBQVcsRUFBRSxnQkFBZ0I7UUFDN0IsVUFBVSxFQUFFLEtBQUs7UUFDakIsa0JBQWtCLEVBQUUsY0FBYztRQUNsQyw0QkFBNEIsRUFBRSxFQUFFO1FBQ2hDLElBQUksRUFBRSxnQkFBZ0I7S0FDdkIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZW1wbGF0ZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydGlvbnMnO1xuaW1wb3J0IHsgU3RhY2ssIFNlY3JldFZhbHVlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBldmVudHMgZnJvbSAnLi4vbGliJztcblxuXG50ZXN0KCdjcmVhdGVzIGFuIGFwaSBkZXN0aW5hdGlvbiBmb3IgYW4gRXZlbnRCdXMnLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG4gIGNvbnN0IGNvbm5lY3Rpb24gPSBuZXcgZXZlbnRzLkNvbm5lY3Rpb24oc3RhY2ssICdDb25uZWN0aW9uJywge1xuICAgIGF1dGhvcml6YXRpb246IGV2ZW50cy5BdXRob3JpemF0aW9uLmJhc2ljKCd1c2VybmFtZScsIFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgncGFzc3dvcmQnKSksXG4gICAgY29ubmVjdGlvbk5hbWU6ICd0ZXN0Q29ubmVjdGlvbicsXG4gICAgZGVzY3JpcHRpb246ICdDb25uZWN0aW9uRGVzY3JpcHRpb24nLFxuICB9KTtcblxuICAvLyBXSEVOXG4gIG5ldyBldmVudHMuQXBpRGVzdGluYXRpb24oc3RhY2ssICdBcGlEZXN0aW5hdGlvbicsIHtcbiAgICBhcGlEZXN0aW5hdGlvbk5hbWU6ICdBcGlEZXN0aW5hdGlvbicsXG4gICAgY29ubmVjdGlvbixcbiAgICBkZXNjcmlwdGlvbjogJ0FwaURlc3RpbmF0aW9uJyxcbiAgICBodHRwTWV0aG9kOiBldmVudHMuSHR0cE1ldGhvZC5HRVQsXG4gICAgZW5kcG9pbnQ6ICdzb21lZW5kcG9pbnQnLFxuICAgIHJhdGVMaW1pdFBlclNlY29uZDogNjAsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpBcGlEZXN0aW5hdGlvbicsIHtcbiAgICBDb25uZWN0aW9uQXJuOiB7ICdGbjo6R2V0QXR0JzogWydDb25uZWN0aW9uMDc2MjRCQ0QnLCAnQXJuJ10gfSxcbiAgICBEZXNjcmlwdGlvbjogJ0FwaURlc3RpbmF0aW9uJyxcbiAgICBIdHRwTWV0aG9kOiAnR0VUJyxcbiAgICBJbnZvY2F0aW9uRW5kcG9pbnQ6ICdzb21lZW5kcG9pbnQnLFxuICAgIEludm9jYXRpb25SYXRlTGltaXRQZXJTZWNvbmQ6IDYwLFxuICAgIE5hbWU6ICdBcGlEZXN0aW5hdGlvbicsXG4gIH0pO1xufSk7XG4iXX0=