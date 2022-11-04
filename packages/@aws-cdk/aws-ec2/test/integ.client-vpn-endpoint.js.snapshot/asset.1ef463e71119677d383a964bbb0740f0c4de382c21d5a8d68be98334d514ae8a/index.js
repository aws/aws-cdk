"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const fs = require("fs");
const aws_sdk_1 = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
const acm = new aws_sdk_1.ACM();
async function handler(event) {
    switch (event.RequestType) {
        case 'Create':
            let serverImport;
            if (!event.ResourceProperties.ServerCertificateArn) {
                serverImport = await acm.importCertificate({
                    Certificate: fs.readFileSync('./server.crt'),
                    PrivateKey: fs.readFileSync('./server.key'),
                    CertificateChain: fs.readFileSync('./ca.crt'),
                }).promise();
            }
            let clientImport;
            if (!event.ResourceProperties.ClientCertificateArn) {
                clientImport = await acm.importCertificate({
                    Certificate: fs.readFileSync('./client1.domain.tld.crt'),
                    PrivateKey: fs.readFileSync('./client1.domain.tld.key'),
                    CertificateChain: fs.readFileSync('./ca.crt'),
                }).promise();
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
                }).promise();
            }
            if (event.ResourceProperties.ClientCertificateArn) {
                await acm.deleteCertificate({
                    CertificateArn: event.ResourceProperties.ClientCertificateArn,
                }).promise();
            }
            return;
    }
}
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIscUNBQThCLENBQUMsd0RBQXdEO0FBRXZGLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxFQUFFLENBQUM7QUFFZixLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBQzlFLFFBQVEsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUN6QixLQUFLLFFBQVE7WUFDWCxJQUFJLFlBQVksQ0FBQztZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixFQUFFO2dCQUNsRCxZQUFZLEdBQUcsTUFBTSxHQUFHLENBQUMsaUJBQWlCLENBQUM7b0JBQ3pDLFdBQVcsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLGNBQWMsQ0FBQztvQkFDNUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDO29CQUMzQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztpQkFDOUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2Q7WUFFRCxJQUFJLFlBQVksQ0FBQztZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixFQUFFO2dCQUNsRCxZQUFZLEdBQUcsTUFBTSxHQUFHLENBQUMsaUJBQWlCLENBQUM7b0JBQ3pDLFdBQVcsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDO29CQUN4RCxVQUFVLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztvQkFDdkQsZ0JBQWdCLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUM7aUJBQzlDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUNkO1lBR0QsT0FBTztnQkFDTCxJQUFJLEVBQUU7b0JBQ0osb0JBQW9CLEVBQUUsWUFBWSxFQUFFLGNBQWM7b0JBQ2xELG9CQUFvQixFQUFFLFlBQVksRUFBRSxjQUFjO2lCQUNuRDthQUNGLENBQUM7UUFDSixLQUFLLFFBQVE7WUFDWCxPQUFPO1FBQ1QsS0FBSyxRQUFRO1lBQ1gsSUFBSSxLQUFLLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CLEVBQUU7Z0JBQ2pELE1BQU0sR0FBRyxDQUFDLGlCQUFpQixDQUFDO29CQUMxQixjQUFjLEVBQUUsS0FBSyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQjtpQkFDOUQsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQ2Q7WUFDRCxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxvQkFBb0IsRUFBRTtnQkFDakQsTUFBTSxHQUFHLENBQUMsaUJBQWlCLENBQUM7b0JBQzFCLGNBQWMsRUFBRSxLQUFLLENBQUMsa0JBQWtCLENBQUMsb0JBQW9CO2lCQUM5RCxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7YUFDZDtZQUNELE9BQU87S0FDVjtBQUNILENBQUM7QUEzQ0QsMEJBMkNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgQUNNIH0gZnJvbSAnYXdzLXNkayc7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzXG5cbmNvbnN0IGFjbSA9IG5ldyBBQ00oKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgc3dpdGNoIChldmVudC5SZXF1ZXN0VHlwZSkge1xuICAgIGNhc2UgJ0NyZWF0ZSc6XG4gICAgICBsZXQgc2VydmVySW1wb3J0O1xuICAgICAgaWYgKCFldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuU2VydmVyQ2VydGlmaWNhdGVBcm4pIHtcbiAgICAgICAgc2VydmVySW1wb3J0ID0gYXdhaXQgYWNtLmltcG9ydENlcnRpZmljYXRlKHtcbiAgICAgICAgICBDZXJ0aWZpY2F0ZTogZnMucmVhZEZpbGVTeW5jKCcuL3NlcnZlci5jcnQnKSxcbiAgICAgICAgICBQcml2YXRlS2V5OiBmcy5yZWFkRmlsZVN5bmMoJy4vc2VydmVyLmtleScpLFxuICAgICAgICAgIENlcnRpZmljYXRlQ2hhaW46IGZzLnJlYWRGaWxlU3luYygnLi9jYS5jcnQnKSxcbiAgICAgICAgfSkucHJvbWlzZSgpO1xuICAgICAgfVxuXG4gICAgICBsZXQgY2xpZW50SW1wb3J0O1xuICAgICAgaWYgKCFldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ2xpZW50Q2VydGlmaWNhdGVBcm4pIHtcbiAgICAgICAgY2xpZW50SW1wb3J0ID0gYXdhaXQgYWNtLmltcG9ydENlcnRpZmljYXRlKHtcbiAgICAgICAgICBDZXJ0aWZpY2F0ZTogZnMucmVhZEZpbGVTeW5jKCcuL2NsaWVudDEuZG9tYWluLnRsZC5jcnQnKSxcbiAgICAgICAgICBQcml2YXRlS2V5OiBmcy5yZWFkRmlsZVN5bmMoJy4vY2xpZW50MS5kb21haW4udGxkLmtleScpLFxuICAgICAgICAgIENlcnRpZmljYXRlQ2hhaW46IGZzLnJlYWRGaWxlU3luYygnLi9jYS5jcnQnKSxcbiAgICAgICAgfSkucHJvbWlzZSgpO1xuICAgICAgfVxuXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIERhdGE6IHtcbiAgICAgICAgICBTZXJ2ZXJDZXJ0aWZpY2F0ZUFybjogc2VydmVySW1wb3J0Py5DZXJ0aWZpY2F0ZUFybixcbiAgICAgICAgICBDbGllbnRDZXJ0aWZpY2F0ZUFybjogY2xpZW50SW1wb3J0Py5DZXJ0aWZpY2F0ZUFybixcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgY2FzZSAnVXBkYXRlJzpcbiAgICAgIHJldHVybjtcbiAgICBjYXNlICdEZWxldGUnOlxuICAgICAgaWYgKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5TZXJ2ZXJDZXJ0aWZpY2F0ZUFybikge1xuICAgICAgICBhd2FpdCBhY20uZGVsZXRlQ2VydGlmaWNhdGUoe1xuICAgICAgICAgIENlcnRpZmljYXRlQXJuOiBldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuU2VydmVyQ2VydGlmaWNhdGVBcm4sXG4gICAgICAgIH0pLnByb21pc2UoKTtcbiAgICAgIH1cbiAgICAgIGlmIChldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuQ2xpZW50Q2VydGlmaWNhdGVBcm4pIHtcbiAgICAgICAgYXdhaXQgYWNtLmRlbGV0ZUNlcnRpZmljYXRlKHtcbiAgICAgICAgICBDZXJ0aWZpY2F0ZUFybjogZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLkNsaWVudENlcnRpZmljYXRlQXJuLFxuICAgICAgICB9KS5wcm9taXNlKCk7XG4gICAgICB9XG4gICAgICByZXR1cm47XG4gIH1cbn1cbiJdfQ==