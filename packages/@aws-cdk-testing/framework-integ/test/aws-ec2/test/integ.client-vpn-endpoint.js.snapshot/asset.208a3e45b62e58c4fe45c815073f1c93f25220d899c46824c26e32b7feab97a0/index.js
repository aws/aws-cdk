"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const fs = require("fs");
const client_acm_1 = require("@aws-sdk/client-acm"); // eslint-disable-line import/no-extraneous-dependencies
const acm = new client_acm_1.ACM();
async function handler(event) {
    switch (event.RequestType) {
        case 'Create':
            let serverImport;
            if (!event.ResourceProperties.ServerCertificateArn) {
                serverImport = await acm.importCertificate({
                    Certificate: fs.readFileSync('./server.crt'),
                    PrivateKey: fs.readFileSync('./server.key'),
                    CertificateChain: fs.readFileSync('./ca.crt'),
                });
            }
            let clientImport;
            if (!event.ResourceProperties.ClientCertificateArn) {
                clientImport = await acm.importCertificate({
                    Certificate: fs.readFileSync('./client1.domain.tld.crt'),
                    PrivateKey: fs.readFileSync('./client1.domain.tld.key'),
                    CertificateChain: fs.readFileSync('./ca.crt'),
                });
            }
            return {
                Data: {
                    ServerCertificateArn: serverImport?.CertificateArn,
                    ClientCertificateArn: clientImport?.CertificateArn,
                },
            };
        case 'Update':
            return;
        case 'Delete':
            if (event.ResourceProperties.ServerCertificateArn) {
                await acm.deleteCertificate({
                    CertificateArn: event.ResourceProperties.ServerCertificateArn,
                });
            }
            if (event.ResourceProperties.ClientCertificateArn) {
                await acm.deleteCertificate({
                    CertificateArn: event.ResourceProperties.ClientCertificateArn,
                });
            }
            return;
    }
}
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsb0RBQTBDLENBQUMsd0RBQXdEO0FBRW5HLE1BQU0sR0FBRyxHQUFHLElBQUksZ0JBQUcsRUFBRSxDQUFDO0FBRWYsS0FBSyxVQUFVLE9BQU8sQ0FBQyxLQUFrRDtJQUM5RSxRQUFRLEtBQUssQ0FBQyxXQUFXLEVBQUU7UUFDekIsS0FBSyxRQUFRO1lBQ1gsSUFBSSxZQUFZLENBQUM7WUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsRUFBRTtnQkFDbEQsWUFBWSxHQUFHLE1BQU0sR0FBRyxDQUFDLGlCQUFpQixDQUFDO29CQUN6QyxXQUFXLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUM7b0JBQzVDLFVBQVUsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQztvQkFDM0MsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7aUJBQzlDLENBQUMsQ0FBQzthQUNKO1lBRUQsSUFBSSxZQUFZLENBQUM7WUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsRUFBRTtnQkFDbEQsWUFBWSxHQUFHLE1BQU0sR0FBRyxDQUFDLGlCQUFpQixDQUFDO29CQUN6QyxXQUFXLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztvQkFDeEQsVUFBVSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsMEJBQTBCLENBQUM7b0JBQ3ZELGdCQUFnQixFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO2lCQUM5QyxDQUFDLENBQUM7YUFDSjtZQUVELE9BQU87Z0JBQ0wsSUFBSSxFQUFFO29CQUNKLG9CQUFvQixFQUFFLFlBQVksRUFBRSxjQUFjO29CQUNsRCxvQkFBb0IsRUFBRSxZQUFZLEVBQUUsY0FBYztpQkFDbkQ7YUFDRixDQUFDO1FBQ0osS0FBSyxRQUFRO1lBQ1gsT0FBTztRQUNULEtBQUssUUFBUTtZQUNYLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixFQUFFO2dCQUNqRCxNQUFNLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQztvQkFDMUIsY0FBYyxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0I7aUJBQzlELENBQUMsQ0FBQzthQUNKO1lBQ0QsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEVBQUU7Z0JBQ2pELE1BQU0sR0FBRyxDQUFDLGlCQUFpQixDQUFDO29CQUMxQixjQUFjLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQjtpQkFDOUQsQ0FBQyxDQUFDO2FBQ0o7WUFDRCxPQUFPO0tBQ1Y7QUFDSCxDQUFDO0FBMUNELDBCQTBDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCB7IEFDTSB9IGZyb20gJ0Bhd3Mtc2RrL2NsaWVudC1hY20nOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuXG5jb25zdCBhY20gPSBuZXcgQUNNKCk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBoYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KSB7XG4gIHN3aXRjaCAoZXZlbnQuUmVxdWVzdFR5cGUpIHtcbiAgICBjYXNlICdDcmVhdGUnOlxuICAgICAgbGV0IHNlcnZlckltcG9ydDtcbiAgICAgIGlmICghZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlNlcnZlckNlcnRpZmljYXRlQXJuKSB7XG4gICAgICAgIHNlcnZlckltcG9ydCA9IGF3YWl0IGFjbS5pbXBvcnRDZXJ0aWZpY2F0ZSh7XG4gICAgICAgICAgQ2VydGlmaWNhdGU6IGZzLnJlYWRGaWxlU3luYygnLi9zZXJ2ZXIuY3J0JyksXG4gICAgICAgICAgUHJpdmF0ZUtleTogZnMucmVhZEZpbGVTeW5jKCcuL3NlcnZlci5rZXknKSxcbiAgICAgICAgICBDZXJ0aWZpY2F0ZUNoYWluOiBmcy5yZWFkRmlsZVN5bmMoJy4vY2EuY3J0JyksXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBsZXQgY2xpZW50SW1wb3J0O1xuICAgICAgaWYgKCFldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ2xpZW50Q2VydGlmaWNhdGVBcm4pIHtcbiAgICAgICAgY2xpZW50SW1wb3J0ID0gYXdhaXQgYWNtLmltcG9ydENlcnRpZmljYXRlKHtcbiAgICAgICAgICBDZXJ0aWZpY2F0ZTogZnMucmVhZEZpbGVTeW5jKCcuL2NsaWVudDEuZG9tYWluLnRsZC5jcnQnKSxcbiAgICAgICAgICBQcml2YXRlS2V5OiBmcy5yZWFkRmlsZVN5bmMoJy4vY2xpZW50MS5kb21haW4udGxkLmtleScpLFxuICAgICAgICAgIENlcnRpZmljYXRlQ2hhaW46IGZzLnJlYWRGaWxlU3luYygnLi9jYS5jcnQnKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIERhdGE6IHtcbiAgICAgICAgICBTZXJ2ZXJDZXJ0aWZpY2F0ZUFybjogc2VydmVySW1wb3J0Py5DZXJ0aWZpY2F0ZUFybixcbiAgICAgICAgICBDbGllbnRDZXJ0aWZpY2F0ZUFybjogY2xpZW50SW1wb3J0Py5DZXJ0aWZpY2F0ZUFybixcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgIHJldHVybjtcbiAgICBjYXNlICdEZWxldGUnOlxuICAgICAgaWYgKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5TZXJ2ZXJDZXJ0aWZpY2F0ZUFybikge1xuICAgICAgICBhd2FpdCBhY20uZGVsZXRlQ2VydGlmaWNhdGUoe1xuICAgICAgICAgIENlcnRpZmljYXRlQXJuOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuU2VydmVyQ2VydGlmaWNhdGVBcm4sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5DbGllbnRDZXJ0aWZpY2F0ZUFybikge1xuICAgICAgICBhd2FpdCBhY20uZGVsZXRlQ2VydGlmaWNhdGUoe1xuICAgICAgICAgIENlcnRpZmljYXRlQXJuOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ2xpZW50Q2VydGlmaWNhdGVBcm4sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuO1xuICB9XG59XG4iXX0=