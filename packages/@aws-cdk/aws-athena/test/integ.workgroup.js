"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const lib_1 = require("../lib");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-athena-workgroup-tags');
new lib_1.CfnWorkGroup(stack, 'AthenaWorkgroup', {
    name: 'HelloWorld',
    description: 'A WorkGroup',
    recursiveDeleteOption: true,
    state: 'ENABLED',
    tags: [
        {
            key: 'key1',
            value: 'value1',
        },
        {
            key: 'key2',
            value: 'value2',
        },
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcud29ya2dyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcud29ya2dyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXFDO0FBQ3JDLGdDQUFzQztBQUV0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUMxQixNQUFNLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLCtCQUErQixDQUFDLENBQUM7QUFFbEUsSUFBSSxrQkFBWSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsRUFBRTtJQUN6QyxJQUFJLEVBQUUsWUFBWTtJQUNsQixXQUFXLEVBQUUsYUFBYTtJQUMxQixxQkFBcUIsRUFBRSxJQUFJO0lBQzNCLEtBQUssRUFBRSxTQUFTO0lBQ2hCLElBQUksRUFBRTtRQUNKO1lBQ0UsR0FBRyxFQUFFLE1BQU07WUFDWCxLQUFLLEVBQUUsUUFBUTtTQUNoQjtRQUNEO1lBQ0UsR0FBRyxFQUFFLE1BQU07WUFDWCxLQUFLLEVBQUUsUUFBUTtTQUNoQjtLQUNGO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ2ZuV29ya0dyb3VwIH0gZnJvbSAnLi4vbGliJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtY2RrLWF0aGVuYS13b3JrZ3JvdXAtdGFncycpO1xuXG5uZXcgQ2ZuV29ya0dyb3VwKHN0YWNrLCAnQXRoZW5hV29ya2dyb3VwJywge1xuICBuYW1lOiAnSGVsbG9Xb3JsZCcsXG4gIGRlc2NyaXB0aW9uOiAnQSBXb3JrR3JvdXAnLFxuICByZWN1cnNpdmVEZWxldGVPcHRpb246IHRydWUsXG4gIHN0YXRlOiAnRU5BQkxFRCcsXG4gIHRhZ3M6IFtcbiAgICB7XG4gICAgICBrZXk6ICdrZXkxJyxcbiAgICAgIHZhbHVlOiAndmFsdWUxJyxcbiAgICB9LFxuICAgIHtcbiAgICAgIGtleTogJ2tleTInLFxuICAgICAgdmFsdWU6ICd2YWx1ZTInLFxuICAgIH0sXG4gIF0sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=