"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const aws_kms_1 = require("aws-cdk-lib/aws-kms");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_sns_1 = require("aws-cdk-lib/aws-sns");
class SNSInteg extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const key = new aws_kms_1.Key(this, 'CustomKey');
        new aws_sns_1.Topic(this, 'MyTopic', {
            topicName: 'fooTopic',
            displayName: 'fooDisplayName',
            masterKey: key,
        });
    }
}
const app = new aws_cdk_lib_1.App();
new SNSInteg(app, 'SNSInteg');
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuc25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW50ZWcuc25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsaURBQTBDO0FBQzFDLDZDQUFxRDtBQUNyRCxpREFBNEM7QUFFNUMsTUFBTSxRQUFTLFNBQVEsbUJBQUs7SUFDMUIsWUFBWSxLQUFVLEVBQUUsRUFBVSxFQUFFLEtBQWtCO1FBQ3BELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sR0FBRyxHQUFHLElBQUksYUFBRyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztRQUV2QyxJQUFJLGVBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFO1lBQ3pCLFNBQVMsRUFBRSxVQUFVO1lBQ3JCLFdBQVcsRUFBRSxnQkFBZ0I7WUFDN0IsU0FBUyxFQUFFLEdBQUc7U0FDZixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLEVBQUUsQ0FBQztBQUV0QixJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFFOUIsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgS2V5IH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWttcyc7XG5pbXBvcnQgeyBBcHAsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgVG9waWMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zJztcblxuY2xhc3MgU05TSW50ZWcgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBBcHAsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3Qga2V5ID0gbmV3IEtleSh0aGlzLCAnQ3VzdG9tS2V5Jyk7XG5cbiAgICBuZXcgVG9waWModGhpcywgJ015VG9waWMnLCB7XG4gICAgICB0b3BpY05hbWU6ICdmb29Ub3BpYycsXG4gICAgICBkaXNwbGF5TmFtZTogJ2Zvb0Rpc3BsYXlOYW1lJyxcbiAgICAgIG1hc3RlcktleToga2V5LFxuICAgIH0pO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBBcHAoKTtcblxubmV3IFNOU0ludGVnKGFwcCwgJ1NOU0ludGVnJyk7XG5cbmFwcC5zeW50aCgpO1xuIl19