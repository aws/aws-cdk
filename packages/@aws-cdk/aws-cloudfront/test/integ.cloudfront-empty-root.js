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
    defaultRootObject: '',
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuY2xvdWRmcm9udC1lbXB0eS1yb290LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuY2xvdWRmcm9udC1lbXB0eS1yb290LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUNBQXFDO0FBQ3JDLHFDQUFxQztBQUVyQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUUxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLENBQUM7QUFFOUQsSUFBSSxVQUFVLENBQUMseUJBQXlCLENBQUMsS0FBSyxFQUFFLDBCQUEwQixFQUFFO0lBQzFFLGFBQWEsRUFBRTtRQUNiO1lBQ0UsYUFBYSxFQUFFO2dCQUNiLGlCQUFpQixFQUFFLFdBQVc7YUFDL0I7WUFDRCxrQkFBa0IsRUFBRTtnQkFDbEIsVUFBVSxFQUFFLGtCQUFrQjthQUMvQjtZQUNELFNBQVMsRUFBRTtnQkFDVDtvQkFDRSxpQkFBaUIsRUFBRSxJQUFJO2lCQUN4QjthQUNGO1NBQ0Y7S0FDRjtJQUNELGlCQUFpQixFQUFFLEVBQUU7Q0FDdEIsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjbG91ZGZyb250IGZyb20gJy4uL2xpYic7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWNsb3VkZnJvbnQtY3VzdG9tJyk7XG5cbm5ldyBjbG91ZGZyb250LkNsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24oc3RhY2ssICdBbkFtYXppbmdXZWJzaXRlUHJvYmFibHknLCB7XG4gIG9yaWdpbkNvbmZpZ3M6IFtcbiAgICB7XG4gICAgICBvcmlnaW5IZWFkZXJzOiB7XG4gICAgICAgICdYLUN1c3RvbS1IZWFkZXInOiAnc29tZXZhbHVlJyxcbiAgICAgIH0sXG4gICAgICBjdXN0b21PcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgZG9tYWluTmFtZTogJ2JyZWxhbmRtLmEyei5jb20nLFxuICAgICAgfSxcbiAgICAgIGJlaGF2aW9yczogW1xuICAgICAgICB7XG4gICAgICAgICAgaXNEZWZhdWx0QmVoYXZpb3I6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gIF0sXG4gIGRlZmF1bHRSb290T2JqZWN0OiAnJyxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==