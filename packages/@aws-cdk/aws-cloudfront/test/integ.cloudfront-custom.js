"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const cloudfront = require("../lib");
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
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWRmcm9udC1jdXN0b20uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5jbG91ZGZyb250LWN1c3RvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFDQUFxQztBQUNyQyxxQ0FBcUM7QUFFckMsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO0FBRTlELElBQUksVUFBVSxDQUFDLHlCQUF5QixDQUFDLEtBQUssRUFBRSwwQkFBMEIsRUFBRTtJQUMxRSxhQUFhLEVBQUU7UUFDYjtZQUNFLGFBQWEsRUFBRTtnQkFDYixpQkFBaUIsRUFBRSxXQUFXO2FBQy9CO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ2xCLFVBQVUsRUFBRSxrQkFBa0I7YUFDL0I7WUFDRCxTQUFTLEVBQUU7Z0JBQ1Q7b0JBQ0UsaUJBQWlCLEVBQUUsSUFBSTtpQkFDeEI7YUFDRjtTQUNGO0tBQ0Y7Q0FDRixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGNsb3VkZnJvbnQgZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuY29uc3Qgc3RhY2sgPSBuZXcgY2RrLlN0YWNrKGFwcCwgJ2F3cy1jZGstY2xvdWRmcm9udC1jdXN0b20nKTtcblxubmV3IGNsb3VkZnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihzdGFjaywgJ0FuQW1hemluZ1dlYnNpdGVQcm9iYWJseScsIHtcbiAgb3JpZ2luQ29uZmlnczogW1xuICAgIHtcbiAgICAgIG9yaWdpbkhlYWRlcnM6IHtcbiAgICAgICAgJ1gtQ3VzdG9tLUhlYWRlcic6ICdzb21ldmFsdWUnLFxuICAgICAgfSxcbiAgICAgIGN1c3RvbU9yaWdpblNvdXJjZToge1xuICAgICAgICBkb21haW5OYW1lOiAnYnJlbGFuZG0uYTJ6LmNvbScsXG4gICAgICB9LFxuICAgICAgYmVoYXZpb3JzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgfSxcbiAgXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==