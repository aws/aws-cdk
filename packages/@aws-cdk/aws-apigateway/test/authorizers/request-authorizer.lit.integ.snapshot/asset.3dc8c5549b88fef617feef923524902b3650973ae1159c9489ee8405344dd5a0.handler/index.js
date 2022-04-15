"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
exports.handler = async (event, _context = {}) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFbEIsUUFBQSxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQVUsRUFBRSxXQUFnQixFQUFFLEVBQWdCLEVBQUU7SUFDNUUsTUFBTSxTQUFTLEdBQVcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7SUFDdEQsTUFBTSxlQUFlLEdBQVcsS0FBSyxDQUFDLHFCQUFxQixDQUFDLEtBQUssQ0FBQztJQUNsRSxPQUFPLENBQUMsR0FBRyxDQUFDLGlDQUFpQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQzFELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUNBQXVDLGVBQWUsRUFBRSxDQUFDLENBQUM7SUFDdEUsSUFBSSxDQUFDLFNBQVMsS0FBSyxPQUFPLElBQUksU0FBUyxLQUFLLE1BQU0sQ0FBQyxJQUFJLGVBQWUsS0FBSyxLQUFLLEVBQUU7UUFDaEYsT0FBTztZQUNMLFdBQVcsRUFBRSxNQUFNO1lBQ25CLGNBQWMsRUFBRTtnQkFDZCxPQUFPLEVBQUUsWUFBWTtnQkFDckIsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE1BQU0sRUFBRSxvQkFBb0I7d0JBQzVCLE1BQU0sRUFBRSxTQUFTO3dCQUNqQixRQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVM7cUJBQzFCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDO0tBQ0g7U0FBTTtRQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDakM7QUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIF9jb250ZXh0OiBhbnkgPSB7fSk6IFByb21pc2U8YW55PiA9PiB7XG4gIGNvbnN0IGF1dGhUb2tlbjogc3RyaW5nID0gZXZlbnQuaGVhZGVycy5BdXRob3JpemF0aW9uO1xuICBjb25zdCBhdXRoUXVlcnlTdHJpbmc6IHN0cmluZyA9IGV2ZW50LnF1ZXJ5U3RyaW5nUGFyYW1ldGVycy5hbGxvdztcbiAgY29uc29sZS5sb2coYGV2ZW50LmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICR7YXV0aFRva2VufWApO1xuICBjb25zb2xlLmxvZyhgZXZlbnQucXVlcnlTdHJpbmdQYXJhbWV0ZXJzLmFsbG93ID0gJHthdXRoUXVlcnlTdHJpbmd9YCk7XG4gIGlmICgoYXV0aFRva2VuID09PSAnYWxsb3cnIHx8IGF1dGhUb2tlbiA9PT0gJ2RlbnknKSAmJiBhdXRoUXVlcnlTdHJpbmcgPT09ICd5ZXMnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHByaW5jaXBhbElkOiAndXNlcicsXG4gICAgICBwb2xpY3lEb2N1bWVudDoge1xuICAgICAgICBWZXJzaW9uOiAnMjAxMi0xMC0xNycsXG4gICAgICAgIFN0YXRlbWVudDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIEFjdGlvbjogJ2V4ZWN1dGUtYXBpOkludm9rZScsXG4gICAgICAgICAgICBFZmZlY3Q6IGF1dGhUb2tlbixcbiAgICAgICAgICAgIFJlc291cmNlOiBldmVudC5tZXRob2RBcm4sXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYXV0aG9yaXplZCcpO1xuICB9XG59O1xuIl19