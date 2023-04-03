"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event, _context = {}) => {
    const authToken = event.authorizationToken;
    console.log(`event.authorizationToken = ${authToken}`);
    if (authToken === 'allow' || authToken === 'deny') {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFeEIsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQVUsRUFBRSxXQUFnQixFQUFFLEVBQWdCLEVBQUU7SUFDNUUsTUFBTSxTQUFTLEdBQVcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO0lBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDdkQsSUFBSSxTQUFTLEtBQUssT0FBTyxJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUU7UUFDakQsT0FBTztZQUNMLFdBQVcsRUFBRSxNQUFNO1lBQ25CLGNBQWMsRUFBRTtnQkFDZCxPQUFPLEVBQUUsWUFBWTtnQkFDckIsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE1BQU0sRUFBRSxvQkFBb0I7d0JBQzVCLE1BQU0sRUFBRSxTQUFTO3dCQUNqQixRQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVM7cUJBQzFCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDO0tBQ0g7U0FBTTtRQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDakM7QUFDSCxDQUFDLENBQUM7QUFwQlcsUUFBQSxPQUFPLFdBb0JsQiIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cblxuZXhwb3J0IGNvbnN0IGhhbmRsZXIgPSBhc3luYyAoZXZlbnQ6IGFueSwgX2NvbnRleHQ6IGFueSA9IHt9KTogUHJvbWlzZTxhbnk+ID0+IHtcbiAgY29uc3QgYXV0aFRva2VuOiBzdHJpbmcgPSBldmVudC5hdXRob3JpemF0aW9uVG9rZW47XG4gIGNvbnNvbGUubG9nKGBldmVudC5hdXRob3JpemF0aW9uVG9rZW4gPSAke2F1dGhUb2tlbn1gKTtcbiAgaWYgKGF1dGhUb2tlbiA9PT0gJ2FsbG93JyB8fCBhdXRoVG9rZW4gPT09ICdkZW55Jykge1xuICAgIHJldHVybiB7XG4gICAgICBwcmluY2lwYWxJZDogJ3VzZXInLFxuICAgICAgcG9saWN5RG9jdW1lbnQ6IHtcbiAgICAgICAgVmVyc2lvbjogJzIwMTItMTAtMTcnLFxuICAgICAgICBTdGF0ZW1lbnQ6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBBY3Rpb246ICdleGVjdXRlLWFwaTpJbnZva2UnLFxuICAgICAgICAgICAgRWZmZWN0OiBhdXRoVG9rZW4sXG4gICAgICAgICAgICBSZXNvdXJjZTogZXZlbnQubWV0aG9kQXJuLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVbmF1dGhvcml6ZWQnKTtcbiAgfVxufTtcbiJdfQ==