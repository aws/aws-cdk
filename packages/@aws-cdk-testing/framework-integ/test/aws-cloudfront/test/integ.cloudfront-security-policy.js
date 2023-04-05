"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const cloudfront = require("aws-cdk-lib/aws-cloudfront");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-cloudfront-custom');
new cloudfront.CloudFrontWebDistribution(stack, 'AnAmazingWebsiteProbably', {
    originConfigs: [
        {
            originHeaders: {
                'X-Custom-Header': 'somevalue',
            },
            customOriginSource: {
                domainName: 'brelandm.a2z.com',
            },
            behaviors: [
                {
                    isDefaultBehavior: true,
                },
            ],
        },
    ],
    aliasConfiguration: {
        acmCertRef: 'arn:aws:acm:us-east-1:1111111:certificate/11-3336f1-44483d-adc7-9cd375c5169d',
        names: ['test.test.com'],
        sslMethod: cloudfront.SSLMethod.SNI,
        securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1,
    },
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWRmcm9udC1zZWN1cml0eS1wb2xpY3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5jbG91ZGZyb250LXNlY3VyaXR5LXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyx5REFBeUQ7QUFFekQsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO0FBRTlELElBQUksVUFBVSxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSwwQkFBMEIsRUFBRTtJQUMxRSxhQUFhLEVBQUU7UUFDYjtZQUNFLGFBQWEsRUFBRTtnQkFDYixpQkFBaUIsRUFBRSxXQUFXO2FBQy9CO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ2xCLFVBQVUsRUFBRSxrQkFBa0I7YUFDL0I7WUFDRCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsaUJBQWlCLEVBQUUsSUFBSTtpQkFDeEI7YUFDRjtTQUNGO0tBQ0Y7SUFDRCxrQkFBa0IsRUFBRTtRQUNsQixVQUFVLEVBQUUsOEVBQThFO1FBQzFGLEtBQUssRUFBRSxDQUFDLGVBQWUsQ0FBQztRQUN4QixTQUFTLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHO1FBQ25DLGNBQWMsRUFBRSxVQUFVLENBQUMsc0JBQXNCLENBQUMsTUFBTTtLQUN6RDtDQUNGLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJ2F3cy1jZGstbGliL2F3cy1jbG91ZGZyb250JztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY2xvdWRmcm9udC1jdXN0b20nKTtcblxubmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgb3JpZ2luQ29uZmlnczogW1xuICAgIHtcbiAgICAgIG9yaWdpbkhlYWRlcnM6IHtcbiAgICAgICAgJ1gtQ3VzdG9tLUhlYWRlcic6ICdzb21ldmFsdWUnLFxuICAgICAgfSxcbiAgICAgIGN1c3RvbU9yaWdpblNvdXJjZToge1xuICAgICAgICBkb21haW5OYW1lOiAnYnJlbGFuZG0uYTJ6LmNvbScsXG4gICAgICB9LFxuICAgICAgYmVoYXZpb3JzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbiAgYWxpYXNDb25maWd1cmF0aW9uOiB7XG4gICAgYWNtQ2VydFJlZjogJ2Fybjphd3M6YWNtOnVzLWVhc3QtMToxMTExMTExOmNlcnRpZmljYXRlLzExLTMzMzZmMS00NDQ4M2QtYWRjNy05Y2QzNzVjNTE2OWQnLFxuICAgIG5hbWVzOiBbJ3Rlc3QudGVzdC5jb20nXSxcbiAgICBzc2xNZXRob2Q6IGNsb3VkZnJvbnQuU1NMTWV0aG9kLlNOSSxcbiAgICBzZWN1cml0eVBvbGljeTogY2xvdWRmcm9udC5TZWN1cml0eVBvbGljeVByb3RvY29sLlRMU19WMSxcbiAgfSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==