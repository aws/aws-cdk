"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("@aws-cdk/core");
const integ_tests_1 = require("@aws-cdk/integ-tests");
const ec2 = require("../lib/index");
const app = new cdk.App();
class TestStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        new ec2.PrefixList(this, 'prefix-list', {
            entries: [
                { cidr: '10.0.0.1/32' },
                { cidr: '10.0.0.2/32', description: 'sample1' },
            ],
        });
    }
}
new integ_tests_1.IntegTest(app, 'prefix-list', {
    testCases: [
        new TestStack(app, 'PrefixListTestStack', {}),
    ],
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucHJlZml4LWxpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5wcmVmaXgtbGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHFDQUFxQztBQUNyQyxzREFBaUQ7QUFDakQsb0NBQW9DO0FBRXBDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sU0FBVSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQy9CLFlBQVksS0FBYyxFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUM1RCxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUN0QyxPQUFPLEVBQUU7Z0JBQ1AsRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFO2dCQUN2QixFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsV0FBVyxFQUFFLFNBQVMsRUFBRTthQUNoRDtTQUNGLENBQUMsQ0FBQztLQUNKO0NBQ0Y7QUFFRCxJQUFJLHVCQUFTLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRTtJQUNoQyxTQUFTLEVBQUU7UUFDVCxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUUscUJBQXFCLEVBQUUsRUFBRSxDQUFDO0tBQzlDO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSW50ZWdUZXN0IH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJy4uL2xpYi9pbmRleCc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNsYXNzIFRlc3RTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBuZXcgZWMyLlByZWZpeExpc3QodGhpcywgJ3ByZWZpeC1saXN0Jywge1xuICAgICAgZW50cmllczogW1xuICAgICAgICB7IGNpZHI6ICcxMC4wLjAuMS8zMicgfSxcbiAgICAgICAgeyBjaWRyOiAnMTAuMC4wLjIvMzInLCBkZXNjcmlwdGlvbjogJ3NhbXBsZTEnIH0sXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG59XG5cbm5ldyBJbnRlZ1Rlc3QoYXBwLCAncHJlZml4LWxpc3QnLCB7XG4gIHRlc3RDYXNlczogW1xuICAgIG5ldyBUZXN0U3RhY2soYXBwLCAnUHJlZml4TGlzdFRlc3RTdGFjaycsIHt9KSxcbiAgXSxcbn0pO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==