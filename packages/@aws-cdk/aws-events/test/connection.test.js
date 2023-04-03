"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assertions_1 = require("@aws-cdk/assertions");
const core_1 = require("@aws-cdk/core");
const events = require("../lib");
test('basic connection', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new events.Connection(stack, 'Connection', {
        authorization: events.Authorization.basic('username', core_1.SecretValue.unsafePlainText('password')),
        connectionName: 'testConnection',
        description: 'ConnectionDescription',
    });
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    template.hasResourceProperties('AWS::Events::Connection', {
        AuthorizationType: 'BASIC',
        AuthParameters: {
            BasicAuthParameters: {
                Password: 'password',
                Username: 'username',
            },
        },
        Name: 'testConnection',
        Description: 'ConnectionDescription',
    });
});
test('API key connection', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new events.Connection(stack, 'Connection', {
        authorization: events.Authorization.apiKey('keyname', core_1.SecretValue.unsafePlainText('keyvalue')),
    });
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    template.hasResourceProperties('AWS::Events::Connection', {
        AuthorizationType: 'API_KEY',
        AuthParameters: {
            ApiKeyAuthParameters: {
                ApiKeyName: 'keyname',
                ApiKeyValue: 'keyvalue',
            },
        },
    });
});
test('oauth connection', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new events.Connection(stack, 'Connection', {
        authorization: events.Authorization.oauth({
            authorizationEndpoint: 'authorizationEndpoint',
            clientId: 'clientID',
            clientSecret: core_1.SecretValue.unsafePlainText('clientSecret'),
            httpMethod: events.HttpMethod.GET,
            headerParameters: {
                oAuthHeaderKey: events.HttpParameter.fromString('oAuthHeaderValue'),
            },
        }),
        headerParameters: {
            invocationHeaderKey: events.HttpParameter.fromString('invocationHeaderValue'),
        },
        connectionName: 'testConnection',
        description: 'ConnectionDescription',
    });
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    template.hasResourceProperties('AWS::Events::Connection', {
        AuthorizationType: 'OAUTH_CLIENT_CREDENTIALS',
        AuthParameters: {
            OAuthParameters: {
                AuthorizationEndpoint: 'authorizationEndpoint',
                ClientParameters: {
                    ClientID: 'clientID',
                    ClientSecret: 'clientSecret',
                },
                HttpMethod: 'GET',
                OAuthHttpParameters: {
                    HeaderParameters: [{
                            Key: 'oAuthHeaderKey',
                            Value: 'oAuthHeaderValue',
                            IsValueSecret: false,
                        }],
                },
            },
            InvocationHttpParameters: {
                HeaderParameters: [{
                        Key: 'invocationHeaderKey',
                        Value: 'invocationHeaderValue',
                    }],
            },
        },
        Name: 'testConnection',
        Description: 'ConnectionDescription',
    });
});
test('Additional plaintext headers', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new events.Connection(stack, 'Connection', {
        authorization: events.Authorization.apiKey('keyname', core_1.SecretValue.unsafePlainText('keyvalue')),
        headerParameters: {
            'content-type': events.HttpParameter.fromString('application/json'),
        },
    });
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    template.hasResourceProperties('AWS::Events::Connection', {
        AuthParameters: {
            InvocationHttpParameters: {
                HeaderParameters: [{
                        Key: 'content-type',
                        Value: 'application/json',
                        IsValueSecret: false,
                    }],
            },
        },
    });
});
test('Additional secret headers', () => {
    // GIVEN
    const stack = new core_1.Stack();
    // WHEN
    new events.Connection(stack, 'Connection', {
        authorization: events.Authorization.apiKey('keyname', core_1.SecretValue.unsafePlainText('keyvalue')),
        headerParameters: {
            'client-secret': events.HttpParameter.fromSecret(core_1.SecretValue.unsafePlainText('apiSecret')),
        },
    });
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    template.hasResourceProperties('AWS::Events::Connection', {
        AuthParameters: {
            InvocationHttpParameters: {
                HeaderParameters: [{
                        Key: 'client-secret',
                        Value: 'apiSecret',
                        IsValueSecret: true,
                    }],
            },
        },
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29ubmVjdGlvbi50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsb0RBQStDO0FBQy9DLHdDQUFtRDtBQUNuRCxpQ0FBaUM7QUFFakMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRTtJQUM1QixRQUFRO0lBQ1IsTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFLLEVBQUUsQ0FBQztJQUUxQixPQUFPO0lBQ1AsSUFBSSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUU7UUFDekMsYUFBYSxFQUFFLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxrQkFBVyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5RixjQUFjLEVBQUUsZ0JBQWdCO1FBQ2hDLFdBQVcsRUFBRSx1QkFBdUI7S0FDckMsQ0FBQyxDQUFDO0lBRUgsT0FBTztJQUNQLE1BQU0sUUFBUSxHQUFHLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyx5QkFBeUIsRUFBRTtRQUN4RCxpQkFBaUIsRUFBRSxPQUFPO1FBQzFCLGNBQWMsRUFBRTtZQUNkLG1CQUFtQixFQUFFO2dCQUNuQixRQUFRLEVBQUUsVUFBVTtnQkFDcEIsUUFBUSxFQUFFLFVBQVU7YUFDckI7U0FDRjtRQUNELElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsV0FBVyxFQUFFLHVCQUF1QjtLQUNyQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUU7SUFDOUIsUUFBUTtJQUNSLE1BQU0sS0FBSyxHQUFHLElBQUksWUFBSyxFQUFFLENBQUM7SUFFMUIsT0FBTztJQUNQLElBQUksTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsWUFBWSxF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QUFFLGVBQWU7d0JBQ3BCLEtBQUssRUFBRSxXQUFXO3dCQUNsQixhQUFhLEVBQUUsSUFBSTtxQkFDcEIsQ0FBQzthQUNIO1NBQ0Y7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRlbXBsYXRlIH0gZnJvbSAnQGF3cy1jZGsvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgeyBTZWNyZXRWYWx1ZSwgU3RhY2sgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICcuLi9saWInO1xuXG50ZXN0KCdiYXNpYyBjb25uZWN0aW9uJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IGV2ZW50cy5Db25uZWN0aW9uKHN0YWNrLCAnQ29ubmVjdGlvbicsIHtcbiAgICBhdXRob3JpemF0aW9uOiBldmVudHMuQXV0aG9yaXphdGlvbi5iYXNpYygndXNlcm5hbWUnLCBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ3Bhc3N3b3JkJykpLFxuICAgIGNvbm5lY3Rpb25OYW1lOiAndGVzdENvbm5lY3Rpb24nLFxuICAgIGRlc2NyaXB0aW9uOiAnQ29ubmVjdGlvbkRlc2NyaXB0aW9uJyxcbiAgfSk7XG5cbiAgLy8gVEhFTlxuICBjb25zdCB0ZW1wbGF0ZSA9IFRlbXBsYXRlLmZyb21TdGFjayhzdGFjayk7XG4gIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpFdmVudHM6OkNvbm5lY3Rpb24nLCB7XG4gICAgQXV0aG9yaXphdGlvblR5cGU6ICdCQVNJQycsXG4gICAgQXV0aFBhcmFtZXRlcnM6IHtcbiAgICAgIEJhc2ljQXV0aFBhcmFtZXRlcnM6IHtcbiAgICAgICAgUGFzc3dvcmQ6ICdwYXNzd29yZCcsXG4gICAgICAgIFVzZXJuYW1lOiAndXNlcm5hbWUnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIE5hbWU6ICd0ZXN0Q29ubmVjdGlvbicsXG4gICAgRGVzY3JpcHRpb246ICdDb25uZWN0aW9uRGVzY3JpcHRpb24nLFxuICB9KTtcbn0pO1xuXG50ZXN0KCdBUEkga2V5IGNvbm5lY3Rpb24nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgZXZlbnRzLkNvbm5lY3Rpb24oc3RhY2ssICdDb25uZWN0aW9uJywge1xuICAgIGF1dGhvcml6YXRpb246IGV2ZW50cy5BdXRob3JpemF0aW9uLmFwaUtleSgna2V5bmFtZScsIFNlY3JldFZhbHVlLnVuc2FmZVBsYWluVGV4dCgna2V5dmFsdWUnKSksXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpDb25uZWN0aW9uJywge1xuICAgIEF1dGhvcml6YXRpb25UeXBlOiAnQVBJX0tFWScsXG4gICAgQXV0aFBhcmFtZXRlcnM6IHtcbiAgICAgIEFwaUtleUF1dGhQYXJhbWV0ZXJzOiB7XG4gICAgICAgIEFwaUtleU5hbWU6ICdrZXluYW1lJyxcbiAgICAgICAgQXBpS2V5VmFsdWU6ICdrZXl2YWx1ZScsXG4gICAgICB9LFxuICAgIH0sXG4gIH0pO1xufSk7XG5cbnRlc3QoJ29hdXRoIGNvbm5lY3Rpb24nLCAoKSA9PiB7XG4gIC8vIEdJVkVOXG4gIGNvbnN0IHN0YWNrID0gbmV3IFN0YWNrKCk7XG5cbiAgLy8gV0hFTlxuICBuZXcgZXZlbnRzLkNvbm5lY3Rpb24oc3RhY2ssICdDb25uZWN0aW9uJywge1xuICAgIGF1dGhvcml6YXRpb246IGV2ZW50cy5BdXRob3JpemF0aW9uLm9hdXRoKHtcbiAgICAgIGF1dGhvcml6YXRpb25FbmRwb2ludDogJ2F1dGhvcml6YXRpb25FbmRwb2ludCcsXG4gICAgICBjbGllbnRJZDogJ2NsaWVudElEJyxcbiAgICAgIGNsaWVudFNlY3JldDogU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCdjbGllbnRTZWNyZXQnKSxcbiAgICAgIGh0dHBNZXRob2Q6IGV2ZW50cy5IdHRwTWV0aG9kLkdFVCxcbiAgICAgIGhlYWRlclBhcmFtZXRlcnM6IHtcbiAgICAgICAgb0F1dGhIZWFkZXJLZXk6IGV2ZW50cy5IdHRwUGFyYW1ldGVyLmZyb21TdHJpbmcoJ29BdXRoSGVhZGVyVmFsdWUnKSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgaGVhZGVyUGFyYW1ldGVyczoge1xuICAgICAgaW52b2NhdGlvbkhlYWRlcktleTogZXZlbnRzLkh0dHBQYXJhbWV0ZXIuZnJvbVN0cmluZygnaW52b2NhdGlvbkhlYWRlclZhbHVlJyksXG4gICAgfSxcbiAgICBjb25uZWN0aW9uTmFtZTogJ3Rlc3RDb25uZWN0aW9uJyxcbiAgICBkZXNjcmlwdGlvbjogJ0Nvbm5lY3Rpb25EZXNjcmlwdGlvbicsXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpDb25uZWN0aW9uJywge1xuICAgIEF1dGhvcml6YXRpb25UeXBlOiAnT0FVVEhfQ0xJRU5UX0NSRURFTlRJQUxTJyxcbiAgICBBdXRoUGFyYW1ldGVyczoge1xuICAgICAgT0F1dGhQYXJhbWV0ZXJzOiB7XG4gICAgICAgIEF1dGhvcml6YXRpb25FbmRwb2ludDogJ2F1dGhvcml6YXRpb25FbmRwb2ludCcsXG4gICAgICAgIENsaWVudFBhcmFtZXRlcnM6IHtcbiAgICAgICAgICBDbGllbnRJRDogJ2NsaWVudElEJyxcbiAgICAgICAgICBDbGllbnRTZWNyZXQ6ICdjbGllbnRTZWNyZXQnLFxuICAgICAgICB9LFxuICAgICAgICBIdHRwTWV0aG9kOiAnR0VUJyxcbiAgICAgICAgT0F1dGhIdHRwUGFyYW1ldGVyczoge1xuICAgICAgICAgIEhlYWRlclBhcmFtZXRlcnM6IFt7XG4gICAgICAgICAgICBLZXk6ICdvQXV0aEhlYWRlcktleScsXG4gICAgICAgICAgICBWYWx1ZTogJ29BdXRoSGVhZGVyVmFsdWUnLFxuICAgICAgICAgICAgSXNWYWx1ZVNlY3JldDogZmFsc2UsXG4gICAgICAgICAgfV0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgSW52b2NhdGlvbkh0dHBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIEhlYWRlclBhcmFtZXRlcnM6IFt7XG4gICAgICAgICAgS2V5OiAnaW52b2NhdGlvbkhlYWRlcktleScsXG4gICAgICAgICAgVmFsdWU6ICdpbnZvY2F0aW9uSGVhZGVyVmFsdWUnLFxuICAgICAgICB9XSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBOYW1lOiAndGVzdENvbm5lY3Rpb24nLFxuICAgIERlc2NyaXB0aW9uOiAnQ29ubmVjdGlvbkRlc2NyaXB0aW9uJyxcbiAgfSk7XG59KTtcblxudGVzdCgnQWRkaXRpb25hbCBwbGFpbnRleHQgaGVhZGVycycsICgpID0+IHtcbiAgLy8gR0lWRU5cbiAgY29uc3Qgc3RhY2sgPSBuZXcgU3RhY2soKTtcblxuICAvLyBXSEVOXG4gIG5ldyBldmVudHMuQ29ubmVjdGlvbihzdGFjaywgJ0Nvbm5lY3Rpb24nLCB7XG4gICAgYXV0aG9yaXphdGlvbjogZXZlbnRzLkF1dGhvcml6YXRpb24uYXBpS2V5KCdrZXluYW1lJywgU2VjcmV0VmFsdWUudW5zYWZlUGxhaW5UZXh0KCdrZXl2YWx1ZScpKSxcbiAgICBoZWFkZXJQYXJhbWV0ZXJzOiB7XG4gICAgICAnY29udGVudC10eXBlJzogZXZlbnRzLkh0dHBQYXJhbWV0ZXIuZnJvbVN0cmluZygnYXBwbGljYXRpb24vanNvbicpLFxuICAgIH0sXG4gIH0pO1xuXG4gIC8vIFRIRU5cbiAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuICB0ZW1wbGF0ZS5oYXNSZXNvdXJjZVByb3BlcnRpZXMoJ0FXUzo6RXZlbnRzOjpDb25uZWN0aW9uJywge1xuICAgIEF1dGhQYXJhbWV0ZXJzOiB7XG4gICAgICBJbnZvY2F0aW9uSHR0cFBhcmFtZXRlcnM6IHtcbiAgICAgICAgSGVhZGVyUGFyYW1ldGVyczogW3tcbiAgICAgICAgICBLZXk6ICdjb250ZW50LXR5cGUnLFxuICAgICAgICAgIFZhbHVlOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgSXNWYWx1ZVNlY3JldDogZmFsc2UsXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pO1xuXG50ZXN0KCdBZGRpdGlvbmFsIHNlY3JldCBoZWFkZXJzJywgKCkgPT4ge1xuICAvLyBHSVZFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTdGFjaygpO1xuXG4gIC8vIFdIRU5cbiAgbmV3IGV2ZW50cy5Db25uZWN0aW9uKHN0YWNrLCAnQ29ubmVjdGlvbicsIHtcbiAgICBhdXRob3JpemF0aW9uOiBldmVudHMuQXV0aG9yaXphdGlvbi5hcGlLZXkoJ2tleW5hbWUnLCBTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ2tleXZhbHVlJykpLFxuICAgIGhlYWRlclBhcmFtZXRlcnM6IHtcbiAgICAgICdjbGllbnQtc2VjcmV0JzogZXZlbnRzLkh0dHBQYXJhbWV0ZXIuZnJvbVNlY3JldChTZWNyZXRWYWx1ZS51bnNhZmVQbGFpblRleHQoJ2FwaVNlY3JldCcpKSxcbiAgICB9LFxuICB9KTtcblxuICAvLyBUSEVOXG4gIGNvbnN0IHRlbXBsYXRlID0gVGVtcGxhdGUuZnJvbVN0YWNrKHN0YWNrKTtcbiAgdGVtcGxhdGUuaGFzUmVzb3VyY2VQcm9wZXJ0aWVzKCdBV1M6OkV2ZW50czo6Q29ubmVjdGlvbicsIHtcbiAgICBBdXRoUGFyYW1ldGVyczoge1xuICAgICAgSW52b2NhdGlvbkh0dHBQYXJhbWV0ZXJzOiB7XG4gICAgICAgIEhlYWRlclBhcmFtZXRlcnM6IFt7XG4gICAgICAgICAgS2V5OiAnY2xpZW50LXNlY3JldCcsXG4gICAgICAgICAgVmFsdWU6ICdhcGlTZWNyZXQnLFxuICAgICAgICAgIElzVmFsdWVTZWNyZXQ6IHRydWUsXG4gICAgICAgIH1dLFxuICAgICAgfSxcbiAgICB9LFxuICB9KTtcbn0pOyJdfQ==