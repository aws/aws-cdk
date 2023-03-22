"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event, _context = {}) => {
    const authToken = event.headers.Authorization;
    const authQueryString = event.queryStringParameters.allow;
    console.log(`event.headers.Authorization = ${authToken}`);
    console.log(`event.queryStringParameters.allow = ${authQueryString}`);
    if ((authToken === 'allow' || authToken === 'deny') && authQueryString === 'yes') {
        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: authToken,
                        Resource: event.methodArn,
                    },
                ],
            },
        };
    }
    else {
        throw new Error('Unauthorized');
    }
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFeEIsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQVUsRUFBRSxXQUFnQixFQUFFLEVBQWdCLEVBQUU7SUFDNUUsTUFBTSxTQUFTLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDdEQsTUFBTSxlQUFlLEdBQVcsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQztJQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUNBQXVDLGVBQWUsRUFBRSxDQUFDLENBQUM7SUFDdEUsSUFBSSxDQUFDLFNBQVMsS0FBSyxPQUFPLElBQUksU0FBUyxLQUFLLE1BQU0sQ0FBQyxJQUFJLGVBQWUsS0FBSyxLQUFLLEVBQUU7UUFDaEYsT0FBTztZQUNMLFdBQVcsRUFBRSxNQUFNO1lBQ25CLGNBQWMsRUFBRTtnQkFDZCxPQUFPLEVBQUUsWUFBWTtnQkFDckIsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE1BQU0sRUFBRSxvQkFBb0I7d0JBQzVCLE1BQU0sRUFBRSxTQUFTO3dCQUNqQixRQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVM7cUJBQzFCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDO0tBQ0g7U0FBTTtRQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDakM7QUFDSCxDQUFDLENBQUM7QUF0QlcsUUFBQSxPQUFPLFdBc0JsQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwgX2NvbnRleHQ6IGFueSA9IHt9KTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgY29uc3QgYXV0aFRva2VuOiBzdHJpbmcgPSBldmVudC5oZWFkZXJzLkF1dGhvcml6YXRpb247XG4gIGNvbnN0IGF1dGhRdWVyeVN0cmluZzogc3RyaW5nID0gZXZlbnQucXVlcnlTdHJpbmdQYXJhbWV0ZXJzLmFsbG93O1xuICBjb25zb2xlLmxvZyhgZXZlbnQuaGVhZGVycy5BdXRob3JpemF0aW9uID0gJHthdXRoVG9rZW59YCk7XG4gIGNvbnNvbGUubG9nKGBldmVudC5xdWVyeVN0cmluZ1BhcmFtZXRlcnMuYWxsb3cgPSAke2F1dGhRdWVyeVN0cmluZ31gKTtcbiAgaWYgKChhdXRoVG9rZW4gPT09ICdhbGxvdycgfHwgYXV0aFRva2VuID09PSAnZGVueScpICYmIGF1dGhRdWVyeVN0cmluZyA9PT0gJ3llcycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJpbmNpcGFsSWQ6ICd1c2VyJyxcbiAgICAgIHBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnZXhlY3V0ZS1hcGk6SW52b2tlJyxcbiAgICAgICAgICAgIEVmZmVjdDogYXV0aFRva2VuLFxuICAgICAgICAgICAgUmVzb3VyY2U6IGV2ZW50Lm1ldGhvZEFybixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5hdXRob3JpemVkJyk7XG4gIH1cbn07XG4iXX0=