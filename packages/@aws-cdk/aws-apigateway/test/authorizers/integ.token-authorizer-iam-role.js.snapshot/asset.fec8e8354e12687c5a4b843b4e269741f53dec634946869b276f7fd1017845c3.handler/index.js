"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
exports.handler = async (event, _context = {}) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsK0JBQStCOzs7QUFFbEIsUUFBQSxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQVUsRUFBRSxXQUFnQixFQUFFLEVBQWdCLEVBQUU7SUFDNUUsTUFBTSxTQUFTLEdBQVcsS0FBSyxDQUFDLGtCQUFrQixDQUFDO0lBQ25ELE9BQU8sQ0FBQyxHQUFHLENBQUMsOEJBQThCLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDdkQsSUFBSSxTQUFTLEtBQUssT0FBTyxJQUFJLFNBQVMsS0FBSyxNQUFNLEVBQUU7UUFDakQsT0FBTztZQUNMLFdBQVcsRUFBRSxNQUFNO1lBQ25CLGNBQWMsRUFBRTtnQkFDZCxPQUFPLEVBQUUsWUFBWTtnQkFDckIsU0FBUyxFQUFFO29CQUNUO3dCQUNFLE1BQU0sRUFBRSxvQkFBb0I7d0JBQzVCLE1BQU0sRUFBRSxTQUFTO3dCQUNqQixRQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVM7cUJBQzFCO2lCQUNGO2FBQ0Y7U0FDRixDQUFDO0tBQ0g7U0FBTTtRQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7S0FDakM7QUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5cbmV4cG9ydCBjb25zdCBoYW5kbGVyID0gYXN5bmMgKGV2ZW50OiBhbnksIF9jb250ZXh0OiBhbnkgPSB7fSk6IFByb21pc2U8YW55PiA9PiB7XG4gIGNvbnN0IGF1dGhUb2tlbjogc3RyaW5nID0gZXZlbnQuYXV0aG9yaXphdGlvblRva2VuO1xuICBjb25zb2xlLmxvZyhgZXZlbnQuYXV0aG9yaXphdGlvblRva2VuID0gJHthdXRoVG9rZW59YCk7XG4gIGlmIChhdXRoVG9rZW4gPT09ICdhbGxvdycgfHwgYXV0aFRva2VuID09PSAnZGVueScpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcHJpbmNpcGFsSWQ6ICd1c2VyJyxcbiAgICAgIHBvbGljeURvY3VtZW50OiB7XG4gICAgICAgIFZlcnNpb246ICcyMDEyLTEwLTE3JyxcbiAgICAgICAgU3RhdGVtZW50OiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgQWN0aW9uOiAnZXhlY3V0ZS1hcGk6SW52b2tlJyxcbiAgICAgICAgICAgIEVmZmVjdDogYXV0aFRva2VuLFxuICAgICAgICAgICAgUmVzb3VyY2U6IGV2ZW50Lm1ldGhvZEFybixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9O1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5hdXRob3JpemVkJyk7XG4gIH1cbn07XG4iXX0=